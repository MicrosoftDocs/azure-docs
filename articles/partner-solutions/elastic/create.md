---
title: Create Elastic application
description: This article describes how to use the Azure portal to create an instance of Elastic.
ms.topic: quickstart
ms.date: 06/01/2023
author: flang-msft
ms.author: franlanglois
ms.custom: mode-other
---

# QuickStart: Get started with Elastic

In this quickstart, you use the Azure portal to integrate an instance of Elastic with your Azure solutions.

## Prerequisites

- Subscription owner - The Elastic integration with Azure can only be created by users who have _Owner_ or _Contributor_ permissions on the Azure subscription. [Confirm that you have the appropriate access](../../role-based-access-control/check-access.md) before starting the setup.
- Single sign-on app - The ability to automatically navigate between the Azure portal and Elastic Cloud is enabled via single sign-on (SSO). This option is automatically enabled and turned on for all Azure users.

## Find offer

Use the Azure portal to find the Elastic application.

1. In a web browser, go to the [Azure portal](https://portal.azure.com/) and sign in.

1. If you've visited the **Marketplace** in a recent session, select the icon from the available options. Otherwise, search for _Marketplace_.

    :::image type="content" source="media/create/marketplace.png" alt-text="Image of marketplace icon.":::

1. Search for _Elastic_ and select **Elastic Cloud (Elasticsearch) - An Azure Native ISV Service** from the available offerings.

1. Select **Set up + subscribe**.

   :::image type="content" source="media/create/set-up.png" alt-text="select offer.":::

## Create resource

After you've selected the offer for Elastic, you're ready to set up the application.

1. On the **Create Elastic Resource** basics page, provide the following values.

    :::image type="content" source="media/create/create-resource.png" alt-text="Form to set up Elastic resource.":::

    | Property | Description |
    | ---- | ---- |
    | **Subscription** | From the drop-down, select an Azure subscription where you have owner access. |
    | **Resource group** | Specify whether you want to create a new resource group or use an existing resource group. A resource group is a container that holds related resources for an Azure solution. For more information, see [Azure Resource Group overview](../../azure-resource-manager/management/overview.md). |
    | **Elastic account name** | Provide the name for the Elastic account you want to create |
    | **Region** | Select the region you want to deploy to. |
    | **Pricing Plan** | **Pay as you go**. |
    | **Price** | Specified based on the selected Elastic plan. |

   When you've finished, select **Next: Logs and Metrics**.

1. On **Logs & metrics**, specify which logs to send to Elastic.

    :::image type="content" source="media/create/configure-logs.png" alt-text="Select logs to send.":::

   There are two types of logs that can be emitted from Azure to Elastic.

   **Subscription logs** provide insights into the operations on each Azure resource in the subscription from the [management plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). The logs also provide updates on Service Health events. Use the activity log to determine what, who, and when for any write operations (PUT, POST, DELETE) on the resources in your subscription. There's a single activity log for each Azure subscription.

   **Azure resource logs** provide insights into operations that happen within the [data plane](../../azure-resource-manager/management/control-plane-and-data-plane.md). For example, getting a secret from a key vault or making a request to a database are data plane activities. The content of resource logs varies by the Azure service and resource type. The types of Azure resource logs are listed in [Azure Monitor Resource Log categories](../../azure-monitor/essentials/resource-logs-categories.md).

   To filter the Azure resources that send logs to Elastic, use resource tags. The tag rules for sending logs are:

   - By default, logs are collected for all resources.
   - Resources with _Include_ tags send logs to Elastic.
   - Resources with _Exclude_ tags don't send logs to Elastic.
   - If there's a conflict between inclusion and exclusion rules, exclusion takes priority.

   Select **Next: Tags** to set up tags for the new Elastic resource.

1. In **Tags**, add custom tags for the new Elastic resource. Each tag consists of a name and value. When you've finished adding tags, select **Next: Review+Create** to navigate to the final step for resource creation.

   :::image type="content" source="media/create/add-tags.png" alt-text="Screenshot of add tags to Elastic resource.":::

1. On **Review + create**, your configuration is validated. You can review the selections you made in the earlier forms. You can also review the terms for this offering.

   :::image type="content" source="media/create/review-validation.png" alt-text="Review and validation selections":::

   After validation has succeeded and you've reviewed the terms, select **Create**.

1. Azure starts the deployment.

   :::image type="content" source="media/create/deployment-in-progress.png" alt-text="Deployment status":::

1. After the deployment is finished, select **Go to resource** to view the deployed resource.

    :::image type="content" source="media/create/deployment-complete.png" alt-text="Screenshot of view status of deployment.":::

## Next steps

- [Manage the Elastic resource](manage.md)
- Get started with Elastic Cloud (Elasticsearch) - An Azure Native ISV Service on

    > [!div class="nextstepaction"]
    > [Azure portal](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Elastic%2Fmonitors)

    > [!div class="nextstepaction"]
    > [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/elastic.ec-azure-pp?tab=Overview)