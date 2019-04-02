---
title: Integrate security operations with Microsoft Graph Security - Azure Logic Apps
description: Improve your app's threat protection, detection, and response capabilities by managing security operations with Microsoft Graph Security & Azure Logic Apps
services: logic-apps
ms.service: logic-apps
ms.suite: integration
author: preetikr
ms.author: preetikr
ms.reviewer: klam, estfan, LADocs
ms.topic: article
ms.date: 01/30/2019
tags: connectors
---

# Improve threat protection by integrating security operations with Microsoft Graph Security & Azure Logic Apps

With [Azure Logic Apps](../logic-apps/logic-apps-overview.md) and the 
[Microsoft Graph Security](https://docs.microsoft.com/graph/security-concept-overview) 
connector, you can improve how your app detects, protects, and responds 
to threats by creating automated workflows for integrating Microsoft 
security products, services, and partners. For example, you can create 
[Azure Security Center playbooks](../security-center/security-center-playbooks.md) 
that monitor and manage Microsoft Graph Security entities, such as alerts. 
Here are some scenarios supported by the Microsoft Graph Security connector:

* Get alerts based on queries or by alert ID. For example, 
you can get a list that includes high severity alerts.
* Update alerts. For example, you can update alert 
assignments, add comments to alerts, or tag alerts.
* Monitor when alerts are created or changed by creating 
[alert subscriptions (webhooks)](https://docs.microsoft.com/graph/api/resources/webhooks).
* Manage your alert subscriptions. For example, 
you can get active subscriptions, extend the expiration 
time for a subscription, or delete subscriptions.

Your logic app's workflow can use actions that get responses 
from the Microsoft Graph Security connector and make that output 
available to other actions in your workflow. You can also have 
other actions in your workflow use the output from the Microsoft 
Graph Security connector actions. For example, if you get high 
severity alerts through the Microsoft Graph Security connector, 
you can send those alerts in an email message by using the Outlook connector. 

To learn more about Microsoft Graph Security, see 
the [Microsoft Graph Security API overview](https://aka.ms/graphsecuritydocs). 
If you're new to logic apps, review 
[What is Azure Logic Apps?](../logic-apps/logic-apps-overview.md). 
If you're looking for Microsoft Flow or PowerApps, see 
[What is Flow?](https://flow.microsoft.com/) 
or [What is PowerApps?](https://powerapps.microsoft.com/)

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, 
[sign up for a free Azure account](https://azure.microsoft.com/free/). 

* To use the Microsoft Graph Security connector, you must have *explicitly given* 
Azure Active Directory (AD) tenant administrator consent, which is part of the 
[Microsoft Graph Security Authentication requirements](https://aka.ms/graphsecurityauth). 
This consent requires the Microsoft Graph Security connector's application ID and name, 
which you can also find in the [Azure portal](https://portal.azure.com):

   | Property | Value |
   |----------|-------|
   | **Application Name** | `MicrosoftGraphSecurityConnector` |
   | **Application ID** | `c4829704-0edc-4c3d-a347-7c4a67586f3c` |
   |||

   To grant consent for the connector, your Azure AD tenant 
   administrator can follow either these steps:

   * [Grant tenant administrator consent for Azure AD applications](../active-directory/develop/v2-permissions-and-consent.md).

   * During your logic app's first run, your app can request consent 
   from your Azure AD tenant administrator through the 
   [application consent experience](../active-directory/develop/application-consent-experience.md).
   
* Basic knowledge about [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md)

* The logic app where you want to access your Microsoft Graph Security entities, 
such as alerts. Currently, this connector has no triggers. So, to use a Microsoft Graph 
Security action, start your logic app with a trigger, for example, the **Recurrence** trigger.

## Connect to Microsoft Graph Security 

[!INCLUDE [Create connection general intro](../../includes/connectors-create-connection-general-intro.md)]

1. Sign in to the [Azure portal](https://portal.azure.com/), 
and open your logic app in Logic App Designer, if not open already.

1. For blank logic apps, add the trigger and any other actions you 
want before you add a Microsoft Graph Security action.

   -or-

   For existing logic apps, under the last step where you want 
   to add a Microsoft Graph Security action, choose **New step**.

   -or-

   To add an action between steps, move your pointer over the arrow between steps. 
   Choose the plus sign (+) that appears, and select **Add an action**.

1. In the search box, enter "microsoft graph security" as your filter. 
From the actions list, select the action you want.

1. Sign in with your Microsoft Graph Security credentials.

1. Provide the necessary details for your selected 
action and continue building your logic app's workflow.

## Add actions

Here are more specific details about using the various actions 
available with the Microsoft Graph Security connector.

### Manage alerts

To filter, sort, or get the most recent results, provide *only* the 
[ODATA query parameters supported by Microsoft Graph](https://docs.microsoft.com/graph/query-parameters). *Don't 
specify* the complete base URL or the HTTP action, for example, `https://graph.microsoft.com/v1.0/security/alerts`, or the 
`GET` or `PATCH` operation. Here's a specific example that 
shows the parameters for a **Get alerts** action when you want 
a list with high severity alerts:

`Filter alerts value as Severity eq 'high'`

For more information about the queries you can use with this connector, see the 
[Microsoft Graph Security alerts reference documentation](https://docs.microsoft.com/graph/api/alert-list). 
To build enhanced experiences with this connector, learn more about the 
[schema properties alerts](https://docs.microsoft.com/graph/api/resources/alert) 
that the connector supports.

| Action | Description |
|--------|-------------|
| **Get alerts** | Get alerts filtered based on one or more [alert properties](https://docs.microsoft.com/graph/api/resources/alert), for example: <p>`Provider eq 'Azure Security Center' or 'Palo Alto Networks'` | 
| **Get alert by ID** | Get a specific alert based on the alert ID. | 
| **Update alert** | Update a specific alert based on the alert ID. <p>To make sure you pass the required and editable properties in your request, see the [editable properties for alerts](https://docs.microsoft.com/graph/api/alert-update). For example, to assign an alert to a security analyst so they can investigate, you can update the alert's **Assigned to** property. |
|||

### Manage alert subscriptions

Microsoft Graph supports [*subscriptions*](https://docs.microsoft.com/graph/api/resources/subscription), 
or [*webhooks*](https://docs.microsoft.com/graph/api/resources/webhooks). 
To get, update, or delete subscriptions, provide the 
[ODATA query parameters supported by Microsoft Graph](https://docs.microsoft.com/graph/query-parameters) 
to the Microsoft Graph entity construct and include 
`security/alerts` followed by the ODATA query. 
*Don't include* the base URL, for example, 
`https://graph.microsoft.com/v1.0`. Instead, 
use the format in this example:

`security/alerts?$filter=status eq 'New'`

| Action | Description |
|--------|-------------|
| **Create subscriptions** | [Create a subscription](https://docs.microsoft.com/graph/api/subscription-post-subscriptions) that notifies you about any changes. You can filter this subscription for the specific alert types you want. For example, you can create a subscription that notifies you about high severity alerts. |
| **Get active subscriptions** | [Get unexpired subscriptions](https://docs.microsoft.com/graph/api/subscription-list). | 
| **Update subscription** | [Update a subscription](https://docs.microsoft.com/graph/api/subscription-update) by providing the subscription ID. For example, to extend your subscription, you can update the subscription's `expirationDateTime` property. | 
| **Delete subscription** | [Delete a subscription](https://docs.microsoft.com/graph/api/subscription-delete) by providing the subscription ID. | 
||| 

## Connector reference

For technical details about triggers, actions, and limits, 
which are described by the connector's OpenAPI 
(formerly Swagger) description, review the connector's 
[reference page](https://aka.ms/graphsecurityconnectorreference).

## Get support

For questions, visit the 
[Azure Logic Apps forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=azurelogicapps).
To submit or vote on feature ideas, visit the 
[Logic Apps user feedback site](https://aka.ms/logicapps-wish).

## Next steps

Learn about other [Logic Apps connectors](../connectors/apis-list.md)
