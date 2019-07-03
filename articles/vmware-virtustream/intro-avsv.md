---
title: Introduction to Azure VMware Solution by Virtustream
description: Learn the features and benefits of Azure VMware Solution by Virtustream to deploy and manage VMware-based workloads in Azure.
services: 
author: v-jetome

ms.service: 
ms.topic: overview
ms.date: 7/5/2019
ms.author: v-jetome
ms.custom: 

---

# What is Azure VMware Solution by Virtustream (AVSV)?

Azure VMware Solution by Virtustream (AVS by Virtustream) provides you with private clouds in Azure. The private clouds contain vSphere clusters, built from dedicated bare-metal infrastructure in Azure. Private cloud clusters are scalable from 3 to 16 hosts, with the capability to have multiple clusters in a single private cloud. All private clouds are provisioned with vCenter Server, VSAN, vSphere, and NSX-T, and enable you to consume Azure services, migrate workloads from your on-premises environments, and create or deploy virtual machines (VMs).

AVS by Virtustream is a VMware validated solution with on-going validation and testing of enhancements and upgrades. The solution manages and maintains the infrastructure and the private cloud software stack so that you focus on developing and running workloads in your private clouds.

Network access from private clouds to Azure services, VNets in Azure to private clouds, and ExpressRoute-connected on-premises environments to private clouds occurs over the secure Azure backbone network and provides SLA-driven integration of Azure service endpoints. Figure 1 depicts the adjacency of private clouds to VNets in Azure, Azure services, and on-premises environments.

![Image of AVSV private cloud adjecencies to Azure and on-prem](./media/adjacency_overview_drawing-final_6-20-19.svg)

## Hosts, clusters, and private clouds

AVS by Virtustream private clouds and clusters are built from two types of bare-metal, hyper-converged Azure infrastructure hosts. A general purpose host configuration is available for evaluation clusters, and a high-end host configuration for any use case. The high-end hosts have 576GB RAM, 15.36TB (SSD) raw vSAN capacity tier and 3.2TB (NVMe) vSAN cache in two vSAN diskgroups, 50Gbps dedicated network bandwidth, and dual Intel 18 core, 2.3 GHz processors. General purpose hosts have 192GB RAM, 7.68TB (SSD) raw vSAN capacity tier and 3.2TB (NVMe) vSAN cache tier in two vSAN diskgroups, 50Gbps dedicated network bandwidth, and dual Intel 12 core, 2.3 GHz processors.

Each new private cloud is created with a single cluster and is deployed through the Azure portal, with the Azure CLI or PowerShell, or with Azure Resource Manager templates. Private VNets in Azure are required for VNet-based access to vCenter, NSX Manager, and workload VMs, and to enable ExpressRoute Global Reach capabilities for on-premises -to- private cloud connectivity.

For more details on AVS by Virtustream private clouds, clusters, and Azure hosts, see [Private Cloud and Cluster Concepts][concepts-private-clouds-and-clusters].

## Networking

Private management, provisioning, and vMotion networks are created when a private cloud is deployed. These networks are used for access to private cloud management interfaces and for virtual machine vMotion or deployment. All of the private networks are accessible from a VNet in Azure or from on-premises environments when ExpressRoute Global Reach to the private cloud is enabled.

Access to the internet and Azure services are provisioned and can be enabled when a private cloud is deployed. This access is provided so that VMs on production workload networks can consume Azure or internet-based services. Internet access is disabled by default for new private clouds.

For more details on networking and interconnectivy, see [Interconnectivity Concepts][network-concepts-networking].

## Access and Security

For enhanced stability, management, and security, AVSV private clouds use vSphere role-based access control that integrates with Azure Active Directory. For more information on identity and privileges, see [Access and identity options for AVS by Virtustream][concepts-identity].

vSAN data-at-rest encryption is enabled by default and is used to provide vSAN datastore security. It is described in more detail in [Storage Concepts][concepts-storage].

## Bare metal maintenance and private cloud software management

Regular upgrades of the AVS by Virtustream private cloud and VMware software ensures the latest security, stability, and feature sets are running in your private clouds. More details about platform maintenance and upgrades are available in [Upgrade Concepts][concepts-upgrades].

## Regulatory compliance

AVS by Virtustream is compliant with SOC 1, SOC 2 Type 2, and ISO 27001 standards, with CSA Star and GDPR planned. For more information, see the [AVS by Virtustream FAQ][faq].

## Next steps

You now have an overview of AVS by Virtustream private clouds. The next step is to learn key private cloud and cluster concepts.

[Learn AVS by Virtustream private cloud and cluster concepts.][concepts-private-clouds-and-clusters]

<!-- LINKS - external -->
[NSX-T documentation]: https://docs.vmware.com/en/VMware-NSX-T-Data-Center/index.html

<!-- LINKS - internal -->
[concepts-private-clouds-and-clusters]: ./concepts-private-clouds-and-clusters.md
[concepts-networking]: ./concepts-networking.md
[concepts-upgrades]: ./concepts-upgrades.md
[concepts-storage]: ./concepts-storage.md
[concepts-identity]: ./concepts-identity.md