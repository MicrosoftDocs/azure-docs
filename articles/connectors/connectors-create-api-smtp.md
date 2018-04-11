---
title: SMTP connector in Azure Logic Apps | Microsoft Docs
description: Create logic apps with Azure App service. Connect to SMTP to send email.
services: logic-apps
documentationcenter: .net,nodejs,java
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: d4141c08-88d7-4e59-a757-c06d0dc74300
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 07/15/2016
ms.author: mandia; ladocs

---
# Get started with the SMTP connector
Connect to SMTP to send email.

To use [any connector](apis-list.md), you first need to create a logic app. You can get started by [creating a logic app now](../logic-apps/logic-apps-create-a-logic-app.md).

## Connect to SMTP
Before your logic app can access any service, you first need to create a *connection* to the service. A [connection](connectors-overview.md) provides connectivity between a logic app and another service. For example, to connect to SMTP, you first need an SMTP *connection*. To create a connection, enter the credentials you normally use to access the service you connect to. So, in the SMTP example, enter the credentials to your connection name, SMTP server address, and user login information to create the connection to SMTP.  

### Create a connection to SMTP
> [!INCLUDE [Steps to create a connection to SMTP](../../includes/connectors-create-api-smtp.md)]
> 
> 

## Use an SMTP trigger
A trigger is an event that can be used to start the workflow defined in a logic app. [Learn more about triggers](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).

In this example, because SMTP does not have a trigger of its own, we'll use the **Salesforce - When an object is created** trigger. This trigger activates when a new object is created in Salesforce. For our example, we'll set it up such that every time a new lead is created in Salesforce, a *send email* action occurs via the SMTP connector with a notification of the new lead being created.

1. Enter *salesforce* in the search box on the logic apps designer then select the **Salesforce - When an object is created** trigger.  
   ![](../../includes/media/connectors-create-api-salesforce/trigger-1.png)  
2. The **When an object is created** control is displayed.
   ![](../../includes/media/connectors-create-api-salesforce/trigger-2.png)  
3. Select the **Object Type** then select *Lead* from the list of objects. In this step you are indicating that you are creating a trigger that will notify your logic app whenever a new lead is created in Salesforce.  
   ![](../../includes/media/connectors-create-api-salesforce/trigger3.png)  
4. The trigger has been created.  
   ![](../../includes/media/connectors-create-api-salesforce/trigger-4.png)  

## Use an SMTP action
An action is an operation carried out by the workflow defined in a logic app. [Learn more about actions](../logic-apps/logic-apps-what-are-logic-apps.md#logic-app-concepts).

Now that the trigger has been added, follow these steps to add an SMTP action that will occur when a new lead is created in Salesforce.

1. Select **+ New Step** to add the action you would like to take when a new lead is created.  
   ![](../../includes/media/connectors-create-api-salesforce/trigger4.png)  
2. Select **Add an action**. This opens the search box where you can search for any action you would like to take.  
   ![](../../includes/media/connectors-create-api-smtp/using-smtp-action-2.png)  
3. Enter *smtp* to search for actions related to SMTP.  
4. Select **SMTP - Send Email** as the action to take when the new lead is created. The action control block opens. You will have to establish your smtp connection in the designer block if you have not done so previously.  
   ![](../../includes/media/connectors-create-api-smtp/smtp-2.png)    
5. Input your desired email information in the **SMTP - Send Email** block.  
   ![](../../includes/media/connectors-create-api-smtp/using-smtp-action-4.PNG)  
6. Save your work in order to activate your workflow.  

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/smtpconnector/).

## More connectors
Go back to the [APIs list](apis-list.md).