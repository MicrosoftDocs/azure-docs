---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/06/2020
ms.author: glenga
---
Private site access refers to making your app accessible only from a private network, such as an Azure virtual network.

* Private site access is available in the [Premium](../articles/azure-functions/functions-premium-plan.md), [Consumption](../articles/azure-functions/functions-scale.md#consumption-plan), and [App Service](../articles/azure-functions/functions-scale.md#app-service-plan) plans when service endpoints are configured.
    * Service endpoints can be configured on a per-app basis under **Platform features** > **Networking** > **Configure Access Restrictions** > **Add Rule**. Virtual networks can now be selected as a rule type.
    * For more information, see [Virtual network service endpoints](../articles/virtual-network/virtual-network-service-endpoints-overview.md).
    * Keep in mind that with service endpoints, your function still has full outbound access to the internet, even with virtual network integration configured.
* Private site access is also available within an App Service Environment that's configured with an internal load balancer (ILB). For more information, see [Create and use an internal load balancer with an App Service Environment](../articles/app-service/environment/create-ilb-ase.md).

To learn how to set up private site access, see [Establish Azure Functions private site access](../articles/azure-functions/functions-create-private-site-access.md).