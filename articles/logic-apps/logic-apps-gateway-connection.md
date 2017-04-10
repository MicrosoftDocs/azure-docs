---
title: Access on-premises data from Azure Logic Apps | Microsoft Docs
description: Connect to and access on-premises data from logic apps through the on-premises data gateway
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
ms.date: 04/21/2017
ms.author: jehollan; LADocs

---
# Connect to on-premises data from logic apps

To access data in an on-premises system, you can set up a data gateway 
connection that logic apps can use through supported connectors. 
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

These steps walk you through how to install and set up the 
on-premises data gateway to work with your logic apps. 
For more information about these connectors, see 
[Connectors for Azure Logic Apps](../connectors/apis-list.md).

## Requirements

* You must have already 
[installed the data gateway on an on-premises machine](logic-apps-gateway-install.md).

* You need the Azure account that has the work or school email address used 
to [install the on-premises data gateway](logic-apps-gateway-install.md#requirements).

* Your gateway installation can't be already claimed by another Azure gateway resource. 
You can associate your gateway installation only to one gateway resource. 
Claim happens when you create the gateway resource.

## Install and set up the data gateway connection

### 1. Install the on-premises data gateway

If you haven't already, follow the 
[steps to install the on-premises data gateway](logic-apps-gateway-install.md). 
Before you continue with the other steps, 
make sure that you installed the data gateway on an on-premises machine.

### 2. Create an Azure resource for the on-premises data gateway

After you install the gateway on an on-premises machine, 
you must create an Azure resource for the data gateway 
and associate your gateway installation with that resource. 
This step also associates your installation with your Azure subscription.

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal") 
with the same work or school email address used for installing the gateway.

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
   where you want to create your resource.

     > [!NOTE] 
     > You can choose a region that differs from your logic app. Previously, 
     > your gateway resource and logic app had to exist in 
     > the same region. Otherwise, your logic app couldn't access the gateway.

   * **Installation Name**: Select the same on-premises 
   data gateway that you installed earlier.

   To add the gateway connection to your Azure dashboard, choose **Pin to dashboard**. 
   When you're done, choose **Create**.

   For example:

   ![Provide details to create your on-premises data gateway](./media/logic-apps-gateway-connection/createblade.png)

### 3. Create a connection between your logic app and the data gateway

Now that you've associated your Azure subscription with an instance of the on-premises data gateway, 
create a connection between your logic and the data gateway instance.

1. In the Azure portal, open your logic app in Logic App Designer. 
2. Add a connector that supports on-premises connections, like SQL Server.
3. Following the order shown, select **Connect via on-premises data gateway**, 
provide a unique connection name and the required information, 
then select the on-premises gateway that you want to connect. 
When you're done, choose **Create**.

   > ![TIP]
   > A unique gateway connection name helps 
   > you easily identify that connection later, 
   > especially if you create more multiple connections. 
   > If applicable, also include the domain for your username.

   ![Create data gateway connection from a logic app](./media/logic-apps-gateway-connection/blankconnection.png)

Congratulations, your data gateway connection is now ready for your logic app to use.

## Edit your on-premises data gateway connection settings

After you add the data gateway connection to your logic app, 
you might have to update the settings for that connection. 

1. To find the data gateway connection:

   * On the logic app blade, under **Development Tools**, select **API Connections**. 
   
     The **API Connections** pane shows all the API Connections associated with your logic app, 
     including your data gateway connection. To view and edit that connection's settings, 
     select that connection.

     ![Go to your logic app, select "API Connections"](./media/logic-apps-gateway-connection/logic-app-find-api-connections.png)

   * Or, from the main Azure left menu, go to 
   **More Services** > **Enterprise Integration** > **On-premises Data Gateways**.

      ![Go to "More services", "On-premises Data Gateways"](./media/logic-apps-gateway-connection/find-on-premises-data-gateway-enterprise-integration.png)

2. Update the connection settings that you want.

   > ![TIP]
   > If your updates don't take effect, 
   > try [stopping and restarting the gateway Windows service](./logic-apps-gateway-install.md#restart-gateway).

## Change or delete your data gateway resource

To create a different gateway resource, 
associate your gateway with a different resource, 
or remove the gateway resource altogether, 
you can delete the gateway resource without 
affecting your on-premises data gateway installation. 

1. From the main Azure left menu, go to **All resources**. 
2. Find and select your data gateway resource.
3. Choose **Overview**, and on the resource toolbar, choose **Delete**.

## Next steps

* [Secure your logic apps](./logic-apps-securing-a-logic-app.md)
* [Common examples and scenarios for logic apps](./logic-apps-examples-and-scenarios.md)
