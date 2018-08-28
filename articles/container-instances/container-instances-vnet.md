---
title: Deploy container instances into an Azure virtual network
description: Learn how to deploy container groups to a new or existing Azure virtual network.
services: container-instances
author: mmacy

ms.service: container-instances
ms.topic: article
ms.date: 08/28/2018
ms.author: marsma
---

# Deploy container instances into an Azure virtual network

Azure Virtual Network provides secure, private networking including filtering, routing, and peering for your Azure and on-premises resources. By deploying container groups into an Azure virtual network, your containers can communicate securely with not only other resources in the virtual network, but also resources you have on-premises or in other Azure virtual networks.

Container groups deployed into an Azure virtual network enable scenarios like the following:

* Direct communication betweem container groups in the same subnet
* Communicate with virtual machines in another subnet within the same virtual network
* Execute code in a container instance that accesses an on-premises application or database
* Container group communication with other Azure resources using service endpoints

## Deploy to new virtual network

You can deploy container groups to a new or existing Azure virtual network. Depending on the configuration of the virtual network, your containers can communicate with other Azure resources in the same virtual network, resources in another Azure virtual network, or resources on the public internet.

### Network profile

### Delegated subnet

## Deploy to existing virtual network

1. thing
1. thing2
1. thing3

## Connect to network resources

### Container group communication

### Azure service endpoints

### On-premises resources

## Next steps

* Point to AKS + ACI article

<!-- IMAGES -->

<!-- LINKS - External -->

<!-- LINKS - Internal -->