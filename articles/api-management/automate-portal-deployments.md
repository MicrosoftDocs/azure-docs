---
title: Automate Developer Portal Deployments
titleSuffix: Azure API Management
description: Learn how to automatically migrate self-hosted developer portal content between two API Management services.
author: dlepow
ms.author: danlep
ms.date: 10/01/2025
ms.service: azure-api-management
ms.topic: how-to
---

# Automate developer portal deployments

[!INCLUDE [api-management-availability-premium-dev-standard-basic](../../includes/api-management-availability-premium-dev-standard-basic.md)]

The developer portal in Azure API Management supports programmatic access to content. The developer portal allows you to import data to, or export from, an API Management service through the [content management REST API](/rest/api/apimanagement/). The REST API access works for both managed and self-hosted developer portals.

## Automated migration script

You can automate the migration of content between two API Management services, for example, a service in the test environment and a service in the production environment. The `scripts.v3/migrate.js` script in the [developer portal GitHub repo](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v3/migrate.js) simplifies this automation process.

> [!WARNING]
> The script removes the contents of the developer portal in your destination API Management service. If you're concerned about it, make sure you perform a backup.

> [!NOTE]
> Using the script to migrate developer portal content between an API Management instance in a classic tier (for example, Standard) and an instance in a v2 tier (for example, Standard v2) isn't currently supported. Migration of portal content between instances in the v2 tiers is also not supported.

> [!NOTE]
> If you're using a self-hosted developer portal with an explicitly defined custom storage account to host media files (that is, you define the `blobStorageUrl` setting in the `config.design.json` configuration file), you need to use the [original `scripts.v3/migrate.js` script](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v3/migrate.js). The original script doesn't work for managed or self-hosted portals with the media storage account managed by API Management. In that case, use the script from the `/scripts.v3` folder instead.

The script performs the following steps:

1. Captures the portal content and media from the source API Management service.
1. Removes the portal content and media from the destination API Management service.
1. Uploads the portal content and media to the destination API Management service.
1. Optionally and for managed portals only: automatically publishes the portal.

After the script runs successfully, the target API Management service should contain the same portal content as the source service and you'll be able to see it as an administrator.

* If you're using a managed portal, you can set the script to autopublish the destination portal to make the migrated version automatically available to visitors.
* If you're using a self-hosted portal, you need to publish the destination portal manually. Follow the publishing and hosting instructions in the tutorial to set up a [self-hosted developer portal](developer-portal-self-host.md).

## Related content

- [Overview of the developer portal](api-management-howto-developer-portal.md)
- [Self-host the API Management developer portal](developer-portal-self-host.md)
