---
title: Upgrade an Azure Service Fabric standalone cluster 
description: Learn about upgrading the version or configuration of an Azure Service Fabric standalone cluster.  T

ms.topic: conceptual
ms.date: 11/12/2018
---
# Upgrading and updating a Service Fabric standalone cluster

For any modern system, designing for upgradability is key to achieving long-term success of your product. An Azure Service Fabric standalone cluster is a resource that you own. This article describes what can be upgraded or updated.

## Controlling the fabric version that runs on your cluster
Make sure that your cluster always runs a [supported Service Fabric version](service-fabric-versions.md). When Microsoft announces the release of a new version of Service Fabric, the previous version is marked for end of support after a minimum of 60 days from the date of the announcement. New releases are announced [on the Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/). The new release is available to choose at that point.

You can set your cluster to receive automatic fabric upgrades as they are released by Microsoft or you can manually select a supported fabric version you want your cluster to be on. For more information, read [Upgrade the Service Fabric version that runs on your cluster](service-fabric-cluster-upgrade-windows-server.md).

## Customize configuration settings

Many different [configuration settings](service-fabric-cluster-manifest.md) can be set in the *ClusterConfig.json* file, such as the reliability level of the cluster and node properties.  To learn more, read [Upgrade the configuration of a standalone cluster](service-fabric-cluster-config-upgrade-windows-server.md).  Many other, more advanced, settings can also be customized.  For more information, read [Service Fabric cluster fabric settings](service-fabric-cluster-fabric-settings.md).

## Define node properties
Sometimes you may want to ensure that certain workloads run only on certain types of nodes in the cluster. For example, some workload may require GPUs or SSDs while others may not. For each of the node types in a cluster, you can add custom node properties to cluster nodes. Placement constraints are the statements attached to individual services that select for one or more node properties. Placement constraints define where services should run.

For details on the use of placement constraints, node properties, and how to define them, read [node properties and placement constraints](service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints).
 

## Add capacity metrics
For each of the node types, you can add custom capacity metrics that you want to use in your applications to report load. For details on the use of capacity metrics to report load, refer to the Service Fabric Cluster Resource Manager Documents on [Describing Your Cluster](service-fabric-cluster-resource-manager-cluster-description.md) and [Metrics and Load](service-fabric-cluster-resource-manager-metrics.md).

## Patch the OS in the cluster nodes
The patch orchestration application (POA) is a Service Fabric application that automates operating system patching on a Service Fabric cluster without downtime. The [Patch Orchestration Application for Windows](service-fabric-patch-orchestration-application.md) can be deployed on your cluster to install patches in an orchestrated manner while keeping the services available all the time. 


## Next steps
* Learn how to customize some of the [service fabric cluster fabric settings](service-fabric-cluster-fabric-settings.md)
* Learn how to [scale your cluster in and out](service-fabric-cluster-scale-in-out.md)
* Learn about [application upgrades](service-fabric-application-upgrade.md)

<!--Image references-->
[CertificateUpgrade]: ./media/service-fabric-cluster-upgrade/CertificateUpgrade2.png
[AddingProbes]: ./media/service-fabric-cluster-upgrade/addingProbes2.PNG
[AddingLBRules]: ./media/service-fabric-cluster-upgrade/addingLBRules.png
[HealthPolices]: ./media/service-fabric-cluster-upgrade/Manage_AutomodeWadvSettings.PNG
[ARMUpgradeMode]: ./media/service-fabric-cluster-upgrade/ARMUpgradeMode.PNG
[Create_Manualmode]: ./media/service-fabric-cluster-upgrade/Create_Manualmode.PNG
[Manage_Automaticmode]: ./media/service-fabric-cluster-upgrade/Manage_Automaticmode.PNG
