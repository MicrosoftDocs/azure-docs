---
title: Onboard a machine to Azure Automanage with an ARM template
description: Learn how to onboard a machine to Azure Automanage with an Azure Resource Manager template.
author: asinn826
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: how-to
ms.date: 04/09/2021
ms.author: alsin
---

# Onboard a machine to Automanage with an Azure Resource Manager (ARM) template


## Overview
Follow the steps below to onboard a machine to Automanage Best Practices. The ARM template below will create a `configurationProfileAssignment` object, which is the Azure resource that represents a machine that has been onboarded to Automanage.

## Prerequisites
* You must have created an existing Automanage Account and assigned it the correct permissions. See [this document](./automanage-account.md) for more information on the Automanage Account and how to create one and assign permissions.
* If you have an existing Automanage Account with permissions assigned, you must also have the **Contributor** role on the resource group containing the machines you want to onboard to Automanage.


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
        "automanageAccountName": {
            "type": "String"
        },
        "configurationProfileAssignment": {
            "type": "String"
        }
    },
    "resources": [
        {
            "type": "Microsoft.Compute/virtualMachines/providers/configurationProfileAssignments",
            "apiVersion": "2020-06-30-preview",
            "name": "[concat(parameters('machineName'), '/Microsoft.Automanage/', 'default')]",
            "properties": {
                "configurationProfile": "[parameters('configurationProfileAssignment')]",
                "accountId": "[concat(resourceGroup().id, '/providers/Microsoft.Automanage/accounts/', parameters('automanageAccountName'))]"
            }
        }
    ]
}
```

## ARM template deployment
The ARM template above will create a configuration profile assignment for your specified machine, using a specified Automanage Account. If you haven't created an Automanage Account, learn more at [this doc](./automanage-account.md).

The `configurationProfileAssignment` value can be one of the following values:
* "Production"
* "DevTest"

Follow these steps to deploy the ARM template:
1. Save the ARM template above as `azuredeploy.json`
1. Run the ARM template deployment with `az deployment group create --resource-group myResourceGroup --template-file azuredeploy.json`
1. Provide the values for machineName, automanageAccountName, and configurationProfileAssignment when prompted
1. You are done!

As with any ARM template, it is possible to factor out the parameters into a separate `azuredeploy.parameters.json` file and use that as an argument when deploying.

## Next steps
Learn more about Automanage for [Linux](./automanage-linux.md) and [Windows](./automanage-windows-server.md)