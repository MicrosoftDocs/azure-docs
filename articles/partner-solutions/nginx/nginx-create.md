---
title: Create nginx application - Azure partner solutions
description: This article describes how to use the Azure portal to create an instance of nginx.
ms.topic: quickstart
ms.collection: na
ms.service: partner-services
author: flang-msft
ms.author: franlanglois
ms.date: 05/12/2022
ms.custom: mode-other
---

# QuickStart: Get started with nginx

In this quickstart, you'll use the Azure portal to create an instance of nginx with your Azure solutions.

## Create new Nginx account

1. Create an Nginx deployment using the Resource Manager in the Azure portal.

    Set the following values in the Create Nginx resource screen.

    :::image type="content" source="media/nginx-create/nginx-create.png" alt-text="screenshot of basics page of nginx":::

    | Property  | Description |
    |---------|---------|
    | Subscription     | From the drop-down, select your Azure subscription where you have owner access        |
    | Resource group     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see Azure Resource Group overview.          |
    | Nginx account name  | Put the name for the Nginx account you want to create         |
    | Location | Select West Central US. Note that West Central US is the only Azure region supported by Nginx during preview.          |
    | Plan     |    Specified based on the selected Nginx plan      |
    | Price    |     Pay As You Go     |

1. After filling in the proper values, select the **Next: Networking**. You're taken the **Networking** screen. Specify the VNet and Subnet that is associated with the Nginx deployment.  

    :::image type="content" source="media/nginx-create/nginx-networking.png" alt-text="screenshot of networking part of nginx create experience":::

1. Select the checkbox that acknowledges access to your Tenant to ensure VNET and NIC association.

1. Select either Public or Private End points for IP address selection.

### Add custom tags

You can specify custom tags for the new Nginx resource in Azure by adding custom key value pairs.

1. Select Tags.

    :::image type="content" source="media/nginx-create/nginx-custom-tags.png" alt-text="screenshot showing the tag creation":::

    | Property | Description |
    |----------| -------------|
    |Name | Name of the tag corresponding to the Azure Nginx resource |
    | Value | Value of the tag corresponding to the Azure Nginx resource |

1. Select the **Next: Review+Create** to navigate to the final step for resource creation. Once you get to the **Review + Create** page, all validations are run. At this point, you can review all the selections made in the Basics, Metrics and Logs, Single sign-on and Tags screens. You can also review the Nginx and Azure Marketplace terms and conditions.  

    :::image type="content" source="media/nginx-create/nginx-review-and-create.png" alt-text="screenshot of review and create nginx resource":::

1.Once you've reviewed all the information select **Create**. Azure now deploys the Nginx resource.

   :::image type="content" source="media/nginx-create/nginx-deploy.png" alt-text="screenshot of nginx deployment":::

1. Once the process is complete, select **Go to Resource** to navigate to the specific Nginx resource.

    :::image type="content" source="media/nginx-create/nginx-overview-pane.png" alt-text="Image ":::

1. Select Overview in the Resource Manager to see information on the deployed resources in the working pane.

    :::image type="content" source="media/nginx-create/nginx-overview-pane.png" alt-text="screenshot of information on the nginx resource overview":::

## Next steps

- [Manage the nginx resource](nginx-manage.md)
