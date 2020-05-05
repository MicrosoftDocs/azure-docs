---
title: Upgrade the configuration of a standalone cluster 
description: Learn how to upgrade the configuration that runs a standalone Service Fabric cluster.
author: dkkapur

ms.topic: conceptual
ms.date: 11/09/2018
ms.author: dekapur
---
# Upgrade the configuration of a standalone cluster 

For any modern system, the ability to upgrade is key to the long-term success of your product. An Azure Service Fabric cluster is a resource that you own. This article describes how to upgrade the configuration settings of your standalone Service Fabric cluster.

## Customize cluster settings in the ClusterConfig.json file
Standalone clusters are configured through the *ClusterConfig.json* file. To learn more about the different settings, see [Configuration settings for a standalone Windows cluster](service-fabric-cluster-manifest.md).

You can add, update, or remove settings in the `fabricSettings` section under the [Cluster properties](./service-fabric-cluster-manifest.md#cluster-properties) section in *ClusterConfig.json*. 

For example, the following JSON adds a new setting *MaxDiskQuotaInMB* to the *Diagnostics* section under `fabricSettings`:

```json
      {
        "name": "Diagnostics",
        "parameters": [
          {
            "name": "MaxDiskQuotaInMB",
            "value": "65536"
          }
        ]
      }
```

After you've modified the settings in your ClusterConfig.json file, [test the cluster configuration](#test-the-cluster-configuration) and then [upgrade the cluster configuration](#upgrade-the-cluster-configuration) to apply the settings to your cluster. 

## Test the cluster configuration
Before you initiate the configuration upgrade, you can test your new cluster configuration JSON by running the following PowerShell script in the standalone package:

```powershell
TestConfiguration.ps1 -ClusterConfigFilePath <Path to the new Configuration File> -OldClusterConfigFilePath <Path to the old Configuration File>
```

Or use this script:

```powershell
TestConfiguration.ps1 -ClusterConfigFilePath <Path to the new Configuration File> -OldClusterConfigFilePath <Path to the old Configuration File> -FabricRuntimePackagePath <Path to the .cab file which you want to test the configuration against>
```

Some configurations can't be upgraded, such as endpoints, cluster name, node IP, etc. The new cluster configuration JSON is tested against the old one and throws errors in the PowerShell window if there's an issue.

## Upgrade the cluster configuration
To upgrade the cluster configuration upgrade, run [Start-ServiceFabricClusterConfigurationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/start-servicefabricclusterconfigurationupgrade). The configuration upgrade is processed upgrade domain by upgrade domain.

```powershell
Start-ServiceFabricClusterConfigurationUpgrade -ClusterConfigPath <Path to Configuration File>
```

## Upgrade cluster certificate configuration
A cluster certificate is used for authentication between cluster nodes. The certificate rollover should be performed with extra caution because failure blocks the communication among cluster nodes.

Four options are supported:  

* Single certificate upgrade: The upgrade path is Certificate A (Primary) -> Certificate B (Primary) -> Certificate C (Primary) ->....

* Double certificate upgrade: The upgrade path is Certificate A (Primary) -> Certificate A (Primary) and B (Secondary) -> Certificate B (Primary) -> Certificate B (Primary) and C (Secondary) -> Certificate C (Primary) ->....

* Certificate type upgrade: Thumbprint-based certificate configuration <-> CommonName-based certificate configuration. For example, Certificate Thumbprint A (Primary) and Thumbprint B (Secondary) -> Certificate CommonName C.

* Certificate issuer thumbprint upgrade: The upgrade path is Certificate CN=A,IssuerThumbprint=IT1 (Primary) -> Certificate CN=A,IssuerThumbprint=IT1,IT2 (Primary) -> Certificate CN=A,IssuerThumbprint=IT2 (Primary).


## Next steps
* Learn how to customize some [Service Fabric cluster settings](service-fabric-cluster-fabric-settings.md).
* Learn how to [scale your cluster in and out](service-fabric-cluster-scale-in-out.md).
* Learn about [application upgrades](service-fabric-application-upgrade.md).

<!--Image references-->
[getfabversions]: ./media/service-fabric-cluster-upgrade-windows-server/getfabversions.PNG
