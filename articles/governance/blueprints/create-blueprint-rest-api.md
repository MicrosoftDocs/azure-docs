---
title: 'Quickstart: Create a blueprint with REST API'
description: In this quickstart, you use Azure Blueprints to create, define, and deploy artifacts by using the REST API.
ms.date: 09/07/2023
ms.topic: quickstart
---
# Quickstart: Define and assign an Azure blueprint with REST API

[!INCLUDE [Blueprints deprecation note](../../../includes/blueprints-deprecation-note.md)]

In this tutorial, you learn to use Azure Blueprints to do some of the common tasks related to creating, publishing, and assigning a blueprint within your organization. This skill helps you define common patterns to develop reusable and rapidly deployable configurations, based on Azure Resource Manager (ARM) templates, policy, and security.

## Prerequisites

- If you don't have an Azure subscription, create a
  [free account](https://azure.microsoft.com/free) before you begin.
- Register the `Microsoft.Blueprint` resource provider. For directions, see
  [Resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md).

[!INCLUDE [cloud-shell-try-it.md](../../../includes/cloud-shell-try-it.md)]

## Get started with REST API

If you're unfamiliar with REST API, start by reviewing the [Azure REST API Reference](/rest/api/azure/), specifically the sections about request URI and request body. This quickstart uses these concepts to provide directions for working with Azure Blueprints, and assumes a working knowledge of them. Tools such as [ARMClient](https://github.com/projectkudu/ARMClient) can handle authorization automatically, and are recommended for beginners.

For the Azure Blueprints specs, see [Azure Blueprints REST API](/rest/api/blueprints/).

### REST API and PowerShell

If you don't already have a tool for making REST API calls, consider using PowerShell for these
instructions. The following is a sample header for authenticating with Azure. Generate an authentication header, sometimes called a *bearer token*, and provide the REST API URI to connect with any parameters or a `Request Body`:

```azurepowershell-interactive
# Log in first with Connect-AzAccount if not using Cloud Shell

$azContext = Get-AzContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}

# Invoke the REST API
$restUri = 'https://management.azure.com/subscriptions/{subscriptionId}?api-version=2020-01-01'
$response = Invoke-RestMethod -Uri $restUri -Method Get -Headers $authHeader
```

Replace `{subscriptionId}` in the preceding `$restUri` variable to get information about your
subscription. The `$response` variable holds the result of the `Invoke-RestMethod` cmdlet, which you can parse with cmdlets such as [ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json). If the REST API service endpoint expects a `Request Body`, provide a JSON-formatted variable to the `-Body` parameter of `Invoke-RestMethod`.

## Create a blueprint

The first step in defining a standard pattern for compliance is to compose a blueprint from the
available resources. Let's create a blueprint named *MyBlueprint* to configure role and policy
assignments for the subscription. Then you add a resource group, an ARM template, and a role
assignment on the resource group.

> [!NOTE]
> When you're using the REST API, the _blueprint_ object is created first. For each _artifact_ to be added that has parameters, you define the parameters in advance on the initial *blueprint*.

In each REST API URI, replace the following variables with your own values:

- `{YourMG}` - Replace with the ID of your management group.
- `{subscriptionId}` - Replace with your subscription ID.

> [!NOTE]
> You can also create blueprints at the subscription level. For more information, see
> [create blueprint at subscription example](/rest/api/blueprints/blueprints/createorupdate#subscriptionblueprint).

1. Create the initial _blueprint_ object. The `Request Body` includes properties about the
   blueprint, any resource groups to create, and all of the blueprint-level parameters. You set the parameters during assignment, and they're used by the artifacts you add in later steps.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint?api-version=2018-11-01-preview
     ```

   - Request Body

     ```json
     {
         "properties": {
             "description": "This blueprint sets tag policy and role assignment on the subscription, creates a ResourceGroup, and deploys a resource template and role assignment to that ResourceGroup.",
             "targetScope": "subscription",
             "parameters": {
                 "storageAccountType": {
                     "type": "string",
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
                         "description": "List of AAD object IDs that is assigned Contributor role at the subscription"
                     }
                 },
                 "owners": {
                     "type": "array",
                     "metadata": {
                         "description": "List of AAD object IDs that is assigned Owner role at the resource group"
                     }
                 }
             },
             "resourceGroups": {
                 "storageRG": {
                     "description": "Contains the resource template deployment and a role assignment."
                 }
             }
         }
     }
     ```

1. Add a role assignment at the subscription. The `Request Body` defines the kind of artifact, the properties align to the role definition identifier, and the principal identities are passed as an array of values. In the following example, the principal identities granted the specified role are configured to a parameter that is set during blueprint assignment. This example uses the `Contributor` built-in role, with a GUID of `b24988ac-6180-42a0-ab88-20f7382dd24c`.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/roleContributor?api-version=2018-11-01-preview
     ```

   - Request Body

     ```json
     {
         "kind": "roleAssignment",
         "properties": {
             "roleDefinitionId": "/providers/Microsoft.Authorization/roleDefinitions/b24988ac-6180-42a0-ab88-20f7382dd24c",
             "principalIds": "[parameters('contributors')]"
         }
     }
     ```

1. Add a policy assignment at the subscription. The `Request Body` defines the kind of artifact, the properties align to a policy or initiative definition, and the policy assignment is configured to use the defined blueprint parameters during blueprint assignment. This example
uses the `Apply tag and its default value to resource groups` built-in policy, with a GUID of `49c88fc8-6fd1-46fd-a676-f12d1d3a4c71`.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/policyTags?api-version=2018-11-01-preview
     ```

   - Request Body

     ```json
     {
         "kind": "policyAssignment",
         "properties": {
             "description": "Apply tag and its default value to resource groups",
             "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/49c88fc8-6fd1-46fd-a676-f12d1d3a4c71",
             "parameters": {
                 "tagName": {
                     "value": "[parameters('tagName')]"
                 },
                 "tagValue": {
                     "value": "[parameters('tagValue')]"
                 }
             }
         }
     }
     ```

1. Add another policy assignment for the storage tag (by reusing `storageAccountType_ parameter`) at the subscription. This additional policy assignment artifact demonstrates that a parameter defined on the blueprint is usable by more than one artifact. In the example, you use the `storageAccountType` to set a tag on the resource group. This value provides information about the storage account that you create in the next step. This example uses the `Apply tag and its default value to resource groups` built-in policy, with a GUID of `49c88fc8-6fd1-46fd-a676-f12d1d3a4c71`.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/policyStorageTags?api-version=2018-11-01-preview
     ```

   - Request Body

     ```json
     {
         "kind": "policyAssignment",
         "properties": {
             "description": "Apply storage tag and the parameter also used by the template to resource groups",
             "policyDefinitionId": "/providers/Microsoft.Authorization/policyDefinitions/49c88fc8-6fd1-46fd-a676-f12d1d3a4c71",
             "parameters": {
                 "tagName": {
                     "value": "StorageType"
                 },
                 "tagValue": {
                     "value": "[parameters('storageAccountType')]"
                 }
             }
         }
     }
     ```

1. Add a template under the resource group. The `Request Body` for an ARM template includes the normal JSON component of the template, and defines the target resource group with
`properties.resourceGroup`. The template also reuses the `storageAccountType`, `tagName`, and `tagValue` blueprint parameters by passing each to the template. The blueprint parameters are available to the template by defining `properties.parameters`, and inside the template JSON that key-value pair is used to inject the value. The blueprint and template parameter names can be the same, but are different here to illustrate how each passes from the blueprint to the
template artifact.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/templateStorage?api-version=2018-11-01-preview
     ```

   - Request Body

     ```json
     {
         "kind": "template",
         "properties": {
             "template": {
                 "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
                 "contentVersion": "1.0.0.0",
                 "parameters": {
                     "storageAccountTypeFromBP": {
                         "type": "string",
                         "defaultValue": "Standard_LRS",
                         "allowedValues": [
                             "Standard_LRS",
                             "Standard_GRS",
                             "Standard_ZRS",
                             "Premium_LRS"
                         ],
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
                     "location": "[resourceGroups('storageRG').location]",
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
             },
             "resourceGroup": "storageRG",
             "parameters": {
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
         }
     }
     ```

1. Add a role assignment under the resource group. Similar to the previous role assignment entry, the following example uses the definition identifier for the `Owner` role, and provides it a different parameter from the blueprint. This example uses the `Owner` built-in role, with a GUID of `8e3af657-a8ff-443c-a75c-2fe8c4bcb635`.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/roleOwner?api-version=2018-11-01-preview
     ```

   - Request Body

     ```json
     {
         "kind": "roleAssignment",
         "properties": {
             "resourceGroup": "storageRG",
             "roleDefinitionId": "/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635",
             "principalIds": "[parameters('owners')]"
         }
     }
     ```

## Publish a blueprint

Now that you've added the artifacts to the blueprint, it's time to publish it. Publishing makes
the blueprint available to assign to a subscription.

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/versions/{BlueprintVersion}?api-version=2018-11-01-preview
  ```

The value for `{BlueprintVersion}` is a string of letters, numbers, and hyphens (with no spaces or other special characters). The maximum length is 20 characters. Use something unique and informational, such as `v20180622-135541`.

## Assign a blueprint

After you've published a blueprint by using REST API, it's assignable to a subscription. Assign the blueprint that you created to one of the subscriptions under your management group hierarchy. If the blueprint is saved to a subscription, it can only be assigned to that subscription. The `Request Body` specifies the blueprint to assign, and provides the name and location to any resource groups in the blueprint definition. `Request Body` also provides all parameters defined on the blueprint and used by one or more attached artifacts.

In each REST API URI, replace the following variables with your own values:

- `{tenantId}` - Replace with your tenant ID.
- `{YourMG}` - Replace with the ID of your management group.
- `{subscriptionId}` - Replace with your subscription ID.

1. Provide the Azure Blueprints service principal the `Owner` role on the target subscription. The `AppId` is static (`f71766dc-90d9-4b7d-bd9d-4499c4331c3f`), but the service principal ID varies by tenant. Use the following REST API to request details for your tenant. It uses    [Azure Active Directory Graph API](/graph/migrate-azure-ad-graph-planning-checklist), which has different authorization.

   - REST API URI

     ```http
     GET https://graph.windows.net/{tenantId}/servicePrincipals?api-version=1.6&$filter=appId eq 'f71766dc-90d9-4b7d-bd9d-4499c4331c3f'
     ```

1. Run the blueprint deployment by assigning it to a subscription. Because the `contributors` and `owners` parameters require an array of `objectIds` of the principals to be granted the role assignment, use [Azure Active Directory Graph API](/graph/migrate-azure-ad-graph-planning-checklist) for gathering the `objectIds` for use in the `Request Body` for your own users, groups, or service principals.

   - REST API URI

     ```http
     PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Blueprint/blueprintAssignments/assignMyBlueprint?api-version=2018-11-01-preview
     ```

   - Request Body

     ```json
     {
         "properties": {
             "blueprintId": "/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint",
             "resourceGroups": {
                 "storageRG": {
                     "name": "StorageAccount",
                     "location": "eastus2"
                 }
             },
             "parameters": {
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
         },
         "identity": {
             "type": "systemAssigned"
         },
         "location": "westus"
     }
     ```

   - User-assigned managed identity

     A blueprint assignment can also use a
     [user-assigned managed identity](../../active-directory/managed-identities-azure-resources/overview.md).
     In this case, the `identity` portion of the request body changes as follows. Replace
     `{yourRG}` and `{userIdentity}` with your resource group name and the name of your
     user-assigned managed identity, respectively.

     ```json
     "identity": {
         "type": "userAssigned",
         "tenantId": "{tenantId}",
         "userAssignedIdentities": {
             "/subscriptions/{subscriptionId}/resourceGroups/{yourRG}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{userIdentity}": {}
         }
     },
     ```

     The user-assigned managed identity can be in any subscription and resource group to which the user assigning the blueprint has permissions.

     > [!IMPORTANT]
     > Azure Blueprints doesn't manage the user-assigned managed identity. Users are responsible for assigning sufficient roles and permissions, or the blueprint assignment will fail.

## Clean up resources

### Unassign a blueprint

You can remove a blueprint from a subscription. Removal is often done when the artifact resources are no longer needed. When a blueprint is removed, the artifacts assigned as part of that blueprint are left behind. To remove a blueprint assignment, use the following REST API operation:

- REST API URI

  ```http
  DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Blueprint/blueprintAssignments/assignMyBlueprint?api-version=2018-11-01-preview
  ```

### Delete a blueprint

To remove the blueprint itself, use the following REST API operation:

- REST API URI

  ```http
  DELETE https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint?api-version=2018-11-01-preview
  ```

## Next steps

In this quickstart, you created, assigned, and removed a blueprint with REST API. To learn more
about Azure Blueprints, continue to the blueprint lifecycle article.

> [!div class="nextstepaction"]
> [Learn about the blueprint lifecycle](./concepts/lifecycle.md)
