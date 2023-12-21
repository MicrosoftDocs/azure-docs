---
description: In this tutorial how to use the Calling composite on Android.
author: pprystinka

ms.author: pprystinka
ms.date: 12/12/2023
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling)

### Picture-In-Picture Setup

To enable multitasking and Picture-in-Picture use `CallCompositeBuilder.multitasking` to set `CallCompositeMultitaskingOptions` with  `enableMultitasking` and `enableSystemPiPWhenMultitasking` constructor parameters.

#### [Kotlin](#tab/kotlin)

```kotlin
val callComposite: CallComposite =
            CallCompositeBuilder()
            .multitasking(CallCompositeMultitaskingOptions(true, true))
            .build()
```

#### [Java](#tab/java)

```java
CallComposite callComposite = 
    new CallCompositeBuilder()
        .multitasking(new CallCompositeMultitaskingOptions(true, true))
        .build();
```
-----

The Back button is displayed when enableMultitasking is set to true:

:::image type="content" source="media/android-call-screen.png" alt-text="Screenshot of the Android call screen with back button visible.":::

On enabling multitasking for `CallComposite` of the Call activity is launched in dedicated task. In the task history user sees two screens: one for App's activity and one for ACS Call activity. 

#### [Kotlin](#tab/kotlin)

```kotlin
callComposite.displayCallCompositeIfWasHidden(context)
```

#### [Java](#tab/java)

```java
callComposite.displayCallCompositeIfWasHidden(context);
```
-----

To enter multitasking programmatically user `hide` method:

#### [Kotlin](#tab/kotlin)
```kotlin
callComposite.hide()
```

#### [Java](#tab/java)

```java
callComposite.hide();
```
-----