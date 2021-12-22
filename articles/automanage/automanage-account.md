---
title: Azure Automanage Account
description: Learn how an Automanage Account works and how to create one.
ms.service: automanage
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 12/10/2021
---

# Automanage Accounts

The Automanage account is the identity that is used by the Automanage service to perform its automated operations.

In the Azure portal experience, when you are enabling Automanage on your VMs, there is an Advanced dropdown on the **Enable Azure VM best practice** blade that allows you to assign or manually create the Automanage Account.

The Automanage Account will be granted both **Contributor** and **Resource Policy Contributor** roles to the subscription(s) containing the machine(s) you onboard to Automanage. You may use the same Automanage Account on machines across multiple subscriptions, which will grant that Automanage Account **Contributor** and **Resource Policy Contributor** permissions on all subscriptions.

If your VM is connected to a Log Analytics workspace in another subscription, the Automanage Account will be granted both **Contributor** and **Resource Policy Contributor** in that other subscription as well.

If you are enabling Automanage with a new Automanage Account, you need the following permissions on your subscription: **Owner** role or **Contributor** along with **User Access Administrator** roles.

If you are enabling Automanage with an existing Automanage Account, you need to have the **Contributor** role on the resource group containing your VMs.

> [!NOTE]
> When you disable Automanage Best Practices, the Automanage Account's permissions on any associated subscriptions will remain. Manually remove the permissions by going to the subscription's IAM page or delete the Automanage Account. The Automanage Account cannot be deleted if it is still managing any machines.

## Create an Automanage Account
You may create an Automanage Account using the portal or using an ARM template.

### Portal
1. Navigate to the **Automanage** blade in the portal
1. Click **Enable on existing machine**
1. Under **Advanced**, click "Create a new account"
1. Fill in the required fields and click **Create**

### ARM template
Creating an Automanage Account using an ARM template requires 2 steps:
1. Create the Automanage Account
1. Grant sufficient permissions to the account to allow it to perform operations for you
    1. You will need the Object ID of the account you created for this step.
        1. Steps to find details of your account's service principal (including the Object ID) are available [here](../active-directory/managed-identities-azure-resources/how-to-view-managed-identity-service-principal-portal.md#view-the-service-principal).
    1. Once you have found your service principal, copy the **Object ID**. Save this as you will need it to delegate permissions below.

#### 1. Create Automanage Account (does not grant permissions to it)
To create an Automanage Account, save the following ARM template as `azuredeploy.json` and run the Azure CLI command below. Once you are done, move on to the second template below to delegate sufficient permissions to the account.

```azurecli-interactive
az deployment group create --resource-group <resource group name> --template-file azuredeploy.json
```

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "automanageAccountName": {
            "type": "String"
        },
        "location": {
            "type": "String"
        }
    },
    "resources": [
        {
            "apiVersion": "2020-06-30-preview",
            "type": "Microsoft.Automanage/accounts",
            "name": "[parameters('automanageAccountName')]",
            "location": "[parameters('location')]",
            "identity": {
                "type": "SystemAssigned"
            }
        }
    ]
}
```
#### 2. Grant permissions to the Automanage Account
To grant sufficient permissions to the Automanage Account, you will need to do the following:
1. Save the following ARM template as `azuredeploy2.json` and run the Azure CLI command below.
1. When prompted, enter the Object ID of the Automanage Account you created and saved down.

```azurecli-interactive
az deployment sub create --location <location> --template-file azuredeploy2.json
```

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "principalId": {
            "type": "string",
            "metadata": {
                "description": "The principal to assign the role to"
            }
        },
        "dateTime": {
            "type": "string",
            "defaultValue": "[utcNow()]"
        }
    },
    "variables": {
        "contributorRoleDefinitionID": "/providers/Microsoft.Authorization/roledefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
        "resourcePolicyContributorRoleDefinitionID": "/providers/Microsoft.Authorization/roledefinitions/36243c78-bf99-498c-9df9-86d9f8d28608"
    },
    "resources": [
        {
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2020-04-01-preview",
            "name": "[guid(concat(parameters('dateTime'), variables('contributorRoleDefinitionID')))]",
            "properties": {
                "roleDefinitionId": "[variables('contributorRoleDefinitionID')]",
                "principalId": "[parameters('principalId')]"
            }
        },
        {
            "type": "Microsoft.Authorization/roleAssignments",
            "apiVersion": "2020-04-01-preview",
            "name": "[guid(concat(parameters('dateTime'), variables('resourcePolicyContributorRoleDefinitionID')))]",
            "properties": {
                "roleDefinitionId": "[variables('resourcePolicyContributorRoleDefinitionID')]",
                "principalId": "[parameters('principalId')]"
            }
        }
    ]
}
```

## Next steps
* Learn about Automanage services for [Linux](./automanage-linux.md) and [Windows](./automanage-windows-server.md)