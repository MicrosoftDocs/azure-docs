---
title: Create or modify an Exchange peering by using the Azure portal
titleSuffix: Azure
description: Create or modify an Exchange peering by using the Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify an Exchange peering by using the Azure portal

This article describes how to create a Microsoft Exchange peering by using the Azure portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide by using [PowerShell](howto-exchange-powershell.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Exchange peering walkthrough](walkthrough-exchange-all.md) before you begin configuration.
* If you already have Exchange peerings with Microsoft that aren't converted to Azure resources, see [Convert a legacy Exchange peering to an Azure resource by using the portal](howto-legacy-exchange-portal.md).

## Create and provision an Exchange peering

### Sign in to the portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Create an Exchange peering

You can create a new peering request by using the **Peering** resource.

#### Launch the resource and configure basic settings
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

* [Create or modify a Direct peering by using the portal](howto-direct-portal.md)
* [Convert a legacy Direct peering to an Azure resource by using the portal](howto-legacy-direct-portal.md)

## Additional resources

For more information, see [Internet peering FAQs](faqs.md).
