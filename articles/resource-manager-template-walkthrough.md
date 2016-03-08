<properties
   pageTitle="Resource Manager Template Walkthrough | Microsoft Azure"
   description="A step by step walkthrough of a resource manager template provisioning a basic Azure IaaS architecture."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="navalev;tfitzmac"
   manager=""
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/07/2016"
   ms.author="navale;tomfitz"/>
   
# Resource Manager Template Walkthrough

This topic walks you through the steps of creating a Resource Manager template. It assumes you are familiar with the Azure services you want to deploy, but are not familiar with how you would represent that infrastructure in a template. The [completed template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-2-vms-loadbalancer-lbrules) for this topic is available in the [quickstart gallery](https://github.com/Azure/azure-quickstart-templates).

Let's take a look at a common architecture:

* Two virtual machines that use the same storage account, are in the same availability set, and on the same subnet of a virtual network.
* A single NIC and VM IP address for each virtual machine.
* A load balancer with a load balancing rule on port 80

![architecture](./media/resource-group-overview/arm_arch.png)

You have decided you want to deploy this architecture to Azure, and you want to use Resource Manager templates so you can easily re-deploy the architecture at other times. This topic will help you understand what to put in the template.

## Understanding Resource Manager templates

The template is a JSON file that defines all of the resources you will deploy in a single, coordinated operation. It also permits you to define parameters that are specified during deployment, variables that constructed from other values and expressions, and outputs from the deployment. To learn about the structure of a template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md). To learn about the functions that are available within a template, see [Azure Resource Manager template functions](resource-group-template-functions.md).

This topic focuses on the resource definitions in the resources section. For your template to work, you will need all of the parameters and variables that are defined in the [GitHub template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-2-vms-loadbalancer-lbrules).

You can use any type of editor when creating the template. Visual Studio provides tools that simplify template development. For a tutorial on using Visual Studio to create a Web App and SQL Database deployment, see [Creating and deploying Azure resource groups through Visual Studio](vs-azure-tools-resource-groups-deployment-projects-create-deploy.md). 

## Understanding resource providers and resource types
Every resource that you deploy to Azure belongs to a particular resource provider. Before proceeding with your template, you must figure out which resource providers you will need. You can find a list of supported resource providers at [Resource Manager providers, regions, API versions and schemas](resource-manager-supported-services.md). Or, you can run the following PowerShell cmdlet to get a list of available resource providers:

    PS C:\> Get-AzureRmResourceProvider -ListAvailable
    
If you are using Azure CLI, you can run the following command:

    azure provider list

Given that you are working with storage accounts, virtual machines, and virtual networking, you should look for resource providers that might contain those resource types. In this case, you will work with:

- Microsoft.Storage
- Microsoft.Compute
- Microsoft.Network

You must determine the names of the resource types that you will use in your template. The following PowerShell command returns the available types for the Microsoft.Compute resource provider. You can re-run the command with the names of the other resource providers you will use.

    PS C:\> (Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute).ResourceTypes

For Azure CLI, the following command will return the available types in JSON format and save it to a file.

    azure provider show Microsoft.Compute --json > c:\temp.json

For this topic, the resource types that you will use are:

- Microsoft.Storage/storageAccounts
- Microsoft.Compute/availabilitySets
- Microsoft.Network/publicIPAddresses
- Microsoft.Network/virtualNetworks
- Microsoft.Network/networkInterfaces
- Microsoft.Network/loadBalancers
- Microsoft.Compute/virtualMachines

## Understanding API versions and supported regions

All of the resource providers are backed by a REST API. When you deploy resources through a template, you must specify which version of the REST API to use for that resource provider. You specify this value because the properties that are available may be slightly different between different versions. To see which API versions your resource types supports, run the following PowerShell command for each resource type.

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute).ResourceTypes | Where-Object ResourceTypeName -eq virtualMachines).ApiVersions

You can only deploy a resource type to a region that it supports. To see the available regions for a resource type, run the previous command, but specify the **.Locations** property.

    PS C:\> ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute).ResourceTypes | Where-Object ResourceTypeName -eq virtualMachines).Locations
    
For Azure CLI, the REST API versions and regions are returned in the **azure provider show** command shown previously.

When creating a new template, pick the most recent API version.

## Understanding the template format for each resource type

When defining the resources to deploy in your template, you must figure out which properties to set for the resource type. Each resource uses a set of common elements (like **name** and **location**), and a set of unique elements for that particular resource type. You can learn about the common elements at [Resources](../resource-group-authoring-templates/#resources). The unique elements are usually defined with an element called **properties**. To see which properties are available for a resource type, check the [schema definitions](https://github.com/Azure/azure-resource-manager-schemas/tree/master/schemas), or the [REST API reference](https://msdn.microsoft.com/library/azure/mt420159.aspx) for each resource provider. The **properties** section of the PUT operation in the REST API will match the **properties** section of your template.

You are now ready to defines the resources.

## Storage Account
First, you will define a storage account to be used by the virtual machines. You set the **type**, **apiVersion**, and **location** from values you have determined above. The parameter values that are used below must exist within your template. Refer to the [completed template in GitHub](https://github.com/Azure/azure-quickstart-templates/tree/master/201-2-vms-loadbalancer-lbrules) for how you would define the parameters and variables.

Notice under **properties** is an element named **accountType**. This element is unique to storage accounts. For the types of accounts you can specify, see the [REST API for creating a Storage account](https://msdn.microsoft.com/library/azure/mt163564.aspx).

```json
    {
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[parameters('storageAccountName')]",
      "apiVersion": "2015-05-01-preview",
      "location": "[resourceGroup().location]",
      "properties": {
        "accountType": "[variables('storageAccountType')]"
      }
    }
```
## Availability Set
Define an availably set for the virtual machines. In this case, there is no additional properties required, so its definition is fairly simple. See the [REST API for creating an Availability Set](https://msdn.microsoft.com/en-us/library/azure/mt163607.aspx) for the full properties section, in case you want to define the update domain count and fault domain count values.

```json
   {
      "type": "Microsoft.Compute/availabilitySets",
      "name": "[variables('availabilitySetName')]",
      "apiVersion": "2015-05-01-preview",
      "location": "[resourceGroup().location]",
      "properties": {}
   }
```

## Public IP
Define a public IP address. Again, look at the [REST API for public IP addresses](https://msdn.microsoft.com/library/azure/mt163590.aspx) for the properties to set.

```json
   {
      "apiVersion": "2015-05-01-preview",
      "type": "Microsoft.Network/publicIPAddresses",
      "name": "[parameters('publicIPAddressName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "publicIPAllocationMethod": "[variables('publicIPAddressType')]",
        "dnsSettings": {
          "domainNameLabel": "[parameters('dnsNameforLBIP')]"
        }
      }
   }
```

## Virtual Network and Subnet
Create a virtual network with one subnet. Look at the [REST API for virtual networks](https://msdn.microsoft.com/en-us/library/azure/mt163661.aspx) for all the properties to set.

```json
   {
      "apiVersion": "2015-05-01-preview",
      "type": "Microsoft.Network/virtualNetworks",
      "name": "[parameters('vnetName')]",
      "location": "[resourceGroup().location]",
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
   }
```

## Load Balancer
Now you will create an external facing load balancer. Because this load balancer uses the public IP address, you must declare a dependency on the public IP address in the **dependsOn** section. This means the load balancer will not get deployed until the public IP address has finished deploying. Without defining this dependency, you will receive an error because Resource Manager will attempt to deploy the resources in parallel, and will try to set the load balancer to public IP address that doesn't exist yet. 

You will also create a backend address pool, a couple of inbound NAT rules to RDP into the VMs, and a load balancing rule with a tcp probe on port 80 in this resource definition. Checkout the [REST API for load balancer](https://msdn.microsoft.com/en-us/library/azure/mt163574.aspx) for all the properties.

```json
   {
      "apiVersion": "2015-05-01-preview",
      "name": "[parameters('lbName')]",
      "type": "Microsoft.Network/loadBalancers",
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[concat('Microsoft.Network/publicIPAddresses/', parameters('publicIPAddressName'))]"
      ],
      "properties": {
        "frontendIPConfigurations": [
          {
            "name": "LoadBalancerFrontEnd",
            "properties": {
              "publicIPAddress": {
                "id": "[variables('publicIPAddressID')]"
              }
            }
          }
        ],
        "backendAddressPools": [
          {
            "name": "BackendPool1"
          }
        ],
        "inboundNatRules": [
          {
            "name": "RDP-VM0",
            "properties": {
              "frontendIPConfiguration": {
                "id": "[variables('frontEndIPConfigID')]"
              },
              "protocol": "tcp",
              "frontendPort": 50001,
              "backendPort": 3389,
              "enableFloatingIP": false
            }
          },
          {
            "name": "RDP-VM1",
            "properties": {
              "frontendIPConfiguration": {
                "id": "[variables('frontEndIPConfigID')]"
              },
              "protocol": "tcp",
              "frontendPort": 50002,
              "backendPort": 3389,
              "enableFloatingIP": false
            }
          }
        ],
        "loadBalancingRules": [
          {
            "name": "LBRule",
            "properties": {
              "frontendIPConfiguration": {
                "id": "[variables('frontEndIPConfigID')]"
              },
              "backendAddressPool": {
                "id": "[variables('lbPoolID')]"
              },
              "protocol": "tcp",
              "frontendPort": 80,
              "backendPort": 80,
              "enableFloatingIP": false,
              "idleTimeoutInMinutes": 5,
              "probe": {
                "id": "[variables('lbProbeID')]"
              }
            }
          }
        ],
        "probes": [
          {
            "name": "tcpProbe",
            "properties": {
              "protocol": "tcp",
              "port": 80,
              "intervalInSeconds": 5,
              "numberOfProbes": 2
            }
          }
        ]
      }
   }
```

## Network Interface
You will create 2 network interfaces, one for each VM. Rather than having to include duplicate entries for the network interfaces, you can use the [copyIndex() function](resource-group-create-multiple.md) to iterate over the copy loop (referred to as nicLoop) and create the number network interfaces as defined in the `numberOfInstances` variables. 
The network interface depends on creation of the virtual network and the load balancer. It uses the subnet defined in the virtual network creation, and the load balancer id to configure the load balancer address pool and the inbound NAT rules.
Look at the [REST API for network interfaces](https://msdn.microsoft.com/en-us/library/azure/mt163668.aspx) for all the properties.

```json
   {
      "apiVersion": "2015-05-01-preview",
      "type": "Microsoft.Network/networkInterfaces",
      "name": "[concat(parameters('nicNamePrefix'), copyindex())]",
      "location": "[resourceGroup().location]",
      "copy": {
        "name": "nicLoop",
        "count": "[variables('numberOfInstances')]"
      },
      "dependsOn": [
        "[concat('Microsoft.Network/virtualNetworks/', parameters('vnetName'))]",
        "[concat('Microsoft.Network/loadBalancers/', parameters('lbName'))]"
      ],
      "properties": {
        "ipConfigurations": [
          {
            "name": "ipconfig1",
            "properties": {
              "privateIPAllocationMethod": "Dynamic",
              "subnet": {
                "id": "[variables('subnetRef')]"
              },
              "loadBalancerBackendAddressPools": [
                {
                  "id": "[concat(variables('lbID'), '/backendAddressPools/BackendPool1')]"
                }
              ],
              "loadBalancerInboundNatRules": [
                {
                  "id": "[concat(variables('lbID'),'/inboundNatRules/RDP-VM', copyindex())]"
                }
              ]
            }
          }
        ]
      }
   }
```

## Virtual Machine
You will create 2 virtual machines, using copyIndex() function, as you did in creation of the [network interfaces](#network-interface).
The VM creation depends on the storage account, network interface and availability set. This VM will be created from a marketplace image, as defined in the `storageProfile` property - `imageReferece` is used to define the image publisher, offer, sku and version. 
Finally, a diagnostic profile is configured to enable diagnostics for the VM. 

To find the relevant properties for a marketplace image, follow the [VM searching](./virtual-machines/resource-groups-vm-searching.md) article.
For images published by 3rd party vendors, you will need to specify another property named `plan`. An example can be found in [this template](https://github.com/Azure/azure-quickstart-templates/tree/master/checkpoint-single-nic) from the quickstart gallery. 


```json
   {
      "apiVersion": "2015-06-15",
      "type": "Microsoft.Compute/virtualMachines",
      "name": "[concat(parameters('vmNamePrefix'), copyindex())]",
      "copy": {
        "name": "virtualMachineLoop",
        "count": "[variables('numberOfInstances')]"
      },
      "location": "[resourceGroup().location]",
      "dependsOn": [
        "[concat('Microsoft.Storage/storageAccounts/', parameters('storageAccountName'))]",
        "[concat('Microsoft.Network/networkInterfaces/', parameters('nicNamePrefix'), copyindex())]",
        "[concat('Microsoft.Compute/availabilitySets/', variables('availabilitySetName'))]"
      ],
      "properties": {
        "availabilitySet": {
          "id": "[resourceId('Microsoft.Compute/availabilitySets',variables('availabilitySetName'))]"
        },
        "hardwareProfile": {
          "vmSize": "[parameters('vmSize')]"
        },
        "osProfile": {
          "computerName": "[concat(parameters('vmNamePrefix'), copyIndex())]",
          "adminUsername": "[parameters('adminUsername')]",
          "adminPassword": "[parameters('adminPassword')]"
        },
        "storageProfile": {
          "imageReference": {
            "publisher": "[parameters('imagePublisher')]",
            "offer": "[parameters('imageOffer')]",
            "sku": "[parameters('imageSKU')]",
            "version": "latest"
          },
          "osDisk": {
            "name": "osdisk",
            "vhd": {
              "uri": "[concat('http://',parameters('storageAccountName'),'.blob.core.windows.net/vhds/','osdisk', copyindex(), '.vhd')]"
            },
            "caching": "ReadWrite",
            "createOption": "FromImage"
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[resourceId('Microsoft.Network/networkInterfaces',concat(parameters('nicNamePrefix'),copyindex()))]"
            }
          ]
        },
        "diagnosticsProfile": {
          "bootDiagnostics": {
             "enabled": "true",
             "storageUri": "[concat('http://',parameters('storageAccountName'),'.blob.core.windows.net')]"
          }
        }
   }
```
## Deploying the template

Your template is now defined. To learn about the different ways of deploying it, see [Deploy a Resource Group with Azure Resource Manager template](resource-group-template-deploy.md)

