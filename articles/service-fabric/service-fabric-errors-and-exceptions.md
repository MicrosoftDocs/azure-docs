<properties
   pageTitle="FabricClient common errors and exceptions | Microsoft Azure"
   description=""
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/08/2016"
   ms.author="ryanwi"/>

# Common exceptions when working with the FabricClient APIs
The [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx) APIs enable cluster and application administrators to perform administrative tasks on a Service Fabric application, service, or cluster. For example, application deployment, upgrade, and removal, checking the health a cluster, or testing a service. Application developers and cluster administrators can use the [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx) APIs to develop tools for managing the Service Fabric cluster and applications.

The following table lists exceptions that could be thrown by many of the methods in the [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx) APIs.

|Exception| Thrown when|
|---------|:-----------|
|[System.Fabric.FabricObjectClosedException](https://msdn.microsoft.com/library/system.fabric.fabricobjectclosedexception.aspx)|The [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx) object is in a closed state. Dispose of the [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx) object you are using and instantiate a new [FabricClient](https://msdn.microsoft.com/library/system.fabric.fabricclient.aspx) object. |
|[System.TimeoutException](https://msdn.microsoft.com/library/system.timeoutexception.aspx)|The operation timed out. [OperationTimedOut](https://msdn.microsoft.com/library/system.fabric.fabricerrorcode.aspx) is returned when the operation takes more than MaxOperationTimeout to complete.|
|[System.Fabric.FabricException](https://msdn.microsoft.com/library/system.fabric.fabricexception.aspx)|A runtime error occurred while performing the operation. Any of the FabricClient methods can potentially throw [FabricException](https://msdn.microsoft.com/library/system.fabric.fabricexception.aspx), the  [ErrorCode](https://msdn.microsoft.com/library/system.fabric.fabricexception.errorcode.aspx) property indicates the exact cause of the exception. Error codes are defined in the [FabricErrorCode](https://msdn.microsoft.com/library/system.fabric.fabricerrorcode.aspx) enumeration.|
|[System.Fabric.FabricTransientException](https://msdn.microsoft.com/library/system.fabric.fabrictransientexception.aspx)|The operation failed due to a transient error condition of some kind. For example, an operation may fail because a quorum of replicas is temporarily not reachable. Transient exceptions correspond to failed operations that can be retried.|


## Next steps
