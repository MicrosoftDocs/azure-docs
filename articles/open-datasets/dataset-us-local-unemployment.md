---
title: US Local Area Unemployment Statistics
description: Learn how to use the US Local Area Unemployment Statistics dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# US Local Area Unemployment Statistics

The Local Area Unemployment Statistics (LAUS) program produces monthly and annual employment, unemployment, and labor force data for Census regions and divisions, States, counties, metropolitan areas, and many cities in the United States.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

[README](https://download.bls.gov/pub/time.series/la/la.txt) containing file for detailed information about this dataset is available at [original dataset location](https://download.bls.gov/pub/time.series/la/).

This dataset is sourced from [Local Area Unemployment Statistics data](https://www.bls.gov/lau/) published by [US Bureau of Labor Statistics (BLS)](https://www.bls.gov/). Review [Linking and Copyright Information](https://www.bls.gov/bls/linksite.htm) and [Important Web Site Notices](https://www.bls.gov/bls/website-policies.htm) for the terms and conditions related to the use this dataset.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Related datasets

- [US National Employment Hours and Earnings](dataset-us-national-employment-earnings.md)
- [US State Employment Hours and Earnings](dataset-us-state-employment-earnings.md)
- [US Labor Force Statistics](dataset-us-labor-force.md)

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| area_code | string | 8,290 | ST3400000000000 RD8200000000000 | Code identifying the geographic area. See https://download.bls.gov/pub/time.series/la/la.area. |
| area_text | string | 8,238 | District of Columbia Oregon | Name of the geographic area. See https://download.bls.gov/pub/time.series/la/la.area |
| area_type_code | string | 14 | F G | Unique code defining the type of area. See https://download.bls.gov/pub/time.series/la/la.area_type |
| areatype_text | string | 14 | Counties and equivalents Cities and towns above 25,000 population | Name of the area type. |
| footnote_codes | string | 5 | nan P |  |
| measure_code | string | 4 | 5 4 | Code identifying element measured. 03: unemployment rate, 04: unemployment, 05: employment, 06: labor force. See https://download.bls.gov/pub/time.series/la/la.measure. |
| measure_text | string | 4 | employment unemployment | Name of element measured. See https://download.bls.gov/pub/time.series/la/la.measure |
| period | string | 13 | M07 M05 | Identifies period, typically the month. See https://download.bls.gov/pub/time.series/la/la.period |
| seasonal | string | 2 | U S |  |
| series_id | string | 33,476 | LASST160000000000006 LASST200000000000006 | Code identifying the series. See https://download.bls.gov/pub/time.series/la/la.series for complete list of series. |
| series_title | string | 33,268 | Employment: Philadelphia County/city, PA (U) Labor Force: Manassas city, VA (U) | Title identifying the series. See https://download.bls.gov/pub/time.series/la/la.series for complete list of series. |
| srd_code | string | 53 | 48 23 | State, region, or division code. |
| srd_text | string | 53 | Texas Maine |  |
| value | float | 600,099 | 4.0 5.0 | Value for the specific measure. |
| year | int | 44 | 2009 2008 |  |

## Preview

| area_code | area_type_code | srd_code | measure_code | series_id | year | period | value | footnote_codes | seasonal | series_title | measure_text | srd_text | areatype_text | area_text |
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
| CA3653200000000 | E | 36 | 3 | LAUCA365320000000003 | 2000 | M01 | 4.7 | nan | U | Unemployment Rate: Syracuse-Auburn, NY Combined Statistical Area (U) | unemployment rate | New York | Combined areas | Syracuse-Auburn, NY Combined Statistical Area |
| CA3653200000000 | E | 36 | 3 | LAUCA365320000000003 | 2000 | M02 | 4.7 | nan | U | Unemployment Rate: Syracuse-Auburn, NY Combined Statistical Area (U) | unemployment rate | New York | Combined areas | Syracuse-Auburn, NY Combined Statistical Area |
| CA3653200000000 | E | 36 | 3 | LAUCA365320000000003 | 2000 | M03 | 4.2 | nan | U | Unemployment Rate: Syracuse-Auburn, NY Combined Statistical Area (U) | unemployment rate | New York | Combined areas | Syracuse-Auburn, NY Combined Statistical Area |
| CA3653200000000 | E | 36 | 3 | LAUCA365320000000003 | 2000 | M04 | 3.6 | nan | U | Unemployment Rate: Syracuse-Auburn, NY Combined Statistical Area (U) | unemployment rate | New York | Combined areas | Syracuse-Auburn, NY Combined Statistical Area |
| CA3653200000000 | E | 36 | 3 | LAUCA365320000000003 | 2000 | M05 | 3.6 | nan | U | Unemployment Rate: Syracuse-Auburn, NY Combined Statistical Area (U) | unemployment rate | New York | Combined areas | Syracuse-Auburn, NY Combined Statistical Area |
| CA3653200000000 | E | 36 | 3 | LAUCA365320000000003 | 2000 | M06 | 3.6 | nan | U | Unemployment Rate: Syracuse-Auburn, NY Combined Statistical Area (U) | unemployment rate | New York | Combined areas | Syracuse-Auburn, NY Combined Statistical Area |
| CA3653200000000 | E | 36 | 3 | LAUCA365320000000003 | 2000 | M07 | 3.6 | nan | U | Unemployment Rate: Syracuse-Auburn, NY Combined Statistical Area (U) | unemployment rate | New York | Combined areas | Syracuse-Auburn, NY Combined Statistical Area |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=us-local-area-unemployment-statistics -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=us-local-area-unemployment-statistics)**.

```python
# This is a package in preview.
from azureml.opendatasets import UsLaborLAUS

usLaborLAUS = UsLaborLAUS()
usLaborLAUS_df = usLaborLAUS.to_pandas_dataframe()
```

```python
usLaborLAUS_df.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=us-local-area-unemployment-statistics -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=us-local-area-unemployment-statistics)**.

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
container_name = "laborstatisticscontainer"
folder_name = "laus/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=us-local-area-unemployment-statistics -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=us-local-area-unemployment-statistics)**.

```python
# This is a package in preview.
from azureml.opendatasets import UsLaborLAUS

usLaborLAUS = UsLaborLAUS()
usLaborLAUS_df = usLaborLAUS.to_spark_dataframe()
```

```python
display(usLaborLAUS_df.limit(5))
```

<!-- nbend -->

 
# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=us-local-area-unemployment-statistics -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=us-local-area-unemployment-statistics)**.

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "laus/"
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

Sample not available for this platform/package combination.

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=us-local-area-unemployment-statistics -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=us-local-area-unemployment-statistics)**.

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "laus/"
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

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).