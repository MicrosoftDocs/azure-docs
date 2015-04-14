<properties 
   pageTitle="Testability Overview" 
   description="Article description that will be displayed on landing pages and in some search results" 
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
   ms.date="03/17/2015"
   ms.author="vturecek"/>

# Testability overview 

<<<<<<< HEAD
Testability is a suite of tools specifically designed for testing your services build on Microsoft Azure Service Fabric. The tools allow you to easily induce meaningful faults and run test scenarios to exercise and validate the numerous different states and transitions your services will experience throughout their lifetimes, all in a controlled and safe manner.

## Right tools for the right job

Testability is all about executing runtime tests against your services using a set of PowerShell and C# APIs so you can write everything from test scripts that can be invoked via PowerShell in your development and test environments, to long-running services that continuously invoke test actions in production. 

## Actions and scenarios

 With Testability we provide Actions and Scenarios to do the job. Actions are individual faults or actions that can be performed against your service. These are the building blocks for running tests against your service. For example: 

  + Restart a node to simulate a any number of situations where a machine or VM is rebooted.
  + Move a replica of your stateful service to simulate load balancing, failover, or application upgrades.
  + Invoke quorum loss on a stateful service to simulate a situation where write operations can't proceed because there aren't enough "back-up" or "secondary" replicas to accept new data.
  + Invoke data loss on a stateful service to simulate a situation where all in-memory state is completely wiped out.
=======
Testability is a suite of tools specifically designed for testing your services that are running on Microsoft Azure Service Fabric. The tools allow you to easily induce meaningful faults and run test scenarios to exercise and validate the numerous different states and transitions your services will experience throughout their lifetimes in a controlled and safe manner.

## Right tools for the right job

Testability provides a set of PowerShell and C# APIs to test your services, so you can write everything from test scripts that can be invoked via PowerShell in your development and test environments, to long-running services that continuously invoke test actions in production.

## Actions and scenarios

Testability is all about running tests against your services. With Testability we provide Actions and Scenarios to do the job. Actions are individual faults or actions that can be performed against your service. These are the building blocks for running tests. For example: 

  + Restart a node
  + Move a stateful service replica
  + Invoke quorum loss on a stateful service
  + Invoke data loss on a stateful service

Scenarios are complete tests that are composed of one or more actions, and since actions are simply PowerShell commands and C# functions, they can take any shope or form: long-running services, PowerShell commands, command line applications, and so forth. In Testability we provide two scenarios out of the box:

  + Chaos Test
  + Failover Test
  
  
