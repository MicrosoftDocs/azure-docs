<properties 
   pageTitle="Importance of Testability." 
   description="This article talks about why testability is important for services written on windows fabric." 
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
   ms.date="03/17/2014"
   ms.author="rsinha"/>

# Importance of Testability.

Service Fabric makes the job of writing and managing distributed scalable applications significantly easier. However, testing a distributed application can be as challenging as writing one. There are two main issues that need to be solved while testing 

1. Simulating/Generating failures that might occur in the real world scenarios: One of the important aspect of Service Fabric is that it allows distributed applications to recover from various failures. However, in order to test that the application is able to recover from these failures we need a mechanism to simulate/generate these real world failures in a controlled test environment.
2. The ability to generate the required states and state transitions: Given the complexity of a distributed application, the enumeration of all states and state transitions is not trivial. This is specially applicable when you are programming against the lower level APIs.

While there are many mechanisms to solve the above mentioned problems, a system that does the same with required guarantees all the way from one box developer environment to test in production clusters is missing.

## Simulating/Generating real word failure scenarios.
In order to test the robustness of a distributed system against failures, we need a mechanism to generate failures. While in theory generating a failure like a node down seems easy, it starts hitting the same set of consistency problems that windows fabric is trying to solve. As an example if we want to shutdown a node, the required workflow is the the following:

1. From the client issue a shutdown node request.
2. Route the request to the right node.
	1. If the node is not found it should fail.
	2. If the node is found it should return only if the node is shutdown.


In order to have the above guarantees we need a system that can do consistent routing. This consistent routing is a hard distributed problem to solve.

## Generating required states and state transitions.

