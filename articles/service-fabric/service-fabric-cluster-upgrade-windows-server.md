---
title: Upgrade a standalone Azure Service Fabric cluster on Windows Server | Microsoft Docs
description: Upgrade the Azure Service Fabric code and/or configuration that runs a standalone Service Fabric cluster, including setting the cluster update mode.
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.assetid: 66296cc6-9524-4c6a-b0a6-57c253bdf67e
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/02/2017
ms.author: chackdan

---
# Upgrade your standalone Azure Service Fabric cluster on Windows Server
> [!div class="op_single_selector"]
> * [Azure cluster](service-fabric-cluster-upgrade.md)
> * [Standalone cluster](service-fabric-cluster-upgrade-windows-server.md)
>
>

For any modern system, designing for upgradability is key to achieving long-term success of your product. An Azure Service Fabric cluster is a resource that you own. This article describes how you can make sure that the cluster always runs supported versions of the Service Fabric code and configurations.

## Control the fabric version that runs on your cluster
You can set your cluster to download the Service Fabric updates when Microsoft releases a new version. The other option is to select a supported fabric version for your cluster.

To control the fabric version, set the "fabricClusterAutoupgradeEnabled" cluster configuration to true or false.

> [!NOTE]
> Make sure your cluster always runs a supported Service Fabric version. When the release of a new version of Service Fabric is announced, the previous version is marked for end of support after a minimum of 60 days from that date. The new releases are announced [on the Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/).
>
>

You can upgrade your cluster to the new version only if you're using a production-style node configuration, where each Service Fabric node is allocated on a separate physical or virtual machine. If you have a development cluster, where there's more than one Service Fabric node on a single physical or virtual machine, you must tear down your cluster and re-create it with the new version.

The following two workflows are available to upgrade your cluster to the latest version, or to a supported Service Fabric version:


*   Clusters that have connectivity to download the latest version automatically
*   Clusters that have no connectivity to download the latest Service Fabric version

### Upgrade the clusters with connectivity to download the latest code and configuration
Use these steps to upgrade your cluster to a supported version, if your cluster nodes have Internet connectivity to the [Microsoft Download Center](http://download.microsoft.com).

For clusters that have connectivity to the [Microsoft Download Center](http://download.microsoft.com), we periodically check for the availability of new Service Fabric versions.

When a new Service Fabric version is available, the package is downloaded locally to the cluster and provisioned for upgrade. Additionally, to inform the customer of this new version, the system places an explicit cluster health warning similar to the following:

“The current cluster version [version#] support ends [Date]."

After the cluster is running the latest version, the warning is removed.

#### Cluster upgrade workflow
After you see the cluster health warning, you need to do the following:

1. Connect to the cluster from any machine that has administrator access to all the machines that are listed as nodes in the cluster. The machine that the following script runs on does not have to be part of the cluster.

    ```powershell

    ###### Connect to the secure cluster using certs
    $ClusterName= "mysecurecluster.something.com:19000"
    $CertThumbprint= "70EF5E22ADB649799DA3C8B6A6BF7FG2D630F8F3"
    Connect-serviceFabricCluster -ConnectionEndpoint $ClusterName -KeepAliveIntervalInSec 10 `
        -X509Credential `
        -ServerCertThumbprint $CertThumbprint  `
        -FindType FindByThumbprint `
        -FindValue $CertThumbprint `
        -StoreLocation CurrentUser `
        -StoreName My
    ```

2. Get the list of Service Fabric versions that you can upgrade to.

    ```powershell

    ###### Get the list of available Service Fabric versions
    Get-ServiceFabricRegisteredClusterCodeVersion
    ```

    You should receive an output similar to this:

    ![Get Service Fabric versions][getfabversions]

3. Start a cluster upgrade to one of the available versions by using the
   [Start-ServiceFabricClusterUpgrade](https://msdn.microsoft.com/library/mt125872.aspx) Windows PowerShell command.

    ```powershell

    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion <codeversion#> -Monitored -FailureAction Rollback

    ###### Cluster upgrade example

    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion 5.3.301.9590 -Monitored -FailureAction Rollback

    ```
   To monitor the progress of the upgrade, you can use Service Fabric Explorer or run the following Windows PowerShell command.

    ```powershell

    Get-ServiceFabricClusterUpgrade
    ```

If the cluster health policies are not met, the upgrade is rolled back. You can specify custom health policies at the time for the Start-ServiceFabricClusterUpgrade command. For more information, see [Start-ServiceFabricClusterUpgrade](https://msdn.microsoft.com/library/mt125872.aspx).

After you've fixed the issues that resulted in the rollback, you need to initiate the upgrade again, by following the same steps as before.

### Upgrade the clusters with no connectivity to download the latest code and configuration
Use the procedures in this section to upgrade your cluster to a supported version, if your cluster nodes don't have Internet connectivity to the [Microsoft Download Center](http://download.microsoft.com).

> [!NOTE]
> If you're running a cluster that is not Internet connected, you will have to monitor the [Service Fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/) for notifications about a new release. The system *doesn't* place a cluster health warning to alert you about the release.  
>
>

1. Modify your cluster configuration to set the following property to false.

        "fabricClusterAutoupgradeEnabled": false,

2.      Start a configuration upgrade. For more information, see [Start-ServiceFabricClusterConfigurationUpgrade](https://msdn.microsoft.com/en-us/library/mt788302.aspx). Before you start the configuration upgrade, update the clusterConfigurationVersion value in your JavaScript Object Notation (JSON) file.

```powershell

    Start-ServiceFabricClusterConfigurationUpgrade -ClusterConfigPath <Path to Configuration File>

```

#### Cluster upgrade workflow
1. Download the latest version of the package from the [Create Service Fabric cluster for Windows Server](service-fabric-cluster-creation-for-windows-server.md) document.
2. Connect to the cluster from any machine that has administrator access to all the machines that are listed as nodes in the cluster. The machine that this script runs on doesn't have to be part of the cluster.

    ```powershell

    ###### Connect to the cluster
    $ClusterName= "mysecurecluster.something.com:19000"
    $CertThumbprint= "70EF5E22ADB649799DA3C8B6A6BF7FG2D630F8F3"
    Connect-serviceFabricCluster -ConnectionEndpoint $ClusterName -KeepAliveIntervalInSec 10 `
        -X509Credential `
        -ServerCertThumbprint $CertThumbprint  `
        -FindType FindByThumbprint `
        -FindValue $CertThumbprint `
        -StoreLocation CurrentUser `
        -StoreName My
    ```
3. Copy the downloaded package into the cluster image store.

    ```powershell

   ###### Get the list of available Service Fabric versions
    Copy-ServiceFabricClusterPackage -Code -CodePackagePath <name of the .cab file including the path to it> -ImageStoreConnectionString "fabric:ImageStore"

   ###### Code example
    Copy-ServiceFabricClusterPackage -Code -CodePackagePath .\MicrosoftAzureServiceFabric.5.3.301.9590.cab -ImageStoreConnectionString "fabric:ImageStore"

    ```

4. Register the copied package.

    ```powershell

    ###### Get the list of available Service Fabric versions
    Register-ServiceFabricClusterPackage -Code -CodePackagePath <name of the .cab file>

    ###### Code example
    Register-ServiceFabricClusterPackage -Code -CodePackagePath MicrosoftAzureServiceFabric.5.3.301.9590.cab

     ```
5. Start a cluster upgrade to one of the versions that is available.

    ```Powershell

    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion <codeversion#> -Monitored -FailureAction Rollback

    ###### Code example
    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion 5.3.301.9590 -Monitored -FailureAction Rollback

    ```
   To monitor the progress of the upgrade, you can use Service Fabric Explorer or run the following Windows PowerShell command.

    ```powershell

    Get-ServiceFabricClusterUpgrade
    ```

    If the cluster health policies are not met, the upgrade is rolled back. You can specify custom health policies at the time for the start-serviceFabricClusterUpgrade command. For more information, see [Start-ServiceFabricClusterUpgrade](https://msdn.microsoft.com/library/mt125872.aspx).

After you've fixed the issues that resulted in the rollback, you need to initiate the upgrade again, by following the same steps as before.


## Upgrade the cluster configuration
To upgrade the cluster configuration, run the Start-ServiceFabricClusterConfigurationUpgrade command. The configuration upgrade is processed by upgrade domain.

```powershell

    Start-ServiceFabricClusterConfigurationUpgrade -ClusterConfigPath <Path to Configuration File>

```


## Next steps
* Learn how to customize some of the [Service Fabric cluster fabric settings](service-fabric-cluster-fabric-settings.md).
* Learn how to [scale your cluster in and out](service-fabric-cluster-scale-up-down.md).
* Learn about [application upgrades](service-fabric-application-upgrade.md).

<!--Image references-->
[getfabversions]: ./media/service-fabric-cluster-upgrade-windows-server/getfabversions.PNG
