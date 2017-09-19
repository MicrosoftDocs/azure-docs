---
title: Use the SharePoint Server Connector in your Logic Apps | Microsoft Docs
description: Get started using the the SharePoint Server Connector  in your Logic apps
services: logic-apps
documentationcenter: ''
author: MandiOhlinger
manager: anneta
editor: ''
tags: connectors

ms.assetid: 0238a060-d592-4719-b7a2-26064c437a1a
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 08/18/2016
ms.author: mandia; ladocs

---
# Get started with the SharePoint connector
The SharePoint Connector provides an way to work with Lists on SharePoint.

Get started by creating a logic app; see [Create a logic app](../logic-apps/logic-apps-create-a-logic-app.md).

## Create a connection to SharePoint
To use the SharePoint Connector , you first create a **connection** then provide the details for these properties: 

| Property | Required | Description |
| --- | --- | --- |
| Token |Yes |Provide SharePoint Credentials |

To connect to **SharePoint**, enter your identity (username and password, smart card credentials, etc.) to SharePoint. Once you've been authenticated, you can proceed to use the SharePoint connector  in your logic app. 

While on the designer of your logic app, follow these steps to sign into SharePoint to create the connection **connection** for use in your logic app:

1. Enter SharePoint in the search box and wait for the search to return all entries with SharePoint in the name:   
   ![Configure SharePoint][1]  
2. Select **SharePoint - When a file is created**   
3. Select **Sign in to SharePoint**:   
   ![Configure SharePoint][2]    
4. Provide your SharePoint credentials to sign in to authenticate with SharePoint   
   ![Configure SharePoint][3]     
5. After the authentication completes you'll be redirected to your logic app to complete it by configuring SharePoint's **When a file is created** dialog.          
   ![Configure SharePoint][4]  
6. You can then add other triggers and actions that you need to complete your logic app.   
7. Save your work by selecting **Save** on the menu bar above.  

## Connector-specific details

View any triggers and actions defined in the swagger, and also see any limits in the [connector details](/connectors/sharepoint/).

## More connectors
Go back to the [APIs list](apis-list.md).

[1]: ../../includes/media/connectors-create-api-sharepointonline/connectionconfig1.png  
[2]: ../../includes/media/connectors-create-api-sharepointonline/connectionconfig2.png 
[3]: ../../includes/media/connectors-create-api-sharepointonline/connectionconfig3.png
[4]: ../../includes/media/connectors-create-api-sharepointonline/connectionconfig4.png
[5]: ../../includes/media/connectors-create-api-sharepointonline/connectionconfig5.png
