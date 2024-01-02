---
title: OJ Sales Simulated 
description: Learn how to use the OJ Sales Simulated  dataset in Azure Open Datasets.
ms.service: open-datasets
ms.custom: devx-track-python
ms.topic: sample
ms.date: 04/16/2021
---

# OJ Sales Simulated 

This dataset is derived from the Dominick’s OJ dataset and includes extra simulated data to simultaneously train thousands of models on Azure Machine Learning.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

The data contains weekly sales of orange juice over 121 weeks. There are 3,991 stores included and three brands of orange juice per store so that 11,973 models can be trained.

View the original dataset description or download the dataset.

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| Advert | int |  | 1 | Value indicating if there were advertisements for that orange juice during the week 0: No Advertisements 1: Advertisements |
| Brand | string |  | dominicks tropicana | Brand of orange juice |
| Price | double |  | 2.6 2.09 | Price of the orange juice (in USD) |
| Quantity | int |  | 10939 11638 | Quantity of orange juice sold for that week |
| Revenue | double |  | 38438.4 36036.0 | Revenue from orange juice sales for that week (in USD) |
| Store | int |  | 2658 1396 | Store number where the orange juice was sold |
| WeekStarting | timestamp |  | 1990-08-09 00:00:00 1992-02-20 00:00:00 | Date indicating which week the sales are related to |

## Preview

| WeekStarting | Store | Brand | Quantity | Advert | Price | Revenue |
|-|-|-|-|-|-|-|
| 10/1/1992 12:00:00 AM | 3571 | minute.maid | 13247 | 1 | 2.42 | 32057.74 |
| 10/1/1992 12:00:00 AM | 2999 | minute.maid | 18461 | 1 | 2.69 | 49660.09 |
| 10/1/1992 12:00:00 AM | 1198 | minute.maid | 13222 | 1 | 2.64 | 34906.08 |
| 10/1/1992 12:00:00 AM | 3916 | minute.maid | 12923 | 1 | 2.45 | 31661.35 |
| 10/1/1992 12:00:00 AM | 1688 | minute.maid | 9380 | 1 | 2.46 | 23074.8 |
| 10/1/1992 12:00:00 AM | 1040 | minute.maid | 18841 | 1 | 2.31 | 43522.71 |
| 10/1/1992 12:00:00 AM | 1938 | minute.maid | 14202 | 1 | 2.19 | 31102.38 |
| 10/1/1992 12:00:00 AM | 2405 | minute.maid | 16326 | 1 | 2.05 | 33468.3 |
| 10/1/1992 12:00:00 AM | 1972 | minute.maid | 16380 | 1 | 2.12 | 34725.6 |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=sample-oj-sales-simulated -->

```python
from azureml.core.workspace import Workspace
ws = Workspace.from_config()
datastore = ws.get_default_datastore()
```

```python
from azureml.opendatasets import OjSalesSimulated
```

### Read data from Azure Open Datasets

```python
# Create a Data Directory in local path
import os

oj_sales_path = "oj_sales_data"

if not os.path.exists(oj_sales_path):
    os.mkdir(oj_sales_path)
```

```python
# Pull all of the data
oj_sales_files = OjSalesSimulated.get_file_dataset()

# or pull a subset of the data
oj_sales_files = OjSalesSimulated.get_file_dataset(num_files=10)
```

```python
oj_sales_files.download(oj_sales_path, overwrite=True)
```

### Upload the individual datasets to Blob Storage
We upload the data to Blob and will create the FileDataset from this folder of csv files.  

```python
target_path = 'oj_sales_data'

datastore.upload(src_dir = oj_sales_path,
                target_path = target_path,
                overwrite = True, 
                show_progress = True)
```

### Create the file dataset 
We need to define the path of the data to create the [FileDataset](/python/api/azureml-core/azureml.data.file_dataset.filedataset). 



```python
from azureml.core.dataset import Dataset

ds_name = 'oj_data'
path_on_datastore = datastore.path(target_path + '/')

input_ds = Dataset.File.from_files(path=path_on_datastore, validate=False)
```

### Register the file dataset to the workspace 
We want to register the dataset to our workspace so we can call it as an input into our Pipeline for forecasting. 



```python
registered_ds = input_ds.register(ws, ds_name, create_new_version=True)
named_ds = registered_ds.as_named_input(ds_name)
```

<!-- nbend -->


---

### Azure Databricks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=sample-oj-sales-simulated -->

```
# This is a package in preview.
# You need to pip install azureml-opendatasets in Databricks cluster. https://learn.microsoft.com/azure/data-explorer/connect-from-databricks#install-the-python-library-on-your-azure-databricks-cluster
# Download or mount OJ Sales raw files Azure Machine Learning file datasets.
# This works only for Linux based compute. See https://learn.microsoft.com/azure/machine-learning/service/how-to-create-register-datasets to learn more about datasets.

from azureml.opendatasets import OjSalesSimulated

ojss_file = OjSalesSimulated.get_file_dataset()
ojss_file
```

```
ojss_file.to_path()
```

```
# Download files to local storage
import os
import tempfile

mount_point = tempfile.mkdtemp()
ojss_file.download(mount_point, overwrite=True)
```

```
# Mount files. Useful when training job will run on a remote compute.
import gzip
import struct
import pandas as pd
import numpy as np

# load compressed OJ Sales Simulated gz files and return numpy arrays
def load_data(filename, label=False):
    with gzip.open(filename) as gz:
        gz.read(4)
        n_items = struct.unpack('>I', gz.read(4))
        if not label:
            n_rows = struct.unpack('>I', gz.read(4))[0]
            n_cols = struct.unpack('>I', gz.read(4))[0]
            res = np.frombuffer(gz.read(n_items[0] * n_rows * n_cols), dtype=np.uint8)
            res = res.reshape(n_items[0], n_rows * n_cols)
        else:
            res = np.frombuffer(gz.read(n_items[0]), dtype=np.uint8)
            res = res.reshape(n_items[0], 1)
    return pd.DataFrame(res)
```

```
import sys
mount_point = tempfile.mkdtemp()
print(mount_point)
print(os.path.exists(mount_point))
print(os.listdir(mount_point))

if sys.platform == 'linux':
  print("start mounting....")
  with ojss_file.mount(mount_point):
    print(os.listdir(mount_point))  
    train_images_df = load_data(os.path.join(mount_point, 'train-tabular-oj-ubyte.gz'))
    print(train_images_df.info())
```

<!-- nbend -->


---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
