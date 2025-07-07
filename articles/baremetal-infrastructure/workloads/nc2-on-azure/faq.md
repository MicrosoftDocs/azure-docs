---
title: FAQ
author: jjaygbay1
ms.author: jacobjaygbay
description: Questions frequently asked about NC2 on Azure
ms.topic: faq
ms.subservice: baremetal-nutanix
ms.custom: engagement-fy23
ms.date: 12/10/2024
ms.service: azure-baremetal-infrastructure
# Customer intent: As a cloud solutions architect, I want to understand the support structure and integration capabilities of NC2 on Azure, so that I can effectively design and implement solutions that leverage both Nutanix software and Azure infrastructure.
---

# Frequently asked questions about NC2 on Azure

This article addresses questions most frequently asked about NC2 on Azure.

## How does the 30-day free trial work?

To help you evaluate NC2 on Azure, Nutanix offers and manages a 30-day free trial. You can sign up for the trial with Nutanix. 

The following details are important considerations for Nutanix on Azure BareMetal nodes:

**Cost coverage**: The BareMetal cluster nodes have no cost through the trial. Other components like VMs for Flow Gateway networking and other Azure services are billed and not included in the trial.

**Trial duration**: The trial begins with the initial hardware node deployment and lasts for 30 consecutive days. It can't be paused, and the start date is fixed regardless of cluster activity. Even if the cluster is dropped, the trial time continues.

**One-time opportunity**: The trial is a one-time offer. If you deploy a cluster after the initial 30-day trial period, regardless of the timeframe, the trial doesn't reset, and you'll be billed. Creating a cluster in a different subscription does not reset your trial timing.

**Track the trial period**: There's no visible trial information for the BareMetal. You should track your BareMetal deployment date manually.

For more information, see _*[Starting a Free Trial for NC2 ](https://portal.nutanix.com/page/documents/details?targetId=Nutanix-Cloud-Clusters-Azure:nc2-clusters-starting-a-nc2-free-trial-t.html"https://portal.nutanix.com/page/documents/details?targetid=nutanix-cloud-clusters-azure:nc2-clusters-starting-a-nc2-free-trial-t.html")*_

## What is Hyperconverged Infrastructure (HCI)?

Hyper-converged infrastructure (HCI) uses locally attached storage resources to combine common data center hardware with intelligent software to create flexible building blocks that replace legacy infrastructure consisting of separate servers, storage networks, and storage arrays. [Video explanation](https://www.youtube.com/watch?v=OPYA5-V0yRo)

## Is NC2 on Azure a Microsoft or non-Microsoft offering?

Both. On Azure Marketplace, Nutanix on Azure as Baremetal is a Microsoft offering; as Nutanix Software, it's a non-Microsoft offering, with a direct engagement by Microsoft for sales and support. This arrangement includes a codeveloped product and joint support model: Nutanix software is supported by Nutanix, and Azure infrastructure is supported by Microsoft. 

## How will I be billed?

Customers are billed on a pay-as-you-go basis. Additionally, customers are able to use their existing Microsoft Azure Consumption Contract (MACC).

## Who supports NC2 on Azure?

Microsoft delivers support for BareMetal infrastructure of NC2 on Azure.
You can submit a support request. For Cloud Solution Provider (CSP) managed subscriptions, the first level of support provides the Solution Provider in the same fashion as CSP does for other Azure services.

Nutanix delivers support for Nutanix software of NC2 on Azure.
Nutanix offers a support tier called Production Support for NC2.
For more information about Production Support tiers and SLAs, see Product Support Programs under Cloud Services Support.

## Does this solution integrate with the rest of the Azure cloud?

Yes. You can use the products and services in Azure that you already have.

## Can I use my existing VPN or ExpressRoute gateway for a disaster recovery scenario?

Yes.

## Does NC2 on Azure store customer data outside the Azure region that a customer has chosen?

No.

## How can I create a virtual machine (VM) on a node?

After a customer provisions a cluster, they can spin up a user VM through the Nutanix Prism Portal.
This operation should be exactly the same as on-premises in the Prism Portal.

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Getting started](get-started.md)
