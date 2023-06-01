---
title: Troubleshoot common issues Azure Load Balancer
description: Learn how to troubleshoot common issues with Azure Load Balancer.
services: load-balancer
author: mbender-ms
manager: kumudD
ms.service: load-balancer
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.date: 12/05/2022
ms.author: mbender
ms.custom: engagement-fy23
---

# Troubleshoot Azure Load Balancer

This page provides troubleshooting information for Basic and Standard common Azure Load Balancer questions. For more information about Standard Load Balancer, see [Standard Load Balancer overview](load-balancer-standard-diagnostics.md).

When the Load Balancer connectivity is unavailable, the most common symptoms are as follows:

- VMs behind the Load Balancer aren't responding to health probes 
- VMs behind the Load Balancer aren't responding to the traffic on the configured port

When the external clients to the backend VMs go through the load balancer, the IP address of the clients will be used for the communication. Make sure the IP address of the clients are added into the NSG allowlist.

## No outbound connectivity from Standard internal Load Balancers (ILB)

**Validation and resolution**

Standard ILBs are **secure by default**. Basic ILBs allowed connecting to the internet via a *hidden* Public IP address called the default outbound access IP. This isn't recommended for production workloads as the IP address isn't static or locked down via network security groups that you own. If you recently moved from a Basic ILB to a Standard ILB, you should create a Public IP explicitly via [Outbound only](egress-only.md) configuration, which locks down the IP via network security groups. You can also use a [NAT Gateway](../virtual-network/nat-gateway/nat-overview.md) on your subnet. NAT Gateway is the recommended solution for outbound.

## No inbound connectivity to Standard external Load Balancers (ELB)

### Cause: Standard load balancers and standard public IP addresses are closed to inbound connections unless opened by Network Security Groups. NSGs are used to explicitly permit allowed traffic. If you don't have an NSG on a subnet or NIC of your virtual machine resource, traffic isn't allowed to reach this resource.

**Resolution**
In order to allow the ingress traffic, add a Network Security Group to the Subnet or interface for your virtual resource.

## Can't change backend port for existing LB rule of a load balancer that has Virtual Machine Scale Set deployed in the backend pool.

### Cause: The backend port can't be modified for a load balancing rule that's used by a health probe for load balancer referenced by Virtual Machine Scale Set

**Resolution**
In order to change the port, you can remove the health probe by updating the Virtual Machine Scale Set, update the port and then configure the health probe again.

## Small traffic is still going through load balancer after removing VMs from backend pool of the load balancer.

### Cause: VMs removed from backend pool should no longer receive traffic. The small amount of network traffic could be related to storage, DNS, and other functions within Azure.

To verify, you can conduct a network trace. The Fully Qualified Domain Name (FQDN) used for your blob storage account is listed within the properties of each storage account.  From a virtual machine within your Azure subscription, you can perform `nslookup` to determine the Azure IP assigned to that storage account.

## Additional network captures

If you decide to open a support case, collect the following information for a quicker resolution. Choose a single backend VM to perform the following tests:

- Use `ps ping` from one of the backend VMs within the VNet to test the probe port response (example: ps ping 10.0.0.4:3389) and record results. 
- If no response is received in these ping tests, run a simultaneous Netsh trace on the backend VM and the VNet test VM while you run PsPing then stop the Netsh trace.

## Load Balancer in failed state

**Resolution**

- Once you identify the resource that is in a failed state, go to [Azure Resource Explorer](https://resources.azure.com/) and identify the resource in this state.
- Update the toggle on the right-hand top corner to **Read/Write**.
- Select **Edit** for the resource in failed state.
- Select **PUT** followed by **GET** to ensure the provisioning state was updated to Succeeded.
- You can then proceed with other actions as the resource is out of failed state.

## Next steps

If the preceding steps don't resolve the issue, open a [support ticket](https://azure.microsoft.com/support/options/).
