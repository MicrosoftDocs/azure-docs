<properties
   pageTitle="Fault Analysis Service overview | Microsoft Azure"
   description="This article describes the Fault Analysis Service in Service Fabric for inducing faults and running test scenarios against your services."
   services="service-fabric"
   documentationCenter=".net"
   authors="rishirsinha"
   manager="timlt"
   editor="vturecek"/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/06/2016"
   ms.author="rsinha"/>

# Introduction to the Fault Analysis Service

The Fault Analysis Service is designed for testing services that are built on Microsoft Azure Service Fabric. With the Fault Analysis Service you can induce meaningful faults and run complete test scenarios agains your applications. These faults and scenarios exercise and validate the numerous states and transitions that a service will experience throughout its lifetime, all in a controlled, safe, and consistent manner.

Actions are the individual faults targeting a service for testing it. A service developer can use these as building blocks to write complicated scenarios. For example:

  * Restart a node to simulate any number of situations where a machine or VM is rebooted.

  * Move a replica of your stateful service to simulate load balancing, failover, or application upgrade.

  * Invoke quorum loss on a stateful service to create a situation where write operations can't proceed because there aren't enough "back-up" or "secondary" replicas to accept new data.

  * Invoke data loss on a stateful service to create a situation where all in-memory state is completely wiped out.

Scenarios are complex operations composed of one or more actions. The Fault Analysis Service provides two built-in complete scenarios:

  * Chaos Scenario
  * Failover Scenario

## Testing as a service

The Fault Analysis Service is a Service Fabric system service that is automatically started with a Service Fabric cluster. This is service acts as the host for fault injection, test scenario execution, and health analysis. 

![Fault Analysis Service][0]

When a fault action or test scenario is initiated, a command is sent to the Fault Analysis Service to run the fault action or test scenario. The Fault Analysis Service is stateful so that it can reliable run faults and scenarios and validate results. For example, a long-running test scenario can be reliably executed by the Fault Analysis Service. And because tests are being executed inside the cluster, the service can examine the state of the cluster and your services to provide more in-depth information about failures.

## Testing distributed systems

Service Fabric makes the job of writing and managing distributed scalable applications significantly easier. The Fault Analysis Service makes testing a distributed application similarly easier. There are three main issues that need to be solved while testing:

1. Simulating/generating failures that might occur in real-world scenarios: One of the important aspects of Service Fabric is that it enables distributed applications to recover from various failures. However, to test that the application is able to recover from these failures, we need a mechanism to simulate/generate these real-world failures in a controlled test environment.

2. The ability to generate correlated failures: Basic failures in the system, such as network failures and machine failures, are easy to produce individually. Generating a significant number of scenarios that can happen in the real world as a result of the interactions of these individual failures is non-trivial.

3. Unified experience across various levels of development and deployment: There are many fault injection systems that can do various types of failures. However, the experience in all of these is poor when moving from one-box developer scenarios, to running the same tests in large test environments, to using them for tests in production.

While there are many mechanisms to solve these problems, a system that does the same with required guarantees--all the way from a one-box developer environment, to test in production clusters--is missing. The Fault Analysis Service helps the application developers concentrate on testing their business logic. The Fault Analysis Service provides all the capabilities needed to test the interaction of the service with the underlying distributed system.



### Simulating/generating real-world failure scenarios

To test the robustness of a distributed system against failures, we need a mechanism to generate failures. While in theory, generating a failure like a node down seems easy, it starts hitting the same set of consistency problems that Service Fabric is trying to solve. As an example, if we want to shut down a node, the required workflow is the following:

1. From the client, issue a shutdown node request.

2. Send the request to the right node.

    a. If the node is not found, it should fail.

    b. If the node is found, it should return only if the node is shut down.

To verify the failure from a test perspective, the test needs to know that when this failure is induced, the failure actually happens. The guarantee that Service Fabric provides is that either the node will go down or was already down when the command reached the node. In either case the test should be able to correctly reason about the state and succeed or fail correctly in its validation. A system implemented outside of Service Fabric to do the same set of failures could hit many network, hardware, and software issues, which would prevent it from providing the preceding guarantees. In the presence of the issues stated before, Service Fabric will reconfigure the cluster state to work around the issues, and hence the Fault Analysis Service will still be able to give the right set of guarantees.

### Generating required events and scenarios

While simulating a real-world failure consistently is tough to start with, the ability to generate correlated failures is even tougher. For example, a data loss happens in a stateful persisted service when the following things happen:

1. Only a write quorum of the replicas are caught up on replication. All the secondary replicas lag behind the primary.

2. The write quorum goes down because of the replicas going down (due to a code package or node going down).

3. The write quorum cannot come back up because the data for the replicas is lost (due to disk corruption or machine reimaging).

These correlated failures do happen in the real world, but not as frequently as individual failures. The ability to test for these scenarios before they happen in production is critical. Even more important is the ability to simulate these scenarios with production workloads in controlled circumstances (in the middle of the day with all engineers on deck). That is much better than having it happen for the first time in production at 2:00 A.M.

### Unified experience across different environments

The practice traditionally has been to create three different sets of experiences, one for the development environment, one for tests, and one for production. The model was:

1. In the development environment, produce state transitions that allow unit tests of individual methods.

2. In the test environment, produce failures to allow end-to-end tests that exercise various failure scenarios.

3. Keep the production environment pristine to prevent any non-natural failures and to ensure that there is extremely quick human response to failure.

In Service Fabric, through the Fault Analysis Service, we are proposing to turn this around and use the same methodology from developer environment to production. There are two ways to achieve this:

1. To induce controlled failures, use the Fault Analysis Service APIs from a one-box environment all the way to production clusters.

2. To give the cluster a fever that causes automatic induction of failures, use the Fault Analysis Service to generate automatic failures. Controlling the rate of failures through configuration enables the same service to be tested differently in different environments.

With Service Fabric, though the scale of failures would be different in the different environments, the actual mechanisms would be identical. This allows for a much quicker code-to-deployment pipeline and the ability to test the services under real-world loads.

## Using the Fault Analysis Service

**C#**

Fault Analysis Service features are in the System.Fabric namespace in the Microsoft.ServiceFabric NuGet package. To use the Fault Analysis Service features, include the nuget package as a reference in your project.

**PowerShell**

To use PowerShell, you must install the Service Fabric SDK. After the SDK is installed, the ServiceFabric PowerShell module is auto loaded for you to use.

## Next steps

To create truly cloud-scale services, it is critical to ensure, both before and after deployment, that services can withstand real world failures. In the services world today, the ability to innovate quickly and move code to production quickly is very important. The Fault Analysis Service helps service developers to do precisely that.

Begin testing your applications and services using the built-in [test scenarios](service-fabric-testability-scenarios.md), or author your own test scenarios using the [fault actions](service-fabric-testability-actions.md) provided by the Fault Analysis Service.

<!--Image references-->
[0]: ./media/service-fabric-testability-overview/faultanalysisservice.png