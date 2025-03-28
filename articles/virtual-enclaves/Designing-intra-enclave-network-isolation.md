---
title: Intra-enclave network isolation
description: Azure Virtual Enclaves Documentation
author: jadean-msft
ms.author: jadean
ms.service: Azure Virtual Enclaves
ms.topic: overview
ms.date: 01/31/2025
---

# Intra-enclave network isolation

By default, all network traffic within an [enclave](/docs/overview/what%20is%20an%20enclave) is permitted. This means that all resources and hosts within an enclave can reach, discover, and communicate with each other. 

For certain Enclave Owners, this level of network security may not be sufficient for a variety of reasons. For example, Enclave Owners may have requirements for an enclave to host two [workloads](/docs/overview/what%20is%20a%20workload) but that those two workloads must not be able to communicate with each other.

Currently, this is the expected behavior for network traffic within an enclave. However, should Enclave Owners require greater flexibility or granularity over network traffic, they can manually make changes to the network. This can be done using native Azure cloud networking resources, though it would require Enclave Owners to specifically modify platform-designed networking behavior on resources within their enclave.

## Overview

First, Enclave Owners must identify which individual [network interfaces (NICs)](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface?tabs=azure-portal) in their Workload needs greater network isolation.

Once these NICs have been identified, Enclave Owners can add their own [Network Security Groups] to those NICs. For more details on how to perform these steps, learn more on how to [Associate or dissociate a network security group to or from a network interface
](https://learn.microsoft.com/en-us/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal#associate-or-dissociate-a-network-security-group-to-or-from-a-network-interface)

In the below image, a Network interface within the `contoso4-identity` Workload in the `contoso4` Enclave requires a custom NSG to be associated.

![image.png](/assets/image-422f6db0-6d33-4b58-8d47-ad2d3020851e.png)

Should further troubleshooting be required to investigate inter-enclave network traffic or routing issues, learn more about [Troubleshooting connectivity problems between Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-troubleshoot-connectivity-problem-between-vms) or contact [Azure Support](https://azure.microsoft.com/en-us/support/).

## References
- [What is Azure Virtual Enclaves?](/docs/overview/what%20is%20azure%20virtual%20enclaves)
- [Concepts and best practices](/docs/concepts/Concepts-and-best-practices)
- [What is an Enclave?](/docs/overview/what%20is%20an%20enclave)
- [Tutorial: Filter network traffic with Network Security Groups](https://learn.microsoft.com/en-us/azure/virtual-network/tutorial-filter-network-traffic)
- [Network Interfaces](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-network-interface?tabs=azure-portal)
- [Network security groups](https://learn.microsoft.com/en-us/azure/virtual-network/network-security-group-how-it-works)
- [Create, change, or delete a network security group](https://learn.microsoft.com/en-us/azure/virtual-network/manage-network-security-group?tabs=network-security-group-portal)
- [Troubleshooting connectivity problems between Azure VMs](https://learn.microsoft.com/en-us/azure/virtual-network/virtual-network-troubleshoot-connectivity-problem-between-vms)
- [Azure Support](https://azure.microsoft.com/en-us/support/)
