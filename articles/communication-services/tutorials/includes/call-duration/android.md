---
author: iaulakh
ms.service: azure-communication-services
ms.topic: include
ms.date: 09/01/2024
ms.author: iaulakh
---

## Get call start time 
To retrieve the call start time, subscribe to the `addOnStartTimeUpdatedListener` on the `CommonCall` object. The start time is returned as a `Date` object, indicating when the call was bootstrapped.

``` java
CommonCall call;
PropertyChangedListener onStartTimeUpdated = this::OnStartTimeUpdated;

// subscribe to start time updated
call.addOnStartTimeUpdatedListener(onStartTimeUpdated);

// get start time
private void OnStartTimeUpdated(PropertyChangedEvent propertyChangedEvent) {
    SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    dateFormatter.setTimeZone(TimeZone.getDefault());
    String dateString = dateFormatter.format(call.getStartTime());
    // dateString with dateFormatter
}

// unsubscribe to start time updated
call.removeOnStartTimeUpdatedListener(onStartTimeUpdated);
```