---
title: Onboard an Azure Arc-enabled server to Azure Automanage with an ARM template
description: Learn how to onboard an Azure Arc-enabled server to Azure Automanage with an Azure Resource Manager template.
ms.service: automanage
ms.workload: infrastructure
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.date: 02/25/2022
---

# Onboard an Azure Arc-enabled server to Automanage with an Azure Resource Manager template (ARM template) 


Follow the steps to onboard an Azure Arc-enabled server to Automanage Best Practices using an ARM template.

## Prerequisites
* You must have an Azure Arc-enabled server already registered in your subscription
* You must have necessary [Role-based access control permissions](./overview-about.md#required-rbac-permissions)
* You must use one of the [supported operating systems](./overview-about.md#prerequisites)

## ARM template overview
The following ARM template will onboard your specified Azure Arc-enabled server onto Azure Automanage Best Practices. Details on the ARM template and steps on how to deploy are located in the ARM template deployment [section](#arm-template-deployment).
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "machineName": {
            "type": "String"
        },
        "configurationProfile": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.HybridCompute/machines/providers/configurationProfileAssignments",
            "apiVersion": "2022-05-04",
            "name": "[concat(parameters('machineName'), '/Microsoft.Automanage/default')]",
            "properties": {
                "configurationProfile": "[parameters('configurationProfile')]"
            }
        }
    ]
}
```

## ARM template deployment
This ARM template will create a configuration profile assignment for your specified Azure Arc-enabled machine. 

The `configurationProfile` value can be one of the following values:
* "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction"
* "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesDevTest"
* "/subscriptions/[sub ID]/resourceGroups/resourceGroupName/providers/Microsoft.Automanage/configurationProfiles/customProfileName (for custom profiles)

Follow these steps to deploy the ARM template:
1. Save this ARM template as `azuredeploy.json`.
1. Run this ARM template deployment with `az deployment group create --resource-group myResourceGroup --template-file azuredeploy.json`.
1. Provide the values for machineName, and configurationProfileAssignment when prompted.
1. You're ready to deploy.

As with any ARM template, it's possible to factor out the parameters into a separate `azuredeploy.parameters.json` file and use that as an argument when deploying.

## Next steps
Learn more about Automanage for [Azure Arc](./automanage-arc.md).
