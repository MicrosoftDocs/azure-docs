---
title: FAQ - VMware Solution by CloudSimple 
description: Frequently asked questions for Azure VMware Solution by CloudSimple 
author: sharaths-cs
ms.author: b-shsury 
ms.date: 05/24/2019 
ms.topic: article 
ms.service: vmware 
ms.reviewer: cynthn 
manager: dikamath 
---
# Frequently asked questions about VMware Solution by CloudSimple

Frequently asked questions and answers about Azure VMware Solution by CloudSimple that help you understand the service and how to use it. The questions and answers are arranged in the following categories:

* CloudSimple service
* Connectivity
* Networking
* Security
* Compute
* Storage
* VMware
* Azure integration
 
## CloudSimple service

**What is Azure VMware Solution by CloudSimple?**

Azure VMware Solution by CloudSimple transforms and extends VMware workloads to private, dedicated clouds on Azure in minutes. The solution provisions, manages the infrastructure, and orchestrates workloads between on-premises and Azure. Because your apps run exactly the same on-premises and in Azure, you benefit from the elasticity and services of the cloud without the complexity of rearchitecting your apps. CloudSimple lowers your total cost of ownership with a cloud consumption model that provides on-demand provisioning, pay-as-you-grow, and capacity optimization. For features, benefits, and scenarios, see [What is Azure VMware Solution by CloudSimple?](cloudsimple-vmware-solutions-overview.md).

**What is a CloudSimple private cloud?**

You provision a private, dedicated cloud that consists of a high-performance compute, storage, and networking environment deployed on Microsoft Azure infrastructure (hardware and datacenter space) in Azure locations. The private cloud provides a native VMware platform as a service. In VMware terms, each private cloud contains exactly one instance of the vCenter Server. The vCenter Server manages multiple ESXi nodes contained in one or more vSphere clusters, along with the corresponding vSAN storage. A CloudSimple service can contain multiple private clouds in your Azure subscription. For more information about private clouds, see [Private cloud overview](cloudsimple-private-cloud.md).

**Where is the CloudSimple service available?**

CloudSimple is available in East US and West US regions.

**How do I enable my subscription for CloudSimple?**

Contact your Microsoft account representative at [azurevmwaresales@microsoft.com](mailto:azurevmwaresales@microsoft.com) to enable your subscription for the CloudSimple service. Provide your subscription ID in the email for which you want CloudSimple service enabled. 

**How do I access the CloudSimple portal?**

You access the CloudSimple portal from the Azure portal. For information on how to access the CloudSimple portal, see [Access the VMware Solution by CloudSimple portal from the Azure portal](https://docs.azure.cloudsimple.com/access-cloudsimple-portal).

**How do I increase capacity for a private cloud?**

You provision nodes from the Azure portal and expand your private cloud from the CloudSimple portal. You can expand your private cloud by adding nodes to an existing vSphere cluster or by creating a new vSphere cluster. For information on the procedure, see [Expand a CloudSimple private cloud](https://docs.azure.cloudsimple.com/expand-private-cloud).

**What happens to my private cloud during maintenance?**

CloudSimple provides periodic notifications days before scheduled maintenance. Maintenance is done in a nondisruptive way to ensure the availability of your private cloud. Maintenance can be of the following types:

- **CloudSimple infrastructure**: The CloudSimple infrastructure is designed to be highly available. During maintenance, connectivity and availability of your private cloud is ensured by updating redundant components one at a time without any impact. You have access to your private cloud vCenter, all virtual machines, internet connection from your private cloud, and connections to on-premises or Azure.
- **CloudSimple portal**: During maintenance, some features on the CloudSimple portal might not be accessible or might be disabled. The maintenance notification includes information about what can be done on the portal.

## Connectivity

**What are my connectivity options to my CloudSimple region network?**

CloudSimple provides three different connectivity options to connect to your CloudSimple region network. All three options can be used together:

- Azure ExpressRoute connection from your on-premises datacenter to CloudSimple region network: A high-speed low-latency secure private connection that bridges your on-premises ExpressRoute circuit with your CloudSimple ExpressRoute circuit by using Global Reach. To set up the connection, see [Connect from on-premises to CloudSimple by using ExpressRoute](https://docs.azure.cloudsimple.com/on-premises-connection).
- ExpressRoute connection from your Azure virtual network to your CloudSimple region network: A high-speed, low-latency secure private connection that bridges your virtual network on Azure with your CloudSimple ExpressRoute circuit by using virtual network gateways. To set up the connection, see [Connect your CloudSimple private cloud environment to the Azure virtual network by using ExpressRoute](https://docs.azure.cloudsimple.com/azure-expressroute-connection).
- Site-to-site VPN connection from your on-premises datacenter to your CloudSimple region network: A secure virtual private network from your on-premises VPN device to your CloudSimple private cloud region. To set up the connection, see [Set up a VPN connection between your on-premises network and CloudSimple private cloud](https://docs.azure.cloudsimple.com/set-up-vpn).

**How do I connect to a private cloud?**

You can view details of your private cloud in the CloudSimple portal. To connect to the vCenter that corresponds to your private cloud, make sure that a network connection is established by using site-to-site, point-to-site, or ExpressRoute. Then, launch the CloudSimple portal from the Azure portal. Select **Launch vSphere Client** on the home page or on the private cloud details page.

**What is the advantage of an ExpressRoute circuit?**

An Azure ExpressRoute circuit provides a high-speed, low-latency secure connection. CloudSimple provides a dedicated ExpressRoute circuit per region per customer. Using this circuit, you can establish secure connection from on-premises and your Azure subscription.

**What are the network costs to connect to and from CloudSimple? Are there any egress charges to and from CloudSimple to Azure? Are there any egress charges across regions?**

There's no charge for network egress. Azure standard rates apply to any egress traffic from your virtual network or from an on-premises ExpressRoute circuit.

## Networking

**What networking features are available for my private cloud?**

You can provision VLANs and their subnets and firewall tables. You can assign public IP addresses and map to a virtual machine that runs in your private cloud. For more information, see [VLANs and subnets overview](cloudsimple-vlans-subnets.md), [Firewall tables overview](cloudsimple-firewall-tables.md), and [Public IP address overview](cloudsimple-public-ip-address.md).

**How do I set up different subnets for my applications in my private cloud?**

You can create VLANs on your private cloud from your CloudSimple portal. After you create the VLAN, you can create a distributed port group on your private cloud vCenter by using the VLAN and create virtual machines connected to the distributed port group. You can enable a firewall table for the VLAN or subnet and define firewall rules to secure network traffic.

**What firewall settings are available for my private clouds?**

You can configure rules for north-south and east-west traffic. The rules are defined in a firewall table. The firewall table can be attached to VLANs on your private cloud. For the setup procedure, see [Set up firewall tables and rules for private clouds](https://docs.azure.cloudsimple.com/firewall).

**Can I assign public IP addresses for VMs in my private cloud environment?**

In the CloudSimple portal, you can easily allocate a new public IP address and associate it with a private IP address of your virtual machine or an appliance. You also can create new firewall rules or apply existing firewall rules to allow traffic from specific ports and specific sets of IP addresses in the portal. For the setup procedure, see [Allocate public IP addresses for a private cloud environment](https://docs.azure.cloudsimple.com/public-ips).

## Security

**What are my security options on CloudSimple?**

A CloudSimple private cloud provides the following security features for securing your private cloud environment:

- **Data at rest encryption:** You can encrypt data at rest that resides on vSAN storage in your private cloud. vSAN supports an external key management server, which can be deployed in your Azure virtual network or on-premises environment. For more information, see [Configure vSAN encryption for your CloudSimple private cloud](https://docs.azure.cloudsimple.com/vsan-encryption).
- **Network security:** Control network traffic flow from and to your private cloud from the internet, on-premises, and within subnets of your private cloud by using firewall rules.
- **Secure, private connection:** Secure, private connection between your on-premises network and your Azure subscription.

## Compute

**What kind of hosts are available?**

CloudSimple offers two host types:

* **CS28 node**: CPU:2x 2.2 GHz, total 28 cores, 48 HT. RAM: 256 GB. Storage: 1600-GB NVMe Cache, 5760-GB Data (All-Flash). Network: 2x25Gbe NIC.
* **CS36 node**: CPU 2x 2.3 GHz, total 36 cores, 72 HT. RAM: 512 GB. Storage: 3200-GB NVMe Cache 11,520-GB Data (All-Flash). Network: 2x25Gbe NIC.

**How are hardware failures handled?**

All CloudSimple infrastructure is continuously monitored by the CloudSimple platform and its service operations teams. If a hardware failure is detected, a new node is added to your private cloud. The failed node is removed to ensure the high availability of your private cloud.

## Storage

**What type of storage is supported on a private cloud?**

CloudSimple offers **All-flash VMware vSAN storage** with every private cloud. Each vSphere is created with its own vSAN datastore. For more information, see [Private cloud VMware components - vSAN storage](https://docs.azure.cloudsimple.com/vmware-components/#vsan-storage).

**Is encryption of data supported?**
Yes. You can set up the vSAN storage on your private cloud to use a key management server (KMS), which is deployed on-premises or on Azure for encrypting of data stored on vSAN.

**How are failed disks handled?**

CloudSimple monitoring continuously monitors all hardware components of the private cloud. If disk failure is detected or a disk is identified as failing based on heuristics, a new node is automatically added to the private cloud. The node with a failed or failing disk is removed from the private cloud.

## VMware

**How do I perform large scale uploading and migration of applications and data from on-premises?**

CloudSimple provides a native VMware vSphere solution. Any tool used for bulk data migration can be used with a CloudSimple private cloud. Some of the options available are:

- VMware HCX for bulk migration of data.
- Cold migration of data by using Storage vMotion from on-premises to CloudSimple.

**Can I install any VMware tools?**

CloudSimple provides a native VMware vSphere solution. Any tool used to manage a vSphere environment on-premises can be used on CloudSimple. CloudSimple supports a bring-your-own-license (BYOL) model for installing VMware tools.

**How are updates and upgrades managed?**

CloudSimple manages and updates all infrastructure components of your private cloud in a seamless nondisruptive manner. Any update or security patch released by VMware or infrastructure vendors is scheduled for update as soon as it's qualified by CloudSimple.

CloudSimple doesn't perform upgrades or updates of applications installed on the private cloud.

## Azure integration

**What Azure services are supported?**

CloudSimple provides Azure ExpressRoute connection to your subscription on Azure. Any services that run in your subscription have network connectivity to your private cloud and can connect to your private cloud. Examples:

- **Azure Active Directory**: Use Azure Active Directory as an identity source for your CloudSimple vCenter.
- **Azure Storage**: Use Storage to store backups, images, and other data from your private cloud.
- **Hybrid applications**: You can create application architecture that spans public and private clouds. For example, you can create web servers in Azure that access application and database servers on a CloudSimple private cloud.
- **Azure Monitor** and **Azure Security Center**: Workload that runs on VMware can use Monitor and Security Center for logging, performance metrics, and security management.

**How do I map my VMware tenants to Azure?**

CloudSimple provides the unique ability to manage your VMware VMs on a private cloud from the Azure portal. A vCenter resource pool configured with the resource constraints you want can be mapped to your subscription by the global administrator. 

**What licensing benefits do I get with Azure?**

With CloudSimple, you can take advantage of the Azure Hybrid Benefit and save up to 90 percent on licenses to preserve your investment in Microsoft licenses and lower your total cost of ownership compared to other clouds. You also get extended security updates for Windows Server 2008 and Microsoft SQL Server 2008. Keep your costs low with BYOL to the cloud for common apps like Veeam, Zerto, and others. 
