---
title: Managed virtual network & managed private endpoints
description: Learn about managed virtual network and managed private endpoints in Azure Data Factory.
ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.custom: seo-lt-2019, references_regions, devx-track-azurepowershell
ms.date: 04/01/2022
---

# Azure Data Factory Managed Virtual Network

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article will explain managed virtual network and Managed Private endpoints in Azure Data Factory.


## Managed virtual network

When you create an Azure Integration Runtime (IR) within Azure Data Factory managed virtual network (VNET), the integration runtime will be provisioned with the managed virtual network and will leverage private endpoints to securely connect to supported data stores. 

Creating an Azure IR within managed virtual network ensures that data integration process is isolated and secure. 

Benefits of using managed virtual network:

- With a managed virtual network, you can offload the burden of managing the virtual network to Azure Data Factory. You don't need to create a subnet for Azure Integration Runtime that could eventually use many private IPs from your virtual network and would require prior network infrastructure planning. 
- It does not require deep Azure networking knowledge to do data integrations securely. Instead getting started with secure ETL is much simplified for data engineers. 
- Managed virtual network along with Managed private endpoints protects against data exfiltration. 

> [!IMPORTANT]
>Currently, the managed virtual network is only supported in the same region as Azure Data Factory region.

> [!Note]
>Existing global Azure integration runtime can't switch to Azure integration runtime in Azure Data Factory managed virtual network and vice versa.
 

:::image type="content" source="./media/managed-vnet/managed-vnet-architecture-diagram.png" alt-text="ADF managed virtual network architecture":::

## Managed private endpoints

Managed private endpoints are private endpoints created in the Azure Data Factory managed virtual network establishing a private link to Azure resources. Azure Data Factory manages these private endpoints on your behalf. 

:::image type="content" source="./media/tutorial-copy-data-portal-private/new-managed-private-endpoint.png" alt-text="New Managed private endpoint":::

Azure Data Factory supports private links. Private link enables you to access Azure (PaaS) services (such as Azure Storage, Azure Cosmos DB, Azure Synapse Analytics).

When you use a private link, traffic between your data stores and managed virtual network traverses entirely over the Microsoft backbone network. Private Link protects against data exfiltration risks. You establish a private link to a resource by creating a private endpoint.

Private endpoint uses a private IP address in the managed virtual network to effectively bring the service into it. Private endpoints are mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to a specific resource approved by their organization. Learn more about [private links and private endpoints](../private-link/index.yml).

> [!NOTE]
> It's recommended that you create Managed private endpoints to connect to all your Azure data sources. 

> [!NOTE]
> Make sure resource provider Microsoft.Network is registered to your subscription.
 
> [!WARNING]
> If a PaaS data store (Blob, ADLS Gen2, Azure Synapse Analytics) has a private endpoint already created against it, and even if it allows access from all networks, ADF would only be able to access it using a managed private endpoint. If a private endpoint does not already exist, you must create one in such scenarios. 

A private endpoint connection is created in a "Pending" state when you create a managed private endpoint in Azure Data Factory. An approval workflow is initiated. The private link resource owner is responsible to approve or reject the connection.

:::image type="content" source="./media/tutorial-copy-data-portal-private/manage-private-endpoint.png" alt-text="Manage private endpoint":::

If the owner approves the connection, the private link is established. Otherwise, the private link won't be established. In either case, the Managed private endpoint will be updated with the status of the connection.

:::image type="content" source="./media/tutorial-copy-data-portal-private/approve-private-endpoint.png" alt-text="Approve Managed private endpoint":::

Only a Managed private endpoint in an approved state can send traffic to a given private link resource.

## Interactive authoring
Interactive authoring capabilities is used for functionalities like test connection, browse folder list and table list, get schema, and preview data. You can enable interactive authoring when creating or editing an Azure Integration Runtime which is in ADF-managed virtual network. The backend service will pre-allocate compute for interactive authoring functionalities. Otherwise, the compute will be allocated every time any interactive operation is performed which will take more time. The Time To Live (TTL) for interactive authoring is 60 minutes, which means it will automatically become disabled after 60 minutes of the last interactive authoring operation.

:::image type="content" source="./media/managed-vnet/interactive-authoring.png" alt-text="Interactive authoring":::

## Activity execution time using managed virtual network
By design, Azure integration runtime in managed virtual network takes longer queue time than global Azure integration runtime as we are not reserving one compute node per data factory, so there is a warm up for each activity to start, and it occurs primarily on virtual network join rather than Azure integration runtime. For non-copy activities including pipeline activity and external activity, there is a 60 minutes Time To Live (TTL) when you trigger them at the first time. Within TTL, the queue time is shorter because the node is already warmed up. 
> [!NOTE]
> Copy activity doesn't have TTL support yet.

> [!NOTE]
> 2 DIU for Copy activity is not supported in managed virtual network.

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

> [!Note]
> For **groupId** of other data sources, you can get them from [private link resource](../private-link/private-endpoint-overview.md#private-link-resource).

## Limitations and known issues

### Supported data sources
The following data sources have native Private Endpoint support and can be connected through private link from ADF managed virtual network.
- Azure Blob Storage (not including Storage account V1)
- Azure Cognitive Search
- Azure Cosmos DB MongoDB API
- Azure Cosmos DB SQL API
- Azure Data Lake Storage Gen2
- Azure Database for MariaDB
- Azure Database for MySQL
- Azure Database for PostgreSQL
- Azure Files (not including Storage account V1)
- Azure Key Vault
- Azure Machine Learning
- Azure Private Link Service
- Azure Purview
- Azure SQL Database 
- Azure SQL Managed Instance - (public preview)
- Azure Synapse Analytics
- Azure Table Storage (not including Storage account V1)

> [!Note]
> You still can access all data sources that are supported by Data Factory through public network.

> [!NOTE]
> Because Azure SQL Managed Instance native Private Endpoint in public preview, you can access it from managed virtual network using Private Linked Service and Load Balancer. Please see [How to access SQL Managed Instance from Data Factory Managed VNET using Private Endpoint](tutorial-managed-virtual-network-sql-managed-instance.md).

### On-premises data sources
To access on-premises data sources from managed virtual network using Private Endpoint, please see this tutorial [How to access on-premises SQL Server from Data Factory Managed VNET using Private Endpoint](tutorial-managed-virtual-network-on-premise-sql-server.md).

### Azure Data Factory managed virtual network is available in the following Azure regions
Generally, managed virtual network is available to all Azure Data Factory regions, except:
- South India


### Outbound communications through public endpoint from ADF managed virtual network
- All ports are opened for outbound communications.

### Linked Service creation of Azure Key Vault 
- When you create a Linked Service for Azure Key Vault, there is no Azure Integration Runtime reference. So you can't create Private Endpoint during Linked Service creation of Azure Key Vault. But when you create Linked Service for data stores which references Azure Key Vault Linked Service and this Linked Service references Azure Integration Runtime with managed virtual network enabled, then you are able to create a Private Endpoint for the Azure Key Vault Linked Service during the creation. 
- **Test connection** operation for Linked Service of Azure Key Vault only validates the URL format, but doesn't do any network operation.
- The column **Using private endpoint** is always shown as blank even if you create Private Endpoint for Azure Key Vault.

### Linked Service creation of Azure HDI
- The column **Using private endpoint** is always shown as blank even if you create Private Endpoint for HDI using private link service and load balancer with port forwarding.

:::image type="content" source="./media/managed-vnet/akv-pe.png" alt-text="Private Endpoint for AKV":::

## Next steps

- Tutorial: [Build a copy pipeline using managed virtual network and private endpoints](tutorial-copy-data-portal-private.md) 
- Tutorial: [Build mapping dataflow pipeline using managed virtual network and private endpoints](tutorial-data-flow-private.md)
