---
title: Integration of VNet Injection with Chaos Studio
description: Chaos Studio supports VNet Injections
services: chaos-studio
author: prashabora
ms.topic: VNet Injection
ms.date: 10/26/2022
ms.author: prashabora
ms.service: chaos-studio
ms.custom: ignite-fall-2021
---
# Integration of VNet Injection with Chaos Studio
VNet is the fundamental building block for your private network in Azure. VNet enables many Azure resources to securely communicate with each other, the internet, and on-premises networks. VNet is like a traditional network you would operate in your own data center. However, VNet also has the benefits of Azure infrastructure, scale, availability, and isolation.
## How VNet Injection works in Chaos Studio
VNet injection allows Chaos resource provider to inject containerized workloads into your VNet. This means that resources without public internet access can be accessed via a private IP address on the VNet.
1. Register the Microsoft.ContainerInstance resource provider with your subscription (if applicable).
2. Re-register the Microsoft.Chaos resource provider with your subscription.
3. Create a subnet named ChaosStudioSubnet in the VNet you want to inject into.
4. Set the properties.subnetId property when you create or update the Target resource. The value should be the resource ID of the subnet created in step 1.
5. Start the experiment.
## Limitations
At present the VNet injection will only be possible in subscriptions/regions where Azure Container Instances and Azure Relay are available. 
## Next steps
Now that you understand how VNet Injection can be achieved for Chaos Studio, you're ready to:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Create and run your first Azure Kubernetes Service experiment](chaos-studio-tutorial-aks-portal.md)
