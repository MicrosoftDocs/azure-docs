---
title: 'Quickstart: create a cluster using Bicep'
description: Using Bicep template for provisioning a cluster of Azure Cosmos DB for PostgreSQL
ms.author: avijitgupta
author: AvijitkGupta
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: devx-track-bicep
ms.topic: reference
ms.date: 09/07/2023
---

# Use a Bicep file to provision an Azure Cosmos DB for PostgreSQL cluster

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL is a managed service that allows you to run horizontally scalable PostgreSQL databases in the cloud. In this article you learn, using Bicep to provision and manage an Azure Cosmos DB for PostgreSQL cluster.

[!INCLUDE [About Bicep](../../../includes/resource-manager-quickstart-bicep-introduction.md)]

## Prerequisites

If you don't have an Azure subscription, create a [free](https://azure.microsoft.com/free/) account before you begin.

## Create the Bicep file

Provision an Azure Cosmos DB for PostgreSQL cluster that permits distributing data into shards, alongside HA node for high availability.

Create a .bicep file and copy the following into it.

```Bicep
@secure()
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
param citusVersion string = '12.0'

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

[Resource format](/azure/templates/microsoft.dbforpostgresql/servergroupsv2?pivots=deployment-language-bicep) could be referred to learn about the supported resource parameters.

## Deploy the Bicep file

# [CLI](#tab/CLI)

```azurecli
az group create --name exampleRG --location eastus
az deployment group create --resource-group exampleRG --template-file provision.bicep
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
New-AzResourceGroup -Name "exampleRG" -Location "eastus"
New-AzResourceGroupDeployment -ResourceGroupName exampleRG  -TemplateFile "./provision.bicep"
```
---

You're prompted to enter these values:

- **clusterName**: The cluster name determines the DNS name your applications use to connect, in the form `<node-qualifier>-<clustername>.<uniqueID>.postgres.cosmos.azure.com`. For example, The [domain name](./concepts-node-domain-name.md) postgres.cosmos.azure.com is appended to the cluster name you provide. The Cluster name must only contain lowercase letters, numbers and hyphens. The cluster name must not start or end in a hyphen.
- **location**: Azure [region](./resources-regions.md) where the cluster and associated nodes are created.
- **nodeCount**: Number of worker nodes in your cluster. Setting it to `0` provisions a single node cluster while value of greater than equal to two (`>= 2`) provisions a multi-node cluster.
- **enableHA**: With this option selected if a node goes down, the failed node's standby automatically becomes the new node. Database applications continue to access the cluster with the same connection string.
- **administratorLoginPassword**: Enter a new password for the server admin account. It must contain between 8 and 128 characters. Your password must contain characters from three of the following categories: English uppercase letters, English lowercase letters, numbers (0 through 9), and nonalphanumeric characters (!, $, #, %, etc.).

## Review deployed resources

Use the Azure portal, Azure CLI, or Azure PowerShell to validate the deployment and review the deployed resources.

# [CLI](#tab/CLI)

```azurecli
az resource list --resource-group exampleRG
```

# [PowerShell](#tab/PowerShell)

```azurepowershell
Get-AzResource -ResourceGroupName exampleRG
```

---

## Next step

With your cluster created, it's time to connect with a PostgreSQL client.

> [!div class="nextstepaction"]
> [Connect to your cluster](quickstart-connect-psql.md)
