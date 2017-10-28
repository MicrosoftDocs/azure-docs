---
title: Access data sources on premises for Azure Logic Apps | Microsoft Docs
description: Set up the on-premises data gateway so you can access data sources on premises from logic apps
keywords: access data, on premises, data transfer, encryption, data sources
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
ms.date: 06/9/2017
ms.author: LADocs; dimazaid; estfan

---
# Access data sources on premises from logic apps with the on-premises data gateway

To access data sources on premises from your logic apps, 
set up an on-premises data gateway that logic apps 
can use with supported connectors. 
The gateway acts as a bridge that provides quick data transfer 
and encryption between data sources on premises and your logic apps. 
The gateway relays data from on-premises sources 
on encrypted channels through the Azure Service Bus. 
All traffic originates as secure outbound traffic from the gateway agent. 
Learn more about [how the data gateway works](logic-apps-gateway-install.md#gateway-cloud-service). 

The gateway supports connections to these data sources on premises:

*   BizTalk Server
*   DB2  
*   File System
*   Informix
*   MQ
*   MySQL
*   Oracle Database
*   PostgreSQL
*   SAP Application Server 
*   SAP Message Server
*   SharePoint for HTTP only, not HTTPS
*   SQL Server
*   Teradata

These steps show how to set up the 
on-premises data gateway to work with your logic apps. 
For more information about supported connectors, see 
[Connectors for Azure Logic Apps](../connectors/apis-list.md). 

For more information about data gateways for other Microsoft services, see these articles:

*   [Azure Application Gateway](https://azure.microsoft.com/services/application-gateway/): [Application Gateway overview](../application-gateway/application-gateway-introduction.md)
*   [Microsoft Power BI on-premises data gateway](https://powerbi.microsoft.com/documentation/powerbi-gateway-onprem/)
*   [Azure Analysis Services on-premises data gateway](../analysis-services/analysis-services-gateway.md)
*   [Microsoft Flow on-premises data gateway](https://flow.microsoft.com/documentation/gateway-manage/)

## Requirements

* You must have already 
[installed the data gateway on a local computer](logic-apps-gateway-install.md).

* When you sign in to the Azure portal, you have to use the same 
work or school account that was used to [install the on-premises data gateway](logic-apps-gateway-install.md#requirements). Your sign-in account must also 
have an Azure subscription to use when you create a gateway 
resource in the Azure portal for your gateway installation.

* Your gateway installation can't already be claimed by an Azure gateway resource. 
You can associate your gateway installation to only one Azure gateway resource. 
Claim happens when you create the gateway resource so that the installation 
is unavailable for other resources.

## Set up the data gateway connection

### 1. Install the on-premises data gateway

If you haven't already, follow the 
[steps to install the on-premises data gateway](logic-apps-gateway-install.md). 
Before you continue with the other steps, 
make sure that you installed the data gateway on a local computer.

<a name="create-gateway-resource"></a>
### 2. Create an Azure resource for the on-premises data gateway

After you install the gateway on a local computer, 
you must create your data gateway as a resource in Azure. 
This step also associates your gateway resource with your Azure subscription.

1. Sign in to the [Azure portal](https://portal.azure.com "Azure portal"). 
Make sure to use the same Azure work or school email address used to install the gateway.

2. On the left menu in Azure, 
choose **New** > **Enterprise Integration** > **On-premises data gateway** as shown here:

   ![Find "On-premises data gateway"](./media/logic-apps-gateway-connection/find-on-premises-data-gateway.png)

3. On the **Create connection gateway** blade, 
provide these details to create your data gateway resource:

    * **Name**: Enter a name for your gateway resource. 

    * **Subscription**: Select the Azure subscription 
    to associate with your gateway resource. 
    This subscription should be the same subscription as your logic app.
   
      The default subscription is based on the 
      Azure account that you used to sign in.

    * **Resource group**: Create a resource group or select an existing 
    resource group for deploying your gateway resource. 
    Resource groups help you manage related Azure assets as a collection.

    * **Location**: Azure restricts this location to the same region that 
    was selected for the gateway cloud service during 
    [gateway installation](logic-apps-gateway-install.md). 

      > [!NOTE]
      > Make sure that the gateway resource location matches the gateway 
      > cloud service location. Otherwise, your gateway installation 
      > might not appear in the installed gateways list for you to select 
      > in the next step.
      > 
      > You can use different regions for your gateway 
      > resource and for your logic app.

    * **Installation Name**: If your gateway installation isn't already selected, 
    select the gateway that you previously installed. 

    To add the gateway resource to your Azure dashboard, choose **Pin to dashboard**. 
    When you're done, choose **Create**.

    For example:

    ![Provide details to create your on-premises data gateway](./media/logic-apps-gateway-connection/createblade.png)

    To find or view your data gateway at any time, 
    from the main Azure left menu, go to 
    **More Services** > **Enterprise Integration** > **On-premises Data Gateways**.

    ![Go to "More services", "Enterprise Integration", "On-premises Data Gateways"](./media/logic-apps-gateway-connection/find-on-premises-data-gateway-enterprise-integration.png)

<a name="connect-logic-app-gateway"></a>
### 3. Connect your logic app to the on-premises data gateway

Now that you've created your data gateway resource and associated your Azure subscription 
with that resource, create a connection between your logic app and the data gateway.

> [!NOTE]
> Your gateway connection location must exist in the 
> same region as your logic app, but you can 
> use a data gateway that exists in a different region.

1. In the Azure portal, create or open your logic app in Logic App Designer.

2. Add a connector that supports on-premises connections, like SQL Server.

3. Following the order shown, select **Connect via on-premises data gateway**, 
provide a unique connection name and the required information, 
and select the data gateway resource that you want to use. 
When you're done, choose **Create**.

   > [!TIP]
   > A unique connection name helps 
   > you easily identify that connection later, 
   > especially when you create multiple connections. 
   > If applicable, also include the qualified domain for your username. 

   ![Create connection between logic app and data gateway](./media/logic-apps-gateway-connection/blankconnection.png)

Congratulations, your gateway connection is now ready for your logic app to use.

## Edit your gateway connection settings

After you create a gateway connection for your logic app, 
you might want to later update the settings for that specific connection.

1. To find the gateway connection:

   * On the logic app blade, under **Development Tools**, select **API Connections**. 
   
     The **API Connections** pane shows all API connections 
     associated with your logic app, including gateway connections.

     ![Go to your logic app, select "API Connections"](./media/logic-apps-gateway-connection/logic-app-find-api-connections.png)

   * Or, from the main Azure left menu, go to 
    **More Services** > **Web & Mobile Services** > **API Connections** 
    for all API connections, including gateway connections, 
    that are associated with your Azure subscription. 

   * Or, on the main Azure left menu, go to **All resources** 
   for all API connections, including gateway connections, 
   that are associated with your Azure subscription.

2. Select the gateway connection that you want to view or edit, 
and choose **Edit API connection**.

   > [!TIP]
   > If your updates don't take effect, 
   > try [stopping and restarting the gateway Windows service](./logic-apps-gateway-install.md#restart-gateway).

<a name="change-delete-gateway-resource"></a>
## Switch or delete your on-premises data gateway resource

To create a different gateway resource, 
associate your gateway with a different resource, 
or remove the gateway resource, 
you can delete the gateway resource without 
affecting the gateway installation. 

1. From the main Azure left menu, go to **All resources**. 
2. Find and select your data gateway resource.
3. Choose **On-premises Data Gateway**, and on the resource toolbar, choose **Delete**.

<a name="faq"></a>
## Frequently asked questions

[!INCLUDE [existing-gateway-location-changed](../../includes/logic-apps-existing-gateway-location-changed.md)]

## Next steps

* [Secure your logic apps](./logic-apps-securing-a-logic-app.md)
* [Common examples and scenarios for logic apps](./logic-apps-examples-and-scenarios.md)
