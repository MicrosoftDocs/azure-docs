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

In this quickstart, you connect your Azure Database for PostgreSQL flexible server instance to Azure hosted Data Factory pipeline via Private Link. 


## Azure hosted Data Factory with private (VNET) networking


**[Azure Data Factory](../../data-factory/introduction.md)** is a fully managed, easy-to-use, serverless data integration, and transformation solution to ingest and transform all your data. Data Factory offers three types of Integration Runtime (IR), and you should choose the type that best serves your data integration capabilities and network environment requirements. The three types of IR are:

* Azure
* Self-hosted
* Azure-SSIS

**[Azure Integration Runtime](../../data-factory/concepts-integration-runtime.md#azure-integration-runtime)** supports connecting to data stores and computes services with public accessible endpoints. Enabling Managed Virtual Network, Azure Integration Runtime supports connecting to data stores using private link service in private network environment. [Azure Database for PostgreSQL flexible server provides for private link connectivity in preview](../flexible-server/concepts-networking-private-link.md). 

## Prerequisites

* An Azure Database for PostgreSQL flexible server instance [privately networked via Azure Private Link](../flexible-server/concepts-networking-private-link.md).
* An Azure integration runtime within a [data factory managed virtual network](../../data-factory/data-factory-private-link.md)


## Create Private Endpoint in Azure Data Factory

Unfortunately at this time using Azure Database for PostgreSQL flexible server connector in ADF you may get an error when trying to connect to privately networked Azure Database for PostgreSQL flexible server, as connector supports **public connectivity only**.
To work around this limitation, we can use Azure CLI to create a private endpoint first and then use the Data Factory user interface with Azure Database for PostgreSQL flexible server connector to create  connection between privately networked Azure Database for PostgreSQL flexible server and Azure Data Factory in managed virtual network. 
Example below creates private endpoint in Azure data factory, you substitute with your own values placeholders for *subscription_id,resource_group_name, azure_data_factory_name,endpoint_name,flexible_server_name*:

```azurecli
az resource create --id /subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.DataFactory/factories/<azure_data_factory_name>/managedVirtualNetworks/default/managedPrivateEndpoints/<endpoint_name> --properties '
{
  "privateLinkResourceId": "/subscriptions/<subscription_id>/resourceGroups/<resource_group_name>/providers/Microsoft.DBforPostgreSQL/flexibleServers/<flexible_server_name>", 
  "groupId": "postgresqlServer" 
}'

```
> [!NOTE]
> Alternative command to create private endpoint in data factory using Azure CLI is [az datafactory managed-private-endpoint create](https://learn.microsoft.com/cli/azure/datafactory/managed-private-endpoint?view=azure-cli-latest#az-datafactory-managed-private-endpoint-create)

After above command is successfully executed you should be able to view  private endpoint in Managed Private Endpoints blade in Data Factory Azure portal interface, as shown in the following example:

 :::image type="content" source="./media/howto-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen.png" alt-text="Example screenshot of managed private endpoints screen."  :::


## Approve Private Endpoint 

Once the private endpoint is provisioned, we can follow the "Manage approvals In Azure portal" link in the Private Endpoint details screen to approve the private endpoint. It takes several minutes for ADF to discover that it's now approved. 


## Adding Azure Database for PostgreSQL flexible server networked server data source in data factory

When both provisioning succeeded and the endpoint are approved, we can finally create connection to PGFlex using Azure Database for PostgreSQL flexible server ADF connector.
1. After following previous steps, when selecting the server for which we created the private endpoint, the private endpoint gets selected automatically as well. 
2. Next,  select database, enter username/password and be sure to select "SSL" as encryption method, as shown in the following example:
   :::image type="content" source="./media/howto-connect-to-data-factory-private-endpoint/data-factory-data-source-connection.png" alt-text="Example screenshot of connection properties."  :::
1. Select test connection. You should see "Connection Successful" message next to test connection button.
    
## Next steps

- Learn more about [networking with Private Link in Azure Database for PostgreSQL - Flexible Server](./concepts-networking-private-link.md).

