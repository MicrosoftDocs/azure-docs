---
title: Export data to Azure Data Explorer IoT Central
description: Learn how to use the IoT Central data export capability to continuously export your IoT data to Azure Data Explorer
services: iot-central
author: dominicbetts
ms.author: dobett
ms.date: 05/22/2023
ms.topic: how-to
ms.service: iot-central
---

# Export IoT data to Azure Data Explorer

This article describes how to configure data export to send data to the Azure Data Explorer.

[!INCLUDE [iot-central-data-export](../../../includes/iot-central-data-export.md)]

## Set up an Azure Data Explorer export destination

You can use an [Azure Data Explorer cluster](/azure/data-explorer/data-explorer-overview) or an [Azure Synapse Data Explorer pool](../../synapse-analytics/data-explorer/data-explorer-overview.md). To learn more, see [What is the difference between Azure Synapse Data Explorer and Azure Data Explorer?](../../synapse-analytics/data-explorer/data-explorer-compare.md).

IoT Central exports data in near real time to a database table in the Azure Data Explorer cluster. The data is in the message body and is in JSON format encoded as UTF-8. You can add a [Transform](howto-transform-data-internally.md) in IoT Central to export data that matches the table schema.

To query the exported data in the Azure Data Explorer portal, navigate to the database and select **Query**.

The following video walks you through exporting data to Azure Data Explorer:

> [!VIDEO https://aka.ms/docs/player?id=9e0c0e58-2753-42f5-a353-8ae602173d9b]

## Connection options

Azure Data Explorer destinations let you configure the connection with a *service principal* or a [managed identity](../../active-directory/managed-identities-azure-resources/overview.md).

[!INCLUDE [iot-central-managed-identities](../../../includes/iot-central-managed-identities.md)]

### Create an Azure Data Explorer destination

# [Service principal](#tab/service-principal)

If you don't have an existing Azure Data Explorer database to export to, follow these steps:

1. You have two choices to create an Azure Data Explorer database:

    - Create a new Azure Data Explorer cluster and database. To learn more, see the [Azure Data Explorer quickstart](/azure/data-explorer/create-cluster-database-portal). Make a note of the cluster URI and the name of the database you create, you need these values in the following steps.
    - Create a new Azure Synapse Data Explorer pool and database. To learn more, see the [Azure Data Explorer quickstart](../../synapse-analytics/get-started-analyze-data-explorer.md). Make a note of the pool URI and the name of the database you create, you need these values in the following steps.

1. Create a service principal that you can use to connect your IoT Central application to Azure Data Explorer. Use the Azure Cloud Shell to run the following command:

    ```azurecli
    az ad sp create-for-rbac --skip-assignment --name "My SP for IoT Central" --scopes /subscriptions/<SubscriptionId>
    ```

    Make a note of the `appId`, `password`, and `tenant` values in the command output, you need them in the following steps.

1. To add the service principal to the database, navigate to the Azure Data Explorer portal and run the following query on your database. Replace the placeholders with the values you made a note of previously:

    ```kusto
    .add database ['<YourDatabaseName>'] admins ('aadapp=<YourAppId>;<YourTenant>');
    ```

1. Create a table in your database with a suitable schema for the data you're exporting. The following example query creates a table called `smartvitalspatch`. To learn more, see [Transform data inside your IoT Central application for export](howto-transform-data-internally.md):

    ```kusto
    .create table smartvitalspatch (
      EnqueuedTime:datetime,
      Message:string,
      Application:string,
      Device:string,
      Simulated:boolean,
      Template:string,
      Module:string,
      Component:string,
      Capability:string,
      Value:dynamic
    )
    ```

1. (Optional) To speed up ingesting data into your Azure Data Explorer database:

    1. Navigate to the **Configurations** page for your Azure Data Explorer cluster. Then enable the **Streaming ingestion** option.
    1. Run the following query to alter the table policy to enable streaming ingestion:

        ```kusto
        .alter table smartvitalspatch policy streamingingestion enable
        ```

To create the Azure Data Explorer destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Data Explorer** as the destination type.

1. Enter your Azure Data Explorer cluster or pool URL, database name, and table name. The following table shows the service principal values to use for the authorization:

    | Service principal value | Destination configuration |
    | ----------------------- | ------------------------- |
    | appId                   | ClientID                  |
    | tenant                  | Tenant ID                 |
    | password                | Client secret             |

    > [!TIP]
    > The cluster URL for a standalone Azure Data Explorer looks like `https://<ClusterName>.<AzureRegion>.kusto.windows.net`. The cluster URL for an Azure Synapse Data Explorer pool looks like `https://<DataExplorerPoolName>.<SynapseWorkspaceName>.kusto.azuresynapse.net`.

    :::image type="content" source="media/howto-export-data/export-destination.png" alt-text="Screenshot of Azure Data Explorer export destination that uses a service principal.":::

# [Managed identity](#tab/managed-identity)

This article shows how to create a managed identity using the Azure CLI. You can also use the Azure portal to create a managed identity.

If you don't have an existing Azure Data Explorer database to export to, follow these steps. You have two choices to create an Azure Data Explorer database:

- Create a new Azure Data Explorer cluster and database. To learn more, see the [Azure Data Explorer quickstart](/azure/data-explorer/create-cluster-database-portal). Make a note of the cluster URI and the name of the database you create, you need these values in the following steps.
- Create a new Azure Synapse Data Explorer pool and database. To learn more, see the [Azure Data Explorer quickstart](../../synapse-analytics/get-started-analyze-data-explorer.md). Make a note of the pool URI and the name of the database you create, you need these values in the following steps.

To configure the managed identity that enables your IoT Central application to securely export data to your Azure resource:

1. Create a managed identity for your IoT Central application to use to connect to your database. Use the Azure Cloud Shell to run the following command:

    ```azurecli
    az iot central app identity assign --name {your IoT Central app name} \
        --resource-group {resource group name} \
        --system-assigned
    ```

    Make a note of the `principalId` and `tenantId` output by the command. You use these values in the following step.

1. Configure the database permissions to allow connections from your IoT Central application. Use the Azure Cloud Shell to run the following command:

    ```azurecli
    az kusto database-principal-assignment create --cluster-name {name of your cluster} \
        --database-name {name of your database}    \
        --resource-group {resource group name} \
        --principal-assignment-name {name of your IoT Central application} \
        --principal-id {principal id from the previous step} \
        --principal-type App --role Admin \
        --tenant-id {tenant id from the previous step}
    ```

    > [!TIP]
    > If you're using Azure Synapse, see [`az synapse kusto database-principal-assignment`](/cli/azure/synapse/kusto/database-principal-assignment).

1. Create a table in your database with a suitable schema for the data you're exporting. The following example query creates a table called `smartvitalspatch`. To learn more, see [Transform data inside your IoT Central application for export](howto-transform-data-internally.md):

    ```kusto
    .create table smartvitalspatch (
      EnqueuedTime:datetime,
      Message:string,
      Application:string,
      Device:string,
      Simulated:boolean,
      Template:string,
      Module:string,
      Component:string,
      Capability:string,
      Value:dynamic
    )
    ```

1. (Optional) To speed up ingesting data into your Azure Data Explorer database:

    1. Navigate to the **Configurations** page for your Azure Data Explorer cluster. Then enable the **Streaming ingestion** option.
    1. Run the following query to alter the table policy to enable streaming ingestion:

        ```kusto
        .alter table smartvitalspatch policy streamingingestion enable
        ```

To create the Azure Data Explorer destination in IoT Central on the **Data export** page:

1. Select **+ New destination**.

1. Select **Azure Data Explorer** as the destination type.

1. Enter your Azure Data Explorer cluster or pool URL, database name, and table name. Select **System-assigned managed identity** as the authorization type.

    > [!TIP]
    > The cluster URL for a standalone Azure Data Explorer looks like `https://<ClusterName>.<AzureRegion>.kusto.windows.net`. The cluster URL for an Azure Synapse Data Explorer pool looks like `https://<DataExplorerPoolName>.<SynapseWorkspaceName>.kusto.azuresynapse.net`.

    :::image type="content" source="media/howto-export-data/export-destination-managed.png" alt-text="Screenshot of Azure Data Explorer export destination that uses a managed identity.":::

If you don't see data arriving in your destination service, see [Troubleshoot issues with data exports from your Azure IoT Central application](troubleshoot-data-export.md).

---

[!INCLUDE [iot-central-data-export-setup](../../../includes/iot-central-data-export-setup.md)]

[!INCLUDE [iot-central-data-export-message-properties](../../../includes/iot-central-data-export-message-properties.md)]

[!INCLUDE [iot-central-data-export-device-connectivity](../../../includes/iot-central-data-export-device-connectivity.md)]

[!INCLUDE [iot-central-data-export-device-lifecycle](../../../includes/iot-central-data-export-device-lifecycle.md)]

[!INCLUDE [iot-central-data-export-device-template](../../../includes/iot-central-data-export-device-template.md)]

[!INCLUDE [iot-central-data-export-audit-logs](../../../includes/iot-central-data-export-audit-logs.md)]

## Next steps

Now that you know how to export to Azure Data Explorer, a suggested next step is to learn [Export to Webhook](howto-export-to-webhook.md).
