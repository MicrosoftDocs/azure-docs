---
title: Deploy an Azure disk pool
description: Learn how to deploy an Azure disk pool.
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 06/10/2021
ms.author: rogarana
ms.subservice: disks
---
# Deploy a disk pool

This article covers how to deploy and configure a disk pool. Before deploying a disk pool, read the [conceptual](disks-pools.md) and [planning](disks-pools-planning.md) articles.

This article covers how to configure and deploy a disk pool. In order for a disk pool to work correctly, you must complete the following steps:
- Register for the preview.
- Delegate a subnet to your disk pool.
- Assign RBAC permissions to each disk pool resource.
- Create the disk pool using the subnet.
- Add disks to your disk pool.

## Register for the preview

Register your subscription to the **Microsoft.StoragePool** provider, to be able to create and use disk pools.

1. Sign in to the Azure portal
1. On the Azure portal menu, search for and select **Subscriptions**.
1. Select the subscription you want to use for disk pools.
1. On the left menu, under **Settings**, select **Resource providers**.
1. Find the resource provider **Microsoft.StoragePool** and select **Register**.

Once your subscription has been registered, you can deploy a disk pool.

## Get started

### Delegate subnet permission

In order for your disk pool to correctly function with your client machines, you must delegate a subnet to your Azure disk pool. When creating a disk pool, you specify a virtual network and the delegated subnet. You may either create a new subnet or use an existing one and delegate to the **Microsoft.StoragePool** resource provider.

1. Go to the virtual networks blade in the Azure portal and select the virtual network to use for the disk pool.
1. From here, you can either:
    - Select Subnets from the virtual network blade and select +Subnet.

    Or

    - Create a new subnet by completing the following required fields in the Add Subnet page:
        - Name: Specify name.
        - Address range: Specify IP address range.
        - Subnet delegation: Select Microsoft.StoragePool
    
### Provide StoragePool resource provider permission to the disks that will be in the disk pool.

In order for your disk pool to work correctly, the StoragePool resource provider must be assigned an RBAC role that contains Read & Write permissions for every managed disk in the disk pool.

For a disk to be able to use a disk pool, it must meet the following requirements:

- Must be either a premium SSD or an ultra disk in the same availability zone as the disk pool, or deployed with ZRS.
    - For ultra disks, it must have a disk sector size of 512 bytes.
- Must be a shared disk with a maxShares value of two or greater.

1. Sign in to the Azure portal.
1. Search for and select either the resource group that contains the disks or each disk themselves.
1. Select Access control (IAM).
1. Select Add > Add role assignment, and select **Azure Disk Contributor** in the Role list.
1. Select User, group, or service principal in the Assign access to list.
1. In the Select section, search for **StoragePool Resource Provider**, select it, and save.

## Create a disk pool

# [Portal](#tab/azure-portal)

1. Search for and select **Disk pool**.
1. Select **+Add** to create a new disk pool.
1. Fill in the details requested, make sure to select the same region and availability zone as the clients that will use the disk pool.
1. Select the subnet that has been delegated to the StoragePool resource provider, and its associated virtual network.

At this point, you have successfully deployed a disk pool. Now, you must add disks to the pool.

### Add a disk

#### Prerequisites

To add a disk, it must meet the following requirements:

- Must be either a premium SSD or an ultra disk in the same availability zone as the disk pool, or deployed with ZRS.
    - For ultra disks, it must have a disk sector size of 512 bytes.
- Must be a shared disk with a maxShares value of two or greater.
- You must have granted RBAC permissions for this disk to your disk pool resource provider.

If your disk meets these requirements, you can add it to a disk pool by selecting **+Add disk** in the disk pool blade.

### Enable iSCSI

1. Select the iSCSI tab
1. Select **Enable iSCSI**
1. Enter the name of the iSCSI target, the iSCSI target IQN will generate based on this name.

#### Enable iSCSI targets for disks

In the disks enablement section you can choose to enable or disable individual iSCSI targets.

In the Access Control List options section, the ACL mode is set to **Dynamic**. To use your disk pool as a storage solution for AVS, the ACL mode must be set to **Dynamic**.

Select Review + create.


# [PowerShell](#tab/azure-powershell)

The following script


```azurepowershell
#upgrade PSH module
$subnetConfig = Get-AzVirtualNetworkSubnetConfig -Name $diskpoolSubnetName -VirtualNetwork $virtualNetwork

$subnetConfig = ((Get-AzVirtualNetwork -Name $vnetName -ResourceGroupName $resourceGroupName).Subnets |? { $_.Name -eq $diskpoolSubnetName })

New-AzDiskPool -Name $diskPoolName -ResourceGroupName $resourceGroupName -Location $location -SubnetId $subnetConfig.Id -AvailabilityZone $AvZoneNo #We only support zonal deployment of Disk Pool
$diskpool = Get-AzDiskPool -ResourceGroupName $resourceGroupName -Name $DiskPoolName

#5. Add AVS Cloud as iSCSI initiators to the Disk Pool 
#5.1 Initialize an iSCSI Target endpoint and expose the attached Disk
$targetIqn = "<target-iqn>" # Specify the IQN of the iSCSI target representing your Disk Pool. For example: iqn.2005-03.org.iscsi:server
$iscsiInitiatorIqn = "<avs-iqn>"# Specify the IQN of your AVS Cloud. For example: iqn.2005-03.org.iscsi:client
$username = "<user-name>" # Minimum length: 7, Maximum length: 511
$pwd = "<pwd>" # Minimum length: 12; Maximum length: 255; known invalid characters: () @ # $ % ^ & and *
$lunName = "<lun-name>" # Lun name will be surfaced as the indicator for the disk from iSCSI target
$iscsiTargetName = "<iscsi-target-name>"
#Expose the Disk that is added as the storage target under this Disk Pool as a Lun on the iSCSI target. Each added Storage Target can only be mapped against one iSCSI LUN

$lun= New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $diskId -Name $lunName
# A target portal group is a set of one or more storage system network interfaces that can be used for an iSCSI session between an initiator and a target. A target portal group composes these properties below.

#ACLs: defines the iSCSI initiators that can be connected to this iSCSI target including the credentials to be used for authentication if enabled, and the iSCSI LUN allowed. You can add multiple ACLs per each iSCSI initiator.
#AttributeAuthentication: defines whether authentication is enabled on the ACL (Challenge Handshake Authentication Protocol). If you enable authentication, you must use and specify credentials for the connection
#AttributeProdModeWriteProtect: defines whether write protect is enabled on the Luns
$acls = New-AzDiskPoolAclObject -CredentialsUsername $username -CredentialsPassword $pwd -InitiatorIqn $iscsiInitiatorIqn -MappedLun @($lunName)
$tpgs = New-AzDiskPoolTargetPortalGroupObject -Lun $lun -AttributeAuthentication $true -AttributeProdModeWriteProtect $false -Acls $acls
New-AzIscsiTarget -ResourceGroupName $resourceGroupName -TargetIqn $targetIqn -DiskPoolName $diskPoolName -Name $iscsiTargetName -Tpg $tpgs

#5.2 Retrieve the iSCSI target properties of the Disk Pool
Get-AzIscsiTarget -ResourceGroupName $resourceGroupName -Name $iscsiTargetName -
```


# [Azure CLI](#tab/azure-cli)

CLI content

```azurecli
#Select subscription
az account set --subscription "Azure Dedicated Tahoma Share"

#Add disk-pool CLI extension
az extension add -n diskpool
#az extension add -s https://zuhdefault.blob.core.windows.net/cliext/diskpool-0.1.1-py3-none-any.whl

##Initialize input parameters
resourceGroupName='yuemlu-avs-rg'
location='EastUS'
zone=1
subnetId='/subscriptions/eff9fadd-6918-4253-b667-c39271e7435c/resourceGroups/yuemlu-avs-rg/providers/Microsoft.Network/virtualNetworks/avs-vnet/subnets/DiskPool_Subnet'
diskName='disk-1tb-1'
diskPoolName='yuemlu-eastus-diskpool'
targetName='target1'
lunName='lun-0'

#You can skip this step if you have already created the disk and assigned permission in the prerequisite step. Below is an example for Premium Disks.
az disk create --name $diskName --resource-group $resourceGroupName --zone $zone --location $location --sku Premium_LRS --max-shares 2 --size-gb 1024

#You can deploy all your disks into one resource group and assign StoragePool Resource Provider permission to the group
storagePoolObjectId=$(az ad sp list --filter "displayName eq 'StoragePool Resource Provider'" --query "[0].objectId" -o json)
storagePoolObjectId="${storagePoolObjectId%\"}"
storagePoolObjectId="${storagePoolObjectId#\"}"

az role assignment create --assignee-object-id $storagePoolObjectId --role "Virtual Machine Contributor" --resource-group $resourceGroupName

#Create a disk pool 
az disk-pool create --name $diskPoolName \
--resource-group $resourceGroupName \
--location $location \
--availability-zones $zone \
--subnet-id $subnetId \
--sku name="Standard"

#Initialize an iSCSI target. You can have 1 iSCSI target per disk pool
az disk-pool iscsi-target create --name $targetName \
--disk-pool-name $diskPoolName \
--resource-group $resourceGroupName \
--acl-mode Dynamic

#Add the disk to disk pool
diskId=$(az disk show --name $diskName --resource-group $resourceGroupName --query "id" -o json)
diskId="${diskId%\"}"
diskId="${diskId#\"}"

az disk-pool update --name $diskPoolName --resource-group $resourceGroupName --disks $diskId

#Expose disks added in the Disk Pool as iSCSI Lun 
az disk-pool iscsi-target update --name $targetName \
 --disk-pool-name $diskPoolName \
 --resource-group $resourceGroupName \
 --luns name=$lunName managed-disk-azure-resource-id=$diskId
```
---

## Next steps

[Manage a disk pool](disks-pools-manage.md)