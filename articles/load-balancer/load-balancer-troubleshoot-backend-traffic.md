---
title: Troubleshoot Azure Load Balancer
description: Learn how to troubleshoot known issues with Azure Load Balancer.
services: load-balancer
author: mbender-ms
manager: dcscontentpm
ms.service: load-balancer
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.date: 06/27/2023
ms.author: mbender
ms.custom: seodoc18, engagement-fy23
---

# Troubleshoot Azure Load Balancer backend traffic responses

This page provides troubleshooting information for Azure Load Balancer questions.

## Virtual machines behind a load balancer are receiving uneven distribution of traffic

If you suspect backend pool members are receiving traffic, it could be due to the following causes. Azure Load Balancer distributes traffic based on connections. Be sure to check traffic distribution per connection and not per packet. Verify using the **Flow Distribution** tab in your preconfigured [Load Balancer Insights dashboard](load-balancer-insights.md#flow-distribution).

Azure Load Balancer doesn't support true round robin load balancing but supports a hash based [distribution mode](distribution-mode-concepts.md). 

## Cause 1: You have session persistence configured

Using source persistence distribution mode can cause an uneven distribution of traffic. If this distribution isn't desired, update session persistence to be **None** so traffic is distributed across all healthy instances in the backend pool. Learn more about [distribution modes for Azure Load Balancer](distribution-mode-concepts.md).

## Cause 2: You have a proxy configured

Clients that run behind proxies might be seen as one unique client application from the load balancer's point of view.

## VMs behind a load balancer aren't responding to traffic on the configured data port

If a backend pool VM is listed as healthy and responds to the health probes, but is still not participating in the load balancing, or isn't responding to the data traffic, it may be due to any of the following reasons:

* A load balancer backend pool VM isn't listening on the data port

* Network security group is blocking the port on the load balancer backend pool VM  

* Accessing the load balancer from the same VM and NIC

* Accessing the Internet load balancer frontend from the participating load balancer backend pool VM

## Cause 1: A load balancer backend pool VM isn't listening on the data port

If a VM doesn't respond to the data traffic, it may be because either the target port isn't open on the participating VM, or, the VM isn't listening on that port. 

**Validation and resolution**

1. Sign in to the backend VM. 

2. Open a command prompt and run the following command to validate there's an application listening on the data port:  
            
    ```cmd
    netstat -an 
    ```

3. If the port isn't listed with state **LISTENING**, configure the proper listener port 

4. If the port is marked as **LISTENING**, then check the target application on that port for any possible issues.

## Cause 2: A network security group is blocking the port on the load balancer backend pool VM  

If one or more network security groups configured on the subnet or on the VM, is blocking the source IP or port, then the VM is unable to respond.

For the public load balancer, the IP address of the Internet clients will be used for communication between the clients and the load balancer backend VMs. Make sure the IP address of the clients are allowed in the backend VM's network security group.

1. List the network security groups configured on the backend VM. For more information, see [Manage network security groups](../virtual-network/manage-network-security-group.md)

2. From the list of network security groups, check if:
    
    - The incoming or outgoing traffic on the data port has interference. 
    
    - A **Deny All** network security group rule on the NIC of the VM or the subnet that has a higher priority that the default rule that allows the load balancer probes and traffic (network security groups must allow load balancer IP of 168.63.129.16, that is probe port)

3. If any of the rules are blocking the traffic, remove and reconfigure those rules to allow the data traffic.  

4. Test if the VM has now started to respond to the health probes.

## Cause 3: Access of the internal load balancer from the same VM and network interface 

If your application hosted in the backend VM of an internal load balancer is trying to access another application hosted in the same backend VM over the same network interface, it's an unsupported scenario and will fail. 

**Resolution**

You can resolve this issue via one of the following methods:

* Configure separate backend pool VMs per application. 

* Configure the application in dual NIC VMs so each application was using its own network interface and IP address. 

## Cause 4: Access of the internal load balancer frontend from the participating load balancer backend pool VM

If an internal load balancer is configured inside a virtual network, and one of the participant backend VMs is trying to access the internal load balancer frontend, failures can occur when the flow is mapped to the originating VM. This scenario isn't supported.

**Resolution**

There are several ways to unblock this scenario, including using a proxy. Evaluate Application Gateway or other third party proxies (for example, nginx or haproxy). For more information about Application Gateway, see [Overview of Application Gateway](../application-gateway/overview.md)

**Details**

Internal load balancers don't translate outbound originated connections to the front end of an internal load balancer because both are in private IP address space. Public load balancers provide [outbound connections](load-balancer-outbound-connections.md) from private IP addresses inside the virtual network to public IP addresses. For internal load balancers, this approach avoids potential SNAT port exhaustion inside a unique internal IP address space, where translation isn't required.

A side effect is that if an outbound flow from a VM in the back-end pool attempts a flow to front end of the internal load balancer in its pool _and_ is mapped back to itself, the two legs of the flow don't match. Because they don't match, the flow fails. The flow succeeds if the flow didn't map back to the same VM in the back-end pool that created the flow to the front end.

When the flow maps back to itself, the outbound flow appears to originate from the VM to the front end, and the corresponding inbound flow appears to originate from the VM to itself. From the guest operating system's point of view, the inbound and outbound parts of the same flow don't match inside the virtual machine. The TCP stack won't recognize these halves of the same flow as being part of the same flow. The source and destination don't match. When the flow maps to any other VM in the back-end pool, the halves of the flow do match and the VM can respond to the flow.

The symptom for this scenario is intermittent connection timeouts when the flow returns to the same backend that originated the flow. Common workarounds include insertion of a proxy layer behind the internal load balancer and using Direct Server Return (DSR) style rules. For more information, see [Multiple frontends for Azure Load Balancer](load-balancer-multivip-overview.md).

You can combine an internal load balancer with any third-party proxy or use internal [Application Gateway](../application-gateway/overview.md) for proxy scenarios with HTTP/HTTPS. While you could use a public load balancer to mitigate this issue, the resulting scenario is prone to [SNAT exhaustion](load-balancer-outbound-connections.md). Avoid this second approach unless carefully managed.

## Next steps

If the preceding steps don't resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).
