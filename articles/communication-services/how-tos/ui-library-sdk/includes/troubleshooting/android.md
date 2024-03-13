---
description: Learn how to retrieve CallComposite debug information.
author: pprystinka

ms.date: 11/23/2022
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source Android UI Library](https://github.com/Azure/communication-ui-library-android) and the [sample application code](https://github.com/Azure-Samples/communication-services-android-quickstarts/tree/main/ui-calling).

### Get debug information

You can get the call ID from `CallComposite`.

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
