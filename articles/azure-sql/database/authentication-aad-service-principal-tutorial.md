---
title: Create Azure AD users using service principals
description: This tutorial walks you through creating an Azure AD user with an Azure AD applications (service principals) in Azure SQL Database
ms.service: sql-database
ms.subservice: security
ms.topic: tutorial
author: GithubMirek
ms.author: mireks
ms.reviewer: vanto
ms.date: 05/10/2021 
ms.custom: devx-track-azurepowershell
---

# Tutorial: Create Azure AD users using Azure AD applications

[!INCLUDE[appliesto-sqldb](../includes/appliesto-sqldb.md)]

This article takes you through the process of creating Azure AD users in Azure SQL Database, using Azure service principals (Azure AD applications). This functionality already exists in Azure SQL Managed Instance, but is now being introduced in Azure SQL Database. To support this scenario, an Azure AD Identity must be generated and assigned to the Azure SQL logical server.

For more information on Azure AD authentication for Azure SQL, see the article [Use Azure Active Directory authentication](authentication-aad-overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Assign an identity to the Azure SQL logical server
> - Assign Directory Readers permission to the SQL logical server identity
> - Create a service principal (an Azure AD application) in Azure AD
> - Create a service principal user in Azure SQL Database
> - Create a different Azure AD user in SQL Database using an Azure AD service principal user

## Prerequisites

- An existing [Azure SQL Database](single-database-create-quickstart.md) deployment. We assume you have a working SQL Database for this tutorial.
- Access to an already existing Azure Active Directory.
- [Az.Sql 2.9.0](https://www.powershellgallery.com/packages/Az.Sql/2.9.0) module or higher is needed when using PowerShell to set up an individual Azure AD application as Azure AD admin for Azure SQL. Ensure you are upgraded to the latest module.

## Assign an identity to the Azure SQL logical server

1. Connect to your Azure Active Directory. You will need to find your Tenant ID. This can be found by going to the [Azure portal](https://portal.azure.com), and going to your **Azure Active Directory** resource. In the **Overview** pane, you should see your **Tenant ID**. Run the following PowerShell command:

    - Replace `<TenantId>` with your **Tenant ID**.

    ```powershell
    Connect-AzAccount -Tenant <TenantId>
    ```

    Record the `TenantId` for future use in this tutorial.

1. Generate and assign an Azure AD Identity to the Azure SQL logical server. Execute the following PowerShell command:

    - Replace `<resource group>` and `<server name>` with your resources. If your server name is `myserver.database.windows.net`, replace `<server name>` with `myserver`.

    ```powershell
    Set-AzSqlServer -ResourceGroupName <resource group> -ServerName <server name> -AssignIdentity
    ```

    For more information, see the [Set-AzSqlServer](/powershell/module/az.sql/set-azsqlserver) command.

    > [!IMPORTANT]
    > If an Azure AD Identity is set up for the Azure SQL logical server, the [**Directory Readers**](../../active-directory/roles/permissions-reference.md#directory-readers) permission must be granted to the identity. We will walk through this step in following section. **Do not** skip this step as Azure AD authentication will stop working.

    - If you used the [New-AzSqlServer](/powershell/module/az.sql/new-azsqlserver) command with the parameter `AssignIdentity` for a new SQL server creation in the past, you'll need to execute the [Set-AzSqlServer](/powershell/module/az.sql/set-azsqlserver) command afterwards as a separate command to enable this property in the Azure fabric.

1. Check the server identity was successfully assigned. Execute the following PowerShell command:

    - Replace `<resource group>` and `<server name>` with your resources. If your server name is `myserver.database.windows.net`, replace `<server name>` with `myserver`.
    
    ```powershell
    $xyz = Get-AzSqlServer  -ResourceGroupName <resource group> -ServerName <server name>
    $xyz.identity
    ```

    Your output should show you `PrincipalId`, `Type`, and `TenantId`. The identity assigned is the `PrincipalId`.

1. You can also check the identity by going to the [Azure portal](https://portal.azure.com).

    - Under the **Azure Active Directory** resource, go to **Enterprise applications**. Type in the name of your SQL logical server. You will see that it has an **Object ID** attached to the resource.
    
    :::image type="content" source="media/authentication-aad-service-principals-tutorial/enterprise-applications-object-id.png" alt-text="object-id":::

## Assign Directory Readers permission to the SQL logical server identity

To allow the Azure AD assigned identity to work properly for Azure SQL, the Azure AD `Directory Readers` permission must be granted to the server identity.

To grant this required permission, run the following script.

> [!NOTE] 
> This script must be executed by an Azure AD `Global Administrator` or a `Privileged Roles Administrator`.
>
> In **public preview**, you can assign the `Directory Readers` role to a group in Azure AD. The group owners can then add the managed identity as a member of this group, which would bypass the need for a `Global Administrator` or `Privileged Roles Administrator` to grant the `Directory Readers` role. For more information on this feature, see [Directory Readers role in Azure Active Directory for Azure SQL](authentication-aad-directory-readers-role.md).

- Replace `<TenantId>` with your `TenantId` gathered earlier.
- Replace `<server name>` with your SQL logical server name. If your server name is `myserver.database.windows.net`, replace `<server name>` with `myserver`.

```powershell
# This script grants Azure "Directory Readers" permission to a Service Principal representing the Azure SQL logical server
# It can be executed only by a "Global Administrator" or "Privileged Roles Administrator" type of user.
# To check if the "Directory Readers" permission was granted, execute this script again

Import-Module AzureAD
Connect-AzureAD -TenantId "<TenantId>"    #Enter your actual TenantId
$AssignIdentityName = "<server name>"     #Enter Azure SQL logical server name
 
# Get Azure AD role "Directory Users" and create if it doesn't exist
$roleName = "Directory Readers"
$role = Get-AzureADDirectoryRole | Where-Object {$_.displayName -eq $roleName}
if ($role -eq $null) {
    # Instantiate an instance of the role template
    $roleTemplate = Get-AzureADDirectoryRoleTemplate | Where-Object {$_.displayName -eq $roleName}
    Enable-AzureADDirectoryRole -RoleTemplateId $roleTemplate.ObjectId
    $role = Get-AzureADDirectoryRole | Where-Object {$_.displayName -eq $roleName}
}
 
# Get service principal for managed instance
$roleMember = Get-AzureADServicePrincipal -SearchString $AssignIdentityName
$roleMember.Count
if ($roleMember -eq $null) {
    Write-Output "Error: No Service Principals with name '$($AssignIdentityName)', make sure that AssignIdentityName parameter was entered correctly."
    exit
}

if (-not ($roleMember.Count -eq 1)) {
    Write-Output "Error: More than one service principal with name pattern '$($AssignIdentityName)'"
    Write-Output "Dumping selected service principals...."
    $roleMember
    exit
}
 
# Check if service principal is already member of readers role
$allDirReaders = Get-AzureADDirectoryRoleMember -ObjectId $role.ObjectId
$selDirReader = $allDirReaders | where{$_.ObjectId -match $roleMember.ObjectId}
 
if ($selDirReader -eq $null) {
    # Add principal to readers role
    Write-Output "Adding service principal '$($AssignIdentityName)' to 'Directory Readers' role'..."
    Add-AzureADDirectoryRoleMember -ObjectId $role.ObjectId -RefObjectId $roleMember.ObjectId
    Write-Output "'$($AssignIdentityName)' service principal added to 'Directory Readers' role'..."
 
    #Write-Output "Dumping service principal '$($AssignIdentityName)':"
    #$allDirReaders = Get-AzureADDirectoryRoleMember -ObjectId $role.ObjectId
    #$allDirReaders | where{$_.ObjectId -match $roleMember.ObjectId}
} else {
    Write-Output "Service principal '$($AssignIdentityName)' is already member of 'Directory Readers' role'."
}
```

> [!NOTE]
> The output from this above script will indicate if the Directory Readers permission was granted to the identity. You can re-run the script if you are unsure if the permission was granted.

For a similar approach on how to set the **Directory Readers** permission for SQL Managed Instance, see [Provision Azure AD admin (SQL Managed Instance)](authentication-aad-configure.md#powershell).

## Create a service principal (an Azure AD application) in Azure AD

1. Follow the guide here to [register your app](active-directory-interactive-connect-azure-sql-db.md#register-your-app-and-set-permissions).

2. You'll also need to create a client secret for signing in. Follow the guide here to [upload a certificate or create a secret for signing in](../../active-directory/develop/howto-create-service-principal-portal.md#authentication-two-options).

3. Record the following from your application registration. It should be available from your **Overview** pane:
    - **Application ID**
    - **Tenant ID** - This should be the same as before

In this tutorial, we'll be using *AppSP* as our main service principal, and *myapp* as the second service principal user that will be created in Azure SQL by *AppSP*. You'll need to create two applications, *AppSP* and *myapp*.

For more information on how to create an Azure AD application, see the article [How to: Use the portal to create an Azure AD application and service principal that can access resources](../../active-directory/develop/howto-create-service-principal-portal.md).

## Create the service principal user in Azure SQL Database

Once a service principal is created in Azure AD, create the user in SQL Database. You'll need to connect to your SQL Database with a valid login with permissions to create users in the database.

1. Create the user *AppSP* in the SQL Database using the following T-SQL command:

    ```sql
    CREATE USER [AppSP] FROM EXTERNAL PROVIDER
    GO
    ```

2. Grant `db_owner` permission to *AppSP*, which allows the user to create other Azure AD users in the database.

    ```sql
    EXEC sp_addrolemember 'db_owner', [AppSP]
    GO
    ```

    For more information, see [sp_addrolemember](/sql/relational-databases/system-stored-procedures/sp-addrolemember-transact-sql)

    Alternatively, `ALTER ANY USER` permission can be granted instead of giving the `db_owner` role. This will allow the service principal to add other Azure AD users.

    ```sql
    GRANT ALTER ANY USER TO [AppSp]
    GO
    ```

    > [!NOTE]
    > The above setting is not required when *AppSP* is set as an Azure AD admin for the server. To set the service principal as an AD admin for the SQL logical server, you can use the Azure portal, PowerShell, or Azure CLI commands. For more information, see [Provision Azure AD admin (SQL Database)](authentication-aad-configure.md?tabs=azure-powershell#powershell-for-sql-database-and-azure-synapse).

## Create an Azure AD user in SQL Database using an Azure AD service principal

> [!IMPORTANT]
> The service principal used to login to SQL Database must have a client secret. If it doesn’t have one, follow step 2 of [Create a service principal (an Azure AD application) in Azure AD](#create-a-service-principal-an-azure-ad-application-in-azure-ad). This client secret needs to be added as an input parameter in the script below.

1. Use the following script to create an Azure AD service principal user *myapp* using the service principal *AppSP*.

    - Replace `<TenantId>` with your `TenantId` gathered earlier.
    - Replace `<ClientId>` with your `ClientId` gathered earlier.
    - Replace `<ClientSecret>` with your client secret created earlier.
    - Replace `<server name>` with your SQL logical server name. If your server name is `myserver.database.windows.net`, replace `<server name>` with `myserver`.
    - Replace `<database name>` with your SQL Database name.

    ```powershell
    # PowerShell script for creating a new SQL user called myapp using application AppSP with secret
    # AppSP is part of an Azure AD admin for the Azure SQL server below
    
    # Download latest  MSAL  - https://www.powershellgallery.com/packages/MSAL.PS
    Import-Module MSAL.PS
    
    $tenantId = "<TenantId>"   # tenantID (Azure Directory ID) were AppSP resides
    $clientId = "<ClientId>"   # AppID also ClientID for AppSP     
    $clientSecret = "<ClientSecret>"   # Client secret for AppSP 
    $scopes = "https://database.windows.net/.default" # The end-point
    
    $result = Get-MsalToken -RedirectUri $uri -ClientId $clientId -ClientSecret (ConvertTo-SecureString $clientSecret -AsPlainText -Force) -TenantId $tenantId -Scopes $scopes
    
    $Tok = $result.AccessToken
    #Write-host "token"
    $Tok
      
    $SQLServerName = "<server name>"    # Azure SQL logical server name 
    $DatabaseName = "<database name>"     # Azure SQL database name
    
    Write-Host "Create SQL connection string"
    $conn = New-Object System.Data.SqlClient.SQLConnection 
    $conn.ConnectionString = "Data Source=$SQLServerName.database.windows.net;Initial Catalog=$DatabaseName;Connect Timeout=30"
    $conn.AccessToken = $Tok
    
    Write-host "Connect to database and execute SQL script"
    $conn.Open() 
    $ddlstmt = 'CREATE USER [myapp] FROM EXTERNAL PROVIDER;'
    Write-host " "
    Write-host "SQL DDL command"
    $ddlstmt
    $command = New-Object -TypeName System.Data.SqlClient.SqlCommand($ddlstmt, $conn)       
    
    Write-host "results"
    $command.ExecuteNonQuery()
    $conn.Close()
    ``` 

    Alternatively, you can use the code sample in the blog, [Azure AD Service Principal authentication to SQL DB - Code Sample](https://techcommunity.microsoft.com/t5/azure-sql-database/azure-ad-service-principal-authentication-to-sql-db-code-sample/ba-p/481467). Modify the script to execute a DDL statement `CREATE USER [myapp] FROM EXTERNAL PROVIDER`. The same script can be used to create a regular Azure AD user or a group in SQL Database.

    
2. Check if the user *myapp* exists in the database by executing the following command:

    ```sql
    SELECT name, type, type_desc, CAST(CAST(sid as varbinary(16)) as uniqueidentifier) as appId from sys.database_principals WHERE name = 'myapp'
    GO
    ```

    You should see a similar output:

    ```output
    name	type	type_desc	appId
    myapp	E	EXTERNAL_USER	6d228f48-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ```

## Next steps

- [Azure Active Directory service principal with Azure SQL](authentication-aad-service-principal.md)
- [What are managed identities for Azure resources?](../../active-directory/managed-identities-azure-resources/overview.md)
- [How to use managed identities for App Service and Azure Functions](../../app-service/overview-managed-identity.md)
- [Azure AD Service Principal authentication to SQL DB - Code Sample](https://techcommunity.microsoft.com/t5/azure-sql-database/azure-ad-service-principal-authentication-to-sql-db-code-sample/ba-p/481467)
- [Application and service principal objects in Azure Active Directory](../../active-directory/develop/app-objects-and-service-principals.md)
- [Create an Azure service principal with Azure PowerShell](/powershell/azure/create-azure-service-principal-azureps)
- [Directory Readers role in Azure Active Directory for Azure SQL](authentication-aad-directory-readers-role.md)
