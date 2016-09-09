<properties
   pageTitle="Secure a cluster running on Windows using Windows Security | Microsoft Azure"
   description="Learn how to configure node-to-node and client-to-node security on a standalone cluster running on Windows using Windows Security."
   services="service-fabric"
   documentationCenter=".net"
   authors="rwike77"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="06/14/2016"
   ms.author="ryanwi"/>


# Secure a standalone cluster on Windows using Windows security

To prevent unauthorized access to a Service Fabric cluster you must secure it, especially when it has production workloads running on it. This article describes how to configure node-to-node and client-to-node security using Windows security in the *ClusterConfig.JSON* file and corresponds to the configure security step of [Create a standalone cluster running on Windows](service-fabric-cluster-creation-for-windows-server.md). For more information on how Service Fabric uses Windows Security, see [Cluster security scenarios](service-fabric-cluster-security.md).

>[AZURE.NOTE]
You should consider your security selection for node-to-node security carefully, since there is no cluster upgrade from one security choice to another. Changing the security selection would require a full cluster rebuild.

## Configure Windows security
The sample *ClusterConfig.Windows.JSON* configuration file downloaded with the [Microsoft.Azure.ServiceFabric.WindowsServer.<version>.zip](http://go.microsoft.com/fwlink/?LinkId=730690) standalone cluster package contains a template for configuring Windows security.  Windows security is configured in the **Properties** section:

```
"security": {
            "ClusterCredentialType": "Windows",
            "ServerCredentialType": "Windows",
            "WindowsIdentities": {
		"ClusterIdentity" : "[domain\machinegroup]",
                "ClientIdentities": [{
                    "Identity": "[domain\username]",
                    "IsAdmin": true
                }]
            }
        }
```

|**Configuration Setting**|**Description**|
|-----------------------|--------------------------|
|ClusterCredentialType|Windows Security is enabled by setting the **ClusterCredentialType** parameter to *Windows*.|
|ServerCredentialType|Windows Security for clients is enabled by setting the **ServerCredentialType** parameter to *Windows*. This indicates that the clients of the cluster, and the cluster itself, are running within an Active Directory Domain.|
|WindowsIdentities|Contains the cluster and client identities.|
|ClusterIdentity|Configures node-to-node security. A comma-separated list of group managed service accounts or machine names.|
|ClientIdentities|Configures client-to-node security. An array of client user accounts.|
|Identity|The client identity, a domain user.|
|IsAdmin|True specifies that the domain user has administrator client access, false for user client access.|

[Node to node security](service-fabric-cluster-security.md#node-to-node-security) is configured by setting using **ClusterIdentity**. In order to build trust relationships between nodes, they must be made aware of each other. This can be accomplished in two different ways: Specify the Group Managed Service Account that includes all nodes in the cluster or Specify the domain node identities of all nodes in the cluster. We strongly recommend using the [Group Managed Service Account (gMSA)](https://technet.microsoft.com/library/hh831782.aspx) approach, particularly for larger clusters (more than 10 nodes) or for clusters that are likely to grow or shrink.
This approach allows nodes to be added or removed from the gMSA, without requiring changes to the cluster manifest. This approach does not require the creation of a domain group for which cluster administrators have been granted access rights to add and remove members. For more information, see [Getting Started with Group Managed Service Accounts](http://technet.microsoft.com/library/jj128431.aspx).

[Client to node security](service-fabric-cluster-security.md#client-to-node-security) is configured using **ClientIdentities**. In order to establish trust between a client and the cluster, you must configure the cluster to know which client identities that it can trust. This can be done in two different ways: Specify the domain group users that can connect or specify the domain node users that can connect. Service Fabric supports two different access control types for clients that are connected to a Service Fabric cluster: administrator and user. Access control provides the ability for the cluster administrator to limit access to certain types of cluster operations for different groups of users, making the cluster more secure.  Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.

The following example **security** section configures Windows security and specifies that the machines in *ServiceFabric/clusterA.contoso.com* are part of the cluster and that *CONTOSO\usera* has admin client access:

```
"security": {
    "ClusterCredentialType": "Windows",
    "ServerCredentialType": "Windows",
    "WindowsIdentities": {
		"ClusterIdentity" : "ServiceFabric/clusterA.contoso.com",
        "ClientIdentities": [{
            "Identity": "CONTOSO\\usera",
        "IsAdmin": true
        }]
    }
},
```

## Next steps

After configuring Windows security in the *ClusterConfig.JSON* file, resume the cluster creation process in [Create a standalone cluster running on Windows](service-fabric-cluster-creation-for-windows-server.md).

For more information on how node-to-node security, client-to-node security, and role-based access control, see [Cluster security scenarios](service-fabric-cluster-security.md).

See [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md) for examples of connecting using PowerShell or FabricClient.
