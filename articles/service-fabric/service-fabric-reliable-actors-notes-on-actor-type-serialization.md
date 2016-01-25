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
   ms.date="11/13/2015"
   ms.author="vturecek"/>

# Notes on Service Fabric Reliable Actors type serialization

You should keep a few important aspects in mind when you define an actor's interface(s) and state. Types need to be data contract serializable. More information about data contracts [can be found on MSDN](https://msdn.microsoft.com/library/ms731923.aspx).

## Actor interface types

The arguments of all the methods, as well as the result types of the tasks returned by each method as defined in the [actor interface](service-fabric-reliable-actors-introduction.md#actors), need to be data contract serializable. This also applies to the arguments of the methods defined in [actor event interfaces](service-fabric-reliable-actors-events.md#actor-events). (Actor event interface methods always return void.)
For instance, if the `IVoiceMail` interface defines a method as:

```csharp

Task<List<Voicemail>> GetMessagesAsync();

```

`List<T>` is a standard .NET type that is already data contract serializable. The `Voicemail` type also needs to be data contract serializable.

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

## Actor state class

The actor's state needs to be data contract serializable. For example, an actor class definition can look like this:

```csharp

public class VoiceMailActor : StatefulActor<VoicemailBox>, IVoiceMail
{
...

```

The state class is going to be defined with the class, and its members will be annotated with the **DataContract** and **DataMember** attributes, respectively.

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
