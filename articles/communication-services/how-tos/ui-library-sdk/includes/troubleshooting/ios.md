---
description: In this tutorial, you learn how to retrieve CallComposite debug information
author: pprystinka

ms.date: 11/23/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-chat)

### Get debug information

When troubleshooting happens for voice or video calls, user may be asked to provide a CallID; this ID is used to identify Communication Services calls. Every call may have multiple Call Ids.

Call ID can be retrieved from `CallComposite`:

```swift
let callComposite = CallComposite()
...
let debugInfo = callComposite.debugInfo
let callHistoryRecords = debugInfo.callHistoryRecords
let callHistoryRecord = callHistoryRecords.last
let callDate = callHistoryRecord?.callStartedOn
let callIds = callHistoryRecord?.callIds
```
