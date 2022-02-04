---
title: Custom IP address prefix (BYOIP) Preview
titleSuffix: Azure Virtual Network
description: Learn about what an Azure custom IP address prefix is and how it enables customer to utilize their own ranges in Azure.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 02/01/2021
ms.author: allensu

---

# Custom IP address prefix (BYOIP) Preview

A custom IP address prefix is a contiguous range of IP addresses owned by an external customer (not Microsoft) and provisioned into a subscription. The range is owned by the customer, though Microsoft is permitted to advertise it. Addresses from a custom IP address prefix can be utilized in a similar manner to Azure owned public IP address prefixes. Addresses from a custom IP address prefix can be associated to Azure resources, interact with internal/private IPs and virtual networks, and reach external destinations outbound from the Azure Wide Area Network.

> [!IMPORTANT]
> Custom IP address prefix (BYOIP) is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability

## Benefits

* Customers can retain their IP ranges (BYOIP) to maintain established reputation and continue to pass through externally controlled allowlists.

* Public IP address prefixes and Standard SKU Public IPs from Public IP Prefixes, can be derived from custom IP address prefixes, and utilized in the same way as Azure owned public IPs. 

## Constraints

* Only IPv4 prefixes are supported as a custom IP address prefix currently.

* Only zone-redundant IP prefixes are supported with a custom IP address prefix currently.

* The number of overall prefixes that can be provisioned is limited to 5 per region.

* There isn't an SLA for provisioning/advertisement of a range during the preview period.

* Currently, the advertisements of IPs from a custom IP prefix aren't supported with Azure ExpressRoute.

* Once provisioned, custom IP address prefix ranges can't be moved to another subscription. Custom IP address prefix ranges can't be moved within resource groups in a single subscription.

* Overlapping ranges in the same region currently aren't allowed.
    
    * Example: You attempt to provision a /23 in a region. You then deprovision the /23 and then provision a pair of child /24s.

## Pricing

* There is no charge to provision or utilize custom IP address prefixes. The no charge applies to all public IP prefixes and public IP addresses that are derived from custom IP address prefixes.

* All traffic destined to a custom prefix range is charged the [internet egress rate](https://azure.microsoft.com/pricing/details/bandwidth/). Customers sending traffic to a custom IP prefix address are charged internet egress for the source region of their traffic. Egress traffic from a custom IP address prefix range is charged the equivalent rate as an Azure Public IP from the same region.

## Next steps

- [Provision](create-custom-ip-address-prefix-powershell.md) a custom IP address prefix using PowerShell.

- [Provision](create-custom-ip-address-prefix-cli.md) a custom IP address prefix using CLI.

- [Manage](manage-custom-ip-address-prefix.md) a custom IP address prefix.
