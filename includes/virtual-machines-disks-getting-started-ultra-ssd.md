---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/24/2018
 ms.author: rogarana
 ms.custom: include file
---

# Enabling Azure ultra SSDs

Azure ultra SSD deliver high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. This new offering provides top of the line performance at the same availability levels as our existing disks offerings. Additional benefits of ultra SSD include the ability to dynamically change the performance of the disk along with your workloads without the need to restart your virtual machines. Ultra SSD are suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads.

Currently, ultra SSD are in preview and you must [enroll](https://aka.ms/UltraSSDPreviewSignUp) in the preview in order to access them.

Once approved, run one of the following commands to determine which zone in East US 2 to deploy your ultra disk to:

PowerShell: `Get-AzComputeResourceSku | where {$_.ResourceType -eq "disks" -and $_.Name -eq "UltraSSD_LRS" }`

CLI: `az vm list-skus --resource-type disks --query “[?name==UltraSSD_LRS]”`

The response will be similar to the form below, where X is the Zone to use for deploying in East US 2. X could be either 1, 2, or 3.

|ResourceType  |Name  |Location  |Zones  |Restriction  |Capability  |Value  |
|---------|---------|---------|---------|---------|---------|---------|
|disks     |UltraSSD_LRS         |eastus2         |X         |         |         |         |

If there was no response from the command, that means your registration to the feature is either still pending, or not approved yet.

Now that you know which zone to deploy to, follow the deployment steps in this article to get your first VMs deployed with ultra SSD.

## Deploying an ultra SSD using ARM

First, determine the VM Size to deploy. As part of this preview, only DsV3 and EsV3 VM families are supported. Refer to the second table on this [blog](https://azure.microsoft.com/blog/introducing-the-new-dv3-and-ev3-vm-sizes/) for additional details about these VM sizes.
Also refer to the sample [Create a VM with multiple ultra SSD](https://aka.ms/UltraSSDTemplate), which shows how to create a VM with multiple ultra SSD.

The following describe the new/modified Resource Manager template changes:
**apiVersion** for `Microsoft.Compute/virtualMachines` and `Microsoft.Compute/Disks` must be set as `2018-06-01` (or later).

Specify Disk Sku UltraSSD_LRS, disk capacity, IOPS, and throughput in MBps to create an ultra disk. The following is an example that creates a disk with 1,024 GiB (GiB = 2^30 Bytes), 80,000 IOPS, and 1,200 MBps  (MBps = 10^6 Bytes per second):

```json
"properties": {  
    "creationData": {  
    "createOption": "Empty"  
},  
"diskSizeGB": 1024,  
"diskIOPSReadWrite": 80000,  
"diskMBpsReadWrite": 1200,  
}
```

Add an additional capability on the properties of the VM to indicate its ultra enabled (refer to the [sample](https://aka.ms/UltraSSDTemplate) for the full Resource Manager template):

```json
{
    "apiVersion": "2018-06-01",
    "type": "Microsoft.Compute/virtualMachines",
    "properties": {
                    "hardwareProfile": {},
                    "additionalCapabilities" : {
                                    "ultraSSDEnabled" : "true"
                    },
                    "osProfile": {},
                    "storageProfile": {},
                    "networkProfile": {}
    }
}
```

Once the VM is provisioned, you can partition and format the data disks and configure them for your workloads.

## Deploying an ultra SSD using CLI

### Deploying an ultra SSD enabled VM with a disk attached using CLI

In order to use ultra SSDs, you must create a VM which is capable of using ultra SSDs. Replace or set the variables with your own values and then run the following CLI command to create one such VM:

```azurecli-interactive
az vm create --subscription $subscription -n $vmname -g $rgname --image Win2016Datacenter --ultra-ssd-enabled --zone $zone --authentication-type password --admin-password xxxx --admin-username ultrauser --attach-data-disks $diskname --size Standard_D4s_v3 --location $location
```

### Creating an ultra SSD using CLI

Now that you have a VM which is capable of using ultra SSDs, you can create and attach an ultra SSD to it.

```azurecli-interactive
location="eastus2"
subscription="xxx"
rgname="ultraRG"
diskname="ssd1"
vmname="ultravm1"
zone=123

#create an Ultra SSD disk
az disk create --subscription $subscription -n $diskname -g $rgname --size-gb 4 --location $location --zone $zone --sku UltraSSD_LRS --disk-iops-read-write 1000 --disk-mbps-read-write 50
```

### Adjust the performance of an ultra SSD using CLI

Ultra SSDs offer a unique capability which allows you to adjust their performance, the following command depicts how to use this feature:

```azurecli-interactive
az disk update --subscription $sub --resource-group $resourceGroup --name $diskName --set diskIopsReadWrite=80000 --set diskMbpsReadWrite=800
```

## Deploying an ultra SSD using PowerShell

In order to use ultra SSDs, you must create a VM which is capable of using ultra SSDs. Replace or set the variables with your own values and then run the following PowerShell command to create one such VM:

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

### Create an ultra SSD using PowerShell

Now that you have a VM which is capable of using ultra SSDs, you can create and attach an ultra SSD to it:

```powershell
New-AzDiskConfig -Location 'EastUS2' -DiskSizeGB 8 -DiskIOPSReadWrite 1000 -DiskMBpsReadWrite 100 -AccountType UltraSSD_LRS -CreateOption Empty -zone 3;
New-AzDisk -ResourceGroupName $resourceGroup -DiskName 'Disk02' -Disk $diskconfig;
```

### Adjust the performance of an ultra SSD using PowerShell

Ultra SSDs have a unique capability which allows you to adjust their performance, the following command depicts how to use this feature:

```powershell
$diskupdateconfig = New-AzDiskUpdateConfig -DiskMBpsReadWrite 2000
Update-AzDisk -ResourceGroupName $resourceGroup -DiskName $diskName -DiskUpdate $diskupdateconfig
```

## Additional ultra SSD scenarios

- During VM Creation, ultra SSD can be implicitly created as well. However, these disks will receive a default value for IOPS (500) and throughput (8 MiB/s).
- Additional ultra SSD can be attached to compatible VMs.
- Ultra SSD support adjusting the disk performance attributes (IOPS and throughput) at runtime without detaching the disk from the virtual machine. Once a disk performance resize operation has been issued on a disk, it can take up to an hour for the change to actually take effect.
- Growing the disk capacity does require a virtual machine to be de-allocated.

## Next steps

If you would like to try the new disk type and haven't signed up for the preview yet, [request access through this survey](https://aka.ms/UltraSSDPreviewSignUp).