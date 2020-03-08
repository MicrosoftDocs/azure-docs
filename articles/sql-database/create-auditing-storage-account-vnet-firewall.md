---
title: Configure Auditing to a storage account under VNet and Firewall 
description: Configure Auditing to write database events on a storage account under Virtual Network and Firewall
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
# Configure Auditing to a storage account under VNet and Firewall

Auditing for [Azure SQL Database](https://docs.microsoft.com/azure/sql-database/sql-database-technical-overview) and [Azure Synapse Analytics](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-overview-what-is) now support writing database events to an [Azure Storage account](https://docs.microsoft.com/azure/storage/common/storage-account-overview) behind a virtual network and firewall. This article explains how to configure Azure SQL Server and Azure storage account to support this option.

## What is virtual network

Azure Virtual Network (VNet) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks. VNet is similar to a traditional network that you'd operate in your own data center, but brings with it additional benefits of Azure's infrastructure such as scale, availability, and isolation.

To learn more about the VNet concepts, Best practices and many more, see [What is Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview).

## How to create a virtual network

To learn more about how to create a virtual network, see [Quickstart: Create a virtual network using the Azure portal](https://docs.microsoft.com/azure/virtual-network/quick-create-portal).

> [!IMPORTANT]
> You must have **Allow trusted Microsoft services to access this storage account** turned on under Azure Storage account **Firewalls and Virtual networks** settings menu. Refer to this [guide](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions) for more information.
> You must have the 'Microsoft.Authorization/roleAssignments/write' permission on the selected storage account. For various built-in roles for Azure resources, refer to this [guide](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).
> If you have a general-purpose v1 or blob storage account, you must first upgrade to general-purpose v2 using this [guide](https://docs.microsoft.com/azure/storage/common/storage-account-upgrade).

#### Azure Portal

1. Click on **Auditing** under the Security heading in your SQL database/server pane.

1. Select **Storage** and open **Storage details**. Select the Azure storage account where logs will be saved.

> [!NOTE]
> If the selected Storage account is under VNet, you will see the following message: *You have selected a storage account that is behind a firewall or in a virtual network. Using this storage: requires an Active Directory admin on the server; enables 'Allow trusted Microsoft services to access this storage account' on the storage account; and creates a server managed identity with 'storage blob data contributor' RBAC.*. If you do not see this message, then your Storage account is not under VNet.

1. Select the retention period. Then click **OK**. Logs older than the retention period are deleted.

1. Select **Save** on your auditing seetings blade.

#### Others

You can also configure your Auditing to write database events on a storage account under Virtual Network and Firewall via Rest API:

1. In PowerShell, **register your Azure SQL Server** hosting your Azure SQL Data Warehouse instance with Azure Active Directory (AAD):

   ```powershell
   Connect-AzAccount
   Select-AzSubscription -SubscriptionId <subscriptionId>
   Set-AzSqlServer -ResourceGroupName your-database-server-resourceGroup -ServerName your-SQL-servername -AssignIdentity
   ```

1. Under your storage account, navigate to **Access Control (IAM)**, and click **Add role assignment**. Assign **Storage Blob Data Contributor** RBAC role to your Azure SQL Server hosting your Azure SQL Data Warehouse which you've registered with Azure Active Directory (AAD) as in step#1.

   > [!NOTE]
   > Only members with Owner privilege can perform this step. For various built-in roles for Azure resources, refer to this [guide](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).

1. 

## Next steps

- [Use PowerShell to create a virtual network service endpoint, and then a virtual network rule for Azure SQL Database.][sql-db-vnet-service-endpoint-rule-powershell-md-52d]
- [Virtual Network Rules: Operations][rest-api-virtual-network-rules-operations-862r] with REST APIs
- [Use virtual network service endpoints and rules for database servers](https://docs.microsoft.com/en-us/azure/sql-database/sql-database-vnet-service-endpoint-rule-overview)
