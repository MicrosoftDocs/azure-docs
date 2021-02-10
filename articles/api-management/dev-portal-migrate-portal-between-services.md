---
title: Migrate portal between services
titleSuffix: Azure API Management
description: Learn how to migrate self-hosted developer portal content between two API Management services.
author: erikadoyle
ms.author: apimpm
ms.date: 02/02/2021
ms.service: api-management
ms.topic: how-to
---

# Migrate portal between services

Developer portal supports programmatic access to content. It lets you import data to or export data from an API Management service through the [content management REST API](dev-portal-content-management-api.md). The REST API access works for both managed and self-hosted portals.

You can use the API to automate migration of content between two API Management services. For example, a service in the test environment and a service in the production environment. The [scripts.v2/migrate.js](https://github.com/Azure/api-management-developer-portal/blob/master/scripts.v2/migrate.js) script simplifies this automation process.

> [!WARNING]
> The script removes contents of the developer portal in your destination API Management service. Make sure you create a backup.

> [!NOTE]
> If you're using a self-hosted portal with explicitly-defined custom storage account for hosting media files, you need to use the original [scripts/migrate.js](https://github.com/Azure/api-management-developer-portal/blob/master/scripts/migrate.js) script. If you defined the `blobStorageUrl` setting in the `config.design.json` configuration file, you hae an explicitly defined custom storage account. The original script doesn't work for managed or self-hosted portals with the media storage account managed by API Management. Use the script from the `/scripts.v2` folder instead.

## Run the migrate.js script

The script performs these steps:

1. Capture the portal content and media from the source API Management service.
 
1. Remove the portal content and media from the destination API Management service.

1. Upload the portal content and media to the destination API Management service.

1. Optionally and for managed portals only - automatically publish the portal.

After you run the script, the target API Management service will contain the same portal content as the source service. As an admin, you can see it.

If you're using a managed portal, you can set the script to autopublish the destination portal. Doing so makes the migrated version automatically available to the visitors. When using a self-hosted portal, you need to publish the destination portal manually. You can follow the publishing and hosting instructions in the [Self-host the portal](dev-portal-self-host-portal.md) tutorial.

## Next steps

- [Content management API](dev-portal-content-management-api.md)
