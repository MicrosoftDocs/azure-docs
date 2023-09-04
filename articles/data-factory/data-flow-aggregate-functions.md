---
title: Aggregate functions in the mapping data flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about aggregate functions in mapping data flow.
author: kromerm
ms.author: makromer
ms.service: data-factory
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 07/13/2023
---

# Aggregate functions in mapping data flow

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

The following articles provide details about aggregate functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Aggregate function list

The following functions are only available in aggregate, pivot, unpivot, and window transformations.

| Aggregate function | Task |
|----|----|
| [approxDistinctCount](data-flow-expressions-usage.md#approxDistinctCount) | Gets the approximate aggregate count of distinct values for a column. The optional second parameter is to control the estimation error.|
| [avg](data-flow-expressions-usage.md#avg) | Gets the average of values of a column.  |
| [avgIf](data-flow-expressions-usage.md#avgIf) | Based on a criteria gets the average of values of a column.  |
| [collect](data-flow-expressions-usage.md#collect) | Collects all values of the expression in the aggregated group into an array. Structures can be collected and transformed to alternate structures during this process. The number of items will be equal to the number of rows in that group and can contain null values. The number of collected items should be small.  |
| [collectUnique](data-flow-expressions-usage.md#collectUnique) | Collects all values of the expression in the aggregated group into a unique array. Structures can be collected and transformed to alternate structures during this process.The number of items will be smaller or equal to the number of rows in that group and can contain null values. The number of collected items should be small. |
| [count](data-flow-expressions-usage.md#count) | Gets the aggregate count of values. If the optional column(s) is specified, it ignores NULL values in the count.  |
| [countAll](data-flow-expressions-usage.md#countAll) | Gets the aggregate count of values including NULLs.  |
| [countDistinct](data-flow-expressions-usage.md#countDistinct) | Gets the aggregate count of distinct values of a set of columns.  |
| [countAllDistinct](data-flow-expressions-usage.md#countAllDistinct) | Gets the aggregate count of distinct values of a set of columns including NULLs.  |
| [countIf](data-flow-expressions-usage.md#countIf) | Based on a criteria gets the aggregate count of values. If the optional column is specified, it ignores NULL values in the count.  |
| [covariancePopulation](data-flow-expressions-usage.md#covariancePopulation) | Gets the population covariance between two columns.  |
| [covariancePopulationIf](data-flow-expressions-usage.md#covariancePopulationIf) | Based on a criteria, gets the population covariance of two columns.  |
| [covarianceSample](data-flow-expressions-usage.md#covarianceSample) | Gets the sample covariance of two columns.  |
| [covarianceSampleIf](data-flow-expressions-usage.md#covarianceSampleIf) | Based on a criteria, gets the sample covariance of two columns.  |
| [first](data-flow-expressions-usage.md#first) | Gets the first value of a column group. If the second parameter ignoreNulls is omitted, it is assumed false.  |
| [isDistinct](data-flow-expressions-usage.md#isDistinct) | Finds if a column or set of columns is distinct. It does not count null as a distinct value|
| [kurtosis](data-flow-expressions-usage.md#kurtosis) | Gets the kurtosis of a column.  |
| [kurtosisIf](data-flow-expressions-usage.md#kurtosisIf) | Based on a criteria, gets the kurtosis of a column.  |
| [last](data-flow-expressions-usage.md#last) | Gets the last value of a column group. If the second parameter ignoreNulls is omitted, it is assumed false.  |
| [max](data-flow-expressions-usage.md#max) | Gets the maximum value of a column.  |
| [maxIf](data-flow-expressions-usage.md#maxIf) | Based on a criteria, gets the maximum value of a column.  |
| [mean](data-flow-expressions-usage.md#mean) | Gets the mean of values of a column. Same as AVG.  |
| [meanIf](data-flow-expressions-usage.md#meanIf) | Based on a criteria gets the mean of values of a column. Same as avgIf.  |
| [min](data-flow-expressions-usage.md#min) | Gets the minimum value of a column.  |
| [minIf](data-flow-expressions-usage.md#minIf) | Based on a criteria, gets the minimum value of a column.  |
| [skewness](data-flow-expressions-usage.md#skewness) | Gets the skewness of a column.  |
| [skewnessIf](data-flow-expressions-usage.md#skewnessIf) | Based on a criteria, gets the skewness of a column.  |
| [stddev](data-flow-expressions-usage.md#stddev) | Gets the standard deviation of a column.  |
| [stddevIf](data-flow-expressions-usage.md#stddevIf) | Based on a criteria, gets the standard deviation of a column.  |
| [stddevPopulation](data-flow-expressions-usage.md#stddevPopulation) | Gets the population standard deviation of a column.  |
| [stddevPopulationIf](data-flow-expressions-usage.md#stddevPopulationIf) | Based on a criteria, gets the population standard deviation of a column.  |
| [stddevSample](data-flow-expressions-usage.md#stddevSample) | Gets the sample standard deviation of a column.  |
| [stddevSampleIf](data-flow-expressions-usage.md#stddevSampleIf) | Based on a criteria, gets the sample standard deviation of a column.  |
| [sum](data-flow-expressions-usage.md#sum) | Gets the aggregate sum of a numeric column.  |
| [sumDistinct](data-flow-expressions-usage.md#sumDistinct) | Gets the aggregate sum of distinct values of a numeric column.  |
| [sumDistinctIf](data-flow-expressions-usage.md#sumDistinctIf) | Based on criteria gets the aggregate sum of a numeric column. The condition can be based on any column.  |
| [sumIf](data-flow-expressions-usage.md#sumIf) | Based on criteria gets the aggregate sum of a numeric column. The condition can be based on any column.  |
| [topN](data-flow-expressions-usage.md#topN) | Gets the top N values for this column.  |
| [variance](data-flow-expressions-usage.md#variance) | Gets the variance of a column.  |
| [varianceIf](data-flow-expressions-usage.md#varianceIf) | Based on a criteria, gets the variance of a column.  |
| [variancePopulation](data-flow-expressions-usage.md#variancePopulation) | Gets the population variance of a column.  |
| [variancePopulationIf](data-flow-expressions-usage.md#variancePopulationIf) | Based on a criteria, gets the population variance of a column.  |
| [varianceSample](data-flow-expressions-usage.md#varianceSample) | Gets the unbiased variance of a column.  |
| [varianceSampleIf](data-flow-expressions-usage.md#varianceSampleIf) | Based on a criteria, gets the unbiased variance of a column.  |
|||

## Next steps

- List of all [array functions](data-flow-array-functions.md).
- List of all [cached lookup functions](data-flow-cached-lookup-functions.md).
- List of all [conversion functions](data-flow-conversion-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [expression functions](data-flow-expression-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [metafunctions](data-flow-metafunctions.md).
- List of all [window functions](data-flow-window-functions.md).
- [Usage details of all data transformation expressions](data-flow-expressions-usage.md).
- [Learn how to use Expression Builder](concepts-data-flow-expression-builder.md).
