---
title: Add artifacts to integration service environment
description: Add logic apps, integration accounts, and custom connectors to your integration service environment (ISE) to access Azure virtual networks (VNETs)
services: logic-apps
ms.suite: integration
ms.reviewer: klam, logicappspm
ms.topic: conceptual
ms.date: 01/08/2020
---

# Add artifacts to your integration service environment (ISE) in Azure Logic Apps

After you create an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md), add artifacts such as logic apps, integration accounts, and connectors so that they can access the resources in your Azure virtual network. For example, managed ISE connectors that become available after you create your ISE don't automatically appear in the Logic App Designer. Before you can use these ISE connectors, you have to manually [add and deploy those connectors to your ISE](#add-ise-connectors-environment) so that they appear in the Logic App Designer.

## Prerequisites

* An Azure subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* The ISE that you created to run your logic apps. If you don't have an ISE, [create an ISE first](../logic-apps/connect-virtual-network-vnet-isolated-environment.md).

<a name="create-logic-apps-environment"></a>

## Create logic apps

To build logic apps that run in your integration service environment (ISE), follow these steps:

1. Find and open your ISE, if not already open. From the ISE menu, under **Settings**, select **Logic apps** > **Add**.

   ![Add new logic app to ISE](./media/add-artifacts-integration-service-environment-ise/add-logic-app-to-ise.png)

   -or-

   From the main Azure menu, select **Create a resource** > **Integration** > **Logic App**.

1. Provide the name, Azure subscription, and Azure resource group (new or existing) to use for your logic app.

1. From the **Location** list, under the **Integration service environments** section, select your ISE, for example:

   ![Select integration service environment](./media/add-artifacts-integration-service-environment-ise/create-logic-app-with-integration-service-environment.png)

   > [!IMPORTANT]
   > If you want to use your logic apps with an integration account, 
   > those logic apps and the integration account must use the same ISE.

1. Continue [creating your logic app in the usual way](../logic-apps/quickstart-create-first-logic-app-workflow.md).

   For differences in how triggers and actions work and how they're labeled when you use an ISE compared to the global Logic Apps service, see [Isolated versus global in the ISE overview](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#difference).

1. To manage logic apps and API connections in your ISE, see [Manage your integration service environment](../logic-apps/ise-manage-integration-service-environment.md).

<a name="create-integration-account-environment"></a>

## Create integration accounts

Based on the [ISE SKU](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md#ise-level) selected at creation, your ISE includes specific integration account usage at no additional cost. Logic apps that exist in an integration service environment (ISE) can reference only integration accounts that exist in the same ISE. So, for an integration account to work with logic apps in an ISE, both the integration account and logic apps must use the *same environment* as their location. For more information about integration accounts and ISEs, see [Integration accounts with ISE](connect-virtual-network-vnet-isolated-environment-overview.md#create-integration-account-environment).

To create an integration account that uses an ISE, follow these steps:

1. Find and open your ISE, if not already open. From the ISE menu, under **Settings**, select **Integration accounts** > **Add**.

   ![Add new integration account to ISE](./media/add-artifacts-integration-service-environment-ise/add-integration-account-to-ise.png)

   -or-

   From the main Azure menu, select **Create a resource** > **Integration** > **Integration Account**.

1. Provide the name, Azure subscription, Azure resource group (new or existing), and pricing tier to use for your integration account.

1. From the **Location** list, under the **Integration service environments** section, select the same ISE that your logic apps use, for example:

   ![Select integration service environment](./media/add-artifacts-integration-service-environment-ise/create-integration-account-with-integration-service-environment.png)

1. [Link your logic app to your integration account in the usual way](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md#link-account).

1. Continue by adding artifacts to your integration account, such as [trading partners](../logic-apps/logic-apps-enterprise-integration-partners.md) and [agreements](../logic-apps/logic-apps-enterprise-integration-agreements.md).

1. To manage integration accounts in your ISE, see [Manage your integration service environment](../logic-apps/ise-manage-integration-service-environment.md).

<a name="add-ise-connectors-environment"></a>

## Add ISE connectors

Microsoft-managed connectors that become available after you create your ISE don't automatically appear in the connector picker on the Logic App Designer. Before you can use these ISE connectors, you have to manually add and deploy these connectors to your ISE so that they appear in the Logic App Designer.

1. On your ISE menu, under **Settings**, select **Managed connectors**. On the toolbar, select **Add**.

   ![View managed connectors](./media/add-artifacts-integration-service-environment-ise/ise-view-managed-connectors.png)

1. On the **Add a new managed connector** pane, open the **Find connector** list. Select the ISE connector that you want to use but isn't yet deployed in your ISE. Select **Create**.

   ![Select the ISE connector that you want to deploy in your ISE](./media/add-artifacts-integration-service-environment-ise/add-managed-connector.png)

   Only ISE connectors that are eligible but not yet deployed to your ISE appear available for you to select. Connectors that are already deployed in your ISE appear unavailable for selection.

<a name="create-custom-connectors-environment"></a>

## Create custom connectors

To use custom connectors in your ISE, create those custom connectors from directly inside your ISE.

1. Find and open your ISE, if not already open. From the ISE menu, under **Settings**, select **Custom connectors** > **Add**.

   ![Create custom connector](./media/add-artifacts-integration-service-environment-ise/add-custom-connector-to-ise.png)

1. Provide the name, Azure subscription, and Azure resource group (new or existing) to use for your custom connector.

1. From the **Location** list, under the **Integration service environments** section, select the same ISE that your logic apps use, and select **Create**, for example:

   ![Select integration service environment](./media/add-artifacts-integration-service-environment-ise/create-custom-connector-with-integration-service-environment.png)

1. Select your new custom connector, and then select **Edit**, for example:

   ![Select and edit custom connector](./media/add-artifacts-integration-service-environment-ise/edit-custom-connectors.png)

1. Continue by creating the connector in the usual way from an [OpenAPI definition](https://docs.microsoft.com/connectors/custom-connectors/define-openapi-definition#import-the-openapi-definition) or [SOAP](https://docs.microsoft.com/connectors/custom-connectors/create-register-logic-apps-soap-connector#2-define-your-connector).

1. To manage custom connectors in your ISE, see [Manage your integration service environment](../logic-apps/ise-manage-integration-service-environment.md).

## Next steps

* [Manage integration service environments](../logic-apps/ise-manage-integration-service-environment.md)
