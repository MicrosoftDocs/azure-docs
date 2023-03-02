---
title: Create a Video Analyzer account
description: This topic explains how to create an account for Azure Video Analyzer.
ms.service: azure-video-analyzer
ms.topic: how-to
ms.date: 11/04/2021
ms.custom: ignite-fall-2021
---

# Create a Video Analyzer account

[!INCLUDE [deprecation notice](./includes/deprecation-notice.md)]

To start using Azure Video Analyzer, you will need to create a Video Analyzer account. The account needs to be associated with a storage account and at least one [user-assigned managed identity][docs-uami](UAMI). The UAMI will need to have the permissions of the [Storage Blob Data Contributor][docs-storage-access] role and [Reader][docs-role-reader] role to your storage account. You can optionally associate an IoT Hub with your Video Analyzer account – this is needed if you use Video Analyzer edge module as a [transparent gateway](./cloud/use-remote-device-adapter.md). If you do so, then you will need to add a UAMI which has [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role permissions. You can use the same UAMI for both storage account and IoT Hub, or separate UAMIs.

This article describes the steps for creating a new Video Analyzer account. You can use the Azure portal or an [Azure Resource Manager (ARM) template][docs-arm-template]. Choose the tab for the method you would like to use.

[!INCLUDE [quickstarts-free-trial-note](../../../includes/quickstarts-free-trial-note.md)]

## [Portal](#tab/portal/)

[!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](./includes/note-account-storage-same-subscription.md)]

### Create a Video Analyzer account in the Azure portal

1. Sign in at the [Azure portal](https://portal.azure.com/).
1. Using the search bar at the top, enter **Video Analyzer**.
1. Click on *Video Analyzers* under *Services*.
1. Click **Create**.
1. In the **Create Video Analyzer account** section enter required values.

    | Name | Description |
    | ---|---|
    |**Subscription**|If you have more than one subscription, select one from the list of Azure subscriptions that you have access to.|
    |**Resource Group**|Select an existing resource or create a new one. A resource group is a collection of resources that share lifecycle, permissions, and policies. Learn more [here](../../azure-resource-manager/management/overview.md#resource-groups).|
    |**Video Analyzer account name**|Enter the name of the new Video Analyzer account. A Video Analyzer account name is all lowercase letters or numbers with no spaces, and is 3 to 24 characters in length.|
    |**Location**|Select the geographic region that will be used to store the video and metadata records for your Video Analyzer account. Only the available Video Analyzer regions appear in the drop-down list box. |
    |**Storage account**|Select a storage account to provide blob storage of the video content for your Video Analyzer account. You can select an existing storage account in the same geographic region as your Video Analyzer account, or you can create a new storage account. A new storage account is created in the same region. The rules for storage account names are the same as for Video Analyzer accounts.<br/>|
    |**Managed identity**|Select a user-assigned managed identity that the new Video Analyzer account will use to access the storage account. You can select an existing user-assigned managed identity or you can create a new one. The user-assignment managed identity will be assigned the roles of [Storage Blob Data Contributor][docs-storage-access] and [Reader][docs-role-reader] for the storage account.

1. Click **Review + create** at the bottom of the form.

### Post deployment steps
You can choose to attach an existing IoT Hub to the Video Analyzer account and this will require an existing UAMI.

1. Click **Go to resource** after the resource has finished deploying.
1. Under settings select **IoT Hub**, then click on **Attach**.  In the **Attach IoT Hub** configuration fly-out blade enter the required values:
     - Subscription - Select the Azure subscription name under which the IoT Hub has been created
     - IoT Hub - Select the desired IoT Hub
     - Managed Identity - Select the existing UAMI to be used to access the IoT Hub
1. Click on **Save** to link IoT Hub to your Video Analyzer account.

## [Template](#tab/template/)

[!INCLUDE [the video analyzer account and storage account must be in the same subscription and region](./includes/note-account-storage-same-subscription.md)]

### Create a Video Analyzer account using a template

The following resources are defined in the template:

- [**Microsoft.Media/videoAnalyzers**](/azure/templates/Microsoft.Media/videoAnalyzers): the account resource for Video Analyzer.
- [**Microsoft.Storage/storageAccounts**](/azure/templates/Microsoft.Storage/storageAccounts): the storage account that will be used by Video Analyzer for storing videos and metadata.
- [**Microsoft.ManagedIdentity/userAssignedIdentities**](/azure/templates/Microsoft.ManagedIdentity/userAssignedIdentities): the user-assigned managed identity that Video Analyzer will use to access storage.
- [**Microsoft.Storage/storageAccounts/providers/roleAssignments**](/azure/templates/microsoft.authorization/roleassignments): the role assignments that enables Video Analyzer to access the storage account.

<!-- TODO replace with a reference like this:
:::code language="json" source="~/quickstart-templates/quickstarts/microsoft.compute/vm-simple-linux/azuredeploy.json":::
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
                        "storageBlobDataContributorAssignment": "[guid('Storage Blob Data Contributor',variables('managedIdentityName'))]",
                        "storageBlobDataContributorDefinitionId": "[concat(resourceGroup().id, '/providers/Microsoft.Authorization/roleDefinitions/', 'ba92f5b4-2d11-453d-a403-e96b0029c9fe')]",
                        "readerAssignment": "[guid('Reader',variables('managedIdentityName'))]",
                        "readerDefinitionId": "[concat(resourceGroup().id, '/providers/Microsoft.Authorization/roleDefinitions/', 'acdd72a7-3385-48ef-bd42-f606fba81ae7')]"
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
                            "name": "[concat(variables('storageAccountName'), '/Microsoft.Authorization/', variables('storageBlobDataContributorAssignment'))]",
                            "type": "Microsoft.Storage/storageAccounts/providers/roleAssignments",
                            "apiVersion": "2021-04-01-preview",
                            "dependsOn": [
                                "[variables('managedIdentityName')]",
                                "[variables('storageAccountName')]"
                            ],
                            "properties": {
                                "roleDefinitionId": "[variables('storageBlobDataContributorDefinitionId')]",
                                "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities',variables('managedIdentityName')), '2018-11-30').principalId]",
                                "principalType": "ServicePrincipal"
                            }
                        },
                        {
                            "name": "[concat(variables('storageAccountName'), '/Microsoft.Authorization/', variables('readerAssignment'))]",
                            "type": "Microsoft.Storage/storageAccounts/providers/roleAssignments",
                            "apiVersion": "2021-04-01-preview",
                            "dependsOn": [
                                "[variables('managedIdentityName')]",
                                "[variables('storageAccountName')]"
                            ],
                            "properties": {
                                "roleDefinitionId": "[variables('readerDefinitionId')]",
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

> [!NOTE]
> The template uses a nested deployment for the role assignments to ensure that it is available before deploying the Video Analyzer account resource.

### Deploy the template

1. Click on the *Deploy to Azure* button to sign in to Azure and open a template.

    [![Deploy to Azure](https://aka.ms/deploytoazurebutton)](https://aka.ms/ava-click-to-deploy)

1. Select or enter the following values. Use the default values, when available.

    - **Subscription**: select an Azure subscription.
    - **Resource group**: select an existing resource group from the drop-down, or select **Create new**, enter a unique name for the resource group, and then click **OK**.
    - **Location**: select a location.  For example, **West US 2**.
    - **Name Prefix**: provide a string that is used to prefix the name of the resources (the default values are recommended).

1. Select **Review + create**. After validation completes, select **Create** to create and deploy the template.

In the above, the Azure portal is used to deploy the template. In addition to the Azure portal, you can also use the Azure CLI, Azure PowerShell, and REST API. To learn other deployment methods, see [Deploy templates](../../azure-resource-manager/templates/deploy-cli.md).

### Post deployment steps
You can choose to attach an existing IoT Hub to the Video Analyzer account and this will require an existing UAMI.

1. Click **Go to resource** after the resource has finished deploying.
1. Under settings select **IoT Hub**, then click on **Attach**.  In the **Attach IoT Hub** configuration fly-out blade enter the required values:
     - Subscription - Select the Azure subscription name under which the IoT Hub has been created
     - IoT Hub - Select the desired IoT Hub
     - Managed Identity - Select the existing UAMI to be used to access the IoT Hub
1. Click on **Save** to link IoT Hub to your Video Analyzer account.

### Review deployed resources

You can use the Azure portal to check on the account and other resource that were created. After the deployment is finished, select **Go to resource group** to see the account and other resources.

### Clean up resources

When no longer needed, delete the resource group, which deletes the account and all of the resources in the resource group.

1. Select the **Resource group**.
1. On the page for the resource group, select **Delete**.
1. When prompted, type the name of the resource group and then select **Delete**.

---

### Next steps

* Learn how to [deploy Video Analyzer on an IoT Edge device][docs-deploy-on-edge].
* Learn how to [capture and record video directly to the cloud](cloud/get-started-livepipelines-portal.md).

<!-- links -->
[docs-uami]: ../../active-directory/managed-identities-azure-resources/overview.md
[docs-storage-access]: ../../role-based-access-control/built-in-roles.md#storage-blob-data-contributor
[docs-role-reader]: ../../role-based-access-control/built-in-roles.md#reader
[docs-arm-template]: ../../azure-resource-manager/templates/overview.md
[docs-deploy-on-edge]: ./edge/deploy-iot-edge-device.md
