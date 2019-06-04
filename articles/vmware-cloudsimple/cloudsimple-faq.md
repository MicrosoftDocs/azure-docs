--- 
title: FAQ - VMware Solution by CloudSimple 
description: Frequently asked questions for Azure VMware Solution by CloudSimple 
author: sharaths-cs
ms.author: b-shsury 
ms.date: 05/24/19 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Frequently asked questions about VMware Solution by CloudSimple

Frequently asked questions and answers about VMware Solution by CloudSimple that help you understand the service and how to use it.  The questions and answers are arranged in the following categories.

* CloudSimple Service
* Connectivity
* Networking
* Security
* Compute
* Storage
* VMware
* Azure Integration
  
## CloudSimple Service

**What is VMware Solution by CloudSimple?**

**VMware Solution by CloudSimple** transforms and extends VMware workloads to private, dedicated clouds on Azure in minutes. We take care of provisioning, managing the infrastructure and orchestrating workloads between on-premises and Azure. Because your apps run exactly the same on-premises and in Azure, you benefit from the elasticity and services of the cloud without the complexity of rearchitecting your apps. CloudSimple lowers your total cost of ownership with a cloud consumption model that provides on-demand provisioning, pay-as-you-grow, and capacity optimization.  See [What is VMware Solution on Azure by CloudSimple](cloudsimple-vmware-solutions-overview.md) for features, benefits and scenarios.

**What is a CloudSimple Private Cloud?**

You provision a private, dedicated cloud consisting of high performance compute, storage, and networking environment deployed on Microsoft Azure infrastructure (hardware and datacenter space) in Azure locations.  Private Cloud provides a native VMware platform 'as-a-service'. In VMware terms, each Private Cloud contains exactly one instance of the vCenter Server. The vCenter Server manages multiple ESXi nodes contained in one or more vSphere Clusters, along with the corresponding Virtual SAN (vSAN) storage. A CloudSimple Service can contain multiple private clouds in your Azure subscription.  For more information about private clouds, see [Private Cloud overview](cloudsimple-private-cloud.md).

**Where is CloudSimple service available?**

CloudSimple is available in East US and West US regions.

**How do I enable my subscription for CloudSimple?**

You can contact your Microsoft account representative at [azurevmwaresales@microsoft.com](mailto:azurevmwaresales@microsoft.com) to enable your subscription for CloudSimple service. Provide your subscription ID in the email for which you want CloudSimple service enabled.  

**How do I access the CloudSimple portal?**

You access CloudSimple portal from Azure portal.  See [Accessing VMware Solution by CloudSimple portal from Azure portal](https://docs.azure.cloudsimple.com/access-cloudsimple-portal) article for details on accessing CloudSimple portal. 

**How do I increase capacity for a Private Cloud?**

You purchase nodes from Azure portal and expand your Private Cloud from the CloudSimple portal.  You can expand your Private Cloud by adding additional nodes to existing vSphere cluster or by creating new vSphere cluster.  See [Expand a CloudSimple Private Cloud](https://docs.azure.cloudsimple.com/expand-private-cloud) article for the procedure.

**What happens to my Private Cloud during maintenance?**

CloudSimple provides periodic notifications of days prior to scheduled maintenance.  Maintenance is done in a non-disruptive way to ensure the availability of your Private Cloud.  Maintenance can be of the following types:

1. **CloudSimple Infrastructure:**  CloudSimple Infrastructure is designed to be highly available.  During the maintenance, connectivity and availability of your Private Cloud is ensured by updating redundant components one at a time without any impact.  You will have access to your Private Cloud vCenter, all virtual machines, internet connection from your Private Cloud and connections to on-premises or Azure.
2. **CloudSimple Portal:** During maintenance, some features on CloudSimple portal may not be accessible or disabled.  Maintenance notification will include the details of what can be done on the portal.

## Connectivity

**What are my connectivity options to CloudSimple region network?**

CloudSimple provides three different connectivity options to connect to your CloudSimple region network.  All three can be used together.

1. ExpressRoute connection from your on-premises datacenter to CloudSimple region network - High-speed low latency secure private connection bridging your on-premises ExpressRoute circuit with your CloudSimple ExpressRoute circuit using Global Reach. See [Connect from on-premises to CloudSimple using ExpressRoute](https://docs.azure.cloudsimple.com/on-premises-connection) article for setting up the connection.
2. ExpressRoute connection from your Azure virtual network to your CloudSimple region network  - High-speed low latency secure private connection bridging your virtual network on Azure with your CloudSimple ExpressRoute circuit using virtual network gateways.  See [Connect your CloudSimple Private Cloud environment to the Azure virtual network using ExpressRoute](https://docs.azure.cloudsimple.com/azure-expressroute-connection) article for setting up the connection.
3. Site-to-Site VPN connection from your on-premises datacenter to your CloudSimple region network - Secure virtual private network from your on-premises VPN device to your CloudSimple Private Cloud region.  See [Set up VPN connection between your on-premises network and CloudSimple Private Cloud] article for setting up VPN connection.

**How do I connect to a Private Cloud?**

You can view details of your Private Cloud in the CloudSimple Portal. To connect to the vCenter corresponding to your Private Cloud, ensure network connection is established using Site-to-Site, Point-to-Site, or ExpressRoute. Then, launch the CloudSimple portal from Azure portal and click *Launch vSphere Client* on the Home page or on the Private Cloud details page.

**What is the advantage of ExpressRoute circuit?**

Azure ExpressRoute circuit provides high-speed low latency secure connection.  CloudSimple provides a dedicated ExpressRoute Circuit per region per customer.  Using this circuit, you can establish secure connection from on-premises and/or your Azure subscription.

**What are the network costs to connect to/from CloudSimple. Any Egress charges to/from CloudSimple to Azure? Across Regions?**

There is no charge for any network egress.  Azure standard rates apply to any egress traffic from your virtual network or from on-premises ExpressRoute circuit.

## Networking

**What networking features are available for my Private Cloud?**

You can provision VLANs (and their subnets), firewall tables, and assign public IP addresses and map to a virtual machine running in your Private Cloud.  For more information, see [VLANs/Subnets overview](cloudsimple-vlans-subnets.md), [Firewall Tables overview](cloudsimple-firewall-tables.md), and [Public IP address overview](cloudsimple-public-ip-address.md) articles.

**How do I set up different subnets for my applications in my Private Cloud?**

You can create VLANs on your Private Cloud from your CloudSimple Portal.  Once you create the VLAN, you can create a distributed port group on your Private Cloud vCenter using the VLAN and create virtual machines connected to the distributed port group.  You can enable firewall table for the VLAN/Subnet and define firewall rules to secure network traffic.

**What firewall settings are available for my Private Clouds?**

You can configure rules for north-south and east-west traffic.  The rules are defined in a firewall table.  The firewall table can be attached to VLAN(s) on your Private Cloud.  See [Set up firewall tables and rules for Private Clouds](https://docs.azure.cloudsimple.com/firewall) article for set up procedure.

**Can I assign public IP addresses for VMs in my Private Cloud environment?**

In the CloudSimple portal, you can easily allocate a new Public IP address and associate it with a private IP address of your virtual machine or an appliance.  You can also create new firewall rules or apply existing firewall rules to allow traffic from specific ports and/or specific set of IP addresses in the Portal. See [Allocate public IP addresses for Private Cloud environment](https://docs.azure.cloudsimple.com/public-ips) for set up procedure.

## Security

**What are my security options on CloudSimple?**

CloudSimple Private Cloud provides the following security features for securing your Private Cloud environment:

1. **Data at rest encryption**: You can encrypt data at rest residing on the vSAN storage in your Private Cloud. vSAN supports external key management server, which can be deployed in your Azure vNet or on-premises environment.  See [Configure vSAN encryption for your CloudSimple Private Cloud](https://docs.azure.cloudsimple.com/vsan-encryption) for more details.
2. **Network security**: Control network traffic flow from/to your Private Cloud from Internet, on-premises and within subnets of your Private Cloud using firewall rules.
3. **Secure, Private connection**: Secure private connection between your on-premises network and your Azure subscription.

## Compute

**What kind of hosts are available?**

CloudSimple offers two host types:

* **CS28 Node:** CPU:2x 2.2 GHz, Total 28 Cores, 48 HT.  RAM: 256 GB.  Storage: 1600 GB NVMe Cache, 5760 GB Data (All-Flash). Network: 2x25Gbe NIC
* **CS36 Node:** CPU 2x 2.3 GHz, Total 36 cores, 72 HT.  RAM: 512 GB.  Storage: 3200 GB NVMe Cache 11,520 GB Data (All-Flash).  Network: 2x25Gbe NIC

**How are any hardware failures handled?**

All CloudSimple infrastructure is continuously monitored by the CloudSimple platform and our service operations teams.  If a hardware failure is detected, a new node is added to your Private Cloud and failed node is removed ensuring high availability of your Private Cloud.

## Storage

**What type of storage is supported on a Private Cloud?**

CloudSimple offers **All-flash VMware vSAN storage** with every Private Cloud.  Each vSphere is created with its own vSAN datastore.  See [Private Cloud VMware components - vSAN storage](https://docs.azure.cloudsimple.com/vmware-components/#vsan-storage) article for more details.

**Is encryption of data supported?**
Yes.  You can set up the vSAN storage on your Private Cloud to use a key management server (KMS) which is deployed on-premises or on Azure for encrypting of data stored on vSAN

**How are failed disks handled?**

CloudSimple monitoring continuously monitors all hardware components of the Private Cloud.  If any disk failure is detected or any disk is identified as failing (based on heuristics), a new node is automatically added to the Private Cloud.  The node with failed or failing disk is removed from the Private Cloud.

## VMware

**How do I perform large-scale upload/migrate applications and data from on-premises?**

CloudSimple provides native VMware vSphere solution.  Any tool used for bulk data migration can be used with CloudSimple Private Cloud.  Some of the options available are:

1. VMware HCX for bulk migration of data.
2. Cold migration of data using Storage vMotion from on-premises to CloudSimple.

**Can I install any VMware tools?**

CloudSimple provides native VMware vSphere solution.  Any tool used for managing vSphere environment on-premises can be used on CloudSimple.  CloudSimple supports Bring-Your-Own-License (BYOL) model for installing VMware tools.

**How are updates and upgrades managed?**

CloudSimple manages and updates all infrastructure components of your Private Cloud in a seamless non-disruptive manner.  Any update or security patch released by VMware or infrastructure vendors will be scheduled for update as soon as it is qualified by CloudSimple.

CloudSimple does not perform upgrades or updates of applications installed on the Private Cloud.

## Azure Integration

**What Azure services are supported?**

CloudSimple provides Azure ExpressRoute connection to your subscription on Azure.  Any services running in your subscription has network connectivity to your Private Cloud and can connect to your Private Cloud.  Examples:

1. **Azure Active Directory** as an identity source for your CloudSimple vCenter
2. **Azure storage** for storing backups, images, and other data from your Private Cloud
3. **Hybrid Applications** - You can create application architecture that spans public and private clouds.  For example, you can create webservers in Azure that access application and database servers on CloudSimple Private Cloud.
4. **Azure monitor** and **Azure security center** - Workload running on VMware can use these for logging, performance metrics, and security management.

**How do I map my VMware tenants to Azure?**

CloudSimple provides the unique ability to manage your VMware VMs on Private Cloud from Azure portal.  A vCenter resource pool (configured with desired resource constraints) can be mapped to your subscription by the global administrator.  

**What licensing benefits do I get with Azure?**

With CloudSimple, you can take advantage of the Azure Hybrid Usage Benefit and save up to 90% on licenses preserving your investment in Microsoft Licenses, lowering your TCO compared to other clouds. In addition, you get extended security updates for Windows Server 2008 and Microsoft SQL Server 2008.  Keep your costs low with Bring Your Own Licenses (BYOL) to the cloud for common apps such as Veeam, Zerto, and others.  