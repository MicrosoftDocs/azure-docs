---
title: Troubleshoot common problems with Azure Load Balancer
description: Learn how to troubleshoot common problems with Azure Load Balancer.
services: load-balancer
author: mbender-ms
manager: kumudD
ms.service: azure-load-balancer
ms.topic: troubleshooting
ms.date: 01/09/2024
ms.author: mbender
ms.custom: engagement-fy23
---

# Troubleshoot Azure Load Balancer

This article provides troubleshooting information for common questions about Azure Load Balancer (Basic and Standard tiers). For more information about Standard Load Balancer, see the [Standard Load Balancer overview](load-balancer-standard-diagnostics.md).

When a load balancer's connectivity is unavailable, the most common symptoms are:

- Virtual machines (VMs) behind the load balancer aren't responding to health probes.
- VMs behind the load balancer aren't responding to the traffic on the configured port.

When the external clients to the backend VMs go through the load balancer, the IP address of the clients is used for the communication. Make sure the IP address of the clients is added to the network security group (NSG) allowlist.

## Problem: No outbound connectivity from Standard internal load balancers

### Validation and resolution

Standard internal load balancers (ILBs) have default security features. Basic ILBs allow connecting to the internet via a hidden public IP address called the *default outbound access IP*. We don't recommend connecting via default outbound access IP for production workloads, because the IP address isn't static or locked down via network security groups that you own.

If you recently moved from a Basic ILB to a Standard ILB and need outbound connectivity to the internet from your VMs, you can configure [Azure NAT Gateway](../virtual-network/nat-gateway/nat-overview.md) on your subnet. We recommend NAT Gateway for all outbound access in production scenarios.

## Problem: No inbound connectivity to Standard external load balancers

### Cause

Standard load balancers and standard public IP addresses are closed to inbound connections unless network security groups open them. You use NSGs to explicitly permit allowed traffic. You must configure your NSGs to explicitly permit allowed traffic. If you don't have an NSG on a subnet or network interface card (NIC) of your VM resource, traffic isn't allowed to reach the resource.

### Resolution

To allow ingress traffic, [add a network security group](../virtual-network/manage-network-security-group.md) to the subnet or interface for your virtual resource.

## Problem: Can't change the backend port for an existing load-balancing rule of a load balancer that has a virtual machine scale set deployed in the backend pool

### Cause

When a load balancer is configured with a virtual machine scale set, you can't modify the backend port of a load-balancing rule while it's associated with a health probe.

### Resolution

To change the port, you can remove the health probe. Update the virtual machine scale set, update the port, and then configure the health probe again.

## Problem: Small traffic still going through the load balancer after removal of VMs from the backend pool

### Cause

VMs removed from load balancer's backend pool should no longer receive traffic. The small amount of network traffic could be related to storage, Domain Name System (DNS), and other functions within Azure.

### Resolution

To verify, you can conduct a network trace. The properties of each storage account list the fully qualified domain name (FQDN) for your blob storage account. From a virtual machine within your Azure subscription, you can perform `nslookup` to determine the Azure IP assigned to that storage account.

## Problem: Load Balancer in a failed state

### Resolution

1. Go to [Azure Resource Explorer](https://resources.azure.com/) and identify the resource that's in a failed state.
1. Update the toggle in the upper-right corner to **Read/Write**.
1. Select **Edit** for the resource in failed state.
1. Select **PUT** followed by **GET** to ensure that the provisioning state changed to **Succeeded**.

You can then proceed with other actions, because the resource is out of a failed state.

## Network captures for support tickets

If the preceding resolutions don't resolve the problem, open a [support ticket](https://azure.microsoft.com/support/options/).

If you decide to open a support ticket, collect network captures for a quicker resolution. Choose a single backend VM to perform the following tests:

- Use `ps ping` from one of the backend VMs in the virtual network to test the probe port response (example: `ps ping 10.0.0.4:3389`) and record results.
- If you don't receive a response in ping tests, run a simultaneous Netsh trace on the backend VM and the virtual network test VM while you run PsPing. Then stop the Netsh trace.
