---
title: What is BareMetal Infrastructure for Oracle?
description: Learn about the features BareMetal Infrastructure offers for Oracle workloads. 
ms.topic: conceptual
ms.subservice: workloads
ms.date: 04/14/2021
---

# What is BareMetal Infrastructure for Oracle?

This article gives an overview of the features BareMetal Infrastructure offers for Oracle workloads.

BareMetal Infrastructure for Oracle is based on Oracle-certified Unified Computing System (UCS) and FLexPod. The FlexPod platform delivers pre-validated storage, networking, and server technologies. It offers NFS storage, providing integration using DirectNFS protocol. The BareMetal servers are dedicated to you, with no hypervisor on the BareMetal instances. 

These instances are for running mission critical applications requiring an Oracle workload. BareMetal instances provide low latency (0.35 ms) to your applications running in Azure virtual machines (VMs). BareMetal provides shared storage disk and supports multi-casting required for node-to-node communication with a dedicated private interconnect network. 

Other features of BareMetal Infrastructure for Oracle include:

- Oracle certified UCS blades - UCSB200-M5, UCSB460-M4, UCSB480-M5
- Oracle Real Application Clusters (RAC) node-to-node (multi-cast) communication using private virtual LAN (VLAN) -40 Gb.
- Microsoft-managed hardware
  - Redundant storage, network, power, management
  - Monitoring for Infra, repairs, and replacement
  - Includes Azure ExpressRoute to the customer's domain controller
  - Secured physical and network security, can access all Azure cloud services

### Supported protocols

The following protocols are used for different mount points within BareMetal servers for Oracle workload.

- OS mount – iSCSI
- Data/log – NFSv3
- backup/archieve – NFSv4

### Licensing

- You bring your own on-premises operating system and Oracle licenses.

### Operating system

Servers are pre-loaded with operating system RHEL 7.6.

## Next steps

Learn about the SKUs for Oracle BareMetal workloads.

> [!div class="nextstepaction"]
> [BareMetal SKUs for Oracle workloads](oracle-baremetal-skus.md)
