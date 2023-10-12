---
title: Boston Safety Data
description: Learn how to use the Boston Safety Data dataset in Azure Open Datasets.
ms.service: open-datasets
ms.custom: devx-track-python
ms.topic: sample
ms.date: 04/16/2021
---

# Boston Safety Data

311 calls reported to the city of Boston.

Refer to this link to learn more about [BOS:311](https://www.cityofboston.gov/311/).

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Volume and retention

This dataset is stored in Parquet format. It is updated daily, and contains about 100-K rows (10 MB) in total as of 2019.

This dataset contains historical records accumulated from 2011 to the present. You can use parameter settings in our SDK to fetch data within a specific time range.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Additional information

This dataset is sourced from city of Boston government. For more information, see [Boston's dataset site](https://data.boston.gov/dataset/311-service-requests). For dataset licensing, see [Open Data Commons Public Domain Dedication and License (ODC PDDL)](http://opendefinition.org/licenses/odc-pddl/).

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| address | string | 140,612 | \" \" 1 City Hall Plz Boston MA 02108 | Location. |
| category | string | 54 | Street Cleaning Sanitation | Reason of the service request. |
| dataSubtype | string | 1 | 311_All | “311_All” |
| dataType | string | 1 | Safety | “Safety” |
| dateTime | timestamp | 1,529,075 | 2015-07-23 10:51:00 2015-07-23 10:47:00 | Open date and time of the service request. |
| latitude | double | 1,622 | 42.3594 42.3603 | This is the latitude value. Lines of latitude are parallel to the equator. |
| longitude | double | 1,806 | -71.0587 -71.0583 | This is the longitude value. Lines of longitude run perpendicular to lines of latitude, and all pass through both poles. |
| source | string | 7 | Constituent Call Citizens Connect App | Original source of the case. |
| status | string | 2 | Closed Open | Case status. |
| subcategory | string | 209 | Parking Enforcement Requests for Street Cleaning | Type of the service request. |

## Preview

| ataType | dataSubtype | dateTime | category | subcategory | status | address | latitude | longitude | source | extendedProperties |
|-|-|-|-|-|-|-|-|-|-|-|
| Safety | 311_All | 4/27/2021 11:45:49 PM | Enforcement & Abandoned Vehicles | Parking Enforcement | Open | 51 Gardner St Allston MA 02134 | 42.3535 | -71.1285 | Citizens Connect App |  |
| Safety | 311_All | 4/27/2021 11:43:43 PM | Sanitation | Missed Trash/Recycling/Yard Waste/Bulk Item | Open | 4 Putnam Pl Roxbury MA 02119 | 42.3298 | -71.0883 | Self Service |  |
| Safety | 311_All | 4/27/2021 11:37:19 PM | Enforcement & Abandoned Vehicles | Parking Enforcement | Open | 36 Raven St Dorchester MA 02125 | 42.3177 | -71.0546 | Citizens Connect App |  |
| Safety | 311_All | 4/27/2021 11:30:00 PM | Sanitation | Missed Trash/Recycling/Yard Waste/Bulk Item | Open | 58 Bicknell St Dorchester MA 02121 | 42.2984 | -71.0834 | Constituent Call |  |
| Safety | 311_All | 4/27/2021 11:10:20 PM | Enforcement & Abandoned Vehicles | Parking Enforcement | Open | 2000 Commonwealth Ave Brighton MA 02135 | 42.3394 | -71.1585 | Citizens Connect App |  |
| Safety | 311_All | 4/27/2021 11:06:00 PM | Noise Disturbance | Loud Parties/Music/People | Open | INTERSECTION of Lewis St & North St Boston MA | 42.3594 | -71.0587 | Constituent Call |  |
| Safety | 311_All | 4/27/2021 11:05:00 PM | Enforcement & Abandoned Vehicles | Parking Enforcement | Open | 1 Nassau St Boston MA 02111 | 42.3486 | -71.0629 | Constituent Call |  |
| Safety | 311_All | 4/27/2021 11:00:55 PM | Code Enforcement | Poor Conditions of Property | Open | 17 Mercer St South Boston MA 02127 | 42.3332 | -71.0492 | Citizens Connect App |  |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_boston -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_boston)**.

```
# This is a package in preview.
from azureml.opendatasets import BostonSafety

from datetime import datetime
from dateutil import parser

end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = BostonSafety(start_date=start_date, end_date=end_date)
safety = safety.to_pandas_dataframe()
```

```
safety.info()
```

<!-- nbend -->


# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=city_safety_boston -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=city_safety_boston)**.

```python
# Pip install packages
import os, sys

!{sys.executable} -m pip install azure-storage-blob
!{sys.executable} -m pip install pyarrow
!{sys.executable} -m pip install pandas
```

```python
# Azure storage access info
azure_storage_account_name = "azureopendatastorage"
azure_storage_sas_token = r""
container_name = "citydatacontainer"
folder_name = "Safety/Release/city=Boston"
```

```python
from azure.storage.blob import BlockBlobServicefrom azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient

if azure_storage_account_name is None or azure_storage_sas_token is None:
    raise Exception(
        "Provide your specific name and key for your Azure Storage account--see the Prerequisites section earlier.")

print('Looking for the first parquet under the folder ' +
      folder_name + ' in container "' + container_name + '"...')
container_url = f"https://{azure_storage_account_name}.blob.core.windows.net/"
blob_service_client = BlobServiceClient(
    container_url, azure_storage_sas_token if azure_storage_sas_token else None)

container_client = blob_service_client.get_container_client(container_name)
blobs = container_client.list_blobs(folder_name)
sorted_blobs = sorted(list(blobs), key=lambda e: e.name, reverse=True)
targetBlobName = ''
for blob in sorted_blobs:
    if blob.name.startswith(folder_name) and blob.name.endswith('.parquet'):
        targetBlobName = blob.name
        break

print('Target blob to download: ' + targetBlobName)
_, filename = os.path.split(targetBlobName)
blob_client = container_client.get_blob_client(targetBlobName)
with open(filename, 'wb') as local_file:
    blob_client.download_blob().download_to_stream(local_file)
```

```python
# Read the parquet file into Pandas data frame
import pandas as pd

print('Reading the parquet file into Pandas data frame')
df = pd.read_parquet(filename)
```

```python
# you can add your filter at below
print('Loaded as a Pandas data frame: ')
df
```

<!-- nbend -->


# [pyspark](#tab/pyspark)

Sample not available for this platform/package combination.

---

### Azure Databricks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=city_safety_boston -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=city_safety_boston)**.

```
# This is a package in preview.
# You need to pip install azureml-opendatasets in Databricks cluster. https://learn.microsoft.com/azure/data-explorer/connect-from-databricks#install-the-python-library-on-your-azure-databricks-cluster
from azureml.opendatasets import BostonSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = BostonSafety(start_date=start_date, end_date=end_date)
safety = safety.to_spark_dataframe()
```

```
display(safety)
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=city_safety_boston -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=city_safety_boston)**.

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=Boston"
blob_sas_token = r""
```

```python
# Allow SPARK to read from Blob remotely
wasbs_path = 'wasbs://%s@%s.blob.core.windows.net/%s' % (blob_container_name, blob_account_name, blob_relative_path)
spark.conf.set(
  'fs.azure.sas.%s.%s.blob.core.windows.net' % (blob_container_name, blob_account_name),
  blob_sas_token)
print('Remote blob path: ' + wasbs_path)
```

```python
# SPARK read parquet, note that it won't load any data yet by now
df = spark.read.parquet(wasbs_path)
print('Register the DataFrame as a SQL temporary view: source')
df.createOrReplaceTempView('source')
```

```python
# Display top 10 rows
print('Displaying top 10 rows: ')
display(spark.sql('SELECT * FROM source LIMIT 10'))
```

<!-- nbend -->

---

### Azure Synapse

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=azureml-opendatasets&registryId=city_safety_boston -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=azureml-opendatasets&registryId=city_safety_boston)**.

```python
from azureml.opendatasets import BostonSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = BostonSafety(start_date=start_date, end_date=end_date)
safety = safety.to_spark_dataframe()
```

```python
display(safety)
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=city_safety_boston -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=city_safety_boston)**.

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=Boston"
blob_sas_token = r""
```

```python
# Allow SPARK to read from Blob remotely
wasbs_path = 'wasbs://%s@%s.blob.core.windows.net/%s' % (blob_container_name, blob_account_name, blob_relative_path)
spark.conf.set(
  'fs.azure.sas.%s.%s.blob.core.windows.net' % (blob_container_name, blob_account_name),
  blob_sas_token)
print('Remote blob path: ' + wasbs_path)
```

```python
# SPARK read parquet, note that it won't load any data yet by now
df = spark.read.parquet(wasbs_path)
print('Register the DataFrame as a SQL temporary view: source')
df.createOrReplaceTempView('source')
```

```python
# Display top 10 rows
print('Displaying top 10 rows: ')
display(spark.sql('SELECT * FROM source LIMIT 10'))
```

<!-- nbend -->

---

## Examples

- See the [City Safety Analytics](https://github.com/scottcounts/CitySafety) example on GitHub.


## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
