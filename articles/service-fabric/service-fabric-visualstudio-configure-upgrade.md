---
title: Configure the upgrade of a Service Fabric application | Microsoft Docs
description: Learn how to configure the settings for upgrading a Service Fabric application by using Microsoft Visual Studio.
services: service-fabric
documentationcenter: na
author: mikkelhegn
manager: mfussell
editor: tglee

ms.assetid: 1757ba85-0b7b-4f16-8a23-2ddaa61c86c6
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 06/29/2017
ms.author: mikkelhegn

---
# Configure the upgrade of a Service Fabric application in Visual Studio
Visual Studio tools for Azure Service Fabric provide upgrade support for publishing to local or remote clusters. There are three scenarios in which you want to upgrade your application to a newer version instead of replacing the application during testing and debugging:

* Application data won't be lost during the upgrade.
* Availability remains high so there won't be any service interruption during the upgrade, if there are enough service instances spread across upgrade domains.
* Tests can be run against an application while it's being upgraded.

## Parameters needed to upgrade
You can choose from two types of deployment: regular or upgrade. A regular deployment erases any previous deployment information and data on the cluster, while an upgrade deployment preserves it. When you upgrade a Service Fabric application in Visual Studio, you need to provide application upgrade parameters and health check policies. Application upgrade parameters help control the upgrade, while health check policies determine whether the upgrade was successful. See [Service Fabric application upgrade: upgrade parameters](service-fabric-application-upgrade-parameters.md) for more details.

There are three upgrade modes: *Monitored*, *UnmonitoredAuto*, and *UnmonitoredManual*.

* A Monitored upgrade automates the upgrade and application health check.
* An UnmonitoredAuto upgrade automates the upgrade, but skips the application health check.
* When you do an UnmonitoredManual upgrade, you need to manually upgrade each upgrade domain.

Each upgrade mode requires different sets of parameters. See [Application upgrade parameters](service-fabric-application-upgrade-parameters.md) to learn more about the available upgrade options.

## Upgrade a Service Fabric application in Visual Studio
If you’re using the Visual Studio Service Fabric tools to upgrade a Service Fabric application, you can specify a publish process to be an upgrade rather than a regular deployment by checking the **Upgrade the application** check box.

### To configure the upgrade parameters
1. Click the **Settings** button next to the check box. The **Edit Upgrade Parameters** dialog box appears. The **Edit Upgrade Parameters** dialog box supports the Monitored, UnmonitoredAuto, and UnmonitoredManual upgrade modes.
2. Select the upgrade mode that you want to use and then fill out the parameter grid.

    Each parameter has default values. The optional parameter *DefaultServiceTypeHealthPolicy* takes a hash table input. Here’s an example of the hash table input format for *DefaultServiceTypeHealthPolicy*:

    ```
    @{ ConsiderWarningAsError = "false"; MaxPercentUnhealthyDeployedApplications = 0; MaxPercentUnhealthyServices = 0; MaxPercentUnhealthyPartitionsPerService = 0; MaxPercentUnhealthyReplicasPerPartition = 0 }
    ```

    *ServiceTypeHealthPolicyMap* is another optional parameter that takes a hash table input in the following format:

    ```    
    @ {"ServiceTypeName" : "MaxPercentUnhealthyPartitionsPerService,MaxPercentUnhealthyReplicasPerPartition,MaxPercentUnhealthyServices"}
    ```

    Here's a real-life example:

    ```
    @{ "ServiceTypeName01" = "5,10,5"; "ServiceTypeName02" = "5,5,5" }
    ```
3. If you select UnmonitoredManual upgrade mode, you must manually start a PowerShell console to continue and finish the upgrade process. Refer to [Service Fabric application upgrade: advanced topics](service-fabric-application-upgrade-advanced.md) to learn how manual upgrade works.

## Upgrade an application by using PowerShell
You can use PowerShell cmdlets to upgrade a Service Fabric application. See [Service Fabric application upgrade tutorial](service-fabric-application-upgrade-tutorial.md) and [Start-ServiceFabricApplicationUpgrade](https://docs.microsoft.com/powershell/module/servicefabric/start-servicefabricapplicationupgrade) for detailed information.

## Specify a health check policy in the application manifest file
Every service in a Service Fabric application can have its own health policy parameters that override the default values. You can provide these parameter values in the application manifest file.

The following example shows how to apply a unique health check policy for each service in the application manifest.

```xml
<Policies>
    <HealthPolicy ConsiderWarningAsError="false" MaxPercentUnhealthyDeployedApplications="20">
        <DefaultServiceTypeHealthPolicy MaxPercentUnhealthyServices="20"               
                MaxPercentUnhealthyPartitionsPerService="20"
                MaxPercentUnhealthyReplicasPerPartition="20" />
        <ServiceTypeHealthPolicy ServiceTypeName="ServiceTypeName1"
                MaxPercentUnhealthyServices="20"
                MaxPercentUnhealthyPartitionsPerService="20"
                MaxPercentUnhealthyReplicasPerPartition="20" />      
    </HealthPolicy>
</Policies>
```
## Next steps
For more information about upgrading an application, see [Upgrade an application using Visual Studio](service-fabric-application-upgrade-tutorial.md).
