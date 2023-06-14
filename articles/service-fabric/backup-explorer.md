---
title: Read and update a Reliable Collections backup locally 
description: Use Backup Explorer in Azure Service Fabric to read and update a local Reliable Collections backup.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Read and update a Reliable Collections backup by using Backup Explorer

Azure Service Fabric Backup Explorer helps with data correction if data is corrupted in Service Fabric Reliable Collections. The current state of data can be corrupted by any bug that's introduced in an application or by any wrong entries made in a live cluster.

With the help of Backup Explorer, you can do the following tasks:
-	Query the metadata for the collection.
-	View the current state and its entries in the collection of the backup that is loaded.
-	List the transactions performed since the last checkpoint.
-	Update the collection by adding, updating, or deleting entries in the collection.
-	Take a fresh backup by using the updated state.

> [!NOTE]
> Service Fabric Backup Explorer currently supports only viewing and editing Reliable Collections in the backup.
>

## Access the backup

Service Fabric Backup Explorer can be consumed in any of the following ways for viewing or updating Reliable Collections in the backup:
-	**Binary**: Use a NuGet package to view and alter Reliable Collections.
-	**HTTP/REST**: Use an HTTP-based REST server to view and alter Reliable Collections.
-	**bkpctl**: Use the Service Fabric Backup Explorer command-line interface (CLI) to view and alter a Reliable Collections backup.

Backup Explorer has a C# library for advanced users. You can use the library in the application directly to work with Reliable Collections similar to the way customers work with the state manager in their existing stateful services. For basic users and in a basic use case, the explorer also has a standalone REST server that exposes APIs to inspect the backups. The bkpctl CLI tool works on top of the REST APIs and is based on Python. You can use the CLI tool to read and update backups, and to take new backups via the command line.

For more information, see the [Service Fabric Backup Explorer](https://github.com/microsoft/service-fabric-backup-explorer) GitHub repository. The repository contains source and release information and setup instructions.

You also can build the repository locally and work on backups.
 
The NuGet for Backup Explorer (Microsoft.ServiceFabric.ReliableCollectionBackup.Parser) will be available on [nuget.org](https://www.nuget.org/). 

## Next steps

* Read more about [Reliable Collections in Azure Service Fabric stateful services](service-fabric-reliable-services-reliable-collections.md).
* Review [Service Fabric best practices](./service-fabric-best-practices-security.md).