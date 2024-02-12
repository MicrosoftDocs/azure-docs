---
title: Learn about Virtual Machine Scale Set templates
description: Learn how to create a basic scale set template for Azure Virtual Machine Scale Sets through several simple steps.
author: mimckitt
ms.author: mimckitt
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.date: 11/22/2022
ms.reviewer: jushiman
ms.custom: mimckitt

---

# Learn about Virtual Machine Scale Set templates

[Azure Resource Manager templates](../azure-resource-manager/templates/overview.md#template-deployment-process) are a great way to deploy groups of related resources. This tutorial series shows how to create a basic scale set template and how to modify this template to suit various scenarios. All examples come from this [GitHub repository](https://github.com/gatneil/mvss).

This template is intended to be simple. For more complete examples of scale set templates, see the [Azure Quickstart Templates GitHub repository](https://github.com/Azure/azure-quickstart-templates) and search for folders that contain the string `vmss`.

If you are already familiar with creating templates, you can skip to the "Next steps" section to see how to modify this template.

## Define $schema and contentVersion
First, define `$schema` and `contentVersion` in the template. The `$schema` element defines the version of the template language and is used for Visual Studio syntax highlighting and similar validation features. The `contentVersion` element is not used by Azure. Instead, it helps you keep track of the template version.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json",
  "contentVersion": "1.0.0.0",
}
```

## Define parameters

Next, define two parameters, `adminUsername` and `adminPassword`. Parameters are values you specify at the time of deployment. The `adminUsername` parameter is simply a `string` type, but because `adminPassword` is a secret, give it type `securestring`. Later, these parameters are passed into the scale set configuration.

```json
  "parameters": {
    "adminUsername": {
      "type": "string"
    },
    "adminPassword": {
      "type": "securestring"
    }
  },
```

## Define variables

Resource Manager templates also let you define variables to be used later in the template. The example doesn't use any variables, so the JSON object is empty.

```json
  "variables": {},
```

## Define resources
Next is the resources section of the template. Here, you define what you actually want to deploy. Unlike `parameters` and `variables` (which are JSON objects), `resources` is a JSON list of JSON objects.

```json
  "resources": [
    ...
  ]
```

All resources require `type`, `name`, `apiVersion`, and `location` properties. This example's first resource has type [Microsoft.Network/virtualNetwork](/azure/templates/microsoft.network/virtualnetworks), name `myVnet`, and apiVersion `2018-11-01`. (To find the latest API version for a resource type, see the [Azure Resource Manager template reference](/azure/templates/).)

```json
{
  "type": "Microsoft.Network/virtualNetworks",
  "name": "myVnet",
  "apiVersion": "2018-11-01",
}
```

## Specify location

To specify the location for the virtual network, use a [Resource Manager template function](../azure-resource-manager/templates/template-functions.md). This function must be enclosed in quotes and square brackets like this: `"[<template-function>]"`. In this case, use the `resourceGroup` function. It takes in no arguments and returns a JSON object with metadata about the resource group this deployment is being deployed to. The resource group is set by the user at the time of deployment. This value is then indexed into this JSON object with `.location` to get the location from the JSON object.

```json
  "location": "[resourceGroup().location]",
```

## Specify virtual network properties

Each Resource Manager resource has its own `properties` section for configurations specific to the resource. In this case, specify that the virtual network should have one subnet using the private IP address range `10.0.0.0/16`. A scale set is always contained within one subnet. It cannot span subnets.

```json
  {
    "properties": {
      "addressSpace": {
        "addressPrefixes": [
          "10.0.0.0/16"
        ]
      },
      "subnets": [
        {
          "name": "mySubnet",
          "properties": {
            "addressPrefix": "10.0.0.0/16"
          }
        }
      ]
    }
  },
```

## Add dependsOn list

In addition to the required `type`, `name`, `apiVersion`, and `location` properties, each resource can have an optional `dependsOn` list of strings. This list specifies which other resources from this deployment must finish before deploying this resource.

In this case, there is only one element in the list, the virtual network from the previous example. You specify this dependency because the scale set needs the network to exist before creating any VMs. This way, the scale set can give these VMs private IP addresses from the IP address range previously specified in the network properties. The format of each string in the dependsOn list is `<type>/<name>`. Use the same `type` and `name` used previously in the virtual network resource definition.

```json
  {
    "type": "Microsoft.Compute/virtualMachineScaleSets",
    "name": "myScaleSet",
    "apiVersion": "2019-03-01",
    "location": "[resourceGroup().location]",
    "dependsOn": [
      "Microsoft.Network/virtualNetworks/myVnet"
    ],
    ...
  }
```

## Specify scale set properties

Scale sets have many properties for customizing the VMs in the scale set. For a full list of these properties, see the [template reference](/azure/templates/microsoft.compute/virtualmachinescalesets). For this tutorial, only a few commonly used properties are set.

### Supply VM size and capacity

The scale set needs to know what size of VM to create ("sku name") and how many such VMs to create ("sku capacity"). To see which VM sizes are available, see the [VM Sizes documentation](../virtual-machines/sizes.md).

```json
  "sku": {
    "name": "Standard_A1",
    "capacity": 2
  },
```

### Choose type of updates

The scale set also needs to know how to handle updates on the scale set. Currently, there are three options, `Manual`, `Rolling` and `Automatic`. For more information on the differences between the two, see the documentation on [how to upgrade a scale set](./virtual-machine-scale-sets-upgrade-policy.md).

```json
  "properties": {
    "upgradePolicy": {
      "mode": "Manual"
    },
  }
```

### Choose VM operating system

The scale set needs to know what operating system to put on the VMs. Here, create the VMs with a fully patched Ubuntu 16.04-LTS image.

```json
  "virtualMachineProfile": {
    "storageProfile": {
      "imageReference": {
        "publisher": "Canonical",
        "offer": "UbuntuServer",
        "sku": "16.04-LTS",
        "version": "latest"
      }
    },
  }
```

### Specify computerNamePrefix

The scale set deploys multiple VMs. Instead of specifying each VM name, specify `computerNamePrefix`. The scale set appends an index to the prefix for each VM, so VM names have the form `<computerNamePrefix>_<auto-generated-index>`.

In the following snippet, use the parameters from before to set the administrator username and password for all VMs in the scale set. This process uses the `parameters` template function. This function takes in a string that specifies which parameter to refer to and outputs the value for that parameter.

```json
 "osProfile": {
   "computerNamePrefix": "vm",
   "adminUsername": "[parameters('adminUsername')]",
   "adminPassword": "[parameters('adminPassword')]"
  },
```

### Specify VM network configuration
Finally, specify the network configuration for the VMs in the scale set. In this case, you only need to specify the ID of the subnet created earlier. This tells the scale set to put the network interfaces in this subnet.

You can get the ID of the virtual network containing the subnet by using the `resourceId` template function. This function takes in the type and name of a resource and returns the fully qualified identifier of that resource. This ID has the form: `/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/<resourceProviderNamespace>/<resourceType>/<resourceName>`

However, the identifier of the virtual network is not enough. Provide the specific subnet that the scale set VMs should be in. To do this, concatenate `/subnets/mySubnet` to the ID of the virtual network. The result is the fully qualified ID of the subnet. Do this concatenation with the `concat` function, which takes in a series of strings and returns their concatenation.

```json
  "networkProfile": {
    "networkInterfaceConfigurations": [
      {
        "name": "myNic",
        "properties": {
          "primary": "true",
          "ipConfigurations": [
            {
              "name": "myIpConfig",
              "properties": {
                "subnet": {
                  "id": "[concat(resourceId('Microsoft.Network/virtualNetworks', 'myVnet'), '/subnets/mySubnet')]"
                }
              }
            }
          ]
        }
      }
    ]
  }
```

## Next steps

[!INCLUDE [mvss-next-steps-include](../../includes/mvss-next-steps.md)]