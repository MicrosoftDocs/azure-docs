# Unit Testing Stateful Services

- [Unit Testing Stateful Services](#unit-testing-stateful-services)
    - [Unit Testing & Mocking](#unit-testing-mocking)
        - [Service Fabric Considerations](#service-fabric-considerations)
    - [Why Unit Test Stateful Services](#why-unit-test-stateful-services)
    - [Common Practices](#common-practices)
        - [Arrangement](#arrangement)
            - [Use Multiple Service Instances](#use-multiple-service-instances)
            - [Mock The State Manager](#mock-the-state-manager)
            - [Many State Manager Instances, Single Storage](#many-state-manager-instances--single-storage)
            - [Keep Track of Cancellation Tokens](#keep-track-of-cancellation-tokens)
            - [Test End-to-End with Mocked Remote Resouces](#test-end-to-end-with-mocked-remote-resouces)
        - [Acting](#acting)
            - [Mimic Service Fabric Replica Orchestration](#mimic-service-fabric-replica-orchestration)
            - [Run Replica Role Changes](#run-replica-role-changes)
            - [Cancel Cancellation Tokens](#cancel-cancellation-tokens)
            - [Execute Requests Against Multiple Replicas](#execute-requests-against-multiple-replicas)
        - [Asserting](#asserting)
            - [Ensure Responses Match Across Replicas](#ensure-responses-match-across-replicas)
            - [Verify Replicas That Should Serve Requests](#verify-replicas-that-should-serve-requests)
            - [Verify Service Respects Cancellation](#verify-service-respects-cancellation)

This article covers the concepts and practices of unit testing Service Fabric Stateful Services. Unit testing within Service Fabric deserves its own considerations due to the fact that the application code actively runs under multiple different contexts. In this article we will describe the practices used to ensure application code is covered under each of the different contexts it can run.

## Unit Testing & Mocking
Unit testing in the context of this article is automated testing that can be executed within the context of a test runner such as MSTest or NUnit. The unit tests within this article do not perform operations against a remote resource such as an database or RESTFul api. These remote resources are expected to be mocked. Mocking in the context of this article will fake, record, and control the return values for remote resources.

### Service Fabric Considerations
Unit testing a service fabric stateful service has several considerations. Firstly, the service code executes on multiple nodes but under different roles. Unit tests should evaluate the code under each role to acheive complete coverage. The different roles would be Primary, Active Secondary, Idle Secondary, and Unknown. The None role does not typically need any special coverage as service fabric considers this role to be void or null service. Secondly, each node will change its role at any given point. To acheive complete coverage, code execution path's should be tested with role changes occuring.

## Why Unit Test Stateful Services 
Unit testing stateful services can help to uncover some common mistakes that are made that wouldnt necessarily be caught by conventional application or domain specific unit testing. For example, if the stateful service has any in-memory state, this type of testing can verify that this in-memory state is kept in sync across each replica. This type of testing can also verify that a stateful service responds to cancellation tokens passed in by the service fabric orchestration appropriately. When cancellations are triggered, the service should halt any long running and/or asynchronous operations.  

## Common Practices

The following section advises on the most common practices for unit testing a stateful service. It also advises what a mocking layer should have to closely align to the Service Fabric orchestration and state management. Mocking libraries do exist libraries that provide this functionality. [ServiceFabric.Mocks](https://www.nuget.org/packages/ServiceFabric.Mocks/) as of 3.3.0 or later is one such library that provides the mocking functionality recommended and follows the practices outlined below.

### Arrangement
*Add a diagram here to illustrate the arrangement of the services and state manager before executing requests.*

#### Use Multiple Service Instances
Unit tests should execute multiple instances of a stateful service. This simulates what actually happens on the cluster where Service Fabric provisions multiple replicas running your service across different nodes. Each of these instances will be executing under a different context however. When running the test each instance should be primed with the role configuration expected on the cluster. For example, if the service is expected to have target replica size of 3, Service Fabric would provision 3 replicas on different nodes. One of which being the primary and the other two being Active Secondary's.

In most cases the service execution path's will vary slightly for each of these roles. For example, if the service should not accept requests from an Active Secondary, the service may have a check for this case to throw back an informative exception that indicates a request was attempte on a secondary. Having multiple instances will allow this situation to be tested.

Additionally, having multiple instances allows the tests to switch the roles of each of these instances to verify the responses are consistent despite the role changes.

#### Mock The State Manager
The State Manager should be treated as a remote resource and therefore mocked. When mocking the state manager, there will need to be some underlying in-memory storage for tracking what is saved to the state manager so that it can be read and verified. A simple way to acheive this is to create mock instances of each of the types of Reliable Collections. Within those mocks use a data type that closely aligns with the operations performed against that collection. The following are some suggested data types for each reliable collection

- IReliableDictionary<TKey, TValue> -> System.Collections.Concurrent.ConcurrentDictionary<TKey, TValue>
- IReliableQueue<T> -> System.Collections.Generic.Queue<T>
- IReliableConcurrentQueue<T> -> System.Collections.Concurrent.ConcurrentQueue<T>

#### Many State Manager Instances, Single Storage
As mentioned before, the State Manager and Reliable Collections should be treated as a remote resource. Therefore, these should and will be mocked within the unit tests. However, when running multiple instances of a stateful service it will be a challenge to keep each mocked state manager in sync across different stateful service instances. When the stateful service is running on the cluster, the Service Fabric takes care of keeping each secondary replica's state manager consistent with the primary replica. Therefore, the tests should behave the same so that they can simulate role changes.

A simple way this synchronization can be acheived, is to use a singleton pattern for the underlying object that stores the data written to each Reliable Collection. For example, if a stateful service is using an `IReliableDictionary<string, string>`. The mock state manager should return a mock of `IReliableDictionary<string, string>`. That mock may use a `ConcurrentDictionary<string, string>` to keep track of the key/value pairs written. The `ConcurrentDictionary<string, string>` should be a singleton used by all instances of the state managers passed to the service.

#### Keep Track of Cancellation Tokens
Cancellation tokens are an important yet commonly overlooked aspect of stateful services. When Service Fabric starts up a primary replica for a stateful service, a cancellation token is provided. This cancellation token is intended to signal to the service when it being removed or demoted to a different role. The stateful service should stop any long running or asynchronous operations so that Service Fabric can complete the role change workflow.

When running the unit tests, any cancellation tokens that are provided to RunAsync, ChangeRoleAsync, OpenAsync, and CloseAsync should be held during the test execution. Holding onto these tokens will allow the test to simulate a service shutdown or demotion and verify the service responds appropriately.

#### Test End-to-End with Mocked Remote Resouces
Unit tests should execute as much of the application code that can modify the state of the stateful service as possible. Its recommended that the tests be more end-to-end in nature. The only mocks that exist are to record, simulate, and/or verify remote resource interactions. This includes interactions with the State Manager and Reliable Collections. The following is an example of gherkin for a test that demonstrates end-to-end testing

	Given stateful service named "fabric:/MyApp/MyService" is created
	And a new replica is created as "Primary" with id "111"
	And a new replica is created as "IdleSecondary" with id "222"
    And a new replica is created as "IdleSecondary" with id "333"
	And all idle secondary replicas are promoted to active secondary
	When a request is made to add the an employee "John Smith"
    And the active secondary replica "222" is promoted to primary
    And a request is made to get all employees
	Then the request should should return the "John Smith" employee

This test will assert that the data being captured on one replica is available to a secondary replica when its promoted to be primary. Assuming that a reliable collection is the backing store for the employee data, Aa potential failure that could be caught with this test is if the application code did not execute `CommitAsync` on the transaction to save the new employee. In that case, the second request to get employees would not return employee added by the first request.

### Acting
#### Mimic Service Fabric Replica Orchestration
When managing multiple service instances, the tests should intialize and tear down these services in the same manner as the Service Fabric orchestration. For example, when a service is created on a new primary replica, Service Fabric will invoke CreateServiceReplicaListener, OpenAsync, ChangeRoleAsync, and RunAsync. The lifecycle events are documented in the following articles:

*TODO: add links to https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-reliable-services-lifecycle#stateful-service-startup, shutdown, and primary swaps*

#### Run Replica Role Changes
The unit tests should change the roles of the service instances in the same manner as the Service Fabric orchestration. The role state machine is documented in the following article:

*TODO: add link https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-concepts-replica-lifecycle#replica-role*

Simulating role changes is one of the more critical aspects of testing as it can uncover issues where the replicas state are not consistent with each other. This happens often times due to storing in-memory state in static or class level instance variables. Examples of this may be cancellation tokens, enums, and configuration objects/values. This will also ensure that the service is respecting the cancellation tokens provided during RunAsync to allow the role change to occur. This can also uncover issues that may arise if code is not written to allow an invocation of RunAsync multiple times.

#### Cancel Cancellation Tokens
*Verify the service responds accordingly to cancellation token cancel events. Long running processes should respect tokens and shut down when the token is cancelled*
There should exists unit tests where the cancellation token provided to RunAsync is actually cancelled. This will allow the test to verify that the service gracefully shutsdown. During this shut down any long running or asynchronous operations should be stopped. Example of a long running process that may exist on a service is one that listens for messages on a Reliable Queue. This may exist directly within RunAsync or a background thread. The implementation should include logic for exiting the operation if this cancellation token is cancelled.

If the stateful services makes use of any cache or in-memory state that should only exist on the primary, it should be disposed at this time. This is to ensure that this state is consistent if the node becomes a primary again later. Cancellation testing will allow the test to verify this state is disposed properly.

#### Execute Requests Against Multiple Replicas
*Executing the same request against multiple replica after transitioning them to primary will verify state is in sync amongst the replicas*

### Asserting
#### Ensure Responses Match Across Replicas
*Run requests against multiple replicas and ensure the response they provide matches. This will check if the service has state that is not synced with the other replicas*

#### Verify Replicas That Should Serve Requests
*If a secondary shouldnt serve a request, verify the service will reject the request when its running on secondary*

#### Verify Service Respects Cancellation
*Assert long running processes are shut down when cancellation is tripped*
