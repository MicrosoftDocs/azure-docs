---
title: Cross-subscription Load balancer
titleSuffix: Azure Load Balancer
description: Learn about cross-subscription load balancing with Azure Load Balancer, and the scenarios it supports.
services: load-balancer
author: mbender-ms
ms.service: load-balancer
ms.topic: overview
ms.date: 05/24/2024
ms.author: mbender
ms.custom: 
---

# Cross-subscription Load balancer
Azure Load Balancer supports cross-subscription load balancing, where the frontend IP and/or the backend pool instances can be in a different subscription than the Azure Load Balancer.

This article provides an overview of cross-subscription load balancing with Azure Load Balancer, and the scenarios it supports.

[!INCLUDE [load-balancer-cross-subscription-preview](../../includes/load-balancer-cross-subscription-preview.md)]

## What is cross-subscription load balancing?

Cross-subscription load balancing allows you to deploy Azure Load Balancer resources across multiple subscriptions. This feature enables you to deploy a load balancer in one subscription and have the frontend IP and backend pool instances in a different subscription. This capability is particularly useful for organizations that have separate subscriptions for networking and application resources.
 
:::image type="content" source="media/cross-subscription-load-balancer-overview/cross-subscription-load-balancer-concept.png" alt-text="Diagram of cross-subscription load balancer concepts with two subscriptions and resources.":::

The table below illustrates some of the possible scenarios cross-subscription load balancing supports. 
| **Subscription 1** | **Subscription 2** |
|----------------|----------------|
| Load Balancer | Backend pool resources and Frontend IP address |
| Load Balancer and Backend pool resources | Frontend IP address |
| Load Balancer and Frontend IP address | Backend pool resources |

## Cross-subscription frontend IP configurations
Cross-subscription frontends allows the frontend IP configuration to reside in a different subscription other than the load balancer’s subscription. To enable cross-subscription frontend IP configurations, the following tag needs to be set to true: “IsRemoteFrontend: True”, and the syncMode property needs to be enabled on the backend pool. 

### Public frontend IP configurations 
Public IP addresses utilized by an Azure Load Balancer can reside in different subscription than the load balancer. If multiple public IP addresses are attached to a load balancer, each IP address can come from a different subscription. For example, if we have a Load Balancer (deployed in subscription C) with 2 frontend IPs, the first IP address can reside in subscription B and the 2nd IP address can reside in subscription A.   

:::image type="content" source="media/cross-subscription-load-balancer-overview/public-frontend-ip-configuration-concept.png" alt-text="Diagram of public frontend ip configuration with cross subscription load balancing.":::

An important note is that once a frontend IP configuration is set, its subscription can’t be modified. However, the frontend IP configuration can be updated with a different IP address within the same subscription. For example, if a frontend IP configuration is attached to IP address A in subscription 1, it can be updated to IP address B also in subscription 1. 
Cross-subscription public IP addresses is only supported on the regional tier standard l oad balancer

### Internal frontend IP configurations
Like public load balancers, internal load balancers can also have cross-subscription frontend IP configurations. In this case, the subnet/ virtual network (VNet) can reside in a different subscription than the load balancer. However, unlike public frontends, all internal frontend configurations must come from the same subnet/VNET. Furthermore, all backend pools must be configured to the same VNet as the frontend IP configurations.

## Cross-subscription backend pools
Cross-subscription backends allow backend instances to reside in a different subscription other than the load balancer’s subscription. For example, the load balancer could be in subscription 1 and my backend VMs could be located in subscription 2. 
The backend instances and the virtual network they refer to can be located in a different subscription. Cross-subscription backend pools must utilize a new property known as syncmode. 

### What is syncMode
The syncMode property is a parameter that you can specify when you create a backend pool by using IP addresses and virtual network IDs. This property must be set when using cross-subscription frontends or backends. It has two possible values: “Automatic” or “Manual”.
In addition, this property replaces the concept of NIC-based or IP-based backend pools. As a result, backend pools with the syncMode property configured are a distinct type of backend pool, separate from NIC or IP-based backend pools. Backend pools can either be exclusively NIC-based, IP-based, or syncMode enabled.  

#### When should I use syncMode: “Automatic”?
With syncMode configured as “Automatic”, backend pool instances are synchronized with the load balancer configuration. As a result, changes to the backend pool instances are automatically reflected in the load balancer’s backend pool configuration. This is particularly relevant when leveraging virtual machine scale sets (VMSS) in the backend pool. When the VMSS scales in/out, the backend pool members will automatically be added or removed from the pool accordingly.
Like NIC (network interface cards) based backend pools, if syncMode is set to “Automatic”, then each backend instance’s NIC must also reference the load balancer backend pool. As a result, backend instances are added to “Automatic” syncMode backend pools by updating the NIC resource’s reference to the load balancer.

#### When should I use syncMode: “Manual”?
With syncMode configured as “Manual”, backend pool instances are not synchronized with the load balancer configuration. This mode allows you to create a backend pool with pre-provisioned private IP addresses that can be used for scenarios such as disaster recovery, active-passive, or dynamic provisioning. When leveraging “Manual” syncMode backend pools, you are responsible for updating the backend pool when any changes to your backend instances occur, such as in the case of VMSS autoscaling.

## Cross-subscription Global Load Balancer

In addition to, cross-subscription load balancing is supported for Azure global Load Balancer. With cross-subscription global load balancer, backend regional load balancers can each be located in different subscriptions. Cross-subscription backends on global load balancer do not need additional parameters or changes to the backend pool.

:::image type="content" source="media/cross-subscription-load-balancer-overview/global-load-balancer-cross-subscription-concept.png" alt-text="Diagram of cross subscription global load balancer concept":::

Note, cross-subscription frontends are not supported on Azure global Load Balancer today. 
 
## Authorization

To enable cross-subscription load balancing, a user must be assigned to the network contributor role or to a custom role that is assigned the appropriate actions listed in the following table on both subscriptions:

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
Similar to the permissions above, a user must be associated with both tenants with the permissions listed above. More information on cross-tenant linkage can be found here. 

## Limitations 
•	syncMode can only be set on new backend pools 
o	The syncMode property must be explicitly set – by default, the syncMode property is unspecified  
•	API version 2023-04-01 and above needs to be used when deploying/updating the load balancers
•	Once configured, the syncMode property cannot be changed on a backend pool 
•	A virtual network must be specified when the syncMode property is configured. Once a virtual network is configured, it can’t be updated on the backend pool 
•	Inbound NAT pools aren’t supported for cross-subscription load balancers. Please utilize inbound NAT rules    
•	All resources must be deployed in the same region as the load balancer
•	SyncMode property is not supported on cross-region load balancer backend pools
•	Cross-subscription load balancers cannot be chained to Gateway Load Balancers
•	Gateway Load Balancers cannot have cross-subscription components

## Pricing

## Next steps

> [!div class="nextstepaction"]
> <Mahip...What is the most common scenario?>
