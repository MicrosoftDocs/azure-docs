---
title: 'Quickstart: Create HDInsight on AKS cluster pool using Azure PowerShell'
description: Learn how to use Azure PowerShell to create an HDInsight on AKS cluster pool.
ms.service: azure-hdinsight-on-aks
ms.custom: devx-track-azurepowershell
ms.topic: quickstart
ms.date: 06/19/2024
---

# Quickstart: Create an HDInsight on AKS cluster pool using Azure PowerShell

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS introduces the concept of cluster pools and clusters, which allow you to realize the complete value of data lakehouse.

- **Cluster pools** are a logical grouping of clusters and maintain a set of clusters in the same pool, which helps in building robust interoperability across multiple cluster types. It can be created within an existing virtual network or outside a virtual network.

  A cluster pool in HDInsight on AKS corresponds to one cluster in AKS infrastructure.

- **Clusters** are individual compute workloads, such as Apache Spark, Apache Flink, or Trino, which can be created in the same cluster pool.

For every cluster type, you must have a cluster pool. It can be created independently or you can create new cluster pool during cluster creation.
In this quickstart, you learn how to create a cluster pool using the Azure PowerShell.

## Prerequisites

Ensure that you complete the [subscription prerequisites](./quickstart-prerequisites-subscription.md) before creating a cluster pool.

## Launch Azure Cloud Shell

The Azure Cloud Shell is an interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

- For ease of use, try the PowerShell environment in [Azure Cloud Shell](/azure/cloud-shell/overview). For more information, see [Quickstart for Azure Cloud Shell](/azure/cloud-shell/quickstart).
- If you want to use PowerShell locally, then install the [Az PowerShell](/powershell/azure/new-azureps-module-az) module and connect to your Azure account using the [Connect-AzAccount](/powershell/module/az.accounts/Connect-AzAccount) cmdlet. Make sure that you run the commands with administrative privileges. For more information, see [Install Azure PowerShell](/powershell/azure/install-az-ps).
     * The commands used in this article are part of Azure PowerShell module `Az.HdInsightOnAks`, run `Install-Module Az.HdInsightOnAks` to install it.

- If you have more than one Azure subscription, set the subscription that you wish to use for the quickstart by calling the [Set-AzContext](/powershell/module/az.accounts/set-azcontext) cmdlet. For more information, see [Manage Azure subscriptions with Azure PowerShell](/powershell/azure/manage-subscriptions-azureps#change-the-active-subscription).

- You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). 

## Create a resource group

Create an Azure resource group with [New-AzResourceGroup](/powershell/module/az.resources/new-azresourcegroup). A resource group is a logical container into which Azure resources are deployed and managed:

```Azure PowerShell
   New-AzResourceGroup -Name 'HDIonAKSPowershell' -Location 'West US 3'
```

The following example output resembles successful creation of the resource group:

```output
    ResourceGroupName : HDIonAKSPowershell
    Location          : westus3
    ProvisioningState : Succeeded
    Tags              :
    ResourceId        : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HDIonAKSPowershell
```


## Create the HDInsight on AKS cluster pool

To create an HDInsight on AKS cluster pool in this resource group, use the `New-AzHdInsightOnAksClusterPool` command:

```PowerShell
   New-AzHdInsightOnAksClusterPool
      -Name <String>
      -ResourceGroupName <String>
      [-SubscriptionId <String>]
      -Location <String>
      [-ClusterPoolVersion <String>]
      [-EnableLogAnalytics]
      [-LogAnalyticWorkspaceResourceId <String>]
      [-ManagedResourceGroupName <String>]
      [-NetworkProfileApiServerAuthorizedIPRange <String[]>]
      [-NetworkProfileEnablePrivateApiServer]
      [-NetworkProfileOutboundType <String>]
      [-SubnetId <String>]
      [-Tag <Hashtable>]
      [-VmSize <String>]
      [-DefaultProfile <PSObject>]
      [-AsJob]
      [-NoWait]
      [-WhatIf]
      [-Confirm]
      [<CommonParameters>]
```
Here's an example:

```PowerShell
   $location = "West US 3"
   $clusterResourceGroupName = "HDIonAKSPowershell"
   $clusterpoolName = "contosopool"
   $vmSize = "Standard_E4s_v3"
   $clusterpoolversion="1.1"

   # Create the cluster pool
   New-AzHdInsightOnAksClusterPool `
       -Name $clusterpoolName `
       -ResourceGroupName $clusterResourceGroupName `
       -Location $location `
       -VmSize $vmSize `
       -ClusterPoolVersion $clusterpoolversion
```

It takes a few minutes to create the HDInsight on AKS cluster pool. The following example output shows the created operation was successful.

```output
AkClusterProfileAkClusterAgentPoolIdentityProfileMsiClientId   : 00000000-0000-0000-0000-XXXXXXXX1
AkClusterProfileAkClusterAgentPoolIdentityProfileMsiObjectId   : 00000000-0000-0000-0000-XXXXXXX11
AkClusterProfileAkClusterAgentPoolIdentityProfileMsiResourceId : /subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/MC_hdi-00000000
                                                                 00000000000XXXX_contosopool_westus3/providers/Microsoft.ManagedIdentity/userAssignedIdent
                                                                 ities/contosopool-agentpool
AkClusterProfileAksClusterResourceId                           : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/hdi-0000000000000000000
                                                                 0XXXX/providers/Microsoft.ContainerService/managedClusters/contosopool
AkClusterProfileAksVersion                                     : 1.27.9
AksManagedResourceGroupName                                    : MC_hdi-00000000000000000000XXXX_contosopool_westus3
ComputeProfileCount                                            : 3
ComputeProfileVMSize                                           : Standard_E4s_v3
DeploymentId                                                   : 00000000000000000000XXXX
Id                                                             : /subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HDIonAKSPowershell/prov
                                                                 iders/Microsoft.HDInsight/clusterpools/contosopool
Location                                                       : West US 3
LogAnalyticProfileEnabled                                      : False
LogAnalyticProfileWorkspaceId                                  : 
ManagedResourceGroupName                                       : hdi-00000000000000000000XXXX
Name                                                           : contosopool
NetworkProfileApiServerAuthorizedIPRange                       : 
NetworkProfileEnablePrivateApiServer                           : 
NetworkProfileOutboundType                                     : 
NetworkProfileSubnetId                                         : 
ProfileClusterPoolVersion                                      : 1.1
ProvisioningState                                              : Succeeded
ResourceGroupName                                              : HDIonAKSPowershell
Status                                                         : Running
SystemDataCreatedAt                                            : 6/2/2024 11:53:01 AM
SystemDataCreatedBy                                            : john@contoso.com
SystemDataCreatedByType                                        : User
SystemDataLastModifiedAt                                       : 6/2/2024 11:53:01 AM
SystemDataLastModifiedBy                                       : john@contoso.com
SystemDataLastModifiedByType                                   : User
Tag                                                            : {
                                                                 }
Type                                                           : microsoft.hdinsight/clusterpools
```

> [!NOTE]
> For more information about cluster pool PowerShell commands, refer to these [commands](/powershell/module/az.hdinsightonaks/).

## Clean up resources

When no longer needed, clean up unnecessary resources to avoid Azure charges. You can remove the resource group, cluster pool, and all other resources in the resource group.

```azurepowershell
Remove-AzResourceGroup -Name HDIonAKSPowershell
```

> [!NOTE]
> To delete a cluster pool, ensure there are no active clusters in the cluster pool.
