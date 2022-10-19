---
title: Access data sources on premises
description: Connect to on-premises data sources from Azure Logic Apps by creating a data gateway resource in the Azure portal.
services: logic-apps
ms.suite: integration
ms.reviewer: arthii, azla
ms.topic: how-to
ms.date: 10/19/2021
#Customer intent: As a logic apps developer, I want to create a data gateway resource in the Azure portal so that my logic app workflow can connect to on-premises data sources.
---

# Connect to on-premises data sources from Azure Logic Apps

Before you can access on-premises data sources from your logic app workflows, you need to [install an on-premises data gateway on a local computer](../logic-apps/logic-apps-gateway-install.md). You also need to create a gateway resource in Azure for your gateway installation. You can then select this gateway resource in the triggers and actions that you want to use for the [on-premises connectors](../connectors/managed.md#on-premises-connectors) that are available in Azure Logic Apps. Logic Apps supports read and write operations through the data gateway. But these operations have [limits on their payload size](/data-integration/gateway/service-gateway-onprem#considerations).

This how-to guide shows how to create your Azure gateway resource for a previously [installed gateway on your local computer](../logic-apps/logic-apps-gateway-install.md). For more information about gateways, see [How the gateway works](../logic-apps/logic-apps-gateway-install.md#gateway-cloud-service).

> [!TIP]
> To directly access on-premises resources in Azure virtual networks without having to use a gateway, consider creating an [integration service environment](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) instead. 

For information about how to use a gateway with other services, see these articles:

* [Microsoft Power Automate on-premises data gateway](/power-automate/gateway-reference)
* [Microsoft Power BI on-premises data gateway](/power-bi/service-gateway-onprem)
* [Microsoft Power Apps on-premises data gateway](/powerapps/maker/canvas-apps/gateway-reference)
* [Azure Analysis Services on-premises data gateway](../analysis-services/analysis-services-gateway.md)

## Supported data sources

In Logic Apps, an on-premises data gateway supports the [on-premises connectors](../connectors/managed.md#on-premises-connectors) for these data sources:

* [Apache Impala](/connectors/impala)
* [BizTalk Server](/connectors/biztalk)
* [File System](/connectors/filesystem)
* [HTTP with Azure AD](/connectors/webcontents)
* [IBM DB2](/connectors/db2)
* [IBM Informix](/connectors/informix)
* [IBM MQ](/connectors/mq)
* [MySQL](/connectors/mysql)
* [Oracle Database](/connectors/oracle)
* [PostgreSQL](/connectors/postgresql)
* [SAP](/connectors/sap)
* [SharePoint Server](/connectors/sharepointonline)
* [SQL Server](/connectors/sql)
* [Teradata](/connectors/teradata)

You can also create [custom connectors](../logic-apps/custom-connector-overview.md) that connect to data sources over HTTP or HTTPS by using REST or SOAP. Although a gateway itself doesn't incur extra costs, the [Logic Apps pricing model](../logic-apps/logic-apps-pricing.md) applies to these connectors and other operations in Logic Apps.

## Prerequisites

* You already [installed an on-premises data gateway on a local computer](../logic-apps/logic-apps-gateway-install.md). This gateway installation must exist before you can create a gateway resource that links to this installation.

* You have the [same Azure account and subscription](../logic-apps/logic-apps-gateway-install.md#requirements) that you used for your gateway installation. This Azure account must belong only to a single [Azure Active Directory (Azure AD) tenant or directory](../active-directory/fundamentals/active-directory-whatis.md#terminology). You have to use the same Azure account and subscription to create your gateway resource in Azure because only the gateway administrator can create the gateway resource in Azure. Service principals currently aren't supported.

  * When you create a gateway resource in Azure, you select a gateway installation to link with your gateway resource and only that gateway resource. Each gateway resource can link to only one gateway installation. You can't select a gateway installation that's already associated with another gateway resource.

  * Your logic app resource and gateway resource don't have to exist in the same Azure subscription. In triggers and actions where you use the gateway resource, you can select a different Azure subscription that has a gateway resource, but only if that subscription exists in the same Azure AD tenant or directory as your logic app resource. You also have to have administrator permissions on the gateway, which another administrator can set up for you. For more information, see [Data Gateway: Automation using PowerShell - Part 1](https://community.powerbi.com/t5/Community-Blog/Data-Gateway-Automation-using-PowerShell-Part-1/ba-p/1117330) and [PowerShell: Data Gateway - Add-DataGatewayClusterUser](/powershell/module/datagateway/add-datagatewayclusteruser).

    > [!NOTE]
    > Currently, you can't share a gateway resource or installation across multiple subscriptions. 
    > To submit product feedback, see [Microsoft Azure Feedback Forum](https://feedback.azure.com/d365community/forum/79b1327d-d925-ec11-b6e6-000d3a4f06a4).

## Create Azure gateway resource

After you install a gateway on a local computer, create the Azure resource for your gateway.

1. Sign in to the [Azure portal](https://portal.azure.com) with the same Azure account that you used to install the gateway.

1. In the Azure portal search box, enter **on-premises data gateway**, and then select **On-premises data gateways**.

   :::image type="content" source="./media/logic-apps-gateway-connection/search-for-on-premises-data-gateway.png" alt-text="Screenshot of the Azure portal. In the search box, 'on-premises data gateway' is selected. In the results, 'On-premises data gateways' is selected.":::

1. Under **On-premises data gateways**, select **Create**.

   :::image type="content" source="./media/logic-apps-gateway-connection/add-azure-data-gateway-resource.png" alt-text="Screenshot of the Azure portal. On the 'On-premises data gateways page,' the 'Create' button is selected.":::

1. Under **Create a gateway**, provide this information for your gateway resource. When you're done, select **Review + create**.

   | Property | Description |
   |----------|-------------|
   | **Subscription** | Select the Azure subscription for the Azure account that you used for the gateway installation. The default subscription is based on the Azure account that you used to sign in. |
   | **Resource group** | Select the [Azure resource group](../azure-resource-manager/management/overview.md) that you want to use. |
   | **Name** | Enter a name for your gateway resource that contains only letters, numbers, hyphens (`-`), underscores (`_`), parentheses (`(`, `)`), or periods (`.`). |
   | **Region** | Select the same region or location that you selected for the gateway cloud service during [gateway installation](../logic-apps/logic-apps-gateway-install.md). Otherwise, your gateway installation doesn't appear in the **Installation Name** list. Your logic app resource location can differ from your gateway resource location. |
   | **Installation Name** | Select a gateway installation, which appears in the list only when these conditions are met: <p><p>- The gateway installation uses the same region as the gateway resource that you want to create. <br>- The gateway installation isn't linked to another Azure gateway resource. <br>- The gateway installation is linked to the same Azure account that you're using to create the gateway resource. <br>- Your Azure account belongs to a single [Azure AD tenant or directory](../active-directory/fundamentals/active-directory-whatis.md#terminology) and is the same account that you used for the gateway installation. <p><p>For more information, see [Frequently asked questions](#frequently-asked-questions). |
   |||

   Here's an example that shows a gateway installation that's in the same region as your gateway resource and is linked to the same Azure account:

   :::image type="content" source="./media/logic-apps-gateway-connection/on-premises-data-gateway-create-connection.png" alt-text="Screenshot of the Azure portal 'Create a gateway' page. The 'Name,' 'Region,' and other boxes have values. The 'Review + create' button is selected.":::

1. On the validation page that appears, confirm all the information that you provided, and then select **Create**.

## Connect to on-premises data

After you create your gateway resource and associate your Azure subscription with this resource, you can create a connection between your logic app workflow and your on-premises data source by using the gateway.

1. In the Azure portal, create or open your logic app resource.

1. On the logic app navigation menu, select **Logic app designer**.

1. Add a connector that supports on-premises connections. If this connector has a [managed version](../connectors/managed.md#on-premises-connectors) and a [built-in version](../connectors/built-in.md), use the managed version.

1. In the connector details, provide the following information:

   - If there's an option for connecting via an on-premises data gateway, select that option.

   - Under **Gateway**, from the **Subscription** list, select the Azure subscription that has your gateway resource.

     Your logic app resource and gateway resource don't have to exist in the same Azure subscription. You can select from other Azure subscriptions that each have a gateway resource, but only if:

     - These subscriptions exist in the same Azure AD tenant or directory as your logic app resource.
     - You have administrator permissions on the gateway, which another administrator can set up for you.
     
     For more information, see [Data Gateway: Automation using PowerShell - Part 1](https://community.powerbi.com/t5/Community-Blog/Data-Gateway-Automation-using-PowerShell-Part-1/ba-p/1117330) and [PowerShell: Data Gateway - Add-DataGatewayClusterUser](/powershell/module/datagateway/add-datagatewayclusteruser).
  
   - From the **Connection Gateway** list, select the gateway resource that you want to use. This list shows the available gateway resources in your selected subscription. Each gateway resource is linked to a single gateway installation.

     > [!NOTE]
     > The **Connection Gateway** list includes gateway resources in other regions because your logic app resource's location can differ from your gateway resource's location. 

   - Provide a unique connection name and other required information, which depends on the connection that you want to create.

     A unique connection name helps you easily find your connection later, especially if you create multiple connections. If applicable, also include the qualified domain for your username.

   :::image type="content" source="./media/logic-apps-gateway-connection/logic-app-gateway-connection.png" alt-text="Screenshot of a SQL Server connector. The 'Subscription,' 'Connection Gateway,' 'Connection name,' and other boxes have values.":::

1. When you're done, select **Create**.

Your gateway connection is now ready for your logic app workflow to use.

## Edit connection

To update the settings for a gateway connection, you can edit your connection.

1. To find all the API connections for your logic app resource, on your logic app's menu, under **Development Tools**, select **API connections**.

   :::image type="content" source="./media/logic-apps-gateway-connection/logic-app-api-connections.png" alt-text="Screenshot of a logic app resource in the Azure portal. On the logic app navigation menu, 'API connections' is highlighted.":::

1. Select the gateway connection that you want to edit, and then select **Edit API connection**.

   > [!TIP]
   > If your updates don't take effect, try 
   > [stopping and restarting the gateway Windows service account](../logic-apps/logic-apps-gateway-install.md#restart-gateway) for your gateway installation.

To find all API connections associated with your Azure subscription, use one of these options:

* In the Azure search box, enter **api connections**, and then select **API Connections**.
* From the Azure portal menu, select **All resources**. Set the **Type** filter to **API Connection**.

## Delete gateway resource

To create a different gateway resource, link your gateway installation to a different gateway resource, or remove the gateway resource, you can delete the gateway resource without affecting the gateway installation.

1. In the Azure portal, open your gateway resource.

1. On the gateway resource toolbar, select **Delete**.

   :::image type="content" source="./media/logic-apps-gateway-connection/delete-on-premises-data-gateway.png" alt-text="Screenshot of an on-premises data gateway resource in the Azure portal. On the toolbar, 'Delete' is highlighted.":::

## Frequently asked questions

**Q**: Why doesn't my gateway installation appear when I create my gateway resource in Azure? <br/>
**A**: This issue can happen for these reasons:

* Your Azure account isn't the same account that you used for the gateway installation on your local computer. Check that you signed in to the Azure portal with the same identity that you used for the gateway installation. Only the gateway administrator can create the gateway resource in Azure. Service principals currently aren't supported.

* Your Azure account doesn't belong to only a single [Azure AD tenant or directory](../active-directory/fundamentals/active-directory-whatis.md#terminology). Check that you're using the same Azure AD tenant or directory that you used during gateway installation.

* Your gateway resource and gateway installation don't exist in the same region. Make sure that your gateway installation uses the same region where you want to create the gateway resource in Azure. However, your logic app resource's location can differ from your gateway resource location.

* Your gateway installation is already associated with another gateway resource. Each gateway resource can link to only one gateway installation, which can link to only one Azure account and subscription. So, you can't select a gateway installation that's already associated with another gateway resource. These installations don't appear in the **Installation Name** list.

  To review your gateway registrations in the Azure portal, find all your Azure resources that have the **On-premises data gateway** resource type across *all* your Azure subscriptions. To unlink a gateway installation from a different gateway resource, see [Delete gateway resource](#delete-gateway-resource).

[!INCLUDE [existing-gateway-location-changed](../../includes/logic-apps-existing-gateway-location-changed.md)]

## Next steps

* [Secure your logic apps](./logic-apps-securing-a-logic-app.md)
* [Common examples and scenarios for logic apps](./logic-apps-examples-and-scenarios.md)
