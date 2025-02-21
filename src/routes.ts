// Just drop copy this file into your app/routes.ts and happy coding!

import fs from 'node:fs'
import path from 'node:path'

import { type RouteConfig, type RouteConfigEntry, index, layout, route } from '@react-router/dev/routes'

type RouteDefinition =
  | {
      route: string
      filename: string
      layout: string | null
      isLayout?: never
      siblings?: never
    }
  | {
      filename: string
      isLayout: true
      siblings: RouteDefinition[]
    }

function transformSegment(routeName: string, basePath: string): string {
  let routePath = ''
  if (routeName === 'index' || routeName === 'page') {
    routePath = basePath
  } else if (routeName.startsWith('[...') && routeName.endsWith(']')) {
    // Catch-all or Splat route, @see https://reactrouter.com/start/framework/routing#splats
    // const param = routeName.slice(4, -1)
    routePath = path.join(basePath, '*')
  } else if (routeName.startsWith('[') && routeName.endsWith(']')) {
    // Dynamic segment route
    let param = routeName.slice(1, -1)
    if (param.startsWith('[') && routeName.endsWith(']')) {
      // Optional segment route
      param = param.slice(1, -1) + '?'
    }
    routePath = path.join(basePath, `:${param}`)
  } else {
    routePath = path.join(basePath, routeName)
  }

  // Clean up the route path
  routePath = routePath.replace(/\\/g, '/') // Convert Windows paths
  return routePath
}

function generateRoutes(
  dir: string = 'routes',
  basePath: string = '',
  parentLayoutFile: string | null = null,
): RouteDefinition[] {
  const routesDir = path.join('app', dir)
  const entries = fs.readdirSync(routesDir, { withFileTypes: true })
  const routes: RouteDefinition[] = []
  let layoutFile: string | null = parentLayoutFile

  // First pass: find layout file if it exists
  for (const entry of entries) {
    if (!entry.isDirectory() && entry.name.match(/^layout\.tsx?$/)) {
      layoutFile = path.join(dir, entry.name).replace(/\\/g, '/')
      break
    }
  }

  // Sort entries to ensure index files come first
  entries.sort((a, b) => {
    if (a.name.match(/^(index|page)\.tsx?$/)) return -1
    if (b.name.match(/^(index|page)\.tsx?$/)) return 1
    return a.name.localeCompare(b.name)
  })

  // Second pass: process all routes
  const processedRoutes: RouteDefinition[] = []
  for (const entry of entries) {
    // Skip files/folders starting with underscore and layout files (handled separately)
    if (entry.name.startsWith('_') || entry.name.match(/^layout\.tsx?$/)) {
      continue
    }

    const routeName = entry.name.replace(/\.tsx?$/, '') // Remove .tsx or .ts extension

    if (entry.isDirectory()) {
      // Skip if directory is a special route directory (starts with underscore)
      if (routeName.startsWith('_')) {
        continue
      }

      // Handle parentheses folders - they don't count as segments
      const isGrouping = /^\(.*\)$/.test(routeName)
      const newBasePath = isGrouping ? basePath : path.join(basePath, transformSegment(routeName, ''))

      const childRoutes = generateRoutes(path.join(dir, entry.name), newBasePath, layoutFile)
      processedRoutes.push(...childRoutes)
    } else {
      // Skip non-route files
      if (
        (!entry.name.endsWith('.tsx') && !entry.name.endsWith('.ts')) ||
        entry.name.startsWith('_') ||
        entry.name.endsWith('/layout.tsx') ||
        entry.name === 'layout.tsx'
      ) {
        continue
      }

      let routePath = transformSegment(routeName, basePath)
      let routeFilePath = path.join(dir, entry.name)

      // Clean up the route path
      routePath = routePath.replace(/\\/g, '/') // Convert Windows paths
      if (routePath.startsWith('/')) {
        routePath = routePath.slice(1)
      }

      processedRoutes.push({
        route: routePath,
        layout: layoutFile,
        filename: routeFilePath,
      })
    }
  }

  // If we found a layout file, create a layout route with all siblings
  if (layoutFile && layoutFile !== parentLayoutFile) {
    routes.push({
      filename: layoutFile,
      isLayout: true,
      siblings: processedRoutes,
    })
  } else {
    routes.push(...processedRoutes)
  }

  return routes
}

function convertToRouteConfig(routes: RouteDefinition[]): RouteConfigEntry[] {
  return routes.map((routeDef) => {
    if (routeDef.isLayout) {
      return layout(routeDef.filename, convertToRouteConfig(routeDef.siblings || []))
    }
    if (routeDef.route === '') {
      return index(routeDef.filename)
    }
    return route('/' + routeDef.route, routeDef.filename)
  })
}

function getRoutesTableData(routes: RouteDefinition[]): { route: string; filename: string; layout: string }[] {
  return routes.flatMap((r) => {
    if (r.isLayout) {
      return getRoutesTableData(r.siblings)
    }
    return [{ route: '/' + r.route, filename: r.filename, layout: r.layout ?? 'root.tsx' }]
  })
}

function debugRoutes(routes: RouteDefinition[]) {
  if (import.meta.env.DEV) {
    // console.log(JSON.stringify(generatedRoutes, null, 2))
    const tableData = getRoutesTableData(routes)
    console.log('\n🚀 Route List:')
    console.table(tableData)
  }
}

// Generate routes from filesystem
const generatedRoutes = generateRoutes()
debugRoutes(generatedRoutes)
export default convertToRouteConfig(generatedRoutes) satisfies RouteConfig
