---
title: Upgrade an Azure Service Fabric cluster
description: Learn about upgrading the version or configuration of an Azure Service Fabric cluster—setting cluster update mode, upgrading certificates, adding application ports, doing OS patches, and what you can expect when the upgrades are performed.
ms.topic: conceptual
ms.date: 11/12/2018
ms.custom: sfrev
---
# Upgrading and updating an Azure Service Fabric cluster

For any modern system, designing for upgradability is key to achieving long-term success of your product. An Azure Service Fabric cluster is a resource that you own, but is partly managed by Microsoft. This article describes what is managed automatically and what you can configure yourself.

## Controlling the fabric version that runs on your cluster

Make sure your cluster is always running a [supported fabric version](service-fabric-versions.md). Each time Microsoft announces the release of a new version of Service Fabric, the previous version is marked for end of support after a minimum of 60 days from that date. New releases are announced on the [Service Fabric team blog](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric).

14 days prior to the expiry of the release your cluster is running, a health event is generated that puts your cluster into a warning health state. The cluster remains in a warning state until you upgrade to a supported fabric version.

You can set your cluster to receive automatic fabric upgrades as they are released by Microsoft or you can select a supported fabric version you want your cluster to be on.  To learn more, read [upgrade the Service Fabric version of your cluster](service-fabric-cluster-upgrade-version-azure.md).

## Fabric upgrade behavior during automatic upgrades

Microsoft maintains the fabric code and configuration that runs in an Azure cluster. We perform automatic monitored upgrades to the software on an as-needed basis. These upgrades could be code, configuration, or both. To make sure that your application suffers no impact or minimal impact due to these upgrades, upgrades are performed in the following phases:

### Phase 1: An upgrade is performed by using all cluster health policies

During this phase, the upgrades proceed one upgrade domain at a time, and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (for node health and application health) are adhered to during the upgrade.

If the cluster health policies are not met, the upgrade is rolled back and an email is sent to the owner of the subscription. The email contains the following information:

* Notification that we had to roll back a cluster upgrade.
* Suggested remedial actions, if any.
* The number of days (*n*) until we execute Phase 2.

We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. After the *n* days from the date the email was sent, we proceed to Phase 2.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run. This is to avoid sending you too many emails; receiving an email should be seen as an exception to normal. We expect most of the cluster upgrades to succeed without impacting your application availability.

### Phase 2: An upgrade is performed by using default health policies only

The health policies in this phase are set in such a way that the number of applications that were healthy at the beginning of the upgrade remains the same for the duration of the upgrade process. As in Phase 1, the Phase 2 upgrades proceed one upgrade domain at a time, and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (a combination of node health and the health all the applications running in the cluster) are adhered to for the duration of the upgrade.

If the cluster health policies in effect are not met, the upgrade is rolled back. Then an email is sent to the owner of the subscription. The email contains the following information:

* Notification that we had to roll back a cluster upgrade.
* Suggested remedial actions, if any.
* The number of days (n) until we execute Phase 3.

We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. A reminder email is sent a couple of days before n days are up. After the n days from the date the email was sent, we proceed to Phase 3. The emails we send you in Phase 2 must be taken seriously and remedial actions must be taken.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run.

### Phase 3: An upgrade is performed by using aggressive health policies

These health policies in this phase are geared towards completion of the upgrade rather than the health of the applications. Few cluster upgrades end up in this phase. If your cluster gets to this phase, there is a good chance that your application becomes unhealthy and/or lose availability.

Similar to the other two phases, Phase 3 upgrades proceed one upgrade domain at a time.

If the cluster health policies are not met, the upgrade is rolled back. We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. After that, the cluster is pinned, so that it will no longer receive support and/or upgrades.

An email with this information is sent to the subscription owner, along with the remedial actions. We do not expect any clusters to get into a state where Phase 3 has failed.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run.

## Manage certificates

Service Fabric uses [X.509 server certificates](service-fabric-cluster-security.md) that you specify when you create a cluster to secure communications between cluster nodes and authenticate clients. You can add, update, or delete certificates for the cluster and client in the [Azure portal](https://portal.azure.com) or using PowerShell/Azure CLI.  To learn more, read [add or remove certificates](service-fabric-cluster-security-update-certs-azure.md)

## Open application ports

You can change application ports by changing the Load Balancer resource properties that are associated with the node type. You can use the Azure portal, or you can use PowerShell/Azure CLI. For more information, read [Open application ports for a cluster](create-load-balancer-rule.md).

## Define node properties

Sometimes you may want to ensure that certain workloads run only on certain types of nodes in the cluster. For example, some workload may require GPUs or SSDs while others may not. For each of the node types in a cluster, you can add custom node properties to cluster nodes. Placement constraints are the statements attached to individual services that select for one or more node properties. Placement constraints define where services should run.

For details on the use of placement constraints, node properties, and how to define them, read [node properties and placement constraints](service-fabric-cluster-resource-manager-cluster-description.md#node-properties-and-placement-constraints).

## Add capacity metrics

For each of the node types, you can add custom capacity metrics that you want to use in your applications to report load. For details on the use of capacity metrics to report load, refer to the Service Fabric Cluster Resource Manager Documents on [Describing Your Cluster](service-fabric-cluster-resource-manager-cluster-description.md) and [Metrics and Load](service-fabric-cluster-resource-manager-metrics.md).

## Set health policies for automatic upgrades

You can specify custom health policies for fabric upgrade. If you have set your cluster to Automatic fabric upgrades, then these policies get applied to the Phase-1 of the automatic fabric upgrades.
If you have set your cluster for Manual fabric upgrades, then these policies get applied each time you select a new version triggering the system to kick off the fabric upgrade in your cluster. If you do not override the policies, the defaults are used.

You can specify the custom health policies or review the current settings under the "fabric upgrade" blade, by selecting the advanced upgrade settings. Review the following picture on how to.

![Manage custom health policies][HealthPolices]

## Customize Fabric settings for your cluster

Many different configuration settings can be customized on a cluster, such as the reliability level of the cluster and node properties. For more information, read [Service Fabric cluster fabric settings](service-fabric-cluster-fabric-settings.md).

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
