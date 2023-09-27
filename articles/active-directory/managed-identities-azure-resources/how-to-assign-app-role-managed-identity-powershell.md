---
title: Assign a managed identity to an application role using PowerShell
description: Step-by-step instructions for assigning a managed identity access to another application's role, using PowerShell.
services: active-directory
documentationcenter: 
author: johndowns
manager:
editor: 

ms.service: active-directory
ms.subservice: msi
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/07/2023
ms.author: jodowns
ms.collection: M365-identity-device-management 
ms.custom: has-azure-ad-ps-ref
---

# Assign a managed identity access to an application role using PowerShell

Managed identities for Azure resources provide Azure services with an identity in Microsoft Entra ID. They work without needing credentials in your code. Azure services use this identity to authenticate to services that support Microsoft Entra authentication. Application roles provide a form of role-based access control, and allow a service to implement authorization rules.

> [!NOTE]
> The tokens that your application receives are cached by the underlying infrastructure, which means that any changes to the managed identity's roles can take significant time to take effect. For more information, see [Limitation of using managed identities for authorization](managed-identity-best-practice-recommendations.md#limitation-of-using-managed-identities-for-authorization).

In this article, you learn how to assign a managed identity to an application role exposed by another application using the Microsoft Graph PowerShell SDK.

## Prerequisites

- If you're unfamiliar with managed identities for Azure resources, check out the [overview section](overview.md). **Be sure to review the [difference between a system-assigned and user-assigned managed identity](overview.md#managed-identity-types)**.
- If you don't already have an Azure account, [sign up for a free account](https://azure.microsoft.com/free/) before continuing.
- To run the example scripts, you have two options:
    - Use the [Azure Cloud Shell](../../cloud-shell/overview.md), which you can open using the **Try It** button on the top-right corner of code blocks.
    - Run scripts locally by installing the latest version of the [Microsoft Graph PowerShell SDK](/powershell/microsoftgraph/get-started).

## Assign a managed identity access to another application's app role

1. Enable managed identity on an Azure resource, [such as an Azure VM](qs-configure-powershell-windows-vm.md).

1. Find the object ID of the managed identity's service principal.

    **For a system-assigned managed identity**, you can find the object ID on the Azure portal on the resource's **Identity** page. You can also use the following PowerShell script to find the object ID. You'll need the resource ID of the resource you created in step 1, which is available in the Azure portal on the resource's **Properties** page.

     ```powershell
     $resourceIdWithManagedIdentity = '/subscriptions/{my subscription ID}/resourceGroups/{my resource group name}/providers/Microsoft.Compute/virtualMachines/{my virtual machine name}'
     (Get-AzResource -ResourceId $resourceIdWithManagedIdentity).Identity.PrincipalId
     ```

     **For a user-assigned managed identity**, you can find the managed identity's object ID on the Azure portal on the resource's **Overview** page. You can also use the following PowerShell script to find the object ID. You'll need the resource ID of the user-assigned managed identity.

     ```powershell
     $userManagedIdentityResourceId = '/subscriptions/{my subscription ID}/resourceGroups/{my resource group name}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{my managed identity name}'
     (Get-AzResource -ResourceId $userManagedIdentityResourceId).Properties.PrincipalId
     ```

1. Create a new application registration to represent the service that your managed identity will send a request to. If the API or service that exposes the app role grant to the managed identity already has a service principal in your Microsoft Entra tenant, skip this step. For example, if you want to grant the managed identity access to the Microsoft Graph API, you can skip this step.

1. Find the object ID of the service application's service principal. You can find this using the Azure portal. Go to Microsoft Entra ID and open the **Enterprise applications** page, then find the application and look for the **Object ID**. You can also find the service principal's object ID by its display name using the following PowerShell script:

    ```powershell
    $serverServicePrincipalObjectId = (Get-MgServicePrincipal -Filter "DisplayName eq '$applicationName'").Id
    ```

    > [!NOTE]
    > Display names for applications are not unique, so you should verify that you obtain the correct application's service principal.

1. Add an [app role](../develop/howto-add-app-roles-in-apps.md) to the application you created in step 3. You can create the role using the Azure portal or by using Microsoft Graph. For example, you could add an app role by running the following query on Graph explorer:

    ```http
    PATCH /applications/{id}/

    {
        "appRoles": [
            {
                "allowedMemberTypes": [
                    "User",
                    "Application"
                ],
                "description": "Read reports",
                "id": "1e250995-3081-451e-866c-0f6efef9c638",
                "displayName": "Report reader",
                "isEnabled": true,
                "value": "report.read"
            }
        ]
    }
    ```

1. Assign the app role to the managed identity. You'll need the following information to assign the app role:
    * `managedIdentityObjectId`: the object ID of the managed identity's service principal, which you found in step 2.
    * `serverServicePrincipalObjectId`: the object ID of the server application's service principal, which you found in step 4.
    * `appRoleId`: the ID of the app role exposed by the server app, which you generated in step 5 - in the example, the app role ID is `0566419e-bb95-4d9d-a4f8-ed9a0f147fa6`.
   
   Execute the following PowerShell command to add the role assignment:

    ```powershell
    New-MgServicePrincipalAppRoleAssignment `
        -ServicePrincipalId $managedIdentityObjectId `
        -PrincipalId $managedIdentityObjectId `
        -ResourceId $serverServicePrincipalObjectId `
        -AppRoleId $appRoleId
    ```

## Complete script

This example script shows how to assign an Azure web app's managed identity to an app role.

```powershell
# Install the module.
# Install-Module Microsoft.Graph -Scope CurrentUser

# Your tenant ID (in the Azure portal, under Azure Active Directory > Overview).
$tenantID = '<tenant-id>'

# The name of your web app, which has a managed identity that should be assigned to the server app's app role.
$webAppName = '<web-app-name>'
$resourceGroupName = '<resource-group-name-containing-web-app>'

# The name of the server app that exposes the app role.
$serverApplicationName = '<server-application-name>' # For example, MyApi

# The name of the app role that the managed identity should be assigned to.
$appRoleName = '<app-role-name>' # For example, MyApi.Read.All

# Look up the web app's managed identity's object ID.
$managedIdentityObjectId = (Get-AzWebApp -ResourceGroupName $resourceGroupName -Name $webAppName).identity.principalid

Connect-MgGraph -TenantId $tenantId -Scopes 'Application.Read.All','Application.ReadWrite.All','AppRoleAssignment.ReadWrite.All','Directory.AccessAsUser.All','Directory.Read.All','Directory.ReadWrite.All'

# Look up the details about the server app's service principal and app role.
$serverServicePrincipal = (Get-MgServicePrincipal -Filter "DisplayName eq '$serverApplicationName'")
$serverServicePrincipalObjectId = $serverServicePrincipal.Id
$appRoleId = ($serverServicePrincipal.AppRoles | Where-Object {$_.Value -eq $appRoleName }).Id

# Assign the managed identity access to the app role.
New-MgServicePrincipalAppRoleAssignment `
    -ServicePrincipalId $serverServicePrincipalObjectId `
    -PrincipalId $managedIdentityObjectId `
    -ResourceId $serverServicePrincipalObjectId `
    -AppRoleId $appRoleId
```

---

## Next steps

- [Managed identity for Azure resources overview](overview.md)
- To enable managed identity on an Azure VM, see [Configure managed identities for Azure resources on an Azure VM using PowerShell](qs-configure-powershell-windows-vm.md).
