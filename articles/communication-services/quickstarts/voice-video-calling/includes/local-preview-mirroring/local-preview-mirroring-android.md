---
title: Quickstart - Turn off local preview mirroring
titleSuffix: An Azure Communication Services Quickstart
description: This quickstart describes how to turn off local preview mirroring
author: yassirbisteni
manager: gaobob

ms.author: yassirb
ms.date: 2/21/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js

zone_pivot_groups: acs-plat-web-windows-android-ios
---

### Turn off local preview mirroring

````java
VideoStreamRenderer renderer = new VideoStreamRenderer(localVideoStream, this);
VideoStreamRendererView view = renderer.createView(new CreateViewOptions(scalingMode));
view.setRotationY(view.getRotationY() + 180f);
````