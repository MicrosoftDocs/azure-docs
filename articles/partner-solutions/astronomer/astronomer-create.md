---
title: Create an Apache Airflow on Astro deployment
description: This article describes how to use the Azure portal to create an instance of Apache Airflow on Astro - An Azure Native ISV Service.
ms.topic: quickstart
ms.date: 11/13/2023
ms.custom:
  - references_regions
  - ignite-2023
---

# QuickStart: Get started with Apache Airflow on Astro – An Azure Native ISV Service (Preview)

In this quickstart, you use the Azure portal and Marketplace to find and create an instance of Apache Airflow on Astro - An Azure Native ISV Service (Preview).

## Prerequisites

- An Azure account. If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free/). Make sure you're an _Owner_ or a _Contributor_ in the subscription.

## Create a new Astro resource

In this section, you see how to create an instance of Apache Airflow on Astro using Azure portal.

### Find the service

1. Use the search in the [Azure portal](https://portal.azure.com) to find the _Apache Airflow on Astro - An Azure Native ISV Service_ application.
2. Alternatively, go to Marketplace and search for _Apache Airflow on Astro - An Azure Native ISV Service_.
3. Subscribe to the corresponding service.

    :::image type="content" source="media/astronomer-create/astronomer-marketplace.png" alt-text="Screenshot of Astro application in the Marketplace.":::

### Basics

1. Set the following values in the **Create an Astro Organization** pane.

    :::image type="content" source="media/astronomer-create/astronomer-create.png" alt-text="Screenshot of basics pane of the Astronomer create experience.":::

    | Property  | Description |
    |---------|---------|
    | **Subscription**  | From the drop-down, select your Azure subscription where you have Owner or Contributor access. |
    | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](/azure/azure-resource-manager/management/overview).|
    | **Resource Name**  | Put the name for the Astro organization you want to create. |
    | **Region** | Select the closest region to where you would like to deploy your resource. |
    | **Astro Organization name** | Corresponds to the name of your company, usually. |
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

    :::image type="content" source="media/astronomer-create/astronomer-review-and-create.png" alt-text="Screenshot showing the Review and Create pane in the create process.":::

1. After you review all the information, select **Create**. Azure now deploys the Astro resource.

   :::image type="content" source="media/astronomer-create/astronomer-deploy.png" alt-text="Screenshot showing Astronomer deployment in process.":::

### Deployment completed

1. Once the create process is completed, select **Go to Resource** to navigate to the specific Astro resource.

    :::image type="content" source="media/astronomer-create/astronomer-deployment-complete.png" alt-text="Screenshot of a completed Astro deployment.":::

1. Select **Overview** in the Resource menu to see information on the deployed resources.

    :::image type="content" source="media/astronomer-create/astronomer-overview-pane.png" alt-text="Screenshot of information on the Astronomer resource overview.":::

1. Now select on the **SSO Url** to redirect to the newly created Astro organization.

## Next steps

- [Manage the Astro resource](astronomer-manage.md)
- Get started with Apache Airflow on Astro – An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://ms.portal.azure.com/?Azure_Marketplace_Astronomer_assettypeoptions=%7B%22Astronomer%22%3A%7B%22options%22%3A%22%22%7D%7D#browse/Astronomer.Astro%2Forganizations)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/astronomer1591719760654.astronomer?tab=Overview)
