---
title: Configure Metrics Advisor alerts
titleSuffix: Azure AI services
description: How to configure your Metrics Advisor alerts using hooks for email, web and Azure DevOps.
author: mrbullwinkle
manager: nitinme
ms.service: azure-ai-metrics-advisor
ms.custom: applied-ai-non-critical-metrics-advisor
ms.topic: how-to
ms.date: 09/14/2020
ms.author: mbullwin
---

# How-to: Configure alerts and get notifications using a hook

[!INCLUDE [Deprecation announcement](../includes/deprecation.md)]

After an anomaly is detected by Metrics Advisor, an alert notification will be triggered based on alert settings, using a hook. An alert setting can be used with multiple detection configurations, various parameters are available to customize your alert rule.

## Create a hook

Metrics Advisor supports four different types of hooks: email, Teams, webhook, and Azure DevOps. You can choose the one that works for your specific scenario.      

### Email hook

> [!Note]
> Metrics Advisor resource administrators need to configure the Email settings, and input **SMTP related information** into Metrics Advisor before anomaly alerts can be sent. The resource group admin or subscription admin needs to assign at least one *Cognitive Services Metrics Advisor Administrator* role in the Access control tab of the Metrics Advisor resource. [Learn more about e-mail settings configuration](../faq.yml#how-to-set-up-email-settings-and-enable-alerting-by-email-). 


An email hook is the channel for anomaly alerts to be sent to email addresses specified in the **Email to** section. Two types of alert emails will be sent: **Data feed not available** alerts, and **Incident reports**, which contain one or multiple anomalies. 

To create an email hook, the following parameters are available: 

|Parameter |Description  |
|---------|---------|
| Name | Name of the email hook |
| Email to| Email addresses to send alerts to|
| External link | Optional field, which enables a customized redirect, such as for troubleshooting notes. |
| Customized anomaly alert title | Title template supports `${severity}`, `${alertSettingName}`, `${datafeedName}`, `${metricName}`, `${detectConfigName}`, `${timestamp}`, `${topDimension}`, `${incidentCount}`, `${anomalyCount}`

After you select **OK**, an email hook will be created. You can use it in any alert settings to receive anomaly alerts. Refer to the tutorial of [enable anomaly notification in Metrics Advisor](../tutorials/enable-anomaly-notification.md#send-notifications-with-azure-logic-apps-teams-and-smtp) for detailed steps.

### Teams hook

A Teams hook is the channel for anomaly alerts to be sent to a channel in Microsoft Teams. A Teams hook is implemented through an "Incoming webhook" connector. You may need to create an "Incoming webhook" connector ahead in your target Teams channel and get a URL of it. Then pivot back to your Metrics Advisor workspace. 

Select "Hooks" tab in left navigation bar, and select "Create hook" button at top right of the page. Choose hook type of "Teams", following parameters are provided: 

|Parameter |Description  |
|---------|---------|
| Name | Name of the Teams hook | 
| Connector URL | The URL that just copied from "Incoming webhook" connector that created in target Teams channel. |

After you select **OK**, a Teams hook will be created. You can use it in any alert settings to notify anomaly alerts to target Teams channel. Refer to the tutorial of [enable anomaly notification in Metrics Advisor](../tutorials/enable-anomaly-notification.md#send-notifications-with-azure-logic-apps-teams-and-smtp) for detailed steps.

### Web hook

A web hook is another notification channel by using an endpoint that is provided by the customer. Any anomaly detected on the time series will be notified through a web hook. There're several steps to enable a web hook as alert notification channel within Metrics Advisor. 

**Step1.** 	Enable Managed Identity in your Metrics Advisor resource

A system assigned managed identity is restricted to one per resource and is tied to the lifecycle of this resource. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). The managed identity is authenticated with Azure AD, so you don’t have to store any credentials in code. 

Go to Metrics Advisor resource in Azure portal, and select "Identity", turn it to "on" then Managed Identity is enabled. 

**Step2.** Create a web hook in Metrics Advisor workspace

Log in to you workspace and select "Hooks" tab, then select "Create hook" button. 


To create a web hook, you will need to add the following information:

|Parameter |Description  |
|---------|---------|
|Endpoint     | The API address to be called when an alert is triggered. **MUST be Https**.       |
|Username / Password | For authenticating to the API address. Leave this black if authentication isn't needed.         |
|Header     | Custom headers in the API call.        |
|Certificate identifier in Azure Key vaults| If accessing the endpoint needs to be authenticated by a certificate, the certificate should be stored in Azure Key vaults. Input the identifier here.

> [!Note]
> When a web hook is created or modified, the endpoint will be called as a test with **an empty request body**. Your API needs to return a 200 HTTP code to successfully pass the validation.

:::image type="content" source="../media/alerts/create-web-hook.png" alt-text="web hook creation window.":::

- Request method is  **POST**
- Timeout 30s
- Retry for 5xx error, ignore other error. Will not follow 301/302 redirect request.
- Request body: 
```
{
"value": [{
	"hookId": "b0f27e91-28cf-4aa2-aa66-ac0275df14dd",
	"alertType": "Anomaly",
	"alertInfo": {
		"anomalyAlertingConfigurationId": "1bc6052e-9a2a-430b-9cbd-80cd07a78c64",
		"alertId": "172536dbc00",
		"timestamp": "2020-05-27T00:00:00Z",
		"createdTime": "2020-05-29T10:04:45.590Z",
		"modifiedTime": "2020-05-29T10:04:45.590Z"
	},
	"callBackUrl": "https://kensho2-api.azurewebsites.net/alert/anomaly/configurations/1bc6052e-9a2a-430b-9cbd-80cd07a78c64/alerts/172536dbc00/incidents"
}]
}
```

**Step3. (optional)** Store your certificate in Azure Key vaults and get identifier
As mentioned, if accessing the endpoint needs to be authenticated by a certificate, the certificate should be stored in Azure Key vaults. 

- Check [Set and retrieve a certificate from Azure Key Vault using the Azure portal](../../../key-vault/certificates/quick-create-portal.md)
- Select the certificate you've added, then you're able to copy the "Certificate identifier". 
- Then select "Access policies" and "Add access policy", grant "get" permission for "Key permissions", "Secrete permissions" and "Certificate permissions". Select principal as the name of your Metrics Advisor resource. Select "Add" and "Save" button in "Access policies" page. 

**Step4.** Receive anomaly notification
When a notification is pushed through a web hook, you can  fetch incidents data by calling the "callBackUrl" in Webhook Request. Details for this api:

-   [/alert/anomaly/configurations/{configurationId}/alerts/{alertId}/incidents](https://westus2.dev.cognitive.microsoft.com/docs/services/MetricsAdvisor/operations/getIncidentsFromAlertByAnomalyAlertingConfiguration)

By using web hook and Azure Logic Apps, it's possible to send email notification **without an SMTP server configured**. Refer to the tutorial of [enable anomaly notification in Metrics Advisor](../tutorials/enable-anomaly-notification.md#send-notifications-with-azure-logic-apps-teams-and-smtp) for detailed steps.

### Azure DevOps

Metrics Advisor also supports automatically creating a work item in Azure DevOps to track issues/bugs when any anomaly is detected. All alerts can be sent through Azure DevOps hooks.

To create an Azure DevOps hook, you will need to add the following information

|Parameter |Description  |
|---------|---------|
| Name | A name for the hook |
| Organization | The organization that your DevOps belongs to |
| Project | The specific project in DevOps. |
| Access Token |  A token for authenticating to DevOps. | 

> [!Note]
> You need to grant write permissions if you want Metrics Advisor to create work items based on anomaly alerts. 
> After creating hooks, you can use them in any of your alert settings. Manage your hooks in the **hook settings** page. 

## Add or edit alert settings

Go to metrics detail page to find the **Alert settings** section, in the bottom-left corner of the metrics detail page. It lists all alert settings that apply to the selected detection configuration. When a new detection configuration is created, there's no alert setting, and no alerts will be sent.  
You can use the **add**, **edit** and **delete** icons to modify alert settings.

:::image type="content" source="../media/alerts/alert-setting.png" alt-text="Alert settings menu item.":::

Select the **add** or **edit** buttons to get a window to add or edit your alert settings.

:::image type="content" source="../media/alerts/edit-alert.png" alt-text="Add or edit alert settings":::

**Alert setting name**: The name of the alert setting. It will be displayed in the alert email title.

**Hooks**: The list of hooks to send alerts to.

The section marked in the screenshot above are the settings for one detection configuration. You can set different alert settings for different detection configurations. Choose the target configuration using the third drop-down list in this window. 

### Filter settings 

The following are filter settings for one detection configuration.

**Alert For** has four options for filtering anomalies:

* **Anomalies in all series**: All anomalies will be included in the alert.         
* **Anomalies in the series group**: Filter series by dimension values. Set specific values for some dimensions. Anomalies will only be included in the alert when the series matches the specified value.       
* **Anomalies in favorite series**: Only the series marked as favorite will be included in the alert.        |
* **Anomalies in top N of all series**: This filter is for the case that you only care about the series whose value is in the top N. Metrics Advisor will look back over previous timestamps, and check if values of the series at these timestamps are in top N. If the "in top n" count is larger than the specified number, the anomaly will be included in an alert.        |

**Filter anomaly options are an extra filter with the following options**:

- **Severity**: The anomaly will only be included when the anomaly severity is within the specified range.
- **Snooze**: Stop alerts temporarily for anomalies in the next N points (period), when triggered in an alert.
    - **snooze type**: When set to **Series**, a triggered anomaly will only snooze its series. For **Metric**, one triggered anomaly will snooze all the series in this metric.
    - **snooze number**: the number of points (period) to snooze.
    - **reset for non-successive**: When selected, a triggered anomaly will only snooze the next n successive anomalies. If one of the following data points isn't an anomaly, the snooze will be reset from that point; When unselected, one triggered anomaly will snooze next n points (period), even if successive data points aren't anomalies.
- **value** (optional): Filter by value. Only point values that meet the condition, anomaly will be included. If you use the corresponding value of another metric, the dimension names of the two metrics should be consistent.

Anomalies not filtered out will be sent in an alert.

### Add cross-metric settings

Select **+ Add cross-metric settings** in the alert settings page to add another section.

The **Operator** selector is the logical relationship of each section, to determine if they send an alert.


|Operator  |Description  |
|---------|---------|
|AND     | Only send an alert if a series matches each alert section, and all data points are anomalies. If the metrics have different dimension names, an alert will never be triggered.         |
|OR     | Send the alert if at least one section contains anomalies.         |

:::image type="content" source="../media/alerts/alert-setting-operator.png" alt-text="Operator for multiple alert setting sections":::

## Next steps

- [Adjust anomaly detection using feedback](anomaly-feedback.md)
- [Diagnose an incident](diagnose-an-incident.md).
- [Configure metrics and fine tune detection configuration](configure-metrics.md)
