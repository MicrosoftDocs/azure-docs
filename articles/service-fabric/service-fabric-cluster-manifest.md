<properties
   pageTitle="Configure your standalone cluster | Microsoft Azure"
   description="This article describes how to configure your standalone or private Service Fabric cluster."
   services="service-fabric"
   documentationCenter=".net"
   authors="dsk-2015"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="na"
   ms.date="06/23/2016"
   ms.author="dkshir"/>


# Configuration settings for standalone Windows cluster

This article describes how to configure a standalone Service Fabric cluster using the _**ClusterConfig.JSON**_ file. This file is downloaded to your work machine, when you [download the standalone Service Fabric package](service-fabric-cluster-creation-for-windows-server.md#downloadpackage). The ClusterConfig.JSON file allows you to specify information such as the Service Fabric nodes and their IP addresses, different types of nodes on the cluster, the security configurations as well as the network topology in terms of fault/upgrade domains, for your Service Fabric cluster. 

We will examine the various sections of this file below.

## General cluster configurations
This covers the broad cluster specific configurations, as shown in the JSON snippet below.

    "name": "SampleCluster",
    "clusterManifestVersion": "1.0.0",
    "apiVersion": "2015-01-01-alpha",

You can give any friendly name to your Service Fabric cluster by assigning it to the **name** variable. You may change the **clusterManifestVersion** as per your setup; it will need to be updated before upgrading your Service Fabric configuration. You may leave the **apiVersion** to the default value.


<a id="clusternodes"></a>
## Nodes on the cluster
You can configure the nodes on your Service Fabric cluster by using the **nodes** section, as the following snippet shows.

    "nodes": [{
        "nodeName": "vm0",
        "iPAddress": "localhost",
        "nodeTypeRef": "NodeType0",
        "faultDomain": "fd:/dc1/r0",
        "upgradeDomain": "UD0"
    }, {
        "nodeName": "vm1",
        "iPAddress": "localhost",
        "nodeTypeRef": "NodeType1",
        "faultDomain": "fd:/dc1/r1",
        "upgradeDomain": "UD1"
    }, {
        "nodeName": "vm2",
        "iPAddress": "localhost",
        "nodeTypeRef": "NodeType2",
        "faultDomain": "fd:/dc1/r2",
        "upgradeDomain": "UD2"
    }],

A Service Fabric cluster needs a minimum of 3 nodes. You can add more nodes to this section as per your setup. The following table explains the configuration settings for each node.

|**Node configuration**|**Description**|
|-----------------------|--------------------------|
|nodeName|You can give any friendly name to the node.|
|iPAddress|Find out the IP address of your node by opening a command window and typing `ipconfig`. Note the IPV4 address and assign it to the **iPAddress** variable.|
|nodeTypeRef|Each node can be assigned a different node type. The [node types](#nodetypes) are defined in the section below.|
|faultDomain|Fault domains enable cluster administrators to define the physical nodes that might fail at the same time due to shared physical dependencies.|
|upgradeDomain|Upgrade domains describe sets of nodes that are shut down for Service Fabric upgrades at about the same time. You can choose which nodes to assign to which Upgrade domains, as they are not limited by any physical requirements.| 


## Diagnostics configurations
You can configure parameters to enable diagnostics and troubleshooting node and cluster failures, by using the **diagnosticsFileShare** section as shown in the following snippet. 

    "diagnosticsFileShare": {
        "etlReadIntervalInMinutes": "5",
        "uploadIntervalInMinutes": "10",
        "dataDeletionAgeInDays": "7",
        "etwStoreConnectionString": "file:c:\ProgramData\SF\FileshareETW",
        "crashDumpConnectionString": "file:c:\ProgramData\SF\FileshareCrashDump",
        "perfCtrConnectionString": "file:c:\ProgramData\SF\FilesharePerfCtr"
    },

These variables help in collecting ETW trace logs, crash dumps as well as performance counters. Read [Tracelog](https://msdn.microsoft.com/library/windows/hardware/ff552994.aspx) and [ETW Tracing](https://msdn.microsoft.com/library/ms751538.aspx) for more information on ETW trace logs. [Crash dumps](https://blogs.technet.microsoft.com/askperf/2008/01/08/understanding-crash-dump-files/) for Service Fabric node as well as the cluster can be directed to the **crashDumpConnectionString** folder. The [performance counters](https://msdn.microsoft.com/library/windows/desktop/aa373083.aspx) for the cluster can be directed to the **perfCtrConnectionString** folder on your machine.


## Cluster **properties**

The **properties** section in the ClusterConfig.JSON is used to configure the cluster as follows.

### **security** 
The **security** section is necessary for a secure standalone Service Fabric cluster. The following snippet shows a part of this section.

    "security": {
        "metadata": "This cluster is secured using X509 certificates.",
        "ClusterCredentialType": "X509",
        "ServerCredentialType": "X509",
		. . .
	}

The **metadata** is a description of your secure cluster and can be set as per your setup. The **ClusterCredentialType** and **ServerCredentialType** determine the type of security that the cluster and the nodes will implement. They can be set to either *X509* for a certificate-based security, or *Windows* for an Azure Active Directory-based security. The rest of the **security** section will be based on the type of the security. Read [Certificates-based security in a standalone cluster](service-fabric-windows-cluster-x509-security.md) or [Windows security in a standalone cluster](service-fabric-windows-cluster-windows-security.md) for information on how to fill out the rest of the **security** section.

### **reliabilityLevel**
The **reliabilityLevel** defines the number of copies of the system services that can run on the primary nodes of the cluster. This increases the reliability of these services and hence the cluster. You can set this variable to either *Bronze*, *Silver*, *Gold* or *Platinum* for 3, 5, 7 or 9 copies of these services respectively. See an example below.

	"reliabilityLevel": "Bronze",
	
Note that since a primary node runs a single copy of the system services, you would need a minimum of 3 primary nodes for *Bronze*, 5 for *Silver*, 7 for *Gold* and 9 for *Platinum* reliability levels.


<a id="nodetypes"></a>
### **nodeTypes**
The **nodeTypes** section describes the type of the nodes that your cluster has. At least one node type must be specified for a cluster, as shown in the snippet below. 

	"nodeTypes": [{
        "name": "NodeType0",
        "clientConnectionEndpointPort": "19000",
        "clusterConnectionEndpoint": "19001",
        "httpGatewayEndpointPort": "19080",
        "applicationPorts": {
			"startPort": "20001",
            "endPort": "20031"
        },
        "ephemeralPorts": {
            "startPort": "20032",
            "endPort": "20062"
        },
        "isPrimary": true
    }]

The **name** is the friendly name for this particular node type. To create a node of this node type, you will need to assign the friendly name for this node type to the **nodeTypeRef** variable for that node, as mentioned in the [Nodes on the cluster](#clusternodes) section above. For each node type, you can define various endpoints for connecting to this cluster. You can choose any port number for these connection endpoints, as long as they do not conflict with any other endpoints in this cluster. In a cluster with multiple node types, there will be one primary node type, which has **isPrimary** set to *true*. The rest of the nodes will have the **isPrimary** set to *false*. Read [Service Fabric cluster capacity planning considerations](service-fabric-cluster-capacity.md) for more information on **nodeTypes** and **reliabilityLevel** values as per your cluster capacity, as well as to know the difference between the primary and the non-primary node types.


### **fabricSettings**
This section allows you to set the root directories for the Service Fabric data and logs. You can customize these only during the initial cluster creation. See below for a sample snippet of this section.

    "fabricSettings": [{
        "name": "Setup",
        "parameters": [{
            "name": "FabricDataRoot",
            "value": "C:\ProgramData\SF"
        }, {
            "name": "FabricLogRoot",
            "value": "C:\ProgramData\SF\Log"
    }]

Note that if you customize only the data root, then the log root will be placed one level below the data root.


## Next steps

Once you have a complete ClusterConfig.JSON file configured as per your standalone cluster setup, you can deploy your cluster by following the article [Create an Azure Service Fabric cluster on-premises or in the cloud](service-fabric-cluster-creation-for-windows-server.md) and then proceed to [visualizing your cluster with Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).


