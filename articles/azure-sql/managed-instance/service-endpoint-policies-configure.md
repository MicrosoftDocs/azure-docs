---
title: Configure service endpoint policies for Azure storage for Azure SQL Managed Instance
description: Learn how to protect Azure SQL Managed Instance against exfiltration to invalid Azure Storage accounts.
services: sql-database
ms.service: sql-managed-instance
ms.subservice: 
ms.custom:
ms.devlang: 
ms.topic: how-to
author: zoran-rilak-msft
ms.author: zoranrilak
ms.reviewer: 
ms.date: 09/24/2021
---

# Configure service endpoint policies for Azure storage for Azure SQL Managed Instance

[!INCLUDE[appliesto-sqlmi](../includes/appliesto-sqlmi.md)]

Virtual Network (VNet) [service endpoint policies](../../virtual-network/virtual-network-service-endpoint-policies-overview.md) for Azure Storage allow you to filter egress virtual network traffic to Azure Storage, only allowing data transfers to certain storage accounts.

## Key benefits

Virtual network service endpoint policies for Azure storage for Azure SQL Managed Instance provide the following benefits:

- __Improved security for your Azure SQL Managed Instance traffic to Azure Storage__: Endpoint policies establish a security control that prevents erroneous or malicious exfiltration of business-critical data. Traffic can be limited to only those storage accounts that are compliant with your data governance requirements.

- __Granular control over which storage accounts can be accessed__: Service endpoint policies can permit traffic to storage accounts at a subscription, resource group, and individual storage account level. Administrators can use service endpoint policies to enforce adherence to the organization's data security architecture in Azure.

- __System traffic remains unaffected__: Service endpoint policies will never obstruct access to storage that is required for the functioning of Azure SQL Managed Instance. This storage includes backups, data files and transaction log files, and similar.

> [!IMPORTANT]
> Service endpoint policies only control the traffic that originates from the SQL Managed Instance subnet and terminates in Azure storage. They will not affect, for example, exporting the database to an on-prem BACPAC file, Azure Data Factory integrations, the collection of diagnostic information via Azure Diagnostic Settings, or other mechanisms of data extraction that do not directly target Azure storage.

## Limitations

- The feature is available only to virtual networks deployed through the Azure Resource Manager deployment model.
- The feature is available only in subnets that have [service endpoints](https://docs.microsoft.com/en-us/azure/virtual-network/virtual-network-service-endpoints-overview) for Azure Storage enabled.
- Enabling service endpoints for Azure Storage also extends to include paired regions where you deploy the virtual network to support Read-Access Geo-Redundant storage (RA-GRS) and Geo-Redundant storage (GRS) traffic.
- Assigning a service endpoint policy to a service endpoint will upgrade the endpoint from regional to global scope. In other words, all traffic to Azure Storage will go through the service endpoint regardless of the region in which the storage account resides.

## Prepare your Azure storage account inventory

Before you begin configuring service endpoint policies on a subnet, compose a list of storage accounts that should be accessible by the managed instances in that subnet. A list of some workflows that may contact Azure Storage is given below.

- [Auditing](auditing-configure.md) to Azure storage.
- Performing a [copy-only backup](/sql/relational-databases/backup-restore/copy-only-backups-sql-server) to Azure storage.
- [Restoring](restore-sample-database-quickstart.md) a database from Azure storage.
- Importing data with [BULK INSERT or OPENROWSET(BULK ...)](/sql/relational-databases/import-export/import-bulk-data-by-using-bulk-insert-or-openrowset-bulk-sql-server).
- Logging [extended events](../database/xevent-db-diff-from-svr.md) to an Event File target on Azure storage.
- [Azure DMS offline migration](../../dms/tutorial-sql-server-to-managed-instance.md) to Azure SQL Managed Instance.
- [Log Replay Service migration](log-replay-service-migrate.md) to Azure SQL Managed Instance.
- Synchronizing tables using [transactional replication](replication-transactional-overview.md).

For each Azure Storage account that participates in such a workflow, note its account name, resource group, and subscription.

## Configure service endpoint policies for Azure storage for Azure SQL Managed Instance using the Azure portal

We'll follow a simplified process that creates and configures a single service endpoint policy for Azure SQL Managed Instance. You can adapt this process to suit your needs or to create multiple service endpoint policies.

> [!NOTE]
> If you are familiar with service endpoint policies, note that Azure SQL Managed Instance subnets require the policies to contain the /Services/Azure/ManagedInstance service alias. This is described in step 4 below.
> Conversely, if you deploy a managed instance into a subnet that already contains service endpoint policies for Azure Storage, they will be automatically upgraded to include this alias.

### Create a service endpoint policy

1. Select **+ Create a resource** on the upper-left corner of the Azure portal.
2. In search pane, type _service endpoint policy_, select **Service endpoint policy**, and then select **Create**.

![Create service endpoint policy](../../virtual-network/media/virtual-network-service-endpoint-policies-portal/create-sep-resource.png)

3. Enter, or select, the following information in **Basics**:

   - Subscription: Select your subscription for policy.
   - Resource group: Select the resource group where your Azure SQL Managed Instance is located, or select **Create new** and fill in the name for a new resource group.
   - Name: **mySEP**
   - Location: Select the region of the virtual network hosting the Azure SQL Managed Instance.

![Create service endpoint policy basics](../../virtual-network/media/virtual-network-service-endpoint-policies-portal/create-sep-basics.png)

4. In **Policy definitions**, select **Add an alias** and enter the following information in **Add an alias** pane:
   - Service Alias: Select /Services/Azure/ManagedInstance.
   - Select **Add** button at the bottom to finish adding the service alias.

![Add an alias to a service endpoint policy](./media/service-endpoint-policies-configure/add-an-alias.png)

5. In Policy definitions, select **+ Add** under **Resources** and enter or select the following information in **Add a resource** pane:
   - Service: Select **Microsoft.Storage**.
   - Scope: Select **All accounts in subscription**.
   - Subscription: Select a subscription containing the storage account(s) to permit. Refer to your [inventory of Azure storage accounts](#prepare-your-azure-storage-account-inventory) created earlier.
   - Select on **Add** button at the bottom to finish adding the resource.
   - Add more subscriptions by repeating the above steps as needed.

![Add a resource to a service endpoint policy](./media/service-endpoint-policies-configure/add-a-resource.png)

> [!TIP]
> We recommend that you first configure policies to allow access to storage accounts on a subscription level, as shown above. Once you validate the configuration by ensuring that all workflows operate normally, you can reconfigure policies to allow individual storage accounts and/or accounts in a resource group. To do so, select **Single account** or **All accounts in resource group** in the _Scope:_ field instead and fill in the other fields accordingly.

6. Optional: you may configure tags on the service endpoint policy under **Tags**.
7.	Select **Review + Create**. Validate the information and select **Create**. To make further edits, select **Previous**.

### Associate a service endpoint policy with an Azure SQL Managed Instance subnet

1. In the _All services_ box in the portal, begin typing _virtual networks_. Select **Virtual networks**.
2. Locate and select on the virtual network hosting an Azure SQL Managed Instance.
3. Select **Subnets** and select the subnet delegated to an Azure SQL Managed Instance. Enter the following information in the subnet pane:
    - Services: if this field is empty, you need to configure the service endpoint for Azure Storage on this subnet. Select **Microsoft.Storage**.
    - Service endpoint policies: select any service endpoint policies you want to apply to the Azure SQL Managed Instance subnet.

![Associate a service endpoint policy with a subnet](./media/service-endpoint-policies-configure/associate-service-endpoint-policy.png)

4. Select **Save** to finish configuring the virtual network.

> [!WARNING]
> If no policies on a managed instance's subnet have the /Services/Azure/ManagedInstance alias set, then this step will fail. That error message will look like this:
>
>     Failed to save subnet 'subnet'. Error: 'Found conflicts with NetworkIntentPolicy. Details: Subnet of Virtual Network cannot have resources or properties which conflict with network intent policy.
>     Service endpoint policies on subnet are missing definitions [...] as provided in the Network Intent Policy: ...
>
> To avoid this, we recommend that you set this alias in all policies on such subnets. This will also make policy management easier.