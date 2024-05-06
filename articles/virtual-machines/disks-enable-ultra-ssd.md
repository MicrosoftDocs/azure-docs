---
title: Ultra disks for VMs - Azure managed disks
description: Learn about Ultra Disks for Azure VMs
author: roygara
ms.service: azure-disk-storage
ms.topic: how-to
ms.date: 05/03/2024
ms.author: rogarana
ms.custom: references_regions, devx-track-azurecli, devx-track-azurepowershell, devx-track-arm-template
---

# Using Azure Ultra Disks

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

This article explains how to deploy and use an Ultra Disk, for conceptual information about Ultra Disks, refer to [What disk types are available in Azure?](disks-types.md#ultra-disks).

Azure Ultra Disks offer high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS virtual machines (VMs). This new offering provides top of the line performance at the same availability levels as our existing disks offerings. One major benefit of Ultra Disks is the ability to dynamically change the performance of the SSD along with your workloads without the need to restart your VMs. Ultra Disks are suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads.

## GA scope and limitations

[!INCLUDE [managed-disks-ultra-disks-GA-scope-and-limitations](../../includes/managed-disks-ultra-disks-GA-scope-and-limitations.md)]

## Determine VM size and region availability

### VMs using availability zones

To use Ultra Disks, you need to determine which availability zone you are in. Not every region supports every VM size with Ultra Disks. To determine if your region, zone, and VM size support Ultra Disks, run either of the following commands, make sure to replace the **region**, **vmSize**, and **subscriptionId** values first:

#### CLI

```azurecli
subscriptionId="<yourSubID>"
# Example value is southeastasia
region="<yourLocation>"
# Example value is Standard_E64s_v3
vmSize="<yourVMSize>"

az vm list-skus --resource-type virtualMachines --location $region --query "[?name=='$vmSize'].locationInfo[0].zoneDetails[0].Name" --subscription $subscriptionId
```

#### PowerShell

```powershell
# Example value is southeastasia
region = "<yourLocation>"
# Example value is Standard_E64s_v3
vmSize = "<yourVMSize>"
$sku = (Get-AzComputeResourceSku | where {$_.Locations.Contains($region) -and ($_.Name -eq $vmSize) -and $_.LocationInfo[0].ZoneDetails.Count -gt 0})
if($sku){$sku[0].LocationInfo[0].ZoneDetails} Else {Write-host "$vmSize is not supported with Ultra Disk in $region region"}
```

The response will be similar to the form below, where X is the zone to use for deploying in your chosen region. X could be either 1, 2, or 3.

Preserve the **Zones** value, it represents your availability zone and you'll need it in order to deploy an Ultra disk.

|ResourceType  |Name  |Location  |Zones  |Restriction  |Capability  |Value  |
|---------|---------|---------|---------|---------|---------|---------|
|disks     |UltraSSD_LRS         |eastus2         |X         |         |         |         |

> [!NOTE]
> If there was no response from the command, then the selected VM size is not supported with Ultra Disks in the selected region.

Now that you know which zone to deploy to, follow the deployment steps in this article to either deploy a VM with an Ultra Disk attached or attach an Ultra Disk to an existing VM.

### VMs with no redundancy options

Ultra disks deployed in select regions must be deployed without any redundancy options, for now. However, not every VM size that supports Ultra Disks are necessarily in these regions. To determine which VM sizes support Ultra Disks, use either of the following code snippets. Make sure to replace the `vmSize`, `region`, and `subscriptionId` values first:

```azurecli
subscriptionId="<yourSubID>"
# Example value is westus
region="<yourLocation>"
# Example value is Standard_E64s_v3
vmSize="<yourVMSize>"

az vm list-skus --resource-type virtualMachines --location $region --query "[?name=='$vmSize'].capabilities" --subscription $subscriptionId
```

```powershell
# Example value is westus
region = "<yourLocation>"
# Example value is Standard_E64s_v3
vmSize = "<yourVMSize>"
(Get-AzComputeResourceSku | where {$_.Locations.Contains($region) -and ($_.Name -eq $vmSize) })[0].Capabilities
```

The response will be similar to the following form, `UltraSSDAvailable   True` indicates whether the VM size supports Ultra Disks in this region.

```
Name                                         Value
----                                         -----
MaxResourceVolumeMB                          884736
OSVhdSizeMB                                  1047552
vCPUs                                        64
HyperVGenerations                            V1,V2
MemoryGB                                     432
MaxDataDiskCount                             32
LowPriorityCapable                           True
PremiumIO                                    True
VMDeploymentTypes                            IaaS
vCPUsAvailable                               64
ACUs                                         160
vCPUsPerCore                                 2
CombinedTempDiskAndCachedIOPS                128000
CombinedTempDiskAndCachedReadBytesPerSecond  1073741824
CombinedTempDiskAndCachedWriteBytesPerSecond 1073741824
CachedDiskBytes                              1717986918400
UncachedDiskIOPS                             80000
UncachedDiskBytesPerSecond                   1258291200
EphemeralOSDiskSupported                     True
AcceleratedNetworkingEnabled                 True
RdmaEnabled                                  False
MaxNetworkInterfaces                         8
UltraSSDAvailable                            True
```

## Deploy an Ultra Disk using Azure Resource Manager

First, determine the VM size to deploy. For a list of supported VM sizes, see the [GA scope and limitations](#ga-scope-and-limitations) section.

If you would like to create a VM with multiple Ultra Disks, refer to the sample [Create a VM with multiple Ultra Disks](https://aka.ms/ultradiskArmTemplate).

If you intend to use your own template, make sure that **apiVersion** for `Microsoft.Compute/virtualMachines` and `Microsoft.Compute/Disks` is set as `2018-06-01` (or later).

Set the disk sku to **UltraSSD_LRS**, then set the disk capacity, IOPS, availability zone, and throughput in MBps to create an Ultra Disk.

Once the VM is provisioned, you can partition and format the data disks and configure them for your workloads.


## Deploy an Ultra Disk

# [Portal](#tab/azure-portal)

This section covers deploying a virtual machine equipped with an Ultra Disk as a data disk. It assumes you have familiarity with deploying a virtual machine, if you don't, see our [Quickstart: Create a Windows virtual machine in the Azure portal](./windows/quick-create-portal.md).

1. Sign in to the [Azure portal](https://portal.azure.com/) and navigate to deploy a virtual machine (VM).
1. Make sure to choose a [supported VM size and region](#ga-scope-and-limitations).
1. Select **Availability zone** in **Availability options**.
1. Fill in the remaining entries with selections of your choice.
1. Select **Disks**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/new-ultra-vm-create.png" alt-text="Screenshot of vm creation flow, Basics blade." lightbox="media/virtual-machines-disks-getting-started-ultra-ssd/new-ultra-vm-create.png":::

1. On the Disks blade, select **Yes** for **Enable Ultra Disk compatibility**.
1. Select **Create and attach a new disk** to attach an Ultra disk now.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/new-ultra-vm-disk-enable.png" alt-text="Screenshot of vm creation flow, disk blade, Ultra Disk compatibility is enabled and create and attach a new disk is highlighted." :::

1. On the **Create a new disk** blade, enter a name, then select **Change size**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/new-ultra-create-disk.png" alt-text="Screenshot of create a new disk blade, change size highlighted.":::


1. Change the **Disk SKU** to **Ultra Disk**.
1. Change the values of **Custom disk size (GiB)**, **Disk IOPS**, and **Disk throughput** to ones of your choice.
1. Select **OK** in both blades.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/new-select-ultra-disk-size.png" alt-text="Screenshot of the select a disk size blade, Ultra Disk selected for storage type, other values highlighted.":::

1. Continue with the VM deployment, the same as you would deploy any other VM.

# [Azure CLI](#tab/azure-cli)

First, determine the VM size to deploy. See the [GA scope and limitations](#ga-scope-and-limitations) section for a list of supported VM sizes.

You must create a VM that is capable of using Ultra Disks, in order to attach an Ultra Disk.

Replace or set the **$vmName**, **$rgName**, **$diskName**, **$region**, **$password**, **$user** variables with your own values. Set **$zone** to the value of your availability zone that you got from the [start of this article](#determine-vm-size-and-region-availability). Then run the following CLI command to create an Ultra-enabled VM:

```azurecli-interactive
az disk create --subscription $subscriptionId -n $diskName -g $rgName --size-gb 1024 --location $region --sku UltraSSD_LRS --disk-iops-read-write 8192 --disk-mbps-read-write 400
az vm create --subscription $subscriptionId -n $vmName -g $rgName --image Win2016Datacenter --ultra-ssd-enabled true --zone $zone --authentication-type password --admin-password $password --admin-username $user --size Standard_D4s_v3 --location $region --attach-data-disks $diskName
```

# [PowerShell](#tab/azure-powershell)

First, determine the VM size to deploy. See the [GA scope and limitations](#ga-scope-and-limitations) section for a list of supported VM sizes.

To use Ultra Disks, you must create a VM that is capable of using Ultra Disks. Replace or set the **$rgName**, **$vmName**, **$region** variables with your own values. Set **$zone** to the value of your availability zone that you got from the [start of this article](#determine-vm-size-and-region-availability). Then run the following [New-AzVm](/powershell/module/az.compute/new-azvm) command to create an Ultra-enabled VM:

```powershell
New-AzVm `
    -ResourceGroupName $rgName `
    -Name $vmName `
    -Location $region `
    -Image "Win2016Datacenter" `
    -EnableUltraSSD `
    -Size "Standard_D4s_v3" `
    -Zone $zone
```

### Create and attach the disk

Once your VM has been deployed, you can create and attach an Ultra Disk to it, use the following script:

```powershell
# Set parameters and select subscription
$subscriptionId = "<yourSubscriptionID>"
$rgName = "<yourResourceGroup>"
$vmName = "<yourVMName>"
$diskName = "<yourDiskName>"
$lun = 1
Connect-AzAccount -SubscriptionId $subscriptionId

# Create the disk
$diskConfig = New-AzDiskConfig `
    -Location $region `
    -DiskSizeGB 8 `
    -DiskIOPSReadWrite 1000 `
    -DiskMBpsReadWrite 100 `
    -AccountType UltraSSD_LRS `
    -CreateOption Empty `
    -Zone $zone

New-AzDisk `
    -ResourceGroupName $rgName `
    -DiskName $diskName `
    -Disk $diskConfig

# Add disk to VM
$vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
$disk = Get-AzDisk -ResourceGroupName $rgName -Name $diskName
$vm = Add-AzVMDataDisk -VM $vm -Name $diskName -CreateOption Attach -ManagedDiskId $disk.Id -Lun $lun
Update-AzVM -VM $vm -ResourceGroupName $rgName
```

---

## Deploy an Ultra Disk - 512-byte sector size

# [Portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com/), then search for and select **Disks**.
1. Select **+ New** to create a new disk.
1. Select a region that supports Ultra Disks and select an availability zone, fill in the rest of the values as you desire.
1. Select **Change size**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/create-managed-disk-basics-workflow.png" alt-text="Screenshot of create disk blade, region, availability zone, and change size highlighted.":::

1. For **Disk SKU** select **Ultra Disk**, then fill in the values for the desired performance and select **OK**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/select-disk-size-ultra.png" alt-text="Screenshot of creating Ultra Disk.":::

1. On the **Basics** blade, select the **Advanced** tab.
1. Select **512** for **Logical sector size**, then select **Review + Create**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/select-different-sector-size-ultra.png" alt-text="Screenshot of selector for changing the Ultra Disk logical sector size to 512.":::

# [Azure CLI](#tab/azure-cli)

First, determine the VM size to deploy. See the [GA scope and limitations](#ga-scope-and-limitations) section for a list of supported VM sizes.

You must create a VM that is capable of using Ultra Disks in order to attach an Ultra Disk.

Replace or set the **$vmName**, **$rgName**, **$diskName**, **$region**, **$password**, **$user** variables with your own values. Set **$zone** to the value of your availability zone that you got from the [start of this article](#determine-vm-size-and-region-availability). Then run the following CLI command to create a VM with an Ultra Disk that has a 512-byte sector size:

```azurecli
# Create an ultra disk with 512-byte sector size
az disk create --subscription $subscriptionId -n $diskName -g $rgName --size-gb 1024 --location $region --sku UltraSSD_LRS --disk-iops-read-write 8192 --disk-mbps-read-write 400 --logical-sector-size 512
az vm create --subscription $subscriptionId -n $vmName -g $rgName --image Win2016Datacenter --ultra-ssd-enabled true --zone $zone --authentication-type password --admin-password $password --admin-username $user --size Standard_D4s_v3 --location $region --attach-data-disks $diskName
```

# [PowerShell](#tab/azure-powershell)

First, determine the VM size to deploy. See the [GA scope and limitations](#ga-scope-and-limitations) section for a list of supported VM sizes.

To use Ultra Disks, you must create a VM that is capable of using Ultra Disks. Replace or set the **$rgName**, **$vmName**, **$region** variables with your own values. Set **$zone** to the value of your availability zone that you got from the [start of this article](#determine-vm-size-and-region-availability). Then run the following [New-AzVm](/powershell/module/az.compute/new-azvm) command to create an Ultra-enabled VM:

```powershell
New-AzVm `
    -ResourceGroupName $rgName `
    -Name $vmName `
    -Location $region `
    -Image "Win2016Datacenter" `
    -EnableUltraSSD `
    -Size "Standard_D4s_v3" `
    -Zone $zone
```

To create and attach an Ultra Disk that has a 512-byte sector size, you can use the following script:

```powershell
# Set parameters and select subscription
$subscriptionId = "<yourSubscriptionID>"
$rgName = "<yourResourceGroup>"
$vmName = "<yourVMName>"
$diskName = "<yourDiskName>"
$lun = 1
Connect-AzAccount -SubscriptionId $subscriptionId

# Create the disk
$diskConfig = New-AzDiskConfig `
    -Location $region `
    -DiskSizeGB 8 `
    -DiskIOPSReadWrite 1000 `
    -DiskMBpsReadWrite 100 `
    -LogicalSectorSize 512 `
    -AccountType UltraSSD_LRS `
    -CreateOption Empty `
    -Zone $zone

New-AzDisk `
    -ResourceGroupName $rgName `
    -DiskName $diskName `
    -Disk $diskConfig

# Add disk to VM
$vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
$disk = Get-AzDisk -ResourceGroupName $rgName -Name $diskName
$vm = Add-AzVMDataDisk -VM $vm -Name $diskName -CreateOption Attach -ManagedDiskId $disk.Id -Lun $lun
Update-AzVM -VM $vm -ResourceGroupName $rgName
```
---
## Attach an Ultra Disk

# [Portal](#tab/azure-portal)

Alternatively, if your existing VM is in a region/availability zone that is capable of using Ultra Disks, you can make use of Ultra Disks without having to create a new VM. By enabling Ultra Disks on your existing VM, then attaching them as data disks. To enable Ultra Disk compatibility, you must stop the VM. After you stop the VM, you can enable compatibility, then restart the VM. Once compatibility is enabled, you can attach an Ultra Disk:

1. Navigate to your VM and stop it, wait for it to deallocate.
1. Once your VM has been deallocated, select **Disks**.
1. Select **Additional settings**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/new-ultra-disk-additional-settings.png" alt-text="Screenshot of the disk blade, additional settings highlighted.":::

1. Select **Yes** for **Enable Ultra Disk compatibility**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/enable-ultra-disks-existing-vm.png" alt-text="Screenshot of enable Ultra Disk compatibility.":::

1. Select **Save**.
1. Select **Create and attach a new disk** and fill in a name for your new disk.
1. For **Storage type** select **Ultra Disk**.
1. Change the values of **Size (GiB)**, **Max IOPS**, and **Max throughput** to ones of your choice.
1. After you're returned to your disk's blade, select **Save**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/new-create-ultra-disk-existing-vm.png" alt-text="Screenshot of disk blade, adding a new Ultra Disk.":::

1. Start your VM again.

# [Azure CLI](#tab/azure-cli)

Alternatively, if your existing VM is in a region/availability zone that is capable of using Ultra Disks, you can make use of Ultra Disks without having to create a new VM.

### Enable Ultra Disk compatibility on an existing VM - CLI

If your VM meets the requirements outlined in [GA scope and limitations](#ga-scope-and-limitations) and is in the [appropriate zone for your account](#determine-vm-size-and-region-availability), then you can enable Ultra Disk compatibility on your VM.

To enable Ultra Disk compatibility, you must stop the VM. After you stop the VM, you can enable compatibility, then restart the VM. Once compatibility is enabled, you can attach an Ultra Disk:

```azurecli
az vm deallocate -n $vmName -g $rgName
az vm update -n $vmName -g $rgName --ultra-ssd-enabled true
az vm start -n $vmName -g $rgName
```

### Create an Ultra Disk - CLI

Now that you have a VM that is capable of attaching Ultra Disks, you can create and attach an Ultra Disk to it.

```azurecli-interactive
subscriptionId="<yourSubscriptionID>"
rgName="<yourResourceGroupName>"
vmName="<yourVMName>"
diskName="<yourDiskName>"

# Create an Ultra disk
az disk create `
--subscription $subscriptionId `
-n $diskName `
-g $rgName `
--size-gb 4 `
--location $region `
--zone $zone `
--sku UltraSSD_LRS `
--disk-iops-read-write 1000 `
--disk-mbps-read-write 50
```

### Attach the disk - CLI

```azurecli
subscriptionId="<yourSubscriptionID>"
rgName="<yourResourceGroupName>"
vmName="<yourVMName>"
diskName="<yourDiskName>"

az vm disk attach -g $rgName --vm-name $vmName --disk $diskName --subscription $subscriptionId
```

# [PowerShell](#tab/azure-powershell)

Alternatively, if your existing VM is in a region/availability zone that is capable of using Ultra Disks, you can make use of Ultra Disks without having to create a new VM.

### Enable Ultra Disk compatibility on an existing VM - PowerShell

If your VM meets the requirements outlined in [GA scope and limitations](#ga-scope-and-limitations) and is in the [appropriate zone for your account](#determine-vm-size-and-region-availability), then you can enable Ultra Disk compatibility on your VM.

To enable Ultra Disk compatibility, you must stop the VM. After you stop the VM, you can enable compatibility, then restart the VM. Once compatibility is enabled, you can attach an Ultra disk:

```powershell
# Stop the VM
Stop-AzVM -Name $vmName -ResourceGroupName $rgName
# Enable Ultra Disk compatibility
$vm = Get-AzVM -name $vmName -ResourceGroupName $rgName
Update-AzVM -ResourceGroupName $rgName -VM $vm -UltraSSDEnabled $True
# Start the VM
Start-AzVM -Name $vmName -ResourceGroupName $rgName
```

### Create and attach an Ultra Disk - PowerShell

Now that you have a VM that is capable of using Ultra Disks, you can create and attach an Ultra Disk to it:

```powershell
# Set parameters and select subscription
$subscriptionId = "<yourSubscriptionID>"
$rgName = "<yourResourceGroup>"
$vmName = "<yourVMName>"
$diskName = "<yourDiskName>"
$lun = 1
Connect-AzAccount -SubscriptionId $subscriptionId

# Create the disk
$diskConfig = New-AzDiskConfig `
    -Location $location `
    -DiskSizeGB 8 `
    -DiskIOPSReadWrite 1000 `
    -DiskMBpsReadWrite 100 `
    -AccountType UltraSSD_LRS `
    -CreateOption Empty `
    -zone $zone

New-AzDisk `
    -ResourceGroupName $rgName `
    -DiskName $diskName `
    -Disk $diskConfig

# Add disk to VM
$vm = Get-AzVM -ResourceGroupName $rgName -Name $vmName
$disk = Get-AzDisk -ResourceGroupName $rgName -Name $diskName
$vm = Add-AzVMDataDisk -VM $vm -Name $diskName -CreateOption Attach -ManagedDiskId $disk.Id -Lun $lun
Update-AzVM -VM $vm -ResourceGroupName $rgName
```

---
## Adjust the performance of an Ultra Disk

# [Portal](#tab/azure-portal)

Ultra Disks offer a unique capability that allows you to adjust their performance. You can adjust the performance of an Ultra Disk four times within a 24 hour period.

1. Navigate to your VM and select **Disks**.
1. Select the Ultra Disk you'd like to modify the performance of.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/select-ultra-disk-to-modify.png" alt-text="Screenshot of disks blade on your vm, Ultra Disk is highlighted.":::

1. Select **Size + performance** and then make your modifications.
1. Select **Save**.

    :::image type="content" source="media/virtual-machines-disks-getting-started-ultra-ssd/modify-ultra-disk-performance.png" alt-text="Screenshot of configuration blade on your Ultra Disk, disk size, iops, and throughput are highlighted, save is highlighted.":::

# [Azure CLI](#tab/azure-cli)

Ultra Disks offer a unique capability that allows you to adjust their performance. You can adjust the performance of an Ultra Disk four times within a 24 hour period. The following command depicts how to use this feature:

```azurecli-interactive
az disk update --subscription $subscriptionId --resource-group $rgName --name $diskName --disk-iops-read-write=5000 --disk-mbps-read-write=200
```

# [PowerShell](#tab/azure-powershell)

## Adjust the performance of an Ultra Disk using PowerShell

Ultra Disks have a unique capability that allows you to adjust their performance. You can adjust the performance of an Ultra Disk four times within a 24 hour period. The following command is an example that adjusts the performance without having to detach the disk:

```powershell
$diskUpdateConfig = New-AzDiskUpdateConfig -DiskMBpsReadWrite 2000
Update-AzDisk -ResourceGroupName $rgName -DiskName $diskName -DiskUpdate $diskUpdateConfig
```
---

## Next steps

- [Use Azure Ultra Disks on Azure Kubernetes Service (preview)](../aks/use-ultra-disks.md).
- [Migrate log disk to an Ultra Disk](/azure/azure-sql/virtual-machines/windows/storage-migrate-to-ultradisk).
- For more questions on Ultra Disks, see the [Ultra Disks](faq-for-disks.yml#ultra-disks) section of the FAQ.
