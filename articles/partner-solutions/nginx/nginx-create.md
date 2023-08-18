---
title: Create an NGINXaaS deployment
description: This article describes how to use the Azure portal to create an instance of NGINXaaS.
author: flang-msft

ms.topic: quickstart
ms.author: franlanglois
ms.date: 01/18/2023

ms.custom: references_regions, event-tier1-build-2022

---

# QuickStart: Get started with NGINXaaS – An Azure Native ISV Service

In this quickstart, you'll use the Azure Marketplace to find and create an instance of  **NGINXaaS**.

## Create a new NGINXaaS resource

### Basics

1. To create an NGINXaaS deployment using the Marketplace, subscribe to **NGINXaaS** in the Azure portal.

1. Set the following values in the **Create NGINXaaS** pane.

    :::image type="content" source="media/nginx-create/nginx-create.png" alt-text="Screenshot of basics pane of the NGINXaaS create experience.":::

    | Property  | Description |
    |---------|---------|
    | **Subscription**  | From the drop-down, select your Azure subscription where you have owner access. |
    | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see Azure Resource Group overview. |
    | **Name**  | Put the name for the NGINXaaS account you want to create. |
    | **Region** | Select West Central US. West Central US is the only Azure region supported by NGINXaaS during preview. |
    | **Pricing Plan**     | Specified based on the selected NGINXaaS plan. |


> [!NOTE]
> West Central US is the only Azure region supported by NGINXaaS during preview.
<!-- Is this still true at GA -->

### Networking

1. After filling in the proper values, select the **Next: Networking** to see the **Networking** screen. Specify the VNet and Subnet that is associated with the NGINXaaS deployment.  

    :::image type="content" source="media/nginx-create/nginx-networking.png" alt-text="Screenshot of the networking pane in the NGINXaaS create experience.":::

1. Select the checkbox **I allow NGINXaaS service provider to access the above virtual network for deployment** to indicate that you acknowledge access to your Tenant to ensure VNet and NIC association.

1. Select either Public or Private End points for the IP address selection.

### Tags

You can specify custom tags for the new NGINXaaS resource in Azure by adding custom key-value pairs.

1. Select Tags.

    :::image type="content" source="media/nginx-create/nginx-custom-tags.png" alt-text="Screenshot showing the tags pane in the NGINXaaS create experience.":::

    | Property | Description |
    |----------| -------------|
    |**Name** | Name of the tag corresponding to the Azure NGINXaaS resource. |
    | **Value** | Value of the tag corresponding to the Azure NGINXaaS resource. |

### Review and create

1. Select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, all validations are run. At this point, review all the selections made in the Basics, Networking, and optionally Tags panes. You can also review the NGINXaaS and Azure Marketplace terms and conditions.  

    :::image type="content" source="media/nginx-create/nginx-review-and-create.png" alt-text="screenshot of review and create nginx resource":::

1. Once you've reviewed all the information select **Create**. Azure now deploys the NGINXaaSaaS resource.

   :::image type="content" source="media/nginx-create/nginx-deploy.png" alt-text="Screenshot showing NGINXaaS deployment in process.":::

## Deployment completed

1. Once the create process is completed, select **Go to Resource** to navigate to the specific NGINXaaS resource.

    :::image type="content" source="media/nginx-create/nginx-overview-pane.png" alt-text="Screenshot of a completed NGINXaaS deployment.":::

1. Select **Overview** in the Resource menu to see information on the deployed resources.

    :::image type="content" source="media/nginx-create/nginx-overview-pane.png" alt-text="Screenshot of information on the NGINXaaS resource overview.":::

## Next steps

- [Manage the NGINXaaS resource](nginx-manage.md)
- Get started with NGINXaaS – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/NGINX.NGINXPLUS%2FnginxDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-nginx-for-azure?tab=Overview)