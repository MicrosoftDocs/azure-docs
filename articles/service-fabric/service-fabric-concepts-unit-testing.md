# Unit Testing Stateful Services

- [Unit Testing Stateful Services](#unit-testing-stateful-services)
    - [Unit Testing & Mocking](#unit-testing-mocking)
        - [Service Fabric Considerations](#service-fabric-considerations)
    - [Why Unit Test Stateful Services](#why-unit-test-stateful-services)
    - [Common Practices](#common-practices)
        - [Arrangement](#arrangement)
            - [Use Multiple Service Instances](#use-multiple-service-instances)
            - [Many State Manager Instances, Single Storage](#many-state-manager-instances-single-storage)
            - [Keep Track of Cancellation Tokens](#keep-track-of-cancellation-tokens)
            - [Test End-to-End / Only Mock Infrastructure, Data, and External Processes](#test-end-to-end-only-mock-infrastructure-data-and-external-processes)
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
*Level set what unit testing and mocking means for the context of this article. This should be the canonical definition of what unit testing and mocking is really*

### Service Fabric Considerations
*Here we will answer what is different about testing in service fabric compared to traditional application code. Examples may be that the code runs in multiple places simultaneously and any one of the instances can serve requests at any point in time.*

## Why Unit Test Stateful Services 
*Here we want to answer the question as to what this type of testing uncovers that conventional application/domain specific unit testing may not catch. Big one is the fact that their code will be running on multiple nodes simultaneously and ensuring that each of these instances are not holding state that gets out of sync with the other replica's*

## Common Practices

### Arrangement
*Add a diagram here to illustrate the arrangement of the services and state manager before executing requests.*

#### Use Multiple Service Instances
*This will describe why testing a single instance of a service will not cover all scenarios that need to be covered. For example if there is any in memory state, using multiple instances and rotating requests to different instances will uncover issues around in-memory state becoming out of sync.*

#### Many State Manager Instances, Single Storage
*Each replica has its own instance of the state manager but, the underlying data should be the same across all replicas. Simulating this can be simiplified by using a singleton dictionary or queue behind the state manager mock.*

#### Keep Track of Cancellation Tokens
*Keep a copy of the cancellation tokens fed to lifecycle hooks so that the reaction to their cancellation can be tested.*

#### Test End-to-End / Only Mock Infrastructure, Data, and External Processes
The unit tests that are most effective at rooting out potential failures are those that execute all the application code. The only bits mocked are those that involve external processes (i.e. third-party api's or off-cluster azure resources), interactions with Reliable State and Collections, and the service fabric runtime executing the lifecycle events of a service. Everything else in between should be executed during a test. The following is an example of gherkin for a test that demonstrates end-to-end testing

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
*Include a link to the article that already exists that documents how each method hook is invoked under different lifecycle events. The tests should invoke these same methods in the order documented.*

#### Run Replica Role Changes
*Test scenarios where the replica that wasnt a primary becomes a primary then serves requests*

#### Cancel Cancellation Tokens
*Verify the service responds accordingly to cancellation token cancel events. Long running processes should respect tokens and shut down when the token is cancelled*

#### Execute Requests Against Multiple Replicas
*Executing the same request against multiple replica after transitioning them to primary will verify state is in sync amongst the replicas*

### Asserting
#### Ensure Responses Match Across Replicas
*Run requests against multiple replicas and ensure the response they provide matches. This will check if the service has state that is not synced with the other replicas*

#### Verify Replicas That Should Serve Requests
*If a secondary shouldnt serve a request, verify the service will reject the request when its running on secondary*

#### Verify Service Respects Cancellation
*Assert long running processes are shut down when cancellation is tripped*
