# Unit Testing Considerations in Stateful Services
While developing unit tests for stateful services, each there are some special considerations that should be kept in mind.
1. Each replica executes application code but under different context. If the service uses 3 replicas, the service code is executing on 3 nodes in parallel under different context/role.
2. State stored within the stateful service should be consistent amongst all replicas. The state manager and reliable collections will provide this consistentcy out-of-the-box. However, in-memory state will need to be managed by the application code.
3. Each replica will change roles at some point while running on the cluster. A secondary replica will become a primary, in the event that the node hosting the primary becomes unavailable or overloaded. This is natural behavior for service fabric therefore services must plan for eventually executing under a different role.

This article assumes the following conceptual documentation has been read:

*TODO: Link back to conceptual article indicating this article assumes the consumer has read it as those concepts will be applied here.*

# ServiceFabric.Mocks
As of version 3.3.0, [ServiceFabric.Mocks](https://www.nuget.org/packages/ServiceFabric.Mocks/) provides an api for mocking both the orchestration of the replicas and the state management. This will be used in the examples.

[Nuget](https://www.nuget.org/packages/ServiceFabric.Mocks/)
[Github](https://github.com/loekd/ServiceFabric.Mocks)

*ServiceFabric.Mocks is not owned or maintained by Microsoft. However, this is currently the Microsoft recommended library for unit testing stateful services.*

# Setting up the Mock Orchestration & State
As part of the arrange portion of a test, a mock replica set and state manager will be created. The replica set will then own creating an instance of the tested service for each replica. It will also own executing lifecycle events such as `OnChangeRole` and `RunAsync`. The mock state manager will ensure any operations performed against the state manager are run and kept as the actual state manager would.

1. Create a service factory delegate that will instantiate the service being tested. This should be similar or same as the service factory callback typically found in `Program.cs` for a service fabric service or actor. This should follow the following signature:
```csharp
MyStatefulService CreateMyStatefulService(StatefulServiceContext context, IReliableStateManagerReplica2 stateManager)
```
2. Create an instance of `MockReliableStateManager` class. This will mock all interactions with the state manager.
3. Create an instance of `MockStatefulServiceReplicaSet<TStatefulService>` where `TStatefulService` is the type of the service being tested. This will require the delegate created in step #1 and the state manager instantiated in #2
4. Add Replicas to the Replica Set. Specify the role (i.e. Primary, ActiveSecondary, IdleSecondary) and the id of the replica
> Hold on to the replica id's! These will likely be used during the act and assert portions of a unit test.

```csharp
//service factory to instruct how to create the service instance
var serviceFactory = (StatefulServiceContext context, IReliableStateManagerReplica2 stateManager) => new MyStatefulService(context, stateManager);
//instantiate a new mock state manager
var stateManager = new MockReliableStateManager();
//instantiate a new replica set with the service factory and state manager
var replicaSet = new MockStatefulServiceReplicaSet<MyStatefulService>(CreateStatefulService, stateManager);
//add a new Primary replica with id 1
await replicaSet.AddReplicaAsync(ReplicaRole.Primary, 1);
//add a new ActiveSecondary replica with id 2
await replicaSet.AddReplicaAsync(ReplicaRole.ActiveSecondary, 2);
//add a second ActiveSecondary replica with id 3
await replicaSet.AddReplicaAsync(ReplicaRole.ActiveSecondary, 3);
```

# Executing Service Requests
Service requests can be executed on a specific replica using the convience properties and lookups.
```csharp
const string stateName = "test";
var payload = new Payload(StatePayload);

//execute a request on the primary replica using
await replicaSet.Primary.ServiceInstance.InsertAsync(stateName, payload);

//execute a request against replica with id 2
await replicaSet[2].ServiceInstance.InsertAsync(stateName, payload);

//execute a request against one of the active secondary replicas
await replicaSet.FirstActiveSecondary.InsertAsync(stateName, payload);
```

# Execute A Service Move
The mock replica set exposes several convienence methods to trigger different types of service moves.
```csharp
//promote the first active secondary to primary
replicaSet.PromoteNewReplicaToPrimaryAsync();
//promote the secondary with replica id 4 to primary
replicaSet.PromoteNewReplicaToPrimaryAsync(4);

//promote the first idle secondary to an active secondary
PromoteIdleSecondaryToActiveSecondaryAsync();
//promote idle secodary with replica id 4 to active secondary 
PromoteIdleSecondaryToActiveSecondaryAsync(4);

//add a new replica with randomly assigned replica id and promote it to primary
PromoteNewReplicaToPrimaryAsync()
//add a new replica with replica id 4 and promote it to primary
PromoteNewReplicaToPrimaryAsync(4)
```

# Putting It All Together
The following test demonstrates setting up a 3 node replica set and verifying that the data is available from a secondary after a role change. A typical issue this may catch is if the data added during `InsertAsync` was saved either to something in-memory or to a reliable collection without running `CommitAsync`. In either case, the secondary would be out of sync with the primary. This would lead to inconsistent responses after service moves.

```csharp
[TestMethod]
public async Task TestServiceState_InMemoryState_PromoteActiveSecondary()
{
    var stateManager = new MockReliableStateManager();
    var replicaSet = new MockStatefulServiceReplicaSet<MyStatefulService>(CreateStatefulService, stateManager);
    await replicaSet.AddReplicaAsync(ReplicaRole.Primary, 1);
    await replicaSet.AddReplicaAsync(ReplicaRole.ActiveSecondary, 2);
    await replicaSet.AddReplicaAsync(ReplicaRole.ActiveSecondary, 3);

    const string stateName = "test";
    var payload = new Payload(StatePayload);

    //insert data
    await replicaSet.Primary.ServiceInstance.InsertAsync(stateName, payload);
    //promote one of the secondaries to primary
    await replicaSet.PromoteActiveSecondaryToPrimaryAsync(2);
    //get data
    var payloads = (await replicaSet.Primary.ServiceInstance.GetPayloadsAsync()).ToList();

    //data should match what was inserted against the primary
    Assert.IsTrue(payloads.Count == 1);
    Assert.IsTrue(payloads[0].Content == payload.Content);

    //verify the data was saved against the reliable dictionary
    var dictionary = await StateManager.GetOrAddAsync<IReliableDictionary<string, Payload>>(MyStatefulService.StateManagerDictionaryKey);
    using(var tx = StateManager.CreateTransaction())
    {
        var payload = await dictionary.TryGetValue(stateName);
        Assert.IsTrue(payload.HasValue);
        Assert.IsTrue(payload.Value.Content == payload.Content);
    }
}
```
