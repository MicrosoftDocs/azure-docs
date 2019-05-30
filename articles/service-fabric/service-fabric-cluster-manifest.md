---
title: Configure your Azure Service Fabric standalone cluster | Microsoft Docs
description: Learn how to configure your standalone or on-premises Azure Service Fabric cluster.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: chackdan
editor: ''

ms.assetid: 0c5ec720-8f70-40bd-9f86-cd07b84a219d
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/12/2018
ms.author: dekapur

---
# Configuration settings for a standalone Windows cluster
This article describes configuration settings of a standalone Azure Service Fabric cluster that can be set in the *ClusterConfig.json* file. You will use this file to specify information about the cluster's nodes, security configurations, as well as the network topology in terms of fault and upgrade domains.  After changing or adding configuration settings, you can either [create a standalone cluster](service-fabric-cluster-creation-for-windows-server.md) or [upgrade the configuration of a standalone cluster](service-fabric-cluster-config-upgrade-windows-server.md).

When you [download the standalone Service Fabric package](service-fabric-cluster-creation-for-windows-server.md#downloadpackage), ClusterConfig.json samples are also included. The samples that have "DevCluster" in their names create a cluster with all three nodes on the same machine, using logical nodes. Out of these nodes, at least one must be marked as a primary node. This type of cluster is useful for development or test environments. It is not supported as a production cluster. The samples that have "MultiMachine" in their names help create production grade clusters, with each node on a separate machine. The number of primary nodes for these clusters is based on the cluster's [reliability level](#reliability). In release 5.7, API Version 05-2017, we removed the reliability-level property. Instead, our code calculates the most optimized reliability level for your cluster. Do not try to set a value for this property in versions 5.7 onwards.

* ClusterConfig.Unsecure.DevCluster.json and ClusterConfig.Unsecure.MultiMachine.json show how to create an unsecured test or production cluster, respectively.

* ClusterConfig.Windows.DevCluster.json and ClusterConfig.Windows.MultiMachine.json show how to create test or production clusters that are secured by using [Windows security](service-fabric-windows-cluster-windows-security.md).

* ClusterConfig.X509.DevCluster.json and ClusterConfig.X509.MultiMachine.json show how to create test or production clusters that are secured by using [X509 certificate-based security](service-fabric-windows-cluster-x509-security.md).

Now let's examine the various sections of a ClusterConfig.json file.

## General cluster configurations
General cluster configurations cover the broad cluster-specific configurations, as shown in the following JSON snippet:

```json
    "name": "SampleCluster",
    "clusterConfigurationVersion": "1.0.0",
    "apiVersion": "01-2017",
```

You can give any friendly name to your Service Fabric cluster by assigning it to the name variable. The clusterConfigurationVersion is the version number of your cluster. Increase it every time you upgrade your Service Fabric cluster. Leave apiVersion set to the default value.

## Nodes on the cluster
You can configure the nodes on your Service Fabric cluster by using the nodes section, as the following snippet shows:
```json
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
```

A Service Fabric cluster must contain at least three nodes. You can add more nodes to this section according to your setup. The following table explains configuration settings for each node:

| **Node configuration** | **Description** |
| --- | --- |
| nodeName |You can give any friendly name to the node. |
| iPAddress |Find out the IP address of your node by opening a command window and typing `ipconfig`. Note the IPV4 address, and assign it to the iPAddress variable. |
| nodeTypeRef |Each node can be assigned a different node type. The [node types](#node-types) are defined in the following section. |
| faultDomain |Fault domains enable cluster administrators to define the physical nodes that might fail at the same time due to shared physical dependencies. |
| upgradeDomain |Upgrade domains describe sets of nodes that are shut down for Service Fabric upgrades at about the same time. You can choose which nodes to assign to which upgrade domains, because they aren't limited by any physical requirements. |

## Cluster properties
The properties section in the ClusterConfig.json is used to configure the cluster as shown:

### Reliability
The concept of reliabilityLevel defines the number of replicas or instances of the Service Fabric system services that can run on the primary nodes of the cluster. It determines the reliability of these services and hence the cluster. The value is calculated by the system at cluster creation and upgrade time.

### Diagnostics
In the diagnosticsStore section, you can configure parameters to enable diagnostics and troubleshooting node or cluster failures, as shown in the following snippet: 

```json
"diagnosticsStore": {
    "metadata":  "Please replace the diagnostics store with an actual file share accessible from all cluster machines.",
    "dataDeletionAgeInDays": "7",
    "storeType": "FileShare",
    "IsEncrypted": "false",
    "connectionstring": "c:\\ProgramData\\SF\\DiagnosticsStore"
}
```

The metadata is a description of your cluster diagnostics and can be set according to your setup. These variables help in collecting ETW trace logs and crash dumps as well as performance counters. For more information on ETW trace logs, see [Tracelog](https://msdn.microsoft.com/library/windows/hardware/ff552994.aspx) and [ETW tracing](https://msdn.microsoft.com/library/ms751538.aspx). All logs, including [crash dumps](https://blogs.technet.microsoft.com/askperf/2008/01/08/understanding-crash-dump-files/) and [performance counters](https://msdn.microsoft.com/library/windows/desktop/aa373083.aspx), can be directed to the connectionString folder on your machine. You also can use AzureStorage to store diagnostics. See the following sample snippet:

```json
"diagnosticsStore": {
    "metadata":  "Please replace the diagnostics store with an actual file share accessible from all cluster machines.",
    "dataDeletionAgeInDays": "7",
    "storeType": "AzureStorage",
    "IsEncrypted": "false",
    "connectionstring": "xstore:DefaultEndpointsProtocol=https;AccountName=[AzureAccountName];AccountKey=[AzureAccountKey]"
}
```

### Security
The security section is necessary for a secure standalone Service Fabric cluster. The following snippet shows a part of this section:

```json
"security": {
    "metadata": "This cluster is secured using X509 certificates.",
    "ClusterCredentialType": "X509",
    "ServerCredentialType": "X509",
    . . .
}
```

The metadata is a description of your secure cluster and can be set according to your setup. The ClusterCredentialType and ServerCredentialType determine the type of security that the cluster and the nodes implement. They can be set to either *X509* for a certificate-based security or *Windows* for Active Directory-based security. The rest of the security section is based on the type of security. For information on how to fill out the rest of the security section, see [Certificates-based security in a standalone cluster](service-fabric-windows-cluster-x509-security.md) or [Windows security in a standalone cluster](service-fabric-windows-cluster-windows-security.md).

### Node types
The nodeTypes section describes the type of nodes that your cluster has. At least one node type must be specified for a cluster, as shown in the following snippet: 

```json
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
```

The name is the friendly name for this particular node type. To create a node of this node type, assign its friendly name to the nodeTypeRef variable for that node, as [previously mentioned](#nodes-on-the-cluster). For each node type, define the connection endpoints that are used. You can choose any port number for these connection endpoints, as long as they don't conflict with any other endpoints in this cluster. In a multinode cluster, there are one or more primary nodes (that is, isPrimary is set to *true*), depending on the [reliabilityLevel](#reliability). To learn more about primary and nonprimary node types, see [Service Fabric cluster capacity planning considerations](service-fabric-cluster-capacity.md) for information on nodeTypes and reliabilityLevel. 

#### Endpoints used to configure the node types
* clientConnectionEndpointPort is the port used by the client to connect to the cluster when client APIs are used. 
* clusterConnectionEndpointPort is the port where the nodes communicate with each other.
* leaseDriverEndpointPort is the port used by the cluster lease driver to find out if the nodes are still active. 
* serviceConnectionEndpointPort is the port used by the applications and services deployed on a node to communicate with the Service Fabric client on that particular node.
* httpGatewayEndpointPort is the port used by Service Fabric Explorer to connect to the cluster.
* ephemeralPorts override the [dynamic ports used by the OS](https://support.microsoft.com/kb/929851). Service Fabric uses a part of these ports as application ports, and the remaining are available for the OS. It also maps this range to the existing range present in the OS, so for all purposes, you can use the ranges given in the sample JSON files. Make sure that the difference between the start and the end ports is at least 255. You might run into conflicts if this difference is too low, because this range is shared with the OS. To see the configured dynamic port range, run `netsh int ipv4 show dynamicport tcp`.
* applicationPorts are the ports that are used by the Service Fabric applications. The application port range should be large enough to cover the endpoint requirement of your applications. This range should be exclusive from the dynamic port range on the machine, that is, the ephemeralPorts range as set in the configuration. Service Fabric uses these ports whenever new ports are required and takes care of opening the firewall for these ports. 
* reverseProxyEndpointPort is an optional reverse proxy endpoint. For more information, see [Service Fabric reverse proxy](service-fabric-reverseproxy.md). 

### Log settings
In the fabricSettings section, you can set the root directories for the Service Fabric data and logs. You can customize these directories only during the initial cluster creation. See the following sample snippet of this section:

```json
"fabricSettings": [{
    "name": "Setup",
    "parameters": [{
        "name": "FabricDataRoot",
        "value": "C:\\ProgramData\\SF"
    }, {
        "name": "FabricLogRoot",
        "value": "C:\\ProgramData\\SF\\Log"
}]
```

We recommend that you use a non-OS drive as the FabricDataRoot and FabricLogRoot. It provides more reliability in avoiding situations when the OS stops responding. If you customize only the data root, the log root is placed one level below the data root.

### Stateful Reliable Services settings
In the KtlLogger section, you can set the global configuration settings for Reliable Services. For more information on these settings, see [Configure Stateful Reliable Services](service-fabric-reliable-services-configuration.md). The following example shows how to change the shared transaction log that gets created to back any reliable collections for stateful services:

```json
"fabricSettings": [{
    "name": "KtlLogger",
    "parameters": [{
        "name": "SharedLogSizeInMB",
        "value": "4096"
    }]
}]
```

### Add-on features
To configure add-on features, configure the apiVersion as 04-2017 or higher, and configure the addonFeatures as shown here:

```json
"apiVersion": "04-2017",
"properties": {
    "addOnFeatures": [
        "DnsService",
        "RepairManager"
    ]
}
```

### Container support
To enable container support for both Windows Server containers and Hyper-V containers for standalone clusters, the DnsService add-on feature must be enabled.

## Next steps
After you have a complete *ClusterConfig.json* file configured according to your standalone cluster setup, you can deploy your cluster. Follow the steps in [Create a standalone Service Fabric cluster](service-fabric-cluster-creation-for-windows-server.md). 

If you have a stand alone cluster deployed, you can also [upgrade the configuration of a standalone cluster](service-fabric-cluster-config-upgrade-windows-server.md). 

Learn how to [visualize your cluster with Service Fabric Explorer](service-fabric-visualizing-your-cluster.md).

