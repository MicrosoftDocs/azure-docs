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
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="03/03/2016"
   ms.author="navale;tomfitz"/>
   
# Resource Manager Template Walkthrough

This section will provide a walkthrough of a basic Azure architecture and how it is reflected in an Azure Resource Manager.
Lets look at a very simple architecture:

* Two virtual machines that use the same storage account, are in the same availability set, and on the same subnet of a virtual network.
* A single NIC and VM IP address for each virtual machine.
* A load balancer with a load balancing rule on port 80

![alt tag](media/resource-group-overview/arm_arch.png)

The full template can be found in the [quickstart gallery](https://github.com/Azure/azure-quickstart-templates) directly though this [link](https://github.com/Azure/azure-quickstart-templates/tree/master/201-2-vms-loadbalancer-lbrules).
Skipping the parameters and variables section of the template, we will go though each resource definition in the resources section.

<a href="http://armviz.io/#/?load=https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-2-vms-loadbalancer-lbrules/azuredeploy.json" target="_blank">
  <img src="http://armviz.io/visualizebutton.png"/>
</a>

## Storage Account
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

