---
title: About Nutanix Cloud Clusters on Azure
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about Nutanix Cloud Clusters on Azure and the benefits it offers.
ms.topic: overview
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 8/15/2024
ms.service: azure-baremetal-infrastructure
---

# About Nutanix Cloud Clusters on Azure

In this article, we'll give an overview of the features BareMetal Infrastructure offers for Nutanix workloads.

Nutanix Cloud Clusters (NC2) on Microsoft Azure provides a hybrid cloud solution that operates as a single cloud, allowing you to manage applications and infrastructure in your private cloud and Azure. With NC2 running on Azure, you can seamlessly move your applications between on-premises and Azure using a single management console. With NC2 on Azure, you can use your existing Azure accounts and networking setup (VPN, VNets, and Subnets), eliminating the need to manage any complex network overlays. With this hybrid offering, you use the same Nutanix software and licenses across your on-premises cluster and Azure to optimize your IT investment efficiently.

You use the NC2 console to create a cluster, update the cluster capacity (the number of nodes), and delete a Nutanix cluster. After you create a Nutanix cluster in Azure using NC2, you can operate the cluster in the same manner as you operate your on-premises Nutanix cluster with minor changes in the Nutanix command-line interface (nCLI), Prism Element and Prism Central web consoles, and APIs.  

:::image type="content" source="media/nc2-on-azure.png" alt-text="Illustration of NC2 on Azure features." border="false" lightbox="media/nc2-on-azure.png":::

## Operating system and hypervisor

NC2 runs Nutanix Acropolis Operating System (AOS) and Nutanix Acropolis Hypervisor (AHV).

- AHV hypervisor is based upon open source Kernel-based Virtual Machine (KVM).
- AHV will determine the lowest processor generation in the cluster and constrain all Quick Emulator (QEMU) domains to that level.

This functionality allows mixing of processor generations within an AHV cluster and ensures the ability to live-migrate between hosts.

AOS abstracts kvm, virsh, qemu, libvirt, and iSCSI from the end-user and handles all backend configuration. Thus users can use Prism to manage everything they would want to manage, while not needing to be concerned with low-level management.

## SKUs

We offer two SKUs: AN36 and AN36P. The following table presents component options for each available SKU.

| Component |Ready Node for Nutanix AN36|Ready Node for Nutanix AN36P|
| :------------------- | -------------------: |:---------------:|
|Core|Intel 6140, 36 Core, 2.3 GHz|Intel 6240, 36 Core, 2.6 GHz|
|vCPUs|72|72|
|RAM|576 GB|768 GB|
|Storage|18.56 TB (8 x 1.92 TB SATA SSD, 2x1.6TB NVMe)|20.7 TB (2x750 GB Optane, 6x3.2-TB NVMe)|
|Network (available bandwidth between nodes)|25 Gbps|25 Gbps|

## Licensing

You can bring your own on-premises capacity-based Nutanix licenses (CBLs). 
Alternatively, you can purchase licenses from Nutanix or from Azure Marketplace.

## Supported protocols

The following protocols are used for different mount points within BareMetal servers for Nutanix workload.

- OS mount – internet small computer systems interface (iSCSI)
- Data/log – [Network File System version 3 (NFSv3)](/windows-server/storage/nfs/nfs-overview#nfs-version-3-continuous-availability)
- Backup/archive – [Network File System version 4 (NFSv4)](/windows-server/storage/nfs/nfs-overview#nfs-version-41)

## Unlock the benefits of Azure

* Establish a consistent hybrid deployment strategy
* Operate seamlessly with on-premises Nutanix Clusters in Azure
* Build and scale without constraints
* Invent for today and be prepared for tomorrow with NC2 on Azure
* Scale and flexibility that align with your needs 
   * Get scale, automation, and fast provisioning for your Nutanix workloads on global Azure infrastructure to invent with purpose.
* Optimize your investment
   * Keep using your existing Nutanix investments, skills, and tools to quickly increase business agility with Azure cloud services.
* Gain cloud cost efficiencies
   * Manage your cloud spending with license portability to significantly reduce the cost of running workloads in the cloud.
* Modernize through the power of Azure
   * Adapt quicker with unified data governance and gain immediate insights with transformative analytics to drive innovation.

### More benefits

* Microsoft Azure Consumption Contract (MACC) credits

## Azure Hybrid Benefits (AHUB) for NC2 on Azure

### Azure Commercial benefits

**Cost Savings:** Apply software investments to reduce costs in Azure.

**Flexibility:** Use software commitments to run on-premises or in Azure, and shift from one to the other over time.

**Unique to Azure:** Achieve savings unmatched by other cloud providers.

Available licensing offers are:

* Azure Hybrid Benefit for Windows Server
* Azure Hybrid Benefit for SQL Server
* Extended Security Updates (ESU)

### Azure Hybrid Benefit for Windows Server

- Convert or reuse Windows licensing with active software assurance in Azure for NC2 BareMetal hardware.
- Reuse Windows Server on up to 2 VMs and up to 16 cores in Azure.
- Run virtual machines on-premises **and** in Azure. Significantly reduce costs compared to running Windows Server in other public clouds.

### Azure Hybrid Benefit for SQL Server

Azure-only benefit for customers with active SA (or subscriptions) on SQL cores.

Advantages of the hybrid benefit over license mobility when adopting IaaS are:

- Use the SQL cores on-premises and in Azure simultaneously for up to 180 days, to allow for migration.
- Available for SQL Server core licenses only.
- No need to complete and submit license verification forms.
- The hybrid benefit for windows and SQL can be used together for IaaS (PaaS abstracts the OS).

### Extended Security Updates (ESU) – for Windows Server

NC2 on Azure requires manual escalation to request, approve, and deliver ESU keys to the client.

* ESUs for deployment to the supported platforms are intended to be free of charge (Azure and Azure connected). However unlike most VMs on Azure today, Microsoft can't provide automatic updates. Rather, clients must request keys and install the updates themselves. Supported platforms are:
  * Windows Server 2008 and Windows Server 2008 R2
  * Windows Server 2012 and Windows Server 2012 R2
* For regular on-premises customers, there's no manual escalation process; these customers must work with Volume Licensing Service Center (VLSC) and EA processes. To be eligible to purchase ESUs for on-premises deployment, customers must have Software Assurance.
* An ESU is generally valid for three years.

#### To request ESU keys

1. Draft an email to send to your Microsoft Account team. The email should contain the following information:
   1. Your contact information in the body of the email
   1. Customer name and TPID
   1. Specific Deployment Scenario: Nutanix Cloud Clusters on Azure
   1. Number of Servers, nodes, or both where applicable (for example, HUB) requested to be covered by ESUs
   1. Point of Contact: Name and email address of a customer employee who can either install or manage the keys once provided. Manage in this context means ensuring that
      1. Keys aren't disclosed to anyone outside of the client company.
      2. Keys aren't publicly exposed.
1. The MSFT response will include the ESU Keys and Terms of Use.

>> **Terms of Use**

>> By activating this key you agree that it will only be used for only NC2 on Azure. If you violate these terms, we may stop providing services to you or we may close your Microsoft account.

For any questions on Azure Hybrid Benefits, contact your Microsoft Account Executive.

## Responsibility matrix

NC2 on Azure implements a shared responsibility model that defines distinct roles and responsibilities of the three parties involved in the offering: the Customer, Microsoft and Nutanix.

On-premises Nutanix environments require the Nutanix customer to support all the hardware and software for running the platform. For NC2 on Azure, Microsoft maintains the hardware for the customer.

:::image type="content" source="media/nc2-on-azure-responsibility-matrix.png" alt-text="A diagram showing the support responsibilities for Microsoft and partners." border="false" lightbox="media/nc2-on-azure-responsibility-matrix.png":::

Microsoft manages the Azure BareMetal specialized compute hardware and its data and control plane platform for underlay network. Microsoft supports if the customers plan to bring their existing Azure Subscription, VNet, vWAN, etc.

Nutanix covers the life-cycle management of Nutanix software (MCM, Prism Central/Element, etc.) and their licenses.

**Monitoring and remediation**

Microsoft continuously monitors the health of the underlay and BareMetal infrastructure. If Microsoft detects a failure, it takes action to repair the failed services.

## Support

Nutanix (for software-related issues) and Microsoft (for infrastructure-related issues) will provide end-user support.

## Release notes

[Nutanix Cloud Clusters on Azure Release Notes](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-On-Azure-Release-Notes:Nutanix-Cloud-Clusters-On-Azure-Release-Notes)

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Architecture](architecture.md)
