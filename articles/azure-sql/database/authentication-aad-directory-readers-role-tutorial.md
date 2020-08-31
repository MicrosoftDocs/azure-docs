---
title: Assign Directory Readers role to an Azure AD group and manage role assignments
description: This article guides you through enabling the Directory Readers role using Azure AD groups to manage Azure AD role assignments with Azure SQL Database, Azure SQL Managed Instance, and Azure Synapse Analytics
ms.service: sql-db-mi
ms.subservice: security
ms.custom: azure-synapse
ms.topic: tutorial
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 08/14/2020
---

# Tutorial: Assign Directory Readers role to an Azure AD group and manage role assignments

[!INCLUDE[appliesto-sqldb-sqlmi-asa](../includes/appliesto-sqldb-sqlmi-asa.md)]

> [!NOTE]
> The **Directory Readers** role assignment to a group in this article is in **public preview**. 

This article guides you through creating a group in Azure Active Directory (Azure AD), and assigning that group the [**Directory Readers**](../../active-directory/users-groups-roles/directory-assign-admin-roles.md#directory-readers) role. The Directory Readers permissions allow the group owners to add additional members to the group, such as a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md#managed-identity-types) of [Azure SQL Database](sql-database-paas-overview.md), [Azure SQL Managed Instance](../managed-instance/sql-managed-instance-paas-overview.md), and [Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md). This bypasses the need for a [Global Administrator](../../active-directory/users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator) or [Privileged Role Administrator](../../active-directory/users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) to assign the Directory Readers role directly for each Azure SQL logical server identity in the tenant.

This tutorial uses the feature introduced in [Use cloud groups to manage role assignments in Azure Active Directory (preview)](../../active-directory/users-groups-roles/roles-groups-concept.md). 

For more information on the benefits of assigning the Directory Readers role to an Azure AD group for Azure SQL, see [Directory Readers role in Azure Active Directory for Azure SQL](authentication-aad-directory-readers-role.md).

## Prerequisites

- An Azure AD instance. For more information, see [Configure and manage Azure AD authentication with Azure SQL](authentication-aad-configure.md).
- A SQL Database, SQL Managed Instance, or Azure Synapse.

## Directory Readers role assignment using the Azure portal

### Create a new group and assign owners and role

1. A user with [Global Administrator](../../active-directory/users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator) or [Privileged Role Administrator](../../active-directory/users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) permissions is required for this initial setup.
1. Have the privileged user sign into the [Azure portal](https://portal.azure.com).
1. Go to the **Azure Active Directory** resource. Under **Managed**, go to **Groups**. Select **New group** to create a new group.
1. Select **Security** as the group type, and fill in the rest of the fields. Make sure that the setting **Azure AD roles can be assigned to the group (Preview)** is switched to **Yes**. Then assign the Azure AD **Directory readers** role to the group.
1. Assign Azure AD users as owner(s) to the group that was created. A group owner can be a regular AD user without any Azure AD administrative role assigned. The owner should be a user that is managing your SQL Database, SQL Managed Instance, or Azure Synapse.

   :::image type="content" source="media/authentication-aad-directory-readers-role/new-group.png" alt-text="aad-new-group":::

1. Select **Create**

### Checking the group that was created

> [!NOTE]
> Make sure that the **Group Type** is **Security**. *Microsoft 365* groups are not supported for Azure SQL.

To check and manage the group that was created, go back to the **Groups** pane in the Azure portal, and search for your group name. Additional owners and members can be added under the **Owners** and **Members** menu of **Manage** setting after selecting your group. You can also review the **Assigned roles** for the group.

:::image type="content" source="media/authentication-aad-directory-readers-role/azure-ad-group-created.png" alt-text="azure-ad-group-created":::

### Add Azure SQL managed identity to the group

> [!NOTE]
> We're using SQL Managed Instance for this example, but similar steps can be applied for SQL Database or Azure Synapse to achieve the same results.

For subsequent steps, the Global Administrator or Privileged Role Administrator user is no longer needed.

1. Log into the Azure portal as the user managing SQL Managed Instance, and is an owner of the group created earlier.

1. Find the name of your **SQL managed instance** resource in the Azure portal.

   :::image type="content" source="media/authentication-aad-directory-readers-role/azure-ad-managed-instance.png" alt-text="azure-ad-managed-instance":::

   During the creation of your SQL Managed Instance, an Azure identity was created for your instance. The created identity has the same name as the prefix of your SQL Managed Instance name. You can find the service principal for your SQL Managed Instance identity that created as an Azure AD Application by following these steps:

    - Go to the **Azure Active Directory** resource. Under the **Manage** setting, select **Enterprise applications**. The **Object ID** is the identity of the instance.
    
    :::image type="content" source="media/authentication-aad-directory-readers-role/azure-ad-managed-instance-service-principal.png" alt-text="azure-ad-managed-instance-service-principal":::

1. Go to the **Azure Active Directory** resource. Under **Managed**, go to **Groups**. Select the group that you created. Under the **Managed** setting of your group, select **Members**. Select **Add members** and add your SQL Managed Instance service principal as a member of the group by searching for the name found above.

   :::image type="content" source="media/authentication-aad-directory-readers-role/azure-ad-add-managed-instance-service-principal.png" alt-text="azure-ad-add-managed-instance-service-principal":::

> [!NOTE]
> It can take a few minutes to propagate the service principal permissions through the Azure system, and allow access to Azure AD Graph API. You may have to wait a few minutes before you provision an Azure AD admin for SQL Managed Instance.

### Remarks

For SQL Database and Azure Synapse, the server identity can be created during the Azure SQL logical server creation or after the server was created. For more information on how to create or set the server identity in SQL Database or Azure Synapse, see [Enable service principals to create Azure AD users](authentication-aad-service-principal.md#enable-service-principals-to-create-azure-ad-users).

For SQL Managed Instance, the **Directory Readers** role must be assigned to managed instance identity before you can [set up an Azure AD admin for the managed instance](authentication-aad-configure.md#provision-azure-ad-admin-sql-managed-instance).

Assigning the **Directory Readers** role to the server identity isn't required for SQL Database or Azure Synapse when setting up an Azure AD admin for the logical server. However, to enable an Azure AD object creation in SQL Database or Azure Synapse on behalf of an Azure AD application, the **Directory Readers** role is required. If the role isn't assigned to the SQL logical server identity, creating Azure AD users in Azure SQL will fail. For more information, see [Azure Active Directory service principal with Azure SQL](authentication-aad-service-principal.md).

## Directory Readers role assignment using PowerShell

> [!IMPORTANT]
> A [Global Administrator](../../active-directory/users-groups-roles/directory-assign-admin-roles.md#global-administrator--company-administrator) or [Privileged Role Administrator](../../active-directory/users-groups-roles/directory-assign-admin-roles.md#privileged-role-administrator) will need to run these initial steps. In addition to PowerShell, Azure AD offers Microsoft Graph API to [Create a role-assignable group in Azure AD](../../active-directory/users-groups-roles/roles-groups-create-eligible.md#using-microsoft-graph-api).

1. Download the Azure AD Preview PowerShell module using the following commands. You may need to run PowerShell as an administrator.

    ```powershell
    Install-Module azureadpreview
    Import-Module azureadpreview
    #To verify that the module is ready to use, use the following command:
    Get-Module azureadpreview
    ```

1. Connect to your Azure AD tenant.

    ```powershell
    Connect-AzureAD
    ```

1. Create a security group to assign the **Directory Readers** role.

    - `DirectoryReaderGroup`, `Directory Reader Group`, and `DirRead` can be changed according to your preference.

    ```powershell
    $group = New-AzureADMSGroup -DisplayName "DirectoryReaderGroup" -Description "Directory Reader Group" -MailEnabled $False -SecurityEnabled $true -MailNickName "DirRead" -IsAssignableToRole $true
    $group
    ```

1. Assign **Directory Readers** role to the group.

    ```powershell
    # Displays the Directory Readers role information
    $roleDefinition = Get-AzureADMSRoleDefinition -Filter "displayName eq 'Directory Readers'" 
    $roleDefinition
    ```

    ```powershell
    # Assigns the Directory Readers role to the group
    $roleAssignment = New-AzureADMSRoleAssignment -ResourceScope '/' -RoleDefinitionId $roleDefinition.Id -PrincipalId $group.Id
    $roleAssignment
    ```

1. Assign owners to the group.

    - Replace `<username>` with the user you want to own this group. Several owners can be added by repeating these steps.

    ```powershell
    $RefObjectID = Get-AzureADUser -ObjectId "<username>"
    $RefObjectID
    ```

    ```powershell
    $GrOwner = Add-AzureADGroupOwner -ObjectId $group.ID -RefObjectId $RefObjectID.ObjectID
    ```

    Check owners of the group using the following command:

    ```powershell
    Get-AzureADGroupOwner -ObjectId $group.ID
    ```

    You can also verify owners of the group in the [Azure portal](https://portal.azure.com). Follow the steps in [Checking the group that was created](#checking-the-group-that-was-created).

### Assigning the service principal as a member of the group

For subsequent steps, the Global Administrator or Privileged Role Administrator user is no longer needed.

1. Using an owner of the group, that also manages the Azure SQL resource, run the following command to connect to your Azure AD.

    ```powershell
    Connect-AzureAD
    ```

1. Assign the service principal as a member of the group that was created.

    - Replace `<ServerName>` with your Azure SQL logical server name, or your Managed Instance name. For more information, see the section, [Add Azure SQL service identity to the group](#add-azure-sql-managed-identity-to-the-group)

    ```powershell
    # Returns the service principal of your Azure SQL resource
    $miIdentity = Get-AzureADServicePrincipal -SearchString "<ServerName>"
    $miIdentity
    ```

    ```powershell
    # Adds the service principal to the group as a member
    Add-AzureADGroupMember -ObjectId $group.ID -RefObjectId $miIdentity.ObjectId 
    ```

    The following command will return the service principal Object ID indicating that it has been added to the group:

    ```powershell
    Add-AzureADGroupMember -ObjectId $group.ID -RefObjectId $miIdentity.ObjectId
    ```

## Next steps

- [Directory Readers role in Azure Active Directory for Azure SQL](authentication-aad-directory-readers-role.md)
- [Tutorial: Create Azure AD users using Azure AD applications](authentication-aad-service-principal-tutorial.md)
- [Configure and manage Azure AD authentication with Azure SQL](authentication-aad-configure.md)