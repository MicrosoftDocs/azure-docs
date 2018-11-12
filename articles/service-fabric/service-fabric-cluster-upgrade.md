---
title: Upgrade an Azure Service Fabric cluster | Microsoft Docs
description: Upgrade the Service Fabric code and/or configuration that runs a Service Fabric cluster, including setting cluster update mode, upgrading certificates, adding application ports, doing OS patches, and so on. What can you expect when the upgrades are performed?
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
ms.date: 11/09/2018
ms.author: aljo

---
# Upgrading and updating a Service Fabric cluster

For any modern system, designing for upgradability is key to achieving long-term success of your product. An Azure Service Fabric cluster is a resource that you own, but is partly managed by Microsoft. This article describes what is managed automatically and what you can configure yourself.

## Upgrade or control the Service Fabric version of the cluster
You can set your cluster to receive automatic fabric upgrades as they are released by Microsoft or you can select a supported fabric version you want your cluster to be on.

## Upgrade cluster configuration
In addition to the ability to set the cluster upgrade mode, Here are the configurations that you can change on a live cluster.

## Patch cluster nodes

### Azure clusters
### Standalone clusters

## Set access control

## Manage cluster certificates



## Cluster configurations that you control
In addition to the ability to set the cluster upgrade mode, Here are the configurations that you can change on a live cluster.

### Certificates
You can add new or delete certificates for the cluster and client via the portal easily. Refer to [this document for detailed instructions](service-fabric-cluster-security-update-certs-azure.md)

![Screenshot that shows certificate thumbprints in the Azure portal.][CertificateUpgrade]

### Application ports
You can change application ports by changing the Load Balancer resource properties that are associated with the node type. You can use the portal, or you can use Resource Manager PowerShell directly.

To open a new port on all VMs in a node type, do the following:

1. Add a new probe to the appropriate load balancer.
   
    If you deployed your cluster by using the portal, the load balancers are named "LB-name of the Resource group-NodeTypename", one for each node type. Since the load balancer names are unique only within a resource group, it is best if you search for them under a specific resource group.
   
    ![Screenshot that shows adding a probe to a load balancer in the portal.][AddingProbes]
2. Add a new rule to the load balancer.
   
    Add a new rule to the same load balancer by using the probe that you created in the previous step.
   
    ![Adding a new rule to a load balancer in the portal.][AddingLBRules]

### Placement properties
For each of the node types, you can add custom placement properties that you want to use in your applications. NodeType is a default property that you can use without adding it explicitly.

> [!NOTE]
> For details on the use of placement constraints, node properties, and how to define them, refer to the section "Placement Constraints and Node Properties" in the Service Fabric Cluster Resource Manager Document on [Describing Your Cluster](service-fabric-cluster-resource-manager-cluster-description.md).
> 
> 

### Capacity metrics
For each of the node types, you can add custom capacity metrics that you want to use in your applications to report load. For details on the use of capacity metrics to report load, refer to the Service Fabric Cluster Resource Manager Documents on [Describing Your Cluster](service-fabric-cluster-resource-manager-cluster-description.md) and [Metrics and Load](service-fabric-cluster-resource-manager-metrics.md).

### Fabric upgrade settings - Health polices
You can specify custom health polices for fabric upgrade. If you have set your cluster to Automatic fabric upgrades, then these policies get applied to the Phase-1 of the automatic fabric upgrades.
If you have set your cluster for Manual fabric upgrades, then these policies get applied each time you select a new version triggering the system to kick off the fabric upgrade in your cluster. If you do not override the policies, the defaults are used.

You can specify the custom health policies or review the current settings under the "fabric upgrade" blade, by selecting the advanced upgrade settings. Review the following picture on how to. 

![Manage custom health policies][HealthPolices]

### Customize Fabric settings for your cluster
Refer to [service fabric cluster fabric settings](service-fabric-cluster-fabric-settings.md) on what and how you can customize them.

### OS patches on the VMs that make up the cluster
Refer to [Patch Orchestration Application](service-fabric-patch-orchestration-application.md) which can be deployed on your cluster to install patches from Windows Update in an orchestrated manner, keeping the services available all the time. 

### OS upgrades on the VMs that make up the cluster
If you must upgrade the OS image on the virtual machines of the cluster, you must do it one VM at a time. You are responsible for this upgrade--there is currently no automation for this.

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
