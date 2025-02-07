---
description: Customize the title and subtitle of the call bar in the iOS UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 09/01/2024
ms.topic: include
ms.service: azure-communication-services
---

## Customize title and subtitle

To set and update call screen infoHeader `title` & `subtitle`, we have `CallScreenHeaderViewData` to configure and pass to `CallScreenOptions` by param `headerViewData`. The `title`, `Subtitle` in `CallScreenHeaderViewData` are optional parameters and `headerViewData` itself is optional as well. Default UI library title is displayed if `title` value isn't configured.

```swift
var headerViewData = CallScreenHeaderViewData(
            title: "This is a custom InfoHeader",
            subtitle: "This is a custom subtitle")
var callScreenOptions = CallScreenOptions(controlBarOptions: barOptions,
                                          headerViewData: headerViewData)

// Use any event from call composite to update title & subtitle when the call is in progress.
headerViewData.title = "Custom updated title"
headerViewData.subtitle = "Custom updated subtitle"
```
