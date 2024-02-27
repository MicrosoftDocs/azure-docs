---
title: Migrate Azure API Management instance to stv2 platform | Microsoft Docs
description: Find guidance to migrate your Azure API Management instance from the stv1 compute platform to the stv2 platform. Migration steps depend on whether the instance is injected in a VNet.

author: dlepow
ms.service: api-management
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 02/20/2024
ms.author: danlep
---

# Migrate an API Management instance hosted on the stv1 platform to stv2

Here we help you find guidance to migrate your API Management instance hosted on the `stv1` compute platform to the newer `stv2` platform. [Find out if you need to do this](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

There are two different migration scenarios, depending on whether or not your API Management instance is currently deployed (injected) in an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet. Choose the migration guide for your scenario.

[!INCLUDE [api-management-migration-alert](../../includes/api-management-migration-alert.md)]

* [**Scenario 1: Migrate a non-VNet-injected API Management instance**](migrate-stv1-to-stv2-no-vnet.md) - Migrate your instance to the `stv2` platform using the portal or the [Migrate to stv2](/rest/api/apimanagement/current-ga/api-management-service/migratetostv2) REST API.   

* [**Scenario 2: Migrate a VNet-injected API Management instance**](migrate-stv1-to-stv2-vnet.md) - Migrate your instance to the `stv2` platform by manually updating the VNet configuration settings

[!INCLUDE [api-management-migration-support](../../includes/api-management-migration-support.md)]

[!INCLUDE [api-management-migration-related-content](../../includes/api-management-migration-related-content.md)]

