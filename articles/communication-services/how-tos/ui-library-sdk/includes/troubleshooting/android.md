---
description: In this tutorial, you learn how to retrieve CallComposite debug information
author: pprystinka

ms.date: 11/23/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-android) for Android and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling)

### Get debug information

When troubleshooting happens for voice or video calls, user may be asked to provide a CallID; this ID is used to identify Communication Services calls. Every call may have multiple Call Ids.

Call ID can be retrieved from `CallComposite`:

#### [Kotlin](#tab/kotlin)

```kotlin
val callComposite: CallComposite = CallCompositeBuilder().build()
...
val callHistoryRecords = callComposite.getDebugInfo(context).callHistoryRecords
val callHistoryRecord = callHistoryRecords.lastOrNull()
val callDate = callHistoryRecord.callStartedOn
val callIds = callHistoryRecord.callIds
```

#### [Java](#tab/java)

```java
CallComposite callComposite = new CallCompositeBuilder().build();
...

List<CallCompositeCallHistoryRecord> callHistoryRecords = callComposite.getDebugInfo(context).getCallHistoryRecords();
CallCompositeCallHistoryRecord callHistoryRecord = callHistoryRecords.get(callHistoryRecords.size() - 1);
LocalDateTime callDate = callHistoryRecord.getCallStartedOn();
List<String> callIds = callHistoryRecord.getCallIds();
```
