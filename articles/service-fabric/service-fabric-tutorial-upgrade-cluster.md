---
title: Upgrade the Service Fabric runtime in Azure 
description: In this tutorial, you learn how to use PowerShell to upgrade the runtime of an Azure-hosted Service Fabric cluster.
ms.topic: tutorial
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-azurepowershell
services: service-fabric
ms.date: 07/14/2022
---

# Tutorial: Upgrade the runtime of a Service Fabric cluster in Azure

This tutorial is part four of a series, and shows you how to upgrade the Service Fabric runtime on an Azure Service Fabric cluster. This tutorial part is written for Service Fabric clusters running on Azure and doesn't apply to standalone Service Fabric clusters.

> [!WARNING]
> This part of the tutorial requires PowerShell. Support for upgrading the cluster runtime is not yet supported by the Azure CLI tools. Alternatively, a cluster can be upgraded in the portal. For more information, see [Upgrade an Azure Service Fabric cluster](service-fabric-cluster-upgrade.md).

If your cluster is already running the latest Service Fabric runtime, you don't need to do this step. However, this article can be used to install any supported runtime on an Azure Service Fabric cluster.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Read the cluster version
> * Set the cluster version

In this tutorial series you learn how to:
> [!div class="checklist"]
> * Create a secure [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md) on Azure using a template
> * [Monitor a cluster](service-fabric-tutorial-monitor-cluster.md)
> * [Scale a cluster in or out](service-fabric-tutorial-scale-cluster.md)
> * Upgrade the runtime of a cluster
> * [Delete a cluster](service-fabric-tutorial-delete-cluster.md)


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Prerequisites

Before you begin this tutorial:

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F)
* Install [Azure PowerShell](/powershell/azure/install-azure-powershell) or [Azure CLI](/cli/azure/install-azure-cli).
* Create a secure [Windows cluster](service-fabric-tutorial-create-vnet-and-windows-cluster.md) on Azure
* Set up a Windows development environment. Install [Visual Studio 2019](https://www.visualstudio.com) and the **Azure development**, **ASP.NET and web development**, and **.NET Core cross-platform development** workloads.  Then set up a [.NET development environment](service-fabric-get-started.md).

### Sign in to Azure

Sign in to your Azure account select your subscription before you execute Azure commands.

```powershell
Connect-AzAccount
Get-AzSubscription
Set-AzContext -SubscriptionId <guid>
```

## Get the runtime version

After you've connected to Azure, selected the subscription containing the Service Fabric cluster, you can get the runtime version of the cluster.

```powershell
Get-AzServiceFabricCluster -ResourceGroupName SFCLUSTERTUTORIALGROUP -Name aztestcluster `
    | Select-Object ClusterCodeVersion
```

Or, just get a list of all clusters in your subscription with the following example:

```powershell
Get-AzServiceFabricCluster | Select-Object Name, ClusterCodeVersion
```

Note the **ClusterCodeVersion** value. This value will be used in the next section.

## Upgrade the runtime

Use the value of **ClusterCodeVersion** from the previous section with the `Get-ServiceFabricRuntimeUpgradeVersion` cmdlet to discover what versions are available to upgrade to. This cmdlet can only be run from a computer connected to the internet. For example, if you wanted to see what runtime versions you could upgrade to from version `5.7.198.9494`, use the following command:

```powershell
Get-ServiceFabricRuntimeUpgradeVersion -BaseVersion "5.7.198.9494"
```

With a list of versions, you can tell the Azure Service Fabric cluster to upgrade to a newer runtime. For example, if version `6.0.219.9494` is available to upgrade to, use the following command to upgrade your cluster.

```powershell
Set-AzServiceFabricUpgradeType -ResourceGroupName SFCLUSTERTUTORIALGROUP `
                                    -Name aztestcluster `
                                    -UpgradeMode Manual `
                                    -Version "6.0.219.9494"
```

> [!IMPORTANT]
> The cluster runtime upgrade may take a long time to complete. PowerShell is blocked while the upgrade is running. You can use another PowerShell session to check the status of the upgrade.

The status of the upgrade can be monitored with either PowerShell or the Azure Service Fabric CLI (sfctl).

First connect to the cluster with the TLS/SSL certificate created in the first part of the tutorial. Use the `Connect-ServiceFabricCluster` cmdlet or `sfctl cluster upgrade-status`.

```powershell
$endpoint = "<mycluster>.southcentralus.cloudapp.azure.com:19000"
$thumbprint = "63EB5BA4BC2A3BADC42CA6F93D6F45E5AD98A1E4"

Connect-ServiceFabricCluster -ConnectionEndpoint $endpoint `
                             -KeepAliveIntervalInSec 10 `
                             -X509Credential -ServerCertThumbprint $thumbprint `
                             -FindType FindByThumbprint -FindValue $thumbprint `
                             -StoreLocation CurrentUser -StoreName My
```

```console
sfctl cluster select --endpoint https://aztestcluster.southcentralus.cloudapp.azure.com:19080 \
--pem ./aztestcluster201709151446.pem --no-verify
```

Next, use `Get-ServiceFabricClusterUpgrade` or `sfctl cluster upgrade-status` to display the status. Something similar to the following result is shown.

```powershell
Get-ServiceFabricClusterUpgrade

TargetCodeVersion                          : 6.0.219.9494
TargetConfigVersion                        : 3
StartTimestampUtc                          : 11/28/2017 3:09:48 AM
UpgradeState                               : RollingForwardPending
UpgradeDuration                            : 00:09:00
CurrentUpgradeDomainDuration               : 00:09:00
NextUpgradeDomain                          : 1
UpgradeDomainsStatus                       : { "0" = "Completed";
                                             "1" = "Pending";
                                             "2" = "Pending";
                                             "3" = "Pending";
                                             "4" = "Pending" }
UpgradeKind                                : Rolling
RollingUpgradeMode                         : Monitored
FailureAction                              : Rollback
ForceRestart                               : False
UpgradeReplicaSetCheckTimeout              : 37201.09:59:01
HealthCheckWaitDuration                    : 00:05:00
HealthCheckStableDuration                  : 00:05:00
HealthCheckRetryTimeout                    : 00:45:00
UpgradeDomainTimeout                       : 02:00:00
UpgradeTimeout                             : 12:00:00
ConsiderWarningAsError                     : False
MaxPercentUnhealthyApplications            : 0
MaxPercentUnhealthyNodes                   : 100
ApplicationTypeHealthPolicyMap             : {}
EnableDeltaHealthEvaluation                : True
MaxPercentDeltaUnhealthyNodes              : 0
MaxPercentUpgradeDomainDeltaUnhealthyNodes : 0
ApplicationHealthPolicyMap                 : {}
```

```console
sfctl cluster upgrade-status

{
  "codeVersion": "6.0.219.9494",
  "configVersion": "3",

... item cut to save space ...

  },
  "upgradeDomains": [
    {
      "name": "0",
      "state": "Completed"
    },
    {
      "name": "1",
      "state": "Pending"
    },
    {
      "name": "2",
      "state": "Pending"
    },
    {
      "name": "3",
      "state": "Pending"
    },
    {
      "name": "4",
      "state": "Pending"
    }
  ],
  "upgradeDurationInMilliseconds": "PT1H2M4.63889S",
  "upgradeState": "RollingForwardPending"
}
```

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Get the version of the cluster runtime
> * Upgrade the cluster runtime
> * Monitor the upgrade

Advance to the next tutorial:

> [!div class="nextstepaction"]
> [Delete a cluster](service-fabric-tutorial-delete-cluster.md)
