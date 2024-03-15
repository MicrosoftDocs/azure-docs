---
title: US National Employment Hours and Earnings
description: Learn how to use the US National Employment Hours and Earnings dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# US National Employment Hours and Earnings

The Current Employment Statistics (CES) program produces detailed industry estimates of nonfarm employment, hours, and earnings of workers on payrolls in the United States.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

[README](https://download.bls.gov/pub/time.series/ce/ce.txt) containing file for detailed information about this dataset is available at the [original dataset location](https://download.bls.gov/pub/time.series/ce/).

This dataset is sourced from [Current Employment Statistics - CES (National) data](https://www.bls.gov/ces/) published by [US Bureau of Labor Statistics (BLS)](https://www.bls.gov/). Review [Linking and Copyright Information](https://www.bls.gov/bls/linksite.htm) and [Important Web Site Notices](https://www.bls.gov/bls/website-policies.htm) for the terms and conditions related to the use this dataset.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Related datasets

- [US State Employment Hours and Earnings](dataset-us-state-employment-earnings.md)
- [US Local Area Unemployment Statistics](dataset-us-local-unemployment.md)
- [US Labor Force Statistics](dataset-us-labor-force.md)

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| data_type_code | string | 37 | 1 10 | See https://download.bls.gov/pub/time.series/ce/ce.datatype |
| data_type_text | string | 37 | ALL EMPLOYEES, THOUSANDS WOMEN EMPLOYEES, THOUSANDS | See https://download.bls.gov/pub/time.series/ce/ce.datatype |
| footnote_codes | string | 2 | nan P |  |
| industry_code | string | 902 | 30000000 32000000 | Different industries covered. See https://download.bls.gov/pub/time.series/ce/ce.industry |
| industry_name | string | 895 | Nondurable goods Durable goods | Different industries covered. See https://download.bls.gov/pub/time.series/ce/ce.industry |
| period | string | 13 | M03 M06 | See https://download.bls.gov/pub/time.series/ce/ce.period |
| seasonal | string | 2 | U S |  |
| series_id | string | 26,021 | CEU3100000008 CEU9091912001 | Different types of data series available in the dataset. See https://download.bls.gov/pub/time.series/ce/ce.series |
| series_title | string | 25,685 | All employees, thousands, durable goods, not seasonally adjusted All employees, thousands, nondurable goods, not seasonally adjusted | Title of the different types of data series available in the dataset. See https://download.bls.gov/pub/time.series/ce/ce.series |
| supersector_code | string | 22 | 31 60 | Higher-level industry or sector classification. See https://download.bls.gov/pub/time.series/ce/ce.supersector |
| supersector_name | string | 22 | Durable Goods Professional and business services | Higher-level industry or sector classification. See https://download.bls.gov/pub/time.series/ce/ce.supersector |
| value | float | 572,372 | 38.5 38.400001525878906 |  |
| year | int | 81 | 2017 2012 |  |

## Preview

| data_type_code | industry_code | supersector_code | series_id | year | period | value | footnote_codes | seasonal | series_title | supersector_name | industry_name | data_type_text |
|-|-|-|-|-|-|-|-|-|-|-|-|-|
| 26 | 5000000 | 5 | CES0500000026 | 1939 | M04 | 52 | nan | S | All employees, 3-month average change, seasonally adjusted, thousands, total private, seasonally adjusted | Total private | Total private | ALL EMPLOYEES, 3-MONTH AVERAGE CHANGE, SEASONALLY ADJUSTED, THOUSANDS |
| 26 | 5000000 | 5 | CES0500000026 | 1939 | M05 | 65 | nan | S | All employees, 3-month average change, seasonally adjusted, thousands, total private, seasonally adjusted | Total private | Total private | ALL EMPLOYEES, 3-MONTH AVERAGE CHANGE, SEASONALLY ADJUSTED, THOUSANDS |
| 26 | 5000000 | 5 | CES0500000026 | 1939 | M06 | 74 | nan | S | All employees, 3-month average change, seasonally adjusted, thousands, total private, seasonally adjusted | Total private | Total private | ALL EMPLOYEES, 3-MONTH AVERAGE CHANGE, SEASONALLY ADJUSTED, THOUSANDS |
| 26 | 5000000 | 5 | CES0500000026 | 1939 | M07 | 103 | nan | S | All employees, 3-month average change, seasonally adjusted, thousands, total private, seasonally adjusted | Total private | Total private | ALL EMPLOYEES, 3-MONTH AVERAGE CHANGE, SEASONALLY ADJUSTED, THOUSANDS |
| 26 | 5000000 | 5 | CES0500000026 | 1939 | M08 | 108 | nan | S | All employees, 3-month average change, seasonally adjusted, thousands, total private, seasonally adjusted | Total private | Total private | ALL EMPLOYEES, 3-MONTH AVERAGE CHANGE, SEASONALLY ADJUSTED, THOUSANDS |
| 26 | 5000000 | 5 | CES0500000026 | 1939 | M09 | 152 | nan | S | All employees, 3-month average change, seasonally adjusted, thousands, total private, seasonally adjusted | Total private | Total private | ALL EMPLOYEES, 3-MONTH AVERAGE CHANGE, SEASONALLY ADJUSTED, THOUSANDS |
| 26 | 5000000 | 5 | CES0500000026 | 1939 | M10 | 307 | nan | S | All employees, 3-month average change, seasonally adjusted, thousands, total private, seasonally adjusted | Total private | Total private | ALL EMPLOYEES, 3-MONTH AVERAGE CHANGE, SEASONALLY ADJUSTED, THOUSANDS |
| 26 | 5000000 | 5 | CES0500000026 | 1939 | M11 | 248 | nan | S | All employees, 3-month average change, seasonally adjusted, thousands, total private, seasonally adjusted | Total private | Total private | ALL EMPLOYEES, 3-MONTH AVERAGE CHANGE, SEASONALLY ADJUSTED, THOUSANDS |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=us-employment-hours-earnings-national -->

```python
# This is a package in preview.
from azureml.opendatasets import UsLaborEHENational

usLaborEHENational = UsLaborEHENational()
usLaborEHENational_df = usLaborEHENational.to_pandas_dataframe()
```

```python
usLaborEHENational_df.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=us-employment-hours-earnings-national -->


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
folder_name = "ehe_national/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=us-employment-hours-earnings-national -->


```python
# This is a package in preview.
from azureml.opendatasets import UsLaborEHENational

usLaborEHENational = UsLaborEHENational()
usLaborEHENational_df = usLaborEHENational.to_spark_dataframe()
```

```python
display(usLaborEHENational_df.limit(5))
```

<!-- nbend -->
 
# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=us-employment-hours-earnings-national -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "ehe_national/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=us-employment-hours-earnings-national -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "ehe_national/"
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
