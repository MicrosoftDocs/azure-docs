---
title: Use a Linux VM system-assigned managed identity to access Azure AD Graph API
description: A tutorial that walks you through the process of using a Linux VM system-assigned managed identity to access Azure AD Graph API.
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

# Tutorial: Use a Linux VM system-assigned managed identity to access Azure AD Graph API

[!INCLUDE[preview-notice](~/includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to to use a system-assigned managed identity for a Linux virtual machine (VM) to access the Microsoft Graph API to retrieve its group memberships. Managed identities for Azure resources are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication without needing to insert credentials into your code.  For this tutorial you will query your VM identity's membership in Azure AD groups. Group information is often used in authorization decisions, for example. Under the covers, your VM's managed identity is represented by a **Service Principal** in Azure AD. Before you do the group query, add the service principal representing the VM's identity to a group in Azure AD. You can do this using Azure PowerShell, Azure AD PowerShell, or the Azure CLI.

> [!div class="checklist"]
> * Connect to Azure AD
> * Add your VM identity to a group in Azure AD 
> * Grant the VM's identity access to Azure AD Graph 
> * Get an access token using the VM identity and use it to call Azure AD Graph

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

- [Sign in to Azure portal](https://portal.azure.com)

- [Create a Linux virtual machine](/azure/virtual-machines/linux/quick-create-portal)

- [Enable system-assigned managed identity on your virtual machine](/azure/active-directory/managed-service-identity/qs-configure-portal-windows-vm#enable-system-assigned-identity-on-an-existing-vm)

- To grant a VM identity access to Azure AD Graph, your account needs to be assigned the **Global Admin** role in Azure AD.

## Connect to Azure AD

You need to connect to Azure AD to assign the VM to a group as well as grant the VM permission to retrieve its group memberships.

```cli
az login
```

## Add your VM identity to a group in Azure AD

When you enabled system-assigned managed identity on the Linux VM, it created a service principal in Azure AD.  Now you need to add the the VM to a group. Refer to the following article for instructions on how to add your VM to a group in Azure AD:

- [Add group members](/cli/azure/ad/group/member?view=azure-cli-latest#az-ad-group-member-add)

## Grant your VM access to the Azure AD Graph API

Using managed identities for Azure resources, your code can get access tokens to authenticate to resources that support Azure AD authentication. The Microsoft Azure AD Graph API supports Azure AD authentication. In this step, you will grant your VM identity's service principal access to the Azure AD Graph so that it can query group memberships. Service principals are granted access to the Microsoft or Azure AD Graph through **Application Permissions**. The type of application permission you need to grant depends on the entity you want to access in the MS or Azure AD Graph.

For this tutorial, you will grant your VM identity the ability to query group memberships using the ```Directory.Read.All``` application permission. To grant this permission, you will need a user account that is assigned the Global Admin role in Azure AD. Normally you would grant an application permission by visiting your application's registration in the Azure portal and adding the permission there. However, managed identities for Azure resources does not register application objects in Azure AD, it only registers service principals. To register the application permission you will use the Azure AD PowerShell command line tool. 

Azure AD Graph:
- Service Principal appId (used when granting app permission): 00000002-0000-0000-c000-000000000000
- Resource ID (used when requesting access token from managed identities for Azure resources): https://graph.windows.net
- Permission scope reference: [Azure AD Graph Permissions Reference](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-permission-scopes)

### Grant application permissions using CURL

You will need Azure AD PowerShell to use this option. If you don't have it installed, [download the latest version](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2) before continuing.

1. Retrieve a token to make CURL requests:

   ```cli
   az account get-access-token --resource "https://graph.windows.net/"
   ```

2. You will need to retrieve and note the `objectId` of your VM to grant it permissions to read its group membership. Replace `<TENANT ID>` with the tenant id for your subscription and `<ACCESS TOKEN>` with the access token you retrieved in the preceding step.

   ```bash
   curl 'https://graph.windows.net/<TENANT ID>/servicePrincipals?$filter=startswith%28displayName%2C%27myVM%27%29&api-version=1.6' -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

3. Next, you will need to retrieve and note the `objectId` for Windows Azure Active Directory as well as the id for the Directory.Read.All permission.  Replace `<TENANT ID>` with the tenant id for your subscription and `<ACCESS TOKEN>` with the access token you retrieved earlier.

   ```bash
   curl "https://graph.windows.net/<TENANT ID>/servicePrincipals?api-version=1.6&%24filter=appId%20eq%20'00000002-0000-0000-c000-000000000000'" -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

4. Now, you will grant the VM's service principal to read Azure AD directory objects using the Azure AD Graph API.

   ```bash 


   ```powershell
   $ManagedIdentitiesServicePrincipal = Get-AzureADServicePrincipal -Filter "displayName eq 'myVM'"
   $GraphAppId = "00000002-0000-0000-c000-000000000000"
   $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"
   $PermissionName = "Directory.Read.All"
   $AppRole = $GraphServicePrincipal.AppRoles | Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}
   New-AzureAdServiceAppRoleAssignment -ObjectId $ManagedIdentitiesServicePrincipal.ObjectId -PrincipalId $ManagedIdentitiesServicePrincipal.ObjectId -ResourceId $GraphServicePrincipal.ObjectId -Id $AppRole.Id
   ``` 

   Output from the final command should look like this, returning the ID of the assignment:
        
   `ObjectId`:`gzR5KyLAiUOTiqFhNeWZWBtK7ZKqNJxAiWYXYVHlgMs`
   `ResourceDisplayName`:`Windows Azure Active Directory`
   `PrincipalDisplayName`:`myVM` 

   If the call to `New-AzureAdServiceAppRoleAssignment` fails with the error `bad request, one or more properties are invalid` the app permission may already be assigned to the VM identity's service principal. You can use the following PowerShell commands to check if the application permission already exists between your VM's identity and Azure AD Graph:

   ```powershell
   $ManagedIdentitiesServicePrincipal = Get-AzureADServicePrincipal -Filter "displayName eq '<VM-NAME>'"
   $GraphAppId = "00000002-0000-0000-c000-000000000000"
   $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"
   $PermissionName = "Directory.Read.All"
   $AppRole = $GraphServicePrincipal.AppRoles | Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}
   Get-AzureADServiceAppRoleAssignment -ObjectId $GraphServicePrincipal.ObjectId | Where-Object {$_.Id -eq $AppRole.Id -and $_.PrincipalId -eq $ManagedIdentitiesServicePrincipal.ObjectId}
   ```

   You can use the following PowerShell commands to list all app permissions that have been granted to Azure AD Graph:

   ```powershell
   $GraphAppId = "00000002-0000-0000-c000-000000000000"
   $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"
   Get-AzureADServiceAppRoleAssignment -ObjectId $GraphServicePrincipal.ObjectId
   ``` 

   You can use the following PowerShell commands to remove app permissions that have been granted to your VM's identity for Azure AD Graph:

   ```powershell
   $ManagedIdentitiesServicePrincipal = Get-AzureADServicePrincipal -Filter "displayName eq '<VM-NAME>'"
   $GraphAppId = "00000002-0000-0000-c000-000000000000"
   $GraphServicePrincipal = Get-AzureADServicePrincipal -Filter "appId eq '$GraphAppId'"
   $PermissionName = "Directory.Read.All"
   $AppRole = $GraphServicePrincipal.AppRoles | Where-Object {$_.Value -eq $PermissionName -and $_.AllowedMemberTypes -contains "Application"}   
   $ServiceAppRoleAssignment = Get-AzureADServiceAppRoleAssignment -ObjectId $GraphServicePrincipal.ObjectId | Where-Object {$_.Id -eq $AppRole.Id -and $_.PrincipalId -eq $ManagedIdentitiesServicePrincipal.ObjectId}
   Remove-AzureADServiceAppRoleAssignment -AppRoleAssignmentId $ServiceAppRoleAssignment.ObjectId -ObjectId $ManagedIdentitiesServicePrincipal.ObjectId
   ```
 
## Get an access token using the VM's identity and use it to call Azure AD Graph 

To use the VM's system assigned managed identity for authentication to Azure AD Graph, you need to make requests from the VM.

1. In the portal, navigate to **Virtual Machines**, go to your Linux VM, and in the **Overview** blade, click **Connect**. 
2. Enter in your **Username** and **Password** you used when you created the Linux VM.
3. Now that you have created a Remote Desktop Connection with the virtual machine, open PowerShell in the remote session.  
4. Using PowerShell’s Invoke-WebRequest, make a request to the local managed identities for Azure resources endpoint to get an access token for Azure AD Graph.

   ```powershell
   $response = Invoke-WebRequest -Uri 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://graph.windows.net' -Method GET -Headers @{Metadata="true"}
   ```

   Convert the response from a JSON object to a PowerShell object.

   ```powershell
   $content = $response.Content | ConvertFrom-Json
   ```

   Extract the access token from the response.

   ```powershell
   $AccessToken = $content.access_token
   ```

5. Using the Object ID of your VM identity's service principal (you can retrieve this value from the variable declared in previous steps: ``$ManagedIdentitiesServicePrincipal.ObjectId``), you can query the Azure AD Graph API to retrieve its group memberships. Replace <OBJECT ID> with the Object ID from the previous step and <ACCESS-TOKEN> with the previously obtained access token:

   ```powershell
   Invoke-WebRequest -v 'https://graph.windows.net/<Tenant ID>/servicePrincipals/<VM Object ID>/getMemberGroups?api-version=1.6' -Method POST -Body '{"securityEnabledOnly":"false"}' -Headers @{Authorization="Bearer $AccessToken"} -ContentType "application/json"
   ```
   
   The response contains the `Object ID` of the group that you added your VM's service principal to in earlier steps.

   Response:

   ```powershell   
   Content : {"odata.metadata":"https://graph.windows.net/<Tenant ID>/$metadata#Collection(Edm.String)","value":["<ObjectID of VM's group membership>"]}
   ```

## Next steps

In this tutorial, you learned how to use a Windows VM system-assigned managed identity to access Azure AD Graph.  To learn more about Azure AD Graph see:

>[!div class="nextstepaction"]
>[Azure AD Graph](https://docs.microsoft.com/azure/active-directory/develop/active-directory-graph-api)