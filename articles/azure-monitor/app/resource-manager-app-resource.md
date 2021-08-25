---
title: Resource Manager template samples for Application Insights Resources
description: Sample Azure Resource Manager templates to deploy Application Insights resources in Azure Monitor.

ms.topic: sample
author: lgayhardt
ms.author: lagayhar
ms.date: 07/08/2020

---

# Resource Manager template samples for creating Application Insights resources

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to deploy and configure [classic Application Insights resources](../app/create-new-resource.md) and the new [preview workspace-based Application Insights resources](../app/create-workspace-resource.md). Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Classic Application Insights resource

The following sample creates a [classic Application Insights resource](../app/create-new-resource.md). 

### Template file

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
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
            "description": "See documentation on tags:https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources."
          }
        },
        "requestSource": {
            "type": "string",
            "metadata": {
            "description": "Source of Azure Resource Manager deployment"
        }
        }
    },
    "resources": [
        {
            "name": "[parameters('name')]",
            "type": "microsoft.insights/components",
            "location": "[parameters('regionId')]",
            "tags": "[parameters('tagsArray')]",
            "apiVersion": "2014-08-01",
            "properties": {
                "ApplicationId": "[parameters('name')]",
                "Application_Type": "[parameters('type')]",
                "Flow_Type": "Redfield",
                "Request_Source": "[parameters('requestSource')]"
            }
        }
    ]
}
```

### Parameter file

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "type": {
            "value": "web"
        },
        "name": {
            "value": "my_app_insights_resource"
        },
        "regionId": {
            "value": "westus2"
        },
        "tagsArray": {
            "value": {}
        },
        "requestSource": {
            "value": "CustomDeployment"
        }
    }
}
```

## Workspace-based Application Insights resource 

The following sample creates a [workspace-based Application Insights resource](../app/create-workspace-resource.md). Workspace-based Application Insights are currently in **preview**. 


### Template file

```json
{
    "$schema": "http://schema.management.azure.com/schemas/2014-04-01-preview/deploymentTemplate.json#",
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
            "description": "See documentation on tags:https://docs.microsoft.com/azure/azure-resource-manager/management/tag-resources."
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
            "name": "[parameters('name')]",
            "type": "microsoft.insights/components",
            "location": "[parameters('regionId')]",
            "tags": "[parameters('tagsArray')]",
            "apiVersion": "2020-02-02-preview",
            "properties": {
                "ApplicationId": "[parameters('name')]",
                "Application_Type": "[parameters('type')]",
                "Flow_Type": "Redfield",
                "Request_Source": "[parameters('requestSource')]",
                "WorkspaceResourceId": "[parameters('workspaceResourceId')]"
            }
        }
    ]
}
```

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

## Next steps

* [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
* [Learn more about classic Application Insights resources](../app/create-new-resource.md).
* [Learn more about workspace-based Application Insights resources](../app/create-workspace-resource.md).