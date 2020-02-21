---
title: Create or modify an Exchange peering using the portal
titleSuffix: Azure
description: Create or modify an Exchange peering using the portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify an Exchange peering using the portal

This article describes how to create a Microsoft Exchange peering by using the portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [PowerShell](howto-exchange-powershell.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.
* In case you have Exchange peerings with Microsoft already, which are not converted to Azure resources, refer to [Convert a legacy Exchange peering to Azure resource using the portal](howto-legacy-exchange-portal.md)

## Create and provision an Exchange peering

### Sign in to portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Create an Exchange peering

You can create a new peering request by using **Peering** resource.

#### Launch resource and configure basic settings
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

#### Configure connections and submit
[!INCLUDE [exchange-peering-configuration](./includes/exchange-portal-configuration.md)]

### <a name=get></a>Verify an Exchange peering
[!INCLUDE [peering-exchange-get-portal](./includes/exchange-portal-get.md)]

## <a name="modify"></a>Modify an Exchange peering
[!INCLUDE [peering-exchange-modify-portal](./includes/exchange-portal-modify.md)]

## <a name="delete"></a>Deprovision an Exchange peering
[!INCLUDE [peering-exchange-delete-portal](./includes/delete.md)]

## Next steps

* [Create or modify a Direct peering using the portal](howto-direct-portal.md)
* [Convert a legacy Direct peering to Azure resource using the portal](howto-legacy-direct-portal.md)

## Additional resources

For more information, visit [Internet peering FAQs](faqs.md)
