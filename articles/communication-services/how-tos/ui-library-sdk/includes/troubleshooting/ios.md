---
description: In this tutorial, you learn how to retrieve CallComposite debug information
author: pprystinka

ms.date: 11/23/2022
ms.topic: include
ms.service: azure-communication-services
---

Azure Communication UI [open source library](https://github.com/Azure/communication-ui-library-ios) for iOS and the sample application code can be found [here](https://github.com/Azure-Samples/communication-services-ios-quickstarts/tree/main/ui-library-quick-start)

### Debug information

`DebugInfo` is an object that containts debug information for the currect CallComposite object. 

Call id is used to identify Communication Services calls. `lastCallId` is an id of the last call for the current CallComposite object. When a CallComposite object is created and a call wasn’t started yet, `lastCallId` will return `nil` value. The call id value will be set when call is started and will be preserved while a new call is started or CallComposite istance is deallocated.

The debug information can be retrieved from `CallComposite`:

```swift
let callComposite = CallComposite()
...
let debugInfo = callComposite.debugInfo
let lastCallId = debugInfo.lastCallId
```
