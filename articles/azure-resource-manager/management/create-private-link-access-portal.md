---
title: Create private link for managing resources - Azure portal
description: Use Azure portal to create private link for managing resources.
ms.topic: conceptual
ms.date: 03/19/2024
---

# Use portal to create private link for managing Azure resources

This article explains how you can use [Azure Private Link](../../private-link/index.yml) to restrict access for managing resources in your subscriptions. It shows using the Azure portal for setting up management of resources through private access.

[!INCLUDE [Create content](../../../includes/resource-manager-create-rmpl.md)]

## Create resource management private link

When you create a resource management private link, the private link association is automatically created for you.

1. In the [portal](https://portal.azure.com), search for **Resource management private links** and select it from the available options.

   :::image type="content" source="./media/create-private-link-access-portal/search.png" alt-text="Screenshot of Azure portal search bar with 'Resource management' entered.":::

1. If your subscription doesn't already have resource management private links, you'll see a blank page. Select **Create resource management private link**.

   :::image type="content" source="./media/create-private-link-access-portal/start-create.png" alt-text="Screenshot of Azure portal showing the 'Create resource management private link' button.":::

1. Provide values for the new resource management private link. The root management group for the directory you selected is used for the new resource. Select **Review + create**.

   :::image type="content" source="./media/create-private-link-access-portal/provide-values.png" alt-text="Screenshot of Azure portal with fields to provide values for the new resource management private link.":::

1. After validation passes, select **Create**.

## Create private endpoint

Now, create a private endpoint that references the resource management private link.

1. Navigate to the **Private Link Center**. Select **Create private endpoint**.

   :::image type="content" source="./media/create-private-link-access-portal/private-link-center.png" alt-text="Screenshot of Azure portal's Private Link Center with 'Create private endpoint' highlighted.":::

1. In the **Basics** tab, provide values for your private endpoint.

   :::image type="content" source="./media/create-private-link-access-portal/private-endpoint-basics.png" alt-text="Screenshot of Azure portal showing the 'Basics' tab with fields to provide values for the private endpoint.":::

1. In the **Resource** tab, select **Connect to an Azure resource in my directory**. For resource type, select **Microsoft.Authorization/resourceManagementPrivateLinks**. For target subresource, select **ResourceManagement**.

   :::image type="content" source="./media/create-private-link-access-portal/private-endpoint-resource.png" alt-text="Screenshot of Azure portal showing the 'Resource' tab with fields to select resource type and target subresource for the private endpoint.":::

1. In the **Configuration** tab, select your virtual network. We recommend integrating with a private DNS zone. Select **Review + create**.

1. After validation passes, select **Create**.

## Verify private DNS zone

To make sure your environment is properly configured, check the local IP address for the DNS zone.

1. In the resource group where you deployed the private endpoint, select the private DNS zone resource named **privatelink.azure.com**.

1. Verify that the record set named **management** has a valid local IP address.

   :::image type="content" source="./media/create-private-link-access-portal/verify.png" alt-text="Screenshot of Azure portal displaying the private DNS zone resource with the record set named 'management' and its local IP address.":::

## Next steps

To learn more about private links, see [Azure Private Link](../../private-link/index.yml).
