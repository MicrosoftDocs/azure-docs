---
title: Integrate and manage security operations & Microsoft Graph Security
description: Improve your app's threat protection, detection, and response with Microsoft Graph Security & Azure Logic Apps.
services: logic-apps
ms.suite: integration
author: ecfan
ms.author: preetikr
ms.reviewer: v-ching, estfan, azla
ms.topic: how-to
ms.date: 02/21/2020
tags: connectors
---

# Improve threat protection by integrating security operations with Microsoft Graph Security & Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the [Microsoft Graph Security](/graph/security-concept-overview) connector, you can improve how your app detects, protects, and responds to threats by creating automated workflows for integrating Microsoft security products, services, and partners. For example, you can create [Microsoft Defender for Cloud playbooks](../security-center/workflow-automation.md) that monitor and manage Microsoft Graph Security entities, such as alerts. Here are some scenarios that are supported by the Microsoft Graph Security connector:

* Get alerts based on queries or by alert ID. For example, you can get a list that includes high severity alerts.

* Update alerts. For example, you can update alert assignments, add comments to alerts, or tag alerts.

* Monitor when alerts are created or changed by creating [alert subscriptions (webhooks)](/graph/api/resources/webhooks).

* Manage your alert subscriptions. For example, you can get active subscriptions, extend the expiration time for a subscription, or delete subscriptions.

Your logic app's workflow can use actions that get responses from the Microsoft Graph Security connector and make that output available to other actions in your workflow. You can also have other actions in your workflow use the output from the Microsoft Graph Security connector actions. For example, if you get high severity alerts through the Microsoft Graph Security connector, you can send those alerts in an email message by using the Outlook connector. 

To learn more about Microsoft Graph Security, see the [Microsoft Graph Security API overview](/graph/security-concept-overview). If you're new to logic apps, review [What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md). If you're looking for Power Automate or Power Apps, see [What is Power Automate?](https://make.powerautomate.com/) or [What is Power Apps?](https://powerapps.microsoft.com/)

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* To use the Microsoft Graph Security connector, you must have *explicitly given* Azure Active Directory (AD) tenant administrator consent, which is part of the [Microsoft Graph Security Authentication requirements](/graph/security-authorization). This consent requires the Microsoft Graph Security connector's application ID and name, which you can also find in the [Azure portal](https://portal.azure.com):

  | Property | Value |
  |----------|-------|
  | **Application Name** | `MicrosoftGraphSecurityConnector` |
  | **Application ID** | `c4829704-0edc-4c3d-a347-7c4a67586f3c` |
  |||

  To grant consent for the connector, your Azure AD tenant administrator can follow either these steps:

  * [Grant tenant administrator consent for Azure AD applications](../active-directory/develop/v2-permissions-and-consent.md).

  * During your logic app's first run, your app can request consent from your Azure AD tenant administrator through the [application consent experience](../active-directory/develop/application-consent-experience.md).
   
* Basic knowledge about how to create logic apps

* The logic app where you want to access your Microsoft Graph Security entities, such as alerts. To use a Microsoft Graph Security trigger, you need a blank logic app. To use a Microsoft Graph Security action, you need a logic app that starts with the appropriate trigger for your scenario.

## Connect to Microsoft Graph Security 

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com/), and open your logic app in Logic App Designer, if not open already.

1. For blank logic apps, add the trigger and any other actions that you want before you add a Microsoft Graph Security action.

   -or-

   For existing logic apps, under the last step where you want to add a Microsoft Graph Security action, select **New step**.

   -or-

   To add an action between steps, move your pointer over the arrow between steps. Select the plus sign (+) that appears, and select **Add an action**.

1. In the search box, enter "microsoft graph security" as your filter. From the actions list, select the action you want.

1. Sign in with your Microsoft Graph Security credentials.

1. Provide the necessary details for your selected action and continue building your logic app's workflow.

## Add triggers

In Azure Logic Apps, every logic app must start with a [trigger](../logic-apps/logic-apps-overview.md#logic-app-concepts), which fires when a specific event happens or when a specific condition is met. Each time that the trigger fires, the Logic Apps engine creates a logic app instance and starts running your app's workflow.

> [!NOTE] 
> When a trigger fires, the trigger processes all the new alerts. If no alerts are received, 
> the trigger run is skipped. The next trigger poll happens based on the recurrence interval 
> that you specify in the trigger's properties.

This example shows how you can start a logic app workflow when new alerts are sent to your app.

1.	In the Azure portal or Visual Studio, create a blank logic app, which opens the Logic App Designer. This example uses the Azure portal.

1.	On the designer, in the search box, enter "microsoft graph security" as your filter. From the triggers list, select this trigger: **On all new alerts**

1.	In the trigger, provide information about the alerts that you want to monitor. For more properties, open the **Add new parameter** list, and select a parameter to add that property to the trigger.

   | Property | Property (JSON) | Required | Type | Description |
   |----------|-----------------|----------|------|-------------|
   | **Interval** | `interval` | Yes | Integer | A positive integer that describes how often the workflow runs based on the frequency. Here are the minimum and maximum intervals: <p><p>- Month: 1-16 months <br>- Day: 1-500 days <br>- Hour: 1-12,000 hours <br>- Minute: 1-72,000 minutes <br>- Second: 1-9,999,999 seconds <p>For example, if the interval is 6, and the frequency is "Month", then the recurrence is every 6 months. |
   | **Frequency** | `frequency` | Yes | String | The unit of time for the recurrence: **Second**, **Minute**, **Hour**, **Day**, **Week**, or **Month** |
   | **Time zone** | `timeZone` | No | String | Applies only when you specify a start time because this trigger doesn't accept [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). Select the time zone that you want to apply. |
   | **Start time** | `startTime` | No | String | Provide a start date and time in this format: <p><p>YYYY-MM-DDThh:mm:ss if you select a time zone <p>-or- <p>YYYY-MM-DDThh:mm:ssZ if you don't select a time zone <p>For example, if you want September 18, 2017 at 2:00 PM, then specify "2017-09-18T14:00:00" and select a time zone such as Pacific Standard Time. Or, specify "2017-09-18T14:00:00Z" without a time zone. <p>**Note:** This start time has a maximum of 49 years in the future and must follow the [ISO 8601 date time specification](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) in [UTC date time format](https://en.wikipedia.org/wiki/Coordinated_Universal_Time), but without a [UTC offset](https://en.wikipedia.org/wiki/UTC_offset). If you don't select a time zone, you must add the letter "Z" at the end without any spaces. This "Z" refers to the equivalent [nautical time](https://en.wikipedia.org/wiki/Nautical_time). <p>For simple schedules, the start time is the first occurrence, while for complex schedules, the trigger doesn't fire any sooner than the start time. [*What are the ways that I can use the start date and time?*](../logic-apps/concepts-schedule-automated-recurring-tasks-workflows.md#start-time) |
   ||||||

1.	When you're done, on the designer toolbar, select **Save**.

1.	Now continue adding one or more actions to your logic app for the tasks you want to perform with the trigger results.

## Add actions

Here are more specific details about using the various actions available with the Microsoft Graph Security connector.

### Manage alerts

To filter, sort, or get the most recent results, provide *only* the [ODATA query parameters supported by Microsoft Graph](/graph/query-parameters). *Don't specify* the complete base URL or the HTTP action, for example, `https://graph.microsoft.com/v1.0/security/alerts`, or the `GET` or `PATCH` operation. Here's a specific example that shows the parameters for a **Get alerts** action when you want a list with high severity alerts:

`Filter alerts value as Severity eq 'high'`

For more information about the queries you can use with this connector, see the [Microsoft Graph Security alerts reference documentation](/graph/api/alert-list). To build enhanced experiences with this connector, learn more about the 
[schema properties alerts](/graph/api/resources/alert) that the connector supports.

| Action | Description |
|--------|-------------|
| **Get alerts** | Get alerts filtered based on one or more [alert properties](/graph/api/resources/alert), for example, `Provider eq 'Azure Security Center' or 'Palo Alto Networks'`. |
| **Get alert by ID** | Get a specific alert based on the alert ID. |
| **Update alert** | Update a specific alert based on the alert ID. To make sure you pass the required and editable properties in your request, see the [editable properties for alerts](/graph/api/alert-update). For example, to assign an alert to a security analyst so they can investigate, you can update the alert's **Assigned to** property. |
|||

### Manage alert subscriptions

Microsoft Graph supports [*subscriptions*](/graph/api/resources/subscription), or [*webhooks*](/graph/api/resources/webhooks). To get, update, or delete subscriptions, provide the [ODATA query parameters supported by Microsoft Graph](/graph/query-parameters) to the Microsoft Graph entity construct and include 
`security/alerts` followed by the ODATA query. *Don't include* the base URL, for example, `https://graph.microsoft.com/v1.0`. Instead, 
use the format in this example:

`security/alerts?$filter=status eq 'NewAlert'`

| Action | Description |
|--------|-------------|
| **Create subscriptions** | [Create a subscription](/graph/api/subscription-post-subscriptions) that notifies you about any changes. You can filter this subscription for the specific alert types you want. For example, you can create a subscription that notifies you about high severity alerts. |
| **Get active subscriptions** | [Get unexpired subscriptions](/graph/api/subscription-list). | 
| **Update subscription** | [Update a subscription](/graph/api/subscription-update) by providing the subscription ID. For example, to extend your subscription, you can update the subscription's `expirationDateTime` property. | 
| **Delete subscription** | [Delete a subscription](/graph/api/subscription-delete) by providing the subscription ID. | 
||| 

### Manage threat intelligence indicators

To filter, sort, or get the most recent results, provide *only* the [ODATA query parameters supported by Microsoft Graph](/graph/query-parameters). *Don't specify* the complete base URL or the HTTP action, for example, `https://graph.microsoft.com/beta/security/tiIndicators`, or the `GET` or `PATCH` operation. Here's a specific example that shows the parameters for a **Get tiIndicators** action when you want a list that has the `DDoS` threat type:

`Filter threat intelligence indicator value as threatType eq 'DDoS'`

For more information about the queries that you can use with this connector, see ["Optional Query Parameters" in the Microsoft Graph Security threat intelligence indicator reference documentation](/graph/api/tiindicators-list). To build enhanced experiences with this connector, learn more about the 
[schema properties threat intelligence indicator](/graph/api/resources/tiindicator) that the connector supports.

| Action | Description |
|--------|-------------|
| **Get threat intelligence indicators** | Get tiIndicators filtered based on one or more [tiIndicator properties](/graph/api/resources/tiindicator), for example, `threatType eq 'MaliciousUrl' or 'DDoS'` |
| **Get threat intelligence indicator by ID** | Get a specific tiIndicator based on the tiIndicator ID. | 
| **Create threat intelligence indicator** | Create a new tiIndicator by posting to the tiIndicators collection. To make sure that you pass the required properties in your request, refer to the [required properties for creating tiIndicator](/graph/api/tiindicators-post). |
| **Submit multiple threat intelligence indicators** | Create multiple new tiIndicators by posting a tiIndicators collection. To make sure that you pass the required properties in your request, refer to the [required properties for submitting multiple tiIndicators](/graph/api/tiindicator-submittiindicators). |
| **Update threat intelligence indicator** | Update a specific tiIndicator based on the tiIndicator ID. To make sure you pass the required and editable properties in your request, see the [editable properties for tiIndicator](/graph/api/tiindicator-update). For example, to update the action to apply if the indicator is matched from within the targetProduct security tool, you can update the tiIndicator's **action** property. |
| **Update multiple threat intelligence indicators** | Update multiple tiIndicators. To make sure you pass the required properties in your request, refer to the [required properties for updating multiple tiIndicators](/graph/api/tiindicator-updatetiindicators). |
| **Delete threat intelligence indicator by ID** | Delete a specific tiIndicator based on the tiIndicator ID. |
| **Delete multiple threat intelligence indicators by IDs** | Delete multiple tiIndicators by their IDs. To make sure that you pass the required properties in your request, refer to the [required properties for deleting multiple tiIndicators by IDs](/graph/api/tiindicator-deletetiindicators). |
| **Delete multiple threat intelligence indicators by external IDs** | Delete multiple tiIndicators by the external IDs. To make sure that you pass the required properties in your request, refer to the [required properties for deleting multiple tiIndicators by external IDs](/graph/api/tiindicator-deletetiindicatorsbyexternalid). |
|||

## Connector reference

For technical details about triggers, actions, and limits, which are described by the connector's OpenAPI (formerly Swagger) description, review the connector's [reference page](/connectors/microsoftgraphsecurity/).

## Next steps

* [Managed connectors for Azure Logic Apps](/connectors/connector-reference/connector-reference-logicapps-connectors)
* [Built-in connectors for Azure Logic Apps](built-in.md)
