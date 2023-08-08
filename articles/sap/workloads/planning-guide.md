---
title: 'Plan and implement an SAP deployment on Azure'
description: Learn how to plan and implement a deployment of SAP applications on Azure virtual machines.
author: msftrobiro
manager: juergent
tags: azure-resource-manager
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/30/2023
ms.author: robiro
---
# Plan and implement an SAP deployment on Azure

[106267]:https://launchpad.support.sap.com/#/notes/106267
[974876]:https://launchpad.support.sap.com/#/notes/974876
[1380493]:https://launchpad.support.sap.com/#/notes/1380493
[1409604]:https://launchpad.support.sap.com/#/notes/1409604
[1555903]:https://launchpad.support.sap.com/#/notes/1555903
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[1972360]:https://launchpad.support.sap.com/#/notes/1972360
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[2039619]:https://launchpad.support.sap.com/#/notes/2039619
[2191498]:https://launchpad.support.sap.com/#/notes/2191498
[2233094]:https://launchpad.support.sap.com/#/notes/2233094
[2731110]:https://launchpad.support.sap.com/#/notes/2731110
[2808515]:https://launchpad.support.sap.com/#/notes/2808515

In Azure, organizations can get the cloud resources and services they need without completing a lengthy procurement cycle. But running your SAP workload in Azure requires knowledge about the available options and careful planning to choose the Azure components and architecture to power your solution.

Azure offers a comprehensive platform for running your SAP applications. Azure infrastructure as a service (IaaS) and platform as a service (PaaS) offerings combine to give you optimal choices for a successful deployment of your entire SAP enterprise landscape.

This article complements SAP documentation and SAP Notes, the primary sources for information about how to install and deploy SAP software on Azure and other platforms.

## Definitions

Throughout this article, we use the following terms:

- **SAP component**: An individual SAP application like SAP S/4HANA, SAP ECC, SAP BW, or SAP Solution Manager. An SAP component can be based on traditional Advanced Business Application Programming (ABAP) or Java technologies, or it can be an application that's not based on SAP NetWeaver, like SAP BusinessObjects.
- **SAP environment**: Multiple SAP components that are logically grouped to perform a business function, such as development, quality assurance, training, disaster recovery, or production.
- **SAP landscape**: The entire set of SAP assets in an organization's IT landscape. The SAP landscape includes all production and nonproduction environments.
- **SAP system**: The combination of a database management system (DBMS) layer and an application layer. Two examples are an SAP ERP development system and an SAP BW test system. In an Azure deployment, these two layers can't be distributed between on-premises and Azure. An SAP system must be either deployed on-premises or deployed in Azure. However, you can operate different systems within an SAP landscape in either Azure or on-premises.

## Resources

The entry point for documentation that describes how to host and run an SAP workload on Azure is [Get started with SAP on an Azure virtual machine](get-started.md). In the article, you find links to other articles that cover:

- SAP workload specifics for storage, networking, and supported options.
- SAP DBMS guides for various DBMS systems on Azure.
- SAP deployment guides, both manual and automated.
- High availability and disaster recovery details for an SAP workload on Azure.
- Integration with SAP on Azure with other services and third-party applications.

> [!IMPORTANT]
> For prerequisites, the installation process, and details about specific SAP functionality, it's important to read the SAP documentation and guides carefully. This article covers only specific tasks for SAP software that's installed and operated on an Azure virtual machine (VM).

The following SAP Notes form the base of the Azure guidance for SAP deployments:

| Note number | Title |
| --- | --- |
| [1928533] |SAP Applications on Azure: Supported Products and Sizing |
| [2015553] |SAP on Azure: Support Prerequisites |
| [2039619] |SAP Applications on Azure using the Oracle Database |
| [2233094] |DB6: SAP Applications on Azure Using IBM Db2 for Linux, UNIX, and Windows |
| [1999351] |Troubleshooting Enhanced Azure Monitoring for SAP |
| [1409604] |Virtualization on Windows: Enhanced Monitoring |
| [2191498] |SAP on Linux with Azure: Enhanced Monitoring |
| [2731110] |Support of Network Virtual Appliances (NVA) for SAP on Azure |

For general default and maximum limitations of Azure subscriptions and resources, see [Azure subscription and service limits, quotas, and constraints](/azure/azure-resource-manager/management/azure-subscription-service-limits).

## Scenarios

SAP services often are considered among the most mission-critical applications in an enterprise. The applications' architecture and operations are complex, and it's important to ensure that all requirements for availability and performance are met. An enterprise typically thinks carefully about which cloud provider to choose to run such business-critical business processes.

Azure is the ideal public cloud platform for business-critical SAP applications and business processes. Most current SAP software, including SAP NetWeaver and SAP S/4HANA systems, can be hosted in the Azure infrastructure today. Azure offers more than 800 CPU types and VMs that have many terabytes of memory.

For descriptions of supported scenarios and some scenarios that aren't supported, see [SAP on Azure VMs supported scenarios](planning-supported-configurations.md). Check these scenarios and the conditions that are indicated as not supported as you plan the architecture that you want to deploy to Azure.

To successfully deploy SAP systems to Azure IaaS or to IaaS in general, it's important to understand the significant differences between the offerings of traditional private clouds and IaaS offerings. A traditional host or outsourcer adapts infrastructure (network, storage, and server type) to the workload that a customer wants to host. In an IaaS deployment, it's the customer's or partner's responsibility to evaluate their potential workload and choose the correct Azure components of VMs, storage, and network.

To gather data for planning your deployment to Azure, it's important to:

- Determine what SAP products and versions are supported in Azure.
- Evaluate whether the operating system releases you plan to use are supported with the Azure VMs you would choose for your SAP products.
- Determine what DBMS releases on specific VMs are supported for your SAP products.
- Evaluate whether upgrading or updating your SAP landscape is necessary to align with the required operating system and DBMS releases for achieving a supported configuration.
- Evaluate whether you need to move to different operating systems to deploy in Azure.

Details about supported SAP components on Azure, Azure infrastructure units, and related operating system releases and DBMS releases are explained in [SAP software that is supported for Azure deployments](./supported-product-on-azure.md). The knowledge that you gain from evaluating support and dependencies between SAP releases, operating system releases, and DBMS releases has a substantial impact on your efforts to move your SAP systems to Azure. You learn whether significant preparation efforts are involved, for example, whether you need to upgrade your SAP release or switch to a different operating system.

## First steps to plan a deployment

The first step in deployment planning isn't to look for VMs that are available to run SAP applications.

The first steps to plan a deployment are to work with *compliance* and *security* teams in your organization to determine what the boundary conditions are for deploying which type of SAP workload or business process in a public cloud. The process can be time-consuming, but it's critical groundwork to complete.

If your organization has already deployed software in Azure, the process might be easy. If your company is more at the beginning of the journey, larger discussions might be necessary to figure out the boundary conditions, security conditions, and enterprise architecture that allows certain SAP data and SAP business processes to be hosted in a public cloud.

### Plan for compliance

For a list of Microsoft compliance offers that can help you plan for your compliance needs, see [Microsoft compliance offerings](/microsoft-365/compliance/offering-home).

### Plan for security

For information about SAP-specific security concerns, like data encryption for data at rest or other encryption in an Azure service, see [Azure encryption overview](../../security/fundamentals/encryption-overview.md) and [Security for your SAP landscape](#security-for-your-sap-landscape).

### Organize Azure resources

Together with the security and compliance review, if you haven't done this task yet, plan how you organize your Azure resources. The process includes making decisions about:

- A naming convention that you use for each Azure resource, such as for VMs and resource groups.
- A subscription and management group design for your SAP workload, such as whether multiple subscriptions should be created per workload, per deployment tier, or for each business unit.
- Enterprise-wide usage of Azure Policy for subscriptions and management groups.

To help you make the right decisions, many details of enterprise architecture are described in the [Azure Cloud Adoption Framework](/azure/cloud-adoption-framework/ready/landing-zone/design-area/resource-org).

Don't underestimate the initial phase of the project in your planning. Only when you have agreements and rules in place for compliance, security, and Azure resource organization should you advance your deployment planning.

The next steps are planning geographical placement and the network architecture that you deploy in Azure.

## Azure geographies and regions

Azure services are available within separate Azure regions. An Azure region is a collection of datacenters. The datacenters contain the hardware and infrastructure that host and run the Azure services that are available in the region. The infrastructure includes a large number of nodes that function as compute nodes or storage nodes, or which run network functionality.

For a list of Azure regions, see [Azure geographies](https://azure.microsoft.com/global-infrastructure/geographies/). For an interactive map, see [Azure global infrastructure](https://infrastructuremap.microsoft.com/explore).

Not all Azure regions offer the same services. Depending on the SAP product you want to run, your sizing requirements, and the operating system and DBMS you need, it's possible that a particular region doesn't offer the VM types that are required for your scenario. For example, if you're running SAP HANA, you usually need VMs of the various M-series VM families. These VM families are deployed in only a subset of Azure regions.

As you start to plan and think about which regions to choose as primary region and eventually secondary region, you need to investigate whether the services that you need for your scenarios are available in the regions you're considering. You can learn exactly which VM types, Azure storage types, and other Azure services are available in each region in [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).

### Azure paired regions

In an Azure paired region, replication of certain data is enabled by default between the two regions. For more information, see [Cross-region replication in Azure: Business continuity and disaster recovery](../../availability-zones/cross-region-replication-azure.md).

Data replication in a region pair is tied to types of Azure storage that you can configure to replicate into a paired region. For details, see [Storage redundancy in a secondary region](../../storage/common/storage-redundancy.md#redundancy-in-a-secondary-region).

The storage types that support paired region data replication are storage types that *aren't suitable* for SAP components and a DBMS workload. The usability of the Azure storage replication is limited to Azure Blob Storage (for backup purposes), file shares and volumes, and other high-latency storage scenarios.

As you check for paired regions and the services that you want to use in your primary or secondary regions, it's possible that the Azure services or VM types that you intend to use in your primary region aren't available in the paired region that you want to use as a secondary region. Or you might determine that an Azure paired region isn't acceptable for your scenario because of data compliance reasons. For those scenarios, you need to use a nonpaired region as a secondary or disaster recovery region, and you need to set up some of the data replication yourself.

### Availability zones

Many Azure regions use [availability zones](/azure/reliability/availability-zones-overview) to physically separate locations within an Azure region. Each availability zone is made up of one or more datacenters that are equipped with independent power, cooling, and networking. An example of using an availability zone to enhance resiliency is deploying two VMs in two separate availability zones in Azure. Another example is to implement a high-availability framework for your SAP DBMS system in one availability zone and deploy SAP (A)SCS in another availability zone, so you get the best SLA in Azure.

For more information about VM SLAs in Azure, check the latest version of [Virtual Machines SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines/). Because Azure regions develop and extend rapidly, the topology of the Azure regions, the number of physical datacenters, the distance between datacenters, and the distance between Azure availability zones evolves. Network latency changes as infrastructure changes.

Follow the guidance in [SAP workload configurations with Azure availability zones](high-availability-zones.md) when you choose a region that has availability zones. Also determine which zonal deployment model is best suited for your requirements, the region you choose, and your workload.

### Fault domains

Fault domains represent a physical unit of failure. A fault domain is closely related to the physical infrastructure that's contained in datacenters. Although a physical blade or rack can be considered a fault domain, there isn't a direct one-to-one mapping between a physical computing element and a fault domain.

When you deploy multiple VMs as part of one SAP system, you can indirectly influence the Azure fabric controller to deploy your VMs to different fault domains, so that you can meet requirements for availability SLAs. However, you don't have direct control of the distribution of fault domains over an Azure scale unit (a collection of hundreds of compute nodes or storage nodes and networking) or the assignment of VMs to a specific fault domain. To maneuver the Azure fabric controller to deploy a set of VMs over different fault domains, you need to assign an Azure availability set to the VMs at deployment time. For more information, see [Availability sets](#availability-sets).

### Update domains

Update domains represent a logical unit that sets how a VM in an SAP system that consists of multiple VMs is updated. When a platform update occurs, Azure goes through the process of updating these update domains one by one. By spreading VMs at deployment time over different update domains, you can protect your SAP system from potential downtime. Similar to fault domains, an Azure scale unit is divided into multiple update domains. To maneuver the Azure fabric controller to deploy a set of VMs over different update domains, you need to assign an Azure availability set to the VMs at deployment time. For more information, see [Availability sets](#availability-sets).

:::image type="content" source="media/virtual-machines-shared-sap-planning-guide/3000-sap-ha-on-azure.png" border="false" alt-text="Diagram that depicts update domains and failure domains." lightbox="media/virtual-machines-shared-sap-planning-guide/3000-sap-ha-on-azure.png":::

### Availability sets

Azure VMs within one Azure availability set are distributed by the Azure fabric controller over different fault domains. The distribution over different fault domains is to prevent all VMs of an SAP system from being shut down during infrastructure maintenance or if a failure occurs in one fault domain. By default, VMs aren't part of an availability set. You can add a VM in an availability set only at deployment time or when a VM is redeployed.

To learn more about Azure availability sets and how availability sets relate to fault domains, see [Azure availability sets](/azure/virtual-machines/availability-set-overview).

> [!IMPORTANT]
> Availability zones and availability sets in Azure are mutually exclusive. You can deploy multiple VMs to a specific availability zone or to an availability set. But not both the availability zone and the availability set can be assigned to a VM.
>
> You can combine availability sets and availability zones if you use [proximity placement groups](#proximity-placement-groups).  

As you define availability sets and try to mix various VMs of different VM families within one availability set, you might encounter problems that prevent you from including a specific VM type in an availability set. The reason is that the availability set is bound to a scale unit that contains a specific type of compute host. A specific type of compute host can run only on certain types of VM families.

For example, you create an availability set, and you deploy the first VM in the availability set. The first VM that you add to the availability set is in the Edsv5 VM family. When you try to deploy a second VM, a VM that's in the M family, this deployment fails. The reason is that Edsv5 family VMs don't run on the same host hardware as the VMs in the M family.

The same problem can occur if you're resizing VMs. If you try to move a VM out of the Edsv5 family and into a VM type that's in the M family, the deployment fails. If you resize to a VM family that can't be hosted on the same host hardware, you must shut down all the VMs that are in your availability set and resize them all to be able to run on the other host machine type. For information about SLAs of VMs that are deployed in an availability set, see [Virtual Machines SLAs](https://azure.microsoft.com/support/legal/sla/virtual-machines/).

### Virtual machine scale sets with flexible orchestration

[Virtual machine scale sets](../../virtual-machine-scale-sets/overview.md) with flexible orchestration provide a logical grouping of platform-managed virtual machines. You have an option to create scale set within region or span it across availability zones. On creating, the flexible scale set within a region with platformFaultDomainCount>1 (FD>1), the VMs deployed in the scale set would be distributed across specified number of fault domains in the same region. On the other hand, creating the flexible scale set across availability zones with platformFaultDomainCount=1 (FD=1) would distribute VMs across specified zone and the scale set would also distribute VMs across different fault domains within the zone on a best effort basis.

**For SAP workload only flexible scale set with FD=1 is supported.** The advantage of using flexible scale sets with FD=1 for cross zonal deployment, instead of traditional availability zone deployment is that the VMs deployed with the scale set would be distributed across different fault domains within the zone in a best-effort manner. To learn more about SAP workload deployment with scale set, see [flexible virtual machine scale deployment guide](sap-high-availability-architecture-scenarios.md).

When deploying a high availability SAP workload on Azure, it's important to take into account the various deployment types available, and how they can be applied across different Azure regions (such as across zones, in a single zone, or in a region with no zones). For more information, see [High availability deployment options for SAP workload](sap-high-availability-architecture-scenarios.md#high-availability-deployment-options-for-sap-workload).

> [!TIP]
> Currently there is no direct way to migration SAP workload deployed in availability sets or Availability zones to flexible scale with FD=1. To make the switch, you need to re-create the VM and disk with zone constraints from existing resources in place. An [open-source project](https://github.com/Azure/SAP-on-Azure-Scripts-and-Utilities/tree/main/Move-VM-from-AvSet-to-AvZone/Move-Regional-SAP-HA-To-Zonal-SAP-HA-WhitePaper) includes PowerShell functions that you can use as a sample to change a VM deployed in availability set or availability zone to flexible scale set with FD=1. A [blog post](https://techcommunity.microsoft.com/t5/running-sap-applications-on-the/how-to-easily-migrate-an-existing-sap-system-vms-to-flexible/ba-p/3833548) shows you how to modify a HA or non-HA SAP system deployed in availability set or availability zone to flexible scale set with FD=1.

### Proximity placement groups

Network latency between individual SAP VMs can have significant implications for performance. The network roundtrip time between SAP application servers and the DBMS especially can have significant impact on business applications. Optimally, all compute elements running your SAP VMs are located as closely as possible. This option isn't  possible in every combination, and Azure might not know which VMs to keep together. In most situations and regions, the default placement fulfills network roundtrip latency requirements.

When default placement doesn't meet network roundtrip requirements within an SAP system, [proximity placement groups](proximity-placement-scenarios.md) can address this need. You can use proximity placement groups with the location constraints of Azure region, availability zone, and availability set to increase resiliency. With a proximity placement group, combining both availability zone and availability set while setting different update and failure domains is possible. A proximity placement group should contain only a single SAP system.

Although deployment in a proximity placement group can result in the most latency-optimized placement, deploying by using a proximity placement group also has drawbacks. Some VM families can't be combined in one proximity placement group, or you might run into problems if you resize between VM families. The constraints of  VM families, regions, and availability zones might not support colocation. For details, and to learn about the advantages and potential challenges of using a proximity placement group, see [Proximity placement group scenarios](proximity-placement-scenarios.md).

VMs that don't use proximity placement groups should be the default deployment method in most situations for SAP systems. This default is especially true for zonal (a single availability zone) and cross-zonal (VMs that are distributed between two availability zones) deployments of an SAP system. Using proximity placement groups should be limited to SAP systems and Azure regions when required only for performance reasons.

## Azure networking

Azure has a network infrastructure that maps to all scenarios that you might want to implement in an SAP deployment. In Azure, you have the following capabilities:

- Access to Azure services and access to specific ports in VMs that applications use.
- Direct access to VMs via Secure Shell (SSH) or Windows Remote Desktop (RDP) for management and administration.
- Internal communication and name resolution between VMs and by Azure services.
- On-premises connectivity between an on-premises network and Azure networks.
- Communication between services that are deployed in different Azure regions.

For detailed information about networking, see [Azure Virtual Network](/azure/virtual-network/).

Designing networking usually is the first technical activity that you undertake when you deploy to Azure. Supporting a central enterprise architecture like SAP frequently is part of the overall networking requirements. In the planning stage, you should document the proposed networking architecture in as much detail as possible. If you make a change at a later point, like changing a subnet network address, you might have to move or delete deployed resources.

### Azure virtual networks

A virtual network is a fundamental building block for your private network in Azure. You can define the address range of the network and separate the range into network subnets. A network subnet can be available for an SAP VM to use or it can be dedicated to a specific service or purpose. Some Azure services, like Azure Virtual Network and Azure Application Gateway, require a dedicated subnet.

A virtual network acts as a network boundary. Part of the design that's required when you plan your deployment is to define the virtual network, subnets, and private network address ranges. You can't change the virtual network assignment for resources like network interface cards (NICs) for VMs after the VMs are deployed. Making a change to a virtual network or to a [subnet address range](/azure/virtual-network/virtual-network-manage-subnet#change-subnet-settings) might require you to move all deployed resources to a different subnet.

Your network design should address several requirements for SAP deployment:

- No [network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/), such as a firewall, are placed in the communication path between the SAP application and the DBMS layer of SAP products via the SAP kernel, such as S/4HANA or SAP NetWeaver.
- Network routing restrictions are enforced by [network security groups (NSGs)](/azure/virtual-network/network-security-groups-overview) on the subnet level. Group IPs of VMs into [application security groups (ASGs)](/azure/virtual-network/application-security-groups) that are maintained in the NSG rules, and provide role, tier, and SID groupings of permissions.
- SAP application and database VMs run in the same virtual network, within the same or different subnets of a single virtual network. Use different subnets for application and database VMs. Alternatively, use dedicated application and DBMS ASGs to group rules that are applicable to each workload type within the same subnet.
- Accelerated networking is enabled on all network cards of all VMs for SAP workloads where technically possible.
- Ensure secure access for dependency on central services, including for name resolution (DNS), identity management (Windows Server Active Directory domains/Azure Active Directory), and administrative access.
- Provide access to and by public endpoints, as needed. Examples include for Azure management for ClusterLabs Pacemaker operations in high availability or for Azure services like Azure Backup.
- Use multiple NICs only if they're necessary to create designated subnets that have their own routes and NSG rules.

For examples of network architecture for SAP deployment, see the following articles:

- [SAP S/4HANA on Linux in Azure](/azure/architecture/guide/sap/sap-s4hana)  
- [SAP NetWeaver on Windows in Azure](/azure/architecture/guide/sap/sap-netweaver)  
- [Inbound and outbound internet communication for SAP on Azure](/azure/architecture/guide/sap/sap-internet-inbound-outbound)  

#### Virtual network considerations

Some virtual networking configurations have specific considerations to be aware of.

- The configuring of [network virtual appliances](https://azure.microsoft.com/solutions/network-appliances/) in the communication path between the SAP application layer and the DBMS layer of SAP components by using the SAP kernel, such as S/4HANA or SAP NetWeaver, *isn't supported*.

  Network virtual appliances in communication paths can easily double the network latency between two communication partners. They also can restrict throughput in critical paths between the SAP application layer and the DBMS layer. In some scenarios, network virtual appliances can cause Pacemaker Linux clusters to fail.

  The communication path between the SAP application layer and the DBMS layer must be a direct path. The restriction doesn't include [ASG and NSG rules](../../virtual-network/network-security-groups-overview.md) if the ASG and NSG rules allow a direct communication path.

  Other scenarios in which network virtual appliances aren't supported are:

  - Communication paths between Azure VMs that represent Pacemaker Linux cluster nodes and SBD devices as described in [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications](high-availability-guide-suse.md).
  - Communication paths between Azure VMs and a Windows Server scale-out file share that's set up as described in [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a file share in Azure](sap-high-availability-guide-wsfc-file-share.md).

- Segregating the SAP application layer and the DBMS layer into different Azure virtual networks *isn't supported*. We recommend that you segregate the SAP application layer and the DBMS layer by using subnets within the same Azure virtual network instead of by using different Azure virtual networks.

  If you set up an unsupported scenario that segregates two SAP system layers in different virtual networks, the two virtual networks *must be* [peered](../../virtual-network/virtual-network-peering-overview.md).

  Network traffic between two [peered](../../virtual-network/virtual-network-peering-overview.md) Azure virtual networks is subject to transfer costs. Each day, a huge volume of data that consists of many terabytes is exchanged between the SAP application layer and the DBMS layer. You can *incur substantial cost* if the SAP application layer and the DBMS layer are segregated between two peered Azure virtual networks.  

#### Name resolution and domain services

Resolving host name to IP address through DNS is often a crucial element for SAP networking. You have many options to configure name and IP resolution in Azure.

Often, an enterprise has a central DNS solution that's part of the overall architecture. Several options for implementing name resolution in Azure natively, instead of by setting up your own DNS servers, are described in [Name resolution for resources in Azure virtual networks](/azure/virtual-network/virtual-networks-name-resolution-for-vms-and-role-instances).

As with DNS services, there might be a requirement for Windows Server Active Directory to be accessible by the SAP VMs or services.

#### IP address assignment

An IP address for a NIC remains claimed and used throughout the existence of a VM's NIC. The rule applies to [both dynamic and static IP assignment](/azure/virtual-network/ip-services/private-ip-addresses). It remains true whether the VM is running or is shut down. Dynamic IP assignment is released if the NIC is deleted, if the subnet changes, or if the allocation method changes to static.

It's possible to assign fixed IP addresses to VMs within an Azure virtual network. IP addresses often are reassigned for SAP systems that depend on external DNS servers and static entries. The IP address remains assigned, either until the VM and its NIC is deleted or until the IP address is unassigned. You need to take into account the overall number of VMs (running and stopped) when you define the range of IP addresses for the virtual network.

For more information, see [Create a VM that has a static private IP address](/azure/virtual-network/ip-services/virtual-networks-static-private-ip-arm-pportal).

> [!NOTE]
> You should decide between static and dynamic IP address allocation for Azure VMs and their NICs. The guest operating system of the VM will obtain the IP that's assigned to the NIC when the VM boots. You shouldn't assign static IP addresses in the guest operating system to a NIC. Some Azure services like Azure Backup rely on the fact that at least the primary NIC is set to DHCP and not to static IP addresses inside the operating system. For more information, see [Troubleshoot Azure VM backup](../../backup/backup-azure-vms-troubleshoot.md#networking).

#### Secondary IP addresses for SAP host name virtualization

Each Azure VM's NIC can have multiple IP addresses assigned to it. A secondary IP can be used for an SAP virtual host name, which is mapped to a DNS A record or DNS PTR record. A secondary IP address must be assigned to the Azure NIC's [IP configuration](../../virtual-network/ip-services/virtual-network-multiple-ip-addresses-portal.md). A secondary IP also must be configured within the operating system statically because secondary IPs often aren't assigned through DHCP. Each secondary IP must be from the same subnet that the NIC is bound to. A secondary IP can be added and removed from an Azure NIC without stopping or deallocating the VM. To add or remove the primary IP of a NIC, the VM must be deallocated.

> [!NOTE]
> On secondary IP configurations, the Azure load balancer's floating IP address is [not supported](../../load-balancer/load-balancer-multivip-overview.md#limitations). The Azure load balancer is used by SAP high-availability architectures with Pacemaker clusters. In this scenario, the load balancer enables the SAP virtual host names. For general guidance about using virtual host names, see SAP Note [962955](https://launchpad.support.sap.com/#/notes/962955).

#### Azure Load Balancer with VMs running SAP

A load balancer typically is used in high-availability architectures to provide floating IP addresses between active and passive cluster nodes. You also can use a load balancer for a single VM to hold a virtual IP address for an SAP virtual host name. Using a load balancer for a single VM is an alternative to using a secondary IP address on a NIC or to using multiple NICs in the same subnet.

The standard load balancer modifies the [default outbound access](/azure/virtual-network/ip-services/default-outbound-access) path because its architecture is secure by default. VMs that are behind a standard load balancer might no longer be able to reach the same public endpoints. Some examples are an endpoint for an operating system update repository or a public endpoint of Azure services. For options to provide outbound connectivity, see [Public endpoint connectivity for VMs by using the Azure standard load balancer](high-availability-guide-standard-load-balancer-outbound-connections.md).

> [!TIP]
> The *basic* load balancer should *not* be used with any SAP architecture in Azure. The basic load balancer is scheduled to be [retired](/azure/load-balancer/skus).

#### Multiple vNICs per VM

You can define multiple virtual network interface cards (vNICs) for an Azure VM, with each vNIC assigned to any subnet in the same virtual network as the primary vNIC. With the ability to have multiple vNICs, you can start to set up network traffic separation, if necessary. For example, client traffic is routed through the primary vNIC and some admin or back-end traffic is routed through a second vNIC. Depending on the operating system and the image you use, traffic routes for NICs inside the operating system might need to be set up for correct routing.

The type and size of a VM determines how many vNICs a VM can have assigned. For information about functionality and restrictions, see [Assign multiple IP addresses to VMs by using the Azure portal](/azure/virtual-network/ip-services/virtual-network-multiple-ip-addresses-portal).

Adding vNICs to a VM doesn't increase available network bandwidth. All network interfaces share the same bandwidth. We recommend that you use multiple NICs only if VMs need to access private subnets. We recommend a design pattern that relies on NSG functionality and that simplifies the network and subnet requirements. The design should use as few network interfaces as possible, and optimally just one. An exception is HANA scale-out, in which a secondary vNIC is required for the HANA internal network.

> [!WARNING]
> If you use multiple vNICs on a VM, we recommend that you use a primary NIC's subnet to handle user network traffic.

#### Accelerated networking

To further reduce network latency between Azure VMs, we recommend that you confirm that [Azure accelerated networking](/azure/virtual-network/accelerated-networking-overview) is enabled on every VM that runs an SAP workload. Although accelerated networking is enabled by default for new VMs, per the [deployment checklist](deployment-checklist.md), you should verify the state. The benefits of accelerated networking are greatly improved networking performance and latencies. Use it when you deploy Azure VMs for SAP workloads on all supported VMs, especially for the SAP application layer and the SAP DBMS layer. The linked documentation contains support dependencies on operating system versions and VM instances.

### On-premises connectivity

SAP deployment in Azure assumes that a central, enterprise-wide network architecture and communication hub are in place to enable on-premises connectivity. On-premises network connectivity is essential to allow users and applications to access the SAP landscape in Azure to access other central organization services, such as the central DNS, domain, and security and patch management infrastructure.

You have many options to provide on-premises connectivity for your SAP on Azure deployment. The networking deployment most often is a [hub-spoke network topology](/azure/architecture/reference-architectures/hybrid-networking/hub-spoke?tabs=cli), or an extension of the hub-spoke topology, a global [virtual WAN](/azure/virtual-wan/virtual-wan-global-transit-network-architecture).

For on-premises SAP deployments, we recommend that you use a private connection over [Azure ExpressRoute](/azure/expressroute/expressroute-introduction). For smaller SAP workloads, remote regions, or smaller offices, [VPN on-premises connectivity](/azure/vpn-gateway/design) is available. Using [ExpressRoute with a VPN](/azure/expressroute/how-to-configure-coexisting-gateway-portal) site-to-site connection as a failover path is a possible combination of both services.

### Outbound and inbound internet connectivity

Your SAP landscape requires connectivity to the internet, whether it's to receive operating system repository updates, to establish a connection to the SAP SaaS applications on their public endpoints, or to access an Azure service via its public endpoint. Similarly, you might be required to provide access for your clients to SAP Fiori applications, with internet users accessing services that are provided by your SAP landscape. Your SAP network architecture requires you to plan for the path toward the internet and for any incoming requests.

Secure your virtual network by using [NSG rules](/azure/virtual-network/network-security-groups-overview), by using network [service tags](/azure/virtual-network/service-tags-overview) for known services, and by establishing routing and IP addressing to your firewall or other network virtual appliance. All of these tasks or considerations are part of the architecture. Resources in private networks need to be protected by network Layer 4 and Layer 7 firewalls.

Communication paths with the internet are the focus of a [best practices architecture](/azure/architecture/guide/sap/sap-internet-inbound-outbound).

<a name="azure-virtual-machines-for-sap-workload"></a>

## Azure VMs for SAP workloads

Some Azure VM families are especially suitable for SAP workloads, and some more specifically to an SAP HANA workload. The way to find the correct VM type and its capability to support your SAP workload is described in [What SAP software is supported for Azure deployments](supported-product-on-azure.md). Also, SAP Note [1928533] lists all certified Azure VMs and their performance capabilities as measured by the SAP Application Performance Standard (SAPS) benchmark and limitations, if they apply. The VM types that are certified for an SAP workload don't use over-provisioning for CPU and memory resources.

Beyond looking only at the selection of supported VM types, you need to check whether those VM types are available in a specific region based on [Products available by region](https://azure.microsoft.com/global-infrastructure/services/). At least as important is to determine whether the following capabilities for a VM fit your scenario:

- CPU and memory resources
- Input/output operations per second (IOPS) bandwidth
- Network capabilities
- Number of disks that can be attached
- Ability to use certain Azure storage types

To get this information for a specific FM family and type, see [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes).

### Pricing models for Azure VMs

For a VM pricing model, you can choose the option you prefer to use:

- A pay-as-you-go pricing model
- A one-year reserved or savings plan
- A three-year reserved or savings plan
- A spot pricing model

To get detailed information about VM pricing for different Azure services, operating systems, and regions, see [Virtual machines pricing](https://azure.microsoft.com/pricing/details/virtual-machines/linux/).

To learn about the pricing and flexibility of one-year and three-year savings plans and reserved instances, see these articles:

- [What are Azure savings plans for compute?](../../cost-management-billing/savings-plan/savings-plan-compute-overview.md)
- [What are Azure Reservations?](../../cost-management-billing/reservations/save-compute-costs-reservations.md)
- [Virtual machine size flexibility with Reserved VM Instances](../../virtual-machines/reserved-vm-instance-size-flexibility.md)
- [How the Azure reservation discount is applied to virtual machines](../../cost-management-billing/manage/understand-vm-reservation-charges.md)

For more information about spot pricing, see [Azure Spot Virtual Machines](https://azure.microsoft.com/pricing/spot/).

Pricing for the same VM type might vary between Azure regions. Some customers benefit from deploying to a less expensive Azure region, so information about pricing by region can be helpful as you plan.

Azure also offers the option to use a dedicated host. Using a dedicated host gives you more control of patching cycles for Azure services. You can schedule patching to support your own schedule and cycles. This offer is specifically for customers who have a workload that doesn't follow the normal cycle of a workload. For more information, see [Azure dedicated hosts](../../virtual-machines/dedicated-hosts.md).

Using an Azure dedicated host is supported for an SAP workload. Several SAP customers who want to have more control over infrastructure patching and maintenance plans use Azure dedicated hosts. For more information about how Microsoft maintains and patches the Azure infrastructure that hosts VMs, see [Maintenance for virtual machines in Azure](../../virtual-machines/maintenance-and-updates.md).

### Operating system for VMs

When you deploy new VMs for an SAP landscape in Azure, either to install or to migrate an SAP system, it's important to choose the correct operation system for your workload. Azure offers a large selection of operating system images for Linux and Windows and many suitable options for SAP systems. You also can create or upload custom images from your on-premises environment, or you can consume or generalize from image galleries.

For details and information about the options that are available:

- Find Azure Marketplace images by using the [Azure CLI](/azure/virtual-machines/linux/cli-ps-findimage) or [Azure PowerShell](/azure/virtual-machines/windows/cli-ps-findimage).
- Create custom images  for [Linux](/azure/virtual-machines/linux/imaging) or [Windows](/azure/virtual-machines/windows/prepare-for-upload-vhd-image).
- Use [VM Image Builder](/azure/virtual-machines/image-builder-overview).

Plan for an operating system update infrastructure and its dependencies for your SAP workload, if needed. Consider using a repository staging environment to keep all tiers of an SAP landscape (sandbox, development, preproduction, and production) in sync by using the same versions of patches and updates during your update time period.

### Generation 1 and generation 2 VMs

In Azure, you can deploy a VM as either generation 1 or generation 2. [Support for generation 2 VMs in Azure](../../virtual-machines/generation-2.md) lists the Azure VM families that you can deploy as generation 2. The article also lists functional differences between generation 1 and generation 2 VMs in Azure.

When you deploy a VM, the operating system image that you choose determines whether the VM will be a generation 1 or a generation 2 VM. The latest versions of all operating system images for SAP that are available in Azure (Red Hat Enterprise Linux, SuSE Enterprise Linux, and Windows or Oracle Enterprise Linux) are available in both generation 1 and generation 2. It's important to carefully select an image based on the image description to deploy the correct generation of VM. Similarly, you can create custom operating system images as generation 1 or generation 2, and they affect the VM's generation when the VM is deployment.  

> [!NOTE]
> We recommend that you use generation 2 VMs in *all* your SAP deployments in Azure, regardless of VM size. All the latest Azure VMs for SAP are generation 2-capable or are limited to only generation 2. Some VM families currently support only generation 2 VMs. Some VM families that will be available soon might support only generation 2.
>
> You can determine whether a VM is generation 1 or only generation 2 based on the selected operating system image. You can't change an existing VM from one generation to the another generation.  

Changing a deployed VM from generation 1 to generation 2 isn't possible in Azure. To change the VM generation, you must deploy a new VM that is the generation that you want and reinstall your software on the new generation of VM. This change affects only the base VHD image of the VM and has no impact on the data disks or attached Network File System (NFS) or Server Message Block (SMB) shares. Data disks, NFS shares, or SMB shares that originally were assigned to a generation 1 VM can be attached to a new generation 2 VM.

Some VM families, like the [Mv2-series](../../virtual-machines/mv2-series.md), support only generation 2. The same requirement might be true for new VM families in the future. In that scenario, an existing generation 1 VM can't be resized to work with the new VM family. In addition to the Azure platform's generation 2 requirements, your SAP components might have requirements that are related to a VM's generation. To learn about any generation 2 requirements for the VM family you choose, see SAP Note [1928533].

### Performance limits for Azure VMs

As a public cloud, Azure depends on sharing infrastructure in a secured manner throughout its customer base. To enable scaling and capacity, performance limits are defined for each resource and service. On the compute side of the Azure infrastructure, it's important to consider the limits that are defined for each [VM size](/azure/virtual-machines/sizes).

Each VM has a different quota on disk and network throughput, the number of disks that can be attached, whether it has local temporary storage that has its own throughput and IOPS limits, memory size, and how many vCPUs are available.

> [!NOTE]
> When you make decisions about VM size for an SAP solution on Azure, you must consider the performance limits for each VM size. The quotas that are described in the documentation represent the theoretical maximum attainable values. The performance limit of IOPS per disk might be achieved with small input/output (I/O) values (for example, 8 KB), but it might not be achieved with large I/O values (for example, 1 MB).  

Like VMs, the same performance limits exist for [each storage type for an SAP workload](planning-guide-storage.md) and for all other Azure services.

When you plan for and choose VMs to use in your SAP deployment, consider these factors:

- Start with the memory and CPU requirements. Separate out the SAPS requirements for CPU power into the DBMS part and the SAP application parts. For existing systems, the SAPS related to the hardware that you use often can be determined or estimated based on existing [SAP Standard Application Benchmarks](https://sap.com/about/benchmark.html). For newly deployed SAP systems, complete a sizing exercise to determine the SAPS requirements for the system.
- For existing systems, the I/O throughput and IOPS on the DBMS server should be measured. For new systems, the sizing exercise for the new system also should give you a general idea of the I/O requirements on the DBMS side. If you're unsure, you eventually need to conduct a proof of concept.
- Compare the SAPS requirement for the DBMS server with the SAPS that the different VM types of Azure can provide. The information about the SAPS of the different Azure VM types is documented in SAP Note [1928533]. The focus should be on the DBMS VM first because the database layer is the layer in an SAP NetWeaver system that doesn't scale out in most deployments. In contrast, the SAP application layer can be scaled out. Individual DBMS guides describe the recommended storage configurations.
- Summarize your findings for:

  - The number of Azure VMs that you expect to use.
  - Individual VM family and VM SKUs for each SAP layer: DBMS, (A)SCS, and application server.
  - I/O throughput measures or calculated storage capacity requirements.

### HANA Large Instances service

Azure offers compute capabilities to run a scale-up or  scale-out large HANA database on a dedicated offering called [SAP HANA on Azure Large Instances](/azure/virtual-machines/workloads/sap/hana-overview-architecture). This offering extends the VMs that are available in Azure.

> [!NOTE]
> The HANA Large Instances service is in sunset mode and doesn't accept new customers. Providing units for existing HANA Large Instances customers is still possible.

## Storage for SAP on Azure

Azure VMs use various storage options for persistence. In simple terms, the VMs can be divided into persistent and temporary or non-persistent storage types.

You can choose from multiple storage options for SAP workloads and for specific SAP components. For more information, see [Azure storage for SAP workloads](planning-guide-storage.md). The article covers the storage architecture for every part of SAP: operating system, application binaries, configuration files, database data, log and trace files, and file interfaces with other applications, whether stored on disk or accessed on file shares.

### Temporary disk on VMs

Most Azure VMs for SAP offer a temporary disk that isn't a managed disk. Use a temporary disk *only* for expendable data. The data on a temporary disk might be lost during unforeseen maintenance events or during VM redeployment. The performance characteristics of the temporary disk make them ideal for swap/page files of the operating system.

No application or nonexpendable operating system data should be stored on a temporary disk. In Windows environments, the temporary drive is typically accessed as drive D. In Linux systems, the mount point often is */dev/sdb device*, */mnt*, or */mnt/resource*.

Some VMs [don't offer a temporary drive](/azure/virtual-machines/azure-vms-no-temp-disk). If you plan to use these VM sizes for SAP, you might need to increase the size of the operating system disk. For more information, see SAP Note [1928533]. For VMs that have a temporary disk, get information about the temporary disk size and the IOPS and throughput limits for each VM series in [Sizes for virtual machines in Azure](/azure/virtual-machines/sizes).

You can't directly resize between a VM series that has temporary disks and a VM series that doesn't have temporary disks. Currently, a resize between two such VM families fails. A resolution is to re-create the VM that doesn't have a temporary disk in the new size by using an operating system disk snapshot. Keep all other data disks and the network interface. Learn how to [resize a VM size that has a local temporary disk to a VM size that doesn't](/azure/virtual-machines/azure-vms-no-temp-disk#can-i-resize-a-vm-size-that-has-a-local-temp-disk-to-a-vm-size-with-no-local-temp-disk---).

### Network shares and volumes for SAP

SAP systems usually require one or more network file shares. The file shares typically are one of the following options:

- An SAP transport directory (*/usr/sap/trans* or *TRANSDIR*).
- SAP volumes or shared *sapmnt* or *saploc* volumes to deploy multiple application servers.
- High-availability architecture volumes for SAP (A)SCS, SAP ERS, or a database (*/hana/shared*).
- File interfaces that run third-party applications for file import and export.

In these scenarios, we recommend that you use an Azure service, such as [Azure Files](/azure/storage/files/storage-files-introduction) or [Azure NetApp Files](/azure/azure-netapp-files/). If these services aren't available in the regions you choose, or if they aren't available for your solution architecture, alternatives are to provide NFS or SMB file shares from self-managed, VM-based applications or from third-party services. See SAP Note [2015553] about limitations to SAP support if you use third-party services for storage layers in an SAP system in Azure.

Due to the often critical nature of network shares, and because they often are a single point of failure in a design (for high availability) or process (for the file interface), we recommend that you rely on each Azure native service for its own availability, SLA, and resiliency. In the planning phase, it's important to consider these factors:

- NFS or SMB share design, including which shares to use per SAP system ID (SID), per landscape, and per region.
- Subnet sizing, including the IP requirement for private endpoints or dedicated subnets for services like Azure NetApp Files.
- Network routing to SAP systems and connected applications.
- Use of a public or [private endpoint](/azure/private-link/private-endpoint-overview) for Azure Files.

For information about requirements and how to use an NFS or SMB share in a high-availability scenario, see [High availability](#high-availability).

> [!NOTE]
> If you use Azure Files for your network shares, we recommend that you use a private endpoint. In the unlikely event of a zonal failure, your NFS client automatically redirects to a healthy zone. You don't have to remount the NFS or SMB shares on your VMs.

## Security for your SAP landscape

To protect your SAP workload on Azure, you need to plan multiple aspects of security:

- Network segmentation and the security of each subnet and network interface.
- Encryption on each layer within the SAP landscape.
- Identity solution for end-user and administrative access and single sign-on services.
- Threat and operation monitoring.

The topics in this chapter aren't an exhaustive list of all available services, options, and alternatives. It does list several best practices that should be considered for all SAP deployments in Azure. There are other aspects to cover depending on your enterprise or workload requirements. For more information about security design, see the following resources for general Azure guidance:

- [Azure Well-Architected Framework: Security pillar](/azure/architecture/framework/security/overview)
- [Azure Cloud Adoption Framework: Security](/azure/cloud-adoption-framework/secure/)

### Secure virtual networks by using security groups

Planning your SAP landscape in Azure should include some degree of network segmentation, with virtual networks and subnets dedicated only to SAP workloads. Best practices for subnet definition are described in [Networking](#azure-networking) and in other Azure architecture guides. We recommend that you use [NSGs](/azure/virtual-network/network-security-groups-overview) with [ASGs](/azure/virtual-network/application-security-groups) within NSGs to permit inbound and outbound connectivity. When you design ASGs, each NIC on a VM can be associated with multiple ASGs, so you can create different groups. For example, create an ASG for DBMS VMs, which contains all database servers across your landscape. Create another ASG for all VMs (application and DBMS) of a single SAP SID. This way, you can define one NSG rule for the overall database ASG and another, more specific rule only for the SID-specific ASG.

NSGs don't restrict performance with the rules that you define for the NSG. For monitoring traffic flow, you can optionally activate [NSG flow logging](/azure/network-watcher/network-watcher-nsg-flow-logging-overview) with logs evaluated by an information event management (SIEM) or intrusion detection system (IDS) of your choice to monitor and act on suspicious network activity.

> [!TIP]
> Activate NSGs only on the subnet level. Although NSGs can be activated on both the subnet level and the NIC level, activation on both is very often a hindrance in troubleshooting situations when analyzing network traffic restrictions. Use NSGs on the NIC level only in exceptional situations and when required.

### Private endpoints for services

Many Azure PaaS services are accessed by default through a public endpoint. Although the communication endpoint is located on the Azure back-end network, the endpoint is exposed to the public internet. [Private endpoints](/azure/private-link/private-endpoint-overview) are a network interface inside your own private virtual network. Through [Azure Private Link](/azure/private-link/), the private endpoint projects the service into your virtual network. Selected PaaS services are then privately accessed through the IP inside your network. Depending on the configuration, the service can potentially be set to communicate through private endpoint only.

Using a private endpoint increases protection against data leakage, and it often simplifies access from on-premises and peered networks. In many situations, the network routing and process to open firewall ports, which often are needed for public endpoints, is simplified. The resources are inside your network already because they're accessed by a private endpoint.

To learn which Azure services offer the option to use a private endpoint, see [Private Link available services](/azure/private-link/availability). For NFS or SMB with Azure Files, we  recommend that you always use private endpoints for SAP workloads. To learn about charges that are incurred by using the service, see [Private endpoint pricing](https://azure.microsoft.com/pricing/details/private-link/). Some Azure services might optionally include the cost with the service. This information is included in a service's pricing information.

### Encryption

Depending on your corporate policies, encryption [beyond the default options](/azure/security/fundamentals/encryption-overview) in Azure might be required for your SAP workloads.

#### Encryption for infrastructure resources

By default, managed disks and blob storage in Azure are [encrypted with a platform-managed key (PMK)](/azure/security/fundamentals/encryption-overview). In addition, bring your own key (BYOK) encryption for managed disks and blob storage is supported for SAP workloads in Azure. For [managed disk encryption](/azure/virtual-machines/disk-encryption-overview), you can choose from different options, depending on your corporate security requirements. Azure encryption options include:

- Storage-side encryption (SSE) PMK (SSE-PMK)
- SSE customer-managed key (SSE-CMK)
- Double encryption at rest
- Host-based encryption

For more information, including a description of Azure Disk Encryption, see a [comparison of Azure encryption options](/azure/virtual-machines/disk-encryption-overview#comparison).

> [!NOTE]
> Currently, don't use host-based encryption on a VM that's in the M-series VM family when running with Linux due to a potential performance limitation. The use of SSE-CMK encryption for managed disks is unaffected by this limitation.

For SAP deployments on Linux systems, don't use Azure Disk Encryption. Azure Disk Encryption entails encryption running inside the SAP VMs by using CMKs from Azure Key Vault. For Linux, Azure Disk Encryption doesn't support the [operating system images](/azure/virtual-machines/linux/disk-encryption-overview#supported-operating-systems) that are used for SAP workloads. Azure Disk Encryption can be used on Windows systems with SAP workloads, but don't combine Azure Disk Encryption with database native encryption. We recommend that you use database native encryption instead of Azure Disk Encryption. For more information, see the next section.

Similar to managed disk encryption, [Azure Files](/azure/storage/common/customer-managed-keys-overview) encryption at rest (SMB and NFS) is available with PMKs or CMKs.

For SMB network shares, carefully review Azure Files and [operating system dependencies](/windows-server/storage/file-server/smb-security) with [SMB versions](/azure/storage/files/files-smb-protocol?tabs=azure-portal) because the configuration affects support for in-transit encryption.

> [!IMPORTANT]
> The importance of a careful plan to store and protect the encryption keys if you use customer-managed encryption can't be overstated. Without encryption keys, encrypted resources like disks are inaccessible and can lead to data loss. Carefully consider protecting the keys and access to the keys to only privileged users or services.

#### Encryption for SAP components

Encryption on the SAP level can be separated into two layers:

- DBMS encryption
- Transport encryption

For DBMS encryption, each database that's supported for an SAP NetWeaver or an SAP S/4HANA deployment supports native encryption. Transparent database encryption is entirely independent of any infrastructure encryption that's in place in Azure. You can use [SSE](../../virtual-machines/disk-encryption.md) and database encryption at the same time. When you use encryption, the location, storage, and safekeeping of encryption keys is critically important. Any loss of encryption keys leads to data loss because you won't be able to start or recover your database.

Some databases might not have a database encryption method or might not require a dedicated setting to enable. For other databases, DBMS backups might be encrypted implicitly when database encryption is activated. See the following SAP documentation to learn how to enable and use transparent database encryption:

- [SAP HANA Data and Log Volume Encryption](https://help.sap.com/viewer/b3ee5778bc2e4a089d3299b82ec762a7/2.0.02/en-US/dc01f36fbb5710148b668201a6e95cf2.html)
- SQL Server: SAP Note [1380493]
- Oracle: SAP Note [974876]
- IBM Db2: SAP Note [1555903]
- SAP ASE: SAP Note [1972360]

Contact SAP or your DBMS vendor for support on how to enable, use, or troubleshoot software encryption.

> [!IMPORTANT]
> It can't be overstated how important it is to have a careful plan to store and protect your encryption keys. Without encryption keys, the database or SAP software might be inaccessible and you might lose data. Carefully consider how to protect the keys. Allow access to the keys only by privileged users or services.

Transport or *communication encryption* can be applied to SQL Server connections between SAP engines and the DBMS. Similarly, you can encrypt connections from the SAP presentation layer (SAPGui secure network connection or *SNC)* or an HTTPS connection to a web front end. See the applications vendor's documentation to enable and manage encryption in transit.

### Threat monitoring and alerting

To deploy and use threat monitoring and alerting solutions, begin by using your organization's architecture. Azure services provide threat protection and a security view that you can incorporate into your overall SAP deployment plan. [Microsoft Defender for Cloud](/azure/security-center/security-center-introduction) addresses the threat protection requirement. Defender for Cloud typically is part of an overall governance model for an entire Azure deployment, not just for SAP components.

For more information about security information event management (SIEM) and security orchestration automated response (SOAR) solutions, see [Microsoft Sentinel solutions for SAP integration](/azure/sentinel/sap/deployment-overview).

### Security software inside SAP VMs

SAP Note [2808515] for Linux and SAP Note [106267] for Windows describe requirements and best practices when you use virus scanners or security software on SAP servers. We recommend that you follow the SAP recommendations when you deploy SAP components in Azure.

## High availability

SAP high availability in Azure has two components:

- **Azure infrastructure high availability**: High availability of Azure compute (VMs), network, and storage services, and how they can increase SAP application availability.  
- **SAP application high availability**: How it can be combined with the Azure infrastructure high availability by using service healing. An example that uses high availability in SAP software components:

  - An SAP (A)SCS and SAP ERS instance  
  - The database server  

For more information about high availability for SAP in Azure, see the following articles:

- [Supported scenarios: High-availability protection for the SAP DBMS layer](planning-supported-configurations.md#high-availability-protection-for-the-sap-dbms-layer)  
- [Supported scenarios: High availability for SAP Central Services](planning-supported-configurations.md#high-availability-for-sap-central-service)  
- [Supported scenarios: Supported storage for SAP Central Services scenarios](planning-supported-configurations.md#supported-storage-with-the-sap-central-services-scenarios-listed-above)  
- [Supported scenarios: Multi-SID SAP Central Services failover clusters](planning-supported-configurations.md#multi-sid-sap-central-services-failover-clusters)  
- [Azure Virtual Machines high availability for SAP NetWeaver](sap-high-availability-guide-start.md)  
- [High-availability architecture and scenarios for SAP NetWeaver](sap-high-availability-architecture-scenarios.md)  
- [Utilize Azure infrastructure VM restart to achieve higher availability of an SAP system without clustering](sap-higher-availability-architecture-scenarios.md)  
- [SAP workload configurations with Azure availability zones](high-availability-zones.md)  
- [Public endpoint connectivity for virtual machines by using Azure Standard Load Balancer in SAP high-availability scenarios](high-availability-guide-standard-load-balancer-outbound-connections.md)  

Pacemaker on Linux, and Windows Server failover clustering are the only high-availability frameworks for SAP workloads that are directly supported by Microsoft on Azure. Any other high-availability framework isn't supported by Microsoft and will need design, implementation details, and operations support from the vendor. For more information, see [Supported scenarios for SAP in Azure](planning-supported-configurations.md).

## Disaster recovery

Often, SAP applications are among the most business-critical processes in an enterprise. Based on their importance and the time required to be operational again after an unforeseen interruption, business continuity and disaster recovery (BCDR) scenarios should be carefully planned.

To learn how to address this requirement, see [Disaster recovery overview and infrastructure guidelines for SAP workload](disaster-recovery-overview-guide.md).

## Backup

As part of your BCDR strategy, backup for your SAP workload must be an integral part of any planned deployment. The backup solution must cover all layers of an SAP solution stack: VM, operating system, SAP application layer, DBMS layer, and any shared storage solution. Backup for Azure services that are used by your SAP workload, and for other crucial resources like encryption and access keys also must be part of your backup and BCDR design.

Azure Backup offers PaaS solutions for backup:

- VM configuration, operating system, and SAP application layer (data resizing on managed disks) through Azure Backup for VM. Review the [support matrix](/azure/backup/backup-support-matrix-iaas) to verify that your architecture can use this solution.
- [SQL Server](/azure/backup/sql-support-matrix) and [SAP HANA](/azure/backup/sap-hana-backup-support-matrix) database data and log backup. It includes support for database replication technologies, such as HANA system replication or SQL Always On, and cross-region support for paired regions.
- File share backup through Azure Files. [Verify support](/azure/backup/azure-file-share-support-matrix) for NFS or SMB and other configuration details.

Alternatively, if you deploy Azure NetApp Files, [backup options are available](/azure/azure-netapp-files/backup-introduction) on the volume level, including [SAP HANA and Oracle DBMS](/azure/azure-netapp-files/azacsnap-introduction) integration with a scheduled backup.

Azure Backup solutions offer a [soft-delete option](/azure/backup/backup-azure-security-feature-cloud) to prevent malicious or accidental deletion and to prevent data loss. Soft-delete is also available for file shares that you deploy by using Azure Files.

Backup options are available for a solution that you create and manage yourself, or if you use third-party software. An option is to use the services with Azure Storage, including by using [immutable storage for blob data](/azure/storage/blobs/immutable-storage-overview). This self-managed option currently would be required as a DBMS backup option for some databases like SAP ASE or IBM Db2.

Use the recommendations in Azure best practices to [protect and validate against ransomware](/azure/security/fundamentals/backup-plan-to-protect-against-ransomware) attacks.

> [!TIP]
> Ensure that your backup strategy includes protecting your deployment automation, encryption keys for Azure resources, and transparent database encryption if used.

### Cross-region backup

For any cross-region backup requirement, determine the Recovery Time Objective (RTO) and Recovery Point Objective (RPO) that's offered by the solution and whether it matches your BCDR design and needs.

## SAP migration to Azure

It isn't possible to describe all migration approaches and options for the large variety of SAP products, version dependencies, and native operating system and DBMS technologies that are available. The project team for your organization and representatives from your service provider side should consider several techniques for a smooth SAP migration to Azure.

- **Test performance during migration**. An important part of SAP migration planning is technical performance testing. The migration team needs to allow sufficient time and availability for key personnel to run application and technical testing of the migrated SAP system, including connected interfaces and applications. For a successful SAP migration, it's critical to compare the premigration and post-migration runtime and accuracy of key business processes in a test environment. Use the information to optimize the processes before you migrate the production environment.

- **Use Azure services for SAP migration**. Some VM-based workloads are migrated without change to Azure by using services like [Azure Migrate](/azure/migrate/) or [Azure Site Recovery](/azure/site-recovery/physical-azure-disaster-recovery), or a third-party tool. Diligently confirm that the operating system version and the SAP workload it runs are supported by the service.

  Often, any database workload is intentionally not supported because a service can't guarantee database consistency. If the DBMS type is supported by the migration service, the database change or churn rate often is too high. Most busy SAP systems won't meet the change rate that migration tools allow. Issues might not be seen or discovered until production migration. In many situations, some Azure services aren't suitable for migrating SAP systems. Azure Site Recovery and Azure Migrate don't have validation for a large-scale SAP migration. A proven SAP migration methodology is to rely on DBMS replication or SAP migration tools.

  A deployment in Azure instead of a basic VM migration is preferable and easier to accomplish than an on-premises migration. Automated deployment frameworks like [Azure Center for SAP solutions](../center-sap-solutions/overview.md) and [Azure deployment automation framework](../automation/deployment-framework.md) allow quick execution of automated tasks. To migrate your SAP landscape to a new deployed infrastructure by using DBMS native replication technologies like HANA system replication, DBMS backup and restore, or SAP migration tools uses established technical knowledge of your SAP system.

- **Infrastructure scale-up**. During an SAP migration, having more infrastructure capacity can help you deploy more quickly. The project team should consider scaling up the [VM size](/azure/virtual-machines/sizes) to provide more CPU and memory. The team also should consider scaling up VM aggregate storage and network throughput. Similarly, on the VM level, consider storage elements like individual disks to increase throughput with [on-demand bursting](/azure/virtual-machines/disks-enable-bursting) and [performance tiers](/azure/virtual-machines/disks-performance-tiers-portal) for Premium SSD v1. Increase IOPS and throughput values if you use [Premium SSD v2](/azure/virtual-machines/disks-deploy-premium-v2?tabs=azure-cli#adjust-disk-performance) above the configured values. Enlarge NFS and SMB file shares to increase performance limits. Keep in mind that Azure manage disks can't be reduced in size, and that reduction in size, performance tiers, and throughput KPIs can have various cool-down times.

- **Optimize network and data copy**. Migrating an SAP system to Azure always involves moving a large amount of data. The data might be database and file backups or replication, an application-to-application data transfer, or an SAP migration export. Depending on the migration process you use, you need to choose the correct network path to move the data. For many data move operations, using the internet instead of a private network is the quickest path to copy data securely to Azure storage.

  Using ExpressRoute or a VPN can lead to bottlenecks:

  - The migration data uses too much bandwidth and interferes with user access to workloads that are running in Azure.
  - Network bottlenecks on-premises, like a firewall or throughput limiting, often are discovered only during migration.
  
  Regardless of the network connection that's used, single-stream network performance for a data move often is low. To increase the data transfer speed over multiple TCP streams, use tools that can support multiple streams. Apply optimization techniques that are described in SAP documentation and in many blog posts on this topic.

> [!TIP]
> In the planning stage, it's important to consider any dedicated migration networks that you'll use for large data transfers to Azure. Examples include backups or database replication or using a public endpoint for data transfers to Azure storage. The impact of the migration on network paths for your users and applications should be expected and mitigated. As part of your network planning, consider all phases of the migration and the cost of a partially productive workload in Azure during migration.

## Support and operations for SAP

A few other areas are important to consider before and during SAP deployment in Azure.

### Azure VM extension for SAP

*Azure Monitoring Extension*, *Enhanced Monitoring*, and *Azure Extension for SAP* all refer to a VM extension that you need to deploy to provide some basic data about the Azure infrastructure to the SAP host agent. SAP notes might refer to the extension as *Monitoring Extension* or *Enhanced monitoring*. In Azure, it's called *Azure Extension for SAP*. For support purposes, the extension must be installed on all Azure VMs that run an SAP workload. To learn more, see [Azure VM extension for SAP](vm-extension-for-sap.md).

### SAProuter for SAP support

Operating an SAP landscape in Azure requires connectivity to and from SAP for support purposes. Typically, connectivity is in the form of an SAProuter connection, either if it's through an encryption network channel over the internet or via a private VPN connection to SAP. For best practices and for an example implementation of SAProuter in Azure, see your architecture scenario in [Inbound and outbound internet connections for SAP on Azure](/azure/architecture/guide/sap/sap-internet-inbound-outbound).

## Next steps

- [Deploy an SAP workload on Azure](deployment-guide.md)
- [Considerations for Azure Virtual Machines DBMS deployment for SAP workloads](dbms-guide-general.md)
- [SAP workloads on Azure: Planning and deployment checklist](deployment-checklist.md)
- [Virtual machine scale sets for SAP workload](./virtual-machine-scale-set-sap-deployment-guide.md)