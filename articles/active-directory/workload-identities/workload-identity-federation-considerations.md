---
title: Workload identity federation for app considerations
description: Important considerations and restrictions for creating a federated identity credential on an app. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: workload-identities
ms.workload: identity
ms.topic: conceptual
ms.date: 08/11/2023
ms.author: ryanwi
ms.reviewer: shkhalid, udayh, cbrooks
ms.custom: aaddev, references_regions

---

# Important considerations and restrictions for federated identity credentials

This article describes important considerations, restrictions, and limitations for federated identity credentials on Microsoft Entra apps and user-assigned managed identities.  

For more information on the scenarios enabled by federated identity credentials, see [workload identity federation overview](workload-identity-federation.md).

## General federated identity credential considerations

*Applies to: applications and user-assigned managed identities*

Anyone with permissions to create an app registration and add a secret or certificate can add a federated identity credential to an app.  If the **Users can register applications** switch is set to **No** in the **Users->User Settings** blade in the [Microsoft Entra admin center](https://entra.microsoft.com), however, you won't be able to create an app registration or configure the federated identity credential.  Find an admin to configure the federated identity credential on your behalf, someone in the Application Administrator or Application Owner roles.

Federated identity credentials don't consume the Microsoft Entra tenant service principal object quota.

[!INCLUDE [federated credential configuration](./includes/federated-credential-configuration-considerations.md)]

## Unsupported regions (user-assigned managed identities)

*Applies to: user-assigned managed identities*

The creation of federated identity credentials is available on user-assigned managed identities created in most Azure regions during public. However, creation of federated identity credentials is **not supported** on user-assigned managed identities in the following regions:

- Germany North
- Sweden South
- Sweden Central
- East Asia
- Qatar Central
- Brazil Southeast
- Malaysia South
- Poland Central
- UK North
- UK South2


Support for creating federated identity credentials in these regions will be rolled out gradually except East Asia where support won't be provided.

Resources in these regions can still use federated identity credentials created in other, supported regions.

## Supported signing algorithms and issuers

*Applies to: applications and user-assigned managed identities*

Only issuers that provide tokens signed using the RS256 algorithm are supported for token exchange using workload identity federation.  Exchanging tokens signed with other algorithms may work, but haven't been tested.

<a name='azure-active-directory-issuers-arent-supported'></a>

## Microsoft Entra issuers aren't supported

*Applies to: applications and user-assigned managed identities*

Creating a federation between two Microsoft Entra identities from the same or different tenants isn't supported. When creating a federated identity credential, configuring the *issuer* (the URL of the external identity provider) with the following values isn't supported:

- *.login.microsoftonline.com
- *.login.windows.net
- *.login.microsoft.com
- *.sts.windows.net

While it's possible to create a federated identity credential with a Microsoft Entra issuer, attempts to use it for authorization fail with error `AADSTS700222: AAD-issued tokens may not be used for federated identity flows`.

## Time for federated credential changes to propagate

*Applies to: applications and user-assigned managed identities*

It takes time for the federated identity credential to be propagated throughout a region after being initially configured. A token request made several minutes after configuring the federated identity credential may fail because the cache is populated in the directory with old data. During this time window, an authorization request might fail with error message: `AADSTS70021: No matching federated identity record found for presented assertion.`

To avoid this issue, wait a short time after adding the federated identity credential before requesting a token to ensure replication completes across all nodes of the authorization service. We also recommend adding retry logic for token requests.  Retries should be done for every request even after a token was successfully obtained. Eventually after the data is fully replicated the percentage of failures will drop.

## Concurrent updates aren't supported (user-assigned managed identities)

*Applies to: user-assigned managed identities*

Creating multiple federated identity credentials under the same user-assigned managed identity concurrently triggers concurrency detection logic, which causes requests to fail with 409-conflict HTTP status code.  

[Terraform Provider for Azure (Resource Manager)](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs) version 3.40.0 introduces an [update](https://github.com/hashicorp/terraform-provider-azurerm/pull/20003) which creates multiple federated identity credentials sequentially instead of concurrently.  Versions earlier than 3.40.0 can cause failures in pipelines when multiped federated identities are created. We recommend you use [Terraform Provider for Azure (Resource Manager) v3.40.0](https://github.com/hashicorp/terraform-provider-azurerm/tree/main) or later so that multiple federated identity credentials are created sequentially.

When you use automation or Azure Resource Manager templates (ARM templates) to create federated identity credentials under the same parent identity, create the federated credentials sequentially. Federated identity credentials under different managed identities can be created in parallel without any restrictions.

If federated identity credentials are provisioned in a loop, you can [provision them serially](../../azure-resource-manager/templates/copy-resources.md#serial-or-parallel) by setting *"mode": "serial"*.

You can also provision multiple new federated identity credentials sequentially using the *dependsOn* property. The following Azure Resource Manager template (ARM template) example creates three new federated identity credentials sequentially on a user-assigned managed identity by using the *dependsOn* property:

```json
{ 
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#", 
    "contentVersion": "1.0.0.0", 
    "parameters": { 
        "userAssignedIdentities_parent_uami_name": { 
            "defaultValue": "parent_uami", 
            "type": "String" 
        } 
    }, 
    "variables": {}, 
    "resources": [ 
        { 
            "type": "Microsoft.ManagedIdentity/userAssignedIdentities", 
            "apiVersion": "2022-01-31-preview", 
            "name": "[parameters('userAssignedIdentities_parent_uami_name')]", 
            "location": "eastus" 
        }, 
        { 
            "type": "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials", 
            "apiVersion": "2022-01-31-preview", 
            "name": "[concat(parameters('userAssignedIdentities_parent_uami_name'), '/fic01')]", 
            "dependsOn": [ 
                "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentities_parent_uami_name'))]" 
            ], 
            "properties": { 
                "issuer": "https://kubernetes-oauth.azure.com", 
                "subject": "fic01", 
                "audiences": [ 
                    "api://AzureADTokenExchange" 
                ] 
            } 
        }, 
        { 
            "type": "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials", 
            "apiVersion": "2022-01-31-preview", 
            "name": "[concat(parameters('userAssignedIdentities_parent_uami_name'), '/fic02')]", 
            "dependsOn": [ 
                "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentities_parent_uami_name'))]", 
                "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials', parameters('userAssignedIdentities_parent_uami_name'), 'fic01')]" 
            ], 
            "properties": { 
                "issuer": "https://kubernetes-oauth.azure.com", 
                "subject": "fic02", 
                "audiences": [ 
                    "api://AzureADTokenExchange" 
                ] 
            } 
        }, 
        { 
            "type": "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials", 
            "apiVersion": "2022-01-31-preview", 
            "name": "[concat(parameters('userAssignedIdentities_parent_uami_name'), '/fic03')]", 
            "dependsOn": [ 
                "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentities_parent_uami_name'))]", 
                "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials', parameters('userAssignedIdentities_parent_uami_name'), 'fic02')]" 
            ], 
            "properties": { 
                "issuer": "https://kubernetes-oauth.azure.com", 
                "subject": "fic03", 
                "audiences": [ 
                    "api://AzureADTokenExchange" 
                ] 
            } 
        } 
    ] 
} 
```

## Azure policy

*Applies to: applications and user-assigned managed identities*

It's possible to use a deny [Azure Policy](../../governance/policy/overview.md) as in the following ARM template example:

```json
{ 
"policyRule": { 
            "if": { 
                "field": "type", 
                "equals": "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials" 
            }, 
            "then": { 
                "effect": "deny" 
            } 
        } 
}
```

## Throttling limits

*Applies to: user-assigned managed identities*  

The following table describes limits on requests to the user-assigned managed identities REST APIS.  If you exceed a throttling limit, you receive an HTTP 429 error.

| Operation         | Requests-per-second per Microsoft Entra tenant    | Requests-per-second per subscription    | Requests-per-second per resource    |
|-------------------|----------------|----------------|----------------|
| [Create or update](/rest/api/managedidentity/2022-01-31-preview/user-assigned-identities/create-or-update) requests | 10 | 2 | 0.25 |
| [Get](/rest/api/managedidentity/2022-01-31-preview/user-assigned-identities/get) requests | 30 | 10 | 0.5 |
| [List by resource group](/rest/api/managedidentity/2022-01-31-preview/user-assigned-identities/list-by-resource-group) or [List by subscription](/rest/api/managedidentity/2022-01-31-preview/user-assigned-identities/list-by-subscription) requests | 15 | 5 | 0.25 |
| [Delete](/rest/api/managedidentity/2022-01-31-preview/user-assigned-identities/delete) requests | 10 | 2 | 0.25 |

## Errors

*Applies to: applications and user-assigned managed identities*

The following error codes may be returned when creating, updating, getting, listing, or deleting federated identity credentials.

| HTTP code         | Error message    | Comments    |
|-------------------|----------------|----------------|
| 405 | The request format was unexpected: Support for federated identity credentials not enabled. | Federated identity credentials aren't enabled in this region. Refer to “Currently Supported regions”. |
| 400 | Federated identity credentials must have exactly one audience.| Currently, federated identity credentials support a single audience “api://AzureADTokenExchange”.| 
| 400 | Federated Identity Credential from HTTP body has empty properties | All federated identity credential properties are mandatory. |
| 400 | Federated Identity Credential name '{ficName}' is invalid. | Alphanumeric, dash, underscore, no more than 3-120 symbols. First symbol is alphanumeric. |
| 404 | The parent user-assigned identity doesn't exist. | Check user assigned identity name in federated identity credentials resource path. |
| 400 | Issuer and subject combination already exists for this Managed Identity. | This is a constraint. List all federated identity credentials associated with the user-assigned identity to find existing federated identity credential. |
| 409 | Conflict | Concurrent write request to federated identity credential resources under the same user-assigned identity has been denied.
