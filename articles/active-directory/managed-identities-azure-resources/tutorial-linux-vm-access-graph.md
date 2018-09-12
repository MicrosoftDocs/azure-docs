---
title: Use a Linux VM system-assigned managed identity to access Microsoft Graph
description: A tutorial that walks you through the process of using a Linux VM system-assigned managed identity to access Microsoft Graph.
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: daveba

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/20/2018
ms.author: daveba
---

# Tutorial: Use a Linux VM system-assigned managed identity to access Microsoft Graph

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to to use a system-assigned managed identity for a Linux virtual machine (VM) to access the Microsoft Graph API. Managed identities for Azure resources are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication without needing to insert credentials into your code.

> [!div class="checklist"]
> * Add your VM identity to a group in Azure AD 
> * Grant the VM's identity access to the Microsoft Graph 
> * Get an access token using the VM identity and use it to call Microsoft Graph

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

- [Sign in to Azure portal](https://portal.azure.com)

- [Create a Linux virtual machine](/azure/virtual-machines/linux/quick-create-portal)

- [Enable system-assigned managed identity on your virtual machine](/azure/active-directory/managed-service-identity/qs-configure-portal-windows-vm#enable-system-assigned-identity-on-an-existing-vm)

- To grant a VM identity access to the MS Graph, your account needs to be assigned the Global Admin role in Azure AD.

## Add your VM identity to a group in Azure AD

For this tutorial you will query your VM identity's membership in Azure AD groups. Group information is often used in authorization decisions, for example. Under the covers, your VM's managed identity is represented by a **Service Principal** in Azure AD. Before you do the group query, add the service principal representing the VM's identity to a group in Azure AD. You can do this using Azure PowerShell, Azure AD PowerShell, or the Azure CLI.

### Option 1: Add service principal to group using Azure PowerShell

You will need Azure PowerShell to use this option. If you don't have it installed, [download the latest version](https://docs.microsoft.com/powershell/azure/install-azurerm-ps) before continuing.

### Option 2: Add service principal to group using Azure AD PowerShell

You will need Azure AD PowerShell to use this option. If you don't have it installed, [download the latest version](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2) before continuing.

### Option 3: Add service principal to group using Azure CLI

You will need the Azure AD CLI to use this option. If you don't have it installed, [download the latest version](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest) before continuing.

## Grant your VM access to the Microsoft Graph

Using MSI your code can get access tokens to authenticate to resources that support Azure AD authentication. Both the Microsoft Graph API and Azure AD Graph API  support Azure AD authentication. In this step you will grant your VM identity's service principal access to the Azure AD Graph so that it can query group memberships. Service principals are granted access to the MS or Azure AD Graph through **Application Permissions**. The type of application permission you need to grant depends on the entity you want to access in the MS or Azure AD Graph.

For this tutorial you will grant your VM identity the ability to query group memberships using the ```Directory.Read.All``` application permission. To grant this permission you will need a user account that is assigned the Global Admin role in Azure AD. Normally you would grant an application permission by visiting your application's registration in the Azure portal and adding the permission there. However, MSI does not register application objects in Azure AD, it only registers service principals. To register the application permission you will use a command line tool instead. You can use one of two options: **Azure AD PowerShell** or **curl**.

Not all entities in Azure AD can be accessed through the Microsoft Graph at this time. This tutorial will query the group membership of a service principal, which is currently only available through the Azure AD Graph. Both MS Graph and Azure AD Graph accept access tokens from Azure AD via Managed Service Identity. You can modify the steps in this tutorial to access the MS Graph by changing the following parameters:

Microsoft Graph:
- Service Principal appId (used when granting app permission): 00000003-0000-0000-c000-000000000000
- Resource ID (used when requesting access token from MSI): https://graph.microsoft.com
- Permission scope reference: [Microsoft Graph Permissions Reference](https://developer.microsoft.com/graph/docs/concepts/permissions_reference)

Azure AD Graph:
- Service Principal appId (used when granting app permission): 00000002-0000-0000-c000-000000000000
- Resource ID (used when requesting access token from MSI): https://graph.windows.net
- Permission scope reference: [Azure AD Graph Permissions Reference](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-permission-scopes)

### Option 1: Grant application permissions using Azure AD PowerShell

You will need Azure AD PowerShell to use this option. If you don't have it installed, [download the latest version](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2) before continuing.

1. Open a PowerShell window and connect to Azure AD using the ```powershell Connect-AzureAD``` command.  Sign in using an account that is assigned to the Global Admin role.
2. Run the following PowerShell commands to assign the ```Directory.Read.All``` application permission to the service principal that represents your VM's identity. Replace <VM-NAME> with the display name of your VM.

   ```powershell
   $MSIServicePrincipal = Get-AzureADServicePrincipal -Filter "displayName eq '<VM-NAME>'"
   $GraphAppId = "00000002-0000-0000-c000-000000000000" # Replace with "00000003-0000-0000-c000-000000000000" for MS Graph
   $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"
   $PermissionName = "Directory.Read.All"
   $AppRole = $GraphServicePrincipal.AppRoles | Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}
   New-AzureAdServiceAppRoleAssignment -ObjectId $MSIServicePrincipal.ObjectId -PrincipalId $MSIServicePrincipal.ObjectId -ResourceId $GraphServicePrincipal.ObjectId -Id $AppRole.Id
   ``` 

   Output from the final command should look like this, returning the ID of the assignment:

   ```powershell
   ObjectId                                    ResourceDisplayName            PrincipalDisplayName
   --------                                    -------------------            --------------------
   gzR5KyLAiUOTiqFhNeWZWBtK7ZKqNJxAiWYXYVHlgMs Windows Azure Active Directory <VM-NAME>
   ```

   If the call to ```powershell New-AzureAdServiceAppRoleAssignment``` fails with the error "bad request, one or more properties are invalid" the app permission may already be assigned to the VM identity's service principal. You can use the following PowerShell commands to check if the application permission already exists between your VM's identity and MS Graph:

   ```powershell
   $MSIServicePrincipal = Get-AzureADServicePrincipal -Filter "displayName eq '<VM-NAME>'"
   $GraphAppId = "00000002-0000-0000-c000-000000000000" # Replace with "00000003-0000-0000-c000-000000000000" for MS Graph
   $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"
   $PermissionName = "Directory.Read.All"
   $AppRole = $GraphServicePrincipal.AppRoles | Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}
   Get-AzureADServiceAppRoleAssignment -ObjectId $GraphServicePrincipal.ObjectId | Where-Object {$_.Id -eq $AppRole.Id -and $_.PrincipalId -eq $MSIServicePrincipal.ObjectId}
   ```

   You can use the following PowerShell commands to list all app permissions that have been granted to the MS Graph:

   ```powershell
   $GraphAppId = "00000002-0000-0000-c000-000000000000" # Replace with "00000003-0000-0000-c000-000000000000" for MS Graph
   $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"
   Get-AzureADServiceAppRoleAssignment -ObjectId $GraphServicePrincipal.ObjectId
   ``` 

   You can use the following PowerShell commands to remove app permissions that have been granted to your VM identity for the MS Graph:

   ```powershell
   $MSIServicePrincipal = Get-AzureADServicePrincipal -Filter "displayName eq '<VM-NAME>'"
   $GraphAppId = "00000002-0000-0000-c000-000000000000" # Replace with "00000003-0000-0000-c000-000000000000" for MS Graph
   $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"
   $PermissionName = "Directory.Read.All"
   $AppRole = $GraphServicePrincipal.AppRoles | Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}   
   $ServiceAppRoleAssignment = Get-AzureADServiceAppRoleAssignment -ObjectId $GraphServicePrincipal.ObjectId | Where-Object {$_.Id -eq $AppRole.Id -and $_.PrincipalId -eq $MSIServicePrincipal.ObjectId}
   Remove-AzureADServiceAppRoleAssignment -AppRoleAssignmentId $ServiceAppRoleAssignment.ObjectId -ObjectId $MSIServicePrincipal.ObjectId
   ```

   ### Option 2: Grant application permissions using curl

Coming soon!

## Get an access token using the VM's identity and use it to call Microsoft Graph 

To complete these steps, you will need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](../../virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](../../virtual-machines/linux/mac-create-ssh-keys.md).

1. In the portal, navigate to your Linux VM and in the **Overview**, click **Connect**.  
2. **Connect** to the VM with the SSH client of your choice. 
3. In the terminal window, using CURL, make a request to the local MSI endpoint to get an access token for the Azure AD Graph.  If you want to access MS Graph, use https://graph.microsoft.com as the resource ID instead.  
     
   ```bash
   curl 'http://localhost:50342/oauth2/token?resource=https://graph.windows.net' -H Metadata:true
   ```
    
   The response includes the access token you need to access Azure Resource Manager. 
    
   ```bash
   {
    "access_token":"eyJ0eXAiOiJKV...",
   "expires_in":"3599",
   "expires_on":"1519622535",
   "not_before":"1519618635",
   "resource":"https://graph.windows.net",
   "token_type":"Bearer"
   }
   ```
    
4. Using the Object ID of your VM identity's service principal you can query the Azure AD Graph to retrieve its group memberships. Replace <OBJECT-ID> with the Object ID from the previous step and <ACCESS-TOKEN> with the previously obtained acccess token:

   ```bash
   curl 'https://graph.windows.net/myorganization/servicePrincipals/<OBJECT-ID>/getMemberGroups?api-version=1.6' -X POST -d "{\"securityEnabledOnly\": false}" -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS-TOKEN>"
   ```

   The response contains the group membership that you added earlier.

   Response:

   ```bash
   
   ```

## Next steps

In this tutorial, you learned how to use a Managed Service Identity on a Linux virtual machine to access Microsoft Graph.  To learn more about Micrsofot Graph see:

> [!div class="nextstepaction"]
>[Microsoft Graph](https://developer.microsoft.com/en-us/graph/docs/concepts/overview)