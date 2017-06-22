---
title: Azure SQL Database connectivity architecture | Microsoft Docs
description: This document explains the Azure SQLDB connectivity architecture from within Azure or from outside of Azure. 
services: sql-database
documentationcenter: ''
author: CarlRabeler
manager: jhubbard
editor: monicar
ms.assetid: 
ms.service: sql-database
ms.custom: DBs & servers
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: data-management
ms.date: 06/05/2017
ms.author: carlrab

---
# Azure SQL Database Connectivity Architecture 

This article explains the Azure SQL Database connectivity architecture and explains how the different components function to direct traffic to your instance of Azure SQL Database. These Azure SQL Database connectivity components function to direct network traffic to the Azure database with clients connecting from within Azure and with clients connecting from outside of Azure. This article also provides script samples to change how connectivity occurs, and the considerations related to changing the default connectivity settings. If there are any questions after reading this article, please contact Dhruv at dmalik@microsoft.com. 

## Connectivity architecture

The following diagram provides a high-level overview of the Azure SQL Database connectivity architecture. 

![architecture overview](./media/sql-database-connectivity-architecture/architecture-overview.png)


The following steps describe how an connection is established to an Azure SQL database through the Azure SQL Database software load-balancer (SLB) and the Azure SQL Database gateway.

- Clients within Azure or outside of Azure connect to the SLB, which has a a public IP address and listens on port 1433.
- The SLB directs traffic to the Azure SQL Database gateway.
- The gateway redirects the traffic to the correct proxy middleware.
- The proxy middleware redirects the traffic to the appropriate Azure SQL database.

> [!IMPORTANT]
> Each of these components have distributed denial of service (DDoS) protection built-in at the network and the app layer.
>

### Connectivity from within Azure

If you are connecting from within Azure, your connections have a connection policy of **Redirect** by default. A policy of **Redirect** means that connections after the TCP session is established to the Azure SQL database, the client session is then redirected to the proxy middleware with a change to the destination virtual IP from that of the Azure SQL Database gateway to that of the proxy middleware. Thereafter, all subsequent packets flow directly via the proxy middleware, bypassing the Azure SQL Database gateway. The following diagram illustrates this traffic flow.

![architecture overview](./media/sql-database-connectivity-architecture/connectivity-from-within-azure.png)


### Connectivity from outside of Azure

If you are connecting from outside Azure, your connections have a connection policy of **Proxy** by default. A policy of **Proxy** means that the TCP session is established via the Azure SQL Database gateway and all subsequent packets flow via the gateway. The following diagram illustrates this traffic flow.

![architecture overview](./media/sql-database-connectivity-architecture/connectivity-from-outside-azure.png)


## Change Azure SQL Database connection policy

To change the Azure SQL Database connection policy for an Azure SQL Database server, use the [REST API](https://msdn.microsoft.com/library/azure/mt604439.aspx). 

- If your connection policy is set to **Proxy**, all network packets flow via the Azure SQL Database gateway. For this setting, you need to allow outbound to only the Azure SQL Database gateway IP. Using a setting of **Proxy** has more latency than a setting of **Redirect**. 
- If you connection policy is setting **Redirect**, all network packets flow directly to the middleware proxy. For this setting, you need to allow outbound to multiple IPs. 

## Script to change connection settings

> [!IMPORTANT]
> This script requires the [Azure PowerShell module](/powershell/azure/install-azurerm-ps).
>

The following PowerShell script shows how to change the connection policy.

```powershell
import-module azureRm
Login-AzureRmAccount

$tenantId =  #your AAD tenant ID
$subscriptionId = #Azure SubscriptionID
$uri = #AAD uri
$authUrl = "https://login.windows.net/$tenantId"
$serverName = #sqldb server name 
$resourceGroupName=#sqldb resource group
$AuthContext = [Microsoft.IdentityModel.Clients.ActiveDirectory.AuthenticationContext]$authUrl

$result = $AuthContext.AcquireToken("https://management.core.windows.net/",
$clientId,
[Uri]$uri, 
[Microsoft.IdentityModel.Clients.ActiveDirectory.PromptBehavior]::Auto)

$authHeader = @{
'Content-Type'='application\json; '
'Authorization'=$result.CreateAuthorizationHeader()
}

#getting the current connection property
Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName/connectionPolicies/Default?api-version=2014-04-01-preview" -Method GET -Headers $authHeader

#setting the property to ‘Proxy’
$connectionType=”Proxy” <#Redirect / Default are other options#>
$body = @{properties=@{connectionType=$connectionType}} | ConvertTo-Json

Invoke-RestMethod -Uri "https://management.azure.com/subscriptions/$subscriptionId/resourceGroups/$resourceGroupName/providers/Microsoft.Sql/servers/$serverName/connectionPolicies/Default?api-version=2014-04-01-preview" -Method PUT -Headers $authHeader -Body $body -ContentType "application/json"
```

## Next steps

- For information on how to change the Azure SQL Database connection policy for an Azure SQL Database server, see [Create or Update Server Connection Policy using the REST API](https://msdn.microsoft.com/library/azure/mt604439.aspx).
- For information about Azure SQL Database connection behavior for clients that use ADO.NET 4.5 or a later version, see [Ports beyond 1433 for ADO.NET 4.5](sql-database-develop-direct-route-ports-adonet-v12.md).
- For general application development overview information, see [SQL Database Application Development Overview](sql-database-develop-overview.md).
