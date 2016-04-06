<properties
   pageTitle="Create a on-premises or poly-cloud Azure Service Fabric cluster | Microsoft Azure"
   description="Learn how to create an Azure Service Fabric cluster on any machine (physical or virtual) running Windows Server, whether it's on-premises or in the cloud."
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
   ms.date="03/28/2016"
   ms.author="chackdan"/>


# Create an Azure Service Fabric cluster on-premises or in the cloud

Azure Service Fabric allows the creation of Service Fabric clusters on any virtual machines or computers running Windows Server. This means you can deploy and run Service Fabric applications in any environment where you have a set of Windows Server computers that are interconnected, be it on-premises or with any cloud provider. Service Fabric provides a setup package for you to create such Service Fabric clusters.

This article walks you through the steps for creating a cluster using the standalone package for Service Fabric on-premises, though it can be easily adapted for any other environment such as other clouds.

## Service Fabric standalone package

The standalone package for Service Fabric for Windows Server 2012 R2 deployments is named *Microsoft.Azure.ServiceFabric.WindowsServer.&lt;version&gt;.zip* and can be downloaded [here](http://go.microsoft.com/fwlink/?LinkId=730690).

In the download package you will find the following files:

|**File name**|**Short description**|
|-----------------------|--------------------------|
|MicrosoftAzureServiceFabric.cab|The CAB file that contains the binaries that will be deployed to each machine in the cluster.|
|ClusterConfig.JSON|Cluster configuration file that contains all the settings for the cluster including the information for each machine that is part of the cluster.|
|EULA.txt|The license terms for the use of Microsoft Azure Service Fabric Service Fabric standalone package. [Click here](http://go.microsoft.com/fwlink/?LinkID=733084) if you would like to download a copy of the EULA now.|
|Readme.txt|Link to the release notes and basic installation instructions. It is a small subset of the instructions you will find on this page.|
|CreateServiceFabricCluster.ps1|PowerShell script that creates the cluster using the settings in the ClusterConfig.JSON file.|
|RemoveServiceFabricCluster.ps1|PowerShell script for cluster removal using the settings in the ClusterConfig.JSON.|

## Plan and prepare for cluster deployment
The following steps need to be performed before you create your cluster.

### Step 1: Plan your cluster infrastructure
You are about to create a Service Fabric cluster on the machines you own, so you get to decide on what kinds of failures you want the cluster to survive. For example, do you need separate power lines or internet connections that supply these machines? In addition you should also consider the physical security of these machines.  Where is the physical location and who needs access to them?  Once you make these decisions, you logically map the machines to the various fault domains (see below for more information). The infrastructure planning for production clusters will be far more involved than the test clusters.

### Step 2: Prepare the machines to meet the pre-requisites
Pre-requisites for each machine that you want to add to the cluster:

- Minimum of 2 GB memory is recommended
- Network connectivity – Make sure that the machines are on a secure network/or networks
- Windows Server 2012 R2 or Windows Server 2012 (you need to have KB2858668 installed for this).
- .NET Framework 4.5.1 or higher, full install
- Windows PowerShell 3.0
- Visual C++ 2012 (VC++ 11.0) Redistributable Package
- The cluster administrator deploying and configuring the cluster must have administrator privileges on each of the computers.

### Step 3: Determine the initial cluster size
Each node consists of a full Service Fabric stack and is an individual member of the Service Fabric cluster. In a typical Service Fabric deployment there is one node per OS instance (physical or virtual). The cluster size is determined by your business needs; however, you must have a minimum cluster size of three nodes (machines/VMs).
Note that for development purposes, you can have more than one node on a given machine. In a production environment, Service Fabric supports only one node per physical or virtual machine.

### Step 4: Determine the number of fault domains and upgrade domains
A **fault domain (FD)** is a physical unit of failure and is directly related to the physical infrastructure in the data centers. A fault domain consists of hardware components (computers, switches, and more) that share a single point of failure. Although there is no 1:1 mapping between fault domains and racks, loosely speaking, each rack can be considered a fault domain. When considering the nodes in your cluster, it is strongly recommended that the nodes be distributed amongst at least three fault domains.

When you specify FDs in *ClusterConfig.JSON*, you get to choose the name of the FD. Service Fabric supports hierarchical FDs, so you can reflect your infrastructure topology in them.  For example, the following are allowed:

- "faultDomain": "fd:/Room1/Rack1/Machine1"
- "faultDomain": "fd:/FD1"
- "faultDomain": "fd:/Room1/Rack1/PDU1/M1"


An **upgrade domain (UD)** is a logical unit of nodes. During a Service Fabric orchestrated upgrade (application upgrade or cluster upgrade), all nodes in a UD are taken down to perform the upgrade while nodes in other UDs remain available to serve requests. The firmware upgrades you do to your machines will not honor UDs, so you must do them one machine at a time.

The simplest way to think about these concepts is to consider FDs as the unit of unplanned failure, and UDs as the unit of planned maintenance.

When you specify UDs in the *ClusterConfig.JSON*, you get to choose the name of the UD. For example, the following are all allowed:

- "upgradeDomain": "UD0"
- "upgradeDomain": "UD1A"
- "upgradeDomain": "DomainRed"
- "upgradeDomain": "Blue"

### Step 5: Download the standalone package for Service Fabric for Windows Server
[Download the standalone package for Service Fabric for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip the package either to a deployment machine that is not part of the cluster or to one of the machines that will be part of your cluster.

## Create your cluster

After you have gone through steps outlined in the planning and preparation section above, you are now ready to create your cluster.

### Step 1: Modify cluster configuration
Open *ClusterConfig.JSON* from the package you downloaded. You can use any editor  you choose and modify the following settings:

|**Configuration Setting**|**Description**|
|-----------------------|--------------------------|
|NodeTypes|Node types allow you to separate your cluster nodes into various groups. A cluster must have at least one NodeType. All nodes in a group have the following common characteristics. <br> *Name*  - This is the node nype name. <br>*EndPoints* - These are various named end points (ports) that are associated with this node type. You can use any port number that you wish, as long as they do not conflict with anything else in this manifest and are not already in use by any other program on the machine/VM <br> *PlacementProperties* - These describe properties for this node type that you will then use as placement constraints for system services or your services. These properties are user defined key/value pairs that provide extra metadata for a given node. Examples of node properties would be whether or not the node has a hard drive or graphics card, the number of spindles in it hard drive, cores, and other physical properties. <br> *Capacities* - Node capacities define the name and amount of a particular resource that a particular node has available for consumption. For example, a node may define that it has capacity for a metric called “MemoryInMb” and that it has 2048 MB available by default. These capacities are used at runtime to ensure that services which require particular amounts of resources are placed on nodes with those resources remaining available.|
|Nodes|The details for each of the nodes that will be part of the cluster (node type, node name, IP address, fault domain and upgrade domain of the node). The machines you want the cluster to be created on need to be listed here with their IP address. <br> If you use the same IP addresses for all the nodes, then a one-box cluster will be created, which you can use for test purposes. One-box clusters should not be used for deploying production workloads.|

### Step 2: Run the create cluster script
Once you have modified the cluster configuration in the JSON doc and added all the node information to it, run the cluster creation PowerShell script from the package folder and pass in the path to the configuration file and the location of the package root to it.

This script can be run on any machine that has admin access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on may or may not be part of the cluster.

```
C:\Microsoft.Azure.ServiceFabric.WindowsServer.5.0.135.9590> .\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath C:\Microsoft.Azure.ServiceFabric.WindowsServer.5.0.135.9590\ClusterConfig.JSON -MicrosoftServiceFabricCabFilePath C:\Microsoft.Azure.ServiceFabric.WindowsServer.5.0.135.9590\MicrosoftAzureServiceFabric.cab
```

## Next steps

After you create a cluster, also be sure to secure it:
- [Cluster security](service-fabric-cluster-security.md)

Read the following to get started on app development and deployment:
- [ Service Fabric SDK and getting started](service-fabric-get-started.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).

Read more about Azure clusters and standalone clusters:
- [Overview of the standalone cluster creation feature and a comparison with Azure-managed clusters](service-fabric-deploy-anywhere.md)
