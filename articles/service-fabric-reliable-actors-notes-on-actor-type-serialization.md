<properties
   pageTitle="Azure Service Fabric Actors Notes on Actor type serialization"
   description="basic requirements for defining serializable classes that can be used to define Azure Fabric Reliable Actor state and interfaces"
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
   ms.date="03/02/2015"
   ms.author="claudioc"/>


# Notes on Azure Service Fabric Actors type serialization

There are few important aspects that needs to be kept in mind while defining the Actor's interface(s) and State: types need to be Data Contract serializable. More information about Data Contracts can be found on [MSDN](https://msdn.microsoft.com/library/ms731923.aspx).

## Types used in Actor Interface(s)

The arguments of all the methods and the result type of the task returned by each method defined in the [actor interface](service-fabric-fabact-introduction.md#actors) need to be data contract serializable. 
For instance, if the `IVoiceMail` interface defines a method as:

```csharp

Task<List<Voicemail>> GetMessagesAsync();

```

The `Voicemail` type needs to be Data Contract serializable.

In addition, the result type of the Task that is returned by each of these methods needs to be data contract serializable as well. 

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

The state class is going to be defined with the class and member annotated with the DataContract attributes

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
