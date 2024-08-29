---
description: Customize the title and subtitle of the call bar in the Android UI Library
author: garchiro7

ms.author: jorgegarc
ms.date: 09/01/2024
ms.topic: include
ms.service: azure-communication-services
---

## Customize title and subtitle

To set and update call screen header `title` and `subtitle`, utilize `CallCompositeCallScreenOptions` to configure `CallCompositeCallScreenHeaderOptions`. Default UI library title will be displayed if `title` value is not configured.

#### [Kotlin](#tab/kotlin)

```kotlin
// create call screen header options to set title and subtitle
val callScreenHeaderOptions = CallCompositeCallScreenHeaderOptions()
callScreenHeaderOptions.title = "title"
callScreenHeaderOptions.subtitle = "subtitle"

// create call screen options
val callScreenOptions = CallCompositeCallScreenOptions()
callScreenOptions.setHeaderOptions(callScreenHeaderOptions)

// create call composite
val callComposite = CallCompositeBuilder().build()

val localOptions = CallCompositeLocalOptions()
localOptions.setCallScreenOptions(callScreenOptions)

// launch composite
callComposite.launch(applicationContext, locator, localOptions)

// use any event from call composite to update title subtitle when call is in progress
// callScreenHeaderOptions.title = "updated title"
// callScreenHeaderOptions.subtitle = "updated subtitle"
```

#### [Java](#tab/java)
```java
// Create call screen header options to set title and subtitle
CallCompositeCallScreenHeaderOptions callScreenHeaderOptions = new CallCompositeCallScreenHeaderOptions();
callScreenHeaderOptions.setTitle("title");
callScreenHeaderOptions.setSubtitle("subtitle");

// Create call screen options
CallCompositeCallScreenOptions callScreenOptions = new CallCompositeCallScreenOptions();
callScreenOptions.setHeaderOptions(callScreenHeaderOptions);

// Create call composite
CallComposite callComposite = new CallCompositeBuilder().build();

CallCompositeLocalOptions localOptions = new CallCompositeLocalOptions();
localOptions.setCallScreenOptions(callScreenOptions);

// Launch composite
callComposite.launch(getApplicationContext(), locator, localOptions);

// Use any event from call composite to update title and subtitle when the call is in progress
// callScreenHeaderOptions.setTitle("updated title");
// callScreenHeaderOptions.setSubtitle("updated subtitle");
```

-----
