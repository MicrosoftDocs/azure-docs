---
title: Access on-premises data - Azure Logic Apps | Microsoft Docs
description: How your logic apps can access on-premises data by connecting to an on-premises data gateway.
services: logic-apps
documentationcenter: .net,nodejs,java
author: jeffhollan
manager: anneta
editor: ''

ms.assetid: 6cb4449d-e6b8-4c35-9862-15110ae73e6a
ms.service: logic-apps
ms.devlang: multiple
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 07/05/2016
ms.author: jehollan

---
# Connect to on-premises data from logic apps

To access on-premises data, you can set up a connection to an 
on-premises data gateway for supported Azure Logic Apps connectors. 
The following steps walk you through how to install and set up the 
on-premises data gateway to work with your logic apps.

## Prerequisites

* You must have a work or school email address in Azure to associate the 
on-premises data gateway with your account (Azure Active Directory based account).
* If you are using a Microsoft account, like @outlook.com, you can use your Azure account to 
[create a work or school email address](../virtual-machines/virtual-machines-windows-create-aad-work-id.md#locate-your-default-directory-in-the-azure-classic-portal).
* You must have [installed the on-premises data gateway on a local machine](logic-apps-gateway-install.md).
* You can associate your installation to one gateway resource only. 
Your gateway can't be claimed by another Azure on-premises data gateway. 
Claim happens at ([creation during Step 2 in this topic](#2-create-an-azure-on-premises-data-gateway-resource)).

## Install and configure the connection

### 1. Install the on-premises data gateway

To install the on-premises data gateway, see [Install the on-premises gate](logic-apps-gateway-install.md). 
Before you can continue with the other steps, you must first install the gateway on an on-premises machine.

### 2. Create an Azure on-premises data gateway resource

After you install the gateway, you must associate your Azure subscription with the gateway.

1. Sign in to Azure using the same work or school email address that you used during gateway installation.
2. Choose **New**.
3. Find and select the **On-premises data gateway**.
4. To associate the gateway with your account, complete the information, 
including selecting the appropriate **Installation Name**.
   
	![On-Premises Data Gateway Connection][1]

5. To create the resource, choose **Create**.

### 3. Create a logic app connection in Logic App Designer

Now that your Azure subscription is associated with an instance of the on-premises data gateway, 
you can create a connection to the gateway from your logic app.

1. Open a logic app and choose a connector that supports on-premises connectivity, like SQL Server.
2. Select **Connect via on-premises data gateway**.
   
    ![Logic App Designer Gateway Creation][2]

3. Select the **Gateway** that you want to connect, and complete any other required connection information.
4. To create the connection, choose **Create**.

Your connection is now configured for your logic app to use.

## Next Steps

* [Common examples and scenarios for logic apps](../logic-apps/logic-apps-examples-and-scenarios.md)
* [Enterprise integration features](../logic-apps/logic-apps-enterprise-integration-overview.md)

<!-- Image references -->
[1]: ./media/logic-apps-gateway-connection/createblade.png
[2]: ./media/logic-apps-gateway-connection/blankconnection.png
[3]: ./media/logic-apps-logic-gateway-connection/checkbox.png
