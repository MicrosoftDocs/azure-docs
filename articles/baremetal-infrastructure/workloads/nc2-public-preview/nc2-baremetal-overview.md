---
title: What is BareMetal Infrastructure for NC2 on Azure?
description: Learn about the features BareMetal Infrastructure offers for NC2 workloads. 
ms.topic: conceptual
ms.subservice: baremetal-nutanix
ms.date: 07/01/2022
---

# What is BareMetal Infrastructure for NC2 on Azure?

In this article, we'll give an overview of the features BareMetal Infrastructure offers for Nutanix workloads.

Nutanix Cloud Clusters on Microsoft Azure provides a hybrid cloud solution that operates as a single cloud, allowing you to manage applications and infrastructure in your private cloud and Azure. With NC2 running on Azure, you can seamlessly move your applications between on-premises and Azure using a single management console. With NC2 on Azure, you can use your existing Azure accounts and networking setup (VPN, VNets, and Subnets), eliminating the need to manage any complex network overlays. With this hybrid offering, you use the same Nutanix software and licenses across your on-premises cluster and Azure to optimize your IT investment efficiently.

You use the NC2 console to create a cluster, update the cluster capacity (the number of nodes), and delete a Nutanix cluster. After you create a Nutanix cluster in Azure using NC2, you can operate the cluster in the same manner as you operate your on-prem Nutanix cluster with minor changes in the Nutanix command-line interface (nCLI), the Prism Element and Prism Central web consoles, and APIs.  


### Supported protocols

The following protocols are used for different mount points within BareMetal servers for Nutanix workload.

- OS mount – iSCSI
- Data/log – NFSv3
- backup/archieve – NFSv4

### Licensing

You can bring your own on-premises CBL Nutanix licenses. Alternatively, you can purchase licenses from Nutanix or the Azure Marketplace.

### Operating system and hypervisor

NC2 runs Nutanix Acropolis Operating System (AOS) and Nutanix Acropolis Hypervisor (AHV).

- Servers are pre-loaded with [AOS 6.1](https://www.nutanixbible.com/4-book-of-aos.html).
* AHV 6.1 is built into this product as the default hypervisor at no extra cost.
* AHV hypervisor is based on open source KVM.
* AHV will determine the lowest processor generation in the cluster and constrain all QEMU domains to that level. 
This allows mixing of processor generations within an AHV cluster and ensures the ability to live migrate between hosts.
* AOS abstracts kvm, virsh, qemu, libvirt, and iSCSI from the end-user and handles all backend configuration.
This means that users can use Prism to manage everything they would want to manage, while not needing to be concerned with low-level management.

## Next steps

Learn about the SKUs for Nutanix BareMetal workloads.

> [!div class="nextstepaction"]
> [About the Public Preview](about-the-public-preview.md)
