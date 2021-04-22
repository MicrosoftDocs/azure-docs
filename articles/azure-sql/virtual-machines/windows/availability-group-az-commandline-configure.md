---
title: Configure an availability group (PowerShell & Az CLI)
description: "Use either PowerShell or the Azure CLI to create the Windows failover cluster, the availability group listener, and the internal load balancer on a SQL Server VM in Azure."
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
tags: azure-resource-manager
ms.service: virtual-machines-sql
ms.subservice: hadr

ms.topic: how-to
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 08/20/2020
ms.author: mathoma
ms.reviewer: jroth
ms.custom: "seo-lt-2019, devx-track-azurecli"

---
# Use PowerShell or Az CLI to configure an availability group for SQL Server on Azure VM 
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article describes how to use [PowerShell](/powershell/scripting/install/installing-powershell) or the [Azure CLI](/cli/azure/sql/vm) to deploy a Windows failover cluster, add SQL Server VMs to the cluster, and create the internal load balancer and listener for an Always On availability group. 

Deployment of the availability group is still done manually through SQL Server Management Studio (SSMS) or Transact-SQL (T-SQL). 

While this article uses PowerShell and the Az CLI to configure the availability group environment, it is also possible to do so from the [Azure portal](availability-group-azure-portal-configure.md), using [Azure Quickstart templates](availability-group-quickstart-template-configure.md), or [Manually](availability-group-manually-configure-tutorial.md) as well. 

## Prerequisites

To configure an Always On availability group, you must have the following prerequisites: 

- An [Azure subscription](https://azure.microsoft.com/free/).
- A resource group with a domain controller. 
- One or more domain-joined [VMs in Azure running SQL Server 2016 (or later) Enterprise edition](./create-sql-vm-portal.md) in the *same* availability set or *different* availability zones that have been [registered with the SQL IaaS Agent extension](sql-agent-extension-manually-register-single-vm.md).  
- The latest version of [PowerShell](/powershell/scripting/install/installing-powershell) or the [Azure CLI](/cli/azure/install-azure-cli). 
- Two available (not used by any entity) IP addresses. One is for the internal load balancer. The other is for the availability group listener within the same subnet as the availability group. If you're using an existing load balancer, you only need one available IP address for the availability group listener. 

## Permissions

You need the following account permissions to configure the Always On availability group by using the Azure CLI: 

- An existing domain user account that has **Create Computer Object** permission in the domain. For example, a domain admin account typically has sufficient permission (for example: account@domain.com). _This account should also be part of the local administrator group on each VM to create the cluster._
- The domain user account that controls SQL Server. 
 
## Create a storage account 

The cluster needs a storage account to act as the cloud witness. You can use any existing storage account, or you can create a new storage account. If you want to use an existing storage account, skip ahead to the next section. 

The following code snippet creates the storage account: 

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
# Create the storage account
# example: az storage account create -n 'cloudwitness' -g SQLVM-RG -l 'West US' `
#  --sku Standard_LRS --kind StorageV2 --access-tier Hot --https-only true

az storage account create -n <name> -g <resource group name> -l <region> `
  --sku Standard_LRS --kind StorageV2 --access-tier Hot --https-only true
```

>[!TIP]
> You might see the error `az sql: 'vm' is not in the 'az sql' command group` if you're using an outdated version of the Azure CLI. Download the [latest version of Azure CLI](/cli/azure/install-azure-cli-windows) to get past this error.


# [PowerShell](#tab/azure-powershell)

```powershell-interactive
# Create the storage account
# example: New-AzStorageAccount -ResourceGroupName SQLVM-RG -Name cloudwitness `
#    -SkuName Standard_LRS -Location West US -Kind StorageV2 `
#    -AccessTier Hot -EnableHttpsTrafficOnly

New-AzStorageAccount -ResourceGroupName <resource group name> -Name <name> `
    -SkuName Standard_LRS -Location <region> -Kind StorageV2 `
    -AccessTier Hot -EnableHttpsTrafficOnly
```

---

## Define cluster metadata

The Azure CLI [az sql vm group](/cli/azure/sql/vm/group) command group manages the metadata of the Windows Server Failover Cluster (WSFC) service that hosts the availability group. Cluster metadata includes the Active Directory domain, cluster accounts, storage accounts to be used as the cloud witness, and SQL Server version. Use [az sql vm group create](/cli/azure/sql/vm/group#az_sql_vm_group_create) to define the metadata for WSFC so that when the first SQL Server VM is added, the cluster is created as defined. 

The following code snippet defines the metadata for the cluster:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
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

# [PowerShell](#tab/azure-powershell)

```powershell-interactive
# Define the cluster metadata
# example: $group = New-AzSqlVMGroup -Name Cluster -Location West US ' 
#  -ResourceGroupName SQLVM-RG -Offer SQL2017-WS2016
#  -Sku Enterprise -DomainFqdn domain.com -ClusterOperatorAccount vmadmin@domain.com
#  -ClusterBootstrapAccount vmadmin@domain.com  -SqlServiceAccount sqlservice@domain.com 
#  -StorageAccountUrl '<ex:https://cloudwitness.blob.core.windows.net/>' `
#  -StorageAccountPrimaryKey '4Z4/i1Dn8/bpbseyWX'

$group = New-AzSqlVMGroup -Name <name> -Location <regio> 
  -ResourceGroupName <resource group name> -Offer <SQL201?-WS201?> 
  -Sku Enterprise -DomainFqdn <FQDN> -ClusterOperatorAccount <domain account> 
  -ClusterBootstrapAccount <domain account>  -SqlServiceAccount <service account> 
  -StorageAccountUrl '<ex:StorageAccountUrl>' `
  -StorageAccountPrimaryKey '<PublicKey>'
```

---

## Add VMs to the cluster

Adding the first SQL Server VM to the cluster creates the cluster. The [az sql vm add-to-group](/cli/azure/sql/vm#az_sql-vm_add_to_group) command creates the cluster with the name previously given, installs the cluster role on the SQL Server VMs, and adds them to the cluster. Subsequent uses of the `az sql vm add-to-group` command add more SQL Server VMs to the newly created cluster. 

The following code snippet creates the cluster and adds the first SQL Server VM to it: 

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
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
Use this command to add any other SQL Server VMs to the cluster. Modify only the `-n` parameter for the SQL Server VM name. 

# [PowerShell](#tab/azure-powershell)

```powershell-interactive
# Add SQL Server VMs to cluster
# example: $sqlvm1 = Get-AzSqlVM -Name SQLVM1 -ResourceGroupName SQLVM-RG
# $sqlvm2 = Get-AzSqlVM -Name SQLVM2  -ResourceGroupName SQLVM-RG

# $sqlvmconfig1 = Set-AzSqlVMConfigGroup -SqlVM $sqlvm1 `
#  -SqlVMGroup $group -ClusterOperatorAccountPassword Str0ngAzur3P@ssword! `
#  -SqlServiceAccountPassword Str0ngAzur3P@ssword! `
#  -ClusterBootstrapAccountPassword Str0ngAzur3P@ssword!

# $sqlvmconfig2 = Set-AzSqlVMConfigGroup -SqlVM $sqlvm2 `
#  -SqlVMGroup $group -ClusterOperatorAccountPassword Str0ngAzur3P@ssword! `
#  -SqlServiceAccountPassword Str0ngAzur3P@ssword! `
#  - ClusterBootstrapAccountPassword Str0ngAzur3P@ssword!

$sqlvm1 = Get-AzSqlVM -Name <VM1 Name> -ResourceGroupName <Resource Group Name>
$sqlvm2 = Get-AzSqlVM -Name <VM2 Name> -ResourceGroupName <Resource Group Name>

$sqlvmconfig1 = Set-AzSqlVMConfigGroup -SqlVM $sqlvm1 `
   -SqlVMGroup $group -ClusterOperatorAccountPassword <operator account password> `
   -SqlServiceAccountPassword <service account password> `
   -ClusterBootstrapAccountPassword <bootstrap account password>

Update-AzSqlVM -ResourceId $sqlvm1.ResourceId -SqlVM $sqlvmconfig1

$sqlvmconfig2 = Set-AzSqlVMConfigGroup -SqlVM $sqlvm2 `
   -SqlVMGroup $group -ClusterOperatorAccountPassword <operator account password> `
   -SqlServiceAccountPassword <service account password> `
   -ClusterBootstrapAccountPassword <bootstrap account password>

Update-AzSqlVM -ResourceId $sqlvm2.ResourceId -SqlVM $sqlvmconfig2
```

---


## Validate cluster 

For a failover cluster to be supported by Microsoft, it must pass cluster validation. Connect to the VM using your preferred method, such as Remote Desktop Protocol (RDP) and validate that your cluster passes validation before proceeding further. Failure to do so leaves your cluster in an unsupported state. 

You can validate the cluster using Failover Cluster Manager (FCM) or the following PowerShell command:

   ```powershell
   Test-Cluster –Node ("<node1>","<node2>") –Include "Inventory", "Network", "System Configuration"
   ```

## Create availability group

Manually create the availability group as you normally would, by using [SQL Server Management Studio](/sql/database-engine/availability-groups/windows/use-the-availability-group-wizard-sql-server-management-studio), [PowerShell](/sql/database-engine/availability-groups/windows/create-an-availability-group-sql-server-powershell), or [Transact-SQL](/sql/database-engine/availability-groups/windows/create-an-availability-group-transact-sql). 

>[!IMPORTANT]
> Do *not* create a listener at this time because this is done through the Azure CLI in the following sections.  

## Create internal load balancer

[!INCLUDE [sql-ag-use-dnn-listener](../../includes/sql-ag-use-dnn-listener.md)]

The Always On availability group listener requires an internal instance of Azure Load Balancer. The internal load balancer provides a “floating” IP address for the availability group listener that allows for faster failover and reconnection. If the SQL Server VMs in an availability group are part of the same availability set, you can use a Basic load balancer. Otherwise, you need to use a Standard load balancer.  

> [!NOTE]
> The internal load balancer should be in the same virtual network as the SQL Server VM instances. 

The following code snippet creates the internal load balancer:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
# Create the internal load balancer
# example: az network lb create --name sqlILB -g SQLVM-RG --sku Standard `
# --vnet-name SQLVMvNet --subnet default

az network lb create --name sqlILB -g <resource group name> --sku Standard `
  --vnet-name <VNet Name> --subnet <subnet name>
```

# [PowerShell](#tab/azure-powershell)

```powershell-interactive
# Create the internal load balancer
# example: New-AzLoadBalancer -name sqlILB -ResourceGroupName SQLVM-RG  `
#  -Sku Standard -Location West US

New-AzLoadBalancer -name sqlILB -ResourceGroupName <resource group name> `
   -Sku Standard -Location <region>
```

---

>[!IMPORTANT]
> The public IP resource for each SQL Server VM should have a Standard SKU to be compatible with the Standard load balancer. To determine the SKU of your VM's public IP resource, go to **Resource Group**, select your **Public IP Address** resource for the desired SQL Server VM, and locate the value under **SKU** in the **Overview** pane.  

## Create listener

After you manually create the availability group, you can create the listener by using [az sql vm ag-listener](/cli/azure/sql/vm/group/ag-listener#az_sql_vm_group_ag_listener_create). 

The *subnet resource ID* is the value of `/subnets/<subnetname>` appended to the resource ID of the virtual network resource. To identify the subnet resource ID:
   1. Go to your resource group in the [Azure portal](https://portal.azure.com). 
   1. Select the virtual network resource. 
   1. Select **Properties** in the **Settings** pane. 
   1. Identify the resource ID for the virtual network and append `/subnets/<subnetname>` to the end of it to create the subnet resource ID. For example:
      - Your virtual network resource ID is:
        `/subscriptions/a1a1-1a11a/resourceGroups/SQLVM-RG/providers/Microsoft.Network/virtualNetworks/SQLVMvNet`
      - Your subnet name is: `default`
      - Therefore, your subnet resource ID is:
        `/subscriptions/a1a1-1a11a/resourceGroups/SQLVM-RG/providers/Microsoft.Network/virtualNetworks/SQLVMvNet/subnets/default`


The following code snippet creates the availability group listener:

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
# Create the availability group listener
# example: az sql vm group ag-listener create -n AGListener -g SQLVM-RG `
#  --ag-name SQLAG --group-name Cluster --ip-address 10.0.0.27 `
#  --load-balancer sqlilb --probe-port 59999  `
#  --subnet /subscriptions/a1a1-1a11a/resourceGroups/SQLVM-RG/providers/Microsoft.Network/virtualNetworks/SQLVMvNet/subnets/default `
#  --sqlvms sqlvm1 sqlvm2

az sql vm group ag-listener create -n <listener name> -g <resource group name> `
  --ag-name <availability group name> --group-name <cluster name> --ip-address <ag listener IP address> `
  --load-balancer <lbname> --probe-port <Load Balancer probe port, default 59999>  `
  --subnet <subnet resource id> `
  --sqlvms <names of SQL VM's hosting AG replicas, ex: sqlvm1 sqlvm2>
```

# [PowerShell](#tab/azure-powershell)

```powershell-interactive

# example: New-AzAvailabilityGroupListener -Name AGListener -ResourceGroupName SQLVM-RG `
#    -AvailabilityGroupName SQLAG  -GroupName Cluster `
#    -IpAddress 10.0.0.27 -LoadBalancerResourceId sqlilb `
#    -ProbePort 59999 `
#    -SubnetId /subscriptions/a1a1-1a11a/resourceGroups/SQLVM-RG/providers/Microsoft.Network/virtualNetworks/SQLVMvNet/subnets/default `
#    -SqlVirtualMachineId sqlvm1 sqlvm2


New-AzAvailabilityGroupListener -Name <listener name> -ResourceGroupName <resource group name> `
   -AvailabilityGroupName <availability group name> -GroupName <cluster name> `
   -IpAddress <ag listener IP address> -LoadBalancerResourceId <lbid> `
   -ProbePort <Load Balancer probe port, default 59999> `
   -SubnetId <subnet resource id> `
   -SqlVirtualMachineId <names of SQL VM's hosting AG replicas>
```

---

## Modify number of replicas 
There's an added layer of complexity when you're deploying an availability group to SQL Server VMs hosted in Azure. The resource provider and the virtual machine group now manage the resources. As such, when you're adding or removing replicas in the availability group, there's an additional step of updating the listener metadata with information about the SQL Server VMs. When you're modifying the number of replicas in the availability group, you must also use the [az sql vm group ag-listener update](/cli/azure/sql/vm/group/ag-listener#az_sql_vm_group_ag_listener_update) command to update the listener with the metadata of the SQL Server VMs. 


### Add a replica

To add a new replica to the availability group:

# [Azure CLI](#tab/azure-cli)

1. Add the SQL Server VM to the cluster group:
   ```azurecli-interactive

   # Add the SQL Server VM to the cluster group
   # example: az sql vm add-to-group -n SQLVM3 -g SQLVM-RG --sqlvm-group Cluster `
   # -b Str0ngAzur3P@ssword! -p Str0ngAzur3P@ssword! -s Str0ngAzur3P@ssword!

   az sql vm add-to-group -n <VM3 Name> -g <Resource Group Name> --sqlvm-group <cluster name> `
   -b <bootstrap account password> -p <operator account password> -s <service account password>
   ```

1. Use SQL Server Management Studio to add the SQL Server instance as a replica within the availability group.
1. Add the SQL Server VM metadata to the listener:

   ```azurecli-interactive
   # Update the listener metadata with the new VM
   # example: az sql vm group ag-listener update -n AGListener `
   # -g sqlvm-rg --group-name Cluster --sqlvms sqlvm1 sqlvm2 sqlvm3

   az sql vm group ag-listener update -n <Listener> `
   -g <RG name> --group-name <cluster name> --sqlvms <SQL VMs, along with new SQL VM>
   ```

# [PowerShell](#tab/azure-powershell)

1. Add the SQL Server VM to the cluster group:

   ```powershell-interactive
   # Add the SQL Server VM to the cluster group
   # example: $sqlvm3 = Get-AzSqlVM -Name SQLVM3 -ResourceGroupName SQLVM-RG 
   # $group = Get-AzSqlVMGroup -ResourceGroupName SQLVM-RG -Name Cluster
   # $sqlvmconfig3 = Set-AzSqlVMConfigGroup -SqlVM $sqlvm3 -SqlVMGroup $group `
   #  -ClusterOperatorAccountPassword Str0ngAzur3P@ssword! `
   #  -SqlServiceAccountPassword Str0ngAzur3P@ssword! `
   #  -ClusterBootstrapAccountPassword Str0ngAzur3P@ssword!

   $sqlvm3 = Get-AzSqlVM -Name <VM1 Name> -ResourceGroupName <Resource Group Name>
   $group = Get-AzSqlVMGroup  -ResourceGroupName <resource group name> -Name <name>
   $sqlvmconfig3 = Set-AzSqlVMConfigGroup -SqlVM $sqlvm3 -SqlVMGroup $group `
   -ClusterOperatorAccountPassword <operator account password> `
   -SqlServiceAccountPassword <service account password> `
   -ClusterBootstrapAccountPassword <bootstrap account password>

   Update-AzSqlVM -ResourceId $sqlvm3.ResourceId -SqlVM $sqlvmconfig3
   ```

1. Use SQL Server Management Studio to add the SQL Server instance as a replica within the availability group.
1. Add the SQL Server VM metadata to the listener:

   ```powershell-interactive
   # Update the listener metadata with the new VM
   # example: Update-AzAvailabilityGroupListener -Name AGListener -ResourceGroupName SQLVM-RG `
   #   -SqlVMGroupName Cluster -SqlVirtualMachineId SQLVM3

   Update-AzAvailabilityGroupListener -Name <Listener> -ResourceGroupName <Resource Group Name> `
      -SqlVMGroupName <cluster name> -SqlVirtualMachineId <SQL VMs, along with new SQL VM> 

   ```

---

### Remove a replica

To remove a replica from the availability group:

# [Azure CLI](#tab/azure-cli)

1. Remove the replica from the availability group by using SQL Server Management Studio. 
1. Remove the SQL Server VM metadata from the listener:
   ```azurecli-interactive
   # Update the listener metadata by removing the VM from the SQLVMs list
   # example: az sql vm group ag-listener update -n AGListener `
   # -g sqlvm-rg --group-name Cluster --sqlvms sqlvm1 sqlvm2

   az sql vm group ag-listener update -n <Listener> `
   -g <RG name> --group-name <cluster name> --sqlvms <SQL VMs that remain>
   ```
1. Remove the SQL Server VM from the cluster:
   ```azurecli-interactive
   # Remove the SQL VM from the cluster
   # example: az sql vm remove-from-group --name SQLVM3 --resource-group SQLVM-RG

   az sql vm remove-from-group --name <SQL VM name> --resource-group <RG name> 
   ```

# [PowerShell](#tab/azure-powershell)

1. Remove the replica from the availability group by using SQL Server Management Studio. 
1. Remove the SQL Server VM metadata from the listener:

   ```powershell-interactive
   # Update the listener metadata by removing the VM from the SQLVMs list
   # example: Update-AzAvailabilityGroupListener -Name AGListener -ResourceGroupName SQLVM-RG `
   #  -SqlVMGroupName Cluster -SqlVirtualMachineId SQLVM3

   Update-AzAvailabilityGroupListener -Name <Listener> -ResourceGroupName <Resource Group Name> `
      -SqlVMGroupName <cluster name> -SqlVirtualMachineId <SQL VMs that remain>

   ```
1. Remove the SQL Server VM from the cluster:

   ```powershell-interactive
   # Remove the SQL VM from the cluster
   # example: $sqlvm = Get-AzSqlVM -Name SQLVM3 -ResourceGroupName SQLVM-RG
   #  $sqlvm. SqlVirtualMachineGroup = ""
   #  Update-AzSqlVM -ResourceId $sqlvm -SqlVM $sqlvm

   $sqlvm = Get-AzSqlVM -Name <VM Name> -ResourceGroupName <Resource Group Name>
      $sqlvm. SqlVirtualMachineGroup = ""
    
    Update-AzSqlVM -ResourceId $sqlvm -SqlVM $sqlvm
   ```

---

## Remove listener
If you later need to remove the availability group listener configured with the Azure CLI, you must go through the SQL IaaS Agent extension. Because the listener is registered through the SQL IaaS Agent extension, just deleting it via SQL Server Management Studio is insufficient. 

The best method is to delete it through the SQL IaaS Agent extension by using the following code snippet in the Azure CLI. Doing so removes the availability group listener metadata from the SQL IaaS Agent extension. It also physically deletes the listener from the availability group. 

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
# Remove the availability group listener
# example: az sql vm group ag-listener delete --group-name Cluster --name AGListener --resource-group SQLVM-RG

az sql vm group ag-listener delete --group-name <cluster name> --name <listener name > --resource-group <resource group name>
```

# [PowerShell](#tab/azure-powershell)

```powershell-interactive
# Remove the availability group listener
# example: Remove-AzAvailabilityGroupListener -Name AGListener `
#   -ResourceGroupName SQLVM-RG -SqlVMGroupName Cluster

Remove-AzAvailabilityGroupListener -Name <Listener> `
   -ResourceGroupName <Resource Group Name> -SqlVMGroupName <cluster name>
```

---

## Remove cluster

Remove all of the nodes from the cluster to destroy it, and then remove the cluster metadata from the SQL IaaS Agent extension. You can do so by using the Azure CLI or PowerShell. 


# [Azure CLI](#tab/azure-cli)

First, remove all of the SQL Server VMs from the cluster: 

```azurecli-interactive
# Remove the VM from the cluster metadata
# example: az sql vm remove-from-group --name SQLVM2 --resource-group SQLVM-RG

az sql vm remove-from-group --name <VM1 name>  --resource-group <resource group name>
az sql vm remove-from-group --name <VM2 name>  --resource-group <resource group name>
```

If these are the only VMs in the cluster, then the cluster will be destroyed. If there are any other VMs in the cluster apart from the SQL Server VMs that were removed, the other VMs will not be removed and the cluster will not be destroyed. 

Next, remove the cluster metadata from the SQL IaaS Agent extension: 

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

Next, remove the cluster metadata from the SQL IaaS Agent extension: 

```powershell-interactive
# Remove the cluster metadata
# example: Remove-AzSqlVMGroup -ResourceGroupName "SQLVM-RG" -Name "Cluster"

Remove-AzSqlVMGroup -ResourceGroupName "<resource group name>" -Name "<cluster name> "
```

---

## Next steps

For more information, see the following articles: 

* [Overview of SQL Server VMs](sql-server-on-azure-vm-iaas-what-is-overview.md)
* [FAQ for SQL Server VMs](frequently-asked-questions-faq.md)
* [Release notes for SQL Server VMs](../../database/doc-changes-updates-release-notes.md)
* [Switching licensing models for a SQL Server VM](licensing-model-azure-hybrid-benefit-ahb-change.md)
* [Overview of Always On availability groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/overview-of-always-on-availability-groups-sql-server)   
* [Configuration of a server instance for Always On availability groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/configuration-of-a-server-instance-for-always-on-availability-groups-sql-server)   
* [Administration of an availability group &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/administration-of-an-availability-group-sql-server)   
* [Monitoring of availability groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/monitoring-of-availability-groups-sql-server)
* [Overview of Transact-SQL statements for Always On availability groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/transact-sql-statements-for-always-on-availability-groups)   
* [Overview of PowerShell cmdlets for Always On availability groups &#40;SQL Server&#41;](/sql/database-engine/availability-groups/windows/overview-of-powershell-cmdlets-for-always-on-availability-groups-sql-server)