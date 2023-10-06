---
title: Create an Apache Airflow on Astro deployment
description: This article describes how to use the Azure portal to create an instance of Apache Airflow on Astro - An Azure Native ISV Service.
author: flang-msft

ms.topic: quickstart
ms.author: franlanglois
ms.date: 10/04/2023

ms.custom: references_regions, event-tier1-build-2022

---

# QuickStart: Get started with Apache Airflow on Astro – An Azure Native ISV Service

In this quickstart, you'll use the Azure portal and Marketplace to find and create an instance of  Apache Airflow on Astro - An Azure Native ISV Service.

## Prerequisites

- An Azure account. If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free/).

## Create a new Astro resource

### Find the service

1. Use the [Azure portal](https://portal.azure.com) to find the Apache Airflow on Astro - An Azure Native ISV Service application.
2. Go to Marketplace and search for **"Apache Airflow on Astro - An Azure Native ISV Service"**.
3. Subscribe to the corresponding service.

### Basics

1. Set the following values in the **Create an Astro Organization** pane.

    :::image type="content" source="media/astronomer-create/astronomer-create.png" alt-text="Screenshot of basics pane of the Astronomer create experience.":::

    | Property  | Description |
    |---------|---------|
    | **Subscription**  | From the drop-down, select your Azure subscription where you have Owner or Contributor access. |
    | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](azure/azure-resource-manager/management/overview). |
    | **Resource Name**  | Put the name for the Astro organization you want to create. |
    | **Region** | Select the closest region to where you would like to deploy your resource. |
    | **Astro Organization name** | Gets auto-filled the same as the Resource Name, but edit if you need something different. |
    | **Workspace Name** | Name of the default workspace where you would like to group your Airflow deployments. |
    | **Pricing Plan**     | Choose the default Pay-As-You-Go option |

### Tags

You can specify custom tags for the new Astro resource in Azure by adding custom key-value pairs.

1. Select Tags.

    :::image type="content" source="media/astronomer-create/astronomer-custom-tags.png" alt-text="Screenshot showing the tags pane in the Astro create experience.":::

    | Property | Description |
    |----------| -------------|
    | **Name** | Name of the tag corresponding to the Astro resource. |
    | **Value** | Value of the tag corresponding to the Astro resource. |

### Review and create

1. Select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, all validations are run. At this point, review all the selections made in the Basics and optionally Tags panes. You can also review the Astronomer and Azure Marketplace terms and conditions.  

    :::image type="content" source="media/astronomer-create/astronomer-review-and-create.png" alt-text="screenshot of review and create astro resource":::

1. Once you've reviewed all the information select **Create**. Azure now deploys the Astro resource.

   :::image type="content" source="media/astronomer-create/astronomer-deploy.png" alt-text="Screenshot showing Astronomer deployment in process.":::

## Deployment completed

1. Once the create process is completed, select **Go to Resource** to navigate to the specific Astro resource.

    :::image type="content" source="media/astronomer-create/astronomer-overview-pane.png" alt-text="Screenshot of a completed Astro deployment.":::

1. Select **Overview** in the Resource menu to see information on the deployed resources.

    :::image type="content" source="media/astronomer-create/astronomer-overview-pane.png" alt-text="Screenshot of information on the Astronomer resource overview.":::

## Next steps

- [Manage the Astro resource](astronomer-manage.md)
- Get started with Apache Airflow on Astro – An Azure Native ISV Service on
<!-- fix  links when marketplace links work.
    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/astronomer.astronomerPLUS%2FastronomerDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-astronomer-for-azure?tab=Overview)
 -->
