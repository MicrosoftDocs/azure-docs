---
title: Configure an availability group by using the Azure CLI
description: "Use the Azure CLI to create the Windows failover cluster, the availability group listener, and the internal load balancer on a SQL Server VM in Azure."
services: virtual-machines-windows
documentationcenter: na
author: MashaMSFT
tags: azure-resource-manager
ms.service: virtual-machines-sql

ms.topic: article
ms.tgt_pltfrm: vm-windows-sql-server
ms.workload: iaas-sql-server
ms.date: 02/12/2019
ms.author: mathoma
ms.reviewer: jroth
ms.custom: "seo-lt-2019"

---
# Use the Azure CLI to configure an Always On availability group for SQL Server on Azure VM
[!INCLUDE[appliesto-sqlvm](../../includes/appliesto-sqlvm.md)]

This article describes how to use the [Azure CLI](/cli/azure/sql/vm?view=azure-cli-latest/) to deploy a Windows failover cluster, add SQL Server VMs to the cluster, and create the internal load balancer and listener for an Always On availability group. Deployment of the Always On availability group is still done manually through SQL Server Management Studio (SSMS). 

## Prerequisites
To automate the setup of an Always On availability group by using the Azure CLI, you must have the following prerequisites: 
- An [Azure subscription](https://azure.microsoft.com/free/).
- A resource group with a domain controller. 
- One or more domain-joined [VMs in Azure running SQL Server 2016 (or later) Enterprise edition](https://docs.microsoft.com/azure/virtual-machines/windows/sql/virtual-machines-windows-portal-sql-server-provision) in the *same availability set or different availability zones* that have been [registered with the SQL VM resource provider](sql-vm-resource-provider-register.md).  
- The [Azure CLI](/cli/azure/install-azure-cli). 
- Two available (not used by any entity) IP addresses. One is for the internal load balancer. The other is for the availability group listener within the same subnet as the availability group. If you're using an existing load balancer, you need only one available IP address for the availability group listener. 

## Permissions
You need the following account permissions to configure the Always On availability group by using the Azure CLI: 

- An existing domain user account that has **Create Computer Object** permission in the domain. For example, a domain admin account typically has sufficient permission (for example: account@domain.com). _This account should also be part of the local administrator group on each VM to create the cluster._
- The domain user account that controls SQL Server. 
 
## Step 1: Create a storage account as a cloud witness
The cluster needs a storage account to act as the cloud witness. You can use any existing storage account, or you can create a new storage account. If you want to use an existing storage account, skip ahead to the next section. 

The following code snippet creates the storage account: 
```azurecli-interactive
# Create the storage account
# example: az storage account create -n 'cloudwitness' -g SQLVM-RG -l 'West US' `
#  --sku Standard_LRS --kind StorageV2 --access-tier Hot --https-only true

az storage account create -n <name> -g <resource group name> -l <region ex:eastus> `
  --sku Standard_LRS --kind StorageV2 --access-tier Hot --https-only true
```

>[!TIP]
> You might see the error `az sql: 'vm' is not in the 'az sql' command group` if you're using an outdated version of the Azure CLI. Download the [latest version of Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli-windows?view=azure-cli-latest) to get past this error.

## Step 2: Define Windows failover cluster metadata
The Azure CLI [az sql vm group](https://docs.microsoft.com/cli/azure/sql/vm/group?view=azure-cli-latest) command group manages the metadata of the Windows Server Failover Cluster (WSFC) service that hosts the availability group. Cluster metadata includes the Active Directory domain, cluster accounts, storage accounts to be used as the cloud witness, and SQL Server version. Use [az sql vm group create](https://docs.microsoft.com/cli/azure/sql/vm/group?view=azure-cli-latest#az-sql-vm-group-create) to define the metadata for WSFC so that when the first SQL Server VM is added, the cluster is created as defined. 

The following code snippet defines the metadata for the cluster:
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

## Step 3: Add SQL Server VMs to the cluster
Adding the first SQL Server VM to the cluster creates the cluster. The [az sql vm add-to-group](https://docs.microsoft.com/cli/azure/sql/vm?view=azure-cli-latest#az-sql-vm-add-to-group) command creates the cluster with the name previously given, installs the cluster role on the SQL Server VMs, and adds them to the cluster. Subsequent uses of the `az sql vm add-to-group` command add more SQL Server VMs to the newly created cluster. 

The following code snippet creates the cluster and adds the first SQL Server VM to it: 

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

## Step 4: Create the availability group
Manually create the availability group as you normally would, by using [SQL Server Management Studio](/sql/database-engine/availability-groups/windows/use-the-availability-group-wizard-sql-server-management-studio), [PowerShell](/sql/database-engine/availability-groups/windows/create-an-availability-group-sql-server-powershell), or [Transact-SQL](/sql/database-engine/availability-groups/windows/create-an-availability-group-transact-sql). 

>[!IMPORTANT]
> Do *not* create a listener at this time because this is done through the Azure CLI in the following sections.  

## Step 5: Create the internal load balancer

The Always On availability group listener requires an internal instance of Azure Load Balancer. The internal load balancer provides a “floating” IP address for the availability group listener that allows for faster failover and reconnection. If the SQL Server VMs in an availability group are part of the same availability set, you can use a Basic load balancer. Otherwise, you need to use a Standard load balancer.  

> [!NOTE]
> The internal load balancer should be in the same virtual network as the SQL Server VM instances. 

The following code snippet creates the internal load balancer:

```azurecli-interactive
# Create the internal load balancer
# example: az network lb create --name sqlILB -g SQLVM-RG --sku Standard `
# --vnet-name SQLVMvNet --subnet default

az network lb create --name sqlILB -g <resource group name> --sku Standard `
  --vnet-name <VNet Name> --subnet <subnet name>
```

>[!IMPORTANT]
> The public IP resource for each SQL Server VM should have a Standard SKU to be compatible with the Standard load balancer. To determine the SKU of your VM's public IP resource, go to **Resource Group**, select your **Public IP Address** resource for the desired SQL Server VM, and locate the value under **SKU** in the **Overview** pane.  

## Step 6: Create the availability group listener
After you manually create the availability group, you can create the listener by using [az sql vm ag-listener](/cli/azure/sql/vm/group/ag-listener?view=azure-cli-latest#az-sql-vm-group-ag-listener-create). 

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

## Modify the number of replicas in an availability group
There's an added layer of complexity when you're deploying an availability group to SQL Server VMs hosted in Azure. The resource provider and the virtual machine group now manage the resources. As such, when you're adding or removing replicas in the availability group, there's an additional step of updating the listener metadata with information about the SQL Server VMs. When you're modifying the number of replicas in the availability group, you must also use the [az sql vm group ag-listener update](/cli/azure/sql/vm/group/ag-listener?view=azure-cli-2018-03-01-hybrid#az-sql-vm-group-ag-listener-update) command to update the listener with the metadata of the SQL Server VMs. 


### Add a replica

To add a new replica to the availability group:

1. Add the SQL Server VM to the cluster:
   ```azurecli-interactive
   # Add the SQL Server VM to the cluster
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

### Remove a replica

To remove a replica from the availability group:

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

## Remove the availability group listener
If you later need to remove the availability group listener configured with the Azure CLI, you must go through the SQL VM resource provider. Because the listener is registered through the SQL VM resource provider, just deleting it via SQL Server Management Studio is insufficient. 

The best method is to delete it through the SQL VM resource provider by using the following code snippet in the Azure CLI. Doing so removes the availability group listener metadata from the SQL VM resource provider. It also physically deletes the listener from the availability group. 

```azurecli-interactive
# Remove the availability group listener
# example: az sql vm group ag-listener delete --group-name Cluster --name AGListener --resource-group SQLVM-RG

az sql vm group ag-listener delete --group-name <cluster name> --name <listener name > --resource-group <resource group name>
```

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
