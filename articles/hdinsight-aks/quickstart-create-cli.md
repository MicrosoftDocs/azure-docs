---
title: 'Quickstart: Create HDInsight on AKS cluster pool using Azure CLI'
description: Learn how to use Azure CLI to create an HDInsight on AKS cluster pool.
ms.service: azure-hdinsight-aks
ms.custom: devx-track-azurecli
ms.topic: quickstart
ms.date: 06/18/2024
---

# Quickstart: Create an HDInsight on AKS cluster pool using Azure CLI

[!INCLUDE [feature-in-preview](includes/feature-in-preview.md)]

HDInsight on AKS introduces the concept of cluster pools and clusters, which allow you to realize the complete value of data lakehouse.

- **Cluster pools** are a logical grouping of clusters and maintain a set of clusters in the same pool, which helps in building robust interoperability across multiple cluster types. It can be created within an existing virtual network or outside a virtual network.

  A cluster pool in HDInsight on AKS corresponds to one cluster in AKS infrastructure.

- **Clusters** are individual compute workloads, such as Apache Spark, Apache Flink, or Trino, which can be created in the same cluster pool.

For every cluster type, you must have a cluster pool. It can be created independently or you can create new cluster pool during cluster creation.
In this quickstart, you learn how to create a cluster pool using the Azure CLI.

## Prerequisites
Ensure that you completed the [subscription prerequisites](./quickstart-prerequisites-subscription.md) before creating a cluster pool.

## Launch Azure Cloud Shell

The Azure Cloud Shell is an interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

- [!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]

- This article requires Azure CLI version 2.56.0 or higher. If you're using Azure Cloud Shell, the latest version is already installed there.
- If you have multiple Azure subscriptions, select the appropriate subscription ID in which the resources should be billed using the [az account set](/cli/azure/account#az-account-set) command. For more information, see [How to manage Azure subscriptions – Azure CLI](/cli/azure/manage-azure-subscriptions-azure-cli?tabs=bash#change-the-active-subscription).

- You can also open Cloud Shell in a separate browser tab by going to [https://shell.azure.com/bash](https://shell.azure.com/bash). 

## Define environment variables

The first step is to define the environment variables. Environment variables are commonly used in Linux to centralize configuration data to improve consistency and maintainability of the system. Create the following environment variables to specify the names of resources that you create later in this tutorial:

```bash
export ResourceGroup="HDIonAKSCLI"
export Region=EastUS
export HDIonAKSClusterPoolName="contosopool"
export NodeType="Standard_E4s_v3"
export ClusterVersion="1.1"
```

## Log in to Azure using the CLI

In order to run commands in Azure using the CLI, you need to log in first. Log in using the `az login` command.

## Create a resource group

A resource group is a container for related resources. All resources must be placed in a resource group. The [az group create](/cli/azure/group) command creates a resource group with the previously defined `$ResourceGroup` and `$Region` parameters.

```bash
az group create --name $ResourceGroup --location $Region
```

Output:

<!-- expected_similarity=0.3 -->
```json
{
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HDIonAKSCLI",
  "location": "eastus",
  "managedBy": null,
  "name": "HDIonAKSCLI",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

## Create the HDInsight on AKS cluster pool

To create a HDInsight on AKS cluster pool in this resource group, use the `az hdinsight-on-aks clusterpool create` command:
```bash
az hdinsight-on-aks clusterpool create --cluster-pool-name
                                       --resource-group
                                       [--api-server-authorized-ip-ranges]
                                       [--cluster-pool-version]
                                       [--enable-log-analytics {0, 1, f, false, n, no, t, true, y, yes}]
                                       [--la-workspace-id]
                                       [--location]
                                       [--managed-rg-name]
                                       [--no-wait {0, 1, f, false, n, no, t, true, y, yes}]
                                       [--outbound-type {loadBalancer, userDefinedRouting}]
                                       [--private-server-enabled {0, 1, f, false, n, no, t, true, y, yes}]
                                       [--subnet-id]
                                       [--tags]
                                       [--workernode-size]
```
Here's an example:
```bash
az hdinsight-on-aks clusterpool create --resource-group $ResourceGroup --cluster-pool-name $HDIonAKSClusterPoolName --location $Region --workernode-size $NodeType --cluster-pool-version $ClusterVersion
```

It takes a few minutes to create the HDInsight on AKS cluster pool. The following example output shows the created operation was successful.

Output:
<!-- expected_similarity=0.3 -->
```json
{
  "aksClusterProfile": {
    "aksClusterAgentPoolIdentityProfile": {
      "msiClientId": "00000000-0000-0000-0000-XXXXXXXX1",
      "msiObjectId": "00000000-0000-0000-0000-XXXXXXX11",
      "msiResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourcegroups/MC_hdi-00000000000000000000XXXX_contosopool_eastus/providers/Microsoft.ManagedIdentity/userAssignedIdentities/contosopool-agentpool"
    },
    "aksClusterResourceId": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/hdi-00000000000000000000XXXX/providers/Microsoft.ContainerService/managedClusters/contosopool",
    "aksVersion": "1.27.9"
  },
  "aksManagedResourceGroupName": "MC_hdi-00000000000000000000XXXX_contosopool_eastus",
  "clusterPoolProfile": {
    "clusterPoolVersion": "1.1"
  },
  "computeProfile": {
    "count": 3,
    "vmSize": "Standard_E4s_v3"
  },
  "deploymentId": "00000000000000000000XXXX",
  "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/HDIonAKSCLI/providers/Microsoft.HDInsight/clusterpools/contosopool",
  "location": "EastUS",
  "managedResourceGroupName": "hdi-00000000000000000000XXXX",
  "name": "contosopool",
  "provisioningState": "Succeeded",
  "resourceGroup": "HDIonAKSCLI",
  "status": "Running",
  "systemData": {
    "createdAt": "2024-05-31T15:02:42.2172295Z",
    "createdBy": "john@contoso.com",
    "createdByType": "User",
    "lastModifiedAt": "2024-05-31T15:02:42.2172295Z",
    "lastModifiedBy": "john@contoso.com",
    "lastModifiedByType": "User"
  },
  "type": "microsoft.hdinsight/clusterpools"
}
```

> [!NOTE]
> For more information about cluster pool CLI commands, see [commands](/cli/azure/hdinsight-on-aks/clusterpool).

## Clean up resources

When no longer needed, clean up unnecessary resources to avoid Azure charges. You can remove the resource group, cluster pool, and all other resources in the resource group using the `az group delete` command.

> [!NOTE]
> To delete a cluster pool, ensure there are no active clusters in the cluster pool.
