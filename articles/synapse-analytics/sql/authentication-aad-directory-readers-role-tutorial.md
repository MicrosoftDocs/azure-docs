---
title: Assign Directory Readers Role to a Microsoft Entra Group and Manage Role Assignments
titleSuffix: Azure Synapse Analytics
description: Assign the Directory Readers role to a Microsoft Entra group and add an Azure Synapse Analytics managed identity to the group.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf, vanto, mathoma
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: tutorial
---

# Tutorial: Assign Directory Readers role to a Microsoft Entra group and manage role assignments

This article guides you through creating a group in Microsoft Entra ID ([formerly Azure Active Directory](/entra/fundamentals/new-name)) and assigning that group the [**Directory Readers**](/entra/identity/role-based-access-control/permissions-reference#directory-readers) role. The role assignment allows group owners to add managed identities for Azure Synapse Analytics resources to the group. This approach avoids requiring a [Privileged Role Administrator](/entra/identity/role-based-access-control/permissions-reference#privileged-role-administrator) to assign the Directory Readers role directly to each identity.

This tutorial uses the feature introduced in [Use Microsoft Entra groups to manage role assignments](/azure/active-directory/roles/groups-concept).

> [!NOTE]
> Microsoft Entra server principals are currently in preview for Azure Synapse Analytics.

Instead of the Directory Readers role, you can assign lower-level [Microsoft Graph](/graph/overview) permissions to follow the principle of least privilege. For more information, see [Managed identities in Microsoft Entra for Azure Synapse Analytics](authentication-azure-ad-user-assigned-managed-identity.md).

## Prerequisites

- A Microsoft Entra tenant. For more information, see [Configure and manage Microsoft Entra authentication with Azure Synapse Analytics](authentication-aad-configure.md).
- An Azure Synapse workspace or a standalone dedicated SQL pool.

## Directory Readers role assignment by using the Azure portal

### Create a new group and assign owners and role

1. You need a user with [Privileged Role Administrator](/azure/active-directory/roles/permissions-reference#privileged-role-administrator) permissions for this initial setup.
1. Have the privileged user sign in to the [Azure portal](https://portal.azure.com).
1. Go to the **Microsoft Entra ID** resource. Under **Manage**, go to **Groups**. Select **New group** to create a new group.
1. Select **Security** as the group type, and fill in the rest of the fields. Ensure that the setting **Microsoft Entra roles can be assigned to the group** is switched to **Yes**. Then assign the Microsoft Entra ID **Directory readers** role to the group.
1. Assign Microsoft Entra users as owners of the group. A group owner can be a regular Microsoft Entra user without an administrative role. The owner should be a user who manages your Azure Synapse resource.
1. Select **Create**.

<a id="checking-the-group-that-was-created"></a>

### Check the group that you created

> [!NOTE]
> Ensure that the **Group Type** is **Security**. Azure Synapse SQL doesn't support Microsoft 365 groups.

To check and manage the group that you created, return to the **Groups** pane in the Azure portal, and search for your group name. You can add more owners and members under the **Owners** and **Members** menu of **Manage** setting after selecting your group. You can also review the **Assigned roles** for the group.

<a id="add-azure-sql-managed-identity-to-the-group"></a>

### Add an Azure Synapse managed identity to the group

For the following steps, you no longer need the Privileged Role Administrator user.

1. Sign in to the Azure portal as a user who manages the Azure Synapse resource and owns the group that you created.

1. Find the managed identity for your Azure Synapse workspace. For information about workspace identities, see [Managed service identity for Azure Synapse Analytics](../synapse-service-identity.md).
1. In Microsoft Entra ID, under **Manage**, select **Enterprise applications**. Search for the managed identity and note its **Object ID**.
1. In Microsoft Entra ID, under **Manage**, select **Groups**. Select the group that you created, and then select **Members** > **Add members**. Search for and add the Azure Synapse managed identity.

> [!NOTE]
> It can take a few minutes for the permissions to propagate and allow access to Microsoft Graph.

### Remarks

You can create the server identity during [logical server](logical-servers.md) creation or after the server is created. For more information about how to create or set the server identity in Azure Synapse, see [Managed identities for Azure Synapse Analytics](../synapse-service-identity.md).


Assigning the **Directory Readers** role to the server identity isn't required for Azure Synapse when setting up a Microsoft Entra admin for the logical server. However, to enable Microsoft Entra object creation in Azure Synapse on behalf of a Microsoft Entra application, the **Directory Readers** role (or lower level permissions discussed in [Managed identities in Microsoft Entra for Azure SQL](authentication-azure-ad-user-assigned-managed-identity.md)) is required. If you don't assign the role to the logical server identity, creating Microsoft Entra users fails.

## Directory Readers role assignment using PowerShell

> [!IMPORTANT]
> A [Privileged Role Administrator](/azure/active-directory/roles/permissions-reference#privileged-role-administrator) needs to run these initial steps. In addition to PowerShell, Microsoft Entra ID offers Microsoft Graph API to [Create a role-assignable group in Microsoft Entra ID](/azure/active-directory/roles/groups-create-eligible#microsoft-graph-api).

1. Download the Microsoft Graph PowerShell module by using the following commands. You might need to run PowerShell as an administrator.

    ```powershell
    Install-Module Microsoft.Graph.Authentication
    Import-Module Microsoft.Graph.Authentication
    # To verify that the module is ready to use, run the following command:
    Get-Module Microsoft.Graph.Authentication
    ```

1. Connect to your Microsoft Entra tenant.

    ```powershell
    Connect-MgGraph
    ```

1. Create a security group to assign the **Directory Readers** role.

    - `DirectoryReaderGroup`, `Directory Reader Group`, and `DirRead` can be changed according to your preference.

    ```powershell
    $group = New-MgGroup -DisplayName "DirectoryReaderGroup" -Description "Directory Reader Group" -SecurityEnabled:$true -IsAssignableToRole:$true -MailEnabled:$false -MailNickname "DirRead"
    $group
    ```

1. Assign the **Directory Readers** role to the group.

    ```powershell
    # Displays the Directory Readers role information
    $roleDefinition = Get-MgRoleManagementDirectoryRoleDefinition -Filter "DisplayName eq 'Directory Readers'"
    $roleDefinition
    ```

    ```powershell
    # Assigns the Directory Readers role to the group
    $roleAssignment = New-MgRoleManagementDirectoryRoleAssignment -DirectoryScopeId '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $group.Id
    $roleAssignment
    ```

1. Assign owners to the group.

    - Replace `<username>` with the user you want to own this group. Add several owners by repeating these steps.

    ```powershell
    $newGroupOwner = Get-MgUser -UserId "<username>"
    $newGroupOwner
    ```

    ```powershell
    $GrOwner = New-MgGroupOwnerByRef -GroupId $group.Id -OdataId "https://graph.microsoft.com/v1.0/users/$($newGroupOwner.Id)" 
    ```

    Check owners of the group:

    ```powershell
    Get-MgGroupOwner -GroupId $group.Id
    ```

    You can also verify owners of the group in the [Azure portal](https://portal.azure.com). To check the group that you created, see [Checking the group that was created](#checking-the-group-that-was-created).

<a id="assigning-the-service-principal-as-a-member-of-the-group"></a>

### Assign the service principal as a member of the group

For the following steps, you no longer need the Privileged Role Administrator user.

1. As a group owner who also manages the Azure Synapse resource, run the following command to connect to Microsoft Entra ID.

    ```powershell
    Connect-MgGraph
    ```

1. Assign the service principal as a member of the group that you created.

    - Replace `<ServerName>` with the name of your logical server or managed instance. For more information, see the section, [Add Azure SQL service identity to the group](#add-azure-sql-managed-identity-to-the-group).

    ```powershell
    # Returns the service principal of your Azure SQL resource
    $managedIdentity = Get-MgServicePrincipal -Filter "displayName eq '<ServerName>'"
    $managedIdentity
    ```

    ```powershell
    # Adds the service principal to the group
    New-MgGroupMember -GroupId $group.Id -DirectoryObjectId $managedIdentity.Id
    ```

    The following command will return the service principal Object ID indicating that it has been added to the group:

    ```powershell
    Get-MgGroupMember -GroupId $group.Id -Filter "Id eq '$($managedIdentity.Id)'"
    ```

## Related content

- [Managed identities in Microsoft Entra for Azure Synapse Analytics](authentication-azure-ad-user-assigned-managed-identity.md)
- [Configure and manage Microsoft Entra authentication with Azure Synapse Analytics](authentication-aad-configure.md)
- [Microsoft Entra authentication for Azure Synapse Analytics](authentication-aad-overview.md)
