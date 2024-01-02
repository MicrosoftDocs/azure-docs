---
title: How to secure an Azure Maps application with a SAS token
titleSuffix: Azure Maps
description: Create an Azure Maps account secured with SAS token authentication.
author: stack111
ms.author: dstack
ms.date: 06/08/2022
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philema
ms.custom: subject-rbac-steps, kr2b-contr-experiment, devx-track-azurecli
---

# Secure an Azure Maps account with a SAS token

This article describes how to create an Azure Maps account with a securely stored SAS token you can use to call the Azure Maps REST API.

## Prerequisites

- An Azure subscription. If you don't already have an Azure account, [sign up for a free one](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- **Owner** role permission on the Azure subscription. You need the **Owner** permissions to:

  - Create a key vault in [Azure Key Vault](../key-vault/general/basic-concepts.md).
  - Create a user-assigned managed identity.
  - Assign the managed identity a role.
  - Create an Azure Maps account.

- [Azure CLI installed](/cli/azure/install-azure-cli) to deploy the resources.

## Example scenario: SAS token secure storage

A SAS token credential grants the access level it specifies to anyone who holds it, until the token expires or access is revoked. Applications that use SAS token authentication should store the keys securely.

This scenario safely stores a SAS token as a secret in Key Vault, and distributes the token into a public client. Application lifecycle events can generate new SAS tokens without interrupting active connections that use existing tokens.

For more information about configuring Key Vault, see the [Azure Key Vault developer's guide](../key-vault/general/developers-guide.md).

The following example scenario uses two Azure Resource Manager (ARM) template deployments to do the following steps:

1. Create a key vault.
1. Create a user-assigned managed identity.
1. Assign Azure role-based access control (RBAC) **Azure Maps Data Reader** role to the user-assigned managed identity.
1. Create an Azure Maps account with a [Cross Origin Resource Sharing (CORS) configuration](azure-maps-authentication.md#cross-origin-resource-sharing-cors), and attach the user-assigned managed identity.
1. Create and save a SAS token in the Azure key vault.
1. Retrieve the SAS token secret from the key vault.
1. Create an Azure Maps REST API request that uses the SAS token.

When you finish, you should see Azure Maps `Search Address (Non-Batch)` REST API results on PowerShell with Azure CLI. The Azure resources deploy with permissions to connect to the Azure Maps account. There are controls for maximum rate limit, allowed regions, `localhost` configured CORS policy, and Azure RBAC.

## Azure resource deployment with Azure CLI

The following steps describe how to create and configure an Azure Maps account with SAS token authentication. In this example, Azure CLI runs in a PowerShell instance.

1. Sign in to your Azure subscription with `az login`.

1. Register Key Vault, Managed Identities, and Azure Maps for your subscription.

   ```azurecli
   az provider register --namespace Microsoft.KeyVault
   az provider register --namespace Microsoft.ManagedIdentity
   az provider register --namespace Microsoft.Maps
   ```

1. Retrieve your Microsoft Entra object ID.

    ```azurecli
    $id = $(az rest --method GET --url 'https://graph.microsoft.com/v1.0/me?$select=id' --headers 'Content-Type=application/json' --query "id")
    ```

1. Create a template file named *prereq.azuredeploy.json* with the following content:
    
    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "location": {
                "type": "string",
                "defaultValue": "[resourceGroup().location]",
                "metadata": {
                    "description": "Specifies the location for all the resources."
                }
            },
            "keyVaultName": {
                "type": "string",
                "defaultValue": "[concat('vault', uniqueString(resourceGroup().id))]",
                "metadata": {
                    "description": "Specifies the name of the key vault."
                }
            },
            "userAssignedIdentityName": {
                "type": "string",
                "defaultValue": "[concat('identity', uniqueString(resourceGroup().id))]",
                "metadata": {
                    "description": "The name for your managed identity resource."
                }
            },
            "objectId": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the object ID of a user, service principal, or security group in the Azure AD tenant for the vault. The object ID must be unique for the set of access policies. Get it by using Get-AzADUser or Get-AzADServicePrincipal cmdlets."
                }
            },
            "secretsPermissions": {
                "type": "array",
                "defaultValue": [
                    "list",
                    "get",
                    "set"
                ],
                "metadata": {
                    "description": "Specifies the permissions to secrets in the vault. Valid values are: all, get, list, set, delete, backup, restore, recover, and purge."
                }
            }
        },
        "resources": [
            {
                "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
                "name": "[parameters('userAssignedIdentityName')]",
                "apiVersion": "2018-11-30",
                "location": "[parameters('location')]"
            },
            {
                "apiVersion": "2021-04-01-preview",
                "type": "Microsoft.KeyVault/vaults",
                "name": "[parameters('keyVaultName')]",
                "location": "[parameters('location')]",
                "properties": {
                    "tenantId": "[subscription().tenantId]",
                    "sku": {
                        "name": "Standard",
                        "family": "A"
                    },
                    "enabledForTemplateDeployment": true,
                    "accessPolicies": [
                        {
                            "objectId": "[parameters('objectId')]",
                            "tenantId": "[subscription().tenantId]",
                            "permissions": {
                                "secrets": "[parameters('secretsPermissions')]"
                            }
                        }
                    ]
                }
            }
        ],
        "outputs": {
            "userIdentityResourceId": {
                "type": "string",
                "value": "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName'))]"
            },
            "userAssignedIdentityPrincipalId": {
                "type": "string",
                "value": "[reference(parameters('userAssignedIdentityName')).principalId]"
            },
            "keyVaultName": {
                "type": "string",
                "value": "[parameters('keyVaultName')]"
            }
        }
    }
    
    ```

1. Deploy the prerequisite resources you created in the previous step. Supply your own value for `<group-name>`. Make sure to use the same `location` as the Azure Maps account.

   ```azurecli
   az group create --name <group-name> --location "East US"
   $outputs = $(az deployment group create --name ExampleDeployment --resource-group <group-name> --template-file "./prereq.azuredeploy.json" --parameters objectId=$id --query "[properties.outputs.keyVaultName.value, properties.outputs.userAssignedIdentityPrincipalId.value, properties.outputs.userIdentityResourceId.value]" --output tsv)
   ```

1. Create a template file *azuredeploy.json* to provision the Azure Maps account, role assignment, and SAS token.

    > [!NOTE]
    >
    > **Azure Maps Gen1 pricing tier retirement**
    >
    > Gen1 pricing tier is now deprecated and will be retired on 9/15/26. Gen2 pricing tier replaces Gen1 (both S0 and S1) pricing tier. If your Azure Maps account has Gen1 pricing tier selected, you can switch to Gen2 pricing before it’s retired, otherwise it will automatically be updated. For more information, see [Manage the pricing tier of your Azure Maps account].

    ```json
    {
        "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
        "contentVersion": "1.0.0.0",
        "parameters": {
            "location": {
                "type": "string",
                "defaultValue": "[resourceGroup().location]",
                "metadata": {
                    "description": "Specifies the location for all the resources."
                }
            },
            "keyVaultName": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the resourceId of the key vault."
                }
            },
            "accountName": {
                "type": "string",
                "defaultValue": "[concat('map', uniqueString(resourceGroup().id))]",
                "metadata": {
                    "description": "The name for your Azure Maps account."
                }
            },
            "userAssignedIdentityResourceId": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the resourceId for the user assigned managed identity resource."
                }
            },
            "userAssignedIdentityPrincipalId": {
                "type": "string",
                "metadata": {
                    "description": "Specifies the resourceId for the user assigned managed identity resource."
                }
            },
            "pricingTier": {
                "type": "string",
                "allowedValues": [
                    "S0",
                    "S1",
                    "G2"
                ],
                "defaultValue": "G2",
                "metadata": {
                    "description": "The pricing tier for the account. Use S0 for small-scale development. Use S1 or G2 for large-scale applications."
                }
            },
            "kind": {
                "type": "string",
                "allowedValues": [
                    "Gen1",
                    "Gen2"
                ],
                "defaultValue": "Gen2",
                "metadata": {
                    "description": "The pricing tier for the account. Use Gen1 for small-scale development. Use Gen2 for large-scale applications."
                }
            },
            "guid": {
                "type": "string",
                "defaultValue": "[guid(resourceGroup().id)]",
                "metadata": {
                    "description": "Input string for new GUID associated with assigning built in role types."
                }
            },
            "startDateTime": {
                "type": "string",
                "defaultValue": "[utcNow('u')]",
                "metadata": {
                    "description": "Current Universal DateTime in ISO 8601 'u' format to use as the start of the SAS token."
                }
            },
            "duration" : {
                "type": "string",
                "defaultValue": "P1Y",
                "metadata": {
                    "description": "The duration of the SAS token. P1Y is maximum, ISO 8601 format is expected."
                }
            },
            "maxRatePerSecond": {
                "type": "int",
                "defaultValue": 500,
                "minValue": 1,
                "maxValue": 500,
                "metadata": {
                    "description": "The approximate maximum rate per second the SAS token can be used."
                }
            },
            "signingKey": {
                "type": "string",
                "defaultValue": "primaryKey",
                "allowedValues": [
                    "primaryKey",
                    "seconaryKey"
                ],
                "metadata": {
                    "description": "The specified signing key which will be used to create the SAS token."
                }
            },
            "allowedOrigins": {
                "type": "array",
                "defaultValue": [],
                "maxLength": 10,
                "metadata": {
                    "description": "The specified application's web host header origins (example: https://www.azure.com) which the Azure Maps account allows for CORS."
                }
            }, 
            "allowedRegions": {
                "type": "array",
                "defaultValue": [],
                "metadata": {
                    "description": "The specified SAS token allowed locations where the token may be used."
                }
            }
        },
        "variables": {
            "accountId": "[resourceId('Microsoft.Maps/accounts', parameters('accountName'))]",
            "Azure Maps Data Reader": "[subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '423170ca-a8f6-4b0f-8487-9e4eb8f49bfa')]",
            "sasParameters": {
                "signingKey": "[parameters('signingKey')]",
                "principalId": "[parameters('userAssignedIdentityPrincipalId')]",
                "maxRatePerSecond": "[parameters('maxRatePerSecond')]",
                "start": "[parameters('startDateTime')]",
                "expiry": "[dateTimeAdd(parameters('startDateTime'), parameters('duration'))]",
                "regions": "[parameters('allowedRegions')]"
            }
        },
        "resources": [
            {
                "name": "[parameters('accountName')]",
                "type": "Microsoft.Maps/accounts",
                "apiVersion": "2023-06-01",
                "location": "[parameters('location')]",
                "sku": {
                    "name": "[parameters('pricingTier')]"
                },
                "kind": "[parameters('kind')]",
                "properties": {
                    "cors": {
                        "corsRules": [
                            {
                                "allowedOrigins": "[parameters('allowedOrigins')]"
                            }
                        ]
                    }
                },
                "identity": {
                    "type": "UserAssigned",
                    "userAssignedIdentities": {
                        "[parameters('userAssignedIdentityResourceId')]": {}
                    }
                }
            },
            {
                "apiVersion": "2020-04-01-preview",
                "name": "[concat(parameters('accountName'), '/Microsoft.Authorization/', parameters('guid'))]",
                "type": "Microsoft.Maps/accounts/providers/roleAssignments",
                "dependsOn": [
                    "[parameters('accountName')]"
                ],
                "properties": {
                    "roleDefinitionId": "[variables('Azure Maps Data Reader')]",
                    "principalId": "[parameters('userAssignedIdentityPrincipalId')]",
                    "principalType": "ServicePrincipal"
                }
            },
            {
                "apiVersion": "2021-04-01-preview",
                "type": "Microsoft.KeyVault/vaults/secrets",
                "name": "[concat(parameters('keyVaultName'), '/', parameters('accountName'))]",
                "dependsOn": [
                    "[variables('accountId')]"
                ],
                "tags": {
                    "signingKey": "[variables('sasParameters').signingKey]",
                    "start" : "[variables('sasParameters').start]",
                    "expiry" : "[variables('sasParameters').expiry]"
                },
                "properties": {
                    "value": "[listSas(variables('accountId'), '2023-06-01', variables('sasParameters')).accountSasToken]"
                }
            }
        ]
    }
    ```

1. Deploy the template with the ID parameters from the Key Vault and managed identity resources you created in the previous step. Supply your own value for `<group-name>`. When creating the SAS token, you set the `allowedRegions` parameter to `eastus`, `westus2`, and `westcentralus`. You can then use these locations to make HTTP requests to the `us.atlas.microsoft.com` endpoint.

   > [!IMPORTANT]
   > You save the SAS token in the key vault to prevent its credentials from appearing in the Azure deployment logs. The SAS token secret's `tags` also contain the start, expiry, and signing key name, to show when the SAS token will expire.

   ```azurecli
    az deployment group create --name ExampleDeployment --resource-group <group-name> --template-file "./azuredeploy.json" --parameters keyVaultName="$($outputs[0])" userAssignedIdentityPrincipalId="$($outputs[1])" userAssignedIdentityResourceId="$($outputs[2])" allowedOrigins="['http://localhost']" allowedRegions="['eastus', 'westus2', 'westcentralus']" maxRatePerSecond="10"
   ```

1. Locate and save a copy of the single SAS token secret from Key Vault.

   ```azurecli
   $secretId = $(az keyvault secret list --vault-name $outputs[0] --query "[? contains(name,'map')].id" --output tsv)
   $sasToken = $(az keyvault secret show --id "$secretId" --query "value" --output tsv)
   ```

1. Test the SAS token by making a request to an Azure Maps endpoint. This example specifies the `us.atlas.microsoft.com` to ensure your request routes to US geography. Your SAS token allows regions within the US geography.

   ```azurecli
   az rest --method GET --url 'https://us.atlas.microsoft.com/search/address/json?api-version=1.0&query=1 Microsoft Way, Redmond, WA 98052' --headers "Authorization=jwt-sas $($sasToken)" --query "results[].address"
   ```

## Complete script example

To run the complete example, the following template files must be in the same directory as the current PowerShell session:

- *prereq.azuredeploy.json* to create the key vault and managed identity.
- *azuredeploy.json* to create the Azure Maps account, configure the role assignment and managed identity, and store the SAS token in the key vault.

```powershell
az login
az provider register --namespace Microsoft.KeyVault
az provider register --namespace Microsoft.ManagedIdentity
az provider register --namespace Microsoft.Maps

$id = $(az rest --method GET --url 'https://graph.microsoft.com/v1.0/me?$select=id' --headers 'Content-Type=application/json' --query "id")
az group create --name <group-name> --location "East US"
$outputs = $(az deployment group create --name ExampleDeployment --resource-group <group-name> --template-file "./prereq.azuredeploy.json" --parameters objectId=$id --query "[properties.outputs.keyVaultName.value, properties.outputs.userAssignedIdentityPrincipalId.value, properties.outputs.userIdentityResourceId.value]" --output tsv)
az deployment group create --name ExampleDeployment --resource-group <group-name> --template-file "./azuredeploy.json" --parameters keyVaultName="$($outputs[0])" userAssignedIdentityPrincipalId="$($outputs[1])" userAssignedIdentityResourceId="$($outputs[2])" allowedOrigins="['http://localhost']" allowedRegions="['eastus', 'westus2', 'westcentralus']" maxRatePerSecond="10"
$secretId = $(az keyvault secret list --vault-name $outputs[0] --query "[? contains(name,'map')].id" --output tsv)
$sasToken = $(az keyvault secret show --id "$secretId" --query "value" --output tsv)

az rest --method GET --url 'https://us.atlas.microsoft.com/search/address/json?api-version=1.0&query=1 Microsoft Way, Redmond, WA 98052' --headers "Authorization=jwt-sas $($sasToken)" --query "results[].address"
```

## Real-world example

You can run requests to Azure Maps APIs from most clients, like C#, Java, or JavaScript. [Postman](https://learning.postman.com/docs/sending-requests/generate-code-snippets) converts an API request into a basic client code snippet in almost any programming language or framework you choose. You can use this generated code snippet in your front-end applications.

The following small JavaScript code example shows how you could use your SAS token with the JavaScript [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#supplying_request_options) to get and return Azure Maps information. The example uses [Get Search Address](/rest/api/maps/search/get-search-address) API version 1.0. Supply your own value for `<your SAS token>`.

For this sample to work, make sure to run it from within the same origin as the `allowedOrigins` for the API call. For example, if you provide `https://contoso.com` as the `allowedOrigins` in the API call, the HTML page that hosts the JavaScript script should be `https://contoso.com`.

```javascript
async function getData(url = 'https://us.atlas.microsoft.com/search/address/json?api-version=1.0&query=1 Microsoft Way, Redmond, WA 98052') {
  const response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'jwt-sas <your SAS token>',
    }
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

postData('https://us.atlas.microsoft.com/search/address/json?api-version=1.0&query=1 Microsoft Way, Redmond, WA 98052')
  .then(data => {
    console.log(data); // JSON data parsed by `data.json()` call
  });
```

## Clean up resources

When you no longer need the Azure resources, you can delete them:

```azurecli
az group delete --name {group-name}
```

## Next steps

Deploy a quickstart ARM template to create an Azure Maps account that uses a SAS token:
> [!div class="nextstepaction"]
> [Create an Azure Maps account](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.maps/maps-use-sas)

For more detailed examples, see:
> [!div class="nextstepaction"]
> [Authentication scenarios for Microsoft Entra ID](../active-directory/develop/authentication-vs-authorization.md)

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Microsoft Entra ID with Azure Maps:
> [!div class="nextstepaction"]
> [Azure Maps samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)

[Manage the pricing tier of your Azure Maps account]: how-to-manage-pricing-tier.md
