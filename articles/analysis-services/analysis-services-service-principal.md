---
title: Automate Azure Analysis Services tasks with service principals | Microsoft Docs
description: Learn how to create a service principal for automating Azure Analysis Services administrative tasks.
author: minewiskan
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 05/26/2020
ms.author: owend
ms.reviewer: minewiskan

---

# Automation with service principals

Service principals are an Azure Active Directory application resource you create within your tenant to perform unattended resource and service level operations. They're a unique type of *user identity* with an application ID and password or certificate. A service principal has only those permissions necessary to perform tasks defined by the roles and permissions for which it's assigned. 

In Analysis Services, service principals are used with Azure Automation, PowerShell unattended mode, custom client applications, and web apps to automate common tasks. For example, provisioning servers, deploying models, data refresh, scale up/down, and pause/resume can all be automated by using service principals. Permissions are assigned to service principals through role membership, much like regular Azure AD UPN accounts.

Analysis Services also supports operations performed by managed identities using service principals. To learn more, see [Managed identities for Azure resources](../active-directory/managed-identities-azure-resources/overview.md) and [Azure services that support Azure AD authentication](../active-directory/managed-identities-azure-resources/services-support-managed-identities.md#azure-analysis-services).    

## Create service principals
 
Service principals can be created in the Azure portal or by using PowerShell. To learn more, see:

[Create service principal - Azure portal](../active-directory/develop/howto-create-service-principal-portal.md)   
[Create service principal - PowerShell](../active-directory/develop/howto-authenticate-service-principal-powershell.md)

## Store credential and certificate assets in Azure Automation

Service principal credentials and certificates can be stored securely in Azure Automation for runbook operations. To learn more, see:

[Credential assets in Azure Automation](../automation/automation-credentials.md)   
[Certificate assets in Azure Automation](../automation/automation-certificates.md)

## Add service principals to server admin role

Before you can use a service principal for Analysis Services server management operations, you must add it to the server administrators role. To learn more, see [Add a service principal to the server administrator role](analysis-services-addservprinc-admins.md).

## Service principals in connection strings

Service principal appID and password or certificate can be used in connection strings much the same as a UPN.

### PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

#### <a name="azmodule"></a>Using Az.AnalysisServices module

When using a service principal for resource management operations with the [Az.AnalysisServices](/powershell/module/az.analysisservices)  module, use `Connect-AzAccount` cmdlet. 

In the following example, appID and a password are used to perform control plane operations for synchronization to read-only replicas and scale up/out:

```powershell
Param (
        [Parameter(Mandatory=$true)] [String] $AppId,
        [Parameter(Mandatory=$true)] [String] $PlainPWord,
        [Parameter(Mandatory=$true)] [String] $TenantId
       )
$PWord = ConvertTo-SecureString -String $PlainPWord -AsPlainText -Force
$Credential = New-Object -TypeName "System.Management.Automation.PSCredential" -ArgumentList $AppId, $PWord

# Connect using Az module
Connect-AzAccount -Credential $Credential -SubscriptionId "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxxx"

# Syncronize a database for query scale out
Sync-AzAnalysisServicesInstance -Instance "asazure://westus.asazure.windows.net/testsvr" -Database "testdb"

# Scale up the server to an S1, set 2 read-only replicas, and remove the primary from the query pool. The new replicas will hydrate from the synchronized data.
Set-AzAnalysisServicesServer -Name "testsvr" -ResourceGroupName "testRG" -Sku "S1" -ReadonlyReplicaCount 2 -DefaultConnectionMode Readonly
```

#### Using SQLServer module

In the following example, appID and a password are used to perform a model database refresh operation:

```powershell
Param (
        [Parameter(Mandatory=$true)] [String] $AppId,
        [Parameter(Mandatory=$true)] [String] $PlainPWord,
        [Parameter(Mandatory=$true)] [String] $TenantId
       )
$PWord = ConvertTo-SecureString -String $PlainPWord -AsPlainText -Force

$Credential = New-Object -TypeName "System.Management.Automation.PSCredential" -ArgumentList $AppId, $PWord

Invoke-ProcessTable -Server "asazure://westcentralus.asazure.windows.net/myserver" -TableName "MyTable" -Database "MyDb" -RefreshType "Full" -ServicePrincipal -ApplicationId $AppId -TenantId $TenantId -Credential $Credential
```

### AMO and ADOMD 

When connecting with client applications and web apps, [AMO and ADOMD client libraries](https://docs.microsoft.com/analysis-services/client-libraries?view=azure-analysis-services-current) version 15.0.2 and higher installable packages from NuGet support service principals in connection strings using the following syntax: `app:AppID` and password or `cert:thumbprint`. 

In the following example, `appID` and a `password` are used to perform a model database refresh operation:

```csharp
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
[Sign in with Azure PowerShell](https://docs.microsoft.com/powershell/azure/authenticate-azureps)   
[Refresh with Logic Apps](analysis-services-refresh-logic-app.md)  
[Refresh with Azure Automation](analysis-services-refresh-azure-automation.md)  
[Add a service principal to the server administrator role](analysis-services-addservprinc-admins.md)  
[Automate Power BI Premium workspace and dataset tasks with service principals](https://docs.microsoft.com/power-bi/admin/service-premium-service-principal) 
