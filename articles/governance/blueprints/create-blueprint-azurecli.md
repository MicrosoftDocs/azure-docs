---
title: 'Quickstart: Create a blueprint with the Azure CLI'
description: In this quickstart, you use Azure Blueprints to create, define, and deploy artifacts by using the Azure CLI.
ms.date: 09/07/2023
ms.topic: quickstart
ms.custom: devx-track-azurecli
---
# Quickstart: Define and assign an Azure blueprint with the Azure CLI

[!INCLUDE [Blueprints deprecation note](../../../includes/blueprints-deprecation-note.md)]

In this tutorial, you learn to use Azure Blueprints to do some of the common tasks related to creating, publishing, and assigning a blueprint within your organization. This skill helps you define common patterns to develop reusable and rapidly deployable configurations, based on Azure Resource Manager (ARM) templates, policy, and security.

## Prerequisites

- If you don't have an Azure subscription, create a
  [free account](https://azure.microsoft.com/free) before you begin.
- If you've not used Azure Blueprints before, register the resource provider through the Azure CLI with
  `az provider register --namespace Microsoft.Blueprint`.

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Add the blueprint extension

To enable the Azure CLI to manage blueprint definitions and assignments, you must add the extension. This extension works wherever you can use the Azure CLI. This includes [bash on Windows 10](/windows/wsl/install-win10), [Cloud Shell](https://shell.azure.com) (both the standalone version and the one inside the portal), the [Azure CLI Docker image](https://hub.docker.com/_/microsoft-azure-cli), or an extension that's locally installed.

1. Check that the latest Azure CLI is installed (at least **2.0.76**). If it isn't yet installed, follow [these instructions](/cli/azure/install-azure-cli-windows).

1. In your Azure CLI environment of choice, import the extension with the following command:

   ```azurecli-interactive
   # Add the Blueprint extension to the Azure CLI environment
   az extension add --name blueprint
   ```

1. Validate that the extension has been installed and is the expected version (at least **0.1.0**):

   ```azurecli-interactive
   # Check the extension list (note that you might have other extensions installed)
   az extension list

   # Run help for extension options
   az blueprint -h
   ```

## Create a blueprint

The first step in defining a standard pattern for compliance is to compose a blueprint from the
available resources. Let's create a blueprint named *MyBlueprint* to configure role and policy
assignments for the subscription. Then you add a resource group, an ARM template, and a role
assignment on the resource group.

> [!NOTE]
> When you're using the Azure CLI, the _blueprint_ object is created first. For each _artifact_ to be added that has parameters, you define the parameters in advance on the initial _blueprint_.

1. Create the initial _blueprint_ object. The `parameters` parameter takes a JSON file that
   includes all of the blueprint level parameters. You set the parameters during assignment, and they're used by the artifacts you add in later steps.

   - JSON file - *blueprintparms.json*

     ```json
     {
        "storageAccountType": {
            "type": "string",
            "defaultValue": "Standard_LRS",
            "allowedValues": [
                "Standard_LRS",
                "Standard_GRS",
                "Standard_ZRS",
                "Premium_LRS"
            ],
            "metadata": {
                "displayName": "storage account type.",
                "description": null
            }
        },
        "tagName": {
            "type": "string",
            "metadata": {
                "displayName": "The name of the tag to provide the policy assignment.",
                "description": null
            }
        },
        "tagValue": {
            "type": "string",
            "metadata": {
                "displayName": "The value of the tag to provide the policy assignment.",
                "description": null
            }
        },
        "contributors": {
            "type": "array",
            "metadata": {
                "description": "List of AAD object IDs that is assigned Contributor role at the subscription",
                "strongType": "PrincipalId"
            }
        },
        "owners": {
            "type": "array",
            "metadata": {
                "description": "List of AAD object IDs that is assigned Owner role at the resource group",
                "strongType": "PrincipalId"
            }
        }
     }
     ```

   - Azure CLI command

     ```azurecli-interactive
     # Login first with az login if not using Cloud Shell

     # Create the blueprint object
     az blueprint create \
        --name 'MyBlueprint' \
        --description 'This blueprint sets tag policy and role assignment on the subscription, creates a ResourceGroup, and deploys a resource template and role assignment to that ResourceGroup.' \
        --parameters blueprintparms.json
     ```

     > [!NOTE]
     > Use the filename _blueprint.json_ when you import your blueprint definitions. This file name is used when you call [az blueprint import](/cli/azure/blueprint#az-blueprint-import).

     The blueprint object is created in the default subscription by default. To specify the
     management group, use the parameter `managementgroup`. To specify the subscription, use the parameter `subscription`.

1. Add the resource group for the storage artifacts to the definition.

   ```azurecli-interactive
   az blueprint resource-group add \
      --blueprint-name 'MyBlueprint' \
      --artifact-name 'storageRG' \
      --description 'Contains the resource template deployment and a role assignment.'
   ```

1. Add a role assignment at the subscription. In the following example, the principal identities granted the specified role are configured to a parameter that is set during blueprint assignment. This example uses the `Contributor` built-in role, with a GUID of `b24988ac-6180-42a0-ab88-20f7382dd24c`.

   ```azurecli-interactive
   az blueprint artifact role create \
      --blueprint-name 'MyBlueprint' \
      --artifact-name 'roleContributor' \
      --role-definition-id '/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c' \
      --principal-ids "[parameters('contributors')]"
   ```

1. Add a policy assignment at the subscription. This example uses the `Apply tag and its default value to resource groups` built-in policy, with a GUID of `49c88fc8-6fd1-46fd-a676-f12d1d3a4c71`.

   - JSON file - *artifacts\policyTags.json*

     ```json
     {
        "tagName": {
           "value": "[parameters('tagName')]"
        },
        "tagValue": {
           "value": "[parameters('tagValue')]"
        }
     }
     ```

   - Azure CLI command

     ```azurecli-interactive
     az blueprint artifact policy create \
        --blueprint-name 'MyBlueprint' \
        --artifact-name 'policyTags' \
        --policy-definition-id '/providers/Microsoft.Authorization/policyDefinitions/49c88fc8-6fd1-46fd-a676-f12d1d3a4c71' \
        --display-name 'Apply tag and its default value to resource groups' \
        --description 'Apply tag and its default value to resource groups' \
        --parameters artifacts\policyTags.json
     ```

     > [!NOTE]
     > When you use `az blueprint` on a Mac, replace `\` with `/` for parameter values that include the path. In this case, the value for `parameters` becomes `artifacts/policyTags.json`.

1. Add another policy assignment for the storage tag (by reusing `storageAccountType_ parameter`) at the subscription. This additional policy assignment artifact demonstrates that a parameter defined on the blueprint is usable by more than one artifact. In the example, you use the `storageAccountType` to set a tag on the resource group. This value provides information about the storage account that you create in the next step. This example uses the `Apply tag and its default value to resource groups` built-in policy, with a GUID of `49c88fc8-6fd1-46fd-a676-f12d1d3a4c71`.

   - JSON file - *artifacts\policyStorageTags.json*

     ```json
     {
        "tagName": {
           "value": "StorageType"
        },
        "tagValue": {
           "value": "[parameters('storageAccountType')]"
        }
     }
     ```

   - Azure CLI command

     ```azurecli-interactive
     az blueprint artifact policy create \
        --blueprint-name 'MyBlueprint' \
        --artifact-name 'policyStorageTags' \
        --policy-definition-id '/providers/Microsoft.Authorization/policyDefinitions/49c88fc8-6fd1-46fd-a676-f12d1d3a4c71' \
        --display-name 'Apply storage tag to resource group' \
        --description 'Apply storage tag and the parameter also used by the template to resource groups' \
        --parameters artifacts\policyStorageTags.json
     ```

     > [!NOTE]
     > When you use `az blueprint` on a Mac, replace `\` with `/` for parameter values that include the path. In this case, the value for `parameters` becomes `artifacts/policyStorageTags.json`.

1. Add a template under resource group. The `template` parameter for an ARM template includes the normal JSON components of the template. The template also reuses the `storageAccountType`, `tagName`, and `tagValue` blueprint parameters by passing each to the template. The blueprint parameters are available to the template by using the parameter `parameters`, and inside the template JSON that key-value pair is used to inject the value. The blueprint and template parameter names might be the same.

   - JSON ARM template file - *artifacts\templateStorage.json*

     ```json
     {
         "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
         "contentVersion": "1.0.0.0",
         "parameters": {
             "storageAccountTypeFromBP": {
                 "type": "string",
                 "metadata": {
                     "description": "Storage Account type"
                 }
             },
             "tagNameFromBP": {
                 "type": "string",
                 "defaultValue": "NotSet",
                 "metadata": {
                     "description": "Tag name from blueprint"
                 }
             },
             "tagValueFromBP": {
                 "type": "string",
                 "defaultValue": "NotSet",
                 "metadata": {
                     "description": "Tag value from blueprint"
                 }
             }
         },
         "variables": {
             "storageAccountName": "[concat(uniquestring(resourceGroup().id), 'standardsa')]"
         },
         "resources": [{
             "type": "Microsoft.Storage/storageAccounts",
             "name": "[variables('storageAccountName')]",
             "apiVersion": "2016-01-01",
             "tags": {
                 "[parameters('tagNameFromBP')]": "[parameters('tagValueFromBP')]"
             },
             "location": "[resourceGroup().location]",
             "sku": {
                 "name": "[parameters('storageAccountTypeFromBP')]"
             },
             "kind": "Storage",
             "properties": {}
         }],
         "outputs": {
             "storageAccountSku": {
                 "type": "string",
                 "value": "[variables('storageAccountName')]"
             }
         }
     }
     ```

   - JSON ARM template parameter file - *artifacts\templateStorageParams.json*

     ```json
     {
        "storageAccountTypeFromBP": {
           "value": "[parameters('storageAccountType')]"
        },
        "tagNameFromBP": {
           "value": "[parameters('tagName')]"
        },
        "tagValueFromBP": {
           "value": "[parameters('tagValue')]"
        }
     }
     ```

   - Azure CLI command

     ```azurecli-interactive
     az blueprint artifact template create \
        --blueprint-name 'MyBlueprint' \
        --artifact-name 'templateStorage' \
        --template artifacts\templateStorage.json \
        --parameters artifacts\templateStorageParams.json \
        --resource-group-art 'storageRG'
     ```

     > [!NOTE]
     > When you use `az blueprint` on a Mac, replace `\` with `/` for parameter values that include the path. In this case, the value for `template` becomes `artifacts/templateStorage.json`, and `parameters` becomes `artifacts/templateStorageParams.json`.

1. Add a role assignment under the resource group. Similar to the previous role assignment entry, the following example uses the definition identifier for the `Owner` role, and provides it a different parameter from the blueprint. This example uses the `Owner` built-in role, with a GUID of `8e3af657-a8ff-443c-a75c-2fe8c4bcb635`.

   ```azurecli-interactive
   az blueprint artifact role create \
      --blueprint-name 'MyBlueprint' \
      --artifact-name 'roleOwner' \
      --role-definition-id '/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635' \
      --principal-ids "[parameters('owners')]" \
      --resource-group-art 'storageRG'
   ```

## Publish a blueprint

Now that you've added the artifacts to the blueprint, it's time to publish it. Publishing makes
the blueprint available to assign to a subscription.

```azurecli-interactive
az blueprint publish --blueprint-name 'MyBlueprint' --version '{BlueprintVersion}'
```

The value for `{BlueprintVersion}` is a string of letters, numbers, and hyphens (with no spaces or other special characters). The maximum length is 20 characters. Use something unique and informational, such as `v20200605-135541`.

## Assign a blueprint

After you've published a blueprint by using the Azure CLI, it's assignable to a subscription. Assign the blueprint that you created to one of the subscriptions under your management group hierarchy. If the blueprint is saved to a subscription, it can only be assigned to that subscription. The `blueprint-name` parameter specifies the blueprint to assign. To provide the `name`, `location`, `identity`, `lock`, and `blueprint` parameters, use the matching Azure CLI parameters on the `az blueprint assignment create` command, or provide them in the *parameters* JSON file.

1. Run the blueprint deployment by assigning it to a subscription. Because the `contributors` and `owners` parameters require an array of `objectIds` of the principals to be granted the role assignment, use [Azure Active Directory Graph API](/graph/migrate-azure-ad-graph-planning-checklist) for gathering the `objectIds` for use in the `parameters` for your own users, groups, or service principals.

   - JSON file - *blueprintAssignment.json*

     ```json
     {
        "storageAccountType": {
            "value": "Standard_GRS"
        },
        "tagName": {
            "value": "CostCenter"
        },
        "tagValue": {
            "value": "ContosoIT"
        },
        "contributors": {
            "value": [
                "7be2f100-3af5-4c15-bcb7-27ee43784a1f",
                "38833b56-194d-420b-90ce-cff578296714"
            ]
        },
        "owners": {
            "value": [
                "44254d2b-a0c7-405f-959c-f829ee31c2e7",
                "316deb5f-7187-4512-9dd4-21e7798b0ef9"
            ]
        }
     }
     ```

   - Azure CLI command

     ```azurecli-interactive
     az blueprint assignment create \
        --name 'assignMyBlueprint' \
        --location 'westus' \
        --resource-group-value artifact_name=storageRG name=StorageAccount location=eastus \
        --parameters blueprintAssignment.json
     ```

   - User-assigned managed identity

     A blueprint assignment can also use a
     [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md). In this case, the `identity-type` parameter is set to `UserAssigned`, and the `user-assigned-identities` parameter specifies the identity. Replace `{userIdentity}` with
     the name of your user-assigned managed identity.

     ```azurecli-interactive
     az blueprint assignment create \
        --name 'assignMyBlueprint' \
        --location 'westus' \
        --identity-type UserAssigned \
        --user-assigned-identities {userIdentity} \
        --resource-group-value artifact_name=storageRG name=StorageAccount location=eastus \
        --parameters blueprintAssignment.json
     ```

     The user-assigned managed identity can be in any subscription and resource group to which the user assigning the blueprint has permissions.

     > [!IMPORTANT]
     > Azure Blueprints doesn't manage the user-assigned managed identity. Users are responsible for assigning sufficient roles and permissions, or the blueprint assignment will fail.

## Clean up resources

You can remove a blueprint from a subscription. Removal is often done when the artifact resources are no longer needed. When a blueprint is removed, the artifacts assigned as part of that blueprint are left behind. To remove a blueprint assignment, use the `az blueprint assignment delete` command:

```azurecli-interactive
az blueprint assignment delete --name 'assignMyBlueprint'
```

## Next steps

In this quickstart, you created, assigned, and removed a blueprint with the Azure CLI. To learn more about Azure Blueprints, continue to the blueprint lifecycle article.

> [!div class="nextstepaction"]
> [Learn about the blueprint lifecycle](./concepts/lifecycle.md)
