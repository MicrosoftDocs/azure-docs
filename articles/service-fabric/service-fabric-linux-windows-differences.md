---
title: Azure Service Fabric differences between Linux and Windows 
description: Differences between the Azure Service Fabric on Linux and Azure Service Fabric on Windows.
ms.topic: conceptual
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: linux-related-content
services: service-fabric
ms.date: 05/13/2024
---

# Differences between Service Fabric on Linux and Windows

There are some features that are supported on Windows but not on Linux. The following differences exist between the latest available releases:

* Envoy (Reverse Proxy) is in preview on Linux
* Standalone installer isn't available on Linux
* Console redirection (not supported in Linux or Windows production clusters)
* The Fault Analysis Service (FAS) on Linux
* Domain Name System (DNS) service for Service Fabric services (DNS service is supported for containers on Linux)
* CLI command equivalents of certain PowerShell commands detailed in [PowerShell cmdlets that don't work against a Linux Service Fabric Cluster](#powershell-cmdlets-that-dont-work-against-a-linux-service-fabric-cluster). Most of these cmdlets only apply to standalone clusters.
* [Differences in log implementation that can affect scalability](service-fabric-concepts-scalability.md#choosing-a-platform)
* [Difference in Service Fabric Events Channel](service-fabric-diagnostics-overview.md#platform-cluster-monitoring)


## PowerShell cmdlets that don't work against a Linux Service Fabric cluster

* Invoke-ServiceFabricChaosTestScenario
* Invoke-ServiceFabricFailoverTestScenario
* Invoke-ServiceFabricPartitionDataLoss
* Invoke-ServiceFabricPartitionQuorumLoss
* Restart-ServiceFabricPartition
* Start-ServiceFabricNode
* Stop-ServiceFabricNode
* Get-ServiceFabricImageStoreContent
* Get-ServiceFabricChaosReport
* Get-ServiceFabricNodeTransitionProgress
* Get-ServiceFabricPartitionDataLossProgress
* Get-ServiceFabricPartitionQuorumLossProgress
* Get-ServiceFabricPartitionRestartProgress
* Get-ServiceFabricTestCommandStatusList
* Remove-ServiceFabricTestState
* Start-ServiceFabricChaos
* Start-ServiceFabricNodeTransition
* Start-ServiceFabricPartitionDataLoss
* Start-ServiceFabricPartitionQuorumLoss
* Start-ServiceFabricPartitionRestart
* Stop-ServiceFabricChaos
* Stop-ServiceFabricTestCommand
* Get-ServiceFabricNodeConfiguration
* Get-ServiceFabricClusterConfiguration
* Get-ServiceFabricClusterConfigurationUpgradeStatus
* Get-ServiceFabricPackageDebugParameters
* New-ServiceFabricPackageDebugParameter
* New-ServiceFabricPackageSharingPolicy
* Add-ServiceFabricNode
* Copy-ServiceFabricClusterPackage
* Get-ServiceFabricRuntimeSupportedVersion
* Get-ServiceFabricRuntimeUpgradeVersion
* New-ServiceFabricCluster
* New-ServiceFabricNodeConfiguration
* Remove-ServiceFabricCluster
* Remove-ServiceFabricClusterPackage
* Remove-ServiceFabricNodeConfiguration
* Test-ServiceFabricClusterManifest
* Test-ServiceFabricConfiguration
* Update-ServiceFabricNodeConfiguration
* Approve-ServiceFabricRepairTask
* Complete-ServiceFabricRepairTask
* Get-ServiceFabricRepairTask
* Invoke-ServiceFabricDecryptText
* Invoke-ServiceFabricEncryptSecret
* Invoke-ServiceFabricEncryptText
* Invoke-ServiceFabricInfrastructureCommand
* Invoke-ServiceFabricInfrastructureQuery
* Remove-ServiceFabricRepairTask
* Start-ServiceFabricRepairTask
* Stop-ServiceFabricRepairTask
* Update-ServiceFabricRepairTaskHealthPolicy

## Next steps

* [Prepare your development environment on Linux](service-fabric-get-started-linux.md)
* [Prepare your development environment on OSX](service-fabric-get-started-mac.md)
* [Create and deploy your first Service Fabric Java application on Linux using Yeoman](service-fabric-create-your-first-linux-application-with-java.md)
* [Create and deploy your first Service Fabric Java application on Linux using Service Fabric Plugin for Eclipse](service-fabric-get-started-eclipse.md)
* [Create your first C# application on Linux](service-fabric-create-your-first-linux-application-with-csharp.md)
* [Use the Service Fabric CLI to manage your applications](service-fabric-application-lifecycle-sfctl.md)
