---
title: Scale up an Azure Service Fabric node type | Microsoft Docs
description: Learn how to scale a Service Fabric cluster by adding a Virtual Machine Scale Set.
services: service-fabric
documentationcenter: .net
author: aljo-microsoft
manager: chackdan
editor: ''

ms.assetid: 5441e7e0-d842-4398-b060-8c9d34b07c48
ms.service: service-fabric
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: NA
ms.workload: NA
ms.date: 02/13/2019
ms.author: aljo

---
# Scale up a Service Fabric cluster primary node type
This article describes how to scale up a Service Fabric cluster primary node type by increasing the virtual machine resources. A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Virtual machine scale sets are an Azure compute resource that you use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be managed separately. After creating a Service Fabric cluster, you can scale a cluster node type vertically (change the resources of the nodes) or upgrade the operating system of the node type VMs.  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

> [!WARNING]
> Do not start to change the primary nodetype VM SKU, if the cluster health is unhealthy. If the cluster health is unhealthy, you will only destabilize the cluster further, if you try to change the VM SKU.
>
> We recommend that you do not change the VM SKU of a scale set/node type unless it is running at [Silver durability or greater](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster). Changing VM SKU Size is a data-destructive in-place infrastructure operation. Without some ability to delay or monitor this change, it is possible that the operation can cause data loss for stateful services or cause other unforeseen operational issues, even for stateless workloads. This means your primary node type, which is running stateful service fabric system services, or any node type that is running your stateful application work loads.
>


[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Upgrade the size and operating system of the primary node type VMs
Here is the process for updating the VM size and operating system of the primary node type VMs.  After the upgrade, the primary node type VMs are size Standard D4_V2 and running Windows Server 2016 Datacenter with Containers.

> [!WARNING]
> Before attempting this procedure on a production cluster, we recommend that you study the sample templates and verify the process against a test cluster. The cluster is also unavailable for a time. You can NOT make changes to multiple VMSS declared as the same NodeType in parallel; you will need to perform separated deployment operations to apply changes to each NodeType VMSS individually.

1. Deploy the initial cluster with two node types and two scale sets (one scale set per node type) using these sample [template](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-2ScaleSets.json) and [parameters](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-2ScaleSets.parameters.json) files.  Both scale sets are size Standard D2_V2 and running Windows Server 2012 R2 Datacenter.  Wait for the cluster to complete the baseline upgrade.   
2. Optional- deploy a stateful sample to the cluster.
3. After deciding to upgrade the primary node type VMs, add a new scale set to the primary node type using these sample [template](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-3ScaleSets.json) and [parameters](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-3ScaleSets.parameters.json) files so the primary node type now has two scale sets.  System services and user applications are able to migrate between VMs in the two different scale sets.  The new scale set VMs are size Standard D4_V2 and run Windows Server 2016 Datacenter with Containers.  A new load balancer and public IP address are also added with the new scale set.  
    To find the new scale set in the template, search for the "Microsoft.Compute/virtualMachineScaleSets" resource named by the *vmNodeType2Name* parameter.  The new scale set is added to the primary node type using the properties->virtualMachineProfile->extensionProfile->extensions->properties->settings->nodeTypeRef setting.
4. Check the cluster health and verify all the nodes are healthy.
5. Disable the nodes in the old scale set of the primary node type with the intent to remove node. You can disable all at once and the operations are queued. Wait until all nodes are disabled, which may take some time.  As the older nodes in the node type are disabled, the system services and seed nodes migrate to the VMs of the new scale set in the primary node type.
6. Remove the older scale set from the primary node type.
7. Remove the load balancer associated with the old scale set. The cluster is unavailable while the new public IP address and load balancer are configured for the new scale set.  
8. Store DNS settings of the public IP address associated with the old primary node type scale set in a variable and remove that public IP address.
9. Replace the DNS settings of the public IP address associated with the new primary node type scale set with the DNS settings of the deleted public IP address.  The cluster is now reachable again.
10. Remove the node state of the nodes from the cluster.  If the durability level of the old scale set was silver or gold, this step is done by the system automatically.
11. If you deployed the stateful application in a previous step, verify that the application is functional.

```powershell
# Variables.
$groupname = "sfupgradetestgroup"
$clusterloc="southcentralus"  
$subscriptionID="<your subscription ID>"

# sign in to your Azure account and select your subscription
Login-AzAccount -SubscriptionId $subscriptionID 

# Create a new resource group for your deployment and give it a name and a location.
New-AzResourceGroup -Name $groupname -Location $clusterloc

# Deploy the two node type cluster.
New-AzResourceGroupDeployment -ResourceGroupName $groupname -TemplateParameterFile "C:\temp\cluster\Deploy-2NodeTypes-2ScaleSets.parameters.json" `
    -TemplateFile "C:\temp\cluster\Deploy-2NodeTypes-2ScaleSets.json" -Verbose

# Connect to the cluster and check the cluster health.
$ClusterName= "sfupgradetest.southcentralus.cloudapp.azure.com:19000"
$thumb="F361720F4BD5449F6F083DDE99DC51A86985B25B"

Connect-ServiceFabricCluster -ConnectionEndpoint $ClusterName -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCertThumbprint $thumb  `
    -FindType FindByThumbprint `
    -FindValue $thumb `
    -StoreLocation CurrentUser `
    -StoreName My 

Get-ServiceFabricClusterHealth

# Deploy a new scale set into the primary node type.  Create a new load balancer and public IP address for the new scale set.
New-AzResourceGroupDeployment -ResourceGroupName $groupname -TemplateParameterFile "C:\temp\cluster\Deploy-2NodeTypes-3ScaleSets.parameters.json" `
    -TemplateFile "C:\temp\cluster\Deploy-2NodeTypes-3ScaleSets.json" -Verbose

# Check the cluster health again. All 15 nodes should be healthy.
Get-ServiceFabricClusterHealth

# Disable the nodes in the original scale set.
$nodeNames = @("_NTvm1_0","_NTvm1_1","_NTvm1_2","_NTvm1_3","_NTvm1_4")

Write-Host "Disabling nodes..."
foreach($name in $nodeNames){
    Disable-ServiceFabricNode -NodeName $name -Intent RemoveNode -Force
}

Write-Host "Checking node status..."
foreach($name in $nodeNames){
 
    $state = Get-ServiceFabricNode -NodeName $name 

    $loopTimeout = 50

    do{
        Start-Sleep 5
        $loopTimeout -= 1
        $state = Get-ServiceFabricNode -NodeName $name
        Write-Host "$name state: " $state.NodeDeactivationInfo.Status
    }

    while (($state.NodeDeactivationInfo.Status -ne "Completed") -and ($loopTimeout -ne 0))
    

    if ($state.NodeStatus -ne [System.Fabric.Query.NodeStatus]::Disabled)
    {
        Write-Error "$name node deactivation failed with state" $state.NodeStatus
        exit
    }
}

# Remove the scale set
$scaleSetName="NTvm1"
Remove-AzVmss -ResourceGroupName $groupname -VMScaleSetName $scaleSetName -Force
Write-Host "Removed scale set $scaleSetName"

$lbname="LB-sfupgradetest-NTvm1"
$oldPublicIpName="PublicIP-LB-FE-0"
$newPublicIpName="PublicIP-LB-FE-2"

# Store DNS settings of public IP address related to old Primary NodeType into variable 
$oldprimaryPublicIP = Get-AzPublicIpAddress -Name $oldPublicIpName  -ResourceGroupName $groupname

$primaryDNSName = $oldprimaryPublicIP.DnsSettings.DomainNameLabel

$primaryDNSFqdn = $oldprimaryPublicIP.DnsSettings.Fqdn

# Remove Load Balancer related to old Primary NodeType. This will cause a brief period of downtime for the cluster
Remove-AzLoadBalancer -Name $lbname -ResourceGroupName $groupname -Force

# Remove the old public IP
Remove-AzPublicIpAddress -Name $oldPublicIpName -ResourceGroupName $groupname -Force

# Replace DNS settings of Public IP address related to new Primary Node Type with DNS settings of Public IP address related to old Primary Node Type
$PublicIP = Get-AzPublicIpAddress -Name $newPublicIpName  -ResourceGroupName $groupname
$PublicIP.DnsSettings.DomainNameLabel = $primaryDNSName
$PublicIP.DnsSettings.Fqdn = $primaryDNSFqdn
Set-AzPublicIpAddress -PublicIpAddress $PublicIP

# Check the cluster health
Get-ServiceFabricClusterHealth

# Remove node state for the deleted nodes.
foreach($name in $nodeNames){
    # Remove the node from the cluster
    Remove-ServiceFabricNodeState -NodeName $name -TimeoutSec 300 -Force
    Write-Host "Removed node state for node $name"
}
```

## Next steps
* Learn how to [add a node type to a cluster](virtual-machine-scale-set-scale-node-type-scale-out.md)
* Learn about [application scalability](service-fabric-concepts-scalability.md).
* [Scale an Azure cluster in or out](service-fabric-tutorial-scale-cluster.md).
* [Scale an Azure cluster programmatically](service-fabric-cluster-programmatic-scaling.md) using the fluent Azure compute SDK.
* [Scale a standalone cluster in or out](service-fabric-cluster-windows-server-add-remove-nodes.md).

