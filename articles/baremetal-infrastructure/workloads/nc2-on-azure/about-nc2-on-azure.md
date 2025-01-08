---
title: About Nutanix Cloud Clusters on Azure
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn about Nutanix Cloud Clusters on Azure and the benefits it offers.
ms.topic: overview
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 11/15/2024
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

## Benefits of NC2 on Azure
Running Nutanix Cloud Clusters (NC2) on Azure offers several key benefits including
- **Consistent tools** : Use your existing skills and tools with the Nutanix platform. Additionally, with the same Nutanix OS and Hypervisor there's no need for any application refactoring. Finally, this provides for an easy migration of VMs and workload and seamless operations in a hybrid environment.
- **Dynamic provisioning**: Azure infrastructure eliminates the need to procure or manage hardware, allowing for dynamic scaling of workloads both to the cloud from on-premises and within the cloud2.
- **Enables critical business scenarios** such as: Easy cloud migration from on-premises to NC2 on Azure, disaster recovery site in Azure, and dynamic provisioning for on-demand scaling of resources and workloads.
- **Part of the Azure ecosystem**: Extend and integrate into the broader Azure ecosystem.
- **Cost efficiency and savings**: Benefit from cost efficiencies including: Reuse existing licenses for NC2 and Microsoft software via Azure Hybrid Benefit, Register for reserved instances for hardware cost savings, and get free Extended Security Updates for Windows Server by being in Azure. 

## Pricing

### Nutanix Cloud Cluster software

You can bring your own on-premises capacity-based Nutanix licenses (CBLs). Alternatively, you can purchase licenses from Nutanix or from Azure Marketplace. 

For further pricing details see: [Nutanix Cloud Clusters Pricing](https://www.nutanix.com/products/nutanix-cloud-clusters/pricing)

### Nodes in Azure
A minimum of three nodes are required to deploy an NC2 on Azure cluster. For pricing, go to the [Nutanix Cloud Clusters on Azure pricing page](https://azure.microsoft.com/pricing/details/nutanix-on-azure/). 

More cost savings on the hardware can be realized with reserved instances: [Save costs with reservations for Nutanix Cloud Clusters on Azure BareMetal infrastructure](https://learn.microsoft.com/azure/cost-management-billing/reservations/nutanix-bare-metal)

## Other cost benefits

### Microsoft Azure Consumption Contract (MACC) credits 
NC2 on Azure infrastructure counts toward your organization's Microsoft Azure Consumption Commitment (MACC) agreement.

### Azure Hybrid Benefit for Windows and SQL Server
With Software Assurance or an active Linux subscription, you can also take advantage of Azure Hybrid Benefit for SQL Server, Windows Server, or Linux running in the NC2 on Azure environment. 

The primary benefit allows you to reuse you existing licensing investments to run in NC2 on Azure. There are other benefits, including allowing you to migrate over time while maintaining license compliance both on-premises and in Azure. 

Under the Azure Hybrid Benefit terms NC2 on Azure should be considered a Dedicated Host. For details on full benefits and considerations see the Azure Hybrid Benefit section under the Product terms
- [SQL Server Product Terms](https://www.microsoft.com/licensing/terms/productoffering/SQLServer/EAEAS)
- [Windows Server Product Terms](https://www.microsoft.com/licensing/terms/productoffering/WindowsServerStandardDatacenterEssentials/EAEAS) 
- [Azure Product Terms](https://www.microsoft.com/licensing/terms/productoffering/MicrosoftAzure/EAEAS)

For any additional questions on Azure Hybrid Benefit, contact your Microsoft Account Executive.

### No-cost Extended Security Updates (ESU) for Windows Server
Windows virtual machines (VMs) hosted in Azure, including NC2 on Azure, are eligible for Extended Security Updates (ESUs) free of charge. 

For further information on ESUs, including qualifying Windows product versions and timelines see: [Extended Security Updates for Windows Server overview](https://learn.microsoft.com/windows-server/get-started/extended-security-updates-overview).

The process to get the Extended Security Updates for Windows VMs in NC2 on Azure requires a manual request, approval, and delivery. 

#### To request ESU keys

1. Draft an email to send to your Microsoft Account team. The email should contain the following information:
   1. Your contact information in the body of the email
   1. Customer name and TPID
   1. Specific Deployment Scenario: Nutanix Cloud Clusters on Azure
   1. Number of Servers, nodes, or both where applicable requested to be covered by ESUs
   1. Point of Contact: Name and email address of a customer employee who can either install or manage the keys once provided. Manage in this context means ensuring that
      1. Keys aren't disclosed to anyone outside of the client company.
      2. Keys aren't publicly exposed.
1. The Microsoft response will include the ESU Keys and Terms of Use.

>> **Terms of Use**

>> By activating this key you agree that it will only be used for only NC2 on Azure. If you violate these terms, we may stop providing services to you or we may close your Microsoft account.

## Responsibility matrix

NC2 on Azure implements a shared responsibility model that defines distinct roles and responsibilities of the three parties involved in the offering: the Customer, Microsoft, and Nutanix.

On-premises Nutanix environments require the Nutanix customer to support all the hardware and software for running the platform. For NC2 on Azure, Microsoft maintains the hardware for the customer.

:::image type="content" source="media/nc2-on-azure-responsibility-matrix.png" alt-text="Diagram showing the support responsibilities for Microsoft and partners." border="false" lightbox="media/nc2-on-azure-responsibility-matrix.png":::

Microsoft manages the Azure BareMetal specialized compute hardware and its data and control plane platform for underlay network. Microsoft supports if the customers plan to bring their existing Azure Subscription, virtual network, vWAN, etc.

Nutanix covers the life-cycle management of Nutanix software (MCM, Prism Central/Element, etc.) and their licenses.

**Monitoring and remediation**

Microsoft continuously monitors the health of the underlay and BareMetal infrastructure. If Microsoft detects a failure, it takes action to repair the failed services.

## Support
Microsoft provides support for the BareMetal infrastructure of NC2 on Azure. You can submit a support request. For Cloud Solution Provider (CSP) managed subscriptions, the first level of support provides the Solution Provider in the same fashion as CSP does for other Azure services.

Nutanix delivers support for Nutanix software of NC2 on Azure. Nutanix offers a support tier called Production Support for NC2. For more information about Production Support tiers and SLAs, see Nutanix documentation at ([Product Support Programs)](https://www.nutanix.com/support-services/product-support/product-support-programs) under Cloud Services Support.

## Release notes

[Nutanix Cloud Clusters on Azure Release Notes](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-On-Azure-Release-Notes:Nutanix-Cloud-Clusters-On-Azure-Release-Notes)

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Architecture](architecture.md)
