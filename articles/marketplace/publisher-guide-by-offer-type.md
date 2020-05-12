---
title: Publishing guide by offer type - Microsoft commercial marketplace
description: This article describes the offer types that are available in the Microsoft commercial marketplace.
author: dsindona
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 04/14/2020
ms.author: dsindona
---

# Publishing guide by offer type

This article describes the offer types that are available in the commercial marketplace. The *offer type* defines the offer structure, which includes the metadata, artifacts, and other content used to present the offer in the marketplace.

Before you can create an offer, and after you [decide on a publishing option](https://docs.microsoft.com/azure/marketplace/determine-your-listing-type), you must choose an offer type that will be used to present your offer. The offer type will correspond to the type of solution, app, or service offer that you wish to publish, as well as its alignment to Microsoft products and services.

A single offer type can be configured in different ways to enable different publishing options, calls-to-action, provisioning, or pricing. The publishing option and configuration of the offer type also align to the offer eligibility and technical requirements.

Be sure to review the storefront and offer type eligibility requirements and the technical publishing requirements before creating your offer.

## List of offer types

Azure Marketplace offer types are listed in the table below.

| **Offer type**    | **Description**  |
| :------------------- | :-------------------|
| [**Virtual machines**](./marketplace-virtual-machines.md) | Use the virtual machine offer type when you deploy a virtual appliance to the subscription associated with your customer. |
| [**Solution templates**](./marketplace-solution-templates.md) | Use the solution template (also known as Azure application) offer type when your solution requires additional deployment and configuration automation beyond a single VM. Solution templates can employ many different kinds of Azure resources, including but not limited to VMs.  |
| [**Managed applications**](./marketplace-managed-apps.md) | Use the Azure app: managed app offer type when the following conditions are required: <br> <ul> <li> You deploy either a subscription-based solution for your customer using either a VM or an entire IaaS-based solution. </li> <li>You or your customer require that the solution is managed by a partner. </li> <ul> |
| [**SaaS applications**](./partner-center-portal/create-new-saas-offer.md) | Use the SaaS app offer type to enable your customer to buy your SaaS-based, technical solution as a subscription. |
| [**Container offers**](./marketplace-containers.md) | Use the Container offer type when your solution is a Docker container image provisioned as a Kubernetes-based Azure container service. |
| [**Azure IoT Edge modules**](./iot-edge-module.md) | Azure IoT Edge modules are the smallest computation units managed by IoT Edge, and can contain Microsoft services (such as Azure Stream Analytics), 3rd-party services, or your own solution-specific code. |
| [**Consulting services**](./consulting-services.md) | Consulting services help to connect customers with services to support and extend their use of Azure, Dynamics 365, or Power Suite services.|
| [**Office 365, Dynamics 365, and Power BI**](./appsource-offer-publishing-guide.md) | You can publish AppSource offers that build on or extend Dynamics 365, Office 365, Power BI, and Power Apps.|
| [**Integrated solutions**](./integrated-solutions-for-publishers.md) | You can publish integrated, industry-aligned solutions that combine technology and services as a single offer.|

For information on single sign-on requirements by listing options and offer types, see [**Azure AD requirements**](./enable-appsource-marketplace-using-azure-ad.md).

## Next steps

- Review the eligibility requirements in the corresponding article for your offer type (following sections) to finalize the selection and configuration of your offer.
- Review the publishing patterns by storefront for examples on how your solution maps to an offer type and configuration.
