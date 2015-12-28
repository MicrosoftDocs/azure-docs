<properties
   pageTitle="Distributed networks and graphs pattern | Microsoft Azure"
   description="The design pattern for how Service Fabric Reliable Actors can be used to model applications as distributed networks and graphs."
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
   ms.date="09/29/2015"
   ms.author="claudioc"/>

# Reliable Actors design pattern: Distributed networks and graphs
Azure Service Fabric Reliable Actors are a natural fit for modeling complex solutions involving relations and for modeling those relations as objects.  

![Azure Service Fabric Reliable Actors modeling][1]

As the diagram above illustrates, modeling a user as an Actor instance (a node in the network) is straightforward. For example, the “Friends Feed” (sometimes referred to as the "follower" problem) allows users to view status updates from people they are connected to, similar to the way Facebook and Twitter work.

The Actor model provides a flexible approach to the materialization problem. We can populate the Friends Feed at event time, updating the Friends Feed of all friends at the moment an update is posted, as illustrated below:

![The Reliable Actor model and Friends Feed population][2]


## Smart Cache code sample: Social network Friends Feed (event time)

Sample code for populating the Friends Feed:

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

public class SocialPerson : StatefulActor<SocialPersonState>, ISocialPerson
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

Alternatively, you can model Actors to fan out and compile the Friends Feed at the query timer, when the user asks for the Friends Feed. You can also materialize the Friends Feed on a timer (for example, every five minutes). Or you can optimize the model and combine both event-time and query-time processing with a timer-based model that's dependent on user habits, such as how often they log in or post an update.

When you model an Actor in a social network, you should also consider “super users,” those users with millions of followers. Developers should model the state and behavior of such users differently to meet the greater demand.

Similarly, if you want to model an activity that connects many user Actors to a single activity Actor (hub and spoke), you can do that as well. Group-chat and game-hosting scenarios are two examples.
Let’s look at the group chat example. A set of participants creates a group chat Actor that can distribute messages from one participant to the group. This is shown in the example below:

## Smart Cache code sample: Group chat

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

public class GroupChatParticipant : StatefulActor<GroupChatParticipantState>, IGroupParticipant
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


public class GroupChat : StatefulActor<GroupChatState>, IGroupChat
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

This approach leverages Reliable Actors' ability to allow any Actor to address any other Actor in the cluster by ID and communicate with it without needing to worry about placement, addressing, caching, messaging, serialization, or routing.

## Next steps
[Pattern: Smart cache](service-fabric-reliable-actors-pattern-smart-cache.md)

[Pattern: Resource governance](service-fabric-reliable-actors-pattern-resource-governance.md)

[Pattern: Stateful service composition](service-fabric-reliable-actors-pattern-stateful-service-composition.md)

[Pattern: Internet of Things](service-fabric-reliable-actors-pattern-internet-of-things.md)

[Pattern: Distributed computation](service-fabric-reliable-actors-pattern-distributed-computation.md)

[Some antipatterns](service-fabric-reliable-actors-anti-patterns.md)

[Introduction to Service Fabric Actors](service-fabric-reliable-actors-introduction.md)


<!--Image references-->
[1]: ./media/service-fabric-reliable-actors-pattern-distributed-networks-and-graphs/distributedNetworks_arch1.png
[2]: ./media/service-fabric-reliable-actors-pattern-distributed-networks-and-graphs/distributedNetworks_arch2.png
