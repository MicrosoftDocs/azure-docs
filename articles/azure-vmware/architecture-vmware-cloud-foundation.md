---
title: Architecture for VMware Cloud Foundation 9.1
description: Understand the Azure VMware Solution design and implementation of VMware Cloud Foundation 9.1. 
ms.topic: concept-article
author: rvandenbedem
ms.author: rvandenbedem
ms.service: azure-vmware
ms.date: 11/6/2026
# Customer intent: As a cloud architect, I want to understand how VMware Cloud Foundation 9.1 has been designed and implemented with Azure VMware Solution.
---

# Azure VMware Solution and VMware Cloud Foundation 9.1

Azure VMware Solution provides Broadcom's VMware Cloud Foundation 9.1 Software-Defined Data Center (SDDC) private cloud in Azure. Azure fully integrates and automates the private cloud hardware and software deployments. You deploy and manage the private cloud through the Azure portal, the Azure CLI, or PowerShell.

> [!NOTE]
> This article updates as Microsoft progresses to general availability.

> [!IMPORTANT]
> Microsoft continues to operate Azure VMware Solution as a managed service.

A private cloud includes clusters with:

- VCF Fleet Manager and SDDC Manager.
- VCF Operations with License Server.
- Dedicated bare-metal server hosts provisioned with VMware vSphere Hypervisor (ESX).
- VMware vCenter for managing VMware ESX and VMware vSAN.
- VMware NSX software-defined networking for vSphere workload virtual machines (VMs).
- VMware vSAN datastore for vSphere workload VMs.
- VMware Operations HCX for workload mobility.
- VCF Protection & Recovery Live Recovery for disaster recovery.
- Resources in the Azure underlay (required for connectivity and to operate the private cloud).

Install and manage private clouds within an Azure subscription. You can scale the number of private clouds within a subscription. Initially, you can have only one private cloud per subscription. There's a logical relationship between Azure subscriptions, Azure VMware Solution private clouds, VMware Cloud Foundation instances, vSAN clusters, and hosts.

The following diagram describes the architectural components of Azure VMware Solution with VMware Cloud Foundation 9.1.

:::image type="content" source="media/concepts/vmware-cloud-foundation-architecture-overview.png" alt-text="Diagram that shows the Azure VMware Solution architecture with VMware Cloud Foundation 9.1." border="false"  lightbox="media/concepts/vmware-cloud-foundation-architecture-overview.png":::

Each Azure VMware Solution architectural component has the following function:

- **Azure subscription**: Provides controlled access, budget, and quota management for Azure VMware Solution.
- **Azure region**: Groups datacenters into availability zones and then groups availability zones into regions.
- **Azure resource group**: Places Azure services and resources into logical groups.
- **Azure VMware Solution private cloud**: Offers compute, networking, and storage resources by using VMware software, including VCF Fleet Manager, SDDC Manager, VCF Operations with License Server, vCenter, NSX software-defined networking, vSAN software-defined storage, and Azure bare-metal ESX hosts. Azure NetApp Files, Azure Elastic SAN, and Everpure Cloud Azure Native for Azure VMware Solution are also supported.
- **Azure VMware Solution resource cluster**: Provides compute, networking, and storage resources for customer workloads by scaling out the Azure VMware Solution private cloud by using VMware software, including vSAN software-defined storage and Azure bare-metal ESX hosts. Azure NetApp Files, Azure Elastic SAN, and Everpure Cloud Azure Native for Azure VMware Solution are also supported.
- **VMware Operations HCX**: Delivers mobility, migration, and network extension services.
- **VCF Protection & Recovery Live Recovery**: Automates disaster recovery and storage replication services with VMware vSphere Enhanced Replication. Non-Microsoft disaster recovery solutions Zerto disaster recovery and JetStream Software disaster recovery are also supported.
- **Dedicated Microsoft Enterprise Edge**: Router that connects Azure Cloud Services and the Azure VMware Solution private cloud instance.
- **Azure Virtual Network**: Connects Azure services and resources together.
- **Azure Route Server**: Exchanges dynamic route information with Azure networks.
- **Azure Virtual Network gateway**: Connects Azure services and resources to other private networks by using IPSec virtual private network, Azure ExpressRoute, and virtual network to virtual network.
- **Azure ExpressRoute**: Provides high-speed private connections between Azure datacenters and on-premises or colocation infrastructure.
- **Azure Virtual WAN**: Combines networking, security, and routing functions into a single unified wide area network (WAN).

## VMware Cloud Foundation 9.1 supported features

The following table lists the Azure VMware Solution features and VCF 9.1 capabilities that you can use.

| Azure VMware Solution feature | Customer enabled |
| --- | --- |
| Generation 1 Architecture | Yes |
| Generation 2 Architecture | Yes |
| Stretched Clusters | Yes |
| AV36P, AV52, AV48, AV64 SKUs | Yes |
| AV36 SKU | No |
| Microsoft Azure Government | Yes |
| VCF License Included | No (VCF BYOL only) |
| VCF Operations | License Management only (VCF BYOL) |
| VCF Fleet Manager | No |
| SDDC Manager | No |
| vSphere Supervisor | No |
| vSphere Kubernetes Service | No |
| VCF Log Management | No (use Azure VMware Solution diagnostics instead) |
| VCF Operations for Networks | No |
| VCF Operations orchestrator | No |
| VMware Identity Broker | No |
| VCF Automation | No |
| VCF Operations HCX | Yes |
| VCF Protection & Recovery Live Recovery | Yes |
| Zerto DR | Yes |
| Jetstream DR | Yes |
| Azure NetApp Files | Yes |
| Azure eSAN | Yes |
| Everpure Cloud Azure Native for Azure VMware Solution | Yes |
| VMware NSX Public IP Address (PIP) | Yes |
| NSX Virtual Private Cloud (VPC) | No |
| vSphere/NSX Enhanced Data Path (EDP) | Yes |
| VMware vDefend | Yes |
| Application Networking and Security (ANS) Shared Services Platform (SSP) | No |
| VMware vCD/vCDA (self-managed) | Yes (custom patch with Broadcom EoS date) |
| Azure Arc | Yes |
| Run Commands | Yes |

> [!NOTE]
> Microsoft is assessing how to support all of the VCF 9.1 features in the Azure VMware Solution platform in the future.

## Architecture

Broadcom revamped the VMware solution stack, with VMware Cloud Foundation (VCF) as the way to consume the entire suite at scale. Broadcom made these changes in VMware Cloud Foundation 9.0 (2025) and VMware Cloud Foundation 9.1 (2026), with future versions of VCF coming each year. Broadcom made major architectural changes in the VCF control plane as it engineers VCF to its desired target state. The first change to mention is the move from license keys to license files with a dedicated License Server running in VCF paired with the customer’s Broadcom Business Console tracking license usage. The second change is the containerization of the control plane with the VCF Management Services Platform (VCF services runtime) where services like VCF Fleet Manager and VCF Log Management run as containers. The third change is the convergence of VMware vCloud Director (vCD) and VMware Aria Automation into VCF Automation.

Previously, Azure VMware Solution used its own control plane to manage VMware software components running in the private cloud. With VMware Cloud Foundation 9.1, Azure VMware Solution now uses the VCF 9.1 management and control plane to operate and manage the private cloud. Azure VMware Solution uses the VCF 9.1 Installer in **brownfield claim** mode. This means the SDDC Manager runs in **sync mode** while the Azure VMware Solution control plane continues to connect to the vCenter and NSX SDKs. Azure VMware Solution deploys VCF in Simple mode, to support the 3-node minimum of Cluster-1. Since Azure VMware Solution is a managed service, our initial release of VCF 9.1 only gives the customer access to VCF Operations for License Management by using the **vcfopsadmin** user. Azure VMware Solution configures a single VCF instance with the Management Domain only. You can't configure Workload Domains or add more VCF instances within a single Azure VMware Solution tenant. This constraint is part of the Azure VMware Solution managed service platform architecture.

## Prerequisites

- You need a Bring Your Own License (BYOL) subscription with Broadcom for VMware Cloud Foundation 9. The Azure VMware Solution License Included model isn't supported.
- Cluster-1 must have sufficient compute and storage resources available for the VCF 9.1 management and control plane to deploy in VCF Simple Mode.

## Private Cloud Greenfield deployment process

1.	Add Cluster-1 ESX 9.1 hosts to Azure VMware Solution tenant.
2.	Deploy vCenter 9.1 to first ESX host of Cluster-1.
3.	NSX 9.1 deployed to Cluster-1.
4.	Deploy VCF 9.1 Installer with offline software depot.
5.	VCF Installer 9.1 executes VCF instance **brownfield claim** mode.
6.	VCF Operations, VCF Fleet Manager, VCF Software Depot, and VCF Runtime services deployed to Cluster-1.
7.	VCF 9.1 Installer converted to SDDC Manager.

## Private Cloud Brownfield upgrade process

1.	If add-on enabled, upgrade VMware HCX to VCF Operations HCX 9.1.
2.	If add-on enabled, upgrade VMware Live Site Recovery to VCF Protection & Recovery Live Recovery 9.1.
3.	Deploy VCF 9.1 Installer with offline software depot.
4.	Upgrade VMware NSX to 9.1.
5.	Upgrade VMware vCenter Server 8.0 to vCenter 9.1.
6.	Activate VMware NSX and VMware vCenter 9.1 API.
7.	Upgrade VMware ESXi 8.0 to ESX 9.1.
8.	Execute VCF Installer 9.1 in VCF instance **brownfield claim** mode.
9.	Deploy VCF Operations, VCF Fleet Manager, VCF Software Depot, and VCF Runtime services to Cluster-1.
10.	Convert VCF 9.1 Installer to SDDC Manager.

## Frequently asked questions (FAQ)

### Why did the product names change?
This change is normal when a product evolves over time. The following table lists the name changes. The Azure VMware Solution public documentation will be updated when VCF 9.1 is generally available.

| VCF 4.x/5.x | VCF 9.x |
| --- | --- |
| VMware vCenter Server | VMware vCenter |
| VMware ESXi | VMware ESX |
| VMware Live Site Recovery | VCF Protection & Recovery Live Recovery |
| VMware Site Recovery Manager (SRM) | VCF Protection & Recovery Live Recovery |
| VMware HCX | VCF Operations HCX |
| VMware NSX-T Data Center | VMware NSX |
| VMware Aria Suite | VCF Operations Suite, VCF Automation |
| VMware vCloud Director (vCD) | VCF Automation |
| VMware Aria Automation | VCF Automation |
| VMware Aria Operations | VCF Operations |
| VMware Aria Operations for Logs | VCF Log Management |
| VMware Aria Operations for Networks | VCF Operations for Networks |
| VMware Aria Suite Lifecycle | VCF Fleet Manager |
| VMware Identity Manager (vIDM - retired) | VMware Identity Broker (vIDB - new product)|
| Pure Storage Cloud Block Store (CBS) | Everpure Cloud Azure Native for Azure VMware Solution |

### What version of VCF 9.1 does Azure VMware Solution use?
Microsoft plans to use VCF 9.1.2. This build includes the necessary VCF API calls to support Azure VMware Solution.

### What VCF 9 and VMware Application Networking & Security features can I use with Azure VMware Solution?
You can use VMware vDefend. You can't use the Application Networking and Security (ANS) Shared Services Platform (SSP).

### If Microsoft doesn't upgrade my Azure VMware Solution private cloud to VCF 9.1 by October 11, 2027, will I have a supported private cloud?
No, your private cloud won't be supported. Broadcom ends service for vSphere 8 and NSX 4 on October 11, 2027. This deadline is non-negotiable for all Azure VMware Solution private clouds.

### I have VCF 9.1 running on-premises and I want to connect to Azure VMware Solution. How can I do that?
While Azure VMware Solution runs vSphere 8 and NSX 4, you can soon upgrade your VMware HCX and VMware Live Site Recovery instances to 9.1.

### How can I use my on-premises VCF 9.1 Fleet Manager to claim my Azure VMware Solution private cloud?
This action isn't possible. Azure VMware Solution is a managed service, and you don't have access to the administrator or root credentials of the private cloud. The same condition applies to all Azure VMware Solution private clouds in a customer subscription.

### Can I deploy a VCF 9.1 Azure VMware Solution private cloud without VCF BYOL?
Yes, you can deploy the private cloud with the default 90-day evaluation mode. After 90 days, the private cloud enters **degraded** mode until you apply the VCF BYOL.

### How do I assign a VCF BYOL to my Azure VMware Solution private cloud?
Using the **vcfopsadmin** local user, register your VCF Operations instance with your Broadcom Business Console and assign the license file from your VCF License Subscription.

### How can I find out about the latest VCF 9.1 announcements for Azure VMware Solution?
For preview and GA announcements for Azure VMware Solution, see the following articles:

- [What's new in Azure VMware Solution](azure-vmware-solution-platform-updates.md)
- [Azure VMware Solution known issues](azure-vmware-solution-known-issues.md)

## Related content

To learn more about Azure VMware Solution, see:

- [Azure VMware Solution networking and interconnectivity concepts](architecture-networking.md)
- [Azure VMware Solution private cloud maintenance](azure-vmware-solution-private-cloud-maintenance.md)
- [Azure VMware Solution storage concepts](architecture-storage.md)
- [Enable an Azure VMware Solution resource](deploy-azure-vmware-solution.md#register-the-microsoftavs-resource-provider)
