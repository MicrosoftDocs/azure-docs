---
title: NYC Taxi and Limousine green dataset
description: Learn how to use the NYC Taxi and Limousine green dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# NYC Taxi & Limousine Commission - green taxi trip records

The green taxi trip records include fields capturing pick-up and drop-off dates/times, pick-up and drop-off locations, trip distances, itemized fares, rate types, payment types, and driver-reported passenger counts.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Volume and retention

This dataset is stored in Parquet format. There are about 80M rows (2 GB) in total as of 2018.

This dataset contains historical records accumulated from 2009 to 2018. You can use parameter settings in our SDK to fetch data within a specific time range.

## Storage location

This dataset is stored in the East US Azure region. Allocating compute resources in East US is recommended for affinity.

## Additional information

NYC Taxi and Limousine Commission (TLC):

The data was collected and provided to the NYC Taxi and Limousine Commission (TLC) by technology providers authorized under the Taxicab & Livery Passenger Enhancement Programs (TPEP/LPEP). The trip data was not created by the TLC, and TLC makes no representations as to the accuracy of these data.

View the [original dataset location](https://www1.nyc.gov/site/tlc/about/tlc-trip-record-data.page) and the [original terms of use](https://www1.nyc.gov/home/terms-of-use.page).

## Columns

| Name                 | Data type | Unique     | Values (sample)                         | Description                                                                                                                                                                                                                                          |
|----------------------|-----------|------------|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| doLocationId         | string    | 264        | 74 42                                   | DOLocationID TLC Taxi Zone in which the taximeter was disengaged.                                                                                                                                                                                    |
| dropoffLatitude      | double    | 109,721    | 40.7743034362793 40.77431869506836      | Deprecated from 2016.07 onward                                                                                                                                                                                                                       |
| dropoffLongitude     | double    | 75,502     | -73.95272827148438 -73.95274353027344   | Deprecated from 2016.07 onward                                                                                                                                                                                                                       |
| extra                | double    | 202        | 0.5 1.0                                 | Miscellaneous extras and surcharges. Currently, this only includes the $0.50 and $1 rush hour and overnight charges.                                                                                                                                 |
| fareAmount           | double    | 10,367     | 6.0 5.5                                 | The time-and-distance fare calculated by the meter.                                                                                                                                                                                                  |
| improvementSurcharge | string    | 92         | 0.3 0                                   | $0.30 improvement surcharge assessed on hailed trips at the flag drop. The improvement surcharge began being levied in 2015.                                                                                                                         |
| lpepDropoffDatetime  | timestamp | 58,100,713 | 2016-05-22 00:00:00 2016-05-09 00:00:00 | The date and time when the meter was disengaged.                                                                                                                                                                                                     |
| lpepPickupDatetime   | timestamp | 58,157,349 | 2013-10-22 12:40:36 2014-08-09 15:54:25 | The date and time when the meter was engaged.                                                                                                                                                                                                        |
| mtaTax               | double    | 34         | 0.5 -0.5                                | $0.50 MTA tax that is automatically triggered based on the metered rate in use.                                                                                                                                                                      |
| passengerCount       | int       | 10         | 1 2                                     | The number of passengers in the vehicle. This is a driver-entered value.                                                                                                                                                                             |
| paymentType          | int       | 5          | 2 1                                     | A numeric code signifying how the passenger paid for the trip. 1= Credit card 2= Cash 3= No charge 4= Dispute 5= Unknown 6= Voided trip                                                                                                              |
| pickupLatitude       | double    | 95,110     | 40.721351623535156 40.721336364746094   | Deprecated from 2016.07 onward                                                                                                                                                                                                                       |
| pickupLongitude      | double    | 55,722     | -73.84429931640625 -73.84429168701172   | Deprecated from 2016.07 onward                                                                                                                                                                                                                       |
| puLocationId         | string    | 264        | 74 41                                   | TLC Taxi Zone in which the taximeter was engaged.                                                                                                                                                                                                    |
| puMonth              | int       | 12         | 3 5                                     |                                                                                                                                                                                                                                                      |
| puYear               | int       | 14         | 2015 2016                               |                                                                                                                                                                                                                                                      |
| rateCodeID           | int       | 7          | 1 5                                     | The final rate code in effect at the end of the trip. 1= Standard rate 2= JFK 3= Newark 4= Nassau or Westchester 5= Negotiated fare 6= Group ride                                                                                                    |
| storeAndFwdFlag      | string    | 2          | N Y                                     | This flag indicates whether the trip record was held in vehicle memory before sending to the vendor, also known as “store and forward,” because the vehicle did not have a connection to the server. Y= store and forward trip N= not a store and forward trip |
| tipAmount            | double    | 6,206      | 1.0 2.0                                 | Tip amount – This field is automatically populated for credit card tips. Cash tips are not included.                                                                                                                                                 |
| tollsAmount          | double    | 2,150      | 5.54 5.76                               | Total amount of all tolls paid in trip.                                                                                                                                                                                                              |
| totalAmount          | double    | 20,188     | 7.8 6.8                                 | The total amount charged to passengers. Does not include cash tips.                                                                                                                                                                                  |
| tripDistance         | double    | 7,060      | 0.9 1.0                                 | The elapsed trip distance in miles reported by the taximeter.                                                                                                                                                                                        |
| tripType             | int       | 3          | 1 2                                     | A code indicating whether the trip was a street-hail or a dispatch that is automatically assigned based on the metered rate in use but can be altered by the driver. 1= Street-hail 2= Dispatch                                                      |
| vendorID             | int       | 2          | 2 1                                     | A code indicating the LPEP provider that provided the record. 1= Creative Mobile Technologies, LLC; 2= VeriFone Inc.                                                                                                                                 |

## Preview

| vendorID | lpepPickupDatetime     | lpepDropoffDatetime    | passengerCount | tripDistance | puLocationId | doLocationId | rateCodeID | storeAndFwdFlag | paymentType | fareAmount | extra | mtaTax | improvementSurcharge | tipAmount | tollsAmount | totalAmount | tripType | puYear | puMonth |
|----------|------------------------|------------------------|----------------|--------------|--------------|--------------|------------|-----------------|-------------|------------|-------|--------|----------------------|-----------|-------------|-------------|----------|--------|---------|
| 2        | 6/24/2081 5:40:37 PM   | 6/24/2081 6:42:47 PM   | 1              | 16.95        | 93           | 117          | 1          | N               | 1           | 52         | 1     | 0.5    | 0.3                  | 0         | 2.16        | 55.96       | 1        | 2081   | 6       |
| 2        | 11/28/2030 12:19:29 AM | 11/28/2030 12:25:37 AM | 1              | 1.08         | 42           | 247          | 1          | N               | 2           | 6.5        | 0     | 0.5    | 0.3                  | 0         | 0           | 7.3         | 1        | 2030   | 11      |
| 2        | 11/28/2030 12:14:50 AM | 11/28/2030 12:14:54 AM | 1              | 0.03         | 42           | 42           | 5          | N               | 2           | 5          | 0     | 0      | 0                    | 0         | 0           | 5           | 2        | 2030   | 11      |
| 2        | 11/14/2020 11:38:07 AM | 11/14/2020 11:42:22 AM | 1              | 0.63         | 129          | 129          | 1          | N               | 2           | 4.5        | 1     | 0.5    | 0.3                  | 0         | 0           | 6.3         | 1        | 2020   | 11      |
| 2        | 11/14/2020 9:55:36 AM  | 11/14/2020 10:04:54 AM | 1              | 3.8          | 82           | 138          | 1          | N               | 2           | 12.5       | 1     | 0.5    | 0.3                  | 0         | 0           | 14.3        | 1        | 2020   | 11      |
| 2        | 8/26/2019 4:18:37 PM   | 8/26/2019 4:19:35 PM   | 1              | 0            | 264          | 264          | 1          | N               | 2           | 1          | 0     | 0.5    | 0.3                  | 0         | 0           | 1.8         | 1        | 2019   | 8       |
| 2        | 7/1/2019 8:28:33 AM    | 7/1/2019 8:32:33 AM    | 1              | 0.71         | 7            | 7            | 1          | N               | 1           | 5          | 0     | 0.5    | 0.3                  | 1.74      | 0           | 7.54        | 1        | 2019   | 7       |
| 2        | 7/1/2019 12:04:53 AM   | 7/1/2019 12:21:56 AM   | 1              | 2.71         | 223          | 145          | 1          | N               | 2           | 13         | 0.5   | 0.5    | 0.3                  | 0         | 0           | 14.3        | 1        | 2019   | 7       |
| 2        | 7/1/2019 12:04:11 AM   | 7/1/2019 12:21:15 AM   | 1              | 3.14         | 166          | 142          | 1          | N               | 2           | 14.5       | 0.5   | 0.5    | 0.3                  | 0         | 0           | 18.55       | 1        | 2019   | 7       |
| 2        | 7/1/2019 12:03:37 AM   | 7/1/2019 12:09:27 AM   | 1              | 0.78         | 74           | 74           | 1          | N               | 1           | 6          | 0.5   | 0.5    | 0.3                  | 1.46      | 0           | 8.76        | 1        | 2019   | 7       |

## Data access

### Azure Notebooks

# [azureml-opendatasets](#tab/azureml-opendatasets)

```python
# This is a package in preview.
from azureml.opendatasets import NycTlcGreen

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2018-06-06')
start_date = parser.parse('2018-05-01')
nyc_tlc = NycTlcGreen(start_date=start_date, end_date=end_date)
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
folder_name = "green"

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
from azureml.opendatasets import NycTlcGreen

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2018-06-06')
start_date = parser.parse('2018-05-01')
nyc_tlc = NycTlcGreen(start_date=start_date, end_date=end_date)
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
blob_relative_path = "green"
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

```python
# This is a package in preview.
from azureml.opendatasets import NycTlcGreen

from datetime import datetime
from dateutil import parser


end_date = parser.parse('2018-06-06')
start_date = parser.parse('2018-05-01')
nyc_tlc = NycTlcGreen(start_date=start_date, end_date=end_date)
nyc_tlc_df = nyc_tlc.to_spark_dataframe()

# Display top 5 rows
display(nyc_tlc_df.limit(5))

# Display data statistic information
display(nyc_tlc_df, summary = True)
```

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

```python
# Azure storage access info
blob_account_name = "azureopendatastorage"
blob_container_name = "nyctlc"
blob_relative_path = "green"
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
