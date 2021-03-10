---
title: Troubleshoot Azure Load Balancer
description: Learn how to troubleshoot known issues with Azure Load Balancer.
services: load-balancer
documentationcenter: na
author: asudbring
manager: dcscontentpm
ms.custom: seodoc18
ms.service: load-balancer
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 01/28/2020
ms.author: allensu
---

# Troubleshoot Azure Load Balancer backend traffic responses

This page provides troubleshooting information for Azure Load Balancer questions.

## VMs behind Load Balancer are not responding to traffic on the configured data port

If a backend pool VM is listed as healthy and responds to the health probes, but is still not participating in the Load Balancing, or is not responding to the data traffic, it may be due to any of the following reasons:
* Load Balancer Backend pool VM is not listening on the data port
* Network security group is blocking the port on the Load Balancer backend pool VM  
* Accessing the Load Balancer from the same VM and NIC
* Accessing the Internet Load Balancer frontend from the participating Load Balancer backend pool VM

## Cause 1: Load Balancer backend pool VM is not listening on the data port

If a VM does not respond to the data traffic, it may be because either the target port is not open on the participating VM, or, the VM is not listening on that port. 

**Validation and resolution**

1. Log in to the backend VM. 
2. Open a command prompt and run the following command to validate there is an application listening on the data port:  
            netstat -an 
3. If the port is not listed with State "LISTENING", configure the proper listener port 
4. If the port is marked as Listening, then check the target application on that port for any possible issues.

## Cause 2: Network security group is blocking the port on the Load Balancer backend pool VM  

If one or more network security groups configured on the subnet or on the VM, is blocking the source IP or port, then the VM is unable to respond.

For the public load balancer, the IP address of the Internet clients will be used for communication between the clients and the load balancer backend VMs. Make sure the IP address of the clients are allowed in the backend VM's network security group.

1. List the network security groups configured on the backend VM. For more information, see [Manage network security groups](../virtual-network/manage-network-security-group.md)
1. From the list of network security groups, check if:
    - the incoming or outgoing traffic on the data port has interference. 
    - a **Deny All** network security group rule on the NIC of the VM or the subnet that has a higher priority that the default rule that allows Load Balancer probes and traffic (network security groups must allow Load Balancer IP of 168.63.129.16, that is probe port)
1. If any of the rules are blocking the traffic, remove and reconfigure those rules to allow the data traffic.  
1. Test if the VM has now started to respond to the health probes.

## Cause 3: Accessing the Load Balancer from the same VM and Network interface 

If your application hosted in the backend VM of a Load Balancer is trying to access another application hosted in the same backend VM over the same Network Interface, it is an unsupported scenario and will fail. 

**Resolution**
You can resolve this issue via one of the following methods:
* Configure separate backend pool VMs per application. 
* Configure the application in dual NIC VMs so each application was using its own Network interface and IP address. 

## Cause 4: Accessing the internal Load Balancer frontend from the participating Load Balancer backend pool VM

If an internal Load Balancer is configured inside a VNet, and one of the participant backend VMs is trying to access the internal Load Balancer frontend, failures can occur when the flow is mapped to the originating VM. This scenario is not supported.

**Resolution**
There are several ways to unblock this scenario, including using a proxy. Evaluate Application Gateway or other 3rd party proxies (for example, nginx or haproxy). For more information about Application Gateway, see [Overview of Application Gateway](../application-gateway/overview.md)

**Details**
Internal Load Balancers don't translate outbound originated connections to the front end of an internal Load Balancer because both are in private IP address space. Public Load Balancers provide [outbound connections](load-balancer-outbound-connections.md) from private IP addresses inside the virtual network to public IP addresses. For internal Load Balancers, this approach avoids potential SNAT port exhaustion inside a unique internal IP address space, where translation isn't required.

A side effect is that if an outbound flow from a VM in the back-end pool attempts a flow to front end of the internal Load Balancer in its pool _and_ is mapped back to itself, the two legs of the flow don't match. Because they don't match, the flow fails. The flow succeeds if the flow didn't map back to the same VM in the back-end pool that created the flow to the front end.

When the flow maps back to itself, the outbound flow appears to originate from the VM to the front end and the corresponding inbound flow appears to originate from the VM to itself. From the guest operating system's point of view, the inbound and outbound parts of the same flow don't match inside the virtual machine. The TCP stack won't recognize these halves of the same flow as being part of the same flow. The source and destination don't match. When the flow maps to any other VM in the back-end pool, the halves of the flow do match and the VM can respond to the flow.

The symptom for this scenario is intermittent connection timeouts when the flow returns to the same backend that originated the flow. Common workarounds include insertion of a proxy layer behind the internal Load Balancer and using Direct Server Return (DSR) style rules. For more information, see [Multiple Frontends for Azure Load Balancer](load-balancer-multivip-overview.md).

You can combine an internal Load Balancer with any third-party proxy or use internal [Application Gateway](../application-gateway/overview.md) for proxy scenarios with HTTP/HTTPS. While you could use a public Load Balancer to mitigate this issue, the resulting scenario is prone to [SNAT exhaustion](load-balancer-outbound-connections.md). Avoid this second approach unless carefully managed.

## Next steps

If the preceding steps do not resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).