---
title: Workload identity federation for app considerations
description: Important considerations and restrictions for creating a federated identity credential on an app. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 09/20/2022
ms.author: ryanwi
ms.reviewer: shkhalid, udayh, vakarand
ms.custom: aaddev
---

## Important considerations and restrictions for federated identity credentials

This article describes important considerations, restrictions, and limitations for federated identity credentials on Azure AD apps and user-assigned managed identities.  For more information on the scenarios enabled by federated identity credentials, see [workload identity federation overview](workload-identity-federation.md).

## General federated identity credential considerations

Anyone with permissions to create an app registration and add a secret or certificate can add a federated identity credential to an app.  If the **Users can register applications** switch in the [User Settings](https://portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/UserSettings) blade is set to **No**, however, you won't be able to create an app registration or configure the federated identity credential.  Find an admin to configure the federated identity credential on your behalf.  Anyone in the Application Administrator or Application Owner roles can do this.

A maximum of 20 federated identity credentials can be added to an application or user-assigned managed identity.

Federated identity credentials do not consume the Azure AD tenant service principal object quota.

When you configure a federated identity credential, there are several important pieces of information to provide:

- *issuer* and *subject* are the key pieces of information needed to set up the trust relationship. The combination of `issuer` and `subject` must be unique on the app.  When the external software workload requests Microsoft identity platform to exchange the external token for an access token, the *issuer* and *subject* values of the federated identity credential are checked against the `issuer` and `subject` claims provided in the external token. If that validation check passes, Microsoft identity platform issues an access token to the external software workload.

    *issuer* is the URL of the external identity provider and must match the `issuer` claim of the external token being exchanged. Required. If the `issuer` claim has leading or trailing whitespace in the value, the token exchange is blocked. This field has a character limit of 600 characters.
    
    *subject* is the identifier of the external software workload and must match the `sub` (`subject`) claim of the external token being exchanged. *subject* has no fixed format, as each IdP uses their own - sometimes a GUID, sometimes a colon delimited identifier, sometimes arbitrary strings. This field has a character limit of 600 characters.
    
    > [!IMPORTANT]
    > The *subject* setting values must exactly match the configuration on the GitHub workflow configuration.  Otherwise, Microsoft identity platform will look at the incoming external token and reject the exchange for an access token.  You won't get an error, the exchange fails without error.
    
    > [!IMPORTANT]
    > If you accidentally add the incorrect external workload information in the *subject* setting the federated identity credential is created successfully without error.  The error does not become apparent until the token exchange fails.

- *audiences* lists the audiences that can appear in the external token.  Required. You must add a single audience value which has a limit of 600 characters. The recommended value is "api://AzureADTokenExchange". It says what Microsoft identity platform must accept in the `aud` claim in the incoming token.  This value represents Azure AD in your external identity provider and has no fixed value across identity providers - you may need to create a new application registration in your IdP to serve as the audience of this token.  

- *name* is the unique identifier for the federated identity credential. Required.  This field has a character limit of 3-120 characters and must be URL friendly. Alphanumeric, dash, or underscore characters are supported, the first character must be alphanumeric only.  It is immutable once created.

- *description* is the user-provided description of the federated identity credential.  Optional. The description is not validated or checked by Azure AD. This field has a limit of 600 characters.

Wildcard characters are not supported in any federated identity credential property value.

## Un-supported regions (user-assigned managed identities)

During the public preview of workload identity federation for user-assigned managed identities, the creation of federated identity credentials is available on user-assigned managed identities created in most Azure regions. However, creation of federated identity credentials is **not supported** on user-assigned managed identities in the following regions:

- Germany North
- Sweden South
- Sweden Central
- Switzerland West
- Brazil Southeast
- East Asia

Support for creating federated identity credentials in these regions will be rolled out gradually except East Asia where support will not be provided.

Resources in these regions can still use federated identity credentials created in other, supported regions.

## Azure Active Directory issuers are not supported

Creating a federation between two Azure AD identities from the same or different tenants is not supported. When creating a federated identity credential, configuring the *issuer* (the URL of the external identity provider) with the following values is not supported:

- *.login.microsoftonline.com
- *.login.windows.net
- *.login.microsoft.com
- *.sts.windows.net

While it is possible to create a federated identity credential with an Azure AD issuer, attempts to use it for authorization fail with error `AADSTS700222: AAD-issued tokens may not be used for federated identity flows`.

## Amazon Web Services (AWS) issuers are not supported

Creating a federated identity credential with an AWS *issuer* (the URL of the external identity provider) is not supported.

## Time for federated credential changes to propagate

It takes time for the federated identity credential to be propagated throughout a region after being initially configured. A token request made several minutes after configuring the federated identity credential may fail because the cache is populated in the directory with old data. During this time window, an authorization request might fail with error message: `AADSTS70021: No matching federated identity record found for presented assertion.`

To avoid this issue, wait a short time after adding the federated identity credential before requesting a token to ensure replication completes across all nodes of the authorization service. We also recommend adding retry logic for token requests.  Retries should be done for every request even after a token was successfully obtained. Eventually after the data is fully replicated the percentage of failures will drop.

## Concurrent updates are not supported (user-assigned managed identities)

Creating multiple federated identity credentials under the same user-assigned managed identity concurrently triggers concurrency detection logic which causes requests to fail with 409-conflict HTTP status code.  

Make sure that any kind of automation creates federated identity credentials under the same parent identity sequentially. Federated identity credentials under different managed identities can be created in parallel without any restrictions.

Important consideration for Azure Resource Manager template (ARM template) deployments comes from this limitation. By default, all the child federated identity credentials are created in parallel due to ARM internal logic. To create them sequentially, specify a chain of dependencies using the *dependsOn* property. Here is a sample: 

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

## Throttling limits

| Operation         | Requests-per-second per Azure AD tenant    | Requests-per-second per subscription    | Requests-per-second per resource    |
|-------------------|----------------|----------------|----------------|
| FederatedIdentityCredentialPutRequest | 10 | 2 | 0.25 |
| FederatedIdentityCredentialGetRequest | 30 | 10 | 0.5 |
| FederatedIdentityCredentialsListRequest | 15 | 5 | 0.25 |
| FederatedIdentityCredentialDeleteRequest | 10 | 2 | 0.25 |

## Errors

| HTTP code         | Error message    | Comments    |
|-------------------|----------------|----------------|
| 405 | The request format was unexpected: Support for federated identity credentials not enabled. | Federated identity credentials is not enabled in this region. Refer to “Currently Supported regions”. |
| 400 | Federated identity credentials must have exactly 1 audience.| Currently federated identity credentials supports a single audience “api://AzureADTokenExchange”.| 
| 400 | Federated Identity Credential from HTTP body has empty properties | All federated identity credential properties are mandatory. |
| 400 | Federated Identity Credential name '{ficName}' is invalid. | Alphanumeric, dash, underscore, no more than 3-120 symbols. First symbol is alphanumeric. |
| 404 | The parent user-assigned identity does not exist. | Check user assigned identity name in federated identity credentials resource path. |
| 400 | Issuer and subject combination already exists for this Managed Identity. | This is a constraint. List all federated identity credentials associated with the user-assigned identity to find existing federated identity credential. |
| 409 | Conflict | Concurrent write request to federated identity credential resources under the same user-assigned identity has been denied.

