---
title: Scale up an Azure Service Fabric primary node type 
description: Vertically scale your Service Fabric cluster by adding a new node type and removing the previous one.
ms.topic: article
ms.date: 12/11/2020
ms.author: pepogors
ms.topic: how-to
---
# Scale up a Service Fabric cluster primary node type

This article describes how to scale up a Service Fabric cluster primary node type with minimal downtime. The general strategy for upgrading a Service Fabric cluster node type is to:

1. Add a new node type to your Service Fabric cluster, backed by your upgraded (or modified) virtual machine scale set SKU and configuration. This step also involves setting up a new load balancer, subnet, and public IP for the scale set.

1. Once both the original and upgraded scale sets are running side by side, disable the original node instances one at a time so that the system services (or replicas of stateful services) migrate to the new scale set.

1. Verify the cluster and new nodes are healthy, then remove the original scale set (and related resources) and node state for the deleted nodes.

The following will walk you through the process for updating the VM size and operating system of primary node type VMs of a sample cluster of [Bronze durability](service-fabric-cluster-capacity.md#durability-characteristics-of-the-cluster), backed by a single scale set with five nodes. We'll be upgrading the primary node type:

- VM size from *Standard_D2_V2* -> *Standard D4_V2*, and
- VM operating system from *Windows Server 2016 Datacenter with Containers* -> *Windows Server 2019 Datacenter with Containers*.

> [!WARNING]
> Before attempting this procedure on a production cluster, we recommend that you study the sample templates and verify the process against a test cluster. The cluster may also be unavailable for a short period of time.
>
> Do not attempt a primary node type scale up procedure if the cluster status is unhealthy, as this will only destabilize the cluster further.

[Here are the sample templates](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/Primary-NodeType-Scaling-Sample) for Azure resource Manager that we'll use to complete the upgrade scenario. The template changes will be explained below.

## Set up the test cluster

Let's set up the initial Service Fabric test cluster. First, [download](https://github.com/Azure-Samples/service-fabric-cluster-templates/tree/master/Primary-NodeType-Scaling-Sample) the Azure Resource Manager sample templates that we'll use to complete this scenario.

Next, sign in to your Azure account.

```powershell
# Sign in to your Azure account
Login-AzAccount -SubscriptionId "<subscription ID>"
```

The following commands will guide you through generating a new self-signed certificate and deploying the test cluster. If you already have a certificate you'd like to use, skip to [Use an existing certificate to deploy the cluster](#use-an-existing-certificate-to-deploy-the-cluster).

### Generate a self-signed certificate and deploy the cluster

First, assign the variables you'll need for Service Fabric cluster deployment. Adjust the values for `resourceGroupName`,  `certSubjectName`, `parameterFilePath`, and `templateFilePath` for your specific account and environment:

```powershell
# Assign deployment variables
$resourceGroupName = "sftestupgradegroup"
$certOutputFolder = "c:\certificates"
$certPassword = "Password!1" | ConvertTo-SecureString -AsPlainText -Force
$certSubjectName = "sftestupgrade.southcentralus.cloudapp.azure.com"
$templateFilePath = "C:\Initial-TestClusterSetup.json"
$parameterFilePath = "C:\parameters.json"
```

> [!NOTE]
> Ensure that the `certOutputFolder` location exist on your local machine before running the command to deploy a new Service Fabric cluster.

Next open the [*Initial-1NodeType-UnmanagedDisks.parameters.json*](https://github.com/erikadoyle/service-fabric-scripts-and-templates/blob/managed-disks/templates/nodetype-upgrade-no-outage/Initial-1NodeType-UnmanagedDisks.parameters.json) file and adjust the values for `clusterName` and `dnsName` to correspond to the dynamic values you set in PowerShell and save your changes.

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

The operation will return the certificate thumbprint, which you'll use to [connect to the new cluster](#connect-to-the-new-cluster-and-check-health-status) and check its health status. (Skip the following section, which is an alternate approach to cluster deployment.)

### Use an existing certificate to deploy the cluster

You can also use an existing Azure Key Vault certificate  to deploy the test cluster. To do this, you'll need to [obtain references to your Key Vault](#obtain-your-key-vault-references) and certificate thumbprint.

```powershell
# Key Vault variables
$certUrlValue = "https://sftestupgradegroup.vault.azure.net/secrets/sftestupgradegroup20200309235308/dac0e7b7f9d4414984ccaa72bfb2ea39"
$sourceVaultValue = "/subscriptions/########-####-####-####-############/resourceGroups/sftestupgradegroup/providers/Microsoft.KeyVault/vaults/sftestupgradegroup"
$thumb = "BB796AA33BD9767E7DA27FE5182CF8FDEE714A70"
```

Open the [*parameters.json*](https://github.com/erikadoyle/service-fabric-scripts-and-templates/blob/managed-disks/templates/nodetype-upgrade-no-outage/Initial-1NodeType-UnmanagedDisks.parameters.json) file and change the values for `clusterName` to something unique.

Finally, designate a resource group name for the cluster and set the `templateFilePath` and `parameterFilePath` locations:

> [!NOTE]
> The designated resource group must already exist and be located in the same region as your Key Vault.

```powershell
$resourceGroupName = "sftestupgradegroup"
$templateFilePath = "C:\Initial-TestClusterSetup.json"
$parameterFilePath = "C:\parameters.json"
```

Finally, run the following command to deploy the initial test cluster:

```powershell
# Deploy the initial test cluster
New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFilePath `
    -TemplateParameterFile $parameterFilePath `
    -CertificateThumbprint $thumb `
    -CertificateUrlValue $certUrlValue `
    -SourceVaultValue $sourceVaultValue `
    -Verbose
```

### Connect to the new cluster and check health status

Connect to the cluster and ensure that all five of its nodes are healthy (replacing the `clusterName` and `thumb` variables for your cluster):

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

With that, we're ready to begin the upgrade procedure.

## Deploy a new primary node type with upgraded scale set

In order to upgrade, or vertically scale, a node type, we'll need to deploy a new node type with new scale set and supporting resources. The new scale set will be marked as primary (`isPrimary: true`), just like the original scale set. (Unless you're doing a non-primary node type upgrades.) The resources created in the following section will become the new primary node type in your cluster once the scaling operation is complete.

For convenience, the required changes have already been made for you in the *Step1-AddPrimaryNodeType.json* template file.

The following sections will explain the template changes in detail. If you prefer, you can skip the explanation and continue on to the next step of the upgrade procedure.

> [!Note]
> Ensure that you use names that are unique from the original node type, scale set, load balancer, public IP, and subnet of the original primary node type, as these resources will be deleted at a later step in the process.

### Update the cluster template with the upgraded scale set

Here are the section-by-section modifications of the original cluster deployment template for adding a new primary node type and supporting resources.

Once you've implemented all the changes in your template and parameters files, proceed to the next section to acquire your Key Vault references and deploy the updates to your cluster.

#### Create a new subset in the existing virtual network

```json
{
    "name": "[variables('subnet1Name')]",
    "properties": {
        "addressPrefix": "[variables('subnet1Prefix')]"
    }
}
```

#### Create a new public IP with a unique domainNameLabel

```json
{
    "apiVersion": "[variables('publicIPApiVersion')]",
    "type": "Microsoft.Network/publicIPAddresses",
    "name": "[concat(variables('lbIPName'),'-',variables('vmNodeType1Name'))]",
    "location": "[variables('computeLocation')]",
    "properties": {
    "dnsSettings": {
        "domainNameLabel": "[concat(variables('dnsName'),'-','nt2')]"
    },
    "publicIPAllocationMethod": "Dynamic"
    },
    "tags": {
    "resourceType": "Service Fabric",
    "clusterName": "[parameters('clusterName')]"
    }
}
```

#### Create a new load balancer for the public IP
 
```json
"dependsOn": [
    "[concat('Microsoft.Network/publicIPAddresses/',concat(variables('lbIPName'),'-',variables('vmNodeType1Name')))]"
]
```

#### Create a new virtual machine scale set (with upgraded VM and OS SKUs) 

Node Type Ref 
```json
"nodeTypeRef": "[variables('vmNodeType1Name')]"
```

VM SKU
```json
"sku": {
    "name": "[parameters('vmNodeType1Size')]",
    "capacity": "[parameters('nt1InstanceCount')]",
    "tier": "Standard"
}
```

OS SKU 
```json
"imageReference": {
    "publisher": "[parameters('vmImagePublisher1')]",
    "offer": "[parameters('vmImageOffer1')]",
    "sku": "[parameters('vmImageSku1')]",
    "version": "[parameters('vmImageVersion1')]"
}
```

Ensure you include any additional extensions that are required for your workload.

#### Add a new primary node type to the cluster

```json
"name": "[variables('vmNodeType1Name')]",
"applicationPorts": {
    "endPort": "[variables('nt0applicationEndPort')]",
    "startPort": "[variables('nt0applicationStartPort')]"
},
"clientConnectionEndpointPort": "[variables('nt0fabricTcpGatewayPort')]",
"durabilityLevel": "Bronze",
"ephemeralPorts": {
    "endPort": "[variables('nt0ephemeralEndPort')]",
    "startPort": "[variables('nt0ephemeralStartPort')]"
},
"httpGatewayEndpointPort": "[variables('nt0fabricHttpGatewayPort')]",
"isPrimary": true,
"reverseProxyEndpointPort": "[variables('nt0reverseProxyEndpointPort')]",
"vmInstanceCount": "[parameters('nt1InstanceCount')]"
```

Once you've implemented all the changes in your template and parameters files, proceed to the next section to acquire your Key Vault references and deploy the updates to your cluster.

### Obtain your Key Vault references

To deploy the updated configuration, you'll first to obtain several references to your cluster certificate stored in your Key Vault. The easiest way to find these values is through Azure portal. You'll need:

* **The Key Vault URL of your cluster certificate.** From your Key Vault in Azure portal, select **Certificates** > *Your desired certificate* > **Secret Identifier**:

    ```powershell
    $certUrlValue="https://sftestupgradegroup.vault.azure.net/secrets/sftestupgradegroup20200309235308/dac0e7b7f9d4414984ccaa72bfb2ea39"
    ```

* **The thumbprint of your cluster certificate.** (You probably already have this if you [connected to the initial cluster](#connect-to-the-new-cluster-and-check-health-status) to check its health status.) From the same certificate blade (**Certificates** > *Your desired certificate*) in Azure portal, copy **X.509 SHA-1 Thumbprint (in hex)**:

    ```powershell
    $thumb = "BB796AA33BD9767E7DA27FE5182CF8FDEE714A70"
    ```

* **The Resource ID of your Key Vault.** From your Key Vault in Azure portal, select **Properties** > **Resource ID**:

    ```powershell
    $sourceVaultValue = "/subscriptions/########-####-####-####-############/resourceGroups/sftestupgradegroup/providers/Microsoft.KeyVault/vaults/sftestupgradegroup"
    ```

### Deploy the updated template

Adjust the `templateFilePath` as needed and then run the following command:

```powershell
# Deploy the new node type and its resources
$templateFilePath = "C:\Step1-AddPrimaryNodeType.json"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFilePath `
    -TemplateParameterFile $parameterFilePath `
    -CertificateThumbprint $thumb `
    -CertificateUrlValue $certUrlValue `
    -SourceVaultValue $sourceVaultValue `
    -Verbose
```

When the deployment completes, check the cluster health again and ensure all nodes on both node types are healthy.

```powershell
Get-ServiceFabricClusterHealth
```

## Migrate seed nodes to the new node type

We're now ready to update the original node type as non-primary and start disabling its nodes. As the nodes disable, the cluster's system services and seed nodes migrate to the new scale set.

### Unmark the original node type as primary

```json
{
    "isPrimary": false,
}
```

Deploy the template with the update.

```powershell
# deploy the updated template files to the existing resource group
$templateFilePath = "C:\Step2-UnmarkOriginalPrimaryNodeType.json"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFilePath `
    -TemplateParameterFile $parameterFilePath `
    -CertificateThumbprint $thumb `
    -CertificateUrlValue $certUrlValue `
    -SourceVaultValue $sourceVaultValue `
    -Verbose
```

### Disable the nodes in the original node type scale set

```powershell
# Disable the nodes in the original scale set.
$nodeNames = @("_NTvm0_0","_NTvm0_1","_NTvm0_2","_NTvm0_3","_NTvm0_4")

Write-Host "Disabling nodes..."
foreach($name in $nodeNames){
    Disable-ServiceFabricNode -NodeName $name -Intent RemoveNode -Force
}
```

Use Service Fabric Explorer to monitor the migration of seed nodes to the new scale set and the progression of nodes in the original scale set from *Disabling* to *Disabled* status.

:::image type="content" source="./media/upgrade-managed-disks/service-fabric-explorer-node-status.png" alt-text="Service Fabric Explorer showing status of disabled nodes":::

> [!Note]
> It may take some time to complete the disabling operation across all the nodes of the original scale set. To guarantee data consistency, only one seed node can change at a time. Each seed node change requires a cluster update; thus replacing a seed node requires two cluster upgrades (one each for node addition and removal). Upgrading the five seed nodes in this sample scenario will result in ten cluster upgrades.

If your cluster is Bronze durability, wait for all nodes to reach *Disabled* state.

For Silver and Gold durability, some nodes will go into Disabled state, while others might remain in a *Disabling* state. In Service Fabric Explorer, check the **Details** tab of the nodes in Disabling state. If they are all stuck on ensuring quorum for Infrastructure service partitions, then it is safe to continue.

### Stop data on the disabled nodes
 
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

### Remove the original scale set

```powershell
$scaleSetName="nt0vm"
$scaleSetResourceType="Microsoft.Compute/virtualMachineScaleSets"

Remove-AzResource -ResourceName $scaleSetName -ResourceType $scaleSetResourceType -ResourceGroupName $resourceGroupName -Force
```

## Remove the original node type and its resources

> [!Note]
> This step is optional if you're already using a *Standard* SKU public IP and load balancer. In this case you could have multiple scale sets / node types under the same load balancer.

You can now delete the original IP, and load balancer resources. In this step you will also update the DNS name.

```powershell
$lbname="LB-cluster-name-nt1vm"
$lbResourceType="Microsoft.Network/loadBalancers"
$ipResourceType="Microsoft.Network/publicIPAddresses"
$oldPublicIpName="PublicIP-LB-FE-nt1vm"
$newPublicIpName="PublicIP-LB-FE-nt2vm"

$oldprimaryPublicIP = Get-AzPublicIpAddress -Name $oldPublicIpName  -ResourceGroupName $resourceGroupName
$primaryDNSName = $oldprimaryPublicIP.DnsSettings.DomainNameLabel
$primaryDNSFqdn = $oldprimaryPublicIP.DnsSettings.Fqdn

Remove-AzResource -ResourceName $lbname -ResourceType $lbResourceType -ResourceGroupName $resourceGroupName -Force
Remove-AzResource -ResourceName $oldPublicIpName -ResourceType $ipResourceType -ResourceGroupName $resourceGroupName -Force

$PublicIP = Get-AzPublicIpAddress -Name $newPublicIpName  -ResourceGroupName $resourceGroupName
$PublicIP.DnsSettings.DomainNameLabel = $primaryDNSName
$PublicIP.DnsSettings.Fqdn = $primaryDNSFqdn
Set-AzPublicIpAddress -PublicIpAddress $PublicIP
``` 

Next, update the management endpoint on the cluster to reference the new IP.

```json
  "managementEndpoint": "[concat('https://',reference(concat(variables('lbIPName'),'-',variables('vmNodeType1Name'))).dnsSettings.fqdn,':',variables('nt0fabricHttpGatewayPort'))]",
```

### Remove node state from the original node type
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
9. Remove the original node type reference from the Service Fabric resource in the ARM template. 
```json
"name": "[variables('vmNodeType0Name')]",
"applicationPorts": {
    "endPort": "[variables('nt0applicationEndPort')]",
    "startPort": "[variables('nt0applicationStartPort')]"
},
"clientConnectionEndpointPort": "[variables('nt0fabricTcpGatewayPort')]",
"durabilityLevel": "Bronze",
"ephemeralPorts": {
    "endPort": "[variables('nt0ephemeralEndPort')]",
    "startPort": "[variables('nt0ephemeralStartPort')]"
},
"httpGatewayEndpointPort": "[variables('nt0fabricHttpGatewayPort')]",
"isPrimary": true,
"reverseProxyEndpointPort": "[variables('nt0reverseProxyEndpointPort')]",
"vmInstanceCount": "[parameters('nt0InstanceCount')]"
```
Only for Silver and higher durability clusters, update the cluster resource in the template and configure health policies to ignore fabric:/System application health by adding applicationDeltaHealthPolicies under cluster resource properties as given below. The below policy should ignore existing errors but not allow new health errors.
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
}
```
10. Remove all other resources related to the original node type from the ARM template. See [Service Fabric - New Node Type Cluster](https://github.com/Azure-Samples/service-fabric-cluster-templates/blob/master/Primary-NodeType-Scaling-Sample/AzureDeploy-4.json) for a template with all of these original resources removed.

11. Deploy the modified Azure Resource Manager template. ** This step will take a while, usually up to two hours. This upgrade will change settings to the InfrastructureService; therefore, a node restart is needed. In this case, forceRestart is ignored. The parameter upgradeReplicaSetCheckTimeout specifies the maximum time that Service Fabric waits for a partition to be in a safe state, if not already in a safe state. Once safety checks pass for all partitions on a node, Service Fabric proceeds with the upgrade on that node. The value for the parameter upgradeTimeout can be reduced to 6 hours, but for maximal safety 12 hours should be used.
Then validate that the Service Fabric resource in Portal shows as ready. 

```powershell
# deploy the updated template files to the existing resource group
$templateFilePath = "C:\AzureDeploy-4.json"
$parameterFilePath = "C:\AzureDeploy.Parameters.json"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFilePath `
    -TemplateParameterFile $parameterFilePath `
```

The cluster's primary node type has now been upgraded. Verify that any deployed applications function properly and cluster health is ok.

## Next steps
* Learn how to [add a node type to a cluster](virtual-machine-scale-set-scale-node-type-scale-out.md)
* Learn about [application scalability](service-fabric-concepts-scalability.md).
* [Scale an Azure cluster in or out](service-fabric-tutorial-scale-cluster.md).
* [Scale an Azure cluster programmatically](service-fabric-cluster-programmatic-scaling.md) using the fluent Azure compute SDK.
* [Scale a standalone cluster in or out](service-fabric-cluster-windows-server-add-remove-nodes.md).
