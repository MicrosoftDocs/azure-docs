---
title: Feature materialization in Azure Machine Learning
titleSuffix: Azure Machine Learning
description: Learn about feature materialization on time-series features in Azure Machine Learning.
author: rsethur
ms.author: seramasu
ms.reviewer: franksolomon
ms.service: machine-learning
ms.subservice: mldata 
ms.topic: conceptual
ms.date: 05/23/2023 
---


# Feature materialization on time-series features

Feature materialization computes features from source data and writes them to storage for later use. Feature materialization can be done on a one-off basis or as a scheduled job.  Functionally, feature materialization runs `featureset.to_spark_dataframe(featureWindowStartDateTime, featureWindowEndDateTime)` for a given feature start/end window, and writes the data to configured storage.

For more information on feature transformations and best practices, see  [Feature Transformation and Best Practice](./concept-feature-transformations.md).

## One-time backfill job

During a one-time backfill job,  `featureWindowStartDateTime` and `featureWindowEndDateTime` are set directly in the API call. 

:::image type="content" source="./media/concept-feature-materialization/feature_calculation.png" alt-text="Diagram depicting feature materialization for a one-time backfill job":::

## Scheduled recurrent materialization


### Define schedule

In the `FeatureSet` materialization settings, the following parameters define a schedule:
- `interval`: a positive integer number
- `frequency`: "Day"/"Hour"
- `start_time`: a datetime string
- `time_zone`: optional, default value "UTC"

`interval` and `frequency` together decide the cadence of the recurrent materialization job. The `start_time` and `time_zone` parameters together decide when the schedule starts. After the first recurrent job is submitted, the later jobs are submitted according to the defined cadence. For example:

| Datetime (UTC) | Action |
|----|------|
| '2023-04-15 00:00:00 ' | Enable schedule `interval` = 3,  `frequency` = "Day", `start_time` = '2023-04-15 10:20:00' and `time_zone` = "UTC" | 
| '2023-04-15 10:20:00 ' | 1st recurrent job created | 
| '2023-04-18 10:20:00 ' | 2nd recurrent job created | 
| '2023-04-21 10:20:00 ' | 3rd recurrent job created | 

If the `start_time` is in the past of the schedule create/update time, the recurrent job creation time is still calculated from `start_time` not the moment of create/update. For example:

| Datetime (UTC) | Action |
|----|------|
| '2023-04-17 00:00:00 ' | Enable schedule `interval` = 3,  `frequency` = "Day", `start_time` = '2023-04-15 10:20:00' and `time_zone` = "UTC" | 
| '2023-04-18 10:20:00 ' | 1st recurrent job created | 
| '2023-04-21 10:20:00 ' | 2nd recurrent job created | 


If the `interval` and `frequency` properties are updated (but not the start_time and time_zone), the creation time of the next recurrent job is calculated from the original `start_time` (and time zone) using the updated cadence. For example:

| Datetime (UTC) | Action | Note |
|----|------|------|
| '2023-04-15 00:00:00 ' | Enable schedule `interval` = 3,  `frequency` = "Day", `start_time` = '2023-04-15 10:20:00' and `time_zone` = "UTC" | |
| '2023-04-15 10:20:00 ' | 1st recurrent job created | |
| '2023-04-18 10:20:00 ' | 2nd recurrent job created | '2023-04-15 10:20:00' + 1 * 3-days |
| '2023-04-21 10:20:00 ' | 3rd recurrent job created | '2023-04-15 10:20:00' + 2 * 3-days |
| '2023-04-22 17:00:00 ' | Update schedule `interval` = 2,  `frequency` = "Day" | 
| '2023-04-23 10:20:00 ' | 3rd recurrent job created | '2023-04-15 10:20:00' + 4 * 2-days |
| '2023-04-25 10:20:00 ' | 4th recurrent job created | '2023-04-15 10:20:00' + 5 * 2-days |


### Feature Start/End Window of recurrent materialization job

Each recurrent materialization job covers a feature window equal to the span of the scheduled cadence.  For example, if a schedule is defined with `interval` = 3 and `frequency` = "Day", it has a cadence of 3 days. So each recurrent job materializes a feature window of 3 days. If the recurrent job is submitted at time t, the 3 days feature window ends at time t - `source_delay`.

So for a recurrent job submitted at time t, the feature window it covers is:
- feature_window_start_ts = t - source_delay - (schedule cadence)
- feature_window_end_ts = t- source_delay 

:::image type="content" source="./media/concept-feature-materialization/feature_cal_schedule_delay.png" alt-text="Diagram depicting feature materialization for a recurrent materialization job":::

For example, a feature set is defined with 3-hour source delay:

| Datetime (UTC) | Action | Feature Window Start (UTC) | Feature Window End (UTC) |
|----|------|------|------|
| '2023-04-15 00:00:00 ' | Enable schedule `interval` = 3,  `frequency` = "Day", `start_time` = '2023-04-15 10:20:00' and `time_zone` = "UTC" | N/A | N/A |
| '2023-04-15 10:20:00 ' | 1st recurrent job created | '2023-04-12 07:20:00' | '2023-04-15 07:20:00' |
| '2023-04-18 10:20:00 ' | 2nd recurrent job created | '2023-04-15 07:20:00' | '2023-04-18 07:20:00' |
| '2023-04-21 10:20:00 ' | 3rd recurrent job created | '2023-04-18 07:20:00' | '2023-04-21 07:20:00' |


### Update cadence of schedule

You can update the cadence of the feature set materialization schedule by changing the `interval` and `frequency` parameters. When the cadence is updated, the next recurrent job decides its feature window according to the updated cadence, which may cause repeated or missed materializations. 

For example, a feature set is defined with 3-hour source delay:

| Datetime (UTC) | Action | Feature Window Start (UTC) | Feature Window End (UTC) |
|----|------|------|------|
| '2023-04-15 00:00:00 ' | Enable schedule `interval` = 3,  `frequency` = "Day", `start_time` = '2023-04-15 10:20:00' and `time_zone` = "UTC" | N/A | N/A |
| '2023-04-15 10:20:00 ' | 1st recurrent job created | '2023-04-12 07:20:00' | '2023-04-15 07:20:00' |
| '2023-04-18 10:20:00 ' | 2nd recurrent job created | '2023-04-15 07:20:00' | '2023-04-18 07:20:00' |
| '2023-04-18 17:00:00 ' | Update schedule `interval` = 2,  `frequency` = "Day" | N/A | N/A |
| '2023-04-19 10:20:00 ' | 3rd recurrent job created | '2023-04-17 07:20:00' | '2023-04-19 07:20:00' |
| '2023-04-21 10:20:00 ' | 4th recurrent job created | '2023-04-19 07:20:00' | '2023-04-21 07:20:00' |

In the third recurrent job, part of the feature window materialized by the second recurrent job will be rematerialized.

## Config materialization interval/frequency effectively

You can set the interval and frequency of materialization based on the business needs, for example, how stale/fresh is required on the materialized feature values. As long as you follow the [Best Practices in Defining Feature transformation](./concept-feature-transformations.md#best-practices-in-defining-feature-transformation), the interval and frequency don't affect the correctness of the feature values.

However, there are cases where the materialization job runs too frequently, resulting in wasted compute resources. Here's an example:

- You define a feature set that emits calculated feature values with timestamp [t0, t1, t2,...]. 
- You define the materialization interval and frequency that submits the materialization job at that time [job_1, job_2, job_3, job_4...].
- Each job covers a feature window based on the definition in [Scheduled recurrent materialization](#scheduled-recurrent-materialization).
- Each job runs `featureSetSpec.to_spark_df(featureWindowStartDateTime, featureWindowEndDateTime)`, which only calculates features in that time window.

Given that, only job_1, job_3, and job_5 produce feature values written into the offline store. While Job_2 and Job_4 don't produce any outputs, resulting in  wasted compute resources.

:::image type="content" source="./media/concept-feature-materialization/schedule_too_frequent.png" alt-text="Diagram depicting the interval and frequency of materialization jobs":::

In this example, you can set the materialization interval or frequency to run less frequently.


## Next steps
<!-- Add a context sentence for the following links -->
- 
- 


