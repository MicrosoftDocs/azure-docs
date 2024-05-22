---
title: Connect to Azure Data Factory privately networked pipeline using Azure Private Link
description: This article describes how to connect Azure Database for PostgreSQL - Flexible Server to an Azure-hosted Data Factory pipeline via Private Link.
author: gennadNY
ms.author: gennadyk
ms.reviewer: maghan
ms.date: 04/27/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: how-to
---

# Connect to an Azure Data Factory privately networked pipeline with Azure Database for PostgreSQL - Flexible Server by using Azure Private Link

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

In this article, you connect Azure Database for PostgreSQL flexible server to an Azure Data Factory pipeline via Azure Private Link.

[Azure Data Factory](../../data-factory/introduction.md) is a fully managed, serverless solution to ingest and transform data. An Azure [integration runtime](../../data-factory/concepts-integration-runtime.md#azure-integration-runtime) supports connecting to data stores and compute services with public accessible endpoints. When you enable a managed virtual network, an integration runtime supports connecting to data stores by using the Azure Private Link service in a private network environment.

Data Factory offers three types of integration runtimes:

- Azure
- Self-hosted
- Azure-SQL Server Integration Services (Azure-SSIS)

Choose the type that best serves your data integration capabilities and network environment requirements.

## Prerequisites

- An Azure Database for PostgreSQL flexible server instance that's [privately networked via Azure Private Link](../flexible-server/concepts-networking-private-link.md)
- An Azure integration runtime within a [Data Factory managed virtual network](../../data-factory/data-factory-private-link.md)

## Create a private endpoint in Data Factory

An Azure Database for PostgreSQL connector currently supports *public connectivity only*. When you use an Azure Database for PostgreSQL connector in Azure Data Factory, you might get an error when you try to connect to a privately networked instance of Azure Database for PostgreSQL flexible server.

To work around this limitation, you can use the Azure CLI to create a private endpoint first. Then you can use the Data Factory user interface with the Azure Database for PostgreSQL connector to create a connection between privately networked Azure Database for PostgreSQL flexible server and Azure Data Factory in a managed virtual network.  

The following example creates a private endpoint in Azure Data Factory. Substitute the placeholders *subscription_id*, *resource_group_name*, *azure_data_factory_name*, *endpoint_name*, and *flexible_server_name* with your own values.

```azurecli
az resource create --id /subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.DataFactory/factories/<azure_data_factory_name>/managedVirtualNetworks/default/managedPrivateEndpoints/<endpoint_name> --properties '
{
  "privateLinkResourceId": "/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<flexible_server_name>",
  "groupId": "postgresqlServer"
}'
```
> [!NOTE]  
> An alternative command to create a private endpoint in Data Factory by using the Azure CLI is [az datafactory managed-private-endpoint create](/cli/azure/datafactory/managed-private-endpoint).

After you successfully run the preceding command, you can view the private endpoint in the Azure portal by going to **Data Factory** > **Managed private endpoints**. The following screenshot shows an example.

:::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen.png" alt-text="Example screenshot of the pane for managed private endpoints in the Azure portal." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen.png":::

## Approve a private endpoint

After you provision a private endpoint, you can approve it by following the **Manage approvals in Azure portal** link in the endpoint details. It takes several minutes for Data Factory to discover that the private endpoint is approved.

## Add a networked server data source in Data Factory

When provisioning succeeds and the endpoint is approved, you can finally create a connection to PGFlex using the Azure Database for PostgreSQL flexible server Data Factory connector.

In the preceding steps, when you selected the server for which you created the private endpoint, the private endpoint was also selected automatically.

1. Select a database, enter a username and password, and select **SSL** as the encryption method. The following screenshot shows an example.

   :::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/data-factory-data-source-connection.png" alt-text="Example screenshot of connection properties." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/data-factory-data-source-connection.png":::

1. Select **Test connection**. A **Connection successful** message should appear next to the **Test connection** button.

## Next step

> [!div class="nextstepaction"]
> [Networking with Private Link in Azure Database for PostgreSQL - Flexible Server](concepts-networking-private-link.md)
