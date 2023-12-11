---
title: Manage HDInsight on AKS clusters using PowerShell (Preview)
description: Manage HDInsight on AKS clusters using PowerShell.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 12/11/2023
---
# Manage HDInsight on AKS clusters using PowerShell

Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Microsoft Azure. This document provides information about how to create a HDInsight on AKS cluster by using Azure PowerShell. It also includes an example script. 

 
## Prerequisites

To create an HDInsight on AKS cluster by using Azure PowerShell, you must complete the following procedures: 
- [Install Azure PowerShell](/powershell/azure/install-azure-powershell)  
- Create an [Azure resource group](/azure/azure-resource-manager/management/manage-resource-groups-portal#create-resource-groups)
- Create an [Azure Data Lase Store Gen2](/azure/storage/blobs/create-data-lake-storage-account) account 
- Create an [Azure Managed Identity](/entra/identity/managed-identities-azure-resources/qs-configure-portal-windows-vm)

 
 ## Set up Azure Environment with PowerShell 
 
The following script demonstrates how to set up an Azure environment with PowerShell: 

1. Open PowerShell 
1. Copy the following code 
	1. Install the module Az.HdInsightOnAks 
	   Install-Module -Name Az.HdInsightOnAks
    
          :::image type="content" source="./media/powershell-cluster-create/powershell.png" alt-text="Screenshot shows install the module HDInsight on AKS." lightbox="./media/powershell-cluster-create/powershell.png":::
	1. Log in to Azure account and set the default subscription ID 
		Connect-AzAccount 
		Set-AzContext -Subscription {your subscription ID} 

 
## Variables required in script 

- Cluster Name 
- Cluster Pool Name 
- Subscription ID 
- Resource Group Name 
- Region Name 
- Cluster Type 
- SKU 
- Worker Node count 
- MSI resource ID:
  ```
  /subscriptions/<subscription ID>/resourcegroups/<resource group name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<Managed identity name>"
  ```
- MSI client ID
- MSI object ID
  
	:::image type="content" source="./media/powershell-cluster-create/overview.png" alt-text="Screenshot shows MSI object ID." lightbox="./media/powershell-cluster-create/overview.png":::
- Microsoft Entra user ID: [Find tenant ID, domain name, user object ID - Partner Center | Microsoft Learn](/partner-center/find-ids-and-domain-names) 
- [HDInsight on AKS VM list](/azure/hdinsight-aks/virtual-machine-recommendation-capacity-planning)
 
### Create HDInsight On AKS cluster pool

Copy the following code to PowerShell
```
$clusterPoolName="<your cluster pool name>"; 

$resourceGroupName="<your resource group name>"; 

$location="West US 2"; 

$vmSize="Standard_E4s_v3" 
```
**Get the available cluster pool version**
```
$clusterPoolVersion=Get-AzHdInsightOnAksAvailableClusterPoolVersion -Location $location 

Write-Output "Start to create cluster pool..." 

$clusterPoolResult=New-AzHdInsightOnAksClusterPool -Name $clusterPoolName -ResourceGroupName $resourceGroupName -Location $location -VmSize $vmSize -ClusterPoolVersion $clusterPoolVersion.ClusterPoolVersionValue 
```

Write-Output "Created cluster pool with name $($clusterPoolResult.Name) successfully" 

### Create HDInsight On AKS cluster under existing cluster pool

Here, we are going to create cluster under the cluster pool created in the previous step 
 
Run the following code in PowerShell: 

**Create Trino Cluster**
```


$clusterPoolName=$“{Cluster Pool Name}”;  

$resourceGroupName=$“{Resource Group Name}”;

$location=“{Region Name}”; 

$clusterType="{Trino}"; 

Get available cluster version based the command Get-AzHdInsightOnAksAvailableClusterVersion

$clusterVersion= (Get-AzHdInsightOnAksAvailableClusterVersion -Location $location | Where-Object {$_.ClusterType -eq $clusterType})[0] 
$msiResourceId="<your user msi resource id>"; 
$msiClientId="<your user msi client id>"; 
$msiObjectId="<your msi object id>"; 
$userId="<your Microsoft Entra user id>"; 
```
**Create node profile**
```
$vmSize="Standard_D8d_v5"; // {Mention the SKU name} 
$workerCount=5; // {Mention the SKU count} 
$nodeProfile = New-AzHdInsightOnAksNodeProfileObject -Type Worker -Count $workerCount -VMSize $vmSize 
$clusterName="<your cluster name>"; 

Write-Output "Start to create cluster..." 

$clusterResult=New-AzHdInsightOnAksCluster -Name $clusterName ` 

                            -PoolName $clusterPoolName ` 

                            -ResourceGroupName $resourceGroupName ` 

                            -Location $location ` 

                            -ClusterType $clusterType ` 

                            -ClusterVersion $clusterVersion.ClusterVersionValue ` 

                            -OssVersion $clusterVersion.OssVersion ` 

                            -AssignedIdentityResourceId $msiResourceId ` 

                            -AssignedIdentityClientId $msiClientId ` 

                            -AssignedIdentityObjectId $msiObjectId ` 

                            -ComputeProfileNode $nodeProfile ` 

                            -AuthorizationUserId $userId 

 ```
Write-Output "Created cluster with name $($clusterResult.Name) successfully" 

**Get the cluster with cluster name:**

```
Get-AzHdInsightOnAksCluster -ResourceGroupName $resourceGroupName -PoolName $clusterPoolName -Name $clusterName 
```
 
**List the clusters under the cluster pool**

``` 
Get-AzHdInsightOnAksCluster -ResourceGroupName $resourceGroupName -PoolName $clusterPoolName 
 ```

**Delete the cluster with cluster name**

```
Remove-AzHdInsightOnAksCluster -Name $clusterName -PoolName $clusterpoolName -ResourceGroupName $resourceGroupName 
```
  
## Next steps

Now you created an HDInsight on AKS cluster, use the following resources to learn how to work with your cluster.

To customize and manage your HDInsight on AKS cluster, refer the following documentation: 
- Az.HdInsightOnAks module is available in PowerShell gallery: [https://www.powershellgallery.com/packages/Az.HdInsightOnAks/0.1.0](https://www.powershellgallery.com/packages/Az.HdInsightOnAks/0.1.0 )
- Publicly available [HDInsight On AKS PowerShell module](/powershell/module/az.hdinsightonaks/#hdinsightonaks) doc

 

 
