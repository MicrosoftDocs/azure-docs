---
 title: include file
 description: include file
 services: virtual-network
 sub-services: ip-services
 author: mbender-ms
 ms.service: azure-virtual-network
 ms.topic: include
 ms.date: 07/25/2024
 ms.author: mbender
 ms.custom: include file
---

> [!NOTE]
> The estimated time to fully complete the commissioning process is 3-4 hours.

> [!IMPORTANT]
> As the custom IP prefix transitions to a **Commissioned** state, the range is being advertised with Microsoft from the local Azure region and globally to the Internet by Microsoft's wide area network under Autonomous System Number (ASN) 8075. Advertising this same range to the Internet from a location other than Microsoft at the same time could potentially create BGP routing instability or traffic loss. For example, a customer on-premises building. Plan any migration of an active range during a maintenance period to avoid impact.  To prevent these issues during initial deployment, you can choose the regional only commissioning option where your custom IP prefix will only be advertised within the Azure region it is deployed in. For more information, see [Manage a custom IP address prefix (BYOIP)](../articles/virtual-network/ip-services/manage-custom-ip-address-prefix.md) for more information.