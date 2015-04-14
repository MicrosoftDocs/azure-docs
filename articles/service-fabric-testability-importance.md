<properties 
   pageTitle="Importance of Testability." 
   description="This article talks about why testability is important for services written on windows fabric." 
   services="Service-Fabric" 
   documentationCenter="Windows Azure" 
   authors="rishirsinha" 
   manager="timlt" 
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA" 
   ms.date="03/17/2014"
   ms.author="rsinha" />

# Importance of Testability.

Service Fabric makes the job of writing and managing distributed scalable applications significantly easier. Testability component in Service Fabric is aimed at making testing a distributed application similarly easier. There are two main issues that need to be solved while testing: 

1. Simulating/Generating failures that might occur in the real world scenarios: One of the important aspects of Service Fabric is that it allows distributed applications to recover from various failures. However, in order to test that the application is able to recover from these failures we need a mechanism to simulate/generate these real world failures in a controlled test environment.
2. The ability to generate the required set of events and scenarios: While the basic failures in the system like network failure, machine failures are easy to produce individually. Generating the significant number of scenarios that can happen in the real world as a result of the interactions of these individual failures is non-trivial.
3. Unified experience across various levels of development and deployment: There are many fault injection systems that provide the ability to do various types of failures. However, the experience in all of these is jagged when moving from one box developer scenarios to running the same tests in large tests environments to using them for test in production.

While there are many mechanisms to solve the above mentioned problems, a system that does the same with required guarantees all the way from one box developer environment to test in production clusters is missing. The Testability component allows the application developers to test their business logic and not its interaction with the underlying distributed system. 

## Simulating/Generating real word failure scenarios.
In order to test the robustness of a distributed system against failures, we need a mechanism to generate failures. While in theory generating a failure like a node down seems easy, it starts hitting the same set of consistency problems that windows fabric is trying to solve. As an example if we want to shutdown a node, the required work flow is the the following:

1. From the client issue a shutdown node request.
2. Send the request to the right node.
	1. If the node is not found it should fail.
	2. If the node is found it should return only if the node is shutdown.

From a test perspective, it needs to know that when this failure is induced the failure actually happens in order to verify the failure. The guarantee that windows fabric provides is that either the node will go down is already down. In either case the test should be able to correctly reason about the state and succeed or fail in its validation correctly. A system implemented outside of windows fabric to do the same set of failures could hit a plethora of network, hardware and software issues which would prevent it from providing the above stated guarantees. In the presence of the issues stated before Service Fabric will reconfigure the cluster state to work around the issues and hence the Testability would still be able to give the right set of guarantees.

## Generating required states and state transitions.

## Unified experience across different environments.