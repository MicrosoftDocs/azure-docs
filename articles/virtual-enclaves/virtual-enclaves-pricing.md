---
title: Azure Virtual Enclaves Pricing
description: Description of Azure Virtual Enclaves pricing.
author: aserfass-msft
ms.author: aserfass
# ms.service: azure-virtual-enclave
ms.topic: concept-article
ms.date: 04/08/2025
---

# Azure Virtual Enclaves pricing
A description of Azure Virtual Enclaves pricing.

> [!IMPORTANT]
> The pricing shown in this article is intended to be used for example purposes only.
>
>   * Pricing can change at any point. For current pricing information, see the [Virtual Enclaves pricing](https://azure.microsoft.com/pricing/details/virtual-enclaves/) page.
>   * Pricing examples for Virtual WAN can be found in the [Virtual WAN pricing concepts](/azure/virtual-wan/pricing-concepts) page.
>

## General
Azure Virtual Enclaves offers customers the flexibility of an hourly pay-as-you-go rate. This service enables efficient organization, acceleration, and management of secure, isolated, and compliant cloud environments tailored for sensitive missions and workloads across both commercial and air-gapped settings. Consequently, clients can concentrate on their critical workloads.

Enclaves
| Type | Price |
|--|--|
| Number of Enclaves | $1.67 per hour |

Customers pay for:
1.	Each enclave on an hourly basis. An enclave deployed during an hour will be charged for that hour.
2.	The usage for any resources managed by Azure Virtual Enclaves to create the community or enclave boundaries and 
3.	Any workloads the customer deploys within their enclaves.

Managed resources for AVE includes:
  - Azure Firewall required for the community
  - Virtual WAN required for the community
  - Virtual Network required for the enclave
  - Azure DNS required for the enclave
  - LogA user selectable for community, enclave, or both.

Visit the Azure Virtual Enclaves [community](./what-community.md) and [enclave](./what-enclave.md) documentation for a complete list of managed resources and visit the [Virtual Enclaves pricing](https://azure.microsoft.com/pricing/details/virtual-enclaves/) page for current pricing.

The cost of the Enclave includes the community, community endpoints, enclave endpoints, enclave connections, and transit hub.