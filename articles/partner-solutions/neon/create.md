---
title: Create a Neon deployment
description: This article describes how to use the Azure portal to create an instance of Neon Serverless Postgres - An Azure Native ISV Service.
ms.topic: quickstart
ms.date: 10/01/2024
ms.custom:

---

# QuickStart: Get started with Neon Serverless Postgres - An Azure Native ISV Service 

In this quickstart, you use the Azure portal and Marketplace to find and create an instance of Neon Serverless Postgres - An Azure Native ISV Service. Use Neon Serverless Postgres - An Azure Native ISV Service to run data pipelines that power company dashboards, AI, and ML applications.

When you install Neon Serverless Postgres - An Azure Native ISV Service, you manage your Neon resource usage and billing alongside your existing Azure applications. You also get an integration with Microsoft Entra ID for your organization.

For more information, see Install Neon Serverless Postgres - An Azure Native ISV Service from the Azure Marketplace.

## Prerequisites

- An Azure account. If you don't have an active Azure subscription, [create a free account](https://azure.microsoft.com/free/). Make sure you're an _Owner_ or a _Contributor_ in the subscription.

## Create a new Neon resource

In this section, you see how to create an instance of Neon using Azure portal.

### Find the service

1. Use the search in the [Azure portal](https://portal.azure.com) to find the Neon Serverless Postgres - An Azure Native ISV Service application.
2. Alternatively, go to Marketplace and search for Neon Serverless Postgres - An Azure Native ISV Service.
3. Subscribe to the corresponding service.

### Basics

1. Set the following values in the **Create a Neon Organization** pane.

    | Property  | Description |
    |---------|---------|
    | **Subscription**  | From the drop-down, select your Azure subscription where you have Owner or Contributor access. |
    | **Resource group**     | Specify whether you want to create a new resource group or use an existing one. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](/azure/azure-resource-manager/management/overview).|
    | **Resource Name**  | Put the name for the Neon organization you want to create. |
    | **Region** | Select the closest region to where you would like to deploy your resource. |
    | **Neon Organization name** | Corresponds to the name of your company, usually. |
    | **Workspace Name** | Name of the default workspace where you would like to group your Airflow deployments. |
    | **Pricing Plan**     | Choose the default Pay-As-You-Go option |

### Tags

You can specify custom tags for the new Neon resource in Azure by adding custom key-value pairs.

1. Select Tags.

    | Property | Description |
    |----------| -------------|
    | **Name** | Name of the tag corresponding to the Neon resource. |
    | **Value** | Value of the tag corresponding to the Neon resource. |

### Review and create

1. Select the **Next: Review + Create** to navigate to the final step for resource creation. When you get to the **Review + Create** page, all validations are run. At this point, review all the selections made in the Basics and optionally Tags panes. You can also review the Neon and Azure Marketplace terms and conditions.  

1. After you review all the information, select **Create**. Azure now deploys the Neon resource.

### Deployment completed

1. Once the create process is completed, select **Go to Resource** to navigate to the specific Neon resource.

1. Select **Overview** in the Resource menu to see information on the deployed resources.

1. Now select the **SSO Url** to redirect to the newly created Neon organization.

## Next steps

- [Manage the Neon resource](manage.md)
<!--TO DO:  Add links
- Get started with Neon Serverless Postgres - An Azure Native ISV Service on
    > [!div class="nextstepaction"]
    > Azure portal

    > [!div class="nextstepaction"]
    > Azure Marketplace
-->
