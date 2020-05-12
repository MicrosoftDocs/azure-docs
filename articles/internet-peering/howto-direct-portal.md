---
title: Create or modify a Direct peering by using the Azure portal
titleSuffix: Azure
description: Create or modify a Direct peering by using the Azure portal
services: internet-peering
author: prmitiki
ms.service: internet-peering
ms.topic: article
ms.date: 11/27/2019
ms.author: prmitiki
---

# Create or modify a Direct peering by using the Azure portal

This article describes how to create a Microsoft Direct peering by using the Azure portal. This article also shows how to check the status of the resource, update it, or delete and deprovision it.

If you prefer, you can complete this guide by using Azure [PowerShell](howto-direct-powershell.md).

## Before you begin
* Review the [prerequisites](prerequisites.md) and the [Direct peering walkthrough](walkthrough-direct-all.md) before you begin configuration.
* If you already have Direct peering connections with Microsoft that aren't converted to Azure resources, see [Convert a legacy Direct peering to an Azure resource by using the portal](howto-legacy-direct-portal.md).

## Create and provision a Direct peering

### Sign in to the portal and select your subscription
[!INCLUDE [Account](./includes/account-portal.md)]

### <a name=create></a>Create a Direct peering

You can create a new peering request by using the **Peering** resource.

#### Launch resource and configure basic settings
[!INCLUDE [direct-peering-basic](./includes/direct-portal-basic.md)]

#### Configure connections and submit
[!INCLUDE [direct-peering-configuration](./includes/direct-portal-configuration.md)]

### <a name=get></a>Verify Direct peering
[!INCLUDE [peering-direct-get-portal](./includes/direct-portal-get.md)]

## <a name="modify"></a>Modify a Direct peering
[!INCLUDE [peering-direct-modify-portal](./includes/direct-portal-modify.md)]

## <a name="delete"></a>Deprovision a Direct peering
[!INCLUDE [peering-direct-delete-portal](./includes/delete.md)]

## Next steps

* [Create or modify Exchange peering by using the portal](howto-exchange-portal.md)
* [Convert a legacy Exchange peering to an Azure resource by using the portal](howto-legacy-exchange-portal.md)

## Additional resources

For more information, see [Internet peering FAQs](faqs.md).
