---
title: Deploy container instances into an Azure virtual network
description: Learn how to deploy container groups to a new or existing Azure virtual network.
services: container-instances
author: mmacy

ms.service: container-instances
ms.topic: article
ms.date: 08/29/2018
ms.author: marsma
---

# Deploy container instances into an Azure virtual network

Azure Virtual Network provides secure, private networking including filtering, routing, and peering for your Azure and on-premises resources. By deploying container groups into an Azure virtual network, your containers can communicate securely with not only other resources in the virtual network, but also resources you have on-premises or in other Azure virtual networks.

Container groups deployed into an Azure virtual network enable scenarios like the following:

* Direct communication between container groups in the same subnet
* Container group communication with other Azure resources using service endpoints
* Communicate with virtual machines in another subnet within the same virtual network
* Container group communication with an on-premises application or database

## Deploy to a virtual network

You can deploy container groups to a new or existing Azure virtual network. Depending on the configuration of the virtual network, your containers can communicate with other Azure resources in the same virtual network, resources in another Azure virtual network, or resources on the public internet.

To deploy container groups into a virtual network, you need the following Azure resources:

* **Virtual network** - The virtual network defines the address space in which you create subnets. You deploy resources (like container groups) into subnets.
* **Delegated subnet** - You "delegate" a subnet to Azure Container Instances so it can create container groups in the subnet.
* **Container group network profile** - The network profile of a container group specifies the subnet it should be deployed to, and the container group's network policies.
* **Container group** - The container group is deployed to the subnet specified by the network profile, and is governed by the network policies defined in the profile.

## Deploy to new virtual network

At a high level, the process for deploying a container group to a new virtual network is:

1. Create a virtual network
1. Create a subnet
1. Delegate the subnet to Azure Container Instances
1. Create a network profile
1. Deploy a container group, specifying the network profile

## Deploy to existing virtual network

## Connect to network resources

### Container group communication

### Azure service endpoints

### On-premises resources

## Next steps

* Point to AKS + ACI article

<!-- IMAGES -->

<!-- LINKS - External -->

<!-- LINKS - Internal -->