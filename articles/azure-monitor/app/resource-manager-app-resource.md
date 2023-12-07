---
title: Resource Manager template samples for Application Insights resources
description: Sample Azure Resource Manager templates to deploy Application Insights resources in Azure Monitor.
ms.topic: sample
ms.date: 11/14/2022
ms.custom: ignite-fall-2021, devx-track-arm-template
ms.reviewer: vitalyg
---

# Resource Manager template samples for creating Application Insights resources

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to deploy and configure [classic Application Insights resources](/previous-versions/azure/azure-monitor/app/create-new-resource) and the new [workspace-based Application Insights resources](../app/create-workspace-resource.md). Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Workspace-based Application Insights resource

The following sample creates a [workspace-based Application Insights resource](../app/create-workspace-resource.md). 

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Name of Application Insights resource.')
param name string

@description('Type of app you are deploying. This field is for legacy reasons and will not impact the type of App Insights resource you deploy.')
param type string

@description('Which Azure Region to deploy the resource to. This must be a valid Azure regionId.')
param regionId string

@description('See documentation on tags: https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources.')
param tagsArray object

@description('Source of Azure Resource Manager deployment')
param requestSource string

@description('Log Analytics workspace ID to associate with your Application Insights resource.')
param workspaceResourceId string

resource component 'Microsoft.Insights/components@2020-02-02' = {
  name: name
  location: regionId
  tags: tagsArray
  kind: 'other'
  properties: {
    Application_Type: type
    Flow_Type: 'Bluefield'
    Request_Source: requestSource
    WorkspaceResourceId: workspaceResourceId
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "name": {
      "type": "string",
      "metadata": {
        "description": "Name of Application Insights resource."
      }
    },
    "type": {
      "type": "string",
      "metadata": {
        "description": "Type of app you are deploying. This field is for legacy reasons and will not impact the type of App Insights resource you deploy."
      }
    },
    "regionId": {
      "type": "string",
      "metadata": {
        "description": "Which Azure Region to deploy the resource to. This must be a valid Azure regionId."
      }
    },
    "tagsArray": {
      "type": "object",
      "metadata": {
        "description": "See documentation on tags: https://learn.microsoft.com/azure/azure-resource-manager/management/tag-resources."
      }
    },
    "requestSource": {
      "type": "string",
      "metadata": {
        "description": "Source of Azure Resource Manager deployment"
      }
    },
    "workspaceResourceId": {
      "type": "string",
      "metadata": {
        "description": "Log Analytics workspace ID to associate with your Application Insights resource."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Insights/components",
      "apiVersion": "2020-02-02",
      "name": "[parameters('name')]",
      "location": "[parameters('regionId')]",
      "tags": "[parameters('tagsArray')]",
      "kind": "other",
      "properties": {
        "Application_Type": "[parameters('type')]",
        "Flow_Type": "Bluefield",
        "Request_Source": "[parameters('requestSource')]",
        "WorkspaceResourceId": "[parameters('workspaceResourceId')]"
      }
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "name": {
      "value": "my_workspace_based_resource"
    },
    "type": {
      "value": "web"
    },
    "regionId": {
      "value": "westus2"
    },
    "tagsArray": {
      "value": {}
    },
    "requestSource": {
      "value": "CustomDeployment"
    },
    "workspaceResourceId": {
      "value": "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx/resourcegroups/testxxxx/providers/microsoft.operationalinsights/workspaces/testworkspace"
    }
  }
}
```

## Frequently asked questions

This section provides answers to common questions.

### Can I use providers('Microsoft.Insights', 'components').apiVersions[0] in my Azure Resource Manager deployments?

We don't recommend using this method of populating the API version. The newest version can represent preview releases, which might contain breaking changes. Even with newer nonpreview releases, the API versions aren't always backward compatible with existing templates. In some cases, the API version might not be available to all subscriptions.

## Next steps

* Get other [sample templates for Azure Monitor](../resource-manager-samples.md).
* Learn more about [classic Application Insights resources](/previous-versions/azure/azure-monitor/app/create-new-resource).
* Learn more about [workspace-based Application Insights resources](../app/create-workspace-resource.md).
