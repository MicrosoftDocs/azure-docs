---
title: Managed virtual network & managed private endpoints
description: Learn about managed virtual network and managed private endpoints in Azure Data Factory.
ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.custom: [seo-lt-2019, references_regions, devx-track-azurepowershell]
ms.date: 07/20/2021
---

# Azure Data Factory Managed Virtual Network (preview)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article will explain Managed Virtual Network and Managed Private endpoints in Azure Data Factory.


## Managed virtual network

When you create an Azure Integration Runtime (IR) within Azure Data Factory Managed Virtual Network (VNET), the integration runtime will be provisioned with the managed Virtual Network and will leverage private endpoints to securely connect to supported data stores. 

Creating an Azure IR within managed Virtual Network ensures that data integration process is isolated and secure. 

Benefits of using Managed Virtual Network:

- With a Managed Virtual Network, you can offload the burden of managing the Virtual Network to Azure Data Factory. You don't need to create a subnet for Azure Integration Runtime that could eventually use many private IPs from your Virtual Network and would require prior network infrastructure planning. 
- It does not require deep Azure networking knowledge to do data integrations securely. Instead getting started with secure ETL is much simplified for data engineers. 
- Managed Virtual Network along with Managed private endpoints protects against data exfiltration. 

> [!IMPORTANT]
>Currently, the managed Virtual Network is only supported in the same region as Azure Data Factory region.

> [!Note]
>As Azure Data Factory managed Virtual Network is still in public preview, there is no SLA guarantee.

> [!Note]
>Existing public Azure integration runtime can't switch to Azure integration runtime in Azure Data Factory managed virtual network and vice versa.
 

:::image type="content" source="./media/managed-vnet/managed-vnet-architecture-diagram.png" alt-text="ADF Managed Virtual Network architecture":::

## Managed private endpoints

Managed private endpoints are private endpoints created in the Azure Data Factory Managed Virtual Network establishing a private link to Azure resources. Azure Data Factory manages these private endpoints on your behalf. 

:::image type="content" source="./media/tutorial-copy-data-portal-private/new-managed-private-endpoint.png" alt-text="New Managed private endpoint":::

Azure Data Factory supports private links. Private link enables you to access Azure (PaaS) services (such as Azure Storage, Azure Cosmos DB, Azure Synapse Analytics).

When you use a private link, traffic between your data stores and managed Virtual Network traverses entirely over the Microsoft backbone network. Private Link protects against data exfiltration risks. You establish a private link to a resource by creating a private endpoint.

Private endpoint uses a private IP address in the managed Virtual Network to effectively bring the service into it. Private endpoints are mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to a specific resource approved by their organization. Learn more about [private links and private endpoints](../private-link/index.yml).

> [!NOTE]
> It's recommended that you create Managed private endpoints to connect to all your Azure data sources. 
 
> [!WARNING]
> If a PaaS data store (Blob, ADLS Gen2, Azure Synapse Analytics) has a private endpoint already created against it, and even if it allows access from all networks, ADF would only be able to access it using a managed private endpoint. If a private endpoint does not already exist, you must create one in such scenarios. 

A private endpoint connection is created in a "Pending" state when you create a managed private endpoint in Azure Data Factory. An approval workflow is initiated. The private link resource owner is responsible to approve or reject the connection.

:::image type="content" source="./media/tutorial-copy-data-portal-private/manage-private-endpoint.png" alt-text="Manage private endpoint":::

If the owner approves the connection, the private link is established. Otherwise, the private link won't be established. In either case, the Managed private endpoint will be updated with the status of the connection.

:::image type="content" source="./media/tutorial-copy-data-portal-private/approve-private-endpoint.png" alt-text="Approve Managed private endpoint":::

Only a Managed private endpoint in an approved state can send traffic to a given private link resource.

## Interactive Authoring
Interactive authoring capabilities is used for functionalities like test connection, browse folder list and table list, get schema, and preview data. You can enable interactive authoring when creating or editing an Azure Integration Runtime which is in ADF-managed virtual network. The backend service will pre-allocate compute for interactive authoring functionalities. Otherwise, the compute will be allocated every time any interactive operation is performed which will take more time. The Time To Live (TTL) for interactive authoring is 60 minutes, which means it will automatically become disabled after 60 minutes of the last interactive authoring operation.

:::image type="content" source="./media/managed-vnet/interactive-authoring.png" alt-text="Interactive authoring":::

## Activity execution time using managed virtual network
By design, Azure integration runtime in managed virtual network takes longer queue time than public Azure integration runtime as we are not reserving one compute node per data factory, so there is a warm up for each activity to start, and it occurs primarily on virtual network join rather than Azure integration runtime. For non-copy activities including pipeline activity and external activity, there is a 60 minutes Time To Live (TTL) when you trigger them at the first time. Within TTL, the queue time is shorter because the node is already warmed up. 
> [!NOTE]
> Copy activity doesn't have TTL support yet.

## Create managed virtual network via Azure PowerShell
```powershell
$subscriptionId = ""
$resourceGroupName = ""
$factoryName = ""
$managedPrivateEndpointName = ""
$integrationRuntimeName = ""
$apiVersion = "2018-06-01"
$privateLinkResourceId = ""

$vnetResourceId = "subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/managedVirtualNetworks/default"
$privateEndpointResourceId = "subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/managedVirtualNetworks/default/managedprivateendpoints/${managedPrivateEndpointName}"
$integrationRuntimeResourceId = "subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/Microsoft.DataFactory/factories/${factoryName}/integrationRuntimes/${integrationRuntimeName}"

# Create managed Virtual Network resource
New-AzResource -ApiVersion "${apiVersion}" -ResourceId "${vnetResourceId}" -Properties @{}

# Create managed private endpoint resource
New-AzResource -ApiVersion "${apiVersion}" -ResourceId "${privateEndpointResourceId}" -Properties @{
        privateLinkResourceId = "${privateLinkResourceId}"
        groupId = "blob"
    }

# Create integration runtime resource enabled with VNET
New-AzResource -ApiVersion "${apiVersion}" -ResourceId "${integrationRuntimeResourceId}" -Properties @{
        type = "Managed"
        typeProperties = @{
            computeProperties = @{
                location = "AutoResolve"
                dataFlowProperties = @{
                    computeType = "General"
                    coreCount = 8
                    timeToLive = 0
                }
            }
        }
        managedVirtualNetwork = @{
            type = "ManagedVirtualNetworkReference"
            referenceName = "default"
        }
    }

```

## Limitations and known issues
### Supported Data Sources
Below data sources have native Private Endpoint support and can be connected through private link from ADF Managed Virtual Network.
- Azure Blob Storage (not including Storage account V1)
- Azure Table Storage (not including Storage account V1)
- Azure Files (not including Storage account V1)
- Azure Data Lake Gen2
- Azure SQL Database (not including Azure SQL Managed Instance)
- Azure Synapse Analytics
- Azure CosmosDB SQL
- Azure Key Vault
- Azure Private Link Service
- Azure Search
- Azure Database for MySQL
- Azure Database for PostgreSQL
- Azure Database for MariaDB
- Azure Machine Learning

> [!Note]
> You still can access all data sources that are supported by Data Factory through public network.

> [!NOTE]
> Because Azure SQL Managed Instance doesn't support native Private Endpoint right now, you can access it from managed Virtual Network using Private Linked Service and Load Balancer. Please see [How to access SQL Managed Instance from Data Factory Managed VNET using Private Endpoint](tutorial-managed-virtual-network-sql-managed-instance.md).

### On premises Data Sources
To access on premises data sources from managed Virtual Network using Private Endpoint, please see this tutorial [How to access on premises SQL Server from Data Factory Managed VNET using Private Endpoint](tutorial-managed-virtual-network-on-premise-sql-server.md).

### Azure Data Factory Managed Virtual Network is available in the following Azure regions:
- Australia East
- Australia Southeast
- Brazil South
- Canada Central
- Canada East
- Central India
- Central US
- China East2
- China North2
- East Asia
- East US
- East US2
- France Central
- Germany West Central
- Japan East
- Japan West
- Korea Central
- North Central US
- North Europe
- Norway East
- South Africa North
- South Central US
- South East Asia
- Switzerland North
- UAE North
- US Gov Arizona
- US Gov Texas
- US Gov Virginia
- UK South
- UK West
- West Central US
- West Europe
- West US
- West US2


### Outbound communications through public endpoint from ADF Managed Virtual Network
- All ports are opened for outbound communications.
- Azure Storage and Azure Data Lake Gen2 are not supported to be connected through public endpoint from ADF Managed Virtual Network.

### Linked Service creation of Azure Key Vault 
- When you create a Linked Service for Azure Key Vault, there is no Azure Integration Runtime reference. So you can't create Private Endpoint during Linked Service creation of Azure Key Vault. But when you create Linked Service for data stores which references Azure Key Vault Linked Service and this Linked Service references Azure Integration Runtime with Managed Virtual Network enabled, then you are able to create a Private Endpoint for the Azure Key Vault Linked Service during the creation. 
- **Test connection** operation for Linked Service of Azure Key Vault only validates the URL format, but doesn't do any network operation.
- The column **Using private endpoint** is always shown as blank even if you create Private Endpoint for Azure Key Vault.

### Linked Service creation of Azure HDI
- The column **Using private endpoint** is always shown as blank even if you create Private Endpoint for HDI using private link service and load balancer with port forwarding.

:::image type="content" source="./media/managed-vnet/akv-pe.png" alt-text="Private Endpoint for AKV":::

## Next steps

- Tutorial: [Build a copy pipeline using managed Virtual Network and private endpoints](tutorial-copy-data-portal-private.md) 
- Tutorial: [Build mapping dataflow pipeline using managed Virtual Network and private endpoints](tutorial-data-flow-private.md)
