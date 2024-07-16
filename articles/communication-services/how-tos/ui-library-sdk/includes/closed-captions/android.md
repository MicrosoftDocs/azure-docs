---
description: description: Enable scenarios using closed captions and the UI Library in Android
author: garchiro7

ms.author: jorgegarc
ms.date: 07/01/2024
ms.topic: include
ms.service: azure-communication-services
---

### Enable closed captions

#### [Kotlin](#tab/kotlin)

```kotlin
val captionsOptions = CallCompositeCaptionsOptions()
captionsOptions.setCaptionsOn(false)
captionsOptions.setSpokenLanguage("en-US")

val localOptions = CallCompositeLocalOptions()
localOptions.setCaptionsOptions(captionsOptions)

```

#### [Java](#tab/java)

```java

```
