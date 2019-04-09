---
title: Private Cloud concepts 
description: Learn about CloudSimple Private Clouds and concepts. 
author: sharaths-cs
ms.author: dikamath 
ms.date: 4/2/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Private Cloud overview

CloudSimple transforms and extends VMware workloads to public clouds in minutes. Using the CloudSimple service, you deploy VMware natively on Azure bare metal infrastructure. The deployment is in Azure locations and is fully integrated with the rest of the Azure cloud. The CloudSimple solution enables complete VMware operational continuity and provides the public cloud benefits of elasticity, innovation, and efficiency. With CloudSimple, you benefit from a cloud consumption model that lowers your total cost of ownership and offers on-demand provisioning, pay-as-you-grow, and capacity optimization.

CloudSimple is fully compatible with existing tools, skills, and processes so your teams can manage workloads on the Azure cloud without disrupting any network, security, data protection, or audit policies. CloudSimple manages the infrastructure and all the necessary networking and management services, which frees up your team to focus on business value, application provisioning, business continuity, support, and policy enforcement.

## Private Cloud environment

A Private Cloud is an  isolated VMware stack (ESXi hosts, vCenter, vSAN, and NSX) environment managed by a vCenter server in its own management domain.  The stack runs on dedicated nodes (dedicated and isolated bare metal hardware) and is consumed by users through native VMware tools that include vCenter and NSX Manager.  Dedicated nodes are deployed in Azure locations and are managed by Azure and CloudSimple.  A Private Cloud can consist of one or more vSphere clusters, where each cluster can have 3 to 16 nodes.  A Private Cloud is created using purchased pay-as-you-go or reserved, dedicated nodes. The Private Cloud can be connected to your on-premises environment and the Azure network using secure, private VPN, and Azure ExpressRoute connections.

The Private Cloud environment is designed to have no single point of failure. ESXi clusters are configured with vSphere high availability and sized to have at least one spare node for resiliency. Redundant primary storage is provided by vSAN, which requires at least three nodes to provide protection against a single failure and can be configured to provide higher resiliency for larger clusters. vCenter, PSC, and NSX Manager VMs are configured with RAID-10 storage policy to protect against storage failure and protected by vSphere HA against node and network failures.

## Scenarios for deploying a Private Cloud

* **Data center retirement or migration**. Get additional capacity when you reach limits of your existing datacenter or refresh hardware. Easily add needed capacity in the cloud, and eliminate the headaches of managing hardware refreshes. Reduce the risk and cost of cloud migrations compared to time-consuming conversions or rearchitecture. Use familiar VMware tools and skills to accelerate cloud migrations. In the cloud, use Azure services to modernize your applications at your pace.
* **Expand on demand**. Expand to the cloud to meet unanticipated needs, such as new development environments or seasonal capacity bursts. Easily create new capacity on demand and keep it only as long as you need it. Reduce your up-front investment, accelerate speed of provisioning, and reduce complexity with the same architecture and policies across both on-premises and the cloud.
* **Disaster recovery and virtual desktops in the Azure cloud.** Establish remote access to data, apps, and desktops in the Azure Cloud. With high-bandwidth connections, you upload / download data fast to recover from incidents. Low-latency networks give you fast response times that users expect from a desktop app. Easily replicate all your policies and networking in the Cloud using the CloudSimple portal and familiar VMware tools, greatly reducing the effort and risk of creating and managing DR and VDI implementations.
* **High-performance applications and databases**. CloudSimple provides a hyperconverged architecture designed to run your most demanding VMware workloads. Run Oracle, Microsoft SQL server, middleware systems, and high-performance no-SQL databases. Experience the cloud as your own data center with high speed 25-Gbps network connections that let you run hybrid apps that span on-premises, VMware on Azure and Azure private workloads without compromising performance.
* **True hybrid**. Unify DevOps across VMware and Azure. Optimize VMware administration for Azure services and solutions that can be applied across all your workloads. Access public cloud services without having to expand your data center or rearchitect your applications. Centralize identities, access control policies, logging and monitoring for VMware applications on Azure.

## Limits

Table below shows the node limits on resources of a Private Cloud.

| Resource | Limit |
|----------|-------|
| Minimum number of nodes to create a Private Cloud | 3 |
| Maximum number of nodes in a Cluster on a Private Cloud | 16 |
| Maximum number of nodes in a Private Cloud | 64 |
| Minimum number of nodes on a new Cluster | 3 |

## Next steps

* Learn how to [Create a Private Cloud](https://docs.azure.cloudsimple.com/create-private-cloud/)
* Learn how to [Configure a Private Cloud Environment](quick-create-private-cloud.md)