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


#Create an Azure Service Fabric cluster on any machines - Physical or Virtual, be it on-premises or other clouds by using the  Azure ServiceFabric "Deploy Anywhere" package 
 
Azure Service Fabric allows the creation of Service Fabric clusters on any Virtual Machines or computers running Windows Server (Linux support coming later). This means you can deploy and run Service Fabric applications in any environment where you have a set of Windows Server or Linux computers that are interconnected, be it on-premises or with any cloud provider. Service Fabric provides a setup package for you to create such Service Fabric clusters.


## Microsoft Azure Service Fabric "deploy anywhere" Package

- Microsoft-Azure-ServiceFabric-WindowsServer-version.zip 

This article walks you through the steps for creating a cluster using "Deploy Anywhere" package on-premises, though it can be easily adapted for any other environment such as other clouds.To learn whether using "Deploy Anywhere" is the right option for you see [this](service-fabric-deploy-anywhere.md) article for an overview of this feature and a comparison with Azure-managed clusters.

## Key steps for creating a cluster
1. Infrastructure planning.
2. Download the "AzureServiceFabric-DeployAnywhere" package for Service Fabric from the Microsoft Download Center.
3. Modify the ClusterConfig.JSON file in the downloaded package and add the IP addresses of the machines that you want to run the cluster on.
4. Run the CreateCluster PowerShell script in the downloaded package to create the cluster.

## Planning and Preparation
#### Determine the Initial Cluster Size
Each node consists of a full Service Fabric stack and is an individual member of the Service Fabric cluster. In a typical Service Fabric deployment there is one node per OS instance (physical or virtual). The cluster size is determined by your business needs; however, you must have a minimum cluster size of three nodes (machines/VMs).
###### Note  
For development purposes, you can have more than one node on a given machine. In a production environment, Service Fabric supports only one node per physical/virtual machine. For development, you should download the [Service Fabric SDK](service-fabric-get-started.md).

#### Determine the number of Fault Domains and Upgrade Domains
A **fault domain (FD)** is a physical unit of failure and is directly related to the physical infrastructure in the data centers. A fault domain consists of hardware components (computers, switches, and more) that share a single point of failure. Although there is no 1:1 mapping between fault domains and racks, loosely speaking, each rack can be considered a fault domain. When considering the nodes in your cluster, it is strongly recommended that the nodes be distributed amongst at least three fault domains.

An **upgrade domain (UD)** is a logical unit of a set of nodes, used that determines how you plan to bring down to perform the upgrades to services that you plan to run in your cluster.

The simplest way to think about these concepts is to consider FDs as the unit of unplanned failure, and UDs as the unit of planned maintenance. 

You will need to specify the fault domains and upgrade domains in the cluster configuration.

#### Pre-requisites for Setting up the cluster

For each machine to be a part of the cluster these are the pre-requisites:

- Windows Server 2012 R2.
- KB2858668 is required for Windows Server 2012, KB2533623 is required for Windows Server 2008 R2 SP1.
- Minimum of 2 GB memory is recommended
- .NET Framework 4.5, full install
- Windows PowerShell 3.0
- Visual C++ 2012 (VC++ 11.0) Redistributable Package
- Network Connectivity – Make sure that the machnies are on a secure network/or networks
- The cluster administrator deploying and configuring the cluster must have administrator privileges on each of the computers.

## Download the "Deploy Anywhere" package
Download the Microsoft-Azure-ServiceFabric-WindowsServer-version.zip from Microsoft Download Center and unzip the downloaded package. In the download package you will find the following files.

**File name:** AzureServiceFabricDeployAnywhere.cab,  **Description:**  The cab file that contains the binaries that will be deployed to each machine in the cluster.

**File name:** ClusterConfig.JSON, **Description:**  Cluster Configuration file that contains all the settings for the cluster including the information for each machine that is part of the cluster. 

**File name:** EULA.doc, **Description:** The license terms for the use of Microsoft Azure Service Fabric "AzureServiceFabric-DeployAnywhere" package.

**File name:** Readme.txt, **Description:**  Basic installation instructions.

**File name:** CreateServiceFabricCluster.ps1, **Description:** PowerShell script that creates the cluster as per the settings in the ClusterConfig.JSON

**File name:** RemoveServiceFabricCluster.ps1, **Description:** PowerShell script for cluster removal


## Modify Cluster Configuration
After downloading the package, open the ClusterConfig.JSON in an editor of your choice. Populate the following settings. 

**Configuration Setting :**NodeTypes

**Description :**Node types allow you to separate your cluster nodes into various groups. A cluster must have at least one NodeType. All nodes in a group have the following common characteristics. <br> *Name*  - This is the Node Type name. <br>*EndPoints* - These are various named end points (Ports) that are associated with this Node Type. You can use any port number that you wish, as long as they do not conflict with anything else in this manifest and are not already in use by any other program on the machine/VM*PlacementProperties* - These describe properties for this node type that you will then use as placement constraints for system services or your services. These properties are user defined key/value pairs that provide extra metadata for a given node. Examples of node properties would be whether or not the node has a hard drive or graphics card, the number of spindles in it hard drive, cores, and other physical properties. <br> *Capacities* - Node capacities define the name and amount of a particular resource that a particular node has available for consumption. For example, a node may define that it has capacity for a metric called “MemoryInMb” and that it has 2048 available by default. These capacities are used at runtime to ensure that services which require particular amounts of resources are placed on nodes with those resources remaining available.

**Configuration Setting :** NodeList

**Description :** The details for each of the nodes that will be part of the cluster (node type, node name, seed node, IP address, Fault Domain and Upgrade Domain of the node). The machines you want the cluster to be created on need to be listed here with their IP address. Upgrade Domains and Fault Domains are described earlier in the planning section of this article.


## Run Setup script
Once you have modified the cluster configuration in the JSON doc and added all the node information to it, run the cluster creation powershell script from the package folder and pass in the path to the configuration file and the location of the package root to it. 

This script can be run on any machine that has admin access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on, may or may not be part of the cluster.

```
C:\ServiceFabricDeployAnywherePackag> .\CreateServiceFabricCluster.ps1 -ClusterConfigurationFilePath C:\ServiceFabricDeployAnywherePackage\ClusterConfig.JSON -ServiceFabricPackageSourcePath C:\ServiceFabricDeployAnywherePackage\
```


## Next steps


- [Cluster security](service-fabric-cluster-security.md)
- [Managing your Service Fabric applications in Visual Studio](service-fabric-manage-application-in-visual-studio.md).
- [Service Fabric Health model introduction](service-fabric-health-introduction.md)
- [Application Security and Runas](service-fabric-application-runas-security.md)

