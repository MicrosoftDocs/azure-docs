---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 06/07/2019
 ms.author: cynthn
 ms.custom: include file
---

# Deploy a dedicated host using an Azure Resource Manager template



## Host group

To create a host group you need to provide a name, location (region), and for preview, an availability zone in the region (1,2, or 3). 

```json
      {
        "name": "[parameters('hostGroupName')]",
        "type": "Microsoft.Compute/HostGroups",
        "apiVersion": "2018-10-01",
        "location": "[parameters('location')]",
        "zones": [
          "[parameters('zone')]"
        ],
        "tags": {}
      },
```


## Host

To create a host, you need to provide a name, location, and a SKU.

The format for he host name is `hostGroupName/hostname`. An easy way to build it is to use the host group name as a prefix using the concat function. 

For the public preview, a host will inherit the Azure Zone setting from the host group. A faultDomain setting will be added to the host later in the public preview.

Create a host in the host group.

```json
      {
            "name": "[concat(parameters('dhgName'),'/', parameters('dhName'))]",
            "type": "Microsoft.Compute/HostGroups/hosts",
            "apiVersion": "2018-10-01",
            "location": "[parameters('location')]",
            "dependsOn": [
                "[concat('Microsoft.Compute/hostGroups/',parameters('dhgName'))]" 
            ],                 
            "sku": {
                "name": "DSv3-Type1" 
            },
            "properties": {},
            "tags": {}
        },
```

## Virtual machine

Create a virtual machine on a host. 

The following changes are required from any existing template to enable the VM on a dedicated host:
1.	Remove availability set dependencies. Dedicated hosts won't support VMs in an availability set. 
1.	Change the API version of your virtual machine to `2018-10-01`.
1.	Initially, we require the use of Availability Zones. The following resources must have a zone property specified: 
	- Public IP
	- Virtual Machine 
1.	Add a reference to your dedicated host.
1. If you are creating a host and a VM at the same time, the VM portion needs a `dependsOn` that references the host. This way, the VM won't get created before the host is done being deployed.

The following example shows the changes to a virtual machine resource type:

```json
{
    "name": "[parameters('virtualMachineName')]",
    "type": "Microsoft.Compute/virtualMachines",
    "apiVersion": "2018-10-01",
    "location": "[parameters('location')]",
    "dependsOn": [
      "[resourceId('Microsoft.Compute/hostgroups/hosts',  \
        parameters('dhgName'),parameters('dhName'))]" ],
    "properties": {   
        "host": {
            "id": "[resourceId('Microsoft.Compute/hostgroups/hosts', \ 
                    parameters('dhgName'),parameters('dhName'))]"
        },
        "hardwareProfile": { "vmSize": "[parameters('virtualMachineSize')]"
        },
```



