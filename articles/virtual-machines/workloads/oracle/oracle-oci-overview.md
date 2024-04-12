---
title: Oracle application solutions integrating Microsoft Azure and Oracle Cloud Infrastructure
description: Learn about solutions that integrate Oracle apps running on Microsoft Azure with databases in Oracle Cloud Infrastructure (OCI).
author: jjaygbay1
ms.service: virtual-machines
ms.subservice: oracle
ms.collection: linux
ms.topic: article
ms.date: 04/11/2023
ms.author: jacobjaygbay
 
---
# Oracle application solutions integrating Microsoft Azure and Oracle Cloud Infrastructure 

**Applies to:** :heavy_check_mark: Linux VMs

Microsoft and Oracle have partnered to provide low latency, high throughput cross-cloud connectivity, allowing you to take advantage of the best of both clouds.

Using this cross-cloud connectivity, you can partition a multi-tier application to run your database tier on Oracle Cloud Infrastructure (OCI), and the application and other tiers on Microsoft Azure. The experience is similar to running the entire solution stack in a single cloud.

If you're interested in running your middleware, including WebLogic Server, on Azure infrastructure, but have the Oracle database running within OCI, see [WebLogic Server Azure Applications](oracle-weblogic.md).

If you're interested in deploying Oracle solutions entirely on Azure infrastructure, see [Oracle VM images and their deployment on Microsoft Azure](oracle-vm-solutions.md).

## Scenario overview

*Cross-cloud connectivity* provides a solution for you to run Oracle's industry-leading applications and your own custom applications on Azure virtual machines while enjoying the benefits of hosted database services in OCI.

The following applications are certified in a cross-cloud configuration:

- E-Business Suite
- JD Edwards EnterpriseOne
- PeopleSoft
- Oracle Retail applications
- Oracle Hyperion Financial Management

The following diagram is a high-level overview of the connected solution. For simplicity, the diagram shows only an application tier and a data tier. Depending on the application architecture, your solution could include other tiers such as a WebLogic Server cluster or web tier in Azure.

:::image type="content" source="media/oracle-oci-overview/crosscloud.png" alt-text="Diagram shows a connected solution with Azure and Oracle clouds.":::

## Region availability

Cross-cloud connectivity is limited to the following regions:

- Azure Brazil South & OCI Vinhedo (Brazil Southeast)
- Azure Canada Central & OCI Toronto (Canada Southeast)
- Azure East US & OCI Ashburn, VA (US East)
- Azure Germany West Central & OCI Germany Central (Frankfurt)
- Azure Japan East & OCI Tokyo (Japan East)
- Azure Korea Central region & OCI South Korea Central (Seoul)
- Azure South Africa North & South Africa Central (Johannesburg)
- Azure Southeast Asia region & OCI Singapore (Singapore)
- Azure UK South & OCI London (UK South)
- Azure West Europe & OCI Amsterdam (Netherlands Northwest)
- Azure West US & OCI San Jose (US West)
- Azure West US 3 & OCI US West (Phoenix)

## Networking

Enterprise customers often choose to diversify and deploy workloads over multiple clouds for various business and operational reasons. To diversify, you can interconnect cloud networks using the internet, IPSec VPN, or using the cloud provider's direct connectivity solution with your on-premises network. Interconnecting cloud networks can require significant investments in time, money, design, procurement, installation, testing, and operations.

To address these challenges, Oracle and Microsoft have enabled an integrated multicloud experience. Establish *cross-cloud networking* by connecting an [ExpressRoute](../../../expressroute/expressroute-introduction.md) circuit in Microsoft Azure with a [FastConnect](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/fastconnectoverview.htm) circuit in OCI. This connectivity is possible where an Azure ExpressRoute peering location is in proximity to or in the same peering location as the OCI FastConnect. This setup allows for secure, fast connectivity between the two clouds without the need for an intermediate service provider.

Using ExpressRoute and FastConnect, you can peer a virtual network in Azure with a virtual cloud network in OCI, if the private IP address space doesn't overlap. Peering the two networks allows a resource in the virtual network to communicate to a resource in the OCI virtual cloud network as if they're both in the same network.

## Network security

Network security is a crucial component of any enterprise application, and is central to this multicloud solution. Any traffic going over ExpressRoute and FastConnect passes over a private network. This configuration allows for secure communication between an Azure virtual network and an Oracle virtual cloud network. You don't need to provide a public IP address to any virtual machines in Azure. Similarly, you don't need an internet gateway in OCI. All communication happens by using the private IP address of the machines.

Additionally, you can set up [security lists](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/securitylists.htm) on your OCI virtual cloud network and security rules, attached to Azure [network security groups](../../../virtual-network/network-security-groups-overview.md). Use these rules to control the traffic flowing between machines in the virtual networks. You can add network security rules at a machine level, at a subnet level, and at the virtual network level.

The [WebLogic Server Azure Applications](oracle-weblogic.md) each create a network security group preconfigured to work with WebLogic Server's port configurations.

## Identity

Identity is one of the core pillars of the partnership between Microsoft and Oracle. Significant work has been done to integrate [Oracle Identity Cloud Service](https://docs.oracle.com/en/cloud/paas/identity-cloud/index.html) (IDCS) with [Microsoft Entra ID](../../../active-directory/index.yml) (Microsoft Entra ID). Microsoft Entra ID is Microsoft's cloud-based identity and access management service. Your users can sign in and access various resources with help from Microsoft Entra ID. Microsoft Entra ID also allows you to manage your users and their permissions.

Currently, this integration allows you to manage in one central location. Microsoft Entra ID synchronizes any changes in the directory with the corresponding Oracle directory and is used for single sign-on to cross-cloud Oracle solutions.

## Next steps

- Get started with a [cross-cloud network](configure-azure-oci-networking.md) between Azure and OCI.
- For more information and whitepapers about OCI, see [Oracle Cloud Infrastructure](https://docs.cloud.oracle.com/iaas/Content/home.htm).
