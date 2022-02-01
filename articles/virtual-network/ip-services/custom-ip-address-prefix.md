---
title: Custom IP address prefix (BYOIP)
titlesuffix: Azure Virtual Network
description: Learn about what an Azure custom IP address prefix is and how it enables customer to utilize their own ranges in Azure.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 12/03/2021
ms.author: allensu

---

# Custom IP address prefix

A custom IP address prefix is a contiguous range of IP addresses owned by an external customer (not Microsoft) and on boarded to Azure.  The range would continue to be owned by the customer, though Microsoft would be permitted to advertise it.  Addresses from a custom IP address prefix can be utilized in a similar manner to Azure-owned public IP address prefixes.  That is, they can be associated to Azure resources, interact with internal/private IPs and virtual networks, and reach external destinations by egressing from the Azure Wide Area Network.

> [!IMPORTANT]
> BYOIP (custom IP address prefix) is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Benefits

- Customers now have the ability to retain their IP ranges (BYOIP) to maintain established reputation and continue to pass through externally controlled allow lists.
- Both Public IP address prefixes and Standard SKU Public IPs (from Public IP Prefixes) can be derived from custom IP address prefixes, and utilized in the same manner as Azure-owned public IPs. 

## Constraints

- Only IPv4 prefixes are supported for onboarding as a custom IP address prefix at this time.
- Only zone-redundant IP prefixes are supported with a custom IP address prefix at this time.
- The number of overall prefixes that can be brought to Azure is limited to 5 per region.
- There is no SLA for provisioning/advertisement of a range during the Preview period – estimate is approximately 4-6 weeks.
- The advertisement of IPs from a custom IP address prefix are not supported over Azure ExpressRoute at this time.
- Once on boarded, custom IP address prefix ranges cannot be moved to another subscription or within resource groups in a single subscription.
- Overlapping ranges in the same region (e.g. onboarding a /23 in a region, deprovisioning the /23, attempting to onboard a pair of child /24s) are not allowed at this time

## Pricing

- There is no charge to onboard or utilize custom IP address prefixes.  This also applies to all public IP Prefixes and public IP addresses that are derived from custom IP address prefixes.
- All traffic that is bound to a custom IP address prefix range will be charged the [Internet egress rate](https://azure.microsoft.com/pricing/details/bandwidth/).  In other words, Azure customers sending traffic to a custom IP Prefix address will be charged Internet egress for the source region of their traffic.  Note that egress traffic from a custom IP address prefix range will be charged the equivalent rate as an Azure public IP from the same region.

## Next steps

- [Onboard](create-custom-ip-address-prefix-powershell.md) a custom IP address prefix using PowerShell
- [Onboard](create-custom-ip-address-prefix-cli.md) a custom IP address prefix using CLI
- [Manage](manage-custom-ip-address-prefix.md) a custom IP address prefix