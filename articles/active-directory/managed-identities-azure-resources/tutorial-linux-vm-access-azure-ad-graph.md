---
title: Use a Linux VM system-assigned managed identity to access Azure AD Graph API
description: A tutorial that walks you through the process of using a Linux VM system-assigned managed identity to access Azure AD Graph API.
services: active-directory
documentationcenter: ''
author: MarkusVi
manager: daveba
editor: daveba

ms.service: active-directory
ms.subservice: msi
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 08/20/2018
ms.author: markvi
ms.collection: M365-identity-device-management
---

# Tutorial: Use a Linux VM system-assigned managed identity to access Azure AD Graph API

[!INCLUDE [preview-notice](~/includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to use a system-assigned managed identity for a Linux virtual machine (VM) to access the Azure AD Graph API to retrieve its group memberships. Managed identities for Azure resources are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication without needing to insert credentials into your code.  

For this tutorial, you will query your VM identity's membership in Azure AD groups. Group information is often used in authorization decisions. Under the covers, your VM's managed identity is represented by a **Service Principal** in Azure AD. 

> [!div class="checklist"]
> * Connect to Azure AD
> * Add your VM identity to a group in Azure AD 
> * Grant the VM's identity access to Azure AD Graph 
> * Get an access token using the VM identity and use it to call Azure AD Graph

## Prerequisites

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

- [Install the latest version of the Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli)

- To grant a VM identity access to Azure AD Graph, your account needs to be assigned the **Global Admin** role in Azure AD.

## Connect to Azure AD

You need to connect to Azure AD to assign the VM to a group as well as grant the VM permission to retrieve its group memberships.

```cli
az login
```

## Add your VM's identity to a group in Azure AD

When you enabled system-assigned managed identity on the Linux VM, it created a service principal in Azure AD.  You need to add the VM to a group. Refer to the following article for instructions on how to add your VM to a group in Azure AD:

- [Add group members](/cli/azure/ad/group/member?view=azure-cli-latest#az-ad-group-member-add)

## Grant your VM access to the Azure AD Graph API

Using managed identities for Azure resources, your code can get access tokens to authenticate to resources that support Azure AD authentication. The Microsoft Azure AD Graph API supports Azure AD authentication. In this step, you will grant your VM identity's service principal access to the Azure AD Graph so that it can query group memberships. Service principals are granted access to the Microsoft or Azure AD Graph through **Application Permissions**. The type of application permission you need to grant depends on the entity you want to access in the MS or Azure AD Graph.

For this tutorial, you will grant your VM identity the ability to query group memberships using the `Directory.Read.All` application permission. To grant this permission, you will need a user account that is assigned the Global Admin role in Azure AD. Normally you would grant an application permission by visiting your application's registration in the Azure portal and adding the permission there. However, managed identities for Azure resources does not register application objects in Azure AD, it only registers service principals. To register the application permission you will use the Azure AD PowerShell command line tool. 

Azure AD Graph:
- Service Principal appId (used when granting app permission): 00000002-0000-0000-c000-000000000000
- Resource ID (used when requesting access token from managed identities for Azure resources): https://graph.windows.net
- Permission scope reference: [Azure AD Graph Permissions Reference](https://msdn.microsoft.com/Library/Azure/Ad/Graph/howto/azure-ad-graph-api-permission-scopes)

### Grant application permissions using CURL

1. Retrieve a token to make CURL requests:

   ```cli
   az account get-access-token --resource "https://graph.windows.net/"
   ```

2. You will need to retrieve and note the `objectId` of your VM. It's used in subsequent steps to grant permissions to the VM to read its group membership. Replace `<ACCESS TOKEN>` with the access token you retrieved in the preceding step.

   ```bash
   curl 'https://graph.windows.net/myorganization/servicePrincipals?$filter=startswith%28displayName%2C%27myVM%27%29&api-version=1.6' -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

3. Using the Azure AD Graph appID, 00000002-0000-0000-c000-000000000000, retrieve and note the `objectId` for `odata.type: Microsoft.DirectoryServices.ServicePrincipal` and the `id` for the `Directory.Read.All` app role permission.  Replace `<ACCESS TOKEN>` with the access token you retrieved earlier.

   ```bash
   curl "https://graph.windows.net/myorganization/servicePrincipals?api-version=1.6&%24filter=appId%20eq%20'00000002-0000-0000-c000-000000000000'" -H "Authorization: Bearer <ACCESS TOKEN>"
   ```

   Response:

   ```json
   "odata.metadata":"https://graph.windows.net/myorganization/$metadata#directoryObjects",
   "value":[
      {
         "odata.type":"Microsoft.DirectoryServices.ServicePrincipal",
         "objectType":"ServicePrincipal",
         "objectId":"81789304-ff96-402b-ae73-07ec0db26721",
         "deletionTimestamp":null,
         "accountEnabled":true,
         "addIns":[
         ],
         "alternativeNames":[
         ],
         "appDisplayName":"Windows Azure Active Directory",
         "appId":"00000002-0000-0000-c000-000000000000",
         "appOwnerTenantId":"f8cdef31-a31e-4b4a-93e4-5f571e91255a",
         "appRoleAssignmentRequired":false,
         "appRoles":[
            {
               "allowedMemberTypes":[
                  "Application"
               ],
               "description":"Allows the app to read data in your company or school directory, such as users, groups, and apps.",
               "displayName":"Read directory data",
               "id":"5778995a-e1bf-45b8-affa-663a9f3f4d04",
               "isEnabled":true,
               "value":"Directory.Read.All"
            },
            {
               //other appRoles values
            }
   ``` 

4. Now, grant the VM's service principal read access to Azure AD directory objects using the Azure AD Graph API.  The `id` value is the value for the `Directory.Read.All` app role permission and the `resourceId` is the `objectId` for the service principal `odata.type:Microsoft.DirectoryServices.ServicePrincipal` (the values you noted in the previous step).

   ```bash
   curl "https://graph.windows.net/myorganization/servicePrincipals/<VM Object ID>/appRoleAssignments?api-version=1.6" -X POST -d '{"id":"5778995a-e1bf-45b8-affa-663a9f3f4d04","principalId":"<VM Object ID>","resourceId":"81789304-ff96-402b-ae73-07ec0db26721"}'-H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS TOKEN>"
   ``` 
 
## Get an access token using the VM's identity to call Azure AD Graph 

To complete these steps, you will need an SSH client. If you are using Windows, you can use the SSH client in the [Windows Subsystem for Linux](https://msdn.microsoft.com/commandline/wsl/about). If you need assistance configuring your SSH client's keys, see [How to Use SSH keys with Windows on Azure](../../virtual-machines/linux/ssh-from-windows.md), or [How to create and use an SSH public and private key pair for Linux VMs in Azure](../../virtual-machines/linux/mac-create-ssh-keys.md).

1. In the portal, navigate to your Linux VM and in the **Overview**, click **Connect**.  
2. **Connect** to the VM with the SSH client of your choice. 
3. In the terminal window, using CURL, make a request to the local managed identities for Azure resources endpoint to get an access token for the Azure AD Graph.  
    
   ```bash
   curl 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://graph.windows.net' -H Metadata:true
   ```    
   The response includes the access token you need to access Azure AD Graph.

   Response:

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

4. Using the object ID of your VM's service principal (the value you retrieved in earlier steps), you can query the Azure AD Graph API to retrieve its group memberships. Replace `<OBJECT-ID>` with the Object ID of your VM's service principal and `<ACCESS-TOKEN>` with the previously obtained access token:

   ```bash
   curl 'https://graph.windows.net/myorganization/servicePrincipals/<OBJECT-ID>/getMemberGroups?api-version=1.6' -X POST -d "{\"securityEnabledOnly\": false}" -H "Content-Type: application/json" -H "Authorization: Bearer <ACCESS-TOKEN>"
   ```

   Response:

   ```bash   
   Content : {"odata.metadata":"https://graph.windows.net/myorganization/$metadata#Collection(Edm.String)","value":["<ObjectID of VM's group membership>"]}
   ```

## Next steps

In this tutorial, you learned how to use a Linux VM system-assigned managed identity to access Azure AD Graph.  To learn more about Azure AD Graph see:

>[!div class="nextstepaction"]
>[Azure AD Graph](https://docs.microsoft.com/azure/active-directory/develop/active-directory-graph-api)
