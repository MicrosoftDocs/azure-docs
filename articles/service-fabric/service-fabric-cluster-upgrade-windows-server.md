---
title: Upgrade an Standalone Service Fabric cluster on Windows Server | Microsoft Docs
description: Upgrade the Service Fabric code and/or configuration that runs a standalone Service Fabric cluster, including setting cluster update mode
services: service-fabric
documentationcenter: .net
author: ChackDan
manager: timlt
editor: ''

ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/10/2016
ms.author: chackdan

---
# Upgrade your standalone Service Fabric cluster on Windows Server
> [!div class="op_single_selector"]
> * [Azure Cluster](service-fabric-cluster-upgrade.md)
> * [Standalone Cluster](service-fabric-cluster-upgrade-windows-server.md)
> 
> 

For any modern system, designing for upgradability is key to achieving long-term success of your product. A Service Fabric cluster is a resource that you own. This article describes how you can make sure that the cluster always runs supported versions of the service fabric code and configurations.

## Controlling the fabric version that runs on your Cluster
You can set your cluster to download the service fabric updates, when Microsoft releases a new version or choose to select a supported fabric version you want your cluster to be on. 

You do this by setting the "fabricClusterAutoupgradeEnabled" cluster configuration to true or false.

> [!NOTE]
> Make sure to keep your cluster always running a supported Service Fabric version. As and when we announce the release of a new version of service fabric, the previous version is marked for end of support after a minimum of 60 days from that date. The new releases are announced [on the service fabric team blog](https://blogs.msdn.microsoft.com/azureservicefabric/). The new release is available to choose then. 
> 
> 

You can upgrade your cluster to the new version only if you are using a  production-style node configuration, where each Service Fabric node is allocated on a separate physical or virtual machine. If you have a development cluster, where there are more than one service fabric nodes on a single physical or virtual machine, you must tear down your cluster and recreate it with the new version.

There are two distinct workflows for upgrading your cluster to the latest or a supported service fabric version. One for clusters that have connectivity to download the latest version automatically and the second one for clusters that are no connectivity to download the latest Service Fabric version.

### Upgrade the clusters with connectivity to download the latest code and configuration
Use these steps to upgrade your cluster to a supported version, if your cluster nodes have internet connectivity to [http://download.microsoft.com](http://download.microsoft.com) 

For clusters that have connectivity to [http://download.microsoft.com](http://download.microsoft.com), we periodically check for the availability of new service fabric versions.

When a new service fabric version is available, the package is downloaded locally to the cluster and provisioned for upgrade. Additionally to inform the customer of this new version, the system places an explicit cluster health warning similar to the following:

“The current cluster version [version#] support ends [Date].", Once the cluster is running the latest version, the warning goes away.

#### Cluster Upgrade workflow.
Once you see the cluster health warning, you need to do the following:

1. Connect to the cluster from any machine that has administrator access to all the machines that are listed as nodes in the cluster. The machine that this script is run on does not have to be part of the cluster
   
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
2. Get the list of service fabric versions that you can upgrade to
   
    ```powershell
   
    ###### Get the list of available service fabric versions 
    Get-ServiceFabricRegisteredClusterCodeVersion
    ```
   
    you should get an output similar to this:
   
    ![get fabric versions][getfabversions]
3. Kick off a cluster upgrade to one of the versions that is available using the 
   [Start-ServiceFabricClusterUpgrade PowerShell cmd ](https://msdn.microsoft.com/library/mt125872.aspx)
   
    ```Powershell
   
    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion <codeversion#> -Monitored -FailureAction Rollback
   
    ###### Here is a filled out example
   
    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion 5.3.301.9590 -Monitored -FailureAction Rollback
   
    ```
   You can monitor the progress of the upgrade on Service fabric explorer or by running the     following power shell command
   
    ```powershell
   
    Get-ServiceFabricClusterUpgrade
    ```
   
    If the cluster health policies are not met, the upgrade is rolled back. You can specify custom health policies at the time for the Start-ServiceFabricClusterUpgrade command refer to [this document](https://msdn.microsoft.com/library/mt125872.aspx) for details. 

Once you have fixed the issues that resulted in the rollback, you need to initiate the upgrade again, by following the same steps as before.

### Upgrade the clusters with <U>no connectivity</u> to download the latest code and configuration
Use these steps to upgrade your cluster to a supported version, if your cluster nodes **do not have** internet connectivity to [http://download.microsoft.com](http://download.microsoft.com) 

> [!NOTE]
> If you are running a cluster that is not internet connected, you will have to monitor the service fabric team blog to get notified of a new release. The system **does not** place any cluster health warning to alert you of it.  
> 
> 

1. Modify your cluster configuration to set the following property to false.
   
        "fabricClusterAutoupgradeEnabled": false,

and kick off a configuration upgrade. refer to [Start-ServiceFabricClusterUpgrade PS cmd ](https://msdn.microsoft.com/library/mt125872.aspx) for usage details. The cluster manifest version is the version that you have in the clusterConfig.JSON. Make sure to update it before you kick off the configuration upgrade.

```powershell

    Start-ServiceFabricClusterUpgrade [-Config] [-ClusterConfigVersion] -FailureAction Rollback -Monitored 

```

#### Cluster Upgrade workflow.
1. Download the latest version of the package from [Create service fabric cluster for windows server](service-fabric-cluster-creation-for-windows-server.md) document 
2. Connect to the cluster from any machine that has administrator access to all the machines that are listed as nodes in the cluster. The machine that this script is run on does not have to be part of the cluster 
   
    ```powershell
   
    ###### connect to the cluster
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
   
   ###### Get the list of available service fabric versions
    Copy-ServiceFabricClusterPackage -Code -CodePackagePath <name of the .cab file including the path to it> -ImageStoreConnectionString "fabric:ImageStore"
   
   ###### Here is a filled out example
    Copy-ServiceFabricClusterPackage -Code -CodePackagePath .\MicrosoftAzureServiceFabric.5.3.301.9590.cab -ImageStoreConnectionString "fabric:ImageStore"

    ```

1. Register the copied package 
   
    ```powershell
   
    ###### Get the list of available service fabric versions 
    Register-ServiceFabricClusterPackage -Code -CodePackagePath <name of the .cab file> 
   
    ###### Here is a filled out example
    Register-ServiceFabricClusterPackage -Code -CodePackagePath MicrosoftAzureServiceFabric.5.3.301.9590.cab
   
     ```
2. Kick off a cluster upgrade to one of the versions that is available. 
   
    ```Powershell
   
    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion <codeversion#> -Monitored -FailureAction Rollback
   
    ###### Here is a filled out example
    Start-ServiceFabricClusterUpgrade -Code -CodePackageVersion 5.3.301.9590 -Monitored -FailureAction Rollback
   
    ```
   You can monitor the progress of the upgrade on Service fabric explorer or by running the     following power shell command
   
    ```powershell
   
    Get-ServiceFabricClusterUpgrade
    ```
   
    If the cluster health policies are not met, the upgrade is rolled back. You can specify custom health policies at the time for the start-serviceFabricClusterUpgrade command refer to [this document](https://msdn.microsoft.com/library/mt125872.aspx) for details. 

Once you have fixed the issues that resulted in the rollback, you need to initiate the upgrade again, by following the same steps as before.

## Next steps
* Learn how to customize some of the [service fabric cluster fabric settings](service-fabric-cluster-fabric-settings.md)
* Learn how to [scale your cluster in and out](service-fabric-cluster-scale-up-down.md)
* Learn about [application upgrades](service-fabric-application-upgrade.md)

<!--Image references-->
[getfabversions]: ./media/service-fabric-cluster-upgrade-windows-server/getfabversions.PNG
