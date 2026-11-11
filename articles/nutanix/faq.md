---
title: FAQ for NC2 on Azure
author: jjaygbay1
ms.author: jacobjaygbay
description: Questions frequently asked about NC2 on Azure
ms.topic: faq
ms.custom: engagement-fy23
ms.date: 05/5/2026
ms.service: nutanix-on-azure
# Customer intent: As a cloud solutions architect, I want to understand the support structure and integration capabilities of NC2 on Azure, so that I can effectively design and implement solutions that leverage both Nutanix software and Azure infrastructure.
---

# Frequently asked questions about NC2 on Azure

This article addresses questions most frequently asked about NC2 on Azure.

### How do I get started with NC2 on Azure?

Explore NC2 on Azure through a test drive or self-guided trial, create or sign in to your My Nutanix account, select a free trial or payment option, connect your Azure account, and deploy your NC2 environment. [Get started with Nutanix Cloud Clusters on Azure](https://learn.microsoft.com/azure/nutanix/get-started)

### What is the NC2 consumption model?

You pay Nutanix for the software and pay the hyperscaler for the cloud resources.

### Can I use existing Nutanix licenses for NC2 on Azure?

Yes. You can use existing eligible Nutanix licenses for NC2 on Azure.

### Does NC2 on Azure integrate with Azure services?

Yes, you can use existing Azure products and services with NC2.

### How does NC2 work with Microsoft Azure?

NC2 uses Azure bare-metal instances to run Nutanix software and lets you deploy and manage Nutanix clusters in Azure by using Azure networking and services.

### Which Azure regions support NC2 on Azure?

[Nutanix Cloud Clusters (NC2) on Azure region and SKU availability](https://learn.microsoft.com/azure/nutanix/available-regions-skus)

### Do I need Nutanix on-premises infrastructure to use NC2?

No. NC2 can run standalone; hybrid connection to on-premises infrastructure is optional and supported.

### What is hyperconverged infrastructure (HCI)?

Hyper-converged infrastructure (HCI) uses locally attached storage resources to combine common data center hardware with intelligent software to create flexible building blocks that replace legacy infrastructure consisting of separate servers, storage networks, and storage arrays. [Video explanation](https://www.youtube.com/watch?v=OPYA5-V0yRo)

### Is NC2 on Azure a Microsoft or non-Microsoft offering?

Both. On Azure Marketplace, Nutanix on Azure as Baremetal is a Microsoft offering; as Nutanix Software, it's a non-Microsoft offering, with a direct engagement by Microsoft for sales and support. This arrangement includes a codeveloped product and joint support model: Nutanix software is supported by Nutanix, and Azure infrastructure is supported by Microsoft. 

### How will I be billed?

Customers are billed on a pay-as-you-go basis. Additionally, customers are able to use their existing Microsoft Azure Consumption Contract (MACC).

### Who supports NC2 on Azure?

Microsoft delivers support for BareMetal infrastructure of NC2 on Azure.
You can submit a support request. For Cloud Solution Provider (CSP) managed subscriptions, the first level of support provides the Solution Provider in the same fashion as CSP does for other Azure services.

Nutanix delivers support for Nutanix software of NC2 on Azure.
Nutanix offers a support tier called Production Support for NC2.
For more information about Production Support tiers and SLAs, see Product Support Programs under Cloud Services Support.

### Can I use my existing VPN or ExpressRoute gateway for a disaster recovery scenario?

Yes. You can use your existing Azure VPN Gateway or ExpressRoute Gateway for disaster recovery (DR) connectivity with Nutanix Cloud Clusters (NC2) on Azure, provided the network configuration supports the required routing and connectivity.

### Does NC2 on Azure store customer data outside the Azure region that I choose?

No. By default, NC2 on Azure stores customer workload data within the Azure region deployment that you select during deployment. Customer virtual machines and their associated storage reside on the dedicated Azure infrastructure provisioned for NC2.

### How can I create a virtual machine (VM) on a node?

After a customer provisions a cluster, they can spin up a user VM through the Nutanix Prism Portal.
This operation should be exactly the same as on-premises in the Prism Portal.

### Can Microsoft help me with the migration?

Yes. For eligible engagements, you can leverage Microsoft migration programs and delivery resources, including Cloud Accelerate Factory (CAF), to support migration planning and execution. Check eligibility, scope, and engagement requirements with your Microsoft account team.

## Next steps

Learn more:

> [!div class="nextstepaction"]
> [Getting started](get-started.md)
