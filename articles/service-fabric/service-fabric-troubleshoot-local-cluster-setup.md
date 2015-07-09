<properties
   pageTitle="Troubleshoot your local cluster setup"
   description="This article covers a set of suggestions for troubleshooting your local development cluster"
   services="service-fabric"
   documentationCenter=".net"
   authors="seanmck"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotNet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="07/09/2015"
   ms.author="seanmck"/>

# Troubleshoot your local development cluster setup

If you run into an issue while interacting with your local development cluster, review the following suggestions for potential solutions.

## Cluster setup failures

### Cannot clean up Service Fabric logs

#### Problem

While running the DevClusterSetup script, you see an error like this:

    Cannot clean up C:\SfDevCluster\Log fully as references are likely being held to items in it. Please remove those and run this script again.
    At line:1 char:1 + .\DevClusterSetup.ps1
    + ~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo : NotSpecified: (:) [Write-Error], WriteErrorException
    + FullyQualifiedErrorId : Microsoft.PowerShell.Commands.WriteErrorException,DevClusterSetup.ps1


#### Solution

Close the current Powershell window and launch a new Powershell window as an Administrator. You should now be able to successfully run the script.

## Cluster connection failures

### Type Initialization Exception

#### Problem

When connecting to the cluster in PowerShell or Service Fabric Explorer, you see a TypeInitializationException for System.Fabric.Common.AppTrace.

#### Solution

Your path variable was not correctly set during installation. Please log out of Windows and log back in. This will fully refresh your path.

### Cluster connection fails with "Object is closed"

#### Problem

A call to Connect-ServiceFabricCluster fails with an error like this:

    Connect-ServiceFabricCluster : The object is closed.
    At line:1 char:1
    + Connect-ServiceFabricCluster
    + ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo : InvalidOperation: (:) [Connect-ServiceFabricCluster], FabricObjectClosedException
    + FullyQualifiedErrorId : CreateClusterConnectionErrorId,Microsoft.ServiceFabric.Powershell.ConnectCluster

#### Solution

Close the current Powershell window and launch a new Powershell window as an Administrator. You should now be able to successfully connect.

### FabricConnectionDeniedException

#### Problem

When debugging from Visual Studio, you get a FabricConnectionDeniedException.

#### Solution

This error usually occurs when you try to try to start a service host process manually, rather than allowing the Service Fabric runtime to start it for you.

Ensure that you do not have any service projects set as startup projects in your solution. Only Service Fabric application projects should be set as startup projects.


## Next steps

- [Understand and troubleshoot your cluster with system health reports](service-fabric-understand-and-troubleshoot-with-system-health-reports.md)
- [Visualizing your cluster with Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)
