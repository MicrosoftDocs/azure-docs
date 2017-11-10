---
title: Tenant admin elevate access - Azure AD | Microsoft Docs
description: This topic describes the built in roles for role-based access control (RBAC).
services: active-directory
documentationcenter: ''
author: andredm7
manager: femila
editor: rqureshi

ms.assetid: b547c5a5-2da2-4372-9938-481cb962d2d6
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 10/30/2017
ms.author: andredm

---
# Elevate access as a tenant admin with Role-Based Access Control

Role-based Access Control helps tenant administrators get temporary elevations in access so that they can grant higher permissions than normal. A tenant admin can elevate herself to the User Access Administrator role when needed. That role gives the tenant admin permissions to grant herself or others roles at the "/" scope.

This feature is important because it allows the tenant admin to see all the subscriptions that exist in an organization. It also allows for automation apps like invoicing and auditing to access all the subscriptions and provide an accurate view of the state of the organization for billing or asset management.  

## View role assignments at "/" scope using PowerShell
To view the **User Access Administrator** assignment at the **/** scope, use the `Get-AzureRmRoleAssignment` PowerShell cmdlet.
    
```
Get-AzureRmRoleAssignment* | where {$_.RoleDefinitionName -eq "User Access Administrator" -and $_SignInName -eq "<username@somedomain.com>" -and $_.Scope -eq "/"}
```

**Example output**:

RoleAssignmentId   : /providers/Microsoft.Authorization/roleAssignments/098d572e-c1e5-43ee-84ce-8dc459c7e1f0    
Scope              : /    
DisplayName        : username    
SignInName         : username@somedomain.com    
RoleDefinitionName : User Access Administrator    
RoleDefinitionId   : 18d7d88d-d35e-4fb5-a5c3-7773c20a72d9    
ObjectId           : d65fd0e9-c185-472c-8f26-1dafa01f72cc    
ObjectType         : User    

## Use elevateAccess for tenant access with Azure AD admin center

1. Go to the [Azure Active Directory admin center](https://aad.portal.azure.com) and log in with you credentials.

2. Choose **Properties** from the Azure AD left menu.

3. In the **Properties** blade, find **Global admin can manage Azure Subscriptions**, choose **Yes**, then **Save**.
	> [!IMPORTANT] 
	> When you choose **Yes**, assigns the **User Access Administrator** role at the Root "/" (Root Scope) for the user with which you are currently logged into the Portal. **This allows the user to see all other Azure Subscriptions.**
	
	> [!NOTE] 
	> When you choose **No**, removes the **User Access Administrator** role at the Root "/" (Root Scope) for the user with which you are currently logged into the Portal.

> [!TIP] 
> The impression is that this is a Global Property for Azure Active Directory, however, it functions on a per-user basis for the currently logged on user. When you have Global Administrator rights in Azure Active Directory, you can invoke the elevateAccess feature for the user which you are currently logged into Azure Active Directory Admin Center.

![Azure AD Admin Center - Properties - Globaladmin can manage Azure Subscription - screenshot](./media/role-based-access-control-tenant-admin-access/aad-azure-portal-global-admin-can-manage-azure-subscriptions.png)

## Use elevateAccess to give tenant access with the REST API

The basic process works with the following steps:

1. Using REST, call *elevateAccess*, which grants you the User Access Administrator role at "/" scope.

    ```
    POST https://management.azure.com/providers/Microsoft.Authorization/elevateAccess?api-version=2016-07-01
    ```

2. Create a [role assignment](/rest/api/authorization/roleassignments) to assign any role at any scope. The following example shows the properties for assigning the Reader role at "/" scope:

    ```
    { "properties":{
    "roleDefinitionId": "providers/Microsoft.Authorization/roleDefinitions/acdd72a7338548efbd42f606fba81ae7",
    "principalId": "cbc5e050-d7cd-4310-813b-4870be8ef5bb",
    "scope": "/"
    },
    "id": "providers/Microsoft.Authorization/roleAssignments/64736CA0-56D7-4A94-A551-973C2FE7888B",
    "type": "Microsoft.Authorization/roleAssignments",
    "name": "64736CA0-56D7-4A94-A551-973C2FE7888B"
    }
    ```

3. While a User Access Admin, you can also delete role assignments at "/" scope.

4. Revoke your User Access Admin privileges until they're needed again.


## How to undo the elevateAccess action with the REST API

When you call *elevateAccess* you create a role assignment for yourself, so to revoke those privileges you need to delete the assignment.

1.  Call GET role definitions where roleName = User Access Administrator to determine the name GUID of the User Access Administrator role.
	1.  GET *https://management.azure.com/providers/Microsoft.Authorization/roleDefinitions?api-version=2015-07-01&$filter=roleName+eq+'User+Access+Administrator*

    	```
		{"value":[{"properties":{
		"roleName":"User Access Administrator",
		"type":"BuiltInRole",
		"description":"Lets you manage user access to Azure resources.",
		"assignableScopes":["/"],
		"permissions":[{"actions":["*/read","Microsoft.Authorization/*","Microsoft.Support/*"],"notActions":[]}],
		"createdOn":"0001-01-01T08:00:00.0000000Z",
		"updatedOn":"2016-05-31T23:14:04.6964687Z",
		"createdBy":null,
		"updatedBy":null},
		"id":"/providers/Microsoft.Authorization/roleDefinitions/18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
		"type":"Microsoft.Authorization/roleDefinitions",
		"name":"18d7d88d-d35e-4fb5-a5c3-7773c20a72d9"}],
		"nextLink":null}
    	```

    	Save the GUID from the *name* parameter, in this case **18d7d88d-d35e-4fb5-a5c3-7773c20a72d9**.

2. You also need to list the role assignment for tenant admin at tenant scope. List all assignments at tenant scope for the PrincipalId of the TenantAdmin who made the elevate access call. This will list all assignments in the tenant for the ObjectID. 
	1. GET *https://management.azure.com/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01&$filter=principalId+eq+'{objectid}'*
	
		>[!NOTE] 
		>A tenant admin should not have many assignments, if the query above returns too many assignments, you can also query for all assignments just at tenant scope level, then filter the results: GET *https://management.azure.com/providers/Microsoft.Authorization/roleAssignments?api-version=2015-07-01&$filter=atScope()*
		
	2. The above calls return a list of role assignments. Find the role assignment where the scope is "/" and the RoleDefinitionId ends with the role name GUID you found in step 1 and PrincipalId matches the ObjectId of the Tenant Admin. The role assignment looks like this:

    	```
		{"value":[{"properties":{
		"roleDefinitionId":"/providers/Microsoft.Authorization/roleDefinitions/18d7d88d-d35e-4fb5-a5c3-7773c20a72d9",
		"principalId":"{objectID}",
		"scope":"/",
		"createdOn":"2016-08-17T19:21:16.3422480Z",
		"updatedOn":"2016-08-17T19:21:16.3422480Z",
		"createdBy":"93ce6722-3638-4222-b582-78b75c5c6d65",
		"updatedBy":"93ce6722-3638-4222-b582-78b75c5c6d65"},
		"id":"/providers/Microsoft.Authorization/roleAssignments/e7dd75bc-06f6-4e71-9014-ee96a929d099",
		"type":"Microsoft.Authorization/roleAssignments",
		"name":"e7dd75bc-06f6-4e71-9014-ee96a929d099"}],
		"nextLink":null}
    	```
		
		Again, save the GUID from the *name* parameter, in this case **e7dd75bc-06f6-4e71-9014-ee96a929d099**.

	3. Finally, Use the highlighted **RoleAssignment ID** to delete the assignment added by Elevate Access:

		DELETE https://management.azure.com /providers/Microsoft.Authorization/roleAssignments/e7dd75bc-06f6-4e71-9014-ee96a929d099?api-version=2015-07-01

## Delete the role assignment at "/" scope using Powershell:
You can delete the assignment using following PowerShell cmdlet:
*Remove-AzureRmRoleAssignment* -SignInName <username@somedomain.com> -RoleDefinitionName "User Access Administrator" -Scope "/" 

## Next steps

- Learn more about [managing Role-Based Access Control with REST](role-based-access-control-manage-access-rest.md)

- [Manage access assignments](role-based-access-control-manage-assignments.md) in the Azure portal
