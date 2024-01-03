---
title: Get started with Azure Health Models
description: Learn how to register the resource provider, access health models, and create resource models.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# Get started with health models in Azure Monitor

## Prerequisites

- In order to be able to register a resource provider, you must have either **Contributor** or **Owner** role (permission to do the `/register/action` operation) in the target subscription of each resource added to your health model.
- In order to authorize the health model identity against Azure resources, you must be either an **Owner** or **User Access Administrator** for the resource. 
- You need to register the resource provider for your subscription using one of the following methods:

    ## [CLI](#tab/cli)
    
    ```bash
    # ensure that the right subscription is selected
    az account set -s <subscriptionid>
    
    # register the resource provider
    az provider register -n Microsoft.HealthModel
    ```
    
    ## [Azure portal](#tab/portal)
    
    1. Go to **Subscriptions**, select the subscription and go to **Resource providers**.
    
       :::image type="content" source="./media/health-model-getting-started/subscriptions-service-resource-providers-menu-option.png" lightbox="./media/health-model-getting-started/subscriptions-service-resource-providers-menu-option.png" alt-text="Screenshot of the Subscription menu in the Azure portal with the cursor on Resource providers.":::
    
    1. Search for `healthmodel` - Microsoft.HealthModel should report as "NotRegistered". Select it and click **Register** in the command bar.
    
       :::image type="content" source="./media/health-model-getting-started/subscriptions-service-register-button.png" lightbox="./media/health-model-getting-started/subscriptions-service-register-button.png" alt-text="Screenshot of the Resource providers pane in the Azure portal with the cursor on the Register button.":::
    
    ---


## Create a new Health Model

Use the following procedure to create your first health model:

1. Select **Health Models** from the **Monitor** menu in the Azure portal.

   :::image type="content" source="./media/health-model-getting-started/azure-portal-search-bar.png" lightbox="./media/health-model-getting-started/azure-portal-search-bar.png" alt-text="Screenshot of the search bar in the Azure portal with 'health models' entered in it. ":::

2. Any existing health models in your subscription will be listed. Select **Create** to create a new model.

   :::image type="content" source="./media/health-model-getting-started/health-model-resources-list.png" lightbox="./media/health-model-getting-started/health-model-resources-list.png" alt-text="Screenshot of the Azure portal with existing health models listed.":::

1. Select a resource group, name and location for the new health model.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-basics-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-basics-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Basics tab selected.":::

1. Click **Next** to view the **Identity** page. Select **System Assigned** or select an existing User assigned identity. This identity is used later to make authorized requests against the Azure resources that you add to your health model.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-identity-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-identity-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Identity tab selected.":::

1. Click **Create** on the last page of the wizard.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-review-create-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-review-create-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Review + Create tab selected.":::

1. Once the creation is finished, select **Go to resource** to open your new resource.

   :::image type="content" source="./media/health-model-getting-started/health-model-deployment-complete.png" lightbox="./media/health-model-getting-started/health-model-deployment-complete.png" alt-text="Screenshot that shows the deployment of the Azure health model resource is complete.":::

All the following steps happen on the resource UI:

:::image type="content" source="./media/health-model-getting-started/health-model-resource-overview-pane.png" lightbox="./media/health-model-getting-started/health-model-resource-overview-pane.png" alt-text="Screenshot of the new health models resource in the Azure portal with the Overview pane selected.":::

## Next steps

To build your first model, see [Create or modify health models by using Designer view](./health-model-create-modify-with-designer.md).
