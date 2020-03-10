---
title: Audit to storage account under VNet and firewall 
description: Configure auditing to write database events on a storage account under virtual network and firewall
services: sql-database
ms.service: sql-database
ms.subservice: security
ms.topic: conceptual
author: DavidTrigano
ms.author: datrigan
ms.reviewer: vanto
ms.date: 03/08/2020
ms.custom: azure-synapse
---
# Write audit to a storage account under VNet and firewall

Auditing for [Azure SQL Database](sql-database-technical-overview.md) and [Azure Synapse Analytics](../sql-data-warehouse/sql-data-warehouse-overview-what-is.md) supports writing database events to an [Azure Storage account](../storage/common/storage-account-overview.md) behind a virtual network and firewall. This article explains how to configure Azure SQL Server and Azure storage account for this option.

## What is virtual network

[Azure Virtual Network (VNet)](../virtual-network/virtual-networks-overview.md) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks. VNet is similar to a traditional network in your own data center, but brings with it additional benefits of Azure infrastructure such as scale, availability, and isolation.

To learn more about the VNet concepts, Best practices and many more, see [What is Azure Virtual Network](../virtual-network/virtual-networks-overview.md).

## Create a virtual network

To learn more about how to create a virtual network, see [Quickstart: Create a virtual network using the Azure portal](../virtual-network/quick-create-portal.md).

> [!IMPORTANT]
> To support writing audit logs under a VNet and firewalls, chose `Allow trusted Microsoft services to access this storage account`. This setting is on the Azure Storage account **Firewalls and Virtual networks** settings menu. For more information, see [Configure Azure Storage firewalls and virtual networks - exceptions](../storage/common/storage-network-security.md#exceptions).
> You must have the `Microsoft.Authorization/roleAssignments/write` permission on the selected storage account. For various built-in roles for Azure resources, see [Azure built-in roles](../role-based-access-control/built-in-roles.md).
> If you have a general-purpose v1 or blob storage account, [Upgrade to a general-purpose v2 storage account](../storage/common/storage-account-upgrade.md).

### Azure Portal

1. Click on **Auditing** under the Security heading in your SQL database/server pane.

2. Select **Storage** and open **Storage details**. Select the Azure storage account where logs will be saved.

  > [!NOTE]
  > If the selected Storage account is under VNet, you will see the following message:
  >
  >`You have selected a storage account that is behind a firewall or in a virtual network. Using this storage: requires an Active Directory admin on the server; enables 'Allow trusted Microsoft services to access this storage account' on the storage account; and creates a server managed identity with 'storage blob data contributor' RBAC.`
  >
  >If you do not see this message, then storage account is not under VNet.

3. Select the retention period. Then click **OK**. Logs older than the retention period are deleted.

4. Select **Save** on your auditing settings blade.

### Other

You can also configure Audit to write database events on a storage account under Virtual Network and Firewall:

1. Register your Azure SQL Server hosting your Azure SQL Data Warehouse instance with Azure Active Directory (AAD):

  - In PowerShell

   ```powershell
   Connect-AzAccount
   Select-AzSubscription -SubscriptionId <subscriptionId>
   Set-AzSqlServer -ResourceGroupName your-database-server-resourceGroup -ServerName your-SQL-servername -AssignIdentity
   ```
   
  - In [REST API](https://docs.microsoft.com/rest/api/sql/servers/createorupdate):

  Sample Request

   ```html
   PUT https://management.azure.com/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/sqlcrudtest-7398/providers/Microsoft.Sql/servers/sqlcrudtest-4645?api-version=2015-05-01-preview
   ```

  Request Body

   ```javascript
   {
  "identity": {
             "type": "SystemAssigned",
             },
  "properties": {
    "fullyQualifiedDomainName": "sqlcrudtest-4645.database.windows.net",
    "administratorLogin": "dummylogin",
    "administratorLoginPassword": "Un53cuRE!",
    "version": "12.0",
    "state": "Ready"
  }
   ```

2. Under your storage account, navigate to **Access Control (IAM)**, and click **Add role assignment**. Assign **Storage Blob Data Contributor** RBAC role to your Azure SQL Server hosting your Azure SQL Data Warehouse which you've registered with Azure Active Directory (AAD) as in step#1.

   > [!NOTE]
   > Only members with Owner privilege can perform this step. For various built-in roles for Azure resources, refer to this [guide](/role-based-access-control/built-in-roles).

3. Configure your [Azure SQL server's blob auditing policy](https://docs.microsoft.com/rest/api/sql/server%20auditing%20settings/createorupdate), without specify *storageAccountAccessKey*:

  Sample Request

   ```html
   PUT https://management.azure.com/subscriptions/00000000-1111-2222-3333-444444444444/resourceGroups/blobauditingtest-4799/providers/Microsoft.Sql/servers/blobauditingtest-6440/auditingSettings/default?api-version=2017-03-01-preview
   ```

  Request Body

   ```javascript
   {
     "properties": {
      "state": "Enabled",
      "storageEndpoint": "https://mystorage.blob.core.windows.net"
     }
   }
   ```

## Next steps

- [Use PowerShell to create a virtual network service endpoint, and then a virtual network rule for Azure SQL Database.](sql-database-vnet-service-endpoint-rule-powershell.md)
- [Virtual Network Rules: Operations](/api/sql/virtualnetworkrules) with REST APIs
- [Use virtual network service endpoints and rules for database servers](sql-database-vnet-service-endpoint-rule-overview.md)
