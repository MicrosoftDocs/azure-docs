---
title: Configure your Azure Service Fabric standalone cluster | Microsoft Docs
description: Learn how to configure your standalone or private Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: 0c5ec720-8f70-40bd-9f86-cd07b84a219d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/02/2017
ms.author: ryanwi

---
# Configuration settings for standalone Windows cluster
This article describes how to configure a standalone Service Fabric cluster using the ***ClusterConfig.JSON*** file. You can use this file to specify information such as the Service Fabric nodes and their IP addresses, different types of nodes on the cluster, the security configurations as well as the network topology in terms of fault/upgrade domains, for your standalone cluster.

When you [download the standalone Service Fabric package](service-fabric-cluster-creation-for-windows-server.md#downloadpackage), a few samples of the ClusterConfig.JSON file are downloaded to your work machine. The samples having *DevCluster* in their names will help you create a cluster with all three nodes on the same machine, like logical nodes. Out of these, at least one node must be marked as a primary node. This cluster is useful for a development or test environment and is not supported as a production cluster. The samples having *MultiMachine* in their names, will help you create a production quality cluster, with each node on a separate machine. The number of primary nodes for these cluster will be based on the [reliability level](#reliability).

1. *ClusterConfig.Unsecure.DevCluster.JSON* and *ClusterConfig.Unsecure.MultiMachine.JSON* show how to create an unsecured test or production cluster respectively. 
2. *ClusterConfig.Windows.DevCluster.JSON* and  *ClusterConfig.Windows.MultiMachine.JSON* show how to create test or production cluster, secured using [Windows security](service-fabric-windows-cluster-windows-security.md).
3. *ClusterConfig.X509.DevCluster.JSON* and *ClusterConfig.X509.MultiMachine.JSON* show how to create test or production cluster, secured using [X509 certificate-based security](service-fabric-windows-cluster-x509-security.md). 

Now we will examine the various sections of a ***ClusterConfig.JSON*** file as below.

## General cluster configurations
This covers the broad cluster specific configurations, as shown in the JSON snippet below.

    "name": "SampleCluster",
    "clusterConfigurationVersion": "1.0.0",
    "apiVersion": "01-2017",

You can give any friendly name to your Service Fabric cluster by assigning it to the **name** variable. The **clusterConfigurationVersion** is the version number of your cluster; you should increase it every time you upgrade your Service Fabric cluster. You should however leave the **apiVersion** to the default value.

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

A Service Fabric cluster must contain at least 3 nodes. You can add more nodes to this section as per your setup. The following table explains the configuration settings for each node.

| **Node configuration** | **Description** |
| --- | --- |
| nodeName |You can give any friendly name to the node. |
| iPAddress |Find out the IP address of your node by opening a command window and typing `ipconfig`. Note the IPV4 address and assign it to the **iPAddress** variable. |
| nodeTypeRef |Each node can be assigned a different node type. The [node types](#nodetypes) are defined in the section below. |
| faultDomain |Fault domains enable cluster administrators to define the physical nodes that might fail at the same time due to shared physical dependencies. |
| upgradeDomain |Upgrade domains describe sets of nodes that are shut down for Service Fabric upgrades at about the same time. You can choose which nodes to assign to which Upgrade domains, as they are not limited by any physical requirements. |

## Cluster properties
The **properties** section in the ClusterConfig.JSON is used to configure the cluster as follows.

<a id="reliability"></a>

### Reliability
The **reliabilityLevel** section defines the number of copies of the system services that can run on the primary nodes of the cluster. This increases the reliability of these services and hence the cluster. You can set this variable to either *Bronze*, *Silver*, *Gold* or *Platinum* for 3, 5, 7 or 9 copies of these services respectively. See an example below.

    "reliabilityLevel": "Bronze",

Note that since a primary node runs a single copy of the system services, you would need a minimum of 3 primary nodes for *Bronze*, 5 for *Silver*, 7 for *Gold* and 9 for *Platinum* reliability levels.

If you don't specify the reliabilityLevel property in your clusterConfig.json, our system will calculate the most optimized reliabilityLevel for you based on the number of "Primary NodeType" nodes that you have. For example, if you have 4 primary nodes, the reliabilityLevel will be set to Bronze, if you have 5 such nodes, the reliabilityLevel will be set to Silver. In the near future, we will be removing the option to configure your reliability level, since the cluster will automatically detect and use the optimal reliability level.

ReliabilityLevel is upgradable. You can create a clusterConfig.json v2 and scale up and down by a [Standalone Cluster Configuration Upgrade](service-fabric-cluster-upgrade-windows-server.md). Your can also upgrade to a clusterConfig.json v2 in which it doesn't specify reliabilityLevel so that the reliabilityLevel will be automatically calculated. 

### Diagnostics
The **diagnosticsStore** section allows you to configure parameters to enable diagnostics and troubleshooting node or cluster failures, as shown in the following snippet. 

    "diagnosticsStore": {
        "metadata":  "Please replace the diagnostics store with an actual file share accessible from all cluster machines.",
        "dataDeletionAgeInDays": "7",
        "storeType": "FileShare",
        "IsEncrypted": "false",
        "connectionstring": "c:\\ProgramData\\SF\\DiagnosticsStore"
    }

The **metadata** is a description of your cluster diagnostics and can be set as per your setup. These variables help in collecting ETW trace logs, crash dumps as well as performance counters. Read [Tracelog](https://msdn.microsoft.com/library/windows/hardware/ff552994.aspx) and [ETW Tracing](https://msdn.microsoft.com/library/ms751538.aspx) for more information on ETW trace logs. All logs including [Crash dumps](https://blogs.technet.microsoft.com/askperf/2008/01/08/understanding-crash-dump-files/) and [performance counters](https://msdn.microsoft.com/library/windows/desktop/aa373083.aspx) can be directed to the **connectionString** folder on your machine. You can also use *AzureStorage* for storing diagnostics. See below for a sample snippet.

    "diagnosticsStore": {
        "metadata":  "Please replace the diagnostics store with an actual file share accessible from all cluster machines.",
        "dataDeletionAgeInDays": "7",
        "storeType": "AzureStorage",
        "IsEncrypted": "false",
        "connectionstring": "xstore:DefaultEndpointsProtocol=https;AccountName=[AzureAccountName];AccountKey=[AzureAccountKey]"
    }

### Security
The **security** section is necessary for a secure standalone Service Fabric cluster. The following snippet shows a part of this section.

    "security": {
        "metadata": "This cluster is secured using X509 certificates.",
        "ClusterCredentialType": "X509",
        "ServerCredentialType": "X509",
        . . .
    }

The **metadata** is a description of your secure cluster and can be set as per your setup. The **ClusterCredentialType** and **ServerCredentialType** determine the type of security that the cluster and the nodes will implement. They can be set to either *X509* for a certificate-based security, or *Windows* for an Azure Active Directory-based security. The rest of the **security** section will be based on the type of the security. Read [Certificates-based security in a standalone cluster](service-fabric-windows-cluster-x509-security.md) or [Windows security in a standalone cluster](service-fabric-windows-cluster-windows-security.md) for information on how to fill out the rest of the **security** section.

<a id="nodetypes"></a>

### Node Types
The **nodeTypes** section describes the type of the nodes that your cluster has. At least one node type must be specified for a cluster, as shown in the snippet below. 

    "nodeTypes": [{
        "name": "NodeType0",
        "clientConnectionEndpointPort": "19000",
        "clusterConnectionEndpointPort": "19001",
        "leaseDriverEndpointPort": "19002"
        "serviceConnectionEndpointPort": "19003",
        "httpGatewayEndpointPort": "19080",
        "reverseProxyEndpointPort": "19081",
        "applicationPorts": {
            "startPort": "20575",
            "endPort": "20605"
        },
        "ephemeralPorts": {
            "startPort": "20606",
            "endPort": "20861"
        },
        "isPrimary": true
    }]

The **name** is the friendly name for this particular node type. To create a node of this node type, assign its friendly name to the **nodeTypeRef** variable for that node, as mentioned [above](#clusternodes). For each node type, define the connection endpoints that will be used. You can choose any port number for these connection endpoints, as long as they do not conflict with any other endpoints in this cluster. In a multi-node cluster, there will be one or more primary nodes (i.e. **isPrimary** set to *true*), depending on the [**reliabilityLevel**](#reliability). Read [Service Fabric cluster capacity planning considerations](service-fabric-cluster-capacity.md) for information on **nodeTypes** and **reliabilityLevel** values, and to know what are primary and the non-primary node types. 

#### Endpoints used to configure the node types
* *clientConnectionEndpointPort* is the port used by the client to connect to the cluster, when using the client APIs. 
* *clusterConnectionEndpointPort* is the port at which the nodes communicate with each other.
* *leaseDriverEndpointPort* is the port used by the cluster lease driver to find out if the nodes are still active. 
* *serviceConnectionEndpointPort* is the port used by the applications and services deployed on a node, to communicate with the Service Fabric client on that particular node.
* *httpGatewayEndpointPort* is the port used by the Service Fabric Explorer to connect to the cluster.
* *ephemeralPorts* override the [dynamic ports used by the OS](https://support.microsoft.com/kb/929851). Service Fabric will use a part of these as application ports and the remaining will be available for the OS. It will also map this range to the existing range present in the OS, so for all purposes, you can use the ranges given in the sample JSON files. You need to make sure that the difference between the start and the end ports is at least 255. You may run into conflicts if this difference is too low, since this range is shared with the operating system. See the configured dynamic port range by running `netsh int ipv4 show dynamicport tcp`.
* *applicationPorts* are the ports that will be used by the Service Fabric applications. The application port range should be large enough to cover the endpoint requirement of your applications. This range should be exclusive from the dynamic port range on the machine, i.e. the *ephemeralPorts* range as set in the configuration.  Service Fabric will use these whenever new ports are required, as well as take care of opening the firewall for these ports. 
* *reverseProxyEndpointPort* is an optional reverse proxy endpoint. See [Service Fabric Reverse Proxy](service-fabric-reverseproxy.md) for more details. 

### Log Settings
The **fabricSettings** section allows you to set the root directories for the Service Fabric data and logs. You can customize these only during the initial cluster creation. See below for a sample snippet of this section.

    "fabricSettings": [{
        "name": "Setup",
        "parameters": [{
            "name": "FabricDataRoot",
            "value": "C:\\ProgramData\\SF"
        }, {
            "name": "FabricLogRoot",
            "value": "C:\\ProgramData\\SF\\Log"
    }]

We recommended using a non-OS drive as the FabricDataRoot and FabricLogRoot as it provides more reliability against OS crashes. Note that if you customize only the data root, then the log root will be placed one level below the data root.

### Stateful Reliable Service Settings
The **KtlLogger** section allows you to set the global configuration settings for Reliable Services. For more details on these settings read [Configure stateful reliable services](service-fabric-reliable-services-configuration.md).
The example below shows how to change the the shared transaction log that gets created to back any reliable collections for stateful services.

    "fabricSettings": [{
        "name": "KtlLogger",
        "parameters": [{
            "name": "SharedLogSizeInMB",
            "value": "4096"
        }]
    }]

### Add-on features
To configure add-on features, the apiVersion should be configured as '04-2017' or higher, and addonFeatures needs to be configured:

    "apiVersion": "04-2017",
    "properties": {
      "addOnFeatures": [
          "DnsService",
          "RepairManager"
      ]
    }

### Container support
To enable container support for both windows server container and hyper-v container for standalone clusters, the 'DnsService' add-on feature needs to be enabled.


## Next steps
Once you have a complete ClusterConfig.JSON file configured as per your standalone cluster setup, you can deploy your cluster by following the article [Create a standalone Service Fabric cluster](service-fabric-cluster-creation-for-windows-server.md) and then proceed to [visualizing your cluster with Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).

