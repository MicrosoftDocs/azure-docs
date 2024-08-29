---
description: Customize the title and subtitle of the call bar in the iOS UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 09/01/2024
ms.topic: include
ms.service: azure-communication-services
---

## Customize title and subtitle

To set and update call screen infoHeader `title` & `subtitle`, we have `CallScreenHeaderOptions` to configure and pass to `CallScreenOptions` by param `headerOptions`. The `title`, `Subtitle` in `CallScreenHeaderOptions` are optional parameters and `headerOptions` itself is optional as well. Default UI library title is displayed if `title` value isn't configured.

```swift
var callScreenHeaderOptions = CallScreenHeaderOptions(
            title: "This is a custom InfoHeader",
            subtitle: "This is a custom subtitle")
var callScreenOptions = CallScreenOptions(controlBarOptions: barOptions,
                                          headerOptions: callScreenHeaderOptions)

// Use any event from call composite to update title & subtitle when the call is in progress.
callScreenHeaderOptions.title = "Custom updated title"
callScreenHeaderOptions.subtitle = "Custom updated subtitle"
```
