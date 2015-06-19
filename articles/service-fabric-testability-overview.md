<properties
   pageTitle="Testability Overview"
   description="This article describes the testability feature in Microsoft Azure Service Fabric."
   services="service-fabric"
   documentationCenter=".net"
   authors="rishirsinha"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/17/2015"
   ms.author="rsinha"/>

# Testability overview

Testability is a suite of tools specifically designed for testing services built on Microsoft Azure Service Fabric. The tools allow the developer to easily induce meaningful faults and run test scenarios to exercise and validate the numerous different states and transitions a service will experience throughout its lifetime, all in a controlled and safe manner.

Tesability provides Actions and Scenarios that allow the above to happen. Actions are the individual faults targeting a service for testing it.  A service developer can use these as building blocks to write complicated scenarios. For example:

  + Restart a node to simulate a any number of situations where a machine or VM is rebooted.
  + Move a replica of your stateful service to simulate load balancing, failover, or application upgrade.
  + Invoke quorum loss on a stateful service to create a situation where write operations can't proceed because there aren't enough "back-up" or "secondary" replicas to accept new data.
  + Invoke data loss on a stateful service to create a situation where all in-memory state is completely wiped out.

Scenarios are complete tests that are composed of one or more actions, and since actions are simply PowerShell commands and C# functions, they can take any shape or form: long-running services, PowerShell commands, command line applications, and so forth. In Testability we provide two scenarios out of the box:

  + Chaos Test
  + Failover Test

Testability exposes both PowerShell and C# APIs. This allows the service developer to have greater agility with scripting of PowerShell and greater control with C# APIs as and when needed.

## Importance of Testability

Service Fabric makes the job of writing and managing distributed scalable applications significantly easier. Testability component in Service Fabric is aimed at making testing a distributed application similarly easier. There are three main issues that need to be solved while testing:

1. Simulating/Generating failures that might occur in the real world scenarios: One of the important aspects of Service Fabric is that it allows distributed applications to recover from various failures. However, in order to test that the application is able to recover from these failures we need a mechanism to simulate/generate these real world failures in a controlled test environment.
2. The ability to generate the correlated failures: While the basic failures in the system like network failure, machine failures are easy to produce individually. Generating the significant number of scenarios that can happen in the real world as a result of the interactions of these individual failures is non-trivial.
3. Unified experience across various levels of development and deployment: There are many fault injection systems that provide the ability to do various types of failures. However, the experience in all of these is jagged when moving from one box developer scenarios to running the same tests in large tests environments to using them for test in production.

While there are many mechanisms to solve the above mentioned problems, a system that does the same with required guarantees - all the way from one box developer environment to test in production clusters -  is missing. The Testability component allows the application developers to concentrate on testing test their business logic. The testability feature provides all the capabilities needed to test the interaction of the service with the underlying distributed system.

### Simulating/Generating real word failure scenarios
In order to test the robustness of a distributed system against failures, we need a mechanism to generate failures. While in theory generating a failure like a node down seems easy, it starts hitting the same set of consistency problems that Service Fabric is trying to solve. As an example if we want to shutdown a node, the required workflow is the following:

1. From the client issue a shutdown node request.
2. Send the request to the right node.
	1. If the node is not found it should fail.
	2. If the node is found it should return only if the node is shutdown.

From a test perspective, it needs to know that when this failure is induced the failure actually happens in order to verify the failure. The guarantee that windows fabric provides is that either the node will go down or is already down when the command reached the node. In either case the test should be able to correctly reason about the state and succeed or fail in its validation correctly. A system implemented outside of Service Fabric to do the same set of failures could hit a plethora of network, hardware and software issues, which would prevent it from providing the above stated guarantees. In the presence of the issues stated before, Service Fabric will reconfigure the cluster state to work around the issues and hence the Testability would still be able to give the right set of guarantees.

### Generating required events and scenario
While simulating a real world failure consistently is tough to start with, the ability to generate correlated failures is even tougher. For example a data loss happens in a stateful persisted service when the following happens:

1. Only a write quorum of the replicas are caught up on replication. All the secondary replicas lag behind the primary.
2. The write quorum goes down because of the replicas going down (due to code package or node going down).
3. The write quorum not being able to come back up because the data for the replicas is lost (due to disk corruption or machine reimage).

These correlated failure do happen (even though not as frequently as individual failures) in the real world. The ability to test for these scenarios before they happen in production is critical. More so the ability to simulate these in production workload in controlled circumstances (middle of the day with all engineers on deck) is much preferred than it happening for the first time in production at 2:00 a. m. in the morning.

### Unified experience across different environments
The practice traditionally has been to create three different sets of experiences, one for development environment, one for tests and one for production. The model was:

1. In the development environment produce state transitions that allow unit tests of individual methods.
2. In the test environment produce failures to allow end to end tests exercising various failure scenarios.
3. Keep the production environment pristine disallowing any non-natural failures and to ensure there is extremely quick human response to failure.

In Service Fabric through the Testability module and service, we are proposing to turn this around as use the same methodology from developer environment to production. There are two ways to achieve this:
1. In order to induce controlled failures use the Testability APIs from a one box environment all the way to production clusters.
2. To give the cluster a fever which causes automatic induction of failures, use the Testability service to generate automatic failures. Controlling the rate of failures through configuration allows the same service to be tested differently in different environments.

With Service Fabric, though the scale of failures would be different in the different environments the actual mechanism would be identical. This allows for a much quicker code to deployment pipeline and the ability to test the services while still being under real world load.

## Using Testability
### Using Testability in C# 
The various testability features are present in the System.Fabric.Testability.dll. This dll can be found in the Microsoft.ServiceFabric.Testability.nupack nuget package. In order to use the Testability features, include the nuget package in as a reference in your project.

## Using Testability in PowerShell
To use the Testability PowerShell an installation of the runtime MSI is required. Once the MSI is installed, the ServiceFabricTestability PowerShell module is auto loaded for developers to use.

## Conclusion
To create truly cloud scale services, the ability to ensure that services can withstand real world failures before being deployed (and also while in production deployment) is very critical. Also in the services world today, the ability to quickly innovate and move code to production is very important. The Testability feature in Service Fabric allows service developers to do the above precisely.

## Next Steps

- [Testability Actions](service-fabric-testability-actions.md)
- [Testability Scenarios](service-fabric-testability-actions.md)
- How to test your service
	- [Simulate failures during service workloads](service-fabric-testability-workload-tests.md)
   - [Service to service communication failures](service-fabric-testability-scenarios-service-communication.md)

