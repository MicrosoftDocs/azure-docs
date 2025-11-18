---
title: Aggregate Functions in the Mapping Data Flow
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn about aggregate functions in mapping data flows.
author: kromerm
ms.author: makromer
ms.subservice: data-flows
ms.custom: synapse
ms.topic: conceptual
ms.date: 01/05/2024
---

# Aggregate functions in mapping data flows

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

[!INCLUDE[data-flow-preamble](includes/data-flow-preamble.md)]

This article provides details about aggregate functions supported by Azure Data Factory and Azure Synapse Analytics in mapping data flows.

## Aggregate function list

The following functions are available only in aggregate, pivot, unpivot, and window transformations.

| Aggregate function | Task |
|----|----|
| [approxDistinctCount](data-flow-expressions-usage.md#approxDistinctCount) | Gets the approximate aggregate count of distinct values for a column. The optional second parameter is to control the estimation error.|
| [avg](data-flow-expressions-usage.md#avg) | Gets the average of values of a column.  |
| [avgIf](data-flow-expressions-usage.md#avgIf) | Gets the average of values of a column, based on criteria.  |
| [collect](data-flow-expressions-usage.md#collect) | Collects all values of the expression in the aggregated group into an array. During this process, you can collect and transform structures to alternate structures. The number of items is equal to the number of rows in that group and can contain null values. The number of collected items should be small.  |
| [collectUnique](data-flow-expressions-usage.md#collectUnique) | Collects all values of the expression in the aggregated group into a unique array. During this process, you can collect and transform structures to alternate structures. The number of items is smaller or equal to the number of rows in that group and can contain null values. The number of collected items should be small. |
| [count](data-flow-expressions-usage.md#count) | Gets the aggregate count of values. If the optional columns are specified, it ignores `NULL` values in the count.  |
| [countAll](data-flow-expressions-usage.md#countAll) | Gets the aggregate count of values, including `NULL` values.  |
| [countDistinct](data-flow-expressions-usage.md#countDistinct) | Gets the aggregate count of distinct values of a set of columns.  |
| [countAllDistinct](data-flow-expressions-usage.md#countAllDistinct) | Gets the aggregate count of distinct values of a set of columns, including `NULL` values.  |
| [countIf](data-flow-expressions-usage.md#countIf) | Gets the aggregate count of values, based on criteria. If the optional column is specified, it ignores `NULL` values in the count.  |
| [covariancePopulation](data-flow-expressions-usage.md#covariancePopulation) | Gets the population covariance between two columns.  |
| [covariancePopulationIf](data-flow-expressions-usage.md#covariancePopulationIf) | Gets the population covariance of two columns, based on criteria.  |
| [covarianceSample](data-flow-expressions-usage.md#covarianceSample) | Gets the sample covariance of two columns.  |
| [covarianceSampleIf](data-flow-expressions-usage.md#covarianceSampleIf) | Gets the sample covariance of two columns, based on criteria.  |
| [first](data-flow-expressions-usage.md#first) | Gets the first value of a column group. If the second parameter `ignoreNulls` is omitted, false is assumed.  |
| [isDistinct](data-flow-expressions-usage.md#isDistinct) | Finds if a column or set of columns is distinct. It doesn't count null as a distinct value.|
| [kurtosis](data-flow-expressions-usage.md#kurtosis) | Gets the kurtosis of a column.  |
| [kurtosisIf](data-flow-expressions-usage.md#kurtosisIf) | Gets the kurtosis of a column, based on criteria.  |
| [last](data-flow-expressions-usage.md#last) | Gets the last value of a column group. If the second parameter `ignoreNulls` is omitted, false is assumed.  |
| [max](data-flow-expressions-usage.md#max) | Gets the maximum value of a column.  |
| [maxIf](data-flow-expressions-usage.md#maxIf) | Gets the maximum value of a column, based on criteria.  |
| [mean](data-flow-expressions-usage.md#mean) | Gets the mean of values of a column. Same as `AVG`.  |
| [meanIf](data-flow-expressions-usage.md#meanIf) | Gets the mean of values of a column, based on criteria. Same as `avgIf`.  |
| [min](data-flow-expressions-usage.md#min) | Gets the minimum value of a column.  |
| [minIf](data-flow-expressions-usage.md#minIf) | Gets the minimum value of a column, based on criteria.  |
| [skewness](data-flow-expressions-usage.md#skewness) | Gets the skewness of a column.  |
| [skewnessIf](data-flow-expressions-usage.md#skewnessIf) | Gets the skewness of a column, based on criteria.  |
| [stddev](data-flow-expressions-usage.md#stddev) | Gets the standard deviation of a column.  |
| [stddevIf](data-flow-expressions-usage.md#stddevIf) | Gets the standard deviation of a column, based on criteria.  |
| [stddevPopulation](data-flow-expressions-usage.md#stddevPopulation) | Gets the population standard deviation of a column.  |
| [stddevPopulationIf](data-flow-expressions-usage.md#stddevPopulationIf) | Gets the population standard deviation of a column, based on criteria.  |
| [stddevSample](data-flow-expressions-usage.md#stddevSample) | Gets the sample standard deviation of a column.  |
| [stddevSampleIf](data-flow-expressions-usage.md#stddevSampleIf) | Gets the sample standard deviation of a column, based on criteria.  |
| [sum](data-flow-expressions-usage.md#sum) | Gets the aggregate sum of a numeric column.  |
| [sumDistinct](data-flow-expressions-usage.md#sumDistinct) | Gets the aggregate sum of distinct values of a numeric column.  |
| [sumDistinctIf](data-flow-expressions-usage.md#sumDistinctIf) | Gets the aggregate sum of a numeric column, based on criteria. The condition can be based on any column.  |
| [sumIf](data-flow-expressions-usage.md#sumIf) | Gets the aggregate sum of a numeric column, based on criteria. The condition can be based on any column.  |
| [topN](data-flow-expressions-usage.md#topN) | Gets the top `N` values for this column.  |
| [variance](data-flow-expressions-usage.md#variance) | Gets the variance of a column.  |
| [varianceIf](data-flow-expressions-usage.md#varianceIf) | Gets the variance of a column, based on criteria.  |
| [variancePopulation](data-flow-expressions-usage.md#variancePopulation) | Gets the population variance of a column.  |
| [variancePopulationIf](data-flow-expressions-usage.md#variancePopulationIf) | Gets the population variance of a column, based on criteria.  |
| [varianceSample](data-flow-expressions-usage.md#varianceSample) | Gets the unbiased variance of a column.  |
| [varianceSampleIf](data-flow-expressions-usage.md#varianceSampleIf) | Gets the unbiased variance of a column, based on criteria.  |
|||

## Related content

- List of all [array functions](data-flow-array-functions.md).
- List of all [cached lookup functions](data-flow-cached-lookup-functions.md).
- List of all [conversion functions](data-flow-conversion-functions.md).
- List of all [date and time functions](data-flow-date-time-functions.md).
- List of all [expression functions](data-flow-expression-functions.md).
- List of all [map functions](data-flow-map-functions.md).
- List of all [metafunctions](data-flow-metafunctions.md).
- List of all [window functions](data-flow-window-functions.md).
- Usage details of all [data transformation expressions](data-flow-expressions-usage.md).
- Learn how to use [Expression Builder](concepts-data-flow-expression-builder.md).
