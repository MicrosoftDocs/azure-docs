---
title: Create an <astronomer> deployment
description: This article describes how to use the Azure portal to create an instance of <astronomer>.
author: flang-msft

ms.topic: quickstart
ms.author: franlanglois
ms.date: 01/18/2023

ms.custom: references_regions, event-tier1-build-2022

---

# QuickStart: Get started with <astronomer> – An Azure Native ISV Service

In this quickstart, you'll use the Azure Marketplace to find and create an instance of  **<astronomer>**.

## Create a new <astronomer> resource

### Basics

1. To create an <astronomer> deployment using the Marketplace, subscribe to **<astronomer>** in the Azure portal.

1. Set the following values in the **Create <astronomer>** pane.

    :::image type="content" source="media/astronomer-create/astronomer-create.png" alt-text="Screenshot of basics pane of the <astronomer> create experience.":::

    | Property  | Description |
    |---------|---------|
    | **Subscription**  | From the drop-down, select your Azure subscription where you have owner access. |
    | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see Azure Resource Group overview. |
    | **Name**  | Put the name for the <astronomer> account you want to create. |
    | **Region** | Select West Central US. West Central US is the only Azure region supported by <astronomer> during preview. |
    | **Pricing Plan**     | Specified based on the selected <astronomer> plan. |


> [!NOTE]
> West Central US is the only Azure region supported by <astronomer> during preview.
<!-- Is this still true at GA -->

### Networking

1. After filling in the proper values, select the **Next: Networking** to see the **Networking** screen. Specify the VNet and Subnet that is associated with the <astronomer> deployment.  

    :::image type="content" source="media/astronomer-create/astronomer-networking.png" alt-text="Screenshot of the networking pane in the <astronomer> create experience.":::

1. Select the checkbox **I allow <astronomer> service provider to access the above virtual network for deployment** to indicate that you acknowledge access to your Tenant to ensure VNet and NIC association.

1. Select either Public or Private End points for the IP address selection.

### Tags

You can specify custom tags for the new <astronomer> resource in Azure by adding custom key-value pairs.

1. Select Tags.

    :::image type="content" source="media/astronomer-create/astronomer-custom-tags.png" alt-text="Screenshot showing the tags pane in the <astronomer> create experience.":::

    | Property | Description |
    |----------| -------------|
    |**Name** | Name of the tag corresponding to the Azure <astronomer> resource. |
    | **Value** | Value of the tag corresponding to the Azure <astronomer> resource. |

### Review and create

1. Select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, all validations are run. At this point, review all the selections made in the Basics, Networking, and optionally Tags panes. You can also review the <astronomer> and Azure Marketplace terms and conditions.  

    :::image type="content" source="media/astronomer-create/astronomer-review-and-create.png" alt-text="screenshot of review and create astronomer resource":::

1. Once you've reviewed all the information select **Create**. Azure now deploys the <astronomer>aaS resource.

   :::image type="content" source="media/astronomer-create/astronomer-deploy.png" alt-text="Screenshot showing <astronomer> deployment in process.":::

## Deployment completed

1. Once the create process is completed, select **Go to Resource** to navigate to the specific <astronomer> resource.

    :::image type="content" source="media/astronomer-create/astronomer-overview-pane.png" alt-text="Screenshot of a completed <astronomer> deployment.":::

1. Select **Overview** in the Resource menu to see information on the deployed resources.

    :::image type="content" source="media/astronomer-create/astronomer-overview-pane.png" alt-text="Screenshot of information on the <astronomer> resource overview.":::

## Next steps

- [Manage the <astronomer> resource](astronomer-manage.md)
- Get started with <astronomer> – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/astronomer.astronomerPLUS%2FastronomerDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-astronomer-for-azure?tab=Overview)