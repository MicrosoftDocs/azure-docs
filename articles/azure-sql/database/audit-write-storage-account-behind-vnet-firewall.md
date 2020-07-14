---
title: Audit to storage account behind VNet and firewall 
description: Configure auditing to write database events on a storage account behind virtual network and firewall
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.topic: conceptual
author: DavidTrigano
ms.author: datrigan
ms.reviewer: vanto
ms.date: 06/09/2020
ms.custom: azure-synapse
---
# Write audit to a storage account behind VNet and firewall
[!INCLUDE[appliesto-sqldb-asa](../includes/appliesto-sqldb-asa.md)]


Auditing for [Azure SQL Database](sql-database-paas-overview.md) and [Azure Synapse Analytics](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md) supports writing database events to an [Azure Storage account](../../storage/common/storage-account-overview.md) behind a virtual network and firewall.

This article explains two ways to configure Azure SQL Database and Azure storage account for this option. The first uses the Azure portal, the second uses REST.

## Background

[Azure Virtual Network (VNet)](../../virtual-network/virtual-networks-overview.md) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks. VNet is similar to a traditional network in your own data center, but brings with it additional benefits of Azure infrastructure such as scale, availability, and isolation.

To learn more about the VNet concepts, Best practices and many more, see [What is Azure Virtual Network](../../virtual-network/virtual-networks-overview.md).

To learn more about how to create a virtual network, see [Quickstart: Create a virtual network using the Azure portal](../../virtual-network/quick-create-portal.md).

## Prerequisites

For audit to write to a storage account behind a VNet or firewall, the following prerequisites are required:

> [!div class="checklist"]
>
> * A general-purpose v2 storage account. If you have a general-purpose v1 or blob storage account, [upgrade to a general-purpose v2 storage account](../../storage/common/storage-account-upgrade.md). For more information, see [Types of storage accounts](../../storage/common/storage-account-overview.md#types-of-storage-accounts).
> * The storage account must be on the same subscription and at the same location as the [logical SQL server](logical-servers.md).
> * The Azure Storage account requires `Allow trusted Microsoft services to access this storage account`. Set this on the Storage Account **Firewalls and Virtual networks**.
> * You must have `Microsoft.Authorization/roleAssignments/write` permission on the selected storage account. For more information, see [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

## Configure in Azure portal

Connect to [Azure portal](https://portal.azure.com) with your subscription. Navigate to the resource group and server.

1. Click on **Auditing** under the Security heading. Select **On**.

2. Select **Storage**. Select the storage account where logs will be saved. The storage account must comply with the requirements listed in [Prerequisites](#prerequisites).

3. Open **Storage details**

  > [!NOTE]
  > If the selected Storage account is behind VNet, you will see the following message:
  >
  >`You have selected a storage account that is behind a firewall or in a virtual network. Using this storage requires to enable 'Allow trusted Microsoft services to access this storage account' on the storage account and creates a server managed identity with 'storage blob data contributor' RBAC.`
  >
  >If you do not see this message, then storage account is not behind a VNet.

4. Select the number of days for the retention period. Then click **OK**. Logs older than the retention period are deleted.

5. Select **Save** on your auditing settings.

You have successfully configured audit to write to a storage account behind a VNet or firewall.

## Configure with REST commands

As an alternative to using the Azure portal, you can use REST commands to configure audit to write database events on a storage account behind a VNet and Firewall.

The sample scripts in this section require you to update the script before you run them. Replace the following values in the scripts:

|Sample value|Sample description|
|:-----|:-----|
|`<subscriptionId>`| Azure subscription ID|
|`<resource group>`| Resource group|
|`<logical SQL server>`| Server name|
|`<administrator login>`| Administrator account |
|`<complex password>`| Complex password for the administrator account|

To configure SQL Audit to write events to a storage account behind a VNet or Firewall:

1. Register your server with Azure Active Directory (Azure AD). Use either PowerShell or REST API.

   **PowerShell**

   ```powershell
   Connect-AzAccount
   Select-AzSubscription -SubscriptionId <subscriptionId>
   Set-AzSqlServer -ResourceGroupName <your resource group> -ServerName <azure server name> -AssignIdentity
   ```

   [**REST API**](https://docs.microsoft.com/rest/api/sql/servers/createorupdate):

   Sample request

   ```html
   PUT https://management.azure.com/subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.Sql/servers/<azure server name>?api-version=2015-05-01-preview
   ```

   Request body

   ```json
   {
   "identity": {
              "type": "SystemAssigned",
              },
   "properties": {
     "fullyQualifiedDomainName": "<azure server name>.database.windows.net",
     "administratorLogin": "<administrator login>",
     "administratorLoginPassword": "<complex password>",
     "version": "12.0",
     "state": "Ready"
   }
   ```

2. Open [Azure portal](https://portal.azure.com). Navigate to your storage account. Locate **Access Control (IAM)**, and click **Add role assignment**. Assign **Storage Blob Data Contributor** RBAC role to the server hosting the database that you registered with Azure Active Directory (Azure AD) as in the previous step.

   > [!NOTE]
   > Only members with Owner privilege can perform this step. For various built-in roles for Azure resources, refer to [Azure built-in roles](../../role-based-access-control/built-in-roles.md).

3. Configure the [server's blob auditing policy](/rest/api/sql/server%20auditing%20settings/createorupdate), without specifying a *storageAccountAccessKey*:

   Sample request

   ```html
     PUT https://management.azure.com/subscriptions/<subscription ID>/resourceGroups/<resource group>/providers/Microsoft.Sql/servers/<azure server name>/auditingSettings/default?api-version=2017-03-01-preview
   ```

   Request body

   ```json
   {
     "properties": {
      "state": "Enabled",
      "storageEndpoint": "https://<storage account>.blob.core.windows.net"
     }
   }
   ```

## Using Azure PowerShell

- [Create or Update Database Auditing Policy (Set-AzSqlDatabaseAudit)](/powershell/module/az.sql/set-azsqldatabaseaudit)
- [Create or Update Server Auditing Policy (Set-AzSqlServerAudit)](/powershell/module/az.sql/set-azsqlserveraudit)

## Next steps

* [Use PowerShell to create a virtual network service endpoint, and then a virtual network rule for Azure SQL Database.](scripts/vnet-service-endpoint-rule-powershell-create.md)
* [Virtual Network Rules: Operations with REST APIs](/rest/api/sql/virtualnetworkrules)
* [Use virtual network service endpoints and rules for servers](vnet-service-endpoint-rule-overview.md)
