<properties
   pageTitle="Create a on-premises or poly-cloud Azure Service Fabric cluster with "AzureServiceFabric-DeployAnywhere" package | Microsoft Azure"
   description="Learn how to create an Azure Service Fabric cluster on any machines - Physical or Virtual, be it on-premises or other clouds by using the AzureServiceFabric Deploy Anywhere package."
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
   ms.date="02/08/2016"
   ms.author="chackdan"/>


#Create an Azure Service Fabric cluster on-premises or other clouds by using the  Azure ServiceFabric "Deploy Anywhere" package 
 
Azure Service Fabric allows the creation of Service Fabric clusters on any Virtual Machines or computers running Windows Server (Linux support coming later). This means you can deploy and run Service Fabric applications in any environment where you have a set of Windows Server or Linux computers that are interconnected, be it on-premises or with any cloud provider. Service Fabric provides a setup package for you to create such Service Fabric clusters.


This article walks you through the steps for creating a cluster using "Deploy Anywhere" package on-premises, though it can be easily adapted for any other environment such as other clouds.


## Microsoft Azure Service Fabric "deploy anywhere" Package

The "Deploy anywhere" package for Windows Server 2012 R2 deployments is MicrosoftAzureServiceFabricWindowsServerversion.zip

In the download package you will find the following files.

**File name:** AzureServiceFabricDeployAnywhere.cab,  **Description:**  The cab file that contains the binaries that will be deployed to each machine in the cluster.

**File name:** ClusterConfig.JSON, **Description:**  Cluster Configuration file that contains all the settings for the cluster including the information for each machine that is part of the cluster. 

**File name:** EULA.doc, **Description:** The license terms for the use of Microsoft Azure Service Fabric "deploy anywhere" package.

**File name:** Readme.txt, **Description:**  Basic installation instructions.

**File name:** CreateServiceFabricCluster.ps1, **Description:** PowerShell script that creates the cluster as per the settings in the ClusterConfig.JSON

**File name:** RemoveServiceFabricCluster.ps1, **Description:** PowerShell script for cluster removal as per the settings in the ClusterConfig.JSON


## Key steps for creating a cluster

**1. Download the "deploy anywhere" package**  from the Microsoft Download Center.

**2. Modify the ClusterConfig.JSON file** in the downloaded package, to reflect your infrastructure topology.

**3. Run the CreateServiceFabricCluster PowerShell script** in the downloaded package to create the cluster.


## Planning and Preparation
Review and act on the following steps prior to moving on to the next section - Deployment of your cluster.

####Infrastructure planning 
You are about to deploy a service fabric cluster to the machines you own, so you get to decide on what kinds of failures you want the cluster to survive, say for example - do you need separate power lines, internet connections etc that feed these machines. These are in addition to thinking through, the physical security, Physical location etc.  Once you make these decisions, you logically map the machines to the various Fault Domains (scroll down for definition). The infrastructure planning for production clusters will be far more involved than the test only clusters. 

#### Pre-requisites for Setting up the cluster

Pre-requisites for each machine that you want to be a part of the cluster:

- Windows Server 2012 R2.
- KB2858668 is required for Windows Server 2012.
- Minimum of 2 GB memory is recommended
- .NET Framework 4.5.1 or higher, full install
- Windows PowerShell 3.0
- Visual C++ 2012 (VC++ 11.0) Redistributable Package
- Network Connectivity – Make sure that the machines are on a secure network/or networks
- The cluster administrator deploying and configuring the cluster must have administrator privileges on each of the computers.

#### Determine the Initial Cluster Size
Each node consists of a full Service Fabric stack and is an individual member of the Service Fabric cluster. In a typical Service Fabric deployment there is one node per OS instance (physical or virtual). The cluster size is determined by your business needs; however, you must have a minimum cluster size of three nodes (machines/VMs).
###### Note  
For development purposes, you can have more than one node on a given machine. In a production environment, Service Fabric supports only one node per physical/virtual machine.

#### Determine the number of Fault Domains and Upgrade Domains
A **fault domain (FD)** is a physical unit of failure and is directly related to the physical infrastructure in the data centers. A fault domain consists of hardware components (computers, switches, and more) that share a single point of failure. Although there is no 1:1 mapping between fault domains and racks, loosely speaking, each rack can be considered a fault domain. When considering the nodes in your cluster, it is strongly recommended that the nodes be distributed amongst at least three fault domains. 

When you specify FDs in the ClusterConfig.JSON, You get to choose the name of the FD. Service fabric supports hierarchical FDs, so you can reflect you infra topology in them for example, the following are allowed
"faultDomain": "fd:/Room1/Rack1/Machine1"
"faultDomain": "fd:/FD1"
"faultDomain": "fd:/Room1/Rack1/PDU1/M1"


An **upgrade domain (UD)** is a logical unit of nodes. During a Service Fabric orchestrated upgrade (Application upgrade or Fabric upgrades, all nodes in a UD are taken down to perform the upgrade while nodes in other UDs remain available to serve requests. The firm ware upgrades you do to your machines, will not honor UDs, so you must do them one machine at a time.

The simplest way to think about these concepts is to consider FDs as the unit of unplanned failure, and UDs as the unit of planned maintenance. 

When you specify UDs in the ClusterConfig.JSON, You get to choose the name of the UD. For example, the following are all allowed
"upgradeDomain": "UD0"
"upgradeDomain": "UD1"
"upgradeDomain": "DomainRed"
"upgradeDomain": "Blue"

#### Download the "Deploy Anywhere" package
Download the [MicrosoftAzureServiceFabricWindowsServerversion.zip](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip the downloaded package to your deployment machine or on one of the machines that will be the part of your cluster.

## Deployment of the Cluster

After you have gone steps outlined in the planning and preparation section above, you are now ready to deploy your cluster. 

#### Modify Cluster Configuration
open the ClusterConfig.JSON from the package you downloaded. you can use any editor of your choice. Modify the following settings. 

**Configuration Setting :** NodeTypes

**Description :**Node types allow you to separate your cluster nodes into various groups. A cluster must have at least one NodeType. All nodes in a group have the following common characteristics. <br> *Name*  - This is the Node Type name. <br>*EndPoints* - These are various named end points (Ports) that are associated with this Node Type. You can use any port number that you wish, as long as they do not conflict with anything else in this manifest and are not already in use by any other program on the machine/VM*PlacementProperties* - These describe properties for this node type that you will then use as placement constraints for system services or your services. These properties are user defined key/value pairs that provide extra metadata for a given node. Examples of node properties would be whether or not the node has a hard drive or graphics card, the number of spindles in it hard drive, cores, and other physical properties. <br> *Capacities* - Node capacities define the name and amount of a particular resource that a particular node has available for consumption. For example, a node may define that it has capacity for a metric called “MemoryInMb” and that it has 2048 available by default. These capacities are used at runtime to ensure that services which require particular amounts of resources are placed on nodes with those resources remaining available.

**Configuration Setting :** NodeList

**Description :** The details for each of the nodes that will be part of the cluster (node type, node name, seed node, IP address, Fault Domain and Upgrade Domain of the node). The machines you want the cluster to be created on need to be listed here with their IP address. 

If you use the same IP addresses for all the nodes, then a scale minimized or one-box cluster will be created, which you can use for test purposes. Scale minimized clusters should not be used for deploying production workloads.


#### Run Setup script
Once you have modified the cluster configuration in the JSON doc and added all the node information to it, run the cluster creation powershell script from the package folder and pass in the path to the configuration file and the location of the package root to it. 

This script can be run on any machine that has admin access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on, may or may not be part of the cluster.

```
C:\ServiceFabricDeployAnywherePackag> .\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath C:\ServiceFabricDeployAnywherePackage\ClusterConfig.JSON -MicrosoftServiceFabricCabFilePath C:\ServiceFabricDeployAnywherePackage\MicrosoftAzureServiceFabric.cab
```


## Next steps

- [Cluster security](service-fabric-cluster-security.md)
- [ Service Fabric SDK and getting started](service-fabric-get-started.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Health model introduction](service-fabric-health-introduction.md)
- [Application Security and Runas](service-fabric-application-runas-security.md)
- [Overview of the "Deploy anywhere" feature and a comparison with Azure-managed clusters](service-fabric-deploy-anywhere.md)
