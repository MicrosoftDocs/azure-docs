---
title: Configure an availability group (Azure portal)
description: "Use the Azure portal to create the Windows failover cluster, the availability group listener, and the internal load balancer on a SQL Server VM in Azure."
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
tags: azure-resource-manager
ms.service: virtual-machines-sql

ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 08/20/2020
ms.author: mathoma
ms.reviewer: jroth
ms.custom: "seo-lt-2019"

---
# Configure an availability group for SQL Server on Azure VM (Azure portal - Preview)
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article describes how to use the [Azure portal](https://portal.azure.com) to configure an availability group for SQL Server on Azure VMs. 

Use the Azure portal to create a new cluster or onboard an existing cluster, and then create the availability group, listener, and internal load balancer. 

   > [!NOTE]
   > This feature is currently in preview and being deployed so if your desired region is unavailable, check back soon. 

While this article uses the Azure portal to configure the availability group environment, it is also possible to do so using [PowerShell or the Azure CLI](availability-group-az-commandline-configure.md), [Azure Quickstart templates](availability-group-quickstart-template-configure.md), or [Manually](availability-group-manually-configure-tutorial.md) as well. 


## Prerequisites

To configure an Always On availability group using the Azure portal, you must have the following prerequisites: 

- An [Azure subscription](https://azure.microsoft.com/free/).
- A resource group with a domain controller. 
- One or more domain-joined [VMs in Azure running SQL Server 2016 (or later) Enterprise edition](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) in the *same* availability set or *different* availability zones that have been [registered with the SQL VM resource provider in full manageability mode](sql-vm-resource-provider-register.md) and are using the same domain account for the SQL Server service on each VM.
- Two available (not used by any entity) IP addresses. One is for the internal load balancer. The other is for the availability group listener within the same subnet as the availability group. If you're using an existing load balancer, you only need one available IP address for the availability group listener. 

## Permissions

You need the following account permissions to configure the availability group by using the Azure portal: 

- An existing domain user account that has **Create Computer Object** permission in the domain. For example, a domain admin account typically has sufficient permission (for example: account@domain.com). _This account should also be part of the local administrator group on each VM to create the cluster._
- The domain user account that controls SQL Server. This should be the same account for every SQL Server VM you intend to add to the availability group. 

## Configure cluster

Configure the cluster by using the Azure portal. You can either create a new cluster, or if you already have an existing cluster, you can onboard it to the SQL VM resource provider to for portal manageability.


### Create a new cluster

If you already have a cluster, skip this section and move to [Onboard existing cluster](#onboard-existing-cluster) instead. 

If you do not already have an existing cluster, create it by using the Azure portal with these steps:

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Navigate to your [SQL virtual machines](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) resource. 
1. Select **High Availability** under **Settings**. 
1. Select **+ New Windows Server failover cluster** to open the **Configure Windows Failover cluster** page.  

   :::image type="content" source="media/availability-group-az-portal-configure/create-new-cluster.png" alt-text="Create new cluster by selecting the + new cluster in the portal":::

1. Name your cluster and provide a storage account to use as the Cloud Witness. Use an existing storage account or select **Create new** to create a new storage account. Storage account name must be between 3 and 24 characters in length and use numbers and lower-case letters only.

   :::image type="content" source="media/availability-group-az-portal-configure/configure-new-cluster-1.png" alt-text="Provide name, storage account, and credentials for the cluster":::

1. Expand **Windows Server Failover Cluster credentials** to provide [credentials](https://docs.microsoft.com/rest/api/sqlvm/sqlvirtualmachinegroups/createorupdate#wsfcdomainprofile) for the SQL Server service account, as well as the cluster operator and bootstrap accounts if they're different than the account used for the SQL Server service. 

   :::image type="content" source="media/availability-group-az-portal-configure/configure-new-cluster-2.png" alt-text="Provide credentials for the SQL Service account, cluster operator account and cluster bootstrap account":::

1. Select the SQL Server VMs you want to add to the cluster. Note whether or not a restart is required, and proceed with caution. Only VMs that are registered with the SQL VM resource provider in full manageability mode, and are in the same location, domain, and on the same virtual network as the primary SQL Server VM will be visible. 
1. Select **Apply** to create the cluster. You can check the status of your deployment in the **Activity log** which is accessible from the bell icon in the top navigation bar. 
1. For a failover cluster to be supported by Microsoft, it must pass cluster validation. Connect to the VM using your preferred method (such as Remote Desktop Protocol (RDP)) and validate that your cluster passes validation before proceeding further. Failure to do so leaves your cluster in an unsupported state. You can validate the cluster using Failover Cluster Manager (FCM) or the following PowerShell command:

    ```powershell
    Test-Cluster –Node ("<node1>","<node2>") –Include "Inventory", "Network", "System Configuration"
    ```
    


### Onboard existing cluster

If you already have a cluster configured in your SQL Server VM environment, you can onboard it from the Azure portal.

To do so, follow these steps:

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Navigate to your [SQL virtual machines](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) resource. 
1. Select **High Availability** under **Settings**. 
1. Select **Onboard existing Windows Server Failover Cluster** to open the **Onboard Windows Server Failover Cluster** page. 

   :::image type="content" source="media/availability-group-az-portal-configure/onboard-existing-cluster.png" alt-text="Onboard an existing cluster from the High Availability page on your SQL virtual machines resource":::

1. Review the settings for your cluster. 
1. Select **Apply** to onboard your cluster and then select **Yes** at the prompt to proceed.




## Create availability group

After your cluster was either created or onboarded, create the availability group by using the Azure portal. To do so, follow these steps:

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Navigate to your [SQL virtual machines](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) resource. 
1. Select **High Availability** under **Settings**. 
1. Select **+ New Always On availability group** to open the **Create availability group** page.

   :::image type="content" source="media/availability-group-az-portal-configure/create-new-availability-group.png" alt-text="Select new always on availability group to open the create availability group page.":::

1. Enter a name for the availability group. 
1. Select **Configure listener** to open the **Configure availability group listener** page. 

   :::image type="content" source="media/availability-group-az-portal-configure/create-availability-group.png" alt-text="Provide a name for the availability group and configure a listener":::

1. Fill out the values, and either use an existing load balancer, or select **Create new** to create a new load balancer.  Select **Apply** to save your settings and create your listener and load balancer. 

   :::image type="content" source="media/availability-group-az-portal-configure/configure-new-listener.png" alt-text="Fill out the values in the form to create your new listener and load balancer":::

1. Choose **+ Select replica** to open the **Configure availability group replicas** page.
1. Select the virtual machines you want to add to the availability group, and choose the availability group settings that best suit your business needs. Select **Apply** to save your settings. 

   :::image type="content" source="media/availability-group-az-portal-configure/add-replicas.png" alt-text="Choose VMs to add to your availability group and configure settings appropriate to your business":::

1. Verify your availability group settings and then select **Apply** to create your availability group. 

You can check the status of your deployment in the **Activity log** which is accessible from the bell icon in the top navigation bar. 

  > [!NOTE]
  > Your **Synchronization health** on the **High Availability** page of the Azure portal will show as **Not healthy** until you add databases to your availability group. 


## Add database to availability group

Add your databases to your availability group after deployment completes. The below steps use SQL Server Management Studio (SSMS) but you can use [Transact-SQL or PowerShell](/sql/database-engine/availability-groups/windows/availability-group-add-a-database) as well. 

To add databases to your availability group using SQL Server Management Studio, follow these steps:

1. Connect to one of your SQL Server VMs by using your preferred method, such as Remote Desktop Connection (RDP). 
1. Open SQL Server Management Studio (SSMS).
1. Connect to your SQL Server instance. 
1. Expand **Always On High Availability** in **Object Explorer**.
1. Expand **Availability Groups**, right-click your availability group and choose to **Add database...**.

   :::image type="content" source="media/availability-group-az-portal-configure/add-database.png" alt-text="Right-click the availability group in object explorer and choose to Add database":::

1. Follow the prompts to select the database(s) you want to add to your availability group. 
1. Select **OK** to save your settings and add your database to the availability group. 
1. After the database is added, refresh **Object Explorer** to confirm the status of your database as `synchronized`. 

After databases are added, you can check the status of your availability group in the Azure portal: 

:::image type="content" source="media/availability-group-az-portal-configure/healthy-availability-group.png" alt-text="Check the status of your availability group from the high availability page from the Azure portal after databases are synchronized":::

## Add more VMs

To add more SQL Server VMs to the cluster, follow these steps: 

1. Sign into the [Azure portal](https://portal.azure.com). 
1. Navigate to your [SQL virtual machines](https://portal.azure.com/#blade/HubsExtension/BrowseResource/resourceType/Microsoft.SqlVirtualMachine%2FSqlVirtualMachines) resource. 
1. Select **High Availability** under **Settings**. 
1. Select **Configure Windows Server Failover Cluster** to open the **Configure Windows Server Failover Cluster** page. 

   :::image type="content" source="media/availability-group-az-portal-configure/configure-existing-cluster.png" alt-text="Select Configure Windows Server Failover Cluster to add VMs to your cluster.":::

1. Expand **Windows Server Failover Cluster credentials** and enter in the accounts used for the SQL Server service, cluster operator and cluster bootstrap accounts. 
1. Select the SQL Server VMs you want to add to the cluster. 
1. Select **Apply**. 

You can check the status of your deployment in the **Activity log** which is accessible from the bell icon in the top navigation bar. 


## Modify availability group 


You can **Add more replicas** to the availability group, **Configure the Listener**, or **Delete the Listener** from the **High Availability** page in the Azure portal by selecting the ellipses (...) next to your availability group: 

:::image type="content" source="media/availability-group-az-portal-configure/configure-listener.png" alt-text="Select the ellipses next to the availability group and then select add replica to add more replicas to the availability group.":::

## Remove cluster

Remove all of the SQL Server VMs from the cluster to destroy it, and then remove the cluster metadata from the SQL VM resource provider. You can do so by using the latest version of the [Azure CLI](/cli/azure/install-azure-cli) or PowerShell. 

# [Azure CLI](#tab/azure-cli)

First, remove all of the SQL Server VMs from the cluster. This will physically remove the nodes from the cluster, and destroy the cluster:  

```azurecli-interactive
# Remove the VM from the cluster metadata
# example: az sql vm remove-from-group --name SQLVM2 --resource-group SQLVM-RG

az sql vm remove-from-group --name <VM1 name>  --resource-group <resource group name>
az sql vm remove-from-group --name <VM2 name>  --resource-group <resource group name>
```

If these are the only VMs in the cluster, then the cluster will be destroyed. If there are any other VMs in the cluster apart from the SQL Server VMs that were removed, the other VMs will not be removed and the cluster will not be destroyed. 

Next, remove the cluster metadata from the SQL VM resource provider: 

```azurecli-interactive
# Remove the cluster from the SQL VM RP metadata
# example: az sql vm group delete --name Cluster --resource-group SQLVM-RG

az sql vm group delete --name <cluster name> Cluster --resource-group <resource group name>
```

# [PowerShell](#tab/azure-powershell)

First, remove all of the SQL Server VMs from the cluster. This will physically remove the nodes from the cluster, and destroy the cluster: 

```powershell-interactive
# Remove the SQL VM from the cluster
# example: $sqlvm = Get-AzSqlVM -Name SQLVM3 -ResourceGroupName SQLVM-RG
#  $sqlvm. SqlVirtualMachineGroup = ""
#  Update-AzSqlVM -ResourceId $sqlvm -SqlVM $sqlvm

$sqlvm = Get-AzSqlVM -Name <VM Name> -ResourceGroupName <Resource Group Name>
   $sqlvm. SqlVirtualMachineGroup = ""
   
   Update-AzSqlVM -ResourceId $sqlvm -SqlVM $sqlvm
```

If these are the only VMs in the cluster, then the cluster will be destroyed. If there are any other VMs in the cluster apart from the SQL Server VMs that were removed, the other VMs will not be removed and the cluster will not be destroyed. 


Next, remove the cluster metadata from the SQL VM resource provider: 

```powershell-interactive
# Remove the cluster metadata
# example: Remove-AzSqlVMGroup -ResourceGroupName "SQLVM-RG" -Name "Cluster"

Remove-AzSqlVMGroup -ResourceGroupName "<resource group name>" -Name "<cluster name> "
```

---

## Troubleshooting

If you run into issues, you can check the deployment history, and review the common errors as well as their resolutions. 

### Check deployment history

Changes to the cluster and availability group via the portal are done through deployments. Deployment history can provide greater detail if there are issues with creating, or onboarding the cluster, or with creating the availability group.

To view the logs for the deployment, and check the deployment history, follow these steps:

1. Sign into the [Azure portal](https://portal.azure.com).
1. Navigate to your resource group.
1. Select **Deployments** under **Settings**.
1. Select the deployment of interest to learn more about the deployment. 


   :::image type="content" source="media/availability-group-az-portal-configure/failed-deployment.png" alt-text="Select the deployment you're interested in learning more about." :::

### Common errors

Review the following common errors and their resolutions. 

#### The account which is used to start up sql service is not a domain account

This is an indication that the resource provider could not access the SQL Server service with the provided credentials. Some common resolutions:
- Ensure your domain controller is running.
- Validate the credentials provided in the portal match those of the SQL Server service. 


## Next steps


For more information about availability groups, see:

- [Overview of availability groups](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server)
* [Administration of an availability group](/sql/database-engine/availability-groups/windows/administration-of-an-availability-group-sql-server)   
* [Monitoring of availability groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/monitoring-of-availability-groups-sql-server)
* [Availability group Transact-SQL statements ](/sql/database-engine/availability-groups/windows/transact-sql-statements-for-always-on-availability-groups)   
* [Availability groups PowerShell commands](/sql/database-engine/availability-groups/windows/overview-of-powershell-cmdlets-for-always-on-availability-groups-sql-server)  

For more information about SQL Server VMs, see: 

* [Overview of SQL Server VMs](sql-server-on-azure-vm-iaas-what-is-overview.md)
* [Release notes for SQL Server VMs](../../database/doc-changes-updates-release-notes.md)
* [FAQ for SQL Server VMs](frequently-asked-questions-faq.md)
