<properties
   pageTitle="Create a on-premises or any-cloud Azure Service Fabric cluster | Microsoft Azure"
   description="Learn how to create an Azure Service Fabric cluster on any machine (physical or virtual) running Windows Server, whether it's on-premises or in any cloud."
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
   ms.date="07/05/2016"
   ms.author="chackdan"/>


# Create a cluster running on Windows Server

Azure Service Fabric allows the creation of Service Fabric clusters on any virtual machines or computers running Windows Server. This means you can deploy and run Service Fabric applications in any environment where you have a set of Windows Server computers that are interconnected, be it on-premises or with any cloud provider. Service Fabric provides a setup package for you to create Service Fabric clusters called the standalone Windows Server package.

This article walks you through the steps for creating a cluster using the standalone package for Service Fabric on-premises, though it can be easily adapted for any other environment such as other cloud providers.

>[AZURE.NOTE] This standalone Windows Server package is currently in preview and is not supported for production workloads. [Click here](http://go.microsoft.com/fwlink/?LinkID=733084) if you would like to download a copy of the EULA now.

<a id="downloadpackage"></a>
## Download the Service Fabric standalone package


[Download the standalone package for Service Fabric for Windows Server 2012 R2 and above](http://go.microsoft.com/fwlink/?LinkId=730690), which is named *Microsoft.Azure.ServiceFabric.WindowsServer.&lt;version&gt;.zip*.

In the download package you will find the following files:

|**File name**|**Short description**|
|-----------------------|--------------------------|
|MicrosoftAzureServiceFabric.cab|The CAB file that contains the binaries that are deployed to each machine in the cluster.|
|ClusterConfig.Unsecure.DevCluster.json|Cluster configuration sample file that contains the settings for an unsecure, three node, single VM/machine development cluster including the information for each node that is in the cluster. |
|ClusterConfig.Unsecure.MultiMachine.json|Cluster configuration sample file that contains the settings for an unsecure, multi-VM/machine  cluster including the information for each machine that is in the cluster.|
|ClusterConfig.Windows.DevCluster.json|Cluster configuration sample file that contains all the settings for a secure, three node, single VM/machine development cluster including the information for each node that is in cluster. The cluster is secured using [Windows identities](https://msdn.microsoft.com/library/ff649396.aspx).|
|ClusterConfig.Windows.MultiMachine.json|Cluster configuration sample file that contains all the settings for a secure, multi-VM/machine cluster using Windows security including the information for each machine that is in the secure cluster. The cluster is secured using [Windows identities](https://msdn.microsoft.com/library/ff649396.aspx).|
|ClusterConfig.x509.DevCluster.json|Cluster configuration sample file that contains all the settings for a secure, three node, single VM/machine development cluster including the information for each node in the cluster. The cluster is secured using x509 certificates.|
|ClusterConfig.x509.MultiMachine.json|Cluster configuration sample file that contains all the settings for the secure, multi-VM/machine cluster including the information for each node in the secure cluster. The cluster is secured using x509 certificates.|
|EULA.txt|The license terms for the use of Microsoft Azure Service Fabric standalone Windows Server package. [Click here](http://go.microsoft.com/fwlink/?LinkID=733084) if you would like to download a copy of the EULA now.|
|Readme.txt|Link to the release notes and basic installation instructions. It is a subset of the instructions you will find on this page.|
|CreateServiceFabricCluster.ps1|PowerShell script that creates the cluster using the settings in the ClusterConfig.json file.|
|RemoveServiceFabricCluster.ps1|PowerShell script that removes a cluster using the settings in the ClusterConfig.json.|
|AddNode.ps1|PowerShell script for adding a node to an existing deployed cluster.|
|RemoveNode.ps1|PowerShell script for removing a node from an existing deployed cluster.|


## Plan and prepare your cluster deployment
The following steps need to be performed before you create your cluster.

### Step 1: Plan your cluster infrastructure
You are about to create a Service Fabric cluster on  machines you own, so you get to decide on what kinds of failures you want the cluster to survive. For example, do you need separate power lines or internet connections that supply these machines? In addition you should also consider the physical security of these machines.  Where is the physical location and who needs access to them?  Once you make these decisions, you logically map the machines to the various fault domains (see below for more information). The infrastructure planning for production clusters will be more involved than the test clusters.

### Step 2: Prepare the machines to meet the pre-requisites
Pre-requisites for each machine that you want to add to the cluster:

- Minimum of 2 GB memory is recommended
- Network connectivity. Make sure that the machines are on a secure network/or networks
- Windows Server 2012 R2 or Windows Server 2012 (you need to have KB2858668 installed for this).
- .NET Framework 4.5.1 or higher, full install
- Windows PowerShell 3.0
- The cluster administrator deploying and configuring the cluster must have administrator privileges on each of the machines.
- The RemoteRegistry service should be running on all the machines.

### Step 3: Determine the initial cluster size
Each node has the Service Fabric runtime deployed and is a member of the cluster. In a typical production deployment there is one node per OS instance (physical or virtual). The cluster size is determined by your business needs; however, you must have a minimum cluster size of three nodes (machines/VMs).
Note that for development purposes, you can have more than one node on a given machine. In a production environment, Service Fabric supports only one node per physical or virtual machine.

### Step 4: Determine the number of fault domains and upgrade domains
A **Fault Domain (FD)** is a physical unit of failure and is directly related to the physical infrastructure in the data centers. A fault domain consists of hardware components (computers, switches, network and more) that share a single point of failure. Although there is no 1:1 mapping between fault domains and racks, loosely speaking, each rack can be considered a fault domain. When considering the nodes in your cluster, it is strongly recommended that the nodes be distributed amongst at least three fault domains.

When you specify FDs in the *ClusterConfig.json*, you get to choose the name of each FD. Service Fabric supports hierarchical FDs, so you can reflect your infrastructure topology in them.  For example, the following FDs are valid:

- "faultDomain": "fd:/Room1/Rack1/Machine1"
- "faultDomain": "fd:/FD1"
- "faultDomain": "fd:/Room1/Rack1/PDU1/M1"


An **Upgrade Domain (UD)** is a logical unit of nodes. During a Service Fabric orchestrated upgrades (either an application upgrade or a cluster upgrade), all nodes in a UD are taken down to perform the upgrade while nodes in other UDs remain available to serve requests. The firmware upgrades you do to your machines will not honor UDs, so you must do them one machine at a time.

The simplest way to think about these concepts is to consider FDs as the unit of unplanned failure, and UDs as the unit of planned maintenance.

When you specify UDs in the *ClusterConfig.json*, you get to choose the name of each UD. For example, the following are valid:

- "upgradeDomain": "UD0"
- "upgradeDomain": "UD1A"
- "upgradeDomain": "DomainRed"
- "upgradeDomain": "Blue"

For more detailed information on upgrade domains and fault domain read the [Describing a Service Fabric cluster](service-fabric-cluster-resource-manager-cluster-description.md) article.

### Step 5: Download the Service Fabric standalone package  for Windows Server
[Download the Service Fabric standalone package for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip the package either to a deployment machine that is not part of the cluster or to one of the machines that will be part of your cluster.

<a id="createcluster"></a>
## Create your cluster

After you have gone through steps outlined in the planning and preparation section above, you are now ready to create your cluster.

### Step 1: Modify cluster configuration
The cluster is described in a *ClusterConfig.json* file. For details on the sections in this file read the [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md) article.
Open one of the *ClusterConfig.json* files from the package you downloaded and modify the following settings:

|**Configuration Setting**|**Description**|
|-----------------------|--------------------------|
|**NodeTypes**|Node types allow you to separate your cluster nodes into various groups. A cluster must have at least one NodeType. All nodes in a group have the following common characteristics. <br> **Name** - This is the node type name. <br>**Endpoints Ports** - These are various named end points (ports) that are associated with this node type. You can use any port number that you wish, as long as they do not conflict with anything else in this manifest and are not already in use by any other application running on the machine/VM <br> **Placement Properties** - These describe properties for this node type that you will can use as placement constraints for the system services or your services. These properties are user defined key/value pairs that provide extra metadata for a given node. Examples of node properties would be whether or not the node has a hard drive or graphics card, the number of spindles in its hard drive, cores and other physical properties. <br> **Capacities** - Node capacities define the name and amount of a particular resource that a particular node has available for consumption. For example, a node may define that it has capacity for a metric called “MemoryInMb” and that it has 2048 MB available by default. These capacities are used at runtime to ensure that services which require particular amounts of resources are placed on nodes with those resources remaining available.<br>**IsPrimary** - If you have more than one NodeType defined ensure that only one is set to primary with the value *true*, which is where the system services run. All other node types should be set to the value *false*|
|**Nodes**|The details for each of the nodes that are part of the cluster (node type, node name, IP address, fault domain and upgrade domain of the node). The machines you want the cluster to be created on need to be listed here with their IP addresses. <br> If you use the same IP addresses for all the nodes, then a one-box cluster is created, which you can use for testing purposes. One-box clusters should not be used for deploying production workloads.|

### Step 2: Run the create cluster script
Once you have modified the cluster configuration in the JSON doc and added all the node information to it, run the cluster creation *CreateServiceFabricCluster.ps1* PowerShell script from the package folder and pass in the path to the JSON configuration file and the location of the package CAB file.

This script can be run on any machine that has admin access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on may or may not be part of the cluster.

```
#Create an unsecure local development cluster

.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.DevCluster.json -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab -AcceptEULA $true
```
```
#Create an unsecure multi-machine cluster

.\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab -AcceptEULA $true
```

>[AZURE.NOTE] The deployment logs are available locally on the VM/Machine that you ran the CreateServiceFabricCluster Powershell on. You will find them in a subfolder called "DeploymentTraces" in the folder where you ran the Powershell command. Also to see whether Service Fabric was deployed correctly to a machine, you can find the installed files in the C:\ProgramData directory and the FabricHost.exe and Fabric.exe processes can be seen running in Task Manager.

### Step 3: Connect to the Cluster
Now you can connect to the cluster with Service Fabric Explorer either directly from one of the machines with http://localhost:19080/Explorer/index.html or remotely with http://<*IPAddressofaMachine*>:19080/Explorer/index.html

## Add nodes to your cluster

1. Prepare the VM/machine you want to add to your cluster (refer to step #2 in Plan and prepare for cluster deployment section above).
2. Plan as to which fault domain and upgrade domain you are going to add this VM/machine to.
3. Copy or [download the standalone package for Service Fabric for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip the package to the VM/machine you are planning to add to the cluster.
4. Open up a Powershell admin prompt, navigate to the location of the unzipped package.
5. Run *AddNode.ps1* Powershell with the parameters describing the new node to add. The example below adds a new node called VM5, with type NodeType0, IP address 182.17.34.52 into UD1 and FD1. The *ExistingClusterConnectionEndPoint* is a connection endpoint for a node already in the existing cluster. You can choose *any* node IP address for this in the cluster.

```
.\AddNode.ps1 -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab -NodeName VM5 -NodeType NodeType0 -NodeIPAddressorFQDN 182.17.34.52 -ExistingClusterConnectionEndPoint 182.17.34.50:19000 -UpgradeDomain UD1 -FaultDomain FD1
```

## Remove nodes from your cluster

1. Remote desktop (RDP) into the VM/machine that you want to remove from the cluster.
2. Copy or [download the standalone package for Service Fabric for Windows Server](http://go.microsoft.com/fwlink/?LinkId=730690) and unzip the package to the VM/machine.
3. Open up a Powershell admin prompt and navigate to the location of the unzipped package.
4. Run *RemoveNode.ps1* Powershell. The example below removes the current node from the cluster. The *ExistingClusterConnectionEndPoint* is a connection endpoint for a node already in the existing cluster. You can choose *any* node IP address for this in the cluster.

```
.\RemoveNode.ps1 -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab -ExistingClusterConnectionEndPoint 182.17.34.50:19000
```

## Remove your cluster
To remove a cluster run the *RemoveServiceFabricCluster.ps1* Powershell script from the package folder and pass in the path to the JSON configuration file and the location of the package CAB file.

This script can be run on any machine that has admin access to all the machines that are listed as nodes in the cluster configuration file. The machine that this script is run on may or may not be part of the cluster

```
.\RemoveServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json   -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab
```

## How To: Create a three node cluster with Azure IaaS VMs
The following steps describe how to create a cluster on Azure IaaS VMs using the standalone Windows Server installer. Note that Service Fabric runtime on this IaaS cluster is entirely managed by you, unlike clusters created through the Azure portal that are upgraded by the Service Fabric resource provider.

1. Log into the Azure portal and create a new Windows Server 2012 R2 Datacenter VM in a resource group.
2. Add two more Windows Server 2012 R2 Datacenter VMs to the same resource group. Ensure that each of the VMs has the same admin user name and password when created. Once created you should see all three VMs in the same virtual network.
3. Connect to each of the VMs and turn-off the Windows Firewall using the Server Manager, Local Server dashboard. This ensures that network traffic can communicate between the machines. Whilst on each machine get the IP address by opening a command prompt and typing *ipconfig*. Alternatively you can see the IP address of each machine by selecting the virtual network resource for the resource group in the Azure portal
4. Connect to one of the machines and test that you can ping the other two machines successfully.
5. Connect to one of the VMs and download the standalone Windows Server package into a new folder on the machine and unzip the package.
6. Open the *ClusterConfig.Unsecure.MultiMachine.json* file in Notepad and edit each node with the three IP addresses of the machines, change the cluster name at the top and save the file.  A partial example of the cluster manifest is shown below showing the IP addresses of each machine.

    ```
    {
        "name": "TestCluster",
        "clusterManifestVersion": "1.0.0",
        "apiVersion": "2015-01-01-alpha",
        "nodes": [
        {
            "nodeName": "vm0",
        	"metadata": "Replace the localhost with valid IP address or FQDN below",
            "iPAddress": "10.7.0.5",
            "nodeTypeRef": "NodeType0",
            "faultDomain": "fd:/dc1/r0",
            "upgradeDomain": "UD0"
        },
        {
            "nodeName": "vm1",
        	"metadata": "Replace the localhost with valid IP address or FQDN below",
            "iPAddress": "10.7.0.4",
            "nodeTypeRef": "NodeType0",
            "faultDomain": "fd:/dc2/r0",
            "upgradeDomain": "UD1"
        },
        {
            "nodeName": "vm2",
        	"metadata": "Replace the localhost with valid IP address or FQDN below",
            "iPAddress": "10.7.0.6",
            "nodeTypeRef": "NodeType0",
            "faultDomain": "fd:/dc3/r0",
            "upgradeDomain": "UD2"
        }
    ],
    ```

7. Open a Powershell ISE window and navigate to the folder where you downloaded and unzipped the standalone installer package and saved the manifest file above. Run the following Powershell command.

    ```
    .\CreateServiceFabricCluster.ps1 -ClusterConfigFilePath .\ClusterConfig.Unsecure.MultiMachine.json -MicrosoftServiceFabricCabFilePath .\MicrosoftAzureServiceFabric.cab
    ```

8. You should see the Powershell run, connect to each machine and create a cluster. After about 1 min you can test that the cluster is operational by connecting to the Service Fabric Explorer on one of the machine IP addresses e.g. http://10.7.0.5:19080/Explorer/index.html. Because this is a standalone cluster on IaaS VMs if you want to make this secure you have to deploy certs to the VMs or set up one of the machines as a Windows Server Active Directory (AD) controller for Windows authentication just like you would do on-premise. See Next Steps below for setting up secure clusters.

## Next steps
- [Create standalone Service Fabric clusters on Windows Server or Linux](service-fabric-deploy-anywhere.md)
- [Configuration settings for standalone Windows cluster](service-fabric-cluster-manifest.md)

- [Secure a standalone cluster on Windows using Windows security](service-fabric-windows-cluster-windows-security.md)
- [Secure a standalone cluster on Windows using X509 certificates](service-fabric-windows-cluster-x509-security.md)
