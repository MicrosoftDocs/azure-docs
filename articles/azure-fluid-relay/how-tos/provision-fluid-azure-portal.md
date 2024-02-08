---
title: 'How to: Provision an Azure Fluid Relay service'
description: How to provision an Azure Fluid Relay service using the Azure portal
ms.date: 01/18/2023
ms.topic: article
ms.service: azure-fluid
ms.custom: references_regions
---

# How to: Provision an Azure Fluid Relay service

Before you can connect your app to an Azure Fluid Relay, you must provision an Azure Fluid Relay server resource in your Azure account. This article walks through the steps to get your Azure Fluid Relay service provisioned and ready to use. 

## Prerequisites

To create an Azure Fluid Relay resource, you must have an Azure account. If you don't have an account, you can [try Azure for free](https://azure.com/free).

## Create a resource group
A resource group is a logical collection of Azure resources. All resources are deployed and managed in a resource group. To create a resource group:

1. Sign in to the [Azure portal](https://portal.azure.com/).
2. In the left navigation, select **Resource groups**. Then select **Add**.

    :::image type="content" source="../images/add-resource-group.png" alt-text="A screenshot of the Resource Groups page on the Azure portal.":::

3. For Subscription, select the name of the Azure subscription in which you want to create the [resource group](../../azure-resource-manager/management/manage-resource-groups-portal.md#what-is-a-resource-group). For more information about subscriptions, see [Describe core Azure architectural components](/training/modules/azure-architecture-fundamentals).

    :::image type="content" source="../images/create-resource-group.png" alt-text="A screenshot of the Create Resource Group page on the Azure portal.":::

1. Type a unique name for the resource group. The system immediately checks to see if the name is available in the currently selected Azure subscription.
1. Select a region for the resource group.
1. Select **Review + Create**.
1. On the Review + Create page, select **Create**.

## Create a Fluid Relay resource
Each Azure Fluid Relay server resource provides a tenant for you to use in your Fluid application. Within that tenant, you can create many containers/sessions. To create a Fluid Relay in your resource group using the portal:

1. In the Azure portal, and select **Create a resource** at the top left of the screen.
2. Search for 'Fluid'
 
    :::image type="content" source="../images/marketplace-fluid-relay.png" alt-text="A screenshot of the Create Resource page with search results for the term 'Fluid'.":::

3. Select **Fluid Relay**, and select **Create**.
 
    :::image type="content" source="../images/fluid-relay-details-page.png" alt-text="A screenshot of the Azure Fluid Relay marketplace details page.":::

4. On the Create page, take the following steps:

    :::image type="content" source="../images/create-fluid-relay-server.png" alt-text="A screenshot of how to configure a new Azure Fluid Relay server.":::

    1. Select the subscription in which you want to create the namespace.
    2. Select the resource group you created in the previous step.
    3. Enter a name for the Fluid Relay resource.
    4. Select a location for the namespace.

5. Click the **Review + Create** button at the bottom of the page.

6. On the Review + Create page, review the settings, and select *Create*. Wait for the deployment to complete.

    :::image type="content" source="../images/create-server-validation-complete.png" alt-text="A screenshot of the new service page after validation has completed successfully.":::

7. On the Deployment page, select **Go to resource** to navigate to the page for your namespace.

    :::image type="content" source="../images/deployment-complete.png" alt-text="A screenshot of the Azure portal indicating that deployment is complete.":::

8. Confirm that you see the Fluid Relay page similar to this example.

    :::image type="content" source="../images/resource-details.png" alt-text="A screenshot of an example details page for a deployed Fluid Relay resource.":::

## Next steps
You just created a resource group and a provisioned an Azure Fluid Relay resource in that group. Next, you can [connect to your Azure Fluid Relay service in your app](../how-tos/connect-fluid-azure-service.md).
