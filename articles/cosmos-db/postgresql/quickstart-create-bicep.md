---
title: 'Quickstart: create a cluster using bicep'
description: Using bicep template for provisioning a cluster of Azure Cosmos DB for PostgreSQL
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 07/07/2023
---

# Use a bicep file to provision an Azure Cosmos DB for PostgreSQL cluster

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL is a managed service that allows you to run horizontally scalable PostgreSQL databases in the cloud. In this article, you'll learn using bicep to provision and manage an Azure Cosmos DB for PostgreSQL cluster.

[Bicep](https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/overview?tabs=bicep) is a domain-specific language (DSL) that uses declarative syntax to deploy Azure resources. It provides concise syntax, reliable type safety, and support for code reuse. Bicep offers the best authoring experience for your infrastructure-as-code solutions in Azure.

## Pre-requisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

An Azure account with an active subscription. [create one for free](http://aka.ms/trycosmosdb)

## Review the bicep file

Provision an Azure Cosmos DB for PostgreSQL cluster which provides the ability to distribute data into shards, alongside HA node for high availability.

Create a provision.bicep file and copy the following into it.

``` Bicep
secure()
param administratorLoginPassword string
param location string
param clusterName string
param coordinatorVCores int = 4
param coordinatorStorageQuotaInMb int = 262144
param coordinatorServerEdition string = 'GeneralPurpose'
param enableShardsOnCoordinator bool = true
param nodeServerEdition string = 'MemoryOptimized'
param nodeVCores int = 4
param nodeStorageQuotaInMb int = 524288
param nodeCount int
param enableHa bool
param coordinatorEnablePublicIpAccess bool = true
param nodeEnablePublicIpAccess bool = true
param availabilityZone string = '1'
param postgresqlVersion string = '15'
param citusVersion string = '11.3'

resource serverName_resource 'Microsoft.DBforPostgreSQL/serverGroupsv2@2022-11-08' = {
        name: clusterName
        location: location
        tags: {}
        properties: {
                administratorLoginPassword: administratorLoginPassword
                coordinatorServerEdition: coordinatorServerEdition
                coordinatorVCores: coordinatorVCores
                coordinatorStorageQuotaInMb: coordinatorStorageQuotaInMb
                enableShardsOnCoordinator: enableShardsOnCoordinator
                nodeCount: nodeCount
                nodeServerEdition: nodeServerEdition
                nodeVCores: nodeVCores
                nodeStorageQuotaInMb: nodeStorageQuotaInMb
                enableHa: enableHa
                coordinatorEnablePublicIpAccess: coordinatorEnablePublicIpAccess
                nodeEnablePublicIpAccess: nodeEnablePublicIpAccess
                citusVersion: citusVersion
                postgresqlVersion: postgresqlVersion
                preferredPrimaryZone: availabilityZone
                }
        }
```

[Resource format](https://learn.microsoft.com/en-us/azure/templates/microsoft.dbforpostgresql/servergroupsv2?pivots=deployment-language-bicep) could be referred to learn about the supported resource parameters.

## Deploy the bicep file

# [CLI](#tab/cli)
```azurecli
az group create --name exampleRG --location eastus
az deployment group create --resource-group exampleRG --template-file provision.bicep
```

# [Powershell](#tab/powershell)
```azurepowershell
New-AzResourceGroup -Name "exampleRG" -Location "eastus"
New-AzResourceGroupDeployment -ResourceGroupName exampleRG  -TemplateFile "./provision.bicep"
```

You'll be prompted to enter these values:

* clusterName: Enter a unique name that identifies your Azure Cosmos DB for PostgreSQL cluster. For example, mydemocitus-pg. The domain name postgres.cosmos.azure.com is appended to the cluster name you provide. The Cluster name must only contain lowercase letters, numbers and hyphens. The cluster name must not start or end in a hyphen.
* location: Azure region where the cluster and nodes associated with it will be created.
* nodeCount: Number of worker nodes in your cluster. Setting it to `0` will provision a single node cluster while value of greater than two (`> 2`) provisions a multi-node cluster.
* enableHA: With this option selected if a node goes down, the failed node's standby automatically becomes the new node. Database applications continue to access the cluster with the same connection string.
* administratorLoginPassword: enter a new password for the server admin account. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and non-alphanumeric characters (!, $, #, %, etc.).

## Review Deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to validate the deployment and review the deployed resources.

# [CLI](#tab/cli)
```azurecli
az resource list --resource-group exampleRG
```
# [Powershell](#tab/powershell)
```azurepowershell
Get-AzResource -ResourceGroupName exampleRG
```

## Next step

With your cluster created, it's time to connect with a SQL client.

> [!div class="nextstepaction"]
> [Connect to your cluster](quickstart-connect-psql.md)