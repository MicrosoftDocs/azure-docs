---
title: Release notes - Indoor Module
titleSuffix: Microsoft Azure Maps
description: Release notes for the Azure Maps Indoor Module. 
author: sipa
ms.author: sipa
ms.date: 3/24/2023
ms.topic: reference
ms.service: azure-maps
services: azure-maps
---

# Indoor Module release notes

This document contains information about new features and other changes to the Azure Maps Indoor Module.

## [0.2.0]

### New features (0.2.0)

- Support for new [drawing package 2.0] derived tilesets.

- Support the possibility to select a facility when clicking on a feature that doesn't contain a facilityId, but has a levelId so that the facility can be inferred from the levelId.

### Changes (0.2.0)

- Performance improvements for level picker and indoor manager.

- Revamp of how level filters are applied to indoor style layers. 

### Bug fixes (0.2.0)

- Fix slider not updating when changing level in the level picker when used inside the shadow dom of a custom element.

- Fix exception on disabling of dynamic styling.

## Next steps

Explore samples showcasing Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Creator Samples]

Stay up to date on Azure Maps:

> [!div class="nextstepaction"]
> [Azure Maps Blog]

[drawing package 2.0]: ./drawing-package-guide.md
[0.2.0]: https://www.npmjs.com/package/azure-maps-indoor/v/0.2.0
[Azure Maps Creator Samples]: https://samples.azuremaps.com/?search=creator
[Azure Maps Blog]: https://techcommunity.microsoft.com/t5/azure-maps-blog/bg-p/AzureMapsBlog
