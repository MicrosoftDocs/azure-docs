---
title: Quickstart - Subscribe to Azure Communication Services Events
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you'll learn how to subscribe to events from Azure Communication Services.
author: pgrandhi
manager: rasubram
services: azure-communication-services
ms.author: pgrandhi
ms.date: 01/26/2024
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: arm
zone_pivot_groups: acs-plat-azp-azcli-net-ps
ms.custom: mode-other, devx-track-azurecli, devx-track-azurepowershell
ms.devlang: azurecli 
---
# Quickstart: Subscribe to Azure Communication Services Events

This article describes how to subscribe to Azure Communication Services events through the portal and Azure CLI. Communication Services resources event subscritptions can be provisioned through the [Azure portal](https://portal.azure.com) or with the Azure [EventGrid Management SDK](https://www.nuget.org/packages/Azure.ResourceManager.EventGrid/). 

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/create-eventsubscription-azp.md)]
::: zone-end

::: zone pivot="platform-azcli"
[!INCLUDE [Azure CLI](./includes/create-eventsubscription-az-cli.md)]
::: zone-end

::: zone pivot="platform-net"
[!INCLUDE [.NET](./includes/create-eventsubscription-net.md)]
::: zone-end

::: zone pivot="platform-powershell"
[!INCLUDE [PowerShell](./includes/create-eventsubscription-powershell.md)]
::: zone-end
