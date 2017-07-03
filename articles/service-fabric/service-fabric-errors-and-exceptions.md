---
title: Common FabricClient exceptions thrown | Microsoft Docs
description: Describes the common exceptions and errors which can be thrown by the FabricClient APIs while performing application and cluster management operations.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: bb821313-b221-479f-b08e-36cf07e60a07
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 06/01/2017
ms.author: ryanwi

---
# Common exceptions and errors when working with the FabricClient APIs
The [FabricClient](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient#System_Fabric_FabricClient) APIs enable cluster and application administrators to perform administrative tasks on a Service Fabric application, service, or cluster. For example, application deployment, upgrade, and removal, checking the health a cluster, or testing a service. Application developers and cluster administrators can use the FabricClient APIs to develop tools for managing the Service Fabric cluster and applications.

There are many different types of operations which can be performed using FabricClient.  Each method can throw exceptions for errors due to incorrect input, runtime errors, or transient infrastructure issues.  See the API reference documentation to find which exceptions are thrown by a specific method. There are some exceptions, however, which can be thrown by many different [FabricClient](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient#System_Fabric_FabricClient) APIs. The following table lists the exceptions that are common across the FabricClient APIs.

| Exception | Thrown when |
| --- |:--- |
| [System.Fabric.FabricObjectClosedException](https://docs.microsoft.com/dotnet/api/system.fabric.fabricobjectclosedexception#System_Fabric_FabricObjectClosedException) |The [FabricClient](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient#System_Fabric_FabricClient) object is in a closed state. Dispose of the [FabricClient](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient#System_Fabric_FabricClient) object you are using and instantiate a new [FabricClient](https://docs.microsoft.com/dotnet/api/system.fabric.fabricclient#System_Fabric_FabricClient) object. |
| [System.TimeoutException](https://docs.microsoft.com/dotnet/core/api/system.timeoutexception#System_TimeoutException) |The operation timed out. [OperationTimedOut](https://docs.microsoft.com/dotnet/api/system.fabric.fabricerrorcode#System_Fabric_FabricErrorCode) is returned when the operation takes more than MaxOperationTimeout to complete. |
| [System.UnauthorizedAccessException](https://docs.microsoft.com/dotnet/core/api/system.unauthorizedaccessexception#System_UnauthorizedAccessException) |The access check for the operation failed. E_ACCESSDENIED is returned. |
| [System.Fabric.FabricException](https://docs.microsoft.com/dotnet/api/system.fabric.fabricexception#System_Fabric_FabricException) |A runtime error occurred while performing the operation. Any of the FabricClient methods can potentially throw [FabricException](https://docs.microsoft.com/dotnet/api/system.fabric.fabricexception#System_Fabric_FabricException), the [ErrorCode](https://docs.microsoft.com/dotnet/api/system.fabric.fabricexception#System_Fabric_FabricException_ErrorCode) property indicates the exact cause of the exception. Error codes are defined in the [FabricErrorCode](https://docs.microsoft.com/dotnet/api/system.fabric.fabricerrorcode#System_Fabric_FabricErrorCode) enumeration. |
| [System.Fabric.FabricTransientException](https://docs.microsoft.com/dotnet/api/system.fabric.fabrictransientexception#System_Fabric_FabricTransientException) |The operation failed due to a transient error condition of some kind. For example, an operation may fail because a quorum of replicas is temporarily not reachable. Transient exceptions correspond to failed operations that can be retried. |

Some common [FabricErrorCode](https://docs.microsoft.com/dotnet/api/system.fabric.fabricerrorcode#System_Fabric_FabricErrorCode) errors that can be returned in a [FabricException](https://docs.microsoft.com/dotnet/api/system.fabric.fabricexception#System_Fabric_FabricException):

| Error | Condition |
| --- |:--- |
| CommunicationError |A communication error caused the operation to fail, retry the operation. |
| InvalidCredentialType |The credential type is invalid. |
| InvalidX509FindType |The X509FindType is invalid. |
| InvalidX509StoreLocation |The X509 store location is invalid. |
| InvalidX509StoreName |The X509 store name is invalid. |
| InvalidX509Thumbprint |The X509 certificate thumbprint string is invalid. |
| InvalidProtectionLevel |The protection level is invalid. |
| InvalidX509Store |The X509 certificate store cannot be opened. |
| InvalidSubjectName |The subject name is invalid. |
| InvalidAllowedCommonNameList |The format of common name list string is invalid. It should be a comma-separated list. |

