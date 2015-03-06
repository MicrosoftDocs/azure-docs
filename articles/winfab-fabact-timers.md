<properties 
   pageTitle="FabAct Timers" 
   description="Introduction to FabAct Timers" 
   services="winfabric" 
   documentationCenter=".net" 
   authors="clca" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="winfabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="03/02/2015"
   ms.author="claudioc"/>

#FabAct Timers
Actor timers provides a simple wrapper around .NET timer such that the callback methods respects the turn based concurrency guarantees provided by the actor framework.

The example below shows the use of timer APIs. The APIs are very similar to the .NET timer. In the example below when the timer is due MoveObject method will be called by the framework and it is guaranteed to respect the turn based concurrency, which means that no other actor methods or timer callbacks will be in progress when this callback is invoked. 

The next period of the timer starts after the callback returns. The framework will also try to save the state when the method returns if the Actor is a stateful actor like in this case below. If an error occurs in saving the state, that actor object will be deactivated and a new instance will be activated. A callback method that does not modify the actor state can be registered as a readonly timer callback in RegisterTimer.

```
    class VisualObjectActor : Actor<VisualObject>, IVisualObject
    {
        private IActorTimer _updateTimer;
 
        public override Task OnActivateAsync()
        {
         ...
 
            _updateTimer = RegisterTimer(
                MoveObject,                     // callback method
                null,                           // state to be passed to the callback method
                TimeSpan.FromMilliseconds(15),  // amount of time to delay before callback is invoked
                TimeSpan.FromMilliseconds(15)); // time interval between invocation of the callback method
 
            return base.OnActivateAsync();
        }
 
 
        public override Task OnDeactivateAsync()
        {
            if (_updateTimer != null)
            {
                UnregisterTimer(_updateTimer);
            }
 
            return base.OnDeactivateAsync();
        }
 
        private Task MoveObject(object state)
        {
 
          ...
            return TaskDone.Done;
        }
    }
```