---
description: Learn how to retrieve CallComposite debug information.
author: pprystinka

ms.date: 11/23/2022
ms.topic: include
ms.service: azure-communication-services
---

For more information, see the [open-source iOS UI Library](https://github.com/Azure/communication-ui-library-ios) and the [sample application code](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-calling).

### Get debug information

You can get the call ID from `CallComposite`.

```swift
let callComposite = CallComposite()
...
let debugInfo = callComposite.debugInfo
let callHistoryRecords = debugInfo.callHistoryRecords
let callHistoryRecord = callHistoryRecords.last
let callDate = callHistoryRecord?.callStartedOn
let callIds = callHistoryRecord?.callIds
```
