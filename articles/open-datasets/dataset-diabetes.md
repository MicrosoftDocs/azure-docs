---
title: Diabetes dataset
description: Learn how to use the diabetes dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---
# Diabetes dataset

The Diabetes dataset has 442 samples with 10 features, making it ideal for getting started with machine learning algorithms. It's one of the most popular [Scikit Learn Toy Datasets](https://scikit-learn.org/stable/datasets/toy_dataset.html#diabetes-dataset).

[Original dataset description](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.html) 
| [Original data file](https://www4.stat.ncsu.edu/~boos/var.select/diabetes.tab.txt)

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Columns

| Name | Data type | Unique | Values (sample) |
|------|-----------|--------|-----------------|
| AGE  | bigint    | 58     | 53 60           |
| BMI  | double    | 163    | 24.1 23.5       |
| BP   | double    | 100    | 93.0 83.0       |
| S1   | bigint    | 141    | 162 184         |
| S2   | double    | 302    | 125.8 114.8     |
| S3   | double    | 63     | 46.0 38.0       |
| S4   | double    | 66     | 3.0 4.0         |
| S5   | double    | 184    | 4.4427 4.3041   |
| S6   | bigint    | 56     | 92 96           |
| SEX  | bigint    | 2      | 1 2             |
| Y    | bigint    | 214    | 72 200          |

## Preview

| AGE | SEX | BMI  | BP  | S1  | S2    | S3 | S4   | S5     | S6 | Y   |
|-----|-----|------|-----|-----|-------|----|------|--------|----|-----|
| 59  | 2   | 32.1 | 101 | 157 | 93.2  | 38 | 4    | 4.8598 | 87 | 151 |
| 48  | 1   | 21.6 | 87  | 183 | 103.2 | 70 | 3    | 3.8918 | 69 | 75  |
| 72  | 2   | 30.5 | 93  | 156 | 93.6  | 41 | 4    | 4.6728 | 85 | 141 |
| 24  | 1   | 25.3 | 84  | 198 | 131.4 | 40 | 5    | 4.8903 | 89 | 206 |
| 50  | 1   | 23   | 101 | 192 | 125.4 | 52 | 4    | 4.2905 | 80 | 135 |
| 23  | 1   | 22.6 | 89  | 139 | 64.8  | 61 | 2    | 4.1897 | 68 | 97  |
| 36  | 2   | 22   | 90  | 160 | 99.6  | 50 | 3    | 3.9512 | 82 | 138 |
| 66  | 2   | 26.2 | 114 | 255 | 185   | 56 | 4.55 | 4.2485 | 92 | 63  |
| 60  | 2   | 32.1 | 83  | 179 | 119.4 | 42 | 4    | 4.4773 | 94 | 110 |
| 29  | 1   | 30   | 85  | 180 | 93.4  | 43 | 4    | 5.3845 | 88 | 310 |

## Data access

Use the following code samples to access this dataset in Azure Notebooks, Azure Databricks, or Azure Synapse.

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

```python
# This is a package in preview.
from azureml.opendatasets import Diabetes

diabetes = Diabetes.get_tabular_dataset()
diabetes_df = diabetes.to_pandas_dataframe()

diabetes_df.info()
```

# [azure-storage](#tab/azure-storage)

```python
# Pip install packages
import os, sys

!{sys.executable} -m pip install azure-storage-blob
!{sys.executable} -m pip install pyarrow
!{sys.executable} -m pip install pandas

# Azure storage access info
azure_storage_account_name = "azureopendatastorage"
azure_storage_sas_token = r""
container_name = "mlsamples"
folder_name = "diabetes"

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

# Read the parquet file into Pandas data frame
import pandas as pd

print('Reading the parquet file into Pandas data frame')
df = pd.read_parquet(filename)

# you can add your filter at below
print('Loaded as a Pandas data frame: ')
df
```

# [pyspark](#tab/pyspark)

Sample not available for this platform/package combination.

---

### Azure Databricks

# [azureml-opendatasets](#tab/azureml-opendatasets)

```python
# This is a package in preview.
from azureml.opendatasets import Diabetes

diabetes = Diabetes.get_tabular_dataset()
diabetes_df = diabetes.to_spark_dataframe()

display(diabetes_df.limit(5))
```

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "mlsamples"
blob_relative_path = "diabetes"
blob_sas_token = r""

# Allow SPARK to read from Blob remotely
wasbs_path = 'wasbs://%s@%s.blob.core.windows.net/%s' % (blob_container_name, blob_account_name, blob_relative_path)
spark.conf.set(
  'fs.azure.sas.%s.%s.blob.core.windows.net' % (blob_container_name, blob_account_name),
  blob_sas_token)
print('Remote blob path: ' + wasbs_path)

# SPARK read parquet, note that it won't load any data yet by now
df = spark.read.parquet(wasbs_path)
print('Register the DataFrame as a SQL temporary view: source')
df.createOrReplaceTempView('source')

# Display top 10 rows
print('Displaying top 10 rows: ')
display(spark.sql('SELECT * FROM source LIMIT 10'))
```

---

### Azure Synapse

# [azureml-opendatasets](#tab/azureml-opendatasets)

Sample not available for this platform/package combination.

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "mlsamples"
blob_relative_path = "diabetes"
blob_sas_token = r""

# Allow SPARK to read from Blob remotely
wasbs_path = 'wasbs://%s@%s.blob.core.windows.net/%s' % (blob_container_name, blob_account_name, blob_relative_path)
spark.conf.set(
  'fs.azure.sas.%s.%s.blob.core.windows.net' % (blob_container_name, blob_account_name),
  blob_sas_token)
print('Remote blob path: ' + wasbs_path)

# SPARK read parquet, note that it won't load any data yet by now
df = spark.read.parquet(wasbs_path)
print('Register the DataFrame as a SQL temporary view: source')
df.createOrReplaceTempView('source')

# Display top 10 rows
print('Displaying top 10 rows: ')
display(spark.sql('SELECT * FROM source LIMIT 10'))
```

---

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).