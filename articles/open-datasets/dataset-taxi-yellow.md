---
title: NYC Taxi and Limousine yellow dataset
description: Learn how to use the NYC Taxi and Limousine yellow dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# NYC Taxi & Limousine Commission - yellow taxi trip records

The yellow taxi trip records include fields capturing pick-up and drop-off dates/times, pick-up and drop-off locations, trip distances, itemized fares, rate types, payment types, and driver-reported passenger counts.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Volume and retention

This dataset is stored in Parquet format. There are about 1.5B rows (50 GB) in total as of 2018.

This dataset contains historical records accumulated from 2009 to 2018. You can use parameter settings in our SDK to fetch data within a specific time range.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Additional information

NYC Taxi and Limousine Commission (TLC):

The data was collected and provided to the NYC Taxi and Limousine Commission (TLC) by technology providers authorized under the Taxicab & Livery Passenger Enhancement Programs (TPEP/LPEP). The trip data was not created by the TLC, and TLC makes no representations as to the accuracy of these data.

View the [original dataset location](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page) and the [original terms of use](https://www1.nyc.gov/home/terms-of-use.page).

## Columns
| Name                 | Data type | Unique      | Values (sample)                         | Description                                                                                                                                                                                                                                            |
|----------------------|-----------|-------------|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| doLocationId         | string    | 265         | 161 236                                 | TLC Taxi Zone in which the taximeter was disengaged.                                                                                                                                                                                                   |
| endLat               | double    | 961,994     | 41.366138 40.75                         |                                                                                                                                                                                                                                                        |
| endLon               | double    | 1,144,935   | -73.137393 -73.9824                     |                                                                                                                                                                                                                                                        |
| extra                | double    | 877         | 0.5 1.0                                 | Miscellaneous extras and surcharges. Currently, this only includes the $0.50 and $1 rush hour and overnight charges.                                                                                                                                   |
| fareAmount           | double    | 18,935      | 6.5 4.5                                 | The time-and-distance fare calculated by the meter.                                                                                                                                                                                                    |
| improvementSurcharge | string    | 60          | 0.3 0                                   | $0.30 improvement surcharge assessed trips at the flag drop. The improvement surcharge began being levied in 2015.                                                                                                                                     |
| mtaTax               | double    | 360         | 0.5 -0.5                                | $0.50 MTA tax that is automatically triggered based on the metered rate in use.                                                                                                                                                                        |
| passengerCount       | int       | 64          | 1 2                                     | The number of passengers in the vehicle. This is a driver-entered value.                                                                                                                                                                               |
| paymentType          | string    | 6,282       | CSH CRD                                 | A numeric code signifying how the passenger paid for the trip. 1= Credit card; 2= Cash; 3= No charge; 4= Dispute; 5= Unknown; 6= Voided trip.                                                                                                          |
| puLocationId         | string    | 266         | 237 161                                 | TLC Taxi Zone in which the taximeter was engaged.                                                                                                                                                                                                      |
| puMonth              | int       | 12          | 3 5                                     |                                                                                                                                                                                                                                                        |
| puYear               | int       | 29          | 2012 2011                               |                                                                                                                                                                                                                                                        |
| rateCodeId           | int       | 56          | 1 2                                     | The final rate code in effect at the end of the trip. 1= Standard rate; 2= JFK; 3= Newark; 4= Nassau or Westchester; 5= Negotiated fare; 6= Group ride.                                                                                                |
| startLat             | double    | 833,016     | 41.366138 40.7741                       |                                                                                                                                                                                                                                                        |
| startLon             | double    | 957,428     | -73.137393 -73.9821                     |                                                                                                                                                                                                                                                        |
| storeAndFwdFlag      | string    | 8           | N 0                                     | This flag indicates whether the trip record was held in vehicle memory before sending to the vendor, also known as “store and forward,” because the vehicle did not have a connection to the server. Y= store and forward trip; N= not a store and forward trip. |
| tipAmount            | double    | 12,121      | 1.0 2.0                                 | This field is automatically populated for credit card tips. Cash tips are not included.                                                                                                                                                                |
| tollsAmount          | double    | 6,634       | 5.33 4.8                                | Total amount of all tolls paid in trip.                                                                                                                                                                                                                |
| totalAmount          | double    | 39,707      | 7.0 7.8                                 | The total amount charged to passengers. Does not include cash tips.                                                                                                                                                                                    |
| tpepDropoffDateTime  | timestamp | 290,185,010 | 2010-11-07 01:29:00 2013-11-03 01:22:00 | The date and time when the meter was disengaged.                                                                                                                                                                                                       |
| tpepPickupDateTime   | timestamp | 289,948,585 | 2010-11-07 01:00:00 2009-11-01 01:05:00 | The date and time when the meter was engaged.                                                                                                                                                                                                          |
| tripDistance         | double    | 14,003      | 1.0 0.9                                 | The elapsed trip distance in miles reported by the taximeter.                                                                                                                                                                                          |
| vendorID             | string    | 7           | VTS CMT                                 | A code indicating the TPEP provider that provided the record. 1= Creative Mobile Technologies, LLC; 2= VeriFone Inc.                                                                                                                                   |
| vendorID             | int       | 2           | 2 1                                     | A code indicating the LPEP provider that provided the record. 1= Creative Mobile Technologies, LLC; 2= VeriFone Inc.                                                                                                                                   |

## Preview

| vendorID | tpepPickupDateTime    | tpepDropoffDateTime   | passengerCount | tripDistance | puLocationId | doLocationId | rateCodeId | storeAndFwdFlag | paymentType | fareAmount | extra | mtaTax | improvementSurcharge | tipAmount | tollsAmount | totalAmount | puYear | puMonth |
|----------|-----------------------|-----------------------|----------------|--------------|--------------|--------------|------------|-----------------|-------------|------------|-------|--------|----------------------|-----------|-------------|-------------|--------|---------|
| 2        | 1/24/2088 12:25:39 AM | 1/24/2088 7:28:25 AM  | 1              | 4.05         | 24           | 162          | 1          | N               | 2           | 14.5       | 0     | 0.5    | 0.3                  | 0         | 0           | 15.3        | 2088   | 1       |
| 2        | 1/24/2088 12:15:42 AM | 1/24/2088 12:19:46 AM | 1              | 0.63         | 41           | 166          | 1          | N               | 2           | 4.5        | 0     | 0.5    | 0.3                  | 0         | 0           | 5.3         | 2088   | 1       |
| 2        | 11/4/2084 12:32:24 PM | 11/4/2084 12:47:41 PM | 1              | 1.34         | 238          | 236          | 1          | N               | 2           | 10         | 0     | 0.5    | 0.3                  | 0         | 0           | 10.8        | 2084   | 11      |
| 2        | 11/4/2084 12:25:53 PM | 11/4/2084 12:29:00 PM | 1              | 0.32         | 238          | 238          | 1          | N               | 2           | 4          | 0     | 0.5    | 0.3                  | 0         | 0           | 4.8         | 2084   | 11      |
| 2        | 11/4/2084 12:08:33 PM | 11/4/2084 12:22:24 PM | 1              | 1.85         | 236          | 238          | 1          | N               | 2           | 10         | 0     | 0.5    | 0.3                  | 0         | 0           | 10.8        | 2084   | 11      |
| 2        | 11/4/2084 11:41:35 AM | 11/4/2084 11:59:41 AM | 1              | 1.65         | 68           | 237          | 1          | N               | 2           | 12.5       | 0     | 0.5    | 0.3                  | 0         | 0           | 13.3        | 2084   | 11      |
| 2        | 11/4/2084 11:27:28 AM | 11/4/2084 11:39:52 AM | 1              | 1.07         | 170          | 68           | 1          | N               | 2           | 9          | 0     | 0.5    | 0.3                  | 0         | 0           | 9.8         | 2084   | 11      |
| 2        | 11/4/2084 11:19:06 AM | 11/4/2084 11:26:44 AM | 1              | 1.3          | 107          | 170          | 1          | N               | 2           | 7.5        | 0     | 0.5    | 0.3                  | 0         | 0           | 8.3         | 2084   | 11      |
| 2        | 11/4/2084 11:02:59 AM | 11/4/2084 11:15:51 AM | 1              | 1.85         | 113          | 137          | 1          | N               | 2           | 10         | 0     | 0.5    | 0.3                  | 0         | 0           | 10.8        | 2084   | 11      |
| 2        | 11/4/2084 10:46:05 AM | 11/4/2084 10:50:09 AM | 1              | 0.62         | 231          | 231          | 1          | N               | 2           | 4.5        | 0     | 0.5    | 0.3                  | 0         | 0           | 5.3         | 2084   | 11      |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

```python
# This is a package in preview.
from azureml.opendatasets import NycTlcYellow

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2018-06-06')
start_date = parser.parse('2018-05-01')
nyc_tlc = NycTlcYellow(start_date=start_date, end_date=end_date)
nyc_tlc_df = nyc_tlc.to_pandas_dataframe()

nyc_tlc_df.info()
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
container_name = "nyctlc"
folder_name = "yellow"

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
# You need to pip install azureml-opendatasets in Databricks cluster. https://learn.microsoft.com/azure/data-explorer/connect-from-databricks#install-the-python-library-on-your-azure-databricks-cluster
from azureml.opendatasets import NycTlcYellow

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2018-06-06')
start_date = parser.parse('2018-05-01')
nyc_tlc = NycTlcYellow(start_date=start_date, end_date=end_date)
nyc_tlc_df = nyc_tlc.to_spark_dataframe()

display(nyc_tlc_df.limit(5))
```

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "nyctlc"
blob_relative_path = "yellow"
blob_sas_token = "r"

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

```python
# This is a package in preview.
from azureml.opendatasets import NycTlcYellow

from datetime import datetime
from dateutil import parser

end_date = parser.parse('2018-06-06')
start_date = parser.parse('2018-05-01')
nyc_tlc = NycTlcYellow(start_date=start_date, end_date=end_date)
nyc_tlc_df = nyc_tlc.to_spark_dataframe()

# Display top 5 rows
display(nyc_tlc_df.limit(5))
```

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "nyctlc"
blob_relative_path = "yellow"
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
