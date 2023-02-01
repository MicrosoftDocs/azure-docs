---
title: Azure Communications Gateway limits, quotas and restrictions
description: Understand the limits and quotas associated with the Azure Communications Gateway
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway 
ms.topic: reference
ms.date: 01/11/2023 
---

# Azure Communications Gateway limits, quotas and restrictions

This article contains the usage limits and quotas that apply to Azure Communications Gateway. If you're looking for the full set of Microsoft Azure service limits,  see [Azure subscription and service limits, quotas, and constraints](../azure-resource-manager/management/azure-subscription-service-limits.md).

## General restrictions

[!INCLUDE [communications-gateway-general-restrictions](includes/communications-gateway-general-restrictions.md)]

## SIP message restrictions

Azure Communications Gateway applies restrictions to individual fields in SIP messages. These restrictions are applied for:

* Performance - Having to process oversize messages elements decreases system performance.
* Resilience - Some oversize message elements are commonly used in denial of service attacks to consume resources.
* Security - Some network devices may fail to process messages that exceed this limit.

### SIP size limits

[!INCLUDE [communications-gateway-sip-size-restrictions](includes/communications-gateway-sip-size-restrictions.md)]

### SIP behavior restrictions

[!INCLUDE [communications-gateway-sip-behavior-restrictions](includes/communications-gateway-sip-behavior-restrictions.md)]

## Next steps

Some default limits and quotas can be increased. To request a change to a limit, raise a [change request](request-changes.md) stating the limit you want to change.
