---
title: Key Vault secret with template
description: Shows how to pass a secret from a key vault as a parameter during deployment.
ms.topic: how-to
ms.date: 06/20/2024
ms.custom: devx-track-azurepowershell, devx-track-azurecli
---

# Use Azure Key Vault to pass secure parameter value during deployment

Instead of putting a secure value (like a password) directly in your template or parameter file, you can retrieve the value from an [Azure Key Vault](/azure/key-vault/general/overview) during a deployment. You retrieve the value by referencing the key vault and secret in your parameter file. The value is never exposed because you only reference its key vault ID.

> [!IMPORTANT]
> This article focuses on how to pass a sensitive value as a template parameter. When the secret is passed as a parameter, the key vault can exist in a different subscription than the resource group you're deploying to.
>
> This article doesn't cover how to set a virtual machine property to a certificate's URL in a key vault. For a quickstart template of that scenario, see [Install a certificate from Azure Key Vault on a Virtual Machine](https://github.com/Azure/azure-quickstart-templates/tree/master/demos/vm-winrm-keyvault-windows).

## Deploy key vaults and secrets

To access a key vault during template deployment, set `enabledForTemplateDeployment` on the key vault to `true`.

If you already have a key vault, make sure it allows template deployments.

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az keyvault update  --name ExampleVault --enabled-for-template-deployment true
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Set-AzKeyVaultAccessPolicy -VaultName ExampleVault -EnabledForTemplateDeployment
```

---

To create a new key vault and add a secret, use:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create --name ExampleGroup --location centralus
az keyvault create \
  --name ExampleVault \
  --resource-group ExampleGroup \
  --location centralus \
  --enabled-for-template-deployment true
az keyvault secret set --vault-name ExampleVault --name "ExamplePassword" --value "hVFkk965BuUv"
```

# [PowerShell](#tab/azure-powershell)

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

As the owner of the key vault, you automatically have access to create secrets. If you need to let another user create secrets, use:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az keyvault set-policy \
  --upn <user-principal-name> \
  --name ExampleVault \
  --secret-permissions set delete get list
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
$userPrincipalName = "<Email Address of the deployment operator>"

Set-AzKeyVaultAccessPolicy `
  -VaultName ExampleVault `
  -UserPrincipalName <user-principal-name> `
  -PermissionsToSecrets set,delete,get,list
```

---

The access policies aren't needed if the user is deploying a template that retrieves a secret. Add a user to the access policies only if the user needs to work directly with the secrets. The deployment permissions are defined in the next section.

For more information about creating key vaults and adding secrets, see:

- [Set and retrieve a secret by using CLI](/azure/key-vault/secrets/quick-create-cli)
- [Set and retrieve a secret by using PowerShell](/azure/key-vault/secrets/quick-create-powershell)
- [Set and retrieve a secret by using the portal](/azure/key-vault/secrets/quick-create-portal)
- [Set and retrieve a secret by using .NET](/azure/key-vault/secrets/quick-create-net)
- [Set and retrieve a secret by using Node.js](/azure/key-vault/secrets/quick-create-node)

## Grant deployment access to the secrets

The user who deploys the template must have the `Microsoft.KeyVault/vaults/deploy/action` permission for the scope of the resource group and key vault. By checking this access, Azure Resource Manager prevents an unapproved user from accessing the secret by passing in the resource ID for the key vault. You can grant deployment access to users without granting write access to the secrets.

The [Owner](../../role-based-access-control/built-in-roles.md#owner) and [Contributor](../../role-based-access-control/built-in-roles.md#contributor) roles both grant this access. If you created the key vault, you're the owner and have the permission.

For other users, grant the `Microsoft.KeyVault/vaults/deploy/action` permission. The following procedure shows how to create a role with the minimum permission, and assign it to a user.

1. Create a custom role definition JSON file:

    ```json
    {
      "Name": "Key Vault resource manager template deployment operator",
      "IsCustom": true,
      "Description": "Lets you deploy a resource manager template with the access to the secrets in the Key Vault.",
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

2. Create the new role using the JSON file:

    # [Azure CLI](#tab/azure-cli)

    ```azurecli-interactive
    az role definition create --role-definition "<path-to-role-file>"
    az role assignment create \
      --role "Key Vault resource manager template deployment operator" \
      --scope /subscriptions/<Subscription-id>/resourceGroups/<resource-group-name> \
      --assignee <user-principal-name> \
      --resource-group ExampleGroup
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell-interactive
    New-AzRoleDefinition -InputFile "<path-to-role-file>"
    New-AzRoleAssignment `
      -ResourceGroupName ExampleGroup `
      -RoleDefinitionName "Key Vault resource manager template deployment operator" `
      -SignInName <user-principal-name>
    ```

    ---

    The samples assign the custom role to the user on the resource group level.

When using a key vault with the template for a [Managed Application](../managed-applications/overview.md), you must grant access to the **Appliance Resource Provider** service principal. For more information, see [Access Key Vault secret when deploying Azure Managed Applications](../managed-applications/key-vault-access.md).

## Reference secrets with static ID

With this approach, you reference the key vault in the parameter file, not the template. The following image shows how the parameter file references the secret and passes that value to the template.

:::image type="content" source="./media/key-vault-parameter/statickeyvault.png" alt-text="Diagram showing Resource Manager key vault integration with Static ID.":::

[Tutorial: Integrate Azure Key Vault in Resource Manager Template deployment](./template-tutorial-use-key-vault.md) uses this method.

The following template deploys a SQL server that includes an administrator password. The password parameter is set to a secure string. But the template doesn't specify where that value comes from.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "sqlServerName": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "adminLogin": {
      "type": "string"
    },
    "adminPassword": {
      "type": "securestring"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Sql/servers",
      "apiVersion": "2021-11-01",
      "name": "[parameters('sqlServerName')]",
      "location": "[parameters('location')]",
      "properties": {
        "administratorLogin": "[parameters('adminLogin')]",
        "administratorLoginPassword": "[parameters('adminPassword')]",
        "version": "12.0"
      }
    }
  ]
}
```

Now, create a parameter file for the preceding template. In the parameter file, specify a parameter that matches the name of the parameter in the template. For the parameter value, reference the secret from the key vault. You reference the secret by passing the resource identifier of the key vault and the name of the secret:

In the following parameter file, the key vault secret must already exist, and you provide a static value for its resource ID.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "adminLogin": {
      "value": "exampleadmin"
    },
    "adminPassword": {
      "reference": {
        "keyVault": {
          "id": "/subscriptions/<subscription-id>/resourceGroups/<rg-name>/providers/Microsoft.KeyVault/vaults/<vault-name>"
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

If you need to use a version of the secret other than the current version, include the `secretVersion` property.

```json
"secretName": "ExamplePassword",
"secretVersion": "cd91b2b7e10e492ebb870a6ee0591b68"
```

Deploy the template and pass in the parameter file:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az group create --name SqlGroup --location westus2
az deployment group create \
  --resource-group SqlGroup \
  --template-uri <template-file-URI> \
  --parameters <parameter-file>
```

# [PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment `
  -ResourceGroupName $resourceGroupName `
  -TemplateUri <template-file-URI> `
  -TemplateParameterFile <parameter-file>
```

---

## Reference secrets with dynamic ID

The previous section showed how to pass a static resource ID for the key vault secret from the parameter. In some scenarios, you need to reference a key vault secret that varies based on the current deployment. Or you may want to pass parameter values to the template rather than create a reference parameter in the parameter file. The solution is to dynamically generate the resource ID for a key vault secret by using a linked template.

You can't dynamically generate the resource ID in the parameters file because template expressions aren't allowed in the parameters file.

In your parent template, you add the nested template and pass in a parameter that contains the dynamically generated resource ID. The following image shows how a parameter in the linked template references the secret.

:::image type="content" source="./media/key-vault-parameter/dynamickeyvault.png" alt-text="Diagram illustrating dynamic ID generation for key vault secret.":::

The following template dynamically creates the key vault ID and passes it as a parameter.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "location": {
        "type": "string",
        "defaultValue": "[resourceGroup().location]",
        "metadata": {
          "description": "The location where the resources will be deployed."
        }
      },
      "vaultName": {
        "type": "string",
        "metadata": {
          "description": "The name of the keyvault that contains the secret."
        }
      },
      "secretName": {
        "type": "string",
        "metadata": {
          "description": "The name of the secret."
        }
      },
      "vaultResourceGroupName": {
        "type": "string",
        "metadata": {
          "description": "The name of the resource group that contains the keyvault."
        }
      },
      "vaultSubscription": {
        "type": "string",
        "defaultValue": "[subscription().subscriptionId]",
        "metadata": {
          "description": "The name of the subscription that contains the keyvault."
        }
      }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2020-10-01",
      "name": "dynamicSecret",
      "properties": {
        "mode": "Incremental",
        "expressionEvaluationOptions": {
          "scope": "inner"
        },
        "template": {
          "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
          "contentVersion": "1.0.0.0",
          "parameters": {
            "adminLogin": {
              "type": "string"
            },
            "adminPassword": {
              "type": "securestring"
            },
            "location": {
              "type": "string"
            }
          },
          "variables": {
            "sqlServerName": "[concat('sql-', uniqueString(resourceGroup().id, 'sql'))]"
          },
          "resources": [
            {
              "type": "Microsoft.Sql/servers",
              "apiVersion": "2021-11-01",
              "name": "[variables('sqlServerName')]",
              "location": "[parameters('location')]",
              "properties": {
                "administratorLogin": "[parameters('adminLogin')]",
                "administratorLoginPassword": "[parameters('adminPassword')]"
              }
            }
          ],
          "outputs": {
            "sqlFQDN": {
              "type": "string",
              "value": "[reference(variables('sqlServerName')).fullyQualifiedDomainName]"
            }
          }
        },
        "parameters": {
          "location": {
            "value": "[parameters('location')]"
          },
          "adminLogin": {
            "value": "ghuser"
          },
          "adminPassword": {
            "reference": {
              "keyVault": {
                "id": "[resourceId(parameters('vaultSubscription'), parameters('vaultResourceGroupName'), 'Microsoft.KeyVault/vaults', parameters('vaultName'))]"
              },
              "secretName": "[parameters('secretName')]"
            }
          }
        }
      }
    }
  ]
}
```

## Next steps

- For general information about key vaults, see [What is Azure Key Vault?](/azure/key-vault/general/overview)
- For complete examples of referencing key secrets, see [key vault examples](https://github.com/rjmax/ArmExamples/tree/master/keyvaultexamples) on GitHub.
- For a Learn module that covers passing a secure value from a key vault, see [Manage complex cloud deployments by using advanced ARM template features](/training/modules/manage-deployments-advanced-arm-template-features/).
