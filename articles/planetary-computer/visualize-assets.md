---
title: Check if Data Cube Assets Can Be Visualized on Microsoft Planetary Computer Pro
description: Learn how to check if geospatial assets can be visualized by Microsoft Planetary Computer Pro's tiler. 
author: tanyamarton
ms.author: tanyamarton
ms.service: planetary-computer-pro
ms.topic: how-to
ms.date: 04/09/2025
ms.custom:
  - build-2025
---

# Visualize data cube assets for Microsoft Planetary Computer Pro

Microsoft Planetary Computer Pro includes a tiler that can be used to visualize some NetCDF assets.  

## Check NetCDF visualizability 

Not all NetCDF datasets that can be ingested into Microsoft Planetary Computer are compatible by the Planetary Computer Pro's visualization tiler. A dataset must have X and Y axes, latitude and longitude coordinates, and spatial dimensions and bounds to be visualized. For example, a dataset in which latitude and longitude are variables, but not coordinates, isn't compatible with Planetary Computer Pro's tiler.  

Before attempting to visualize your NetCDF dataset, you can use the following to check whether it meets the requirements.

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
 
