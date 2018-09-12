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
 
 