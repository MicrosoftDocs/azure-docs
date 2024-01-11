---
title: Create a health model resource in Azure Monitor
description: Learn now to create a health model resource.
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 12/12/2023
---

# Create a health model resource in Azure Monitor


## Prerequisites

- In order to be able to register a resource provider, you must have either **Contributor** or **Owner** role (permission to do the `/register/action` operation) in the target subscription of each resource added to your health model.
- In order to authorize the health model identity against Azure resources, you must be either an **Owner** or **User Access Administrator** for the resource. 

    **CLI**
    
    ```bash
    az provider register -n Microsoft.HealthModel
    ```
    
    **Azure portal**
    
    1. From the **Subscriptions** menu in the Azure portal, select **Resource providers**.
    
    1. Search for `healthmodel`. If **Microsoft.HealthModel** shows as **NotRegistered**, select it and click **Register** in the command bar.

## [Azure portal](#tab/portal)


The `nodes: []` section can become very complex. Using the [Designer view](./designer-view.md) with the [Code view](./code-view.md) can help to define a health model via the UI and take the code artifacts over to Infra-as-Code.


1. Select **Health Models** from the **Monitor** menu in the Azure portal.

   :::image type="content" source="./media/health-model-getting-started/azure-portal-search-bar.png" lightbox="./media/health-model-getting-started/azure-portal-search-bar.png" alt-text="Screenshot of the search bar in the Azure portal with 'health models' entered in it. ":::

2. Any existing health models in your subscription will be listed. Select **Create** to create a new model.

   :::image type="content" source="./media/health-model-getting-started/health-model-resources-list.png" lightbox="./media/health-model-getting-started/health-model-resources-list.png" alt-text="Screenshot of the Azure portal with existing health models listed.":::

3. Select a resource group, name and location for the new health model.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-basics-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-basics-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Basics tab selected.":::

4. Click **Next** to view the **Identity** page. Select **System Assigned** or select an existing User assigned identity. This identity is used later to make authorized requests against the Azure resources that you add to your health model.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-identity-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-identity-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Identity tab selected.":::

5. Click **Create** on the last page of the wizard.

   :::image type="content" source="./media/health-model-getting-started/create-a-new-azure-health-model-page-review-create-tab.png" lightbox="./media/health-model-getting-started/create-a-new-azure-health-model-page-review-create-tab.png" alt-text="Screenshot of the Create a new Azure Health Model page in the Azure portal with the Review + Create tab selected.":::


## [Resource Manager](#tab/arm)

Use the following ARM or Bicep template to create a health model use a Resource Manager template. The `nodes` section in each template contains the definition of the health model. Use the [code view](./code-view.md) for the JSON that can be copied into the template.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
      "healthModelName": {
        "type": "string",
        "metadata": {
          "description": "The name of the health model to create."
        }
      },
      "location": {
        "type": "string",
        "defaultValue": "eastus2",
        "allowedValues": [
          "eastus2",
          "uksouth"
        ],
        "metadata": {
          "description": "The location of the health model resource."
        }
      }
    },
    "resources": [
      {
        "type": "Microsoft.HealthModel/healthmodels",
        "apiVersion": "2022-11-01-preview",
        "name": "[parameters('healthModelName')]",
        "location": "[parameters('location')]",
        "identity": {
          "type": "SystemAssigned"
        },
        "properties": {
          "activeState": "Inactive",
          "refreshInterval": "PT1M",
          "nodes": []
        }
      }
    ]
}
```




```bicep
resource healthModel 'Microsoft.HealthModel/healthmodels@2022-11-01-preview' = {
  name: 'sample-healthmodel'
  location: hmLocation
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    activeState: 'Inactive'
    refreshInterval: 'PT1M'
    nodes: []
  }
}
```

## Arguments

| Argument | Description |
|:---|:---|
| `identity` | For more information, see [Identity](./configure-identity.md). |
| `properties` | Contains the HM configuration:<ul><li>`activeState` can be set to `Inactive` or `Active`.</li><li>`refreshInterval` is the execution interval of the Health Model.</li><li>`nodes`. For more information, see [Nodes](#nodes).</li></ul> |



## [Terraform](#tab/terraform)

Azure Health Models can be deployed using the AzApi Terraform provider. Before you deploy an AHM instance, you need to decide if you'd like to deploy AHM with a system-assigned Identity or a user-assigned Identity. For more information, see [Configure the Managed Identity for a health model](./configure-identity.md).

The process itself is mostly similar. The main difference is that the user-assigned Identity needs to be created as well. This creation can also be done via Terraform.

### Examples

- [Deploy with system-assigned Identity](https://github.com/Azure/ahm-quickstart/blob/main/docs/samples/tf-with-sai.tf)
- [Deploy with user-assigned Identity](https://github.com/Azure/ahm-quickstart/blob/main/docs/samples/tf-with-uai.tf)

## Usage

The provided samples work as-is and can be deployed into a sandbox or non-production environment.

The example that uses system-assigned Identity deploys an AHM instance in a separate resource group:

:::image type="content" source="./media/health-model-deploy-using-terraform/resource-group-health-model-resource.png" lightbox="./media/health-model-deploy-using-terraform/resource-group-health-model-resource.png" alt-text="Screenshot of a resource group in the Azure portal with a health model resource listed within it.":::

The example using a user-assigned Identity deploys a Managed Identity + an AHM instance:

:::image type="content" source="./media/health-model-deploy-using-terraform/resource-group-managed-identity-health-model-resources.png" lightbox="./media/health-model-deploy-using-terraform/resource-group-managed-identity-health-model-resources.png" alt-text="Screenshot of a resource group in the Azure portal. Managed identity and health model resources are listed within the resource group.":::

The Managed Identity resource is assigned to the AHM instance:

:::image type="content" source="./media/health-model-deploy-using-terraform/health-model-resource-identity-pane-user-assigned-tab.png" lightbox="./media/health-model-deploy-using-terraform/health-model-resource-identity-pane-user-assigned-tab.png" alt-text="Screenshot of the Identity pane for a health model resource in the Azure portal. The User assigned tab is selected.":::

The example with system-assigned Identity also contains example role assignments:

- Grant a specific Azure AD group "Contributor" permissions on the AHM instance
- Grant the AHM's identity "Monitoring Reader" permissions on subscription-level

### Limitations

- Deploying a Health Model with nodes, such as its property bag, is currently not possible with azapi. For example, this deployment can be achieved by using [azurerm_resource_group_template_deployment](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group_template_deployment) instead.

---