---
title: Onboard a machine to Azure Automanage with an ARM template
description: Learn how to onboard a machine to Azure Automanage with an Azure Resource Manager template.
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 04/09/2021
---

# Onboard a machine to Automanage with an Azure Resource Manager (ARM) template


## Overview
Follow the steps below to onboard a machine to Automanage Best Practices using an ARM template.

## Prerequisites
* You must have necessary [RBAC permissions](./automanage-virtual-machines.md#required-rbac-permissions)
* You must be in a supported region and supported VM image highlighted in these [prerequisites](./automanage-virtual-machines.md#prerequisites)


## ARM template overview
The following ARM template will onboard your specified machine onto Azure Automanage Best Practices. Details on the ARM template and steps on how to deploy are located in the ARM template deployment section [below](#arm-template-deployment).
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
            "type": "Microsoft.Compute/virtualMachines/providers/configurationProfileAssignments",
            "apiVersion": "2021-04-30-preview",
            "name": "[concat(parameters('machineName'), '/Microsoft.Automanage/default')]",
            "properties": {
                "configurationProfile": "[parameters('configurationProfile')]",
            }
        }
    ]
}
```

## ARM template deployment
The ARM template above will create a configuration profile assignment for your specified machine. 

The `configurationProfile` value can be one of the following values:
* "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesProduction"
* "/providers/Microsoft.Automanage/bestPractices/AzureBestPracticesDevTest"

Follow these steps to deploy the ARM template:
1. Save the ARM template above as `azuredeploy.json`
1. Run the ARM template deployment with `az deployment group create --resource-group myResourceGroup --template-file azuredeploy.json`
1. Provide the values for machineName, automanageAccountName, and configurationProfileAssignment when prompted
1. You are done!

As with any ARM template, it is possible to factor out the parameters into a separate `azuredeploy.parameters.json` file and use that as an argument when deploying.

## Next steps
Learn more about Automanage for [Linux](./automanage-linux.md) and [Windows](./automanage-windows-server.md)