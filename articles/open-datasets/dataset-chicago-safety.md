---
title: Chicago Safety Data
description: Learn how to use the Chicago Safety Data dataset in Azure Open Datasets.
ms.service: azure-open-datasets
ms.custom: devx-track-python
ms.topic: sample
ms.reviewer: franksolomon
ms.date: 06/17/2024
---

# Chicago Safety Data

Chicago 311 service request call data covers

- all open sanitation code complaints made to 311
- all requests completed since January 1, 2011
- historical sanitation code complaints
- pot hole reports
- street light issues

The Department of Streets and Sanitation investigates and remedies reported violations of Chicago’s sanitation code. Residents can request service for overflowing dumpster and alley garbage violations, for example. The Chicago 311 service sometimes receives duplicate sanitation code complaints. Identified duplicate service requests are located in the same geographic area as a previous request, and were entered into the 311 Customer Service Request (CSR) system at about the same time. Duplicate complaints are labeled as such in the status field, as either "Open - Dup" or "Completed - Dup."

[!INCLUDE [Open Dataset usage notice](./includes/open-datasets-usage-note.md)]

The Chicago Department of Transportation (CDOT) oversees pothole repair for 4,000 miles of arterial and residential streets in Chicago. CDOT receives pothole reports through the 311 call center. CDOT uses a mapping and tracking system to identify pothole locations and schedule crews.

One call to 311 can generate multiple pothole repairs. When a crew arrives to repair a pothole based on a 311 call, that crew fills all the other potholes found on that block. Pothole repairs are completed within seven days from the first report of a pothole to 311. Weather conditions, frigid temps, and precipitation can influence the time needed to complete a pothole repair. On days of cooperative weather and no precipitation, crews can fill several thousand potholes.

If a previous request is already open for a buffer of four addresses, the request gets a status of "Duplicate (Open)" status. For example, for an existing CSR for address **6535 N Western**, and 311 receives a new CSR for address **6531 N Western**, then the new request receives a status of “Duplicate (Open)”, the new request receives a "Duplicate (Open)" status. In this example, the new CSR is at an address within four addresses of the original CSR. Once the crews repair the street, the CSR status reads “Completed” for the original request, and “Duplicate (Closed)” for any duplicate requests. A service request also receives the status of “Completed” when the reported address is inspected but no potholes are found or were filled. If another issue is found with the street, such as a “cave-in” or “failed utility cut”, then the issue is directed to the appropriate department or contractor.

Open reports made to 311 of street light outages involving three or more lights are defined as "Street Lights - All Out." The Chicago Department of Transportation (CDOT) oversees approximately 250,000 street lights that illuminate arterial and residential streets in Chicago. CDOT performs repairs and bulb replacements in response to residents’ reports of street light outages. Whenever CDOT receives a report of an “All Out” the electrician assigned to make the repair looks at the lights in that circuit (each circuit has 8-16 lights) to make sure they all operate properly. If a second request of lights out in the same circuit is made within four calendar days of the original request, the newest request is automatically given the status of “Duplicate (Open).” Since the CDOT electrician looks at the lights in a circuit to verify their operation, any “Duplicate (Open)” address is automatically observed and repaired. Once the street lights are repaired, the status in CSR reads “Completed” for the original request and “Duplicate (Closed)” for any duplicate requests. A service request also receives the status of “Completed” when

- the reported lights are inspected but found to be in good repair and functioning
- the service request is for a nonexistent address
- a contractor maintains the lights

The data resource received daily updates.

## Volume and retention

This dataset is stored in Parquet format. It received daily updates, and contains about 1M rows (80 MB) in total as of 2019.

This dataset contains historical records accumulated from 2011 to 2018. You can use parameter settings in our SDK to fetch data within a specific time range.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Related datasets

- [Chicago sanitation](https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Sanitation-Code-Complaints-Hi/me59-5fac)
- [Chicago pot holes](https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Pot-Holes-Reported-Historical/7as2-ds3y)
- [Chicago street lights](https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Street-Lights-All-Out-Histori/zuxi-7xem)

## Additional information

This dataset is sourced from city of Chicago government.

Reference here for the terms of use for this dataset resource. Email [dataportal@cityofchicago.org](mailto:dataportal@cityofchicago.org) with questions about the data source.

## Columns

311 Service Requests - Street Lights - All Out - Historical

| Name | Data type | Values (sample) | Description |
|-|-|-|-|
| Creation Date | Floating Timestamp | 10/9/2017 | Request creation date |
| Status | Text | Completed - Dup | Request status |
| Completion Date | Floating Timestamp | 10/11/2017 | Request completion date |
| Service Request Number | Text | 17-06773249 | Service number of the request |
| Type of Service Request | Text | Street Lights - All/Out | Service request type |
| Street Address | Text | 2826 N TALMAN AVE | Address of request |
| ZIP Code | Number | 60618 | ZIP code value of request address |
| X Coordinate | Number | 1158230.1582963 | X Coordinate value |
| Y Coordinate | Number | 1918676.90199051 | Y Coordinate value |
| Ward | Number | 33 | Ward Number value |
| Police District | Number | 14 | Police District number |
| Community Area | Number | 21 | Community Area number |
| Latitude | Number | 41.93259686594802 | The request location latitude value. Latitude lines are parallel to the equator. |
| Longitude | Number | -87.6939355144751 | The request location longitude value. Longitude lines run perpendicular to lines of latitude, and all pass through both poles. |
| Location | Location | (41.932596865948, -87.693935514475) | Combined latitude and longitude values for the address |

Preview

| Creation Date | Status | Completion Date | Service Request Number | Type of Service Request | Street Address | ZIP Code | X Coordinate | Y Coordinate | Ward | Police District | Community Area | Latitude | Longitude | Location |
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
| 10/9/2017 | Completed - Dup | 10/11/2017 | 17-06773249 | Street Lights - All/Out | 2826 N TALMAN AVE | 60618 | 1158230.158 | 1918676.902 | 33 | 14 | 21 | 41.93259686594802 | -87.69393551 | (41.932596865948, -87.693935514475) |
| 10/11/2017 | Completed | 10/11/2017 | 17-06816558 | Street Lights - All/Out | 6200 S LAKE SHORE DR | 60637 | 1190863.778 | 1864244.283 | 5 | 3 | 42 | 41.78250135027194 | -87.57577731 | (41.782501350272, -87.575777307852) |
| 3/20/2014 | Completed - Dup | 8/4/2017 | 14-00400272 | Street Lights - All/Out | 5730 N KINGSDALE AVE | 60646 | 1143691.393 | 1937640.891 | 39 | 17 | 12 | 41.984920748899164 | -87.74688744 | (41.984920748899, -87.746887444765) |
| 10/9/2017 | Completed | 10/11/2017 | 17-06772762 | Street Lights - All/Out | 5246 S LUNA AVE | 60638 | 1140255.697 | 1869109.118 | 14 | 8 | 56 | 41.79692498298546 | -87.7612044 | (41.796924982985, -87.761204398005) |
| 10/10/2017 | Completed | 10/11/2017 | 17-06786335 | Street Lights - All/Out | 954 E 111TH ST | 60628 | 1184652.066 | 1831465.656 | 9 | 5 | 50 | 41.69270116620948 | -87.59957553 | (41.692701166209, -87.599575527098) |
| 10/8/2017 | Completed | 10/11/2017 | 17-06752801 | Street Lights - All/Out | 4399 N DAMEN AVE | 60618 | 1162224.952 | 1929224.823 | 47 | 19 | 5 | 41.961458246672315 | -87.67895915 | (41.961458246672, -87.67895914919) |
| 10/6/2017 | Completed | 10/11/2017 | 17-06696916 | Street Lights - All/Out | 4730 N BROADWAY | 60640 | 1167596.292 | 1931650.772 | 46 | 19 | 3 | 41.968000877697875 | -87.65914105 | (41.968000877698, -87.659141052722) |
| 10/7/2017 | Completed | 10/11/2017 | 17-06734666 | Street Lights - All/Out | 6449 S VERNON AVE | 60637 | 1180358.718 | 1862347.753 | 20 | 3 | 42 | 41.77754460257851 | -87.61434958 | (41.777544602579, -87.61434958023) |

311 Service Requests - Pot Holes Reported - Historical

| Name | Data type | Values (sample) | Description |
|-|-|-|-|
| Creation Date | Floating Timestamp | 4/25/2018 | Request creation date |
| Status | Text | Completed | Request status |
| Completion Date | Floating Timestamp | 4/26/2018 | Request completion date |
| Service Request Number | Text | 18-01325016 | Service number of the request |
| Type of Service Request | Text | Pothole in Street | Service request type |
| Current Activity | Text | Final Outcome | Latest Activity Description |
| Most Recent Action | Text | No Potholes Found | Latest action taken |
| Number of Potholes Filled on Block | 0 |  | Count of repaired potholes |
| Street Address | Text | 5100 S LAWLER AVE | Address of request |
| ZIP Code | Number | 60638 | ZIP code value of request address |
| X Coordinate | Number | 1143556.31919224 | X Coordinate value |
| Y Coordinate | Number | 1870339.26041166 | Y Coordinate value |
| Ward | Number | 14 | Ward Number value |
| Police District | Number | 8 | Police District number |
| Community Area | Number | 56 | Community Area number |
| SSA | Number | 26 |  |
| Latitude | double | 41.80014700738077 | This is the latitude value. Lines of latitude are parallel to the equator. |
| Longitude | double | -87.7492147421616 | This is the longitude value. Lines of longitude run perpendicular to lines of latitude, and all pass through both poles. |
| Location | Location | (41.80014700738077, -87.7492147421616) | Combined latitude and longitude values for the address |

Preview

| Creation Date | Status | Completion Date | Service Request Number | Type of Service Request | Current Activity | Most Recent Action | Number of Potholes Filled on Block | Street Address | ZIP Code | X Coordinate | Y Coordinate | Ward | Police District | Community Area | SSA | Latitude | Longitude | Location |
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
| 6/13/2012 | Completed | 6/18/2012 | 12-01071965 | Pot Hole in Street | Dispatch Crew | Pothole Patched | 14 | 7040 N FRANCISCO AVE | 60645 | 1155793.815 | 1946654.94 | 50 | 24 | 2 |  | 42.0096087 | -87.70227538 | (42.009608698109, -87.702275384338) |
| 6/15/2017 | Completed | 6/29/2017 | 17-03958579 | Pothole in Street | Final Outcome | WM Sewer Cave In Inspection Transfer Outcome | 0 | 4216 W CORTEZ ST | 60651 | 1148081.734 | 1906667.21 | 37 | 11 | 23 |  | 41.89994838998482 | -87.73187935 | (41.899948389985, -87.731879353699) |
| 1/13/2014 | Completed | 1/24/2014 | 14-00052283 | Pot Hole in Street | Final Outcome | Pothole Patched | 5 | 1200 S CANAL ST | 60607 | 1173311.531 | 1894981.335 | 2 | 1 | 28 |  | 41.86717512472001 | -87.63937581 | (41.86717512472, -87.639375812581) |
| 10/13/2015 | Completed | 11/24/2015 | 15-05364068 | Pothole in Street | Final Outcome | Pothole Patched | 3 | 6318 N WESTERN AVE | 60659 | 1159171.947 | 1941877.852 | 50 | 24 | 2 | 43 | 41.996507559859445 | -87.68999022 | (41.996507559859, -87.689990223964) |
| 2/23/2014 | Completed | 4/8/2014 | 14-00256448 | Pot Hole in Street | Final Outcome | Pothole Patched | 12 | 6800 N KEDZIE AVE | 60645 | 1153845.564 | 1944905.48 | 50 | 0 | 2 |  | 42.004746892817465 | -87.70949265 | (42.004746892817, -87.709492653059) |
| 10/16/2015 | Completed | 11/24/2015 | 15-05416322 | Pothole in Street | Final Outcome | CDOT Asphalt Top Off Restoration Transfer Outcome | 0 | 6430 N KEDZIE AVE | 60645 | 1153862.527 | 1942457.906 | 50 | 0 | 2 | 43 | 41.998328665333965 | -87.70950507 | (41.998328665334, -87.7095050747) |
| 4/1/2013 | Completed | 7/30/2013 | 13-00360362 | Pot Hole in Street | Final Outcome | Pothole Patched | 40 | 3738 N TRIPP AVE | 60641 | 1147334.393 | 1924509.895 | 38 | 17 | 16 |  | 41.94928712004567 | -87.73398704 | (41.949287120046, -87.733987044713) |

Sanitation Code Complaints

| Name | Data type | Values (sample) | Description |
|-|-|-|-|
| Creation Date | Floating Timestamp | 9/17/2017 | Request creation date |
| Status | Text | Completed | Request status |
| Completion Date | Floating Timestamp | 10/11/2017 | Request completion date |
| Service Request Number | Text | 17-06208608 | Service number of the request |
| Type of Service Request | Text | Sanitation Code Violation | Service request type |
| What is the Nature of this Code Violation? | Text | Overflowing carts | Latest Activity Description |
| Street Address | Text | 6327 S KENNETH AVE | Address of request |
| ZIP Code | Number | 60629 | ZIP code value of request address |
| X Coordinate | Number | 1147796.475 | X Coordinate value |
| Y Coordinate | Number | 1862216.771 | Y Coordinate value |
| Ward | Number | 13 | Ward Number value |
| Police District | Number | 8 | Police District number |
| Community Area | Number | 65 | Community Area number |
| Latitude | double | 41.77787022898461 | This is the latitude value. Lines of latitude are parallel to the equator. |
| Longitude | double | -87.73372735 | This is the longitude value. Lines of longitude run perpendicular to lines of latitude, and all pass through both poles. |
| Location | Location | (41.932596865948, -87.693935514475) | Combined latitude and longitude values for the address |

Preview

| Creation Date | Status | Completion Date | Service Request Number | Type of Service Request | What is the Nature of this Code Violation? | Street Address | ZIP Code | X Coordinate | Y Coordinate | Ward | Police District | Community Area | Latitude | Longitude | Location |
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
| 9/17/2017 | Completed | 10/11/2017 | 17-06208608 | Sanitation Code Violation | Overflowing carts | 6327 S KENNETH AVE | 60629 | 1147796.475 | 1862216.771 | 13 | 8 | 65 | 41.77787022898461 | -87.73372735 | (41.777870228985, -87.733727348463) |
| 10/5/2017 | Completed | 10/11/2017 | 17-06678788 | Sanitation Code Violation | Garbage in alley | 3020 W MONTROSE AVE | 60618 | 1155359.487 | 1929084.561 | 33 | 17 | 14 | 41.961214454744535 | -87.70420422 | (41.961214454745, -87.704204220358) |
| 8/21/2017 | Completed | 10/11/2017 | 17-05591233 | Sanitation Code Violation | Garbage in yard | 1500 S DAMEN AVE | 60608 | 1163279.962 | 1892714.436 | 28 | 12 | 28 | 41.86124902532175 | -87.67610892 | (41.861249025322, -87.676108920835) |
| 9/23/2017 | Completed | 10/11/2017 | 17-06370432 | Sanitation Code Violation | Construction Site Cleanliness/Fence | 6442 S CENTRAL AVE | 60638 | 1140196.719 | 1861187.963 | 13 | 8 | 64 | 41.77518903 | -87.76161383 | (41.775189032012, -87.761613831651) |
| 8/1/2017 | Completed - Dup | 8/4/2017 | 17-05101063 | Sanitation Code Violation | Garbage in alley | 3016 W MONTROSE AVE | 60618 | 1155405.587 | 1929085.161 | 33 | 17 | 14 | 41.96121517 | -87.70403472 | (41.961215172275, -87.704034715236) |
| 9/26/2017 | Completed | 10/11/2017 | 17-06440193 | Sanitation Code Violation | Other | 8830 S WABASH AVE | 60619 | 1178255.291 | 1846460.484 | 9 | 6 | 44 | 41.733996131384714 | -87.6225419 | (41.733996131385, -87.622541895911) |
| 10/10/2017 | Completed | 10/11/2017 | 17-06786539 | Sanitation Code Violation | Other | 4523 N LAWNDALE AVE | 60625 | 1150908.388 | 1929805.543 | 35 | 17 | 14 | 41.963281388376565 | -87.72054998 | (41.963281388377, -87.7205499839) |
| 5/31/2017 | Completed | 8/4/2017 | 17-03559234 | Sanitation Code Violation | Other | 3359 W 19TH ST | 60623 | 1154204.655 | 1890509.209 | 24 | 10 | 29 | 41.85538344067419 | -87.70948151 | (41.855383440674, -87.709481507782) |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azureml-opendatasets&registryId=city_safety_chicago -->

```
# This is package is in preview.
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

View the rest of the datasets in the [Open Datasets catalog](./dataset-catalog.md).