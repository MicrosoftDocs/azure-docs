---
title: New York City Safety Data
description: Learn how to use the New York City Safety dataset in Azure Open Datasets.
ms.service: open-datasets
ms.custom: devx-track-python
ms.topic: sample
ms.date: 04/16/2021
---

# New York City Safety Data

All New York City 311 service requests from 2010 to the present.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]


## Volume and retention

This dataset is stored in Parquet format. It is updated daily, and contains about 12M rows (500 MB) in total as of 2019.

This dataset contains historical records accumulated from 2010 to the present. You can use parameter settings in our SDK to fetch data within a specific time range.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Additional information

This dataset is sourced from New York City government, for more information, see the [City of New York website](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9). See the [terms of this dataset](https://www1.nyc.gov/home/terms-of-use.page).

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| address | string | 1,536,593 | 655 EAST 230 STREET 78-15 PARSONS BOULEVARD | House number of incident address provided by submitter. |
| category | string | 446 | Noise - Residential HEAT/HOT WATER | This is the first level of a hierarchy identifying the topic of the incident or condition (Complaint Type). It may have a corresponding subcategory (Descriptor) or may stand alone. |
| dataSubtype | string | 1 | 311_All | “311_All” |
| dataType | string | 1 | Safety | “Safety” |
| dateTime | timestamp | 17,332,609 | 2013-01-24 00:00:00 2015-01-08 00:00:00 | Date Service Request was created. |
| latitude | double | 1,513,691 | 40.89187241649303 40.72195913199264 | Geo based Latitude of the incident location. |
| longitude | double | 1,513,713 | -73.86016845296459 -73.80969682426189 | Geo based Longitude of the incident location. |
| status | string | 13 | Closed Pending | Status of Service Request submitted. |
| subcategory | string | 1,716 | Loud Music/Party ENTIRE BUILDING | This is associated to the category (Complaint Type), and provides further detail on the incident or condition. Its values are dependent on the Complaint Type, and are not always required in Service Request. |

## Preview

| dataType | dataSubtype | dateTime | category | subcategory | status | address | latitude | longitude | source | extendedProperties |
|-|-|-|-|-|-|-|-|-|-|-|
| Safety | 311_All | 4/25/2021 2:05:05 AM | Noise - Street/Sidewalk | Loud Music/Party | In Progress | 2766 BATH AVENUE | 40.5906129741766 | -73.9847949011337 | null |  |
| Safety | 311_All | 4/25/2021 2:04:33 AM | Noise - Commercial | Loud Music/Party | In Progress | 1033 WEBSTER AVENUE | 40.8285784533256 | -73.9117746958432 | null |  |
| Safety | 311_All | 4/25/2021 2:04:27 AM | Noise - Residential | Loud Music/Party | In Progress | 620 WEST 141 STREET | 40.8241726554395 | -73.9530069547366 | null |  |
| Safety | 311_All | 4/25/2021 2:04:04 AM | Noise - Residential | Loud Music/Party | In Progress | 1647 64 STREET | 40.6218907202382 | -73.9931125332078 | null |  |
| Safety | 311_All | 4/25/2021 2:04:01 AM | Noise - Residential | Loud Music/Party | In Progress | 30 LENOX AVENUE | 40.7991622274945 | -73.9517496365803 | null |  |
| Safety | 311_All | 4/25/2021 2:03:40 AM | Illegal Parking | Double Parked Blocking Traffic | In Progress | 304 WEST 148 STREET | 40.8248229687124 | -73.940696262361 | null |  |
| Safety | 311_All | 4/25/2021 2:03:31 AM | Noise - Street/Sidewalk | Loud Music/Party | In Progress | ADEE AVENUE | 40.8708386263454 | -73.8382363208686 | null |  |
| Safety | 311_All | 4/25/2021 2:03:18 AM | Noise - Residential | Loud Music/Party | In Progress | 340 EVERGREEN AVENUE | 40.6947512704197 | -73.9248330229197 | null |  |
| Safety | 311_All | 4/25/2021 2:03:13 AM | Noise - Residential | Banging/Pounding | In Progress | 25 REMSEN STREET | 40.6948938116483 | -73.9973494607802 | null |  |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_sanfrancisco -->


```
# This is a package in preview.
from azureml.opendatasets import SanFranciscoSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = SanFranciscoSafety(start_date=start_date, end_date=end_date)
safety = safety.to_pandas_dataframe()
```

```
safety.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=city_safety_sanfrancisco -->


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
folder_name = "Safety/Release/city=SanFrancisco"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=city_safety_sanfrancisco -->


```
# This is a package in preview.
# You need to pip install azureml-opendatasets in Databricks cluster. https://learn.microsoft.com/azure/data-explorer/connect-from-databricks#install-the-python-library-on-your-azure-databricks-cluster
from azureml.opendatasets import SanFranciscoSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = SanFranciscoSafety(start_date=start_date, end_date=end_date)
safety = safety.to_spark_dataframe()
```

```
display(safety.limit(5))
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=city_safety_sanfrancisco -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=SanFrancisco"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=azureml-opendatasets&registryId=city_safety_sanfrancisco -->


```python
# This is a package in preview.
from azureml.opendatasets import SanFranciscoSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = SanFranciscoSafety(start_date=start_date, end_date=end_date)
safety = safety.to_spark_dataframe()
```

```python
# Display top 5 rows
display(safety.limit(5))
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=city_safety_sanfrancisco -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=SanFrancisco"
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
