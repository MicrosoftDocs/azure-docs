---
title: Azure data transfer fees
description: Describes how fees are applied to a data transfer
author: nicholak-ms
ms.reviewer: jlucey
ms.service: cost-management-billing
ms.subservice: billing
ms.topic: conceptual
ms.date: 08/25/2025
ms.author: jlucey
---

# What data transfer fees are applied when data is transferred between Azure and an external endpoint?

Azure now offers at-cost transfer of data for customers and CSP partners in Europe transferring data via the internet between Azure to another data processing service provider. This applies to scenarios where multiple services of different providers are used in parallel, in an interoperable manner. Use the following steps to submit a request if you're transferring data in this manner.

## Create a support request

1.	To signal your intent to transfer data between Azure and another cloud provider, and allow us to accommodate your request, create an [Azure Support request](https://portal.azure.com/#view/Microsoft_Azure_Support/HelpAndSupportBlade/%7E/overview) and provide:
    *	The customer’s Subscription ID
    *	The autonomous system number (ASN) information for the endpoint outside of Azure.
    *	An estimate of the percentage (between 1% and 100%) of data that is transferred between Azure and the external endpoint.
2.	This information will be needed for each endpoint outside of Azure.
3.	Once the request is logged with Azure Support, we'll validate the information before processing a refund to the next bill. This refund will be enabled for future billing cycles, automatically.

## Qualifications
* This only applies to organizations with a billing address in the European Economic Area (EEA), European Free Trade Association (EFTA), or the United Kingdom and excludes instances where customers have chosen to store Customer Data outside of these areas.
* The at-cost data transfer only applies to Internet egress (routed via [Routing preference transit ISP network](/azure/virtual-network/ip-services/routing-preference-overview)) if the service is supported on the ISP path. The at-cost data transfer doesn't apply to services with a routing preference using the Microsoft Premium Global Network (MGN), unless that service isn't supported on the ISP network.
* Data processing should be at the destination, and must be the same organization. Scenarios such as CDN delivery aren't within scope. For example, the data transfer must not occur between endpoints belonging to different customers. 
* Azure reviews your request for adherence to the requirements. If we determine the customer request doesn't follow the documented process, we might not issue the credit request.
* Azure might make changes regarding the egress credit policy in the future.
* If a customer purchases Azure services through a partner, as is standard practice, the partner is responsible for making the request on the customer's behalf, and credit issuance to the customer once received.
