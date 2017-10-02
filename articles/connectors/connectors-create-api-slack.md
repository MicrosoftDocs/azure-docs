---
title: Use the Slack Connector in your Azure logic apps| Microsoft Docs
description: Connect to Slack in your logic apps
services: logic-apps
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: 234cad64-b13d-4494-ae78-18b17119ba24
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 05/18/2016
ms.author: mandia; ladocs

---
# Get started with the Slack connector
Slack is a team communication tool, that brings together all of your team communications in one place, instantly searchable and available wherever you go. 

Get started by creating a logic app now; see [Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

## Create a connection to Slack
To use the Slack connector, you first create a **connection** then provide the details for these properties: 

| Property | Required | Description |
| --- | --- | --- |
| Token |Yes |Provide Slack Credentials |

Follow these steps to sign into Slack, and complete the configuration of the Slack **connection** in your logic app:

1. Select **Recurrence**
2. Select a **Frequency** and enter an **Interval**
3. Select **Add an action**  
   ![Configure Slack][1]  
4. Enter Slack in the search box and wait for the search to return all entries with Slack in the name
5. Select **Slack - Post message**
6. Select **Sign in to Slack**:  
   ![Configure Slack][2]
7. Provide your Slack credentials to sign in to authorize the  application    
   ![Configure Slack][3]  
8. You'll be redirected to your organization's Log in page. **Authorize** Slack to interact with your logic app:      
   ![Configure Slack][5] 
9. After the authorization completes you'll be redirected to your logic app to complete it by configuring the **Slack - Get all messages** section. Add other triggers and actions that you need.  
   ![Configure Slack][6]
10. Save your work by selecting **Save** on the menu bar above.

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/slack/).

## More connectors
Go back to the [APIs list](apis-list.md).

[1]: ./media/connectors-create-api-slack/connectionconfig1.png
[2]: ./media/connectors-create-api-slack/connectionconfig2.png 
[3]: ./media/connectors-create-api-slack/connectionconfig3.png
[4]: ./media/connectors-create-api-slack/connectionconfig4.png
[5]: ./media/connectors-create-api-slack/connectionconfig5.png
[6]: ./media/connectors-create-api-slack/connectionconfig6.png
