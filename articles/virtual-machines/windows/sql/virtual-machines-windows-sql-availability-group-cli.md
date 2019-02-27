---
title: Use Azure SQL VM CLI to configure Always On availability group for SQL Server on an Azure VM 
description: "Use Azure CLI to create the Windows Failover Cluster, the availability group listener, and the Internal Load Balancer on a SQL Server VM in Azure. "
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
manager: craigg
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 02/12/2019
ms.author: mathoma
ms.reviewer: jroth

---
# Use Azure SQL VM CLI to configure Always On availability group for SQL Server on an Azure VM
This article describes how to use [Azure SQL VM CLI](https://docs.microsoft.com/mt-mt/cli/azure/ext/sqlvm-preview/sqlvm?view=azure-cli-2018-03-01-hybrid) to deploy a Windows Failover Cluster (WSFC), and add SQL Server VMs to the cluster, as well as create the Internal Load Balancer and listener for an Always On availability group.  The actual deployment  of the Always On availability group is still done manually through SQL Server Management Studio (SSMS). 

## Prerequisites
To automate the setup of an Always On availability group using Azure SQL VM CLI, you must already have the following prerequisites: 
- An [Azure Subscription](https://azure.microsoft.com/free/).
- A resource group with a domain controller. 
- One or more domain-joined [VMs in Azure running SQL Server 2016 (or greater) Enterprise edition](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) in the *same availability set or different availability zones* that have been [registered with the SQL VM resource provider](virtual-machines-windows-sql-ahb.md#register-sql-server-vm-with-sql-resource-provider).  
 
## Create storage account as a cloud witness
The cluster needs a storage account to act as the cloud witness. You can use any existing storage account, or you can create a new storage account. If you want to use an existing storage account, skip ahead to the next section. 

The following code snippet creates the storage account: 
```cli
# Create the storage account
# example: az storage account create -n 'cloudwitness' -g SQLVM-RG -l 'West US' `
#  --sku Standard_LRS --kind StorageV2 --access-tier Hot --https-only true

az storage account create -n <name> -g <resource group name> -l <region ex:eastus> `
  --sku Standard_LRS --kind StorageV2 --access-tier Hot --https-only true
```

   >[!TIP]
   > You may see the error `az sql: 'vm' is not in the 'az sql' command group` if you're using an outdated version of Azure CLI. Download the [latest version of Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest) to get past this error.

## Define Windows Failover Cluster Metadata
The Azure SQL VM CLI [az sql vm group](https://docs.microsoft.com/cli/azure/sql/vm/group?view=azure-cli-latest) command group manages the metadata of the Windows Failover Cluster (WSFC) service that hosts the availability group. Cluster metadata includes the AD domain, cluster accounts, storage accounts to be used as the cloud witness, and SQL Server version. Use [az sql vm group create](https://docs.microsoft.com/cli/azure/sql/vm/group?view=azure-cli-latest#az-sql-vm-group-create) to define the metadata for the WSFC so that when the first SQL Server VM is added, the cluster is created as defined. 

The following code snippet defines the metadata for the cluster:
```cli
# Define the cluster metadata
# example: az sql vm group create -n Cluster -l 'West US' -g SQLVM-RG `
#  --image-offer SQL2017-WS2016 --image-sku Enterprise --domain-fqdn domain.com `
#  --operator-acc vmadmin@domain.com --bootstrap-acc vmadmin@domain.com --service-acc sqlservice@domain.com `
#  --sa-key '4Z4/i1Dn8/bpbseyWX' `
#  --storage-account 'https://cloudwitness.blob.core.windows.net/'

az sql vm group create -n <cluster name> -l <region ex:eastus> -g <resource group name> `
  --image-offer <SQL2016-WS2016 or SQL2017-WS2016> --image-sku Enterprise --domain-fqdn <FQDN ex: domain.com> `
  --operator-acc <domain account ex: testop@domain.com> --bootstrap-acc <domain account ex:bootacc@domain.com> `
  --service-acc <service account ex: testservice@domain.com> `
  --sa-key '<PublicKey>' `
  --storage-account '<ex:https://cloudwitness.blob.core.windows.net/>'
```

## Add SQL Server VMs to cluster
Adding the first SQL Server VM to the cluster creates the cluster. The [az sql vm add-to-group](https://docs.microsoft.com/cli/azure/sql/vm?view=azure-cli-latest#az-sql-vm-add-to-group) command creates the cluster with the name previously given, installs the cluster role on the SQL Server VMs, and adds them to the cluster. Subsequent uses of the `az sql vm add-to-group` command adds additional SQL Server VMs to the newly created cluster. 

The following code snippet creates the cluster and adds the first SQL Server VM to it: 

```cli
# Add SQL Server VMs to cluster
# example: az sql vm add-to-group -n SQLVM1 -g SQLVM-RG --sqlvm-group Cluster `
#  -b Str0ngAzur3P@ssword! -p Str0ngAzur3P@ssword! -s Str0ngAzur3P@ssword!
# example: az sql vm add-to-group -n SQLVM2 -g SQLVM-RG --sqlvm-group Cluster `
#  -b Str0ngAzur3P@ssword! -p Str0ngAzur3P@ssword! -s Str0ngAzur3P@ssword!

az sql vm add-to-group -n <VM1 Name> -g <Resource Group Name> --sqlvm-group <cluster name> `
  -b <bootstrap account password> -p <operator account password> -s <service account password>
az sql vm add-to-group -n <VM2 Name> -g <Resource Group Name> --sqlvm-group <cluster name> `
  -b <bootstrap account password> -p <operator account password> -s <service account password>
```
Use this command to add any other SQL Server VMs to the cluster, only modifying the `-n` parameter for the SQL Server VM name. 

## Create availability group
Manually create the availability group as you normally would, using either [SQL Server Management Studio](/sql/database-engine/availability-groups/windows/use-the-availability-group-wizard-sql-server-management-studio), [PowerShell](/sql/database-engine/availability-groups/windows/create-an-availability-group-sql-server-powershell), or [Transact-SQL](/sql/database-engine/availability-groups/windows/create-an-availability-group-transact-sql). 

  >[!IMPORTANT]
  > Do **not** create a listener at this time because this is done through Azure CLI in the following sections.  

## Create Internal Load Balancer

The Always On availability group (AG) listener requires an Internal Azure Load Balancer (ILB). The ILB provides a “floating” IP address for the AG listener that allows for faster failover and reconnection. If the SQL Server VMs in an availability group are part of the same availability set, then you can use a Basic Load Balancer; otherwise, you need to use a Standard Load Balancer.  **The ILB should be in the same vNet as the SQL Server VM instances.** 

The following code snippet creates the Internal Load Balancer:

```cli
# Create the Internal Load Balancer
# example: az network lb create --name sqlILB -g SQLVM-RG --sku Standard `
# --vnet-name SQLVMvNet --subnet default

az network lb create --name sqlILB -g <resource group name> --sku Standard `
  --vnet-name <VNet Name> --subnet <subnet name>
```

  >[!IMPORTANT]
  > The public IP resource for each SQL Server VM should have a standard SKU to be compatible with the Standard Load Balancer. To determine the SKU of your VM's public IP resource, navigate to your **Resource Group**, select your **Public IP Address** resource for the desired SQL Server VM, and locate the value under **SKU** of the **Overview** pane.  

## Create availability group listener
Once the availability group has been manually created, you can create the listener using [az sql vm ag-listener](https://docs.microsoft.com/cli/azure/sql/vm/group/ag-listener?view=azure-cli-latest#az-sql-vm-group-ag-listener-create). 


- The **subnet resource ID** is the value of `/subnets/<subnetname>` appended to the resource ID of the vNet resource. To identify the subnet resource ID, do the following:
   1. Navigate to your resource group in the [Azure portal](https://portal.azure.com). 
   1. Select the vNet resource. 
   1. Select **Properties** in the **Settings** pane. 
   1. Identify the resource ID for the vNet and append `/subnets/<subnetname>`to the end of it to create the subnet resource ID. For example:
        - My vNet resource ID is `/subscriptions/a1a11a11-1a1a-aa11-aa11-1aa1a11aa11a/resourceGroups/SQLVM-RG/providers/Microsoft.Network/virtualNetworks/SQLVMvNet`.
        - My subnet name is `default`.
        - Therefore, my subnet resource ID is `/subscriptions/a1a11a11-1a1a-aa11-aa11-1aa1a11aa11a/resourceGroups/SQLVM-RG/providers/Microsoft.Network/virtualNetworks/SQLVMvNet/subnets/default`


The following code snippet will create the availability group listener:

```cli
# Create the AG listener
# example: az sql vm group ag-listener create -n AGListener -g SQLVM-RG `
#  --ag-name SQLAG --group-name Cluster --ip-address 10.0.0.27 `
#  --load-balancer sqlilb --probe-port 59999  `
#  --subnet /subscriptions/a1a11a11-1a1a-aa11-aa11-1aa1a11aa11a/resourceGroups/SQLVM-RG/providers/Microsoft.Network/virtualNetworks/SQLVMvNet/subnets/default `
#  --sqlvms sqlvm1 sqlvm2

az sql vm group ag-listener create -n <listener name> -g <resource group name> `
  --ag-name <availability group name> --group-name <cluster name> --ip-address <ag listener IP address> `
  --load-balancer <lbname> --probe-port <Load Balancer probe port, default 59999>  `
  --subnet <subnet resource id> `
  --sqlvms <names of SQL VM’s hosting AG replicas ex: sqlvm1 sqlvm2>
```

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server VM](virtual-machines-windows-sql-server-iaas-overview.md)
* [SQL Server VM FAQ](virtual-machines-windows-sql-server-iaas-faq.md)
* [SQL Server VM release notes](virtual-machines-windows-sql-server-iaas-release-notes.md)
* [Switching licensing models for a SQL Server VM](virtual-machines-windows-sql-ahb.md)
* [Overview of Always On Availability Groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server)   
* [Configuration of a Server Instance for Always On Availability Groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/configuration-of-a-server-instance-for-always-on-availability-groups-sql-server)   
* [Administration of an Availability Group &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/administration-of-an-availability-group-sql-server)   
* [Monitoring of Availability Groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/monitoring-of-availability-groups-sql-server.md)
* [Overview of Transact-SQL Statements for Always On Availability Groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/transact-sql-statements-for-always-on-availability-groups)   
* [Overview of PowerShell Cmdlets for Always On Availability Groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/overview-of-powershell-cmdlets-for-always-on-availability-groups-sql-server)  
