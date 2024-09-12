---
author: iaulakh
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/01/2024
ms.author: iaulakh
---

## Get call start time 
To retrieve the call start time, set the `didUpdateStartTime` on the `CallDelegate`. The start time is returned as a `Date` object, indicating when the indicating when the call was bootstrapped.

``` swift
class CallObserver : NSObject, CallDelegate
{
    // subscribe to didUpdateStartTime
    public func call(_ call: Call, didUpdateStartTime args: PropertyChangedEventArgs) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
        dateFormatter.timeZone = TimeZone.current
        let dateString = dateFormatter.string(from: call.startTime)
        print("==> didUpdateStartTime for call: \(dateString)")
    }
}

// set call delegate
call.delegate = CallObserver()
```