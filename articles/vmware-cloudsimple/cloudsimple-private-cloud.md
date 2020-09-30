---
title: Azure VMware Solution by CloudSimple - Private Clouds  
description: Learn about CloudSimple concepts and advantages, including complete VMware operational continuity, compatibility with existing tools, skills, and processes.
author: sharaths-cs
ms.author: dikamath 
ms.date: 08/20/2019 
ms.topic: article 
ms.service: azure-vmware-cloudsimple 
ms.reviewer: cynthn 
manager: dikamath 
---
# CloudSimple Private Cloud overview

CloudSimple transforms and extends VMware workloads to public clouds in minutes. Using the CloudSimple service, you can deploy VMware natively on Azure bare metal infrastructure. Your deployment lives on Azure locations and fully integrates with the rest of the Azure cloud.

The CloudSimple solution provides complete VMware operational continuity. This solution gives you the public cloud benefits of:

* Elasticity
* Innovation
* Efficiency

With CloudSimple, you benefit from a cloud consumption model that lowers your total cost of ownership. It also offers on-demand provisioning, pay-as-you-grow, and capacity optimization.

CloudSimple is fully compatible with:

* Existing tools
* Skills
* Processes

This compatibility enables your teams to manage workloads on the Azure cloud, without disrupting these types of policies:

* Network
* Security  
* Data protection  
* Audit

CloudSimple manages the infrastructure and all the necessary networking and management services. The CloudSimple service enables your team to focus on:

* Business value
* Application provisioning
* Business continuity
* Support
* Policy enforcement

## Private Cloud environment overview

A Private Cloud is an isolated VMware stack that supports:

* ESXi hosts
* vCenter
* vSAN
* NSX

Private Clouds are managed through the CloudSimple portal. They have their own vCenter server in its own management domain.

The stack runs on:

* Dedicated nodes
* Isolated bare metal hardware nodes

Users consume the stack through native VMware tools, including:

* vCenter
* NSX Manager

You can deploy dedicated nodes in Azure locations. Then you can manage them with Azure and CloudSimple. A Private Cloud consists of one or more vSphere clusters, and each cluster contains 3 to 16 nodes.

You can create a Private Cloud using purchased, pay-as-you-go nodes, or reserved, dedicated nodes.

You can connect the Private Cloud to your on-premises environment and the Azure network using the following connections:

* Secure
* Private VPN
* Azure ExpressRoute

The Private Cloud environment is designed to eliminate single points of failure:

* ESXi clusters are configured with vSphere high availability and are sized to have at least one spare node for resiliency.
* vSAN provides redundant primary storage. vSan requires at least three nodes to provide protection against a single failure. You can configure vSAN to provide higher resiliency for larger clusters.
* You can configure vCenter, PSC, and NSX Manager VMs with RAID-10 storage policy to protect against storage failure. vSphere HA protects against node and network failures.

## Scenarios for deploying a Private Cloud

Here are some example use cases for Private Cloud deployment.

### Data center retirement or migration

* Get additional capacity when you reach the limits of your existing datacenter or refresh hardware.
* Add needed capacity in the cloud and eliminate the headaches of managing hardware refreshes.
* Reduce the risk and cost of cloud migrations compared to time-consuming conversions or rearchitecture.
* Use familiar VMware tools and skills to accelerate cloud migrations. In the cloud, use Azure services to modernize your applications at your pace.

### Expand on demand

* Expand to the cloud to meet unanticipated needs, such as new development environments or seasonal capacity bursts.
* Create new capacity on demand and keep it only as long as you need it.
* Reduce your up-front investment, accelerate speed of provisioning, and reduce complexity with the same architecture and policies across both on-premises and the cloud.

### Disaster recovery and virtual desktops in the Azure cloud

* Establish remote access to data, apps, and desktops in the Azure cloud. With high-bandwidth connections, you upload / download data fast to recover from incidents. Low-latency networks give you fast response times that users expect from a desktop app.

* Replicate all your policies and networking in the cloud using the CloudSimple portal and familiar VMware tools. Replication reduces the effort and risk of creating and managing DR and VDI implementations.

### High-performance applications and databases

* Run your most demanding workloads with the hyperconverged architecture provided by CloudSimple.
* Run Oracle, Microsoft SQL server, middleware systems, and high-performance no-SQL databases.
* Experience the cloud as your own data center with high-speed 25-Gbps network connections. High-speed connections enable you to run hybrid apps that span on-premises, VMware on Azure, and Azure private workloads, without compromising performance.

### True hybrid

* Unify DevOps across VMware and Azure services.
* Optimize VMware administration for Azure services and solutions that can be applied across all your workloads.
* Access public cloud services without having to expand your data center or rearchitect your applications.
* Centralize identities, access control policies, logging and monitoring for VMware applications on Azure.

## Limits

The following table lists the node limits on resources of a Private Cloud.

| Resource | Limit |
|----------|-------|
| Minimum number of nodes to create a Private Cloud | 3 |
| Maximum number of nodes in a cluster on a Private Cloud | 16 |
| Maximum number of nodes in a Private Cloud | 64 |
| Minimum number of nodes on a new cluster | 3 |

## Next steps

* Learn how to [create a Private Cloud](create-private-cloud.md)
* Learn how to [configure a Private Cloud environment](quickstart-create-private-cloud.md)
