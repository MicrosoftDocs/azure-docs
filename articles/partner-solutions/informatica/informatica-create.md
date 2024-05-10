---
title: "Quickstart: Create an Informatica Intelligent Data Management Cloud deployment"
description: This article describes how to use the Azure portal to create an  Informatica IDMC organization.

ms.topic: quickstart
ms.date: 04/02/2024

---
# QuickStart: Get started with Informatica (Preview) – An Azure Native ISV Service

In this quickstart, you use the Azure portal and Marketplace to find and create an instance of Informatica Intelligent Data Management Cloud (Preview) - Azure Native ISV Service.

## Prerequisites

- An Azure account. If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free/). Make sure you're an _Owner_ or a _Contributor_ in the subscription.

## Create an Informatica organization

In this section, you see how to create an instance of  _Informatica Intelligent Data Management Cloud - Azure Native ISV Service_ using Azure portal.

### Find the service

1. Use the search in the [Azure portal](https://portal.azure.com) to find the _Informatica Intelligent Data Management Cloud - Azure Native ISV Service_ application.
2. Alternatively, go to Marketplace and search for _Informatica Intelligent Data Management Cloud - Azure Native ISV Service_.
3. Subscribe to the corresponding service.

    :::image type="content" source="media/informatica-create/informatica-marketplace.png" alt-text="Screenshot of Informatica application in the Marketplace.":::

### Basics

1. To create an Informatica deployment using the Marketplace, subscribe to **Informatica** in the Azure portal.

1. Set the following values in the **Create Informatica** pane.

    :::image type="content" source="media/informatica-create/informatica-create.png" alt-text="Screenshot of Basics pane of the Informatica create experience.":::

    | Property  | Description |
    |---------|---------|
    | **Subscription**  | From the drop-down, select your Azure subscription where you have owner access. |
    | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see Azure Resource Group overview. |
    | **Name**  | Put the name for the Informatica Organization you want to create. |
    | **Region** | Select the closest region to where you would like to deploy your Informatica Azure Resource. |
    | **Informatica Region** | Select the Informatica region where you want to create Informatica Organization. |
    | **Organization** | Select "Create a new organization" if you want to a new Informatica Organization. Select **Link to an existing organization (with Azure Marketplace Billing)** if you already have an Informatica organization, intend to map it to the  Azure resource, and initiate a new plan with Azure Marketplace. Select **Link to an existing organization (continue with existing Informatica Billing)** if you already have an existing Informatica organization and have a billing contract with Informatica already. |
    | **Plan** | Choose the plan you want to subscribe to. |

### Tags

You can specify custom tags for the new Informatica resource in Azure by adding custom key-value pairs.

1. Select Tags.

    :::image type="content" source="media/informatica-create/informatica-custom-tags.png" alt-text="Screenshot showing the tags pane in the Informatica create experience.":::

    | Property | Description |
    |----------| -------------|
    |**Name** | Name of the tag corresponding to the Azure Native Informatica resource. |
    | **Value** | Value of the tag corresponding to the Azure Native Informatica resource. |

### Review and create

1. Select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, all validations are run. At this point, review all the selections made in the Basics and optionally Tags panes. You can also review the Informatica and Azure Marketplace terms and conditions.  

    :::image type="content" source="media/informatica-create/informatica-review-create.png" alt-text="Screenshot of review and create Informatica resource.":::

1. After you review all the information, select **Create**. Azure now deploys the Informatica resource.

## Deployment completed

1. After the create process is completed, select **Go to Resource** to navigate to the specific Informatica resource.

    :::image type="content" source="media/informatica-create/informatica-deploy.png" alt-text="Screenshot of a completed Informatica deployment.":::

1. Select **Overview** in the Resource menu to see information on the deployed resources.

    :::image type="content" source="media/informatica-create/informatica-overview-pane.png" alt-text="Screenshot of information on the Informatica resource overview.":::

## Next steps

- [Manage the Informatica resource](informatica-manage.md)
<!-- 
- Get started with Informatica – An Azure Native ISV Service on

fix  links when marketplace links work.
    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/informatica.informaticaPLUS%2FinformaticaDeployments)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/f5-networks.f5-informatica-for-azure?tab=Overview) 
-->
