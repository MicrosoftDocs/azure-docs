---
title: Azure portal - Restrict import/export access to managed disks with Private Links
description: Enable Private Links for your managed disks with Azure portal. Allowing you to securely export and import disks within your virtual network.
author: roygara
ms.service: storage
ms.topic: overview
ms.date: 07/15/2021
ms.author: rogarana
ms.subservice: disks
ms.custom: references_regions
---

# Restrict import/export access for managed disks using Private Link

You can use [private endpoints](../../private-link/private-endpoint-overview.md) to restrict the export and import of managed disks and securely access data over a [Private Link](../../private-link/private-link-overview.md) from clients on your Azure virtual network. The private endpoint uses an IP address from the virtual network address space for your managed disks service. Network traffic between clients on their virtual network and managed disks only traverses over the virtual network and a private link on the Microsoft backbone network, eliminating exposure from the public internet.

To use Private Links to export/import managed disks, first you create a disk access resource and link it to a virtual network in the same subscription by creating a private endpoint. Then, associate a disk or a snapshot with an instance of disk access. Finally, set the NetworkAccessPolicy property of the disk or the snapshot to `AllowPrivate`. This will limit access to your virtual network. 

You can set the NetworkAccessPolicy property to `DenyAll` to prevent anybody from exporting data of a disk or a snapshot. The default value for the NetworkAccessPolicy property is `AllowAll`.

## Limitations

[!INCLUDE [virtual-machines-disks-private-links-limitations](../../includes/virtual-machines-disks-private-links-limitations.md)]

Before you can use Private Links to export/import managed disks, you must:

1. Create a disk access resource.
1. Link your disk access resource to a virtual network in the same subscription by creating a private endpoint. 
1. Associate a disk or a snapshot with an instance of disk access.
1. Set the NetworkAccessPolicy property of the disk or the snapshot to `AllowPrivate`. This will limit access to your virtual network.

## Create a disk access resource

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal and navigate to **Disk Accesses** with [this link](https://aka.ms/disksprivatelinks).

> [!IMPORTANT]
> You must use the [provided link](https://aka.ms/disksprivatelinks) to navigate to the Disk Accesses pane. It is not currently visible in the public portal without using the link.

1. Select **+ Create** to create a new disk access resource.
1. On the **Create a disk access** pane, select your subscription and a resource group. In the **Instance details** group, enter a name and select a region.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-create-basics.png" alt-text="Screenshot of disk access creation pane. Fill in the desired name, select a region, select a resource group, and proceed":::

1. Select **Review + create**.

When your resource has been created, navigate directly to it.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/screenshot-resource-button.png" alt-text="Screenshot of the Go to resource button in the portal":::

# [PowerShell](#tab/azure-powershell)

```PowerShell
Insert-Content -Name Az -AllowClobber -Scope CurrentUser
```

# [Azure CLI](#tab/azure-cli)

Before you create your disk access resource, you should log into your subscription and set your variables.

```azurecli-interactive
subscriptionId=yourSubscriptionId
resourceGroupName=yourResourceGroupName
region=northcentralus
diskAccessName=yourDiskAccessForPrivateLinks
vnetName=yourVNETForPrivateLinks
subnetName=yourSubnetForPrivateLinks
privateEndPointName=yourPrivateLinkForSecureMDExportImport
privateEndPointConnectionName=yourPrivateLinkConnection
      
#The name of an existing disk which is the source of the snapshot
sourceDiskName=yourSourceDiskForSnapshot
        
#The name of the new snapshot which will be secured via Private Links
snapshotNameSecuredWithPL=yourSnapshotNameSecuredWithPL
        
az login

az account set --subscription $subscriptionId
        
```

Now that the variables are set, you can proceed with the creation of the disk access resource.

```azurecli
az disk-access create -n $diskAccessName -g $resourceGroupName -l $region

diskAccessId=$(az disk-access show -n $diskAccessName -g $resourceGroupName --query [id] -o tsv)
```

---

## Create a Virtual Network (not needed for Azure portal)

# [Portal](#tab/azure-portal)

There’s no corresponding step for this in the Portal article – maybe because a vnet is automagically created when a VM is created, and because creating a private endpoint associates this behind the scene? Regardless of this, should we consider adding that here to maintain consistency? Or should we add aped “(not required for Portal)” in the heading?

# [PowerShell](#tab/azure-powershell)

```PowerShell
Insert-Content -Name Az -AllowClobber -Scope CurrentUser
```

# [Azure CLI](#tab/azure-cli)

Network policies like network security groups (NSG) are not supported for private endpoints. In order to deploy a Private Endpoint on a given subnet, an explicit disable setting is required on that subnet. 

```azurecli
az network vnet create --resource-group $resourceGroupName \
--name $vnetName \
--subnet-name $subnetName
```

Azure deploys resources to a subnet within a virtual network, so you need to update the subnet to disable private endpoint network policies. 

```azurecli
az network vnet subnet update --resource-group $resourceGroupName \
--name $subnetName  \
--vnet-name $vnetName \
--disable-private-endpoint-network-policies true
```

---

## Portal: Create a private endpoint for disk access

# [Portal](#tab/azure-portal)

Next, you'll need to create a private endpoint and configure it for disk access.

1. From your disk access resource, in the **Settings** group, select **Private endpoint connections**.
1. Select **+ Private endpoint**.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-main-private-blade.png" alt-text="Screenshot of the overview pane for your disk access resource. Private endpoint connections is highlighted.":::

1. In the **Create a private endpoint** pane, select a resource group.
1. Provide a name and select the same region in which your disk access resource was created.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-first-blade.png" alt-text="Screenshot of the private endpoint creation workflow, first pane. If you do not select the appropriate region then you may encounter issues later on.":::

1. Select **Next: Resource**.
1. On the **Resource** pane, select **Connect to an Azure resource in my directory**.
1. For **Resource type** select **Microsoft.Compute/diskAccesses**.
1. For **Resource** select the disk access resource you created earlier.
1. Leave the **Target sub-resource** as **disks**.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-second-blade.png" alt-text="Screenshot of the private endpoint creation workflow, second pane. With all the values highlighted (Resource type, Resource, Target sub-resource)":::

1. Select **Next : Configuration**.
1. Select the virtual network to which you will limit disk import and export. This prevents the import and export of your disk to other virtual networks.

> [!NOTE]
> If you have a network security group (NGS) enabled for the selected subnet, it will be disabled for private endpoints on this subnet only. Other resources on this subnet will retain NSG enforcement.

1. Select the appropriate subnet.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-private-endpoint-third-blade.png" alt-text="Screenshot of the private endpoint creation workflow, third pane. Virtual network and subnet emphasized.":::

1. Select **Review + create**.

# [PowerShell](#tab/azure-powershell)

```PowerShell
Insert-Content -Name Az -AllowClobber -Scope CurrentUser
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az network private-endpoint create --resource-group $resourceGroupName \
--name $privateEndPointName \
--vnet-name $vnetName  \
--subnet $subnetName \
--private-connection-resource-id $diskAccessId \
--group-ids disks \
--connection-name $privateEndPointConnectionName
```

Now configure the Private DNS Zone. Create a Private DNS Zone for Storage blob domain, create an association link with the Virtual Network and create a DNS Zone Group to associate the private endpoint with the Private DNS Zone. 

```azurecli
az network private-dns zone create --resource-group $resourceGroupName \
--name "privatelink.blob.core.windows.net"

az network private-dns link vnet create --resource-group $resourceGroupName \
--zone-name "privatelink.blob.core.windows.net" \
--name yourDNSLink \
--virtual-network $vnetName \
--registration-enabled false

az network private-endpoint dns-zone-group create \
--resource-group $resourceGroupName \
--endpoint-name $privateEndPointName \
--name yourZoneGroup \
--private-dns-zone "privatelink.blob.core.windows.net" \
--zone-name disks
```

---

## Portal: Enable private endpoint on your disk
## CLI: Create a disk protected with Private Links

# [Portal](#tab/azure-portal)

1. Navigate to the disk you'd like to configure.
1. Under **Settings**, select **Networking**.
1. Select **Private endpoint (through disk access)** and select the disk access you created earlier.

:::image type="content" source="media/disks-enable-private-links-for-import-export-portal/disk-access-managed-disk-networking-blade.png" alt-text="Screenshot of the managed disk networking pane. Highlighting the private endpoint selection as well as the selected disk access. Saving this configures your disk for this access.":::

1. Select **Save**.

You've now configured a private link that you can use to import and export your managed disk.

# [PowerShell](#tab/azure-powershell)

```PowerShell
Insert-Content -Name Az -AllowClobber -Scope CurrentUser
```

# [Azure CLI](#tab/azure-cli)

First, create a disk protected with Private Links

```azurecli-interactive
resourceGroupName=yourResourceGroupName
region=northcentralus
diskAccessName=yourDiskAccessName
diskName=yourDiskName
diskSkuName=Standard_LRS
diskSizeGB=128

diskAccessId=$(az resource show -n $diskAccessName -g $resourceGroupName --namespace Microsoft.Compute --resource-type diskAccesses --query [id] -o tsv)

az disk create -n $diskName \
-g $resourceGroupName \
-l $region \
--size-gb $diskSizeGB \
--sku $diskSkuName \
--network-access-policy AllowPrivate \
--disk-access $diskAccessId 
```

Now create a snapshot of a disk protected with Private Links

```azurecli-interactive
resourceGroupName=yourResourceGroupName
region=northcentralus
diskAccessName=yourDiskAccessName
sourceDiskName=yourSourceDiskForSnapshot
snapshotNameSecuredWithPL=yourSnapshotName

diskId=$(az disk show -n $sourceDiskName -g $resourceGroupName --query [id] -o tsv)

diskAccessId=$(az resource show -n $diskAccessName -g $resourceGroupName --namespace Microsoft.Compute --resource-type diskAccesses --query [id] -o tsv)

az snapshot create -n $snapshotNameSecuredWithPL \
-g $resourceGroupName \
-l $region \
--source $diskId \
--network-access-policy AllowPrivate \
--disk-access $diskAccessId 
```

---

## Additional content not fitting elsewhere

**
You can generate a time-bound Shared Access Signature (SAS) URI for unattached managed disks and snapshots which can be used to:
- Export the data to other region for regional expansion.
- Configure disaster recovery and business continuity policies.
- Read data for forensic analysis.
- Upload a VHD to an empty disk from your on-premises network.

Network traffic between clients on their virtual network and managed disks does not traverse the public internet. It is limited to the clients' virtual network and a private link on the Microsoft backbone network.

You can create a disk access resource and link it to your virtual network in the same subscription by creating a private endpoint. You must associate a disk or a snapshot with a disk access to export and import the data through a private link.
**

## Next steps - Portal

- Upload a VHD to Azure or copy a managed disk to another region - [Azure CLI](linux/disks-upload-vhd-to-managed-disk-cli.md) or [Azure PowerShell module](windows/disks-upload-vhd-to-managed-disk-powershell.md)
- Download a VHD - [Windows](windows/download-vhd.md) or [Linux](linux/download-vhd.md)
- [FAQ for private links and managed disks](/azure/virtual-machines/faq-for-disks#private-links-for-securely-exporting-and-importing-managed-disks)
- [Export/Copy managed snapshots as VHD to a storage account in different region with PowerShell](/previous-versions/azure/virtual-machines/scripts/virtual-machines-powershell-sample-copy-snapshot-to-storage-account)

## Next steps - CLI

- Upload a VHD to Azure or copy a managed disk to another region - [Azure CLI](disks-upload-vhd-to-managed-disk-cli.md) or [Azure PowerShell module](../windows/disks-upload-vhd-to-managed-disk-powershell.md)
- Download a VHD - [Windows](../windows/download-vhd.md) or [Linux](download-vhd.md)
- [FAQ on Private Links](/azure/virtual-machines//faq-for-disks#private-links-for-securely-exporting-and-importing-managed-disks)
- [Export/Copy managed snapshots as VHD to a storage account in different region with CLI](/previous-versions/azure/virtual-machines/scripts/virtual-machines-cli-sample-copy-managed-disks-vhd)
