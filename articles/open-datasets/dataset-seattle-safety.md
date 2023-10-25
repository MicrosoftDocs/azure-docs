---
title: Seattle Safety Data
description: Learn how to use the Seattle Safety dataset in Azure Open Datasets.
ms.service: open-datasets
ms.custom: devx-track-python
ms.topic: sample
ms.date: 04/16/2021
---

# Seattle Safety Data

Seattle Fire Department 911 dispatches.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Volume and retention

This dataset is stored in Parquet format. It's updated daily, and contains about 800,000 rows (20 MB) in 2019.

This dataset contains historical records accumulated from 2010 to the present. You can use parameter settings in our SDK to fetch data within a specific time range.

## Storage location

This dataset is stored in the East US Azure region. We recommend locating compute resources in East US for affinity.

## Additional information

This dataset is sourced from city of Seattle government. For more information, see the [city of Seattle website](http://www.seattle.gov/). View the [Licensing and Attribution for the terms of using this dataset](https://creativecommons.org/publicdomain/zero/1.0/legalcode). Email open.data@seattle.gov if you have any questions about the data source.

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| address | string | 196,965 | 517 3rd Av 318 2nd Av Et S | Location of Incident. |
| category | string | 232 | Aid Response Medic Response | Response Type. |
| dataSubtype | string | 1 | 911_Fire | “911_Fire” |
| dataType | string | 1 | Safety | “Safety” |
| dateTime | timestamp | 1,533,401 | 2020-11-04 06:49:00 2019-06-19 13:49:00 | The date and time of the call. |
| latitude | double | 94,332 | 47.602172 47.600194 | This is the latitude value. Lines of latitude are parallel to the equator. |
| longitude | double | 79,492 | -122.330863 -122.330541 | This is the longitude value. Lines of longitude run perpendicular to lines of latitude, and all pass through both poles. |

## Preview

| dataType | dataSubtype | dateTime | category | subcategory | status | address | latitude | longitude | source | extendedProperties |
|-|-|-|-|-|-|-|-|-|-|-|
| Safety | 911_Fire | 4/28/2021 5:22:00 AM | Rubbish Fire | null | null | 200 University St | 47.607299 | -122.337087 | null |  |
| Safety | 911_Fire | 4/28/2021 5:15:00 AM | Triaged Incident | null | null | 6th Ave / Olive Way | 47.61313 | -122.336282 | null |  |
| Safety | 911_Fire | 4/28/2021 5:12:00 AM | Aid Response | null | null | 4th Ave S / Seattle Blvd S | 47.596486 | -122.329046 | null |  |
| Safety | 911_Fire | 4/28/2021 5:09:00 AM | Rubbish Fire | null | null | 3rd Ave / University St | 47.607763 | -122.335976 | null |  |
| Safety | 911_Fire | 4/28/2021 4:57:00 AM | Low Acuity Response | null | null | 533 3rd Ave W | 47.623717 | -122.360635 | null |  |
| Safety | 911_Fire | 4/28/2021 4:57:00 AM | Trans to AMR | null | null | 4638 S Austin St | 47.534702 | -122.274812 | null |  |
| Safety | 911_Fire | 4/28/2021 4:55:00 AM | Triaged Incident | null | null | 8th Ave N / Harrison St | 47.622051 | -122.341066 | null |  |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_seattle -->

> [!TIP]
> Contents of _DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_seattle_. **[Open in GitHub](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_seattle)**.

```
# This is a package in preview.
from azureml.opendatasets import SeattleSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = SeattleSafety(start_date=start_date, end_date=end_date)
safety = safety.to_pandas_dataframe()
```

```
safety.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=city_safety_seattle -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=city_safety_seattle)**.

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
folder_name = "Safety/Release/city=Seattle"
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

# [SQL](#tab/sql)

Sample not available for this platform/package combination.

---

### Azure Databricks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=city_safety_seattle -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=city_safety_seattle)**.

```
# This is a package in preview.
# You need to pip install azureml-opendatasets in Databricks cluster. https://learn.microsoft.com/azure/data-explorer/connect-from-databricks#install-the-python-library-on-your-azure-databricks-cluster
from azureml.opendatasets import SeattleSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = SeattleSafety(start_date=start_date, end_date=end_date)
safety = safety.to_spark_dataframe()
```

```
display(safety.limit(5))
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=city_safety_seattle -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=city_safety_seattle)**.

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=Seattle"
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

# [SQL](#tab/sql)

Sample not available for this platform/package combination.

---

### Azure Synapse

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=azureml-opendatasets&registryId=city_safety_seattle -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=azureml-opendatasets&registryId=city_safety_seattle)**.

```python
# This is a package in preview.
from azureml.opendatasets import SeattleSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = SeattleSafety(start_date=start_date, end_date=end_date)
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=city_safety_seattle -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=city_safety_seattle)**.

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=Seattle"
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

# [SQL](#tab/sql)

```sql
SELECT
    TOP 100 *
FROM
    OPENROWSET(
        BULK             'https://azureopendatastorage.blob.core.windows.net/citydatacontainer/Safety/Release/city=Seattle/*.parquet',
        FORMAT         = 'parquet'
    ) AS [r];
```

---

## Examples

- See the [City Safety Analytics](https://github.com/scottcounts/CitySafety) example on GitHub.


## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
