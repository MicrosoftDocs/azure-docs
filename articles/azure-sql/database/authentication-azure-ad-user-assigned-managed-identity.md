---
title: User-assigned managed identity in Azure AD for Azure SQL
description: This article provides information on user-assigned managed identities in Azure Active Directory (AD) with Azure SQL Database and Azure SQL Managed Instance
titleSuffix: Azure SQL Database & Azure SQL Managed Instance
ms.service: sql-db-mi
ms.subservice: security
ms.topic: conceptual
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 12/10/2021
---

# User-assigned managed identity in Azure AD for Azure SQL

[!INCLUDE[appliesto-sqldb-sqlmi](../includes/appliesto-sqldb-sqlmi.md)]

Azure Active Directory (AD) supports two types of managed identities: System-assigned managed identity (SMI) and user-assigned managed identity (UMI). For more information, see [Managed identity types](/azure/active-directory/managed-identities-azure-resources/overview#managed-identity-types).

When using Azure AD authentication with Azure SQL Managed Instance, a managed identity must be assigned to the server identity. Previously, only a system-assigned managed identity could be assigned to the Managed Instance server identity. With support for user-assigned managed identity, the UMI can be assigned to Azure SQL Managed Instance or Azure SQL Database as the server or instance identity. This feature is now supported for SQL Database. 

> [!NOTE]
> A system-assigned managed identity is automatically assigned to a managed instance when it is created.
>
> UMI is not supported for Azure Synapse Analytics.

## Benefits of using user-assigned managed identity

There are several benefits of using UMI as a server identity.

- User flexibility to create and maintain their own user-assigned managed identities for a given tenant. UMI can be used as server identities for Azure SQL. UMI is managed by the user, compared to an SMI, which is one per tenant, and assigned by the system.
- The Azure AD [Directory Readers](authentication-aad-directory-readers-role.md) role is needed when using SMI as the server or instance identity. With UMI, users concerned with giving high level permissions such as the Directory Readers role can alternatively give lower level permissions so that the server or instance identity can access [Microsoft Graph](/graph/api/resources/azure-ad-overview). For more information on providing Directory Readers permissions and it's function, see [Directory Readers role in Azure Active Directory for Azure SQL](authentication-aad-directory-readers-role.md).
- Users can choose to have a specific UMI to be the server or instance identity for all SQL Databases or Managed Instances in the tenant, or have multiple UMIs assigned to different servers or instances. For example, different UMIs can be used in different servers representing different features. Such as a UMI serving transparent data encryption in one server, and a UMI serving Azure AD authentication in another server.
- UMI is needed to create an Azure SQL logical server configured with transparent data encryption (TDE) with customer-managed keys (CMK).

> [!NOTE]
> The instance identity (SMI or UMI) must be enabled to allow support for Azure AD authentication in Managed Instance. For SQL Database, enabling the server identity is optional and required only if an Azure AD service principal (Azure AD application) oversees creating and managing Azure AD users, groups, or application in the server. For more information, see [Azure Active Directory service principal with Azure SQL](authentication-aad-service-principal.md).

## Creating a user-assigned managed identity

For information on how to create a user-assigned managed identity, see [Manage user-assigned managed identities](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

## Permissions

Once the UMI is created, some permissions are needed to allow the UMI to read from [Microsoft Graph](/graph/api/resources/azure-ad-overview) as the server identity. Grant the permissions below, or give the UMI the [Directory Readers](authentication-aad-directory-readers-role-tutorial.md) role. These permissions should be granted prior to provisioning an Azure SQL logical server or managed instance. Once the permissions are granted to the UMI, they are enabled for all servers or instances that are created with the UMI assigned as a server identity.

> [!IMPORTANT]
> Only a [Global Administrator](../../active-directory/roles/permissions-reference.md#global-administrator) or [Privileged Role Administrator](../../active-directory/roles/permissions-reference.md#privileged-role-administrator) can grant these permissions.

- [**User.Read.All**](/graph/permissions-reference#user-permissions) - allows access to Azure AD user information
- [**GroupMember.Read.All**](/graph/permissions-reference#group-permissions) – allows access to Azure AD group information
- [**Application.Read.ALL**](/graph/permissions-reference#application-resource-permissions) – allows access to Azure AD service principal (applications) information

### Granting permissions

The following is a sample PowerShell script that will grant the necessary permissions for the UMI.

```powershell
# Script to assign permissions to the UMI “umiservertest”

import-module AzureAD
$tenantId = '<tenantId>' # Your Azure AD tenant ID

Connect-AzureAD -TenantID $tenantId
# Login as a user with a "Global Administrator" or "Privileged Role Administrator" role
# Script to assign permissions to existing UMI 
# The following Microsoft Graph permissions are required: 
#   User.Read.All
#   GroupMember.Read.All
#   Application.Read.ALL

# Search for Microsoft Graph
$AAD_SP = Get-AzureADServicePrincipal -SearchString "Microsoft Graph";
$AAD_SP
# Use Microsoft Graph; in this example, this is the first element $AAD_SP[0]

#Output

#ObjectId                             AppId                                DisplayName
#--------                             -----                                -----------
#47d73278-e43c-4cc2-a606-c500b66883ef 00000003-0000-0000-c000-000000000000 Microsoft Graph
#44e2d3f6-97c3-4bc7-9ccd-e26746638b6d 0bf30f3b-4a52-48df-9a82-234910c4a086 Microsoft Graph #Change 

$MSIName = "<managedIdentity>";  # Name of your user-assigned managed identity
$MSI = Get-AzureADServicePrincipal -SearchString $MSIName 
if($MSI.Count -gt 1)
{ 
Write-Output "More than 1 principal found, please find your principal and copy the right object ID. Now use the syntax $MSI = Get-AzureADServicePrincipal -ObjectId <your_object_id>"

# Choose the right UMI

Exit
} 

# If you have more UMIs with similar names, you have to use the proper $MSI[ ]array number

# Assign the app roles

$AAD_AppRole = $AAD_SP.AppRoles | Where-Object {$_.Value -eq "User.Read.All"}
New-AzureADServiceAppRoleAssignment -ObjectId $MSI.ObjectId  -PrincipalId $MSI.ObjectId  -ResourceId $AAD_SP.ObjectId[0]  -Id $AAD_AppRole.Id 
$AAD_AppRole = $AAD_SP.AppRoles | Where-Object {$_.Value -eq "GroupMember.Read.All"}
New-AzureADServiceAppRoleAssignment -ObjectId $MSI.ObjectId  -PrincipalId $MSI.ObjectId  -ResourceId $AAD_SP.ObjectId[0]  -Id $AAD_AppRole.Id
$AAD_AppRole = $AAD_SP.AppRoles | Where-Object {$_.Value -eq "Application.Read.All"}
New-AzureADServiceAppRoleAssignment -ObjectId $MSI.ObjectId  -PrincipalId $MSI.ObjectId  -ResourceId $AAD_SP.ObjectId[0]  -Id $AAD_AppRole.Id
```

### Check permissions for user-assigned manage identity

To check permissions for a UMI, go to the [Azure portal](https://portal.azure.com). In the **Azure Active Directory** resource, go to **Enterprise applications**. Select **All Applications** for the **Application type**, and search for the UMI that was created.

:::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity/azure-ad-search-enterprise-applications.png" alt-text="Screenshot of Azure portal Enterprise application settings":::

Select the UMI, and go to the **Permissions** settings under **Security**.

:::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity/azure-ad-check-user-assigned-managed-identity-permissions.png" alt-text="Screenshot of user-assigned managed identity permissions":::

## Managing a managed identity for a server or instance

To create an Azure SQL logical server with a user-assigned managed identity, see the following guide: [Create an Azure SQL logical server using a user-assigned managed identity](authentication-azure-ad-user-assigned-managed-identity-create-server.md)

### Set managed identities in the Azure portal

To set the identity for the SQL server or SQL managed instance in the [Azure portal](https://portal.azure.com):

1. Go to your **SQL server** or **SQL managed instance** resource. 
1. Under **Security**, select the **Identity (preview)** setting. 
1. Under **User assigned managed identity**, select **Add**. 
1. Select the desired **Subscription** and then under **User assigned managed identities** select the desired user assigned managed identity from the selected subscription. Then select the **Select** button. 

:::image type="content" source="media/authentication-azure-ad-user-assigned-managed-identity/existing-server-select-managed-identity.png" alt-text="Azure portal screenshot of user assigned managed identity when configuring existing server identity":::

### Create or set a managed identity using the Azure CLI

The Azure CLI 2.26.0 (or higher) is required to run these commands with UMI.

- To provision a new server with UMI, use the [az sql server create](/cli/azure/sql/server#az_sql_server_create) command.
- To obtain the UMI server information, use the [az sql server show](/cli/azure/sql/server#az_sql_server_show) command. 
- To update UMI server setting, use the [az sql server update](/cli/azure/sql/server#az_sql_server_update) command.

### Create or set a managed identity using PowerShell

[Az.Sql module 3.4](https://www.powershellgallery.com/packages/Az.Sql/3.4.0) or greater is required when using PowerShell with UMI.

- To provision a new server with UMI, use the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) command.
- To obtain the UMI server information, use the [Get-AzSqlServer](/powershell/module/az.sql/get-azsqlserver) command.
- To update UMI server setting, use the [Set-AzSqlServer](/powershell/module/az.sql/set-azsqlserver) command.

### Create or set a managed identity using REST API

The REST API provisioning script used in [Creating an Azure SQL logical server using a user-assigned managed identity](authentication-azure-ad-user-assigned-managed-identity-create-server.md) can also be used to update the UMI settings for the server. Re-run the provisioning command in the guide with the updated user-assigned managed identity property that you want to update.

### Create or set a managed identity using an ARM template

The ARM template used in [Creating an Azure SQL logical server using a user-assigned managed identity](authentication-azure-ad-user-assigned-managed-identity-create-server.md) can also be used to update the UMI settings for the server. Re-run the provisioning command in the guide with the updated user-assigned managed identity property that you want to update.

> [!NOTE]
> You can't change the SQL server administrator or password, nor the Azure AD admin by re-running the provisioning command for the ARM template.

## Limitations and known issues

- This feature is not supported for Azure Synapse Analytics.
- After a Managed Instance is created, the **Active Directory admin** blade in the Azure portal shows a warning: `Managed Instance needs permissions to access Azure Active Directory. Click here to grant "Read" permissions to your Managed Instance.` If the user-assigned managed identity was given the appropriate permissions discussed in the above [Permissions](#permissions) section, this warning can be ignored.

## Next steps

> [!div class="nextstepaction"]
> [Create an Azure SQL logical server using a user-assigned managed identity](authentication-azure-ad-user-assigned-managed-identity-create-server.md)