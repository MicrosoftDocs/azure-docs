<properties
   pageTitle="Azure Service Fabric Actors Timers and Reminders"
   description="Introduction to Timers and Reminders for Azure Service Fabric Actors."
   services="service-fabric"
   documentationCenter=".net"
   authors="myamanbh"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/17/2015"
   ms.author="amanbha"/>


#Actor Timers
Actor timers provides a simple wrapper around .NET timer such that the callback methods respects the turn based concurrency guarantees provided by the actor framework.

The example below shows the use of timer APIs. The APIs are very similar to the .NET timer. In the example below when the timer is due MoveObject method will be called by the framework and it is guaranteed to respect the turn based concurrency, which means that no other actor methods or timer callbacks will be in progress when this callback is invoked.

The next period of the timer starts after the callback returns. The framework will also try to save the state when the method returns if the Actor is a stateful actor like in this case below. If an error occurs in saving the state, that actor object will be deactivated and a new instance will be activated. A callback method that does not modify the actor state can be registered as a readonly timer callback in RegisterTimer.

```csharp
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
## Actor Reminders
Fabric Actors provides reminders are a mechanism to trigger persistent callbacks on Actor. Reminders unlike Timers are triggered under all circumstances until the Reminder is explicitly unregistered by the Actor. Actors that need to provide support for reminders must implement IRemindable interface

```csharp
public interface IRemindable
{
    Task ReceiveReminderAsync(string reminderName, byte[] context, TimeSpan dueTime, TimeSpan  period);
}
```
When a reminder is triggered, Fabric Actors runtime will invoke ReceiveReminderAsync method on the Actor and pass in the context duetime and period parameters specified during registration.
To register a reminder an actor can call Register method provided on base class
```csharp
async Task<IActorReminder> RegisterReminder(string reminderName, byte[] context, TimeSpan dueTime, TimeSpan period, ActorReminderAttributes attribute);
```
 ReminderName parameter is a string that uniquely identifies the reminder for an Actor. Context contains any state that must be passed to ReceiveReminderAsync method. DueTime is the time span after which the first reminder fires and period is the time span for repeated reminder invocations.
ActorReminderAttributes specify if state must be saved after ReceiveReminderAsync method call returns from Actor. The attribute can have the following values

```csharp
public enum ActorReminderAttributes : long
{
    None = 0x00,
    ReadOnly = 0x01
}
```
A registered reminder will keep triggering for an Actor even after an actor has been garbage collected. To unregister a reminder Unregister method should be called.

```csharp
async Task UnregisterReminder(IActorReminder reminder);
```
