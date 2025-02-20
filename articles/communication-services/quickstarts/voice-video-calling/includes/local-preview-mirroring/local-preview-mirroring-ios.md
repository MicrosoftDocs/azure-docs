---
title: Quickstart - Local preview mirroring
titleSuffix: An Azure Communication Services Quickstart
description: This quickstart describes how to mirror local preview
author: yassirbisteni
manager: bobgao

ms.author: yassirb
ms.date: 19/02/2025
ms.topic: quickstart
ms.service: azure-communication-services
ms.subservice: calling
ms.custom: mode-other, devx-track-js

zone_pivot_groups: acs-plat-web-windows-android-ios
---

## Mirror local preview

[!INCLUDE [Public Preview Disclaimer](../../../../includes/public-preview-include.md)]

````swift
var renderer = try VideoStreamRenderer(localVideoStream: localVideoStream)
var view = try renderer?.createView(withOptions: CreateViewOptions(scalingMode: scalingMode))
var view?.layer.transform = CATransform3DMakeAffineTransform(CGAffineTransformMakeScale(-1.0, 1.0))
````