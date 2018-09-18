---
title: Automate Azure Analysis Services tasks with service principals  | Microsoft Docs
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 07/03/2018
ms.author: owend
ms.reviewer: minewiskan

---

# Automation with service principals

Service principals are an Azure Active Directory application resource you create within your tenant to perform unattended resource and service level operations. They're a unique type of *user identity* with an application ID and password or certificate. A service principal has only those permissions necessary to perform tasks defined by the roles and permissions for which it's assigned. 

In Analysis Services, service principals are used with Azure Automation, PowerShell unattended mode, custom client applications, and web apps to automate common tasks. For example, provisioning servers, deploying models, data refresh, scale up/down, and pause/resume can all be automated by using service principals. Permissions are assigned to service principals through role membership, much like regular Azure AD UPN accounts.

## Create service principals
 
Service principals can be created in the Azure portal or by using PowerShell. To learn more, see:

[Create service principal - Azure portal](../azure-resource-manager/resource-group-create-service-principal-portal.md)   
[Create service principal - PowerShell](../azure-resource-manager/resource-group-authenticate-service-principal.md)

## Store credential and certificate assets in Azure Automation

Service principal credentials and certificates can be stored securely in Azure Automation for runbook operations. To learn more, see:

[Credential assets in Azure Automation](../automation/automation-credentials.md)   
[Certificate assets in Azure Automation](../automation/automation-certificates.md)

## Add service principals to server admin role

Before you can use a service principal for Analysis Services server management operations, you must add it to the server administrators role. To learn more, see [Add a service principal to the server administrator role](analysis-services-addservprinc-admins.md).

## Service principals in connection strings

Service principal appID and password or certificate can be used in connection strings much the same as a UPN.

### PowerShell

When using a service principal for resource management operations with the [AzureRM.AnalysisServices](https://www.powershellgallery.com/packages/AzureRM.AnalysisServices)  module, use `Login-AzureRmAccount` cmdlet. When using a service principal for server operations with the [SQLServer](https://www.powershellgallery.com/packages/SqlServer) module, use `Add-AzureAnalysisServicesAccount` cmdlet. 

In the following example, appID and a password are used to perform a model database refresh operation:

```PowerShell
Param (

        [Parameter(Mandatory=$true)] [String] $AppId,
        [Parameter(Mandatory=$true)] [String] $PlainPWord,
        [Parameter(Mandatory=$true)] [String] $TenantId
       )
$PWord = ConvertTo-SecureString -String $PlainPWord -AsPlainText -Force

$Credential = New-Object -TypeName "System.Management.Automation.PSCredential" -ArgumentList $AppId, $PWord

Add-AzureAnalysisServicesAccount -Credential $Credential -ServicePrincipal -TenantId $TenantId -RolloutEnvironment "westcentralus.asazure.windows.net"

Invoke-ProcessTable -Server "asazure://westcentralus.asazure.windows.net/myserver" -TableName "MyTable" -Database "MyDb" -RefreshType "Full"
```

### AMO and ADOMD 

When connecting with client applications and web apps, [AMO and ADOMD client libraries](analysis-services-data-providers.md) version 15.0.2 and higher installable packages from NuGet support service principals in connection strings using the following syntax: `app:AppID` and password or `cert:thumbprint`. 

In the following example, `appID` and a `password` are used to perform a model database refresh operation:

```C#
string appId = "xxx";
string authKey = "yyy";
string connString = $"Provider=MSOLAP;Data Source=asazure://westus.asazure.windows.net/<servername>;User ID=app:{appId};Password={authKey};";
Server server = new Server();
server.Connect(connString);
Database db = server.Databases.FindByName("adventureworks");
Table tbl = db.Model.Tables.Find("DimDate");
tbl.RequestRefresh(RefreshType.Full);
db.Model.SaveChanges();
```

## Next steps
[Log in with Azure PowerShell](https://docs.microsoft.com/powershell/azure/authenticate-azureps)   
[Add a service principal to the server administrator role](analysis-services-addservprinc-admins.md)   