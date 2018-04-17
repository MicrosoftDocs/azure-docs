# Unit Testing Reliable Services

- [Unit Testing Reliable Services](#unit-testing-reliable-services)
    - [Why Unit Test Reliable Services](#why-unit-test-reliable-services)
        - [Manual Testing Methods](#manual-testing-methods)
            - [Powershell Command Testing](#powershell-command-testing)
            - [Load Testing](#load-testing)
            - [Chaos Testing](#chaos-testing)
    - [Best Practices](#best-practices)
        - [Test End-to-End / Only Mock Infrastructure, Data, and External Processes](#test-end-to-end-only-mock-infrastructure-data-and-external-processes)
    - [Mocking in Reliable Services](#mocking-in-reliable-services)

 This article covers how to write unit tests that cover service fabric stateful service classes. To accomplish there are two primary areas that must be mocked. The first is the service fabric orchestration. This includes when a service's life cycle events, such as RunAsync and OnChangeRoleAsync, are executed. The second is the reliable collection infrastructure. 

##  Why Unit Test Reliable Services 

Unit testing reliable services allows a developer to automate that their service reacts in the appropriate manner to service lifecycle events. Service lifecycle event reactions can be time consuming to test manually after the service is running in a cluster. Unit tests can provide a safety check that code changes to a service do not induce an unexpected failure during lifecycle events.

### Manual Testing Methods

The following lists the three approaches to testing lifecylce events manually and the challenges for each


#### Powershell Command Testing

In this approach, powershell commands such as `Move-ServiceFabricPrimaryReplica` can be used to manually trigger a lifecycle event to occur. This approach is great for narrowing down root cause to a particular event that may cause a service to fail. With this approach however, the lifecylce event that causes a failure would need to be known. If the failure only occurs during load but, is not clear which event actually triggers the failure, each of these scenarios would need to be explored to determine root cause

#### Load Testing

Another approach is create artificial load on the cluster. This will cause service fabric to begin to rebalance services around the cluster. Rebalancing itself will execute the lifecycle events such as `OnChangeRoleAsync` to move a replica to a different node.

This approach can be effective at reproducing failures that occur during certain lifecycle events. However, this is a brute-force approach. As with all brute-force approaches, if you need to know what specifically caused the service to fail, this can be extremely difficult to determine unless the service has been extensively instrumented.

#### Chaos Testing

An alternative brute-force approach to load testing is to use the Chaos Test. This will randomly move services around the cluster and restart nodes. While this approach is effective at surfacing failures, it, like load testing, can be difficult to track exactly what caused the failure. Extensive service instrumentation would be required to determine exact root cause.

## Best Practices

### Test End-to-End / Only Mock Infrastructure, Data, and External Processes

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

##  Mocking in Reliable Services

Mocking needs to occur both at the orchestration and data layers. The `ServiceFabric.Mocks X.X.X.X` nuget package fortunately provides mocks for both of these layers.
