---
title: Create an Azure Container Service cluster into an existing virtual network | Microsoft Docs
description: This article explains how you can use the Azure Container Service Engine to deploy a brand new cluster into an existing virtual network
services: container-service
documentationcenter: ''
author: jucoriol
manager: pierlag
editor: ''
tags: acs, azure-container-service
keywords: Docker, Containers, Micro-services, Mesos, Azure, Kubernetes, Swarm, Network

ms.service: container-service
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 04/13/2017
ms.author: jucoriol

---

# Using a custom virtual network with Azure Container Service 
In this tutorial you are going to learn how to use [ACS Engine](https://github.com/Azure/acs-engine) to deploy a brand new cluster into an existing or pre-created virtual network. 
By doing this, you will be able to control the properties of the virtual network or integrate a new cluster into your existing infrastructure.

*Note: This article describes the procedure with Docker Swarm but it will work in the exact same way with the all the orchestrators available with ACS Engine: Docker Swarm, Kubernetes and DC/OS.*

## Prerequisites
You can run this walkthrough on OS X, Windows, or Linux.
- You need an Azure subscription. If you don't have one, you can [sign up for an account](https://azure.microsoft.com/).
- Install the [Azure CLI 2.0](/cli/azure/install-az-cli2).
- Install the [ACS Engine](https://github.com/Azure/acs-engine/blob/master/docs/acsengine.md)

## Create the virtual network
*You need a virtual network before creating the new cluster. If you already have one, you can skip this step.*

For this example, we deployed a virtual network that contains two subnets:

- 10.100.0.0/24
- 10.200.0.0/24

The first one will be used for the master nodes and the second one for the agent nodes. 

The Azure Resource Manager template used to deploy this virtual network is:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {  },
  "variables": {  },
  "resources": [
    {
      "apiVersion": "2016-03-30",
      "location": "[resourceGroup().location]",
      "name": "ExampleCustomVNET",
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "10.100.0.0/24",
            "10.200.0.0/24"
          ]
        },
        "subnets": [
          {
            "name": "ExampleMasterSubnet",
            "properties": {
              "addressPrefix": "10.100.0.0/24"
            }
          },
          {
            "name": "ExampleAgentSubnet",
            "properties": {
              "addressPrefix": "10.200.0.0/24"
            }
          }
        ]
      },
      "type": "Microsoft.Network/virtualNetworks"
    }
  ]
}
```

And you can deploy it using the Azure CLI 2.0. First, you need to create a new resource group:

```bash
az group create -n acs-custom-vnet -l "westeurope"
```

Then you can deploy the virtual network using the JSON description above and the following command:

```bash
az group deployment create -g acs-custom-vnet --name "CustomVNet" --template-file azuredeploy.swarm.vnet.json
```

Once the deployment is completed you should see the virtual network in the resource group.


## Create the template for ACS Engine
ACS Engine uses a JSON template in input and generates the ARM template and ARM parameters files in output.

Depending on the orchestrator you want to deploy, the number of agent pools, the machine size you want (etc.) this input template could differ from the one we are going to detail here. 

There are a lot of examples available on the [ACS Engine GitHub](https://github.com/Azure/acs-engine/tree/master/examples).

In this case, we are going to use the following template:

```json
{
  "apiVersion": "vlabs",
  "properties": {
    "orchestratorProfile": {
      "orchestratorType": "Swarm"
    },
    "masterProfile": {
      "count": 3,
      "dnsPrefix": "",
      "vmSize": "Standard_D2_v2",
      "vnetSubnetId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.Network/virtualNetworks/ExampleCustomVNET/subnets/ExampleMasterSubnet",
      "firstConsecutiveStaticIP": "10.100.0.5" 
    },
    "agentPoolProfiles": [
      {
        "name": "agentprivate",
        "count": 3,
        "vmSize": "Standard_D2_v2",
        "vnetSubnetId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.Network/virtualNetworks/ExampleCustomVNET/subnets/ExampleAgentSubnet"
      },
      {
        "name": "agentpublic",
        "count": 3,
        "vmSize": "Standard_D2_v2",
        "dnsPrefix": "",
        "vnetSubnetId": "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP_NAME/providers/Microsoft.Network/virtualNetworks/ExampleCustomVNET/subnets/ExampleAgentSubnet",
        "ports": [
          80,
          443,
          8080
        ]
      }
    ],
    "linuxProfile": {
      "adminUsername": "azureuser",
      "ssh": {
        "publicKeys": [
          {
            "keyData": ""
          }
        ]
      }
    }
  }
}
```

As you can see, for all node pools definition (master or agents) you can use the **vnetSubnetId** and **firstConsecutiveStaticIP** properties to defines the virtual network where you want to deploy the cluster and the first IP address that should be used by the first machine in the pool.

*Note: Make sure the the vnetSubnetId matches with your subnet, by giving your **SUBSCRIPTION_ID**, **RESOURCE_GROUP_NAME**, virtual network and subnet names. You also need to fill DNS prefix for all the public pools you want to create, give an SSH keys...*

## Generate the cluster Azure Resource Manager template
Once your are ready with the cluster definition file, you can use ACS Engine to generate the ARM template that will be used to deploy the cluster on Azure:

```bash
acs-engine azuredeploy.swarm.clusterdefinition.json
```

This command will output three files:

```
wrote _output/Swarm-12652785/apimodel.json
wrote _output/Swarm-12652785/azuredeploy.json
wrote _output/Swarm-12652785/azuredeploy.parameters.json
acsengine took 37.1384ms
```

- apimodel.json: this is the cluster definition file you gave to ACS Engine
- azuredeploy.json: this is the Azure Resource Manager JSON template that you are going to use to deploy the cluster
- azuredeploy.parameters.json: this is the parameters file that you are going to use to deploy the cluster

## Deploy the Azure Container Service cluster
Now that you have generated the ARM templates and its parameters file using ACS Engine, you can use Azure CLI 2.0 to start the deployment of the cluster:

```bash
az group deployment create -g acs-custom-vnet --name "ClusterDeployment" --template-file azuredeploy.json --parameters "@azuredeploy.parameters.json"
```

Depending on the number of agent you have asked for the deployment can take a while.

## Connect to your new cluster
Once the deployment is completed, you can follow [this documentation](https://docs.microsoft.com/en-us/azure/container-service/container-service-connect) to connect to your new Azure Container Service cluster.