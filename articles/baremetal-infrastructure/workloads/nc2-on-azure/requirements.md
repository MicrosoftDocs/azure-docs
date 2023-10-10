---
title: Requirements
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn what you need to run NC2 on Azure, including Azure, Nutanix, networking, and other requirements. 
ms.topic: how-to
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 04/01/2023
---

# Requirements

This article assumes prior knowledge of the Nutanix stack and Azure services to operate significant deployments on Azure.
The following sections identify the requirements to use Nutanix Clusters on Azure:

## Azure account requirements

* An Azure account with a new subscription  
* A Microsoft Entra ID

## My Nutanix account requirements

For more information, see "NC2 on Azure Subscription and Billing" in [Nutanix Cloud Clusters on Azure Deployment and User Guide]
(https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:Nutanix-Cloud-Clusters-Azure).

## Networking requirements

* Connectivity between your on-premises datacenter and Azure. Both ExpressRoute and VPN are supported. 
* After a cluster is created, you'll need Virtual IP addresses for both the on-premises cluster and the cluster running in Azure.
* Outbound internet access on your Azure portal.
* Azure Directory Service resolves the FQDN:  
gateway-external-api.cloud.nutanix.com.

## Other requirements

* Minimum of three (or more) Azure Nutanix Ready nodes per cluster 
* Only the Nutanix AHV hypervisor on Nutanix clusters running in Azure
* Prism Central instance deployed on NC2 on Azure to manage the Nutanix clusters in Azure

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Supported instances and regions](supported-instances-and-regions.md)
