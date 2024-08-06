---
 title: include file
 description: include file
 services: virtual-network
 sub-services: ip-services
 author: mbender-ms
 ms.service: azure-virtual-network
 ms.topic: include
 ms.date: 08/06/2024
 ms.author: mbender
 ms.custom: include file
---

> [!IMPORTANT]
> Onboarded custom IPv6 address prefixes have several unique attributes which make them different than custom IPv4 address prefixes.

* Custom IPv6 prefixes use a *parent*/*child* model. In this model, the Microsoft Wide Area Network (WAN) advertises the global (parent) range, and the respective Azure regions advertise the regional (child) ranges. Global ranges must be /48 in size, while regional ranges must always be /64 size. You can have multiple /64 ranges per region.

* Only the global range needs to be validated using the steps detailed in [Create Custom IP Address Prefix](create-custom-ip-address-prefix-portal.md). The regional ranges are derived from the global range in a similar manner to the way public IP prefixes are derived from custom IP prefixes.

* Public IPv6 prefixes must be derived from the regional ranges. Only the first 2048 IPv6 addresses of each regional /64 custom IP prefix can be utilized as valid IPv6 space. Attempting to create public IPv6 prefixes that span beyond this range results in an error.