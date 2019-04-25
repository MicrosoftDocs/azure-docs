---
title: Upgrade an Azure Service Fabric cluster | Microsoft Docs
description: Upgrade the Service Fabric code and/or configuration that runs a Service Fabric cluster, including setting cluster update mode, upgrading certificates, adding application ports, doing OS patches, and so on. What can you expect when the upgrades are performed?
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
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
# Upgrade the Service Fabric version of a cluster

For any modern system, designing for upgradability is key to achieving long-term success of your product. An Azure Service Fabric cluster is a resource that you own, but is partly managed by Microsoft. This article describes how to upgrade the version of Service Fabric running in your Azure cluster.

You can set your cluster to receive automatic fabric upgrades as they are released by Microsoft or you can select a supported fabric version you want your cluster to be on.

You do this by setting the "upgradeMode" cluster configuration on the portal or using Resource Manager at the time of creation or later on a live cluster 

> [!NOTE]
> Make sure to keep your cluster running a supported fabric version always. As and when we announce the release of a new version of service fabric, the previous version is marked for end of support after a minimum of 60 days from that date. The new releases are announced [on the service fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/). The new release is available to choose then. 
> 
> 

14 days prior to the expiry of the release your cluster is running, a health event is generated that puts your cluster into a warning health state. The cluster remains in a warning state until you upgrade to a supported fabric version.

## Set the upgrade mode in the Azure portal
You can set the cluster to automatic or manual when you are creating the cluster.

![Create_Manualmode][Create_Manualmode]

You can set the cluster to automatic or manual when on a live cluster, using the manage experience. 

### Upgrading to a new version on a cluster that is set to Manual mode via portal.
To upgrade to a new version, all you need to do is select the available version from the dropdown and save. The Fabric upgrade gets kicked off automatically. The cluster health policies (a combination of node health and the health all the applications running in the cluster) are adhered to during the upgrade.

If the cluster health policies are not met, the upgrade is rolled back. Scroll down this document to read more on how to set those custom health policies. 

Once you have fixed the issues that resulted in the rollback, you need to initiate the upgrade again, by following the same steps as before.

![Manage_Automaticmode][Manage_Automaticmode]

## Set the upgrade mode using a Resource Manager template
Add the "upgradeMode" configuration to the Microsoft.ServiceFabric/clusters resource definition and set the "clusterCodeVersion" to one of the supported fabric versions as shown below and then deploy the template. The valid values for "upgradeMode" are "Manual" or "Automatic"

![ARMUpgradeMode][ARMUpgradeMode]

### Upgrading to a new version on a cluster that is set to Manual mode via a Resource Manager template.
When the cluster is in Manual mode, to upgrade to a new version, change the "clusterCodeVersion" to a supported version and deploy it. 
The deployment of the template, kicks of the Fabric upgrade gets kicked off automatically. The cluster health policies (a combination of node health and the health all the applications running in the cluster) are adhered to during the upgrade.

If the cluster health policies are not met, the upgrade is rolled back.  

Once you have fixed the issues that resulted in the rollback, you need to initiate the upgrade again, by following the same steps as before.

## Set custom health polices for upgrades
You can specify custom health polices for fabric upgrade. If you have set your cluster to Automatic fabric upgrades, then these policies get applied to the [Phase-1 of the automatic fabric upgrades](service-fabric-cluster-upgrade.md#fabric-upgrade-behavior-during-automatic-upgrades).
If you have set your cluster for Manual fabric upgrades, then these policies get applied each time you select a new version triggering the system to kick off the fabric upgrade in your cluster. If you do not override the policies, the defaults are used.

You can specify the custom health policies or review the current settings under the "fabric upgrade" blade, by selecting the advanced upgrade settings. Review the following picture on how to. 

![Manage custom health policies][HealthPolices]

## List all available versions for all environments for a given subscription
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
