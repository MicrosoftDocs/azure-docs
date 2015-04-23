<properties
   pageTitle="Availability of Service Fabric Stateless Services"
   description="Describes fault detection, failover, recovery for stateless services"
   services="service-fabric"
   documentationCenter=".net"
   authors="appi101"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/13/2015"
   ms.author="appi101"/>

#Availability of Service Fabric Stateless Services
A stateless service is an application service that does not have any [state]../service-fabric-concepts-state.

Creating a stateless service requires defining an instance count which is the number of instances of the stateless service that should be running in the cluster. These are the number of copies of the application logic that will be instantiated in the cluster.

When a fault is detected on any instance of the stateless service a new instance is created on some other eligible node in the cluster.
