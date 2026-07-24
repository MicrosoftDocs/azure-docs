---
author: probableprime
ms.service: azure-communication-services
ms.topic: include
ms.date: 06/15/2025
ms.author: micahvivion
---
[!INCLUDE [Install SDK](../install-sdk/install-sdk-android.md)]

Now that you installed Android SDK, you can subscribe to most of the properties and collections to be notified when values change.

## Properties

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

When you use event listeners that are defined within the same class, bind the listener to a variable. To add and remove listener methods, pass the variable in as an argument.

If you try to pass the listener in directly as an argument, you lose the reference to that listener. Java is creating new instances of these listeners and not referencing previously created ones. They still fire off properly but can’t be removed because you don’t have a reference to them anymore.

## Collections
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
