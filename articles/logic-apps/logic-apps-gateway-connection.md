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

## Install and set up the data gateway connection

### 1. Install the on-premises data gateway

If you haven't already, follow these steps to 
[install the on-premises data gateway](logic-apps-gateway-install.md). 
Before you can continue with the other steps, 
make sure that you installed the data gateway on an on-premises machine.

### 2. Create an Azure resource for the on-premises data gateway

After you install the gateway, you must associate the gateway with your Azure subscription 
and create an Azure resource for the data gateway.

> [!NOTE] 
> You can create and deploy the Azure gateway resource 
> in a different datacenter region than your logic app. Previously, 
> your gateway resource and logic app had to exist in 
> the same region. Otherwise, your logic app couldn't access the gateway.

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal") 
with the same work or school email address that you used to install the gateway.

2. On the left menu in Azure, 
choose **New** > **Enterprise Integration** > **On-premises data gateway** as shown here:

   ![Find "On-premises data gateway"](./media/logic-apps-gateway-connection/find-on-premises-data-gateway.png)

3. On the **Create connection gateway** pane, 
provide these details about your data gateway connection:

   * **Name**: Enter a name for your data gateway connection. 
   * **Subscription**: Select the Azure subscription 
   that you want to associate with your data gateway connection.
   * **Resource Group**: Create a resource group 
   or select an existing resource group for managing 
   related Azure resources as a collection.
   * **Location**: Select the Azure datacenter region 
   for deployment.
   * **Installation Name**: Select the data gateway 
   that you already installed.

   Then, to add gateway connection to your Azure dashboard, choose **Pin to dashboard**. 
   When you're done, choose **Create**.

   For example:
   
	![Provide details to create your on-premises data gateway](./media/logic-apps-gateway-connection/createblade.png)

### 3. Create a connection between your logic app and the data gateway

Now that you've associated your Azure subscription with an instance of the on-premises data gateway, 
create a connection between your logic and the data gateway instance.

1. In the Azure portal, open your logic app in Logic App Designer. 
2. Add a connector that supports on-premises connections, like SQL Server.
3. As shown, select **Connect via on-premises data gateway**. 
Provide the required connection information, 
and select the gateway that you want to connect.
When you're done, choose **Create**.

   ![Create data gateway connection from a logic app](./media/logic-apps-gateway-connection/blankconnection.png)

Now your data gateway connection is set up for your logic app to use.

## Edit your on-premises data gateway connection settings

After you add the data gateway connection to your logic app, 
you might have to adjust the settings for that connection.

**To find the data gateway connection**

* On the logic app blade, under **Development Tools**, select **API Connections**. 

   The **API Connections** pane shows all the API Connections associated with your logic app, 
   including your data gateway connection. To view and edit that connection's settings, 
   select that connection.

   ![Go to your logic app, select "API Connections"](./media/logic-apps-gateway-connection/logic-app-find-api-connections.png)

* Or, from the main Azure left menu, go to 
**More Services** > **Enterprise Integration** > **On-premises Data Gateways**.

   ![Go to "More services", "On-premises Data Gateways"](./media/logic-apps-gateway-connection/find-on-premises-data-gateway-enterprise-integration.png)

## Delete your on-premises data gateway resource

When you don't need your data gateway resource anymore, you can delete that resource.

1. From the main Azure left menu, go to **All resources**. 
2. Find and select your data gateway resource.
3. Choose **Overview**, and on the resource toolbar, choose **Delete**.

## Next steps

* [Secure your logic apps](./logic-apps-securing-a-logic-app.md)
* [Common examples and scenarios for logic apps](./logic-apps-examples-and-scenarios.md)
