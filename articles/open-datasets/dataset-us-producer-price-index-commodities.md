---
title: US Producer Price Index - Commodities
description: Learn how to use the US Producer Price Index - Commodities dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# US Producer Price Index - Commodities

The Producer Price Index (PPI) is a measure of average change over time in the selling prices received by domestic producers for their output. The prices included in the PPI are from the first commercial transaction for products and services covered.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

About 10,000 PPIs for individual products and groups of products are released each month. PPIs are available for the output of nearly all industries in the goods-producing sectors of the U.S. economy–mining, manufacturing, agriculture, fishing, and forestry–as well as natural gas, electricity, construction, and goods competitive with those made in the producing sectors, such as waste and scrap materials. The PPI program covers approximately 72 percent of the service sector’s output, as measured by revenue reported in the 2007 Economic Census. Data includes industries in the following sectors: wholesale and retail trade; transportation and warehousing; information; finance and insurance; real estate brokering, rental, and leasing; professional, scientific, and technical services; administrative, support, and waste management services; health care and social assistance; and accommodation.

[README](https://download.bls.gov/pub/time.series/wp/wp.txt) containing file for detailed information about this dataset is available at [original dataset location](https://download.bls.gov/pub/time.series/wp/). Additional information is available in the [FAQs](https://www.bls.gov/ppi/ppifaq.htm).

This dataset is produced from the [Producer Price Indexes data](https://www.bls.gov/ppi/) published by [US Bureau of Labor Statistics (BLS)](https://www.bls.gov/). Review [Linking and Copyright Information](https://www.bls.gov/bls/linksite.htm) and [Important Web Site Notices](https://www.bls.gov/bls/website-policies.htm) for the terms and conditions related to the use this dataset.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Related datasets

- [US Consumer Price Index](dataset-us-consumer-price-index.md)
- [US Producer Price Index - Industry](dataset-us-producer-price-index-industry.md)

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| footnote_codes | string | 3 | nan P | Identifies footnotes for the data series. Most values are null. See https://download.bls.gov/pub/time.series/wp/wp.footnote. |
| group_code | string | 56 | 02 01 | Code identifying major commodity group covered by the index. See https://download.bls.gov/pub/time.series/wp/wp.group for group codes and names. |
| group_name | string | 56 | Processed foods and feeds Farm products | Name of the major commodity group covered by the index. See https://download.bls.gov/pub/time.series/wp/wp.group for group codes and names. |
| item_code | string | 2,949 | 1 11 | Identifies item for which data observations pertain. See https://download.bls.gov/pub/time.series/wp/wp.item for item codes and names. |
| item_name | string | 3,410 | Warehousing, storage, and related services Passenger car rental | Full names of items. See https://download.bls.gov/pub/time.series/wp/wp.item for item codes and names. |
| period | string | 13 | M06 M07 | Identifies period for which data is observed. See https://download.bls.gov/pub/time.series/wp/wp.period for list of period values. |
| seasonal | string | 2 | U S | Code identifying whether the data are seasonally adjusted. S=Seasonally Adjusted; U=Unadjusted |
| series_id | string | 5,458 | WPU101 WPU091 | Code identifying the specific series. A time series refers to a set of data observed over an extended period of time over consistent time intervals. See https://download.bls.gov/pub/time.series/wp/wp.series for details of series such as code, name, start and end year, etc. |
| series_title | string | 4,379 | PPI Commodity data for Mining services, not seasonally adjusted PPI Commodity data for Metal treatment services, not seasonally adjusted | Title of the specific series. A time series refers to a set of data observed over an extended period of time over consistent time intervals. See https://download.bls.gov/pub/time.series/wp/wp.series for details of series such as ID, name, start and end year, etc. |
| value | float | 6,788 | 100.0 99.0999984741211 | Price index for item. |
| year | int | 26 | 2018 2017 | Identifies year of observation. |

## Preview

| item_code | group_code | series_id | year | period | value | footnote_codes | seasonal | series_title | group_name | item_name |
|-|-|-|-|-|-|-|-|-|-|-|
| 120922 | 05 | WPU05120922 | 2008 | M06 | 100 | nan | U | PPI Commodity data for Fuels and related products and power-Prepared bituminous coal underground mine, mechanically crushed/screened/sized only, not seasonally adjusted | Fuels and related products and power | Prepared bituminous coal underground mine, mechanically crushed/screened/sized only |
| 120922 | 05 | WPU05120922 | 2008 | M07 | 104.6 | nan | U | PPI Commodity data for Fuels and related products and power-Prepared bituminous coal underground mine, mechanically crushed/screened/sized only, not seasonally adjusted | Fuels and related products and power | Prepared bituminous coal underground mine, mechanically crushed/screened/sized only |
| 120922 | 05 | WPU05120922 | 2008 | M08 | 104.4 | nan | U | PPI Commodity data for Fuels and related products and power-Prepared bituminous coal underground mine, mechanically crushed/screened/sized only, not seasonally adjusted | Fuels and related products and power | Prepared bituminous coal underground mine, mechanically crushed/screened/sized only |
| 120922 | 05 | WPU05120922 | 2008 | M09 | 98.3 | nan | U | PPI Commodity data for Fuels and related products and power-Prepared bituminous coal underground mine, mechanically crushed/screened/sized only, not seasonally adjusted | Fuels and related products and power | Prepared bituminous coal underground mine, mechanically crushed/screened/sized only |
| 120922 | 05 | WPU05120922 | 2008 | M10 | 101.5 | nan | U | PPI Commodity data for Fuels and related products and power-Prepared bituminous coal underground mine, mechanically crushed/screened/sized only, not seasonally adjusted | Fuels and related products and power | Prepared bituminous coal underground mine, mechanically crushed/screened/sized only |
| 120922 | 05 | WPU05120922 | 2008 | M11 | 95.2 | nan | U | PPI Commodity data for Fuels and related products and power-Prepared bituminous coal underground mine, mechanically crushed/screened/sized only, not seasonally adjusted | Fuels and related products and power | Prepared bituminous coal underground mine, mechanically crushed/screened/sized only |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=us-producer-price-index-commodities -->


```python
# This is a package in preview.
from azureml.opendatasets import UsLaborPPICommodity

labor = UsLaborPPICommodity()
labor_df = labor.to_pandas_dataframe()
```

```python
labor_df.info()
```

<!-- nbend -->


# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=us-producer-price-index-commodities -->


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
folder_name = "ppi_commodity/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=us-producer-price-index-commodities -->


```python
# This is a package in preview.
from azureml.opendatasets import UsLaborPPICommodity

labor = UsLaborPPICommodity()
labor_df = labor.to_spark_dataframe()
```

```python
display(labor_df.limit(5))
```

<!-- nbend -->
 
# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=us-producer-price-index-commodities -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "ppi_commodity/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=us-producer-price-index-commodities -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "ppi_commodity/"
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