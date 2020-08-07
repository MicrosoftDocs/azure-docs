---
title: Scale up an Azure Service Fabric primary node type 
description: Learn how to scale a Service Fabric cluster by adding a Node Type.

ms.topic: article
ms.date: 08/06/2020
ms.author: pepogors
---
# Scale up a Service Fabric cluster primary node type
This article describes how to scale up a Service Fabric cluster primary node type by adding an additional node type to the cluster. A Service Fabric cluster is a network-connected set of virtual or physical machines into which your microservices are deployed and managed. A machine or VM that's part of a cluster is called a node. Virtual machine scale sets are an Azure compute resource that you use to deploy and manage a collection of virtual machines as a set. Every node type that is defined in an Azure cluster is [set up as a separate scale set](service-fabric-cluster-nodetypes.md). Each node type can then be managed separately.

The sample templates in the following tutorial can be found here: [Service Fabric primary node type scaling templates]

> [!WARNING]
> Do not attempt a primary node type scale up procedure if the cluster status is unhealthy, as this will only destabilize the cluster further.
>

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Process to upgrade the size and operating system of the primary node type
The following is the process for updating the VM size and operating system of the primary node type VMs.  After the upgrade, the primary node type VMs are size Standard D4_V2 and running Windows Server 2019 Datacenter with Containers.

> [!WARNING]
> Before attempting this procedure on a production cluster, we recommend that you study the sample templates and verify the process against a test cluster. The cluster may also be unavailable for a short period of time. 

### Deploy the initial Service Fabric cluster 
If you want to follow along with the sample, deploy the initial cluster with a single primary node type, and a single scale set [Service Fabric - Initial Cluster](https://TODO). You may skip this step if you have an existing Service Fabric cluster already deployed. 

1. Login to your Azure account. 
```powershell
# sign in to your Azure account and select your subscription
Login-AzAccount -SubscriptionId "<your subscription ID>"
```
2. Create a new resource group. 
```powershell
# create a resource group for your cluster deployment
$resourceGroupName = "myResourceGroup"
$location = "WestUS"

New-AzResourceGroup `
    -Name $resourceGroupName
    -Location $location
```
3. Fill in the parameter values in the template files. 
4. Deploy the cluster to the resource group created in step 2. 
```powershell
# deploy the template files to the resource group created above
$templateFilePath = "C:\AzureDeploy-Start.json"
$parameterFilePath = "C:\AzureDeploy.Parameters.json"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFilePath `
    -TemplateParameterFile $parameterFilePath `
```

## Add a new primary node type to the cluster
> [!Note]
> The resources created in the following steps will become the new primary node type in your cluster once the scaling operation is complete. Ensure that you use names that are unique from the initial Subnet, Public IP, Load Balancer, Virtual Machine Scale Set, and Node Type. 

> [!Note]
> If you are already using a Standard SKU Public IP, and Standard SKU LB you may not have to create new networking resources. 

You can find a template with all of the following steps completed here: [Service Fabric - New Node Type Cluster]("https://todo"). The following steps contain partial resource snippets that highlight the changes in the new resources.  

1. Create a new Subnet in your existing Virtual Network.
```json
{
    "name": "[variables('subnet1Name')]",
    "properties": {
        "addressPrefix": "[variables('subnet1Prefix')]"
    }
}
```
2. Create a new Public IP resource with a unique domainNameLabel. 
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
3. Create a new Load Balancer resource which depends on the Public IP created above. 
```json
"dependsOn": [
    "[concat('Microsoft.Network/publicIPAddresses/',concat(variables('lbIPName'),'-',variables('vmNodeType1Name')))]"
]
```
4. Create a new Virtual Machine Scale Set that uses the new VM SKU, and OS SKU that you would to like to scale up to. 

Node Type Ref 
```json
"nodeTypeRef": "[variables('vmNodeType1Name')]",
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
},
```
5. Add a new node type to the cluster, which references the Virtual Machine Scale Set that was created above. The **isPrimary** property on this node type should be set to true. 
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
6. Deploy the updated ARM template. 
```powershell
# deploy the updated template files to the existing resource group
$templateFilePath = "C:\AzureDeploy-Step2.json"
$parameterFilePath = "C:\AzureDeploy.Parameters.json"

New-AzResourceGroupDeployment `
    -ResourceGroupName $resourceGroupName `
    -TemplateFile $templateFilePath `
    -TemplateParameterFile $parameterFilePath `
```

The Service Fabric cluster will now have two node types when the deployment is completed. 

### Remove the existing node type 
Once the resources have finished deploying, you can begin to disable the nodes in the original primary node type. As the nodes are disabled, the system services will migrate to the new primary node type that had been deployed in the step above.

1. Disable the nodes in node type 0. 
```powershell
Connect-ServiceFabricCluster -ConnectionEndpoint $ClusterConnectionEndpoint `
    -KeepAliveIntervalInSec 10 `
    -X509Credential `
    -ServerCertThumbprint $thumb  `
    -FindType FindByThumbprint `
    -FindValue $thumb `
    -StoreLocation CurrentUser `
    -StoreName My 

Write-Host "Connected to cluster"

$nodeNames = @("_nt1vm_0", "_nt1vm_1", "_nt1vm_2", "_nt1vm_3", "_nt1vm_4")

Write-Host "Disabling nodes..."
foreach($name in $nodeNames) {
    Disable-ServiceFabricNode -NodeName $name -Intent RemoveNode -Force
}
```
Once the nodes are all disabled, the system services will be running on the new primary node type that had been added to the cluster. 

> [!Note]
> This step may take a while to complete. 

2. Remove node state from node type 0.
```powershell
Write-Host "Removing node state..."
foreach($name in $nodeNames) {
    Remove-ServiceFabricNodeState -NodeName $node.NodeName -Force
}
```
3. Remove the original node type from the Service Fabric resource in the ARM template.

'''json
   {
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
          }
'''

4. Once the node state has been removed, you can delete the original IP, Load Balancer, and virtual machine scale set resources. In this step you will also update the DNS name. 
```powershell
$scaleSetName="nt0"
Remove-AzureRmVmss -ResourceGroupName $groupname -VMScaleSetName $scaleSetName -Force

$lbname="LB-cluster-name-nt1vm"
$oldPublicIpName="PublicIP-LB-FE-nt1vm"
$newPublicIpName="PublicIP-LB-FE-nt2vm"

$oldprimaryPublicIP = Get-AzureRmPublicIpAddress -Name $oldPublicIpName  -ResourceGroupName $groupname
$primaryDNSName = $oldprimaryPublicIP.DnsSettings.DomainNameLabel
$primaryDNSFqdn = $oldprimaryPublicIP.DnsSettings.Fqdn

$PublicIP = Get-AzureRmPublicIpAddress -Name $newPublicIpName  -ResourceGroupName $groupname
$PublicIP.DnsSettings.DomainNameLabel = $primaryDNSName
$PublicIP.DnsSettings.Fqdn = $primaryDNSFqdn
Set-AzureRmPublicIpAddress -PublicIpAddress $PublicIP

Remove-AzureRmLoadBalancer -Name $lbname -ResourceGroupName $groupname -Force
Remove-AzureRmPublicIpAddress -Name $oldPublicIpName -ResourceGroupName $groupname -Force
``` 
5. Remove the original node type reference from the Service Fabric resource in the ARM template. 
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
6. Update the management endpoint on the cluster. 
```json
  "managementEndpoint": "[concat('https://',reference(concat(variables('lbIPName'),'-',variables('vmNodeType1Name'))).dnsSettings.fqdn,':',variables('nt0fabricHttpGatewayPort'))]",
```
7. Remove all other resources related to the original node type from the ARM template. See [Service Fabric - New Node Type Cluster](http://TODO) for a template with all of these original resources removed.

8. Deploy the template with the original node type and related resources removed. 
```powershell
# deploy the updated template files to the existing resource group
$templateFilePath = "C:\AzureDeploy-Final.json"
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
