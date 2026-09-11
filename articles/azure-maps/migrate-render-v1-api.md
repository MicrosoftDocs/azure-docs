---
title: Migrate Azure Maps Render 1.0 APIs
titleSuffix: Microsoft Azure Maps
description: Learn how to migrate Azure Maps Render service version 1.0 requests to version 2024-04-01.
author: faterceros
ms.author: aterceros
ms.date: 09/10/2026
ms.topic: upgrade-and-migration-article
ms.service: azure-maps
ms.subservice: rest-api
---

# Migrate Azure Maps Render 1.0 APIs

Azure Maps Render API version 2024-04-01 supersedes Render API version 1.0. This article explains how to migrate Render 1.0 requests to version 2024-04-01.

> [!IMPORTANT]
> Azure Maps Render version 1.0 retires on September 17, 2026. To avoid service disruptions, migrate all Render 1.0 requests and client libraries to a supported version by that date. For more information, see the [Azure Maps Render v1 retirement announcement].

## API equivalency mapping

| Render 1.0 operation | Render 2024-04-01 migration option |
| -------------------- | ---------------------------------- |
| [Get Copyright Caption v1] | [Get Copyright Caption] |
| [Get Copyright For Tile v1] | [Get Copyright For Tile] |
| [Get Copyright For World v1] | [Get Copyright For World] |
| [Get Copyright From Bounding Box v1] | [Get Copyright From Bounding Box] |
| [Get Map Image] | [Get Map Static Image] |
| [Get Map Imagery Tile] | [Get Map Tile] with `tilesetId=microsoft.imagery` |
| [Get Map State Tile v1] | [Get Map State Tile] |
| [Get Map Tile v1] | [Get Map Tile] |

Render 2024-04-01 also provides these operations:

- [Get Map Attribution] returns the attribution text required when you display map tiles.
- [Get Map Tileset] returns metadata for a tileset.

## Notable differences

| Area | Render 1.0 | Render 2024-04-01 |
| ---- | ---------- | ----------------- |
| Map tile path | `/map/tile/{format}` | `/map/tile` |
| Map tile selection | `layer` and `style` | `tilesetId` |
| Map tile format | `png` or `pbf` in the path | Determined by `tilesetId` |
| Static image path | `/map/static/png` | `/map/static` |
| Static image style | `layer` and `style` | `tilesetId` and optional `trafficLayer` |
| Static image format | `png` in the path | `Accept` header with `image/png` or `image/jpeg`; PNG is the default |
| Static image dimensions | Width and height from 1 through 8,192 pixels | Width from 80 through 2,000 pixels and height from 80 through 1,500 pixels |
| Imagery tiles | `/map/imagery/png` with `style=satellite` | `/map/tile` with `tilesetId=microsoft.imagery` |
| Weather tiles | Not supported by Get Map Tile | Radar and infrared tiles are supported, including the optional `timeStamp` parameter |
| Service endpoint | `https://atlas.microsoft.com` | Use `https://atlas.microsoft.com` for the Azure public cloud or the appropriate endpoint for an Azure geography or sovereign cloud |

The allowed minimum and maximum bounding-box ranges for static images vary by zoom level. Validate existing `bbox`, `height`, and `width` values against the [Get Map Static Image] requirements before moving a workload to production.

## Map tile parameter mapping

In Render 1.0, the path format and the `layer` and `style` parameters select the tile. In Render 2024-04-01, use `tilesetId` instead.

| Render 1.0 format | Render 1.0 layer | Render 1.0 style | Render 2024-04-01 `tilesetId` |
| ----------------- | ---------------- | ---------------- | --------------------------------- |
| `pbf` | `basic` | `main` | `microsoft.base` |
| `pbf` | `labels` | `main` | `microsoft.base.labels` |
| `pbf` | `hybrid` | `main` | `microsoft.base.hybrid` |
| `png` | `basic` | `main` | `microsoft.base.road` |
| `png` | `basic` | `dark` | `microsoft.base.darkgrey` |
| `png` | `labels` | `main` | `microsoft.base.labels.road` |
| `png` | `labels` | `dark` | `microsoft.base.labels.darkgrey` |
| `png` | `hybrid` | `main` | `microsoft.base.hybrid.road` |
| `png` | `hybrid` | `dark` | `microsoft.base.hybrid.darkgrey` |
| `png` | `terra` | `shaded_relief` | `microsoft.terra.main` |

For the formats, zoom ranges, and complete list of available values, see [TilesetID].

## Migrate map tile requests

The following Render 1.0 request returns a raster road tile:

```http
https://atlas.microsoft.com/map/tile/png?api-version=1.0&layer=basic&style=main&zoom=6&x=10&y=22&subscription-key={Your-Azure-Maps-Subscription-key}
```

Remove the format from the path, replace `layer` and `style` with the corresponding `tilesetId`, and update `api-version`:

```http
https://atlas.microsoft.com/map/tile?api-version=2024-04-01&tilesetId=microsoft.base.road&zoom=6&x=10&y=22&subscription-key={Your-Azure-Maps-Subscription-key}
```

The following example migrates a vector base tile:

```http
https://atlas.microsoft.com/map/tile/pbf?api-version=1.0&layer=basic&style=main&zoom=6&x=10&y=22&subscription-key={Your-Azure-Maps-Subscription-key}
```

Use the `microsoft.base` tileset for the current request:

```http
https://atlas.microsoft.com/map/tile?api-version=2024-04-01&tilesetId=microsoft.base&zoom=6&x=10&y=22&subscription-key={Your-Azure-Maps-Subscription-key}
```

### Display map attribution

When you display tiles returned by [Get Map Tile], call [Get Map Attribution] for the displayed tileset, zoom level, and bounding box. Display the returned attribution wherever the tiles are rendered, including in third-party map controls and custom rendering implementations.

```http
https://atlas.microsoft.com/map/attribution?api-version=2024-04-01&tilesetId=microsoft.base&zoom=6&bounds=-122.414162,47.57949,-122.247157,47.668372&subscription-key={Your-Azure-Maps-Subscription-key}
```

For implementation guidance, see [Show the correct copyright attribution].

## Migrate imagery tile requests

Render 1.0 uses a separate imagery path:

```http
https://atlas.microsoft.com/map/imagery/png?api-version=1.0&style=satellite&zoom=6&x=10&y=22&subscription-key={Your-Azure-Maps-Subscription-key}
```

In Render 2024-04-01, use [Get Map Tile] with the `microsoft.imagery` tileset:

```http
https://atlas.microsoft.com/map/tile?api-version=2024-04-01&tilesetId=microsoft.imagery&zoom=6&x=10&y=22&subscription-key={Your-Azure-Maps-Subscription-key}
```

## Migrate static image requests

The following Render 1.0 request returns a static PNG road map:

```http
https://atlas.microsoft.com/map/static/png?api-version=1.0&layer=basic&style=main&zoom=10&center=-122.177621,47.613079&subscription-key={Your-Azure-Maps-Subscription-key}
```

Remove the format from the path, replace `layer` and `style` with `tilesetId`, and update `api-version`:

```http
https://atlas.microsoft.com/map/static?api-version=2024-04-01&tilesetId=microsoft.base.road&zoom=10&center=-122.177621,47.613079&subscription-key={Your-Azure-Maps-Subscription-key}
```

PNG is returned by default. To request JPEG, set the HTTP `Accept` header to `image/jpeg`.

Before migration, check the requested image dimensions. Render 1.0 accepts `height` and `width` values from 1 through 8,192. Render 2024-04-01 accepts a height from 80 through 1,500 and a width from 80 through 2,000. Requests outside the current ranges must be resized or divided into multiple requests.

To overlay traffic flow, set `trafficLayer=microsoft.traffic.relative.main`. For more information about pins, paths, polygons, traffic, and imagery, see [Render custom data on a raster map].

## Migrate Render client libraries

Upgrade any Render client library that targets API version 1.0. The following package versions target Render 2024-04-01:

| Language | Render 1.0 package | Render 2024-04-01 package |
| -------- | ------------------ | -------------------------- |
| .NET | `Azure.Maps.Rendering` 1.x | `Azure.Maps.Rendering` 2.x |
| Python | `azure-maps-render` 1.x | `azure-maps-render` 2.x |
| Java | `com.azure:azure-maps-render` 1.x | `com.azure:azure-maps-render` 2.x |
| JavaScript/TypeScript | `@azure-rest/maps-render` 1.x | `@azure-rest/maps-render` 2.x |

The 2.x client libraries are prerelease packages. Review the language-specific package documentation and test the updated client before deploying it to production.

## Validate the migration

Before switching production traffic, verify that the migrated application:

- No longer sends Render requests with `api-version=1.0`.
- Doesn't use `/map/tile/png`, `/map/tile/pbf`, `/map/imagery/png`, or `/map/static/png` paths.
- Uses the expected `tilesetId` for every tile and static image request.
- Requests supported static-image dimensions and bounding boxes.
- Handles the response media type expected for each tileset.
- Displays the attribution returned by [Get Map Attribution] when rendering map tiles.
- Produces acceptable labels, points of interest, map styles, overlays, and imagery at all supported zoom levels.
- Handles maps and geometries near the antimeridian.
- Uses the correct endpoint for the required Azure geography or sovereign cloud.

## Related content

- [Azure Maps Render REST API]
- [Azure Maps Render v1 retirement announcement]
- [Azure Maps Render service coverage]
- [Supported built-in map styles]
- [Zoom levels and tile grid]

[Azure Maps Render REST API]: /rest/api/maps/render
[Azure Maps Render v1 retirement announcement]: https://azure.microsoft.com/updates/azure-maps-render-v1-apis-will-be-retired-on-17-september-2026/
[Azure Maps Render service coverage]: render-coverage.md
[Get Copyright Caption]: /rest/api/maps/render/get-copyright-caption
[Get Copyright Caption v1]: /rest/api/maps/render/get-copyright-caption?view=rest-maps-1.0
[Get Copyright For Tile]: /rest/api/maps/render/get-copyright-for-tile
[Get Copyright For Tile v1]: /rest/api/maps/render/get-copyright-for-tile?view=rest-maps-1.0
[Get Copyright For World]: /rest/api/maps/render/get-copyright-for-world
[Get Copyright For World v1]: /rest/api/maps/render/get-copyright-for-world?view=rest-maps-1.0
[Get Copyright From Bounding Box]: /rest/api/maps/render/get-copyright-from-bounding-box
[Get Copyright From Bounding Box v1]: /rest/api/maps/render/get-copyright-from-bounding-box?view=rest-maps-1.0
[Get Map Attribution]: /rest/api/maps/render/get-map-attribution
[Get Map Image]: /rest/api/maps/render/get-map-image?view=rest-maps-1.0
[Get Map Imagery Tile]: /rest/api/maps/render/get-map-imagery-tile?view=rest-maps-1.0
[Get Map State Tile]: /rest/api/maps/render/get-map-state-tile
[Get Map State Tile v1]: /rest/api/maps/render/get-map-state-tile?view=rest-maps-1.0
[Get Map Static Image]: /rest/api/maps/render/get-map-static-image
[Get Map Tile]: /rest/api/maps/render/get-map-tile
[Get Map Tile v1]: /rest/api/maps/render/get-map-tile?view=rest-maps-1.0
[Get Map Tileset]: /rest/api/maps/render/get-map-tileset
[Render custom data on a raster map]: how-to-render-custom-data.md
[Show the correct copyright attribution]: how-to-show-attribution.md
[Supported built-in map styles]: supported-map-styles.md
[TilesetID]: /rest/api/maps/render/get-map-tile#tilesetid
[Zoom levels and tile grid]: zoom-levels-and-tile-grid.md
