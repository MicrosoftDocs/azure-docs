---
title: Automate developer portal deployments
titleSuffix: Azure API Management
description: Learn how to automatically migrate self-hosted developer portal content between two API Management services.
author: dlepow
ms.author: danlep
ms.date: 04/15/2021
ms.service: api-management
ms.topic: how-to
---

# Automate developer portal deployments

The API Management developer portal supports programmatic access to content. It allows you to import data to or export from an API Management service through the [content management REST API](/rest/api/apimanagement/). The REST API access works for both managed and self-hosted portals.

## Automated migration script

You can use the API to automate migration of content between two API Management services - for example, a service in the test environment and a service in the production environment. The `scripts.v3/migrate.js` script in the API Management developer portal [GitHub repo](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v3/migrate.js) simplifies this automation process.

> [!WARNING]
> The script removes contents of the developer portal in your destination API Management service. If you're concerned about it, make sure you perform a backup.

> [!NOTE]
> If you're using a self-hosted portal with an explicitly defined custom storage account to host media files (i.e., you define the `blobStorageUrl` setting in the `config.design.json` configuration file), you need to use the original `scripts/migrate.js` [script](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v2/migrate.js). The original script doesn't work for managed or self-hosted portals with the media storage account managed by API Management. In that case, use the script from the `/scripts.v3` folder instead.

The script performs the following steps:

1. Capture the portal content and media from the source API Management service.
1. Remove the portal content and media from the destination API Management service.
1. Upload the portal content and media to the destination API Management service.
1. Optionally and for managed portals only - automatically publish the portal.

After the script is successfully executed, the target API Management service should contain the same portal content as the source service and you'll be able to see it as an administrator.

* If you're using a managed portal, you can set the script to auto-publish the destination portal to make the migrated version automatically available to the visitors. 
* If you're using a self-hosted portal, you need to publish the destination portal manually. Follow the publishing and hosting instructions in the tutorial to [set up a self-hosted developer portal](developer-portal-self-host.md).

## Next steps

Learn more about the developer portal:

- [Azure API Management developer portal overview](api-management-howto-developer-portal.md)
- [Self-host the developer portal](developer-portal-self-host.md)