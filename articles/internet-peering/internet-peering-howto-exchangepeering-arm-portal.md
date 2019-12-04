---
title: Create or modify an Exchange Peering using Portal
description: Create or modify an Exchange Peering using Portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify an Exchange Peering using Portal
> [!div class="op_single_selector"]
> * [Portal](internet-peering-howto-exchangepeering-arm-portal.md)
> * [PowerShell](internet-peering-howto-exchangepeering-arm.md)
>

This article describes how to create a Microsoft Exchange Peering by using Azure Portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

## Before you begin
* Review [Prerequisites](internet-peering-prerequisites.md) and [Exchange Peering Walkthrough](internet-peering-workflows-exchange.md) before you begin configuration.
* In case you have Exchange Peerings with Microsoft already, which are not converted to Azure resources, please refer to [Convert a legacy Exchange Peering to Azure resource using Portal](internet-peering-howto-legacyexchange-arm-portal.md)

## Create and provision an Exchange Peering

### 1. Sign in to Azure portal and select your subscription
[!INCLUDE [Account](./includes/internet-peering-account-portal.md)]

### <a name=create></a> 2. Create an Exchange Peering
[!INCLUDE [exchange-peering-basic](./includes/internet-peering-direct-portal-basic.md)]

[!INCLUDE [exchange-peering-configuration](./includes/internet-peering-exchange-portal-configuration.md)]

### <a name=get></a> 3. Verify an Exchange Peering
[!INCLUDE [peering-exchange-get-portal](./includes/internet-peering-exchange-portal-get.md)]

## <a name="modify"></a>Modify an Exchange Peering
[!INCLUDE [peering-exchange-modify-portal](./includes/internet-peering-exchange-portal-modify.md)]

## <a name="delete"></a> Deprovision an Exchange Peering
[!INCLUDE [peering-exchange-delete-portal](./includes/internet-peering-exchange-portal-delete.md)]

## Additional Resources

For more information, please visit [Peering FAQs](internet-peering-faqs.md)

[!INCLUDE [peering-feedback](./includes/internet-peering-feedback.md)]
