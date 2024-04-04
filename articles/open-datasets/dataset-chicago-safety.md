---
title: Chicago Safety Data
description: Learn how to use the Chicago Safety Data dataset in Azure Open Datasets.
ms.service: open-datasets
ms.custom: devx-track-python
ms.topic: sample
ms.date: 04/16/2021
---

# Chicago Safety Data

311 service requests from the city of Chicago, including historical sanitation code complaints, pot holes reported, and street light issues

All open sanitation code complaints made to 311 and all requests completed since January 1, 2011. The Department of Streets and Sanitation investigates and remedies reported violations of Chicago’s sanitation code. Residents may request service for violations such as overflowing dumpsters and garbage in the alley. 311 sometimes receives duplicate sanitation code complaints. Requests that have been labeled as duplicates are in the same geographic area as a previous request and have been entered into 311’s Customer Service Request (CSR) system at around the same time. Duplicate complaints are labeled as such in the status field, as either “Open - Dup” or “Completed - Dup.”

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

The Chicago Department of Transportation (CDOT) oversees the patching of potholes on over 4,000 miles of arterial and residential streets in Chicago. CDOT receives reports of potholes through the 311 call center. CDOT uses a mapping and tracking system to identify pothole locations and schedule crews.

One call to 311 can generate multiple pothole repairs. When a crew arrives to repair a 311 pothole, it fills all the other potholes within the block. Pothole repairs are completed within seven days from the first report of a pothole to 311. Weather conditions, frigid temps, and precipitation, influence how long a repair takes. On days when weather is cooperative and there's no precipitation, crews can fill several thousand potholes. 

If a previous request is already open for a buffer of four addresses, the request is given the status of “Duplicate (Open)”. For example, if there's an existing CSR for 6535 N Western and a new request is received for 6531 N Western (which is within four addresses of the original CSR) then the new request is given a status of “Duplicate (Open)”. Once the street is repaired, the status in CSR will read “Completed” for the original request and “Duplicate (Closed)” for any duplicate requests. A service request also receives the status of “Completed” when the reported address is inspected but no potholes are found or have already been filled. If another issue is found with the street, such as a “cave-in” or “failed utility cut”, then it's directed to the appropriate department or contractor.

All open reports of “Street Lights - All Out” (an outage of three or more lights) made to 311 and all requests completed since January 1, 2011. The Chicago Department of Transportation (CDOT) oversees approximately 250,000 street lights that illuminate arterial and residential streets in Chicago. CDOT performs repairs and bulb replacements in response to residents’ reports of street light outages. Whenever CDOT receives a report of an “All Out” the electrician assigned to make the repair looks at the lights in that circuit (each circuit has 8-16 lights) to make sure they're working properly. If a second request of lights out in the same circuit is made within four calendar days of the original request, the newest request is automatically given the status of “Duplicate (Open).” Since CDOT’s electrician will be looking at the lights in a circuit to verify they're working, any “Duplicate (Open)” address will automatically be observed and repaired. Once the street lights are repaired, the status in CSR will read “Completed” for the original request and “Duplicate (Closed)” for any duplicate requests. A service request also receives the status of “Completed” when the reported lights are inspected but found to be in good repair and functioning; when the service request is for a non-existent address; or when the lights are maintained by a contractor. Data is updated daily.

## Volume and retention

This dataset is stored in Parquet format. It is updated daily, and contains about 1M rows (80 MB) in total as of 2018.

This dataset contains historical records accumulated from 2011 to 2018. You can use parameter settings in our SDK to fetch data within a specific time range.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Related datasets

- [Chicago sanitation](https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Sanitation-Code-Complaints-Hi/me59-5fac)
- [Chicago pot holes](https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Pot-Holes-Reported-Historical/7as2-ds3y)
- [Chicago street lights](https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Street-Lights-All-Out-Histori/zuxi-7xem)

## Additional information

This dataset is sourced from city of Chicago government.

Reference here for the terms of using this dataset. Email dataportal@cityofchicago.org if you have any questions about the data source.

## Columns

| Name | Data type | Unique | Values (sample) | Description |
|-|-|-|-|-|
| address | string | 140,612 | \" \" 1 City Hall Plz Boston MA 02108 | Location. |
| category | string | 54 | Street Cleaning Sanitation | Reason of the service request. |
| dataSubtype | string | 1 | 311_All | “311_All” |
| dataType | string | 1 | Safety | “Safety” |
| dateTime | timestamp | 1,529,075 | 2015-07-23 10:51:00 2015-07-23 10:47:00 | Open date and time of the service request. |
| latitude | double | 1,622 | 42.3594 42.3603 | This is the latitude value. Lines of latitude are parallel to the equator. |
| longitude | double | 1,806 | -71.0587 -71.0583 | This is the longitude value. Lines of longitude run perpendicular to lines of latitude, and all pass through both poles. |
| source | string | 7 | Constituent Call Citizens Connect App | Original source of the case. |
| status | string | 2 | Closed Open | Case status. |
| subcategory | string | 209 | Parking Enforcement Requests for Street Cleaning | Type of the service request. |

## Preview

| dataType | dataSubtype | dateTime | category | subcategory | status | address | latitude | longitude | source | extendedProperties |
|-|-|-|-|-|-|-|-|-|-|-|
| Safety | 311_All | 4/25/2021 11:55:04 PM | Street Light Out Complaint | null | Open | 4800 W WASHINGTON BLVD | 41.882148426 | -87.74556256 | null |  |
| Safety | 311_All | 4/25/2021 11:54:31 PM | 311 INFORMATION ONLY CALL | null | Completed | 2111 W Lexington ST |  |  | null |  |
| Safety | 311_All | 4/25/2021 11:52:11 PM | 311 INFORMATION ONLY CALL | null | Completed | 2111 W Lexington ST |  |  | null |  |
| Safety | 311_All | 4/25/2021 11:49:56 PM | 311 INFORMATION ONLY CALL | null | Completed | 2111 W Lexington ST |  |  | null |  |
| Safety | 311_All | 4/25/2021 11:48:53 PM | Garbage Cart Maintenance | null | Open | 3409 E 106TH ST | 41.702545562 | -87.540917602 | null |  |
| Safety | 311_All | 4/25/2021 11:46:01 PM | 311 INFORMATION ONLY CALL | null | Completed | 2111 W Lexington ST |  |  | null |  |
| Safety | 311_All | 4/25/2021 11:45:46 PM | Aircraft Noise Complaint | null | Completed | 10510 W ZEMKE RD |  |  | null |  |
| Safety | 311_All | 4/25/2021 11:45:02 PM | 311 INFORMATION ONLY CALL | null | Completed | 2111 W Lexington ST |  |  | null |  |
| Safety | 311_All | 4/25/2021 11:44:24 PM | Sewer Cave-In Inspection Request | null | Open | 7246 W THORNDALE AVE | 41.987984339 | -87.808702917 | null |  |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_chicago -->


```
# This is a package in preview.
from azureml.opendatasets import ChicagoSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = ChicagoSafety(start_date=start_date, end_date=end_date)
safety = safety.to_pandas_dataframe()
```

```
safety.info()
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=city_safety_chicago -->


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
folder_name = "Safety/Release/city=Chicago"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=azureml-opendatasets&registryId=city_safety_chicago -->


```
# This is a package in preview.
# You need to pip install azureml-opendatasets in Databricks cluster. https://learn.microsoft.com/azure/data-explorer/connect-from-databricks#install-the-python-library-on-your-azure-databricks-cluster
from azureml.opendatasets import ChicagoSafety

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = ChicagoSafety(start_date=start_date, end_date=end_date)
safety = safety.to_spark_dataframe()
```

```
display(safety.limit(5))
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=city_safety_chicago -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=Chicago"
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

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=azureml-opendatasets&registryId=city_safety_chicago -->


```python
# This is a package in preview.
from azureml.opendatasets import ChicagoSafety

from datetime import datetime
from dateutil import parser

end_date = parser.parse('2016-01-01')
start_date = parser.parse('2015-05-01')
safety = ChicagoSafety(start_date=start_date, end_date=end_date)
safety = safety.to_spark_dataframe()
```

```python
# Display top 5 rows
display(safety.limit(5))
```

```python
# Display data statistic information
display(safety, summary = True)
```

<!-- nbend -->

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=city_safety_chicago -->


```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "citydatacontainer"
blob_relative_path = "Safety/Release/city=Chicago"
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
