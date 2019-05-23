---
title: Integrate Microsoft Azure with Oracle Cloud Infrastructure | Microsoft Docs
description: Learn about solutions that integrate Oracle apps running on Microsoft Azure with databases in Oracle Cloud Infrastructure (OCI).
services: virtual-machines-linux
documentationcenter: ''
author: romitgirdhar
manager: jeconnoc
tags: 

ms.assetid: 
ms.service: virtual-machines
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 05/15/2019
ms.author: rogirdh
ms.custom: 
---
# (Preview) Oracle application solutions integrating Microsoft Azure and Oracle Cloud Infrastructure

Microsoft and Oracle have partnered to provide low latency, high throughput cross-cloud connectivity, allowing you to take advantage of the best of both clouds. 

Using this cross-cloud connectivity, you can host your application tier on Microsoft Azure and your database tier on Oracle Cloud Infrastructure (OCI). The experience is similar to running the entire solution stack in a single cloud.

> [!IMPORTANT]
> This feature is currently in preview, and some [limitations apply](#preview-limitations). Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

## Scenario overview

Cross-cloud connectivity provides a solution for you to run Oracle’s industry-leading applications on Azure virtual machines while enjoying the benefits of hosted database services in OCI. 

Applications you can run in a cross-cloud configuration include:

* E-Business Suite
* JD Edwards
* PeopleSoft
* Oracle Retail Applications
* Hyperion

The following diagram is a high-level overview of the connected solution. for more information, see the following sections.

![Azure OCI solution overview](media/oracle-oci-overview/crosscloud.png)

## Preview limitations

* Cross-cloud connectivity in preview is limited to the Azure East US (eastus) region and the OCI Ashburn (us-ashburn-1) region.

## Networking

Enterprise customers often choose to diversify and deploy workloads over multiple clouds. Reasons for diversification include disaster recovery, high availability, lower cost, avoiding single vendor lock-in, and choosing best of breed solutions. To diversify, customers interconnect cloud networks using the internet, IPSec VPN, or using the cloud provider’s direct connectivity solution via your on-premises network. Interconnecting cloud networks can require significant investments in time, money, design, procurement, installation, testing, and operations. 

Oracle and Microsoft recognized these customer challenges and created an integrated multi-cloud experience. Cross-cloud networking is established by connecting an [ExpressRoute](../../../expressroute/expressroute-introduction.md) circuit in Microsoft Azure with a [FastConnect](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/fastconnectoverview.htm) circuit in OCI. This connectivity is possible where an Azure ExpressRoute peering location is in proximity to or in the same peering location as the OCI FastConnect. This setup allows for secure, fast connectivity between the two clouds without the need for an intermediate service provider.

Using ExpressRoute and FastConnect, customers are able to peer a virtual network in Azure with a virtual cloud network in OCI, provided that the private IP address space does not overlap. Peering the two networks allows a resource in the virtual network to communicate to a resource in the OCI virtual cloud network as if they were both in the same network.

## Network security

Network security is a crucial component of any enterprise application, and this multi-cloud approach is no exception. Any traffic going over ExpressRoute and FastConnect passes over a private network. This configuration allows for secure communication between a virtual network and a virtual cloud network. You don't need to provide a public IP address to any virtual machines in Azure. Similarly, you don't need an internet gateway in OCI. All communication happens via the private IP address of the machines.

Additionally, you can set up [security lists](https://docs.cloud.oracle.com/iaas/Content/Network/Concepts/securitylists.htm) on your OCI virtual cloud network and  security rules (attached to Azure [network security groups](../../../virtual-network/security-overview.md)). Use these rules to control the traffic flowing between machines in the virtual networks. Network security rules can be added at a machine level, at a subnet level, as well as at the virtual network level.
 
## Identity

Identity is one of the core pillars of the partnership between Microsoft and Oracle. Significant work has been done to integrate [Oracle Identity Cloud Service](https://docs.oracle.com/en/cloud/paas/identity-cloud/index.html) (IDCS) with [Azure Active Directory](../../../active-directory/index.md) (AAD).
AAD is Microsoft’s cloud-based identity and access management service. It helps your employees and users sign in and access various resources. AAD also allows you to manage your users and their permissions.

Currently, this integration allows you to manage in one central location, which is Azure Active Directory. AAD synchronizes any changes in the directory with the corresponding Oracle directory.

## Next steps

See the quickstarts to set up an Oracle app in Azure and establish network connectivity and integrate identities with Oracle OCI.

For more information and whitepapers about OCI, see the [Oracle Cloud](https://docs.cloud.oracle.com/iaas/Content/home.htm) documentation .
