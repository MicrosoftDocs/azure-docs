---
title: Mount Azure Storage as a local share
description: Learn how to attach custom network share in Azure App Service. Share files between apps, manage static content remotely and access locally.
author: msangapu-msft

ms.topic: article
ms.custom: devx-track-azurecli, linux-related-content
ms.date: 03/04/2025
ms.author: msangapu
zone_pivot_groups: app-service-containers-code
#customer intent: As an app designer, I want to be able to mount Azure Storage to support my web apps in Azure App Service.
---
# Mount Azure Storage as a local share in App Service

::: zone pivot="code-windows"
[!INCLUDE [configure-azure-storage-windows-code](./includes/configure-azure-storage/azure-storage-windows-code-pivot.md)]
::: zone-end

::: zone pivot="container-windows"
[!INCLUDE [configure-azure-storage-windows-container](./includes/configure-azure-storage/azure-storage-windows-container-pivot.md)]
::: zone-end

::: zone pivot="container-linux"
[!INCLUDE [configure-azure-storage-linux-container](./includes/configure-azure-storage/azure-storage-linux-container-pivot.md)]
::: zone-end
