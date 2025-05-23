---
author: iaulakh
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/01/2024
ms.author: iaulakh
---

## Get call start time  
To retrieve the call start time, subscribe to the `StartTimeUpdated` on the `CommonCommunicationCall` object. The start time is returned as a `DateTimeOffset` object, indicating when the call was bootstrapped.

``` cs
CommonCommunicationCall call;

// subscribe to start time updated
call.StartTimeUpdated += Call_OnStartTimeUpdated;

private async void Call_OnStartTimeUpdated(object sender, PropertyChangedEventArgs args)
{
    // call.StartTime
}

// unsubscribe to start time updated
call.StartTimeUpdated -= Call_OnStartTimeUpdated;
```