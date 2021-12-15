---
title: Upgrading Linux OS for Azure Service Fabric
description: Learn about options for migrating your Azure Service Fabric cluster to another Linux OS
ms.topic: conceptual
ms.date: 09/14/2021
---

# Upgrading Linux OS for Azure Service Fabric

This document describes the guide to migrate your Azure Service Fabric for Linux cluster from Ubuntu version 16.04 LTS to 18.04 LTS. Each OS (operating system) version requires a distinct SF runtime package, which requires the steps described in this document to facilitate a smooth migration.

## Overview

The general approach is to:

1. Switch the Service Fabric cluster ARM (Azure Resource Manager) resource "vmImage" to "Ubuntu18_04" to pull future code upgrades for this OS version. This temporary OS mismatch against existing node types will block automatic code upgrade rollouts to ensure safe rollover.

    * Avoid issuing manual SF cluster code upgrades during the OS migration. Doing so may cause the old node type nodes to enter a state that will require human intervention.

2. For each node type in the cluster, create another node type targeting the Ubuntu 18.04 OS image for the underlying Virtual Machine Scale Set. Each new node type will assume the role of its old counterpart.

    * A new primary node type will have to be created to replace the old node type marked as "isPrimary": true.
    
    * For each additional non-primary node type, these nodes types will similarly be marked "isPrimary": false.

    * Ensure after the new target OS node type is created that existing workloads continue to function correctly. If issues are observed, address the changes required in the app or pre-installed machine packages before proceeding with removing the old node type.
3. Mark the old primary node type "isPrimary": false. This will result in a long-running set of upgrades to transition all seed nodes.
4. (For Bronze durability node types ONLY): Connect to the cluster via [sfctl](service-fabric-sfctl.md) / [PowerShell](/powershell/module/ServiceFabric) / [FabricClient](/dotnet/api/system.fabric.fabricclient) and disable all nodes in the old node type.
5. Remove the old node types.

> [!NOTE]
> Az PowerShell generates a new dns name for the added node type so external traffic will have to be redirected to this endpoint.


## Ease of use steps for non-production clusters

> [!NOTE]
> The steps below demonstrate how to quickly prototype the node type migration via Az PowerShell cmdlets in a TEST-only cluster. For production clusters facing real business traffic, the same steps are expected to be done by issuing ARM upgrades, to preserve replayability & a consistent declarative source of truth.

1. Update vmImage setting on Service Fabric cluster resource using [Update-AzServiceFabricVmImage](/powershell/module/az.servicefabric/update-azservicefabricvmimage):

    [Azure PowerShell](/powershell/azure/install-az-ps):
    ```powershell
    # Replace subscriptionId, resourceGroup, clusterName with ones corresponding to your cluster.
    $subscriptionId="cea219db-0593-4b27-8bfa-a703332bf433"
    Login-AzAccount; Select-AzSubscription -SubscriptionId $subscriptionId

    $resourceGroup="Group1"
    $clusterName="Contoso01SFCluster"
    # Update cluster vmImage to target OS. This registers the SF runtime package type that is supplied for upgrades.
    Update-AzServiceFabricVmImage -ResourceGroupName $resourceGroup -ClusterName $clusterName -VmImage Ubuntu18_04
    ```

2. Add new node type counterpart for each of the existing node types:

    ```powershell
    $nodeTypeName="nt1u18"
    # You can customize this to fetch a password from a secure store.
    $securePassword = ConvertTo-SecureString -String 'Yourpassword123!@#' -AsPlainText -Force

    # Ensure last upgrade is done - Ready means the next command can be issued.
    (Get-AzServiceFabricCluster -ResourceGroupName $resourceGroup).ClusterState

    # Add new primary node type. Omit the IsPrimaryNodeType parameter for non-primary node types.
    Add-AzServiceFabricNodeType -ResourceGroupName $resourceGroup  -ClusterName $clusterName -NodeType $nodeTypeName -Capacity 5 -VmUserName testuser -VmPassword $securePassword -DurabilityLevel Silver -Verbose -VMImageSku 18.04-LTS -IsPrimaryNodeType $true

    # Redirect traffic to new node type dns
    # dns-Contoso01SFCluster-nt1u18.westus2.cloudapp.azure.com
    ```

3. Update old primary node type to non-primary in order to roll over seed nodes and system services to the new node type:

    ```powershell
    # Query to ensure background upgrades are done.
    (Get-AzServiceFabricCluster -ResourceGroupName $resourceGroup).ClusterState

    # Update old nodetype to isPrimary: false
    $oldNodeTypeName="nt1"
    Update-AzServiceFabricNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName -IsPrimaryNodeType $false -NodeType $oldNodeTypeName -Verbose

    # Ensure node type is showing isPrimary: False before proceeding.
    Get-AzServiceFabricCluster -ResourceGroupName $resourceGroup
    ```

    Example output:
    ```
    NodeTypes :
              NodeTypeDescription :
                  Name : nt1
                  PlacementProperties :
                  Capacities :
                  ClientConnectionEndpointPort : 19000
                  HttpGatewayEndpointPort : 19080
                  DurabilityLevel : Bronze
                  ApplicationPorts :
                      StartPort : 20000
                      EndPort : 30000
                  EphemeralPorts :
                      StartPort : 49152
                      EndPort : 65534
                  IsPrimary : False
                  VmInstanceCount : 5
                  ReverseProxyEndpointPort :
              NodeTypeDescription :
                  Name : nt1u18
                  PlacementProperties :
                  Capacities :
                  ClientConnectionEndpointPort : 19000
                  HttpGatewayEndpointPort : 19080
                  DurabilityLevel : Silver
                  ApplicationPorts :
                      StartPort : 20000
                      EndPort : 30000
                  EphemeralPorts :
                      StartPort : 49152
                      EndPort : 65534
                  IsPrimary : True
                  VmInstanceCount : 5
                  ReverseProxyEndpointPort :
    ```

4. To remove Bronze durability node types, first disable the nodes before proceeding to remove the old node type. Connect via *ssh* to a cluster node and run the following commands:

    ```bash
    # as root user:

    # install jq tool to automatically parse JSON responses
    apt-get install jq -fy

    # retrieve the thumbprint to be used for establishing a fabric client
    dataroot=$(cat /etc/servicefabric/FabricDataRoot)
    nodename=_nt1_0
    cat $dataroot/$nodename/Fabric/ClusterManifest.current.xml | grep ClientCertThumbprints
    # 0777FE1A43E306F332D96DA339EF6834D0E4A453

    # verify node count
    sfctl cluster select --endpoint https://Contoso01SFCluster.westus2.cloudapp.azure.com:19080 --pem /var/lib/waagent/0777FE1A43E306F332D96DA339EF6834D0E4A453.pem --no-verify

    # sample command to list all nodes
    sfctl node list

    # for each node part of the node type to be removed, disable the node:
    nodeTypeBeingDisabled=nt1
    nodes=$(sfctl node list | jq --arg nodeTypeBeingDisabled "$nodeTypeBeingDisabled" '.items[] | select(.type==$nodeTypeBeingDisabled) | .name' | sed s/\"//g)
    echo $nodes
    for n in $nodes; do echo "Disabling $n"; sfctl node disable --node-name $n --deactivation-intent RemoveNode --timeout 300; done
    ```

5. Remove the previous node type by removing the SF cluster resource node type attribute and decommissioning the associated virtual machine scale set & networking resources.

    ```powershell
    $resourceGroup="Group1"
    $clusterName="Contoso01SFCluster"
    $oldNodeTypeName="nt1"

    # Remove the Service Fabric node type, associated virtual machine scale set resource, and any trailing networking resources that are no longer used. 
    Remove-AzServiceFabricNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName -NodeType $oldNodeTypeName
    ```

    > [!NOTE]
    > In some cases this may hit the below error. In such case you may find through Service Fabric Explorer (SFX) the InfrastructureService for the removed node type is in error state. To resolve this, retry the removal.
    ```
    Remove-AzServiceFabricNodeType : Code: ClusterUpgradeFailed, Message: Long running operation failed with status 'Failed'
    ```

Once it has been confirmed workloads have been successfully migrated to the new node types and old node types have been purged, the cluster is clear to proceed with subsequent Service Fabric runtime code version & configuration upgrades.

## Next steps

* [Manage Service Fabric upgrades](service-fabric-cluster-upgrade-version-azure.md)
* Customize your [Service Fabric cluster settings](service-fabric-cluster-fabric-settings.md)
* Learn more about cluster [durability characteristics](./service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster).
* Learn more about [node types and Virtual Machine Scale Sets](service-fabric-cluster-nodetypes.md).
* Learn more about [Service Fabric cluster scaling](service-fabric-cluster-scaling.md).
* [Scale your cluster in and out](service-fabric-cluster-scale-in-out.md)
* [Remove a node type in Azure Service Fabric](service-fabric-how-to-remove-node-type.md)

