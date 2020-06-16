---
title: Remove a node type in Azure Service Fabric | Microsoft Docs
description: Learn how to remove a node type from a Service Fabric cluster running in Azure.
author: inputoutputcode
manager: sridmad
ms.topic: conceptual
ms.date: 02/21/2020
ms.author: chrpap 
---

# How to remove a Service Fabric node type
This article describes how to scale an Azure Service Fabric cluster by removing an existing node type from a cluster. A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Virtual machine scale sets are an Azure compute resource that you use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be managed separately. After creating a Service Fabric cluster, you can scale a cluster horizontally by removing a node type (virtual machine scale set) and all of it's nodes.  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

> [!WARNING]
> Using this approach to remove a node type from a production cluster is
> not recommended to be used on a frequent basis. It is a dangerous command as it deletes the virtual machine scale set 
> resource behind the node type. 

## Durability characteristics
Safety is prioritized over speed when using Remove-AzServiceFabricNodeType. The node type must be Silver or Gold [durability level](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster), because:
- Bronze does not give you any guarantees about saving state information.
- Silver and Gold durability trap any changes to the scale set.
- Gold also gives you control over the Azure updates underneath scale set.

Service Fabric "orchestrates" underlying changes and updates so that data is not lost. However, when you remove a node type with Bronze durability, you may lose state information. If you're removing a primary node type and your application is stateless, Bronze is acceptable. When you run stateful workloads in production, the minimum configuration should be Silver. Similarly, for production scenarios the primary node type should always be Silver or Gold.

### More about Bronze durability

When removing a node type that is Bronze, all the nodes in the node type go down immediately. Service Fabric doesn't trap any Bronze nodes scale set updates, thus all the VMs go down immediately. If you had anything stateful on those nodes, the data is lost. Now, even if you were stateless, all the nodes in the Service Fabric participate in the ring, so an entire neighborhood may be lost, which might destabilize the cluster itself.

## Remove a node type

1. Please take care of this pre-requisites before you start the process.

    - The cluster is healthy.
    - There will still be sufficient capacity after the node type is removed, eg. number of nodes to place required replica count.

2. Move all services that have placement constraints to use node type off the node type.

    - Modify Application / Service Manifest to no longer reference the node type.
    - Deploy the change.

    Then validate that:
    - All the services modified above are no longer running on the Node belonging to the node type.
    - All the services are healthy.

3. Unmark the node-type as non-primary (Skip for non-primary node types)

    - Locate the Azure Resource Manager template used for deployment.
    - Find the section related to the node type in the Service Fabric section.
    - Change isPrimary property to false. ** Do not remove the section related to the node type in this task.
    - Deploy the modified Azure Resource Manager template. ** Depending on the cluster configuration this step may take a while.
    
    Then validate that:
    - Service Fabric Section in Portal indicates cluster is ready.
    - Cluster is healthy.
    - None of the nodes belonging to the node type are marked as Seed Node.

4. Disable data for the node type.

    Connect to the cluster using PowerShell and then run the following step.
    
    ```powershell
    $nodeType = "" # specify the name of node type
    $nodes = Get-ServiceFabricNode
    
    foreach($node in $nodes)
    {
      if ($node.NodeType -eq $nodeType)
      {
        $node.NodeName
     
        Disable-ServiceFabricNode -Intent RemoveNode -NodeName $node.NodeName -Force
      }
    }
    ```

    - For bronze durability, wait for all nodes to get to disabled state
    - For silver and gold durability, some nodes will go in to disabled and the rest will be in disabling state. Check the details tab of the nodes in disabling state, if they are all stuck on ensuring quorum for Infrastructure service partitions, then it is safe to continue.

5. Stop data for the node type.

    Connect to the cluster using PowerShell and then run the following step.
    
    ```powershell
    foreach($node in $nodes)
    {
      if ($node.NodeType -eq $nodeType)
      {
        $node.NodeName
     
        Start-ServiceFabricNodeTransition -Stop -OperationId (New-Guid) -NodeInstanceId $node.NodeInstanceId -NodeName $node.NodeName -StopDurationInSeconds 10000
      }
    }
    ```
    
    Wait till all the nodes for node type are marked Down.
    
6. Remove data for the node type.

    Connect to the cluster using PowerShell and then run the following step.
    
    ```powershell
    foreach($node in $nodes)
    {
      if ($node.NodeType -eq $nodeType)
      {
        $node.NodeName
     
        Remove-ServiceFabricNodeState -NodeName $node.NodeName -Force
      }
    }
    ```

    Wait till all the nodes are removed from the cluster. The nodes should not be displayed in SFX.

7. Remove node type from Service Fabric section.

    - Locate the Azure Resource Manager template used for deployment.
    - Find the section related to the node type in the Service Fabric section.
    - Remove the section corresponding to the node type.
    - Only for Silver and higher durability clusters, update the cluster resource in the template and configure health policies to ignore fabric:/System application health by adding `applicationDeltaHealthPolicies` under cluster resource `properties` as given below. The below policy should ignore existing errors but not allow new health errors. 
 
 
     ```json
    "upgradeDescription":  
    { 
      "forceRestart": false, 
      "upgradeReplicaSetCheckTimeout": "10675199.02:48:05.4775807", 
      "healthCheckWaitDuration": "00:05:00", 
      "healthCheckStableDuration": "00:05:00", 
      "healthCheckRetryTimeout": "00:45:00", 
      "upgradeTimeout": "12:00:00", 
      "upgradeDomainTimeout": "02:00:00", 
      "healthPolicy": { 
        "maxPercentUnhealthyNodes": 100, 
        "maxPercentUnhealthyApplications": 100 
      }, 
      "deltaHealthPolicy":  
      { 
        "maxPercentDeltaUnhealthyNodes": 0, 
        "maxPercentUpgradeDomainDeltaUnhealthyNodes": 0, 
        "maxPercentDeltaUnhealthyApplications": 0, 
        "applicationDeltaHealthPolicies":  
        { 
            "fabric:/System":  
            { 
                "defaultServiceTypeDeltaHealthPolicy":  
                { 
                        "maxPercentDeltaUnhealthyServices": 0 
                } 
            } 
        } 
      } 
    },
    ```

    - Deploy the modified Azure Resource Manager template. ** This step will take a while, usually up to two hours. This upgrade will change settings to the InfrastructureService, therefore a node restart is needed. In the this case `forceRestart` is ignored. 
    The parameter `upgradeReplicaSetCheckTimeout` specifies the maximum time that Service Fabric waits for a partition to be in a safe state, if not already in a safe state. Once safety checks pass for all partitions on a node, Service Fabric proceeds with the upgrade on that node.
    The value for the parameter `upgradeTimeout` can be reduced to 6 hours, but for maximal safety 12 hours should be used.

    Then validate that:
    - Service Fabric Resource in portal shows ready.

8. Remove all reference to the resources relating to the node type.

    - Locate the Azure Resource Manager template used for deployment.
    - Remove the virtual machine scale set and other resources related to the node type from the template.
    - Deploy the changes.

    Then:
    - Wait for deployment to complete.

## Next steps
- Learn more about cluster [durability characteristics](https://docs.microsoft.com/azure/service-fabric/service-fabric-cluster-capacity#the-durability-characteristics-of-the-cluster).
- Learn more about [node types and Virtual Machine Scale Sets](service-fabric-cluster-nodetypes.md).
- Learn more about [Service Fabric cluster scaling](service-fabric-cluster-scaling.md).
