---
title: Use a Windows VM  to access Azure SQL
description: A tutorial that walks you through the process of using a Windows VM Managed Service Identity to access Azure SQL. 
services: active-directory
documentationcenter: ''
author: daveba
manager: mtillman
editor: bryanla

ms.service: active-directory
ms.component: msi
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/20/2017
ms.author: daveba
---


# Tutorial: Use a Windows VM Managed Service Identity to access Azure SQL

[!INCLUDE[preview-notice](../../../includes/active-directory-msi-preview-notice.md)]

This tutorial shows you how to use a Managed Service Identity for a Windows virtual machine (VM) to access an Azure SQL server. Managed Service Identities are automatically managed by Azure and enable you to authenticate to services that support Azure AD authentication, without needing to insert credentials into your code. You learn how to:

> [!div class="checklist"]
> * Enable Managed Service Identity on a Windows VM 
> * Grant your VM access to an Azure SQL server
> * Get an access token using the VM identity and use it to query an Azure SQL server

## Prerequisites

[!INCLUDE [msi-qs-configure-prereqs](../../../includes/active-directory-msi-qs-configure-prereqs.md)]

[!INCLUDE [msi-tut-prereqs](../../../includes/active-directory-msi-tut-prereqs.md)]

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com).

## Create a Windows virtual machine in a new resource group

For this tutorial, we create a new Windows VM.  You can also enable Managed Service Identity on an existing VM.

1.	Click the **Create a resource** button found on the upper left-hand corner of the Azure portal.
2.	Select **Compute**, and then select **Windows Server 2016 Datacenter**. 
3.	Enter the virtual machine information. The **Username** and **Password** created here is the credentials you use to login to the virtual machine.
4.  Choose the proper **Subscription** for the virtual machine in the dropdown.
5.	To select a new **Resource Group** in which to create your virtual machine, choose **Create New**. When complete, click **OK**.
6.	Select the size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. On the Settings page, keep the defaults, and click **OK**.

    ![Alt image text](media/msi-tutorial-windows-vm-access-arm/msi-windows-vm.png)

## Enable Managed Service Identity on your VM 

A VM Managed Service Identity enables you to get access tokens from Azure AD without you needing to put credentials into your code. Enabling Managed Service Identity tells Azure to create a managed identity for your VM. Under the covers, enabling Managed Service Identity does two things: registers your VM with Azure Active Directory to create its managed identity, and it configures the identity on the VM.

1.	Select the **Virtual Machine** that you want to enable Managed Service Identity on.  
2.	On the left navigation bar click **Configuration**. 
3.	You see **Managed Service Identity**. To register and enable the Managed Service Identity, select **Yes**, if you wish to disable it, choose No. 
4.	Ensure you click **Save** to save the configuration.  
    ![Alt image text](media/msi-tutorial-linux-vm-access-arm/msi-linux-extension.png)

## Grant your VM access to a database in an Azure SQL server

Now you can grant your VM access to a database in an Azure SQL server.  For this step, you can use an existing SQL server or create a new one.  To create a new server and database using the Azure portal, follow this [Azure SQL quickstart](https://docs.microsoft.com/azure/sql-database/sql-database-get-started-portal). There are also quickstarts that use the Azure CLI and Azure PowerShell in the [Azure SQL documentation](https://docs.microsoft.com/azure/sql-database/).

There are three steps to granting your VM access to a database:
1.  Create a group in Azure AD and make the VM Managed Service Identity a member of the group.
2.  Enable Azure AD authentication for the SQL server.
3.  Create a **contained user** in the database that represents the Azure AD group.

> [!NOTE]
> Normally you would create a contained user that maps directly to the VM's Managed Service Identity.  Currently, Azure SQL does not allow the Azure AD Service Principal that represents the VM Managed Service Identity to be mapped to a contained user.  As a supported workaround, you make the VM Managed Service Identity a member of an Azure AD group, then create a contained user in the database that represents the group.


### Create a group in Azure AD and make the VM Managed Service Identity a member of the group

You can use an existing Azure AD group, or create a new one using Azure AD PowerShell.  

First, install the [Azure AD PowerShell](https://docs.microsoft.com/powershell/azure/active-directory/install-adv2) module. Then sign in using `Connect-AzureAD`, and run the following command to create the group, and save it in a variable:

```powershell
$Group = New-AzureADGroup -DisplayName "VM Managed Service Identity access to SQL" -MailEnabled $false -SecurityEnabled $true -MailNickName "NotSet"
```

The output looks like the following, which also examines the value of the variable:

```powershell
$Group = New-AzureADGroup -DisplayName "VM Managed Service Identity access to SQL" -MailEnabled $false -SecurityEnabled $true -MailNickName "NotSet"
$Group
ObjectId                             DisplayName          Description
--------                             -----------          -----------
6de75f3c-8b2f-4bf4-b9f8-78cc60a18050 VM Managed Service Identity access to SQL
```

Next, add the VM's Managed Service Identity to the group.  You need the Managed Service Identity's **ObjectId**, which you can get using Azure PowerShell.  First, download [Azure PowerShell](https://docs.microsoft.com/powershell/azure/install-azurerm-ps). Then sign in using `Connect-AzureRmAccount`, and run the following commands to:
- Ensure your session context is set to the desired Azure subscription, if you have multiple ones.
- List the available resources in your Azure subscription, in verify the correct resource group and VM names.
- Get the Managed Service Identity VM's properties, using the appropriate values for `<RESOURCE-GROUP>` and `<VM-NAME>`.

```powershell
Set-AzureRMContext -subscription "bdc79274-6bb9-48a8-bfd8-00c140fxxxx"
Get-AzureRmResource
$VM = Get-AzureRmVm -ResourceGroup <RESOURCE-GROUP> -Name <VM-NAME>
```

The output looks like the following, which also examines the service principal Object ID of the VM's Managed Service Identity:
```powershell
$VM = Get-AzureRmVm -ResourceGroup DevTestGroup -Name DevTestWinVM
$VM.Identity.PrincipalId
b83305de-f496-49ca-9427-e77512f6cc64
```

Now add the VM Managed Service Identity to the group.  You can only add a service principal to a group using Azure AD PowerShell.  Run this command:
```powershell
Add-AzureAdGroupMember -ObjectId $Group.ObjectId -RefObjectId $VM.Identity.PrincipalId
```

If you also examine the group membership afterward, the output looks as follows:

```powershell
Add-AzureAdGroupMember -ObjectId $Group.ObjectId -RefObjectId $VM.Identity.PrincipalId
Get-AzureAdGroupMember -ObjectId $Group.ObjectId

ObjectId                             AppId                                DisplayName
--------                             -----                                -----------
b83305de-f496-49ca-9427-e77512f6cc64 0b67a6d6-6090-4ab4-b423-d6edda8e5d9f DevTestWinVM
```

### Enable Azure AD authentication for the SQL server

Now that you have created the group and added the VM Managed Service Identity to the membership, you can [configure Azure AD authentication for the SQL server](/azure/sql-database/sql-database-aad-authentication-configure#provision-an-azure-active-directory-administrator-for-your-azure-sql-server) using the following steps:

1.	In the Azure portal, select **SQL servers** from the left-hand navigation.
2.	Click the SQL server to be enabled for Azure AD authentication.
3.	In the **Settings** section of the blade, click **Active Directory admin**.
4.	In the command bar, click **Set admin**.
5.	Select an Azure AD user account to be made an administrator of the server, and click **Select.**
6.	In the command bar, click **Save.**

### Create a contained user in the database that represents the Azure AD group

For this next step, you will need [Microsoft SQL Server Management Studio](https://docs.microsoft.com/sql/ssms/download-sql-server-management-studio-ssms) (SSMS). Before beginning, it may also be helpful to review the following articles for background on Azure AD integration:

- [Universal Authentication with SQL Database and SQL Data Warehouse (SSMS support for MFA)](/azure/sql-database/sql-database-ssms-mfa-authentication.md)
- [Configure and manage Azure Active Directory authentication with SQL Database or SQL Data Warehouse](/azure/sql-database/sql-database-aad-authentication-configure.md)

1.  Start SQL Server Management Studio.
2.  In the **Connect to Server** dialog, Enter your SQL server name in the **Server name** field.
3.  In the **Authentication** field, select **Active Directory - Universal with MFA support**.
4.  In the **User name** field, enter the name of the Azure AD account that you set as the server administrator, for example, helen@woodgroveonline.com
5.  Click **Options**.
6.  In the **Connect to database** field, enter the name of the non-system database you want to configure.
7.  Click **Connect**.  Complete the sign-in process.
8.  In the **Object Explorer**, expand the **Databases** folder.
9.  Right-click on a user database and click **New query**.
10.  In the query window, enter the following line, and click **Execute** in the toolbar:
    
     ```
     CREATE USER [VM Managed Service Identity access to SQL] FROM EXTERNAL PROVIDER
     ```
    
     The command should complete successfully, creating the contained user for the group.
11.  Clear the query window, enter the following line, and click **Execute** in the toolbar:
     
     ```
     ALTER ROLE db_datareader ADD MEMBER [VM Managed Service Identity access to SQL]
     ```

     The command should complete successfully, granting the contained user the ability to read the entire database.

Code running in the VM can now get a token from Managed Service Identity and use the token to authenticate to the SQL server.

## Get an access token using the VM identity and use it to call Azure SQL 

Azure SQL natively supports Azure AD authentication, so it can directly accept access tokens obtained using Managed Service Identity.  You use the **access token** method of creating a connection to SQL.  This is part of Azure SQL's integration with Azure AD, and is different from supplying credentials on the connection string.

Here's a .Net code example of opening a connection to SQL using an access token.  This code must run on the VM to be able to access the VM Managed Service Identity endpoint.  **.Net Framework 4.6** or higher is required to use the access token method.  Replace the values of AZURE-SQL-SERVERNAME and DATABASE accordingly.  Note the resource ID for Azure SQL is "https://database.windows.net/".

```csharp
using System.Net;
using System.IO;
using System.Data.SqlClient;
using System.Web.Script.Serialization;

//
// Get an access token for SQL.
//
HttpWebRequest request = (HttpWebRequest)WebRequest.Create("http://169.254.169.254/metadata/identity/oauth2/token?api-version=2018-02-01&resource=https://database.windows.net/");
request.Headers["Metadata"] = "true";
request.Method = "GET";
string accessToken = null;

try
{
    // Call Managed Service Identity endpoint.
    HttpWebResponse response = (HttpWebResponse)request.GetResponse();

    // Pipe response Stream to a StreamReader and extract access token.
    StreamReader streamResponse = new StreamReader(response.GetResponseStream()); 
    string stringResponse = streamResponse.ReadToEnd();
    JavaScriptSerializer j = new JavaScriptSerializer();
    Dictionary<string, string> list = (Dictionary<string, string>) j.Deserialize(stringResponse, typeof(Dictionary<string, string>));
    accessToken = list["access_token"];
}
catch (Exception e)
{
    string errorText = String.Format("{0} \n\n{1}", e.Message, e.InnerException != null ? e.InnerException.Message : "Acquire token failed");
}

//
// Open a connection to the SQL server using the access token.
//
if (accessToken != null) {
    string connectionString = "Data Source=<AZURE-SQL-SERVERNAME>; Initial Catalog=<DATABASE>;";
    SqlConnection conn = new SqlConnection(connectionString);
    conn.AccessToken = accessToken;
    conn.Open();
}
```

Alternatively, a quick way to test the end to end setup without having to write and deploy an app on the VM is using PowerShell.

1.	In the portal, navigate to **Virtual Machines** and go to your Windows virtual machine and in the **Overview**, click **Connect**. 
2.	Enter in your **Username** and **Password** for which you added when you created the Windows VM. 
3.	Now that you have created a **Remote Desktop Connection** with the virtual machine, open **PowerShell** in the remote session. 
4.	Using PowerShell’s `Invoke-WebRequest`, make a request to the local Managed Service Identity endpoint to get an access token for Azure SQL.

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

5.  Open a connection to the SQL server. Remember to replace the values for AZURE-SQL-SERVERNAME and DATABASE.
    
    ```powershell
    $SqlConnection = New-Object System.Data.SqlClient.SqlConnection
    $SqlConnection.ConnectionString = "Data Source = <AZURE-SQL-SERVERNAME>; Initial Catalog = <DATABASE>"
    $SqlConnection.AccessToken = $AccessToken
    $SqlConnection.Open()
    ```

    Next, create and send a query to the server.  Remember to replace the value for TABLE.

    ```powershell
    $SqlCmd = New-Object System.Data.SqlClient.SqlCommand
    $SqlCmd.CommandText = "SELECT * from <TABLE>;"
    $SqlCmd.Connection = $SqlConnection
    $SqlAdapter = New-Object System.Data.SqlClient.SqlDataAdapter
    $SqlAdapter.SelectCommand = $SqlCmd
    $DataSet = New-Object System.Data.DataSet
    $SqlAdapter.Fill($DataSet)
    ```

Examine the value of `$DataSet.Tables[0]` to view the results of the query.  Congratulations, you've queried the database using a VM Managed Service Identity and without needing to supply credentials!

## Next steps

In this tutorial, you learned how to create a Managed Service Identity to access Azure SQL server.  To learn more about Azure SQL Server see:

> [!div class="nextstepaction"]
>[Azure SQL Database service](/azure/sql-database/sql-database-technical-overview)
