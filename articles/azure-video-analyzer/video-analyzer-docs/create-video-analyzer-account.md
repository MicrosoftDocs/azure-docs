---
title: Create an Azure Video Analyzer account 
description: This topic explains how to create an account for Azure Video Analyzer. 
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 05/01/2021
---

# Create a Video Analyzer account

To start using Azure Video Analyzer, you will need to create a Video Analyzer account. The account needs to be associated with a storage account and [user-assigned managed identity][docs-uami]. This article describes the steps for creating a new Video Analyzer account.

 You can use either the Azure portal or an [ARM template][docs-arm-template] to create a Video Analzyer account. Choose the tab for the method you would like to use.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## [Portal](#tab/portal/)

[!INCLUDE [the video analyzer account and storage account must be in the same subscription](./includes/note-account-storage-same-subscription.md)]

<!-- Use the portal to create a Video Analyzer account. -->

## Create a Video Analyzer account

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. Using the search bar at the top, enter **Video Analyzer**.
1. Click on *Video Analyzers* under *Services*.
1. Click **Add**.
1. In the **Create Video Analyzer account** section enter required values.

    | Name | Description |
    | ---|---|
    |**Subscription**|If you have more than one subscription, select one from the list of Azure subscriptions that you have access to.|
    |**Resource Group**|Select the new or existing resource. A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](../../../azure-resource-manager/management/overview.md#resource-groups).|
    |**Account Name**|Enter the name of the new Video Analyzer account. A Video Analyzer account name is all lowercase letters or numbers with no spaces, and is 3 to 24 characters in length.|
    |**Location**|Select the geographic region that will be used to store the video and metadata records for your Video Analyzer account. Only the available Video Analyzer regions appear in the drop-down list box. |
    |**Storage Account**|Select a storage account to provide blob storage of the video content from your Video Analyzer account. You can select an existing storage account in the same geographic region as your Video Analyzer account, or you can create a new storage account. A new storage account is created in the same region. The rules for storage account names are the same as for Video Analyzer accounts.<br/><br/>The Video Analyzer account and all associated storage accounts must be in the same Azure subscription. It is strongly recommended to use storage accounts in the same location as the Video Analyzer account to avoid additional latency and data egress costs.|
    |**TODO**| *Add content for managed identities*

1. Click **Review + ceate** at the bottom of the form.

## [Template](#tab/template/)

[!INCLUDE [the video analyzer account and storage account must be in the same subscription](./includes/note-account-storage-same-subscription.md)]

### Review the template

If your environment meets the prerequisites and you're familiar with using ARM templates, select the Deploy to Azure button. The template will open in the Azure portal.

[![Deploy to Azure](https://aka.ms/deploytoazurebutton)][click-to-deploy]

<!-- TODO replace with a reference like this:
:::code language="json" source="~/quickstart-templates/101-vm-simple-linux/azuredeploy.json":::
-->

```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "namePrefix": {
            "metadata": {
                "description": "Used to qualify the names of all of the resources created in this template."
            },
            "defaultValue": "avasample",
            "type": "string",
            "minLength": 3,
            "maxLength": 13
        }
    },
    "variables": {
        "storageAccountName": "[concat(parameters('namePrefix'),uniqueString(resourceGroup().id))]",
        "accountName": "[concat(parameters('namePrefix'),uniqueString(resourceGroup().id))]",
        "managedIdentityName": "[concat(parameters('namePrefix'),'-',resourceGroup().name,'-storage-access-identity')]"
    },
    "resources": [
        {
            "type": "Microsoft.Resources/deployments",
            "apiVersion": "2020-10-01",
            "name": "deploy-storage-and-identity",
            "properties": {
                "mode": "Incremental",
                "expressionEvaluationOptions": {
                    "scope": "Inner"
                },
                "parameters": {
                    "namePrefix": {
                        "value": "[parameters('namePrefix')]"
                    },
                    "managedIdentityName": {
                        "value": "[variables('managedIdentityName')]"
                    }
                },
                "template": {
                    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
                    "contentVersion": "1.0.0.0",
                    "parameters": {
                        "namePrefix": {
                            "type": "string"
                        },
                        "managedIdentityName": {
                            "type": "string"
                        }
                    },
                    "variables": {
                        "storageAccountName": "[concat(parameters('namePrefix'),uniqueString(resourceGroup().id))]",
                        "managedIdentityName": "[parameters('managedIdentityName')]",
                        "roleAssignmentName": "[guid('Storage Blob Data Contributor',variables('managedIdentityName'))]",
                        "roleDefinitionId": "[concat(resourceGroup().id, '/providers/Microsoft.Authorization/roleDefinitions/', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')]"
                    },
                    "resources": [
                        {
                            "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
                            "name": "[variables('managedIdentityName')]",
                            "apiVersion": "2015-08-31-preview",
                            "location": "[resourceGroup().location]"
                        },
                        {
                            "type": "Microsoft.Storage/storageAccounts",
                            "apiVersion": "2019-04-01",
                            "name": "[variables('storageAccountName')]",
                            "location": "[resourceGroup().location]",
                            "sku": {
                                "name": "Standard_LRS"
                            },
                            "kind": "StorageV2",
                            "properties": {
                                "accessTier": "Hot"
                            }
                        },
                        {
                            "name": "[concat(variables('storageAccountName'), '/Microsoft.Authorization/', variables('roleAssignmentName'))]",
                            "type": "Microsoft.Storage/storageAccounts/providers/roleAssignments",
                            "apiVersion": "2021-04-01-preview",
                            "dependsOn": [
                                "[variables('managedIdentityName')]",
                                "[variables('storageAccountName')]"
                            ],
                            "properties": {
                                "roleDefinitionId": "[variables('roleDefinitionId')]",
                                "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities',variables('managedIdentityName')), '2018-11-30').principalId]",
                                "principalType": "ServicePrincipal"
                            }
                        }
                    ],
                    "outputs": {}
                }
            }
        },
        {
            "type": "Microsoft.Media/videoAnalyzers",
            "comments": "The Azure Video Analyzer account",
            "apiVersion": "2021-05-01-preview",
            "name": "[variables('accountName')]",
            "location": "[resourceGroup().location]",
            "dependsOn": [
                "deploy-storage-and-identity"
            ],
            "properties": {
                "storageAccounts": [
                    {
                        "id": "[resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName'))]",
                        "identity": {
                            "userAssignedIdentity": "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities',variables('managedIdentityName'))]"
                        }
                    }
                ]
            },
            "identity": {
                "type": "UserAssigned",
                "userAssignedIdentities": {
                    "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities',variables('managedIdentityName'))]": {}
                }
            }
        }
    ],
    "outputs": { }
}
```

These additional resources are defined in the template:

- [**Microsoft.Storage/storageAccounts**](/azure/templates/Microsoft.Storage/storageAccounts): create a storage account.
- [**Microsoft.ManagedIdentity/userAssignedIdentities**](/azure/templates/Microsoft.ManagedIdentity/userAssignedIdentities): create a user-assigned managed identity.
- [**Microsoft.Storage/storageAccounts/providers/roleAssignments**](/azure/templates/microsoft.authorization/roleassignment): assign a role for the storage account.

### Deploy the template

1. Select the following image to sign in to Azure and open a template.

    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)][click-to-deploy]

1. Select or enter the following values. Use the default values, when available.

    - **Subscription**: select an Azure subscription.
    - **Resource group**: select an existing resource group from the drop-down, or select **Create new**, enter a unique name for the resource group, and then click **OK**.
    - **Location**: select a location.  For example, **West Central US**.
    - **Name Prefix**: provide a string that is used to prefix the name of the resources.

1. Select **Review + create**. After validation completes, select **Create** to create and deploy the VM.

The Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure CLI, Azure PowerShell, and REST API. To learn other deployment methods, see [Deploy templates](../../azure-resource-manager/templates/deploy-cli.md).

## Review deployed resources

You can use the Azure portal to check on the account and other resource that were created. After the deployment is finished, select **Go to resource group** to see the account and other resources.

## Clean up resources

When no longer needed, delete the resource group, which deletes the account and all of the resources in the resource group.

1. Select the **Resource group**.
1. On the page for the resource group, select **Delete**.
1. When prompted, type the name of the resource group and then select **Delete**.

## Next steps

<!-- links -->
[docs-uami]: /azure/active-directory/managed-identities-azure-resources/overview
[docs-arm-template]: /azure/azure-resource-manager/templates/overview
[click-to-deploy]: https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fgist.githubusercontent.com%2Fbennage%2F58523b2e6a4d3bf213f16893d894dcaf%2Fraw%2Fazuredeploy.json
