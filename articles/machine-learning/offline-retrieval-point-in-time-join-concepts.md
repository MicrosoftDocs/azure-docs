---
title: Offline feature retrieval using a point-in-time join
titleSuffix: Azure Machine Learning
description: Use a point-in-time join for offline feature retrieval.
ms.service: machine-learning
ms.subservice: mldata
ms.topic: how-to
ms.author: yogipandey
author: ynpandey
ms.reviewer: franksolomon
ms.date: 12/06/2023
ms.custom: template-concept
---

# Offline feature retrieval using a point-in-time join

## Understanding the point-in-time join

A *point-in-time*, or temporal, join helps address data leakage. In the model training process, [Data leakage](https://en.wikipedia.org/wiki/Leakage_(machine_learning)), or target leakage, involves the use of information that isn't expected to be available at prediction time. This would cause the predictive scores (metrics) to overestimate the utility of the model when the model runs in a production environment. [This article](https://www.kaggle.com/code/alexisbcook/data-leakage#Target-leakage) explains data leakage.

The next illustration explains how feature store point-in-time joins work:

- The observation data has two labeled events, `L0` and `L1`. The two events occurred at times `t0` and `t1` respectively.
- A training sample is created from this observation data with a point-in-time join. For each observation event, the feature value from its most recent previous event time (`t0` and `t1`) is joined with the event.

:::image type="content" source="media/offline-retrieval-point-in-time-join/point-in-time-join.png" lightbox="media/offline-retrieval-point-in-time-join/point-in-time-join.png" alt-text="Illustration that shows a simple point-in-time join.":::

This screenshot shows the output of a function named `get_offline_features`. That function executes a point-in-time join:

:::image type="content" source="media/offline-retrieval-point-in-time-join/point-in-time-join-output.png" lightbox="media/offline-retrieval-point-in-time-join/point-in-time-join-output.png" alt-text="Illustration that shows output of a simple point-in-time join.":::

## Parameters used by point-in-time join

In the feature set specification, these parameters affect the result of the point-in-time join:

- `source_delay`
- `temporal_join_lookback`

Both parameters represent a duration, or time delta. For an observation event that has a timestamp `t` value, the feature value with the latest timestamp in the window `[t - temporal_join_lookback, t - source_delay]` is joined to the observation event data.

### The `source_delay` property

The `source_delay` source data property indicates the acquisition time delay at the moment that data is ready to consume. The time value at that moment is compared to the time value at the moment the data is generated. An event that happened at time `t` lands in the source data table at time `t + x`, due to the latency in the upstream data pipeline. The `x` value is the source delay.

Source delay can lead to [Data leakage](https://en.wikipedia.org/wiki/Leakage_(machine_learning)):

- When a model is trained with offline data, without consideration of source delay, the model uses feature values from the nearest past
- When a model deploys to a production environment, that model only uses feature values delayed by at least the amount of source delay time. As a result, the predictive scores degrade. To address source delay data leakage, the `source_delay` value in the point-in-time join is considered. To define the `source_delay` in the feature set specification, estimate the source delay duration.

In the same example, given a `source_delay` value, events `L0` and `L1` join with earlier feature values, instead of feature values in the nearest, most recent past.

:::image type="content" source="media/offline-retrieval-point-in-time-join/point-in-time-join-source-delay.png" lightbox="media/offline-retrieval-point-in-time-join/point-in-time-join-source-delay.png" alt-text="Illustration that shows a point-in-time join with source delay.":::

This screenshot shows the output of the `get_offline_features` function that performs the point-in-time join:

:::image type="content" source="media/offline-retrieval-point-in-time-join/point-in-time-join-source-delay-output.png" lightbox="media/offline-retrieval-point-in-time-join/point-in-time-join-source-delay-output.png" alt-text="Illustration that shows output of a point-in-time join with source delay.":::

If users don't set the `source_delay` value in the feature set specification, its default value is `0`. This means that no source delay is involved. The `source_delay` value is also considered in recurrent feature materialization. Visit [this](./featureset-materialization-concepts.md) resource for more details about feature set materialization.

### The `temporal_join_lookback`

A point-in-time join looks for previous feature values closest in time to the time of the observation event. The join might fetch a feature value that is too early, if the feature value didn't update since that earlier time. This can lead to problems:

- A search for feature values with time values that are too early impacts the query performance of the point-in-time join
- Feature values produced too early are stale. As model input, these values can degrade model prediction performance.

To prevent retrieval of feature values with time values that are too early, set the `temporal_join_lookback` parameter in the feature set specification. This parameter controls the earliest feature time values the point-in-time join accepts.

With the same example, given `temporal_join_lookback`, event `L1` only gets joined with feature values in the past, up to `t1 - temporal_join_lookback`.

:::image type="content" source="media/offline-retrieval-point-in-time-join/point-in-time-join-temporal-lookback.png" lightbox="media/offline-retrieval-point-in-time-join/point-in-time-join-temporal-lookback.png" alt-text="Illustration that shows a point-in-time join with temporal lookback.":::

This screenshot shows the output of the `get_offline_features` function. This function performs the point-in-time join:

:::image type="content" source="media/offline-retrieval-point-in-time-join/point-in-time-join-temporal-lookback-output.png" lightbox="media/offline-retrieval-point-in-time-join/point-in-time-join-temporal-lookback-output.png" alt-text="Illustration that shows output of a point-in-time join with temporal lookback.":::

When `temporal_join_lookback` is set, set it duration time greater than `source_delay`, to get nonempty join results. If the `temporal_join_lookback` value isn't set, its default value is infinity. It looks back as far as possible during the point-in-time join.

## Next steps

- [Tutorial 1: Develop and register a feature set with managed feature store](./tutorial-get-started-with-feature-store.md)
- [GitHub Sample Repository](~/azureml-examples-main/sdk/python/featurestore_sample)