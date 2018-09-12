---
title: Create a standalone Azure Service Fabric cluster | Microsoft Docs
description: Create an Azure Service Fabric cluster on any machine (physical or virtual) running Windows Server, whether it's on-premises or in any cloud.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: timlt
editor: ''

ms.assetid: 31349169-de19-4be6-8742-ca20ac41eb9e
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 8/10/2017
ms.author: dekapur

---
# Create a standalone cluster running on Windows Server
You can use Azure Service Fabric to create Service Fabric clusters on any virtual machines or computers running Windows Server. This means you can deploy and run Service Fabric applications in any environment that contains a set of interconnected Windows Server computers, be it on premises or with any cloud provider. Service Fabric provides a setup package to create Service Fabric clusters called the standalone Windows Server package.

This article walks you through the steps for creating a Service Fabric standalone cluster.

> [!NOTE]
> This standalone Windows Server package is commercially available and may be used for production deployments. This package may contain new Service Fabric features that are in "Preview". Scroll down to "[Preview features included in this package](#previewfeatures_anchor)." section for the list of the preview features. You can [download a copy of the EULA](http://go.microsoft.com/fwlink/?LinkID=733084) now.
> 
> 

<a id="getsupport"></a>

## Get support for the Service Fabric for Windows Server package
* Ask the community about the Service Fabric standalone package for Windows Server in the [Azure Service Fabric forum](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=AzureServiceFabric?).
* Open a ticket for [Professional Support for Service Fabric](http://support.microsoft.com/oas/default.aspx?prid=16146).  Learn more about Professional Support from Microsoft [here](https://support.microsoft.com/en-us/gp/offerprophone?wa=wsignin1.0).
* You can also get support for this package as a part of [Microsoft Premier Support](https://support.microsoft.com/en-us/premier).
* For more details, please see [Azure Service Fabric support options](https://docs.microsoft.com/azure/service-fabric/service-fabric-support).
* To collect logs for support purposes, run the [Service Fabric Standalone Log collector](service-fabric-cluster-standalone-package-contents.md).

<a id="downloadpackage"></a>

## Download the Service Fabric for Windows Server package
To create the cluster, use the Service Fabric for Windows Server package (Windows Server 2012 R2 and newer) found here: <br>
[Download Link - Service Fabric Standalone Package - Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690)

Find details on contents of the package [here](service-fabric-cluster-standalone-package-contents.md).

The Service Fabric runtime package is automatically downloaded at time of cluster creation. If deploying from a machine not connected to the internet, please download the runtime package out of band from here: <br>
[Download Link - Service Fabric Runtime - Windows Server](https://go.microsoft.com/fwlink/?linkid=839354)

Find Standalone Cluster Configuration samples at: <br>
[Standalone Cluster Configuration Samples](https://github.com/Azure-Samples/service-fabric-dotnet-standalone-cluster-configuration/tree/master/Samples)

<a id="createcluster"></a>

## Create the cluster
Several sample cluster configuration files are installed with the setup package. *ClusterConfig.Unsecure.DevCluster.json* is the simplest cluster configuration: an unsecure, three-node cluster running on a single computer.  Other config files describe single or multi-machine clusters secured with X.509 certificates or Windows security.  You don't need to modify any of the default config settings for this tutorial, but look through the config file and get familiar with the settings.  The **nodes** section describes the three nodes in the cluster: name, IP address, [node type, fault domain, and upgrade domain](service-fabric-cluster-manifest.md#nodes-on-the-cluster).  The **properties** section defines the [security, reliability level, diagnostics collection, and types of nodes](service-fabric-cluster-manifest.md#cluster-properties) for the cluster.

The cluster created in this article is unsecure.  Anyone can connect anonymously and perform management operations, so production clusters should always be secured using X.509 certificates or Windows security.  Security is only configured at cluster creation time and it is not possible to enable security after the cluster is created. Update the config file enable [certificate security](service-fabric-windows-cluster-x509-security.md) or [Windows security](service-fabric-windows-cluster-windows-security.md). Read [Secure a cluster](service-fabric-cluster-security.md) to learn more about Service Fabric cluster security.

### Step 1A: Create an unsecured local development cluster
Service Fabric can be deployed to a one-machine development cluster by using the *ClusterConfig.Unsecure.DevCluster.json* file included in [Samples](https://github.com/Azure-Samples/service-fabric-dotnet-standalone-cluster-configuration/tree/master/Samples).

Unpack the standalone package to your machine, copy the sample config file to the local machine, then run the *CreateServiceFabricCluster.ps1* script through an administrator PowerShell session, from the standalone package folder.

```powershell
.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json -AcceptEULA
```

See the Environment Setup section at [Plan and prepare your cluster deployment](service-fabric-cluster-standalone-deployment-preparation.md) for troubleshooting details.

If you're finished running development scenarios, you can remove the Service Fabric cluster from the machine by referring to steps in section "[Remove a cluster](#removecluster_anchor)". 

### Step 1B: Create a multi-machine cluster
After you have gone through the planning and preparation steps detailed at [Plan and prepare your cluster deployment](service-fabric-cluster-standalone-deployment-preparation.md), you are ready to create your production cluster using your cluster configuration file.

The cluster administrator deploying and configuring the cluster must have administrator privileges on the computer. You cannot install Service Fabric on a domain controller.

1. The *TestConfiguration.ps1* script in the standalone package is used as a best practices analyzer to validate whether a cluster can be deployed on a given environment. [Deployment preparation](service-fabric-cluster-standalone-deployment-preparation.md) lists the pre-requisites and environment requirements. Run the script to verify if you can create the development cluster:  

    ```powershell
    .\TestConfiguration.ps1 -ClusterConfigFilePath .\ClusterConfig.json
    ```

    You should see output similiar to the following. If the bottom field "Passed" is returned as "True", sanity checks have passed and the cluster looks to be deployable based on the input configuration.

    ```powershell
    Trace folder already exists. Traces will be written to existing trace folder: C:\temp\Microsoft.Azure.ServiceFabric.WindowsServer\DeploymentTraces
    Running Best Practices Analyzer...
    Best Practices Analyzer completed successfully.
    
    LocalAdminPrivilege        : True
    IsJsonValid                : True
    IsCabValid                 : True
    RequiredPortsOpen          : True
    RemoteRegistryAvailable    : True
    FirewallAvailable          : True
    RpcCheckPassed             : True
    NoConflictingInstallations : True
    FabricInstallable          : True
    Passed                     : True
    ```

2. Create the cluster:
    Run the *CreateServiceFabricCluster.ps1* script to deploy the Service Fabric cluster across each machine in the configuration. 
    ```powershell
    .\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.json -AcceptEULA
    ```

> [!NOTE]
> Deployment traces are written to the VM/machine on which you ran the CreateServiceFabricCluster.ps1 PowerShell script. These can be found in the subfolder DeploymentTraces, based in the directory from which the script was run. To see if Service Fabric was deployed correctly to a machine, find the installed files in the FabricDataRoot directory, as detailed in the cluster configuration file FabricSettings section (by default c:\ProgramData\SF). As well, FabricHost.exe and Fabric.exe processes can be seen running in Task Manager.
> 
> 

### Step 1C: Create an offline (internet-disconnected) cluster
The Service Fabric runtime package is automatically downloaded at cluster creation. When deploying a cluster to machines not connected to the internet, you will need to download the Service Fabric runtime package separately, and provide the path to it at cluster creation.
The runtime package can be downloaded separately, from another machine connected to the internet, at [Download Link - Service Fabric Runtime - Windows Server](https://go.microsoft.com/fwlink/?linkid=839354). Copy the runtime package to where you are deploying the offline cluster from, and create the cluster by running `CreateServiceFabricCluster.ps1` with the `-FabricRuntimePackagePath` parameter included, as shown in this example: 

```powershell
.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.json -FabricRuntimePackagePath .\MicrosoftAzureServiceFabric.cab
```

*.\ClusterConfig.json* and *.\MicrosoftAzureServiceFabric.cab* are the paths to the cluster configuration and the runtime .cab file respectively.

### Step 2: Connect to the cluster
Connect to the cluster to verify the cluster is running and available. The ServiceFabric PowerShell module is installed with the runtime.  You can connect to the cluster from one of the cluster nodes or from a remote computer with the Service Fabric runtime.  The [Connect-ServiceFabricCluster](/powershell/module/servicefabric/connect-servicefabriccluster?view=azureservicefabricps) cmdlet establishes a connection to the cluster.

To connect to an unsecure cluster, run the following PowerShell command:

```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint <*IPAddressofaMachine*>:<Client connection end point port>
```

For example:
```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint 192.13.123.2345:19000
```

See [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md) for other examples of connecting to a cluster. After connecting to the cluster, use the [Get-ServiceFabricNode](/powershell/module/servicefabric/get-servicefabricnode?view=azureservicefabricps) cmdlet to display a list of nodes in the cluster and status information for each node. **HealthState** should be *OK* for each node.

```powershell
PS C:\temp\Microsoft.Azure.ServiceFabric.WindowsServer> Get-ServiceFabricNode |Format-Table

NodeDeactivationInfo NodeName IpAddressOrFQDN NodeType  CodeVersion  ConfigVersion NodeStatus NodeUpTime NodeDownTime HealthState
-------------------- -------- --------------- --------  -----------  ------------- ---------- ---------- ------------ -----------
                     vm2      localhost       NodeType2 5.6.220.9494 0                     Up 00:03:38   00:00:00              OK
                     vm1      localhost       NodeType1 5.6.220.9494 0                     Up 00:03:38   00:00:00              OK
                     vm0      localhost       NodeType0 5.6.220.9494 0                     Up 00:02:43   00:00:00              OK
```

### Step 3: Visualize the cluster using Service Fabric explorer
[Service Fabric Explorer](service-fabric-visualizing-your-cluster.md) is a good tool for visualizing your cluster and managing applications.  Service Fabric Explorer is a service that runs in the cluster, which you access using a browser by navigating to [http://localhost:19080/Explorer](http://localhost:19080/Explorer).

The cluster dashboard provides an overview of your cluster, including a summary of application and node health. The node view shows the physical layout of the cluster. For a given node, you can inspect which applications have code deployed on that node.

![Service Fabric Explorer][service-fabric-explorer]

## Add and remove nodes
You can add or remove nodes to your standalone Service Fabric cluster as your business needs change. See [Add or Remove nodes to a Service Fabric standalone cluster](service-fabric-cluster-windows-server-add-remove-nodes.md) for detailed steps.

<a id="removecluster" name="removecluster_anchor"></a>
## Remove a cluster
To remove a cluster, run the *RemoveServiceFabricCluster.ps1* PowerShell script from the package folder and pass in the path to the JSON configuration file. You can optionally specify a location for the log of the deletion.

This script can be run on any machine that has administrator access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on does not have to be part of the cluster.

```powershell
# Removes Service Fabric from each machine in the configuration
.\RemoveServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.json -Force
```

```powershell
# Removes Service Fabric from the current machine
.\CleanFabric.ps1
```

<a id="telemetry"></a>

## Telemetry data collected and how to opt out of it
As a default, the product collects telemetry on the Service Fabric usage to improve the product. The Best Practice Analyzer that runs as a part of the setup checks for connectivity to [https://vortex.data.microsoft.com/collect/v1](https://vortex.data.microsoft.com/collect/v1). If it is not reachable, the setup fails unless you opt out of telemetry.

1. The telemetry pipeline tries to upload the following data to [https://vortex.data.microsoft.com/collect/v1](https://vortex.data.microsoft.com/collect/v1) once every day. It is a best-effort upload and has no impact on the cluster functionality. The telemetry is only sent from the node that runs the failover manager primary. No other nodes send out telemetry.
2. The telemetry consists of the following:

* Number of services
* Number of ServiceTypes
* Number of Applications
* Number of ApplicationUpgrades
* Number of FailoverUnits
* Number of InBuildFailoverUnits
* Number of UnhealthyFailoverUnits
* Number of Replicas
* Number of InBuildReplicas
* Number of StandByReplicas
* Number of OfflineReplicas
* CommonQueueLength
* QueryQueueLength
* FailoverUnitQueueLength
* CommitQueueLength
* Number of Nodes
* IsContextComplete: True/False
* ClusterId: This is a GUID randomly generated for each cluster
* ServiceFabricVersion
* IP address of the virtual machine or machine from which the telemetry is uploaded

To disable telemetry, add the following to *properties* in your cluster config: *enableTelemetry: false*.

<a id="previewfeatures" name="previewfeatures_anchor"></a>

## Preview features included in this package
None.


> [!NOTE]
> Starting with the new [GA version of the standalone cluster for Windows Server (version 5.3.204.x)](https://azure.microsoft.com/blog/azure-service-fabric-for-windows-server-now-ga/), you can upgrade your cluster to future releases, manually or automatically. Refer to [Upgrade a standalone Service Fabric cluster version](service-fabric-cluster-upgrade-windows-server.md) document for details.
> 
> 

## Next steps
* [Deploy and remove applications using PowerShell](service-fabric-deploy-remove-applications.md)
* [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md)
* [Add or remove nodes to a standalone Service Fabric cluster](service-fabric-cluster-windows-server-add-remove-nodes.md)
* [Upgrade a standalone Service Fabric cluster version](service-fabric-cluster-upgrade-windows-server.md)
* [Create a standalone Service Fabric cluster with Azure VMs running Windows](service-fabric-cluster-creation-with-windows-azure-vms.md)
* [Secure a standalone cluster on Windows using Windows security](service-fabric-windows-cluster-windows-security.md)
* [Secure a standalone cluster on Windows using X509 certificates](service-fabric-windows-cluster-x509-security.md)

<!--Image references-->
[Trusted Zone]: ./media/service-fabric-cluster-creation-for-windows-server/TrustedZone.png
[service-fabric-explorer]: ./media/service-fabric-cluster-creation-for-windows-server/sfx.png