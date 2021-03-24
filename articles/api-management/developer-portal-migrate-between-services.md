---
title: Migrate portal between services
titleSuffix: Azure API Management
description: Learn how to migrate self-hosted developer portal content between two API Management services.
author: erikadoyle
ms.author: apimpm
ms.date: 03/24/2021
ms.service: api-management
ms.topic: how-to
---

# Migrate portal between services

Developer portal supports programmatic access to content. It allows you to import data to or export it from an API Management service through the [content management REST API](dev-portal-content-management-api.md). The REST API access works for both managed and self-hosted portals.

You can use the API to automate migration of content between two API Management services - for example, a service in the test environment and a service in the production environment. The [`scripts.v2/migrate.js` script](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v2/migrate.js) simplifies this automation process.

**Warning**: the script removes contents of the developer portal in your destination API Management service. If you're concerned about it, make sure you perform a backup.

**Note**: If you're using a self-hosted portal with explicitly-defined custom Storage Account for hosting media files (i.e., you define the `blobStorageUrl` setting in the `config.design.json` configuration file), you need to use the original [`scripts/migrate.js` script](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v2/migrate.js). The original script doesn't work for managed or self-hosted portals with the media Storage Account managed by API Management - use the script from the `/scripts.v2` folder instead.

The script performs the following steps:

1. Capture the portal content and media from the source API Management service
2. Remove the portal content and media from the destination API Management service
3. Upload the portal content and media to the destination API Management service
4. Optionally and for managed portals only - automatically publish the portal

After the script is successfully executed, the target API Management service should contain the same portal content as the source service and you'll be able to see it as an administrator.

If you're using a managed portal, you can set the script to auto-publish the destination portal to make the migrated version automatically available to the visitors. If you're using a self-hosted portal, you need to publish the destination portal manually. You can follow the publishing and hosting instructions from [the general self-hosted portal tutorial](dev-portal-self-host-portal.md).

## Next steps

- [Content management API](dev-portal-content-management-api.md)
