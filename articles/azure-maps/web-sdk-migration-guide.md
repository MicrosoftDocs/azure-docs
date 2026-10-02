---
title: Migrate Azure Maps Web SDK Map Control v1 and v2.0.x to v3
titleSuffix: Microsoft Azure Maps
description: Learn how to migrate Azure Maps Web SDK Map Control v1 and v2.0.x applications to version 3.
author: sinnypan
ms.author: sipa
ms.date: 09/30/2026
ms.topic: how-to
ms.service: azure-maps
ms.subservice: web-sdk
---

# Migrate Azure Maps Web SDK Map Control v1 and v2.0.x to v3

Azure Maps Web SDK Map Control v1 and Map Control versions 2.0.0 through 2.0.32 are retired. Upgrade all applications that use these versions to Map Control v3. This guide explains how to complete the migration.

## Understand the changes

Before you start the migration process, it's important to familiarize yourself with the key changes and improvements introduced in Web SDK v3. Review the [release notes] to grasp the scope of the new features.

## Updating the Web SDK version

### CDN

If you're using a CDN ([content delivery network]), update the stylesheet and JavaScript references in the `head` element of your HTML files.

#### Before migration: Map Control v1

```html
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1" type="text/css" />
<script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1"></script>
```

#### Before migration: Map Control v2

The generic Map Control v2 CDN path loads the latest v2 release, not a specific v2.0.x release. Therefore, this URL alone doesn't indicate that an application uses an affected v2.0.x version:

```html
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.css" type="text/css" />
<script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/2/atlas.min.js"></script>
```

For applications that install Map Control through npm, check the resolved `azure-maps-control` version in the package lock file. Versions from 2.0.0 through 2.0.32 were retired.

#### After migration: Map Control v3

```html
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css" type="text/css" />
<script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.js"></script>
```

### npm

If you're using [npm], update to the latest release of the Azure Maps control by running the following command:

```shell
npm install azure-maps-control@latest
```

## Review authentication methods (optional)

To enhance security, more authentication methods are included in the Web SDK starting in v2. The new methods include [Microsoft Entra authentication] and [Shared Key Authentication]. For more information about Azure Maps web application security, see [Manage Authentication in Azure Maps].

## Testing

Comprehensive testing is essential during migration. Conduct thorough testing of your application's functionality, performance, and user experience in different browsers and devices.

## Gradual Rollout

Consider a gradual rollout strategy for the updated version. Release the migrated version to a smaller group of users or in a controlled environment before making it available to your entire user base.

By following these steps and considering best practices, you can migrate your application from Azure Maps Web SDK Map Control v1 or v2.0.x to v3. For more information, see [Azure Maps Web SDK best practices].

## Next steps

Learn how to add maps to web and mobile applications using the Map Control client-side JavaScript library in Azure Maps:

> [!div class="nextstepaction"]
> [Use the Azure Maps map control]

[Azure Active Directory Authentication]: how-to-secure-spa-users.md
[Azure Maps Web SDK best practices]: web-sdk-best-practices.md
[content delivery network]: /azure/cdn/cdn-overview
[Manage Authentication in Azure Maps]: how-to-manage-authentication.md
[npm]: https://www.npmjs.com/package/azure-maps-control
[release notes]: release-notes-map-control.md
[Microsoft Entra authentication]: ../active-directory/fundamentals/active-directory-whatis.md
[Shared Key Authentication]: how-to-secure-sas-app.md
[Use the Azure Maps map control]: how-to-use-map-control.md
