---
title: Create or modify a Direct Peering using portal
description: Create or modify a Direct Peering using portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify a Direct Peering using portal

This article describes how to create a Microsoft Direct Peering by using portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [PowerShell](howto-direct-peering.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Direct Peering walkthrough](workflows-direct.md) before you begin configuration.
* In case you have Direct Peering with Microsoft already, which are not converted to Azure resources, refer to [Convert a legacy Direct Peering to Azure resource using portal](howto-legacy-direct-portal.md)

## Create and provision a Direct Peering

### Sign in to  portal  and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Create a Direct Peering
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

[!INCLUDE [direct-peering-configuration](./includes/direct-portal-configuration.md)]

### <a name=get></a>Verify Direct Peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

## <a name="modify"></a>Modify a Direct Peering
[!INCLUDE [peering-direct-modify-portal](./includes/direct-portal-modify.md)]

## <a name="delete"></a>Deprovision a Direct Peering
[!INCLUDE [peering-direct-delete-portal](./includes/delete.md)]

## Next steps

* [Create or modify Exchange Peering using portal](howto-exchange-peering-portal.md).
* [Convert a legacy Exchange Peering to Azure resource using portal](howto-legacy-exchange-portal.md).

## Additional resources

For more information, visit [Internet Peering FAQs](faqs.md)
