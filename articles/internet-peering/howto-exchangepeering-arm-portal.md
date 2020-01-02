---
title: Create or modify an Exchange Peering using Azure portal
description: Create or modify an Exchange Peering using Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify an Exchange Peering using Azure portal

This article describes how to create a Microsoft Exchange Peering by using Azure portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [PowerShell](howto-exchangepeering-arm.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Exchange Peering walkthrough](workflows-exchange.md) before you begin configuration.
* In case you have Exchange Peerings with Microsoft already, which are not converted to Azure resources, please refer to [Convert a legacy Exchange Peering to Azure resource using Azure portal](howto-legacyexchange-arm-portal.md)

## Create and provision an Exchange Peering

### Sign in to  Azure portal  and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Create an Exchange Peering
[!INCLUDE [exchange-peering-basic](./includes/direct-portal-basic.md)]

[!INCLUDE [exchange-peering-configuration](./includes/exchange-portal-configuration.md)]

### <a name=get></a>Verify an Exchange Peering
[!INCLUDE [peering-exchange-get-portal](./includes/exchange-portal-get.md)]

## <a name="modify"></a>Modify an Exchange Peering
[!INCLUDE [peering-exchange-modify-portal](./includes/exchange-portal-modify.md)]

## <a name="delete"></a>Deprovision an Exchange Peering
[!INCLUDE [peering-exchange-delete-portal](./includes/exchange-portal-delete.md)]

## Next steps

* [Create or modify a Direct Peering using Azure portal](howto-directpeering-arm-portal.md)
* [Convert a legacy Direct Peering to Azure resource using Azure portal](howto-legacydirect-arm-portal.md)

## Additional resources

For more information, please visit [Peering FAQs](faqs.md)

[!INCLUDE [peering-feedback](./includes/feedback.md)]
