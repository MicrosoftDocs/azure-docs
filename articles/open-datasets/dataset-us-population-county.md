---
title: US Population by County
description: Learn how to use the US Population by County dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# US Population by County

US population by gender and race for each US county sourced from 2000 and 2010 Decennial Census.

This dataset is sourced from United States Census Bureau’s [Decennial Census Dataset APIs](https://www.census.gov/data/developers/data-sets/decennial-census.html). Review [Terms of Service](https://www.census.gov/data/developers/about/terms-of-service.html) and [Policies and Notices](https://www.census.gov/about/policies.html) for the terms and conditions related to the use this dataset.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Volume and retention

This dataset is stored in Parquet format and has data for the year 2000 and 2010.

## Storage location
This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Related datasets

- [US Population by ZIP Code](dataset-us-population-zip.md)

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| countyName | string | 1,960 | Washington County Jefferson County | County name. |
| decennialTime | string | 2 | 2010 2000 | The time of the decennial census happened, for example, 2010, 2000. |
| maxAge | int | 23 | 9 66 | Max of the age range. If it’s null, it’s across all ages or the age range has no upper bound, for example, age > 85. |
| minAge | int | 23 | 35 67 | Min of the age range. If it’s null, it’s across all ages. |
| population | int | 47,229 | 1 2 | Population of this segment. |
| race | string | 8 | ASIAN ALONE TWO OR MORE RACES | Race category in Census data. If it’s null, it’s across all races. |
| sex | string | 3 | Male Female | Male or female. If it’s null, it’s across both sexes. |
| stateName | string | 52 | Texas Georgia | Name of the state in US. |
| year | int | 2 | 2010 2000 | Year (in integer) of the decennial time. |

## Preview

| decennialTime | stateName | countyName | population | race | sex | minAge | maxAge | year |
|-|-|-|-|-|-|-|-|-|
| 2010 | Texas | Crockett County | 123 | WHITE ALONE | Male | 5 | 9 | 2010 |
| 2010 | Texas | Crockett County | 1 | ASIAN ALONE | Female | 67 | 69 | 2010 |
| 2010 | Texas | Crockett County | 111 | WHITE ALONE | Female | 55 | 59 | 2010 |
| 2010 | Texas | Crockett County | 64 | TWO OR MORE RACES | null |  |  | 2010 |
| 2010 | Texas | Crockett County | 18 | null | Male | 85 |  | 2010 |
| 2010 | Texas | Crockett County | 16 | AMERICAN INDIAN AND ALASKA NATIVE ALONE | Female |  |  | 2010 |
| 2010 | Texas | Crockett County | 7 | WHITE ALONE | Male | 21 | 21 | 2010 |
| 2010 | Texas | Crockett County | 45 | null | Female | 85 |  | 2010 |
| 2010 | Texas | Crockett County | 0 | NATIVE HAWAIIAN AND OTHER PACIFIC ISLANDER ALONE | Female | 67 | 69 | 2010 |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=us-decennial-census-county -->


```python
# This is a package in preview.
from azureml.opendatasets import UsPopulationCounty

population = UsPopulationCounty()
population_df = population.to_pandas_dataframe()
```

```python
population_df.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=us-decennial-census-county -->


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
container_name = "censusdatacontainer"
folder_name = "release/us_population_county/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=us-decennial-census-county -->


```python
# This is a package in preview.
from azureml.opendatasets import UsPopulationCounty

population = UsPopulationCounty()
population_df = population.to_spark_dataframe()
```

```python
display(population_df.limit(5))
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=us-decennial-census-county -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "censusdatacontainer"
blob_relative_path = "release/us_population_county/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=azureml-opendatasets&registryId=us-decennial-census-county -->


```python
# This is a package in preview.
from azureml.opendatasets import UsPopulationCounty

population = UsPopulationCounty()
population_df = population.to_spark_dataframe()
```

```python
# Display top 5 rows
display(population_df.limit(5))
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=us-decennial-census-county -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "censusdatacontainer"
blob_relative_path = "release/us_population_county/"
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