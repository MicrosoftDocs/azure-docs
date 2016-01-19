<properties
   pageTitle="Placement constraints in Service Fabric cluster orchestration | Microsoft Azure"
   description="A conceptual overview of placement constraints in Service Fabric"
   services="service-fabric"
   documentationCenter=".net"
   authors="GaugeField"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/03/2015"
   ms.author="abhic"/>

# Overview of placement constraints

Azure Service Fabric allows developers to constrain the placement of service replicas on nodes that satisfy particular conditions. These conditions are expressed via a Boolean expression that is evaluated with appropriate service-context-specific values.


## Capabilities
By using placement constraints, you can:

- Confine different types of services on different types of nodes via defining NodeProperties on the nodes.

- Apply certain constraints to primary replicas but not secondary replicas.


## Key concepts
NodeProperty--A user-defined or system-defined map from a string to a value that can vary over each node, i.e. NodeName.


<!--Every topic should have next steps and links to the next logical set of content to keep the customer engaged-->
## Next steps

For more information: [Application scenarios](../service-fabric-application-scenarios).
