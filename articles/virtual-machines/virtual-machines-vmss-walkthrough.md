<properties
	pageTitle="Automatically Scale Virtual Machine Scale Sets | Microsoft Azure"
	description="Get started creating and managing your first Azure Virtual Machine Scale Sets"
	services="virtual-machines"
	documentationCenter=""
	authors="gbowerman"
	manager="timlt"
	editor=""
	tags="azure-resource-manager"/>

<tags
	ms.service="virtual-machines"
	ms.workload="infrastructure-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="11/11/2015"
	ms.author="guybo"/>

# Automatically scale machines in a Virtual Machine Scale Set

[AZURE.INCLUDE [learn-about-deployment-models](../../includes/learn-about-deployment-models-rm-include.md)] [classic deployment model](virtual-machines-create-windows-powershell-service-manager.md).


This document is a quick guide to getting started creating and managing your first Azure Virtual Machine Scale Sets during public preview.

The guide assumes you are already familiar with using Azure Resource Manager (ARM) templates to deploy Azure resources such as virtual machines and VNETs. If not, the first 3 links in the Resources section provide a Resource Manager overview.

## What are VM Scale Sets and why use them?

VM Scale Sets are an Azure Compute resource you can use to deploy and manage a set of identical VMs.

With all VMs configured the same, VM scale sets are designed to support true autoscale – no pre-provisioning of VMs are required – and as such make it easier to build large-scale services targeting big compute, big data, containerized workloads, and any applications which need to scale compute resources out and in. Scale operations are implicitly balanced across fault and update domains. For an introduction to VM Scale Sets refer to the recent [Azure blog announcement](https://azure.microsoft.com/blog/azure-vm-scale-sets-public-preview).

## Creating and Working with VM Scale Sets

VM Scale Sets can be defined and deployed using JSON templates and REST calls just like individual Azure Resource Manager VMs. Therefore, any standard Azure Resource Manager deployment methods can be used, and this document will take you through some examples.

Specific VMSS integration areas such as imperative command support in scripting and programming languages, and full portal integration are under development and will be released in stages during the preview.

## Deploying and Managing VM Scale Sets with the Azure portal

Initially you cannot create a VM Scale Set from scratch in the Azure portal. Portal support is being worked on and in the first stage of this work you can only see scale sets in the portal that you've already created, and will have to use a template/script approach to create them. In all cases "portal" is assumed to mean the new Azure portal: [https://portal.azure.com/](https://portal.azure.com/).

You can however make use of the portal's ability to deploy a template to deploy any resource, including scale sets. An easy way to deploy a simple scale set is to use a link like this:

_https://portal.azure.com/#create/Microsoft.Template/uri/<link to VM Scale Set JSON template>_

A set of example templates for VM scale sets can be found in the Azure Quickstart teamplates GitHub repository here: [https://github.com/Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates) - look for templates with _vmss_ in the title.

In the readme's for these tempaltes you'll see a button like this which links to the portal deployment feature.

To deploy the scale set, click on the button and then fill in any parameters that are required in the portal. Note: If you're not sure whether a resource supports upper or mixed case it is safer to always use lower case parameter values.

**Monitoring your VM scale set resource in the portal/Resource Explorer**

After a scale set has been deployed, the portal will show a basic view of it but initially during the preview it won't show you detailed properties, or allow you drill down into VMs running in the VM scale set.

Until full portal integration is in place it is recommended you use the **Azure Resource Explorer** : [https://resources.azure.com](https://resources.azure.com) to view VM scale sets. VM Scale Sets are a resource under Microsoft.Compute, so from this site you can see them by expanding the following links:

Subscriptions -> your subscription -> resourceGroups -> providers -> Microsoft.Compute -> virtualMachineScaleSets -> your VM scale set -> etc.

## Deploying and Managing VM Scale Sets using PowerShell

You can deploy VMSS templates and query resources using any current Azure PowerShell version.

**Important Note:** The examples shown below are for [Azure PowerShell 1.0](https://azure.microsoft.com/blog/azps-1-0-pre/) which introduced the _AzureRm_ prefix to many commands. If you are using an earlier version of PowerShell such as 0.9.8 or below, remove " **Rm**" from the example commands. The examples also assume you have already established a login connection to Azure in your PowerShell environment (_Login-AzureRmAccount_).

Examples:

&#35; **Create a resource group**

New-AzureRmResourcegroup -name myrg -location 'Southeast Asia'

&#35; **Create a VM scale set of 2 VMs**

New-AzureRmResourceGroupDeployment -name dep1 -vmSSName myvmss -instanceCount 3 -ResourceGroupName myrg -TemplateUri [https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-linux-nat/azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-linux-nat/azuredeploy.json)

You will be prompted for any parameters you missed (like location, username, password in this example).

&#35; **Get VM scale set details**

Get-AzureRmResource -name myvmss -ResourceGroupName myrg -ResourceType Microsoft.Compute/virtualMachineScaleSets -ApiVersion 2015-06-15

&#35; or for more detail pipe it through | ConvertTo-Json -Depth 10

&#35; or for even more detail add –debug to your command.

&#35; Scaling out or scaling in

New-AzureRmResourceGroupDeployment -name dep2 -vmSSName myvmss -instanceCount 2 -ResourceGroupName myrg –TemplateUri [https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-scale-in-or-out/azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-scale-in-or-out/azuredeploy.json)

&#35; **Remove a Scale Set**

&#35; Easy: Remove the entire resource group and everything in it:

Remove-AzureRmResourceGroup -Name myrg

&#35; Precise: Remove a specific resource:

Remove-AzureRmResource -Name myvmss -ResourceGroupName myrg -ApiVersion 2015-06-15 -ResourceType Microsoft.Compute/virtualMachineScaleSets

### Imperative PowerShell commands for scale sets

An upcoming build of Azure PowerShell will include a set of imperative commands to create and manage VM scale sets without using templates. This build is available in preview here: [https://github.com/AzureRT/azure-powershell/releases](https://github.com/AzureRT/azure-powershell/releases). Examples of how to use the imperative API can be found here:

[https://github.com/huangpf/azure-powershell/blob/vmss/src/ResourceManager/Compute/Commands.Compute.Test/ScenarioTests/VirtualMachineScaleSetTests.ps1](https://github.com/huangpf/azure-powershell/blob/vmss/src/ResourceManager/Compute/Commands.Compute.Test/ScenarioTests/VirtualMachineScaleSetTests.ps1)

## Deploying and Managing VM Scale Sets Using Azure CLI

You can deploy VMSS templates and query resources using any current Azure CLI version.

The easiest way to install CLI is from a Docker container. For installing see: [https://azure.microsoft.com/blog/run-azure-cli-as-a-docker-container-avoid-installation-and-setup/](https://azure.microsoft.com/blog/run-azure-cli-as-a-docker-container-avoid-installation-and-setup/)

For using CLI see: [https://azure.microsoft.com/documentation/articles/xplat-cli/](https://azure.microsoft.com/documentation/articles/xplat-cli/)

###
VM Scale Set CLI examples

&#35; **create a resource group**

azure group create myrg "Southeast Asia"

&#35; **create a VM scale set**

azure group deployment create -g myrg -n dep2 --template-uri [https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-linux-nat/azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-linux-nat/azuredeploy.json)

&#35; this should ask for parameters dynamically, or you could specify them as arguments

&#35; **get scale set details**

azure resource show -n vmssname -r Microsoft.Compute/virtualMachineScaleSets -o 2015-06-15 -g myrg

&#35; or for more details:

azure resource show –n vmssname –r Microsoft.Compute/virtualMachineScaleSets –o 2015-06-15 –g myrg –json –vv

An upcoming Azure CLI build will include imperative commands to deploy and manage VM scale sets directly without templates and perform operations on VMs in VM Scale Sets. You can track this build here: [https://github.com/AzureRT/azure-xplat-cli/releases/](https://github.com/AzureRT/azure-xplat-cli/releases/)

## VM Scale Set Templates

This section walks through a simple Azure template to create a VM scale set, and contrasts it with templates used to create single-instance virtual machines. There is also a handy video dissection of a VM Scale Set template here: [https://channel9.msdn.com/Blogs/Windows-Azure/VM-Scale-Set-Template-Dissection/player](https://channel9.msdn.com/Blogs/Windows-Azure/VM-Scale-Set-Template-Dissection/player)

### Anatomy of a template

Let's start with a simple template that creates a VM scale set of Ubuntu virtual machines, and break it down into components. This example also creates the resources upon which a VM scale set depends such as VNET, storage account etc. The example can be found here: [https://raw.githubusercontent.com/gbowerman/azure-myriad/master/vmss-ubuntu-vnet-storage.json](https://raw.githubusercontent.com/gbowerman/azure-myriad/master/vmss-ubuntu-vnet-storage.json) - note that for this "hello world" example, there won't be a direct way to connect to VMs in the VM scale set from outside of your VNET as the VMs are assigned internal IP addresses. See the Scenarios section and examples in [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates) for ways to connect from outside using load balancers or jump boxes.

### Template header.

Specify schema, and content version:

{

   "$schema": "http://schema.management.azure.com/schemas/2015-01-01-preview/deploymentTemplate.json",

   "contentVersion": "1.0.0.0",

### Parameters

As with any Azure Resource Manager (ARM) template this section defines parameters which are specified at deployment time, including in this example the name of your VM scale set, the number of VM instances to start with, a unique string to use when creating storage accounts (always use lowercase when you enter values for objects like storage accounts unless you know how case is treated).:

````
 "parameters": {

    "vmSSName": {

      "type": "string",

      "metadata": {

        "description": "Scale Set name, also used in this template as a base for naming resources (hence limited less than 10 characters)."

      },

      "maxLength": 10

    },

    "instanceCount": {

      "type": "int",

      "metadata": {

        "description": "Number of VM instances"

      },

      "maxValue": 100

    },

    "adminUsername": {

      "type": "string",

      "metadata": {

        "description": "Admin username on all VMs."

      }

    },

    "adminPassword": {

      "type": "securestring",

      "metadata": {

        "description": "Admin password on all VMs."

      }

    }

  },
````

### Variables

A standard ARM template component which defines variables you will reference later in the template. In this example we'll use variables to define what OS we want, some network configuration details, storage settings and location. For location we'll use the _location()_ function to pick it up from the resource group where it is being deployed.

Note that an array of unique strings is defined for a storage account prefix. See the Storage section for an explanation.

````
  "variables": {

    "apiVersion": "2015-06-15",

    "newStorageAccountSuffix": "[concat(parameters('vmssName'), 'sa')]",

    "uniqueStringArray": [

      "[concat(uniqueString(concat(resourceGroup().id, deployment().name, variables('newStorageAccountSuffix'), '0')))]",

      "[concat(uniqueString(concat(resourceGroup().id, deployment().name, variables('newStorageAccountSuffix'), '1')))]",

      "[concat(uniqueString(concat(resourceGroup().id, deployment().name, variables('newStorageAccountSuffix'), '2')))]",

      "[concat(uniqueString(concat(resourceGroup().id, deployment().name, variables('newStorageAccountSuffix'), '3')))]",

      "[concat(uniqueString(concat(resourceGroup().id, deployment().name, variables('newStorageAccountSuffix'), '4')))]"

    ],

    "vmSize": "Standard\_A1",

    "vhdContainerName": "[concat(parameters('vmssName'), 'vhd')]",

    "osDiskName": "[concat(parameters('vmssName'), 'osdisk')]",

    "virtualNetworkName": "[concat(parameters('vmssName'), 'vnet')]",

    "subnetName": "[concat(parameters('vmssName'), 'subnet')]",

    "nicName": "[concat(parameters('vmssName'), 'nic')]",

    "ipConfigName": "[concat(parameters('vmssName'), 'ipconfig')]",

    "addressPrefix": "10.0.0.0/16",

    "subnetPrefix": "10.0.0.0/24",

    "storageAccountType": "Standard\_LRS",

    "location": "[resourceGroup().location]",

    "osType": {

      "publisher": "Canonical",

      "offer": "UbuntuServer",

      "sku": "15.10",

      "version": "latest"

    },

    "imageReference": "[variables('osType')]"

  },
````

### Resources

In this section each resource type is defined.

````
   "resources": [
````


**Storage.** When you create a VM scale set you specify an array of storage accounts. The OS disks for VM instances will then be distributed evenly between each account. In the future VM scale sets will switch to using a managed disk approach where you don't have to manage storage accounts and instead just describe the storage properties as part of the scale set definition. For now, you will need to create as many storage accounts as you need in advance. We recommend creating 5 storage accounts, which will comfortably support up to 100 VMs in a scale set (the current maximum).

When a set of storage accounts are created, they are distributed across partitions in a storage stamp, and the distribution scheme depends on the first letters of the storage account name. For this reason, for optimal performance it is recommended that each storage account you create starts with a different letter, spread out across the alphabet. You can name this manually, or for this example use the uniqueString() function to provide a pseudo-random distribution:

````
    {

      "type": "Microsoft.Storage/storageAccounts",

      "name": "[concat(variables('uniqueStringArray')[copyIndex()], variables('newStorageAccountSuffix'))]",

      "location": "[variables('location')]",

      "apiVersion": "[variables('apiVersion')]",

      "copy": {

        "name": "storageLoop",

        "count": 5

      },

      "properties": {

        "accountType": "[variables('storageAccountType')]"

      }

    },
````

**Virtual Network.** Create a VNET. Note you can have multiple scale sets, as well as single VMs in the same VNET.

````
    {

      "type": "Microsoft.Network/virtualNetworks",

      "name": "[variables('virtualNetworkName')]",

      "location": "[variables('location')]",

      "apiVersion": "[variables('apiVersion')]",

      "properties": {

        "addressSpace": {

          "addressPrefixes": [

            "[variables('addressPrefix')]"

          ]

        },

        "subnets": [

          {

            "name": "[variables('subnetName')]",

            "properties": {

              "addressPrefix": "[variables('subnetPrefix')]"

            }

          }

        ]

      }

    },
````

### The virtualMachineScaleSets Resource

In many respects the _virtualMachineScaleSets_ resource is like a _virtualMachines_ resource. They are both provided by the Microsoft.Compute resource provider and are at the same level. The main difference is that you provide a _capacity_ value which says how many VMs you are creating, and that what you define here is for all the VMs in the VM scale set.

Note how the _dependsOn_ section references the storage accounts and VNET created above, and the capacity references the _instanceCount_ parameter.

````
    {

      "type": "Microsoft.Compute/virtualMachineScaleSets",

      "name": "[parameters('vmssName')]",

      "location": "[variables('location')]",

      "apiVersion": "[variables('apiVersion')]",

      "dependsOn": [

        "[concat('Microsoft.Storage/storageAccounts/', variables('uniqueStringArray')[0], variables('newStorageAccountSuffix'))]",

        "[concat('Microsoft.Storage/storageAccounts/', variables('uniqueStringArray')[1], variables('newStorageAccountSuffix'))]",

        "[concat('Microsoft.Storage/storageAccounts/', variables('uniqueStringArray')[2], variables('newStorageAccountSuffix'))]",

        "[concat('Microsoft.Storage/storageAccounts/', variables('uniqueStringArray')[3], variables('newStorageAccountSuffix'))]",

        "[concat('Microsoft.Storage/storageAccounts/', variables('uniqueStringArray')[4], variables('newStorageAccountSuffix'))]",

        "[concat('Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'))]"

      ],

      "sku": {

        "name": "[variables('vmSize')]",

        "tier": "Standard",

        "capacity": "[parameters('instanceCount')]"

      },
````

**Properties**

VM Scale Sets have an upgradePolicy setting. Future versions will support sliced updates (e.g. change the configuration for 20% of my VMs at a time), but for now upgradePolicy can be set to manual or automatic. Manual means if you change the template and redeploy it, the changes will only take effect when new VMs are created or extensions are updated, for example when you increase _capacity_. Automatic means update all the VMs as a "blast", rebooting everything. Manual is generally a safer approach. You can delete individual VMs and redeploy as needed to update gradually.

````
      "properties": {

         "upgradePolicy": {

         "mode": "Manual"

        },
````

**Properties->virtualMachineProfile**

Here you reference the storage accounts created above as containers for VMs. You don't need to pre-create the actual containers, just the accounts.

````
        "virtualMachineProfile": {

          "storageProfile": {

            "osDisk": {

              "vhdContainers": [

                "[concat('https://', variables('uniqueStringArray')[0], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]",

                "[concat('https://', variables('uniqueStringArray')[1], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]",

                "[concat('https://', variables('uniqueStringArray')[2], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]",

                "[concat('https://', variables('uniqueStringArray')[3], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]",

                "[concat('https://', variables('uniqueStringArray')[4], variables('newStorageAccountSuffix'), '.blob.core.windows.net/', variables('vhdContainerName'))]"

              ],

              "name": "[variables('osDiskName')]",

              "caching": "ReadOnly",

              "createOption": "FromImage"

            },

            "imageReference": "[variables('imageReference')]"

          },
````

**Properties->osProfile**

One difference for VM scale sets over individual VMs is that the computer name is a prefix. VM instances in the VM scale set will be created with names like: myvm\_0, myvm\_1 etc.

````
          "osProfile": {

            "computerNamePrefix": "[parameters('vmSSName')]",

            "adminUsername": "[parameters('adminUsername')]",

            "adminPassword": "[parameters('adminPassword')]"

          },
````

**Properties->networkProfile**

When defining the network profile for a VMSS, remember both the NIC configuration and the IP configuration has a name. The NIC configuration has a "_primary_" setting, and the subnet id references back to the subnet resource which was created as part of the VNET above.

````
          "networkProfile": {

            "networkInterfaceConfigurations": [

              {

                "name": "[variables('nicName')]",

                "properties": {

                  "primary": "true",

                  "ipConfigurations": [

                    {

                      "name": "[variables('ipConfigName')]",

                      "properties": {

                        "subnet": {

                          "id": "[concat('/subscriptions/', subscription().subscriptionId,'/resourceGroups/', resourceGroup().name, '/providers/Microsoft.Network/virtualNetworks/', variables('virtualNetworkName'), '/subnets/', variables('subnetName'))]"

                        }

                      }

                    }

                  ]

                }

              }

            ]

          }
````

**Properties->extensionProfile**

The simple example above didn't require an extension profile. You can see one in action in this template which deploys Apache and PHP using the CustomScript Extension: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-lapstack-autoscale](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-lapstack-autoscale) - note that in this example the network IP properties also reference a load balancer. Load balancers will be described more in the VM Scale Set Scenarios section.

## VM Scale Set Scenarios

This section works through some typical VM scale set scenarios and example templates. Though they require templates for now, some of these will be integrated into the portal in future. Also some higher level Azure services (like Batch, Service Fabric, Azure Container Service) will use these scenarios

## RDP / SSH to VM Scale Set instances

A VM scale set is created inside a VNET and individual VMs in are not allocated public IP addresses. This is a good thing because you don't generally want the expense and management overhead of allocating separate IP addresses to all the stateless resources in your compute grid, and you can easily connect to these VMs from other resources in your VNET including ones which have public IP addresses like load balancers or standalone virtual machines.

Two simple ways to connect to VMSS VMs are described here:

### Connect to VMs using NAT rules

You can create a public IP address, assign it to a load balancer, and define inbound NAT rules which map a port on the IP address to a port on a VM in the VM scale set. E.g.

Public IP->Port 50000 -> vmss\_0->Port 22
Public IP->Port 50001 -> vmss\_1->Port 22
Public IP->Port 50002-> vmss\_2->Port 22

Here's an example of creating a VM scale set which uses NAT rules to enable SSH connection to every VM in a scale set using a single public IP: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-linux-nat)

Here's an example of doing the same with RDP and Windows: [https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-nat](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-nat)

### Connect to VMs using a "jump box"

If you create a VM scale set and a standalone VM in the same VNET, the standalone VM and the VMSS VMs can connect to one another using their internal IP addresses as defined by the VNET/Subnet.

If you create a public IP address and assign it to the standalone VM you can RDP or SSH to the standalone VM and then connect from that machine to your VMSS instances. You may notice at this point that a simple VM scale set is inherently more secure than a simple standalone VM with a public IP address in its default configuration.

For an example of this approach, this template creates a simple Mesos cluster consisting of a standalone Master VM which manages a VM scale-set based cluster of VMs: [https://github.com/gbowerman/azure-myriad/blob/master/mesos-vmss-simple-cluster.json](https://github.com/gbowerman/azure-myriad/blob/master/mesos-vmss-simple-cluster.json)

## Round Robin load balancing to VM Scale Set instances

If you want to deliver work to a compute cluster of VMs using a "round-robin" approach, you can configure an Azure load balancer with load-balancing rules accordingly. You can also define probes to verify your application is running by pinging ports with a specified protocol, interval and request path.

Here is an example which creates a VM scale set of VMs running IIS web server, and uses a load balancer to balance the load that each VM receives. It also uses the HTTP protocol to ping a specific URL on each VM: [https://github.com/gbowerman/azure-myriad/blob/master/vmss-win-iis-vnet-storage-lb.json](https://github.com/gbowerman/azure-myriad/blob/master/vmss-win-iis-vnet-storage-lb.json) - look at the Microsoft.Network/loadBalancers resource type and the networkProfile and extensionProfile in the virtualMachineScaleSet.

## VM Scale Set instances with Azure Auto-Scale

If you want to vary the instance count (_capacity_) of your VM scale set depending on CPU/Memory/Disk usage or other events, a rich set of autoscale settings are available from the Microsoft.Insights resource provider. You can read about the available settings in the Insights REST documentation: [https://msdn.microsoft.com/library/azure/dn931953.aspx](https://msdn.microsoft.com/library/azure/dn931953.aspx).

The Insights Autoscale integrates directly with VM Scale Sets. To set it up you define a Microsoft.Insights/autoscaleSettings resource type which has a _targetResourceUri_ and _metricResourceUri_ that references back to the scale set. When you define the scale set you include an _extensionProfile_ which installs the Azure Diagnostics agent (WAD) on Windows or the Linux Diagnostic Extension (LDE) on Linux. Here's is a Linux example which adds VMs up to a pre-defined limit when average CPU usage is >50% with a time granularity of 1 minute over a sampling period of 5 minutes:

[https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-lapstack-autoscale](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-lapstack-autoscale).

In future autoscale with VM Scale Sets will also be integrated directly with the Azure portal.

## Deploying a VM Scale Set as a compute cluster in a PaaS cluster manager

VM Scale sets are sometimes described as a next-generation worker role. It's a valid description but it also runs the risk of confusing scale set features with PaaS v1 Worker role features.

In a sense VM scale sets provide a true "worker role" or worker resource, in that they provide a generalized compute resource which is platform/runtime independent, customizable and integrates into Azure Resource Manager IaaS.

A PaaS v1 worker role, while limited in terms of platform/runtime support (Windows platform images only) also includes services such as VIP swap, configurable upgrade settings, runtime/app deployment specific settings which are either not _yet_ available in VM scale sets, or will be delivered by other higher level PaaS services like Service Fabric. With this in mind you can look at VM scale sets as an infrastructure which supports PaaS. I.e. PaaS solutions like Service Fabric or cluster managers like Mesos can build on top of VM scale sets as a scalable compute layer.

Here is an example of a Mesos cluster which deploys a VM Scale Set in the same VNET as a standalone VM. The standalone VM is a Mesos master, and the VM scale set represents a set of slave nodes: [https://github.com/gbowerman/azure-myriad/blob/master/mesos-vmss-simple-cluster.json](https://github.com/gbowerman/azure-myriad/blob/master/mesos-vmss-simple-cluster.json). Future versions of the [Azure Container Service](https://azure.microsoft.com/blog/azure-container-service-now-and-the-future/) will deploy more complex/hardened versions of this scenario based on VM scale sets.

## Scaling a VM Scale Set out and in

To increase or decrease the number of virtual machines in a VM scale set, simply change the _capacity_ property and redeploy the template. This simplicity makes it easy to write your own custom scaling layer if you want to define custom scale events that are not supported by Azure autoscale.

If you are redeploying a template to change the capacity, you could define a much smaller template which only includes the SKU and the updated capacity. An example of this is shown here: [https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-scale-in-or-out/azuredeploy.json](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-linux-nat/azuredeploy.json).

## VM Scale Set Performance and Scale Guidance

- During the public preview, do not create more than 500 VMs in multiple VM Scale Sets at a time. This limit will be increased in the future.
- Plan for no more than 40 VMs per storage account.
- Spread out the first letters of storage account names as much as possible.  The example VMSS templates in [Azure Quickstart templates](https://github.com/Azure/azure-quickstart-templates/) provide examples of how to do this.
- If using custom VMs, plan for no more than 40 VMs per VM scale set, in a single storage account.  You will need the image pre-copied into the storage account before you can begin VM scale set deployment. See the FAQ for more information.
- Plan for no more than 2048 VMs per VNET.  This limit will be increased in the future.
- The number of VMs you can create is limited by your Compute core quota in any region. You may need to contact Customer Support to increase your Compute quota limit increased even if you have a high limit of cores for use with cloud services or IaaS v1 today. To query your quota you can run the following Azure CLI command: _azure vm list-usage_, and the following PowerShell command: _Get-AzureRmVMUsage_ (if using a version of PowerShell below 1.0 use _Get-AzureVMUsage_).


## VM Scale Set FAQ

**Q. How many VMs can you have in a VM Scale Set?**

A. 100 if you use platform images which can be distributed across multiple storage accounts. If you use custom images, up to 40, since custom images are limited to a single storage account during preview.

**What other resource limits exist for VM Scale Sets?**

A. The existing Azure service limits apply: [https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/](https://azure.microsoft.com/documentation/articles/azure-subscription-service-limits/)

You are also limited to creating no more than 500 VMs in multiple scale sets per region during the preview period.

**Q. Are Data Disks Supported within VM Scale sets?**

A. Not in the initial release. Your options for storing data are:

- Azure files (SMB shared drives)

- OS drive

- Temp drive (local, not backed by Azure storage)

- External data service (e.g. remote DB, Azure tables, Azure blobs)

**Q. Which Azure regions support for VMSS?**

A. Any region which supports Azure Resource Manager supports VM Scale Sets.

**Q. How do you create a VMSS using a custom image?**

A. Leave the vhdContainers property blank, for example:

````
"storageProfile": {
   "osDisk": {
      "name": "vmssosdisk",
      "caching": "ReadOnly",
      "createOption": "FromImage",
      "image": {
         "uri": [https://mycustomimage.blob.core.windows.net/system/Microsoft.Compute/Images/mytemplates/template-osDisk.vhd](https://mycustomimage.blob.core.windows.net/system/Microsoft.Compute/Images/mytemplates/template-osDisk.vhd)
     },
     "osType": "Windows"
  }
},
````

**Q. If I reduce my VMSS capacity from 20 to 15, which VMs will be removed?**

A. The last 5 VMs (largest indexes) will be removed.

**Q. How about it if I then increase the capacity from 15 to 18?**

If you increase to 18, VMs with index 15, 16, 17 will be created. In both cases the VMs are balanced across FDs and UDs.

**Q. When using multiple extensions in a VM scale set, can I enforce an execution sequence?**

A. Not directly, but for the customScript extension, your script could wait for another extension to complete (for example by monitoring the extension log - see [https://github.com/Azure/azure-quickstart-templates/blob/master/201-vmss-lapstack-autoscale/install\_lap.sh](https://github.com/Azure/azure-quickstart-templates/blob/master/201-vmss-lapstack-autoscale/install_lap.sh)).

**Q. Do VM Scale Sets work with Azure availability sets?**

A. Yes. A scale set is an implicit availability set with 3 FDs and 5 UDs. You don't need to configure anything under virtualMachineProfile. In future releases, scale sets are likely to span multiple tenants but for now a scale set is a single availability set.

## Next Steps

During the preview for VM Scale Sets, the documentation will be evolving and more integration features like portal and autoscale will be opened up.

Your feedback is very important to help us build a service that provides the features you need. Please let us know what works, what doesn't and what could be improved. You can provide feedback to [vmssfeedback@microsoft.com](mailto:vmssfeedback@microsoft.com).

## Resources

| **Topic** | **Link** |
| --- | --- |
| Azure Resource Manager Overview | [https://azure.microsoft.com/documentation/articles/resource-group-overview/](https://azure.microsoft.com/documentation/articles/resource-group-overview/)   |
| Azure Resource Manager Templates | [https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/](https://azure.microsoft.com/documentation/articles/resource-group-authoring-templates/) |
| Azure Resource Manager Template Functions | [https://azure.microsoft.com/documentation/articles/resource-group-template-functions/](https://azure.microsoft.com/documentation/articles/resource-group-template-functions/) |
| Example templates (github) | [https://github.com/Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates) |
| VM Scale Set REST API guide | [https://msdn.microsoft.com/library/mt589023.aspx](https://msdn.microsoft.com/library/mt589023.aspx) |
| VM Scale Set videos | [https://channel9.msdn.com/Blogs/Regular-IT-Guy/Mark-Russinovich-Talks-Azure-Scale-Sets/](https://channel9.msdn.com/Blogs/Regular-IT-Guy/Mark-Russinovich-Talks-Azure-Scale-Sets/)  [https://channel9.msdn.com/Shows/Cloud+Cover/Episode-191-Virtual-Machine-Scale-Sets-with-Guy-Bowerman](https://channel9.msdn.com/Shows/Cloud+Cover/Episode-191-Virtual-Machine-Scale-Sets-with-Guy-Bowerman)  [https://channel9.msdn.com/Blogs/Windows-Azure/VM-Scale-Set-Template-Dissection/player](https://channel9.msdn.com/Blogs/Windows-Azure/VM-Scale-Set-Template-Dissection/player) |
| Autoscale settings (MSDN) | [https://msdn.microsoft.com/library/azure/dn931953.aspx](https://msdn.microsoft.com/library/azure/dn931953.aspx) |
| Troubleshooting resource group deployments in Azure | [https://azure.microsoft.com/documentation/articles/resource-group-deploy-debug/](https://azure.microsoft.com/documentation/articles/resource-group-deploy-debug/) |
