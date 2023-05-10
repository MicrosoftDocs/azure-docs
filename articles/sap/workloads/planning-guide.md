---
title: 'SAP on Azure: Planning and Implementation Guide'
description: Azure Virtual Machines planning and implementation for SAP NetWeaver
author: msftrobiro
manager: juergent
tags: azure-resource-manager
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 04/17/2023
ms.author: robiro
ms.custom: H1Hack27Feb2017, devx-track-azurecli, devx-track-azurepowershell
---
# SAP on Azure: Planning and Implementation Guide

[106267]:https://launchpad.support.sap.com/#/notes/106267
[767598]:https://launchpad.support.sap.com/#/notes/767598
[773830]:https://launchpad.support.sap.com/#/notes/773830
[826037]:https://launchpad.support.sap.com/#/notes/826037
[974876]:https://launchpad.support.sap.com/#/notes/974876
[965908]:https://launchpad.support.sap.com/#/notes/965908
[1031096]:https://launchpad.support.sap.com/#/notes/1031096
[1139904]:https://launchpad.support.sap.com/#/notes/1139904
[1173395]:https://launchpad.support.sap.com/#/notes/1173395
[1245200]:https://launchpad.support.sap.com/#/notes/1245200
[1380493]:https://launchpad.support.sap.com/#/notes/1380493
[1409604]:https://launchpad.support.sap.com/#/notes/1409604
[1558958]:https://launchpad.support.sap.com/#/notes/1558958
[1555903]:https://launchpad.support.sap.com/#/notes/1555903
[1585981]:https://launchpad.support.sap.com/#/notes/1585981
[1588316]:https://launchpad.support.sap.com/#/notes/1588316
[1590719]:https://launchpad.support.sap.com/#/notes/1590719
[1597355]:https://launchpad.support.sap.com/#/notes/1597355
[1605680]:https://launchpad.support.sap.com/#/notes/1605680
[1619720]:https://launchpad.support.sap.com/#/notes/1619720
[1619726]:https://launchpad.support.sap.com/#/notes/1619726
[1619967]:https://launchpad.support.sap.com/#/notes/1619967
[1750510]:https://launchpad.support.sap.com/#/notes/1750510
[1752266]:https://launchpad.support.sap.com/#/notes/1752266
[1757924]:https://launchpad.support.sap.com/#/notes/1757924
[1757928]:https://launchpad.support.sap.com/#/notes/1757928
[1758182]:https://launchpad.support.sap.com/#/notes/1758182
[1758496]:https://launchpad.support.sap.com/#/notes/1758496
[1772688]:https://launchpad.support.sap.com/#/notes/1772688
[1814258]:https://launchpad.support.sap.com/#/notes/1814258
[1882376]:https://launchpad.support.sap.com/#/notes/1882376
[1909114]:https://launchpad.support.sap.com/#/notes/1909114
[1922555]:https://launchpad.support.sap.com/#/notes/1922555
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1941500]:https://launchpad.support.sap.com/#/notes/1941500
[1956005]:https://launchpad.support.sap.com/#/notes/1956005
[1972360]:https://launchpad.support.sap.com/#/notes/1972360
[1973241]:https://launchpad.support.sap.com/#/notes/1973241
[1984787]:https://launchpad.support.sap.com/#/notes/1984787
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2002167]:https://launchpad.support.sap.com/#/notes/2002167
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2039619]:https://launchpad.support.sap.com/#/notes/2039619
[2069760]:https://launchpad.support.sap.com/#/notes/2069760
[2121797]:https://launchpad.support.sap.com/#/notes/2121797
[2134316]:https://launchpad.support.sap.com/#/notes/2134316
[2178632]:https://launchpad.support.sap.com/#/notes/2178632
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2233094]:https://launchpad.support.sap.com/#/notes/2233094
[2243692]:https://launchpad.support.sap.com/#/notes/2243692
[2731110]:https://launchpad.support.sap.com/#/notes/2731110
[2808515]:https://launchpad.support.sap.com/#/notes/2808515
[3048191]:https://launchpad.support.sap.com/#/notes/3048191

Azure enables companies to acquire resources and services in minimal time without lengthy procurement cycles. Running your SAP landscape in Azure requires planning and knowledge about available options and choosing the right architecture. This documentation complements SAP's installation documentation and SAP notes, which represent the primary resources for installations and deployments of SAP software on given platforms.

## Summary

Azure offers a comprehensive platform for running SAP applications. Infrastructure as a Service (IaaS) and Platform as a Service (PaaS) services combined give optimal choices for successful deployments for the entire SAP landscape of your enterprise.

Azure offers a comprehensive platform for running SAP. Infrastructure as a Service (IaaS) and Platform as a Service (PaaS) services combine to give optimal choices for successful deployment for the entire SAP landscape of your enterprise.

### Definitions upfront

Throughout the document, we use the following terms:

* IaaS: Infrastructure as a Service
* PaaS: Platform as a Service
* SaaS: Software as a Service
* SAP Component: an individual SAP application such as S/4HANA, ECC, BW or Solution Manager.  SAP components can be based on traditional ABAP or Java technologies or a non-NetWeaver based application such as Business Objects.
* SAP Environment: one or more SAP components logically grouped to perform a business function such as Development, QAS, Training, DR, or Production.
* SAP Landscape: This term refers to the entire SAP assets in a customer's IT landscape. The SAP landscape includes all production and non-production environments.
* SAP System: The combination of DBMS layer and application layer of, for example, an SAP ERP development system, SAP BW test system, etc. In Azure deployments, it isn't supported to divide these two layers between on-premises and Azure. Means an SAP system is either deployed on-premises or it's deployed in Azure. However, you can operate different systems of an SAP landscape in either Azure or on-premises.

### Resources

The entry point for SAP workload on Azure documentation is found at [Get started with SAP on Azure VMs](get-started.md). Starting with this entry point you find many articles that cover the topics of:

- SAP workload specifics for storage, networking and supported options
- SAP DBMS guides for various DBMS systems in Azure
- SAP deployment guides, manual and through automation
- High availability and disaster recovery details for SAP workload on Azure
- Integration with SAP on Azure with other service and third party applications

> [!IMPORTANT]
> When it comes to the prerequisites, installation process, or details of specific SAP functionality, the SAP documentation and guides should always be read carefully. The Microsoft documents only covers specific tasks for SAP software installed and operated in an Azure virtual machine. 

The following few SAP Notes are the base of the topic SAP on Azure:

| Note number | Title |
| --- | --- |
| [1928533] |SAP Applications on Azure: Supported Products and Sizing |
| [2015553] |SAP on Azure: Support Prerequisites |
| [2039619] |SAP Applications on Azure using the Oracle Database |
| [2233094] |DB6: SAP Applications on Azure Using IBM DB2 for Linux, UNIX, and Windows |
| [1999351] |Troubleshooting Enhanced Azure Monitoring for SAP |
| [1409604] |Virtualization on Windows: Enhanced Monitoring |
| [2191498] |SAP on Linux with Azure: Enhanced Monitoring |
| [2731110] |Support of Network Virtual Appliances (NVA) for SAP on Azure |

General default limitations and maximum limitations of Azure subscriptions and resources can be found in [this article](/azure/azure-resource-manager/management/azure-subscription-service-limits).

## Possible Scenarios

SAP is often seen as one of the most mission-critical applications within enterprises. The architecture and operations of these applications is mostly complex and ensuring that you meet requirements on availability and performance is important.

Thus enterprises have to think carefully about which cloud provider to choose for running such business critical business processes on. Azure is the ideal public cloud platform for business critical SAP applications and business processes. Given the wide variety of Azure infrastructure, most of the current SAP software, including SAP NetWeaver, and SAP S/4 HANA systems can be hosted in Azure today. Azure provides VMs with many terabytes of memory and more than 800 CPUs. 

For a description of the scenarios and some non-supported scenarios, see the document [SAP workload on Azure virtual machine supported scenarios](./planning-supported-configurations.md). Check these scenarios and the conditions that were named as not supported in the referenced documentation throughout the planning of your architecture that you want to deploy into Azure.

In order to successfully deploy SAP systems into Azure IaaS or IaaS in general, it's important to understand the significant differences between the offerings of traditional private clouds and IaaS offerings. Whereas the traditional hoster or outsourcer adapts infrastructure (network, storage and server type) to the workload a customer wants to host, it's instead the customer's or partner's responsibility to characterize the workload and choose the correct Azure components of VMs, storage, and network for IaaS deployments.

In order to gather data for the planning of your deployment into Azure, it's important to:

- Evaluate what SAP products and versions are supported running in Azure
- Evaluate if used operating system releases are supported with chosen Azure VMs for those SAP products
- Evaluate what DBMS releases are supported for your SAP products with specific Azure VMs
- Evaluate if some of the required OS/DBMS releases require you to modernize your SAP landscape, such as perform SAP release upgrades, to get to a supported configuration
- Evaluate whether you need to move to different operating systems in order to deploy on Azure.

Details on supported SAP components on Azure, Azure infrastructure units and related operating system releases and DBMS releases are explained in [What SAP software is supported for Azure deployments](./supported-product-on-azure.md) article. Results gained out of the evaluation of valid SAP releases, operating system, and DBMS releases have a large impact on the efforts moving SAP systems to Azure. Results out of this evaluation are going to define whether there could be significant preparation efforts in cases where SAP release upgrades or changes of operating systems are needed.

## First steps planning a deployment

The first step in deployment planning is NOT to check for VMs available to run SAP. The first step can be one that is time consuming. But most important, is to work with compliance and security teams in your company on what the boundary conditions are for deploying which type of SAP workload or business process into public cloud. If your company deployed other software before into Azure, the process can be easy. If your company is more at the beginning of the journey, there might be larger discussions necessary in order to figure out the boundary conditions, security conditions, enterprise architecture that allows certain SAP data and SAP business processes to be hosted in public cloud.

As useful help, you can point to [Microsoft compliance offerings](/microsoft-365/compliance/offering-home) for a list of compliance offers Microsoft can provide.

Other areas of concerns, like data encryption for data at rest or other encryption in Azure service is documented in [Azure encryption overview](../../security/fundamentals/encryption-overview.md) and in sections at the end of this article for SAP specific topics.

Don't underestimate this phase of the project in your planning. Only when you have agreements and rules around this topic, you need to go to the next steps, which is the planning of the geographical placement and network architecture that you deploy in Azure.

### Azure resource organization

Together with the security and compliance review, if not yet existing, a design for Azure resource naming and placement is required. This will include decisions on:

- Naming convention used for every Azure resource, such as VMs or resource groups
- Subscription and management group design for SAP workload, whether multiple subscriptions should be created per workload or deployment tier or business units
- Enterprise wide usage of Azure policy on subscriptions and management groups

Many details of this enterprise architecture are described to help make the right decisions in the [Azure cloud architecture framework](/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org).

## Azure geographies and regions

Azure services are collected in Azure regions. An Azure region is collection of datacenters that contain the hardware and infrastructure that runs and hosts the different Azure services. This infrastructure includes a large number of nodes that function as compute nodes or storage nodes, or run network functionality.

For a list of the different Azure regions, check the article [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/) and an interactive map at [Azure global infrastructure](https://infrastructuremap.microsoft.com/explore). Not all Azure regions offer the same services. Dependent on the SAP product you want to run, sizing requirements, and the operating system and DBMS related to it, you can end up in a situation that a certain region doesn't offer the VM types you require. This is especially true for running SAP HANA, where you usually need VMs of the various M-series VM families. These VM families are deployed only in a subset of the regions. You can find out what exact VM types, Azure storage types or other Azure Services are available in each region with the help of [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). As you start your planning and have certain regions in mind as primary region and eventually secondary region, you need to investigate first whether the necessary services are available in those regions.

### Azure paired regions

Azure is offering Azure Region pairs where replication of certain data is enabled between these fixed region pairs. The region pairing is documented in the article [Cross-region replication in Azure: Business continuity and disaster recovery](../../availability-zones/cross-region-replication-azure.md). As the article describes, the replication of data is tied to Azure storage types that can be configured by you to replicate into the paired region. See also the article [Storage redundancy in a secondary region](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region). The storage types that allow such a replication are storage types, which are **not suitable** for SAP components and DBMS workload. As such, the usability of the Azure storage replication would be limited to Azure blob storage (for backup purposes), file shares and volumes, or other high latency storage scenarios. Now as you check for paired regions and the services you want to use as your primary or secondary region, you may encounter situations where Azure services and/or VM types you intend to use in your primary region aren't available in the paired region. Or you might encounter a situation where the Azure paired region isn't acceptable out of data compliance reasons. For those cases, you need to use a non-paired region as secondary/disaster recovery region. In such a case, you need to take care of replication of some parts of the data, that Azure would have replicated for you, yourself.

### Availability Zones

Many Azure regions implement a concept called [availability zones](/azure/availability-zones/az-overview). Availability zones are physically separate locations within an Azure region. Each availability zone is made up of one or more datacenters equipped with independent power, cooling, and networking. For example, deploying two VMs across two availability zones of Azure, and implementing a high-availability framework for your SAP DBMS system or the (A)SCS gives you the best SLA in Azure. For more information on virtual machine SLAs in Azure, check the latest version of [virtual machine SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines/). Since Azure regions developed and extended rapidly over the last years, the topology of the Azure regions, the number of physical datacenters, the distance among those datacenters, and the distance between Azure Availability Zones can be different. And with that the network latency.

Follow the guidance in [SAP workload configurations with Azure availability zones](./high-availability-zones.md) when choosing a region with availability zones. Also determine which zonal deployment model is best suited for your requirements, chosen region and workload.

### Fault domains

Fault domains represent a physical unit of failure, closely related to the physical infrastructure contained in data centers. While a physical blade or rack can be considered a Fault Domain, there's no direct one-to-one mapping between the two.

When you deploy multiple virtual machines as part of one SAP system, you can influence the Azure fabric controller to deploy your VMs into different fault domains, thereby meeting higher requirements of availability SLAs. However, the distribution of fault domains over an Azure scale unit (collection of hundreds of compute nodes or storage nodes and networking) or the assignment of VMs to a specific fault domain is something over which you don't have direct control. In order to direct the Azure fabric controller to deploy a set of VMs over different fault domains, you need to assign an Azure availability set to the VMs at deployment time. For more information on Azure availability sets, see chapter [Azure availability sets](#availability-sets) in this document.

### Update domains

Update domains represent a logical unit that helps to determine how a VM within an SAP system that consists of SAP instances running on multiple VMs is updated. When a platform update occurs, Azure goes through the process of updating these update domains one by one. By spreading VMs at deployment time over different update domains, you can protect your SAP system party from potential downtime. Similar to Fault Domains, an Azure scale unit is divided into multiple update domains. In order to direct the Azure fabric controller to deploy a set of VMs over different update domains, you need to assign an Azure Availability Set to the VMs at deployment time. For more information on Azure availability sets, see chapter [Azure availability sets](#availability-sets) below.

[ ![Diagram of update and failure domains.](./media/virtual-machines-shared-sap-planning-guide/3000-sap-ha-on-azure.png) ](./media/virtual-machines-shared-sap-planning-guide/3000-sap-ha-on-azure.png#lightbox) 

### Availability sets

Azure virtual machines within one Azure availability set are distributed by the Azure fabric controller over different fault domains. The purpose of the distribution over different fault domains is to prevent all VMs of an SAP system from being shut down if infrastructure maintenance or a failure within one Fault Domain. By default, VMs aren't part of an availability set. The participation of a VM in an availability set is defined at deployment time only or during redeployment of a VM.

To understand the concept of Azure availability sets and the way availability sets relate to fault domains, see the documentation on [Azure availability sets](/azure/virtual-machines/availability-set-overview).

As you define availability sets and try to mix various VMs of different VM families within one availability set, you may encounter problems that prevent you to include a certain VM type into such an availability set. The reason is that the availability set is bound to a scale unit that contains a certain type of compute hosts. And a certain type of compute host can only run certain types of VM families. For example, if you create an availability set and deploy the first VM into the availability set and you choose a VM type of the Edsv5 family and then you try to deploy a second VM of the M family, this deployment will fail. Reason is that the Edsv5 family VMs aren't running on the same host hardware as the virtual machines of the M family do. The same problem can occur, when you try to resize VMs and try to move a VM out of the Edsv5 family to a VM type of the M family. If resizing to a VM family that can't be hosted on the same host hardware, you need to shut down all VMs in your availability set and resize them all to be able to run on the other host machine type. For SLAs of VMs that are deployed within availability set, check the article [Virtual Machine SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines/).

> [!IMPORTANT]
> The concepts of Azure availability zones and Azure availability sets are mutually exclusive. That means, you can either deploy a pair or multiple VMs into a specific availability zone or an Azure availability set. But not both can be assigned to a VM.  
> Combination of availability sets and availability zones is possible with proximity placement groups, see chapter [proximity placement groups](#proximity-placement-groups) for more details.  

> [!TIP]
> It isn't possible to switch between availability sets and availability zones for deployed VMs directly. The VM and disks need to be recreated with zone constraint placed from existing resources. This [open-source project](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/main/Move-VM-from-AvSet-to-AvZone/Move-Regional-SAP-HA-To-Zonal-SAP-HA-WhitePaper) with PowerShell functions can be used as sample to change a VM between availability set to availability zone. A [blog post](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/how-to-migrate-a-highly-available-sap-system-in-azure-from/ba-p/3216917) shows the modification of a highly available SAP system from availability set to zones.

### Proximity placement groups

Network latency between individual SAP VMs can have large implications on performance. Especially the network roundtrip time between SAP application servers and DBMS can have significant impact on business applications. Optimally all compute elements running your SAP VMs are as closely located as possible. This isn't always possible in every combination and without Azure knowing which VMs to keep together. In most situations and regions the default placement fulfills network roundtrip latency requirements. 

When default placement isn't sufficient for network roundtrip requirements within an SAP system, [proximity placement groups (PPGs)](proximity-placement-scenarios.md) exist to address this need. They can be used for SAP deployments, together with other location constraints of Azure region, availability zone and availability set. With a proximity placement group, combination of both availability zone and availability set, while setting different update and failure domains, is possible. A proximity placement group should only contain a single SAP system.

While a deployment in a PPG can result in the most latency optimized placement, deploying with PPG also brings drawbacks. Some VM families can't be combined in one PPG or you run into problems when resizing between VM families. The constraints on VM families used, regions and optionally zones don't allow such a co-location. See the [linked documentation](proximity-placement-scenarios.md) for further details on the topic, its advantages and potential challenges. 

VMs without PPGs should be default deployment method in most situations for SAP systems. This is especially true with a zonal (single availability zone) and cross-zonal (VMs spread between two zones) deployment for an SAP system, without the need for any proximity placement group. Use of proximity placement groups should be limited to SAP systems and Azure regions only when required for performance reasons.

## Azure networking

Azure provides a network infrastructure, which allows the mapping of all scenarios, which we want to realize with SAP software. The capabilities are:

* Access to Azure services and specific ports used by applications within VMs
* Access to VMs for management and administration, directly to the VMs via ssh or Windows Remote Desktop (RDP)
* Internal communication and name resolution between VMs and by Azure services
* On-premises connectivity between a customer's on-premises network and the Azure networks
* Communication between services deployed in different Azure regions 

For more detailed information on networking, see the [virtual network documentation](/azure/virtual-network/).

Networking is typically the first technical activity when planning and deploying in Azure and often has a central enterprise architecture, with SAP as part of overall networking requirements. In the planning stage, you should complete the networking architecture in as much detail as possible. Changes at later point might require a complete move or deletion of deployed resources, such as subnet network address changes.

### Azure virtual networks

Virtual network is a fundamental building block for your private network in Azure. You can define the address range of the network and separate it into network subnets. Network subnets can be used by SAP VMs, or can be dedicated subnets, as required by Azure for some services like network or application gateway. 

The definition of the virtual network(s), subnets and private network address ranges is part of the design required when planning. The network design should address several requirements for SAP deployment:

* No [network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/), such as firewalls, are placed in the communication path between SAP application and DBMS layer of SAP products using the SAP kernel, such as S/4HANA or SAP NetWeaver.
* Network routing restrictions are enforced by [network security groups (NSGs)](/azure/virtual-network/network-security-groups-overview) on the subnet level. Group IPs of VMs into [application security groups (ASGs)](/azure/virtual-network/application-security-groups) which are maintained in the NSG rules and provide per-role, tier and SID grouping of permissions.
* SAP application and database VMs run in the same virtual network, within the same or different subnets of a single virtual network. Different subnets for application and database VMs or alternatively dedicated application and DBMS ASGs to group rules applicable to each workload type within same subnet.
* Accelerated networking is enabled on all network cards of all VMs for SAP workload, where technically possible.
* Dependency on central services - name resolution (DNS), identity management (AD domain/Azure AD) and administrative access.
* Access to and by public endpoints, as required. For example, Azure management for Pacemaker operations in high-availability or Azure services such as backup
* Use of multiple NICs, only if required for designated subnets with own routes and NSG rules

A virtual network acts as a network boundary. As such, resources like network interface cards (NICs) for VMs, once deployed, can't change its virtual network assignment. Changes to virtual network or [subnet address range](/azure/virtual-network/virtual-network-manage-subnet#change-subnet-settings) might require you to move all deployed resources to another subnet to execute such change.

Example architecture for SAP can be accessed below:
* [SAP S/4HANA on Linux in Azure](/azure/architecture/guide/sap/sap-s4hana)  
* [SAP NetWeaver on Windows in Azure](/azure/architecture/guide/sap/sap-netweaver)  
* [In- and Outbound internet communication for SAP on Azure](/azure/architecture/guide/sap/sap-internet-inbound-outbound)  

> [!WARNING]
> Configuring [network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) in the communication path between the SAP application and the DBMS layer of SAP products using the SAP kernel, such as S/4HANA or SAP NetWeaver, isn't supported. This restriction is for functionality and performance reasons. The communication path between the SAP application layer and the DBMS layer must be a direct one. The restriction doesn't include [application security group (ASG) and NSG rules](../../virtual-network/network-security-groups-overview.md) if those ASG and NSG rules allow a direct communication path. 
>
> Other scenarios where network virtual appliances aren't supported are:
>
> * Communication paths between Azure VMs that represent Linux Pacemaker cluster nodes and SBD devices as described in [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP Applications](high-availability-guide-suse.md).
> * Communication paths between Azure VMs and Windows Server Scale-Out File Server (SOFS) set up as described in [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a file share in Azure](sap-high-availability-guide-wsfc-file-share.md). 
>
> Network virtual appliances in communication paths can easily double the network latency between two communication partners. They also can restrict throughput in critical paths between the SAP application layer and the DBMS layer. In some customer scenarios, network virtual appliances can cause Pacemaker Linux clusters to fail.

> [!IMPORTANT]
> Another design that is *not* supported is the segregation of the SAP application layer and the DBMS layer into different Azure virtual networks that aren't [peered](../../virtual-network/virtual-network-peering-overview.md) with each other. We recommend that you segregate the SAP application layer and DBMS layer by using subnets within the same Azure virtual network instead of using different Azure virtual networks. 
>
> If you decide not to follow the recommendation and instead segregate the two layers into different virtual networks, the two virtual networks *must be* [peered](../../virtual-network/virtual-network-peering-overview.md). Be aware that network traffic between two [peered](../../virtual-network/virtual-network-peering-overview.md) Azure virtual networks is subject to transfer costs. Huge data volume that consists of many terabytes is exchanged between the SAP application layer and the DBMS layer each day. You can accumulate substantial costs if the SAP application layer and DBMS layer are segregated between two peered Azure virtual networks.  

#### Name resolution and domain services

Hostname to IP name resolution through DNS is often a crucial element for SAP networking. There are many different possibilities to configure name and IP resolution in Azure. Often an enterprise central DNS solution exists and is part of the overall architecture. Several options for name resolution in Azure natively, instead of setting up your own DNS server(s), are described in [name resolution for resources in Azure virtual networks](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances).

Similarly to DNS services, there might be a requirement for Windows Active Directory to be accessible by the SAP VMs or services.

#### IP address assignment

An IP of a NIC remains claimed and used throughout the existence of VMs NIC, independent of whether the VM is running or shutdown. This applies to [both dynamic and static IP assignment](/azure/virtual-network/ip-services/private-ip-addresses) and independent of whether the VM is running or shutdown. Dynamic IP assignment is released if the NIC is deleted, subnet changes or allocation method changed to static. 

It's possible to assign fixed IP addresses to VMs within an Azure virtual network. This is often done for SAP systems to depend on external DNS servers and static entries. The IP address remains assigned, either until the VM and its network interface is deleted or until the IP address gets deassigned again. For more information, read [this article](/azure/virtual-network/ip-services/virtual-networks-static-private-ip-arm-pportal). As a result, you need to take the overall number of VMs (running and stopped VMs) into account when defining the range of IP addresses for the virtual network.

> [!NOTE]
> You should decide between static and dynamic IP address allocation for Azure VMs and their NIC(s). The guest OS of the VM will obtain the IP assigned to the NIC during boot. You shouldn't assign static IP addresses within the guest OS to a NIC. Some Azure services like Azure Backup Service rely on the fact that at least the primary NIC is set to DHCP inside the OS and not to static IP addresses. See also the document [Troubleshoot Azure virtual machine backup](../../backup/backup-azure-vms-troubleshoot.md#networking).

#### Secondary IP addresses for SAP hostname virtualization

Each Azure Virtual Machine's network interface card can have multiple IP addresses assigned to it. This secondary IP can be used for SAP virtual hostname(s), which is mapped to a DNS A/PTR record. The secondary IP addresses must be assigned to Azure NICs IP config as per [this article](../../virtual-network/ip-services/virtual-network-multiple-ip-addresses-portal.md). The secondary IP also must be configured within the OS statically, as secondary IPs are often not assigned through DHCP. Each secondary IP must be from the same subnet the NIC is bound to. Secondary IPs can be added and removed from Azure NICs without stopping or deallocate the VM, unlike the primary IPs of a NIC where deallocating the VM is required.

> [!NOTE]
> Azure load balancer's floating IP is [not supported](../../load-balancer/load-balancer-multivip-overview.md#limitations) on secondary IP configs. Azure load balancer is used by SAP high-availability architectures with Pacemaker clusters. In such case the load balancer enables the SAP virtual hostname(s). See also SAP's note [#962955](https://launchpad.support.sap.com/#/notes/962955) on general guidance using virtual host names.

#### Azure load balancer with VMs running SAP

Typically used in high availability architectures to provide floating IPs between active and passive cluster nodes, load balancers can be used for single VMs for the purpose of holding a virtual IP address for SAP virtual hostname(s). Using load balancer for single VMs this way is an alternative to secondary IPs on a NIC or utilizing multiple NICs in the same subnet.

Standard load balancer modifies the [default outbound access](/azure/virtual-network/ip-services/default-outbound-access) path due to it's secure by default architecture. VMs behind a standard load balancer might not be able to reach the same public endpoints anymore - for example OS update repositories or public endpoints of Azure services. Follow guidance in article [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer](high-availability-guide-standard-load-balancer-outbound-connections.md) for available options to provide outbound connectivity.

> [!TIP]
> Basic load balancer should NOT be used with any SAP architecture in Azure and is announced to be [retired](/azure/load-balancer/skus) in future. 

#### Multiple vNICs per VM

You can define multiple virtual network interface cards (vNIC) for an Azure VM, each assigned to any subnet within the same virtual network as the primary vNIC. With the ability to have multiple vNICs, you can start to set up network traffic separation, if necessary. For example, client traffic is routed through the primary vNIC and some admin or backend traffic is routed through a second vNIC. Depending on operating system (OS) and image used, traffic routes for NICs inside the OS will need to be set up for correct routing.

The type and size of VM will restrict how many vNICs a VM can have assigned. Exact details, functionality, and restrictions can be found in this article -  [Assign multiple IP addresses to virtual machines using the Azure portal](/azure/virtual-network/ip-services/virtual-network-multiple-ip-addresses-portal)

> [!NOTE]
> Adding additional vNICs to a VM does not increase the available network bandwidth. All network interfaces share the same bandwidth. Use of multiple NICs is only recommended if private subnets need to be accessed by VMs. Recommended design pattern is to rely on NSG functionality and simplify the network and subnet requirements with as few network interfaces, typically just one, if possible. Exception is HANA scale-out where a secondary vNIC is required for HANA internal network.

> [!WARNING]
> If using multiple vNICs on a VM, it's recommended for primary network card's subnet to handle user network traffic.

#### Accelerated networking

To further reduce network latency between Azure VMs, we recommend that you confirm [Azure accelerated networking](/azure/virtual-network/accelerated-networking-overview) is enabled every VM running SAP workload. This is enabled by default for new VMs, [deployment checklist](deployment-checklist.md) should verify the state. Benefits are greatly improved networking performance and latencies. Use it when you deploy Azure VMs for SAP workload on all supported VMs, especially for the SAP application layer and the SAP DBMS layer. The linked documentation contains support dependencies on OS versions and VM instances.

### On-premises connectivity

SAP deployment in Azure assumes a central, enterprise-wide network architecture and communication hub is in place to enable on-premises connectivity. Such on-premises network connectivity is essential to allow users and applications access the SAP landscape in Azure, to access other central company services such as central DNS, domain, security and patch management infrastructure and others.

Many options exist to provide such on-premises connectivity and deployment are most often a [hub-spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli) or an extension of it, a global [virtual WAN](/azure/virtual-wan/virtual-wan-global-transit-network-architecture).

For SAP deployments, for on-premises a private connection over [Azure ExpressRoute](/azure/expressroute/expressroute-introduction) is recommended. For smaller SAP workloads, remote region or smaller offices, [VPN on-premises connectivity](/azure/vpn-gateway/design) it available. Use of [ExpressRoute with VPN](/azure/expressroute/how-to-configure-coexisting-gateway-portal) site-to-site connection as a failover path is a possible combination of both services.

### Out- and inbound connectivity to/from the Internet

Your SAP landscape requires connectivity to the Internet. Be it for OS repository updates, establishing a connection to SAP's SaaS applications on their public endpoints or accessing Azure services via their public endpoint. Similarly, it might be required to provide access for your clients to SAP Fiori applications, with Internet users accessing services provided by your SAP landscape. Your SAP network architecture requires to plan for the path towards the Internet and for any incoming requests.

Secure your virtual network with [NSG rules](/azure/virtual-network/network-security-groups-overview), utilizing network [service tags](/azure/virtual-network/service-tags-overview) for known services, establishing routing and IP addressing to your firewall or other network virtual appliance is all part of the architecture. Resources in private networks need to be protected by network layer 4 and 7 firewalls. 

A [best practice architecture](/azure/architecture/guide/sap/sap-internet-inbound-outbound) focusing on communication paths with Internet can be accessed in the architecture center.

## Azure virtual machines for SAP workload

For SAP workload, we narrowed down the selection to different VM families that are suitable for SAP workload and SAP HANA workload more specifically. The way how you find the correct VM type and its capability to work through SAP workload is described in the document [What SAP software is supported for Azure deployments](supported-product-on-azure.md). Additionally, SAP note [1928533] lists all certified Azure VMs, their performance capability as measured by SAPS benchmark and limitation as applicable. The VM types that are certified for SAP workload don't use over-provisioning of CPU and memory resources.

Beyond the selection of purely supported VM types, you also need to check whether those VM types are available in a specific region based on the site [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). But more important, you need to evaluate if:

- CPU and memory resources of different VM types
- IOPS bandwidth of different VM types
- Network capabilities of different VM types
- Number of disks that can be attached
- Ability to use certain Azure storage types

fit your need. Most of that data can be found [here](/azure/virtual-machines/sizes) for a particular VM family and type.

### Pricing models for Azure VMs

As pricing model you have several different pricing options that list like:

- Pay as you go
- One year reserved or savings plan
- Three years reserved or savings plan
- Spot pricing

The pricing of each of the different offerings with different service offerings around operating systems and different regions is available on the site [Virtual Machines Pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/). For details and flexibility of one year and three year savings plan and reserved instances, check these articles:

- [What is Azure savings plans for compute?](../../cost-management-billing/savings-plan/savings-plan-compute-overview.md)
- [What are Azure Reservations?](../../cost-management-billing/reservations/save-compute-costs-reservations.md)
- [Virtual machine size flexibility with Reserved VM Instances](../../virtual-machines/reserved-vm-instance-size-flexibility.md)
- [How the Azure reservation discount is applied to virtual machines](../../cost-management-billing/manage/understand-vm-reservation-charges.md)

For more information on spot pricing, read the article [Azure Spot Virtual Machines](https://azure.microsoft.com/pricing/spot/). Pricing of the same VM type can also be different between different Azure regions. For some customers, it was worth to deploy into a less expensive Azure region. 

Additionally, Azure offers the concepts of a dedicated host. The dedicated host concept gives you more control on patching cycles that are done by Azure. You can time the patching according to your own schedules. This offer is specifically targeting customers with workload that might not follow the normal cycle of workload. To read up on the concepts of Azure dedicated host offers, read the article [Azure Dedicated Host](../../virtual-machines/dedicated-hosts.md). Using this offer is supported for SAP workload and is used by several SAP customers who want to have more control on patching of infrastructure and eventual maintenance plans of Microsoft. For more information on how Microsoft maintains and patches the Azure infrastructure that hosts virtual machines, read the article [Maintenance for virtual machines in Azure](../../virtual-machines/maintenance-and-updates.md).

### Operating system for VMs

WWhen deploying new VMs for SAP landscapes in Azure, either for installation or migration of SAP systems, it's important to choose the right operation system. Azure provides a large variety of operating system images for Linux and Windows, with many suitable options for SAP usage. Additionally you can create or upload custom images from on-premises. You can also consume and generalize from image galleries. See the following documentation on details and options available:

- Find Azure Marketplace image information - [using CLI](/azure/virtual-machines/linux/cli-ps-findimage) / [using PowerShell](/azure/virtual-machines/windows/cli-ps-findimage)
- Create custom images - [for Linux](/azure/virtual-machines/linux/imaging) / [for Windows](/azure/virtual-machines/windows/prepare-for-upload-vhd-image)
- [Using VM Image Builder](/azure/virtual-machines/image-builder-overview)

Plan for an OS update infrastructure and its dependencies for SAP workload, as required. Considerations are needed for a repository staging environment to keep all tiers of an SAP landscape - sandbox/development/pre-prod/production - in sync with same version of patches and updates over your update time period. 

### Generation 1 and Generation 2 virtual machines

Azure allows you to deploy VMs as either generation 1 or generation 2 VMs. The article [Support for generation 2 VMs on Azure](../../virtual-machines/generation-2.md) lists the Azure VM families that can be deployed as generation 2 VM. More important this article also lists functional differences between generation 1 and generation 2 virtual machines in Azure.

At deployment of a virtual machine, the OS image selection decides if the VM will be a generation 1 or 2 VM. All OS images for SAP usage available in Azure - RedHat Enterprise Linux, SuSE Enterprise Linux, Windows or Oracle Enterprise Linux - in their latest versions are available with both generation versions. Careful selection based on the image description is needed to deploy the correct VM generation. Similarly, custom OS images can be created as generation 1 or 2 and impact the VM generation at deployment of the virtual machine.  

> [!NOTE]
> It's recommended to use generation 2 VMs in *all* your SAP on Azure deployments, regardless of VM size. All latest Azure VMs for SAP are generation 2 capable or limited to generation 2 only. Some VM families allow generation 2 only today. Similarly, some upcoming VM families could support generation 2 only.  
> Determination if a VM will be generation 1 or 2 is done purely with the selected OS image. Changing an existing VM from one generation to the other generation isn't possible.  

Change from generation 1 to generation 2 isn't possible in Azure. To change the virtual machine generation, you need to deploy a new VM of the generation you desire, and reinstall the software that you're running in the new gen2 VM. This change only affects the base VHD image of the VM and has no impact on the data disks or attached NFS or SMB shares. Data disks, NFS, or SMB shares that originally were assigned to, for example, on a generation 1 VM, and could reattach to new gen2 VM.

Some VM families, like [Mv2-series](../../virtual-machines/mv2-series.md) support generation 2 only. The same requirement might be true for some future, new VM families. An existing generation 1 VM could then not be resized to such new VM family. Beyond Azure platform's generation 2 requirement, SAP requirements might exist too. See SAP note [1928533] for any such generation 2 requirements on chosen VM family.

### Performance limits for Azure VMs

Azure as a public cloud depends on sharing infrastructure in a secured manner throughout its customer base. Performance limits are defined for each resource and service, to enable scaling and capacity. On the compute side of the Azure infrastructure, the limits for each virtual machine size must be considered. The VM  quotes are described in [this document](/azure/virtual-machines/sizes).

Each VM has a different quota on disk and network throughput, number of disks that can be attached, whether it contains a temporary, VM local storage with own throughput and IOPS limits, size of memory and how many vCPUs are available.

> [!NOTE]
> When planning and sizing SAP on Azure solutions, the performance limits for each virtual machine size must be considered.  
> The quotas described represent the theoretical maximum values attainable.  The limit of IOPS per disk may be achieved with small I/Os (8 KB) but possibly may not be achieved with large I/Os (1 MB).  

Similarly to virtual machines, same performance limits exist for [each storage type for SAP workload](/azure/virtual-machines/workloads/sap/planning-guide-storage), and for any other Azure service as well.

When planning and selecting suitable VMs for SAP deployment, consider these factors 

- Start with the memory and CPU requirement. The SAPS requirements for CPU power need to be separated out into the DBMS part and the SAP application part(s). For existing systems, the SAPS related to the hardware in use often can be determined or estimated based on existing SAP benchmarks. The results can be found  on the [About SAP Standard Application Benchmarks](https://sap.com/about/benchmark.html) page. For newly deployed SAP systems, you should have gone through a sizing exercise, which should determine the SAPS requirements of the system.
- For existing systems, the I/O throughput and I/O operations per second on the DBMS server should be measured. For new systems, the sizing exercise for the new system also should give rough ideas of the I/O requirements on the DBMS side. If unsure, you eventually need to conduct a Proof of Concept.
- Compare the SAPS requirement for the DBMS server with the SAPS the different VM types of Azure can provide. The information on SAPS of the different Azure VM types is documented in SAP Note [1928533]. The focus should be on the DBMS VM first since the database layer is the layer in an SAP NetWeaver system that doesn't scale out in most deployments. In contrast, the SAP application layer can be scaled out. Individual DBMS guides in this documentation provide recommended storage configuration to use.
- Summarize your findings for 
  - number of Azure VMs
  - Individual VM family and VM SKUs for each SAP layers - DBMS, (A)SCS, application server
  - IO throughput measures or the calculated storage capacity requirements

### HANA Large Instance service

Azure provides another compute capabilities for running large HANA database in both scale-up and scale-out manner on a dedicated offering called HANA Large Instances. Details of this solution are described in separate documentation section starting with [SAP HANA on Azure Large Instances](/azure/virtual-machines/workloads/sap/hana-overview-architecture). This offering extended the available VMs in Azure.

> [!NOTE]
> HANA Large Instance service is in sunset mode and doesn't accept new customers anymore. Providing units for existing HANA Large Instance customers is still possible.

## Storage for SAP on Azure

Azure virtual machines use different storage options for persistence. In simple terms, they can be divided into persisted and temporary, or non-persisted storage types.

There are multiple storage options that can be used for SAP workloads and specific SAP components. For more information, read the document [Azure storage for SAP workloads](planning-guide-storage.md). The article covers the storage architecture for everything SAP - operating system, application binaries, configuration files, database data, log and traces and file interfaces with other applications, stored on disk or accessed on file shares.

### Temporary disk on VMs

Most Azure VMs for SAP offer a temporary disk, which isn't a managed disk. Such temporary disk should be used for expendable data **only**, as the data may be lost during unforeseen maintenance events or during VM redeployment. The performance characteristics of the temporary disk make them ideal for swap/page files of the operating system. No application or non-expendable operating system data should be stored on such a temporary disk. In Windows environments, the temporary drive is typically accessed as D:\ drive, in Linux systems /dev/sdb device, /mnt or /mnt/resource is often the mountpoint. 

Some VMs aren't [offering a temporary drive](/azure/virtual-machines/azure-vms-no-temp-disk) and planning to utilize these virtual machine sizes for SAP might require increasing the size of the operating system disk. Refer to SAP Note [1928533] for details. For VMs with temporary disk present, see this article [Azure documentation for virtual machine families and sizes](/azure/virtual-machines/sizes) for more information on the temporary disk size and IOPS/throughput limits available for each VM family.

It's important to understand the resize between VM families with and VM families without temporary disk isn't directly possible. A resize between such two VM families fails currently. A work around is to re-create the VM with new size without temp disk, from an OS disk snapshot and keeping all other data disks and network interface. See the article [Can I resize a VM size that has a local temp disk to a VM size with no local temp disk?](/azure/virtual-machines/azure-vms-no-temp-disk#can-i-resize-a-vm-size-that-has-a-local-temp-disk-to-a-vm-size-with-no-local-temp-disk---) for details.

### Network shares and volumes for SAP

SAP systems usually require one or more network file shares. These are typically:

- SAP transport directory (/usr/sap/trans, TRANSDIR)
- SAP volumes/shared sapmnt or saploc, when deploying multiple application servers
- High-availability architecture volumes for (A)SCS, ERS or database (/hana/shared) 
- File interfaces with third party applications for file import/export

Azure services such as [Azure Files](/azure/storage/files/storage-files-introduction) and [Azure NetApp Files](/azure/azure-netapp-files/) should be used. Alternatives when these services aren't available in chosen region(s), or required by chosen architecture. These options are to provide NFS/SMB file shares from self-managed, VM-based applications, or third party services. See SAP Note [2015553] about limitation in support when using third party services for storage layers of an SAP system in Azure.

Due to the often critical nature of network shares and often being a single point of failure in a design (high-availability) or process (file interface), it's recommended to rely on Azure native service with their own availability, SLA and resiliency. In the planning phase, consideration needs to be made for

* NFS/SMB share design - which shares per SID, per landscape, region
* Subnet sizing - IP requirement for private endpoints or dedicated subnets for services like Azure NetApp Files
* Network routing to SAP systems and connected applications
* Use of public or [private endpoint](/azure/private-link/private-endpoint-overview) for Azure Files

Usage and requirements for NFS/SMB shares in high-availability scenarios are described in chapter [high-availability](#high-availability).

> [!NOTE]
> If using Azure Files for your network share(s), it's recommended to use a private endpoint. In the unlikely event of a zonal failure, your NFS client will be automatically redirect to a healthy zone. You don't have to remount the NFS or SMB shares on your VMs.

## Securing your SAP landscape

Planning to protect the SAP on Azure workload needs to be approached from different angles. These include:

> [!div class="checklist"]
> * Network segmentation and security of each subnet and network interface
> * Encryption on each layer within the SAP landscape
> * Identity solution for end-user and administrative access, single sign-on services
> * Threat and operation monitoring

The topics contained in this chapter aren't an exhaustive list of all available services, options and alternatives. It does list several best practices, which should be considered for all SAP deployments in Azure. There are other aspects to cover depending on your enterprise or workload requirements. For further information on security design, consider for general Azure guidance following resources:

- [Azure Well Architected Framework - security pillar](/azure/architecture/framework/security/overview)
- [Azure Cloud Adoption Framework - Security](/azure/cloud-adoption-framework/secure/)

### Securing virtual networks with security groups

Planning your SAP landscape in Azure should include some degree of network segmentation, with virtual networks and subnets dedicated to SAP workloads only. Best practices for subnet definition have been shared in the [networking](#azure-networking) chapter in this article and architecture guides. Using [network security groups (NSGs)](/azure/virtual-network/network-security-groups-overview) together with [application security groups (ASGs)](/azure/virtual-network/application-security-groups) within NSGs to permit inbound and outbound connectivity is recommended. When you design ASGs, each NIC on a VM can be associated with multiple ASGs, allowing you to create different groups. For example an ASG for DBMS VMs, which contains all DB servers across your landscape. Another ASG for all VMs - application and DBMS - of a single SAP-SID. This way you can define one NSG rule for the overall DB-ASG and another, more specific rule for SID the specific ASG only.

NSGs don't restrict performance with the rules defined. For monitoring of traffic flow, you can optionally activate [NSG flow logging](/azure/network-watcher/network-watcher-nsg-flow-logging-overview) with logs evaluated by a SIEM or IDS of your choice to monitor and act on suspicious network activity.

> [!TIP]
> Activate NSGs on subnet level only. While NSGs can be activated on both subnet and NIC level, activation on both is very often a hindrance in troubleshooting situations when analyzing network traffic restrictions. Use NSGs on NIC level only in exceptional situations and when required.

### Private endpoints for services

Many Azure PaaS services are accessed by default through a public endpoint. While located on the Azure backend network, the communication endpoint is exposed to public internet. [Private endpoints](/azure/private-link/private-endpoint-overview) are a network interface inside your own private virtual network. Through [Azure private link](/azure/private-link/), the private endpoint projects the service into your virtual network. Selected PaaS services are then privately accessed through the IP inside your network and depending on the configuration, the service can potentially be set to communicate through private endpoint only.

Use of private endpoints increases protection against data leakage, often simplifies access from on-premises and peered networks. Also in many situations the network routing and process to open firewall ports, often needed for public endpoints, is simplified since the resources are inside your chosen network already with private endpoint use.

See [available services](/azure/private-link/availability) to find which Azure services offer the usage of private endpoints. For NFS or SMB with Azure Files, the usage of private endpoints is always recommended for SAP workloads. See [private endpoint pricing](https://azure.microsoft.com/pricing/details/private-link/) about charges incurred with use of the service. Some Azure services might optionally include the cost with the service. Such case is identified in a service's pricing information.

### Encryption

Depending on your corporate policies, encryption [beyond the default options](/azure/security/fundamentals/encryption-overview) in Azure might be required for your SAP workloads. 


#### Encryption for infrastructure resources

By default, Azure storage - managed disks and blobs - is [encrypted with a platform managed key (PMK)](/azure/security/fundamentals/encryption-overview). In addition, bring-your-own-key (BYOK) encryption for managed disks and blob storage is supported for SAP workloads in Azure. For [managed disk encryption](/azure/virtual-machines/disk-encryption-overview), different options available, including:

- platform managed key (SSE-PMK)
- customer managed key (SSE-CMK)
- double encryption at rest
- host-based encryption 

as per your corporate security requirement. A [comparison of the encryption options](/azure/virtual-machines/disk-encryption-overview#comparison), together with Azure Disk Encryption, is available. 

> [!NOTE]
> Don't use host based encryption on M-series VM family when running with Linux, currently, due to potential performance limitation. The use of SSE-CMK encryption for managed disks is unaffected by this limitation.

> [!IMPORTANT]
> Importance of a careful plan to store and protect the encryption keys if using customer managed encryption can't be overstated. Without encryption keys encrypted resources such as disks will be be inaccessible and lead to data loss. Carefully consider protection of the keys and the access to them only by privileged users or services only.

Azure Disk Encryption (ADE), with encryption running inside the SAP VMs using customer managed keys from Azure key vault, shouldn't be used for SAP deployments with Linux systems. For Linux, Azure Disk Encryption doesn't support the [OS images](/azure/virtual-machines/linux/disk-encryption-overview#supported-operating-systems) used for SAP workloads. Azure Disk Encryption can be used on Windows systems with SAP workloads, however, don't combine Azure Disk Encryption with database native encryption. The use of database native encryption is recommended over ADE. For more information, see below.

Similarly to managed disk encryption, [Azure Files](/azure/storage/common/customer-managed-keys-overview) encryption at rest (SMB and NFS) is available with platform or customer managed keys. 

For SMB network shares, [Azure Files service](/azure/storage/files/files-smb-protocol?tabs=azure-portal) and [OS dependencies](/windows-server/storage/file-server/smb-security) with SMB versions and thus encryption in-transit support, need to be reviewed.

#### Encryption for SAP components

Encryption on SAP level can be broken down in two layers

- DBMS encryption
- Transport encryption

For DBMS encryption, each database supported for SAP NetWeaver or S/4HANA deployment supports native encryption. Transparent database encryption is entirely independent of any infrastructure encryption in place in Azure. Both database encryption and [storage side encryption](/azure/virtual-machines/disk-encryption) (SSE) can be used at the same time. Of utmost importance when using encryption, is the location, storage and safekeeping of encryption keys. Any loss of encryption keys leads to data loss due to an impossible to start or recover a database.

Some databases might not have a database encryption method or require a dedicated setting to enable. For other databases, DBMS backups might be encrypted implicitly when database encryption is activated. See SAP notes of the respective database on how to enable and use transparent database encryption. 

* [SAP HANA data and log volume encryption](https://help.sap.com/viewer/b3ee5778bc2e4a089d3299b82ec762a7/2.0.02/en-US/dc01f36fbb5710148b668201a6e95cf2.html)
* SQL Server - SAP note [1380493]
* Oracle - SAP note [974876]
* DB2 - SAP note [1555903]
* SAP ASE - SAP note [1972360]

> [!NOTE]
> Contact SAP or the DBMS vendor for support on how to enable, use or troubleshoot software encryption.

> [!IMPORTANT]
> Importance of a careful plan to store and protect the encryption keys can't be overstated. Without encryption keys the database or SAP software might be inaccessible and lead to data loss. Carefully consider protection of the keys and the access to them only by privileged users or services only.

Transport, or communication encryption can be applied for SQL connections between SAP engines and the DBMS. Similarly, connections from SAP presentation layer - SAPGui secure network connections (SNC) or https connection to web front-ends - can be encrypted. See the applications vendor's documentation to enable and manage encryption in transit.

### Threat monitoring and alerting

Follow corporate architecture to deploy and use threat monitoring and alerting solutions. Available Azure services provide threat protection and security view, should be considered for the overall SAP deployment plan. [Microsoft Defender for Cloud](/azure/security-center/security-center-introduction) addresses this requirement and is typically part of an overall governance model for entire Azure deployments, not just for SAP components.

For more information on security information event management (SIEM) and security orchestration automated response (SOAR) solutions, read [Microsoft Sentinel provides SAP integration](/azure/sentinel/sap/deployment-overview). 

### Security software inside SAP VMs

SAP notes [2808515] for Linux and [106267] for Windows describe requirements and best practices when using virus scanners or security software on SAP servers. The SAP recommendations should be followed when deploying SAP components in Azure.

## High availability

We can separate the discussion about SAP high availability in Azure into two parts:

* **Azure infrastructure high availability**, for example HA of compute (VMs), network, storage etc. and its benefits for increasing SAP application availability.  
* **SAP application high availability**, for example HA of SAP software components:  
  * SAP (A)SCS and ERS instance  
  * DB server  

and how it can be combined with Azure infrastructure HA with service healing. 

To obtain more details on high availability for SAP in Azure, use the following documentation

* [Supported scenarios - High Availability protection for the SAP DBMS layer](planning-supported-configurations.md#high-availability-protection-for-the-sap-dbms-layer)  
* [Supported scenarios - High Availability for SAP Central Services](planning-supported-configurations.md#high-availability-for-sap-central-service)  
* [Supported scenarios - Supported storage with the SAP Central Services scenarios](planning-supported-configurations.md#supported-storage-with-the-sap-central-services-scenarios-listed-above)  
* [Supported scenarios - Multi-SID SAP Central Services failover clusters](planning-supported-configurations.md#multi-sid-sap-central-services-failover-clusters)  
* [Azure Virtual Machines high availability for SAP NetWeaver](sap-high-availability-guide-start.md)  
* [High-availability architecture and scenarios for SAP NetWeaver](sap-high-availability-architecture-scenarios.md)  
* [Utilize Azure infrastructure VM restart to achieve “higher availability” of an SAP system without clustering](sap-higher-availability-architecture-scenarios.md)  
* [SAP workload configurations with Azure Availability Zones](high-availability-zones.md)  
* [Public endpoint connectivity for Virtual Machines using Azure Standard Load Balancer in SAP high-availability scenarios](high-availability-guide-standard-load-balancer-outbound-connections.md)  

Pacemaker on Linux and Windows Server Failover Cluster is the only high availability frameworks for SAP workload directly supported by Microsoft on Azure. Any other high availability framework isn't supported by Microsoft and will need the design, implementation details and operations support from the vendor. For more information, refer to the document for [supported scenarios for SAP in Azure](planning-supported-configurations.md).

## Disaster recovery 

Often the SAP applications are some of the most business critical within an enterprise. Based on their importance and time required to be operational again if there was an unforeseen event, business continuity and disaster recovery (BCDR) scenarios should be planned. 

Article [Disaster recovery overview and infrastructure guidelines for SAP workload](disaster-recovery-overview-guide.md) contains all details to address this requirement.

## Backup

As part of business continuity and disaster recovery (BCDR) strategy, backup for SAP workload must be an integral part of any planned deployment. As previously with high availability or DR, the backup solution must cover all layers of an SAP solution stack - VM, OS, SAP application layer, DBMS layer and any shared storage solution. Additionally, backup for Azure services that are used by your SAP workload and other crucial resources like encryption and access keys, must be part of the backup and BCDR design.

Azure Backup offers a PaaS solution for the backup of 

- VM configuration, OS and SAP application layer (data resizing on managed disks) through Azure Backup for VM. Review the [support matrix](/azure/backup/backup-support-matrix-iaas) to verify your design can use this solution.
- [SQL Server](/azure/backup/sql-support-matrix) and [SAP HANA](/azure/backup/sap-hana-backup-support-matrix) database data and log backup. Including support for database replication technologies, such HANA system replication or SQL Always On, and cross-region support for paired regions
- File share backup through Azure Files. [Verify support](/azure/backup/azure-file-share-support-matrix) for NFS/SMB and other configuration details

Alternatively if you deploy Azure NetApp Files, [backup options are available](/azure/azure-netapp-files/backup-introduction) on volume level, including [SAP HANA and Oracle DBMS](/azure/azure-netapp-files/azacsnap-introduction) integration with a scheduled backup.

Backup solutions with Azure backup are offering a [soft-delete option](/azure/backup/backup-azure-security-feature-cloud) to prevent malicious or accidental deletion and thus preventing data loss. Soft-delete is also available for file shares with Azure Files.

Further backup options are possible with self created and managed solution, or using third party software. These are using Azure storage in its different versions, including options to use [immutable storage for blob data](/azure/storage/blobs/immutable-storage-overview). This self-managed option would be currently required for DBMS backup option for some SAP databases like SAP ASE or DB2.

Follow recommendations to [protect and validate against ransomware](/azure/security/fundamentals/backup-plan-to-protect-against-ransomware) attacks with Azure best practices.

> [!TIP]
> Ensure your backup strategy covers protecting your deployment automation, encryption keys for both Azure resources and transparent database encryption, if used. 

> [!WARNING]
> For any cross-region backup requirement, determine the RTO and RPO offered by the solution and if this matches your BCDR design and needs.

## Migration approach to Azure

With large variety of SAP products, version dependencies and native OS and DBMS technologies, it isn't possible to capture all available approaches and options. The executing project team on customer and/or service provider side is to consider several techniques for a successful and performant SAP migration to Azure. 

- **Performance testing during migration**
  An important part of the SAP migration planning is the technical performance testing. The migration team needs to allow sufficient time and key user personnel to execute application and technical testing of the migrated SAP system, including connected interfaces and applications. Comparing the runtime and correctness of key business processes and optimize them before production migration is critical for a successful SAP migration.

- **Using Azure services for SAP migration**
  Some VM based workloads are migrated without change to Azure using services such as [Azure Migrate](/azure/migrate/) or [Azure Site Recovery](/azure/site-recovery/physical-azure-disaster-recovery) or third party tools. Diligently confirm the OS version and running workload is supported by the service. Often any database workload is intentionally not supported as the service can't guarantee database consistency. Should the DBMS type be supported by migration service, the database change / churn rate is often too high and most busy SAP systems won't meet the change rate the migration tools are allowing, with issues noticed only during production migration. In many situations, these Azure services aren't suitable for migration of SAP systems. No validation of Azure Site Recovery or Azure Migrate for large scale SAP migration was performed and proven SAP migration methodology is to rely on DBMS replication or SAP migration tools.

  A deployment in Azure instead of plain VM migration is preferable and easier to accomplish than on premise. Automated deployment frameworks such as [Azure Center for SAP solutions](../center-sap-solutions/overview.md) and [Azure deployment automation framework](../automation/deployment-framework.md) allow for quick execution of automated tasks. Migration of SAP landscapes using DBMS native replication technologies such as HANA system replication, DBMS backup & restore or SAP migration tools onto the new deployed infrastructure uses established SAP know-how.

- **Infrastructure up-sizing**
  During an SAP migration, more infrastructure capacity can lead to quicker execution. The project team should consider up-sizing the [VM's size](/azure/virtual-machines/sizes) to provide more CPU and memory, as well as VM aggregate storage and network throughput. Similarly, on VM level, storage elements such as individual disks should be considered to increase throughput with [on-demand bursting](/azure/virtual-machines/disks-enable-bursting), [performance tiers](/azure/virtual-machines/disks-performance-tiers-portal) for Premium SSD v1. Increase IOPS and throughput values if using [Premium SSD v2](/azure/virtual-machines/disks-deploy-premium-v2?tabs=azure-cli#adjust-disk-performance) above configured values. Enlarge NFS / SMB file shares to increase performance limits. Keep in mind that Azure manage disks can't be reduced in size and reduction in size, performance tiers and throughput KPIs can have various cooldown times.

- **Network and data copy optimization**
  Migration of SAP system always involves moving large amount of data to Azure. These could be database and file backups or replication, application to application data transfer or SAP migration export. Depending on chosen migration process, the right network path to move this data needs to be selected. For many data move operations, using the Internet to copy data securely to Azure storage is the quickest path, as opposed to private networks. 

  Using ExpressRoute or VPN can often lead to bottlenecks, these can be
  - Migration data uses too much bandwidth and interferes with user access to workloads running in Azure  
  - Network bottlenecks on-premises are only identified during migration, for example throughput limiting route or firewall  
  
  Regardless of network connection used, single stream network performance for data copy is often low. Multi-stream capable tools should be used to increase data transfer speed over multiple TCP streams. Follow optimization techniques described by SAP and many blog posts on this topic. 

> [!TIP]
> Dedicated migration networks for large data transfer to Azure, such as backups or database replication, or using public endpoint for data transfer to Azure storage should be considered in planning. Impact on network paths for end users and applications to on-premises by the migration should be avoided. Network planning should consider all phases and a partially productive workload in Azure during migration.

## Support and operation aspects for SAP

To close the SAP planning guide, few other areas, which are important to consider before and during deployment in Azure.

### Azure VM extension for SAP

Azure Monitoring Extension, Enhanced Monitoring, and Azure Extension for SAP - all describe one and the same item. It describes a VM extension that you need to deploy to provide some basic data about the Azure infrastructure to the SAP host agent. SAP notes might refer to it as Monitoring Extension or Enhanced monitoring. In Azure, we're referring to it as Azure Extension for SAP. It's required to be installed on all Azure VMs running SAP workload for support purposes. See the [available article](vm-extension-for-sap.md) to implement the Azure VM extension for SAP.

### SAProuter for SAP support

Operating SAP landscape in Azure requires connectivity to and from SAP for support purposes. Typically this is in the form of SAProuter connection either through encryption network channel via Internet or private VPN connection to SAP. Consult the available architectures for best practices or example implementation of SAProuter in Azure. 

- [Azure Architecture Center | In- and outbound internet connections for SAP on Azure](/azure/architecture/guide/sap/sap-internet-inbound-outbound)

## Next steps

- [Azure Virtual Machines deployment for SAP NetWeaver](deployment-guide.md)
- [Considerations for Azure Virtual Machines DBMS deployment for SAP workload](dbms-guide-general.md)
- [SAP workloads on Azure: planning and deployment checklist](deployment-checklist.md)