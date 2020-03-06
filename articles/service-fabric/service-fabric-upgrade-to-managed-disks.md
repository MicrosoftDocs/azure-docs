---
title: Upgrade cluster nodes to use Azure managed disks 
description: Here's how to upgrade an existing Service Fabric cluster to use Azure managed disks with little or no downtime of your cluster.
ms.topic: how-to
ms.date: 3/01/2020
---
# Upgrade cluster nodes to use Azure managed disks

[Azure managed disks](../virtual-machines/windows/managed-disks-overview.md) are the recommended disk storage offering for use with Azure virtual machines for persistent storage of data. You can improve the resiliency of your Service Fabric workloads by upgrading the virtual machine scale sets that underlie your node types to use managed disks. Here's how to upgrade an existing Service Fabric cluster to use Azure managed disks with little or no downtime of your cluster.

The general strategy for upgrading a Service Fabric cluster node to use managed disks is to:

1. Deploy an otherwise duplicate virtual machine scale set of that node type, but with the [managedDisk](https://docs.microsoft.com/en-us/azure/templates/microsoft.compute/2019-07-01/virtualmachinescalesets/virtualmachines#ManagedDiskParameters) object added to the `osDisk` section of the virtual machine scale set deployment template. The new scale set should bind to the same load balancer / IP as the original, so that your customers don't experience a service outage during the migration.

2. Once both the original and upgraded scale sets are running side by side, disable the original node instances one at a time, as the system services (or replicas of stateful services) are created on the new scale set.

3. Verify the cluster and new nodes are healthy, then remove the original scale set and node state for the deleted nodes.

This article will walk you through the steps of upgrading the primary node type of an example cluster to use managed disks, while avoiding any cluster downtime (see note below). The initial state of the test cluster consists of one node type of Silver durability, backed by a single scale set.

> [!NOTE]
> You will experience an outage with this procedure if you have dependencies on the cluster DNS (such as when accessing [Service Fabric Explorer](service-fabric-visualizing-your-cluster.md)). Architectural [best practice for front-end services](https://docs.microsoft.com/azure/architecture/microservices/design/gateway) is to have a gateway or load balancer in front of your node types to make node switching possible without an outage.

Here's the [step-by-step templates](TBD_REPO) for Azure resource manager that we'll use to complete the scenario. The template changes will be explained in [Deploy an upgraded scale set for the primary node type](#deploy-an-upgraded-scale-set-for-the-primary-node-type)  below.

## Set up the test cluster

Let's set up the initial Service Fabric cluster consisting of a single, primary node type of [Silver durability](service-fabric-cluster-capacity.md#the-durability-characteristics-of-the-cluster) backed by a single scale set.

First, [download](TBD_REPO) the Azure resource manager sample templates that we'll use to complete this scenario.

Next, we'll deploy the template for the initial cluster. Update the `clusterName` and `dnsName` (and any other desired) parameters in the *Step0-Deploy-2NodeTypes-2ScaleSets.parameters.json* file. specifying your values for  `resourceGroupName`,  `CertSubjectName`, `parameterFilePath`, and `templateFilePath`:

```powershell
# Sign in to your Azure account
Login-AzAccount -SubscriptionId <your subscription ID>

# Deploy the Service Fabric test cluster
$resourceGroupLocation="southcentralus"
$resourceGroupName="sftestclustergroup"
$certOutputFolder="c:\mycertificates"
$certPassword="Password!1" | ConvertTo-SecureString -AsPlainText -Force
$certSubjectName="sftestcluster.southcentralus.cloudapp.azure.com"

$templateFilePath="C:\service-fabric-managed-disk-upgrade\Step0-Deploy-2NodeTypes-2ScaleSets.json"
$parameterFilePath="C:\service-fabric-managed-disk-upgrade\Step0-Deploy-2NodeTypes-2ScaleSets.parameters.json"

New-AzServiceFabricCluster -ResourceGroupName $resourceGroupName -Location $resourceGroupLocation
-CertificateOutputFolder $certOutputFolder -CertificatePassword $certPassword -CertificateSubjectName $certSubjectName -TemplateFile $templateFilePath -ParameterFile $parameterFilePath
```

Install the certificate for the cluster and retrieve the thumbprint (replacing `FilePath` as needed).

```powershell
PS C:\mycertificates> Import-PfxCertificate -FilePath .\sftestcluster20190130193456.pfx -CertStoreLocation Cert:\CurrentUser\My -Password (ConvertTo-SecureString Password!1 -AsPlainText -Force)
```

Connect to the cluster and check health (replacing the `clusterName` and `thumb` variables for your cluster):

```powershell
# Connect to the cluster
$clusterName= "sftestcluster.southcentralus.cloudapp.azure.com:19000"
$thumb="F361720F4BD5449F6F083DDE99DC51A86985B25B"

Connect-ServiceFabricCluster -ConnectionEndpoint $clusterName -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCertThumbprint $thumb  `
    -FindType FindByThumbprint `
    -FindValue $thumb `
    -StoreLocation CurrentUser `
    -StoreName My

# Check cluster health
Get-ServiceFabricClusterHealth
```

With that, we're ready to begin the upgrade procedure.

## Deploy an upgraded scale set for the primary node type

In order to upgrade (or *vertically scale*) a node type, we'll need to deploy a copy of that node type's virtual machine scale set, which is otherwise identical to the original scale set (including reference to the same `nodeTypeRef`, `loadBalancerBackendAddressPools`, and `subnet`, and marked as `primary: true`) except that it includes the desired upgrade/changes.

> [!NOTE]
> To be extra cautious when migrating a production cluster, you may choose to first deploy a (non-upgraded) copy of the primary node scale set, to first verify successful seed node migration (without the added variable of migrating to a slightly different scale set). From there, you could then proceed to deploying an upgraded scale set, and continue the following steps (with the added task of removing the additional scale set at the end).

To do this, add the following changes to your original cluster deployment for the new scale set:

- subnet name
- load balancer NAT pool
- managed disk

```powershell
# Deploy a new scale set into the primary node type.  
New-AzResourceGroupDeployment -ResourceGroupName $groupname -TemplateParameterFile "C:\1NodeType-2ScaleSets-Parameters.json" `
    -TemplateFile "C:\1NodeType-2ScaleSets.json" -Verbose 

```

## Migrate seed nodes to the new scale set

```powershell
# Disable the nodes in the original scale set.
$nodeNames = @("_NTvm1_0","_NTvm1_1","_NTvm1_2","_NTvm1_3","_NTvm1_4")

Write-Host "Disabling nodes..."
foreach($name in $nodeNames){
    Disable-ServiceFabricNode -NodeName $name -Intent RemoveNode -Force
} 
```

## Remove the original scale set

```powershell
# Remove the original scale set
$scaleSetName="NTvm1"
Remove-AzVmss -ResourceGroupName $groupname -VMScaleSetName $scaleSetName -Force
Write-Host "Removed scale set $scaleSetName" 

# Remove node states for the deleted scale set
foreach($name in $nodeNames){
    Remove-ServiceFabricNodeState -NodeName $name -TimeoutSec 300 -Force
    Write-Host "Removed node state for node $name"
}

```

## Next steps

Learn how to:

* [Scale up a Service Fabric cluster primary node type](service-fabric-scale-up-node-type.md)

* [Convert a scale set template to use managed disks](virtual-machine-scale-sets-convert-template-to-md.md)

* [Remove a Service Fabric node type](service-fabric-how-to-remove-node-type.md)

See also:

* [Sample: Upgrade cluster nodes to use Azure managed disks](TBD_REPO)

* [Vertical scaling considerations](service-fabric-best-practices-capacity-scaling.md#vertical-scaling-considerations)