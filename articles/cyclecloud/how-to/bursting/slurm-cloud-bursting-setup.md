---
title: Cloud Bursting Using Azure CycleCloud and Slurm
description: Learn how to configure Cloud bursting using Azure CycleCloud and Slurm.
author: vinil-v
ms.date: 04/17/2025
ms.author: padmalathas
---

# What is Cloud Bursting?

Cloud bursting is a configuration in cloud computing that allows an organization to handle peaks in IT demand by using a combination of private and public clouds. When the resources in a private cloud reach their maximum capacity, the overflow traffic is directed to a public cloud to ensure there's no interruption in services. This setup provides flexibility and cost savings, as you only pay for the supplemental resources when there's a demand for them.

For example, an application can run on a private cloud and "burst" to a public cloud only when necessary to meet peak demands. This approach helps avoid the costs associated with maintaining extra capacity that isn't always in use.

Cloud bursting can be used in various scenarios, such as enabling on-premises workloads to be sent to the cloud for processing, known as hybrid HPC (High-Performance Computing). It allows users to optimize their resource utilization and cost efficiency while accessing the scalability and flexibility of the cloud.

## Overview

This document offers a step-by-step guide on installing and configuring a Slurm scheduler to burst computing resources into the cloud using Azure CycleCloud. It explains how to create a hybrid HPC environment by extending on-premises Slurm clusters into Azure, allowing for seamless access to scalable and flexible cloud computing resources. The guide provides a practical example of optimizing compute capacity by integrating local infrastructure with cloud-based solutions.


## Requirements to Setup Slurm Cloud Bursting Using CycleCloud on Azure

## Azure subscription account
You must obtain an Azure subscription or be assigned as an Owner role of the subscription.

* To create an Azure subscription, go to the [Create a Subscription](/azure/cost-management-billing/manage/create-subscription#create-a-subscription) documentation.
* To access an existing subscription, go to the [Azure portal](https://portal.azure.com/).

## Network infrastructure
If you intend to create a Slurm cluster entirely within Azure, you must deploy both the head nodes and the CycleCloud compute nodes within a single Azure Virtual Network (VNET). 

![Slurm cluster](../../images/slurm-cloud-burst/slurm-cloud-burst-architecture.png)

To create a hybrid HPC cluster with head nodes on your on-premises corporate network and compute nodes in Azure, set up a [Site-to-Site](/azure/vpn-gateway/tutorial-site-to-site-portal) VPN or an [ExpressRoute](/azure/expressroute/) connection. This links your network to the Azure VNET. The head nodes must be able to connect to Azure services online. You might need to work with your network administrator to set this up.

## Network Ports and Security
The following NSG rules must be configured for successful communication between Master node, CycleCloud server, and compute nodes.


| **Service**                        | **Port**        | **Protocol** | **Direction**    | **Purpose**                                                            | **Requirement**                                                                 |
|------------------------------------|-----------------|--------------|------------------|------------------------------------------------------------------------|---------------------------------------------------------------------------------|
| **SSH (Secure Shell)**             | 22              | TCP          | Inbound/Outbound | Secure command-line access to the Slurm Master node                     | Open on both on-premises firewall and Azure NSGs                                |
| **Slurm Control (slurmctld, slurmd)** | 6817, 6818   | TCP          | Inbound/Outbound | Communication between Slurm Master and compute nodes                    | Open in on-premises firewall and Azure NSGs                                     |
| **Munge Authentication Service**   | 4065            | TCP          | Inbound/Outbound | Authentication between Slurm Master and compute nodes                   | Open on both on-premises network and Azure NSGs                                 |
| **CycleCloud Service**             | 443             | TCP          | Outbound         | Communication between Slurm Master node and Azure CycleCloud            | Allow outbound connections to Azure CycleCloud services from the Slurm Master node |
| **NFS ports**                      | 2049            | TCP          | Inbound/Outbound | Shared filesystem access between Master node and Azure CycleCloud       | Open on both on-premises network and Azure NSGs                                 |
| **LDAP port** (Optional)           | 389             | TCP          | Inbound/Outbound | Centralized authentication mechanism for user management                | Open on both on-premises network and Azure NSGs                             

Refer [Slurm Network Configuration Guide](https://slurm.schedmd.com/network.html)

## Software Requirement

- **OS Version**: AlmaLinux release 8.x or Ubuntu 22.04
- **CycleCloud Version**: 8.x or later
- **CycleCloud-Slurm Project Version**: 3.0.x 

## NFS File server
A shared file system between the external Slurm Scheduler node and the CycleCloud cluster. You can use Azure NetApp Files, Azure Files, NFS, or other methods to mount the same file system on both sides. In this example, we're using a Scheduler VM as an NFS server.

## Centralized User management system (LDAP or AD)
In HPC environments, maintaining consistent user IDs (UIDs) and group IDs (GIDs) across the cluster is critical for seamless user access and resource management. A centralized user management system, such as LDAP or Active Directory (AD), ensures that UIDs and GIDs are synchronized across all compute nodes and storage systems.

> [!Important]
> 
> For more information on how to setup and instructions, see the blog post about [Slurm Cloud Bursting Using CycleCloud on Azure](https://techcommunity.microsoft.com/blog/azurehighperformancecomputingblog/setting-up-slurm-cloud-bursting-using-cyclecloud-on-azure/4140922).

### Next Steps

* [GitHub repo - cyclecloud-slurm](https://github.com/Azure/cyclecloud-slurm/tree/master)
* [Azure CycleCloud Documentation](../../overview.md)
* [Slurm documentation](https://slurm.schedmd.com/documentation.html)
