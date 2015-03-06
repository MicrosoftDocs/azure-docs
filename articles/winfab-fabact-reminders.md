<properties 
   pageTitle="FabAct Reminders" 
   description="Introduction to FabAct Reminders" 
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

#FabAct Reminders
FabAct provides reminders are a mechanism to trigger persistent callbacks on Actor. Reminders unlike Timers are triggered under all circumstances until the Reminder is explicitly unregistered by the Actor. Actors that need to provide support for reminders must implement IRemindable interface

```
public interface IRemindable
{
    Task ReceiveReminderAsync(string reminderName, byte[] context, TimeSpan dueTime, TimeSpan  period);
}
```
When a reminder is triggered, FabAct runtime will invoke ReceiveReminderAsync method on the Actor and pass in the context duetime and period parameters specified during registration. 
To register a reminder an actor can call Register method provided on base class
```
async Task<IActorReminder> RegisterReminder(string reminderName, byte[] context, TimeSpan dueTime, TimeSpan period, ActorReminderAttributes attribute);
```
 ReminderName parameter is a string that uniquely identifies the reminder for an Actor. Context contains any state that must be passed to ReceiveReminderAsync method. DueTime is the time span after which the first reminder fires and period is the time span for repeated reminder invocations.
ActorReminderAttributes specify if state must be saved after ReceiveReminderAsync method call returns from Actor. The attribute can have the following values

```
public enum ActorReminderAttributes : long
{
    None = 0x00,
    ReadOnly = 0x01
}
```
A registered reminder will keep triggering for an Actor even after an actor has been garbage collected. To unregister a reminder Unregister method should be called.

```
async Task UnregisterReminder(IActorReminder reminder);
```
