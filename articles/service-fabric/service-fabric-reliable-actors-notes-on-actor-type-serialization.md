<properties
   pageTitle="Reliable Actors notes on actor type serialization | Microsoft Azure"
   description="Discusses basic requirements for defining serializable classes that can be used to define Service Fabric Reliable Actors states and interfaces"
   services="service-fabric"
   documentationCenter=".net"
   authors="vturecek"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/06/2015"
   ms.author="vturecek"/>

# Notes on Service Fabric Reliable Actors type serialization


The arguments of all methods, result types of the tasks returned by each method in an actor interface, and objects stored in an actor's State Manager must be [Data Contract serializable](https://msdn.microsoft.com/library/ms731923.aspx).. This also applies to the arguments of the methods defined in [actor event interfaces](service-fabric-reliable-actors-events.md#actor-events). (Actor event interface methods always return void.)

## Custom data types

In this example, the following actor interface defines a method that returns a custom data type called `VoicemailBox`.

```csharp
public interface IVoiceMailBoxActor : IActor
{
    Task<VoicemailBox> GetMailBoxAsync();
}
```

The interface is impelemented by an actor, which uses the State Manager to store a `VoicemailBox` object:

```csharp
[StatePersistence(StatePersistence.Persisted)]
public class VoiceMailBoxActor : Actor, IVoicemailBoxActor
{
    public Task<VoicemailBox> GetMailboxAsync()
    {
        return this.StateManager.GetStateAsync<VoicemailBox>("Mailbox");
    }
}

```

In this example, the `VoicemailBox` object is serialized when:
 - The object is transmitted between an actor instance and a caller.
 - The object is saved in the State Manager where it is persisted to disk and replicated to other nodes.
 
The Reliable Actor framework uses DataContract serialization. Therefore, the custom data objects and their members must be annotated with the **DataContract** and **DataMember** attributes, respectively

```csharp
[DataContract]
public class Voicemail
{
    [DataMember]
    public Guid Id { get; set; }

    [DataMember]
    public string Message { get; set; }

    [DataMember]
    public DateTime ReceivedAt { get; set; }
}
```

```csharp
[DataContract]
public class VoicemailBox
{
    public VoicemailBox()
    {
        this.MessageList = new List<Voicemail>();
    }

    [DataMember]
    public List<Voicemail> MessageList { get; set; }

    [DataMember]
    public string Greeting { get; set; }
}
```

## Next steps
 - [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
 - [Actor timers and reminders](service-fabric-reliable-actors-timers-reminders.md)
 - [Actor events](service-fabric-reliable-actors-events.md)
 - [Actor reentrancy](service-fabric-reliable-actors-reentrancy.md)
 - [Actor polymorphism and object-oriented design patterns](service-fabric-reliable-actors-polymorphism.md)
 - [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md)