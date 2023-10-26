---
title: 'Tutorial: Use a managed identity to access Azure SQL Database - Windows'
description: A tutorial that walks you through the process of using a Windows VM system-assigned managed identity to access Azure SQL Database.
services: active-directory
documentationcenter: ''
author: barclayn
manager: amycolannino

ms.service: active-directory
ms.subservice: msi
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/25/2023
ms.author: barclayn
ms.collection: M365-identity-device-management
---
# Tutorial: Use a Windows VM system-assigned managed identity to access Azure SQL


This tutorial shows you how to use a system-assigned identity for a Windows virtual machine (VM) to access Azure SQL Database. Managed Service Identities are automatically managed by Azure and enable you to authenticate to services that support Microsoft Entra authentication, without needing to insert credentials into your code. You learn how to:

> [!div class="checklist"]
>
> * Grant your VM access to Azure SQL Database
> * Enable Microsoft Entra authentication
> * Create a contained user in the database that represents the VM's system assigned identity
> * Get an access token using the VM identity and use it to query Azure SQL Database

## Prerequisites

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

## Enable

[!INCLUDE [msi-tut-enable](../../../includes/active-directory-msi-tut-enable.md)]

## Grant access

To grant your VM access to a database in Azure SQL Database, you can use an existing [logical SQL server](/azure/azure-sql/database/logical-servers) or create a new one. To create a new server and database using the Azure portal, follow this [Azure SQL quickstart](/azure/azure-sql/database/single-database-create-quickstart). There are also quickstarts that use the Azure CLI and Azure PowerShell in the [Azure SQL documentation](/azure/azure-sql/).

There are two steps to granting your VM access to a database:

1. Enable Microsoft Entra authentication for the server.
2. Create a **contained user** in the database that represents the VM's system-assigned identity.

<a name='enable-azure-ad-authentication'></a>

### Enable Microsoft Entra authentication

**To [configure Microsoft Entra authentication](/azure/azure-sql/database/authentication-aad-configure):**

1. In the Azure portal, select **SQL servers** from the left-hand navigation.
2. Select the SQL server to be enabled for Microsoft Entra authentication.
3. In the **Settings** section of the blade, click **Active Directory admin**.
4. In the command bar, click **Set admin**.
5. Select a Microsoft Entra user account to be made an administrator of the server, and click **Select.**
6. In the command bar, click **Save.**


### Create contained user

This section shows how to create a contained user in the database that represents the VM's system assigned identity. For this step, you need [Microsoft SQL Server Management Studio](/sql/ssms/download-sql-server-management-studio-ssms) (SSMS). Before beginning, it may also be helpful to review the following articles for background on Microsoft Entra integration:

- [Universal Authentication with SQL Database and Azure Synapse Analytics (SSMS support for MFA)](/azure/azure-sql/database/authentication-mfa-ssms-overview)
- [Configure and manage Microsoft Entra authentication with SQL Database or Azure Synapse Analytics](/azure/azure-sql/database/authentication-aad-configure)

SQL DB requires unique Microsoft Entra ID display names. With this, the Microsoft Entra accounts such as users, groups and Service Principals (applications), and VM names enabled for managed identity must be uniquely defined in Microsoft Entra ID regarding their display names. SQL DB checks the Microsoft Entra ID display name during T-SQL creation of such users and if it isn't unique, the command fails requesting to provide a unique Microsoft Entra ID display name for a given account.

**To create a contained user:**

1. Start SQL Server Management Studio.
2. In the **Connect to Server** dialog, Enter your server name in the **Server name** field.
3. In the **Authentication** field, select **Active Directory - Universal with MFA support**.
4. In the **User name** field, enter the name of the Microsoft Entra account that you set as the server administrator, for example, helen@woodgroveonline.com
5. Click **Options**.
6. In the **Connect to database** field, enter the name of the non-system database you want to configure.
7. Click **Connect**. Complete the sign-in process.
8. In the **Object Explorer**, expand the **Databases** folder.
9. Right-click on a user database and select **New query**.
10. In the query window, enter the following line, and click **Execute** in the toolbar:

    > [!NOTE]
    > `VMName` in the following command is the name of the VM that you enabled system assigned identity on in the prerequsites section.

    ```sql
    CREATE USER [VMName] FROM EXTERNAL PROVIDER
    ```

    The command should complete successfully, creating the contained user for the VM's system-assigned identity.
11. Clear the query window, enter the following line, and click **Execute** in the toolbar:

    > [!NOTE]
    > `VMName` in the following command is the name of the VM that you enabled system assigned identity on in the prerequisites section.
    > 
    > If you encounter the error "Principal `VMName` has a duplicate display name", append the CREATE USER statement with WITH OBJECT_ID='xxx'.

    ```sql
    ALTER ROLE db_datareader ADD MEMBER [VMName]
    ```

    The command should complete successfully, granting the contained user the ability to read the entire database.

Code running in the VM can now get a token using its system-assigned managed identity and use the token to authenticate to the server.

## Access data

This section shows how to get an access token using the VM's system-assigned managed identity and use it to call Azure SQL. Azure SQL natively supports Microsoft Entra authentication, so it can directly accept access tokens obtained using managed identities for Azure resources. This method doesn't require supplying credentials on the connection string.

Here's a .NET code example of opening a connection to SQL using Active Directory Managed Identity authentication. The code must run on the VM to be able to access the VM's system-assigned managed identity's endpoint. **.NET Framework 4.6.2** or higher or **.NET Core 3.1** or higher is required to use this method. Replace the values of AZURE-SQL-SERVERNAME and DATABASE accordingly and add a NuGet reference to the Microsoft.Data.SqlClient library.

```csharp
using Microsoft.Data.SqlClient;

try
{
//
// Open a connection to the server using Active Directory Managed Identity authentication.
//
string connectionString = "Data Source=<AZURE-SQL-SERVERNAME>; Initial Catalog=<DATABASE>; Authentication=Active Directory Managed Identity; Encrypt=True";
SqlConnection conn = new SqlConnection(connectionString);
conn.Open();
```

>[!NOTE]
>You can use managed identities while working with other programming options using our [SDKs](qs-configure-sdk-windows-vm.md).

Alternatively, a quick way to test the end-to-end setup without having to write and deploy an app on the VM is using PowerShell.

1. In the portal, navigate to **Virtual Machines** and go to your Windows virtual machine and in the **Overview**, click **Connect**.
2. Enter in your **VM admin credential** which you added when you created the Windows VM.
3. Now that you have created a **Remote Desktop Connection** with the virtual machine, open **PowerShell** in the remote session.
4. Using PowerShell’s `Invoke-WebRequest`, make a request to the local managed identity's endpoint to get an access token for Azure SQL.

    ```powershell
        $response = Invoke-WebRequest -Uri 'http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https%3A%2F%2Fdatabase.windows.net%2F' -Method GET -Headers @{Metadata="true"}
    ```

    Convert the response from a JSON object to a PowerShell object.

    ```powershell
    $content = $response.Content | ConvertFrom-Json
    ```

    Extract the access token from the response.

    ```powershell
    $AccessToken = $content.access_token
    ```

5. Open a connection to the server. Remember to replace the values for AZURE-SQL-SERVERNAME and DATABASE.

    ```powershell
    $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
    $SqlConnection.ConnectionString = "Data Source = <AZURE-SQL-SERVERNAME>; Initial Catalog = <DATABASE>; Encrypt=True;"
    $SqlConnection.AccessToken = $AccessToken
    $SqlConnection.Open()
    ```

    Next, create, and send a query to the server. Remember to replace the value for TABLE.

    ```powershell
    $SqlCmd = New-Object System.Data.SqlClient.SqlCommand
    $SqlCmd.CommandText = "SELECT * from <TABLE>;"
    $SqlCmd.Connection = $SqlConnection
    $SqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
    $SqlAdapter.SelectCommand = $SqlCmd
    $DataSet = New-Object System.Data.DataSet
    $SqlAdapter.Fill($DataSet)
    ```

Examine the value of `$DataSet.Tables[0]` to view the results of the query.

## Disable

[!INCLUDE [msi-tut-disable](../../../includes/active-directory-msi-tut-disable.md)]

## Next steps

In this tutorial, you learned how to use a system-assigned managed identity to access Azure SQL Database. To learn more about Azure SQL Database see:

> [!div class="nextstepaction"]
> [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview)
