---
title: 'Service Fabric cluster security: client roles | Microsoft Docs'
description: This article describes the two client roles and the permissions provided to the roles.
services: service-fabric
documentationcenter: .net
author: mani-ramaswamy
manager: coreysa
editor: ''

ms.assetid: 7bc808d9-3609-46a1-ac12-b4f53bff98dd
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 2/23/2018
ms.author: subramar

---
# Role-based access control for Service Fabric clients
Azure Service Fabric supports two different access control types for clients that are connected to a Service Fabric cluster: administrator and user. Access control allows the cluster administrator to limit access to certain cluster operations for different groups of users, making the cluster more secure.  

**Administrators** have full access to management capabilities (including read/write capabilities). By default, **users** only have read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.

You specify the two client roles (administrator and client) at the time of cluster creation by providing separate certificates for each. See [Service Fabric cluster security](service-fabric-cluster-security.md) for details on setting up a secure Service Fabric cluster.

## Default access control settings
The administrator access control type has full access to all the FabricClient APIs. It can perform any reads and writes on the Service Fabric cluster, including the following operations:

### Application and service operations
* **CreateService**: service creation                             
* **CreateServiceFromTemplate**: service creation from template                             
* **UpdateService**: service updates                             
* **DeleteService**: service deletion                             
* **ProvisionApplicationType**: application type provisioning                             
* **CreateApplication**: application creation                               
* **DeleteApplication**: application deletion                             
* **UpgradeApplication**: starting or interrupting application upgrades                             
* **UnprovisionApplicationType**: application type unprovisioning                             
* **MoveNextUpgradeDomain**: resuming application upgrades with an explicit update domain                             
* **ReportUpgradeHealth**: resuming application upgrades with the current upgrade progress                             
* **ReportHealth**: reporting health                             
* **PredeployPackageToNode**: predeployment API                            
* **CodePackageControl**: restarting code packages                             
* **RecoverPartition**: recovering a partition                             
* **RecoverPartitions**: recovering partitions                             
* **RecoverServicePartitions**: recovering service partitions                             
* **RecoverSystemPartitions**: recovering system service partitions                             

### Cluster operations
* **ProvisionFabric**: MSI and/or cluster manifest provisioning                             
* **UpgradeFabric**: starting cluster upgrades                             
* **UnprovisionFabric**: MSI and/or cluster manifest unprovisioning                         
* **MoveNextFabricUpgradeDomain**: resuming cluster upgrades with an explicit update domain                             
* **ReportFabricUpgradeHealth**: resuming cluster upgrades with the current upgrade progress                             
* **StartInfrastructureTask**: starting infrastructure tasks                             
* **FinishInfrastructureTask**: finishing infrastructure tasks                             
* **InvokeInfrastructureCommand**: infrastructure task management commands                              
* **ActivateNode**: activating a node                             
* **DeactivateNode**: deactivating a node                             
* **DeactivateNodesBatch**: deactivating multiple nodes                             
* **RemoveNodeDeactivations**: reverting deactivation on multiple nodes                             
* **GetNodeDeactivationStatus**: checking deactivation status                             
* **NodeStateRemoved**: reporting node state removed                             
* **ReportFault**: reporting fault                             
* **FileContent**: image store client file transfer (external to cluster)                             
* **FileDownload**: image store client file download initiation (external to cluster)                             
* **InternalList**: image store client file list operation (internal)                             
* **Delete**: image store client delete operation                              
* **Upload**: image store client upload operation                             
* **NodeControl**: starting, stopping, and restarting nodes                             
* **MoveReplicaControl**: moving replicas from one node to another                             

### Miscellaneous operations
* **Ping**: client pings                             
* **Query**: all queries allowed
* **NameExists**: naming URI existence checks                             

The user access control type is, by default, limited to the following operations: 

* **EnumerateSubnames**: naming URI enumeration                             
* **EnumerateProperties**: naming property enumeration                             
* **PropertyReadBatch**: naming property read operations                             
* **GetServiceDescription**: long-poll service notifications and reading service descriptions                             
* **ResolveService**: complaint-based service resolution                             
* **ResolveNameOwner**: resolving naming URI owner                             
* **ResolvePartition**: resolving system services                             
* **ServiceNotifications**: event-based service notifications                             
* **GetUpgradeStatus**: polling application upgrade status                             
* **GetFabricUpgradeStatus**: polling cluster upgrade status                             
* **InvokeInfrastructureQuery**: querying infrastructure tasks                             
* **List**: image store client file list operation                             
* **ResetPartitionLoad**: resetting load for a failover unit                             
* **ToggleVerboseServicePlacementHealthReporting**: toggling verbose service placement health reporting                             

The admin access control also has access to the preceding operations.

## Changing default settings for client roles
In the cluster manifest file, you can provide admin capabilities to the client if needed. You can change the defaults by going to the **Fabric Settings** option during [cluster creation](service-fabric-cluster-creation-via-portal.md), and providing the preceding settings in the **name**, **admin**, **user**, and **value** fields.

## Next steps
[Service Fabric cluster security](service-fabric-cluster-security.md)

[Service Fabric cluster creation](service-fabric-cluster-creation-via-portal.md)

