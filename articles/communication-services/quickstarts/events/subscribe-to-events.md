---
title: Quickstart - Subscribe to Azure Communication Services Events
titleSuffix: An Azure Communication Services quickstart
description: In this quickstart, you learn how to subscribe to events from Azure Communication Services.
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
# Quickstart: Subscribe to Azure Communication Services events

In this quickstart, you learn how to subscribe to events from Azure Communication Services through the portal, Azure CLI, PowerShell and .NET SDK. 

You can set up event subscriptions for Communication Services resources through the [Azure portal](https://portal.azure.com) or Azure CLI, PowerShell or with the Azure [Event Grid Management SDK](https://www.nuget.org/packages/Azure.ResourceManager.EventGrid/). 

For this Quickstart, we walk through the process of setting up webhook as a subscriber for SMS events from Azure Communication Services. For a full list of events, see this [page](/azure/event-grid/event-schema-communication-services). 

::: zone pivot="platform-azp"
[!INCLUDE [Azure portal](./includes/create-event-subscription-azp.md)]
::: zone-end

::: zone pivot="platform-azcli"
[!INCLUDE [Azure CLI](./includes/create-event-subscription-az-cli.md)]
::: zone-end

::: zone pivot="platform-net"
[!INCLUDE [.NET](./includes/create-event-subscription-net.md)]
::: zone-end

::: zone pivot="platform-powershell"
[!INCLUDE [PowerShell](./includes/create-event-subscription-powershell.md)]
::: zone-end
