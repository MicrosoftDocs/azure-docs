---
title: Custom IP address prefix (BYOIP)
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

# Custom IP address prefix (BYOIP)

A custom IP address prefix is a contiguous range of IP addresses owned by an external customer (not Microsoft) and provisioned into a subscription. The range is owned by the customer, though Microsoft is permitted to advertise it. Addresses from a custom IP address prefix can be utilized in a similar manner to Azure owned public IP address prefixes. Addresses from a custom IP address prefix can be associated to Azure resources, interact with internal/private IPs and virtual networks, and reach external destinations outbound from the Azure Wide Area Network.

## Benefits

* Customers can retain their IP ranges (BYOIP) to maintain established reputation and continue to pass through externally controlled allowlists.

* Public IP address prefixes (and Standard SKU public IPs from these public IP prefixes) can be derived from custom IP address prefixes, and utilized in the same way as Azure owned public IPs. 

## Bringing an IP prefix to Azure

Bringing an IP prefix to Azure is a three phase process -- validation, provisioning, and commissioning.

:::image type="content" source="./media/custom-ip-address-prefix/byoip-onboarding-process.png" alt-text="Illustration of the Custom I P Prefix onboarding process." border="false":::

### Validation

In order to bring a public IP range to use on Azure, it must be owned by you and registered with a Routing Internet Registry such as [ARIN](https://www.arin.net/) or [RIPE](https://www.ripe.net/).  When bringing an IP range to use on Azure, it remains under your ownership, so you must authorize Microsoft to advertise it.  Your ownership of the range and associated with your Azure subscription must also be verified.  Note that some of these steps will be done outside of Azure.

### Provisioning

After the above steps are completed, the public IP range can complete the "provisioning" phase and will be created as a custom IP prefix resource in your subscription.  At this point, public IP prefixes (and public IPs) can be derived from your range and associated to Azure resources.  Note that the IPs will not be advertised at this point and therefore not reachable.

### Commissioning

When you are ready, you can issue the command to have your range advertised from Azure and enter the "commissioning" phase.  The range will be advertised first from the Azure region where the custom IP prefix is located, and subsequently by Microsoft's Wide Area Network (WAN) to the Internet.  Also note that the specific region where the range was onboarded will be posted publicly on [Microsoft's IP Range GeoLocation page](https://www.microsoft.com/download/details.aspx?id=53601).

## Limitations

* A custom IP prefix must be associated with a single Azure region.

* In regions with availability zones, a custom IP prefix must be either zone-redundant or associated with a specific zone.  It cannot be created with no zone specified in these regions.

* The minimum size of an IP range is /24.

* IPv6 is currently not supported for custom IP prefixes.

* In regions with [availability zones](https://docs.microsoft.com/azure/availability-zones/az-overview), a custom IP prefix must be specified as either zone-redundant or assigned to a specific zone.  All IPs from the prefix must have the same zonal properties.

* The advertisements of IPs from a custom IP prefix over Azure ExpressRoute are not currently supported.

* Once provisioned, custom IP prefix ranges can't be moved to another subscription. Custom IP address prefix ranges can't be moved within resource groups in a single subscription.  Note that it is possible to derive a public IP prefix from a custom IP prefix in another subscription with the proper permissions.

* Any IP addresses utilized from a Custom IP Prefix currently count against the Standard Public IP quota for the given subscription and region.  Please reach out to Azure support to have quotas increased when required.

## Pricing

* There is no charge to provision or utilize custom IP prefixes. This applies to all public IP prefixes and public IP addresses that are derived from custom IP prefixes.

* All traffic destined to a custom IP prefix range is charged the [internet egress rate](https://azure.microsoft.com/pricing/details/bandwidth/). Customers sending traffic to a custom IP prefix address from within Azure are charged internet egress for the source region of their traffic. Egress traffic from a custom IP address prefix range is charged the equivalent rate as an Azure Public IP from the same region.

## Next steps

- [Provision](create-custom-ip-address-prefix-powershell.md) a custom IP address prefix using PowerShell.

- [Provision](create-custom-ip-address-prefix-cli.md) a custom IP address prefix using CLI.

- [Manage](manage-custom-ip-address-prefix.md) a custom IP address prefix.