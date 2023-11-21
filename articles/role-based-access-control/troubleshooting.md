---
title: Troubleshoot Azure RBAC
description: Troubleshoot issues with Azure role-based access control (Azure RBAC).
services: azure-portal
author: rolyon
manager: amycolannino
ms.assetid: df42cca2-02d6-4f3c-9d56-260e1eb7dc44
ms.service: role-based-access-control
ms.workload: identity
ms.tgt_pltfrm: na
ms.topic: troubleshooting
ms.date: 09/20/2023
ms.author: rolyon
ms.custom: seohack1, devx-track-azurecli
---
# Troubleshoot Azure RBAC

This article describes some common solutions for issues related to Azure role-based access control (Azure RBAC).

## Azure role assignments

### Symptom - Add role assignment option is disabled

You're unable to assign a role in the Azure portal on **Access control (IAM)** because the **Add** > **Add role assignment** option is disabled

**Cause**

You're currently signed in with a user that doesn't have permission to assign roles at the selected scope.

**Solution**

Check that you're currently signed in with a user that is assigned a role that has the `Microsoft.Authorization/roleAssignments/write` permission such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator) at the scope you're trying to assign the role.

### Symptom - Roles or principals are not listed

When you try to assign a role in the Azure portal, some roles or principals are not listed. For example, on the **Role** tab, you see a reduced set of roles.

:::image type="content" source="./media/shared/constrained-roles-assign.png" alt-text="Screenshot of role assignments constrained to specific roles." lightbox="./media/shared/constrained-roles-assign.png":::

Or, on the **Select members** pane, you see a reduced set of principals.

:::image type="content" source="./media/shared/constrained-principals-assign.png" alt-text="Screenshot of role assignments constrained to specific groups." lightbox="./media/shared/constrained-principals-assign.png":::

**Cause**

There are restrictions on the role assignments you can add. For example, you are constrained in the roles that you can assign or constrained in the principals you can assign roles to.

**Solution**

View the [roles assigned to you](check-access.md). Check if there is a condition that constrains the role assignments you can add. For more information, see [Delegate Azure access management to others](delegate-role-assignments-overview.md).

:::image type="content" source="./media/troubleshooting/role-assignments-condition.png" alt-text="Screenshot of role assignments that include a condition." lightbox="./media/troubleshooting/role-assignments-condition.png":::

### Symptom - Unable to assign a role

You are unable to assign a role and you get an error similar to the following:

`Failed to add {securityPrincipal} as {role} for {scope} : The client '{clientName}' with object id '{objectId}' does not have authorization or an ABAC condition not fulfilled to perform action 'Microsoft.Authorization/roleAssignments/write' over scope '/subscriptions/{subscriptionId}/Microsoft.Authorization/roleAssignments/{roleAssignmentId}' or the scope is invalid. If access was recently granted, please refresh your credentials.`

**Cause 1**

You are currently signed in with a user that does not have permission to assign roles at the selected scope.

**Solution 1**

Check that you are currently signed in with a user that is assigned a role that has the `Microsoft.Authorization/roleAssignments/write` permission such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator) at the scope you are trying to assign the role.

**Cause 2**

There are restrictions on the role assignments you can add. For example, you are constrained in the roles that you can assign or constrained in the principals you can assign roles to.

**Solution 2**

View the [roles assigned to you](check-access.md). Check if there is a condition that constrains the role assignments you can add. For more information, see [Delegate Azure access management to others](delegate-role-assignments-overview.md).

:::image type="content" source="./media/troubleshooting/role-assignments-condition.png" alt-text="Screenshot of role assignments that include a condition." lightbox="./media/troubleshooting/role-assignments-condition.png":::

### Symptom - Unable to assign a role using a service principal with Azure CLI

You're using a service principal to assign roles with Azure CLI and you get the following error:

`Insufficient privileges to complete the operation`

For example, let's say that you have a service principal that has been assigned the Owner role and you try to create the following role assignment as the service principal using Azure CLI:

```azurecli
az login --service-principal --username "SPNid" --password "password" --tenant "tenantid"
az role assignment create --assignee "userupn" --role "Contributor"  --scope "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}"
```

**Cause**

It's likely Azure CLI is attempting to look up the assignee identity in Microsoft Entra ID and the service principal can't read Microsoft Entra ID by default.

**Solution**

There are two ways to potentially resolve this error. The first way is to assign the [Directory Readers](../active-directory/roles/permissions-reference.md#directory-readers) role to the service principal so that it can read data in the directory.

The second way to resolve this error is to create the role assignment by using the `--assignee-object-id` parameter instead of `--assignee`. By using `--assignee-object-id`, Azure CLI will skip the Microsoft Entra lookup. You'll need to get the object ID of the user, group, or application that you want to assign the role to. For more information, see [Assign Azure roles using Azure CLI](role-assignments-cli.md#assign-a-role-for-a-new-service-principal-at-a-resource-group-scope).

```azurecli
az role assignment create --assignee-object-id 11111111-1111-1111-1111-111111111111  --role "Contributor" --scope "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}"
```

### Symptom - Assigning a role to a new principal sometimes fails

You create a new user, group, or service principal and immediately try to assign a role to that principal and the role assignment sometimes fails. You get a message similar to following error:

```
PrincipalNotFound
Principal {principalId} does not exist in the directory {tenantId}. Check that you have the correct principal ID. If you are creating this principal and then immediately assigning a role, this error might be related to a replication delay. In this case, set the role assignment principalType property to a value, such as ServicePrincipal, User, or Group.  See https://aka.ms/docs-principaltype
```

**Cause**

The reason is likely a replication delay. The principal is created in one region; however, the role assignment might occur in a different region that hasn't replicated the principal yet.

**Solution 1**

If you're creating a new user or service principal using the REST API or ARM template, set the `principalType` property when creating the role assignment using the [Role Assignments - Create](/rest/api/authorization/role-assignments/create) API. 

| principalType | apiVersion |
| --- | --- |
| `User` | `2020-03-01-preview` or later |
| `ServicePrincipal` | `2018-09-01-preview` or later |

For more information, see [Assign Azure roles to a new service principal using the REST API](role-assignments-rest.md#new-service-principal) or [Assign Azure roles to a new service principal using Azure Resource Manager templates](role-assignments-template.md#new-service-principal).

**Solution 2**

If you're creating a new user or service principal using Azure PowerShell, set the `ObjectType` parameter to `User` or `ServicePrincipal` when creating the role assignment using [New-AzRoleAssignment](/powershell/module/az.resources/new-azroleassignment). The same underlying API version restrictions of Solution 1 still apply. For more information, see [Assign Azure roles using Azure PowerShell](role-assignments-powershell.md).

**Solution 3**

If you're creating a new group, wait a few minutes before creating the role assignment.

### Symptom - ARM template role assignment returns BadRequest status

When you try to deploy a Bicep file or ARM template that assigns a role to a service principal you get the error:

`Tenant ID, application ID, principal ID, and scope are not allowed to be updated. (code: RoleAssignmentUpdateNotPermitted)`

For example, if you create a role assignment for a managed identity, then you delete the managed identity and recreate it, the new managed identity has a different principal ID. If you try to deploy the role assignment again and use the same role assignment name, the deployment fails.

**Cause**

The role assignment `name` isn't unique, and it's viewed as an update.

Role assignments are uniquely identified by their name, which is a globally unique identifier (GUID). You can't create two role assignments with the same name, even in different Azure subscriptions. You also can't change the properties of an existing role assignment.

**Solution**

Provide an idempotent unique value for the role assignment `name`. It's a good practice to create a GUID that uses the scope, principal ID, and role ID together. It's a good idea to use the `guid()` function to help you to create a deterministic GUID for your role assignment names, like in this example:

# [Bicep](#tab/bicep)

```bicep
resource roleAssignment 'Microsoft.Authorization/roleAssignments@2020-10-01-preview' = {
  name: guid(resourceGroup().id, principalId, roleDefinitionId)
  properties: {
    roleDefinitionId: roleDefinitionId
    principalId: principalId
    principalType: principalType
  }
}
```

# [ARM template](#tab/armtemplate)

```json
{
  "type": "Microsoft.Authorization/roleAssignments",
  "apiVersion": "2020-10-01-preview",
  "name": "[guid(resourceGroup().id, variables('principalId'), variables('roleDefinitionId'))]",
  "properties": {
    "roleDefinitionId": "[variables('roleDefinitionId')]",
    "principalId": "[variables('principalId')]",
    "principalType": "[variables('principalType')]"
  }
}
```

---

For more information, see [Create Azure RBAC resources by using Bicep](../azure-resource-manager/bicep/scenarios-rbac.md).

### Symptom - Role assignments with identity not found

In the list of role assignments for the Azure portal, you notice that the security principal (user, group, service principal, or managed identity) is listed as **Identity not found** with an **Unknown** type.

![Identity not found listed in Azure role assignments](./media/troubleshooting/unknown-security-principal.png)

If you list this role assignment using Azure PowerShell, you might see an empty `DisplayName` and `SignInName`, or a value for `ObjectType` of `Unknown`. For example, [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) returns a role assignment that is similar to the following output:

```
RoleAssignmentId   : /subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleAssignments/22222222-2222-2222-2222-222222222222
Scope              : /subscriptions/11111111-1111-1111-1111-111111111111
DisplayName        :
SignInName         :
RoleDefinitionName : Storage Blob Data Contributor
RoleDefinitionId   : ba92f5b4-2d11-453d-a403-e96b0029c9fe
ObjectId           : 33333333-3333-3333-3333-333333333333
ObjectType         : User
CanDelegate        : False
```

Similarly, if you list this role assignment using Azure CLI, you might see an empty `principalName`. For example, [az role assignment list](/cli/azure/role/assignment#az-role-assignment-list) returns a role assignment that is similar to the following output:

```json
{
    "canDelegate": null,
    "id": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleAssignments/22222222-2222-2222-2222-222222222222",
    "name": "22222222-2222-2222-2222-222222222222",
    "principalId": "33333333-3333-3333-3333-333333333333",
    "principalName": "",
    "roleDefinitionId": "/subscriptions/11111111-1111-1111-1111-111111111111/providers/Microsoft.Authorization/roleDefinitions/ba92f5b4-2d11-453d-a403-e96b0029c9fe",
    "roleDefinitionName": "Storage Blob Data Contributor",
    "scope": "/subscriptions/11111111-1111-1111-1111-111111111111",
    "type": "Microsoft.Authorization/roleAssignments"
}
```

**Cause 1**

You recently invited a user when creating a role assignment and this security principal is still in the replication process across regions.

**Solution 1**

Wait a few moments and refresh the role assignments list.

**Cause 2**

You deleted a security principal that had a role assignment. If you assign a role to a security principal and then you later delete that security principal without first removing the role assignment, the security principal will be listed as **Identity not found** and an **Unknown** type.

**Solution 2**

It isn't a problem to leave these role assignments where the security principal has been deleted. If you like, you can remove these role assignments using steps that are similar to other role assignments. For information about how to remove role assignments, see [Remove Azure role assignments](role-assignments-remove.md).

In PowerShell, if you try to remove the role assignments using the object ID and role definition name, and more than one role assignment matches your parameters, you'll get the error message: `The provided information does not map to a role assignment`. The following output shows an example of the error message:

```
PS C:\> Remove-AzRoleAssignment -ObjectId 33333333-3333-3333-3333-333333333333 -RoleDefinitionName "Storage Blob Data Contributor"

Remove-AzRoleAssignment : The provided information does not map to a role assignment.
At line:1 char:1
+ Remove-AzRoleAssignment -ObjectId 33333333-3333-3333-3333-333333333333 ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
+ CategoryInfo          : CloseError: (:) [Remove-AzRoleAssignment], KeyNotFoundException
+ FullyQualifiedErrorId : Microsoft.Azure.Commands.Resources.RemoveAzureRoleAssignmentCommand
```

If you get this error message, make sure you also specify the `-Scope` or `-ResourceGroupName` parameters.

```
PS C:\> Remove-AzRoleAssignment -ObjectId 33333333-3333-3333-3333-333333333333 -RoleDefinitionName "Storage Blob Data Contributor" - Scope /subscriptions/11111111-1111-1111-1111-111111111111
```

### Symptom - Cannot delete the last Owner role assignment

You attempt to remove the last Owner role assignment for a subscription and you see the following error:

`Cannot delete the last RBAC admin assignment`

**Cause**

Removing the last Owner role assignment for a subscription isn't supported to avoid orphaning the subscription.

**Solution**

If you want to cancel your subscription, see [Cancel your Azure subscription](../cost-management-billing/manage/cancel-azure-subscription.md).

You're allowed to remove the last Owner (or User Access Administrator) role assignment at subscription scope, if you're a Global Administrator for the tenant or a classic administrator (Service Administrator or Co-Administrator) for the subscription. In this case, there's no constraint for deletion. However, if the call comes from some other principal, then you won't be able to remove the last Owner role assignment at subscription scope.

### Symptom - Role assignment isn't moved after moving a resource

**Cause**

If you move a resource that has an Azure role assigned directly to the resource (or a child resource), the role assignment isn't moved and becomes orphaned.

**Solution**

After you move a resource, you must re-create the role assignment. Eventually, the orphaned role assignment will be automatically removed, but it's a best practice to remove the role assignment before moving the resource. For information about how to move resources, see [Move resources to a new resource group or subscription](../azure-resource-manager/management/move-resource-group-and-subscription.md).

### Symptom - Role assignment changes are not being detected

You recently added or updated a role assignment, but the changes aren't being detected. You might see the message `Status: 401 (Unauthorized)`.

**Cause 1**

Azure Resource Manager sometimes caches configurations and data to improve performance.

**Solution 1**

When you assign roles or remove role assignments, it can take up to 10 minutes for changes to take effect. If you're using the Azure portal, Azure PowerShell, or Azure CLI, you can force a refresh of your role assignment changes by signing out and signing in. If you're making role assignment changes with REST API calls, you can force a refresh by refreshing your access token.

**Cause 2**

You added managed identities to a group and assigned a role to that group. The back-end services for managed identities maintain a cache per resource URI for around 24 hours.

**Solution 2**

It can take several hours for changes to a managed identity's group or role membership to take effect. For more information, see [Limitation of using managed identities for authorization](../active-directory/managed-identities-azure-resources/managed-identity-best-practice-recommendations.md#limitation-of-using-managed-identities-for-authorization).

### Symptom - Role assignment changes at management group scope are not being detected

You recently added or updated a role assignment at management group scope, but the changes are not being detected.

**Cause**

Azure Resource Manager sometimes caches configurations and data to improve performance.

**Solution**

When you assign roles or remove role assignments, it can take up to 10 minutes for changes to take effect. If you add or remove a built-in role assignment at management group scope and the built-in role has `DataActions`, the access on the data plane might not be updated for several hours. This applies only to management group scope and the data plane. Custom roles with `DataActions` can't be assigned at the management group scope.

### Symptom - Role assignments for management group changes are not being detected

You created a new child management group and the role assignment on the parent management group is not being detected for the child management group.

**Cause**

Azure Resource Manager sometimes caches configurations and data to improve performance.

**Solution**

It can take up to 10 minutes for the role assignment for the child management group to take effect. If you are using the Azure portal, Azure PowerShell, or Azure CLI, you can force a refresh of your role assignment changes by signing out and signing in. If you are making role assignment changes with REST API calls, you can force a refresh by refreshing your access token.

### Symptom - Removing role assignments using PowerShell takes several minutes

You use the [Remove-AzRoleAssignment](/powershell/module/az.resources/remove-azroleassignment) command to remove a role assignment. You then use the [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) command to verify the role assignment was removed for a security principal. For example:

```powershell
Get-AzRoleAssignment -ObjectId $securityPrincipalObject.Id
```

The [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) command indicates that the role assignment wasn't removed. However, if you wait 5-10 minutes and run [Get-AzRoleAssignment](/powershell/module/az.resources/get-azroleassignment) again, the output indicates the role assignment was removed.

**Cause**

The role assignment has been removed. However, to improve performance, PowerShell uses a cache when listing role assignments. There can be delay of around 10 minutes for the cache to be refreshed.

**Solution**

Instead of listing the role assignments for a security principal, list all the role assignments at the subscription scope and filter the output. For example, the following command:

```powershell
$validateRemovedRoles = Get-AzRoleAssignment -ObjectId $securityPrincipalObject.Id 
```

Can be replaced with this command instead:

```powershell
$validateRemovedRoles = Get-AzRoleAssignment -Scope /subscriptions/$subId | Where-Object -Property ObjectId -EQ $securityPrincipalObject.Id
```

## Custom roles

### Symptom - Unable to update or delete a custom role

You're unable to update or delete an existing custom role.

**Cause 1**

You're currently signed in with a user that doesn't have permission to update or delete custom roles.

**Solution 1**

Check that you're currently signed in with a user that is assigned a role that has the `Microsoft.Authorization/roleDefinitions/write` permission such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator).

**Cause 2**

The custom role includes a subscription in assignable scopes and that subscription is in a [disabled state](../cost-management-billing/manage/subscription-states.md).

**Solution 2**

Reactivate the disabled subscription and update the custom role as needed. For more information, see [Reactivate a disabled Azure subscription](../cost-management-billing/manage/subscription-disabled.md).

### Symptom - Unable to create or update a custom role

When you try to create or update a custom role, you get an error similar to following:

`The client '<clientName>' with object id '<objectId>' has permission to perform action 'Microsoft.Authorization/roleDefinitions/write' on scope '/subscriptions/<subscriptionId>'; however, it does not have permission to perform action 'Microsoft.Authorization/roleDefinitions/write' on the linked scope(s)'/subscriptions/<subscriptionId1>,/subscriptions/<subscriptionId2>,/subscriptions/<subscriptionId3>' or the linked scope(s)are invalid`

**Cause**

This error usually indicates that you don't have permissions to one or more of the [assignable scopes](role-definitions.md#assignablescopes) in the custom role.

**Solution**

Try the following:

- Review [Who can create, delete, update, or view a custom role](custom-roles.md#who-can-create-delete-update-or-view-a-custom-role) and check that you have permissions to create or update the custom role for all assignable scopes.
- If you don't have permissions, ask your administrator to assign you a role that has the `Microsoft.Authorization/roleDefinitions/write` action, such as [Owner](built-in-roles.md#owner) or [User Access Administrator](built-in-roles.md#user-access-administrator), at the scope of the assignable scope.
- Check that all the assignable scopes in the custom role are valid. If not, remove any invalid assignable scopes.

For more information, see the custom role tutorials using the [Azure portal](custom-roles-portal.md), [Azure PowerShell](tutorial-custom-role-powershell.md), or [Azure CLI](tutorial-custom-role-cli.md).

### Symptom - Unable to delete a custom role

You're unable to delete a custom role and get the following error message:

`There are existing role assignments referencing role (code: RoleDefinitionHasAssignments)`

**Cause**

There are role assignments still using the custom role.

**Solution**

Remove the role assignments that use the custom role and try to delete the custom role again. For more information, see [Find role assignments to delete a custom role](custom-roles.md#find-role-assignments-to-delete-a-custom-role).

### Symptom - Unable to add more than one management group as assignable scope

When you try to create or update a custom role, you can't add more than one management group as assignable scope.

**Cause**

You can define only one management group in `AssignableScopes` of a custom role.

**Solution**

Define one management group in `AssignableScopes` of your custom role. For more information about custom roles and management groups, see [Organize your resources with Azure management groups](../governance/management-groups/overview.md#azure-custom-role-definition-and-assignment).

### Symptom - Unable to add data actions to custom role

When you try to create or update a custom role, you can't add data actions or you see the following message:

`You cannot add data action permissions when you have a management group as an assignable scope`

**Cause**

You're trying to create a custom role with data actions and a management group as assignable scope. Custom roles with `DataActions` can't be assigned at the management group scope.

**Solution**

Create the custom role with one or more subscriptions as the assignable scope. For more information about custom roles and management groups, see [Organize your resources with Azure management groups](../governance/management-groups/overview.md#azure-custom-role-definition-and-assignment).

## Access denied or permission errors

### Symptom - Authorization failed

When you try to create a resource, you get the following error message:

`The client with object id does not have authorization to perform action over scope (code: AuthorizationFailed)`

**Cause 1**

You're currently signed in with a user that doesn't have write permission to the resource at the selected scope.

**Solution 1**

Check that you're currently signed in with a user that is assigned a role that has write permission to the resource at the selected scope. For example, to manage virtual machines in a resource group, you should have the [Virtual Machine Contributor](built-in-roles.md#virtual-machine-contributor) role on the resource group (or parent scope). For a list of the permissions for each built-in role, see [Azure built-in roles](built-in-roles.md).

**Cause 2**

The currently signed in user has a role assignment with the following criteria:

- Role includes a [Microsoft.Storage](resource-provider-operations.md#microsoftstorage) data action
- Role assignment includes an ABAC condition that uses a [GUID comparison operators](conditions-format.md#guid-comparison-operators)

**Solution 2**

At this time, you can't have a role assignment with a Microsoft.Storage data action and an ABAC condition that uses a GUID comparison operator. Here are a couple of options to resolve this error:

- If the role is a custom role, remove any Microsoft.Storage data actions
- Modify the role assignment condition so that it does not use GUID comparison operators

### Symptom - Guest user gets authorization failed

When a guest user tries to access a resource, they get an error message similar to the following:

`The client '<client>' with object id '<objectId>' does not have authorization to perform action '<action>' over scope '<scope>' or the scope is invalid.`

**Cause**

The guest user doesn't have permissions to the resource at the selected scope.

**Solution**

Check that the guest user is assigned a role with least privileged permissions to the resource at the selected scope. For more information, [Assign Azure roles to external guest users using the Azure portal](role-assignments-external-users.md).

### Symptom - Unable to create a support request

When you try to create or update a support ticket, you get the following error message:

`You don't have permission to create a support request`

**Cause**

You're currently signed in with a user that doesn't have permission to the create support requests.

**Solution**

Check that you're currently signed in with a user that is assigned a role that has the `Microsoft.Support/supportTickets/write` permission, such as [Support Request Contributor](built-in-roles.md#support-request-contributor).

## Azure features are disabled

### Symptom - Some web app features are disabled

A user has read access to a web app and some features are disabled.

**Cause**

If you grant a user read access to a web app, some features are disabled that you might not expect. The following management capabilities require write access to a web app and aren't available in any read-only scenario.

* Commands (like start, stop, etc.)
* Changing settings like general configuration, scale settings, backup settings, and monitoring settings
* Accessing publishing credentials and other secrets like app settings and connection strings
* Streaming logs
* Resource logs configuration
* Console (command prompt)
* Active and recent deployments (for local git continuous deployment)
* Estimated spend
* Web tests
* Virtual network (only visible to a reader if a virtual network has previously been configured by a user with write access).

**Solution**

Assign the [Contributor](built-in-roles.md#contributor) or another [Azure built-in role](built-in-roles.md) with write permissions for the web app.

### Symptom - Some web app resources are disabled

A user has write access to a web app and some features are disabled.

**Cause**

Web apps are complicated by the presence of a few different resources that interplay. Here's a typical resource group with a couple of websites:

![Web app resource group](./media/troubleshooting/website-resource-model.png)

As a result, if you grant someone access to just the web app, much of the functionality on the website blade in the Azure portal is disabled.

These items require write access to theApp Service plan that corresponds to your website:  

* Viewing the web app's pricing tier (Free or Standard)  
* Scale configuration (number of instances, virtual machine size, autoscale settings)  
* Quotas (storage, bandwidth, CPU)  

These items require **write** access to the whole **Resource group** that contains your website:  

* TLS/SSL Certificates and bindings (TLS/SSL certificates can be shared between sites in the same resource group and geo-location)  
* Alert rules  
* Autoscale settings  
* Application insights components  
* Web tests  

**Solution**

Assign an [Azure built-in role](built-in-roles.md) with write permissions for the app service plan or resource group.

### Symptom - Some virtual machine features are disabled

A user has access to a virtual machine and some features are disabled.

**Cause**

Similar to web apps, some features on the virtual machine blade require write access to the virtual machine, or to other resources in the resource group.

Virtual machines are related to Domain names, virtual networks, storage accounts, and alert rules.

These items require write access to the virtual machine:

* Endpoints  
* IP addresses  
* Disks  
* Extensions  

These require write access to both the virtual machine, and the resource group (along with the Domain name) that it is in:  

* Availability set  
* Load balanced set  
* Alert rules  

If you can't access any of these tiles, ask your administrator for Contributor access to the Resource group.

**Solution**

Assign an [Azure built-in role](built-in-roles.md) with write permissions for the virtual machine or resource group.

### Symptom - Some function app features are disabled

A user has access to a function app and some features are disabled. For example, they can click the **Platform features** tab and then click **All settings** to view some settings related to a function app (similar to a web app), but they can't modify any of these settings.

**Cause**

Some features of [Azure Functions](../azure-functions/functions-overview.md) require write access. For example, if a user is assigned the [Reader](built-in-roles.md#reader) role, they won't be able to view the functions within a function app. The portal displays **(No access)**.

![Function apps no access](./media/troubleshooting/functionapps-noaccess.png)

**Solution**

Assign an [Azure built-in role](built-in-roles.md) with write permissions for the function app or resource group.

## Transferring a subscription to a different directory

### Symptom - All role assignments are deleted after transferring a subscription

**Cause**

When you transfer an Azure subscription to a different Microsoft Entra directory, all role assignments are **permanently** deleted from the source Microsoft Entra directory and aren't migrated to the target Microsoft Entra directory.

**Solution**

You must re-create your role assignments in the target directory. You also have to manually recreate managed identities for Azure resources. For more information, see [Transfer an Azure subscription to a different Microsoft Entra directory](transfer-subscription.md) and [FAQs and known issues with managed identities](../active-directory/managed-identities-azure-resources/known-issues.md).

### Symptom - Unable to access subscription after transferring a subscription

**Solution**

If you're a Microsoft Entra Global Administrator and you don't have access to a subscription after it was transferred between directories, use the **Access management for Azure resources** toggle to temporarily [elevate your access](elevate-access-global-admin.md) to get access to the subscription.

## Classic subscription administrators

> [!IMPORTANT]
> Classic resources and classic administrators will be [retired on August 31, 2024](https://azure.microsoft.com/updates/cloud-services-retirement-announcement/). Remove unnecessary Co-Administrators and use Azure RBAC for fine-grained access control.

## Next steps

- [Troubleshoot for guest users](role-assignments-external-users.md#troubleshoot)
- [Assign Azure roles using the Azure portal](role-assignments-portal.md)
- [View activity logs for Azure RBAC changes](change-history-report.md)
