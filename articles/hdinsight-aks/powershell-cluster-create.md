---
title: Manage HDInsight on AKS clusters using Powershell (Preview)
description: Manage HDInsight on AKS clusters using Powershell.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 11/26/2023
---
# Manage HDInsight on AKS clusters using Powershell

Azure PowerShell is a powerful scripting environment that you can use to control and automate the deployment and management of your workloads in Microsoft Azure. This document provides information about how to create a HDInsight on AKS cluster by using Azure PowerShell. It also includes an example script. 

 
## Pre-Requisites: 

To create an HDInsight on AKS cluster by using Azure PowerShell, you must complete the following procedures: 
-Install Azure PowerShell  

- Create an Azure resource group 

- Create an Azure Data Lase Store Gen2 account 

- Create an Azure Managed Identity 

- Setup Azure Environment with Powershell 

 
 ## The following script demonstrates how to setup an Azure environment with powershell: 
- Open PowerShell 
- Copy the following code 
	- Install the module Az.HdInsightOnAks 
	- Install-Module -Name Az.HdInsightOnAks 
- Login to azure account and set the default subscription id 
	- Connect-AzAccount 

	- Set-AzContext -Subscription {your subscription id} 

 
## Variables required in the script 
- Cluster Name 
- Cluster Pool Name 
- Subscription ID 
- Resource Group Name 
- Region Name 
- Cluster Type 
- SKU 
- Woker Node count 
- MSI resource id: “/subscriptions/<subscription ID>/resourcegroups/<resource group name>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<Managed identity name>" 
- MSI client id (See below) 
- MSI object id (See below) 


Image


- Microsoft Entra user ID: Find tenant ID, domain name, user object ID - Partner Center | Microsoft Learn 
- HDInsight on AKS VM list: 
  https://learn.microsoft.com/en-us/azure/hdinsight-aks/virtual-machine-recommendation-capacity-planning 

 
**Create HDInsight On Aks cluster pool**  

Copy the following code to Powershell

$clusterPoolName="<your cluster pool name>"; 

$resourceGroupName="<your resource group name>"; 

$location="West US 2"; 

$vmSize="Standard_E4s_v3" 

**Get the available cluster pool version**

$clusterPoolVersion=Get-AzHdInsightOnAksAvailableClusterPoolVersion -Location $location 

Write-Output "Start to create cluster pool..." 

$clusterPoolResult=New-AzHdInsightOnAksClusterPool -Name $clusterPoolName -ResourceGroupName $resourceGroupName -Location $location -VmSize $vmSize -ClusterPoolVersion $clusterPoolVersion.ClusterPoolVersionValue 

Write-Output "Created cluster pool with name $($clusterPoolResult.Name) successfully" 


**Create HDInsight On Aks cluster under existing cluster pool** 

Here, we are going to create cluster under the clusterpool created in the previous step 
 
Run the following code in Powershell: 
 

**Create Trino Cluster** 

$clusterPoolName=$“{Cluster Pool Name}”;  

$resourceGroupName=$“{Resource Group Name}”;

$location=“{Region Name}”; 

$clusterType="{Trino}"; 

**Get available cluster version based the command Get-AzHdInsightOnAksAvailableClusterVersion** 

$clusterVersion= (Get-AzHdInsightOnAksAvailableClusterVersion -Location $location | Where-Object {$_.ClusterType -eq $clusterType})[0] 
$msiResourceId="<your user msi resource id>"; 
$msiClientId="<your user msi client id>"; 
$msiObjectId="<your msi object id>"; 
$userId="<your Microsoft Entra user id>"; 

**Create node profile**

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

 
Write-Output "Created cluster with name $($clusterResult.Name) successfully" 

 

 

 

## **Get the cluster with cluster name: **

 

Get-AzHdInsightOnAksCluster -ResourceGroupName $resourceGroupName -PoolName $clusterPoolName -Name $clusterName 

 

## **List the clusters under the cluster pool**

 

Get-AzHdInsightOnAksCluster -ResourceGroupName $resourceGroupName -PoolName $clusterPoolName 

 

### **Delete the cluster with cluster name**

Remove-AzHdInsightOnAksCluster -Name $clusterName -PoolName $clusterpoolName -ResourceGroupName $resourceGroupName 

 

 

 
## **Next steps**

Now that you've successfully created an HDInsight on AKS cluster, use the following resources to learn how to work with your cluster. 

To customize and manage your HDInsight on AKS cluster, please review refer the following documentation: 

1.Az.HdInsightOnAks module is available in Powershell gallery: https://www.powershellgallery.com/packages/Az.HdInsightOnAks/0.1.0 

 

 

2.Publicly available HDInsight On Aks PowerShell module doc is https://learn.microsoft.com/en-us/powershell/module/az.hdinsightonaks/?view=azps-10.4.1#hdinsightonaks 

 

 
