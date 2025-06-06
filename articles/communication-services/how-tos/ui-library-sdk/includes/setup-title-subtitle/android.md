---
description: Customize the title and subtitle of the call bar in the Android UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 09/01/2024
ms.topic: include
ms.service: azure-communication-services
---

## Customize title and subtitle

To set and update call screen header `title` and `subtitle`, utilize `CallCompositeCallScreenOptions` to configure `CallCompositeCallScreenHeaderViewData`. Default UI library title is displayed if `title` value isn't configured.

#### [Kotlin](#tab/kotlin)

```kotlin
// create call screen header view data to set title and subtitle
val callScreenHeaderViewData = CallCompositeCallScreenHeaderViewData()
callScreenHeaderViewData.title = "title"
callScreenHeaderViewData.subtitle = "subtitle"

// create call screen options
val callScreenOptions = CallCompositeCallScreenOptions()
callScreenOptions.setHeaderViewData(callScreenHeaderViewData)

// create call composite
val callComposite = CallCompositeBuilder().build()

val localOptions = CallCompositeLocalOptions()
localOptions.setCallScreenOptions(callScreenOptions)

// launch composite
callComposite.launch(applicationContext, locator, localOptions)

// use any event from call composite to update title subtitle when call is in progress
// callScreenHeaderViewData.title = "updated title"
// callScreenHeaderViewData.subtitle = "updated subtitle"
```

#### [Java](#tab/java)
```java
// Create call screen header view data to set title and subtitle
CallCompositeCallScreenHeaderViewData callScreenHeaderViewData = new CallCompositeCallScreenHeaderViewData();
callScreenHeaderViewData.setTitle("title");
callScreenHeaderViewData.setSubtitle("subtitle");

// Create call screen options
CallCompositeCallScreenOptions callScreenOptions = new CallCompositeCallScreenOptions();
callScreenOptions.setHeaderOptions(callScreenHeaderViewData);

// Create call composite
CallComposite callComposite = new CallCompositeBuilder().build();

CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions();
localOptions.setCallScreenOptions(callScreenOptions);

// Launch composite
callComposite.launch(getApplicationContext(), locator, localOptions);

// Use any event from call composite to update title and subtitle when the call is in progress
// callScreenHeaderViewData.setTitle("updated title");
// callScreenHeaderViewData.setSubtitle("updated subtitle");
```

-----
