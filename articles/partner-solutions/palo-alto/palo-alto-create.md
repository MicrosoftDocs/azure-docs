---
title: Create an Palo Alto deployment
description: This article describes how to use the Azure portal to create an instance of Palo Alto.

ms.topic: quickstart
ms.date: 04/21/2023


---

# QuickStart: Get started with Palo Alto

In this quickstart, you'll use the Azure Marketplace to find and create an instance of  **Palo Alto**.

## Create a new Palo Alto resource

### Basics

1. To create an Palo Alto deployment using the Marketplace, subscribe to **Palo Alto** in the Azure portal.

1. Set the following values in the **Create Palo Alto** pane.

    <!-- :::image type="content" source="media/palo-alto-create/palo-alto-create.png" alt-text="Screenshot of basics pane of the Palo Alto create experience."::: -->

    | Property  | Description |
    |---------|---------|
    | **Subscription**  | From the drop-down, select your Azure subscription where you have owner access. |
    | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see Azure Resource Group overview. |
    | **Name**  | Put the name for the Palo Alto account you want to create. |
    | **Region** | Select West Central US. West Central US is the only Azure region supported by Palo Alto during preview. |
    | **Pricing Plan**     | Specified based on the selected Palo Alto plan. |


### Networking

1. After filling in the proper values, select the **Next: Networking** to see the **Networking** screen. Specify the VNet and Subnet that is associated with the Palo Alto deployment.  

    <!-- :::image type="content" source="media/palo-alto-create/palo-alto-networking.png" alt-text="Screenshot of the networking pane in the Palo Alto create experience."::: -->

1. Select the checkbox **I allow Palo Alto service provider to access the above virtual network for deployment** to indicate that you acknowledge access to your Tenant to ensure VNet and NIC association.

1. Select either Public or Private End points for the IP address selection.

### Tags

You can specify custom tags for the new Palo Alto resource in Azure by adding custom key-value pairs.

1. Select Tags.

    <!-- :::image type="content" source="media/palo-alto-create/palo-alto-custom-tags.png" alt-text="Screenshot showing the tags pane in the Palo Alto create experience."::: -->

    | Property | Description |
    |----------| -------------|
    |**Name** | Name of the tag corresponding to the Azure Palo Alto resource. |
    | **Value** | Value of the tag corresponding to the Azure Palo Alto resource. |

### Review and create

1. Select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, all validations are run. At this point, review all the selections made in the Basics, Networking, and optionally Tags panes. You can also review the Palo Alto and Azure Marketplace terms and conditions.  

    <!-- :::image type="content" source="media/palo-alto-create/palo-alto-review-and-create.png" alt-text="screenshot of review and create palo-alto resource"::: -->

1. Once you've reviewed all the information select **Create**. Azure now deploys the Palo AltoaaS resource.

   <!-- :::image type="content" source="media/palo-alto-create/palo-alto-deploy.png" alt-text="Screenshot showing Palo Alto deployment in process."::: -->

## Deployment completed

1. Once the create process is completed, select **Go to Resource** to navigate to the specific Palo Alto resource.

    <!-- :::image type="content" source="media/palo-alto-create/palo-alto-overview-pane.png" alt-text="Screenshot of a completed Palo Alto deployment."::: -->

1. Select **Overview** in the Resource menu to see information on the deployed resources.

    <!-- :::image type="content" source="media/palo-alto-create/palo-alto-overview-pane.png" alt-text="Screenshot of information on the Palo Alto resource overview."::: -->

## Next steps

- [Manage the Palo Alto resource](palo-alto-manage.md)
