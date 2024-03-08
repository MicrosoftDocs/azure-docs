---
title: US Producer Price Index industry
description: Learn how to use the US Producer Price Index industry dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# US Consumer Price Index industry

The Producer Price Index (PPI) is a measure of average change over time in the selling prices received by domestic producers for their output. The prices included in the PPI are from the first commercial transaction for products and services covered.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

The Producer Price Index Revision-Current Series indexes reflect price movements for the net output of producers organized according to the North American Industry Classification System (NAICS). The PC dataset is compatible with a wide assortment of NAICS-based economic time series including: productivity, production, employment, wages, and earnings.

The PPI universe consists of the output of all industries in the goods-producing sectors of the U.S. economy- mining, manufacturing, agriculture, fishing, and forestry- as well as natural gas, electricity, construction, and goods competitive with those made in the producing sectors, such as waste and scrap materials. In addition, as of January 2011, the PPI program covered more than three-quarters of the service sector’s output, publishing data for selected industries in the following industry sectors: wholesale and retail trade; transportation and warehousing; information; finance and insurance; real estate brokering, rental, and leasing; professional, scientific, and technical services; administrative, support, and waste management services; health care and social assistance; and accommodation.

[README](https://download.bls.gov/pub/time.series/wp/wp.txt) containing file for detailed information about this dataset is available at [original dataset location](https://download.bls.gov/pub/time.series/wp/). Additional information is available in the [FAQs](https://www.bls.gov/ppi/ppifaq.htm).

This dataset is produced from the [Producer Price Indexes data](https://www.bls.gov/ppi/) published by [US Bureau of Labor Statistics (BLS)](https://www.bls.gov/). Review [Linking and Copyright Information](https://www.bls.gov/bls/linksite.htm) and [Important Web Site Notices](https://www.bls.gov/bls/website-policies.htm) for the terms and conditions related to the use this dataset.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Related datasets

- [US Consumer Price Index](dataset-us-consumer-price-index.md)
- [US Producer Price Index - Commodities](dataset-us-producer-price-index-commodities.md)

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| footnote_codes | string | 3 | nan P | Identifies footnotes for the data series. Most values are null. See https://download.bls.gov/pub/time.series/pc/pc.footnote. |
| industry_code | string | 1,064 | 221122 325412 | NAICS code for the industry. See https://download.bls.gov/pub/time.series/pc/pc.industry for codes and names. |
| industry_name | string | 842 | Electric power distribution Pharmaceutical preparation manufacturing | Name corresponding to the code for the industry. See https://download.bls.gov/pub/time.series/pc/pc.industry for codes and names. |
| period | string | 13 | M06 M07 | Identifies period for which data is observed. See https://download.bls.gov/pub/time.series/pc/pc.period for full list. |
| product_code | string | 4,822 | 324121P 316--- | Code identifying the product to which the data observation refers. See https://download.bls.gov/pub/time.series/pc/pc.product for mapping of industry codes, product codes, and product names. |
| product_name | string | 3,313 | Primary products Secondary products | Name of the product to which the data observation refers. See https://download.bls.gov/pub/time.series/pc/pc.product for mapping of industry codes, product codes, and product names. |
| seasonal | string | 1 | U | Code identifying whether the data are seasonally adjusted. S=Seasonally Adjusted; U=Unadjusted |
| series_id | string | 4,822 | PCU332323332323M PCU333415333415C | Code identifying the specific series. A time series refers to a set of data observed over an extended period of time over consistent time intervals. See https://download.bls.gov/pub/time.series/pc/pc.series for details of series such as code, name, start and end year, etc. |
| series_title | string | 4,588 | PPI industry data for Electric power distribution-West South Central, not seasonally adjusted PPI industry data for Electric power distribution-Pacific, not seasonally adjusted |  |
| value | float | 7,658 | 100.0 100.4000015258789 | Price index for item. |
| year | int | 22 | 2015 2017 | Identifies year of observation. |

## Preview

| product_code | industry_code | series_id | year | period | value | footnote_codes | seasonal | series_title | industry_name | product_name |
|-|-|-|-|-|-|-|-|-|-|-|
| 2123240 | 212324 | PCU2123242123240 | 1998 | M01 | 117 | nan | U | PPI industry data for Kaolin and ball clay mining-Kaolin and ball clay, not seasonally adjusted | Kaolin and ball clay mining | Kaolin and ball clay |
| 2123240 | 212324 | PCU2123242123240 | 1998 | M02 | 116.9 | nan | U | PPI industry data for Kaolin and ball clay mining-Kaolin and ball clay, not seasonally adjusted | Kaolin and ball clay mining | Kaolin and ball clay |
| 2123240 | 212324 | PCU2123242123240 | 1998 | M03 | 116.3 | nan | U | PPI industry data for Kaolin and ball clay mining-Kaolin and ball clay, not seasonally adjusted | Kaolin and ball clay mining | Kaolin and ball clay |
| 2123240 | 212324 | PCU2123242123240 | 1998 | M04 | 116 | nan | U | PPI industry data for Kaolin and ball clay mining-Kaolin and ball clay, not seasonally adjusted | Kaolin and ball clay mining | Kaolin and ball clay |
| 2123240 | 212324 | PCU2123242123240 | 1998 | M05 | 116.2 | nan | U | PPI industry data for Kaolin and ball clay mining-Kaolin and ball clay, not seasonally adjusted | Kaolin and ball clay mining | Kaolin and ball clay |
| 2123240 | 212324 | PCU2123242123240 | 1998 | M06 | 116.3 | nan | U | PPI industry data for Kaolin and ball clay mining-Kaolin and ball clay, not seasonally adjusted | Kaolin and ball clay mining | Kaolin and ball clay |
| 2123240 | 212324 | PCU2123242123240 | 1998 | M07 | 116.6 | nan | U | PPI industry data for Kaolin and ball clay mining-Kaolin and ball clay, not seasonally adjusted | Kaolin and ball clay mining | Kaolin and ball clay |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=us-producer-price-index-industry -->


```python
# This is a package in preview.
from azureml.opendatasets import UsLaborPPIIndustry

labor = UsLaborPPIIndustry()
labor_df = labor.to_pandas_dataframe()
```

```python
labor_df.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=us-producer-price-index-industry -->


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
folder_name = "ppi_industry/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=us-producer-price-index-industry -->


```python
# This is a package in preview.
from azureml.opendatasets import UsLaborPPIIndustry

labor = UsLaborPPIIndustry()
labor_df = labor.to_spark_dataframe()
```

```python
display(labor_df.limit(5))
```

<!-- nbend -->
 
# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=us-producer-price-index-industry -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "ppi_industry/"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=us-producer-price-index-industry -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "laborstatisticscontainer"
blob_relative_path = "ppi_industry/"
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