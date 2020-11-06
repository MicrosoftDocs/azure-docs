---
title: Repair a broken Automanage Account
description: Learn how to fix a broken Automanage Account
author: alsin
ms.service: virtual-machines
ms.subservice: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 11/05/2020
ms.author: alsin
---

# Repair a broken Automanage Account
The [Automanage Account](./automanage-virtual-machines.md#automanage-account) is the security context or the identity under which the automated operations occur. If you have recently moved a subscription containing an Automanage Account to a new tenant, you will need to reconfigure your Automanage Account. To reconfigure your Automanage Account, you will need to reset the identity type and assign the appropriate roles for the account.

## Step 1: Reset Automanage Account identity type
Reset the Automanage Account identity type with the ARM template below. Save the file locally as `armdeploy.json` or similar. Note down your Automanage account name and location, as those are required parameters in the ARM template.

1. Create a new ARM deployment with the template below, and use `identityType = None`
    * You may do this with Azure CLI using `az deployment sub create`. Learn more about the `az deployment sub` command [here](https://docs.microsoft.com/cli/azure/deployment/sub).
    * You may also do this with PowerShell using the `New-AzDeployment` module. Learn more about the `New AzDeployment` module [here](https://docs.microsoft.com/powershell/module/az.resources/new-azdeployment).

1. Run the same ARM template again with `identityType = SystemAssigned`

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "accountName": {
            "type": "string"
        },
        "location": {
            "type": "string"
        },
        "identityType": {
            "type": "string",
            "allowedValues": [ "None", "SystemAssigned" ]
        }
    },
    "resources": [
        {
            "apiVersion": "2020-06-30-preview",
            "name": "[parameters('accountName')]",
            "location": "[parameters('location')]",
            "type": "Microsoft.Automanage/accounts",
            "identity": {
                "type": "[parameters('identityType')]"
            }
        }
    ]
}

```

## Step 2: Assign appropriate roles for the Automanage Account
The Automanage Account requires the Contributor and Resource Policy Contributor roles on the subscription containing the VMs that Automanage is managing. You can assign these roles using the Azure Portal, ARM templates, or Azure CLI.

If you are using an ARM template or Azure CLI, you will need the principal ID of your Automanage Account (this is not necessary if you are using the Azure portal). The Principal ID is the Object ID of your Automanage account. You may find your Object ID of your Automanage account by:

1. [Azure CLI](https://docs.microsoft.com/cli/azure/ad/sp): `az ad sp list --display-name <name of your Automanage Account>`.
1. Azure portal: Navigate to **Azure Active Directory** and search for your Automanage Account by name.

### Azure portal
1. Under **Subscriptions**, navigate to the subscription containing your Automanaged VMs.
1. Navigate to **Access control (IAM)**
1. Click **Add role assignments**
1. Select the **Contributor** role and type the name of your Automanage account
1. Press **Save**
1. Repeat steps 3-5, this time with the **Resource Policy Contributor** role

### ARM template
Run the following ARM template twice, selecting one builtInRoleType value each time. You will need the Principal ID of your Automanage Account. Enter it when prompted.

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "principalId": {
            "type": "string",
            "metadata": {
                "description": "The principal to assign the role to"
            }
        },
        "builtInRoleType": {
            "type": "string",
            "allowedValues": [
                "Contributor",
                "Resource Policy Contributor"
            ],
            "metadata": {
                "description": "Built-in role to assign"
            }
        },
        "roleNameGuid": {
            "type": "string",
            "defaultValue": "[newGuid()]",
            "metadata": {
                "description": "A new GUID used to identify the role assignment"
            }
        }
    },
    "variables": {
        "Contributor": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', 'b24988ac-6180-42a0-ab88-20f7382dd24c')]",
        "Resource Policy Contributor": "[concat('/subscriptions/', subscription().subscriptionId, '/providers/Microsoft.Authorization/roleDefinitions/', '36243c78-bf99-498c-9df9-86d9f8d28608')]"
    },
    "resources": [
        {
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2018-09-01-preview",
            "name": "[parameters('roleNameGuid')]",
            "properties": {
                "roleDefinitionId": "[variables(parameters('builtInRoleType'))]",
                "principalId": "[parameters('principalId')]"
            }
        }
    ]
}
```

### Azure CLI
Run the following commands:

```azurecli
az role assignment create --assignee-object-id <your Automanage Account's object id> --role "Contributor" --scope /subscriptions/<your subscription id>

az role assignment create --assignee-object-id <your Automanage Account's object id> --role "Resource Policy Contributor" --scope /subscriptions/<your subscription id>
```

## Next steps
Learn more about Azure Automanage [here](./automanage-virtual-machines.md).