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
> * [Portal](peering-howto-exchangepeering-arm-portal.md)
> * [PowerShell](peering-howto-exchangepeering-arm.md)
>

This article describes how to create a Microsoft Exchange Peering by using Azure Portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

## Before you begin
* Review [Prerequisites](peering-prerequisites.md) and [Exchange Peering Walkthrough](peering-workflows-exchange.md) before you begin configuration.
* In case you have Exchange Peerings with Microsoft already, which are not converted to Azure resources, please refer to [Convert a legacy Exchange Peering to Azure resource using Portal](peering-howto-legacyexchange-arm-portal.md)

## Create and provision an Exchange Peering

### 1. Sign in to Azure portal and select your subscription
[!INCLUDE [Account](./includes/peering-account-portal.md)]

### <a name=create></a> 2. Create an Exchange Peering
[!INCLUDE [exchange-peering-basic](./includes/peering-direct-portal-basic.md)]

[!INCLUDE [exchange-peering-configuration](./includes/peering-exchange-portal-configuration.md)]

### <a name=get></a> 3. Verify an Exchange Peering
[!INCLUDE [peering-exchange-get-portal](./includes/peering-exchange-portal-get.md)]

## <a name="modify"></a>Modify an Exchange Peering
[!INCLUDE [peering-exchange-modify-portal](./includes/peering-exchange-portal-modify.md)]

## <a name="delete"></a> Deprovision an Exchange Peering
[!INCLUDE [peering-exchange-delete-portal](./includes/peering-exchange-portal-delete.md)]

## Additional Resources

For more information, please visit [Peering FAQs](peering-faqs.md)

[!INCLUDE [peering-feedback](./includes/peering-feedback.md)]
