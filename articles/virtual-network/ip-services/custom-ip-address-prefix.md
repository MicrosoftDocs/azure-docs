---
title: Custom IP address prefix (BYOIP)
titleSuffix: Azure Virtual Network
description: Learn about what an Azure custom IP address prefix is and how it enables customers to utilize their own ranges in Azure.
services: virtual-network
author: mbender-ms
ms.author: mbender
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 08/24/2023
---

# Custom IP address prefix (BYOIP)

A custom IP address prefix is a contiguous range of IP addresses owned by an external customer and provisioned into a subscription. Microsoft is permitted to advertise the range. Addresses from a custom IP address prefix can be used in the same way as Azure owned public IP address prefixes. Addresses from a custom IP address prefix can be associated to Azure resources, interact with internal/private IPs and virtual networks, and reach external destinations outbound from the Azure Wide Area Network.

## Benefits

* Customers can retain their IP ranges (BYOIP) to maintain established reputation and continue to pass through externally controlled allowlists.

* Public IP address prefixes and standard SKU public IPs can be derived from custom IP address prefixes. These IPs can be used in the same way as Azure owned public IPs.

## Bring an IP prefix to Azure

It's a three phase process to bring an IP prefix to Azure:

* Validation

* Provision

* Commission

:::image type="content" source="./media/custom-ip-address-prefix/byoip-onboarding-process.png" alt-text="Illustration of the custom IP prefix onboarding process.":::

### Validation

You must own and register a public IP address range that you bring to Azure with a Routing Internet Registry such as [ARIN](https://www.arin.net/) or [RIPE](https://www.ripe.net/). When you bring an IP range to Azure, it remains under your ownership. You must authorize Microsoft to advertise the range. Your ownership of the range and its association with your Azure subscription are also verified. Some of these steps are done outside of Azure.

### Provision

After the previous steps are completed, the public IP range can complete the **Provisioning** phase. The range is created as a custom IP prefix resource in your subscription. Public IP prefixes and public IPs can be derived from your range and associated to any Azure resource that supports Standard SKU Public IPs (IPs derived from a custom IP prefix can also be safeguarded with [DDoS Protection](../../ddos-protection/ddos-protection-overview.md). The IPs aren't advertised at this point and aren't reachable.

### Commission

When ready, you can issue the command to have your range advertised from Azure and enter the **Commissioning** phase. The range is advertised first from the Azure region where the custom IP prefix is located, and then by Microsoft's Wide Area Network (WAN) to the Internet. The specific region where the range was provisioned is posted publicly on [Microsoft's IP Range GeoLocation page](https://www.microsoft.com/download/details.aspx?id=53601).

## Limitations

* A custom IPv4 prefix must be associated with a single Azure region.

* You can bring a maximum of five prefixes per region to Azure.

* A custom IPv4 Prefix must be between /21 and /24; a global (parent) custom IPv6 prefix must be /48.

* Custom IP prefixes don't currently support derivation of IPs with Internet Routing Preference or that use Global Tier (for cross-region load-balancing).

* In regions with [availability zones](../../availability-zones/az-overview.md), a custom IPv4 prefix (or a regional custom prefix) must be specified as either zone-redundant or assigned to a specific zone. It can't be created with no zone specified in these regions. All IPs from the prefix must have the same zonal properties.

* The advertisements of IPs from a custom IP prefix over an Azure ExpressRoute Microsoft peering isn't currently supported.

* Custom IP prefixes don't support Reverse DNS lookup using Azure-owned zones; customers must onboard their own Reverse Zones to Azure DNS

* Once provisioned, custom IP prefix ranges can't be moved to another subscription. Custom IP address prefix ranges can't be moved within resource groups in a single subscription. It's possible to derive a public IP prefix from a custom IP prefix in another subscription with the proper permissions as described [here](manage-custom-ip-address-prefix.md#permissions).

* IPs brought to Azure may have a delay of up to a week before they can be used for Windows Server Activation.

> [!IMPORTANT]
> There are several differences between how custom IPv4 and IPv6 prefixes are onboarded and utilized. For more information, see [Differences between using BYOIPv4 and BYOIPv6](create-custom-ip-address-prefix-ipv6-powershell.md#differences-between-using-byoipv4-and-byoipv6).

## Pricing

* There's no charge to provision or use custom IP prefixes. There's no charge for any public IP prefixes and public IP addresses that are derived from custom IP prefixes.

* All traffic destined to a custom IP prefix range is charged the [internet egress rate](https://azure.microsoft.com/pricing/details/bandwidth/). Customers traffic to a custom IP prefix address from within Azure are charged internet egress for the source region of their traffic. The system charges egress traffic from a custom IP address prefix range at the same rate as an Azure public IP from the same region.

## Next steps

- To create a custom IPv4 address prefix using the Azure portal, see [Create custom IPv4 address prefix using the Azure portal](create-custom-ip-address-prefix-portal.md).

- To create a custom IPv4 address prefix using PowerShell, see [Create a custom IPv4 address prefix using Azure PowerShell](create-custom-ip-address-prefix-powershell.md).

- For more information about the management of a custom IP address prefix, see [Manage a custom IP address prefix](create-custom-ip-address-prefix-powershell.md).
