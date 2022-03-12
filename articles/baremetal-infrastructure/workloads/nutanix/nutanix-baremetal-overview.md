---
title: What is BareMetal Infrastructure for Nutanix?
description: Learn about the features BareMetal Infrastructure offers for Nutanix workloads. 
ms.topic: conceptual
ms.subservice: baremetal-nutanix
ms.date: 09/03/2021
---

# What is BareMetal Infrastructure for Nutanix?

In this article, we'll give an overview of the features BareMetal Infrastructure offers for Nutanix workloads.

BareMetal Infrastructure for Nutanix is based on Nutanix-certified Unified Computing System (UCS) and FLexPod. The FlexPod platform delivers pre-validated storage, networking, and server technologies. It offers NetApp Network File System (NFS) storage, providing integration using DirectNFS protocol. The BareMetal servers are dedicated to you, with no hypervisor on the BareMetal instances. 

These instances are for running mission critical applications requiring an Nutanix workload. BareMetal instances provide low latency (0.35 ms) to your applications running in Azure virtual machines (VMs). BareMetal provides shared storage. It also supports multi-casting required for node-to-node communication with a dedicated private interconnect network. 

Other features of BareMetal Infrastructure for Nutanix include:

- Nutanix certified UCS blades - UCSB200-M5, UCSB460-M4, UCSB480-M5
- Microsoft-managed hardware
  - Redundant storage, network, power, management
  - Monitoring for Infra, repairs, and replacement
  - Includes Azure ExpressRoute to the customer's domain controller
  - Secured physical and network security, can access all Azure cloud services

### Supported protocols

The following protocols are used for different mount points within BareMetal servers for Nutanix workload.

- OS mount – iSCSI
- Data/log – NFSv3
- backup/archieve – NFSv4

### Licensing

- You bring your own on-premises operating system and Nutanix licenses.

### Operating system

Servers are pre-loaded with operating system RHEL 7.6.

## Next steps

Learn about the SKUs for Nutanix BareMetal workloads.

> [!div class="nextstepaction"]
> [BareMetal SKUs for Nutanix workloads](nutanix-baremetal-skus.md)
