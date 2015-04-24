<properties
   pageTitle="Azure Service Fabric Actors Distributed Networks and Graphs design pattern"
   description="Design pattern on how Service Fabric Actors can be used to model application as distributed networks and graphs"
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
   ms.author="claudioc"/>

# Service Fabric Actors design pattern: distributed networks and graphs
Azure Fabric Service Actors is a natural fit for modeling complex solutions involving relations and modeling those relations as objects.  

![][1]

As the diagram illustrates it is straightforward to model a user as an actor instance (node in the network). For example, the “Friends Feed” (sometimes referred as the "follower" problem) allows users to view status updates from people they are connected to, similar to how Facebook and Twitter work.
The Actor model provides flexibility to approach the materialization problem. We can populate the Friends Feed at event time, updating the Friends Feed of all my friends at the moment an update is posted, as illustrated below:

![][2]


## Smart Cache code sample – Social Network Friends Feed (event time)

Sample code populating Friends Feed:

```csharp
public interface ISocialPerson : IActor
{
    Task AddFriend(long person);
    Task RemoveFriend(long person);
    Task<List<SocialStatus>> GetFriendsFeed();
    Task<SocialStatus> GetStatus();
    Task<List<SocialStatus>> GetMyFeed();
    Task UpdateStatus(string status);
    Task UpdateFriendFeedAsync(SocialStatus status);
}

[DataContract]
Public class SocialPersonState
{
    [DataMember]
    public string _name; // my name
    [DataMember]
    public List<long> _friends; // list of my friends' IDs
    [DataMember]
    public List<SocialStatus> _friendsFeed; // my friends feeds
    [DataMember]
    public List<SocialStatus> _myFeed; // this is my feed, all my status updates
    [DataMember]
    public SocialStatus _lastStatus; // this is my last update
}

public class SocialPerson : Actor, ISocialPerson
{
    public override Task ActivateAsync()
    {
        CreateOrRestoreState();
        return base.ActivateAsync();
    }

    public Task AddFriend(long person)
    {
        State._friends.Add(person);
        return TaskDone.Done;
    }

    public Task RemoveFriend(long person)
    {
        State._friends.Remove(person);
        return TaskDone.Done;
    }

    public Task<List<SocialStatus>> GetFriendsFeed()
    {
        return Task.FromResult(State._friendsFeed);
    }

    public Task UpdateStatus(string status)
    {
        State._lastStatus = new SocialStatus()
        {
            Name = _name,
            Status = status,
            Timestamp = DateTime.UtcNow
        };
        State._myFeed.Add(_lastStatus);

        var taskList = new List<Task>();

        foreach(var friendId in _friends)
        {
            var friend = ActorProxy.Create<ISocialPerson>(friendId);
            taskList.Add(friend.UpdateFriendFeedAsync(_lastStatus));
        }

        return Task.WhenAll(taskList);
    }

    public Task UpdateFriendFeed(SocialStatus status)
    {
        State._friendsFeed.Add(status);

        return TaskDone.Done;
    }

    public Task<SocialStatus> GetStatus()
    {
        return Task.FromResult(State._lastStatus);
    }

    public Task<List<SocialStatus>> GetMyFeed()
    {
        return Task.FromResult(State._myFeed);
    }
}
```

Alternatively we can model our Actors to fan out and compile the Friends Feed at the query timer, in other words when the user asks for their friends feed. Another method we can use is materializing the Friends Feed on a timer, for example, every 5 minutes. Or, we can optimize the model and combine both event time and query time processing with a timer-based model depending on user habits, such as how often they login or post an update.
When modelling an actor in a social network, one should also consider “super users,” users with millions of followers. Developers should model the state and behaviour of such users differently to meet the demand.
Similarly, if we want to model an activity that connects many user actors to a single activity actor (hub and spoke) that can be done as well. Group chat or game hosting scenarios are two examples.
Let’s take the group chat example; a set of participants create a group chat actor that can distribute messages from one participant to the group as in the example below:

## Smart Cache code sample – GroupChat

```csharp
public interface IGroupChat : IActor
{
    Task PublishMessageAsync(long participantId, string message);
    Task<List<GroupChatMessage>> GetMessagesAsync();
    Task AddParticipantAsync(long participantId);
    Task RemoveParticipantAsync(long partitipantId);
}

[DataContract]
public class GroupChatParticipantState
{
    [DataMember]
    Public long _groupChatId;
    [DataMember]
    public List<GroupChatMessage> _messages;
}

public class GroupChatParticipant : Actor<GroupChatParticipantState>, IGroupParticipant
{
    public Task SendMessageAsync(string message)
    {
        if (State._groupChatId != -1)
        {
            var groupChat = ActorProxy.Create<IGroupChat>(State._groupChatId);
            return groupChat.PublishMessageAsync(this.Id, message);
        }

        return TaskDone.Done;
    }

    ...
}

[DataContract]
public class GroupChatState
{
    [DataMember]
    Public List<long> _participants;
    [DataMember]
    Public List<GroupChatMessage> _messages;
}


public class GroupChat : Actor<GroupChatState>, IGroupChat
{

public Task PublishMessageAsync(long participantId, string message)
{
    var chatMessage = new GroupChatMessage()
    {
        ParticipantId = participantId,
        Message = message,
        Timestamp = DateTime.Now
    };

    State._messages.Add(chatMessage);

    var taskList = new List<Task>();

    foreach(var id in State._participants)
    {
        if (id != participantId)
        {
            var participant = ActorProxy.Create<IGroupParticipant>.Create(id);
            taskList.Add(participant.ReceiveMessageAsync(chatMessage));
        }
    }
    return Task.WhenAll(taskList);
}

...

}
```

All it really does is leverage Reliable Actors' ability to allow any actor to address any other actor in the cluster by id and communicate with it without needing to worry about placement, addressing, caching, messaging, serialization, or routing.

## Next Steps
[Pattern: Smart Cache](service-fabric-reliable-actors-pattern-smartcache.md)

[Pattern: Resource Governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful Service Composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed Computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some Anti-patterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors/distributedNetworks_arch1.png
[2]: ./media/service-fabric-reliable-actors/distributedNetworks_arch2.png
