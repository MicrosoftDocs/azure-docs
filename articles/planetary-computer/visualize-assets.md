---
title: Visualize assets for Microsoft Planetary Computer Pro
description: Learn how to visualize geospatial assets using the Microsoft Planetary Computer Pro's tiler. This guide includes examples for working with GRIB and NetCDF datasets.
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer
ms.topic: how-to
ms.date: 04/09/2025
---

# Visualize assets for Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro includes a tiler that can be used to visualize assets.

## Supported media types

Only certain media types, which are set on the `type` field of the Asset, are supported.

Raster media types:

- image/jp2
- image/x.geotiff
- image/tiff
- image/tiff; application=geotiff
- image/tiff; application=geotiff; profile=cloud-optimized
- image/tiff; profile=cloud-optimized; application=geotiff

Kerchunk stores as JSON media types:

- application/json

GRIB media types:

- application/grib
- application/grib;edition=2

NetCDF and HDF5 media types:

- application/x-netcdf
- application/netcdf
- application/x-hdf5
- application/x-hdf

## Items contain assets, raster assets contain bands 

A single geospatial STAC item may contain many assets, each of which contains raster data.  Commonly, three 'red', 'blue', and 'green' geotiff assets of an item are combined in a render configuration to form a single image as in {"options": "assets=red&assets=green&assets=blue&nodata=0&color_formula=gamma RGB 2.7, saturation 1.5, sigmoidal RGB 15 0.55"}. Alternatively, a single geotiff asset may contain all three bands composing an image. In this case, a render configuration uses 'asset_bidx' to show which band indices will be visualized as in {"options": "assets=image&asset_bidx=image|1,2,3"}.   

## GRIB assets contain messages, queried as subdataset_bands

A GRIB file is a collection of many 2-D geospatial arrays, organized like an indexed list. Metadata about a GRIB file shows which data corresponds to which 'grib message'. Planetary Computer uses the query parameter 'subdataset_bands' in a render configuration to identify which 2-D array of data within the grib dataset, and which grib message will be visualized, as in {"options": "assets=grib&nodata=0&scale=2&rescale=1,75&resampling=nearest&colormap_name=jet&subdataset_bands=1"}.

### GRIB example

This example loads [NOAA HRRR](https://rapidrefresh.noaa.gov/hrrr/) data using some examples from the [stactools-hrrr](https://github.com/stactools-packages/noaa-hrrr) dataset. In this example, subdataset_bands=9 enables visualization of the Wind Speed (Gust) subdataset, where the grib_message=9. See grib item's json for other grib messages (https://github.com/stactools-packages/noaa-hrrr/examples/hrrr-conus-sfc-2024-05-10T12-FH0/hrrr-conus-sfc-2024-05-10T12-FH0.json)

1. First, we load the Collection and Item into the GeoCatalog using the following Python code.

    ```python
    import httpx
    import azure.identity
    import morecantile
    
    GEOCATALOG_URL = "..."  # replace with your GeoCatalog URL
    
    
    credential = azure.identity.DefaultAzureCredential()
    token = credential.get_token("https://spatio.geocatalog.azure.net/.default").token
    
    client = httpx.Client(
        base_url=GEOCATALOG_URL,
        headers={"Authorization": f"Bearer {token}", "api-version": "2024-01-31-preview"},
    )
    

    collection_id = "noaa-hrrr-sfc-conus"
    item_id = "hrrr-conus-sfc-2023-05-10T12-FH0"
    
    collection = httpx.get(
        "https://raw.githubusercontent.com/stactools-packages/noaa-hrrr/main/examples/collection.json"
    ).json()
    c["links"] = [x for x in c["links"] if x["rel"] != "root"]
    
    
    response = client.post("/api/collections", json=collection)
    if response.status_code not in (200, 409):
        raise Exception(f"Failed to create collection: {response.json()}")
    
    item = httpx.get(
        f"https://raw.githubusercontent.com/stactools-packages/noaa-hrrr/main/examples/hrrr-conus-sfc-2024-05-10T12-FH0/{item_id}.json"
    ).json()
    
    response = client.post(f"/api/collections/{collection_id}/items", json=item)
    if response.status_code not in (200, 409):
        raise Exception(f"Failed to create item: {response.json()}")
    
    
    # poll, wait
    while True:
        response = client.get(response.headers["Location"])
        ...
    ```

1. Now we can visualize the data. We'll use the `tile` endpoint, which requires providing `z`, `x`, and `x` parameters with the zoom and tile coordinates.

    ```python
    bounds = client.get(f"collections/{collection_id}/items/{item_id}/bounds").json()["bounds"]
    center = ((bounds[0] + bounds[2]) / 2, (bounds[1] + bounds[3]) / 2)
    
    tms = morecantile.tms.get("WebMercatorQuad")
    tile = tms.tile(*center, 4)
    ```

1. Then we can get the image data using the following Python code.

    ```python
    response = client.get(
        f"collections/{collection_id}/items/{item_id}/tiles/WebMercatorQuad/{tile.z}/{tile.x}/{tile.y}.png",
        params={
            "assets": "grib",
            "scale": "2",
            "rescale": "0,40",
            "resampling": "nearest",
            "colormap_name": "ylorrd",
            "subdataset_bands": 9
        },
        timeout=10
    )
    ```

1. The image can be written to a file using the following Python code.

    ```python
    import pathlib
    
    pathlib.Path("image.png").write_bytes(response.content)
    ```

    Or, in the context of a Jupyter notebook, is displayed as the following:

    ```python
    from IPython.display import Image
    
    Image(response.content)
    ```

## NETCDF assets contain subdatasets and an optional time dimension queried as subdataset_name, datetime

Microsot Planetary Computer uses xarray to read NETCDF files and currently supports visualizing 2-D geospatial arrays with dimensions of latitude (labeled 'y', 'lat', 'latitude', 'LAT', 'LATITUDE' or 'Lat') and longitude (labeled 'x', 'lon', 'longitude', 'LON', 'LONGITUDE', or 'Lon') and 3-D geospatial arrays with an additional time dimension (labeled 'TIME' or 'time').  

A single NETCDF asset may have multiple 2-D or 3-D arrays. To visualize a 2-D array of a NETCDF asset, specify the desired array with subdataset_name= within a render configuration.  To visualize a single timepoint from within a 3-D array of a NETCDF asset, use ISO8601 formatted datetime=, as in 
{"options": "assets=cmip&rescale=0,0.01&colormap_name=viridis&subdataset_name=pr&datetime=1950-07-07T00:00:00"}.  

Microsot Planetary Computer uses the xarray-assets STAC extension. Query arguments are passed forward to xarray.open_dataset.

For a given datetime, Microsot Planetary Computer and xarray find the 2-D slice of the dataset nearest the specified datetime; they do not interprolate between multiple slices.  

## Check NetCDF visualizability 

Not all NetCDF datasets that can be ingested into Microsot Planetary Computer can be visualized by the Microsot Planetary Computer tiler. A dataset must have X and Y axes, latitude and longitude coordinates, and spatial dimensions and bounds to be visualized. For example, a dataset in which latitude and longitude are variables, but not coordinates, must be reprojected to be visualized by Planetary Computer's tiler.  

Before attempting to visualize your NetCDF dataset, you can use the following to check whether it meets the requirements.

1. Install the required dependencies

    ```python
    pip install xarray[io] rioxarray cf_xarray
    ```

1. Run the following function:

    ```python
    import xarray as xr
    import cf_xarray
    import rioxarray
    
    def is_dataset_visualizable(ds: xr.Dataset):
        """
        Test if the dataset is compatible with the Planetary Computer tiler API.
        Raises an informative error if the dataset is not compatible.
        """
        if not ds.cf.axes:
            raise ValueError("Dataset does not have CF axes")
        if not ds.cf.coordinates:
            raise ValueError("Dataset does not have CF coordinates")
        if not {"X", "Y"} <= ds.cf.axes.keys():
            raise ValueError(f"Dataset must have CF X and Y axes, found: {ds.cf.axes.keys()}")
        
        if not {"latitude", "longitude"} <= ds.cf.coordinates.keys():
            raise ValueError("Dataset must have CF latitude and longitude coordinates, "
                             f"actual: {ds.cf.coordinates.keys()}")
        
        if ds.rio.x_dim is None or ds.rio.y_dim is None:
            raise ValueError("Dataset does not have rioxarray spatial dimensions")
        
        if ds.rio.bounds() is None:
            raise ValueError("Dataset does not have rioxarray bounds")
        
        left, bottom, right, top = ds.rio.bounds()
        if left < -180 or right > 180 or bottom < -90 or top > 90:
            raise ValueError("Dataset bounds are not valid; they must be within [-180, 180] and [-90, 90]")
        
        if ds.rio.resolution() is None:
            raise ValueError("Dataset does not have rioxarray resolution")
        
        if ds.rio.transform() is None:
            raise ValueError("Dataset does not have rioxarray transform")
        
        print("✅ Dataset is compatible with the Planetary Computer tiler API.")
    ```


 