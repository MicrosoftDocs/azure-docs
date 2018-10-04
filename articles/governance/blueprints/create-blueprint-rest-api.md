---
title: Create an Azure Blueprint with REST API
description: Use Azure Blueprints to create, define, and deploy artifacts.
services: blueprints
author: DCtheGeek
ms.author: dacoulte
ms.date: 09/18/2018
ms.topic: quickstart
ms.service: blueprints
manager: carmonm
ms.custom: mvc
---
# Define and Assign an Azure Blueprint with REST API

Understanding how to create and assign blueprints in Azure enables an organization to define common
patterns of consistency and develop reusable and rapidly deployable configurations based on
Resource Manager templates, policy, security, and more. In this tutorial, you learn to use Azure
Blueprints to do some of the common tasks related to creating, publishing, and assigning a
blueprint within your organization, such as:

> [!div class="checklist"]
> - Create a new blueprint and add various supported artifacts
> - Make changes to an existing blueprint still in **Draft**
> - Mark a blueprint as ready to assign with **Published**
> - Assign a blueprint to an existing subscription
> - Check the status and progress of an assigned blueprint
> - Remove a blueprint that has been assigned to a subscription

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free) before you begin.

## Getting started with REST API

If you are unfamiliar with REST API, start by reviewing [Azure REST API
Reference](/rest/api/azure/) to get a general understanding of REST API, specifically request URI
and request body. This article uses these concepts to provide directions for working with Azure
Blueprints and assumes a working knowledge of them. Tools such as
[ARMClient](https://github.com/projectkudu/ARMClient) and others may handle authorization
automatically and are recommended for beginners.

### REST API and PowerShell

If you don't already have a tool for making REST API calls, consider using PowerShell for these
instructions. Following is a sample header for authenticating with Azure. Generate an
authentication header, sometimes called a **Bearer token**, and provide the REST API URI to connect
to with any parameters or a **Request Body**:

```powershell-interactive
# Login first with Connect-AzureRmAccount if not using Cloud Shell

$azContext = Get-AzureRmContext
$azProfile = [Microsoft.Azure.Commands.Common.Authentication.Abstractions.AzureRmProfileProvider]::Instance.Profile
$profileClient = New-Object -TypeName Microsoft.Azure.Commands.ResourceManager.Common.RMProfileClient -ArgumentList ($azProfile)
$token = $profileClient.AcquireAccessToken($azContext.Subscription.TenantId)
$authHeader = @{
    'Content-Type'='application/json'
    'Authorization'='Bearer ' + $token.AccessToken
}

# Invoke the REST API
$restUri = 'https://management.azure.com/subscriptions/{subscriptionId}?api-version=2016-06-01'
$response = Invoke-RestMethod -Uri $restUri -Method Get -Headers $authHeader
```

Replace `{subscriptionId}` in the **$restUri** variable above to get information about your
subscription. The $response variable holds the result of the `Invoke-RestMethod` cmdlet, which can
be parsed with cmdlets such as
[ConvertFrom-Json](/powershell/module/microsoft.powershell.utility/convertfrom-json). If the REST
API service endpoint expects a **Request Body**, provide a JSON formatted variable to the `-Body`
parameter of `Invoke-RestMethod`.

## Create a blueprint

The first step in defining a standard pattern for compliance is to compose a blueprint from the
available resources. In this example, create a blueprint named 'MyBlueprint' to configure role and
policy assignments for the subscription, add a resource group, and create a Resource Manager
template and role assignment on the resource group.

> [!NOTE]
> When using the REST API, the _blueprint_ object is created first. For each _artifact_ to be added that has parameters, the parameters need to be defined in advance on the initial _blueprint_.

In each REST API URI, there are variables that are used that you need to replace with your own values:

- `{YourMG}` - Replace with the name of your management group
- `{subscriptionId}` - Replace with your subscription ID

1. Create the initial _blueprint_ object. The **Request Body** includes properties about the
blueprint, any resource groups to create, and all of the blueprint level parameters that are set
during assignment and used by the artifacts added in later steps.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint?api-version=2017-11-11-preview
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

1. Add role assignment at subscription. The **Request Body** defines the _kind_ of artifact, the
properties align to the role definition identifier, and the principal identities are passed as an
array of values. In the example below, the principal identities granted the specified role are
configured to a parameter that is set during blueprint assignment.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/roleContributor?api-version=2017-11-11-preview
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

1. Add policy assignment at subscription. The **Request Body** defines the _kind_ of artifact, the
properties that align to a policy or initiative definition, and configures the policy assignment to
use the defined blueprint parameters to be configured during blueprint assignment.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/policyTags?api-version=2017-11-11-preview
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

1. Add another policy assignment for Storage tag (reusing _storageAccountType_ parameter) at
subscription. This additional policy assignment artifact demonstrates that a parameter defined on
the blueprint can be used by more than one artifact. In the example, the **storageAccountType** is
used to set a tag on the resource group providing information about the storage account that is
created in the next step.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/policyStorageTags?api-version=2017-11-11-preview
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

1. Add template under resource group. The **Request Body** for a Resource Manager template includes
the normal JSON component of the template, defines the target resource group with
**properties.resourceGroup**, and reuses the **storageAccountType**, **tagName**, and **tagValue**
blueprint parameters by providing each to the template. The blueprint parameters are made available
to the template by defining **properties.parameters** and inside the template JSON that key/value
is used to inject the value. The blueprint and template parameter names could be the same, but were
made different to illustrate how each is passed from the blueprint to the template artifact.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/templateStorage?api-version=2017-11-11-preview
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

1. Add role assignment under resource group. Similar to the previous role assignment entry, the
example below uses the definition identifier for the **Owner** role and provides it a different
parameter from the blueprint.

   - REST API URI

     ```http
     PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/artifacts/roleOwner?api-version=2017-11-11-preview
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

Now that the artifacts have been added to the blueprint, it's time to publish it. Publishing makes
it available to be assigned to a subscription.

- REST API URI

  ```http
  PUT https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint/versions/{BlueprintVersion}?api-version=2017-11-11-preview
  ```

The value for `{BlueprintVersion}` is a string of letters, numbers, and hyphens (no spaces or other
special characters) with a maximum length of 20 characters. Use something unique and informational
such as **v20180622-135541**.

## Assign a blueprint

Once a blueprint has been published using REST API, it can be assigned to a subscription. Assign
the blueprint you created to one of the subscriptions under your management group hierarchy. The
**Request Body** specifies the blueprint to be assigned, provides name and location to any resource
groups in the blueprint definition, and provides all parameters that were defined on the blueprint
and used by one or more attached artifacts.

1. Provide the Azure Blueprint service principal the **Owner** role on the target subscription. The AppId is static (`f71766dc-90d9-4b7d-bd9d-4499c4331c3f`), but the service principal ID various by tenant. Details can be requested for your tenant using the following REST API. It uses [Azure Active Directory Graph API](../../active-directory/develop/active-directory-graph-api.md) which has different authorization.

   - REST API URI

     ```http
     GET https://graph.windows.net/{tenantId}/servicePrincipals?api-version=1.6&$filter=appId eq 'f71766dc-90d9-4b7d-bd9d-4499c4331c3f'
     ```

1. Run the blueprint deployment by assigning it to a subscription. As the **contributors** and **owners** parameters require an array of objectIds of the principals to be granted the role assignment, use [Azure Active Directory Graph API](../../active-directory/develop/active-directory-graph-api.md) for gathering the objectIds for use in the **Request Body** for your own users, groups, or service principals.

   - REST API URI

     ```http
     PUT https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Blueprint/blueprintAssignments/assignMyBlueprint?api-version=2017-11-11-preview
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

## Unassign a blueprint

Blueprints can be removed from a subscription if they are no longer needed or have been replaced by
newer blueprints with updated patterns, policies, and designs. When a blueprint is removed, the
artifacts assigned as part of that blueprint are left behind. To remove a blueprint assignment, use
the following REST API operation:

- REST API URI

  ```http
  DELETE https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Blueprint/blueprintAssignments/assignMyBlueprint?api-version=2017-11-11-preview
  ```

## Delete a blueprint

To remove the blueprint itself, use the following REST API operation:

- REST API URI

  ```http
  DELETE https://management.azure.com/providers/Microsoft.Management/managementGroups/{YourMG}/providers/Microsoft.Blueprint/blueprints/MyBlueprint?api-version=2017-11-11-preview
  ```

## Next steps

- Learn about the [blueprint life-cycle](./concepts/lifecycle.md)
- Understand how to use [static and dynamic parameters](./concepts/parameters.md)
- Learn to customize the [blueprint sequencing order](./concepts/sequencing-order.md)
- Find out how to make use of [blueprint resource locking](./concepts/resource-locking.md)
- Learn how to [update existing assignments](./how-to/update-existing-assignments.md)
- Resolve issues during the assignment of a blueprint with [general troubleshooting](./troubleshoot/general.md)