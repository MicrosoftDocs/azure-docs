---
title: Data Cube Quickstart for Microsoft Planetary Computer Pro
description: Learn how to work with data cube data Microsoft Planetary Computer Pro.
author: brentharris
ms.author: brentharris
ms.service: planetary-computer-pro
ms.topic: quickstart
ms.date: 11/5/2025
#customer intent: help customers understand the nuances of ingesting and rendering data cube assets in Microsoft Planetary Computer Pro.
ms.custom:
  - build-2025
---

# Quickstart: Get started with data cubes in Microsoft Planetary Computer Pro

## Prerequisites

* An Azure account with an active subscription; [create an account for free.](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn)
* A [Microsoft Planetary Computer Pro GeoCatalog resource](deploy-geocatalog-resource.md)
* A Blob Storage account [create a Blob Storage account](/azure/storage/common/storage-account-create?tabs=azure-portal).
* A Blob Storage container with data cube assets (NetCDF, HDF5, GRIB2), STAC Items, and static STAC Catalog. [Learn how to create STAC Items](create-stac-item.md).

## Set up ingestion source

Before you can begin to ingest data cube data, you'll need to set up an Ingestion Source, which will serve as your credentials to access the Blob Storage account where your assets and STAC Items are stored. You can set up an Ingestion Source using [Managed Identity](set-up-ingestion-credentials-managed-identity.md) or [SAS Token](set-up-ingestion-credentials-sas-tokens.md).

## Create a data cube collection

Once your Ingestion Source is set up, you can create a Collection for your data cube assets. Steps to create a collection can be followed in [Create a STAC Collection with Microsoft Planetary Computer Pro using Python](create-stac-collection.md).

## Ingest data cube assets

The initiation of the ingestion process for data cube data, and other data types, can be followed in [Ingestion Overview](./ingestion-overview.md). As described in [Data Cube Overview](./data-cube-overview.md), however, ingestion is the step in Planetary Computer Pro's data handling that differs for these file types. While GRIB2 data and associated STAC Items are ingested just like any other two-dimensional raster file, NetCDF and HDF5 assets undergo further data enrichment. The generation of Kerchunk Manifests is documented in [Data Cube Overview](./data-cube-overview.md), but what is important to note is that Kerchunk assets will be added to your Blob Storage container alongside the original assets, and an additional `cube:variables` field are added to the STAC Item JSON. This is important when rendering these data types in the Planetary Computer Pro Explorer.

### Configure a data cube collection

Configuration of your data cube collection is another step that will look slightly different from that of other data types. You can follow the steps described in [Configure a collection with the Microsoft Planetary Computer Pro web interface](./configure-collection-web-interface.md) to configure your data cube collection, but you'll need to be aware of the following differences when building your Render Configuration:

#### Render configuration for NetCDF and HDF5 assets

Remembering that a standard Render Configuration argument in JSON format looks like this:

```json
[
  {
    "id": "prK1950-06-30",
    "name": "prK1950-06-30",
    "type": "raster-tile",
    "options": "assets=pr-kerchunk&subdataset_name=pr&rescale=0,0.01&colormap_name=viridis&datetime=1950-06-30",
    "minZoom": 1
  }
]
```

The `options` field is where you'll want to utilize the cloud optimized, Kerchunk asset, as opposed to the original asset listed in the STAC Item. You'll also need to include the `subdataset_name` argument, which is the name of the variable you want to render.

#### Render configuration for GRIB2 assets

The `options` field for the Render Configuration of GRIB2 assets look similar to the previous example, but you won't need to include the `subdataset_name` argument. This is because GRIB2 data is already optimally structured and referenced via their Index files. The `assets` argument, in this case, represents the band, or 2D raster layer, you want to render. Below is an example of a GRIB2 Render Configuration:

```json
[ 
 {
    "id": "render-config-1",
    "name": "Mean Zero-Crossing Wave Period",
    "description": "A sample render configuration. Update `options` below.",
    "type": "raster-tile",
    "options": "assets=data&subdataset_bands=1&colormap_name=winter&rescale=0,10",
    "minZoom": 1
 }
]
```

#### Render configuration for Zarr assets

The `options` field for the Render Configuration of Zarr assets is also similar to that of NetCDF and HDF5, however within the `assets` argument you will have to include the parameter 'sel' which enables you to select a time, step, or other variable that enables 2D rendering of one variable at one time slice from a multi-variable Zarr store. You may also need to include a 'sel_method' parameter, to ensure the right variable is selected even if the value entered is slightly off. You can read more about this 'sel' parameter in the public documentation for the Python multidimensional data read library used in the Planetary Computer Pro backend, [Xarray](https://docs.xarray.dev/en/latest/generated/xarray.DataArray.sel.html) Below is an example of a Zarr Render Configuration:

```json
[
  {
    "id": "era5-zarr",
    "name": "era5-zarr",
    "type": "raster-tile",
    "options": "assets=data&subdataset_name=precipitation_amount_1hour_Accumulation&colormap_name=viridis&sel=time=2024-01-01&sel_method=nearest&rescale=0,0.01",
    "minZoom": 12
  }
]
```

### Visualize data cube assets in the Explorer

Once your data cube assets are ingested and configured, you can visualize them in the Planetary Computer Pro Explorer. A step-by-step guide for using the Explorer can be followed in [Quickstart: Use the Explorer in Microsoft Planetary Computer Pro](use-explorer.md).

While Microsoft Planetary Computer Pro includes a tiler that can be used to visualize some data cube assets, there are some caveats to note when it comes to each supported data type.

####  NetCDF and HDF5 visualization

Not all NetCDF datasets that can be ingested into Microsoft Planetary Computer are compatible by the Planetary Computer Pro's visualization tiler. A dataset must have X and Y axes, latitude and longitude coordinates, and spatial dimensions and bounds to be visualized. For example, a dataset in which latitude and longitude are variables, but not coordinates, isn't compatible with Planetary Computer Pro's tiler.  

Before attempting to visualize your NetCDF or HDF5 dataset, you can use the following to check whether it meets the requirements.

1. Install the required dependencies

    ```python
    pip install xarray[io] rioxarray cf_xarray
    ```

2. Run the following function:

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
#### GRIB2 visualization

GRIB2 assets that have been ingested into Microsoft Planetary Computer Pro can be visualized in the Explorer as long as they have an associated Index file (.idx) stored in the same Blob Storage container. The Index file is generated during ingestion and is required for optimal access and rendering of GRIB2 data.

#### Zarr visualization

Zarr assets ingested into Microsoft Planetary Computer Pro can be visualized in the Explorer as long as the Render Configuration specifies which variable and time slice to render using the `sel` parameter in the `options` field. Failure to do so will result in the Explorer attempting to render all variables and time slices of the Zarr store at once, which will cause the Explorer to crash.

The size of the Zarr store and spatial chunks will also impact performance. You should aim to keep the total size of a Zarr store under 2 GB, and each chunk less than 100 MB for optimal performance of the tiler. 

#### Time slider for data cube visualization

If your data cube assets have a temporal component, you can use the time slider in the Explorer to visualize changes over time. The time slider will appear automatically if your STAC Items contains assets with a `time` dimension with an `extent` and `step` field.

> [!NOTE]
> We do not currently offer time slider support for Zarr assets. Because of this, it is critical that you specify which time slices you want to visualize in the render configuration. Failure to do so will result in the Explorer attempting to render all time slices of the Zarr store at once, which will cause the Explorer to crash.

## Related content

- [Access STAC collection data cube assets with a collection-level SAS token](./get-collection-sas-token.md)
