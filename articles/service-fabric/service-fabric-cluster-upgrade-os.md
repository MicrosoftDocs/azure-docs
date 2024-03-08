---
title: Upgrade Linux OS for Azure Service Fabric
description: Learn about options for migrating your Azure Service Fabric cluster to another Linux operating system.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
ms.custom: devx-track-azurepowershell
services: service-fabric
ms.date: 07/14/2022
---

# Upgrade Linux OS for Azure Service Fabric

This document describes how to migrate your Azure Service Fabric for Linux cluster from Ubuntu version 18.04 LTS to 20.04 LTS. Each operating system (OS) version requires a different Service Fabric runtime package. This article describes the steps required to facilitate a smooth migration to the newer version.

> [!NOTE]
> U18.04 reached end-of-life in June 2023. Starting with the 10.0CU1 release, Service Fabric runtime will discontinue support for U18.04. Service Fabric will no longer provide updates or patches at that time.

## Approach to migration

The general approach to the migration follows these steps:

1. Switch the Service Fabric cluster Azure Resource Manager resource `vmImage` to `Ubuntu20_04`. This setting pulls future code upgrades for this OS version. This temporary OS mismatch against existing node types blocks automatic code upgrade rollouts to ensure safe rollover.

   > [!TIP]
   > Avoid issuing manual Service Fabric cluster code upgrades during the OS migration. Doing so may cause the old node type nodes to enter a state that requires human intervention.

1. For each node type in the cluster, create another node type that targets the Ubuntu 20.04 OS image for the underlying Virtual Machine Scale Set. Each new node type assumes the role of its old counterpart.

   * A new primary node type has to be created to replace the old node type marked as `isPrimary: true`.
   * For each non-primary node type, these nodes types are marked `isPrimary: false`.
   * Ensure after the new target OS node type is created that existing workloads continue to function correctly. If issues are observed, address the changes required in the app or pre-installed machine packages before proceeding with removing the old node type.

1. Mark the old primary node type `isPrimary: false`. This setting results in a long-running set of upgrades to transition all seed nodes.
1. (For Bronze durability node types ONLY): Connect to the cluster by using [sfctl](service-fabric-sfctl.md), [PowerShell](/powershell/module/ServiceFabric), or [FabricClient](/dotnet/api/system.fabric.fabricclient). Disable all nodes in the old node type.
1. Remove the old node types.

[Az PowerShell](/powershell/azure/) generates a new DNS name for the added node type. Redirect external traffic to this endpoint.

## Ease of use steps for non-production clusters

This procedure demonstrates how to quickly prototype the node type migration by using Az PowerShell cmdlets in a TEST-only cluster. For production clusters facing real business traffic, we expect that the same steps are done by issuing Resource Manager upgrades, to preserve repeatability and a consistent declarative source of truth.

1. Update the `vmImage` setting on the Service Fabric cluster resource using [Update-AzServiceFabricVmImage](/powershell/module/az.servicefabric/update-azservicefabricvmimage):

    ```powershell
    # Replace subscriptionId, resourceGroup, clusterName with ones corresponding to your cluster.
    $subscriptionId="cea219db-0593-4b27-8bfa-a703332bf433"
    Login-AzAccount; Select-AzSubscription -SubscriptionId $subscriptionId

    $resourceGroup="Group1"
    $clusterName="Contoso01SFCluster"
    # Update cluster vmImage to target OS. This registers the SF runtime package type that is supplied for upgrades.
    Update-AzServiceFabricVmImage -ResourceGroupName $resourceGroup -ClusterName $clusterName -VmImage Ubuntu20_04
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

3. Update the old primary node type to non-primary in order to roll over seed nodes and system services to the new node type:

    ```powershell
    # Query to ensure background upgrades are done.
    (Get-AzServiceFabricCluster -ResourceGroupName $resourceGroup).ClusterState

    # Update old nodetype to isPrimary: false
    $oldNodeTypeName="nt1"
    Update-AzServiceFabricNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName -IsPrimaryNodeType $false -NodeType $oldNodeTypeName -Verbose

    # Ensure node type is showing isPrimary: False before proceeding.
    Get-AzServiceFabricCluster -ResourceGroupName $resourceGroup
    ```

    Your output should look like this example:

    ```output
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

4. To remove Bronze durability node types, disable the nodes before proceeding to remove the old node type. Connect to a cluster node by using *ssh*. Run the following commands:

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

5. Remove the previous node type by removing the Service Fabric cluster resource node type attribute and decommissioning the associated virtual machine scale set and networking resources:

    ```powershell
    $resourceGroup="Group1"
    $clusterName="Contoso01SFCluster"
    $oldNodeTypeName="nt1"

    # Remove the Service Fabric node type, associated virtual machine scale set resource, and any trailing networking resources that are no longer used. 
    Remove-AzServiceFabricNodeType -ResourceGroupName $resourceGroup -ClusterName $clusterName -NodeType $oldNodeTypeName
    ```

    > [!NOTE]
    > In some cases this command might hit the following error:
    >
    > ```powershell
    > Remove-AzServiceFabricNodeType : Code: ClusterUpgradeFailed, Message: Long running operation failed with status 'Failed'
    > ```
    >
    > You might find by using Service Fabric Explorer (SFX) the InfrastructureService that the removed node type is in an error state. Retry the removal.

Confirm that workloads have been successfully migrated to the new node types and old node types have been purged. Then the cluster can proceed with Service Fabric runtime code version and configuration upgrades.

## Next steps

* [Manage Service Fabric upgrades](service-fabric-cluster-upgrade-version-azure.md)
* Customize your [Service Fabric cluster settings](service-fabric-cluster-fabric-settings.md)
* Learn more about cluster [durability characteristics](./service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster).
* Learn more about [node types and Virtual Machine Scale Sets](service-fabric-cluster-nodetypes.md).
* Learn more about [Service Fabric cluster scaling](service-fabric-cluster-scaling.md).
* [Scale your cluster in and out](service-fabric-cluster-scale-in-out.md)
* [Remove a node type in Azure Service Fabric](service-fabric-how-to-remove-node-type.md)
