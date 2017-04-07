---
title: Access on-premises data - Azure Logic Apps | Microsoft Docs
description: How your logic apps can access on-premises data through the on-premises data gateway
services: logic-apps
author: jeffhollan
manager: anneta
editor: ''
documentationcenter: ''

ms.assetid: 6cb4449d-e6b8-4c35-9862-15110ae73e6a
ms.service: logic-apps
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: integration
ms.date: 07/05/2016
ms.author: jehollan; LADocs

---
# Connect to on-premises data from logic apps

To access data in an on-premises system, you can set up a connection to an 
on-premises data gateway for supported Azure Logic Apps connectors. 
These steps walk you through how to install and set up the 
on-premises data gateway to work with your logic apps. 
The on-premises data gateway supports these connections:

*   BizTalk Server
*   DB2  
*   File System
*   Informix
*   MQ
*   MySQL
*   Oracle Database 
*   SAP Application Server 
*   SAP Message Server
*   SharePoint for HTTP only, not HTTPS
*   SQL Server
*   Teradata

For more information about these connections, see 
[Connectors for Azure Logic Apps](../connectors/apis-list.md).

## Requirements

* You must have an Azure work or school email address and Azure subscription 
to associate the on-premises data gateway with your Azure Active Directory-based account.

* If you are using a Microsoft account, like @outlook.com, you can use your Azure account to 
[create a work or school email address](../virtual-machines/windows/create-aad-work-id.md#locate-your-default-directory-in-the-azure-classic-portal).

* You must have already [installed the on-premises data gateway on a local machine](logic-apps-gateway-install.md).

* You can associate your installation to one gateway resource only. 
Your gateway can't be claimed by another Azure on-premises data gateway. 
Claim happens at ([creation during Step 2 in this topic](#2-create-an-azure-on-premises-data-gateway-resource)).

## Install and configure the connection

### 1. Install the on-premises data gateway

If you haven't already, follow these steps to 
[install the on-premises data gateway](logic-apps-gateway-install.md). 
Before you can continue with the other steps, 
make sure that you installed the data gateway on an on-premises machine.

### 2. Create an Azure on-premises data gateway resource

After you install the gateway, you must associate the gateway with your Azure subscription.

> [!NOTE] 
> You can create your Azure gateway resource and deploy 
> in a different region than your logic app. Previously, 
> your gateway resource and logic app were required 
> to exist in the same region. Otherwise, 
> your logic app couldn't access the gateway.

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal") 
with the same work or school email address that you used to install the gateway.

2. On the left menu in Azure, 
choose **New** > **Enterprise Integration** > **On-premises data gateway**. 

3. On the **Create connection gateway** pane, 
provide these details about your data gateway connection:

   * **Name**: Enter a name for your data gateway connection. 
   * **Subscription**: Select the Azure subscription 
   that you want to associate with your data gateway connection.
   * **Resource Group**: Create a resource group 
   or select an existing resource group for managing 
   related Azure resources as a collection.
   * **Location**: Select the Azure datacenter region 
   for you want to deploy your data gateway.
   * **Installation Name**: Select the data gateway 
   that you already installed.

4. To add gateway connection to your Azure dashboard, choose **Pin to dashboard**. 
When you're done, choose **Create**.

   For example:
   
	![Provide details to create your on-premises data gateway](./media/logic-apps-gateway-connection/createblade.png)

### 3. Create a logic app connection in Logic App Designer

Now that your Azure subscription is associated with an instance of the on-premises data gateway, 
you can create a connection to the gateway from your logic app.

1. Open a logic app and choose a connector that supports on-premises connectivity, like SQL Server.
2. Select **Connect via on-premises data gateway**.
   
    ![Logic App Designer Gateway Creation][2]

3. Select the **Gateway** that you want to connect, and complete any other required connection information.
4. To create the connection, choose **Create**.

Your connection is now configured for your logic app to use.

## Edit your data gateway connection settings

After you add the data gateway connection to your logic app, 
you might have to make changes so you can adjust settings specific to that connection. 
You can find the connection in either of two places:

* On the logic app blade, under **Development Tools**, select **API Connections**. 
This list shows you all API Connections associated with your logic app, 
including your data gateway connection. To view and modify that connection's settings, 
select that connection.

* On the API Connections main blade, you can find all API Connections 
associated with your Azure subscription, including your data gateway connection. 
To view and modify the connection settings, select that connection.

## Next Steps

* [Common examples and scenarios for logic apps](../logic-apps/logic-apps-examples-and-scenarios.md)
* [Enterprise integration features](../logic-apps/logic-apps-enterprise-integration-overview.md)

<!-- Image references -->
[1]: 
[2]: ./media/logic-apps-gateway-connection/blankconnection.png
[3]: ./media/logic-apps-logic-gateway-connection/checkbox.png
