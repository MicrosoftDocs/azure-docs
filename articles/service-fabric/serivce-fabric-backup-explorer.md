---
title: Read and Update Reliable Collections Backup Locally 
description: This article discusses how to read and update Reliable collectios backup locally
services: service-fabric
documentationcenter: .net
author: athinanthny
manager: chackdan
editor: ''

ms.assetid: de7dacf5-4038-434a-a265-5d0de80a9b1d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/01/2019
ms.author: atsenthi

---

# Read and Update your Reliable Collections Backup using Service Fabric Backup Viewer

> [!NOTE]
> Service Fabric Backup Explorer currently only supports viewing and editing Reliable Dictionaries in the Backup.
>

Service Fabric Backup Explorer helps in data correction in case of data corruption. The current state of data can be corrupted because of any bug introduced in application or any wrong entries made in the live clusters.
With the help of Backup Explorer following tasks can be performed :
-	Querying of metadata for the collection.
-	Current state and its entries in the collection of the backup loaded.
-	Enlist the transactions performed (since the last checkpoint).
-	Update the collection by adding, updating or deleting the entries in the collection.
-	Take a fresh backup with the updated state.

The Service Fabric Backup Explorer can be consumed in any of the following ways for view/update of reliable collections of the backup.
-	Binary - Nuget package to view and alter the reliable collections.
-	HTTP/Rest - HTTP based Rest hosting to view and alter the reliable collections.
-	bkpctl - Service fabric backup controller CLI (command line interface) to view and alter the reliable collections.

As part of artifacts we have a C# library for advanced user which can be used in the application directly to work with reliable collections pretty much in the same way customers work with the state manager in their existing stateful services. For simple users and basic use case, we also have a standalone rest server exposing rest APIs to inspects the backups. There is a bkpctl cli tool on top of the rest APIs, based on python to read/update and take backups via command line.
 
For more details this is the link to the repo, which consists the source/release information, as well as the setup instructions:
https://github.com/microsoft/service-fabric-backup-explorer

The Nuget for Backup Explorer (Microsoft.ServiceFabric.ReliableCollectionBackup.Parser) will be available on nuget.org. 

Users can also build the repository locally and work on the Backups.

## Prerequisites

> [!NOTE]
> The required minimum .NET Framework version is 4.7 Developers Pack.