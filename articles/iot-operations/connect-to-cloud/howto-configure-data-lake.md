---
title: Send data from Azure IoT MQ to Data Lake Storage
# titleSuffix: Azure IoT MQ
description: Learn how to send data from Azure IoT MQ to Data Lake Storage.
author: PatAltimore
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 11/01/2023

#CustomerIntent: As an operator, I want to understand how to configure Azure IoT MQ so that I can send data from Azure IoT MQ to Data Lake Storage.
---

# Send data from Azure IoT MQ to Data Lake Storage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can use the data lake connector to send data from Azure IoT MQ broker to a data lake, like Azure Data Lake Storage Gen2 (ADLSv2) and Microsoft Fabric OneLake. The connector subscribes to MQTT topics and ingests the messages into Delta tables in the Data Lake Storage account.

## What's supported

| Feature                                   | Supported |
| ----------------------------------------- | --------- |
| Send data to Azure Data Lake Storage Gen2 | Supported |
| Send data to local storage                | Supported |
| Send data Microsoft Fabric OneLake        | Supported |
| Use SAS token for authentication          | Supported |
| Use managed identity for authentication   | Supported |
| Delta format                              | Supported |
| Parquet format                            | Supported |
| JSON message payload                      | Supported |
| Create new container if doesn't exist     | Supported |
| Signed types support                      | Supported |
| Unsigned types support                    | Not Supported |

## Prerequisites

- A Data Lake Storage account in Azure with a container and a folder for your data. For more information about creating a Data Lake Storage, use one of the following quickstart options:
    - Microsoft Fabric OneLake quickstart:
        - [Create a workspace](/fabric/get-started/create-workspaces) since the default *my workspace* isn't supported.
        - [Create a lakehouse](/fabric/onelake/create-lakehouse-onelake).
    - Azure Data Lake Storage Gen2 quickstart:
        - [Create a storage account to use with Azure Data Lake Storage Gen2](/azure/storage/blobs/create-data-lake-storage-account).

- An IoT MQ MQTT broker. For more information on how to deploy an IoT MQ MQTT broker, see [Quickstart: Deploy Azure IoT Operations to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).

## Configure the data lake connector to send data to Microsoft Fabric OneLake using managed identity

Configure a data lake connector to connect to Microsoft Fabric OneLake using managed identity.

1. Ensure that the steps in prerequisites are met, including a Microsoft Fabric workspace and lakehouse. The default *my workspace* can't be used.

1. Ensure that IoT MQ Arc extension is installed and configured with managed identity.

1. Get the *app ID* associated to the IoT MQ Arc extension managed identity, and note down the GUID value. The *app ID* is different than the object or principal ID. You can use the Azure CLI by finding the object ID of the managed identity and then querying the app ID of the service principal associated to the managed identity. For example:

    ```bash
    OBJECT_ID=$(az k8s-extension show --name <IOT_MQ_EXTENSION_NAME> --cluster-name <ARC_CLUSTER_NAME> --resource-group <RESOURCE_GROUP_NAME> --cluster-type connectedClusters --query identity.principalId -o tsv)
    az ad sp show --query appId --id $OBJECT_ID --output tsv
    ```

    You should get an output with a GUID value:

    ```console
    xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    ```

    This GUID is the *app ID* that you need to use in the next step.

1. In Microsoft Fabric workspace, use **Manage access**, then select **+ Add people or groups**.

1. Search for the IoT MQ Arc extension by its name "mq", and make sure to select the app ID GUID value that you found in the previous step.

1. Select **Contributor** as the role, then select **Add**.

1. Create a [DataLakeConnector](#datalakeconnector) resource that defines the configuration and endpoint settings for the connector. You can use the YAML provided as an example, but make sure to change the following fields:

    - `target.fabriceOneLake.names`: The names of the workspace and the lakehouse. Use either this field or `guids`, don't use both.
        - `workspaceName`: The name of the workspace.
        - `lakehouseName`: The name of the lakehouse. 

    ```yaml
    apiVersion: mq.iotoperations.azure.com/v1beta1
    kind: DataLakeConnector
    metadata:
      name: my-datalake-connector
      namespace: azure-iot-operations
    spec:
      protocol: v5
      image:
        repository: mcr.microsoft.com/azureiotoperations/datalake
        tag: 0.1.0-preview
        pullPolicy: IfNotPresent
      instances: 2
      logLevel: info
      databaseFormat: delta
      target:
        fabricOneLake:
          endpoint: https://onelake.dfs.fabric.microsoft.com
          names:
            workspaceName: <example-workspace-name>
            lakehouseName: <example-lakehouse-name>
          ## OR
          # guids:
          #   workspaceGuid: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          #   lakehouseGuid: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
          fabricPath: tables
          authentication:
            systemAssignedManagedIdentity:
              audience: https://storage.azure.com/
      localBrokerConnection:
        endpoint: aio-mq-dmqtt-frontend:8883
        tls:
          tlsEnabled: true
          trustedCaCertificateConfigMap: aio-ca-trust-bundle-test-only
        authentication:
          kubernetes: {}
    ```

1. Create a [DataLakeConnectorTopicMap](#datalakeconnectortopicmap) resource that defines the mapping between the MQTT topic and the Delta table in the Data Lake Storage. You can use the YAML provided as an example, but make sure to change the following fields:

    - `dataLakeConnectorRef`: The name of the DataLakeConnector resource that you created earlier.
    - `clientId`: A unique identifier for your MQTT client.
    - `mqttSourceTopic`: The name of the MQTT topic that you want data to come from.
    - `table.tableName`: The name of the table that you want to append to in the lakehouse. If the table doesn't exist, it's created automatically.
    - `table.schema`: The schema of the Delta table that should match the format and fields of the JSON messages that you send to the MQTT topic.

1. Apply the DataLakeConnector and DataLakeConnectorTopicMap resources to your Kubernetes cluster using `kubectl apply -f datalake-connector.yaml`.

1. Start sending JSON messages to the MQTT topic using your MQTT publisher. The data lake connector instance subscribes to the topic and ingests the messages into the Delta table.

1. Using a browser, verify that the data is imported into the lakehouse. In the Microsoft Fabric workspace, select your lakehouse and then **Tables**. You should see the data in the table.

### Unidentified table

If your data shows in the *Unidentified* table:

The cause might be unsupported characters in the table name. The table name must be a valid Azure Storage container name that means it can contain any English letter, upper or lower case, and underbar `_`, with length up to 256 characters. No dashes `-` or space characters are allowed.

## Configure the data lake connector to send data to Azure Data Lake Storage Gen2 using SAS token

Configure a data lake connector to connect to an Azure Data Lake Storage Gen2 (ADLS Gen2) account using a shared access signature (SAS) token.

1. Get a [SAS token](/azure/storage/common/storage-sas-overview) for an Azure Data Lake Storage Gen2 (ADLS Gen2) account. For example, use the Azure portal to browse to your storage account. In the menu under *Security + networking*, choose **Shared access signature**. Use the following table to set the required permissions.

    | Parameter              | Value                       |
    | ---------------------- | --------------------------- |
    | Allowed services       | Blob                        |
    | Allowed resource types | Object, Container           |
    | Allowed permissions    | Read, Write, Delete, List, Create |

   To optimize for least privilege, you can also choose to get the SAS for an individual container. To prevent authentication errors, make sure that the container matches the `table.tableName` value in the topic map configuration.

1. Create a Kubernetes secret with the SAS token. Don't include the question mark `?` that might be at the beginning of the token.

    ```bash
    kubectl create secret generic my-sas \
    --from-literal=accessToken='sv=2022-11-02&ss=b&srt=c&sp=rwdlax&se=2023-07-22T05:47:40Z&st=2023-07-21T21:47:40Z&spr=https&sig=xDkwJUO....' 
    ```

1. Create a [DataLakeConnector](#datalakeconnector) resource that defines the configuration and endpoint settings for the connector. You can use the YAML provided as an example, but make sure to change the following fields:

    - `endpoint`: The Data Lake Storage endpoint of the ADLSv2 storage account in the form of `https://example.blob.core.windows.net`. In Azure portal, find the endpoint under **Storage account > Settings > Endpoints > Data Lake Storage**.
    - `accessTokenSecretName`: Name of the Kubernetes secret containing the SAS token (`my-sas` from the prior example).

    ```yaml
    apiVersion: mq.iotoperations.azure.com/v1beta1
    kind: DataLakeConnector
    metadata:
      name: my-datalake-connector
      namespace: azure-iot-operations
    spec:
      protocol: v5
      image:
        repository: mcr.microsoft.com/azureiotoperations/datalake
        tag: 0.1.0-preview
        pullPolicy: IfNotPresent
      instances: 2
      logLevel: "debug"
      databaseFormat: "delta"
      target:
        datalakeStorage:
          endpoint: "https://example.blob.core.windows.net"
          authentication:
            accessTokenSecretName: "my-sas"
      localBrokerConnection:
        endpoint: aio-mq-dmqtt-frontend:8883
        tls:
          tlsEnabled: true
          trustedCaCertificateConfigMap: aio-ca-trust-bundle-test-only
        authentication:
          kubernetes: {}
    ```

1. Create a [DataLakeConnectorTopicMap](#datalakeconnectortopicmap) resource that defines the mapping between the MQTT topic and the Delta table in the Data Lake Storage. You can use the YAML provided as an example, but make sure to change the following fields:

    - `dataLakeConnectorRef`: The name of the DataLakeConnector resource that you created earlier.
    - `clientId`: A unique identifier for your MQTT client.
    - `mqttSourceTopic`: The name of the MQTT topic that you want data to come from.
    - `table.tableName`: The name of the container that you want to append to in the Data Lake Storage. If the SAS token is scoped to the account, the container is automatically created if missing.
    - `table.schema`: The schema of the Delta table, which should match the format and fields of the JSON messages that you send to the MQTT topic.

1. Apply the *DataLakeConnector* and *DataLakeConnectorTopicMap* resources to your Kubernetes cluster using `kubectl apply -f datalake-connector.yaml`.

1. Start sending JSON messages to the MQTT topic using your MQTT publisher. The data lake connector instance subscribes to the topic and ingests the messages into the Delta table.

1. Using Azure portal, verify that the Delta table is created. The files are organized by client ID, connector instance name, MQTT topic, and time. In your storage account > **Containers**, open the container that you specified in the *DataLakeConnectorTopicMap*. Verify *_delta_log* exists and parque files show MQTT traffic. Open a parque file to confirm the payload matches what was sent and defined in the schema. 

### Use managed identity for authentication to ADLSv2

To use managed identity, specify it as the only method under DataLakeConnector `authentication`. Use `az k8s-extension show` to find the principal ID for the IoT MQ Arc extension, then assign a role to the managed identity that grants permission to write to the storage account, such as Storage Blob Data Contributor. To learn more, see [Authorize access to blobs using Microsoft Entra ID](/azure/storage/blobs/authorize-access-azure-active-directory).

```yaml
authentication:
  systemAssignedManagedIdentity:
    audience: https://my-account.blob.core.windows.net
```

## DataLakeConnector

A *DataLakeConnector* is a Kubernetes custom resource that defines the configuration and properties of a data lake connector instance. A data lake connector ingests data from MQTT topics into Delta tables in a Data Lake Storage account.

The spec field of a *DataLakeConnector* resource contains the following subfields:

- `protocol`: The MQTT version. It can be one of `v5` or `v3`.
- `image`: The image field specifies the container image of the data lake connector module. It has the following subfields:
    - `repository`: The name of the container registry and repository where the image is stored.
    - `tag`: The tag of the image to use.
    - `pullPolicy`: The pull policy for the image. It can be one of `Always`, `IfNotPresent`, or `Never`.
- `instances`: The number of replicas of the data lake connector to run.
- `logLevel`: The log level for the data lake connector module. It can be one of `trace`, `debug`, `info`, `warn`, `error`, or `fatal`.
- `databaseFormat`: The format of the data to ingest into the Data Lake Storage. It can be one of `delta` or `parquet`.
- `target`: The target field specifies the destination of the data ingestion. It can be `datalakeStorage`, `fabricOneLake`, or `localStorage`.
    - `datalakeStorage`: Specifies the configuration and properties of the local storage Storage account. It has the following subfields:
        - `endpoint`: The URL of the Data Lake Storage account endpoint. Don't include any trailing slash `/`.
        - `authentication`: The authentication field specifies the type and credentials for accessing the Data Lake Storage account. It can be one of the following.
        - `accessTokenSecretName`: The name of the Kubernetes secret for using shared access token authentication for the Data Lake Storage account. This field is required if the type is `accessToken`.
        - `systemAssignedManagedIdentity`: For using system managed identity for authentication. It has one subfield
            - `audience`: A string in the form of `https://<my-account-name>.blob.core.windows.net` for the managed identity token audience scoped to the account level or `https://storage.azure.com` for any storage account.
    - `fabriceOneLake`: Specifies the configuration and properties of the Microsoft Fabric OneLake. It has the following subfields:
        - `endpoint`: The URL of the Microsoft Fabric OneLake endpoint. It's usually `https://onelake.dfs.fabric.microsoft.com` because that's the OneLake global endpoint. If you're using a regional endpoint, it's in the form of `https://<region>-onelake.dfs.fabric.microsoft.com`. Don't include any trailing slash `/`. To learn more, see [Connecting to Microsoft OneLake](/fabric/onelake/onelake-access-api).
        - `names`: Specifies the names of the workspace and the lakehouse. Use either this field or `guids`, don't use both. It has the following subfields:
        - `workspaceName`: The name of the workspace.
        - `lakehouseName`: The name of the lakehouse.
        - `guids`: Specifies the GUIDs of the workspace and the lakehouse. Use either this field or `names`, don't use both. It has the following subfields:
        - `workspaceGuid`: The GUID of the workspace.
        - `lakehouseGuid`: The GUID of the lakehouse.
        - `fabricePath`: The location of the data in the Fabric workspace. It can be either `tables` or `files`. If it's `tables`, the data is stored in the Fabric OneLake as tables. If it's `files`, the data is stored in the Fabric OneLake as files. If it's `files`, the `databaseFormat` must be `parquet`.
        - `authentication`: The authentication field specifies the type and credentials for accessing the Microsoft Fabric OneLake. It can only be `systemAssignedManagedIdentity` for now. It has one subfield:
        - `systemAssignedManagedIdentity`: For using system managed identity for authentication. It has one subfield
            - `audience`: A string for the managed identity token audience and it must be `https://storage.azure.com`.
    - `localStorage`: Specifies the configuration and properties of the local storage account. It has the following subfields:
        - `volumeName`: The name of the volume that's mounted into each of the connector pods.
- `localBrokerConnection`: Used to override the default connection configuration to IoT MQ MQTT broker. See [Manage local broker connection](#manage-local-broker-connection).

## DataLakeConnectorTopicMap

A DataLakeConnectorTopicMap is a Kubernetes custom resource that defines the mapping between an MQTT topic and a Delta table in a Data Lake Storage account. A DataLakeConnectorTopicMap resource references a DataLakeConnector resource that runs on the same edge device and ingests data from the MQTT topic into the Delta table.

The specification field of a DataLakeConnectorTopicMap resource contains the following subfields:

- `dataLakeConnectorRef`: The name of the DataLakeConnector resource that this topic map belongs to.
- `mapping`: The mapping field specifies the details and properties of the MQTT topic and the Delta table. It has the following subfields:
    - `allowedLatencySecs`: The maximum latency in seconds between receiving a message from the MQTT topic and ingesting it into the Delta table. This field is required.
    - `clientId`: A unique identifier for the MQTT client that subscribes to the topic.
    - `maxMessagesPerBatch`: The maximum number of messages to ingest in one batch into the Delta table. Due to a temporary restriction, this value must be less than 16 if `qos` is set to 1. This field is required.
    - `messagePayloadType`: The type of payload that is sent to the MQTT topic. It can be one of `json` or `avro` (not yet supported).
    - `mqttSourceTopic`: The name of the MQTT topic(s) to subscribe to. Supports [MQTT topic wildcard notation](https://chat.openai.com/share/c6f86407-af73-4c18-88e5-f6053b03bc02).
    - `qos`: The quality of service level for subscribing to the MQTT topic. It can be one of 0 or 1.
    - `table`: The table field specifies the configuration and properties of the Delta table in the Data Lake Storage account. It has the following subfields:
        - `tableName`: The name of the Delta table to create or append to in the Data Lake Storage account. This field is also known as the container name when used with Azure Data Lake Storage Gen2. It can contain any English letter, upper or lower case, and underbar `_`, with length up to 256 characters. No dashes `-` or space characters are allowed.
        - `schema`: The schema of the Delta table, which should match the format and fields of the message payload. It's an array of objects, each with the following subfields:
            - `name`: The name of the column in the Delta table.
            - `format`: The data type of the column in the Delta table. It can be one of `boolean`, `int8`, `int16`, `int32`, `int64`, `uInt8`, `uInt16`, `uInt32`, `uInt64`, `float16`, `float32`, `float64`, `date32`, `timestamp`, `binary`, or `utf8`. Unsigned types, like `uInt8`, aren't fully supported, and are treated as signed types if specified here.
            - `optional`: A boolean value that indicates whether the column is optional or required. This field is optional and defaults to false.
            - `mapping`: JSON path expression that defines how to extract the value of the column from the MQTT message payload. Built-in mappings `$client_id`, `$topic`, and `$received_time` are available to use as columns to enrich the JSON in MQTT message body. This field is required.

Here's an example of a *DataLakeConnectorTopicMap* resource:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: DataLakeConnectorTopicMap
metadata:
  name: datalake-topicmap
  namespace: azure-iot-operations
spec:
  dataLakeConnectorRef: "my-datalake-connector"
  mapping:
    allowedLatencySecs: 1
    messagePayloadType: "json"
    maxMessagesPerBatch: 10
    clientId: id
    mqttSourceTopic: "orders"
    qos: 1
    table:
      tableName: "ordersTable"
      schema:
      - name: "orderId"
        format: int32
        optional: false
        mapping: "data.orderId"
      - name: "item"
        format: utf8
        optional: false
        mapping: "data.item"
      - name: "clientId"
        format: utf8
        optional: false
        mapping: "$client_id"
      - name: "mqttTopic"
        format: utf8
        optional: false
        mapping: "$topic"
      - name: "timestamp"
        format: timestamp
        optional: false
        mapping: "$received_time"
```

Escaped JSON like `{"data": "{\"orderId\": 181, \"item\": \"item181\"}"}` isn't supported and causes the connector to throw a "convertor found a null value" error. An example message for the `orders` topic that works with this schema:

```json
{
  "data": {
    "orderId": 181,
    "item": "item181"
  }
}
```

Which maps to:

| orderId | item    | clientId | mqttTopic | timestamp                      |
| ------- | ------- | -------- | --------- | ------------------------------ |
| 181     | item181 | id       | orders    | 2023-07-28T12:45:59.324310806Z |

> [!IMPORTANT]
> If the data schema is updated, for example a data type is changed or a name is changed, transformation of incoming data might stop working. You need to change the data table name if a schema change occurs.

## Delta or parquet

Both delta and parquet formats are supported.

## Manage local broker connection

Like MQTT bridge, the data lake connector acts as a client to the IoT MQ MQTT broker. If you've customized the listener port or authentication of your IoT MQ MQTT broker, override the local MQTT connection configuration for the data lake connector as well. To learn more, see [MQTT bridge local broker connection](./howto-configure-mqtt-bridge.md#local-broker-connection).

## Related content

[Publish and subscribe MQTT messages using Azure IoT MQ](../manage-mqtt-connectivity/overview-iot-mq.md)
