---
description: In this tutorial, you learn how to retrieve CallComposite debug information
author: pprystinka

ms.date: 11/23/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling)

### Get debug information

When troubleshooting happens for voice or video calls, user may be asked to provide a CallID; this ID is used to identify Communication Services calls.

CallID can be retrieved from `CallComposite`:

#### [Kotlin](#tab/kotlin)

```kotlin
val callComposite: CallComposite = CallCompositeBuilder().build()
...
val debugInfo = callComposite.debugInfo
val lastCallId = debugInfo.lastCallId
```

#### [Java](#tab/java)

```java
CallComposite callComposite = new CallCompositeBuilder().build();
...
CallCompositeDebugInfo debugInfo = callComposite.getDebugInfo();
String lastCallId = debugInfo.getLastCallId();
```
