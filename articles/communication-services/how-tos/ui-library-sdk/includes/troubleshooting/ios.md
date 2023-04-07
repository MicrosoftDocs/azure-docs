---
description: In this tutorial, you learn how to retrieve CallComposite debug information
author: pprystinka

ms.date: 11/23/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-chat)

### Debug information

`DebugInfo` is an object that contains debug information for the current CallComposite object. 

Call ID is used to identify Communication Services calls. `currentOrLastCallId` is an ID of the current or last call for the current CallComposite object. When a CallComposite object is created and a call isn't started yet, `currentOrLastCallId` will return `nil` value. The call ID value will be set when a call is started. The value will be preserved until a new call is started or CallComposite instance is deallocated.

The debug information can be retrieved from `CallComposite`:

```swift
let callComposite = CallComposite()
...
let debugInfo = callComposite.debugInfo
let currentOrLastCallId = debugInfo.currentOrLastCallId
```
