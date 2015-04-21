<properties
   pageTitle="Custom Test Scenarios"
   description="How to harden your services against Graceful/Ungraceful failures"
   services="service-fabric"
   documentationCenter=".net"
   authors="anmola"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="03/17/2015"
   ms.author="anmola"/>

# Writing Custom Scenarios

Testability is a suite of tools to help you test your services. The idea is to enable developers to make their business logic resilient to failures. Service Fabric makes it easy for application authors to easily write and deploy scalable and reliable. Even with Service Fabric your distributed application can fail due to software error or infrastructure failures. You will still need to ensure your service is functioning the right way after it is restored after a machine failure for example. Sometimes the Service process might fail in the middle of some operation which was not handling some corner case and on recovery your might end up in some corrupted state. Using Testability faults can help you test those scenarios by inducing faults at different states in your application hence finding bugs and improving quality.

## Graceful and Ungraceful failures
To better understand how to test these services we need to understand the two main buckets of failures that can be encountered.
  + Ungraceful failures like machine restarts and process crashes.
  + Graceful failures like replica moves and drops triggered by load balancing.

In order to completely test your services you need to run your service and walk through a workload which exercises its business logic while inducing graceful and ungraceful failures.     
