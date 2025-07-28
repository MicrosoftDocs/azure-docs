---
title: Getting started
author: jjaygbay1
ms.author: jacobjaygbay
description: Learn how to sign up, set up, and use Nutanix Cloud Clusters on Azure.
ms.topic: get-started
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 8/15/2024
ms.service: azure-baremetal-infrastructure
# Customer intent: As an IT administrator, I want to sign up for and configure Nutanix Cloud Clusters on Azure, so that I can efficiently manage my cloud infrastructure while ensuring connectivity and compliance with my organization’s requirements.
---

# Get started with Nutanix Cloud Clusters on Azure

Learn how to sign up for, set up, and use Nutanix Cloud Clusters (NC2) on Azure. You can also sign up for a free trial of NC2 on Azure.

## Azure account requirements

* An Azure account with a new subscription  
* A Microsoft Entra directory

## My Nutanix account requirements

For more information, see "NC2 on Azure Subscription and Billing" in [Nutanix Cloud Clusters on Azure Deployment and User Guide]
(https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:Nutanix-Cloud-Clusters-Azure).

## Start with a free trial of NC2 on Azure

To help you evaluate NC2 on Azure, Nutanix offers and manages a 30-day free trial. You can sign up for the trial with Nutanix. 

Consider these important items for Nutanix on Azure BareMetal nodes:

**Cost coverage**: The BareMetal cluster nodes have no cost through the trial. Other components like VMs for Flow Gateway networking and other Azure services are billed and not included in the trial.

**Trial duration**: The trial begins with the initial hardware node deployment and lasts for 30 consecutive days. It can't be paused, and the start date is fixed regardless of cluster activity. Even if the cluster is dropped, the trial time continues.

**One-time opportunity**: The trial is a one-time offer. If you deploy a cluster after the initial 30-day trial period, regardless of the timeframe, the trial doesn't reset, and you'll be billed. Creating a cluster in a different subscription does not reset your trial timing.

**Track the trial period**: There's no visible trial information for the BareMetal. You should track your BareMetal deployment date manually.

For more information, see _*[Starting a Free Trial for NC2 ](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:nc2-clusters-starting-a-nc2-free-trial-t.html"https://portal.nutanix.com/page/documents/details?targetid=nutanix-cloud-clusters-azure:nc2-clusters-starting-a-nc2-free-trial-t.html")*

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

To sign up, go to [Nutanix Cloud Clusters on Azure Deployment and User Guide(https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:Nutanix-Cloud-Clusters-Azure).

To learn about Microsoft BareMetal hardware pricing, and to purchase Nutanix software, go to [Azure Marketplace](https://azuremarketplace.microsoft.com/marketplace/apps/nutanixinc.nc2_azure?tab=Overview).

## Set up NC2 on Azure

To set up and use NC2 on Azure, go to [Nutanix Cloud Clusters
on Azure Deployment and User Guide](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:Nutanix-Cloud-Clusters-Azure).

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [FAQ](faq.md)
