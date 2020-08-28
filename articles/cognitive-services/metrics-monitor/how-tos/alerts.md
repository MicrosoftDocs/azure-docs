---
title: Metrics Advisor alerts
titleSuffix: Azure Cognitive Services
description: How to configure your Metrics Advisor alerts
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice: metrics-advisor
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: aahi
---

# How-to: Configure and subscribe to an alert

After an anomaly is detected by your Metrics Advisor instance, an alert notification can be sent out based on your alert settings, using a web hook. An alert settings can correspond to multiple detection configurations, and you can set specific alert conditions.

You can find the **Alert settings** options at the downward left corner of metrics detail page. It lists alert settings that are related to the selected detection configuration. When a detection configuration is first created, the alert setting list will be empty, and no alerts will be sent.  
You can use the **add**, **edit** and **delete** icons to modify alerts.

![Entrance For Alert Setting](img/entrance_for_alert_setting.png)

## Create a web hook

> [!TIP]
> * Web hooks are only only supported for alerts.  
> * Use the **POST** request method.
> * The request body wil be similar to:  
    `{"timestamp":"2019-09-11T00:00:00Z","alertSettingGuid":"49635104-1234-4c1c-b94a-744fc920a9eb"}`
> * When a web hook is created or modified, the API will be called as a test with an empty request body. Your API needs to return a 200 HTTP code.

A web hook is the entry point for all the information available from the Metrics Advisor service, and calls a user-provided api when an alert is triggered. All alerts, including "Data feed not available" and "Incident report" alerts are sent through web hooks only.

To create a web hook, you will need to add the following information


|Parameter |Description  |
|---------|---------|
|Endpoint     | The API address to be called when an alert is triggered.        |
|Username / Password | For authenticating to the API address. Leave this black if authentication isn't needed.         |
|Header     | Custom headers in the API call.        |

:::image type="content" source="../media/alerts/create_web_hook.png" alt-text="web hook creation window.":::

### Add or Edit alert settings

Click the **add** or **edit** buttons to get a window to add or edit your alert settings.

:::image type="content" source="../media/alerts/edit-alert.png" alt-text="Add or edit alert settings":::

**Alert Name**: The name of this alert setting. It will be displayed in the alert email title.

**Hooks**: The list of web hooks to send alerts to.

The section marked in the screenshot above are the settings for one detecting configuration. You can set different alert settings for different detection configurations. Choose the target configuration using the third drop-down list in this window. 

#### Filter settings 

The following are filter settings for one detection configuration.

**Alert For** has 4 options for filtering anomalies:

* **Anomalies in all series**: All anomalies will be included in the alert.         
* **Anomalies in the series group**: Filter series by dimension values. Set specific values for some dimensions. Anomalies will only be included in the alert when the series matches the specified value.       
* **Anomalies in favorite series**: Only the series marked as favorite will be included in the alert.        |
* **Anomalies in top N of all series**: This filter is for the case that you only care about the series whose value is in top n. We will look back some timestamps, and check if value of the series at these timestamp are in top n. If the "in top n" count is larger than one given number, the anomaly will be taken in for alert.        |

**Filter anomaly options** is an additional filter with the following options:

- **severity** : The anomaly will only be included when the anomaly severity is within the specified range.
- **Snooze** : Stop alerts temporarily for anomalies in the next N points (period), when triggered in an alert.
    - **snooze type** : When set to **Series**, a triggered anomaly will only snooze its series. For **Metric**, one triggered anomaly will snooze all the series in this metric.
    - **snooze number** : the number of points (period) to snooze.
    - **reset for non-successive** : When selected, a triggered anomaly will only snooze the next n successive anomalies. If one of the following data points isn't an anomaly, the snooze will be reset from that point; When unselected, one triggered anomaly will snooze next n points (period), even if successive data points aren't anomalies.
- **value** (*optional*) : Filter by value. Only point values that meet the condition, anomaly will be included. If you use the corresponding value of another metric, the dimension names of the two metrics should be consistent.

Anomalies not filtered out will be sent in an alert.

#### Add cross-metric settings

Click **+ Add cross-metric settings** in the alert settings page to add another section.

The **Operator** selector is the logical relationship of each section, to determine if they send an alert.


|Operator  |Description  |
|---------|---------|
|AND     | Only send an alert if a series matches each alert section, and all data points are anomalies. If the metrics have different dimension names, an alert will never be triggered.         |
|OR     | Send the alert if at least one section contains anomalies.         |

:::image type="content" source="../media/alerts/alert-setting-operator.png" alt-text="Operator for multiple alert setting section":::

### Get details for alert

After setting **timestamp** and **alertSettingGuid** in your api service, you can get details of alert with the API:
- `query_alert_result_anomalies`
- `query_alert_result_incidents`

You can manage all your hooks in the hook settings page. 

## Next Steps

- [Add and manage data feeds](../how-tos/datafeeds.md)
    - [Configurations for different data sources](../data-feeds-from-different-sources.md)
- [Send anomaly feedback to your instance](../how-tos/anomaly-feedback.md)
- [Diagnose incidents](../how-tos/diagnose-incident.md).
- [Configure metrics and anomaly detection](configure-metrics.md)