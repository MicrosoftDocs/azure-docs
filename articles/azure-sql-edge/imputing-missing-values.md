---
title: Filling time gaps and imputing missing values - Azure SQL Edge
description: Learn about filling time gaps and imputing missing values in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
keywords:
  - SQL Edge
  - timeseries
---
# Fill time gaps and imputing missing values

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

When dealing with time series data, it's often possible that the time series data has missing values for the attributes. It's also possible that, because of the nature of the data, or because of interruptions in data collection, there are time *gaps* in the dataset.

For example, when collecting energy usage statistics for a smart device, whenever the device isn't operational there are gaps in the usage statistics. Similarly, in a machine telemetry data collection scenario, it's possible that the different sensors are configured to emit data at different frequencies, resulting in missing values for the sensors. For example, if there are two sensors, voltage and pressure, configured at 100 Hz and 10-Hz frequency respectively, the voltage sensor emits data every one-hundredth of a second, while the pressure sensor only emits data every one-tenth of a second.

The following table describes a machine telemetry dataset, which was collected at a one-second interval.

```output
timestamp               VoltageReading  PressureReading
----------------------- --------------- ----------------
2020-09-07 06:14:41.000 164.990400      97.223600
2020-09-07 06:14:42.000 162.241300      93.992800
2020-09-07 06:14:43.000 163.271200      NULL
2020-09-07 06:14:44.000 161.368100      93.403700
2020-09-07 06:14:45.000 NULL            NULL
2020-09-07 06:14:46.000 NULL            98.364800
2020-09-07 06:14:49.000 NULL            94.098300
2020-09-07 06:14:51.000 157.695700      103.359100
2020-09-07 06:14:52.000 157.019200      NULL
2020-09-07 06:14:54.000 NULL            95.352000
2020-09-07 06:14:56.000 159.183500      100.748200
```

There are two important characteristics of the preceding dataset.

- The dataset doesn't contain any data points related to several timestamps `2020-09-07 06:14:47.000`, `2020-09-07 06:14:48.000`, `2020-09-07 06:14:50.000`, `2020-09-07 06:14:53.000`, and `2020-09-07 06:14:55.000`. These timestamps are *gaps* in the dataset.
- There are missing values, represented as `null`, for the Voltage and pressure readings.

## Gap filling

Gap filling is a technique that helps create contiguous, ordered set of timestamps to ease the analysis of time series data. In Azure SQL Edge, the easiest way to fill gaps in the time series dataset is to define a temporary table with the desired time distribution and then do a `LEFT OUTER JOIN` or a `RIGHT OUTER JOIN` operation on the dataset table.

Taking the `MachineTelemetry` data represented previously as an example, the following query can be used to generate contiguous, ordered set of timestamps for analysis.

> [!NOTE]  
> The following query generates the missing rows, with the timestamp values and `null` values for the attributes.

```sql
CREATE TABLE #SeriesGenerate (dt DATETIME PRIMARY KEY CLUSTERED)
GO

DECLARE @startdate DATETIME = '2020-09-07 06:14:41.000',
    @endtime DATETIME = '2020-09-07 06:14:56.000'

WHILE (@startdate <= @endtime)
BEGIN
    INSERT INTO #SeriesGenerate
    VALUES (@startdate)

    SET @startdate = DATEADD(SECOND, 1, @startdate)
END

SELECT a.dt AS TIMESTAMP,
    b.VoltageReading,
    b.PressureReading
FROM #SeriesGenerate a
LEFT JOIN MachineTelemetry b
    ON a.dt = b.[timestamp];
```

The above query produces the following output containing all *one-second* timestamps in the specified range.

Here's the result set:

```output
timestamp               VoltageReading    PressureReading
----------------------- ----------------- ----------------
2020-09-07 06:14:41.000 164.990400        97.223600
2020-09-07 06:14:42.000 162.241300        93.992800
2020-09-07 06:14:43.000 163.271200        NULL
2020-09-07 06:14:44.000 161.368100        93.403700
2020-09-07 06:14:45.000 NULL              NULL
2020-09-07 06:14:46.000 NULL              98.364800
2020-09-07 06:14:47.000 NULL              NULL
2020-09-07 06:14:48.000 NULL              NULL
2020-09-07 06:14:49.000 NULL              94.098300
2020-09-07 06:14:50.000 NULL              NULL
2020-09-07 06:14:51.000 157.695700        103.359100
2020-09-07 06:14:52.000 157.019200        NULL
2020-09-07 06:14:53.000 NULL              NULL
2020-09-07 06:14:54.000 NULL              95.352000
2020-09-07 06:14:55.000 NULL              NULL
2020-09-07 06:14:56.000 159.183500        100.748200
```

## Impute missing values

The preceding query generated the missing timestamps for data analysis, however it didn't replace any of the missing values (represented as null) for `voltage` and `pressure` readings. In Azure SQL Edge, a new syntax was added to the T-SQL `LAST_VALUE()` and `FIRST_VALUE()` functions, which provide mechanisms to impute missing values, based on the preceding or following values in the dataset.

The new syntax adds `IGNORE NULLS` and `RESPECT NULLS` clause to the `LAST_VALUE()` and `FIRST_VALUE()` functions. A following query on the `MachineTelemetry` dataset computes the missing values using the LAST_VALUE function, where missing values are replaced with the last observed value in the dataset.

```sql
SELECT timestamp,
    VoltageReading AS OriginalVoltageValues,
    LAST_VALUE(VoltageReading) IGNORE NULLS OVER (
        ORDER BY timestamp
        ) AS ImputedUsingLastValue,
    PressureReading AS OriginalPressureValues,
    LAST_VALUE(PressureReading) IGNORE NULLS OVER (
        ORDER BY timestamp
        ) AS ImputedUsingLastValue
FROM MachineTelemetry
ORDER BY timestamp;
```

Here's the result set:

```output
timestamp               OrigVoltageVals  ImputedVoltage OrigPressureVals  ImputedPressure
----------------------- ---------------- -------------- ----------------- ----------------
2020-09-07 06:14:41.000 164.990400       164.990400     97.223600         97.223600
2020-09-07 06:14:42.000 162.241300       162.241300     93.992800         93.992800
2020-09-07 06:14:43.000 163.271200       163.271200     NULL              93.992800
2020-09-07 06:14:44.000 161.368100       161.368100     93.403700         93.403700
2020-09-07 06:14:45.000 NULL             161.368100     NULL              93.403700
2020-09-07 06:14:46.000 NULL             161.368100     98.364800         98.364800
2020-09-07 06:14:49.000 NULL             161.368100     94.098300         94.098300
2020-09-07 06:14:51.000 157.695700       157.695700     103.359100        103.359100
2020-09-07 06:14:52.000 157.019200       157.019200     NULL              103.359100
2020-09-07 06:14:54.000 NULL             157.019200     95.352000         95.352000
2020-09-07 06:14:56.000 159.183500       159.183500     100.748200        100.748200
```

The following query imputes the missing values using both the `LAST_VALUE()` and the `FIRST_VALUE` function. For the output column `ImputedVoltage`, the last observed value replaces the missing values, while for the output column `ImputedPressure` the missing values are replaced by the next observed value in the dataset.

```sql
SELECT dt AS [timestamp],
    VoltageReading AS OrigVoltageVals,
    LAST_VALUE(VoltageReading) IGNORE NULLS OVER (
        ORDER BY dt
        ) AS ImputedVoltage,
    PressureReading AS OrigPressureVals,
    FIRST_VALUE(PressureReading) IGNORE NULLS OVER (
        ORDER BY dt ROWS BETWEEN CURRENT ROW
                AND UNBOUNDED FOLLOWING
        ) AS ImputedPressure
FROM (
    SELECT a.dt,
        b.VoltageReading,
        b.PressureReading
    FROM #SeriesGenerate a
    LEFT JOIN MachineTelemetry b
        ON a.dt = b.[timestamp]
    ) A
ORDER BY timestamp;
```

Here's the result set:

```output
timestamp               OrigVoltageVals  ImputedVoltage  OrigPressureVals  ImputedPressure
----------------------- ---------------- --------------- ----------------- ---------------
2020-09-07 06:14:41.000 164.990400       164.990400      97.223600         97.223600
2020-09-07 06:14:42.000 162.241300       162.241300      93.992800         93.992800
2020-09-07 06:14:43.000 163.271200       163.271200      NULL              93.403700
2020-09-07 06:14:44.000 161.368100       161.368100      93.403700         93.403700
2020-09-07 06:14:45.000 NULL             161.368100      NULL              98.364800
2020-09-07 06:14:46.000 NULL             161.368100      98.364800         98.364800
2020-09-07 06:14:47.000 NULL             161.368100      NULL              94.098300
2020-09-07 06:14:48.000 NULL             161.368100      NULL              94.098300
2020-09-07 06:14:49.000 NULL             161.368100      94.098300         94.098300
2020-09-07 06:14:50.000 NULL             161.368100      NULL              103.359100
2020-09-07 06:14:51.000 157.695700       157.695700      103.359100        103.359100
2020-09-07 06:14:52.000 157.019200       157.019200      NULL              95.352000
2020-09-07 06:14:53.000 NULL             157.019200      NULL              95.352000
2020-09-07 06:14:54.000 NULL             157.019200      95.352000         95.352000
2020-09-07 06:14:55.000 NULL             157.019200      NULL              100.748200
2020-09-07 06:14:56.000 159.183500       159.183500      100.748200        100.748200
```

> [!NOTE]  
> The above query uses the `FIRST_VALUE()` function to replace missing values with the next observed value. The same result can be achieved by using the `LAST_VALUE()` function with a `ORDER BY <ordering_column> DESC` clause.

## Next steps

- [FIRST_VALUE (Transact-SQL)](/sql/t-sql/functions/first-value-transact-sql?toc=%2fazure%2fazure-sql-edge%2ftoc.json)
- [LAST_VALUE (Transact-SQL)](/sql/t-sql/functions/last-value-transact-sql?toc=%2fazure%2fazure-sql-edge%2ftoc.json)
- [DATE_BUCKET (Transact-SQL)](date-bucket-tsql.md)
- [Aggregate Functions (Transact-SQL)](/sql/t-sql/functions/aggregate-functions-transact-sql)
