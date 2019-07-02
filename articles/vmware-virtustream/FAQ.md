---
title: Frequently asked questions for Azure VMware Solution by Virtustream (AVSV)
description: Provides answers to some of the common questions about Azure VMware Solution by Virtustream (AVSV).
author: v-jetome

ms.service: avsv-service
ms.topic: conceptual
ms.date:  7/5/2019
ms.author: v-jetome

---

# Frequently asked questions about Azure VMware Solution by Virtustream (AVS by Virtustream)

This article addresses frequently asked **internal and external** questions about AVS by Virturstream.


## General

**What is Azure VMware Solution by Virtustream?**

As enterprises pursue IT modernization strategies to improve business agility, reduce costs, and accelerate innovation, hybrid cloud platforms have emerged as key enablers of customers’ digital transformation. Azure VMware Solution by Virtustream (AVS by Virtustream) combines VMware’s enterprise-class Software Defined Data Center (SDDC) software with Microsoft Azure global cloud service ecosystem, managed by Virtustream to meet performance, availability, and security and compliance requirements.

**When will AVS by Virtustream be generally available?**

AVS by Virtustream will be generally available to customers and partners later in 2019. 

## AVS by Virtustream Service

**Where is AVS by Virtustream available today?**

At launch, it will be available in US West and US East in North America. Amsterdam will launch in Europe shortly afterwards.

**Can workloads running in an Azure VMware Solution by Virtustream instance consume or integrate with Azure services?**

All Azure services will be available to AVS solution customers.  Performance and availability limitations for specific services will need to be addressed on a case-by-case basis.  

**Do I use the same tools that I use now to manage private cloud resources?**

Yes. The Azure Portal is used for deployment and a number of mangement operations, and vCenter and NSX Manager are used to manage vSphere and NSX-T resources.

**Will I be able to manage a private cloud with my on-premises vCenter?**

At launch, AVS by Virtustream will not support a single pane-of-glass management across on-premises and private cloud environments. Private cloud clusters will be managed with vCenter and NSX Manager local to a private cloud.

**Will I be able to use vRealize Suite running on-premises?** 

Full support for the vRealize Suite will not be guaranteed at launch.  Specific integrations and use cases may be evaluated on a case-by-case basis. 

**Can I migrate vSphere VMs from on-premises environments to AVS by Virtustream private clouds?**

Yes. VM migration and vMotion can be used to move VMs to a private cloud if standard cross vCenter [vMotion requirements][kb2106952] are met.

**Is a specific version of vSphere required in on-premises environments?**

In order to perform vMotion, you will need to run vSphere 6.0 or later in on-premises environments.

**What does the change control process look like?**

Updates made to the service itself will follow Microsoft Azure’s standard change management process.  Customers will be responsible for any workload administration tasks and the associated change management processes.

## Compute, network, and storage

**Is there more than one type of host available?**

There are two types of hosts available: General Purpose and High-end servers. 

**What are the CPU specifications in each type of host?**

The High-End servers have dual 18 core 2.3 GHz Intel CPUs.

THe General Purpose servers have dual 10 core 2.2GHz Intel CPUs.

**How much memory is in each host?**

The High-End servers have 576GB of RAM and the General Purpose hosts have 192GB RAM.

**What is the storage capacity of each host?**

Each High-End ESXi host has two VSAN diskgroups with a capacity tier of 15.2TB and a 3.2TB NVMe cache tier (1.6TB in each diskgroup).

THe General Purpose ESXi hosts have two VSAN diskroups with a capacity tier of 7.68TB and a 3.2TB NVMe cache tier (1.6TB in each diskgroup).

**How much network bandwidth is available in each ESXi host?**

ESXi hosts support connectivity bandwidth up to 25 Gbps.

**Is data stored on the VSAN datastores encrypted at rest?**

Yes, all VSAN data is encrypted by default using keys stored securely and with high availability in Azure Key Vault.

## Hosts, clusters, and SDDCs

**Is the underlying infrastructure shared?**

No, private cloud hosts and clusters are dedicated and securely erased before and after use.

**Can I mix host types in a cluster?**

No. General Purpose and High-end hosts cannot be mixed in a cluster, though clusters of different host types can be used in a private cloud.

**What are the minimum and maximum number of hosts per cluster?**

Clusters are scalable between 4 and 16 ESXi hosts. Trial clusters are limited to 3 hosts.

**Are clusters scalable?**

Yes, clusters can be scaled in or out between the minimum and maximum number of ESXi hosts. Trial clusters are not scalable.

**What are trial clusters?**

Trial clusters are three host clusters used for one month evaluations of private clouds.

**Can I use High-end hosts for trial clusters?**

No. High-end ESXi hosts are reserved for use in production clusters.

## AVS by Virtustream and VMware software

**What versions of VMware software is used in private clouds?**

Private clouds use vSphere 6.7u1, vSAN 6.7, and version 2.3 of NSX-T.  

**Do private clouds use VMware NSX?**

Yes, NSX-T 2.3 is used for the software defined networking in AVS by Virtustream private clouds.

**Can I use VMware NSX-V in a private cloud?**

No. NSX-T is the only supported version of NSX.

**Is NSX required in the on-premises environments or networks that connect or interact with a private cloud.**

No, customers are not required to use NSX on-premises in order to connect or interact with an AVS by Virtustram private cloud.

**What is the upgrade and update schedule for VMware software in a private cloud?**

The VMware private cloud software will be kept within one version of the most recent release of the private cloud software bundle form VMware. This may be different than the most recent versions of the individual software components (ESXi, NSX-T, vCenter, VSAN).

**How often will the private cloud software stack be updated?**

The update frequency will depend on the VMware private cloud software release cadence, but it's expected to be on a regular basis with rolling upgrades that will not impact private cloud availability or workloads.

## Connectivity

**What network IP address planning is required to incorporate SDDC clusters with on-premises environments?**

A private network /22 address space is required to deploy an AVS by Virtustream private cloud. This private address space should not overlap with other VNets in a subscription, or with on-premises networks.
 
**How do I connect from on-premises environments to a AVS by Virtustream private cloud?**

You can connect to the service in one of three ways: 
- With a VM or application gateway deployed on an Azure VNet that is peered through ExpressRoute to the private cloud.
- Through an ExpressRoute Global Reach from on-premises datacenter to Azure ExpressRoute circuit.  

**How do I connect a workload VM to the internet or an Azure service endpoint?**

In the Azure portal, enable internet connectiviy for a private cloud (it is disabled by default). In NSX-T manager, create an NSX-T T1 router and a logical switch and then deploy a VM on the network segment defined by the logical switch. That VM will have network access to the internet and to Azure services. 

**Do I need to restrict access from the internet to VMs on logical networks in a private cloud?**

No. Network traffic inbound from the internet directly to private clouds is not allowed.

**Do I need to restrict internet access from VMs on logical networks to the internet?** 

Yes. If you have VMs on NSX-T logical networks that need to have restricted internet access, you will need to create a firewall with the appropriate policies using NSX-T Manager.

## Accounts and privileges

**What accounts and privileges will I get with my new AVS by Virtustream private cloud?**

You will get credentials for a cloudadmin user in vCenter and admin access on NSX-T Manager. There is also a cloudadmin group that can used to incorporate Azure Active Directory. For more information, see [Access and Identity Concepts][concepts-identity].

**Will I have administrator access to ESXi hosts?**

No, administrator access to ESXi is limited in order to meet security and solution requirements.

**What privileges and permissions will I have in vCenter?**

You will have cloudadmin group privileges. For more information, see [Access and Identity][concepts-identity].

**What privileges and permissions will I have on the NSX-T manager?**

You will have full administrator privileges on NSX-T and can manage role-based access control as you would with NSX-T Data Center on-premises. For more information, see [Access and Identity][concepts-identity].

Note: A T0 router is created and configured as part of a private cloud deployment and any modification to it or the Edge Node VMs could affect connectivity to the workload VMs running in a private cloud.

**Is Azure Active Directory (AD) integrated with my private cloud.**

Yes, Azure AD is natively integrated with your AVSV SDDC and is available at the time of deployment.

## Billing and Support

**How do I request support support for my VSAV SDDC?** 

Since this a Microsoft solution, Microsoft or the CSP selling the solution will offer the first line support. For Microsoft, a Service Request is the first step with Virtustream/VMware engaged for any internal assistance and/or escalations that are needed. 

**What costs are associated with data ingress and egress for the VASV service?**

Public cloud providers typically charge for data transiting various portions of their network infrastructure, be it inter-region, or in the case of Azure, between peered virtual networks.  It is also typical for public cloud providers not to charge for data ingress, but to charge for any data leaving their datacenters. 

When considering the data ingress / egress costs for AVS by Virtustream, customers will want to consider how they plan to connect to the service and the associated data rates (e.g. ExpressRoute). 

**Can I use my existing VMware licenses when using AVS by Virtustream?**

**Can I use my existing Windows Server licenses in AVS by Virtustream?**

**Who supports AVS by Virtustream?**

Microsoft provides primary support for the platform, with VMware and Virtustream providing tier two and three support.

**What accounts do I need to create an AVS by Virtustream private cloud?**

You will need an Azure account in an Azure subscription.


<!-- LINKS - internal -->
[Identity]: ./concepts-identity.md
 
<!-- LINKS - external -->
[kb2106952]: https://kb.vmware.com/s/article/2106952
[rbac-control]: https://docs.vmware.com/en/VMware-NSX-T-Data-Center/2.3/com.vmware.nsxt.admin.doc/GUID-26C44DE8-1854-4B06-B6DA-A2FD426CDF44.html
