---
title: Connect to Azure Data Factory privately networked pipeline using Azure Private Link
description: This article describes how to connect to Azure Data Factory privately networked pipeline with Azure Database for PostgreSQL - Flexible Server using Azure Private Link.
author: gennadNY
ms.author: gennadyk
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
ms.date: 12/11/2023
---


# Connect to Azure Data Factory privately networked pipeline with Azure Database for PostgreSQL - Flexible Server using Azure Private Link

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this quickstart, you connect your Azure Database for PostgreSQL flexible server instance to an Azure-hosted Azure Data Factory pipeline via Private Link. 


## Azure hosted Data Factory with private (VNET) networking


**[Azure Data Factory](../../data-factory/introduction.md)** is a fully managed, easy-to-use, serverless data integration, and transformation solution to ingest and transform all your data. Data Factory offers three types of Integration Runtime (IR), and you should choose the type that best serves your data integration capabilities and network environment requirements. The three types of IR are:

* Azure
* Self-hosted
* Azure-SSIS

**[Azure Integration Runtime](../../data-factory/concepts-integration-runtime.md#azure-integration-runtime)** supports connecting to data stores and computes services with public accessible endpoints. Enabling Managed Virtual Network, Azure Integration Runtime supports connecting to data stores using private link service in private network environment. [Azure Database for PostgreSQL flexible server provides for private link connectivity in preview](../flexible-server/concepts-networking-private-link.md). 

## Prerequisites

* An Azure Database for PostgreSQL flexible server instance [privately networked via Azure Private Link](../flexible-server/concepts-networking-private-link.md).
* An Azure integration runtime within a [data factory managed virtual network](../../data-factory/data-factory-private-link.md)


## Create private endpoint in Azure Data Factory

Unfortunately at this time using Azure Database for PostgreSQL flexible server connector in Data Factory you may get an error when trying to connect to privately networked Azure Database for PostgreSQL flexible server, as connector supports **public connectivity only**.
To work around this limitation, you can use Azure CLI to create a private endpoint first and then use the Data Factory user interface with Azure Database for PostgreSQL flexible server connector to create a connection between privately networked Azure Database for PostgreSQL flexible server and Azure Data Factory in a managed virtual network. 
The following example creates a private endpoint in Azure Data Factory. Substitute your own values in the placeholders for *subscription_id, resource_group_name, azure_data_factory_name, endpoint_name, flexible_server_name*.

```azurecli
az resource create --id /subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.DataFactory/factories/<azure_data_factory_name>/managedVirtualNetworks/default/managedPrivateEndpoints/<endpoint_name> --properties '
{
  "privateLinkResourceId": "/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<flexible_server_name>", 
  "groupId": "postgresqlServer" 
}'

```
> [!NOTE]
> An alternative command to create a private endpoint in Data Factory using Azure CLI is [az datafactory managed-private-endpoint create](/cli/azure/datafactory/managed-private-endpoint#az-datafactory-managed-private-endpoint-create).

After the preceding command successfully executes, you should be able to view the private endpoint in the Managed Private Endpoints blade in the Data Factory Azure portal interface, as shown in the following example:

 :::image type="content" source="./media/howto-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen.png" alt-text="Example screenshot of managed private endpoints screen."  :::


## Approve private endpoint 

Once the private endpoint is provisioned, you can follow the **Manage approvals In Azure portal** link in the Private Endpoint details screen to approve the private endpoint. It takes several minutes for Data Factory to discover that it's now approved. 


## Add Azure Database for PostgreSQL flexible server networked server data source in Data Factory

When provisioning succeeds and the endpoint is approved, you can finally create a connection to PGFlex using the Azure Database for PostgreSQL flexible server ADF connector.
1. After following the preceding steps, when you select the server you created the private endpoint for, the private endpoint is also selected automatically. 
2. Next,  select database, enter username/password, and be sure to select **SSL** as encryption method, as shown in the following example:
   :::image type="content" source="./media/howto-connect-to-data-factory-private-endpoint/data-factory-data-source-connection.png" alt-text="Example screenshot of connection properties."  :::
1. Select **Test connection**. You should see a **Connection successful** message next to the **Test connection** button.
    
## Next steps

- Learn more about [networking with Private Link in Azure Database for PostgreSQL - Flexible Server](concepts-networking-private-link.md).

