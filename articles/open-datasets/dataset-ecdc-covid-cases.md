---
title: European Centre for Disease Prevention and Control (ECDC) COVID-19 Cases
description: Learn how to use the European Centre for Disease Prevention and Control (ECDC) COVID-19 Cases dataset in Azure Open Datasets.
ms.service: open-datasets
ms.topic: sample
ms.date: 04/16/2021
---

# European Centre for Disease Prevention and Control (ECDC) COVID-19 Cases

The [latest available public data](https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide) on geographic distribution of COVID-19 cases worldwide from the European Center for Disease Prevention and Control (ECDC). Each row/entry contains the number of new cases reported per day and per country or region.

[!INCLUDE [Open Dataset usage notice](../../includes/open-datasets-usage-note.md)]

## Datasets

Modified versions of the dataset are available in CSV, JSON, JSON-Lines, and Parquet, updated daily:
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.csv
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.json
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.jsonl
- https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.parquet

All modified versions have iso_country_region codes and load times added, and use lower case column names with underscore separators.

Raw data:
https://pandemicdatalake.blob.core.windows.net/public/raw/covid-19/ecdc_cases/latest/ECDCCases.csv

Previous versions of modified and raw data:
https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/
https://pandemicdatalake.blob.core.windows.net/public/raw/covid-19/ecdc_cases/

## Data volume
As of May 28, 2020 they contained 19,876 rows (CSV 1.5 MB, JSON 4.9 MB, JSONL 4.9 MB, Parquet 54.1 KB).

## Data source

Raw data is ingested daily from the [ECDC csv file](https://opendata.ecdc.europa.eu/covid19/casedistribution/csv). For more information on this dataset, including its origins, see the [ECDC data collection page](https://www.ecdc.europa.eu/en/covid-19/data-collection).

## Data quality
The ECDC does not guarantee the accuracy or timeliness of the data. [Read the disclaimer](https://www.ecdc.europa.eu/en/covid-19/data-collection).

## License and use rights attribution

This data is made available and may be used as permitted under the ECDC copyright policy here. For any documents where the copyright lies with a third party, permission for reproduction must be obtained from the copyright holder.

ECDC must always be acknowledged as the original source of this data. Such acknowledgment must be included in each copy of the material.

## Contact

For any questions or feedback about this or other datasets in the COVID-19 Data Lake, please contact askcovid19dl@microsoft.com.

## Columns

| Name                      | Data type | Unique | Values (sample)            | Description                            |
|---------------------------|-----------|--------|----------------------------|----------------------------------------|
| cases                     | smallint  | 5,515  | 1 2                        | Number of reported cases               |
| continent_exp             | string    | 6      | Europe Africa              | Continent name                         |
| countries_and_territories | string    | 214    | Canada Belgium             | Country or territory name              |
| country_territory_code    | string    | 213    | KOR ISL                    | Three letter country or territory code |
| date_rep                  | date      | 350    | 2020-12-11 2020-11-22      | Date of the report                     |
| day                       | smallint  | 31     | 14 13                      | Day of month                           |
| deaths                    | smallint  | 1,049  | 1 2                        | Number of reported deaths              |
| geo_id                    | string    | 214    | CA SE                      | Geo identifier                         |
| iso_country               | string    | 214    | SE US                      | ISO 3166 country or region code        |
| load_date                 | timestamp | 1      | 2021-04-26 00:06:22.123000 | Date the data was loaded to Azure      |
| month                     | smallint  | 12     | 10 8                       | Month number                           |
| year                      | smallint  | 2      | 2020 2019                  | Year                                   |

## Preview

| date_rep   | day | month | year | cases | deaths | countries_and_territories | geo_id | country_territory_code | continent_exp | load_date             | iso_country |
|------------|-----|-------|------|-------|--------|---------------------------|--------|------------------------|---------------|-----------------------|-------------|
| 2020-12-14 | 14  | 12    | 2020 | 746   | 6      | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-13 | 13  | 12    | 2020 | 298   | 9      | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-12 | 12  | 12    | 2020 | 113   | 11     | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-11 | 11  | 12    | 2020 | 63    | 10     | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-10 | 10  | 12    | 2020 | 202   | 16     | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-09 | 9   | 12    | 2020 | 135   | 13     | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-08 | 8   | 12    | 2020 | 200   | 6      | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-07 | 7   | 12    | 2020 | 210   | 26     | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-06 | 6   | 12    | 2020 | 234   | 10     | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |
| 2020-12-05 | 5   | 12    | 2020 | 235   | 18     | Afghanistan               | AF     | AFG                    | Asia          | 4/26/2021 12:06:22 AM | AF          |

## Data access

### Azure Notebooks

# [azure-storage](#tab/azure-storage)

This notebook documents the URLs and sample code to access the European Centre for Disease Prevention and Control (ECDC) Covid-19 Cases dataset URLs of different dataset file formats hosted on Azure Blob Storage:¶
CSV: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.csv

JSON: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.json

JSONL: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.jsonl

Parquet: https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.parquet

Download the dataset file using the built-in capability download from an http URL in Pandas. Pandas has readers for various file formats:

https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_parquet.html

https://pandas.pydata.org/pandas-docs/stable/reference/api/pandas.read_csv.html


```python
import pandas as pd
import numpy as np
%matplotlib inline
import matplotlib.pyplot as plt

df = pd.read_parquet("https://pandemicdatalake.blob.core.windows.net/public/curated/covid-19/ecdc_cases/latest/ecdc_cases.parquet")
df.head(10)

df.dtypes

df.groupby('countries_and_territories').first().filter(['continent_exp','cases', 'deaths','date_rep'])

df.groupby('continent_exp').agg({'countries_and_territories': 'count','cases': 'count','deaths': 'count'})

import plotly.graph_objects as go
import plotly.express as px
import matplotlib.pyplot as plt

df.loc[: , ['countries_and_territories', 'cases', 'deaths']].groupby(['countries_and_territories'
         ]).max().sort_values(by='cases',ascending=False).reset_index()[:15].style.background_gradient(cmap='rainbow')

df_Worldwide=df[df['countries_and_territories']=='United_States_of_America']

df.plot(kind='line',x='date_rep',y="cases",grid=True)
df.plot(kind='line',x='date_rep',y="deaths",grid=True)
#df_Worldwide.plot(kind='line',x='date_rep',y="confirmed_change",grid=True)
#df_Worldwide.plot(kind='line',x='date_rep',y="deaths_change",grid=True)

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
blob_relative_path = "curated/covid-19/ecdc_cases/latest/ecdc_cases.parquet"
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
blob_relative_path = "curated/covid-19/ecdc_cases/latest/ecdc_cases.parquet"
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

## Examples

See examples of how this dataset can be used:

- [Analyze COVID data with Synapse SQL serverless endpoint](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/how-azure-synapse-analytics-helps-you-analyze-covid-data-with/ba-p/1457836)
- [Linear regression analysis on COVID data using SQL endpoint in Azure Synapse Analytics](https://techcommunity.microsoft.com/t5/azure-synapse-analytics/linear-regression-analysis-on-covid-data-using-sql-endpoint-in/ba-p/1468697)

## Next steps

View the rest of the datasets in the [Open Datasets catalog](dataset-catalog.md).
