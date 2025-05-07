---
title: Onboard a machine to Azure Automanage with an ARM template
description: Learn how to onboard a machine to Azure Automanage with an Azure Resource Manager template.
ms.service: azure-automanage
ms.custom: devx-track-arm-template
ms.topic: how-to
ms.date: 12/10/2021
---

# Onboard a machine to Automanage with an Azure Resource Manager (ARM) template

> [!CAUTION]
> On September 30, 2027, the Azure Automanage Best Practices service will be retired. As a result, attempting to create a new configuration profile or onboarding a new subscription to the service will result in an error. Learn more [here](https://aka.ms/automanagemigration/) about how to migrate to Azure Policy before that date. 

> [!CAUTION]
> Starting February 1st 2025, Azure Automanage will begin rolling out changes to halt support and enforcement for all services dependent on the deprecated Microsoft Monitoring Agent (MMA). To continue using Change Tracking and Management, VM Insights, Update Management, and Azure Automation, [migrate to the new Azure Monitor Agent (AMA)][01].

## Overview
Follow the steps to onboard a machine to Automanage Best Practices using an ARM template.

## Prerequisites
* You must have necessary [Role-based access control permissions](./overview-about.md#required-rbac-permissions)
* You must be in a supported region and supported VM image highlighted in these [prerequisites](./overview-about.md#prerequisites)


## ARM template overview
The following ARM template will onboard your specified machine onto Azure Automanage Best Practices. Details on the ARM template and steps on how to deploy are located in the ARM template deployment [section](#arm-template-deployment).
```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "machineName": {
            "type": "String"
        },
        "configurationProfileName": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Compute/virtualMachines/providers/configurationProfileAssignments",
            "apiVersion": "2022-05-04",
            "name": "[concat(parameters('machineName'), '/Microsoft.Automanage/default')]",
            "properties": {
                "configurationProfile": "[parameters('configurationProfileName')]"
            }
        }
    ]
}
```

## ARM template deployment
This ARM template will create a configuration profile assignment for your specified machine. 

The `configurationProfile` value can be one of the following values:
* "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction"
* "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesDevTest"
* "/subscriptions/[sub ID]/resourceGroups/resourceGroupName/providers/Microsoft.Automanage/configurationProfiles/customProfileName (for custom profiles)

Follow these steps to deploy the ARM template:
1. Save this ARM template as `azuredeploy.json`
1. Run this ARM template deployment with `az deployment group create --resource-group myResourceGroup --template-file azuredeploy.json`
1. Provide the values for machineName, and configurationProfileName when prompted
1. You're ready to deploy

As with any ARM template, it's possible to factor out the parameters into a separate `azuredeploy.parameters.json` file and use that as an argument when deploying.

## Next steps
Learn more about Automanage for [Linux](./automanage-linux.md) and [Windows](./automanage-windows-server.md)

<!-- Link reference definitions -->
[01]: https://aka.ms/mma-to-ama

