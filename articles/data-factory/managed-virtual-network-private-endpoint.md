---
title: Managed virtual network and managed private endpoints
description: Learn about managed virtual network and managed private endpoints in Azure Data Factory.
ms.author: lle
author: lrtoyou1223
ms.service: data-factory
ms.subservice: integration-runtime
ms.topic: conceptual
ms.custom: seo-lt-2019, references_regions, devx-track-azurepowershell
ms.date: 08/02/2023
---

# Azure Data Factory managed virtual network

[!INCLUDE[appliesto-adf-xxx-md](includes/appliesto-adf-xxx-md.md)]

This article explains managed virtual networks and managed private endpoints in Azure Data Factory.


## Managed virtual network

When you create an Azure integration runtime within a Data Factory managed virtual network, the integration runtime is provisioned with the managed virtual network. It uses private endpoints to securely connect to supported data stores.

Creating an integration runtime within a managed virtual network ensures the data integration process is isolated and secure.

Benefits of using a managed virtual network:

- With a managed virtual network, you can offload the burden of managing the virtual network to Data Factory. You don't need to create a subnet for an integration runtime that could eventually use many private IPs from your virtual network and would require prior network infrastructure planning.
- Deep Azure networking knowledge isn't required to do data integrations securely. Instead, getting started with secure ETL is much simpler for data engineers.
- A managed virtual network along with managed private endpoints protects against data exfiltration.

Currently, the managed virtual network is only supported in the same region as the Data Factory region.

> [!Note]
> An existing global integration runtime can't switch to an integration runtime in a Data Factory managed virtual network and vice versa.

:::image type="content" source="./media/managed-vnet/managed-vnet-architecture-diagram.png" alt-text="Diagram that shows Data Factory managed virtual network architecture.":::

There are two ways to enable managed virtual network in your data factory:
1. Enable managed virtual network during the creation of data factory.

:::image type="content" source="./media/managed-vnet/managed-vnet-creation-1.png" alt-text="Screenshot of enabling managed virtual network during the creation of data factory.":::

2. Enable managed virtual network in integration runtime.

:::image type="content" source="./media/managed-vnet/managed-vnet-creation-2.png" alt-text="Screenshot of enabling managed virtual network in integration runtime":::


## Managed private endpoints

Managed private endpoints are private endpoints created in the Data Factory managed virtual network that establishes a private link to Azure resources. Data Factory manages these private endpoints on your behalf.

Data Factory supports private links. You can use Azure private link to access Azure platform as a service (PaaS) services like Azure Storage, Azure Cosmos DB, and Azure Synapse Analytics.

When you use a private link, traffic between your data stores and managed virtual network traverses entirely over the Microsoft backbone network. Private link protects against data exfiltration risks. You establish a private link to a resource by creating a private endpoint.

A private endpoint uses a private IP address in the managed virtual network to effectively bring the service into it. Private endpoints are mapped to a specific resource in Azure and not the entire service. Customers can limit connectivity to a specific resource approved by their organization. For more information, see [Private links and private endpoints](../private-link/index.yml).

> [!NOTE]
> The resource provider Microsoft.Network must be registered to your subscription.

1. Make sure you enable managed virtual network in your data factory.
2. Create a new managed private endpoint in **Manage Hub**.

:::image type="content" source="./media/tutorial-copy-data-portal-private/new-managed-private-endpoint.png" alt-text="Screenshot that shows new managed private endpoints.":::

3. A private endpoint connection is created in a **Pending** state when you create a managed private endpoint in Data Factory. An approval workflow is initiated. The private link resource owner is responsible for approving or rejecting the connection.

:::image type="content" source="./media/tutorial-copy-data-portal-private/manage-private-endpoint.png" alt-text="Screenshot that shows the option Manage approvals in Azure portal.":::

4. If the owner approves the connection, the private link is established. Otherwise, the private link won't be established. In either case, the managed private endpoint is updated with the status of the connection.

:::image type="content" source="./media/tutorial-copy-data-portal-private/approve-private-endpoint.png" alt-text="Screenshot that shows approving a managed private endpoint.":::

Only a managed private endpoint in an approved state can send traffic to a specific private link resource.

> [!NOTE]
> Custom DNS is not supported in managed virtual network.

## Interactive authoring

Interactive authoring capabilities are used for functionalities like test connection, browse folder list and table list, get schema, and preview data. You can enable interactive authoring when creating or editing an Azure integration runtime, which is in Azure Data Factory managed virtual network. The backend service will pre-allocate compute for interactive authoring functionalities. Otherwise, the compute will be allocated every time any interactive operation is performed which will take more time. The time to live (TTL) for interactive authoring is 60 minutes by default, which means it will automatically become disabled after 60 minutes of the last interactive authoring operation. You can change the TTL value according to your actual needs.

:::image type="content" source="./media/managed-vnet/interactive-authoring.png" alt-text="Screenshot that shows interactive authoring.":::


## Time to live

### Copy activity

By default, every copy activity spins up a new compute based upon the configuration in copy activity. With managed virtual network enabled, cold computes start-up time takes a few minutes and data movement can't start until it's complete. If your pipelines contain multiple sequential copy activities or you have many copy activities in foreach loop and can’t run them all in parallel, you can enable a time to live (TTL) value in the Azure integration runtime configuration. Specifying a time to live value and DIU numbers required for the copy activity keeps the corresponding computes alive for a certain period of time after its execution completes. If a new copy activity starts during the TTL time, it will reuse the existing computes, and start-up time will be greatly reduced. After the second copy activity completes, the computes will again stay alive for the TTL time.
You have the flexibility to select from the pre-defined compute sizes, ranging from small to medium to large. Alternatively, you also have the option to customize the compute size based on your specific requirements and real-time needs.

> [!NOTE]
> Reconfiguring the DIU number will not affect the current copy activity execution. 

> [!NOTE]
> The data integration unit (DIU) measure of 2 DIU isn't supported for the Copy activity in a managed virtual network.

The DIU you select in TTL will be used to run all copy activities, the size of the DIU won't be auto-scaled according to actual needs. So you have to choose enough DIUs. 

> [!WARNING] 
> Selecting few DIUs to run many activities will cause many activities to be pending in the queue, which will seriously affect the overall performance.


### Pipeline and external activity

Similar to the copy, you have the ability to tailor the compute size and TTL duration according to your specific requirements. However, unlike the copy, please note that pipeline and external TTL cannot be disabled.

> [!NOTE]
> Time to live (TTL) is only applicable to managed virtual network.

:::image type="content" source="./media/managed-vnet/time-to-live-configuration.png" alt-text="Screenshot that shows the TTL configuration.":::


### Comparison of different TTL

The following table lists the differences between different types of TTL：

| Feature | Interactive authoring | Copy compute scale | Pipeline & External compute scale |
| ----------------- | ---------- | -------- | --------------- |
| When to take effect |	Immediately after enablement | First activity execution | First activity execution |
| Can be disabled | Y | Y | N |
| Reserved compute is configurable | N | Y | Y |

> [!NOTE]
> You can't enable TTL in default auto-resolve Azure integration runtime. You can create a new Azure integration runtime for it.

## Create a managed virtual network via Azure PowerShell

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

# Create integration runtime resource enabled with virtual network
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
> You can get the **groupId** of other data sources from a [private link resource](../private-link/private-endpoint-overview.md#private-link-resource).


## Outbound connection

### Supported data sources and services

The following services have native private endpoint support. They can be connected through private link from a Data Factory managed virtual network:

- Azure Databricks
- Azure Functions (Premium plan)
- Azure Key Vault
- Azure Machine Learning
- Azure Private Link
- Microsoft Purview

For the support of data sources, you can refer to [connector overview](connector-overview.md). You can access all data sources that are supported by Data Factory through a public network.


### On-premises data sources

To learn how to access on-premises data sources from a managed virtual network by using a private endpoint, see [Access on-premises SQL Server from a Data Factory managed virtual network using a private endpoint](tutorial-managed-virtual-network-on-premise-sql-server.md).


### Outbound communications through public endpoint from a Data Factory managed virtual network

All ports are opened for outbound communications.


## Limitations and known issues

### Linked service creation for Key Vault

When you create a linked service for Key Vault, there's no integration runtime reference. So, you can't create private endpoints during linked service creation of Key Vault. But when you create linked service for data stores that references Key Vault, and this linked service references an integration runtime with managed virtual network enabled, you can create a private endpoint for Key Vault during creation.

- **Test connection:** This operation for a linked service of Key Vault only validates the URL format but doesn't do any network operation.
- **Using private endpoint:** This column is always shown as blank even if you create a private endpoint for Key Vault.


### Linked service creation of Azure HDInsight

The column **Using private endpoint** is always shown as blank even if you create a private endpoint for HDInsight by using a private link service and a load balancer with port forwarding.

:::image type="content" source="./media/managed-vnet/akv-pe.png" alt-text="Screenshot that shows a private endpoint for Key Vault.":::

### Fully Qualified Domain Name ( FQDN ) of Azure HDInsight

If you created a custom private link service, FQDN should end with **azurehdinsight.net**  without leading *privatelink* in domain name when you create a private end point. If you use privatelink in domain name, make sure it is valid and you are able to resolve it.  

### Access constraints in managed virtual network with private endpoints
You're unable to access each PaaS resource when both sides are exposed to Private Link and a private endpoint. This issue is a known limitation of Private Link and private endpoints.

For example, you have a managed private endpoint for storage account A. You can also access storage account B through public network in the same managed virtual network. But when storage account B has a private endpoint connection from other managed virtual network or customer virtual network, then you can't access storage account B in your managed virtual network through public network.

## Next steps

See the following tutorials:

- [Build a copy pipeline using managed virtual network and private endpoints](tutorial-copy-data-portal-private.md)
- [Build mapping dataflow pipeline using managed virtual network and private endpoints](tutorial-data-flow-private.md)
