---
title: Lagged features for time series forecasting in AutoML
titleSuffix: Azure Machine Learning
description: Learn how Azure Machine Learning's AutoML forms lag based features for time series forecasting
services: machine-learning
author: ericwrightatwork
ms.author: vlbejan
ms.reviewer: ssalgado 
ms.service: machine-learning
ms.subservice: automl
ms.topic: conceptual
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv1, event-tier1-build-2022
ms.date: 12/15/2022
show_latex: true
---

# Lagged features for time series forecasting in AutoML
This article focuses on AutoML's methods for creating lag and rolling window aggregation features for forecasting regression models. Features like these that use past information can significantly increase accuracy by helping the model to learn correlational patterns in time. See the [methods overview article](./concept-automl-forecasting-methods.md) for general information about forecasting methodology in AutoML. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

## Lag feature example
AutoML generates lags with respect to the forecast horizon. The example in this section illustrates this concept. Here, we use a forecast horizon of three and target lag order of one. Consider the following monthly time series:

Table 1: Original time series <a name="tab:original-ts"></a> 

| Date     | $y_t$ | 
|:---      |:---   |
| 1/1/2001 | 0     |
| 2/1/2001 | 10    |
| 3/1/2001 | 20    |
| 4/1/2001 | 30    |
| 5/1/2001 | 40    | 
| 6/1/2001 | 50    |

First, we generate the lag feature for the horizon $h=1$ only. As you continue reading, it will become clear why we use individual horizons in each table.

Table 2: Lag featurization for $h=1$ <a name="tbl:classic-lag-1"></a>

| Date       | $y_t$ | Origin    | $y_{t-1}$ | $h$ |
|:---        |:---   |:---       |:---       |:---     | 
| 1/1/2001   | 0     | 12/1/2000 | -         | 1       |
| 2/1/2001   | 10    | 1/1/2001  | 0         | 1       |
| 3/1/2001   | 20    | 2/1/2001  | 10        | 1       |
| 4/1/2001   | 30    | 3/1/2001  | 20        | 1       |
| 5/1/2001   | 40    | 4/1/2001  | 30        | 1       |
| 6/1/2001   | 50    | 5/1/2001  | 40        | 1       |

Table 2 is generated from Table 1 by shifting the $y_t$ column down by a single observation. We've added a column named `Origin` that has the dates that the lag features originate from. Next, we generate the lagging feature for the forecast horizon $h=2$ only.

Table 3: Lag featurization for $h=2$ <a name="tbl:classic-lag-2"></a>

| Date       | $y_t$ | Origin    | $y_{t-2}$ | $h$ |
|:---        |:---   |:---       |:---       |:---     | 
| 1/1/2001   | 0     | 11/1/2000 | -         | 2       |
| 2/1/2001   | 10    | 12/1/2000 | -         | 2       |
| 3/1/2001   | 20    | 1/1/2001  | 0         | 2       |
| 4/1/2001   | 30    | 2/1/2001  | 10        | 2       |
| 5/1/2001   | 40    | 3/1/2001  | 20        | 2       |
| 6/1/2001   | 50    | 4/1/2001  | 30        | 2       |

Table 3 is generated from Table 1 by shifting the $y_t$ column down by two observations. Finally, we will generate the lagging feature for the forecast horizon $h=3$ only.

Table 4: Lag featurization for $h=3$ <a name="tbl:classic-lag-3"></a>

| Date       | $y_t$ | Origin    | $y_{t-3}$ | $h$ |
|:---        |:---   |:---       |:---       |:---     | 
| 1/1/2001   | 0     | 10/1/2000 | -         | 3       |
| 2/1/2001   | 10    | 11/1/2000 | -         | 3       |
| 3/1/2001   | 20    | 12/1/2000 | -         | 3       |
| 4/1/2001   | 30    | 1/1/2001  | 0         | 3       |
| 5/1/2001   | 40    | 2/1/2001  | 10        | 3       |
| 6/1/2001   | 50    | 3/1/2001  | 20        | 3       |

Next, we concatenate Tables 1, 2, and 3 and rearrange the rows. The result is in the following table:

Table 5: Lag featurization complete <a name="tbl:automl-lag-complete"></a>

| Date       | $y_t$ | Origin    | $y_{t-1}^{(h)}$ | $h$ |
|:---        |:---   |:---       |:---       |:---     | 
| 1/1/2001   | 0     | 12/1/2000 | -         | 1       |
| 1/1/2001   | 0     | 11/1/2000 | -         | 2       |
| 1/1/2001   | 0     | 10/1/2000 | -         | 3       |
| 2/1/2001   | 10    | 1/1/2001  | 0         | 1       |
| 2/1/2001   | 10    | 12/1/2000 | -         | 2       |
| 2/1/2001   | 10    | 11/1/2000 | -         | 3       |
| 3/1/2001   | 20    | 2/1/2001  | 10        | 1       |
| 3/1/2001   | 20    | 1/1/2001  | 0         | 2       |
| 3/1/2001   | 20    | 12/1/2000 | -         | 3       |
| 4/1/2001   | 30    | 3/1/2001  | 20        | 1       |
| 4/1/2001   | 30    | 2/1/2001  | 10        | 2       |
| 4/1/2001   | 30    | 1/1/2001  | 0         | 3       |
| 5/1/2001   | 40    | 4/1/2001  | 30        | 1       |
| 5/1/2001   | 40    | 3/1/2001  | 20        | 2       |
| 5/1/2001   | 40    | 2/1/2001  | 10        | 3       |
| 6/1/2001   | 50    | 4/1/2001  | 40        | 1       |
| 6/1/2001   | 50    | 4/1/2001  | 30        | 2       |
| 6/1/2001   | 50    | 3/1/2001  | 20        | 3       |


In the final table, we've changed the name of the lag column to $y_{t-1}^{(h)}$ to reflect that the lag is generated with respect to a specific horizon. The table shows that the lags we generated with respect to the horizon can be mapped to the conventional ways of generating lags in the previous tables.

Table 5 is an example of the data augmentation that AutoML applies to training data to enable direct forecasting from regression models. When the configuration includes lag features, AutoML creates horizon dependent lags along with an integer-valued horizon feature. This enables AutoML's forecasting regression models to make a prediction at horizon $h$ without regard to the prediction at $h-1$, in contrast to recursively defined models like ARIMA.

> [!NOTE]
> Generation of horizon dependent lag features adds new _rows_ to the dataset. The number of new rows is proportional to forecast horizon. This dataset size growth can lead to out-of-memory errors on smaller compute nodes or when dataset size is already large. See the [frequently asked questions](./how-to-automl-forecasting-faq.md#how-do-i-fix-an-out-of-memory-error) article for solutions to this problem.       

Another consequence of this lagging strategy is that lag order and forecast horizon are decoupled. If, for example, your forecast horizon is seven, and you want AutoML to use lag features, you do not have to set the lag order to seven to ensure prediction over a full forecast horizon. Since AutoML generates lags with respect to horizon, you can set the lag order to one and AutoML will augment the data so that lags of any order are valid up to forecast horizon.

## Next steps
* Learn more about [how to set up AutoML to train a time-series forecasting model](./how-to-auto-train-forecast.md).
* Browse [AutoML Forecasting Frequently Asked Questions](./how-to-automl-forecasting-faq.md).
* Learn about [calendar features for time series forecasting in AutoML](./concept-automl-forecasting-calendar-features.md).
* Learn about [how AutoML uses machine learning to build forecasting models](./concept-automl-forecasting-methods.md).
