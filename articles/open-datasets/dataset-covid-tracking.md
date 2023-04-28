---
title: COVID Tracking Project
description: Learn how to use the COVID tracking project dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# COVID Tracking project

The COVID Tracking Project dataset provides the latest numbers on tests, confirmed cases, hospitalizations, and patient outcomes from every US state and territory.

For more information about this dataset, see the [project GitHub repository](https://github.com/COVID19Tracking/covid-tracking-data).

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Datasets

Modified versions of the dataset are available in CSV, JSON, JSON-Lines, and Parquet.
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.csv
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.json
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.jsonl
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.parquet

All modified versions have ISO 3166 subdivision codes and load times added, and use lower case column names with underscore separators.

Raw data:
'https://pandemicdatalake.blob.core.windows.net/public/raw/covid-19/covid_tracking/latest/daily.json'

Previous versions of modified and raw data:
https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/

https://pandemicdatalake.blob.core.windows.net/public/raw/covid-19/covid_tracking/

## Data volume
All datasets are updated daily. As of May 13, 2020 they contained 4,100 rows (CSV 574 KB, JSON 1.8 MB, JSONL 1.8 MB, Parquet 334 KB).

## Data source

This data is originally published by the COVID Tracking Project at the Atlantic. Raw data is ingested from the COVID Tracking GitHub repo using the [states_daily_4p_et.csv file](https://github.com/COVID19Tracking/covid-tracking-data/blob/master/data/states_daily_4pm_et.csv). For more information on this dataset including its origins from the COVID Tracking Project API, see the [project GitHub repository](https://github.com/COVID19Tracking/covid-tracking-data).

## Data quality
COVID Tracking Project grades the data quality for each state and provides further information about their assessment of the quality of the data. For more information, see the [COVID Tracking Project data page](https://covidtracking.com/data). Data in the GitHub repository may be an hour behind the API; use of the API is necessary to access the most recent data.

## License and use rights attribution

This data is licensed under the terms and conditions of the [Apache License 2.0](https://github.com/COVID19Tracking/covid-tracking-data/blob/master/LICENSE).

Any use of the data must retain all copyright, patent, trademark, and attribution notices.

## Contact

For any questions or feedback about this or other datasets in the COVID-19 Data Lake, contact askcovid19dl@microsoft.com.

## Columns

| Name                        | Data type | Unique | Values (sample)                                                                   | Description                                                                                                                 |
|-----------------------------|-----------|--------|-----------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------|
| date                        | date      | 420    | 2020-11-10 2021-01-30                                                             | Date for which the daily totals were collected.                                                                             |
| date_checked                | string    | 9,487  | 2020-12-01T00:00:00Z 2020-09-01T00:00:00Z                                         | Deprecated                                                                                                                  |
| death                       | smallint  | 7,327  | 2 5                                                                               | Total number of people who have died as a result of COVID-19 so far.                                                        |
| death_increase              | smallint  | 429    | 1 2                                                                               | Deprecated                                                                                                                  |
| fips                        | smallint  | 56     | 26 55                                                                             | Census FIPS code for the state.                                                                                             |
| fips_code                   | string    | 60     | 53 25                                                                             | Census FIPS code for the state.                                                                                             |
| hash                        | string    | 20,780 | 63df8cccd23a5476bab2d8111b138e4c9becd35e c606cd6990f16086b5382e12d84f6206172d493d | A hash for this record                                                                                                      |
| hospitalized                | int       | 7,641  | 89995 4                                                                           | Deprecated                                                                                                                  |
| hospitalized_cumulative     | int       | 7,641  | 89995 4                                                                           | Total number of people who have gone to the hospital for COVID-19 so far, including those who have since recovered or died. |
| hospitalized_currently      | smallint  | 3,886  | 8 13                                                                              | Number of people in hospital for COVID-19 on this day.                                                                      |
| hospitalized_increase       | smallint  | 615    | 1 2                                                                               | Deprecated                                                                                                                  |
| in_icu_cumulative           | smallint  | 2,295  | 990 220                                                                           | Total number of people who have gone to the ICU for COVID-19 so far, including those who have since recovered or died.      |
| in_icu_currently            | smallint  | 1,643  | 2 8                                                                               | Total number of people in the ICU for COVID-19 on this day.                                                                 |
| iso_country                 | string    | 1      | US                                                                                | ISO 3166 country or region code                                                                                             |
| iso_subdivision             | string    | 57     | US-UM US-WA                                                                       | ISO 3166 subdivision code                                                                                                   |
| last_update_et              | timestamp | 9,487  | 2020-12-01 00:00:00 2020-09-01 00:00:00                                           | Last time the day’s data was updated                                                                                        |
| load_time                   | timestamp | 1      | 2021-04-26 00:06:49.883000                                                        | Date and time the data was loaded to Azure from the source                                                                  |
| negative                    | int       | 10,864 | 305972 2140                                                                       | Total number of people who have tested negative for COVID-19 so far.                                                        |
| negative_increase           | int       | 7,328  | 6 17                                                                              | Deprecated                                                                                                                  |
| on_ventilator_cumulative    | smallint  | 677    | 411 412                                                                           | Total number of people who have used a ventilator for COVID-19 so far, including those who have since recovered or died.    |
| on_ventilator_currently     | smallint  | 837    | 4 10                                                                              | Number of people using a ventilator for COVID-19 on this day.                                                               |
| pending                     | smallint  | 944    | 2 17                                                                              | Number of tests whose results have yet to be determined.                                                                    |
| pos_neg                     | int       | 18,282 | 2140 2                                                                            | Deprecated                                                                                                                  |
| positive                    | int       | 16,837 | 2 1                                                                               | Total number of people who have tested positive for COVID-19 so far.                                                        |
| positive_increase           | smallint  | 4,754  | 1 2                                                                               | Deprecated                                                                                                                  |
| recovered                   | int       | 8,286  | 29 19                                                                             | Total number of people who have recovered from COVID-19 so far.                                                             |
| state                       | string    | 56     | MI PA                                                                             | Two-letter code for the state.                                                                                              |
| total                       | int       | 18,283 | 2140 2                                                                            | Deprecated                                                                                                                  |
| total_test_results          | int       | 18,648 | 2140 3                                                                            | Total test results provided by the State                                                                                    |
| total_test_results_increase | int       | 13,463 | 1 2                                                                               | Deprecated                                                                                                                  |

## Preview

| date       | state | positive | hospitalized_currently | hospitalized_cumulative | on_ventilator_currently | data_quality_grade | last_update_et        | hash                                     | date_checked          | death | hospitalized | total   | total_test_results | pos_neg | fips | death_increase | hospitalized_increase | negative_increase | positive_increase | total_test_results_increase | fips_code | iso_subdivision | load_time             | iso_country | negative | in_icu_cumulative | on_ventilator_cumulative | recovered | in_icu_currently |
|------------|-------|----------|------------------------|-------------------------|-------------------------|--------------------|-----------------------|------------------------------------------|-----------------------|-------|--------------|---------|--------------------|---------|------|----------------|-----------------------|-------------------|-------------------|-----------------------------|-----------|-----------------|-----------------------|-------------|----------|-------------------|--------------------------|-----------|------------------|
| 2021-03-07 | AK    | 56886    | 33                     | 1293                    | 2                       | null               | 3/5/2021 3:59:00 AM   | dc4bccd4bb885349d7e94d6fed058e285d4be164 | 3/5/2021 3:59:00 AM   | 305   | 1293         | 56886   | 1731628            | 56886   | 2    | 0              | 0                     | 0                 | 0                 | 0                           | 2         | US-AK           | 4/26/2021 12:06:49 AM | US          |          |                   |                          |           |                  |
| 2021-03-07 | AL    | 499819   | 494                    | 45976                   |                         | null               | 3/7/2021 11:00:00 AM  | 997207b430824ea40b8eb8506c19a93e07bc972e | 3/7/2021 11:00:00 AM  | 10148 | 45976        | 2431530 | 2323788            | 2431530 | 1    | -1             | 0                     | 2087              | 408               | 2347                        | 1         | US-AL           | 4/26/2021 12:06:49 AM | US          | 1931711  | 2676              | 1515                     | 295690    |                  |
| 2021-03-07 | AR    | 324818   | 335                    | 14926                   | 65                      | null               | 3/7/2021 12:00:00 AM  | 50921aeefba3e30d31623aa495b47fb2ecc72fae | 3/7/2021 12:00:00 AM  | 5319  | 14926        | 2805534 | 2736442            | 2805534 | 5    | 22             | 11                    | 3267              | 165               | 3380                        | 5         | US-AR           | 4/26/2021 12:06:49 AM | US          | 2480716  |                   | 1533                     | 315517    | 141              |
| 2021-03-07 | AS    | 0        |                        |                         |                         | null               | 12/1/2020 12:00:00 AM | 96d23f888c995b9a7f3b4b864de6414f45c728ff | 12/1/2020 12:00:00 AM | 0     |              | 2140    | 2140               | 2140    | 60   | 0              | 0                     | 0                 | 0                 | 0                           | 60        | US-AS           | 4/26/2021 12:06:49 AM | US          | 2140     |                   |                          |           |                  |
| 2021-03-07 | AZ    | 826454   | 963                    | 57907                   | 143                     | null               | 3/7/2021 12:00:00 AM  | 0437a7a96f4471666f775e63e86923eb5cbd8cdf | 3/7/2021 12:00:00 AM  | 16328 | 57907        | 3899464 | 7908105            | 3899464 | 4    | 5              | 44                    | 13678             | 1335              | 45110                       | 4         | US-AZ           | 4/26/2021 12:06:49 AM | US          | 3073010  |                   |                          |           | 273              |
| 2021-03-07 | CA    | 3501394  | 4291                   |                         |                         | null               | 3/7/2021 2:59:00 AM   | 63c5c0fd2daef2fb65150e9db486de98ed3f7b72 | 3/7/2021 2:59:00 AM   |       |              | 3501394 | 49646014           | 3501394 | 6    | 258            | 0                     | 0                 | 3816              | 133186                      | 6         | US-CA           | 4/26/2021 12:06:49 AM | US          |          |                   |                          |           | 1159             |
| 2021-03-07 | CO    | 436602   | 326                    | 23904                   |                         | null               | 3/7/2021 1:59:00 AM   | 444746cda3a596f183f3fa3269c8cab68704e819 | 3/7/2021 1:59:00 AM   | 5989  | 23904        | 2636060 | 6415123            | 2636060 | 8    | 3              | 18                    | 0                 | 840               | 38163                       | 8         | US-CO           | 4/26/2021 12:06:49 AM | US          | 2199458  |                   |                          |           |                  |
| 2021-03-07 | CT    | 285330   | 428                    | 12257                   |                         | null               | 3/4/2021 11:59:00 PM  | bcc0f7bc8c2bf77eec31b25f8b59d510f679d3e7 | 3/4/2021 11:59:00 PM  | 7704  | 12257        | 285330  | 6520366            | 285330  | 9    | 0              | 0                     | 0                 | 0                 | 0                           | 9         | US-CT           | 4/26/2021 12:06:49 AM | US          |          |                   |                          |           |                  |
| 2021-03-07 | DC    | 41419    | 150                    |                         | 16                      | null               | 3/6/2021 12:00:00 AM  | a3aa0d623d538807fb9577ad64354f48cf728cc8 | 3/6/2021 12:00:00 AM  | 1030  |              | 41419   | 1261363            | 41419   | 11   | 0              | 0                     | 0                 | 146               | 5726                        | 11        | US-DC           | 4/26/2021 12:06:49 AM | US          |          |                   |                          | 29570     | 38               |
| 2021-03-07 | DE    | 88354    | 104                    |                         |                         | null               | 3/6/2021 6:00:00 PM   | 059d870e689d5cc19c35f5eb398214d7d9856373 | 3/6/2021 6:00:00 PM   | 1473  |              | 633424  | 1431942            | 633424  | 10   | 9              | 0                     | 917               | 215               | 5867                        | 10        | US-DE           | 4/26/2021 12:06:49 AM | US          | 545070   |                   |                          |           | 13               |

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

URLs of different dataset file formats hosted on Azure Blob Storage:

CSV: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.csv

JSON: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.json

JSONL: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.jsonl

Parquet: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.parquet

Download the dataset file using the built-in capability download from an http URL in Pandas. Pandas has readers for various file formats:

https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_parquet.html

https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html

```python
import pandas as pd
import numpy as np
%matplotlib inline
import matplotlib.pyplot as plt

df = pd.read_parquet("https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_tracking/latest/covid_tracking.parquet ")
df.head(10)

df.dtypes

df.groupby('state').first().filter(['date','positive', 'death'])

df.groupby(df.state).agg({'state': 'count','positive_increase': 'sum','death_increase': 'sum'})

df_NY=df[df['state'] == 'NY']
df_NY.plot(kind='line',x='date',y="positive",grid=True)
df_NY.plot(kind='line',x='date',y="positive_increase",grid=True)
df_NY.plot(kind='line',x='date',y="death",grid=True)
df_NY.plot(kind='line',x='date',y="death_increase",grid=True)

df_US=df.groupby(df.date).agg({'positive': 'sum','positive_increase': 'sum','death':'sum','death_increase': 'sum'}).reset_index()

df_US.plot(kind='line',x='date',y="positive",grid=True)
df_US.plot(kind='line',x='date',y="positive_increase",grid=True)
df_US.plot(kind='line',x='date',y="death",grid=True)
df_US.plot(kind='line',x='date',y="death_increase",grid=True)



```

# [pyspark](#tab/pyspark)

Sample not available for this platform/package combination.

---

### Azure Databricks

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

```python
# Azure storage access info
blob_account_name = "pandemicdatalake"
blob_container_name = "public"
blob_relative_path = "curated/covid-19/covid_tracking/latest/covid_tracking.parquet"
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

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

```python
# Azure storage access info
blob_account_name = "pandemicdatalake"
blob_container_name = "public"
blob_relative_path = "curated/covid-19/covid_tracking/latest/covid_tracking.parquet"
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
