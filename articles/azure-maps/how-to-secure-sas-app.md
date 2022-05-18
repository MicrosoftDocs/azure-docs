---
title: How to secure an application in Microsoft Azure Maps with SAS token
titleSuffix: Azure Maps
description: This article describes how to configure an application to be secured with SAS token authentication.
author: stack111
ms.author: dstack
ms.date: 01/05/2022
ms.topic: how-to
ms.service: azure-maps
services: azure-maps
manager: philema
custom.ms: subject-rbac-steps
---

# Secure an application with SAS token

This article describes how to create an Azure Maps account with a SAS token that can be used to call the Azure Maps REST API.

## Prerequisites

This scenario assumes:

- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you continue.
- The current user must have subscription `Owner` role permissions on the Azure subscription to create an [Azure Key Vault](../key-vault/general/basic-concepts.md), user-assigned managed identity, assign the managed identity a role, and create an Azure Maps account.
- Azure CLI is installed to deploy the resources. Read more on [How to install the Azure CLI](/cli/azure/install-azure-cli).
- The current user is signed-in to Azure CLI with an active Azure subscription using `az login`.

## Scenario: SAS token

Applications that use SAS token authentication should store the keys in a secure store. A SAS token is a credential that grants the level of access specified during its creation to anyone who holds it, until the token expires or access is revoked. This scenario describes how to safely store your SAS token as a secret in Azure Key Vault and distribute the SAS token into a public client. Events in an application’s lifecycle may generate new SAS tokens without interrupting active connections using existing tokens. To understand how to configure Azure Key Vault, see the [Azure Key Vault developer's guide](../key-vault/general/developers-guide.md).

The following sample scenario will perform the steps outlined below with two Azure Resource Manager (ARM) template deployments:

- Create an Azure Key Vault.
- Create a user-assigned managed identity.
- Assign Azure RBAC `Azure Maps Data Reader` role to the user-assigned managed identity.
- Create a map account with a CORS configuration and attach the user-assigned managed identity.
- Create and save a SAS token into the Azure Key Vault
- Retrieve the SAS token secret from Azure Key Vault.
- Create an Azure Maps REST API request using the SAS token.

When completed, you should see output from Azure Maps `Search Address (Non-Batch)` REST API results on PowerShell with Azure CLI. The Azure resources will be deployed with permissions to connect to the Azure Maps account with controls for maximum rate limit, allowed regions, `localhost` configured CORS policy, and Azure RBAC.

### Azure resource deployment with Azure CLI

The following steps describe how to create and configure an Azure Maps account with SAS token authentication. The Azure CLI is assumed to be running in a PowerShell instance.

1. Register Key Vault, Managed Identities, and Azure Maps for your subscription

    ```azurecli
    az provider register --namespace Microsoft.KeyVault
    az provider register --namespace Microsoft.ManagedIdentity
    az provider register --namespace Microsoft.Maps
    ```

1. Retrieve your Azure AD object ID

    ```azurecli
    $id = $(az rest --method GET --url 'https://graph.microsoft.com/v1.0/me?$select=id' --headers 'Content-Type=application/json' --query "id")
    ```

1. Create a template file `prereq.azuredeploy.json` with the following content.
    
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
                    "description": "Specifies the object ID of a user, service principal or security group in the Azure Active Directory tenant for the vault. The object ID must be unique for the set of access policies. Get it by using Get-AzADUser or Get-AzADServicePrincipal cmdlets."
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

1. Deploy the prerequisite resources. Make sure to pick the location where the Azure Maps accounts is enabled.

    ```azurecli
    az group create --name {group-name} --location "East US"
    $outputs = $(az deployment group create --name ExampleDeployment --resource-group {group-name} --template-file "./prereq.azuredeploy.json" --parameters objectId=$id --query "[properties.outputs.keyVaultName.value, properties.outputs.userAssignedIdentityPrincipalId.value, properties.outputs.userIdentityResourceId.value]" --output tsv)
    ```

1. Create a template file `azuredeploy.json` to provision the Map account, role assignment, and SAS token.

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
                    "description": "Input string for new GUID associated with assigning built in role types"
                }
            },
            "startDateTime": {
                "type": "string",
                "defaultValue": "[utcNow('u')]",
                "metadata": {
                    "description": "Current Universal DateTime in ISO 8601 'u' format to be used as start of the SAS token."
                }
            },
            "duration" : {
                "type": "string",
                "defaultValue": "P1Y",
                "metadata": {
                    "description": "The duration of the SAS token, P1Y is maximum, ISO 8601 format is expected."
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
                    "description": "The specified application's web host header origins (example: https://www.azure.com) which the Maps account allows for Cross Origin Resource Sharing (CORS)."
                }
            }, 
            "allowedRegions": {
                "type": "array",
                "defaultValue": [],
                "metadata": {
                    "description": "The specified SAS token allowed locations which the token may be used."
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
                "apiVersion": "2021-12-01-preview",
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
                    "value": "[listSas(variables('accountId'), '2021-12-01-preview', variables('sasParameters')).accountSasToken]"
                }
            }
        ]
    }
    ```

1. Deploy the template using ID parameters from the Azure Key Vault and managed identity resources created in the previous step. Note that when creating the SAS token, the `allowedRegions` parameter is set to `eastus`, `westus2`, and `westcentralus`. We use these locations because we plan to make HTTP requests to the `us.atlas.microsoft.com` endpoint.

    > [!IMPORTANT]
    > We save the SAS token into the Azure Key Vault to prevent its credentials from appearing in the Azure deployment logs. The Azure Key Vault SAS token secret's `tags` also contain the start, expiry, and signing key name to help understand when the SAS token will expire.

    ```azurecli
    az deployment group create --name ExampleDeployment --resource-group {group-name} --template-file "./azuredeploy.json" --parameters keyVaultName="$($outputs[0])" userAssignedIdentityPrincipalId="$($outputs[1])" userAssignedIdentityResourceId="$($outputs[2])" allowedOrigins="['http://localhost']" allowedRegions="['eastus', 'westus2', 'westcentralus']" maxRatePerSecond="10"
    ```

1. Locate, then save a copy of the single SAS token secret from Azure Key Vault.

    ```azurecli
    $secretId = $(az keyvault secret list --vault-name $outputs[0] --query "[? contains(name,'map')].id" --output tsv)
    $sasToken = $(az keyvault secret show --id "$secretId" --query "value" --output tsv)
    ```

1. Test the SAS Token by making a request to an Azure Maps endpoint. We specify the `us.atlas.microsoft.com` to ensure that our request will be routed to the US geography because our SAS Token has allowed regions within the geography.

   ```azurecli
   az rest --method GET --url 'https://us.atlas.microsoft.com/search/address/json?api-version=1.0&query=15127 NE 24th Street, Redmond, WA 98052' --headers "Authorization=jwt-sas $($sasToken)" --query "results[].address"
   ```

## Complete example

In the current directory of the PowerShell session you should have:

- `prereq.azuredeploy.json` This creates the Key Vault and managed identity.
- `azuredeploy.json` This creates the Azure Maps account and configures the role assignment and managed identity, then stores the SAS Token into the Azure Key Vault.

```powershell
az login
az provider register --namespace Microsoft.KeyVault
az provider register --namespace Microsoft.ManagedIdentity
az provider register --namespace Microsoft.Maps

$id = $(az rest --method GET --url 'https://graph.microsoft.com/v1.0/me?$select=id' --headers 'Content-Type=application/json' --query "id")
az group create --name {group-name} --location "East US"
$outputs = $(az deployment group create --name ExampleDeployment --resource-group {group-name} --template-file "./prereq.azuredeploy.json" --parameters objectId=$id --query "[properties.outputs.keyVaultName.value, properties.outputs.userAssignedIdentityPrincipalId.value, properties.outputs.userIdentityResourceId.value]" --output tsv)
az deployment group create --name ExampleDeployment --resource-group {group-name} --template-file "./azuredeploy.json" --parameters keyVaultName="$($outputs[0])" userAssignedIdentityPrincipalId="$($outputs[1])" userAssignedIdentityResourceId="$($outputs[2])" allowedOrigins="['http://localhost']" allowedRegions="['eastus', 'westus2', 'westcentralus']" maxRatePerSecond="10"
$secretId = $(az keyvault secret list --vault-name $outputs[0] --query "[? contains(name,'map')].id" --output tsv)
$sasToken = $(az keyvault secret show --id "$secretId" --query "value" --output tsv)

az rest --method GET --url 'https://us.atlas.microsoft.com/search/address/json?api-version=1.0&query=15127 NE 24th Street, Redmond, WA 98052' --headers "Authorization=jwt-sas $($sasToken)" --query "results[].address"
```

## Clean up resources

When you no longer need the Azure resources, you can delete them:

```azurecli
az group delete --name {group-name}
```

## Next steps

For more detailed examples:
> [!div class="nextstepaction"]
> [Authentication scenarios for Azure AD](../active-directory/develop/authentication-vs-authorization.md)

Find the API usage metrics for your Azure Maps account:
> [!div class="nextstepaction"]
> [View usage metrics](how-to-view-api-usage.md)

Explore samples that show how to integrate Azure AD with Azure Maps:
> [!div class="nextstepaction"]
> [Azure Maps samples](https://github.com/Azure-Samples/Azure-Maps-AzureAD-Samples)