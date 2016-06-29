<properties
   pageTitle="Resource Manager Template Walkthrough | Microsoft Azure"
   description="A step by step walkthrough of a resource manager template provisioning a basic Azure IaaS architecture."
   services="azure-resource-manager"
   documentationCenter="na"
   authors="navalev"
   manager=""
   editor=""/>

<tags
   ms.service="azure-resource-manager"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="05/04/2016"
   ms.author="navale;tomfitz"/>
   
# Resource Manager template walkthrough

One of the first questions when creating a template is "how to start?". One can start from a blank template, following the basic structure described in [Authoring Template article](resource-group-authoring-templates.md#template-format), and add the resources and appropriate parameters and variables. A good alternative would be to start by going through the [quickstart gallery](https://github.com/Azure/azure-quickstart-templates) and look for similar scenarios to the one you are trying to create. You can merge several templates or edit an existing one to suit your own specific scenario. 

Let's take a look at a common infrastructure:

* Two virtual machines that use the same storage account, are in the same availability set, and on the same subnet of a virtual network.
* A single NIC and VM IP address for each virtual machine.
* A load balancer with a load balancing rule on port 80

![architecture](./media/resource-group-overview/arm_arch.png)

This topic walks you through the steps of creating a Resource Manager template for that infrastructure. The final template you create is based on a Quickstart template called [2 VMs in a Load Balancer and load balancing rules](https://azure.microsoft.com/documentation/templates/201-2-vms-loadbalancer-lbrules/).

But, that's a lot to build all at once, so let's first create a storage account and deploy it. After you have mastered creating the storage account, you will add the other resources and re-deploy the template to complete the infrastructure.

>[AZURE.NOTE] You can use any type of editor when creating the template. Visual Studio provides tools that simplify template development, but you do not need Visual Studio to complete this tutorial. For a tutorial on using Visual Studio to create a Web App and SQL Database deployment, see [Creating and deploying Azure resource groups through Visual Studio](vs-azure-tools-resource-groups-deployment-projects-create-deploy.md). 

## Create the Resource Manager template

The template is a JSON file that defines all of the resources you will deploy. It also permits you to define parameters that are specified during deployment, variables that constructed from other values and expressions, and outputs from the deployment. 

Let's start with the simplest template:

```json
    {
      "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "parameters": {  },
      "variables": {  },
      "resources": [  ],
      "outputs": {  }
    }
 ```

Save this file as **azuredeploy.json** (note that the template can have any name you want, just that it must be a json file).

## Create a storage account
Within the **resources** section, add an object that defines the storage account, as shown below. 

```json
"resources": [
  {
    "type": "Microsoft.Storage/storageAccounts",
    "name": "[parameters('storageAccountName')]",
    "apiVersion": "2015-06-15",
    "location": "[resourceGroup().location]",
    "properties": {
      "accountType": "Standard_LRS"
    }
  }
]
```

You may be wondering where these properties and values come from. The properties **type**, **name**, **apiVersion**, and **location** are standard elements that are available for all resource types. You can learn about the common elements at [Resources](resource-group-authoring-templates.md#resources). **name** is set to a parameter value that you pass in during deployment and **location** as the location used by the resource group. We'll look at how you determine **type** and **apiVersion** in the sections below.

The **properties** section contains all of the properties that are unique to a particular resource type. The values you specify in this section exactly match the PUT operation in the REST API for creating that resource type. When creating a storage account, you must provide an **accountType**. Notice in the [REST API for creating a Storage account](https://msdn.microsoft.com/library/azure/mt163564.aspx) that the properties section of the REST operation also contains an **accountType** property, and the permitted values are documented. In this example, the account type is set to **Standard_LRS**, but you could specify some other value or permit users to pass in the account type as a parameter.

Now let's jump back to the **parameters** section, and see how you define the name of the storage account. 
You can learn more about the use of parameters at [Parameters](resource-group-authoring-templates.md#parameters). 

```json
"parameters" : {
	"storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Storage Account Name"
      }
    }
}
```
Here you defined a parameter of type string that will hold the name of the storage account. The value for this parameter will be provided during template deployment.

## Deploying the template
We have a full template for creating a new storage account. As you recall, the template was saved in  **azuredeploy.json** file:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters" : {
	"storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Storage Account Name"
      }
    }
  },  
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "name": "[parameters('storageAccountName')]",
      "apiVersion": "2015-06-15",
      "location": "[resourceGroup().location]",
      "properties": {
        "accountType": "Standard_LRS"
      }
    }
  ]
}
```

There are quite a few ways to deploy a template, as you can see in the [Resource Deployment article](resource-group-template-deploy.md). To deploy the template using Azure PowerShell, use:

```powershell
# create a new resource group
New-AzureRmResourceGroup -Name ExampleResourceGroup -Location "West Europe"

# deploy the template to the resource group
New-AzureRmResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup -TemplateFile azuredeploy.json
```

Or, to deploy the template using Azure CLI, use:

```
azure group create -n ExampleResourceGroup -l "West Europe"

azure group deployment create -f azuredeploy.json -g ExampleResourceGroup -n ExampleDeployment
```

You are now the proud owner of a storage account!

The next steps will be to add all the resources required to deploy the architecture described in the start of this tutorial. You will add these resources in the same template you have been working on.

## Availability Set
After the definition for the storage account, add an availably set for the virtual machines. In this case, there are no additional properties required, so its definition is fairly simple. See the [REST API for creating an Availability Set](https://msdn.microsoft.com/library/azure/mt163607.aspx) for the full properties section, in case you want to define the update domain count and fault domain count values.

```json
{
   "type": "Microsoft.Compute/availabilitySets",
   "name": "[variables('availabilitySetName')]",
   "apiVersion": "2015-06-15",
   "location": "[resourceGroup().location]",
   "properties": {}
}
```

Notice that the **name** is set to the value of a variable. For this template, the name of the availability set is needed in a few different places. You can more easily maintain your template by defining that value once and using it in multiple places.

The value you specify for **type** contains both the resource provider and the resource type. For availability sets, the resource provider is **Microsoft.Compute** and the resource type is **availabilitySets**. You can get the list of available resource providers by running the following PowerShell command:

```powershell
    Get-AzureRmResourceProvider -ListAvailable
```

Or, if you are using Azure CLI, you can run the following command:
```
    azure provider list
```
Given that in this topic you are creating with storage accounts, virtual machines, and virtual networking, you will work with:

- Microsoft.Storage
- Microsoft.Compute
- Microsoft.Network

To see the resource types for a particular provider, run the following PowerShell command:

```powershell
    (Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute).ResourceTypes
```

Or, for Azure CLI, the following command will return the available types in JSON format and save it to a file.

```
    azure provider show Microsoft.Compute --json > c:\temp.json
```

You should see **availabilitySets** as one of the types within **Microsoft.Compute**. The full name of the type is **Microsoft.Compute/availabilitySets**. You can determine the resource type name for any of the resources in you template.

## Public IP
Define a public IP address. Again, look at the [REST API for public IP addresses](https://msdn.microsoft.com/library/azure/mt163590.aspx) for the properties to set.

```json
{
  "apiVersion": "2015-06-15",
  "type": "Microsoft.Network/publicIPAddresses",
  "name": "[parameters('publicIPAddressName')]",
  "location": "[resourceGroup().location]",
  "properties": {
    "publicIPAllocationMethod": "Dynamic",
    "dnsSettings": {
      "domainNameLabel": "[parameters('dnsNameforLBIP')]"
    }
  }
}
```

The allocation method is set to **Dynamic** but you could set it to the value you need or set it to accept a parameter value. You have enabled users of your template to pass in a value for the domain name label.

Now, let's look at how you determine the **apiVersion**. The value you specify simply matches the version of the REST API that you want to use when creating the resource. So, you can look at the REST API documentation for that resource type. Or, you can run the following PowerShell command for a particular type.

```powershell
    ((Get-AzureRmResourceProvider -ProviderNamespace Microsoft.Network).ResourceTypes | Where-Object ResourceTypeName -eq publicIPAddresses).ApiVersions
```
Which returns the following values:

    2015-06-15
    2015-05-01-preview
    2014-12-01-preview

To see the API versions with Azure CLI, run the same **azure provider show** command shown previously.

When creating a new template, pick the most recent API version.

## Virtual network and subnet
Create a virtual network with one subnet. Look at the [REST API for virtual networks](https://msdn.microsoft.com/library/azure/mt163661.aspx) for all the properties to set.

```json
{
   "apiVersion": "2015-06-15",
   "type": "Microsoft.Network/virtualNetworks",
   "name": "[parameters('vnetName')]",
   "location": "[resourceGroup().location]",
   "properties": {
     "addressSpace": {
       "addressPrefixes": [
         "10.0.0.0/16"
       ]
     },
     "subnets": [
       {
         "name": "[variables('subnetName')]",
         "properties": {
           "addressPrefix": "10.0.0.0/24"
         }
       }
     ]
   }
}
```

## Load balancer
Now you will create an external facing load balancer. Because this load balancer uses the public IP address, you must declare a dependency on the public IP address in the **dependsOn** section. This means the load balancer will not get deployed until the public IP address has finished deploying. Without defining this dependency, you will receive an error because Resource Manager will attempt to deploy the resources in parallel, and will try to set the load balancer to public IP address that doesn't exist yet. 

You will also create a backend address pool, a couple of inbound NAT rules to RDP into the VMs, and a load balancing rule with a tcp probe on port 80 in this resource definition. Checkout the [REST API for load balancer](https://msdn.microsoft.com/library/azure/mt163574.aspx) for all the properties.

```json
{
   "apiVersion": "2015-06-15",
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

## Network interface
You will create 2 network interfaces, one for each VM. Rather than having to include duplicate entries for the network interfaces, you can use the [copyIndex() function](resource-group-create-multiple.md) to iterate over the copy loop (referred to as nicLoop) and create the number network interfaces as defined in the `numberOfInstances` variables. 
The network interface depends on creation of the virtual network and the load balancer. It uses the subnet defined in the virtual network creation, and the load balancer id to configure the load balancer address pool and the inbound NAT rules.
Look at the [REST API for network interfaces](https://msdn.microsoft.com/library/azure/mt163668.aspx) for all the properties.

```json
{
   "apiVersion": "2015-06-15",
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

## Virtual machine
You will create 2 virtual machines, using copyIndex() function, as you did in creation of the [network interfaces](#network-interface).
The VM creation depends on the storage account, network interface and availability set. This VM will be created from a marketplace image, as defined in the `storageProfile` property - `imageReference` is used to define the image publisher, offer, sku and version. 
Finally, a diagnostic profile is configured to enable diagnostics for the VM. 

To find the relevant properties for a marketplace image, follow the [select Linux virtual machine images](./virtual-machines/virtual-machines-linux-cli-ps-findimage.md) or [select Windows virtual machine images](./virtual-machines/virtual-machines-windows-cli-ps-findimage.md) articles.

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

>[AZURE.NOTE] For images published by **3rd party vendors**, you will need to specify another property named `plan`. An example can be found in [this template](https://github.com/Azure/azure-quickstart-templates/tree/master/checkpoint-single-nic) from the quickstart gallery. 

You have finished defining the resources for your template.

## Parameters

In the parameters section, define the values that can be specified when deploying the template. Only define parameters for values that you think should be varied during deployment. You can provide a default value for a parameter that is used if one is not provided during deployment. You can also define the allowed values as shown for the **imageSKU** parameter.

```json
"parameters": {
    "storageAccountName": {
      "type": "string",
      "metadata": {
        "description": "Name of storage account"
      }
    },
    "adminUsername": {
      "type": "string",
      "metadata": {
        "description": "Admin username"
      }
    },
    "adminPassword": {
      "type": "securestring",
      "metadata": {
        "description": "Admin password"
      }
    },
    "dnsNameforLBIP": {
      "type": "string",
      "metadata": {
        "description": "DNS for Load Balancer IP"
      }
    },
    "vmNamePrefix": {
      "type": "string",
      "defaultValue": "myVM",
      "metadata": {
        "description": "Prefix to use for VM names"
      }
    },
    "imagePublisher": {
      "type": "string",
      "defaultValue": "MicrosoftWindowsServer",
      "metadata": {
        "description": "Image Publisher"
      }
    },
    "imageOffer": {
      "type": "string",
      "defaultValue": "WindowsServer",
      "metadata": {
        "description": "Image Offer"
      }
    },
    "imageSKU": {
      "type": "string",
      "defaultValue": "2012-R2-Datacenter",
      "allowedValues": [
        "2008-R2-SP1",
        "2012-Datacenter",
        "2012-R2-Datacenter"
      ],
      "metadata": {
        "description": "Image SKU"
      }
    },
    "lbName": {
      "type": "string",
      "defaultValue": "myLB",
      "metadata": {
        "description": "Load Balancer name"
      }
    },
    "nicNamePrefix": {
      "type": "string",
      "defaultValue": "nic",
      "metadata": {
        "description": "Network Interface name prefix"
      }
    },
    "publicIPAddressName": {
      "type": "string",
      "defaultValue": "myPublicIP",
      "metadata": {
        "description": "Public IP Name"
      }
    },
    "vnetName": {
      "type": "string",
      "defaultValue": "myVNET",
      "metadata": {
        "description": "VNET name"
      }
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_D1",
      "metadata": {
        "description": "Size of the VM"
      }
    }
  }
```

## Variables

In the variables section, you can define values that are used in more than one place in your template, or values that are constructed from other expressions or variables. Variables are frequently used to simplify the syntax of your template.

```json
"variables": {
    "availabilitySetName": "myAvSet",
    "subnetName": "Subnet-1",
    "vnetID": "[resourceId('Microsoft.Network/virtualNetworks',parameters('vnetName'))]",
    "subnetRef": "[concat(variables('vnetID'),'/subnets/',variables ('subnetName'))]",
    "publicIPAddressID": "[resourceId('Microsoft.Network/publicIPAddresses',parameters('publicIPAddressName'))]",
    "numberOfInstances": 2,
    "lbID": "[resourceId('Microsoft.Network/loadBalancers',parameters('lbName'))]",
    "frontEndIPConfigID": "[concat(variables('lbID'),'/frontendIPConfigurations/LoadBalancerFrontEnd')]",
    "lbPoolID": "[concat(variables('lbID'),'/backendAddressPools/BackendPool1')]",
    "lbProbeID": "[concat(variables('lbID'),'/probes/tcpProbe')]"
  }
```

You have completed the template! You can compare your template against the full template in the [quickstart gallery](https://github.com/Azure/azure-quickstart-templates) under [2 VMs with load balancer and load balancer rules template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-2-vms-loadbalancer-lbrules). Your template might be slightly different based on using different version numbers. 

You can re-deploy the template by using the same commands you used when deploying the storage account. You do not need to delete the storage account before re-deploying because Resource Manager will skip re-creating resources that already exist and have not changed.

## Next steps

- [Azure Resource Manager Template Visualizer (ARMViz)](http://armviz.io/#/) is a great tool to visualize ARM templates, as they might become too large to understand just from reading the json file.
- To learn more about the structure of a template, see [Authoring Azure Resource Manager templates](resource-group-authoring-templates.md).
- To learn about deploying a template, see [Deploy a Resource Group with Azure Resource Manager template](resource-group-template-deploy.md)
