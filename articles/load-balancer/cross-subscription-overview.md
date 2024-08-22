---
title: Cross-subscription Load balancer
titleSuffix: Azure Load Balancer
description: Learn about cross-subscription load balancing with Azure Load Balancer, and the scenarios it supports.
services: load-balancer
author: mbender-ms
ms.service: azure-load-balancer
ms.topic: overview
ms.date: 06/18/2024
ms.author: mbender
ms.custom: 
---

# Cross-subscription Load balancer
Azure Load Balancer supports cross-subscription load balancing, where the frontend IP and/or the backend pool instances can be in a different subscription than the Azure Load Balancer.

This article provides an overview of cross-subscription load balancing with Azure Load Balancer, and the scenarios it supports.

[!INCLUDE [load-balancer-cross-subscription-preview](../../includes/load-balancer-cross-subscription-preview.md)]

## What is cross-subscription load balancing?

Cross-subscription load balancing allows you to deploy Azure Load Balancer resources across multiple subscriptions. This feature enables you to deploy a load balancer in one subscription and have the frontend IP and backend pool instances in a different subscription. This capability is useful for organizations that have separate subscriptions for networking and application resources.

:::image type="content" source="media/cross-subscription-load-balancer-overview/cross-subscription-load-balancer-concept.png" alt-text="Diagram of cross-subscription load balancer concepts with two subscriptions and resources.":::

The table below illustrates some of the possible scenarios cross-subscription load balancing supports. 

| **Subscription 1** | **Subscription 2** |
|----------------|----------------|
| Load Balancer | Backend pool resources and Frontend IP address |
| Load Balancer and Backend pool resources | Frontend IP address |
| Load Balancer and Frontend IP address | Backend pool resources |

## Cross-subscription frontend IP configurations
Cross-subscription frontends allow the frontend IP configuration to reside in a different subscription other than the load balancer’s subscription. To enable cross-subscription frontend IP configurations, the following tag needs to be set to true: “IsRemoteFrontend: True”, and the SyncMode property needs to be enabled on the backend pool. 

### Public frontend IP configurations 
Public IP addresses utilized by an Azure Load Balancer can reside in different subscription than the load balancer. If multiple public IP addresses are attached to a load balancer, each IP address can come from a different subscription. For example, if we have a Load Balancer (deployed in subscription C) with two frontend IPs, the first IP address can reside in subscription B and the second IP address can reside in subscription A.   

:::image type="content" source="media/cross-subscription-load-balancer-overview/public-frontend-ip-configuration-concept.png" alt-text="Diagram of public frontend ip configuration with cross subscription load balancing.":::

An important note is that once a frontend IP configuration is set, its subscription can’t be modified. However, the frontend IP configuration can be updated with a different IP address within the same subscription. For example, if a frontend IP configuration is attached to IP address A in subscription 1, it can be updated to IP address B also in subscription 1. 
Cross-subscription public IP addresses are only supported on the regional tier standard load balancer

### Internal frontend IP configurations
Like public load balancers, internal load balancers can also have cross-subscription frontend IP configurations. In this case, the subnet/virtual network can reside in a different subscription than the load balancer. However, unlike public frontends, all internal frontend configurations must come from the same subnet/virtual network. Furthermore, all backend pools must be configured to the same virtual network as the frontend IP configurations.

## Cross-subscription backend pools
Cross-subscription backends allow backend instances to reside in a different subscription other than the load balancer’s subscription. For example, the load balancer could be in subscription 1 and my backend VMs could be located in subscription 2. 
The backend instances and the virtual network they refer to can be located in a different subscription. Cross-subscription backend pools must utilize a new property known as *SyncMode*. 

### What is SyncMode
The *SyncMode* property is a parameter that you can specify when you create a backend pool by using IP addresses and virtual network IDs. This property must be set when using cross-subscription frontends or backends. It has two possible values: “Automatic” or “Manual”.
In addition, this property replaces the concept of NIC-based or IP-based backend pools. As a result, backend pools with the SyncMode property configured are a distinct type of backend pool, separate from NIC or IP-based backend pools. Backend pools can either be exclusively NIC-based, IP-based, or SyncMode enabled.  

#### When should I use SyncMode: “Automatic”?
With SyncMode configured as “Automatic”, backend pool instances are synchronized with the load balancer configuration. As a result, changes to the backend pool instances are automatically reflected in the load balancer’s backend pool configuration. This is relevant when using virtual machine scale sets in the backend pool. When the scale set scales in/out, the backend pool members will automatically be added or removed from the pool accordingly.
Like NIC (network interface cards) based backend pools, if SyncMode is set to “Automatic”, then each backend instance’s NIC must also reference the load balancer backend pool. As a result, backend instances are added to “Automatic” SyncMode backend pools by updating the NIC resource’s reference to the load balancer.

#### When should I use SyncMode: “Manual”?
With SyncMode configured as “Manual”, backend pool instances aren't synchronized with the load balancer configuration. This mode allows you to create a backend pool with pre-provisioned private IP addresses that can be used for scenarios such as disaster recovery, active-passive, or dynamic provisioning. When using “Manual” SyncMode backend pools, you're responsible for updating the backend pool when any changes to your backend instances occur, such as with a scale set autoscaling.

## Cross-subscription Global Load Balancer

In addition, cross-subscription load balancing is supported for Azure global Load Balancer. With cross-subscription global load balancer, backend regional load balancers can each be located in different subscriptions. Cross-subscription backends on a global load balancer don't need other parameters or changes to the backend pool.

:::image type="content" source="media/cross-subscription-load-balancer-overview/global-load-balancer-cross-subscription-concept-thumbnail.png" alt-text="Diagram of cross subscription global load balancer concept." lightbox="media/cross-subscription-load-balancer-overview/global-load-balancer-cross-subscription-concept.png":::

> [!NOTE]
>  Cross-subscription frontends aren't supported on Azure global Load Balancer today. 
 
## Authorization

To enable cross-subscription load balancing, a user must be assigned to the *Network Contributor* role or to a custom role that is assigned the appropriate actions listed in the following table on both subscriptions:

### Cross-subscription Frontends

#### Public Frontends
Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action
Microsoft.Network/publicIPAddresses/join/action

#### Internal Frontends
Microsoft.Network/loadBalancers/frontendIPConfigurations/join/action

### Cross-subscription Backends 
Microsoft.Network/loadBalancers/backendAddressPools/write  
Microsoft.Network/loadBalancers/backendAddressPools/join/action
Microsoft.Network/virtualNetworks/write
Microsoft.Network/networkInterfaces/write

### Cross-tenant  
When working cross-tenant, a user must be assigned to the *Network Contributor* role or to a custom role that is assigned the appropriate actions for cross-subscription frontends in both subscriptions. More information on cross-tenant linkage, see [Authenticate requests across tenants](../azure-resource-manager/management/authenticate-multi-tenant.md). 

## Limitations 
- SyncMode can only be set on new backend pools 
  - The SyncMode property must be explicitly set – by default, the SyncMode property is unspecified  
- API version 2023-04-01 and above needs to be used to when deploying/updating the load balancers
- Once configured, the SyncMode property can't be changed on a backend pool 
- A virtual network must be specified when the SyncMode property is configured. Once a virtual network is configured, it can’t be updated on the backend pool 
- Inbound NAT pools aren’t supported for cross-subscription load balancers. Utilize inbound NAT rules    
- All resources must be deployed in the same region as the load balancer
- SyncMode property isn't supported on cross-region load balancer backend pools
- Cross-subscription load balancers can't be chained to Gateway Load Balancers
- Gateway Load Balancers can't have cross-subscription components

## Next steps

> [!div class="nextstepaction"]
> [ Create a cross-subscription internal load balancer](./cross-subscription-how-to-internal-load-balancer.md)
