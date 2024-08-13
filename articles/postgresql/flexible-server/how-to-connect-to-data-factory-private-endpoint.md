---
title: Connect from an Azure Data Factory pipeline using Azure Private Link
description: This article describes how to connect from Azure Data Factory to an instance of Azure Database for PostgreSQL - Flexible Server using Private Link.
author: techlake
ms.author: hganten
ms.reviewer: maghan
ms.date: 07/14/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: how-to
---

# Connect from Azure Data Factory to an instance of Azure Database for PostgreSQL - Flexible Server via Private Link

[!INCLUDE [applies-to-postgresql-flexible-server](~/reusable-content/ce-skilling/azure/includes/postgresql/includes/applies-to-postgresql-flexible-server.md)]

In this article, you create a linked service in Azure Data Factory to connect to an instance of Azure Database for PostgreSQL flexible server using a private endpoint.

[Azure Data Factory](../../data-factory/introduction.md) is a fully managed, serverless data integration service built to orchestrate and operationalize complex hybrid extract-transform-load (ETL), extract-load-transform (ELT), and data integration projects. An Azure [integration runtime](../../data-factory/concepts-integration-runtime.md#azure-integration-runtime) supports connecting to data stores and compute services with public accessible endpoints. If you enable the managed virtual network feature of an Azure integration runtime, it supports connecting to data stores using Azure Private Link service in private network environments.

Data Factory offers an [Azure Database for PostgreSQL](../../data-factory/connector-azure-database-for-postgresql.md) connector with [support for various capabilities](../../data-factory/connector-azure-database-for-postgresql.md#supported-capabilities), depending on the integration runtime selected.

## Prerequisites

- An Azure Database for PostgreSQL flexible server instance with its network connectivity method configured as **Public access (allowed IP addresses)** so that you can create [private endpoints](../flexible-server/concepts-networking-private-link.md) to connect to it privately using Azure Private Link.
- An Azure integration runtime [created within a managed virtual network](../../data-factory/managed-virtual-network-private-endpoint.md).

## Create a private endpoint in Data Factory

Using the [Azure Database for PostgreSQL connector](../../data-factory/connector-azure-database-for-postgresql.md) you can connect to an instance of Azure Database for PostgreSQL flexible server routing all traffic privately, through a managed private endpoint.

You can create the managed private endpoint using the user interface provided for such purpose in the **Managed private endpoints** option, under the **Security** section of the **Manage** hub of [Azure Data Factory Studio](https://adf.azure.com), as described in [managed private endpoints](../../data-factory/managed-virtual-network-private-endpoint.md#managed-private-endpoints). As an alternative, you can use the corresponding Azure CLI command, [az datafactory managed-private-endpoint create](/cli/azure/datafactory/managed-private-endpoint), to create a managed private endpoint in Azure Data Factory.

After successfully provisioned, the managed private endpoint shows like this in the **Managed private endpoints** page of [Azure Data Factory Studio](https://adf.azure.com):

:::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen-provisioned.png" alt-text="Screenshot that presents the Managed private endpoints page in Azure Data Factory Studio showing a private endpoint, which is successfully provisioned and pending approval." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen-provisioned.png":::

## Approve a private endpoint

After you provision a private endpoint, you must approve it before incoming traffic through it is permitted. If you have access to the instance of Azure Data Factory and also have permissions to approve private endpoints created against the instance of Azure Database for PostgreSQL flexible server, you can use the **Managed private endpoints** page of [Azure Data Factory Studio](https://adf.azure.com), select the name of the managed private endpoint and, on the opening pane, select **Manage approvals in Azure portal**.

:::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen-approval.png" alt-text="Screenshot that presents the Managed private endpoints page in Azure Data Factory Studio showing how to approve an endpoint." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen-approval.png":::

The previous action takes you to the **Networking** page of the instance of Azure Database for PostgreSQL flexible server to which your Azure Data Factory managed private endpoint is pointing to.

If you don't have permissions to approve the private endpoint, ask someone with such permissions to approve the endpoint for you.

:::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen-approving.png" alt-text="Screenshot that presents the Networking page of Azure Database for PostgreSQL Flexible Server showing how to approve a private endpoint." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen-approving.png":::

It may take several minutes for Data Factory to discover that the private endpoint is approved.

When the managed private endpoint is successfully provisioned and approved, it shows like this in the **Managed private endpoints** page of [Azure Data Factory Studio](https://adf.azure.com):

:::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen-approved.png" alt-text="Screenshot that presents the Managed private endpoints page in Azure Data Factory Studio showing successfully provisioned and approved private endpoint." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/managed-private-endpoints-screen-approved.png":::

## Add a Linked Service in Data Factory to your instance of Azure Database for PostgreSQL flexible server 

With the private endpoint provisioned and approved, you can finally use the Azure Database for PostgreSQL connector in Azure Data Factory to create a linked service so that you can connect to your instance of Azure Database for PostgreSQL flexible server.

1. In [Azure Data Factory Studio](https://adf.azure.com) select the **Manage** hub and, under the **Connections** section, select **Linked services**, and select **New** to create a new linked service:

   :::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/data-factory-linked-service-create.png" alt-text="Screenshot that shows how to create a new linked service in Azure Data Factory." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/data-factory-linked-service-create.png":::

1. Fill all required fields for the connector. Make sure that the integration runtime selected is the one on which you created the private endpoint in its managed virtual network. Also, make sure that the **Interactive authoring** feature is enabled on that integration runtime so that you can test the connection when all required information is provided.

   :::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/data-factory-linked-service-create-postgresql-integration-runtime.png" alt-text="Screenshot that shows where to select integration runtime with managed virtual network." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/data-factory-linked-service-create-postgresql-integration-runtime.png":::

1. Select an **Encryption method**. If you select **No encryption**, the connection only succeeds if the server parameter [require_secure_transport](./server-parameters-table-tls.md?#require_secure_transport) is set to `off`, which is not a recommended practice since it relaxes security.

   :::image type="content" source="./media/how-to-connect-to-data-factory-private-endpoint/data-factory-linked-service-create-postgresql-encryption-method.png" alt-text="Screenshot that shows options available for the encryption method field." lightbox="./media/how-to-connect-to-data-factory-private-endpoint/data-factory-linked-service-create-postgresql-encryption-method.png":::

1. Select **Test connection**. A **Connection successful** message should appear next to the **Test connection** button.

## Next step

> [!div class="nextstepaction"]
> [Networking with Private Link in Azure Database for PostgreSQL - Flexible Server](concepts-networking-private-link.md)
