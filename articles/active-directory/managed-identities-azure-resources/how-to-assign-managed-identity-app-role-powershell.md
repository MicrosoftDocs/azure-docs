---
title: Assign a managed identity to an application role using PowerShell - Azure AD
description: Step-by-step instructions for assigning a managed identity access to another application's role, using PowerShell.
services: active-directory
documentationcenter: 
author: johndowns
manager:
editor: 

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/13/2020
ms.author: jodowns
ms.collection: M365-identity-device-management
---

# Assign a managed identity access to an application role using PowerShell

Managed identities for Azure resources provide Azure services with a managed identity in Azure Active Directory. You can use this identity to authenticate to services that support Azure AD authentication, without needing credentials in your code. Application roles provide a form of role-based access control, and allow for authorization rules to be enforced.

In this article, you learn how to assign a managed identity to an application role exposed by another application using Azure PowerShell.

[!INCLUDE [az-powershell-update](../../../includes/updated-for-az.md)]

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To run the example scripts, you have two options:
    - Use the [Azure Cloud Shell](../../cloud-shell/overview.md), which you can open using the **Try It** button on the top right corner of code blocks.
    - Run scripts locally by installing the latest version of [Azure PowerShell](/powershell/azure/install-az-ps), then sign in to Azure using `Connect-AzAccount`. 

## Use Azure AD to assign a managed identity access to another application's app role

1. Enable managed identity on an Azure resource, [such as an Azure VM](qs-configure-powershell-windows-vm.md).

1. Create a new application registration to represent the service that your managed identity will send a request to. If you already have an application that you want your managed identity to communicate with, skip this step.

1. Add an [app role](../develop/howto-add-app-roles-in-azure-ad-apps.md) to the application you created in step 2. You can create the role [using the Azure portal](../develop/howto-add-app-roles-in-azure-ad-apps.md#declare-app-roles-using-azure-portal) or using the Graph API. For example, you could add an app role like this:

    ```json
    {
        "allowedMemberTypes": [
            "Application"
        ],
        "displayName": "Read data from MyApi",
        "id": "0566419e-bb95-4d9d-a4f8-ed9a0f147fa6",
        "isEnabled": true,
        "description": "Allow the application to read data as itself.",
        "value": "MyApi.Read.All"
    }
    ```

1. Assemble the information you need to assign the app role:
    * `managedIdentityResourceName`: the name of the resource exposing the managed identity, which you generated in step 1.
    * `serverAppName`: the name of the application that exposes the app role, which you generated in step 2.
    * `appRoleId`: the ID of the app role exposed by the server app, which you generated in step 3 - in the example, the app role ID is `0566419e-bb95-4d9d-a4f8-ed9a0f147fa6`.

2. Assign the app role to the managed identity by executing the following PowerShell script:

    ```powershell
    $managedIdentityResourceName = 'myvm'
    $serverAppName = 'TestApi'
    $appRoleId = '0566419e-bb95-4d9d-a4f8-ed9a0f147fa6'
    Connect-AzureAD # Connect as a global admin
    $serverServicePrincipalObjectId = (Get-AzureADServicePrincipal -Filter "DisplayName eq '$serverAppName'").ObjectId
    $clientServicePrincipalObjectId = (Get-AzureADServicePrincipal -Filter "DisplayName eq '$managedIdentityResourceName'").ObjectId
    New-AzureADServiceAppRoleAssignment -ObjectId $clientServicePrincipalObjectId -Id $appRoleId -PrincipalId $clientServicePrincipalObjectId -ResourceId $serverServicePrincipalObjectId
    ```

## Next steps

- [Managed identity for Azure resources overview](overview.md)
- To enable managed identity on an Azure VM, see [Configure managed identities for Azure resources on an Azure VM using PowerShell](qs-configure-powershell-windows-vm.md).
