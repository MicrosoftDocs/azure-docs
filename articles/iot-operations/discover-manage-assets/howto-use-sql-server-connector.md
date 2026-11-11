---
title: How to use the connector for SQL Server
description: Use the operations experience web UI or the Azure CLI to configure assets and devices for connections to SQL Server endpoints.
author: dominicbetts
ms.author: dobett
ms.service: azure-iot-operations
ms.subservice: azure-akri
ms.topic: how-to
ms.date: 11/05/2026
ai-usage: ai-assisted

#CustomerIntent: As an industrial edge IT or operations user, I want configure my Azure IoT Operations environment so that I can query data from SQL Server endpoints.
---

# Configure the connector for SQL Server

In Azure IoT Operations, the connector for SQL Server enables access to data from SQL Server endpoints, whether the SQL Server instance is hosted in the cloud or on-premises. After an IT administrator enables the connector template on an Azure IoT Operations instance, OT users can create assets that retrieve data by running SQL queries against SQL Server endpoints. This capability lets you retrieve operational or contextual data stored in SQL Server and use that data for enrichment, processing, and routing.

[!INCLUDE [iot-operations-asset-definition](../includes/iot-operations-asset-definition.md)]

[!INCLUDE [iot-operations-device-definition](../includes/iot-operations-device-definition.md)]

The following table summarizes the features the connector for SQL Server supports:

| Feature | Supported | Notes |
|---------|:---------:|-------|
| Username/password authentication | Yes | |
| X.509 user certificates (mTLS) | No | |
| Anonymous access | No | |
| Southbound certificate trust list | Yes | For secure TLS connections to the SQL Server endpoint |
| OpenTelemetry integration | Yes | |
| Automatic retries | Yes | Reports failed status for nonretryable errors |
| WASM data transformation | No | |
| Schema generation | Yes | Registers inferred schema with the schema registry |

For each configured dataset or event, the connector for SQL Server:

1. Samples data from the SQL Server endpoint using a configured SQL query and database.
1. Generates a message schema for each dataset or event based on the data it retrieves from the SQL Server instance, and registers it with the schema registry in Azure Device Registry.
1. Forwards the event or dataset data to the specified destination.

This article explains how to use the connector for SQL Server to perform tasks such as:

- Define the devices that connect SQL Server instances to your Azure IoT Operations instance.
- Add assets, and define the datasets and events to enable the data flow from the SQL Server source to the MQTT broker or the [broker state store](../develop-edge-apps/overview-state-store.md) (datasets only).

## Prerequisites

[!INCLUDE [prereq-deployed-instance](../includes/prereq-deployed-instance.md)]

[!INCLUDE [prereq-azure-cli](../includes/prereq-azure-cli.md)]

[!INCLUDE [iot-operations-entra-id-setup](../includes/iot-operations-entra-id-setup.md)]

Your IT administrator must configure the connector for SQL Server template for your Azure IoT Operations instance in the Azure portal.

You need the username and password of a dedicated, least-privilege SQL authentication account required to access and query your SQL Server instance. For details, see [Configure a device to use a username and password](#configure-a-device-to-use-a-username-and-password).

### SQL Server connector template instance

Before an OT user can create a device that uses the connector for SQL Server, an IT administrator must add a SQL Server connector template instance to your Azure IoT Operations instance. To learn more, see [Create and manage connector template instances](howto-manage-connector-templates.md).

## Configure a certificate trust list for the connector

[!INCLUDE [connector-certificate-application](../includes/connector-certificate-application.md)]

## Create a device

To configure the connector for SQL Server, first create a device that defines the connection to the SQL Server instance. The device includes the connection details of the SQL Server instance and the username and password credentials you need to access and query databases on the SQL Server instance:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Devices** in the left navigation pane. Then select **Create new** and select **Device** from the dropdown.

1. Enter a name for your device, such as `sql-connector`. To add the endpoint for the connector for SQL Server, select **New** on the **Microsoft.SqlServer 1.0** tile.

1. On the **Basic** tab, add the details of the endpoint for the connector for SQL Server including your username and password authentication credentials:

    :::image type="content" source="media/howto-use-sql-server-connector/add-sql-connector-endpoint.png" alt-text="Screenshot that shows how to add a connector for SQL Server endpoint." lightbox="media/howto-use-sql-server-connector/add-sql-connector-endpoint.png":::

   For details about configuring your username and password credentials, see [Configure a device to use a username and password](#configure-a-device-to-use-a-username-and-password).

1. Optionally, configure connection and query timeouts on the **Advanced** tab. The default for both is 30 seconds.

1. Select **Save** to save the endpoint.

1. On the **Device details** page, select **Next** to continue.

1. On the **Add custom property** page, add any other properties you want to associate with the device. Then select **Next** to continue.

1. On the **Summary** page, review the details of the device and select **Create** to create the device.

1. After the device is created, you can view it in the **Devices** list:

    :::image type="content" source="media/howto-use-sql-server-connector/sql-connector-device-created.png" alt-text="Screenshot that shows the list of devices." lightbox="media/howto-use-sql-server-connector/sql-connector-device-created.png":::

# [Azure CLI](#tab/cli)

Run the following commands:

1. Create a new device.

    ```azurecli
    az iot ops ns device create -n sql-connector -g {your resource group name} --instance {your instance name} 
    ```

1. Add an inbound endpoint for the SQL Server connector.

    ```azurecli
    az iot ops ns device endpoint inbound apply \
      --connector-type Microsoft.SqlServer \
      --instance {your instance name} \
      --resource-group {your resource group name} \
      --device sql-connector \
      --name sql-connector-0 \
      --endpoint-address "tcp:contoso-sql.azure-iot-operations.svc.cluster.local,1433" \
      --trust-list contoso-sql-ca \
      --user-ref contoso-sql-reader/username \
      --pass-ref contoso-sql-reader/password \
      --endpoint-config '{"endpointConfig":{"connectionTimeoutSeconds":30,"queryTimeoutSeconds":30}}'
    ```

    The `connector-type` parameter specifies the type of connector to use. For the SQL Server connector, the value is `Microsoft.SqlServer`.

    You must specify a username and password for the SQL Server connection. For details about configuring username and password secrets in Azure Key Vault and syncing them with your cluster, see [Configure a device to use a username and password](#configure-a-device-to-use-a-username-and-password).

    The endpoint configuration specified by the `endpoint-config` parameter has the following structure and can also be passed as a file containing the JSON configuration.

    ```json
    {
      "endpointConfig": {
        "connectionTimeoutSeconds": 30,
        "queryTimeoutSeconds": 30
      }
    }
    ```

    You can get a starter configuration template and the template schema by using the `show-template` parameter with the command.

To learn more, see the documentation for the [az iot ops ns device](/cli/azure/iot/ops/ns/device) command group.

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create a device with an inbound endpoint for the SQL Server connector. Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name:

```bicep
param adrNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource adrNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: adrNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource device 'Microsoft.DeviceRegistry/namespaces/devices@2026-04-01' = {
  name: 'sql-server-connector'
  parent: adrNamespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    endpoints: {
      outbound: {
        assigned: {}
      }
      inbound: {
        'sql-server-connector-0': {
          additionalConfiguration: string({
            connectionTimeoutSeconds: 30
            queryTimeoutSeconds: 30
          })
          address: 'tcp:contoso-sql.azure-iot-operations.svc.cluster.local,1433'
          authentication: {
            method: 'UsernamePassword'
            usernamePasswordCredentials: {
              passwordSecretName: 'contoso-sql-reader/password'
              usernameSecretName: 'contoso-sql-reader/username'
            }
          }
          endpointType: 'Microsoft.SqlServer'
          trustSettings: {
            trustList: 'contoso-sql-ca'
          }
          version: '1.0'
        }
      }
    }
  }
}
```

---

### Configure a device to use a username and password

To authenticate with the SQL Server instance, configure the username and password for a dedicated, least-privilege SQL authentication account. The account must be able to connect to each configured database and have `SELECT` permission on the tables or views referenced by its queries. Use a read-only account; administrative permissions and permissions to modify data aren't required. For example, for an existing user, `connector_user`:

```sql
USE [ContosoFoodsSynthetic];
GRANT SELECT ON OBJECT::dbo.sensor_readings TO [connector_user];
```

The connector doesn't enforce read-only SQL: it executes the supplied statement and warns about excessive permissions. Database permissions safeguard that the connector only has the necessary access to perform its queries.

To configure the `Username password` authentication mode, complete the following steps:

# [Operations experience](#tab/portal)

[!INCLUDE [connector-username-password-portal](../includes/connector-username-password-portal.md)]

# [Azure CLI](#tab/cli)

[!INCLUDE [connector-username-password-cli](../includes/connector-username-password-cli.md)]

# [Bicep](#tab/bicep)

[!INCLUDE [connector-username-password-bicep](../includes/connector-username-password-bicep.md)]

---

## Create an asset

To define an asset that queries data from the SQL Server endpoint, follow these steps:

# [Operations experience](#tab/portal)

1. In the operations experience web UI, select **Assets** in the left navigation pane. Then select **Create** and **Asset** from the dropdown.

1. Select the inbound endpoint for the connector for SQL Server that you created in the previous section.

1. Enter a name for your asset, such as `sql-server-asset`. Optionally, enter a description for your asset.

1. Add any custom properties you want to associate with the asset. Select **Next** to continue.

A dataset defines a SQL query and where the connector sends the data it retrieves. A SQL Server asset can have multiple datasets. To create a dataset:

1. Select **Create dataset**.

1. Enter the details for the dataset such as its name, data source, database, and destination. For SQL Server assets, the data source is the SQL query to execute against the specified database. The destination is either an MQTT topic or a [broker state store](../develop-edge-apps/overview-state-store.md) key.

    :::image type="content" source="media/howto-use-sql-server-connector/add-dataset.png" alt-text="Screenshot that shows how to add a dataset for SQL Server source." lightbox="media/howto-use-sql-server-connector/add-dataset.png":::

1. Select **Create** to create the dataset. Then select **Next** to continue to the event groups page.

    > [!TIP]
    > Use the **Manage default settings** tab to configure default dataset settings: database, sampling interval, and query timeout.

An event group defines where the connector sends the data it receives from a collection of events. Each event defines a query to execute against its configured SQL Server database. Events are produced by periodically executing the configured query, not by subscribing to database changes. Rows returned by successive executions can be published repeatedly. A SQL Server asset can have multiple event groups. To create an event group:

1. Select **Create event group**.

1. Enter a name for the event group.

1. Select **Create and next** to create the event group and go to the events page.

1. Select **Add event** to add an event to the group. For example:

    :::image type="content" source="media/howto-use-sql-server-connector/add-event.png" alt-text="Screenshot that shows how to add an event for SQL Server source." lightbox="media/howto-use-sql-server-connector/add-event.png":::

    Select **Add** to add the event.
  
    Add details for each event including the SQL query as the data source, the database to query, and the MQTT topic to publish to as the destination. When you're done adding events, select **Save** to save the event group and continue. When you're done adding all event groups, select **Next** to proceed to the review page.

1. On the **Review** page, review the details of the asset and select **Create** to create the asset. After a few minutes, the asset is listed on the **Assets** page:

    :::image type="content" source="media/howto-use-sql-server-connector/sql-asset-created.png" alt-text="Screenshot that shows the list of assets." lightbox="media/howto-use-sql-server-connector/sql-asset-created.png":::

# [Azure CLI](#tab/cli)

Run the following commands:

1. Create a SQL Server asset.

    ```azurecli
    az iot ops ns asset create  --connector-type Microsoft.SqlServer --name mysqlasset --instance {your instance name} -g {your resource group name} --device sql-connector --endpoint sql-connector-0
    ```

1. Add a dataset to the SQL Server asset.

    ```azurecli
    az iot ops ns asset dataset add \
      --name climate-readings \
      --asset mysqlasset \
      --instance {your instance name} \
      -g {your resource group name} \
      --data-source 'SELECT TOP 10 id, ts, temperature, humidity, is_synthetic FROM dbo.sensor_readings ORDER BY id DESC' \
      --dataset-config ./dataset_config.json
    ```

    The command references the dataset configuration file `dataset_config.json` that contains the configuration for the dataset being added. You can also specify the dataset configuration inline. The following JSON shows an example of the dataset configuration:

    ```json
    {
      "connectorType": "Microsoft.SqlServer",
      "datasetConfig": {
        "datasetConfiguration": {
          "database": "ContosoFoodsSynthetic",
          "queryTimeoutSeconds": 30,
          "samplingIntervalInMilliseconds": 1000
        },
        "destinations": [
          {
            "configuration": {
              "qos": "Qos1",
              "retain": "Never",
              "topic": "contoso/my-sql-test/readings",
              "ttl": null
            },
            "target": "Mqtt"
          }
        ]
      }
    }
    ```

1. Add an event group to the SQL Server asset.

    ```azurecli
    az iot ops ns asset event-group add --asset mysqlasset --instance {your instance name} -g {your resource group name} --name events
    ```

1. Add an event to the event group. Events are produced by periodically executing the configured query, not by subscribing to database changes. Rows returned by successive executions can be published repeatedly.

    ```azurecli
    az iot ops ns asset event add \
      --name temperature-event \
      --event-group events \
      --asset mysqlasset \
      --instance {your instance name} \
      -g {your resource group name} \
      --data-source 'SELECT TOP 10 id, ts, temperature, humidity, is_synthetic FROM dbo.sensor_readings ORDER BY id DESC' \
      --event-config ./event_config.json
    ```

    The command references the event configuration file `event_config.json` that contains the configuration for the event being added. You can also specify the event configuration inline. The following JSON shows an example of the event configuration:

    ```json
    {
      "connectorType": "Microsoft.SqlServer",
      "eventConfig": {
        "destinations": [
          {
            "configuration": {
              "qos": "Qos1",
              "retain": "Never",
              "topic": "contoso/my-sql-test/events",
              "ttl": null
            },
            "target": "Mqtt"
          }
        ],
        "eventConfiguration": {
          "database": "ContosoFoodsSynthetic",
          "queryTimeoutSeconds": 30,
          "samplingIntervalInMilliseconds": 1000
        }
      }
    }
    ```

Use the `show-template` parameter to get a starter configuration template and the template schema for most of the commands in this section.

To learn more, see the documentation for the [az iot ops ns asset](/cli/azure/iot/ops/ns/asset) command group.

# [Bicep](#tab/bicep)

Deploy the following Bicep template to create an asset that publishes messages from the device shown previously to MQTT topics. The template defines both a dataset and an event group for the asset. The data source of each dataset or event defines a SQL query statement to run against the database specified for that dataset or event. Events are produced by periodically executing the configured query, not by subscribing to database changes. Rows returned by successive executions can be published repeatedly. Datasets can also specify a key in the broker state store as a destination for the data.

Replace the placeholders `<AIO_NAMESPACE_NAME>` and `<CUSTOM_LOCATION_NAME>` with your Azure IoT Operations namespace name and custom location name respectively:

```bicep
param adrNamespaceName string = '<AIO_NAMESPACE_NAME>'
param customLocationName string = '<CUSTOM_LOCATION_NAME>'

resource adrNamespace 'Microsoft.DeviceRegistry/namespaces@2026-04-01' existing = {
  name: adrNamespaceName
}

resource customLocation 'Microsoft.ExtendedLocation/customLocations@2021-08-31-preview' existing = {
  name: customLocationName
}

resource asset 'Microsoft.DeviceRegistry/namespaces/assets@2026-04-01' = {
  name: 'my-sql-test'
  parent: adrNamespace
  location: resourceGroup().location
  extendedLocation: {
    type: 'CustomLocation'
    name: customLocation.id
  }
  properties: {
    displayName: 'my-sql-test'

    deviceRef: {
      deviceName: 'sql-server-connector'
      endpointName: 'sql-server-connector-0'
    }

    datasets: [
      {
        name: 'climate-readings'
        dataSource: 'SELECT TOP 10 id, ts, temperature, humidity, is_synthetic FROM dbo.sensor_readings ORDER BY id DESC'
        datasetConfiguration: '{"database":"ContosoFoodsSynthetic","queryTimeoutSeconds":30,"samplingIntervalInMilliseconds":1000}'
        destinations: [
          {
            target: 'Mqtt'
            configuration: {
              topic: 'contoso/my-sql-test/readings'
              qos: 'Qos1'
              retain: 'Never'
              ttl: 3600
            }
          }
        ]
      }
    ]

    eventGroups: [
      {
        name: 'events'
        events: [
          {
            name: 'temperature-event'
            dataSource: 'SELECT TOP 10 id, ts, temperature, humidity, is_synthetic FROM dbo.sensor_readings ORDER BY id DESC'
            eventConfiguration: '{"database":"ContosoFoodsSynthetic","queryTimeoutSeconds":30,"samplingIntervalInMilliseconds":1000}'
            destinations: [
              {
                target: 'Mqtt'
                configuration: {
                  topic: 'contoso/my-sql-test/events'
                  qos: 'Qos1'
                  retain: 'Never'
                }
              }
            ]
          }
        ]
      }
    ]
  }
}
```

---
