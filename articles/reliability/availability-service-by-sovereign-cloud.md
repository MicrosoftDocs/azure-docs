---
title: Availability of services by sovereign cloud
description: Learn how services are supported for each sovereign cloud
author: anaharris-ms
ms.service: azure
ms.topic: conceptual
ms.date: 07/19/2022
ms.author: anaharris
ms.reviewer: cynthn
ms.custom: references_regions
---

# Availability of services by sovereign cloud  

Although availability of services across Azure regions depends on a region's type, there are public clouds that may not support or only partially support certain services. The article shows which services are available for regions of particular sovereign clouds.

Azure regional services are presented in the following tables by sovereign cloud. Note that some services are non-regional, which means that they're available globally regardless of region. Non-regional services are not mentioned in these tables. For information and a complete list of non-regional services, see [Products available by region](https://azure.microsoft.com/global-infrastructure/services/).



## Legend

Product support is represented by the following symbols:

| Symbol | Meaning | Description |
|---------|--------|----------|
| &#10060; | Unsupported | Unsupported means that the product is not available in that particular region. |
| &#x2705; | Supported | Supported means that the product is available in that particular region and in no way differs from the public cloud offering. |
| &#x26A0; | Partial support | Partial support for any region indicates that the product features offered for the public cloud are not all available for that particular region. Product features for that product could have GA, Preview, or Deprecating public status. Select the product name to get more information as to which features are supported and any other limitations to that support.|

## China

| Product | CH-East |  CH-East-2 | CH-North | CH-North-2  |CH-North-3|
|---------|--------|------------|----------|-------------|-----------|
| [Machine learning](../machine-learning/reference-machine-learning-cloud-parity.md#azure-china-21vianet)|&#10060; | &#x26A0;| &#10060;|&#10060;| &#10060; |

## US Government

| Product | US-Virginia |  US-Arizona |
|---------|--------|------------|
| [Machine learning](../machine-learning/reference-machine-learning-cloud-parity.md#azure-china-21vianet)| Partial | Partial |

## Next steps

- [Azure services that support availability zones](availability-zones-region.md)
- [Regions and availability zones in Azure](overview-availability-zones.md)
