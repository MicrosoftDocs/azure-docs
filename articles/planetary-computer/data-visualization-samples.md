---
title: Microsoft Planetary Computer Pro Data Visualization Gallery
description: Learn the step-by-step process to configure render settings for visualizing geospatial data using the Microsoft Planetary Computer Pro data explorer and Tiler API.
author: prasadko
ms.author: prasadkomma
ms.service: planetary-computer-pro
ms.topic: get-started
ms.date: 05/08/2025
ms.custom:
  - build-2025
---

# Microsoft Planetary Computer Pro Data Visualization Gallery

## Sentinel-2-l2a Collection Configuration

[Collection description to be added here]

![Screenshot of Sentinel-2-l2a data visualization](path/to/screenshot.png)

[Description of data source and link to where to get the data]

## Configuration details

# [STAC](#tab/stac)

## STAC Configuration

The STAC configuration defines the core metadata for this collection.

```json
{
  "id": "sentinel-2-l2a_Grindavik",
  "type": "Collection",
  "links": [
    {
      "rel": "items",
      "type": "application/geo+json",
      "href": "https://tc-demo.bxfqdqh5dagmbgez.uksouth.geocatalog.spatio.azure.com/stac/collections/sentinel-2-l2a_Grindavik/items"
    },
    {
      "rel": "parent",
      "type": "application/json",
      "href": "https://tc-demo.bxfqdqh5dagmbgez.uksouth.geocatalog.spatio.azure.com/stac/"
    },
    {
      "rel": "root",
      "type": "application/json",
      "href": "https://tc-demo.bxfqdqh5dagmbgez.uksouth.geocatalog.spatio.azure.com/stac/"
    },
    {
      "rel": "self",
      "type": "application/json",
      "href": "https://tc-demo.bxfqdqh5dagmbgez.uksouth.geocatalog.spatio.azure.com/stac/collections/sentinel-2-l2a_Grindavik"
    },
    {
      "rel": "license",
      "href": "https://scihub.copernicus.eu/twiki/pub/SciHubWebPortal/TermsConditions/Sentinel_Data_Terms_and_Conditions.pdf",
      "title": "Copernicus Sentinel data terms"
    },
    {
      "rel": "describedby",
      "href": "https://planetarycomputer.microsoft.com/dataset/sentinel-2-l2a",
      "type": "text/html",
      "title": "Human readable dataset overview and reference"
    }
  ],
  "title": "Sentinel-2-l2a",
  "assets": {
    "thumbnail": {
      "href": "https://ubpobrdatasa.blob.core.windows.net/sentinel-2-l2a-grindavik-64221e99/collection-assets/thumbnail/blob",
      "type": "image/png",
      "roles": [
        "thumbnail"
      ],
      "title": "sentinel-2-l2a_Grindavik thumbnail"
    }
  },
  "extent": {
    "spatial": {
      "bbox": [
        [
          -180,
          -90,
          180,
          90
        ]
      ]
    },
    "temporal": {
      "interval": [
        [
          "2015-06-27T10:25:31Z",
          null
        ]
      ]
    }
  },
  "license": "proprietary",
  "keywords": [
    "Sentinel",
    "Copernicus",
    "ESA",
    "Satellite",
    "Global",
    "Imagery",
    "Reflectance"
  ],
  "providers": [
    {
      "url": "https://sentinel.esa.int/web/sentinel/missions/sentinel-2",
      "name": "ESA",
      "roles": [
        "producer",
        "licensor"
      ]
    },
    {
      "url": "https://www.esri.com/",
      "name": "Esri",
      "roles": [
        "processor"
      ]
    },
    {
      "url": "https://planetarycomputer.microsoft.com",
      "name": "Microsoft",
      "roles": [
        "host",
        "processor"
      ]
    }
  ],
  "summaries": {
    "gsd": [
      10,
      20,
      60
    ],
    "eo:bands": [
      {
        "name": "AOT",
        "description": "aerosol optical thickness"
      },
      {
        "gsd": 60,
        "name": "B01",
        "common_name": "coastal",
        "description": "coastal aerosol",
        "center_wavelength": 0.443,
        "full_width_half_max": 0.027
      },
      {
        "gsd": 10,
        "name": "B02",
        "common_name": "blue",
        "description": "visible blue",
        "center_wavelength": 0.49,
        "full_width_half_max": 0.098
      },
      {
        "gsd": 10,
        "name": "B03",
        "common_name": "green",
        "description": "visible green",
        "center_wavelength": 0.56,
        "full_width_half_max": 0.045
      },
      {
        "gsd": 10,
        "name": "B04",
        "common_name": "red",
        "description": "visible red",
        "center_wavelength": 0.665,
        "full_width_half_max": 0.038
      },
      {
        "gsd": 20,
        "name": "B05",
        "common_name": "rededge",
        "description": "vegetation classification red edge",
        "center_wavelength": 0.704,
        "full_width_half_max": 0.019
      },
      {
        "gsd": 20,
        "name": "B06",
        "common_name": "rededge",
        "description": "vegetation classification red edge",
        "center_wavelength": 0.74,
        "full_width_half_max": 0.018
      },
      {
        "gsd": 20,
        "name": "B07",
        "common_name": "rededge",
        "description": "vegetation classification red edge",
        "center_wavelength": 0.783,
        "full_width_half_max": 0.028
      },
      {
        "gsd": 10,
        "name": "B08",
        "common_name": "nir",
        "description": "near infrared",
        "center_wavelength": 0.842,
        "full_width_half_max": 0.145
      },
      {
        "gsd": 20,
        "name": "B8A",
        "common_name": "rededge",
        "description": "vegetation classification red edge",
        "center_wavelength": 0.865,
        "full_width_half_max": 0.033
      },
      {
        "gsd": 60,
        "name": "B09",
        "description": "water vapor",
        "center_wavelength": 0.945,
        "full_width_half_max": 0.026
      },
      {
        "gsd": 20,
        "name": "B11",
        "common_name": "swir16",
        "description": "short-wave infrared, snow/ice/cloud classification",
        "center_wavelength": 1.61,
        "full_width_half_max": 0.143
      },
      {
        "gsd": 20,
        "name": "B12",
        "common_name": "swir22",
        "description": "short-wave infrared, snow/ice/cloud classification",
        "center_wavelength": 2.19,
        "full_width_half_max": 0.242
      }
    ],
    "platform": [
      "Sentinel-2A",
      "Sentinel-2B"
    ],
    "instruments": [
      "msi"
    ],
    "constellation": [
      "sentinel-2"
    ],
    "view:off_nadir": [
      0
    ]
  },
  "description": "The [Sentinel-2](https://sentinel.esa.int/web/sentinel/missions/sentinel-2) program provides global imagery in thirteen spectral bands at 10m-60m resolution and a revisit time of approximately five days.  This dataset represents the global Sentinel-2 archive, from 2016 to the present, processed to L2A (bottom-of-atmosphere) using [Sen2Cor](https://step.esa.int/main/snap-supported-plugins/sen2cor/) and converted to [cloud-optimized GeoTIFF](https://www.cogeo.org/) format.",
  "item_assets": {
    "AOT": {
      "gsd": 10,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Aerosol optical thickness (AOT)"
    },
    "B01": {
      "gsd": 60,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 1 - Coastal aerosol - 60m",
      "eo:bands": [
        {
          "name": "B01",
          "common_name": "coastal",
          "description": "Band 1 - Coastal aerosol",
          "center_wavelength": 0.443,
          "full_width_half_max": 0.027
        }
      ]
    },
    "B02": {
      "gsd": 10,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 2 - Blue - 10m",
      "eo:bands": [
        {
          "name": "B02",
          "common_name": "blue",
          "description": "Band 2 - Blue",
          "center_wavelength": 0.49,
          "full_width_half_max": 0.098
        }
      ]
    },
    "B03": {
      "gsd": 10,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 3 - Green - 10m",
      "eo:bands": [
        {
          "name": "B03",
          "common_name": "green",
          "description": "Band 3 - Green",
          "center_wavelength": 0.56,
          "full_width_half_max": 0.045
        }
      ]
    },
    "B04": {
      "gsd": 10,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 4 - Red - 10m",
      "eo:bands": [
        {
          "name": "B04",
          "common_name": "red",
          "description": "Band 4 - Red",
          "center_wavelength": 0.665,
          "full_width_half_max": 0.038
        }
      ]
    },
    "B05": {
      "gsd": 20,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 5 - Vegetation red edge 1 - 20m",
      "eo:bands": [
        {
          "name": "B05",
          "common_name": "rededge",
          "description": "Band 5 - Vegetation red edge 1",
          "center_wavelength": 0.704,
          "full_width_half_max": 0.019
        }
      ]
    },
    "B06": {
      "gsd": 20,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 6 - Vegetation red edge 2 - 20m",
      "eo:bands": [
        {
          "name": "B06",
          "common_name": "rededge",
          "description": "Band 6 - Vegetation red edge 2",
          "center_wavelength": 0.74,
          "full_width_half_max": 0.018
        }
      ]
    },
    "B07": {
      "gsd": 20,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 7 - Vegetation red edge 3 - 20m",
      "eo:bands": [
        {
          "name": "B07",
          "common_name": "rededge",
          "description": "Band 7 - Vegetation red edge 3",
          "center_wavelength": 0.783,
          "full_width_half_max": 0.028
        }
      ]
    },
    "B08": {
      "gsd": 10,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 8 - NIR - 10m",
      "eo:bands": [
        {
          "name": "B08",
          "common_name": "nir",
          "description": "Band 8 - NIR",
          "center_wavelength": 0.842,
          "full_width_half_max": 0.145
        }
      ]
    },
    "B09": {
      "gsd": 60,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 9 - Water vapor - 60m",
      "eo:bands": [
        {
          "name": "B09",
          "description": "Band 9 - Water vapor",
          "center_wavelength": 0.945,
          "full_width_half_max": 0.026
        }
      ]
    },
    "B11": {
      "gsd": 20,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 11 - SWIR (1.6) - 20m",
      "eo:bands": [
        {
          "name": "B11",
          "common_name": "swir16",
          "description": "Band 11 - SWIR (1.6)",
          "center_wavelength": 1.61,
          "full_width_half_max": 0.143
        }
      ]
    },
    "B12": {
      "gsd": 20,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 12 - SWIR (2.2) - 20m",
      "eo:bands": [
        {
          "name": "B12",
          "common_name": "swir22",
          "description": "Band 12 - SWIR (2.2)",
          "center_wavelength": 2.19,
          "full_width_half_max": 0.242
        }
      ]
    },
    "B8A": {
      "gsd": 20,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Band 8A - Vegetation red edge 4 - 20m",
      "eo:bands": [
        {
          "name": "B8A",
          "common_name": "rededge",
          "description": "Band 8A - Vegetation red edge 4",
          "center_wavelength": 0.865,
          "full_width_half_max": 0.033
        }
      ]
    },
    "SCL": {
      "gsd": 20,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Scene classfication map (SCL)"
    },
    "WVP": {
      "gsd": 10,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "Water vapour (WVP)"
    },
    "visual": {
      "gsd": 10,
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "True color image",
      "eo:bands": [
        {
          "name": "B04",
          "common_name": "red",
          "description": "Band 4 - Red",
          "center_wavelength": 0.665,
          "full_width_half_max": 0.038
        },
        {
          "name": "B03",
          "common_name": "green",
          "description": "Band 3 - Green",
          "center_wavelength": 0.56,
          "full_width_half_max": 0.045
        },
        {
          "name": "B02",
          "common_name": "blue",
          "description": "Band 2 - Blue",
          "center_wavelength": 0.49,
          "full_width_half_max": 0.098
        }
      ]
    },
    "preview": {
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "thumbnail"
      ],
      "title": "Thumbnail"
    },
    "safe-manifest": {
      "type": "application/xml",
      "roles": [
        "metadata"
      ],
      "title": "SAFE manifest"
    },
    "granule-metadata": {
      "type": "application/xml",
      "roles": [
        "metadata"
      ],
      "title": "Granule metadata"
    },
    "inspire-metadata": {
      "type": "application/xml",
      "roles": [
        "metadata"
      ],
      "title": "INSPIRE metadata"
    },
    "product-metadata": {
      "type": "application/xml",
      "roles": [
        "metadata"
      ],
      "title": "Product metadata"
    },
    "datastrip-metadata": {
      "type": "application/xml",
      "roles": [
        "metadata"
      ],
      "title": "Datastrip metadata"
    }
  },
  "msft:region": "westeurope",
  "stac_version": "1.0.0",
  "msft:_created": "2024-04-05T19:04:14.168175Z",
  "msft:_updated": "2024-08-26T18:24:05.194898Z",
  "msft:container": "sentinel2-l2",
  "stac_extensions": [
    "https://stac-extensions.github.io/item-assets/v1.0.0/schema.json",
    "https://stac-extensions.github.io/table/v1.2.0/schema.json"
  ],
  "msft:storage_account": "sentinel2l2a01",
  "msft:short_description": "The Sentinel-2 program provides global imagery in thirteen spectral bands at 10m-60m resolution and a revisit time of approximately five days.  This dataset contains the global Sentinel-2 archive, from 2016 to the present, processed to L2A (bottom-of-atmosphere)."
}
```

# [Mosaics](#tab/mosaics)

## Mosaics Configuration

The mosaics configuration defines how images are combined when displayed in the Explorer.

```json
[
  {
    "id": "default",
    "name": "Most recent available",
    "description": "Most recent available imagery in this collection",
    "cql": [
      {
        "op": "<=",
        "args": [
          {
            "property": "eo:cloud_cover"
          },
          40
        ]
      }
    ]
  }
]
```

# [Render Options](#tab/render-options)

## Render Options Configuration

The render options configuration defines how imagery is displayed in the Explorer.

```json
[
  {
    "id": "natural-color",
    "name": "Natural color",
    "description": "True color composite of visible bands (B04, B03, B02)",
    "type": "raster-tile",
    "options": "assets=B04&assets=B03&assets=B02&nodata=0&color_formula=Gamma RGB 3.2 Saturation 0.8 Sigmoidal RGB 25 0.35",
    "minZoom": 9
  },
  {
    "id": "natural-color-pre-feb-2022",
    "name": "Natural color (pre Feb, 2022)",
    "description": "Pre-Feb 2022 true color composite of visible bands (B04, B03, B02)",
    "type": "raster-tile",
    "options": "assets=B04&assets=B03&assets=B02&nodata=0&color_formula=Gamma RGB 3.7 Saturation 1.5 Sigmoidal RGB 15 0.35",
    "minZoom": 9
  },
  {
    "id": "color-infrared",
    "name": "Color infrared",
    "description": "Highlights healthy (red) and unhealthy (blue/gray) vegetation (B08, B04, B03).",
    "type": "raster-tile",
    "options": "assets=B08&assets=B04&assets=B03&nodata=0&color_formula=Gamma RGB 3.7 Saturation 1.5 Sigmoidal RGB 15 0.35",
    "minZoom": 9
  },
  {
    "id": "short-wave-infrared",
    "name": "Short wave infrared",
    "description": "Darker shades of green indicate denser vegetation. Brown is indicative of bare soil and built-up areas (B12, B8A, B04).",
    "type": "raster-tile",
    "options": "assets=B12&assets=B8A&assets=B04&nodata=0&color_formula=Gamma RGB 3.7 Saturation 1.5 Sigmoidal RGB 15 0.35",
    "minZoom": 9
  },
  {
    "id": "agriculture",
    "name": "Agriculture",
    "description": "Darker shades of green indicate denser vegetation (B11, B08, B02).",
    "type": "raster-tile",
    "options": "assets=B11&assets=B08&assets=B02&nodata=0&color_formula=Gamma RGB 3.7 Saturation 1.5 Sigmoidal RGB 15 0.35",
    "minZoom": 9
  },
  {
    "id": "normalized-difference-veg-inde",
    "name": "Normalized Difference Veg. Index (NDVI)",
    "description": "Normalized Difference Vegetation Index (B08-B04)/(B08+B04), darker green indicates healthier vegetation.",
    "type": "raster-tile",
    "options": "nodata=0&expression=(B08-B04)/(B08+B04)&rescale=-1,1&colormap_name=rdylgn&asset_as_band=true",
    "minZoom": 9
  },
  {
    "id": "moisture-index-ndwi",
    "name": "Moisture Index (NDWI)",
    "description": "Index indicating water stress in plants (B8A-B11)/(B8A+B11)",
    "type": "raster-tile",
    "options": "nodata=0&expression=(B8A-B11)/(B8A+B11)&rescale=-1,1&colormap_name=rdbu&asset_as_band=true",
    "minZoom": 9
  },
  {
    "id": "atmospheric-penetration",
    "name": "Atmospheric penetration",
    "description": "False color rendering with non-visible bands to reduce effects of atmospheric particles (B12, B11, B8A).",
    "type": "raster-tile",
    "options": "nodata=0&assets=B12&assets=B11&assets=B8A&color_formula=Gamma RGB 3.7 Saturation 1.5 Sigmoidal RGB 15 0.35",
    "minZoom": 9
  }
]
```

# [Tile Settings](#tab/tile-settings)

## Tile Settings Configuration

The tile settings configuration defines how data is tiled and displayed at different zoom levels.

```json
{
  "minZoom": 8,
  "maxItemsPerTile": 35,
  "defaultLocation": null
}
```


# Umbra SAR Imagery Collection Configuration

[Collection description to be added here]

[ ![Screenshot of Umbra SAR Imagery data visualization](media/umbra-sar-imagery.png) ](media/umbra-sar-imagery.png#lightbox)

[Description of data source and link to where to get the data]

## Configuration details

# [STAC Collection](#tab/stac)

## STAC Collection configuration

The STAC Collection configuration defines the core metadata for this collection.

```json
{
  "id": "umbra-sar",
  "type": "Collection",
  "links": [
    {
      "rel": "items",
      "type": "application/geo+json",
      "href": "https://{geocatalog_id}/stac/collections/umbra-sar/items"
    },
    {
      "rel": "parent",
      "type": "application/json",
      "href": "https://{geocatalog_id}/stac/"
    },
    {
      "rel": "root",
      "type": "application/json",
      "href": "https://{geocatalog_id}/stac/"
    },
    {
      "rel": "self",
      "type": "application/json",
      "href": "https://{geocatalog_id}/stac/collections/umbra-sar"
    }
  ],
  "title": "Umbra SAR Imagery",
  "assets": {
    "thumbnail": {
      "href": "https://{storage_account}.blob.core.windows.net/{blob_container}/collection-assets/thumbnail/blob",
      "type": "image/png",
      "roles": [
        "thumbnail"
      ],
      "title": "umbra-sar thumbnail"
    }
  },
  "extent": {
    "spatial": {
      "bbox": [
        [
          -180,
          -90,
          180,
          90
        ]
      ]
    },
    "temporal": {
      "interval": [
        [
          "2018-01-01T00:00:00Z",
          null
        ]
      ]
    }
  },
  "license": "CC-BY-4.0",
  "keywords": [
    "Umbra",
    "X-Band",
    "SAR",
    "RTC"
  ],
  "providers": [
    {
      "url": "https://umbra.space/",
      "name": "Umbra",
      "roles": [
        "processor"
      ]
    },
    {
      "url": "https://planetarycomputer.microsoft.com",
      "name": "Microsoft",
      "roles": [
        "host"
      ]
    }
  ],
  "description": "Umbra satellites offer the highest commercially available SAR imagery, surpassing 25 cm resolution. Capable of capturing images day or night, through clouds, smoke, and rain, our technology enables all-weather monitoring.",
  "item_assets": {
    "GEC": {
      "type": "image/tiff; application=geotiff; profile=cloud-optimized",
      "roles": [
        "data"
      ],
      "title": "VV: vertical transmit, vertical receive",
      "description": "Terrain-corrected gamma naught values of signal transmitted with vertical polarization and received with vertical polarization with radiometric terrain correction applied.",
      "raster:bands": [
        {
          "nodata": -32768,
          "data_type": "uint8",
          "spatial_resolution": 0.4770254115
        }
      ]
    }
  },
  "stac_version": "1.0.0",
  "msft:_created": "2024-04-05T17:55:17.930092Z",
  "msft:_updated": "2024-04-05T18:30:16.587869Z",
  "stac_extensions": [
    "https://{storage_account}.blob.core.windows.net/{blob_container}/json-schemas/json-schemas/msft/v0.1/schema.json"
  ],
  "msft:short_description": "Umbra Synthetic Aperture Radar (SAR) Imagery"
}
```

# [Mosaics](#tab/mosaics)

## Mosaics Configuration

The mosaics configuration defines how images are combined when displayed in the Explorer.

```json
[
  {
    "id": "default",
    "name": "Default",
    "description": "",
    "cql": []
  }
]
```

# [Render Options](#tab/render-options)

## Render Options Configuration

The render options configuration defines how imagery is displayed in the Explorer.

```json
[
  {
    "id": "vv-polarization",
    "name": "VV polarization",
    "description": "VV asset scaled to `0,.20`.",
    "type": "raster-tile",
    "options": "assets=GEC&rescale=0,255&colormap_name=gray",
    "minZoom": 8,
    "conditions": [
      {
        "property": "sar:polarizations",
        "value": [
          "VV"
        ]
      }
    ]
  }
]
```

# [Tile Settings](#tab/tile-settings)

## Tile Settings Configuration

The tile settings configuration defines how data is tiled and displayed at different zoom levels.

```json
{
  "minZoom": 12,
  "maxItemsPerTile": 35,
  "defaultLocation": null
}
```