<properties
   pageTitle="Create and manage a standalone Azure Service Fabric cluster | Microsoft Azure"
   description="Learn how to create and manage an Azure Service Fabric cluster on any machine (physical or virtual) running Windows Server, whether it's on-premises or in any cloud."
   services="service-fabric"
   documentationCenter=".net"
   authors="ChackDan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/26/2016"
   ms.author="dkshir;chackdan"/>


# Create and manage a cluster running on Windows Server

Azure Service Fabric allows the creation of Service Fabric clusters on any virtual machines or computers running Windows Server. This means you can deploy and run Service Fabric applications in any environment that contains a set of interconnected Windows Server computers, be it on-premises or with any cloud provider. Service Fabric provides a setup package to create Service Fabric clusters called the standalone Windows Server package.

This article walks you through the steps for creating a cluster using the standalone package for Service Fabric on-premises, though it can be easily adapted for any other environment such as other cloud providers.

>[AZURE.NOTE] This standalone Windows Server package may contain features that are currently in preview and is not supported for commercial use. To see that list of features that are in preview, scroll down to end of this document. [Click here](http://go.microsoft.com/fwlink/?LinkID=733084) if you would like to download a copy of the EULA now. 


<a id="getsupport"></a>
## Get support for the Service Fabric standalone package

- Ask the community about Service Fabric standalone package for Windows Server in  [Azure Service Fabric forum.](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=AzureServiceFabric?)

- Open a ticket for [Professional Support for Service Fabric](http://support.microsoft.com/oas/default.aspx?prid=16146 ).  Learn more about [Professional Support from Microsoft](https://support.microsoft.com/en-us/gp/offerprophone?wa=wsignin1.0).

<a id="downloadpackage"></a>
## Download the Service Fabric standalone package


[Download the standalone package for Service Fabric for Windows Server 2012 R2 and above](http://go.microsoft.com/fwlink/?LinkId=730690), which is named *Microsoft.Azure.ServiceFabric.WindowsServer.&lt;version&gt;.zip*.


In the download package you find the following files:

|**File name**|**Short description**|
|-----------------------|--------------------------|
|MicrosoftAzureServiceFabric.cab|The CAB file that contains the binaries that are deployed to each machine in the cluster.|
|ClusterConfig.Unsecure.DevCluster.json|Cluster configuration sample file that contains the settings for an unsecured, three node, single VM/machine development cluster, including the information for each node in the cluster. |
|ClusterConfig.Unsecure.MultiMachine.json|Cluster configuration sample file that contains the settings for an unsecured, multi-VM/machine cluster, including the information for each machine in the cluster.|
|ClusterConfig.Windows.DevCluster.json|Cluster configuration sample file that contains all the settings for a secure, three node, single VM/machine development cluster including the information for each node that is in cluster. The cluster is secured using [Windows identities](https://msdn.microsoft.com/library/ff649396.aspx).|
|ClusterConfig.Windows.MultiMachine.json|Cluster configuration sample file that contains all the settings for a secure, multi-VM/machine cluster using Windows security including the information for each machine that is in the secure cluster. The cluster is secured using [Windows identities](https://msdn.microsoft.com/library/ff649396.aspx).|
|ClusterConfig.x509.DevCluster.json|Cluster configuration sample file that contains all the settings for a secure, three node, single VM/machine development cluster including the information for each node in the cluster. The cluster is secured using x509 certificates.|
|ClusterConfig.x509.MultiMachine.json|Cluster configuration sample file that contains all the settings for the secure, multi-VM/machine cluster including the information for each node in the secure cluster. The cluster is secured using x509 certificates.|
|EULA_ENU.txt|The license terms for the use of Microsoft Azure Service Fabric standalone Windows Server package. [Click here](http://go.microsoft.com/fwlink/?LinkID=733084) if you would like to download a copy of the EULA now.|
|Readme.txt|Link to the release notes and basic installation instructions. It is a subset of the instructions you on this page.|
|CreateServiceFabricCluster.ps1|PowerShell script that creates the cluster using the settings in the ClusterConfig.json file.|
|RemoveServiceFabricCluster.ps1|PowerShell script that removes a cluster using the settings in the ClusterConfig.json.|
|ThirdPartyNotice.rtf |Notice of Third-Party software that is in the package.|
|AddNode.ps1|PowerShell script for adding a node to an existing deployed cluster.|
|RemoveNode.ps1|PowerShell script for removing a node from an existing deployed cluster.|
|CleanFabric.ps1|PowerShell script for cleaning a Standalone Fabric installation off the current machine. Previous MSI installations should be removed using its own associated uninstaller.|
|TestConfiguration.ps1|PowerShell script for analyzing the infrastructure as specified in the cluster.JSON.|


## Plan and prepare your cluster deployment
Perform the following steps before you create your cluster.

### Step 1: Plan your cluster infrastructure
You are about to create a Service Fabric cluster on machines you own, so you can decide what kinds of failures you want the cluster to survive. For example, do you need separate power lines or Internet connections supplied to these machines? In addition, consider the physical security of these machines.  Where is the physical location and who needs access to them?  Once you make these decisions, you can logically map the machines to the various fault domains (scroll down for more information). The infrastructure planning for production clusters is more involved than the test clusters.

<a id="preparemachines"></a>
### Step 2: Prepare the machines to meet the prerequisites
Prerequisites for each machine that you want to add to the cluster:

- Minimum of 16 GB RAM is recommended
- Minimum of 40 GB available disk space is recommended 
- Minimum of 4 Core CPU is recommended
- Network connectivity: Make sure that the machines are on a secure network or networks.
- Windows Server 2012 R2 or Windows Server 2012 (you need to have [KB2858668](https://support.microsoft.com/kb/2858668) installed).
- [.NET Framework 4.5.1 or higher](https://www.microsoft.com/download/details.aspx?id=40773), full install.
- [Windows PowerShell 3.0](https://msdn.microsoft.com/powershell/scripting/setup/installing-windows-powershell).
- The cluster administrator deploying and configuring the cluster must have [administrator privileges](https://social.technet.microsoft.com/wiki/contents/articles/13436.windows-server-2012-how-to-add-an-account-to-a-local-administrator-group.aspx) on each of the machines.
- The [RemoteRegistry service](https://technet.microsoft.com/library/cc754820) should be running on all the machines.
- You cannot install service fabric on a Domain Controller

### Step 3: Determine the initial cluster size
Each node in a standalone Service Fabric cluster, has the Service Fabric runtime deployed and is a member of the cluster. In a typical production deployment, there is one node per OS instance (physical or virtual). The cluster size is determined by your business needs; however, you must have a minimum cluster size of three nodes (machines/VMs).
For development purposes, you can have more than one node on a given machine. In a production environment, Service Fabric supports only one node per physical or virtual machine.

### Step 4: Determine the number of fault domains and upgrade domains
A **Fault Domain (FD)** is a physical unit of failure and is directly related to the physical infrastructure in the data centers. A fault domain consists of hardware components (computers, switches, network, and more) that share a single point of failure. Although there is no 1:1 mapping between fault domains and racks, loosely speaking, each rack can be considered a fault domain. When considering the nodes in your cluster, we strongly recommend that the nodes be distributed among at least three fault domains.

When you specify FDs in the *ClusterConfig.json*, you can choose the name for each FD. Service Fabric supports hierarchical FDs, so you can reflect your infrastructure topology in them.  For example, the following FDs are valid:

- "faultDomain": "fd:/Room1/Rack1/Machine1"
- "faultDomain": "fd:/FD1"
- "faultDomain": "fd:/Room1/Rack1/PDU1/M1"


An **Upgrade Domain (UD)** is a logical unit of nodes. During a Service Fabric orchestrated upgrades (either an application upgrade or a cluster upgrade), all nodes in a UD are taken down to perform the upgrade while nodes in other UDs remain available to serve requests. The firmware upgrades you do to your machines do not honor UDs, so you must do them one machine at a time.

The simplest way to think about these concepts is to consider FDs as the unit of unplanned failure, and UDs as the unit of planned maintenance.

When you specify UDs in the *ClusterConfig.json*, you can choose the name for each UD. For example, the following are valid:

- "upgradeDomain": "UD0"
- "upgradeDomain": "UD1A"
- "upgradeDomain": "DomainRed"
- "upgradeDomain": "Blue"

For more detailed information on upgrade domains and fault domain read the [Describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md) article.

### Step 5: Download the Service Fabric standalone package  for Windows Server
[Download the Service Fabric standalone package for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip the package, either to a deployment machine that is not part of the cluster, or to one of the machines that will be a part of your cluster. You may rename the unzipped folder to `Microsoft.Azure.ServiceFabric.WindowsServer`.

<a id="createcluster"></a>
## Create your cluster

After you have gone through steps outlined in the planning and preparation section above, you are ready to create your cluster.

### Step 1: Modify cluster configuration
The cluster is described in a *ClusterConfig.json* file. For details on the sections in this file, read the [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md) article.
Open one of the *ClusterConfig.json* files from the package you downloaded and modify the following settings:

|**Configuration Setting**|**Description**|
|-----------------------|--------------------------|
|**NodeTypes**|Node types allow you to separate your cluster nodes into various groups. A cluster must have at least one NodeType. All nodes in a group have the following common characteristics: <br> **Name** - This is the node type name. <br>**Endpoint Ports** - These are various named end points (ports) that are associated with this node type. You can use any port number that you wish, as long as they do not conflict with anything else in this manifest and are not already in use by any other application running on the machine/VM. <br> **Placement Properties** - These describe properties for this node type that you are used as placement constraints for the system services or your services. These properties are user-defined key/value pairs that provide extra meta data for a given node. Examples of node properties would be whether the node has a hard drive or graphics card, the number of spindles in its hard drive, cores, and other physical properties. <br> **Capacities** - Node capacities define the name and amount of a particular resource that a particular node has available for consumption. For example, a node may define that it has capacity for a metric called “MemoryInMb” and that it has 2048 MB available by default. These capacities are used at runtime to ensure that services that require particular amounts of resources are placed on the nodes that have those resources available in the required amounts.<br>**IsPrimary** - If you have more than one NodeType defined ensure that only one is set to primary with the value *true*, which is where the system services run. All other node types should be set to the value *false*|
|**Nodes**|These are the details for each of the nodes that are part of the cluster (node type, node name, IP address, fault domain, and upgrade domain of the node). The machines you want the cluster to be created on need to be listed here with their IP addresses. <br> If you use the same IP address for all the nodes, then a one-box cluster is created, which you can use for testing purposes. Do not use One-box clusters for deploying production workloads.|

### Step 2: Run the TestConfiguration Script

This script tests your infrastructure as defined in the cluster.JSON, to make sure that the needed permissions, the machines are connected to each other etc., so that the deployment can succeed. It is basically a mini Best Practices Analyzer. We will continue to add more validations to this tool over time to make it more robust.

This script can be run on any machine that has administrator access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on may or may not be part of the cluster.

```powershell

PS C:\temp\Microsoft.Azure.ServiceFabric.WindowsServer> .\TestConfiguration.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json
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

### Step 3: Run the create cluster script
Once you have modified the cluster configuration in the JSON doc and added all the node information to it, run the cluster creation *CreateServiceFabricCluster.ps1* PowerShell script from the package folder and pass in the path to the JSON configuration file and accept the EULA.

This script can be run on any machine that has administrator access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on may or may not be part of the cluster.

```
#Create an unsecured local development cluster

.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json -AcceptEULA
```
```
#Create an unsecured multi-machine cluster

.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json -AcceptEULA
```

>[AZURE.NOTE] The deployment logs are available locally on the VM/Machine that you ran the CreateServiceFabricCluster Powershell on. They are in a subfolder called "DeploymentTraces" under the folder where you ran the Powershell command. Also to see whether Service Fabric was deployed correctly to a machine, you can find the installed files in the C:\ProgramData directory and the FabricHost.exe and Fabric.exe processes can be seen running in Task Manager.

### Step 4: Connect to the Cluster

Refer to [this document](service-fabric-connect-to-secure-cluster.md) for instructions to connect to a secure cluster.

To connect to an unsecure cluster, run the following powershell command

```powershell

Connect-ServiceFabricCluster -ConnectionEndpoint <*IPAddressofaMachine*>:<Client connection end point port>

Connect-ServiceFabricCluster -ConnectionEndpoint 192.13.123.2345:19000

```
### Step 5: Bring up Service Fabric Explorer

Now you can connect to the cluster with Service Fabric Explorer either directly from one of the machines with http://localhost:19080/Explorer/index.html or remotely with http://<*IPAddressofaMachine*>:19080/Explorer/index.html



## Add and remove nodes to your cluster

You can add or remove nodes to your standalone Service Fabric cluster as your business needs change. Read [Add or Remove nodes to a Service Fabric standalone cluster](service-fabric-cluster-windows-server-add-remove-nodes.md) for detailed steps.


## Remove your cluster

To remove a cluster, run the *RemoveServiceFabricCluster.ps1* Powershell script from the package folder and pass in the path to the JSON configuration file and optionally specify a location for the log of the deletion.

This script can be run on any machine that has administrator access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on may or may not be part of the cluster

```
.\RemoveServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json   
```


<a id="telemetry"></a>
## Telemetry data collected and how to opt out of it

As a default, the product collects telemetry on the service fabric usage to improve the product. The best practice analyzer that runs as a part of the setup, checks for connectivity to [https://vortex.data.microsoft.com/collect/v1](https://vortex.data.microsoft.com/collect/v1). if it is not reachable, then the setup is failed, unless you opt out of telemetry. 

1) The telemetry pipeline tries to upload the following data to [https://vortex.data.microsoft.com/collect/v1](https://vortex.data.microsoft.com/collect/v1) once every day. It is a best effort upload, and had no impact on the cluster functionality. The telemetry is only sent from the node that runs the failover manager primary. No other nodes send out telemetry. 

2)    The Telemetry consists of the following. 

1.            Number of services,
1.            Number of ServiceTypes
1.            Number of Applications
1.            Number of ApplicationUpgrades
1.            Number of FailoverUnits
1.            Number of InBuildFailoverUnits
1.            Number of UnhealthyFailoverUnits
1.            Number of Replicas
1.            Number of InBuildReplicas
1.            Number of StandByReplicas
1.            Number of OfflineReplicas
1.            CommonQueueLength
1.            QueryQueueLength
1.            FailoverUnitQueueLength
1.            CommitQueueLength
1.            Number of Nodes
1.            IsContextComplete: True/False
1.            ClusterId: This is a GUID randomly generated for each cluster
1.            ServiceFabricVersion
1.             IP address of the VM/Machine from which the telemetry is uploaded


In order to disable telemetry, add under the following to “properties” element in your cluster config: "enableTelemetry": false

<a id="previewfeatures"></a>
## Preview features included in this package

None. 

>[AZURE.NOTE] The new [GA version of the standalone cluster for Windows Server (version 5.3.204.x)](https://azure.microsoft.com/blog/azure-service-fabric-for-windows-server-now-ga/) will allow you to upgrade your cluster to future releases, manually or automatically. However, since this feature is not available on the preview versions, you will need to create a new cluster using the GA version and migrate your data and applications from the preview cluster. Stay tuned for more details on this feature. 


## Next steps
- [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md)
- [Add or remove nodes to a standalone Service Fabric cluster](service-fabric-cluster-windows-server-add-remove-nodes.md)
- [Create a standalone Service Fabric cluster with Azure VMs running Windows](service-fabric-cluster-creation-with-windows-azure-vms.md)
- [Secure a standalone cluster on Windows using Windows security](service-fabric-windows-cluster-windows-security.md)
- [Secure a standalone cluster on Windows using X509 certificates](service-fabric-windows-cluster-x509-security.md)


<!--Image references-->
[TrustedZone]: ./media/service-fabric-cluster-creation-for-windows-server/TrustedZone.png
