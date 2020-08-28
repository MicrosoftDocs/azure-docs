---
title: Provide anomaly feedback to the Metrics Advisor service
titleSuffix: Azure Cognitive Services
description: Learn how how to send feedback on anomalies found by your Metrics Advisor instance, and tune the results 
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: conceptual
ms.date: 08/26/2020
ms.author: aahi
---

## Sending anomaly feedback to your Metrics Advisor instance

If you aren't satisfied with some of the anomaly detection results provided by Metrics Monitor, you can manually add feedback that will affect the model applied to your data. 

Use the buttons on the top right corner of the page to activate Feedback annotation mode.

![Activate feedback annotation mode](../media/feedback/annotation-mode.png "Activate feedback annotation mode")

After feedback annotation mode is activated, you can give feedback for one point, or multiple continuous points.

### Give feedback for one point 

With feedback annotation mode activated, click on a point to open a **Add feedback** menu. You can set the point's anomaly status, seasonality, and change point status. This feedback will be incorporated in the detection for future points.  

* Select **Anomaly** if you think the point should be an anomaly that wasn't detected. (Note that currently we will not process this kind of feedback in following calculation, but it is still valuable to leave such kind of annotation, they will be applied as soon as we onboard related algorithm in the future.)

* If you think the point is not an anomaly, but was detected as one, select **Normal**.

* If you want to clear previous annotation, choose **Ignore**.

* If you don't want to annotate anomaly, leave **Mark Anomaly** empty.

Consider leaving a comment in the **Comment** text box at the same time, and click **Save** to save your feedback.

![Feedback menu](../media/feedback/feedback-menu.png)

### Give feedback for multiple continuous points

You can give feedback for multiple continuous points at once by clicking down and dragging your mouse on the points you want to annotate. You will see the same feedback menu as above. The same feedback will be applied to all chosen points after you click **Save**.

![Choose multiple points](../media/feedback/continuous-points.png "Choose multiple points")

## How to view my feedback

When feedback annotation mode is off, click a point on the time series and a window will appear with information about the feedback.

![View feedback for one point](../media/feedback/feedback-details.png "View feedback for one point")

To see if a point's anomaly detection has changed, hover over the point. The tooltip will show **Affected by feedback: true** if the detection was changed. If it displays **False**, then feedback calculation was done on the point, but the anomaly detection result was not changed.

![Point affected by feedback](../media/feedback/affected-point.png "Point affected by feedback")

## When should I annotate an anomaly as "normal"

There are many reasons when you might consider an anomaly is a false alarm. Consider using the following Metrics Advisor features if one of the following scenarios apply:


|Scenario  |Recommendation |
|---------|---------|
|The anomaly is caused by known data source change, for example a system change.     | Don't annotate this anomaly if this scenario isn't expected to regularly reoccur.        |
|The anomaly is caused by holiday.     | Use [Preset events](web-portal.md#preset-events) to flag anomaly detection at specified times.       |
|There is a regular pattern to detected anomalies (for example on weekends) and they should not be anomalies.      |Use the feedback feature, or preset events.        |

## Next steps

- [Add and manage data feeds](../how-tos/datafeeds.md)
    - [Configurations for different data sources](../data-feeds-from-different-sources.md)
- [Create alerts](../how-tos/alerts.md)
- [Diagnose incidents](../how-tos/diagnose-incident.md).
- [Configure metrics and anomaly detection](configure-metrics.md)