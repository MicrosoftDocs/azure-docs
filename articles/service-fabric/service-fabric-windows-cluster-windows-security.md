---
title: Secure a cluster running on Windows by using Windows security | Microsoft Docs
description: Learn how to configure node-to-node and client-to-node security on a standalone cluster running on Windows by using Windows security.
services: service-fabric
documentationcenter: .net
author: dkkapur
manager: chackdan
editor: ''

ms.assetid: ce3bf686-ffc4-452f-b15a-3c812aa9e672
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: conceptual
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 08/24/2017
ms.author: dekapur

---
# Secure a standalone cluster on Windows by using Windows security
To prevent unauthorized access to a Service Fabric cluster, you must secure the cluster. Security is especially important when the cluster runs production workloads. This article describes how to configure node-to-node and client-to-node security by using Windows security in the *ClusterConfig.JSON* file.  The process corresponds to the configure security step of [Create a standalone cluster running on Windows](service-fabric-cluster-creation-for-windows-server.md). For more information about how Service Fabric uses Windows security, see [Cluster security scenarios](service-fabric-cluster-security.md).

> [!NOTE]
> You should consider the selection of node-to-node security carefully because there is no cluster upgrade from one security choice to another. To change the security selection, you have to rebuild the full cluster.
>
>

## Configure Windows security using gMSA  
The sample *ClusterConfig.gMSA.Windows.MultiMachine.JSON* configuration file downloaded with the [Microsoft.Azure.ServiceFabric.WindowsServer.\<version>.zip](https://go.microsoft.com/fwlink/?LinkId=730690) standalone cluster package contains a template for configuring Windows security using [Group Managed Service Account (gMSA)](https://technet.microsoft.com/library/hh831782.aspx):  

```
"security": {
    "ClusterCredentialType": "Windows",
    "ServerCredentialType": "Windows",
    "WindowsIdentities": {  
        "ClustergMSAIdentity": "[gMSA Identity]",
        "ClusterSPN": "[Registered SPN for the gMSA account]",
        "ClientIdentities": [
            {
                "Identity": "domain\\username",
                "IsAdmin": true
            }
        ]
    }
}
```

| **Configuration setting** | **Description** |
| --- | --- |
| ClusterCredentialType |Set to *Windows* to enable Windows security for node-node communication.  | 
| ServerCredentialType |Set to *Windows* to enable Windows security for client-node communication. |
| WindowsIdentities |Contains the cluster and client identities. |
| ClustergMSAIdentity |Configures node-to-node security. A group managed service account. |
| ClusterSPN |Registered SPN for gMSA account|
| ClientIdentities |Configures client-to-node security. An array of client user accounts. |
| Identity |Add the domain user, domain\username, for the client identity. |
| IsAdmin |Set to true to specify that the domain user has administrator client access or false for user client access. |

> [!NOTE]
> ClustergMSAIdentity value be in format "mysfgmsa@mydomain".

[Node to node security](service-fabric-cluster-security.md#node-to-node-security) is configured by setting **ClustergMSAIdentity** when service fabric needs to run under gMSA. In order to build trust relationships between nodes, they must be made aware of each other. This can be accomplished in two different ways: Specify the Group Managed Service Account that includes all nodes in the cluster or Specify the domain machine group that includes all nodes in the cluster. We strongly recommend using the [Group Managed Service Account (gMSA)](https://technet.microsoft.com/library/hh831782.aspx) approach, particularly for larger clusters (more than 10 nodes) or for clusters that are likely to grow or shrink.  
This approach does not require the creation of a domain group for which cluster administrators have been granted access rights to add and remove members. These accounts are also useful for automatic password management. For more information, see [Getting Started with Group Managed Service Accounts](https://technet.microsoft.com/library/jj128431.aspx).  
 
[Client to node security](service-fabric-cluster-security.md#client-to-node-security) is configured using **ClientIdentities**. In order to establish trust between a client and the cluster, you must configure the cluster to know which client identities that it can trust. This can be done in two different ways: Specify the domain group users that can connect or specify the domain node users that can connect. Service Fabric supports two different access control types for clients that are connected to a Service Fabric cluster: administrator and user. Access control provides the ability for the cluster administrator to limit access to certain types of cluster operations for different groups of users, making the cluster more secure.  Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services. For more information on access controls, see [Role based access control for Service Fabric clients](service-fabric-cluster-security-roles.md).  
 
The following example **security** section configures Windows security using gMSA and specifies that the machines in *ServiceFabric.clusterA.contoso.com* gMSA are part of the cluster and that *CONTOSO\usera* has admin client access:  
  
```
"security": {
    "ClusterCredentialType": "Windows",
    "ServerCredentialType": "Windows",
    "WindowsIdentities": {
        "ClustergMSAIdentity" : "ServiceFabric.clusterA.contoso.com",
        "ClusterSPN" : "http/servicefabric/clusterA.contoso.com",
        "ClientIdentities": [{
            "Identity": "CONTOSO\\usera",
            "IsAdmin": true
        }]
    }
}
```
  
## Configure Windows security using a machine group  
This model is being deprecated. The recommendation is to use gMSA as detailed above. The sample *ClusterConfig.Windows.MultiMachine.JSON* configuration file downloaded with the [Microsoft.Azure.ServiceFabric.WindowsServer.\<version>.zip](https://go.microsoft.com/fwlink/?LinkId=730690) standalone cluster package contains a template for configuring Windows security.  Windows security is configured in the **Properties** section: 

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

| **Configuration setting** | **Description** |
| --- | --- |
| ClusterCredentialType |Set to *Windows* to enable Windows security for node-node communication.  |
| ServerCredentialType |Set to *Windows* to enable Windows security for client-node communication. |
| WindowsIdentities |Contains the cluster and client identities. |
| ClusterIdentity |Use a machine group name, domain\machinegroup, to configure node-to-node security. |
| ClientIdentities |Configures client-to-node security. An array of client user accounts. |  
| Identity |Add the domain user, domain\username, for the client identity. |  
| IsAdmin |Set to true to specify that the domain user has administrator client access or false for user client access. |  

[Node to node security](service-fabric-cluster-security.md#node-to-node-security) is configured by setting using **ClusterIdentity** if you want to use a machine group within an Active Directory Domain. For more information, see [Create a Machine Group in Active Directory](https://msdn.microsoft.com/library/aa545347(v=cs.70).aspx).

[Client-to-node security](service-fabric-cluster-security.md#client-to-node-security) is configured by using **ClientIdentities**. To establish trust between a client and the cluster, you must configure the cluster to know the client identities that the cluster can trust. You can establish trust in two different ways:

- Specify the domain group users that can connect.
- Specify the domain node users that can connect.

Service Fabric supports two different access control types for clients that are connected to a Service Fabric cluster: administrator and user. Access control enables the cluster administrator to limit access to certain types of cluster operations for different groups of users, which makes the cluster more secure.  Administrators have full access to management capabilities (including read/write capabilities). Users, by default, have only read access to management capabilities (for example, query capabilities), and the ability to resolve applications and services.  

The following example **security** section configures Windows security, specifies that the machines in *ServiceFabric/clusterA.contoso.com* are part of the cluster, and specifies that *CONTOSO\usera* has admin client access:

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

> [!NOTE]
> Service Fabric should not be deployed on a domain controller. Make sure that ClusterConfig.json does not include the IP address of the domain controller when using a machine group or group Managed Service Account (gMSA).
>
>

## Next steps
After configuring Windows security in the *ClusterConfig.JSON* file, resume the cluster creation process in [Create a standalone cluster running on Windows](service-fabric-cluster-creation-for-windows-server.md).

For more information about how node-to-node security, client-to-node security, and role-based access control, see [Cluster security scenarios](service-fabric-cluster-security.md).

See [Connect to a secure cluster](service-fabric-connect-to-secure-cluster.md) for examples of connecting by using PowerShell or FabricClient.
