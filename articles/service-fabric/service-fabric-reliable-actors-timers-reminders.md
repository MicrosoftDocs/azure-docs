<properties
   pageTitle="Reliable Actors timers and reminders | Microsoft Azure"
   description="Introduction to timers and reminders for Service Fabric Reliable Actors."
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
   ms.date="08/05/2015"
   ms.author="amanbha"/>


# Actor timers
Actor timers provide a simple wrapper around .NET timers, such that the callback methods respect the turn-based concurrency guarantees that the Actors runtime provides.

Actors can use the `RegisterTimer` and `UnregisterTimer` methods on their base class to register and unregister their timers. The example below shows the use of timer APIs. The APIs are very similar to the .NET timer. In the example, when the timer is due, the Actors runtime will call the `MoveObject` method. The method is guaranteed to respect the turn-based concurrency. This means that no other actor methods or timer/reminder callbacks will be in progress until this callback completes execution.

```csharp
class VisualObjectActor : StatefulActor<VisualObject>, IVisualObject
{
    private IActorTimer _updateTimer;

    protected override Task OnActivateAsync()
    {
        ...

        _updateTimer = RegisterTimer(
            MoveObject,                     // Callback method
            state,                          // State to pass to the callback method
            TimeSpan.FromMilliseconds(15),  // Amount of time to delay before the callback is invoked
            TimeSpan.FromMilliseconds(15)); // Time interval between invocations of the callback method

        return base.OnActivateAsync();
    }

    protected override Task OnDeactivateAsync()
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
        return Task.FromResult(true);
    }
}
```

The next period of the timer starts after the callback completes execution. This implies that the timer is stopped while the callback is executing and is started when the callback finishes.

The Actors runtime saves the actor state when the callback finishes if the actor is a stateful actor, as in the example above. If an error occurs in saving the state, that actor object will be deactivated and a new instance will be activated. A callback method that does not modify the actor state can be registered as a read-only timer callback by specifying the Readonly attribute on the timer callback. This is described in the section on [Readonly methods](service-fabric-reliable-actors-introduction.md#readonly-methods).

All timers are stopped when the actor is deactivated as part of garbage collection. No timer callbacks are invoked after that. Also, the Actors runtime does not retain any information about the timers that were running before deactivation. It is up to the actor to register any timers that it needs when it is reactivated in the future. For more information, see the section on [actor garbage collection](service-fabric-reliable-actors-lifecycle.md).

## Actor reminders
Reminders are a mechanism to trigger persistent callbacks on an actor at specified times. Their functionality is similar to timers. But unlike timers, reminders are triggered under all circumstances until the actor explicitly unregisters them. Specifically, reminders are triggered across actor deactivations and failovers because the Actors runtime persists information about the actor's reminders.

Reminders are supported for stateful actors only. Stateless actors cannot use reminders. The actor's state providers are responsible for storing information about the reminders that actors have registered.  

To register a reminder, an actor calls the `RegisterReminder` method provided on the base class, as shown in the example below.

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

In the example above, `"Pay cell phone bill"` is the reminder name. This is a string that the actor uses to uniquely identify a reminder. `BitConverter.GetBytes(amountInDollars)` is the context that is associated with the reminder. It will be passed back to the actor as an argument to the reminder callback, i.e. `IRemindable.ReceiveReminderAsync`.

Actors that use reminders must implement the `IRemindable` interface, as shown in the example below.

```csharp
public class ToDoListActor : StatefulActor<ToDoList>, IToDoListActor, IRemindable
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

When a reminder is triggered, the Fabric Actors runtime will invoke the  `ReceiveReminderAsync` method on the Actor. An actor can register multiple reminders, and the `ReceiveReminderAsync` method is invoked when any of those reminders is triggered. The actor can use the reminder name that is passed in to the `ReceiveReminderAsync` method to figure out which reminder was triggered.

The Actors runtime saves the actor state when the `ReceiveReminderAsync` call finishes. If an error occurs in saving the state, that actor object will be deactivated and a new instance will be activated. To specify that the state need not be saved upon completion of the reminder callback, the `ActorReminderAttributes.ReadOnly` flag can be set in the `attributes` parameter when the `RegisterReminder` method is called to create the reminder.

To unregister a reminder, an actor calls the `UnregisterReminder` method, as shown in the example below.

```csharp
IActorReminder reminder = GetReminder("Pay cell phone bill");
Task reminderUnregistration = UnregisterReminder(reminder);
```

As shown above, the `UnregisterReminder` method accepts an `IActorReminder` interface. The actor base class supports a `GetReminder` method that can be used to retrieve the `IActorReminder` interface by passing in the reminder name. This is convenient because the actor does not need to persist the `IActorReminder` interface that was returned from the `RegisterReminder` method call.
