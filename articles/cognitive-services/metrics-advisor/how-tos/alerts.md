---
title: Metrics Advisor alerts
titleSuffix: Azure Cognitive Services
description: How to configure your Metrics Advisor alerts
services: cognitive-services
author: aahill
manager: nitinme
ms.service: cognitive-services
ms.subservice:
ms.topic: conceptual
ms.date: 08/19/2020
ms.author: aahi
---

# How-to: Configure alerts and get notifications using a web hook

After an anomaly is detected by Metrics Advisor, an alert notification will be triggered based on alert settings, using a hook. An alert setting can be used with multiple detection configurations, various parameters are available to customize your alert rule.

## Create a hook

Metrics Advisor supports three different types of hooks: email hook, web hook and Azure DevOps. You can choose the one that works in your specific scenario. 

### Email hook

> [!Note]
> The Metrics Advisor resource administrators need to configure the **Email settings**, and input SMTP related information into Metrics Advisor before anomaly alerts can be sent.
To create a email hook, following parameters are available: 

An email hook is the channel for anomaly alerts to be sent to email addresses specified in the **Email to** section. Two types of alert emails will be sent: *Data feed not available* alerts, and *Incident reports* which contain one or multiple anomalies. 

|Parameter |Description  |
|---------|---------|
| Name | Name of the email hook |
| Email to| Email addresses that would send alert to|
| External link | Optional field which enables customized redirect, like troubleshooting note, etc|
| Customized anomaly alert title | Title template supports `${severity}`, `${alertSettingName}`, `${datafeedName}`, `${metricName}`, `${detectConfigName}`, `${timestamp}`, `${topDimension}`, `${incidentCount}`, `${anomalyCount}`

After you click **OK**, an email hook will be created. You can use it in any alert settings to receive anomaly alerts. 

### Create a web hook

A web hook is the entry point to get anomaly noticed by a programmatic way from the Metrics Advisor service, which calls a user-provided API when an alert is triggered. All alerts, including "Data feed not available" and "Incident report" alerts could be sent through web hooks.

> [!Note]
> * Use the **POST** request method.
> * The request body wil be similar to:  
    `{"timestamp":"2019-09-11T00:00:00Z","alertSettingGuid":"49635104-1234-4c1c-b94a-744fc920a9eb"}`
> * When a web hook is created or modified, the API will be called as a test with an empty request body. Your API needs to return a 200 HTTP code.

A web hook is the entry point for all the information available from the Metrics Advisor service, and calls a user-provided api when an alert is triggered. All alerts, including "Data feed not available" and "Incident report" alerts are sent through web hooks only.

To create a web hook, you will need to add the following information:

|Parameter |Description  |
|---------|---------|
|Endpoint     | The API address to be called when an alert is triggered.        |
|Username / Password | For authenticating to the API address. Leave this black if authentication isn't needed.         |
|Header     | Custom headers in the API call.        |

:::image type="content" source="../media/alerts/create_web_hook.png" alt-text="web hook creation window.":::

When a notification is pushed through a web hook, you can use the following APIs to get details of the alert. Set **timestamp** and **alertSettingGuid** in your API service, which is being pushed to, then use the following queries: 
- `query_alert_result_anomalies`
- `query_alert_result_incidents`

### Azure DevOps

Metrics Advisor also supports automatically creating a work item in Azure DevOps to track issues/bugs when any anomaly detected. All alerts can be sent through Azure DevOps hooks.

To create a Azure DevOps hook, you will need to add the following information

|Parameter |Description  |
|---------|---------|
| Name | A name for the hook |
| Organization | The organization that your DevOps belongs to |
| Project | The specific project in DevOps. |
| Access Token |  A token for authenticating to DevOps. | 

> [!Note]
> You need to grant **write** permissions if you want Metrics Advisor to create work items based on anomaly alerts. 
> After creating hooks, you can use them in any of your alert settings. Manage your hooks in the **hook settings** page.

### Add or Edit alert settings

Go to metrics detail page, You can find the **Alert settings** section at the bottom left corner of metrics detail page. It lists all alert settings that works together with the selected detection configuration. When a new detection configuration is created, there's no alert setting, and no alerts will be sent.  
You can use the **add**, **edit** and **delete** icons to modify alert settings.

![Entrance For Alert Setting](../media/alerts/alert-setting.png)

Click the **add** or **edit** buttons to get a window to add or edit your alert settings.

:::image type="content" source="../media/alerts/edit-alert.png" alt-text="Add or edit alert settings":::

**Alert setting name**: The name of this alert setting. It will be displayed in the alert email title.

**Hooks**: The list of hooks to send alerts to.

The section marked in the screenshot above are the settings for one detecting configuration. You can set different alert settings for different detection configurations. Choose the target configuration using the third drop-down list in this window. 

### Filter settings 

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

### Add cross-metric settings

Click **+ Add cross-metric settings** in the alert settings page to add another section.

The **Operator** selector is the logical relationship of each section, to determine if they send an alert.


|Operator  |Description  |
|---------|---------|
|AND     | Only send an alert if a series matches each alert section, and all data points are anomalies. If the metrics have different dimension names, an alert will never be triggered.         |
|OR     | Send the alert if at least one section contains anomalies.         |

:::image type="content" source="../media/alerts/alert-setting-operator.png" alt-text="Operator for multiple alert setting section":::

## Next Steps

- [Add and manage data feeds](manage-data-feeds.md)
    - [Configurations for different data sources](../data-feeds-from-different-sources.md)
- [Send anomaly feedback to your instance](anomaly-feedback.md)
- [Diagnose incidents](diagnose-incident.md).
- [Configure metrics and anomaly detection](configure-metrics.md)