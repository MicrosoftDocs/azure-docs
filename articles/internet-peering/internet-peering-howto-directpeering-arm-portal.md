---
title: Create or modify a Direct Peering using Azure portal
description: Create or modify a Direct Peering using Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify a Direct Peering using Azure portal

This article describes how to create a Microsoft Direct Peering by using Azure portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [PowerShell](internet-peering-howto-directpeering-arm.md).

## Before you begin
* Review [Prerequisites](internet-peering-prerequisites.md) and [Direct Peering walkthrough](internet-peering-workflows-direct.md) before you begin configuration.
* In case you have Direct Peering with Microsoft already, which are not converted to Azure resources, please refer to [Convert a legacy Direct Peering to Azure resource using Azure portal](internet-peering-howto-legacydirect-arm-portal.md)

## Create and provision a Direct Peering

### 1. Sign in to  Azure portal  and select your subscription
[!INCLUDE [Account](./includes/internet-peering-account-portal.md)]

### <a name=create></a> 2. Create a Direct Peering
[!INCLUDE [direct-peering-basic](./includes/internet-peering-direct-portal-basic.md)]

[!INCLUDE [direct-peering-configuration](./includes/internet-peering-direct-portal-configuration.md)]

### <a name=get></a> 3. Verify Direct Peering
[!INCLUDE [peering-direct-get-portal](./includes/internet-peering-direct-portal-get.md)]

## <a name="modify"></a>Modify a Direct Peering
[!INCLUDE [peering-direct-modify-portal](./includes/internet-peering-direct-portal-modify.md)]

## <a name="delete"></a> Deprovision a Direct Peering
[!INCLUDE [peering-direct-delete-portal](./includes/internet-peering-direct-portal-delete.md)]

## Next steps

* [Create or modify Exchange Peering using Azure portal](internet-peering-howto-exchangepeering-arm-portal.md).
* [Convert a legacy Exchange Peering to Azure resource using Azure portal](internet-peering-howto-legacyexchange-arm-portal.md).

## Additional Resources

For more information, please visit [Peering FAQs](internet-peering-faqs.md)

[!INCLUDE [peering-feedback](./includes/internet-peering-feedback.md)]
