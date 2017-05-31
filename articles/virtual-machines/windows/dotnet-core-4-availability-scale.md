---
title: Availability and Scale in Azure Resource Manager Templates | Microsoft Docs
description: Azure Virtual Machine DotNet Core Tutorial
services: virtual-machines-windows
documentationcenter: virtual-machines
author: neilpeterson
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 494724b5-06af-4dea-a774-ba580cf27527
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 05/12/2017
ms.author: nepeters
ms.custom: H1Hack27Feb2017

---
# Availability and scale in Azure Resource Manager templates for Windows VMs

Availability and scale refer to uptime and the ability to meet demand. If an application must be up 99.9% of the time, it needs to have an architecture that allows for multiple concurrent compute resources. For instance, rather than having a single website, a configuration with a higher level of availability includes multiple instances of the same site, with balancing technology in front of them. In this configuration, one instance of the application can be taken down for maintenance, while the remaining continue to function. Scale on the other hand refers to an applications ability to serve demand. With a load balanced application, adding or removing instances from the pool allows an application to scale to meet demand.

This document details how the Music Store sample deployment is configured for availability and scale. All dependencies and unique configurations are highlighted. For the best experience, pre-deploy an instance of the solution to your Azure subscription and work along with the Azure Resource Manager template. The complete template can be found here – [Music Store Deployment on Windows](https://github.com/Microsoft/dotnet-core-sample-templates/tree/master/dotnet-core-music-windows).

## Availability Set
An Availability Set logically spans Azure Virtual Machines across physical hosts and other infrastructural components such as power supplies and physical networking hardware. Availability sets ensure that during maintenance, device failure, or other down time, not all virtual machines are effected. An Availability Set can be added to an Azure Resource Manager template using the Visual Studio Add New Resource Wizard, or inserting valid JSON into a template.

Follow this link to see the JSON sample within the Resource Manager template – [Availability Set](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L368).

```json
{
  "apiVersion": "2015-06-15",
  "type": "Microsoft.Compute/availabilitySets",
  "name": "[variables('availabilitySetName')]",
  "location": "[resourceGroup().location]",
  "tags": {
    "displayName": "availability-set"
  },
  "properties": {
  }
}
```

An Availability Set is declared as a property of a Virtual Machine resource. 

Follow this link to see the JSON sample within the Resource Manager template – [Availability Set association with Virtual Machine](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L302).

```json
"properties": {
  "availabilitySet": {
    "id": "[resourceId('Microsoft.Compute/availabilitySets', variables('availabilitySetName'))]"
  }
```
The availability set as seen from the Azure portal. Each virtual machine and details about the configuration are detailed here.

![Availability Set](./media/dotnet-core-4-availability-scale/ase-win.png)

For in-depth information on Availability Sets, see [Manage availability of virtual machines](manage-availability.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

## Network Load Balancer
Whereas an availability set provides application fault tolerance, a load balancer makes many instances of the application available on a single network address. Multiple instances of an application can be hosted on many virtual machines, each one connected to a load balancer. As the application is accessed, the load balancer routes the incoming request across the attached members. A Load Balancer can be added using the Visual Studio Add New Resource Wizard, or by inserting properly formatted JSON resource into the Azure Resource Manager template.

Follow this link to see the JSON sample within the Resource Manager template – [Network Load Balancer](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L198).

```json
{
  "apiVersion": "2015-06-15",
  "type": "Microsoft.Network/loadBalancers",
  "name": "[variables('loadBalancerName')]",
  "location": "[resourceGroup().location]",
  "tags": {
    "displayName": "load-balancer"
  },
  ........<truncated>
}
```

Because the sample application is exposed to the internet with a public IP address, this address is associated with the load balancer. 

Follow this link to see the JSON sample within the Resource Manager template – [Network Load Balancer association with Public IP Address](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L211).

```json
"frontendIPConfigurations": [
  {
    "properties": {
      "publicIPAddress": {
        "id": "[resourceId('Microsoft.Network/publicIPAddresses', variables('publicIpAddressName'))]"
      }
    },
    "name": "LoadBalancerFrontend"
  }
]
```

From the Azure portal, the network load balancer overview shows the association with the public IP address.

![Network Load Balancer](./media/dotnet-core-4-availability-scale/nlb-win.png)

## Load Balancer Rule
When using a load balancer, rules are configured that control how traffic is balanced across the intended resources. With the sample Music Store application, traffic arrives on port 80 of the public IP address and is distributed across port 80 of all virtual machines. 

Follow this link to see the JSON sample within the Resource Manager template – [Load Balancer Rule](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L226).

```json
"loadBalancingRules": [
  {
    "name": "[variables('loadBalencerRule')]",
    "properties": {
      "frontendIPConfiguration": {
        "id": "[concat(resourceId('Microsoft.Network/loadBalancers', variables('loadBalancerName')), '/frontendIPConfigurations/LoadBalancerFrontend')]"
      },
      "backendAddressPool": {
        "id": "[variables('lbPoolID')]"
      },
      "protocol": "Tcp",
      "frontendPort": 80,
      "backendPort": 80,
      "enableFloatingIP": false,
      "idleTimeoutInMinutes": 5,
      "probe": {
        "id": "[variables('lbProbeID')]"
      }
    }
  }
]
```

A view of the network load balancer rule from the portal.

![Network Load Balancer Rule](./media/dotnet-core-4-availability-scale/lbrule-win.png)

## Load Balancer Probe
The load balancer also needs to monitor each virtual machine so that requests are served only to running systems. This monitoring takes place by constant probing of a pre-defined port. The Music Store deployment is configured to probe port 80 on all included virtual machines. 

Follow this link to see the JSON sample within the Resource Manager template – [Load Balancer Probe](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L247).

```json
"probes": [
  {
    "properties": {
      "protocol": "Tcp",
      "port": 80,
      "intervalInSeconds": 15,
      "numberOfProbes": 2
    },
    "name": "lbprobe"
  }
]
```

The load balancer probe seen from the Azure portal.

![Network Load Balancer Probe](./media/dotnet-core-4-availability-scale/lbprobe-win.png)

## Inbound NAT Rules
When using a Load Balancer, rules need to be put into place that provide non-load balanced access to each Virtual Machine. For instance, when creating an RDP connection with each virtual machine, this traffic should not be load balanced, rather a pre-determined path should be configured. Pre-determined paths are configured using an Inbound NAT Rule resource. Using this resource, inbound communication can be mapped to individual Virtual Machines. 

With the Music Store application, a port starting at 5000 is mapped to port 3389 on each Virtual Machine for RDP access. The `copyindex()` function is used to increment the incoming port, such that the second Virtual Machine receives an incoming port of 5001, the third 5002, and so on.

Follow this link to see the JSON sample within the Resource Manager template – [Inbound NAT Rules](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L260). 

```json
{
  "apiVersion": "2015-06-15",
  "type": "Microsoft.Network/loadBalancers/inboundNatRules",
  "name": "[concat(variables('loadBalancerName'), '/', 'RDP-VM', copyIndex())]",
  "location": "[resourceGroup().location]",
  "tags": {
    "displayName": "load-balancer-nat-rule"
  },
  "copy": {
    "name": "lbNatLoop",
    "count": "[parameters('numberOfInstances')]"
  },
  "dependsOn": [
    "[concat('Microsoft.Network/loadBalancers/', variables('loadBalancerName'))]"
  ],
  "properties": {
    "frontendIPConfiguration": {
      "id": "[variables('ipConfigID')]"
    },
    "protocol": "tcp",
    "frontendPort": "[copyIndex(5000)]",
    "backendPort": 3389,
    "enableFloatingIP": false
  }
}
```

One example inbound NAT rule as seen in the Azure portal. An RDP NAT rule is created for each virtual machine in the deployment.

![Inbound NAT Rule](./media/dotnet-core-4-availability-scale/natrule-win.png)

For in-depth information on the Azure Network Load Balancer, see [Load balancing for Azure infrastructure services](load-balance.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Deploy multiple VMs
Finally, for an Availability Set or Load Balancer to effectively function, multiple virtual machines are required. Multiple VMs can be deployed using the Azure Resource Manager template copy function. Using the copy function, it is not necessary to define a finite number of Virtual Machines, rather this value can be dynamically provided at the time of deployment. The copy function consumes the number of instances to be created and handles deploying the proper number of virtual machines and associated resources.

In the Music Store Sample template, a parameter is defined that takes in an instance count. This number is used throughout the template when creating virtual machines and related resources.

```json
"numberOfInstances": {
  "type": "int",
  "minValue": 1,
  "defaultValue": 2,
  "metadata": {
    "description": "Number of VM instances to be created behind load balancer."
  }
},
```

On the Virtual Machine resource, the copy loop is given a name and the number of instances parameter used to control the number of resulting copies.

Follow this link to see the JSON sample within the Resource Manager template – [Virtual Machine Copy Function](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L290). 

```json
{
  "apiVersion": "2015-06-15",
  "type": "Microsoft.Compute/virtualMachines",
  "name": "[concat(variables('vmName'),copyindex())]",
  "location": "[resourceGroup().location]",
  "copy": {
    "name": "virtualMachineLoop",
    "count": "[parameters('numberOfInstances')]"
  }
```

The current iteration of the copy function can be accessed with the `copyIndex()` function. The value of the copy index function can be used to name virtual machines and other resources. For instance, if two instances of a virtual machine are deployed, they need different names. The `copyIndex()` function can be used as part of the virtual machine name to create a unique name. An example of the `copyindex()` function used for naming purposes can be seen in the Virtual Machine resource. Here, the computer name is a concatenation of the `vmName` parameter, and the `copyIndex()` function. 

Follow this link to see the JSON sample within the Resource Manager template – [Copy Index Function](https://github.com/Microsoft/dotnet-core-sample-templates/blob/master/dotnet-core-music-windows/azuredeploy.json#L309). 

```json
"osProfile": {
  "computerName": "[concat(variables('vmName'),copyindex())]",
  "adminUsername": "[parameters('adminUsername')]",
  "adminPassword": "[parameters('adminPassword')]"
}
```

The `copyIndex` function is used several times in the Music Store sample template. Resources and functions utilizing `copyIndex` include anything specific to a single instance of the virtual machine such and network interface, load balancer rules, and any depends on functions. 

For more information on the copy function, see [Create multiple instances of resources in Azure Resource Manager](../../resource-group-create-multiple.md).

## Next step
<hr>

[Step 4 - Application Deployment with Azure Resource Manager Templates](dotnet-core-5-app-deployment.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

