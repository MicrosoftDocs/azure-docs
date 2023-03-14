---
title: US Consumer Price Index
description: Learn how to use the US Consumer Price Index dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# US Consumer Price Index

The Consumer Price Index (CPI) is a measure of the average change over time in the prices paid by urban consumers for a market basket of consumer goods and services.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

[README](https://download.bls.gov/pub/time.series/cu/cu.txt) containing file for detailed information about this dataset is available at [original dataset location](https://download.bls.gov/pub/time.series/cu/).

This dataset is produced from the [Consumer Price Index data](https://www.bls.gov/cpi/), which is published by [US Bureau of Labor Statistics (BLS)](https://www.bls.gov/). Review [Linking and Copyright Information](https://www.bls.gov/bls/linksite.htm) and [Important Web Site Notices](https://www.bls.gov/bls/website-policies.htm) for the terms and conditions.

## Storage location

This dataset is stored in the East US Azure region. We recommend locating compute resources in East US for affinity.

## Related datasets

- [US Producer Price Index - Industry](dataset-us-producer-price-index-industry.md)
- [US Producer Price Index - Commodities](dataset-us-producer-price-index-commodities.md)

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| area_code | string | 70 | 0000 0300 | Unique code used to identify a specific geographic area. Full area codes found here: http://download.bls.gov/pub/time.series/cu/cu.area |
| area_name | string | 69 | U.S. city average South | Name of specific geographic area. See https://download.bls.gov/pub/time.series/cu/cu.area for all area names and codes. |
| footnote_codes | string | 3 | nan U | Identifies footnote for the data series. Most values are null. |
| item_code | string | 515 | SA0E SAF11 | Identifies item for which data observations pertain. See https://download.bls.gov/pub/time.series/cu/cu.item for all item names and codes. |
| item_name | string | 515 | Energy Food at home | Full names of items. See https://download.bls.gov/pub/time.series/cu/cu.txt for item names and codes. |
| period | string | 16 | S01 S02 | Identifies period for which data is observed. Format: M01-M13 or S01-S03 (M=Monthly, M13=Annual Avg, S=Semi-Annually). Ex: M06=June. See https://download.bls.gov/pub/time.series/cu/cu.period for period names and codes. |
| periodicity_code | string | 3 | R S | Frequency of data observation. S=Semi-Annual; R=Regular. |
| seasonal | string | 1,043 | U S | Code identifying whether the data is seasonally adjusted. S=Seasonally Adjusted; U=Unadjusted. |
| series_id | string | 16,683 | CWURS400SA0E CWUR0100SA0E | Code identifying the specific series. A time series refers to a set of data observed over an extended period of time over consistent time intervals (that is, monthly, quarterly, semi-annually, annually). BLS time series data are typically produced at monthly intervals and represent data ranging from a specific consumer item in a specific geographical area whose price is gathered monthly to a category of worker in a specific industry whose employment rate is being recorded monthly, and so on. For more information, see https://download.bls.gov/pub/time.series/cu/cu.txt |
| series_title | string | 8,336 | Alcoholic drinks in U.S. city average, all urban consumers, not seasonally adjusted Transportation in Los Angeles-Long Beach-Anaheim, CA, all urban consumers, not seasonally adjusted | Series name of the corresponding series_id. See https://download.bls.gov/pub/time.series/cu/cu.series for series ids and names. |
| value | float | 310,603 | 100.0 101.0999984741211 | Price index for item. |
| year | int | 25 | 2018 2017 | Identifies year of observation. |

## Preview

| area_code | item_code | series_id | year | period | value | footnote_codes | seasonal | periodicity_code | series_title | item_name | area_name |
|-|-|-|-|-|-|-|-|-|-|-|-|
| S49E | SEHF01 | CUURS49ESEHF01 | 2017 | M12 | 279.974 | nan | U | R | Electricity in San Diego-Carlsbad, CA, all urban consumers, not seasonally adjusted | Electricity | San Diego-Carlsbad, CA |
| S49E | SEHF01 | CUURS49ESEHF01 | 2017 | M12 | 279.974 | nan | U | R | Electricity in San Diego-Carlsbad, CA, all urban consumers, not seasonally adjusted | Electricity | San Diego-Carlsbad, CA |
| S49E | SEHF01 | CUURS49ESEHF01 | 2017 | M12 | 279.974 | nan | U | R | Electricity in San Diego-Carlsbad, CA, all urban consumers, not seasonally adjusted | Electricity | San Diego-Carlsbad, CA |
| S49E | SEHF01 | CUURS49ESEHF01 | 2017 | M12 | 279.974 | nan | U | R | Electricity in San Diego-Carlsbad, CA, all urban consumers, not seasonally adjusted | Electricity | San Diego-Carlsbad, CA |
| S49E | SEHF01 | CUURS49ESEHF01 | 2017 | M12 | 279.974 | nan | U | R | Electricity in San Diego-Carlsbad, CA, all urban consumers, not seasonally adjusted | Electricity | San Diego-Carlsbad, CA |
| S49E | SEHF01 | CUURS49ESEHF01 | 2017 | M12 | 279.974 | nan | U | R | Electricity in San Diego-Carlsbad, CA, all urban consumers, not seasonally adjusted | Electricity | San Diego-Carlsbad, CA |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=us-consumer-price-index -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=us-consumer-price-index)**.

```python
# This is a package in preview.
from azureml.opendatasets import UsLaborCPI

usLaborCPI = UsLaborCPI()
usLaborCPI_df = usLaborCPI.to_pandas_dataframe()
```

```python
usLaborCPI_df.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=us-consumer-price-index -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=us-consumer-price-index)**.

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
folder_name = "cpi/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=us-consumer-price-index -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=us-consumer-price-index)**.

```python
# This is a package in preview.
from azureml.opendatasets import UsLaborCPI

usLaborCPI = UsLaborCPI()
usLaborCPI_df = usLaborCPI.to_spark_dataframe()
```

```python
display(usLaborCPI_df.limit(5))
```

<!-- nbend -->
 
# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=us-consumer-price-index -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=us-consumer-price-index)**.

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "cpi/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=us-consumer-price-index -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=us-consumer-price-index)**.

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "cpi/"
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