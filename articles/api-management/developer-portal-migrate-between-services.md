---
title: Migrate developer portal between services
titleSuffix: Azure API Management
description: Learn how to migrate self-hosted developer portal content between two API Management services.
author: erikadoyle
ms.author: apimpm
ms.date: 03/24/2021
ms.service: api-management
ms.topic: how-to
---

# Migrate developer portal between services

The API Management developer portal supports programmatic access to content. It allows you to import data to or export from an API Management service through the [content management REST API](developer-portal-content-management-api.md). The REST API access works for both managed and self-hosted portals.

You can use the API to automate migration of content between two API Management services - for example, a service in the test environment and a service in the production environment. The [`scripts.v2/migrate.js` script](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v2/migrate.js) in the API Management developer portal GitHub repo simplifies this automation process.

> [!WARNING]
> The script removes contents of the developer portal in your destination API Management service. If you're concerned about it, make sure you perform a backup.

> [!NOTE]
> If you're using a self-hosted portal with an explicitly defined custom storage account to host media files (i.e., you define the `blobStorageUrl` setting in the `config.design.json` configuration file), you need to use the original `scripts/migrate.js` [script](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v2/migrate.js). The original script doesn't work for managed or self-hosted portals with the media storage account managed by API Management. In that case, use the script from the `/scripts.v2` folder instead.I

The script performs the following steps:

1. Capture the portal content and media from the source API Management service
1. Remove the portal content and media from the destination API Management service
1. Upload the portal content and media to the destination API Management service
1. Optionally and for managed portals only - automatically publish the portal

After the script is successfully executed, the target API Management service should contain the same portal content as the source service and you'll be able to see it as an administrator.

* If you're using a managed portal, you can set the script to auto-publish the destination portal to make the migrated version automatically available to the visitors. 
* If you're using a self-hosted portal, you need to publish the destination portal manually. You can follow the publishing and hosting instructions from [the general self-hosted portal tutorial](dev-portal-self-host-portal.md).

## Next steps

- [Content management API](developer-portal-content-management-api.md)
