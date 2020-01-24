---
title: Azure Service Fabric Standalone Package for Windows Server 
description: Description and contents of the Azure Service Fabric Standalone package for Windows Server.
author: maburlik

ms.topic: conceptual
ms.date: 8/10/2017
ms.author: maburlik
---

# Contents of Service Fabric Standalone package for Windows Server
In the [downloaded](https://go.microsoft.com/fwlink/?LinkId=730690) Service Fabric Standalone package, you will find the following files:

| **File name** | **Short description** |
| --- | --- |
| CreateServiceFabricCluster.ps1 |A PowerShell script that creates the cluster using the settings in ClusterConfig.json. |
| RemoveServiceFabricCluster.ps1 |A PowerShell script that removes a cluster using the settings in ClusterConfig.json. |
| AddNode.ps1 |A PowerShell script for adding a node to an existing deployed cluster on the current machine. |
| RemoveNode.ps1 |A PowerShell script for removing a node from an existing deployed cluster from the current machine. |
| CleanFabric.ps1 |A PowerShell script for cleaning a standalone Service Fabric installation off the current machine. Previous MSI installations should be removed using their own associated uninstallers. |
| TestConfiguration.ps1 |A PowerShell script for analyzing the infrastructure as specified in the Cluster.json. |
| DownloadServiceFabricRuntimePackage.ps1 |A PowerShell script used for downloading the latest runtime package out of band, for scenarios where the deploying machine is not connected to the internet. |
| DeploymentComponentsAutoextractor.exe |Self-extracting archive containing Deployment Components used by the Standalone package scripts. |
| EULA_ENU.txt |The license terms for the use of Microsoft Azure Service Fabric standalone Windows Server package. You can [download a copy of the EULA](https://go.microsoft.com/fwlink/?LinkID=733084) now. |
| Readme.txt |A link to the release notes and basic installation instructions. It is a subset of the instructions in this document. |
| ThirdPartyNotice.rtf |Notice of third-party software that is in the package. |
| Tools\Microsoft.Azure.ServiceFabric.WindowsServer.SupportPackage.zip |StandaloneLogCollector.exe which is run on demand to collect and upload trace logs to Microsoft for support purpose. |
| Tools\ServiceFabricUpdateService.zip |A tool used to enable auto code upgrade for clusters which don't have internet access. More details can be found [here](service-fabric-cluster-upgrade-windows-server.md)|

**Templates** 

| **File name** | **Short description** |
| --- | --- |
| ClusterConfig.Unsecure.DevCluster.json |A cluster configuration sample file that contains the settings for an unsecured, three-node, single-machine (or virtual machine) development cluster, including the information for each node in the cluster. |
| ClusterConfig.Unsecure.MultiMachine.json |A cluster configuration sample file that contains the settings for an unsecured, multi-machine (or virtual machine) cluster, including the information for each machine in the cluster. |
| ClusterConfig.Windows.DevCluster.json |A cluster configuration sample file that contains all the settings for a secure, three-node, single-machine (or virtual machine) development cluster, including the information for each node that is in the cluster. The cluster is secured by using [Windows identities](https://msdn.microsoft.com/library/ff649396.aspx). |
| ClusterConfig.Windows.MultiMachine.json |A cluster configuration sample file that contains all the settings for a secure, multi-machine (or virtual machine) cluster using Windows security, including the information for each machine that is in the secure cluster. The cluster is secured by using [Windows identities](https://msdn.microsoft.com/library/ff649396.aspx). |
| ClusterConfig.x509.DevCluster.json |A cluster configuration sample file that contains all the settings for a secure, three-node, single-machine (or virtual machine) development cluster, including the information for each node in the cluster. The cluster is secured using x509 certificates. |
| ClusterConfig.x509.MultiMachine.json |A cluster configuration sample file that contains all the settings for the secure, multi-machine (or virtual machine) cluster, including the information for each node in the secure cluster. The cluster is secured using x509 certificates. |
| ClusterConfig.gMSA.Windows.MultiMachine.json |A cluster configuration sample file that contains all the settings for the secure, multi-machine (or virtual machine) cluster, including the information for each node in the secure cluster. The cluster is secured using [Group Managed Service Accounts](https://technet.microsoft.com/library/jj128431(v=ws.11).aspx). |

## Cluster Configuration Samples
Latest versions of cluster configuration templates can be found at the GitHub page: [Standalone Cluster Configuration Samples](https://github.com/Azure-Samples/service-fabric-dotnet-standalone-cluster-configuration/tree/master/Samples).

## Independent Runtime Package
The latest runtime package is downloaded automatically during cluster deployment from [Download Link - Service Fabric Runtime - Windows Server](https://go.microsoft.com/fwlink/?linkid=839354).

## Related
* [Create a standalone Azure Service Fabric cluster](service-fabric-cluster-creation-for-windows-server.md)
* [Service Fabric cluster security scenarios](service-fabric-windows-cluster-windows-security.md)
