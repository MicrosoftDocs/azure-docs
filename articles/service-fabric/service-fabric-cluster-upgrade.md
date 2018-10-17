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
ms.date: 8/10/2017
ms.author: aljo

---
# Upgrade an Azure Service Fabric cluster
> [!div class="op_single_selector"]
> * [Azure Cluster](service-fabric-cluster-upgrade.md)
> * [Standalone Cluster](service-fabric-cluster-upgrade-windows-server.md)
> 
> 

For any modern system, designing for upgradability is key to achieving long-term success of your product. An Azure Service Fabric cluster is a resource that you own, but is partly managed by Microsoft. This article describes what is managed automatically and what you can configure yourself.

## Controlling the fabric version that runs on your Cluster
You can set your cluster to receive automatic fabric upgrades as they are released by Microsoft or you can select a supported fabric version you want your cluster to be on.

You do this by setting the "upgradeMode" cluster configuration on the portal or using Resource Manager at the time of creation or later on a live cluster 

> [!NOTE]
> Make sure to keep your cluster running a supported fabric version always. As and when we announce the release of a new version of service fabric, the previous version is marked for end of support after a minimum of 60 days from that date. The new releases are announced [on the service fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/). The new release is available to choose then. 
> 
> 

14 days prior to the expiry of the release your cluster is running, a health event is generated that puts your cluster into a warning health state. The cluster remains in a warning state until you upgrade to a supported fabric version.

### Setting the upgrade mode via portal
You can set the cluster to automatic or manual when you are creating the cluster.

![Create_Manualmode][Create_Manualmode]

You can set the cluster to automatic or manual when on a live cluster, using the manage experience. 

#### Upgrading to a new version on a cluster that is set to Manual mode via portal.
To upgrade to a new version, all you need to do is select the available version from the dropdown and save. The Fabric upgrade gets kicked off automatically. The cluster health policies (a combination of node health and the health all the applications running in the cluster) are adhered to during the upgrade.

If the cluster health policies are not met, the upgrade is rolled back. Scroll down this document to read more on how to set those custom health policies. 

Once you have fixed the issues that resulted in the rollback, you need to initiate the upgrade again, by following the same steps as before.

![Manage_Automaticmode][Manage_Automaticmode]

### Setting the upgrade mode via a Resource Manager template
Add the "upgradeMode" configuration to the Microsoft.ServiceFabric/clusters resource definition and set the "clusterCodeVersion" to one of the supported fabric versions as shown below and then deploy the template. The valid values for "upgradeMode" are "Manual" or "Automatic"

![ARMUpgradeMode][ARMUpgradeMode]

#### Upgrading to a new version on a cluster that is set to Manual mode via a Resource Manager template.
When the cluster is in Manual mode, to upgrade to a new version, change the "clusterCodeVersion" to a supported version and deploy it. 
The deployment of the template, kicks of the Fabric upgrade gets kicked off automatically. The cluster health policies (a combination of node health and the health all the applications running in the cluster) are adhered to during the upgrade.

If the cluster health policies are not met, the upgrade is rolled back. Scroll down this document to read more on how to set those custom health policies. 

Once you have fixed the issues that resulted in the rollback, you need to initiate the upgrade again, by following the same steps as before.

### Get list of all available version for all environments for a given subscription
Run the following command, and you should get an output similar to this.

"supportExpiryUtc" tells your when a given release is expiring or has expired. The latest release does not have a valid date - it has a value of "9999-12-31T23:59:59.9999999", which just means that the expiry date is not yet set.

```REST
GET https://<endpoint>/subscriptions/{{subscriptionId}}/providers/Microsoft.ServiceFabric/locations/{{location}}/clusterVersions?api-version=2016-09-01

Example: https://management.azure.com/subscriptions/1857f442-3bce-4b96-ad95-627f76437a67/providers/Microsoft.ServiceFabric/locations/eastus/clusterVersions?api-version=2016-09-01

Output:
{
                  "value": [
                    {
                      "id": "subscriptions/35349203-a0b3-405e-8a23-9f1450984307/providers/Microsoft.ServiceFabric/environments/Windows/clusterVersions/5.0.1427.9490",
                      "name": "5.0.1427.9490",
                      "type": "Microsoft.ServiceFabric/environments/clusterVersions",
                      "properties": {
                        "codeVersion": "5.0.1427.9490",
                        "supportExpiryUtc": "2016-11-26T23:59:59.9999999",
                        "environment": "Windows"
                      }
                    },
                    {
                      "id": "subscriptions/35349203-a0b3-405e-8a23-9f1450984307/providers/Microsoft.ServiceFabric/environments/Windows/clusterVersions/4.0.1427.9490",
                      "name": "5.1.1427.9490",
                      "type": " Microsoft.ServiceFabric/environments/clusterVersions",
                      "properties": {
                        "codeVersion": "5.1.1427.9490",
                        "supportExpiryUtc": "9999-12-31T23:59:59.9999999",
                        "environment": "Windows"
                      }
                    },
                    {
                      "id": "subscriptions/35349203-a0b3-405e-8a23-9f1450984307/providers/Microsoft.ServiceFabric/environments/Windows/clusterVersions/4.4.1427.9490",
                      "name": "4.4.1427.9490",
                      "type": " Microsoft.ServiceFabric/environments/clusterVersions",
                      "properties": {
                        "codeVersion": "4.4.1427.9490",
                        "supportExpiryUtc": "9999-12-31T23:59:59.9999999",
                        "environment": "Linux"
                      }
                    }
                  ]
                }


```

## Fabric upgrade behavior when the cluster Upgrade Mode is Automatic
Microsoft maintains the fabric code and configuration that runs in an Azure cluster. We perform automatic monitored upgrades to the software on an as-needed basis. These upgrades could be code, configuration, or both. To make sure that your application suffers no impact or minimal impact due to these upgrades, we perform the upgrades in the following phases:

### Phase 1: An upgrade is performed by using all cluster health policies
During this phase, the upgrades proceed one upgrade domain at a time, and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (a combination of node health and the health all the applications running in the cluster) are adhered to during the upgrade.

If the cluster health policies are not met, the upgrade is rolled back. Then an email is sent to the owner of the subscription. The email contains the following information:

* Notification that we had to roll back a cluster upgrade.
* Suggested remedial actions, if any.
* The number of days (n) until we execute Phase 2.

We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. After the n days from the date the email was sent, we proceed to Phase 2.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run. This is to avoid sending you too many emails--receiving an email should be seen as an exception to normal. We expect most of the cluster upgrades to succeed without impacting your application availability.

### Phase 2: An upgrade is performed by using default health policies only
The health policies in this phase are set in such a way that the number of applications that were healthy at the beginning of the upgrade remains the same for the duration of the upgrade process. As in Phase 1, the Phase 2 upgrades proceed one upgrade domain at a time, and the applications that were running in the cluster continue to run without any downtime. The cluster health policies (a combination of node health and the health all the applications running in the cluster) are adhered to for the duration of the upgrade.

If the cluster health policies in effect are not met, the upgrade is rolled back. Then an email is sent to the owner of the subscription. The email contains the following information:

* Notification that we had to roll back a cluster upgrade.
* Suggested remedial actions, if any.
* The number of days (n) until we execute Phase 3.

We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. A reminder email is sent a couple of days before n days are up. After the n days from the date the email was sent, we proceed to Phase 3. The emails we send you in Phase 2 must be taken seriously and remedial actions must be taken.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run.

### Phase 3: An upgrade is performed by using aggressive health policies
These health policies in this phase are geared towards completion of the upgrade rather than the health of the applications. Very few cluster upgrades end up in this phase. If your cluster gets to this phase, there is a good chance that your application becomes unhealthy and/or lose availability.

Similar to the other two phases, Phase 3 upgrades proceed one upgrade domain at a time.

If the cluster health policies are not met, the upgrade is rolled back. We try to execute the same upgrade a few more times in case any upgrades failed for infrastructure reasons. After that, the cluster is pinned, so that it will no longer receive support and/or upgrades.

An email with this information is sent to the subscription owner, along with the remedial actions. We do not expect any clusters to get into a state where Phase 3 has failed.

If the cluster health policies are met, the upgrade is considered successful and marked complete. This can happen during the initial upgrade or any of the upgrade reruns in this phase. There is no email confirmation of a successful run.

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
