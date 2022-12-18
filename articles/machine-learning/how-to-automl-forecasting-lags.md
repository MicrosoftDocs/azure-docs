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
ms.topic: how-to
ms.custom: contperf-fy21q1, automl, FY21Q4-aml-seo-hack, sdkv1, event-tier1-build-2022
ms.date: 12/15/2022
---

# Lagged features for time series forecasting in AutoML
This article focuses on direct forecaster methods for creating backward-looking features in time series data. AutoML's forecasting regression models implement these methods to create lag features and rolling window aggregation features. Please see the [methods overview article](./how-to-automl-forecasting-methods.md) for more general information about forecasting methodology in AutoML. Instructions and examples for training forecasting models in AutoML can be found in our [set up AutoML for time series forecasting](./how-to-auto-train-forecast.md) article.

## Lag feature example
AutoML generates lags with respect to the forecast horizon. The following example illustrates this concept. Here, we use a forecast horizon of three and target lag order of one on the following monthly time series data:

Table 1: Original time series <a name="tab:original-ts"></a> 

| Date     | $y_t$ | 
|:---      |:---   |
| 1/1/2001 | 0     |
| 2/1/2001 | 10    |
| 3/1/2001 | 20    |
| 4/1/2001 | 30    |
| 5/1/2001 | 40    | 
| 6/1/2001 | 50    |

First, we will generate the lagging feature for the forecast horizon $h=1$ only. As you continue reading, it will become clear why are using individual horizons in each table.

Table 2: Lag featurization for $h=1$ <a name="tbl:classic-lag-1"></a>

| Date       | $y_t$ | Origin    | $y_{t-1}$ | horizon |
|:---        |:---   |:---       |:---       |:---     | 
| 1/1/2001   | 0     | 12/1/2000 | -         | 1       |
| 2/1/2001   | 10    | 1/1/2001  | 0         | 1       |
| 3/1/2001   | 20    | 2/1/2001  | 10        | 1       |
| 4/1/2001   | 30    | 3/1/2001  | 20        | 1       |
| 5/1/2001   | 40    | 4/1/2001  | 30        | 1       |
| 6/1/2001   | 50    | 4/1/2001  | 40        | 1       |

Table 2 is generated from Table 1 where we shifted the $y_t$ column down by 1 observation. We also added the `Origin` column which shows the origin date for that specific target date given the forecast horizon is 1, which is reflected in the last column. Next, we will generate the lagging feature for the forecast horizon $h=2$ only.

Table 3: Lag featurization for $h=2$ <a name="tbl:classic-lag-2"></a>

| Date       | $y_t$ | Origin    | $y_{t-2}$ | horizon |
|:---        |:---   |:---       |:---       |:---     | 
| 1/1/2001   | 0     | 11/1/2000 | -         | 2       |
| 2/1/2001   | 10    | 12/1/2000 | -         | 2       |
| 3/1/2001   | 20    | 1/1/2001  | 0         | 2       |
| 4/1/2001   | 30    | 2/1/2001  | 10        | 2       |
| 5/1/2001   | 40    | 3/1/2001  | 20        | 2       |
| 6/1/2001   | 50    | 4/1/2001  | 30        | 2       |

Table 3 is generated from Table 1 where we shifted down the $y_t$ column down by 2 observations. The `Origin` column shows the origin date for that specific target date given the forecast horizon is 2. Finally, we will generate the lagging feature for the forecast horizon $h=3$ only.

Table 4: Lag featurization for $h=3$ <a name="tbl:classic-lag-3"></a>

| Date       | $y_t$ | Origin    | $y_{t-3}$ | horizon |
|:---        |:---   |:---       |:---       |:---     | 
| 1/1/2001   | 0     | 10/1/2000 | -         | 3       |
| 2/1/2001   | 10    | 11/1/2000 | -         | 3       |
| 3/1/2001   | 20    | 12/1/2000 | -         | 3       |
| 4/1/2001   | 30    | 1/1/2001  | 0         | 3       |
| 5/1/2001   | 40    | 2/1/2001  | 10        | 3       |
| 6/1/2001   | 50    | 3/1/2001  | 20        | 3       |

Next, we concatenate Tables 1, 2 \& 3 and rearrange rows to have the following:

Table 5: Lag featurization complete <a name="tbl:automl-lag-complete"></a>

| Date       | $y_t$ | Origin    | $y_{t-1}^{(h)}$ | horizon |
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


Note that we changed the name of the lag column to $y_{t-1}^{(h)}$ where the superscript ($h$) is the horizon, to reflect the fact that the lag is generated with respect to the specific horizon. Table 5 shows that the lags we generated with respect to the horizon (Table 5) can be mapped to the conventional ways of generating lags (Table 2-4). It also shows that the user has to take into account the forecast horizon when setting the `target_lags` parameter. If, for example, your forecast horizon is seven, and you want to add target lags, you do not need to set the lag value to 7 to avoid information leak. Given that we generate lags with respect to horizon, you need to set the lag value to 1 (`target_lags = 1`) and it will augment the data in a such a way that there will not be any information leak. 

Examining Table 5 one can observe that when the lagging features are enabled, the ML models perform direct forecast, one for each horizon. This means the forecast for, say horizon 5, does not depend on the forecast for the earlier horizons. This is in contrast to the recursive forecasting scheme used in ARIMA and Exponential Smoothing models where the forecast values from earlier horizons are used as inputs for the subsequent horizons. 
