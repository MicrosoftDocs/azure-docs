---
title: Scale up an Azure Service Fabric node type 
description: Learn how to scale a Service Fabric cluster by adding a Virtual Machine Scale Set.

ms.topic: article
ms.date: 02/13/2019
---
# Scale up a Service Fabric cluster primary node type
This article describes how to scale up a Service Fabric cluster primary node type by increasing the virtual machine resources. A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Virtual machine scale sets are an Azure compute resource that you use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be managed separately. After creating a Service Fabric cluster, you can scale a cluster node type vertically (change the resources of the nodes) or upgrade the operating system of the node type VMs.  You can scale the cluster at any time, even when workloads are running on the cluster.  As the cluster scales, your applications automatically scale as well.

> [!WARNING]
> Do not attempt a primary node type scale up procedure if the cluster status is unhealthy, as this will only destabilize the cluster further.
>

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Process to upgrade the size and operating system of the primary node type VMs
Here is the process for updating the VM size and operating system of the primary node type VMs.  After the upgrade, the primary node type VMs are size Standard D4_V2 and running Windows Server 2016 Datacenter with Containers.

> [!WARNING]
> Before attempting this procedure on a production cluster, we recommend that you study the sample templates and verify the process against a test cluster. The cluster is also unavailable for a time. You can NOT make changes to multiple VMSS declared as the same NodeType in parallel; you will need to perform separated deployment operations to apply changes to each NodeType VMSS individually.

1. Deploy the initial cluster with two node types and two scale sets (one scale set per node type) using these sample [template](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-2ScaleSets.json) and [parameters](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-2ScaleSets.parameters.json) files.  Both scale sets are size Standard D2_V2 and running Windows Server 2012 R2 Datacenter.  Wait for the cluster to complete the baseline upgrade.   
2. Optional- deploy a stateful sample to the cluster.
3. After deciding to upgrade the primary node type VMs, add a new scale set to the primary node type using these sample [template](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-3ScaleSets.json) and [parameters](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-3ScaleSets.parameters.json) files so the primary node type now has two scale sets.  System services and user applications are able to migrate between VMs in the two different scale sets.  The new scale set VMs are size Standard D4_V2 and run Windows Server 2016 Datacenter with Containers.  A new load balancer and public IP address are also added with the new scale set.  
    To find the new scale set in the template, search for the "Microsoft.Compute/virtualMachineScaleSets" resource named by the *vmNodeType2Name* parameter.  The new scale set is added to the primary node type using the properties->virtualMachineProfile->extensionProfile->extensions->properties->settings->nodeTypeRef setting.
4. Check the cluster health and verify all the nodes are healthy.
5. Disable the nodes in the old scale set of the primary node type with the intent to remove node. You can disable all at once and the operations are queued. Wait until all nodes are disabled, which may take some time.  As the older nodes in the node type are disabled, the system services and seed nodes migrate to the VMs of the new scale set in the primary node type.
6. Remove the older scale set from the primary node type. (After the nodes are disabled as in step 5, in the virtual machine scale set blade in the Azure portal, deallocate the nodes from the old node type one by one.)
7. Remove the load balancer associated with the old scale set. The cluster is unavailable while the new public IP address and load balancer are configured for the new scale set.  
8. Store DNS settings of the public IP address associated with the old primary node type scale set in a variable and remove that public IP address.
9. Replace the DNS settings of the public IP address associated with the new primary node type scale set with the DNS settings of the deleted public IP address.  The cluster is now reachable again.
10. Remove the node state of the nodes from the cluster.  If the durability level of the old scale set was silver or gold, this step is done by the system automatically.
11. If you deployed the stateful application in a previous step, verify that the application is functional.

## Set up the test cluster

Begin by downloading the two sets of files we'll need for this tutorial, the before [template]() and [parameters]() and the after [template]() and [parameters]().

Next, sign in to your Azure account.

```powershell
# sign in to your Azure account and select your subscription
Login-AzAccount -SubscriptionId "<your subscription ID>"
```

This tutorial walks through the scenario of creating a self-signed certificate. To use an existing certificate from Azure Key Vault, skip the step below and instead mirror the steps in [using an existing certificate to deploy the cluster](https://docs.microsoft.com/azure/service-fabric/upgrade-managed-disks#use-an-existing-certificate-to-deploy-the-cluster).

### Generate a self-signed certificate and deploy the cluster

First, assign the variables you'll need for Service Fabric cluster deployment. Adjust the values for `resourceGroupName`,  `certSubjectName`, `parameterFilePath`, and `templateFilePath` for your specific account and environment:

```powershell
# Assign deployment variables
$resourceGroupName = "sftestupgradegroup"
$certOutputFolder = "c:\certificates"
$certPassword = "Password!1" | ConvertTo-SecureString -AsPlainText -Force
$certSubjectName = "sftestupgrade.southcentralus.cloudapp.azure.com"
$templateFilePath = "C:\Deploy-2NodeTypes-2ScaleSets.json"
$parameterFilePath = "C:\Deploy-2NodeTypes-2ScaleSets.parameters.json"
```

> [!NOTE]
> Ensure that the `certOutputFolder` location exist on your local machine before running the command to deploy a new Service Fabric cluster.

Next open the *Deploy-2NodeTypes-2ScaleSets.parameters.json* file and adjust the values for `clusterName` and `dnsName` to correspond to the dynamic values you set in PowerShell and save your changes.

Then deploy the Service Fabric test cluster:

```powershell
# Deploy the initial test cluster
New-AzServiceFabricCluster `
    -ResourceGroupName $resourceGroupName `
    -CertificateOutputFolder $certOutputFolder `
    -CertificatePassword $certPassword `
    -CertificateSubjectName $certSubjectName `
    -TemplateFile $templateFilePath `
    -ParameterFile $parameterFilePath
```

Once the deployment is complete, locate the *.pfx* file (`$certPfx`) on your local machine and import it to your certificate store:

```powershell
cd c:\certificates
$certPfx = ".\sftestupgradegroup20200312121003.pfx"

Import-PfxCertificate `
     -FilePath $certPfx `
     -CertStoreLocation Cert:\CurrentUser\My `
     -Password (ConvertTo-SecureString Password!1 -AsPlainText -Force)
```

The operation will return the certificate thumbprint, which you'll use to connect to the new cluster and check its health status.

### Connect to the new cluster and check health status

Connect to the cluster and ensure that all of its nodes are healthy (replacing the `clusterName` and `thumb` variables for your cluster):

```powershell
# Connect to the cluster
$clusterName = "sftestupgrade.southcentralus.cloudapp.azure.com:19000"
$thumb = "BB796AA33BD9767E7DA27FE5182CF8FDEE714A70"

Connect-ServiceFabricCluster `
    -ConnectionEndpoint $clusterName `
    -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCertThumbprint $thumb  `
    -FindType FindByThumbprint `
    -FindValue $thumb `
    -StoreLocation CurrentUser `
    -StoreName My

# Check cluster health
Get-ServiceFabricClusterHealth
```

We are ready to begin the upgrade procedure.

## Upgrade the primary node type VMs

After deciding to upgrade the primary node type VMs, add a new scale set to the primary node type such that the primary node type now has two scale sets. A sample [template](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-3ScaleSets.json) and [parameters](https://github.com/Azure/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-3ScaleSets.parameters.json) files have been provided to show the necessary changes. The new scale set's VMs are size Standard D4_V2 and run Windows Server 2016 Datacenter with Containers. A new load balancer and public IP address are also added with the new scale set. 

To find the new scale set in the template, search for the "Microsoft.Compute/virtualMachineScaleSets" resource named by the vmNodeType2Name parameter. The new scale set is added to the primary node type using the properties->virtualMachineProfile->extensionProfile->extensions->properties->settings->nodeTypeRef setting.

### Deploy the updated template

Adjust the `parameterFilePath` and `templateFilePath` as needed and then run the following command:

```powershell
# Deploy the new scale set into the primary node type along with a new load balancer and public IP
$templateFilePath = "C:\Deploy-2NodeTypes-3ScaleSets.json"
$parameterFilePath = "C:\Deploy-2NodeTypes-3ScaleSets.parameters.json"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFilePath `
    -TemplateParameterFile $parameterFilePath `
    -CertificateThumbprint $thumb `
    -CertificateUrlValue $certUrlValue `
    -SourceVaultValue $sourceVaultValue `
    -Verbose
```

When the deployment completes, check the cluster health again and ensure all nodes (on the original and on the new scale set) are healthy.

```powershell
Get-ServiceFabricClusterHealth
```

## Migrate nodes to the new scale set

We're now ready to start disabling the nodes of the original scale set. As these nodes become disabled, the system services and seed nodes migrate to the VMs of the new scale set because it is also marked as the primary node type.

For scaling up non-primary node types, in this step you would modify the service placement constraint to include the new virtual machine scale set/node type and then reduce the old virtual machine scale set instance count to zero, one node at a time (to ensure node removal doesn't impact cluster reliability).

```powershell
# Disable the nodes in the original scale set.
$nodeNames = @("_NTvm1_0","_NTvm1_1","_NTvm1_2","_NTvm1_3","_NTvm1_4")

Write-Host "Disabling nodes..."
foreach($name in $nodeNames){
    Disable-ServiceFabricNode -NodeName $name -Intent RemoveNode -Force
}
```

Use Service Fabric Explorer to monitor the migration of seed nodes to the new scale set and the progression of nodes in the original scale set from *Disabling* to *Disabled* status.

> [!NOTE]
> It may take some time to complete the disabling operation across all the nodes of the original scale set. To guarantee data consistency, only one seed node can change at a time. Each seed node change requires a cluster update; thus replacing a seed node requires two cluster upgrades (one each for node addition and removal). Upgrading the five seed nodes in this sample scenario will result in ten cluster upgrades.

## Remove the original scale set

Once the disabling operation is complete, remove the scale set.

```powershell
# Remove the original scale set
$scaleSetName = "NTvm1"

Remove-AzVmss `
    -ResourceGroupName $resourceGroupName `
    -VMScaleSetName $scaleSetName `
    -Force

Write-Host "Removed scale set $scaleSetName"
```

In Service Fabric Explorer, the removed nodes (and thus the *Cluster Health State*) will now appear in *Error* state.

## Remove the old load balancer and update DNS settings

Now, we can remove the resources related to the old primary node type, beginning with the load balancer and the old public IP. 

```powershell
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
```

Next, we update the DNS settings of the new public IP to mirror the settings from the old primary node type's public IP.

```powershell
# Replace DNS settings of Public IP address related to new Primary Node Type with DNS settings of Public IP address related to old Primary Node Type
$PublicIP = Get-AzPublicIpAddress -Name $newPublicIpName  -ResourceGroupName $groupname
$PublicIP.DnsSettings.DomainNameLabel = $primaryDNSName
$PublicIP.DnsSettings.Fqdn = $primaryDNSFqdn
Set-AzPublicIpAddress -PublicIpAddress $PublicIP
```

Once more, check the cluster health

```powershell
# Check the cluster health
Get-ServiceFabricClusterHealth
```

Finally, remove the node state for each of the related nodes. If durability level of the old scale set was silver or gold, this will occur automatically.

```powershell
# Remove node state for the deleted nodes.
foreach($name in $nodeNames){
    # Remove the node from the cluster
    Remove-ServiceFabricNodeState -NodeName $name -TimeoutSec 300 -Force
    Write-Host "Removed node state for node $name"
}
```

The cluster's primary node type has now been upgraded. Verify that any deployed applications function properly and cluster health is ok.

## Next steps
* Learn how to [add a node type to a cluster](virtual-machine-scale-set-scale-node-type-scale-out.md)
* Learn about [application scalability](service-fabric-concepts-scalability.md).
* [Scale an Azure cluster in or out](service-fabric-tutorial-scale-cluster.md).
* [Scale an Azure cluster programmatically](service-fabric-cluster-programmatic-scaling.md) using the fluent Azure compute SDK.
* [Scale a standalone cluster in or out](service-fabric-cluster-windows-server-add-remove-nodes.md).

