---
title: What are Azure Extended Zones?
description: Learn about Azure Extended Zones.
author: halkazwini
ms.author: halkazwini
ms.service: azure
ms.topic: overview
ms.date: 05/31/2024

---

# What is Azure Extended Zones?

Azure Extended Zones are small extensions of Azure. They're strategically located in metros, industry centers, or specific jurisdictions to accommodate workloads that require low latency and data residency. These zones support various Azure resources, including virtual machines (VMs), containers, and storage. They can run latency-sensitive and throughput-intensive applications close to end users and within approved data residency boundaries. This setup effectively addresses users' needs for low latency and data regulation compliance.

Azure Extended Zones are part of the Microsoft global network. They offer secure, reliable, and high-bandwidth connectivity for applications running in close proximity to the user. They address the needs for low latency and data residency by bringing Azure's capabilities closer to the user or within their jurisdiction. They offer all the benefits of the Azure ecosystem, including consistent access, user experience, automation, and security. Azure users can easily manage their resources, services, and workloads within Azure Extended Zones through the Azure portal and other deployment methods.

The key scenarios Azure Extended Zones enable are: 

- **Latency**: users want to run their resources, for example, media editing software, remotely with low latency.

- **Data residency**: users want their applications data to stay within a specific geography and might essentially want to host locally for various privacy, regulatory, and compliance reasons.
- 

## Service offerings for Azure Extended Zones

Azure Extended Zones enable some key Azure services for customers to deploy. The control plane for these services remains in the region and the data plane is deployed at the Extended Zone site, resulting in a smaller Azure footprint.

The following key services are available in Azure Extended Zones:

| Service category | Available services |
| ------------------ | ------------------- |
| **Compute** | Azure Virtual Machines (General Purpose Compute (A, B, D, E, F-series), GPU NVads A10 v5 series) <br> Virtual Machine Scale Sets <br> Azure Kubernetes |
| **Networking** | Azure Private Link <br> Standard public IP <br> Azure Virtual Networks <br> Virtual Network Peering <br> ExpressRoute <br> Azure Standard Load Balancer <br> DDoS (Standard protection) |
| **Storage** | Azure Managed Disks <br> Azure Premium Page Blobs <br> Azure Premium Block Blobs <br> Azure Premium Files <br>  Azure Data Lake Storage Gen2<br> Hierarchical Namespace <br>Azure Data Lake Storage Gen2 Flat Namespace <br> Change Feed <br> Blob Features <br> - SFTP <br> - NFS |
| **BCDR** | Azure Site Recovery <br> Azure Backup |


## Next step

> [!div class="nextstepaction"]
> [Deploy a virtual machine in an Extended Zone](deploy-vm-portal.md)
