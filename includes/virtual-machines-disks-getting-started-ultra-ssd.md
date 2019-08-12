---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 05/10/2019
 ms.author: rogarana
 ms.custom: include file
---

# Deploy Azure ultra disks

Azure ultra disks offer high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS virtual machines (VMs). This new offering provides top of the line performance at the same availability levels as our existing disks offerings. One major benefit of ultra disks is the ability to dynamically change the performance of the SSD along with your workloads without the need to restart your VMs. Ultra disks are suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads.

## Determine your availability zone

Once approved, you need to determine which availability zone you are in, in order to use ultra disks. Run either of the following commands to determine which zone to deploy your ultra disk to:

PowerShell: `Get-AzComputeResourceSku | where {$_.ResourceType -eq "disks" -and $_.Name -eq "UltraSSD_LRS" }`

CLI: `az vm list-skus --resource-type disks --query "[?name=='UltraSSD_LRS'].locationInfo"`

The response will be similar to the form below, where X is the zone to use for deploying in your chosen region. X could be either 1, 2, or 3. Currently, only three regions support ultra disks, they are: East US 2, SouthEast Asia, and North Europe.

Preserve the **Zones** value, it represents your availability zone and you will need it in order to deploy an Ultra disk.

|ResourceType  |Name  |Location  |Zones  |Restriction  |Capability  |Value  |
|---------|---------|---------|---------|---------|---------|---------|
|disks     |UltraSSD_LRS         |eastus2         |X         |         |         |         |

> [!NOTE]
> If there was no response from the command, then your registration to the feature is either still pending, or not approved yet.

Now that you know which zone to deploy to, follow the deployment steps in this article to deploy a VM with an ultra disk attached.

## Deploy an Ultra disk using Azure Resource Manager

First, determine the VM size to deploy. For now, only DsV3 and EsV3 VM families support ultra disks. Refer to the second table on this [blog](https://azure.microsoft.com/blog/introducing-the-new-dv3-and-ev3-vm-sizes/) for additional details about these VM sizes.

If you would like to create a VM with multiple ultra disks, refer to the sample [Create a VM with multiple ultra disks](https://aka.ms/UltraSSDTemplate).

If you intend to use your own template, make sure that **apiVersion** for `Microsoft.Compute/virtualMachines` and `Microsoft.Compute/Disks` is set as `2018-06-01` (or later).

Set the disk sku to **UltraSSD_LRS**, then set the disk capacity, IOPS, availability zone, and throughput in MBps to create an ultra disk.

Once the VM is provisioned, you can partition and format the data disks and configure them for your workloads.

## Deploy an ultra disk using CLI

First, determine the VM size to deploy. For now, only DsV3 and EsV3 VM families support ultra disks. Refer to the second table on this [blog](https://azure.microsoft.com/blog/introducing-the-new-dv3-and-ev3-vm-sizes/) for additional details about these VM sizes.

You must create a VM that is capable of using ultra disks, in order to attach an ultra disk.

Replace or set the **$vmname**, **$rgname**, **$diskname**, **$location**, **$password**, **$user** variables with your own values. Set **$zone**  to the value of your availability zone that you got from the [start of this article](#determine-your-availability-zone). Then run the following CLI command to create an ultra enabled VM:

```azurecli-interactive
az vm create --subscription $subscription -n $vmname -g $rgname --image Win2016Datacenter --ultra-ssd-enabled true --zone $zone --authentication-type password --admin-password $password --admin-username $user --attach-data-disks $diskname --size Standard_D4s_v3 --location $location
```

### Create an ultra disk using CLI

Now that you have a VM that is capable of attaching ultra disks, you can create and attach an ultra disk to it.

```azurecli-interactive
location="eastus2"
subscription="xxx"
rgname="ultraRG"
diskname="ssd1"
vmname="ultravm1"
zone=123

#create an ultra disk
az disk create `
--subscription $subscription `
-n $diskname `
-g $rgname `
--size-gb 4 `
--location $location `
--zone $zone `
--sku UltraSSD_LRS `
--disk-iops-read-write 1000 `
--disk-mbps-read-write 50
```

### Adjust the performance of an ultra disk using CLI

Ultra disks offer a unique capability that allows you to adjust their performance, the following command depicts how to use this feature:

```azurecli-interactive
az disk update `
--subscription $subscription `
--resource-group $rgname `
--name $diskName `
--set diskIopsReadWrite=80000 `
--set diskMbpsReadWrite=800
```

## Deploy an ultra disk using PowerShell

First, determine the VM size to deploy. For now, only DsV3 and EsV3 VM families support ultra disks. Refer to the second table on this [blog](https://azure.microsoft.com/blog/introducing-the-new-dv3-and-ev3-vm-sizes/) for additional details about these VM sizes.

To use ultra disks, you must create a VM that is capable of using ultra disks. Replace or set the **$resourcegroup** and **$vmName** variables with your own values. Set **$zone** to the value of your availability zone that you got from the [start of this article](#determine-your-availability-zone). Then run the following [New-AzVm](/powershell/module/az.compute/new-azvm) command to create an ultra enabled VM:

```powershell
New-AzVm `
    -ResourceGroupName $resourcegroup `
    -Name $vmName `
    -Location "eastus2" `
    -Image "Win2016Datacenter" `
    -EnableUltraSSD `
    -size "Standard_D4s_v3" `
    -zone $zone
```

### Create an ultra disk using PowerShell

Now that you have a VM that is capable of using ultra disks, you can create and attach an ultra disk to it:

```powershell
$diskconfig = New-AzDiskConfig `
-Location 'EastUS2' `
-DiskSizeGB 8 `
-DiskIOPSReadWrite 1000 `
-DiskMBpsReadWrite 100 `
-AccountType UltraSSD_LRS `
-CreateOption Empty `
-zone $zone;

New-AzDisk `
-ResourceGroupName $resourceGroup `
-DiskName 'Disk02' `
-Disk $diskconfig;
```

### Adjust the performance of an ultra disk using PowerShell

Ultra disks have a unique capability that allows you to adjust their performance, the following command is an example that adjusts the performance without having to detach the disk:

```powershell
$diskupdateconfig = New-AzDiskUpdateConfig -DiskMBpsReadWrite 2000
Update-AzDisk -ResourceGroupName $resourceGroup -DiskName $diskName -DiskUpdate $diskupdateconfig
```

## Next steps

If you would like to try the new disk type [request access to the preview with this survey](https://aka.ms/UltraSSDPreviewSignUp).