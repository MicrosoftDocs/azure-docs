---
title: Create a trust relationship between a user-assigned managed identity and an external identity provider
description: Set up a trust relationship between an user-assigned managed identity in Azure AD and an external identity provider.  This allows a software workload outside of Azure to access Azure AD protected resources without using secrets or certificates. 
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 06/08/2022
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: shkhalide, udayh, vakarand
zone_pivot_groups: identity-mi-methods
#Customer intent: As an application developer, I want to configure a federated credential on an user-assigned managed identity so I can create a trust relationship with an external identity provider and use workload identity federation to access Azure AD protected resources without managing secrets.
---

# Configure a user-assigned managed identity to trust an external identity provider (preview)

This article describes how to manage a federated identity credential.  The federated identity credential creates a trust relationship between a user-assigned managed identity in Azure Active Directory (Azure AD) and an external identity provider (IdP).  

After you configure your user-assigned managed identity to trust an external IdP, configure your external software workload to exchange a token from the external IdP for an access token from Microsoft identity platform. Using that access token, the external workload accesses Azure AD protected resources without needing to manage secrets (in supported scenarios).  To learn more about the token exchange workflow, read about [workload identity federation](workload-identity-federation.md).  

In this article, you learn how to create, list, and delete federated identity credentials on a user-assigned managed identity.

## Important properties of federated identity credential

When you configure a federated identity credential, there are several important pieces of information to provide.

*issuer* and *subject* are the key pieces of information needed to set up the trust relationship. *issuer* is the URL of the external identity provider and must match the `issuer` claim of the external token being exchanged.  *subject* is the identifier of the external software workload and must match the `sub` (`subject`) claim of the external token being exchanged. *subject* has no fixed format, as each IdP uses their own - sometimes a GUID, sometimes a colon delimited identifier, sometimes arbitrary strings. The combination of `issuer` and `subject` must be unique on the app.  When the external software workload requests Microsoft identity platform to exchange the external token for an access token, the *issuer* and *subject* values of the federated identity credential are checked against the `issuer` and `subject` claims provided in the external token. If that validation check passes, Microsoft identity platform issues an access token to the external software workload.

> [!IMPORTANT]
> If you accidentally add the incorrect external workload information in the *subject* setting the federated identity credential is created successfully without error.  The error does not become apparent until the token exchange fails.

*audiences* lists the audiences that can appear in the external token.  This field is mandatory, and defaults to "api://AzureADTokenExchange". It says what Microsoft identity platform must accept in the `aud` claim in the incoming token.  This value represents Azure AD in your external identity provider and has no fixed value across identity providers - you may need to create a new application registration in your IdP to serve as the audience of this token.

*name* is the unique identifier for the federated identity credential, which has a character limit of 120 characters and must be URL friendly. It is immutable once created.

*description* is the un-validated, user-provided description of the federated identity credential.

::: zone pivot="identity-mi-methods-azp"

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](/azure/active-directory/managed-identities-azure-resources/overview). Be sure to review the [difference between a system-assigned and user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- Get the information for your external IdP and software workload, which you need in the following steps.
- To create a user-assigned managed identity and configure a federated identity credential, your account needs the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role assignment.
- [Create a user-assigned manged identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp#create-a-user-assigned-managed-identity)
- Find the object ID of the user-assigned managed identity, which you need in the following steps.

## Configure a federated identity credential on a user-assigned managed identity

## List federated identity credentials on a user-assigned managed identity

## Get a federated identity credential on a user-assigned managed identity

## Delete a federated identity credential from a user-assigned managed identity

::: zone-end

::: zone pivot="identity-mi-methods-azcli"

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](/azure/active-directory/managed-identities-azure-resources/overview). Be sure to review the [difference between a system-assigned and user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- Get the information for your external IdP and software workload, which you need in the following steps.
- To create a user-assigned managed identity and configure a federated identity credential, your account needs the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role assignment.
- [Create a user-assigned manged identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azcli#create-a-user-assigned-managed-identity-1)
- Find the object ID of the user-assigned managed identity, which you need in the following steps.

[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](../../../includes/azure-cli-prepare-your-environment-no-header.md)]

## Configure a federated identity credential on a user-assigned managed identity

Run the az rest command to create a new federated identity credential on your user-assigned managed identity (specified by the object ID of the app).  Specify the *name*, *issuer*, *subject*, and other parameters.

```azurecli
az login 

# set variables 
# in Linux shell remove $ from set variable statement 
$location="westcentralus" // this can be any supported location  
$subscription="{your subscription ID}" 
$rg="fic-test-rg" 

# user assigned identity name 
$uaId="fic-test-ua" 

# federated identity credential name 
$ficId="fic-test-fic-name"  

# create prerequisites if required.  
# otherwise make sure that existing resources names are set in variables above 
az account set --subscription $subscription 
az group create --name $rg --location $location --subscription $subscription 
az identity create --name $uaId --resource-group $rg --location $location --subscription $subscription  

# create/update federated identity credential 
# in Linux shell replace ` with \ and $($var) with ${var} 
az rest --method put ` 
--url "/subscriptions/$($subscription)/resourceGroups/$($rg)/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$($uaId)/federatedIdentityCredentials/$($ficId)?api-version=2022-01-31-PREVIEW" ` 
--headers "Content-Type=application/json" ` 
--body "{'properties': { 'issuer': 'https://aks.azure.com/issuerGUID', 'subject': 'system:serviceaccount:ns:svcaccount', 'audiences': ['api://AzureADTokenExchange'] }}" 
```

## List federated identity credentials on a user-assigned managed identity

To read all the federated identity credentials configured on a user-assigned managed identity:
```azurecli
az login 

# set variables 
# in Linux shell remove $ from set variable statement 
$location="westcentralus" // this can be any supported location  
$subscription="{your subscription ID}" 
$rg="fic-test-rg" 

# user assigned identity name 
$uaId="fic-test-ua" 

# federated identity credential name 
$ficId="fic-test-fic-name"  

# read all federated identity credentials assigned to the user-assigned managed identity 
az rest --method get --url "/subscriptions/$($subscription)/resourceGroups/$($rg)/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$($uaId)/federatedIdentityCredentials/$($ficId)?api-version=2022-01-31-PREVIEW" 
```

## Get a federated identity credential on a user-assigned managed identity

To get a federated identity credential (by ID):

```azurecli
az login 

# set variables 
# in Linux shell remove $ from set variable statement 
$location="westcentralus" // this can be any supported location  
$subscription="{your subscription ID}" 
$rg="fic-test-rg" 

# user assigned identity name 
$uaId="fic-test-ua" 

# federated identity credential name 
$ficId="fic-test-fic-name"  

# read federated identity credential 
az rest --method get --url "/subscriptions/$($subscription)/resourceGroups/$($rg)/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$($uaId)/federatedIdentityCredentials/$($ficId)?api-version=2022-01-31-PREVIEW" 
```

## Delete a federated identity credential from a user-assigned managed identity

```azure cli

# delete federated identity credential 
az rest --method delete --url "/subscriptions/$($subscription)/resourceGroups/$($rg)/providers/Microsoft.ManagedIdentity/userAssignedIdentities/$($uaId)/federatedIdentityCredentials/$($ficId)?api-version=2022-01-31-PREVIEW" 
```

::: zone-end

::: zone pivot="identity-mi-methods-powershell"

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](/azure/active-directory/managed-identities-azure-resources/overview). Be sure to review the [difference between a system-assigned and user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- Get the information for your external IdP and software workload, which you need in the following steps.
- To create a user-assigned managed identity and configure a federated identity credential, your account needs the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role assignment.
- To run the example scripts, you have two options:
  - Use [Azure Cloud Shell](../../cloud-shell/overview.md), which you can open by using the **Try It** button in the upper-right corner of code blocks.
  - Run scripts locally with Azure PowerShell, as described in the next section.
- [Create a user-assigned manged identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-powershell#list-user-assigned-managed-identities-2) 
- Find the object ID of the user-assigned managed identity, which you need in the following steps.

### Configure Azure PowerShell locally

To use Azure PowerShell locally for this article instead of using Cloud Shell:

1. Install [the latest version of Azure PowerShell](/powershell/azure/install-az-ps) if you haven't already.

1. Sign in to Azure.

    ```azurepowershell
    Connect-AzAccount
    ```

1. Install the [latest version of PowerShellGet](/powershell/scripting/gallery/installing-psget#for-systems-with-powershell-50-or-newer-you-can-install-the-latest-powershellget).

    ```azurepowershell
    Install-Module -Name PowerShellGet -AllowPrerelease
    ```

    You might need to `Exit` out of the current PowerShell session after you run this command for the next step.

1. Install the prerelease version of the `Az.ManagedServiceIdentity` module to perform the user-assigned managed identity operations in this article.

    ```azurepowershell
    Install-Module -Name Az.ManagedServiceIdentity -AllowPrerelease
    ```

## Configure a federated identity credential on a user-assigned managed identity


## List federated identity credentials on a user-assigned managed identity

## Get a federated identity credential on a user-assigned managed identity

## Delete a federated identity credential from a user-assigned managed identity

::: zone-end

::: zone pivot="identity-mi-methods-arm"

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](/azure/active-directory/managed-identities-azure-resources/overview). Be sure to review the [difference between a system-assigned and user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- Get the information for your external IdP and software workload, which you need in the following steps.
- To create a user-assigned managed identity and configure a federated identity credential, your account needs the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role assignment.
- [Create a user-assigned manged identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-arm#create-a-user-assigned-managed-identity-3)
- Find the object ID of the user-assigned managed identity, which you need in the following steps.

## Template creation and editing

Resource Manager templates help you deploy new or modified resources defined by an Azure resource group. Several options are available for template editing and deployment, both local and portal-based. You can:

- Use a [custom template from Azure Marketplace](../../azure-resource-manager/templates/deploy-portal.md#deploy-resources-from-custom-template) to create a template from scratch or base it on an existing common or [quickstart template](https://azure.microsoft.com/resources/templates/).
- Derive from an existing resource group by exporting a template. You can export them from either [the original deployment](../../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates) or from the [current state of the deployment](../../azure-resource-manager/management/manage-resource-groups-portal.md#export-resource-groups-to-templates).
- Use a local [JSON editor (such as VS Code)](../../azure-resource-manager/templates/quickstart-create-templates-use-the-portal.md), and then upload and deploy by using PowerShell or the Azure CLI.
- Use the Visual Studio [Azure Resource Group project](../../azure-resource-manager/templates/create-visual-studio-deployment-project.md) to create and deploy a template. 

## Configure a federated identity credential on a user-assigned managed identity

Federated identity credential and parent user assigned identity can be created or updated be means of template below.  You can [deploy ARM templates](/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal) from Azure Portal.

All of the template parameters are mandatory.

There is a limit of 3-120 symbols for a federated identity credential name length. It must be alphanumeric, dash, underscore. First symbol is alphanumeric only.  

You must add exactly 1 audience to a Federated Credential, this gets verified during token exchange. Please use “api://AzureADTokenExchange” as the default value.

List, Get, and Delete operations are not available with template. Please refer to Azure CLI for this.

```json
{ 

    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#", 
    "contentVersion": "1.0.0.0", 
    "variables": {}, 
    "parameters": { 
        "location": { 
            "type": "string", 
            "defaultValue": "westcentralus", 
            "metadata": { 
                "description": "Location for identities resources. FIC should be enabled in this region." 
            } 
        }, 
        "userAssignedIdentityName": { 
            "type": "string", 
            "defaultValue": "FIC_UA", 
            "metadata": { 
                "description": "Name of the User Assigned identity (parent identity)" 
            } 
        }, 
        "federatedIdentityCredential": { 
            "type": "string", 
            "defaultValue": "testCredential", 
            "metadata": { 
                "description": "Name of the Federated Identity Credential" 
            } 
        }, 
        "federatedIdentityCredentialIssuer": { 
            "type": "string", 
            "defaultValue": "https://aks.azure.com/issuerGUID", 
            "metadata": { 
                "description": "Federated Identity Credential token issuer" 
            } 
        }, 
        "federatedIdentityCredentialSubject": { 
            "type": "string", 
            "defaultValue": "system:serviceaccount:ns:svcaccount", 
            "metadata": { 
                "description": "Federated Identity Credential token subject" 
            } 
        }, 
        "federatedIdentityCredentialAudience": { 
            "type": "string", 
            "defaultValue": " api://AzureADTokenExchange", 
            "metadata": { 
                "description": "Federated Identity Credential audience. Single value is only supported." 
            } 
        } 
    }, 
    "resources": [ 
        { 
            "type": "Microsoft.ManagedIdentity/userAssignedIdentities", 
            "apiVersion": "2018-11-30", 
            "name": "[parameters('userAssignedIdentityName')]", 
            "location": "[parameters('location')]", 
            "tags": { 
                "firstTag": "ficTest" 
            }, 
            "resources": [ 
                { 
                    "type": "Microsoft.ManagedIdentity/userAssignedIdentities/federatedIdentityCredentials", 
                    "apiVersion": "2022-01-31-PREVIEW", 
                    "name": "[concat(parameters('userAssignedIdentityName'), '/', parameters('federatedIdentityCredential'))]", 
                    "dependsOn": [ 
                      "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName'))]" 
                    ], 
                    "properties": { 
                        "issuer": "[parameters('federatedIdentityCredentialIssuer')]", 
                        "subject": "[parameters('federatedIdentityCredentialSubject')]", 
                        "audiences": [ 
                            "[parameters('federatedIdentityCredentialAudience')]" 
                        ] 
                    } 
                } 
            ] 
        } 
    ] 
} 
```

::: zone-end

::: zone pivot="identity-mi-methods-rest"

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](/azure/active-directory/managed-identities-azure-resources/overview). Be sure to review the [difference between a system-assigned and user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before you continue.
- Get the information for your external IdP and software workload, which you need in the following steps.
- To create a user-assigned managed identity and configure a federated identity credential, your account needs the [Managed Identity Contributor](/azure/role-based-access-control/built-in-roles#managed-identity-contributor) role assignment.
- You can run all the commands in this article either in the cloud or locally:
  - To run in the cloud, use [Azure Cloud Shell](../../cloud-shell/overview.md).
  - To run locally, install [curl](https://curl.haxx.se/download.html) and the [Azure CLI](/cli/azure/install-azure-cli).
- [Create a user-assigned manged identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-rest#create-a-user-assigned-managed-identity-4)
- Find the object ID of the user-assigned managed identity, which you need in the following steps.

## Obtain a bearer access token

1. If you're running locally, sign in to Azure through the Azure CLI.

    ```
    az login
    ```

1. Obtain an access token by using [az account get-access-token](/cli/azure/account#az-account-get-access-token).

    ```azurecli-interactive
    az account get-access-token
    ```


## Configure a federated identity credential on a user-assigned managed identity

[Create or update a federated identity credential]() on the specified user-assigned managed identity.

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/provider
s/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/federatedIdenti
tyCredentials/<FEDERATED IDENTITY CREDENTIAL NAME>?api-version=2022-01-31-preview' -X PUT -d '{"properties": "{ "properties": { "issuer": "<ISSUER>", "subject": "<SUBJECT>", "audiences": [ "api://AzureADTokenExchange" ] }}"}' -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
```

```http
PUT https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/federatedIdentityCredentials/<FEDERATED IDENTITY CREDENTIAL NAME>?api-version=2022-01-31-preview

{
 "properties": {
 "issuer": "https://oidc.prod-aks.azure.com/IssuerGUID",
 "subject": "system:serviceaccount:ns:svcaccount",
 "audiences": [
 "api://AzureADTokenExchange"
 ]
 }
}
```

**Request headers**

|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token.        |

**Request body**

|Name  |Description  |
|---------|---------|
|properties.audiences      | Required. The list of audiences that can appear in the issued token. |
|properties.issuer       | Required. The URL of the issuer to be trusted. |
|properties.subject      | Required. The identifier of the external identity. |

## List federated identity credentials on a user-assigned managed identity

[List all the federated identity credentials]() on the specified user-assigned managed identity.

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/<RESOURCE NAME>/federatedIdentityCredentials?api-version=2022-01-31-preview' -H "Content-Type: application/json" -X GET -H "Authorization: Bearer <ACCESS TOKEN>"
```

```http
GET
https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/<RESOURCE NAME>/federatedIdentityCredentials?api-version=2022-01-31-preview
```

**Request headers**

|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token.        |

## Get a federated identity credential on a user-assigned managed identity

[Get a federated identity credentials]() on the specified user-assigned managed identity.

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/<RESOURCE NAME>/federatedIdentityCredentials/<FEDERATED IDENTITY CREDENTIAL RESOURCENAME>?api-version=2022-01-31-preview' -X GET -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
```

```http
GET
https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/<RESOURCE NAME>/federatedIdentityCredentials/<FEDERATED IDENTITY CREDENTIAL RESOURCENAME>?api-version=2022-01-31-preview
```

**Request headers**

|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token.        |

## Delete a federated identity credential from a user-assigned managed identity

[Delete a federated identity credentials]() on the specified user-assigned managed identity.

```bash
curl 'https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/<RESOURCE NAME>/federatedIdentityCredentials/<FEDERATED IDENTITY CREDENTIAL RESOURCENAME>?api-version=2022-01-31-preview' -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
```

```http
DELETE
https://management.azure.com/subscriptions/<SUBSCRIPTION ID>/resourceGroups/<RESOURCE GROUP>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<USER ASSIGNED IDENTITY NAME>/<RESOURCE NAME>/federatedIdentityCredentials/<FEDERATED IDENTITY CREDENTIAL RESOURCENAME>?api-version=2022-01-31-preview
```

**Request headers**

|Request header  |Description  |
|---------|---------|
|*Content-Type*     | Required. Set to `application/json`.        |
|*Authorization*     | Required. Set to a valid `Bearer` access token.        |
::: zone-end

## Next steps

- For information about the required format of JWTs created by external identity providers, read about the [assertion format](active-directory-certificate-credentials.md#assertion-format).