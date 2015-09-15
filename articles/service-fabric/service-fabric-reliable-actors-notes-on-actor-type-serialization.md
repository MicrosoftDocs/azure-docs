<properties
   pageTitle="Reliable Actors Notes on Actor type serialization"
   description="Discusses basic requirements for defining serializable classes that can be used to define Service Fabric Reliable Actor state and interfaces"
   services="service-fabric"
   documentationCenter=".net"
   authors="clca"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="08/11/2015"
   ms.author="claudioc"/>

# Notes on Service Fabric Reliable Actors type serialization

There are few important aspects that needs to be kept in mind while defining the Actor's interface(s) and State: types need to be Data Contract serializable. More information about Data Contracts can be found on [MSDN](https://msdn.microsoft.com/library/ms731923.aspx).

## Types used in Actor Interface(s)

The arguments of all the methods and the result type of the task returned by each method defined in the [actor interface](service-fabric-reliable-actors-introduction.md#actors) need to be data contract serializable. This also applies to the arguments of methods defined in [actor event interfaces](service-fabric-reliable-actors-events.md#actor-events). (Actor event interface methods always return void).
For instance, if the `IVoiceMail` interface defines a method as:

```csharp

Task<List<Voicemail>> GetMessagesAsync();

```

`List<T>` is a standard .NET type that is already Data Contract serializable. The `Voicemail` type needs to be Data Contract serializable.

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

## Actor State class

The actor state needs to be data contract serializable. For instance if we have an Actor class definition that looks like:

```csharp

public class VoiceMailActor : Actor<VoicemailBox>, IVoiceMail
{
...

```

The state class is going to be defined with the class and its members annotated with the DataContract and DataMember attributes respectively.

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
