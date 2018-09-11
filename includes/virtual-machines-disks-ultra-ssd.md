---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/14/2018
 ms.author: rogarana
 ms.custom: include file
---

# Ultra SSD Managed Disks for Azure Virtual Machine workloads 
  
Ultra SSD delivers high throughput, high IOPS and consistent low latency disk storage for Azure IaaS VMs. This new offering provides top of the line performance at the same availability levels as our existing disks offerings. Additional benefits of Ultra SSD include the ability to dynamically change the performance of the disk along with your workloads without the need to restart your virtual machines. Ultra SSD is suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads.  

## Ultra SSD Features

**Managed Disks**: Ultra SSDs are only available as Managed Disks. Ultra SSDs cannot be deployed as an Unmanaged Disk or Page Blob. While creating a Managed Disk, you specify the disk sku type as UltraSSD_LRS and indicate the size of disk, the IOPS and throughput you need, and Azure creates and manages the disk for you.  
  
**Virtual Machines**: Ultra SSDs are designed to work with all Premium SSD enabled Azure Virtual Machine SKUs, however at preview time the VM sizes will be limited to ES/DS v3 VM instances.  
  
**Highly durable and available**: Ultra SSDs are built on the same Azure Disks platform, which has consistently delivered high availability and durability for disks. Azure Disks are designed for 99.999 percent availability. Like all Managed Disks, Ultra SSDs will also offer Local Redundant Storage (LRS). With LRS, the platform maintains multiple replicas of data for every disk and has consistently delivered enterprise-grade durability for IaaS disks, with an industry-leading ZERO percent Annualized Failure Rate.
  
**Dynamic Performance Configuration**: Ultra SSDs allow you to dynamically change the performance (IOPS and throughput) of the disk along with your workload needs without having to restart your virtual machines.

## Scalability and performance targets

When you provision a Ultra SSD Disk, you will have the option to independently configure the capacity and the performance of the disk. Ultra SSD Disks come in several fixed sizes from 4 GiB up to 64 TiB and feature a flexible performance configuration model that allows you to independently configure IOPS and throughput. Ultra SSD Disks can only be leveraged as data disks. We recommend using Premium SSD Disks as OS disks.

- Disk Capacity: Ultra SSD offers you a range of different disk sizes from 4 GiB up to 64 TiB 
- Disk IOPS: Ultra SSD Disks support IOPS limits of 300 IOPS/GiB, up to a maximum of 160K IOPS per disk. To achieve the IOPS that you provisioned, ensure that the selected Disk IOPS is less than the VM IOPS.
- Disk Throughput: With Ultra SSD Disks, the throughput limit of a single disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 2000 MBps per disk (where MBps = 10^6 Bytes per second)

The following table summarizes the different configurations supported for different disk sizes:  

### Ultra SSD Managed Disk Offerings

|Disk Size (GiB)  |IOPS Range  |Throughput Cap (MBps)  |
|---------|---------|---------|
|4     |Up to 1,200         |300         |
|8     |Up to 2,400         |600         |
|16     |Up to 4,800         |1,200         |
|32     |Up to 9,600         |2.000         |
|64     |Up to 19,200         |2.000         |
|128     |Up to 38,400         |2.000         |
|256     |Up to 76,800         |2.000         |
|512     |Up to 80,000         |2.000         |
|1,024-65,536 (sizes in this range increasing in increments of 1 TiB)     |Up to 160,000         |2.000         |

## Pricing and billing

When using Ultra SSDs, the following billing considerations apply:

- Managed Disk Size
- Managed Disk Provisioned IOPS
- Managed Disk Provisioned Throughput
- Ultra SSD VM reservation fee

### Managed Disk Size

Managed Disks are billed on the provisioned sizes. Azure maps the provisioned size (rounded up) to the nearest disk size offer. For details of the disk sizes offered, see the table in Scalability and Performance Targets section above. Each disk maps to a supported provisioned disk size and billed accordingly on a hourly basis. For example, if you provisioned a 200 GiB Ultra SSD Disk and deleted it after 20 hours, it will map to the disk size offer of 256 GiB and you'll be billed for the 256GiB for 20 hours. This is regardless of the amount of actual data written to the disk. 

### Managed Disk Provisioned IOPS

IOPS is the number of requests that your application is sending to the disks in one second. An input/output operation could be sequential or random, reads or writes. Like disk size, the provisioned IOPS are billed on an hourly basis. 
For details of the disk IOPS offered, see the table in Scalability and Performance Targets section above. 

### Managed Disk Provisioned Throughput

Throughput is the amount of data that your application is sending to the disks in a specified interval, measured in bytes/second. If your application is performing large input/output operations, it requires high throughput.  
  
There is a relation between Throughput and IOPS as shown in the formula below:  
IOPS x IO size = Throughput
Therefore, it is important to determine the optimal Throughput and IOPS values that your application requires. As you try to optimize one, the other also gets affected. We recommend starting with a throughput corresponding to 16 KiB IO size, and adjusting if more throughput is needed. 
  
For details on the supported disk throughput on Ultra SSD, see the table in Scalability and Performance Targets section above. Like disk size and IOPS, the provisioned throughput is billed on an hourly basis per MBps provisioned. 
Ultra SSD VM reservation fee 
We are introducing a capability on the VM that indicates your VM is Ultra SSD compatible. An Ultra SSD Compatible VM allocates dedicated bandwidth capacity between the compute VM instance and the block storage scale unit to optimize the performance and reduce latency. Adding this capability on the VM results in a reservation charge that is only imposed if you enabled Ultra SSD capability on the VM without attaching an Ultra SSD disk to it. When an Ultra SSD disk is attached to the Ultra SSD compatible VM, this charge would not be applied. This charge is per vcpu provisioned on the VM. 
 
Refer to the Azure Disks pricing page for the new Ultra SSD Disks price details available in limited preview. 
  
Ultra SSD Preview Scope and Limitations 
  
At preview, Ultra SSD Disks: 
Will be initially supported in East US 2 in a single Availability Zone  
Can only be used with Availability Zones (Availability Sets and Single VM deployments outside of Zones will not have the ability to attach an Ultra SSD Disk) 
Are only supported on ES/DS v3 VMs   
Are only available as data disks and only support 4k physical sector size  
Can only be created as Empty disks  
Can only be deployed using ARM templates. In the coming weeks, we will enable support for Portal and API/PS/CLI tools 
Will not support disk snapshots, VM Images, Availability Sets, Virtual Machine Scale Sets and Azure Disk Encryption. Support for these service management operations is under development 
Will not support integration with Azure Backup or Azure Site Recovery. Support for these service management operations is under development 
As with most previews, this feature should not be used for production workloads until General Availability (GA). 
 
Next Steps 
Interested in trying Ultra SSD Disks as part of our preview?   
The first step is to request access here.  
Once approved, run the following command to determine what Zone to deploy Ultra SSD to in East US 2: 
Powerhell: Get-AzureRmComputeResourceSku | where {$_.ResourceType -eq "disks" -and $_.Name -eq "UltraSSD_LRS" } 
CLI: az vm list-skus | grep 'UltraSSD_LRS' 
 
The response will be of the form below, where X is the Zone to use for deploying in East US 2. Z can be either 1,2 or 3. 
ResourceType         Name    Location Zones Restriction Capability Value 
------------         ----    -------- ----- ----------- ---------- ----- 
disks        UltraSSD_LRS     eastus2     X 
Follow the deployment steps in this article to get your first VMs deployed with Ultra SSD disks 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
How to get started with Ultra SSD? 
 
Determine the VM Size to deploy. As part of this preview, only DsV3 and EsV3 VM families are supported. Refer to the second table on this blog for additional details about these VM sizes. 
Refer to the sample “Create a VM with multiple Ultra SSD disks”  that shows how to create a VM with multiple Ultra SSD disks.  

Page Break
 
The following describe the new/modified ARM template changes: 
apiVersion for Microsoft.Compute/virtualMachines and Microsoft.Compute/Disks must be set as “2018-06-01” (or later) 
Specify Disk Sku UltraSSD_LRS, disk capacity, IOPS and throughput in MBps to create an Ultra SSD disk. The following is an example that creates a disk with 1024GiB (GiB = 2^30 Bytes), 80000 IOPS and 1200 MBps  (MBps = 10^6 Bytes per second):

`
"properties": {  
"creationData": {  
"createOption": "Empty"  
},  
"diskSizeGB": 1024,  
 “diskIOPSReadWrite": 80000,  
“diskMBpsReadWrite": 1200,  
}  
Add an additional capability on the properties of the VM to indicate it's Ultra SSD Enabled: 
{ 
"apiVersion": "2018-06-01", 
"type": "Microsoft.Compute/virtualMachines", 
"name": "[parameters('virtualMachineName')]", 
"zones": ["[parameters('zone')]"], 
"location": "[parameters('location')]", 
"dependsOn": [ 
"[concat('Microsoft.Network/networkInterfaces/', variables('networkInterfaceName'))]" 
], 
"properties": { 
"hardwareProfile": { 
"vmSize": "[parameters('virtualMachineSize')]" 
}, 
"additionalCapabilities" : { 
"ultraSSDEnabled" : "true" 
},                                     
"osProfile": { 
... 
}, 
"storageProfile": { 
"osDisk": { 
"name": "[variables('OSDiskName')]", 
"caching": "ReadWrite", 
"createOption": "FromImage", 
"managedDisk": { 
"storageAccountType": "Premium_LRS" 
} 
}, 
"imageReference": { 
... 
}, 
"dataDisks": [ 
{ 
  "lun": 0, 
  "createOption": "Empty", 
  "caching": "None", 
  "managedDisk": { 
"storageAccountType": "UltraSSD_LRS"   
  }, 
  "diskSizeGB": 1024,  
  "diskIOPSReadWrite": 80000,  
  "diskMBpsReadWrite": 1200,  
} 
  ] 
}, 
"networkProfile": { 
... 
} 
} 
} 
`
Once the VM is provisioned, you can now partition and format the data disks and configure them for your workloads. 
 
Additional scenarios: 
During VM creation, Ultra SSD disk can be implicitly created as well. However, these disks will get a default value for IOPS (500) and throughput (8MBps). Add link to arm templates 
Additional Ultra SSD disks can be attached to Ultra SSD Compatible VMs. 
Ultra SSD supports adjusting the disk performance attributes (IOPS and throughput) at runtime without detaching the disk from the Virtual Machine. Once a disk performance resize operation has been issued on a disk, it can take up to one hour for the change to actually take effect. Note that growing the disk capacity does require a Virtual Machine to be deallocated. 
 
 