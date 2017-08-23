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
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 08/23/2017
ms.author: genli
---

# Troubleshooting connectivity problems between Azure VMs

You might experience connective problems between Azure VMs. This article provides troubleshooting steps to help you resolve this problem. 

[!INCLUDE [support-disclaimer](../../includes/support-disclaimer.md)]

## Symptom

A Azure VM cannot connect to another Azure VM.

## Troubleshooting guidance 

1. [Check whether the NIC is misconfigured](#step-1-check-whether-the-nic-is-misconfigured)
2. [Check whether the traffic is blocked by NSG or UDR](#step-2-check-whether-the-traffic-is-blocked-by-nsg-or-urd)
3. [Check whether the traffic is blocked by VM firewall](#step-3-check-whether-the-traffic-is-blocked-by-vm-firewall)
4. [Check whether VM Application or Service is listening the port](#step-4-check-whether-vm-application-or-service-is-listening-the-port)
5. [Check whether the problem is cuased by SNAT](#step-5-check-whether-the-problem-is-caused-by-snat)
6. [Check whether traffic is blocked by ACLs for Classic VM](#step-6-check-whether-traffic-is-blocked-by-acls-for-classic-vm)
7. [Check whether the end point is created for Classic VM](#step-7-check-whether-the-endpoint-is-created-for-classic-vm)

## Troubleshooting steps

Follow these steps to troubleshoot the problem. Check whether the problem is resolved after each step. 

### Step 1 Check whether the NIC is misconfigured

If the problem occurs after you modify the network interface (NIC), follow these steps:

**Mulit-NIC VMs**

1. Add a NIC.
2. Fix the problems in the bad NIC or remove bad NIC.  Then readd the NIC.

For more information, see [Add network interfaces to or remove from virtual machines](virtual-network-network-interface-vm.md).

**Single-NIC VM** 

[Reset network interface](../virtual-machines/windows/reset-network-interface.md). 

### Step 2 Check whether the traffic is blocked by NSG or UDR

Check for and remove user-defined routing (UDR) or Network Security Groups (NSGs) on the gateway subnet, and then test the result. If the problem is resolved, validate the settings that UDR or NSG applied.

### Step 3 Check whether the traffic is blocked by VM firewall

Disable the firewall, and then test the result. If the problem is resolved, validate the settings in the firewall.

## Step 4 Check whether VM Application or Service is listening the port

You can use one of the following methods to check whether VM Application or Service is listening the port

- Run the following commands to check whether the server is listening on that port.

**Windows VM**

    netstat –ano

**Linux VM**

    netstat -l

- Run the **Telnet** command to test the port. If the test fails, application or service is not configured to listen on the port.

## Step 5 Check whether the problem is caused by SNAT

In some scenarios, the VM is placed behind a Load balance solution that has a dependency on resources outside of Azure. In these scenarios, if you experience intermittent connection problems, the problem may be caused by [SNAT port exhaustion](../load-balancer/load-balancer-outbound-connections.md). To resolve the issue, create a VIP (or ILPIP for classic) for each VM that is behind the Load balance and secure with NSG or ACL. 

## Step 6 Check whether traffic is blocked by ACLs for Classic VM

An ACL provides the ability to selectively permit or deny traffic for a virtual machine endpoint. For more information, see [Manage the ACL on an endpoint](../virtual-machines/windows/classic/setup-endpoints#manage-the-acl-on-an-endpoint).

## Step 7 Check whether the endpoint is created for Classic VM

All VM that you create in Azure using the classic deployment model can automatically communicate over a private network channel with other virtual machines in the same cloud service or virtual network. However, computers on other virtual networks require endpoints to direct the inbound network traffic to a virtual machine. For more information, see [How to set up endpoints](../windows/classic/setup-endpoints.md).

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your issue resolved quickly.