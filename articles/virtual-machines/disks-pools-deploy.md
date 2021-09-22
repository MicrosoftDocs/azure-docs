---
title: Deploy an Azure disk pool (preview)
description: Learn how to deploy an Azure disk pool.
author: roygara
ms.service: storage
ms.topic: conceptual
ms.date: 07/19/2021
ms.author: rogarana
ms.subservice: disks
---
# Deploy an Azure disk pool (preview)

This article covers how to deploy and configure an Azure disk pool (preview). Before deploying a disk pool, read the [conceptual](disks-pools.md) and [planning](disks-pools-planning.md) articles.

For a disk pool to work correctly, you must complete the following steps:
- Register your subscription for the preview.
- Delegate a subnet to your disk pool.
- Assign the resource provider of disk pool role-based access control (RBAC) permissions for managing your disk resources.
- Create the disk pool.
    - Add disks to your disk pool.


## Prerequisites

To successfully deploy a disk pool, you must have:

- A set of managed disks you want to add to a disk pool.
- A virtual network with a dedicated subnet deployed for your disk pool.

If you're going to use the Azure PowerShell module, install [version 6.1.0 or newer](/powershell/module/az.diskpool/?view=azps-6.1.0&preserve-view=true).

If you're going to use the Azure CLI, install [the latest version](/cli/azure/disk-pool?view=azure-cli-latest).

## Register your subscription for the preview

Register your subscription to the **Microsoft.StoragePool** provider, to be able to create and use disk pools.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. On the Azure portal menu, search for and select **Subscriptions**.
1. Select the subscription you want to use for disk pools.
1. On the left menu, under **Settings**, select **Resource providers**.
1. Find the resource provider **Microsoft.StoragePool** and select **Register**.

Once your subscription has been registered, you can deploy a disk pool.

## Delegate subnet permission

For your disk pool to work with your client machines, you must delegate a subnet to your Azure disk pool. When creating a disk pool, you specify a virtual network and the delegated subnet. You may either create a new subnet or use an existing one and delegate to the **Microsoft.StoragePool/diskPools** resource provider.

1. Go to the virtual networks pane in the Azure portal and select the virtual network to use for the disk pool.
1. Select **Subnets** from the virtual network pane and select **+Subnet**.
1. Create a new subnet by completing the following required fields in the **Add subnet** pane:
        - Subnet delegation: Select Microsoft.StoragePool

For more information on subnet delegation, see [Add or remove a subnet delegation](../virtual-network/manage-subnet-delegation.md).

## Assign StoragePool resource provider permissions

For a disk to be able to be used in a disk pool, it must meet the following requirements:

- The **StoragePool** resource provider must have been assigned an RBAC role that contains **Read** and **Write** permissions for every managed disk in the disk pool.
- Must be either a premium SSD or an ultra disk in the same availability zone as the disk pool.
    - For ultra disks, it must have a disk sector size of 512 bytes.
- Must be a shared disk with a maxShares value of two or greater.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select either the resource group that contains the disks or each disk themselves.
1. Select **Access control (IAM)**.
1. Select **Add role assignment (Preview)**, and select **Virtual Machine Contributor** in the role list.

    If you prefer, you may create your own custom role instead. A custom role for disk pools must have the following RBAC permissions to function: **Microsoft.Compute/disks/write** and **Microsoft.Compute/disks/read**.

1. For **Assign access to**, select **User, group, or service principal**.
1. Select **+ Select members** and then search for **StoragePool Resource Provider**, select it, and save.

## Create a disk pool

For optimal performance, deploy the disk pool in the same Availability Zone of your clients. If you are deploying a disk pool for an Azure VMware Solution cloud and need guidance on identifying the Availability Zone, fill in this [form](https://aka.ms/DiskPoolCollocate).

# [Portal](#tab/azure-portal)

1. Search for and select **Disk pool**.
1. Select **+Add** to create a new disk pool.
1. Fill in the details requested, select the same region and availability zone as the clients that will use the disk pool.
1. Select the subnet that has been delegated to the **StoragePool** resource provider, and its associated virtual network.
1. Select **Next** to add disks to your disk pool.

    :::image type="content" source="media/disks-pools-deploy/create-a-disk-pool.png" alt-text="Screenshot of the basic pane for create a disk pool.":::

### Add disks

#### Prerequisites

To add a disk, it must meet the following requirements:

- Must be either a premium SSD or an ultra disk in the same availability zone as the disk pool.
    - Currently, you can only add premium SSDs in the portal. Ultra disks must be added with either the Azure PowerShell module or the Azure CLI.
    - For ultra disks, it must have a disk sector size of 512 bytes.
- Must be a shared disk with a maxShares value of two or greater.
- You must grant RBAC permissions to the resource provide of disk pool to manage the disk you plan to add.

If your disk meets these requirements, you can add it to a disk pool by selecting **+Add disk** in the disk pool pane.

:::image type="content" source="media/disks-pools-deploy/create-a-disk-pool-disks-blade.png" alt-text="Screenshot of the disk pane for create a disk pool, add a disk highlighted.":::

### Enable iSCSI

1. Select the **iSCSI** pane.
1. Select **Enable iSCSI**.
1. Enter the name of the iSCSI target, the iSCSI target IQN will generate based on this name.
    - If you want to disable the iSCSI target for an individual disk, select **Disable** under **Status** for an individual disk.
    - The ACL mode is set to **Dynamic** by default. To use your disk pool as a storage solution for Azure VMware Solution, the ACL mode must be set to **Dynamic**.
1. Select **Review + create**.

    :::image type="content" source="media/disks-pools-deploy/create-a-disk-pool-iscsi-blade.png" alt-text="Screenshot of the iscsi pane for create a disk pool.":::

# [PowerShell](#tab/azure-powershell)

The provided script performs the following:
- Installs the necessary module for creating and using disk pools.
- Creates a disk and assigns RBAC permissions to it. If you already did this, you can comment out these sections of the script.
- Creates a disk pool and adds the disk to it.
- Creates and enable an iSCSI target.

Replace the variables in this script with your own variables before running the script. You'll also need to modify it to use an existing ultra disk if you've filled out the ultra disk form.

```azurepowershell
# Install the required module for Disk Pool
Install-Module -Name Az.DiskPool -RequiredVersion 0.1.1 -Repository PSGallery

# Sign in to the Azure account and setup the variables
$subscriptionID = "<yourSubID>"
Set-AzContext -Subscription $subscriptionID
$resourceGroupName= "<yourResourceGroupName>"
$location = "<desiredRegion>"
$diskName = "<desiredDiskName>"
$availabilityZone = "<desiredAvailabilityZone>"
$subnetId='<yourSubnetID>'
$diskPoolName = "<desiredDiskPoolName>"
$iscsiTargetName = "<desirediSCSITargetName>" # This will be used to generate the iSCSI target IQN name
$lunName = "<desiredLunName>"

# You can skip this step if you have already created the disk and assigned proper RBAC permission to the resource group the disk is deployed to
$diskconfig = New-AzDiskConfig -Location $location -DiskSizeGB 1024 -AccountType Premium_LRS -CreateOption Empty -zone $availabilityZone -MaxSharesCount 2
$disk = New-AzDisk -ResourceGroupName $resourceGroupName -DiskName $diskName -Disk $diskconfig
$diskId = $disk.Id
$scopeDef = "/subscriptions/" + $subscriptionId + "/resourceGroups/" + $resourceGroupName
$rpId = (Get-AzADServicePrincipal -SearchString "StoragePool Resource Provider").id

New-AzRoleAssignment -ObjectId $rpId -RoleDefinitionName "Virtual Machine Contributor" -Scope $scopeDef

# Create a Disk Pool
New-AzDiskPool -Name $diskPoolName -ResourceGroupName $resourceGroupName -Location $location -SubnetId $subnetId -AvailabilityZone $availabilityZone -SkuName Standard
$diskpool = Get-AzDiskPool -ResourceGroupName $resourceGroupName -Name $DiskPoolName

# Add disks to the Disk Pool
Update-AzDiskPool -ResourceGroupName $resourceGroupName -Name $diskPoolName -DiskId $diskId
$lun = New-AzDiskPoolIscsiLunObject -ManagedDiskAzureResourceId $diskId -Name $lunName

# Create an iSCSI Target and expose the disks as iSCSI LUNs
New-AzDiskPoolIscsiTarget -DiskPoolName $diskPoolName -Name $iscsiTargetName -ResourceGroupName $resourceGroupName -Lun $lun -AclMode Dynamic

Write-Output "Print details of the iSCSI target exposed on Disk Pool"

Get-AzDiskPoolIscsiTarget -name $iscsiTargetName -DiskPoolName $diskPoolName -ResourceGroupName $resourceGroupName | fl
```


# [Azure CLI](#tab/azure-cli)

The provided script performs the following:
- Installs the necessary extension for creating and using disk pools.
- Creates a disk and assigns RBAC permissions to it. If you already did this, you can comment out these sections of the script.
- Creates a disk pool and adds the disk to it.
- Creates and enable an iSCSI target.

Replace the variables in this script with your own variables before running the script. You'll also need to modify it to use an existing ultra disk if you've filled out the ultra disk form.

```azurecli
# Add disk pool CLI extension
az extension add -n diskpool

#az extension add -s https://zuhdefault.blob.core.windows.net/cliext/diskpool-0.1.1-py3-none-any.whl

#Select subscription
az account set --subscription "<yourSubscription>"

##Initialize input parameters
resourceGroupName='<yourRGName>'
location='<desiredRegion>'
zone=<desiredZone>
subnetId='<yourSubnetID>'
diskName='<desiredDiskName>'
diskPoolName='<desiredDiskPoolName>'
targetName='<desirediSCSITargetName>'
lunName='<desiredLunName>'

#You can skip this step if you have already created the disk and assigned permission in the prerequisite step. Below is an example for premium disks.
az disk create --name $diskName --resource-group $resourceGroupName --zone $zone --location $location --sku Premium_LRS --max-shares 2 --size-gb 1024

#You can deploy all your disks into one resource group and assign StoragePool Resource Provider permission to the group
storagePoolObjectId=$(az ad sp list --filter "displayName eq 'StoragePool Resource Provider'" --query "[0].objectId" -o json)
storagePoolObjectId="${storagePoolObjectId%"}"
storagePoolObjectId="${storagePoolObjectId#"}"

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
diskId="${diskId%"}"
diskId="${diskId#"}"

az disk-pool update --name $diskPoolName --resource-group $resourceGroupName --disks $diskId

#Expose disks added in the Disk Pool as iSCSI Lun 
az disk-pool iscsi-target update --name $targetName \
 --disk-pool-name $diskPoolName \
 --resource-group $resourceGroupName \
 --luns name=$lunName managed-disk-azure-resource-id=$diskId
```
---

## Next steps

- If you encounter any issues deploying a disk pool, see [Troubleshoot Azure disk pools (preview)](disks-pools-troubleshoot.md).
- [Attach disk pools to Azure VMware Solution hosts (Preview)](../azure-vmware/attach-disk-pools-to-azure-vmware-solution-hosts.md).
- [Manage a disk pool](disks-pools-manage.md).
