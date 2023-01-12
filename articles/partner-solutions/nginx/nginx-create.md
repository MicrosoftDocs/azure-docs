---
title: Create an NGINX for Azure deployment
description: This article describes how to use the Azure portal to create an instance of NGINX.
ms.topic: quickstart
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022
ms.custom: references_regions, event-tier1-build-2022

---

# QuickStart: Get started with NGINX

In this quickstart, you'll use the Azure Marketplace to find and create an instance of  **NGINX for Azure**.

## Create new NGINX deployment

### Basics

1. To create an NGINX deployment using the Marketplace, subscribe to **NGINX for Azure** in the Azure portal.

1. Set the following values in the **Create NGINX Deployment** pane.

    :::image type="content" source="media/nginx-create/nginx-create.png" alt-text="Screenshot of basics pane of the NGINX create experience.":::

    | Property  | Description |
    |---------|---------|
    | Subscription     | From the drop-down, select your Azure subscription where you have owner access |
    | Resource group     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see Azure Resource Group overview. |
    | NGINX account name  | Put the name for the NGINX account you want to create |
    | Location | Select West Central US. West Central US is the only Azure region supported by NGINX during preview |
    | Plan     | Specified based on the selected NGINX plan |
    | Price    | Pay As You Go |

> [!NOTE]
> West Central US is the only Azure region supported by NGINX during preview.

### Networking

1. After filling in the proper values, select the **Next: Networking** to see the **Networking** screen. Specify the VNet and Subnet that is associated with the NGINX deployment.  

    :::image type="content" source="media/nginx-create/nginx-networking.png" alt-text="Screenshot of the networking pane in the NGINX create experience.":::

1. Select the checkbox **I allow NGINX service provider to access the above virtual network for deployment** to indicate that you acknowledge access to your Tenant to ensure VNet and NIC association.

1. Select either Public or Private End points for the IP address selection.

### Tags

You can specify custom tags for the new NGINX resource in Azure by adding custom key-value pairs.

1. Select Tags.

    :::image type="content" source="media/nginx-create/nginx-custom-tags.png" alt-text="Screenshot showing the tags pane in the NGINX create experience.":::

    | Property | Description |
    |----------| -------------|
    |Name | Name of the tag corresponding to the Azure NGINX resource. |
    | Value | Value of the tag corresponding to the Azure NGINX resource. |

### Review and create

1. Select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, all validations are run. At this point, review all the selections made in the Basics, Networking, and optionally Tags panes. You can also review the NGINX and Azure Marketplace terms and conditions.  

    :::image type="content" source="media/nginx-create/nginx-review-and-create.png" alt-text="screenshot of review and create nginx resource":::

1. Once you've reviewed all the information select **Create**. Azure now deploys the NGINX for Azure resource.

   :::image type="content" source="media/nginx-create/nginx-deploy.png" alt-text="Screenshot showing NGINX deployment in process.":::

## Deployment completed

1. Once the create process is completed, select **Go to Resource** to navigate to the specific NGINX resource.

    :::image type="content" source="media/nginx-create/nginx-overview-pane.png" alt-text="Screenshot of a completed NGINX deployment.":::

1. Select **Overview** in the Resource menu to see information on the deployed resources.

    :::image type="content" source="media/nginx-create/nginx-overview-pane.png" alt-text="Screenshot of information on the NGINX resource overview.":::

## Next steps

- [Manage the NGINX resource](nginx-manage.md)
