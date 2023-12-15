---
title: What is BareMetal Infrastructure for Nutanix Cloud Clusters on Azure?
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about the features BareMetal Infrastructure offers for NC2 workloads. 
ms.topic: conceptual
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 04/01/2023
---

# What is BareMetal Infrastructure for Nutanix Cloud Clusters on Azure?

In this article, we'll give an overview of the features BareMetal Infrastructure offers for Nutanix workloads.

Nutanix Cloud Clusters (NC2) on Microsoft Azure provides a hybrid cloud solution that operates as a single cloud, allowing you to manage applications and infrastructure in your private cloud and Azure. With NC2 running on Azure, you can seamlessly move your applications between on-premises and Azure using a single management console. With NC2 on Azure, you can use your existing Azure accounts and networking setup (VPN, VNets, and Subnets), eliminating the need to manage any complex network overlays. With this hybrid offering, you use the same Nutanix software and licenses across your on-premises cluster and Azure to optimize your IT investment efficiently.

You use the NC2 console to create a cluster, update the cluster capacity (the number of nodes), and delete a Nutanix cluster. After you create a Nutanix cluster in Azure using NC2, you can operate the cluster in the same manner as you operate your on-premises Nutanix cluster with minor changes in the Nutanix command-line interface (nCLI), Prism Element and Prism Central web consoles, and APIs.  

## Supported protocols

The following protocols are used for different mount points within BareMetal servers for Nutanix workload.

- OS mount – internet small computer systems interface (iSCSI)
- Data/log – [Network File System version 3 (NFSv3)](/windows-server/storage/nfs/nfs-overview#nfs-version-3-continuous-availability)
- Backup/archive – [Network File System version 4 (NFSv4)](/windows-server/storage/nfs/nfs-overview#nfs-version-41)

## Licensing

You can bring your own on-premises capacity-based Nutanix licenses (CBLs). 
Alternatively, you can purchase licenses from Nutanix or from Azure Marketplace.

## Operating system and hypervisor

NC2 runs Nutanix Acropolis Operating System (AOS) and Nutanix Acropolis Hypervisor (AHV).

- AHV hypervisor is based on open source Kernel-based Virtual Machine (KVM).
- AHV will determine the lowest processor generation in the cluster and constrain all Quick Emulator (QEMU) domains to that level.

This functionality allows mixing of processor generations within an AHV cluster and ensures the ability to live-migrate between hosts.

AOS abstracts kvm, virsh, qemu, libvirt, and iSCSI from the end-user and handles all backend configuration.
Thus users can use Prism to manage everything they would want to manage, while not needing to be concerned with low-level management.

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Getting started with NC2 on Azure](get-started.md)
