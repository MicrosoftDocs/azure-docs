---
title: Upgrade the version of a standalone cluster 
description: Upgrade the Azure Service Fabric code that runs a standalone Service Fabric cluster.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/14/2022
---

# Upgrade the Service Fabric version that runs on your cluster 

For any modern system, the ability to upgrade is key to the long-term success of your product. An Azure Service Fabric cluster is a resource that you own. This article describes how to upgrade the version of Service Fabric running on your standalone cluster.

> [!NOTE]
> Make sure that your cluster always runs a supported Service Fabric version. When Microsoft announces the release of a new version of Service Fabric, the previous version is marked for end of support after a minimum of 60 days from the date of the announcement. New releases are announced [on the Service Fabric team blog](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric). The new release is available to choose at that point.
>
>

You can upgrade your cluster to the new version only if you're using a production-style node configuration, where each Service Fabric node is allocated on a separate physical or virtual machine. If you have a development cluster, where more than one Service Fabric node is on a single physical or virtual machine, you must re-create the cluster with the new version.

Two distinct workflows can upgrade your cluster to the latest version or a supported Service Fabric version. One workflow is for clusters that have connectivity to download the latest version automatically. The other workflow is for clusters that don't have connectivity to download the latest Service Fabric version.

## Enable auto-upgrade of the Service Fabric version of your cluster
To set your cluster to download updates of Service Fabric when Microsoft releases a new version, set the `fabricClusterAutoupgradeEnabled` cluster configuration to *true*. To manually select a supported version of Service Fabric that you want your cluster to be on, set the `fabricClusterAutoupgradeEnabled` cluster configuration to *false*.

## Upgrade clusters that have connectivity to download the latest code and configuration
Use these steps to upgrade your cluster to a supported version if your cluster nodes have internet connectivity to the [Microsoft Download Center](https://download.microsoft.com).

For clusters that have connectivity to the [Microsoft Download Center](https://download.microsoft.com), Microsoft periodically checks for the availability of new Service Fabric versions.

When a new Service Fabric version is available, the package is downloaded locally to the cluster and provisioned for upgrade. Additionally, to inform the customer of this new version, the system shows an explicit cluster health warning that's similar to the following:

"The current cluster version [version #] support ends [date]."

After the cluster is running the latest version, the warning goes away.

When you see the cluster health warning, upgrade the cluster:

1. Connect to the cluster from any machine that has administrator access to all the machines that are listed as nodes in the cluster. The machine that this script is run on doesn't have to be part of the cluster.

    ```powershell
    ###### connect to the secure cluster using certs
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

    You should get an output similar to this:

    ![Get Service Fabric versions][getfabversions]
3. Start a cluster upgrade to an available version by using the
   [Start-ServiceFabricClusterUpgrade](/powershell/module/servicefabric/start-servicefabricclusterupgrade) Windows PowerShell command.

    ```powershell
    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion <codeversion#> -Monitored -FailureAction Rollback

    ###### Here is a filled-out example

    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion 5.3.301.9590 -Monitored -FailureAction Rollback
    ```
   To monitor the progress of the upgrade, you can use Service Fabric Explorer or run the following PowerShell command:

    ```powershell
    Get-ServiceFabricClusterUpgrade
    ```

    If the cluster health policies aren't met, the upgrade is rolled back. To specify custom health policies for the Start-ServiceFabricClusterUpgrade command, see the documentation for [Start-ServiceFabricClusterUpgrade](/powershell/module/servicefabric/start-servicefabricclusterupgrade).

    After you fix the issues that resulted in the rollback, initiate the upgrade again by following the same steps as previously described.

## Upgrade clusters that have *no connectivity* to download the latest code and configuration
Use these steps to upgrade your cluster to a supported version if your cluster nodes don't have internet connectivity to the [Microsoft Download Center](https://download.microsoft.com).

> [!NOTE]
> If you're running a cluster that isn't connected to the internet, you have to monitor the [Service Fabric team blog](https://techcommunity.microsoft.com/t5/azure-service-fabric/bg-p/Service-Fabric) to learn about new releases. The system doesn't show a cluster health warning to alert you of new releases.  
>
>

### Auto provisioning vs. manual provisioning
To enable automatic downloading and registration for the latest code version, set up the Service Fabric Update Service. For instructions, see *Tools\ServiceFabricUpdateService.zip\Readme_InstructionsAndHowTos.txt* in the [standalone package](service-fabric-cluster-standalone-package-contents.md).

For the manual process, follow these instructions.

Modify your cluster configuration to set the following property to *false* before you start a configuration upgrade:

```json
"fabricClusterAutoupgradeEnabled": false,
```

For usage details, see the [Start-ServiceFabricClusterConfigurationUpgrade](/powershell/module/servicefabric/start-servicefabricclusterconfigurationupgrade) PowerShell command. Make sure to update 'clusterConfigurationVersion' in your JSON before you start the configuration upgrade.

```powershell
    Start-ServiceFabricClusterConfigurationUpgrade -ClusterConfigPath <Path to Configuration File>
```

### Cluster upgrade workflow

1. Run [Get-ServiceFabricClusterUpgrade](/powershell/module/servicefabric/get-servicefabricclusterupgrade) from one of the nodes in the cluster and note the *TargetCodeVersion*.

2. Run the following from an internet-connected machine to list all upgrade-compatible versions with the current version and download the corresponding package from the associated download links:

    ```powershell
    ###### Get list of all upgrade compatible packages  
    Get-ServiceFabricRuntimeUpgradeVersion -BaseVersion <TargetCodeVersion as noted in Step 1> 
    ```

3. Connect to the cluster from any machine that has administrator access to all the machines that are listed as nodes in the cluster. The machine that this script is run on doesn't have to be part of the cluster.

    ```powershell
    ###### Get the list of available Service Fabric versions
    Copy-ServiceFabricClusterPackage -Code -CodePackagePath <name of the .cab file including the path to it> -ImageStoreConnectionString "fabric:ImageStore"

    ###### Here is a filled-out example
    Copy-ServiceFabricClusterPackage -Code -CodePackagePath .\MicrosoftAzureServiceFabric.5.3.301.9590.cab -ImageStoreConnectionString "fabric:ImageStore"
    ```
4. Copy the downloaded package into the cluster image store.

5. Register the copied package.

    ```powershell
    ###### Get the list of available Service Fabric versions
    Register-ServiceFabricClusterPackage -Code -CodePackagePath <name of the .cab file>

    ###### Here is a filled-out example
    Register-ServiceFabricClusterPackage -Code -CodePackagePath MicrosoftAzureServiceFabric.5.3.301.9590.cab
    ```
6. Start a cluster upgrade to an available version.

    ```powershell
    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion <codeversion#> -Monitored -FailureAction Rollback

    ###### Here is a filled-out example
    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion 5.3.301.9590 -Monitored -FailureAction Rollback
    ```
    You can monitor the progress of the upgrade on Service Fabric Explorer, or you can run the following PowerShell command:

    ```powershell
    Get-ServiceFabricClusterUpgrade
    ```

    If the cluster health policies aren't met, the upgrade is rolled back. To specify custom health policies for the Start-ServiceFabricClusterUpgrade command, see the documentation for [Start-ServiceFabricClusterUpgrade](/powershell/module/servicefabric/start-servicefabricclusterupgrade).

    After you fix the issues that resulted in the rollback, initiate the upgrade again by following the same steps as previously described.

## Next steps
* [Upgrade the configuration of a standalone cluster](service-fabric-cluster-config-upgrade-windows-server.md)
* Customize some [Service Fabric cluster settings](service-fabric-cluster-fabric-settings.md).
* [Scale your cluster in and out](service-fabric-cluster-scale-in-out.md).

<!--Image references-->
[getfabversions]: ./media/service-fabric-cluster-upgrade-windows-server/getfabversions.PNG
