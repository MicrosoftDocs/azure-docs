---
title: 'Application upgrade: data serialization | Microsoft Docs'
description: Best practices for data serialization and how it affects rolling application upgrades.
services: service-fabric
documentationcenter: .net
author: vturecek
manager: chackdan
editor: ''

ms.assetid: a5f36366-a2ab-4ae3-bb08-bc2f9533bc5a
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 11/02/2017
ms.author: vturecek

---
# How data serialization affects an application upgrade
In a [rolling application upgrade](service-fabric-application-upgrade.md), the upgrade is applied to a subset of nodes, one upgrade domain at a time. During this process, some upgrade domains are on the newer version of your application, and some upgrade domains are on the older version of your application. During the rollout, the new version of your application must be able to read the old version of your data, and the old version of your application must be able to read the new version of your data. If the data format is not forward and backward compatible, the upgrade may fail, or worse, data may be lost or corrupted. This article discusses what constitutes your data format and offers best practices for ensuring that your data is forward and backward compatible.

## What makes up your data format?
In Azure Service Fabric, the data that is persisted and replicated comes from your C# classes. For applications that use [Reliable Collections](service-fabric-reliable-services-reliable-collections.md), that data is the objects in the reliable dictionaries and queues. For applications that use [Reliable Actors](service-fabric-reliable-actors-introduction.md), that is the backing state for the actor. These C# classes must be serializable to be persisted and replicated. Therefore, the data format is defined by the fields and properties that are serialized, as well as how they are serialized. For example, in an `IReliableDictionary<int, MyClass>` the data is a serialized `int` and a serialized `MyClass`.

### Code changes that result in a data format change
Since the data format is determined by C# classes, changes to the classes may cause a data format change. Care must be taken to ensure that a rolling upgrade can handle the data format change. Examples that may cause data format changes:

* Adding or removing fields or properties
* Renaming fields or properties
* Changing the types of fields or properties
* Changing the class name or namespace

### Data Contract as the default serializer
The serializer is generally responsible for reading the data and deserializing it into the current version, even if the data is in an older or *newer* version. The default serializer is the [Data Contract serializer](https://msdn.microsoft.com/library/ms733127.aspx), which has well-defined versioning rules. Reliable Collections allow the serializer to be overridden, but Reliable Actors currently do not. The data serializer plays an important role in enabling rolling upgrades. The Data Contract serializer is the serializer that we recommend for Service Fabric applications.

## How the data format affects a rolling upgrade
During a rolling upgrade, there are two main scenarios where the serializer may encounter an older or *newer* version of your data:

1. After a node is upgraded and starts back up, the new serializer will load the data that was persisted to disk by the old version.
2. During the rolling upgrade, the cluster will contain a mix of the old and new versions of your code. Since replicas may be placed in different upgrade domains, and replicas send data to each other, the new and/or old version of your data may be encountered by the new and/or old version of your serializer.

> [!NOTE]
> The "new version" and "old version" here refer to the version of your code that is running. The "new serializer" refers to the serializer code that is executing in the new version of your application. The "new data" refers to the serialized C# class from the new version of your application.
> 
> 

The two versions of code and data format must be both forward and backward compatible. If they are not compatible, the rolling upgrade may fail or data may be lost. The rolling upgrade may fail because the code or serializer may throw exceptions or a fault when it encounters the other version. Data may be lost if, for example, a new property was added but the old serializer discards it during deserialization.

Data Contract is the recommended solution for ensuring that your data is compatible. It has well-defined versioning rules for adding, removing, and changing fields. It also has support for dealing with unknown fields, hooking into the serialization and deserialization process, and dealing with class inheritance. For more information, see [Using Data Contract](https://msdn.microsoft.com/library/ms733127.aspx).

## Next steps
[Upgrading your Application Using Visual Studio](service-fabric-application-upgrade-tutorial.md) walks you through an application upgrade using Visual Studio.

[Upgrading your Application Using Powershell](service-fabric-application-upgrade-tutorial-powershell.md) walks you through an application upgrade using PowerShell.

Control how your application upgrades by using [Upgrade Parameters](service-fabric-application-upgrade-parameters.md).

Learn how to use advanced functionality while upgrading your application by referring to [Advanced Topics](service-fabric-application-upgrade-advanced.md).

Fix common problems in application upgrades by referring to the steps in [Troubleshooting Application Upgrades](service-fabric-application-upgrade-troubleshooting.md).

