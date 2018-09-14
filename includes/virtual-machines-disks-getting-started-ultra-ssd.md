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

# Enabling Azure Ultra SSDs (preview)

Azure Ultra SSD (preview) delivers high throughput, high IOPS, and consistent low latency disk storage for Azure IaaS VMs. This new offering provides top of the line performance at the same availability levels as our existing disks offerings. Additional benefits of Ultra SSD include the ability to dynamically change the performance of the disk along with your workloads without the need to restart your virtual machines. Ultra SSD is suited for data-intensive workloads such as SAP HANA, top tier databases, and transaction-heavy workloads.

To enable access to the new disk type [fill out this survey requesting access](https://aka.ms/UltraSSDPreviewSignUp).

Once approved, run one of the following commands to determine which zone to deploy Ultra SSD to in East US 2:

PowerShell: `Get-AzureRmComputeResourceSku | where {$_.ResourceType -eq "disks" -and $_.Name -eq "UltraSSD_LRS" }`

CLI: `az vm list-skus --resource-type disks --query “[?name==’UltraSSD_LRS’]”`

The response will will be similar to the form below, where X is the Zone to use for deploying in East US 2. Z can be either 1, 2, or 3.

|ResourceType  |Name  |Location  |Zones  |Restriction  |Capability  |Value  |
|---------|---------|---------|---------|---------|---------|---------|
|disks     |UltraSSD_LRS         |eastus2         |X         |         |         |         |

If there was no response from the command, that means your registration to the feature is either still pending, or not approved yet.

Now that you know which zone to deploy to, follow the deployment steps in this article to get your first VMs deployed with Ultra SSD disks.

## Deploying an Ultra SSD

First, determine the VM Size to deploy. As part of this preview, only DsV3 and EsV3 VM families are supported. Refer to the second table on this [blog](https://azure.microsoft.com/en-us/blog/introducing-the-new-dv3-and-ev3-vm-sizes/) for additional details about these VM sizes.
Also refer to the sample [Create a VM with multiple Ultra SSD disks](https://aka.ms/UltraSSDTemplate) which shows how to create a VM with multiple Ultra SSD disks.

The following describe the new/modified Resource Manager template changes:
apiVersion for `Microsoft.Compute/virtualMachines` and `Microsoft.Compute/Disks` must be set as `2018-06-01` (or later).

Specify Disk Sku UltraSSD_LRS, disk capacity, IOPS, and throughput in MBps to create an Ultra SSD disk. The following is an example that creates a disk with 1,024 GiB (GiB = 2^30 Bytes), 80,000 IOPS and 1,200 MBps  (MBps = 10^6 Bytes per second):

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

Add an additional capability on the properties of the VM to indicate its Ultra SSD Enabled:

```json
    {
    "apiVersion": "2018-06-01",
    "type": "Microsoft.Compute/virtualMachines",
    "name": "[parameters('virtualMachineName')]",
    "zones": ["[parameters('zone')]"],
    "location": "[parameters('location')]",
    "dependsOn": [
    "[concat('Microsoft.Network/networkInterfaces/', variables('networkInterfaceName'))]"],
    "properties": {
        "hardwareProfile": {
            "vmSize": "[parameters('virtualMachineSize')]"
            },
        "additionalCapabilities" :
        {
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
"dataDisks": [ {
  "lun": 0,
  "createOption": "Empty",
  "caching": "None",
  "managedDisk": {
"storageAccountType": "UltraSSD_LRS"
  }, 
  "diskSizeGB": 1024,  
  "diskIOPSReadWrite": 80000,  
  "diskMBpsReadWrite": 1200,  }]
},
    "networkProfile": {
            ...
        }
    }
}
```

Once the VM is provisioned, you can partition and format the data disks and configure them for your workloads.