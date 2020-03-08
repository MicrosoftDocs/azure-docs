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

## <a id="what-is-virtual-network"></a>What is virtual network

Azure Virtual Network (VNet) is the fundamental building block for your private network in Azure. VNet enables many types of Azure resources, such as Azure Virtual Machines (VM), to securely communicate with each other, the internet, and on-premises networks. VNet is similar to a traditional network that you'd operate in your own data center, but brings with it additional benefits of Azure's infrastructure such as scale, availability, and isolation.

To learn more about the VNet concepts, Best practices and many more, see [What is Azure Virtual Network](https://docs.microsoft.com/azure/virtual-network/virtual-networks-overview).

## <a id="create-virtual-network"></a>How to create a virtual network

To learn more about how to create a virtual network, see [Quickstart: Create a virtual network using the Azure portal](https://docs.microsoft.com/azure/virtual-network/quick-create-portal).

> [!IMPORTANT]
> You must have **Allow trusted Microsoft services to access this storage account** turned on under Azure Storage account **Firewalls and Virtual networks** settings menu. Refer to this [guide](https://docs.microsoft.com/azure/storage/common/storage-network-security#exceptions) for more information.
> You must have the 'Microsoft.Authorization/roleAssignments/write' permission on the selected storage account. For various built-in roles for Azure resources, refer to this [guide](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).
> If you have a general-purpose v1 or blob storage account, you must first upgrade to general-purpose v2 using this [guide](https://docs.microsoft.com/azure/storage/common/storage-account-upgrade).

#### Via PowerShell

1. In PowerShell, **register your Azure SQL Server** hosting your Azure SQL Data Warehouse instance with Azure Active Directory (AAD):

   ```powershell
   Connect-AzAccount
   Select-AzSubscription -SubscriptionId <subscriptionId>
   Set-AzSqlServer -ResourceGroupName your-database-server-resourceGroup -ServerName your-SQL-servername -AssignIdentity
   ```

1. Under your storage account, navigate to **Access Control (IAM)**, and click **Add role assignment**. Assign **Storage Blob Data Contributor** RBAC role to your Azure SQL Server hosting your Azure SQL Data Warehouse which you've registered with Azure Active Directory (AAD) as in step#1.

   > [!NOTE]
   > Only members with Owner privilege can perform this step. For various built-in roles for Azure resources, refer to this [guide](https://docs.microsoft.com/azure/role-based-access-control/built-in-roles).


