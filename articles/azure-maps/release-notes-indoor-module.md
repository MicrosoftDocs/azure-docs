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

## [0.2.3]

### Changes (0.2.3)

- Improve rendering performance by reading facility-level data from the style metadata when available.

## [0.2.2]

### Changes (0.2.2)

- Performance improvements in dynamic styling updates.

### Bug fixes (0.2.2)

- Fix incorrect feature IDs usage in dynamic styling for [drawing package 2.0] derived tilesets.   

## [0.2.1]

### New features (0.2.1)

- multiple statesets are now supported for map configurations with multiple tileset, instead of single stateset ID, a mapping between tileset IDs and stateset ids can be passed:
  
  ```js
  indoorManager.setOptions({
    statesetId: {
      'tilesetId1': 'stasetId1',
      'tilesetId2': 'stasetId2'
     }
  });

  indoorManager.setDynamicStyling(true)
  ```

- autofocus and autofocusOptions support: when you set autofocus on `IndoorManagerOptions`, the camera is focused on the indoor facilities once the indoor map is loaded. Camera options can be further customized via autofocus options:
  
  ```js
  indoorManager.setOptions({
    autofocus: true,
    autofocusOptions: {
      padding: { top: 50, bottom: 50, left: 50, right: 50 }
    }
  });
  ```

- focusCamera support: instead of `autofocus`, you can call `focusCamera` directly. (Alternative to `autofocus`, when indoor map configuration is used, tilesetId can be provided to focus on a specific facility only, otherwise bounds that enclose all facilities are used):

  ```js
  indoorManager.focusCamera({
     type: 'ease',
     duration: 1000,
     padding: { top: 50, bottom: 50, left: 50, right: 50 }
  })
  ```

- level name labels in LevelControl (in addition to `ordinal`, LevelControl can now display level names derived from 'name' property of level features):

  ```js
  indoorManager.setOptions({
    levelControl: new LevelControl({ levelLabel: 'name' })
  });
  ```
### Changes (0.2.1)

-  non level-bound features are now displayed

### Bug fixes (0.2.1)

- fix facility state not initialized when tile loads don't emit `sourcedata` event

- level preference sorting fixed

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
[0.2.3]: https://www.npmjs.com/package/azure-maps-indoor/v/0.2.3
[0.2.2]: https://www.npmjs.com/package/azure-maps-indoor/v/0.2.2
[0.2.1]: https://www.npmjs.com/package/azure-maps-indoor/v/0.2.1
[0.2.0]: https://www.npmjs.com/package/azure-maps-indoor/v/0.2.0
[Azure Maps Creator Samples]: https://samples.azuremaps.com/?search=creator
[Azure Maps Blog]: https://techcommunity.microsoft.com/t5/azure-maps-blog/bg-p/AzureMapsBlog
