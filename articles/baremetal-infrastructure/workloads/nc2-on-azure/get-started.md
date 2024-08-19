---
title: Getting started
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn how to sign up, set up, and use Nutanix Cloud Clusters on Azure.
ms.topic: conceptual
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 8/15/2024
ms.service: azure-baremetal-infrastructure
---

# Getting started with Nutanix Cloud Clusters on Azure

Learn how to sign up for, set up, and use Nutanix Cloud Clusters (NC2) on Azure.

## Azure account requirements

* An Azure account with a new subscription  
* A Microsoft Entra directory

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

## Sign up for NC2

Go to [Nutanix Cloud Clusters on Azure Deployment and User Guide](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:Nutanix-Cloud-Clusters-Azure) to sign up.

To learn about Microsoft BareMetal hardware pricing, and to purchase Nutanix software, go to [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/nutanixinc.nc2_azure?tab=Overview).

## Set up NC2 on Azure

To set up and use NC2 on Azure, go to [Nutanix Cloud Clusters
on Azure Deployment and User Guide](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:Nutanix-Cloud-Clusters-Azure).

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [FAQ](faq.md)
