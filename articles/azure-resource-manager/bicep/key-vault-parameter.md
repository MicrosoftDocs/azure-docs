---
title: Use Azure Key Vault to Pass a Secret as a Parameter During Bicep Deployment
description: Learn how to pass a secret from a key vault as a parameter during Bicep deployment.
ms.topic: conceptual
ms.date: 01/31/2025
ms.custom: devx-track-azurepowershell, devx-track-azurecli, devx-track-bicep
---

# Use Azure Key Vault to pass a secret as a parameter during Bicep deployment

This article explains how to use Azure Key Vault to pass a secret as a parameter during Bicep deployment. Instead of entering a secure value like a password directly into your Bicep file or parameters file, you can retrieve the value from [Azure Key Vault](/azure/key-vault/general/overview) during a deployment.

When a [module](./modules.md) expects a string parameter with a `secure:true` modifier applied, you can use the [`getSecret` function](bicep-functions-resource.md#getsecret) to obtain a key vault secret. You don't expose the value because you reference only its key vault ID. 

> [!IMPORTANT]
> This article focuses on how to pass a sensitive value as a template parameter. When the secret is passed as a parameter, the key vault can exist in a different subscription than the resource group to which you're deploying.

This article doesn't cover how to set a virtual machine (VM) property to a certificate's URL in a key vault. For a quickstart template of that scenario, see [WinRM on a Windows VM](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/vm-winrm-keyvault-windows).

## Deploy key vaults and secrets

To access a key vault during Bicep deployment, set `enabledForTemplateDeployment` on the key vault to `true`.

If you already have a key vault, make sure it permits template deployments.

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az keyvault update  --name ExampleVault --enabled-for-template-deployment true
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy -VaultName ExampleVault -EnabledForTemplateDeployment
```

---

To create a new key vault and add a secret, use:

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create --name ExampleGroup --location centralus
az keyvault create \
  --name ExampleVault \
  --resource-group ExampleGroup \
  --location centralus \
  --enabled-for-template-deployment true
az keyvault secret set --vault-name ExampleVault --name "ExamplePassword" --value "hVFkk965BuUv"
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name ExampleGroup -Location centralus
New-AzKeyVault `
  -VaultName ExampleVault `
  -resourceGroupName ExampleGroup `
  -Location centralus `
  -EnabledForTemplateDeployment
$secretvalue = ConvertTo-SecureString 'hVFkk965BuUv' -AsPlainText -Force
$secret = Set-AzKeyVaultSecret -VaultName ExampleVault -Name 'ExamplePassword' -SecretValue $secretvalue
```

---

The owner of the key vault automatically has access to create secrets. If the user who is working with secrets isn't the owner of the key vault, you can grant access with:

### [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az keyvault set-policy \
  --upn <user-principal-name> \
  --name ExampleVault \
  --secret-permissions set delete get list
```

### [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$userPrincipalName = "<Email Address of the deployment operator>"

Set-AzKeyVaultAccessPolicy `
  -VaultName ExampleVault `
  -UserPrincipalName <user-principal-name> `
  -PermissionsToSecrets set,delete,get,list
```

---

For more information about creating key vaults and adding secrets, see:

- [Set and retrieve a secret by using the Azure CLI](/azure/key-vault/secrets/quick-create-cli)
- [Set and retrieve a secret by using Azure PowerShell](/azure/key-vault/secrets/quick-create-powershell)
- [Set and retrieve a secret by using the Azure portal](/azure/key-vault/secrets/quick-create-portal)
- [Set and retrieve a secret by using .NET](/azure/key-vault/secrets/quick-create-net)
- [Set and retrieve a secret by using Node.js](/azure/key-vault/secrets/quick-create-node)

## Grant access to the secrets

The user who deploys the Bicep file must have the `Microsoft.KeyVault/vaults/deploy/action` permission for the scope of the resource group and key vault. The [Owner](../../role-based-access-control/built-in-roles.md#owner) and [Contributor](../../role-based-access-control/built-in-roles.md#contributor) roles both grant this access. If you created the key vault, you're the owner and have the permission.

The following procedure shows how to create a role with the minimum permission and how to assign the user:

1. Create a custom JSON file with a role definition:

    ```json
    {
      "Name": "Key Vault Bicep deployment operator",
      "IsCustom": true,
      "Description": "Lets you deploy a Bicep file with the access to the secrets in the Key Vault.",
      "Actions": [
        "Microsoft.KeyVault/vaults/deploy/action"
      ],
      "NotActions": [],
      "DataActions": [],
      "NotDataActions": [],
      "AssignableScopes": [
        "/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e"
      ]
    }
    ```

    Replace "00000000-0000-0000-0000-000000000000" with the subscription ID.

2. Use the JSON file to create the new role:

    ### [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az role definition create --role-definition "<path-to-role-file>"
    az role assignment create \
      --role "Key Vault Bicep deployment operator" \
      --scope /subscriptions/<Subscription-id>/resourceGroups/<resource-group-name> \
      --assignee <user-principal-name>
    ```

    ### [Azure PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    New-AzRoleDefinition -InputFile "<path-to-role-file>"
    New-AzRoleAssignment `
      -ResourceGroupName ExampleGroup `
      -RoleDefinitionName "Key Vault Bicep deployment operator" `
      -SignInName <user-principal-name>
    ```

    ---

    The preceding examples assign the custom role to the user on the resource-group level.

If you use a key vault with a Bicep file for a [managed application](../managed-applications/overview.md), you must grant access to the **Appliance Resource Provider** service principal. For more information, see [Access a Key Vault secret when deploying Azure managed applications](../managed-applications/key-vault-access.md).

## Retrieve secrets in a Bicep file

You can use the [`getSecret` function](./bicep-functions-resource.md#getsecret) in a Bicep file to obtain a key vault secret. The `getSecret` function can be used only with a `Microsoft.KeyVault/vaults` resource. Additionally, it can be used only within the `params` section of a module and only with parameters that have the `@secure()` decorator.

You can use another function called `az.getSecret()` in a Bicep parameters file to retrieve key vault secrets. For more information, see [Retrieve secrets in a parameters file](#retrieve-secrets-in-a-parameters-file).

Since the `getSecret` function can be used only in the `params` section of a module, create a _sql.bicep_ file in the same directory as the _main.bicep_ file with the following content:

```bicep
param sqlServerName string
param location string = resourceGroup().location
param adminLogin string

@secure()
param adminPassword string

resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: adminLogin
    administratorLoginPassword: adminPassword
    version: '12.0'
  }
}
```

The `adminPassword` parameter has a `@secure()` decorator in the preceding file.

The following Bicep file consumes _sql.bicep_ as a module. The Bicep file references an existing key vault, calls the `getSecret` function to retrieve the key vault secret, and then passes the value as a parameter to the module:

```bicep
param sqlServerName string
param adminLogin string

param subscriptionId string
param kvResourceGroup string
param kvName string

resource kv 'Microsoft.KeyVault/vaults@2023-07-01' existing = {
  name: kvName
  scope: resourceGroup(subscriptionId, kvResourceGroup )
}

module sql './sql.bicep' = {
  name: 'deploySQL'
  params: {
    sqlServerName: sqlServerName
    adminLogin: adminLogin
    adminPassword: kv.getSecret('vmAdminPassword')
  }
}
```

## Retrieve secrets in a parameters file

If you don't want to use a module, you can retrieve key vault secrets in a parameters file. However, the approach varies depending on whether you use a JSON or Bicep parameters file.

The following Bicep file deploys a SQL server that includes an administrator password. While the password parameter is set to a secure string, Bicep doesn't specify the origin of that value:

```bicep
param sqlServerName string
param location string = resourceGroup().location
param adminLogin string

@secure()
param adminPassword string

resource sqlServer 'Microsoft.Sql/servers@2023-08-01-preview' = {
  name: sqlServerName
  location: location
  properties: {
    administratorLogin: adminLogin
    administratorLoginPassword: adminPassword
    version: '12.0'
  }
}
```

Next, create a parameters file for the preceding Bicep file.

### Bicep parameters file

The [`az.getSecret` function](./bicep-functions-parameters-file.md#getsecret) can be used in a `.bicepparam` file to retrieve the value of a secret from a key vault:

```bicep
using './main.bicep'

param sqlServerName = '<your-server-name>'
param adminLogin = '<your-admin-login>'
param adminPassword = az.getSecret('<subscription-id>', '<rg-name>', '<key-vault-name>', '<secret-name>', '<secret-version>')
```

### JSON parameters file

In a JSON parameters file, specify a parameter that matches the name of the parameter in the Bicep file. For the parameter value, reference the secret from the key vault. Pass the resource identifier of the key vault and the name of the secret. In the following parameters file, the key vault secret must already exist. You provide a static value for its resource ID.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "adminLogin": {
      "value": "<your-admin-login>"
    },
    "adminPassword": {
      "reference": {
        "keyVault": {
          "id": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.KeyVault/vaults/<key-vault-name>"
        },
        "secretName": "ExamplePassword"
      }
    },
    "sqlServerName": {
      "value": "<your-server-name>"
    }
  }
}
```

If you need to use a version of the secret other than the current one, include a `secretVersion` property:

```json
"secretName": "ExamplePassword",
"secretVersion": "cd91b2b7e10e492ebb870a6ee0591b68"
```

## Related content

- For general information about key vaults, see [About Azure Key Vault](/azure/key-vault/general/overview).
- For complete GitHub examples that demonstrate how to reference key vault secrets, see [Key vault examples](https://github.com/rjmax/ArmExamples/tree/master/keyvaultexamples).
- For a Learn module that covers how to use a key vault to pass a secure value, see [Manage complex cloud deployments by using advanced JSON ARM template features](/training/modules/manage-deployments-advanced-arm-template-features/).
