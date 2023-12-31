---
title: Get started with Azure Health Models
description: Learn how to register the resource provider, access health models, and create resource models.
ms.topic: conceptual
ms.date: 12/12/2023
---

# Get started with Azure Health Models

## Required permissions

- In order to be able to register a resource provider (which has to be done to use Health Models), the user must have either **Contributor** or **Owner** role in the target subscription (permission to do the `/register/action` operation.

  This action needs to be done only **once** per subscription.

- In order to authorize the health model identity against Azure resources (Monitoring Reader role), the user must be either an **Owner**, or **User Access Administrator**.

  This assignment can be done by higher-privilege user by creating a role assignment for health model's identity (`Monitoring Reader` on target subscription/resource group/resource).

## Register the resource provider

You need to register the resource provider once per subscription. You can either use the Portal or CLI to register the resource provider.

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

## Access to Azure Health Models

After you register the resource provider, open the Azure portal using the following link to see the Azure Health Models UI extension in your Portal:

* [**aka.ms/ahmprivatepreview**](https://aka.ms/ahmprivatepreview)

## Create a new Health Model

To create your first health model, follow these steps: 

1. Type "health models" in the Search bar on top of the Portal and click on Health Models.

   :::image type="content" source="./media/health-model-getting-started/azure-portal-search-bar.png" lightbox="./media/health-model-getting-started/azure-portal-search-bar.png" alt-text="Screenshot of the search bar in the Azure portal with 'health models' entered in it. ":::

   In the following UI you can see your existing models and, via the Create button, create new ones.

   :::image type="content" source="./media/health-model-getting-started/health-model-resources-list.png" lightbox="./media/health-model-getting-started/health-model-resources-list.png" alt-text="Screenshot of the Azure portal with existing health models listed.":::

1. Click on **+ Create**, which brings up the creation wizard. Select a resource group, name and location (only limited ones are available during the preview).

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-basics-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-basics-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Basics tab selected.":::

1. Click on **Next**. In the Identity dialog either select "System Assigned" or pick an existing User assigned identity. This identity is used later to make authorized requests against your selected data sources.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-identity-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-identity-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Identity tab selected.":::

1. When you're ready, click **Create** on the last page of the wizard.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-review-create-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-review-create-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Review + Create tab selected.":::

1. Once the creation is finished, select **Go to resource** to open your new resource.

   :::image type="content" source="./media/health-model-getting-started/health-model-deployment-complete.png" lightbox="./media/health-model-getting-started/health-model-deployment-complete.png" alt-text="Screenshot that shows the deployment of the Azure health model resource is complete.":::

All the following steps happen on the resource UI:

:::image type="content" source="./media/health-model-getting-started/health-model-resource-overview-pane.png" lightbox="./media/health-model-getting-started/health-model-resource-overview-pane.png" alt-text="Screenshot of the new health models resource in the Azure portal with the Overview pane selected.":::

## Next steps

To build your first model, see [Create or modify health models by using Designer view](./health-model-create-modify-with-designer.md).
