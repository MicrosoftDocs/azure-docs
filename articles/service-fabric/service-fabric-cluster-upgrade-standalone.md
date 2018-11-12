---
title: Upgrade an Azure Service Fabric standalone cluster | Microsoft Docs
description: Learn about upgrading the version or configuration of an Azure Service Fabric standalone cluster.  T
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: timlt
editor: ''

ms.assetid: 15190ace-31ed-491f-a54b-b5ff61e718db
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/12/2018
ms.author: aljo

---
# Upgrading an Azure Service Fabric stand alone cluster

For any modern system, designing for upgradability is key to achieving long-term success of your product. An Azure Service Fabric cluster is a resource that you own, but is partly managed by Microsoft. This article describes what is managed automatically and what you can configure yourself.

## Controlling the fabric version that runs on your cluster
Make sure that your cluster always runs a supported Service Fabric version. When Microsoft announces the release of a new version of Service Fabric, the previous version is marked for end of support after a minimum of 60 days from the date of the announcement. New releases are announced [on the Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/). The new release is available to choose at that point.

You can set your cluster to receive automatic fabric upgrades as they are released by Microsoft or you can manually select a supported fabric version you want your cluster to be on. For more information, read [Upgrade the Service Fabric version that runs on your cluster](service-fabric-cluster-upgrade-windows-server.md).

## Configuration settings

Many different [configuration settings](service-fabric-cluster-manifest.md) can be set in the *ClusterConfig.json* file, such as the reliability level of the cluster and node properties.  To learn more, read [Upgrade the configuration of a standalone cluster](service-fabric-cluster-config-upgrade-windows-server.md).  Many other, more advanced, settings can also be customized.  For more information, read [Service Fabric cluster fabric settings](service-fabric-cluster-fabric-settings.md).

## Placement properties
For each of the node types, you can add custom placement properties that you want to use in your applications. NodeType is a default property that you can use without adding it explicitly.

> [!NOTE]
> For details on the use of placement constraints, node properties, and how to define them, refer to the section "Placement Constraints and Node Properties" in the Service Fabric Cluster Resource Manager Document on [Describing Your Cluster](service-fabric-cluster-resource-manager-cluster-description.md).
> 
> 

## Capacity metrics
For each of the node types, you can add custom capacity metrics that you want to use in your applications to report load. For details on the use of capacity metrics to report load, refer to the Service Fabric Cluster Resource Manager Documents on [Describing Your Cluster](service-fabric-cluster-resource-manager-cluster-description.md) and [Metrics and Load](service-fabric-cluster-resource-manager-metrics.md).

## Fabric upgrade settings - Health policies
You can specify custom health policies for fabric upgrade. If you have set your cluster to Automatic fabric upgrades, then these policies get applied to the Phase-1 of the automatic fabric upgrades.
If you have set your cluster for Manual fabric upgrades, then these policies get applied each time you select a new version triggering the system to kick off the fabric upgrade in your cluster. If you do not override the policies, the defaults are used.

You can specify the custom health policies or review the current settings under the "fabric upgrade" blade, by selecting the advanced upgrade settings. Review the following picture on how to. 

![Manage custom health policies][HealthPolices]

## Patch the Windows OS in the cluster nodes
Refer to [Patch Orchestration Application](service-fabric-patch-orchestration-application.md), which can be deployed on your cluster to install patches from Windows Update in an orchestrated manner, keeping the services available all the time. 


## Next steps
* Learn how to customize some of the [service fabric cluster fabric settings](service-fabric-cluster-fabric-settings.md)
* Learn how to [scale your cluster in and out](service-fabric-cluster-scale-up-down.md)
* Learn about [application upgrades](service-fabric-application-upgrade.md)

<!--Image references-->
[CertificateUpgrade]: ./media/service-fabric-cluster-upgrade/CertificateUpgrade2.png
[AddingProbes]: ./media/service-fabric-cluster-upgrade/addingProbes2.PNG
[AddingLBRules]: ./media/service-fabric-cluster-upgrade/addingLBRules.png
[HealthPolices]: ./media/service-fabric-cluster-upgrade/Manage_AutomodeWadvSettings.PNG
[ARMUpgradeMode]: ./media/service-fabric-cluster-upgrade/ARMUpgradeMode.PNG
[Create_Manualmode]: ./media/service-fabric-cluster-upgrade/Create_Manualmode.PNG
[Manage_Automaticmode]: ./media/service-fabric-cluster-upgrade/Manage_Automaticmode.PNG
