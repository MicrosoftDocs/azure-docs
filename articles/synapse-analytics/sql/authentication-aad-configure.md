---
title: Configure Microsoft Entra Authentication
titleSuffix: Azure Synapse Analytics
description: Configure and manage Microsoft Entra authentication for Azure Synapse Analytics.
author: VanMSFT
ms.author: vanto
ms.reviewer: wiassaf
ms.date: 10/07/2026
ms.service: azure-synapse-analytics
ms.subservice: sql
ms.topic: how-to
---

# Configure and manage Microsoft Entra authentication with Azure Synapse Analytics

This article shows you how to use [Microsoft Entra ID for authentication](authentication-aad-overview.md) with Azure Synapse Analytics.

> [!NOTE]
> Microsoft Entra server principals are currently in preview for Azure Synapse Analytics.

<a id="azure-ad-authentication-methods"></a>
<a id="provision-azure-ad-admin-sql-database"></a>

## Prerequisites

To use Microsoft Entra authentication with Azure Synapse Analytics, you need the following prerequisites:

- A Microsoft Entra tenant populated with users and groups.
- An existing Azure Synapse workspace or standalone dedicated SQL pool.

### Create and populate a Microsoft Entra tenant

Before you can configure Microsoft Entra authentication for Azure Synapse Analytics, you need to create a Microsoft Entra tenant and populate it with users and groups. You can manage Microsoft Entra tenants entirely within Azure or use them for the federation of an on-premises Active Directory Domain Service.

For more information, see:

- [What is Microsoft Entra ID?](/entra/fundamentals/whatis)
- [Integrating your on-premises identities with Microsoft Entra ID](/entra/identity/hybrid/whatis-hybrid-identity)
- [Add your domain name to Microsoft Entra ID](/entra/fundamentals/add-custom-domain)
- [What is federation with Microsoft Entra ID?](/entra/identity/hybrid/connect/whatis-fed)
- [Directory synchronization with Microsoft Entra ID](/entra/architecture/sync-directory)
- [Manage Microsoft Entra ID using Windows PowerShell](/powershell/module/azuread)
- [Hybrid Identity Required Ports and Protocols](/entra/identity/hybrid/connect/reference-connect-ports)

## Set Microsoft Entra admin

To use Microsoft Entra authentication, your Azure Synapse resource needs a Microsoft Entra administrator.

You can also configure the Microsoft Entra administrator when you create the resource. If you already have an administrator configured, skip this section.

### Azure Synapse workspace

For an Azure Synapse workspace, configure the Microsoft Entra administrator on the workspace. For more information, see [Administrator structure](active-directory-authentication.md#administrator-structure).

### Standalone dedicated SQL pool

When you set the Microsoft Entra administrator, you enable Microsoft Entra authentication for the [logical server](logical-servers.md) that hosts a standalone dedicated SQL pool. You can set the administrator by using the Azure portal, PowerShell, Azure CLI, or REST APIs.

In the Azure portal, you can find the **logical server** name

- In the **server name** field on the **Overview** page of your standalone dedicated SQL pool in Azure Synapse Analytics.

#### [Azure portal](#tab/azure-portal)

To set the Microsoft Entra admin for your logical server in the Azure portal, follow these steps:

1. In the [Azure portal **Directories + subscriptions** pane](https://portal.azure.com/#settings/directory), choose the directory that contains your Azure Synapse resource as the **Current directory**.

1. Search for **SQL servers** and then select the logical server for your dedicated SQL pool to open the **SQL server** pane.

1. On the **SQL server** pane for your logical server, select **Microsoft Entra ID** under **Settings** to open the **Microsoft Entra ID** pane.

1. On the **Microsoft Entra ID** pane, select **Set admin** to open the **Microsoft Entra ID** pane.

1. The **Microsoft Entra ID** pane shows all users, groups, and applications in your current directory and allows you to search by name, alias, or ID. Find your desired identity for your Microsoft Entra admin and select it, then select **Select** to close the pane.

1. At the top of the **Microsoft Entra ID** page for your logical server, select **Save**.

   The **Object ID** is displayed next to the admin name for Microsoft Entra users and groups. For applications (service principals), the **Application ID** is displayed.

The process of changing the administrator might take several minutes. Then the new administrator appears in the **Microsoft Entra admin** field.

To remove the admin, at the top of the **Microsoft Entra ID** page, select **Remove admin**, then select **Save**. Removing the Microsoft Entra admin disables Microsoft Entra authentication for your logical server.

#### [PowerShell](#tab/azure-powershell)

To run PowerShell cmdlets, you need to have Azure PowerShell installed and running. See [How to install and configure Azure PowerShell](/powershell/azure/) for detailed information.

The following Azure PowerShell cmdlets can be used to set and manage a Microsoft Entra administrator for a logical server that hosts a standalone dedicated SQL pool:

| Cmdlet name | Description |
| --- | --- |
| [Set-AzSqlServerActiveDirectoryAdministrator](/powershell/module/az.sql/set-azsqlserveractivedirectoryadministrator) | Sets a Microsoft Entra administrator for the logical server. |
| [Remove-AzSqlServerActiveDirectoryAdministrator](/powershell/module/az.sql/remove-azsqlserveractivedirectoryadministrator) | Removes a Microsoft Entra administrator from the logical server. |
| [Get-AzSqlServerActiveDirectoryAdministrator](/powershell/module/az.sql/get-azsqlserveractivedirectoryadministrator) | Returns information about the Microsoft Entra administrator configured for the logical server. |

Use PowerShell command get-help to see more information for each of these commands. For example, `get-help Set-AzSqlServerActiveDirectoryAdministrator`.

The following script sets a Microsoft Entra administrator group named **DBA_Group** (sample object ID `aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb`) for the sample server **example-server** in a sample resource group named **Example-Resource-Group**:

```powershell
$parameters = @{
    ResourceGroupName = "Example-Resource-Group"
    ServerName = "example-server"
    DisplayName = "DBA_Group"
}

Set-AzSqlServerActiveDirectoryAdministrator @parameters
```

The `DisplayName` parameter accepts either the Microsoft Entra ID display name or the User Principal Name, such as the following examples: ``DisplayName="Adrian King"`` and ``DisplayName="adrian@contoso.com"``. If you're using a Microsoft Entra group, then only the display name is supported.

The following example uses the optional `ObjectID` parameter:

```powershell
$parameters = @{
  ResourceGroupName = "Example-Resource-Group"
  ServerName = "example-server"
  DisplayName = "DBA_Group"
  ObjectId = "aaaaaaaa-0000-1111-2222-bbbbbbbbbbbb"
}
Set-AzSqlServerActiveDirectoryAdministrator @parameters
```

> [!NOTE]
> The `ObjectID` is required when the `DisplayName` isn't unique. To retrieve the `ObjectID` and `DisplayName` values, you can view the properties of a user or group in the Microsoft Entra ID section of the Azure portal.

The following example returns information about the current Microsoft Entra admin for the server:

```powershell
$parameters = @{
    ResourceGroupName = "Example-Resource-Group"
    ServerName = "example-server"
}

Get-AzSqlServerActiveDirectoryAdministrator @parameters | Format-List
```

The following example removes a Microsoft Entra administrator:

```powershell
$parameters = @{
    ResourceGroupName = "Example-Resource-Group"
    ServerName = "example-server"
}

Remove-AzSqlServerActiveDirectoryAdministrator @parameters
```

#### [Azure CLI](#tab/azure-cli)

You can set a Microsoft Entra administrator for a logical server by using the following Azure CLI commands:

| Command | Description |
| --- | --- |
| [az sql server ad-admin create](/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-create) | Sets a Microsoft Entra administrator for the logical server. |
| [az sql server ad-admin delete](/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-delete) | Removes a Microsoft Entra administrator from the logical server. |
| [az sql server ad-admin list](/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-list) | Returns information about the Microsoft Entra administrator configured for the logical server. |
| [az sql server ad-admin update](/cli/azure/sql/server/ad-admin#az-sql-server-ad-admin-update) | Updates the Microsoft Entra administrator for the logical server. |

For more CLI commands, see [az sql server](/cli/azure/sql/server).

#### [REST APIs](#tab/rest-apis)

You can also use the [Server Azure AD Administrator](/rest/api/sql/server-azure-ad-administrators) REST APIs to create, update, delete, and get the Microsoft Entra administrator for the logical server.

| API | Description |
| --- | --- |
| [Create Or Update](/rest/api/sql/server-azure-ad-administrators/create-or-update) | Creates or updates an existing Microsoft Entra administrator. |
| [Delete](/rest/api/sql/server-azure-ad-administrators/delete) | Deletes the Microsoft Entra administrator with the given name. |
| [Get](/rest/api/sql/server-azure-ad-administrators/get) | Gets the Microsoft Entra administrator for the named server. |
| [List By Server](/rest/api/sql/server-azure-ad-administrators/list-by-server) | Gets a list of Microsoft Entra administrators in a server. |

---

> [!NOTE]
> The Microsoft Entra admin is stored in the server's `master` database as a user (database principal). Since database principal names must be unique, the display name of the admin can't be the same as the name of any user in the server's `master` database. If a user with the name already exists, the Microsoft Entra admin setup fails and rolls back, indicating that the name is already in use.

## Assign Microsoft Graph permissions

For some operations, Azure Synapse Analytics requires permissions to query Microsoft Graph, as explained in [Microsoft Graph permissions](authentication-aad-overview.md#microsoft-graph-permissions). Azure Synapse Analytics supports fine-grained Microsoft Graph API permissions such as `User.Read.All`, `GroupMember.Read.All`, and `Application.Read.All` on the resource identity. This approach follows the principle of least privilege and is recommended. You can also use the Directory Readers role as a broader alternative. For more information, see [Managed identities in Microsoft Entra for Azure Synapse Analytics](authentication-azure-ad-user-assigned-managed-identity.md).

### Directory Readers role

For a guided procedure, see [Assign the Directory Readers role to a Microsoft Entra group](authentication-aad-directory-readers-role-tutorial.md).

The following PowerShell script adds an Azure Synapse resource identity to the Directory Readers role.

```powershell
# This script grants "Directory Readers" permission to an Azure Synapse service principal.
# It can be executed only by a user who is a member of the **Privileged Roles Administrator** role.

Import-Module Microsoft.Graph.Authentication
$instanceName = "<InstanceName>"        # Enter the name of your managed instance or server
$tenantId = "<TenantId>"                       # Enter your tenant ID

Connect-MgGraph -TenantId $tenantId -Scopes "RoleManagement.ReadWrite.Directory"

# Get Microsoft Entra "Directory Readers" role and create if it doesn't exist
$roleName = "Directory Readers"
$role = Get-MgDirectoryRole -Filter "DisplayName eq '$roleName'"
if ($role -eq $null) {
    # Instantiate an instance of the role template
    $roleTemplate = Get-MgDirectoryRoleTemplate -Filter "DisplayName eq '$roleName'"
    New-MgDirectoryRoleTemplate -RoleTemplateId $roleTemplate.Id
    $role = Get-MgDirectoryRole -Filter "DisplayName eq '$roleName'"
}

# Get service principal for your logical server
$roleMember = Get-MgServicePrincipal -Filter "DisplayName eq '$instanceName'"
$roleMember.Count
if ($roleMember -eq $null) {
    Write-Output "Error: No service principal with name '$($instanceName)' found, make sure that instanceName parameter was entered correctly."
    exit
}
if (-not ($roleMember.Count -eq 1)) {
    Write-Output "Error: Multiple service principals with name '$($instanceName)'"
    Write-Output $roleMember | Format-List DisplayName, Id, AppId
    exit
}

# Check if service principal is already member of Directory Readers role
$isDirReader = Get-MgDirectoryRoleMember -DirectoryRoleId $role.Id -Filter "Id eq '$($roleMember.Id)'"
if ($isDirReader -eq $null) {
    # Add principal to Directory Readers role
    Write-Output "Adding service principal '$($instanceName)' to 'Directory Readers' role..."
    $body = @{
        "@odata.id"= "https://graph.microsoft.com/v1.0/directoryObjects/{$($roleMember.Id)}"
    }
    New-MgDirectoryRoleMemberByRef -DirectoryRoleId $role.Id -BodyParameter $body
    Write-Output "'$($instanceName)' service principal added to 'Directory Readers' role."
} else {
    Write-Output "Service principal '$($instanceName)' is already member of 'Directory Readers' role."
}
```

The Microsoft Entra administrator can now create Microsoft Entra server principals (logins) and database principals (users).

## Create Microsoft Entra principals in SQL

To connect to a database in Azure Synapse Analytics with Microsoft Entra authentication, you need to configure a principal in the database for that identity with at least the `CONNECT` permission.

### Database user permissions

When you create a database user, it receives the `CONNECT` permission to the database by default. A database user also inherits permissions in two circumstances:

- The user is a member of a Microsoft Entra group that's also assigned permissions on the server.
- You create the user from a login, and the user inherits the server-assigned permissions of the login that apply to the database.

Managing permissions for server and database principals works the same regardless of the type of principal (Microsoft Entra ID, SQL authentication, etc.). Grant permissions to database roles instead of directly granting permissions to users. Then add users to roles with appropriate permissions. This approach simplifies long-term permissions management and reduces the likelihood of an identity retaining access when it's no longer appropriate.

For more information, see:
- [Database engine permissions and examples](/sql/relational-databases/security/permissions-database-engine)
- [Blog: Database Engine permission basics](https://techcommunity.microsoft.com/t5/sql-server-blog/database-engine-permission-basics/ba-p/383905)
- [Authorize database access to Azure Synapse Analytics](logins-create-manage.md)

### Contained database users

A contained database user is a type of SQL user that isn't connected to a login in the `master` database. To create a Microsoft Entra contained database user, connect to the database with a Microsoft Entra identity that has at least the `ALTER ANY USER` permission. The following T-SQL example creates a database principal named `Microsoft_Entra_principal_name` from Microsoft Entra ID.

```sql
CREATE USER [<Microsoft_Entra_principal_name>] FROM EXTERNAL PROVIDER;
```

To create a contained database user for a Microsoft Entra group, enter the display name of the group:

```sql
CREATE USER [ICU Nurses] FROM EXTERNAL PROVIDER;
```

To create a contained database user for a managed identity or service principal, enter the display name of the identity:

```sql
CREATE USER [appName] FROM EXTERNAL PROVIDER;
```

To create a contained database user for a Microsoft Entra user, enter the user principal name of the identity:

```sql
CREATE USER [adrian@contoso.com] FROM EXTERNAL PROVIDER;
```

### Login based users

> [!NOTE]
> [Microsoft Entra server principals (logins)](authentication-azure-ad-logins.md) are currently in preview for Azure Synapse Analytics.

[Microsoft Entra server principals (or logins)](authentication-azure-ad-logins.md) are supported, which means contained database users aren't required. Database principals (users) can be created based off of a server principal, which means Microsoft Entra users can inherit server-level assigned permissions of a login.

```sql
CREATE USER [appName] FROM LOGIN [appName];
```

For syntax on creating Microsoft Entra server principals (logins), see [CREATE LOGIN](/sql/t-sql/statements/create-login-transact-sql?view=azure-sqldw-latest&preserve-view=true).

<a id="create-contained-users-mapped-to-azure-ad-identities"></a>

### External users

You can't directly create a database user for an identity managed in a different Microsoft Entra tenant than the one associated with your Azure subscription. However, you can import users from other directories into the associated directory as external users. You can then use them to create contained database users that can access the database. External users can also gain access through membership in Microsoft Entra groups.

**Examples:**
To create a contained database user representing a Microsoft Entra federated or managed domain user:

```sql
CREATE USER [alice@fabrikam.com] FROM EXTERNAL PROVIDER;
```

- A federated domain user account that you import into a managed domain as an external user must use the managed domain identity.

<a id="naming-considerations"></a>

### Name considerations

You can't use special characters like colon `:` or ampersand `&` in user names for the T-SQL `CREATE LOGIN` and `CREATE USER` statements.

Microsoft Entra ID and Azure Synapse Analytics differ in their user management design in one key way: Microsoft Entra ID allows duplicate display names within a tenant, whereas Azure Synapse Analytics requires unique server principal names in a dedicated SQL pool and unique database principal names in a database.

### Microsoft Graph permissions

The `CREATE USER ... FROM EXTERNAL PROVIDER` command requires Azure Synapse Analytics to access Microsoft Entra ID (the external provider) on behalf of the signed-in user. Sometimes, Microsoft Entra ID returns an exception.

- You might encounter SQL error 33134, which contains the Microsoft Entra ID-specific error message. The error usually says that access is denied, that the user must enroll in MFA to access the resource, or that access between first-party applications must be handled via preauthorization. In the first two cases, the issue is usually caused by Conditional Access policies that are set in the user's Microsoft Entra tenant: they prevent the user from accessing the external provider. Updating the Conditional Access policies to allow access to the application `00000003-0000-0000-c000-000000000000` (the application ID of the Microsoft Graph API) should resolve the issue. If the error says access between first-party applications must be handled via preauthorization, the issue is because the user is signed in as a service principal. The command should succeed if it's executed by a user instead.
- If you receive a **Connection Timeout Expired**, you might need to set the `TransparentNetworkIPResolution`
  parameter of the connection string to false. For more information, see [Connection timeout issue with .NET Framework 4.6.1 - TransparentNetworkIPResolution](/archive/blogs/dataaccesstechnologies/connection-timeout-issue-with-net-framework-4-6-1-transparentnetworkipresolution).

For more information about creating contained database users based on Microsoft Entra identities, see [CREATE USER](/sql/t-sql/statements/create-user-transact-sql).

## Configure multifactor authentication

For improved security, consider configuring [multifactor authentication (MFA)](authentication-aad-overview.md#multifactor-authentication-mfa), which prompts the user to use a second method to authenticate to the database, such as a phone call or an authenticator app.

To use multifactor authentication with Azure Synapse Analytics, first [enable multifactor authentication](/entra/identity/authentication/concept-mfa-howitworks#how-to-enable-and-use-microsoft-entra-multifactor-authentication), and then use a [Conditional Access policy](/entra/identity/conditional-access/overview) to enforce MFA.

## Connect with Microsoft Entra

After Microsoft Entra authentication has been configured, you can use it to connect to Azure Synapse Analytics with [SQL Server Management Studio or SQL Server Data Tools](authentication-microsoft-entra-connect-to-azure-sql.md#connect-with-ssms-or-ssdt), and configure [client applications](authentication-microsoft-entra-connect-to-azure-sql.md#connect-from-a-client-application) to connect by using Microsoft Entra identities.

## Troubleshoot Microsoft Entra authentication

For guidance, see [Troubleshoot problems related to Microsoft Entra authentication](https://techcommunity.microsoft.com/t5/azure-sql-blog/troubleshooting-problems-related-to-azure-ad-authentication-with/ba-p/1062991).

## Related content

- [Authorize database access to Azure Synapse Analytics](logins-create-manage.md)
- [Managed identities in Microsoft Entra for Azure Synapse Analytics](authentication-azure-ad-user-assigned-managed-identity.md)
- [Principals](/sql/relational-databases/security/authentication-access/principals-database-engine)
- [Database roles](/sql/relational-databases/security/authentication-access/database-level-roles)
- [Azure Synapse Analytics firewall rules](firewall-configure.md)
