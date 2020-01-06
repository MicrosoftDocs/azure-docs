---
title: Create or modify an Exchange Peering using the portal
description: Create or modify an Exchange Peering using the portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify an Exchange Peering using the portal

This article describes how to create a Microsoft Exchange Peering by using the portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide using the [PowerShell](howto-exchange-powershell.md).

## Before you begin
* Review [Prerequisites](prerequisites.md) and [Exchange Peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.
* In case you have Exchange Peerings with Microsoft already, which are not converted to Azure resources, refer to [Convert a legacy Exchange Peering to Azure resource using the portal](howto-legacy-exchange-portal.md)

## Create and provision an Exchange Peering

### Sign in to  portal  and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Create an Exchange Peering

You can create a new Peering request by using Peering resource.

#### Launch resource and configure basic settings
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

#### Configure connections and submit
[!INCLUDE [exchange-peering-configuration](./includes/exchange-portal-configuration.md)]

### <a name=get></a>Verify an Exchange Peering
[!INCLUDE [peering-exchange-get-portal](./includes/exchange-portal-get.md)]

## <a name="modify"></a>Modify an Exchange Peering
[!INCLUDE [peering-exchange-modify-portal](./includes/exchange-portal-modify.md)]

## <a name="delete"></a>Deprovision an Exchange Peering
[!INCLUDE [peering-exchange-delete-portal](./includes/delete.md)]

## Next steps

* [Create or modify a Direct Peering using the portal](howto-direct-portal.md)
* [Convert a legacy Direct Peering to Azure resource using the portal](howto-legacy-direct-portal.md)

## Additional resources

For more information, visit [Internet Peering FAQs](faqs.md)
