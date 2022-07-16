---
title: Reliable Actors notes on actor type serialization 
description: Discusses basic requirements for defining serializable classes that can be used to define Service Fabric Reliable Actors states and interfaces
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Notes on Service Fabric Reliable Actors type serialization
The arguments of all methods, result types of the tasks returned by each method in an actor interface, and objects stored in an actor's state manager must be [data contract serializable](/dotnet/framework/wcf/feature-details/types-supported-by-the-data-contract-serializer). This also applies to the arguments of the methods defined in [actor event interfaces](service-fabric-reliable-actors-events.md). (Actor event interface methods always return void.)

## Custom data types
In this example, the following actor interface defines a method that returns a custom data type called `VoicemailBox`:

```csharp
public interface IVoiceMailBoxActor : IActor
{
    Task<VoicemailBox> GetMailBoxAsync();
}
```

```Java
public interface VoiceMailBoxActor extends Actor
{
    CompletableFuture<VoicemailBox> getMailBoxAsync();
}
```

The interface is implemented by an actor that uses the state manager to store a `VoicemailBox` object:

```csharp
[StatePersistence(StatePersistence.Persisted)]
public class VoiceMailBoxActor : Actor, IVoicemailBoxActor
{
    public VoiceMailBoxActor(ActorService actorService, ActorId actorId)
        : base(actorService, actorId)
    {
    }

    public Task<VoicemailBox> GetMailboxAsync()
    {
        return this.StateManager.GetStateAsync<VoicemailBox>("Mailbox");
    }
}

```

```Java
@StatePersistenceAttribute(statePersistence = StatePersistence.Persisted)
public class VoiceMailBoxActorImpl extends FabricActor implements VoicemailBoxActor
{
    public VoiceMailBoxActorImpl(ActorService actorService, ActorId actorId)
    {
         super(actorService, actorId);
    }

    public CompletableFuture<VoicemailBox> getMailBoxAsync()
    {
         return this.stateManager().getStateAsync("Mailbox");
    }
}

```

In this example, the `VoicemailBox` object is serialized when:

* The object is transmitted between an actor instance and a caller.
* The object is saved in the state manager where it is persisted to disk and replicated to other nodes.

The Reliable Actor framework uses DataContract serialization. Therefore, the custom data objects and their members must be annotated with the **DataContract** and **DataMember** attributes, respectively.

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
```Java
public class Voicemail implements Serializable
{
    private static final long serialVersionUID = 42L;

    private UUID id;                    //getUUID() and setUUID()

    private String message;             //getMessage() and setMessage()

    private GregorianCalendar receivedAt; //getReceivedAt() and setReceivedAt()
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
```Java
public class VoicemailBox implements Serializable
{
    static final long serialVersionUID = 42L;
    
    public VoicemailBox()
    {
        this.messageList = new ArrayList<Voicemail>();
    }

    private List<Voicemail> messageList;   //getMessageList() and setMessageList()

    private String greeting;               //getGreeting() and setGreeting()
}
```


## Next steps
* [Actor lifecycle and garbage collection](service-fabric-reliable-actors-lifecycle.md)
* [Actor timers and reminders](service-fabric-reliable-actors-timers-reminders.md)
* [Actor events](service-fabric-reliable-actors-events.md)
* [Actor reentrancy](service-fabric-reliable-actors-reentrancy.md)
* [Actor polymorphism and object-oriented design patterns](service-fabric-reliable-actors-polymorphism.md)
* [Actor diagnostics and performance monitoring](service-fabric-reliable-actors-diagnostics.md)
