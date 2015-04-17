<properties
   pageTitle="FabSrv Programming Model Overview"
   description="FabSrv "
   services="service-fabric"
   documentationCenter=".net"
   authors="masnider"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="required"
   ms.date="03/17/2015"
   ms.author="masnider@microsoft.com"/>

# FabSrv Programming Model Overview

The FabSrv programming model is one of the top level programming models available for Service Fabric, available alongside the FabAct programming model.

## Introduction

FabSrv provides a simplified programming model that provides a common model for writing new services, specifically:

1. A pluggable communication model - use the transport of your choice, like HTTP WebAPI, WebSockets, Custom TCP protocols, etc.

2. A simplified model for running your own code - compared to lower level Service Fabric abstractions the FabSrv model looks much like programming models that people are used: your code has a well defined entry point and easily managed lifecycle


##When to Use Reliable Services APIs
If any of the following characterize your application service needs, then the Reliable Services APIs should be considered:

- You need to provide application behavior across multiple units of state (e.g. Orders and Order Line Items)

- Your application’s state can be naturally modelled as IReliableDictionary or IReliableQueue  instances

- Your state needs to be highly available with low latency access

- Your application needs to control the concurrency or granularity of transacted operations across one or more reliable data structure instances

- You want to manage the communications or control the partitioning scheme for your service

- Your code needs a free-threaded runtime environment

- Your application needs to dynamically create or destroy instances of IReliableDictionary or IReliableQueue at runtime

- You need to programmatically control Service Fabric provided backup and restore features for your service’s state*

- Your application needs to maintain change history for its units of state*

- You wish to develop, or consume 3rd party developed, custom state providers*

  [AZURE.NOTE] *Above features available at SDK general availabity



## Service Lifecycle

## Expected Performance, Density, and Scale

## Next Steps
