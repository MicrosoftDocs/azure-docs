---
title: Feature retrieval in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn about the feature retrieval function in Azure Machine Learning, and how that function allows features to easily be used in pipeline jobs
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.topic: conceptual
ms.date: 05/23/2023 
---
# Offline feature retrieval using point-in-time join

[!INCLUDE [preview disclaimer](../../includes/machine-learning-preview-generic-disclaimer.md)]

## Understanding point-in-time join 
Point-of-time joins, also referred to as temporal joins, can be used to prevent data leakage.  [Data leakage](https://en.wikipedia.org/wiki/Leakage_(machine_learning)) (also known as target leakage) occurs when information that isn't expected to be available during prediction is used during model training. This can result in an overestimation of the model’s performance when it's used in a real-world setting. For a better understanding, see this article: [data leakage](https://www.kaggle.com/code/alexisbcook/data-leakage#Target-leakage).

The below illustration explains how point-in-time joins in feature store works:

:::image type="content" source="./media/concept-feature-retrieval/pit_join_v2.png" alt-text="Diagram depicting the logical function of a point-in-time-join":::

The observation data has two labeled events, L0** and *L1*. The two events happened at time *t0* and *t1*. 

When we create training sample from this observation data, what values of features *feature1*, *feature2* and *feature3* will we select? We have to select the feature values that correspond to *t0* and *t1*.

The following table shows the output of `get_offline_features` method that does the point-in-time join:

:::image type="content" source="./media/concept-feature-retrieval/pit_join_output.png" alt-text="Diagram depicting the output of a method that performed a point-in-time-join":::

In the point-in-time join, for each observation event at time *t*, the feature value from the nearest past of *t* is joined to the observation event.

## Parameters used by point-in-time Join

In the feature set specification definition, the following two parameters affect the result of the point-in-time join.
- `source_delay`
- `temporal_join_lookback`

Both parameters represent a duration (time delta). Given an observation event that has timestamp at *t*, the feature value that has the latest timestamp in the window [`t - temporal_join_lookback` or `t - source_delay`] is joined to the event.

### Explanation of source_delay

In the source data of the feature set, an event that happened at time *t* will land in the source data table at time *t + x*, due to the latency in the upstream of the data pipeline. The source delay is represented by *x*.

The existence of source delay brings [Data leakage](https://en.wikipedia.org/wiki/Leakage_(machine_learning)).
- When a model is trained using offline data not considering source delay, it gets feature values from the near past.
- When the model is deployed to the production environment, it now only gets feature values that are delayed by at least the amount of time of source delay. The predictive scores degrade.

To address the data leakage brought in by source delay, you can define the `source_delay` in the feature set specification by estimating the source delay duration. 

In the point-in-time join, the value of `source_delay` is considered. Using the same example, event *L0* and *L1* join to earlier feature values, instead of the nearest past feature values.

:::image type="content" source="./media/concept-feature-retrieval/pit_join_source_delay_v2.png" alt-text="Diagram illustrating the concept of source delay":::

The below table shows the output of get_offline_features method that does the point-in-time join:

:::image type="content" source="./media/concept-feature-retrieval/pit_join_source_delay_output.png" alt-text="A table showing the output of the get_offline_features method as an example of the effects of source delay":::

If `source_delay` isn't set the feature set specification, its default value is 0, meaning there's no source delay.

The value of `source_delay` is also considered in recurrent feature materialization. Check details in the [Feature materialization in Azure Machine Learning](./concept-feature-materialization.md)

### Explanation of temporal_join_lookback

A point-in-time join looks for feature values from the nearest past of the observation event time. It may fetch a feature value from the distant past, such as a feature value that was calculated six months ago, if the feature value has not been updated since then. Using feature values that are quite old may also cause issues in model accuracy.

To prevent the join from fetching feature values from too far in the past, you can set the `temporal_join_lookback` parameter in the feature set specification, which controls how far the point-in-time joint looks back for values. 

In the same example, event *L0* and *L1* join to earlier feature values, instead of the nearest past feature values.

:::image type="content" source="./media/concept-feature-retrieval/pit_join_temporal_lookback_v2.png" alt-text="Diagram illustrating the concept of temporal_join_lookback":::

The below table shows the output of get_offline_features method that does the point-in-time join:

:::image type="content" source="./media/concept-feature-retrieval/pit_join_temporal_lookback_output.png" alt-text="A table showing the output of the get_offline_features method that does the point-in-time join":::

If the `temporal_join_lookback` parameter isn't set, the default value is infinity, that is, look back as far as possible in the point-in-time join.

If `temporal_join_lookback` parameter is set, it should always be set to a larger duration than `source_delay` in order to get a result. 
