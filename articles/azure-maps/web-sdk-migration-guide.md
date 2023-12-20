---
title: The Azure Maps Web SDK v1 migration guide
titleSuffix: Microsoft Azure Maps
description: Find out how to migrate your Azure Maps Web SDK v1 applications to the most recent version of the Web SDK.
author: sinnypan
ms.author: sipa
ms.date: 08/18/2023
ms.topic: how-to
ms.service: azure-maps
---

# The Azure Maps Web SDK v1 migration guide

Thank you for choosing the Azure Maps Web SDK for your mapping needs. This migration guide helps you transition from version 1 to version 3, allowing you to take advantage of the latest features and enhancements.

## Understand the changes

Before you start the migration process, it's important to familiarize yourself with the key changes and improvements introduced in Web SDK v3. Review the [release notes] to grasp the scope of the new features.

## Updating the Web SDK version

### CDN

If you're using CDN ([content delivery network]), update the references to the stylesheet and JavaScript within the `head` element of your HTML files.

#### v1

```html
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/css/atlas.min.css?api-version=1" type="text/css" />
<script src="https://atlas.microsoft.com/sdk/js/atlas.min.js?api-version=1"></script>
```

#### v3

```html
<link rel="stylesheet" href="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.css" type="text/css" />
<script src="https://atlas.microsoft.com/sdk/javascript/mapcontrol/3/atlas.min.js"></script>
```

### npm

If you're using [npm], update to the latest Azure Maps control by running the following command:

```shell
npm install azure-maps-control@latest
```

## Review authentication methods (optional)

To enhance security, more authentication methods are included in the Web SDK starting in version 2. The new methods include [Microsoft Entra authentication] and [Shared Key Authentication]. For more information about Azure Maps web application security, see [Manage Authentication in Azure Maps].

## Testing

Comprehensive testing is essential during migration. Conduct thorough testing of your application's functionality, performance, and user experience in different browsers and devices.

## Gradual Rollout

Consider a gradual rollout strategy for the updated version. Release the migrated version to a smaller group of users or in a controlled environment before making it available to your entire user base.

By following these steps and considering best practices, you can successfully migrate your application from Azure Maps WebSDK v1 to v3. Embrace the new capabilities and improvements offered by the latest version while ensuring a smooth and seamless transition for your users. For more information, see [Azure Maps Web SDK best practices].

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
[Shared Key Authentication]: how-to-secure-sas-app.md
[Use the Azure Maps map control]: how-to-use-map-control.md
