---
title: Provide anomaly feedback to the Metrics Advisor service
titleSuffix: Azure Cognitive Services
description: Learn how to send feedback on anomalies found by your Metrics Advisor instance, and tune the results. 
services: cognitive-services
author: mrbullwinkle
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: conceptual
ms.date: 09/10/2020
ms.author: mbullwin
---

# Provide anomaly feedback

User feedback is one of the most important methods to discover defects within the anomaly detection system. Here we provide a way for users to mark incorrect detection results directly on a time series, and apply the feedback immediately. In this way, a user can "educate" the anomaly detection system how to do anomaly detection for a specific time series through active interactions. 

> [!NOTE]
> Currently feedback will only affect anomaly detection results by **Smart detection** but not **Hard threshold** and **Change threshold**.

## How to give time series feedback

You can provide feedback from the metric detail page on any series. Just select any point, and you will see below feedback dialog. It shows you the dimensions of the series you've chosen. You can reselect dimension values, or even remove some of them to get a batch of time series data. After choosing time series, you select the **Add** button to add the feedback, there are four kinds of feedback you could give. You can append multiple feedback items, select the **Save** button once you complete your annotations.

:::image type="content" source="../media/feedback/continuous-points.png" alt-text="Graph with time-series data with a blue line and red dots at various points. Red box surrounding one point with the text `Click on any point`":::

:::image type="content" source="../media/feedback/continuous-points.png" alt-text"Add feedback dialog box":::

### Mark the anomaly point type

As shown in the image below, the feedback dialog will fill the timestamp of your chosen point automatically, though you edit this value. You then select whether you want to identify this item as an `Anomaly`, `NotAnomaly`, or `AutoDetect`. You can also  if you just want to withdraw a previous feedback.


:::image type="content" source="../media/feedback/continuous-points.png" alt-text"Drop down menu with choices of `Anomaly`, `NotAnomaly`, and `AutoDetect`":::

Your feedback selection will be appliedThe will apply your feedback to the future anomaly detection processing of the same series. The processed points will not be recalculated. That means if you marked an Anomaly as NotAnomaly, we will suppress similar anomalies in the future, and if you marked a `NotAnomaly` point as `Anomaly`, we will tend to detect similar points as `Anomaly` in the future. If `AutoDetect` is chosen, any previous feedback on the same point will be ignored in the future.

### Provide feedback for multiple continuous points 

If you would like to give anomaly feedback for multiple continuous points at the same time, select the group of points you want to annotate. You will see the chosen time-range automatically filled when you provide anomaly feedback.

:::image type="content" source="../media/feedback/continuous-points.png" alt-text"Anomaly feedback menu with anomaly selected and a specific time range":::

To view if an individual point is affected by your anomaly feedback, when browsing a time series, select a single point. If its anomaly detection result has been changed by feedback, the tooltip will show **Affected by feedback: true**. If it shows **Affected by feedback: false**, this means anomaly feedback calculation was performed for this point, but the anomaly detection result should not be changed.

:::image type="content" source="../media/feedback/continuous-points.png" alt-text"Tooltip display with `Affected by feedback: true` highlighted in red":::

There are some situations where we do not suggest giving feedback:

- The anomaly is caused by a holiday. It's suggested to use a preset event to solve this kind of false alarm, as it will be more precise.
- The anomaly is caused by a known data source change, for example, an upstream system change happened at that time. In this situation, it is expected to give an anomaly alert since our system didn't know what caused the value change and when similar value change will happen again. Thus we don't suggest annotating this kind of issue as `NotAnomaly`.

### Change points

Sometimes the trend change of data will affect anomaly detection results. When decision is made as to whether a point is an anomaly or not, the latest window of history data will be taken into consideration. When your time series has a trend change, you could mark the exact change point, this will help our anomaly detector in future analysis.

As the below figure shows, you could select `ChangePoint` for the feedback Type, and select `ChangePoint`, `NotChangePoint`, or `AutoDetect` from the pull-down list.

:::image type="content" source="../media/feedback/continuous-points.png" alt-text"Change point menu with dropdown containing options for `ChangePoint`, `NotChangePoint`, and `AutoDetect`":::

> [!NOTE]
> If your data keeps changing, you will only need to mark one point as a `ChangePoint`, so if you marked a `timerange`, we will fill the last point's timestamp and time automatically. In this case, your annotation will only affect anomaly detection results after 12 points.



|Scenario  |Recommendation |
|---------|---------|
|The anomaly is caused by known data source change, for example a system change.     | Don't annotate this anomaly if this scenario isn't expected to regularly reoccur.        |
|The anomaly is caused by holiday.     | Use [Preset events](configure-metrics.md#preset-events) to flag anomaly detection at specified times.       |
|There is a regular pattern to detected anomalies (for example on weekends) and they should not be anomalies.      |Use the feedback feature, or preset events.        |

## Next steps
- [Diagnose an incident](diagnose-incident.md).
- [Configure metrics and fine tune detecting configuration](configure-metrics.md)
- [Configure alerts and get notifications using a hook](../how-tos/alerts.md)