---
title: Oxford COVID-19 Government Response Tracker
description: Learn how to use the Oxford COVID-19 Government Response Tracker dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# Oxford COVID-19 Government Response Tracker

The [Oxford Covid-19 Government Response Tracker (OxCGRT) dataset](https://github.com/OxCGRT/covid-policy-tracker/) contains systematic information on which governments have taken which measures, and when.

This information can help decision-makers and citizens understand governmental responses in a consistent way, aiding efforts to fight the pandemic. The OxCGRT systematically collects information on several different common policy responses governments have taken, records these policies on a scale to reflect the extent of government action, and aggregates these scores into a suite of policy indices.


[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Datasets

Modified versions of the dataset are available in CSV, JSON, JSON-Lines, and Parquet, updated daily:
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.csv
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.json
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.jsonl
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.parquet

All modified versions have iso_country codes and load times added, and use lower case column names with underscore separators.

Raw data:
https://pandemicdatalake.blob.core.windows.net/public/raw/covid-19/covid_policy_tracker/latest/CovidPolicyTracker.csv

Previous versions of modified and raw data:
https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/
https://pandemicdatalake.blob.core.windows.net/public/raw/covid-19/covid_policy_tracker/

## Data volume

As of June 8, 2020 they contained 27,919 rows (CSV 4.9 MB, JSON 20.9 MB, JSONL 20.8 MB, Parquet 133.0 KB).

## Data source

The source of this data is Thomas Hale, Sam Webster, Anna Petherick, Toby Phillips, and Beatriz Kira. (2020). Oxford COVID-19 Government Response Tracker. [Blavatnik School of Government](https://www.bsg.ox.ac.uk/). Raw data is ingested daily from the [latest OxCGRT csv file](https://github.com/OxCGRT/covid-policy-tracker/blob/master/data/OxCGRT_nat_latest.csv). For more information on this dataset, including how it is collected, see the [Government tracker response site](https://www.bsg.ox.ac.uk/research/research-projects/covid-19-government-response-tracker).

## Data quality
The OxCGRT does not guarantee the accuracy or timeliness of the data. For more information, see the [data quality statement](https://github.com/OxCGRT/covid-policy-tracker#data-quality).

## License and use rights attribution

This data is licensed under the [Creative Commons Attribution 4.0 International License](https://github.com/OxCGRT/covid-policy-tracker/blob/master/LICENSE.txt).

Cite as: Thomas Hale, Sam Webster, Anna Petherick, Toby Phillips, and Beatriz Kira. (2020). Oxford COVID-19 Government Response Tracker. Blavatnik School of Government.

## Contact

For any questions or feedback about this or other datasets in the COVID-19 Data Lake, contact askcovid19dl@microsoft.com.

## Columns

| Name                                  | Data type | Unique | Values (sample)            | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
|---------------------------------------|-----------|--------|----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| c1_flag                               | boolean   | 3      | True                       | Binary flag for geographic scope. 0 - targeted 1 - general Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| c1_school_closing                     | double    | 5      | 3.0 2.0                    | Record closings of schools and universities. 0 - no measures 1 - recommend closing 2 - require closing (only some levels or categories, for example, just high school, or just public schools) 3 - require closing all levels Blank - no data                                                                                                                                                                                                                                                                                                 |
| c2_flag                               | boolean   | 3      | True                       | Binary flag for geographic scope. 0 - targeted; 1 - general; Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| c2_workplace_closing                  | double    | 5      | 2.0 1.0                    | Record closings of workplaces. 0 - no measures 1 - recommend closing (or recommend work from home) 2 - require closing (or work from home) for some sectors or categories of workers 3 - require closing (or work from home) for all-but-essential workplaces (for example, grocery stores, doctors) Blank - no data                                                                                                                                                                                                                          |
| c3_cancel_public_events               | double    | 4      | 2.0 1.0                    | Record canceling public events. 0 - no measures 1 - recommend canceling 2 - require canceling Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                    |
| c3_flag                               | boolean   | 3      | True                       | Binary flag for geographic scope. 0 - targeted 1 - general Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| c4_flag                               | boolean   | 3      | True                       | Binary flag for geographic scope 0 - targeted 1 - general Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| c4_restrictions_on_gatherings         | double    | 6      | 4.0 3.0                    | Record limits on private gatherings. 0 - no restrictions 1 - restrictions on very large gatherings (the limit is above 1000 people) 2 - restrictions on gatherings between 101-1000 people 3 - restrictions on gatherings between 11-100 people 4 - restrictions on gatherings of 10 people or less Blank - no data                                                                                                                                                                                                                 |
| c5_close_public_transport             | double    | 4      | 1.0 2.0                    | Record closing of public transport 0 - no measures 1 - recommend closing (or significantly reduce volume/route/means of transport available) 2 - require closing (or prohibit most citizens from using it) Blank - no data                                                                                                                                                                                                                                                                                                          |
| c5_flag                               | boolean   | 3      | True                       | Binary flag for geographic scope 0 - targeted 1 - general Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| c6_flag                               | boolean   | 3      | True                       | Binary flag for geographic scope 0 - targeted 1 - general Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| c6_stay_at_home_requirements          | double    | 5      | 1.0 2.0                    | Record orders to “shelter-in-place” and otherwise confine to the home 0 - no measures 1 - recommend not leaving house 2 - require not leaving house with exceptions for daily exercise, grocery shopping, and ‘essential’ trips 3 - require not leaving house with minimal exceptions (for example, allowed to leave once a week, or only one person can leave at a time, etc.) Blank - no data                                                                                                                                                |
| c7_flag                               | boolean   | 3      | True                       | Binary flag for geographic scope 0 - targeted 1 - general Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| c7_restrictions_on_internal_movement  | double    | 4      | 2.0 1.0                    | Record restrictions on internal movement between cities/regions 0 - no measures 1 - recommend not to travel between regions/cities 2 - internal movement restrictions in place Blank - no data                                                                                                                                                                                                                                                                                                                                      |
| c8_international_travel_controls      | double    | 6      | 3.0 4.0                    | Record restrictions on international travel. Note: this records policy for foreign travelers, not citizens 0 - no restrictions 1 - screening arrivals 2 - quarantine arrivals from some or all regions 3 - ban arrivals from some regions 4 - ban on all regions or total border closure Blank - no data                                                                                                                                                                                                                           |
| confirmedcases                        | smallint  | 18,238 | 1 2                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| confirmeddeaths                       | smallint  | 14,906 | 1 2                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| countrycode                           | string    | 186    | USA BRA                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| countryname                           | string    | 186    | United States Brazil       |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| date                                  | date      | 478    | 2020-08-25 2021-03-30      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| e1_flag                               | boolean   | 3      | True                       | Binary flag for sectoral scope 0 - formal sector workers only 1 - transfers to informal sector workers to Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                          |
| e1_income_support                     | double    | 4      | 1.0 2.0                    | Record if the government is providing direct cash payments to people who lose their jobs or cannot work. Note: only includes payments to firms if explicitly linked to payroll/salaries 0 - no income support 1 - government is replacing less than 50% of lost salary (or if a flat sum, it is less than 50% median salary) 2 - government is replacing 50% or more of lost salary (or if a flat sum, it is greater than 50% median salary) Blank - no data                                                                        |
| e2_debt/contract_relief               | double    | 4      | 1.0 2.0                    |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| e3_fiscal_measures                    | double    | 819    | -0.01 3.0                  | Announced economic stimulus spending Note: only record amount additional to previously announced spending Record monetary value in USD of fiscal stimuli, includes any spending or tax cuts NOT included in E4, H4, or H5 0 - no new spending that day Blank - no data                                                                                                                                                                                                                                                               |
| e4_international_support              | double    | 113    | -0.02 5000000.0            | Announced offers of Covid-19-related aid spending to other countries/regions Note: only record amount additional to previously announced spending Record monetary value in USD 0 - no new spending that day Blank - no data                                                                                                                                                                                                                                                                                                                 |
| h1_flag                               | boolean   | 3      | True                       | Binary flag for geographic scope 0 - targeted 1 - general Blank - no data                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| h1_public_information_campaigns       | double    | 4      | 2.0 1.0                    | Record presence of public info campaigns 0 - no Covid-19 public information campaign 1 - public officials urging caution about Covid-19 2- coordinated public information campaign (for example, across traditional and social media) Blank - no data                                                                                                                                                                                                                                                                                         |
| h2_testing_policy                     | double    | 5      | 2.0 1.0                    | Record government policy on who has access to testing Note: this records policies about testing for current infection (PCR tests) not testing for immunity (antibody test) 0 - no testing policy 1 - only those who both (a) have symptoms AND (b) meet specific criteria (for example, key workers, admitted to hospital, came into contact with a known case, returned from overseas) 2 - testing of anyone showing Covid-19 symptoms 3 - open public testing (for example “drive through” testing available to asymptomatic people) Blank - no data |
| h3_contact_tracing                    | double    | 4      | 2.0 1.0                    | Record government policy on contact tracing after a positive diagnosis Note: we are looking for policies that would identify all people potentially exposed to Covid-19; voluntary bluetooth apps are unlikely to achieve this 0 - no contact tracing 1 - limited contact tracing; not done for all cases 2 - comprehensive contact tracing; done for all identified cases                                                                                                                                                          |
| h4_emergency_investment_in_healthcare | double    | 462    | 35.0 562.0                 | Announced short-term spending on healthcare system, for example, hospitals, masks, etc. Note: only record amount additional to previously announced spending Record monetary value in USD 0 - no new spending that day Blank - no data                                                                                                                                                                                                                                                                                                         |
| h5_investment_in_vaccines             | double    | 133    | 1.0 191.0                  | Announced public spending on Covid-19 vaccine development Note: only record amount additional to previously announced spending Record monetary value in USD 0 - no new spending that day Blank - no data                                                                                                                                                                                                                                                                                                                            |
| iso_country                           | string    | 186    | US BR                      | ISO 3166 country or region code                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| load_date                             | timestamp | 1      | 2021-04-26 00:06:25.157000 | Date and time data was loaded from external source                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| stringencyindex                       | double    | 188    | 11.11 60.19                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| stringencyindexfordisplay             | double    | 188    | 11.11 60.19                |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

## Preview

| countryname | countrycode | date       | c1_school_closing | c2_workplace_closing | c3_cancel_public_events | c4_restrictions_on_gatherings | c5_close_public_transport | c6_stay_at_home_requirements | c7_restrictions_on_internal_movement | c8_international_travel_controls | e1_income_support | e2_debt/contract_relief | e3_fiscal_measures | e4_international_support | h1_public_information_campaigns | h2_testing_policy | h3_contact_tracing | h4_emergency_investment_in_healthcare | h5_investment_in_vaccines | m1_wildcard | stringencyindex | stringencyindexfordisplay | iso_country | load_date             |
|-------------|-------------|------------|-------------------|----------------------|-------------------------|-------------------------------|---------------------------|------------------------------|--------------------------------------|----------------------------------|-------------------|-------------------------|--------------------|--------------------------|---------------------------------|-------------------|--------------------|---------------------------------------|---------------------------|-------------|-----------------|---------------------------|-------------|-----------------------|
| Aruba       | ABW         | 2020-01-01 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-02 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-03 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-04 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-05 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-06 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-07 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-08 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-09 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |
| Aruba       | ABW         | 2020-01-10 | 0                 | 0                    | 0                       | 0                             | 0                         | 0                            | 0                                    | 0                                | 0                 | 0                       | 0                  | 0                        | 0                               | 0                 | 0                  | 0                                     | 0                         | null        | 0               | 0                         | AW          | 4/26/2021 12:06:25 AM |

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=oxford-covid-19-government-response-tracker -->

> [!TIP]
> **[Download the notebook instead](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureNotebooks&package=azure-storage&registryId=oxford-covid-19-government-response-tracker)**.

## This notebook documents the URLs and sample code to access the Oxford Covid-19 Government Response Tracker (OxCGRT) dataset

URLs of different file formats hosted on Azure Blob Storage:

CSV: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.csv 

JSON: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.json

JSONL: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.jsonl 

Parquet: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.parquet

Download the dataset file using the built-in capability download from an http URL in Pandas. Pandas has readers for various file formats:

https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_parquet.html

https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html


Start by loading the dataset file into a pandas dataframe and view some sample rows

```python
import pandas as pd
import numpy as np
%matplotlib inline
import matplotlib.pyplot as plt

df = pd.read_parquet("https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.parquet")
df.head(10)
```

Lets check the data types of the various fields and verify that the updated column is datetime format

```python
df.dtypes
```

This dataset contains data for the numerous countries/regions. Lets verify what countries/regions we have data for.

We will start by looking at the latest data for each country:

```python
df.groupby('countryname').first().filter(['confirmedcases ', 'confirmeddeaths','h5_investment_in_vaccines',
    'c6_stay_at_home_requirements','h4_emergency_investment_in_healthcare','c4_restrictions_on_gatherings', 'load_date'])
```

Next, we will do some aggregations to make sure columns such as `confirmedcases` and `confirmeddeaths` tally with the latest data. You should see that positive and death numbers for latest date in the above table match with the aggregation of `confirmedcases` and `confirmeddeaths`.


```python
df.groupby('countryname').agg({'countryname': 'count','confirmedcases': 'sum','confirmeddeaths': 'sum',
                               'h5_investment_in_vaccines': 'count', 'c6_stay_at_home_requirements':'sum'})
```

Lets do some basic visualizations for a few countries/regions

```python
import plotly.graph_objects as go
import plotly.express as px
import matplotlib.pyplot as plt

df.loc[: , ['countryname', 'confirmedcases', 
'confirmeddeaths']].groupby(['countryname']).max().sort_values(by='confirmedcases', 
                                           ascending=False).reset_index()[:15].style.background_gradient(cmap='rainbow')
```

```python
df_US = df.groupby(df.date).agg({'confirmedcases': 'sum','confirmeddeaths':'sum'}).reset_index()

df_US.plot(kind='line',x='date',y="confirmedcases",grid=True)
df_US.plot(kind='line',x='date',y="confirmeddeaths",grid=True)

```

<!-- nbend -->

# [pyspark](#tab/pyspark)

Sample not available for this platform/package combination.

---

### Azure Databricks

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=oxford-covid-19-government-response-tracker -->

> [!TIP]
> **[Download the notebook instead.](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureDatabricks&package=pyspark&registryId=oxford-covid-19-government-response-tracker)**.

```python
# Azure storage access info
blob_account_name = "pandemicdatalake"
blob_container_name = "public"
blob_relative_path = "curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.parquet"
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

# [azure-storage](#tab/azure-storage)

Sample not available for this platform/package combination.

# [pyspark](#tab/pyspark)

<!-- nbstart https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=oxford-covid-19-government-response-tracker -->

> [!TIP]
> **[Download the notebook instead.](https://opendatasets-api.azure.com/discoveryapi/OpenDataset/DownloadNotebook?serviceType=AzureSynapse&package=pyspark&registryId=oxford-covid-19-government-response-tracker)**.

```python
# Azure storage access info
blob_account_name = "pandemicdatalake"
blob_container_name = "public"
blob_relative_path = "curated/covid-19/covid_policy_tracker/latest/covid_policy_tracker.parquet"
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
