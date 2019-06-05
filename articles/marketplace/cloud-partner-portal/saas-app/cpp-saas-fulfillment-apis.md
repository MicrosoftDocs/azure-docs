---
title: SaaS Fulfillment APIs | Azure Marketplace 
description: Introduces the versions of the fulfillment APIs that enable you to integrate your SaaS offers with the Azure Marketplace.
services: Azure, Marketplace, Cloud Partner Portal, 
author: v-miclar
ms.service: marketplace
ms.topic: conceptual
ms.date: 03/26/2019
ms.author: pabutler
---

# SaaS Fulfillment APIs

> [!IMPORTANT] 
> SaaS offer functionality has been migrated to the [Microsoft Partner Center](https://partner.microsoft.com/dashboard/directory).  All new publishers must 
> use Partner Center for creating new SaaS offers and managing existing offers.  Current publishers with SaaS offers are being batchwise migrated from the 
> Cloud Partner Portal to the Partner Center.  The Cloud Partner Portal will display status messages to indicate when specific existing offers have been migrated.
> For more information, see [Create a new SaaS offer](../../partner-center-portal/create-new-saas-offer.md).

The SaaS Fulfillment APIs enable independent software vendors (ISVs) to integrate their SaaS applications with the Azure Marketplace. These APIs enable ISV applications to participate in all commerce enabled channels: direct, partner-led (reseller) and field-led.  They are a requirement for listing transactable SaaS offers on the Azure Marketplace.

> [!WARNING]
> The current version of this API is Version 2, which should be used for all new SaaS offers.  Version 1 of the API is deprecated and is being maintained to support existing offers.


## Business model support

This API supports the following business model capabilities; you can:

* Specify multiple plans for an offer. These plans have different functionality and may be priced differently.
* Provide an offer on a per site or a per user billing model basis.
* Provide monthly and annual (paid upfront) billing options.
* Provide private pricing to a customer based on a negotiated business agreement.


## Next steps

If you have not already done so, register your SaaS application in the [Azure portal](https://ms.portal.azure.com) as explained in [Register an Azure AD Application](./cpp-saas-registration.md).  Afterwards, use the most current version of this interface for development: [SaaS Fulfillment API Version 2](./cpp-saas-fulfillment-api-v2.md).
