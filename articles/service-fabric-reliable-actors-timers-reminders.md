<properties
   pageTitle="Azure Service Fabric Actors Timers and Reminders"
   description="Introduction to Timers and Reminders for Azure Service Fabric Actors."
   services="service-fabric"
   documentationCenter=".net"
   authors="jessebenson"
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


# Actor Timers
Actor timers provide a simple wrapper around .NET timer such that the callback methods respect the turn-based concurrency guarantees provided by the Actors runtime.

Actors can use the `RegisterTimer` and `UnregisterTimer` methods on their base class to register and unregister their timers. The example below shows the use of timer APIs. The APIs are very similar to the .NET timer. In the example below when the timer is due the `MoveObject` method will be called by the Actors runtime and it is guaranteed to respect the turn-based concurrency, which means that no other actor methods or timer/reminder callbacks will be in progress until this callback completes execution.

```csharp
class VisualObjectActor : Actor<VisualObject>, IVisualObject
{
    private IActorTimer _updateTimer;

    public override Task OnActivateAsync()
    {
        ...

        _updateTimer = RegisterTimer(
            MoveObject,                     // callback method
            callback method
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

The next period of the timer starts after the callback completes execution. This implies that the timer is stopped while the callback is executing and is started when the callback has completed.

The Actors runtime saves the actor state when the callback completes if the Actor is a stateful actor like in the example above. If an error occurs in saving the state, that actor object will be deactivated and a new instance will be activated. A callback method that does not modify the actor state can be registered as a read-only timer callback by specifying the Readonly attribute on the timer callback, as described in the section on [readonly methods](service-fabric-reliable-actors-introduction.md#readonly-methods).

All timers are stopped when the actor is deactivated as part of garbage collection and no timer callbacks are invoked after that. Also, the Actors runtime does not retain any information about the timers that were running before deactivation. It is up to the actor to register any timers that it needs when it is reactivated in the future. For more information, please see the section on [actor garbage collection](service-fabric-reliable-actors-lifecycle.md).

## Actor Reminders
Reminders are a mechanism to trigger persistent callbacks on an Actor at specified times. Their functionality is similar to timers, but unlike timers reminders are triggered under all circumstances until the Reminder is explicitly unregistered by the Actor. Specifically, reminders are triggered across actor deactivations and failovers because the Actors runtime persists information about the actor's reminders.

Reminders are supported for stateful actors only. Stateless actors cannot use reminders. The actors state providers are responsible for storing information about the reminders that have been registered by actors.  

To register a reminder an actor calls the `RegisterReminder` method provided on base class, as shown in the example below.

```csharp
string task = "Pay cell phone bill";
int amountInDollars = 100;
Task<IActorReminder> reminderRegistration = RegisterReminder(
                                                task,
                                                BitConverter.GetBytes(amountInDollars),
                                                TimeSpan.FromDays(3),
                                                TimeSpan.FromDays(1),
                                                ActorReminderAttributes.None);
```

In the example above, `"Pay cell phone bill"` is the reminder name, which is a string that the actor uses to uniquely identify a reminder. `BitConverter.GetBytes(amountInDollars)` is the context that is associated with the reminder. It will be passed back to the actor as an argument to the reminder callback, i.e. `IRemindable.ReceiveReminderAsync`.

Actors that use reminders must implement `IRemindable` interface, as shown in the example below.

```csharp
public class ToDoListActor : Actor<ToDoList>, IToDoListActor, IRemindable
{
    public Task ReceiveReminderAsync(string reminderName, byte[] context, TimeSpan dueTime, TimeSpan period)
    {
        if (reminderName.Equals("Pay cell phone bill"))
        {
            int amountToPay = BitConverter.ToInt32(context, 0);
            System.Console.WriteLine("Please pay your cell phone bill of ${0}!", amountToPay);
        }
        return Task.FromResult(true);
    }
}
```

When a reminder is triggered, Fabric Actors runtime will invoke `ReceiveReminderAsync` method on the Actor. An actor can register multiple reminders and the `ReceiveReminderAsync` method is invoked any time any of those reminders is triggered. The actor can use the reminder name that is passed in to the `ReceiveReminderAsync` method to figure out which reminder was triggered.

The Actors runtime saves the actor state when the `ReceiveReminderAsync` call completes. If an error occurs in saving the state, that actor object will be deactivated and a new instance will be activated. To specify that the state need not be saved upon completion of the reminder callback, the `ActorReminderAttributes.ReadOnly` flag can be set in the `attributes` parameter when the `RegisterReminder` method is called to create the reminder.

To unregister a reminder, the `UnregisterReminder` method should be called, as shown in the example below.

```csharp
IActorReminder reminder = GetReminder("Pay cell phone bill");
Task reminderUnregistration = UnregisterReminder(reminder);
```

As shown above, the `UnregisterReminder` method accepts an `IActorReminder` interface. The actor base class supports a `GetReminder` method that can be used to retrieve the `IActorReminder` interface by passing in the reminder name. This is convenient because the actor does not need to persist the `IActorReminder` interface that was returned from the `RegisterReminder` method call.
