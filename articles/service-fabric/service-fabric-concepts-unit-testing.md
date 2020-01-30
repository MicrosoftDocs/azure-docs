---
title: Unit testing stateful services in Azure Service Fabric 
description: Learn about the concepts and practices of unit testing Service Fabric Stateful Services.

ms.topic: conceptual
ms.date: 09/04/2018
---
# Unit testing stateful services in Service Fabric

This article covers the concepts and practices of unit testing Service Fabric Stateful Services. Unit testing within Service Fabric deserves its own considerations due to the fact that the application code actively runs under multiple different contexts. This article describes the practices used to ensure application code is covered under each of the different contexts it can run.

## Unit testing and mocking
Unit testing in the context of this article is automated testing that can be executed within the context of a test runner such as MSTest or NUnit. The unit tests within this article do not perform operations against a remote resource such as a database or RESTFul API. These remote resources should be mocked. Mocking in the context of this article will fake, record, and control the return values for remote resources.

### Service Fabric considerations
Unit testing a Service Fabric stateful service has several considerations. Firstly, the service code executes on multiple nodes but under different roles. Unit tests should evaluate the code under each role to achieve complete coverage. The different roles would be Primary, Active Secondary, Idle Secondary, and Unknown. The None role does not typically need any special coverage as Service Fabric considers this role to be void or null service. Secondly, each node will change its role at any given point. To achieve complete coverage, code execution path's should be tested with role changes occurring.

## Why unit test stateful services? 
Unit testing stateful services can help to uncover some common mistakes that are made that would not necessarily be caught by conventional application or domain-specific unit testing. For example, if the stateful service has any in-memory state, this type of testing can verify that this in-memory state is kept in sync across each replica. This type of testing can also verify that a stateful service responds to cancellation tokens passed in by the Service Fabric orchestration appropriately. When cancellations are triggered, the service should halt any long running and/or asynchronous operations.  

## Common practices

The following section advises on the most common practices for unit testing a stateful service. It also advises what a mocking layer should have to closely align to the Service Fabric orchestration and state management. [ServiceFabric.Mocks](https://www.nuget.org/packages/ServiceFabric.Mocks/) as of 3.3.0 or later is one such library that provides the mocking functionality recommended and follows the practices outlined below.

### Arrangement

#### Use multiple service instances
Unit tests should execute multiple instances of a stateful service. This simulates what actually happens on the cluster where Service Fabric provisions multiple replicas running your service across different nodes. Each of these instances will be executing under a different context however. When running the test, each instance should be primed with the role configuration expected on the cluster. For example, if the service is expected to have target replica size of 3, Service Fabric would provision three replicas on different nodes. One of which being the primary and the other two being Active Secondary's.

In most cases, the service execution path's will vary slightly for each of these roles. For example, if the service should not accept requests from an Active Secondary, the service may have a check for this case to throw back an informative exception that indicates a request was attempted on a secondary. Having multiple instances will allow this situation to be tested.

Additionally, having multiple instances allows the tests to switch the roles of each of these instances to verify the responses are consistent despite the role changes.

#### Mock the state manager
The State Manager should be treated as a remote resource and therefore mocked. When mocking the state manager, there needs to be some underlying in-memory storage for tracking what is saved to the state manager so that it can be read and verified. A simple way to achieve this is to create mock instances of each of the types of Reliable Collections. Within those mocks, use a data type that closely aligns with the operations performed against that collection. The following are some suggested data types for each reliable collection

- IReliableDictionary<TKey, TValue> -> System.Collections.Concurrent.ConcurrentDictionary<TKey, TValue>
- IReliableQueue\<T> -> System.Collections.Generic.Queue\<T>
- IReliableConcurrentQueue\<T> -> System.Collections.Concurrent.ConcurrentQueue\<T>

#### Many State Manager Instances, single storage
As mentioned before, the State Manager and Reliable Collections should be treated as a remote resource. Therefore, these resources should and will be mocked within the unit tests. However, when running multiple instances of a stateful service it will be a challenge to keep each mocked state manager in sync across different stateful service instances. When the stateful service is running on the cluster, the Service Fabric takes care of keeping each secondary replica's state manager consistent with the primary replica. Therefore, the tests should behave the same so that they can simulate role changes.

A simple way this synchronization can be achieved, is to use a singleton pattern for the underlying object that stores the data written to each Reliable Collection. For example, if a stateful service is using an `IReliableDictionary<string, string>`. The mock state manager should return a mock of `IReliableDictionary<string, string>`. That mock may use a `ConcurrentDictionary<string, string>` to keep track of the key/value pairs written. The `ConcurrentDictionary<string, string>` should be a singleton used by all instances of the state managers passed to the service.

#### Keep track of cancellation tokens
Cancellation tokens are an important yet commonly overlooked aspect of stateful services. When Service Fabric starts up a primary replica for a stateful service, a cancellation token is provided. This cancellation token is intended to signal to the service when it is removed or demoted to a different role. The stateful service should stop any long running or asynchronous operations so that Service Fabric can complete the role change workflow.

When running the unit tests, any cancellation tokens that are provided to RunAsync, ChangeRoleAsync, OpenAsync, and CloseAsync should be held during the test execution. Holding onto these tokens will allow the test to simulate a service shutdown or demotion and verify the service responds appropriately.

#### Test end-to-end with mocked remote resources
Unit tests should execute as much of the application code that can modify the state of the stateful service as possible. It's recommended that the tests be more end-to-end in nature. The only mocks that exist are to record, simulate, and/or verify remote resource interactions. This includes interactions with the State Manager and Reliable Collections. The following snippet is an example of gherkin for a test that demonstrates end-to-end testing:

```
	Given stateful service named "fabric:/MyApp/MyService" is created
	And a new replica is created as "Primary" with id "111"
	And a new replica is created as "IdleSecondary" with id "222"
    And a new replica is created as "IdleSecondary" with id "333"
	And all idle secondary replicas are promoted to active secondary
	When a request is made to add the an employee "John Smith"
    And the active secondary replica "222" is promoted to primary
    And a request is made to get all employees
	Then the request should should return the "John Smith" employee
```

This test asserts that the data being captured on one replica is available to a secondary replica when it is promoted to primary. Assuming that a reliable collection is the backing store for the employee data, Aa potential failure that could be caught with this test is if the application code did not execute `CommitAsync` on the transaction to save the new employee. In that case, the second request to get employees would not return employee added by the first request.

### Acting
#### Mimic Service Fabric replica orchestration
When managing multiple service instances, the tests should initialize and tear down these services in the same manner as the Service Fabric orchestration. For example, when a service is created on a new primary replica, Service Fabric will invoke CreateServiceReplicaListener, OpenAsync, ChangeRoleAsync, and RunAsync. The lifecycle events are documented in the following articles:

- [Stateful Service Startup](service-fabric-reliable-services-lifecycle.md#stateful-service-startup)
- [Stateful Service Shutdown](service-fabric-reliable-services-lifecycle.md#stateful-service-shutdown)
- [Stateful Service Primary Swaps](service-fabric-reliable-services-lifecycle.md#stateful-service-primary-swaps)

#### Run replica role changes
The unit tests should change the roles of the service instances in the same manner as the Service Fabric orchestration. The role state machine is documented in the following article:

[Replica Role State Machine](service-fabric-concepts-replica-lifecycle.md#replica-role)

Simulating role changes is one of the more critical aspects of testing and can uncover issues where the replica's state are not consistent with each other. Inconsistent replica state can occur due to storing in-memory state in static or class level instance variables. Examples of this may be cancellation tokens, enums, and configuration objects/values. This will also ensure that the service is respecting the cancellation tokens provided during RunAsync to allow the role change to occur. Simulating role changes can also uncover issues that may arise if code is not written to allow an invocation of RunAsync multiple times.

#### Cancel cancellation tokens
There should exist unit tests where the cancellation token provided to RunAsync is canceled. This will allow the test to verify that the service gracefully shuts down. During this shut down any long running or asynchronous operations should be stopped. Example of a long running process that may exist on a service is one that listens for messages on a Reliable Queue. This may exist directly within RunAsync or a background thread. The implementation should include logic for exiting the operation if this cancellation token is canceled.

If the stateful services make use of any cache or in-memory state that should only exist on the primary, it should be disposed at this time. This is to ensure that this state is consistent if the node becomes a primary again later. Cancellation testing will allow the test to verify this state is disposed properly.

#### Execute requests against multiple replicas
Assert tests should execute the same request against different replica's. When paired with role changes, consistency issues can be uncovered. An example test may perform the following steps:
1. Execute a write request against the current primary
2. Execute a read request that returns the data written in step 1 against current primary
3. Promote a secondary to primary. This should also demote the current primary to secondary
4. Execute the same read request from step 2 against the new secondary.

In the last step, the test can assert the data returned is consistent. A potential issue that this could uncover is that the data being returned by the service may be in memory but backed ultimately by a reliable collection. That in-memory data may not being kept in sync properly with what exists in the reliable collection.

In-memory data is typically used to create secondary indexes or aggregations of data that exists in a reliable collection.

### Asserting
#### Ensure responses match across replicas
Unit tests should assert that a response for a given request is consistent across multiple replicas after they transition to primary. This can surface potential issues where data provided in the response is either not backed by a reliable collection, or kept in-memory without a mechanism to synchronize that data across replicas. This will ensure that the service sends back consistent responses after Service Fabric rebalances or fails over to a new primary replica.

#### Verify service respects cancellation
Long-running or asynchronous processes that should be terminated when a cancellation token is canceled should be verified that they actually terminated after cancellation. This will ensure that despite the replica changing roles, processes that are not intended to keep running on non-primary replica stop before the transition completes. This can also uncover issues where such a process blocks a role change or shutdown request from Service Fabric from completing.

#### Verify which replicas should serve requests
The tests should assert the expected behavior if a request is routed to a non-primary replica. Service Fabric does provide the ability to have secondary replicas serve requests. However, writes to reliable collections can only occur from the primary replica. If your application intends for only primary replicas to serve requests or, only a subset of requests can be handled by a secondary, then the tests should assert the expected behavior for both the positive and negative cases. The negative case being a request is routed to a replica that should not handle the request and, the positive being the opposite.

## Next steps
Learn how to [unit test stateful services](service-fabric-how-to-unit-test-stateful-services.md).
