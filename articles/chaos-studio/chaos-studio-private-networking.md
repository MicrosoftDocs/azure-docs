---
title: Integration of VNet Injection with Chaos Studio
description: Chaos Studio supports VNet Injections
services: chaos-studio
author: prashabora
ms.topic: conceptual
ms.date: 10/26/2022
ms.author: prashabora
ms.service: chaos-studio
---
# VNet Injection in Chaos Studio
VNet is the fundamental building block for your private network in Azure. VNet enables many Azure resources to securely communicate with each other, the internet, and on-premises networks. VNet is like a traditional network you would operate in your own data center. However, VNet also has the benefits of Azure infrastructure, scale, availability, and isolation.

## How VNet Injection works in Chaos Studio
VNet injection allows Chaos resource provider to inject containerized workloads into your VNet. This means that resources without public internet access can be accessed via a private IP address on the VNet. Below are the steps you can follow for vnet injection:
1. Register the Microsoft.ContainerInstance resource provider with your subscription (if applicable).
2. Re-register the Microsoft.Chaos resource provider with your subscription.
3. Create a subnet named ChaosStudioSubnet in the VNet you want to inject into.
4. Set the properties.subnetId property when you create or update the Target resource. The value should be the resource ID of the subnet created in step 1.
5. Start the experiment.

## Limitations
* At present the VNet injection will only be possible in subscriptions/regions where Azure Container Instances and Azure Relay are available. 
* When you create a Target resource that you would like to enable with VNet injection, you will need Microsoft.Network/virtualNetworks/subnets/write access to the virtual network. For example, if the AKS cluster is deployed to VNet_A, then you must have permissions to create subnets in VNet_A in order to enable VNet injection for the AKS cluster. You will have to specify a subnet (in VNet_A) that the container will be deployed to.

Request Body when created Target resource with VNet injection enabled:

![Target resource with VNet Injection](images/chaos-studio-rp-vnet-injection.png)

## Next steps
Now that you understand how VNet Injection can be achieved for Chaos Studio, you're ready to:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Create and run your first Azure Kubernetes Service experiment](chaos-studio-tutorial-aks-portal.md)
