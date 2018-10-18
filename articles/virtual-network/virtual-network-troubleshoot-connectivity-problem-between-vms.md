---
title: Troubleshooting connectivity problems between Azure VMs | Microsoft Docs
description: Learn how to Troubleshoot the connectivity problems between Azure VMs.
services: virtual-network
documentationcenter: na
author: chadmath
manager: cshepard
editor: ''
tags: azure-resource-manager

ms.service: virtual-network
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/11/2018
ms.author: genli
---

# Troubleshooting connectivity problems between Azure VMs

You might experience connectivity problems between Azure virtual machines (VMs). This article provides troubleshooting steps to help you resolve this problem. 

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Symptom

One Azure VM cannot connect to another Azure VM.

## Troubleshooting guidance 

1. [Check whether NIC is misconfigured](#step-1-check-whether-nic-is-misconfigured)
2. [Check whether network traffic is blocked by NSG or UDR](#step-2-check-whether-network-traffic-is-blocked-by-nsg-or-udr)
3. [Check whether network traffic is blocked by VM firewall](#step-3-check-whether-network-traffic-is-blocked-by-vm-firewall)
4. [Check whether VM app or service is listening on the port](#step-4-check-whether-vm-app-or-service-is-listening-on-the-port)
5. [Check whether the problem is caused by SNAT](#step-5-check-whether-the-problem-is-caused-by-snat)
6. [Check whether traffic is blocked by ACLs for the classic VM](#step-6-check-whether-traffic-is-blocked-by-acls-for-the-classic-vm)
7. [Check whether the endpoint is created for the classic VM](#step-7-check-whether-the-endpoint-is-created-for-the-classic-vm)
8. [Try to connect to a VM network share](#step-8-try-to-connect-to-a-vm-network-share)
9. [Check Inter-Vnet connectivity](#step-9-check-inter-vnet-connectivity)

## Troubleshooting steps

Follow these steps to troubleshoot the problem. After you complete each step, check whether the problem is resolved. 

### Step 1: Check whether NIC is misconfigured

Follow the steps in [How to reset network interface for Azure Windows VM](../virtual-machines/windows/reset-network-interface.md). 

If the problem occurs after you modify the network interface (NIC), follow these steps:

**Multi-NIC VMs**

1. Add a NIC.
2. Fix the problems in the bad NIC or remove the bad NIC.  Then add the NIC again.

For more information, see [Add network interfaces to or remove from virtual machines](virtual-network-network-interface-vm.md).

**Single-NIC VM** 

- [Redeploy Windows VM](../virtual-machines/windows/redeploy-to-new-node.md)
- [Redeploy Linux VM](../virtual-machines/linux/redeploy-to-new-node.md)

### Step 2: Check whether network traffic is blocked by NSG or UDR

Use [Network Watcher IP Flow Verify](../network-watcher/network-watcher-ip-flow-verify-overview.md) and [NSG Flow Logging](../network-watcher/network-watcher-nsg-flow-logging-overview.md) to determine whether there is a Network Security Group (NSG) or User-Defined Route (UDR) that is interfering with traffic flow.

### Step 3: Check whether network traffic is blocked by VM firewall

Disable the firewall, and then test the result. If the problem is resolved, verify the firewall settings, and then re-enable the firewall.

### Step 4: Check whether VM app or service is listening on the port

You can use one of the following methods to check whether the VM app or service is listening on the port.

- Run the following commands to check whether the server is listening on that port.

**Windows VM**

    netstat –ano

**Linux VM**

    netstat -l

- Run the **telnet** command on the virtual machine itself to test the port. If the test fails, the application or service is not configured to listen on that port.

### Step 5: Check whether the problem is caused by SNAT

In some scenarios, the VM is placed behind a load balance solution that has a dependency on resources outside of Azure. In these scenarios, if you experience intermittent connection problems, the problem may be caused by [SNAT port exhaustion](../load-balancer/load-balancer-outbound-connections.md). To resolve the issue, create a VIP (or ILPIP for classic) for each VM that is behind the load balancer and secure with NSG or ACL. 

### Step 6: Check whether traffic is blocked by ACLs for the classic VM

An  access control list (ACL) provides the ability to selectively permit or deny traffic for a virtual machine endpoint. For more information, see [Manage the ACL on an endpoint](../virtual-machines/windows/classic/setup-endpoints.md#manage-the-acl-on-an-endpoint).

### Step 7: Check whether the endpoint is created for the classic VM

All VMs that you create in Azure by using the classic deployment model can automatically communicate over a private network channel with other virtual machines in the same cloud service or virtual network. However, computers on other virtual networks require endpoints to direct the inbound network traffic to a virtual machine. For more information, see [How to set up endpoints](../virtual-machines/windows/classic/setup-endpoints.md).

### Step 8: Try to connect to a VM network share

If you cannot connect to a VM network share, the problem may be caused by unavailable NICs in the VM. To delete the unavailable NICs, see [How to delete the unavailable NICs](../virtual-machines/troubleshooting/reset-network-interface.md#delete-the-unavailable-nics)

### Step 9: Check Inter-Vnet connectivity

Use [Network Watcher IP Flow Verify](../network-watcher/network-watcher-ip-flow-verify-overview.md) and [NSG Flow Logging](../network-watcher/network-watcher-nsg-flow-logging-overview.md) to determine whether there is a NSG or UDR that is interfering with traffic flow. You can also verify your Inter-Vnet configuration [here](https://support.microsoft.com/en-us/help/4032151/configuring-and-validating-vnet-or-vpn-connections).

### Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.