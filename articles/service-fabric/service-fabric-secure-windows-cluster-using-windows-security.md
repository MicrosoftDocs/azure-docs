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
   ms.date="06/02/2016"
   ms.author="ryanwi"/>


# Create an Azure Service Fabric cluster on-premises or in the cloud

A Service Fabric cluster is a resource that you own. To prevent unauthorized access to the resource you must secure it, especially when it has production workloads running on it. This article describes how to configure node-to-node and client-to-node security using Windows security in the *ClusterConfig.JSON* file and corresponds to the configure security step of [Create a standalone cluster running on Windows](service-fabric-cluster-creation-for-windows-server.md). For more information on how Service Fabric uses Windows Security, see [Cluster security scenarios](service-fabric-cluster-security.md).

The sample *ClusterConfig.Windows.JSON* configuration file downloaded with the standalone cluster package contains a template for configuring Windows security.  Security is configured in the Properties section:

'''
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
'''

|**Configuration Setting**|**Description**|
|-----------------------|--------------------------|
|ClusterCredentialType|Windows Security is enabled by setting the **ClusterCredentialType** parameter to *Windows*.|
|ServerCredentialType|Windows Security for clients is enabled by setting the **ServerCredentialType** parameter to *Windows*. This indicates that the clients of the cluster, and the cluster itself, are running within an Active Directory Domain.|
|WindowsIdentities||
|ClusterIdentity|In order to build trust relationships between nodes, they must be made aware of each other. This can be accomplished in two different ways: Specify the Group Managed Service Account that includes all nodes in the cluster or Specify the domain node identities of all nodes in the cluster. We strongly recommend using the [Group Managed Service Account (gMSA)](http://technet.microsoft.com/library/jj128431.aspx) approach, particularly for larger clusters (more than 10 nodes) or for clusters that are likely to grow or shrink.
This approach allows nodes to be added or removed from the gMSA, without requiring changes to the cluster manifest. This approach does not require the creation of a domain group for which cluster administrators have been granted access rights to add and remove members. For more information, see [Getting Started with Group Managed Service Accounts](http://technet.microsoft.com/library/jj128431.aspx).|
|ClientIdentities|In order to establish trust between a client and the cluster, you must configure the cluster to know which client identities that it can trust. This can be done in two different ways: Specify the domain group users that can connect or specify the domain node users that can connect. Service Fabric supports two different access control types for clients that are connected to a Service Fabric cluster: administrator and user. Access control provides the ability for the cluster administrator to limit access to certain types of cluster operations for different groups of users, making the cluster more secure.|
|Identity||
|IsAdmin||

## Next steps

After configuring Windows security in the *ClusterConfig.JSON* file, resume the cluster creation process in [Create a standalone cluster running on Windows](service-fabric-cluster-creation-for-windows-server.md).
