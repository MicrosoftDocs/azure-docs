---
title: Custom IP address prefix (BYOIP)
titleSuffix: Azure Virtual Network
description: Learn about what an Azure custom IP address prefix is and how it enables customers to utilize their own ranges in Azure.
services: virtual-network
author: asudbring
ms.service: virtual-network
ms.subservice: ip-services
ms.topic: conceptual
ms.date: 03/31/2022
ms.author: allensu
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

A public IP address range that's brought to Azure must be owned by you and registered with a Routing Internet Registry such as [ARIN](https://www.arin.net/) or [RIPE](https://www.ripe.net/).  When you bring an IP range to Azure, it remains under your ownership. You must authorize Microsoft to advertise the range. Your ownership of the range and its association with your Azure subscription are also verified. Some of these steps will be done outside of Azure.

### Provision

After the previous steps are completed, the public IP range can complete the **Provisioning** phase. The range will be created as a custom IP prefix resource in your subscription. Public IP prefixes and public IPs can be derived from your range and associated to any Azure resource that supports Standard SKU Public IPs (IPs derived from a custom IP prefix can also be safeguarded with [DDoS Protection Standard](../../ddos-protection/ddos-protection-overview.md). The IPs won't be advertised at this point and not reachable.

### Commission

When ready, you can issue the command to have your range advertised from Azure and enter the **Commissioning** phase. The range will be advertised first from the Azure region where the custom IP prefix is located, and then by Microsoft's Wide Area Network (WAN) to the Internet. The specific region where the range was provisioned will be posted publicly on [Microsoft's IP Range GeoLocation page](https://www.microsoft.com/download/details.aspx?id=53601).

## Limitations

* A custom IP prefix must be associated with a single Azure region.

* An IPv4 range can be equal or between /21 to /24.  An IPv6 range can be equal or between /46 to /48.

* Custom IP prefixes do not currently support derivation of IPs with Internet Routing Preference or that use Global Tier (for cross-region load-balancing).

* In regions with [availability zones](../../availability-zones/az-overview.md), a custom IPv4 prefix (or a regional custom IPv6 prefix) must be specified as either zone-redundant or assigned to a specific zone. It can't be created with no zone specified in these regions. All IPs from the prefix must have the same zonal properties.

* The advertisements of IPs from a custom IP prefix over Azure ExpressRoute aren't currently supported.

* Once provisioned, custom IP prefix ranges can't be moved to another subscription. Custom IP address prefix ranges can't be moved within resource groups in a single subscription. It is possible to derive a public IP prefix from a custom IP prefix in another subscription with the proper permissions as described [here](create-custom-ip-address-prefix-powershell.md).

* IPs brought to Azure may have a delay up to 2 weeks before they can be used for Windows Server Activation.

## Pricing

* There is no charge to provision or use custom IP prefixes. There is no charge for any public IP prefixes and public IP addresses that are derived from custom IP prefixes.

* All traffic destined to a custom IP prefix range is charged the [internet egress rate](https://azure.microsoft.com/pricing/details/bandwidth/). Customers traffic to a custom IP prefix address from within Azure are charged internet egress for the source region of their traffic. Egress traffic from a custom IP address prefix range is charged the equivalent rate as an Azure public IP from the same region.

## Next steps

- To create a custom IP address prefix using the Azure portal, see [Create custom IP address prefix using the Azure portal](create-custom-ip-address-prefix-portal.md).

- To create a custom IP address prefix using PowerShell, see [Create a custom IP address prefix using Azure PowerShell](create-custom-ip-address-prefix-powershell.md).

- For more information about the management of a custom IP address prefix, see [Manage a custom IP address prefix](create-custom-ip-address-prefix-powershell.md).
