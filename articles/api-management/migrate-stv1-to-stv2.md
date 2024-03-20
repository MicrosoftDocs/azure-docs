---
title: Migrate Azure API Management instance to stv2 platform | Microsoft Docs
description: Find guidance to migrate your Azure API Management instance from the stv1 compute platform to the stv2 platform. Migration steps depend on whether the instance is injected in a VNet.

author: dlepow
ms.service: api-management
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/14/2024
ms.author: danlep
---

# Migrate an API Management instance hosted on the stv1 platform to stv2

Here we help you find guidance to migrate your API Management instance hosted on the `stv1` compute platform to the newer `stv2` platform. [Find out if you need to do this](compute-infrastructure.md#how-do-i-know-which-platform-hosts-my-api-management-instance).

There are two different migration scenarios, depending on whether or not your API Management instance is currently deployed (injected) in an [external](api-management-using-with-vnet.md) or [internal](api-management-using-with-internal-vnet.md) VNet. Choose the migration guide for your scenario. Both scenarios migrate an existing instance in-place to the `stv2` platform.

[!INCLUDE [api-management-migration-alert](../../includes/api-management-migration-alert.md)]

## In-place migration scenarios

* [**Scenario 1: Migrate a non-VNet-injected API Management instance**](migrate-stv1-to-stv2-no-vnet.md) - Migrate your instance to the `stv2` platform using the portal or the [Migrate to stv2](/rest/api/apimanagement/current-ga/api-management-service/migratetostv2) REST API.   

* [**Scenario 2: Migrate a VNet-injected API Management instance**](migrate-stv1-to-stv2-vnet.md) - Migrate your instance to the `stv2` platform by updating the VNet configuration settings

## Alternative: Side-by-side deployment

While we strongly recommend using in-place migration to the `stv2` platform, you can also choose to deploy a new `stv2` instance side-by-side with your original API Management instance. Use API Management's [backup and restore](api-management-howto-disaster-recovery-backup-restore.md) capabilities to back up your original instance and restore onto the new instance. 

With side-by-side deployment, you can control the timing of deploying and verifying the new instance, whether to roll back (if needed) to the original instance, and when to decommission the original instance. This approach increases the costs because you run an additional instance for a period and requires more effort, but gives you full control over the migration process. For limitations and considerations, see [A guide to creating a copy of an API Management instance](https://techcommunity.microsoft.com/t5/fasttrack-for-azure/a-guide-to-creating-a-copy-of-an-api-management-instance/ba-p/3971227).

The following image shows a high level overview of what happens during side-by-side migration.

:::image type="content" source="media/migrate-stv1-to-stv2/side-by-side.gif" alt-text="Diagram of in-place migration to a new subnet.":::

[!INCLUDE [api-management-migration-support](../../includes/api-management-migration-support.md)]

[!INCLUDE [api-management-migration-related-content](../../includes/api-management-migration-related-content.md)]

