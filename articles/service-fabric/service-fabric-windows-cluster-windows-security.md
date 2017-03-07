---
title: Secure a cluster running on Windows using Windows Security | Microsoft Docs
description: Learn how to configure node-to-node and client-to-node security on a standalone cluster running on Windows using Windows security.
services: service-fabric
documentationcenter: .net
author: rwike77
manager: timlt
editor: ''

ms.assetid: ce3bf686-ffc4-452f-b15a-3c812aa9e672
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 01/17/2017
ms.author: ryanwi

---
# Secure a standalone cluster on Windows using Windows security
To prevent unauthorized access to a Service Fabric cluster, you must secure the cluster. Security is especially important when the cluster runs production workloads. This article describes how to configure node-to-node and client-to-node security by using Windows security in the *ClusterConfig.JSON* file. The process corresponds to the configure security step of [Create a standalone cluster running on Windows](service-fabric-cluster-creation-for-windows-server.md). For more information about how Service Fabric uses Windows Security, see [Cluster security scenarios](service-fabric-cluster-security.md).

> [!NOTE]
> You should consider the selection of node-to-node security carefully because there is no cluster upgrade from one security choice to another. To change the security selection, you have to rebuild the full cluster.
> 
> 

## Configure Windows security  
The *ClusterConfig.Windows.JSON* sample configuration file that's downloaded with the [Microsoft.Azure.ServiceFabric.WindowsServer.<version>.zip](http://go.microsoft.com/fwlink/?LinkId=730690) standalone cluster package contains a template to configure Windows security. Windows security is configured in the **Properties** section: 

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
| ClusterCredentialType |Set to *Windows* to enable Windows security. | 
| ServerCredentialType |Set to *Windows* to enable Windows security for clients.<br /><br />This indicates that the clients of the cluster and the cluster itself are running within an Active Directory domain. |  
| WindowsIdentities |Contains the cluster and client identities. |  
| ClusterIdentity |Use a machine group name, domain\machinegroup, to configure node-to-node security. |  
| ClientIdentities |Configures client-to-node security. An array of client user accounts. |  
| Identity |Add the domain user, domain\username, for the client identity. |  
| IsAdmin |Set to true to specify that the domain user has administrator client access or false for user client access. |  
  
[Node-to-node security](service-fabric-cluster-security.md#node-to-node-security) is configured by using **ClusterIdentity**. Nodes must be aware of each other to build trust relationships between them. To create awareness, create a domain group that includes all nodes in the cluster. This group name should be specified in **ClusterIdentity**. For more information, see [Create a Group in Active Directory](https://msdn.microsoft.com/library/aa545347(v=cs.70).aspx).  
    
[Client-to-node security](service-fabric-cluster-security.md#client-to-node-security) is configured by using **ClientIdentities**. To establish trust between a client and the cluster, you must configure the cluster to know the client identities that the cluster can trust. This can be done in two different ways

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

