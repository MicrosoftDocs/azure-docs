---
title: San Francisco Safety Data
description: Learn how to use the San Francisco Safety dataset in Azure Open Datasets.
ms.service: open-datasets
ms.custom: devx-track-python
ms.topic: sample
ms.date: 04/16/2021
---

# San Francisco Safety Data

Fire department calls for service and 311 cases in San Francisco.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

Fire Calls-For-Service includes all fire unit responses to calls. Each record includes the call number, incident number, address, unit identifier, call type, and disposition. All relevant time intervals are also included. Because this dataset is based on responses, and since most calls involved multiple units, there are multiple records for each call number. Addresses are associated with a block number, intersection, or call box, not a specific address.

311 Cases include cases associated with a place or thing (for example parks, streets, or buildings) and created after July 1, 2008. Cases that are logged by a user about their own needs are excluded. For example, property or business tax questions, parking permit requests, and so on. For more information, see the [Program Link](https://support.datasf.org/help/311-case-data-faq).
 
## Volume and retention

This dataset is stored in Parquet format. It is updated daily with about 6M rows (400 MB) as of 2019.

This dataset contains historical records accumulated from 2015 to the present. You can use parameter settings in our SDK to fetch data within a specific time range.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Related datasets

- [Fire Department Calls](https://data.sfgov.org/Public-Safety/Fire-Department-Calls-for-Service/nuek-vuh3)
- [311 Cases](https://data.sfgov.org/City-Infrastructure/311-Cases/vw6y-z8j6)

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| address | string | 280,652 | Not associated with a specific address 0 Block of 6TH ST | Address of incident (note: address and location generalized to mid-block of street, intersection, or nearest call box location, to protect caller privacy). |
| category | string | 108 | Street and Sidewalk Cleaning Potentially Life-Threatening | The human readable name of the 311 service request type or call type group for 911 fire calls. |
| dataSubtype | string | 2 | 911_Fire 311_All | “911_Fire” or “311_All”. |
| dataType | string | 1 | Safety | “Safety” |
| dateTime | timestamp | 6,496,563 | 2020-10-19 12:28:08 2020-07-28 06:40:26 | The date and time when the service request was made or when the fire call was received. |
| latitude | double | 1,615,369 | 37.777624238929 37.786117211838 | Latitude of the location, using the WGS84 projection. |
| longitude | double | 1,554,612 | -122.39998111124 -122.419854245692 | Longitude of the location, using the WGS84 projection. |
| source | string | 9 | Phone Mobile/Open311 | Mechanism or path by which the service request was received; typically “Phone”, “Text/SMS”, “Website”, “Mobile App”, “Twitter”, etc. but terms may vary by system. |
| status | string | 3 | Closed Open | A single-word indicator of the current state of the service request. (Note: GeoReport V2 only permits “open” and “closed”) |
| subcategory | string | 1,270 | Medical Incident Bulky Items | The human readable name of the service request subtype for 311 cases or call type for 911 fire calls. |

## Preview

| dataType | dataSubtype | dateTime | category | subcategory | status | address | latitude | longitude | source | extendedProperties |
|-|-|-|-|-|-|-|-|-|-|-|
| Safety | 911_Fire | 4/26/2021 2:56:13 AM | Non Life-threatening | Medical Incident | null | 700 Block of GEARY ST | 37.7863607914647 | -122.415616900246 | null |  |
| Safety | 911_Fire | 4/26/2021 2:56:13 AM | Non Life-threatening | Medical Incident | null | 700 Block of GEARY ST | 37.7863607914647 | -122.415616900246 | null |  |
| Safety | 911_Fire | 4/26/2021 2:54:03 AM | Non Life-threatening | Medical Incident | null | 0 Block of ESSEX ST | 37.7860048266229 | -122.395077258809 | null |  |
| Safety | 911_Fire | 4/26/2021 2:54:03 AM | Non Life-threatening | Medical Incident | null | 0 Block of ESSEX ST | 37.7860048266229 | -122.395077258809 | null |  |
| Safety | 911_Fire | 4/26/2021 2:52:17 AM | Non Life-threatening | Medical Incident | null | 700 Block of 29TH AVE | 37.7751770865322 | -122.488604397217 | null |  |
| Safety | 911_Fire | 4/26/2021 2:50:28 AM | Potentially Life-Threatening | Medical Incident | null | 1000 Block of GEARY ST | 37.7857350982044 | -122.420555240691 | null |  |
| Safety | 911_Fire | 4/26/2021 2:50:28 AM | Potentially Life-Threatening | Medical Incident | null | 1000 Block of GEARY ST | 37.7857350982044 | -122.420555240691 | null |  |
| Safety | 911_Fire | 4/26/2021 2:33:52 AM | Non Life-threatening | Medical Incident | null | 100 Block of BELVEDERE ST | 37.767791696654 | -122.449332294394 | null |  |
| Safety | 911_Fire | 4/26/2021 2:33:52 AM | Non Life-threatening | Medical Incident | null | 100 Block of BELVEDERE ST | 37.767791696654 | -122.449332294394 | null |  |
| Safety | 911_Fire | 4/26/2021 2:33:51 AM | Potentially Life-Threatening | Medical Incident | null | 100 Block of 6TH ST | 37.7807920802756 | -122.408385745499 | null |  |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_newyork -->


```
# This is a package in preview.
from azureml.opendatasets import NycSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = NycSafety(start_date=start_date, end_date=end_date)
safety = safety.to_pandas_dataframe()
```

```
safety.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=city_safety_newyork -->


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
folder_name = "Safety/Release/city=NewYorkCity"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=city_safety_newyork -->


```
# This is a package in preview.
# You need to pip install azureml-opendatasets in Databricks cluster. https://learn.microsoft.com/azure/data-explorer/connect-from-databricks#install-the-python-library-on-your-azure-databricks-cluster
from azureml.opendatasets import NycSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = NycSafety(start_date=start_date, end_date=end_date)
safety = safety.to_spark_dataframe()
```

```
display(safety.limit(5))
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=city_safety_newyork -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=NewYorkCity"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=azureml-opendatasets&registryId=city_safety_newyork -->


```python
# This is a package in preview.
from azureml.opendatasets import NycSafety

from datetime import datetime
from dateutil import parser

end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = NycSafety(start_date=start_date, end_date=end_date)
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=city_safety_newyork -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=NewYorkCity"
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
