---
author: mikben
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/30/2021
ms.author: mikben
---

## Eventing model
You can subscribe to most of the properties and collections to be notified when values change.

### Properties
To subscribe to `property changed` events:

```java
// subscribe
PropertyChangedListener callStateChangeListener = new PropertyChangedListener()
{
    @Override
    public void onPropertyChanged(PropertyChangedEvent args)
    {
        Log.d("The call state has changed.");
    }
}
call.addOnStateChangedListener(callStateChangeListener);

//unsubscribe
call.removeOnStateChangedListener(callStateChangeListener);
```

### Collections
To subscribe to `collection updated` events:

```java
LocalVideoStreamsChangedListener localVideoStreamsChangedListener = new LocalVideoStreamsChangedListener()
{
    @Override
    public void onLocalVideoStreamsUpdated(LocalVideoStreamsEvent localVideoStreamsEventArgs) {
        Log.d(localVideoStreamsEventArgs.getAddedStreams().size());
        Log.d(localVideoStreamsEventArgs.getRemovedStreams().size());
    }
}
call.addOnLocalVideoStreamsChangedListener(localVideoStreamsChangedListener);
// To unsubscribe
call.removeOnLocalVideoStreamsChangedListener(localVideoStreamsChangedListener);
```
