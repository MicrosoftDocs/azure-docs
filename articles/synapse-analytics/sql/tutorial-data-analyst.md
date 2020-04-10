---
title: "Data Analyst tutorial - Use SQL on-demand (preview) to analyze Azure Open Datasets in Azure Synapse Studio (preview)"
description: In this tutorial, you will learn how to easily perform exploratory data analysis combining different Azure Open Datasets using SQL on-demand (preview) and visualize the results in Azure Synapse Studio.
services: synapse-analytics
author: azaricstefan
ms.service: synapse-analytics
ms.topic: tutorial
ms.subservice:
ms.date: 04/15/2020
ms.author: v-stazar
ms.reviewer: jrasnick, carlrab
---

# Use SQL on-demand (preview) to analyze Azure Open Datasets and visualize the results in Azure Synapse Studio (preview)

In this tutorial, you learn how to perform exploratory data analysis by combining different Azure Open Datasets using SQL on-demand and then visualizing the results in Azure Synapse Studio.

In particular, you analyze the [New York City (NYC) Taxi dataset](https://azure.microsoft.com/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/) that includes pick-up and drop-off dates/times, pick-up and drop-off locations, trip distances, itemized fares, rate types, payment types, and driver-reported passenger counts.

The focus of the analysis is to find trends in changes of number of taxi rides over time. You analyze two other Azure Open Datasets ([Public Holidays](https://azure.microsoft.com/services/open-datasets/catalog/public-holidays/) and [Weather Data](https://azure.microsoft.com/services/open-datasets/catalog/noaa-integrated-surface-data/)) to understand the outliers in number of taxi rides.

## Create credentials

```sql
-- There is no secret. We are using public storage account which doesn't need a secret.
CREATE CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/nyctlc]
WITH IDENTITY='SHARED ACCESS SIGNATURE',
SECRET = ''
GO

CREATE CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/holidaydatacontainer]
WITH IDENTITY='SHARED ACCESS SIGNATURE',
SECRET = ''
GO

CREATE CREDENTIAL [https://azureopendatastorage.blob.core.windows.net/isdweatherdatacontainer]
WITH IDENTITY='SHARED ACCESS SIGNATURE',
SECRET = ''
GO
```

## Automatic schema inference

Since data is stored in Parquet file format, automatic schema inference is available, so one can easily query the data without a need to list the data types of all columns in the files. Furthermore, one can utilize virtual column mechanism and filepath function to filter out a certain subset of files.

Let's first familiarize with the NYC Taxi data by running the following query:

```sql
SELECT TOP 100 * FROM
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/nyctlc/yellow/puYear=*/puMonth=*/*.parquet',
        FORMAT='PARQUET'
    ) AS [nyc]
```

The following shows the result snippet for the NYC Taxi data:

![result snippet](./media/tutorial-data-analyst/1.png)

Similarly, we can query the public holidays dataset using the following query:

```sql
SELECT TOP 100 * FROM
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/holidaydatacontainer/Processed/*.parquet',
        FORMAT='PARQUET'
    ) AS [holidays]
```

The following shows the result snippet for the public holidays dataset:

![result snippet 2](./media/tutorial-data-analyst/2.png)

Lastly we can also query the weather dataset using the following query:

```sql
SELECT
    TOP 100 *
FROM  
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/isdweatherdatacontainer/ISDWeather/year=*/month=*/*.parquet',
        FORMAT='PARQUET'
    ) AS [weather]
```

The following shows the result snippet for the weather dataset:

![result snippet 3](./media/tutorial-data-analyst/3.png)

You can learn more about the meaning of the individual columns in the descriptions of the [NYC Taxi](https://azure.microsoft.com/services/open-datasets/catalog/nyc-taxi-limousine-commission-yellow-taxi-trip-records/), [Public Holidays](https://azure.microsoft.com/services/open-datasets/catalog/public-holidays/), and [Weather Data](https://azure.microsoft.com/services/open-datasets/catalog/noaa-integrated-surface-data/) datasets.

## Time series, seasonality, and outlier analysis

You can easily summarize yearly number of taxi rides using the following query:

```sql
SELECT
    YEAR(tpepPickupDateTime) AS current_year,
    COUNT(*) AS rides_per_year
FROM
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/nyctlc/yellow/puYear=*/puMonth=*/*.parquet',
        FORMAT='PARQUET'
    ) AS [nyc]
WHERE nyc.filepath(1) >= '2009' AND nyc.filepath(1) <= '2019'
GROUP BY YEAR(tpepPickupDateTime)
ORDER BY 1 ASC
```

The following shows the result snippet for the yearly number of taxi rides:

![result snippet 4](./media/tutorial-data-analyst/4.png)

The data can be visualized in Synapse Studio by switching from Table to Chart view. You can choose among different chart types (Area, Bar, Column, Line, Pie, and Scatter). In this case, let's plot Column chart with Category column set to "current_year":

![result visualization 5](./media/tutorial-data-analyst/5.png)

From this visualization, a trend of a decreasing number of rides over years can be clearly seen, presumably due to a recent increased popularity of ride sharing companies.

> [!NOTE]
> At the time of writing this tutorial, data for 2019 is incomplete, so there is a huge drop in a number of rides for that year.

Next, let's focus our analysis on a single year, for example, 2016. The following query returns daily number of rides during that year:

```sql
SELECT
    CAST([tpepPickupDateTime] AS DATE) AS [current_day],
    COUNT(*) as rides_per_day
FROM
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/nyctlc/yellow/puYear=*/puMonth=*/*.parquet',
        FORMAT='PARQUET'
    ) AS [nyc]
WHERE nyc.filepath(1) = '2016'
GROUP BY CAST([tpepPickupDateTime] AS DATE)
ORDER BY 1 ASC
```

The following shows the result snippet for this query:

![result snippet 6](./media/tutorial-data-analyst/6.png)

Again, we can easily visualize data by plotting Column chart with Category column "current_day" and Legend (series) column "rides_per_day".

![result visualization 7](./media/tutorial-data-analyst/7.png)

From the plot, it can be observed that there is a weekly pattern, with the Saturday's peak. During summer months, there are fewer taxi rides due to vacation period. However, there are also some significant drops in number of taxi rides without a clear pattern when and why they occur.

Next, let's see if those drops are potentially correlated with public holidays by joining NYC taxi rides with the public holidays dataset:

```sql
WITH taxi_rides AS
(
    SELECT
        CAST([tpepPickupDateTime] AS DATE) AS [current_day],
        COUNT(*) as rides_per_day
    FROM  
        OPENROWSET(
            BULK 'https://azureopendatastorage.blob.core.windows.net/nyctlc/yellow/puYear=*/puMonth=*/*.parquet',
            FORMAT='PARQUET'
        ) AS [nyc]
    WHERE nyc.filepath(1) = '2016'
    GROUP BY CAST([tpepPickupDateTime] AS DATE)
),
public_holidays AS
(
    SELECT
        holidayname as holiday,
        date
    FROM
        OPENROWSET(
            BULK 'https://azureopendatastorage.blob.core.windows.net/holidaydatacontainer/Processed/*.parquet',
            FORMAT='PARQUET'
        ) AS [holidays]
    WHERE countryorregion = 'United States' AND YEAR(date) = 2016
)
SELECT
*
FROM taxi_rides t
LEFT OUTER JOIN public_holidays p on t.current_day = p.date
ORDER BY current_day ASC
```

![result visualization 8](./media/tutorial-data-analyst/8.png)

This time, we want to highlight number of taxi rides during public holidays. For that purpose, we will choose "none" for Category column and "rides_per_day", and "holiday" as Legend (series) columns.

![result visualization 9](./media/tutorial-data-analyst/9.png)

From the plot, it can be clearly seen that during public holidays a number of taxi rides is lower. However, there is still one unexplained huge drop on January 23. Let's check the weather in NYC on that day by querying the weather dataset:

```sql
SELECT
    AVG(windspeed) AS avg_windspeed,
    MIN(windspeed) AS min_windspeed,
    MAX(windspeed) AS max_windspeed,
    AVG(temperature) AS avg_temperature,
    MIN(temperature) AS min_temperature,
    MAX(temperature) AS max_temperature,
    AVG(sealvlpressure) AS avg_sealvlpressure,
    MIN(sealvlpressure) AS min_sealvlpressure,
    MAX(sealvlpressure) AS max_sealvlpressure,
    AVG(precipdepth) AS avg_precipdepth,
    MIN(precipdepth) AS min_precipdepth,
    MAX(precipdepth) AS max_precipdepth,
    AVG(snowdepth) AS avg_snowdepth,
    MIN(snowdepth) AS min_snowdepth,
    MAX(snowdepth) AS max_snowdepth
FROM
    OPENROWSET(
        BULK 'https://azureopendatastorage.blob.core.windows.net/isdweatherdatacontainer/ISDWeather/year=*/month=*/*.parquet',
        FORMAT='PARQUET'
    ) AS [weather]
WHERE countryorregion = 'US' AND CAST([datetime] AS DATE) = '2016-01-23' AND stationname = 'JOHN F KENNEDY INTERNATIONAL AIRPORT'
```

![result visualization 10](./media/tutorial-data-analyst/10.png)

The results of the query indicate that the drop in a number of taxi rides was due to the:

- blizzard on that day in NYC, as there was heavy snow (~30 cm)
- it was cold (temperature below zero degrees Celsius)
- and windy (~10m/s)

This tutorial has shown how data analyst can quickly perform exploratory data analysis, easily combine different datasets using SQL on-demand, and visualize the results using Azure Synapse Studio.

## Next steps

Advance to the next article to learn how to connect SQL on-demand to Power BI Desktop & create report.
> [!div class="nextstepaction"]
> [Connect SQL on-demand to Power BI Desktop & create report](tutorial-connect-power-bi-desktop.md)
