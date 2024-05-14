---
title: Send data from Azure IoT MQ to Data Lake Storage
description: Learn how to send data from Azure IoT MQ to Data Lake Storage.
author: PatAltimore
ms.subservice: mq
ms.author: patricka
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 05/06/2024

#CustomerIntent: As an operator, I want to understand how to configure Azure IoT MQ so that I can send data from Azure IoT MQ to Data Lake Storage.
---

# Send data from Azure IoT MQ Preview to Data Lake Storage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

You can use the data lake connector to send data from Azure IoT MQ Preview broker to a data lake, like Azure Data Lake Storage Gen2 (ADLSv2), Microsoft Fabric OneLake, and Azure Data Explorer. The connector subscribes to MQTT topics and ingests the messages into Delta tables in the Data Lake Storage account.

## Prerequisites

- A Data Lake Storage account in Azure with a container and a folder for your data. For more information about creating a Data Lake Storage, use one of the following quickstart options:
    - Microsoft Fabric OneLake quickstart:
      - [Create a workspace](/fabric/get-started/create-workspaces) since the default *my workspace* isn't supported.
      - [Create a lakehouse](/fabric/onelake/create-lakehouse-onelake).
    - Azure Data Lake Storage Gen2 quickstart:
      - [Create a storage account to use with Azure Data Lake Storage Gen2](/azure/storage/blobs/create-data-lake-storage-account).
    - Azure Data Explorer cluster:
      - Follow the **Full cluster** steps in the [Quickstart: Create an Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database?tabs=full).

- An IoT MQ MQTT broker. For more information on how to deploy an IoT MQ MQTT broker, see [Quickstart: Deploy Azure IoT Operations Preview to an Arc-enabled Kubernetes cluster](../get-started/quickstart-deploy.md).

## Configure to send data to Microsoft Fabric OneLake using managed identity

Configure a data lake connector to connect to Microsoft Fabric OneLake using managed identity.

1. Ensure that the steps in prerequisites are met, including a Microsoft Fabric workspace and lakehouse. The default *my workspace* can't be used.

1. Ensure that IoT MQ Arc extension is installed and configured with managed identity.

1. In Azure portal, go to the Arc-connected Kubernetes cluster and select **Settings** > **Extensions**. In the extension list, look for your IoT MQ extension name. The name begins with `mq-` followed by five random characters. For example, *mq-4jgjs*.

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
    - `target.fabricOneLake.endpoint`: The endpoint of the Microsoft Fabric OneLake account. You can get the endpoint URL from Microsoft Fabric lakehouse under **Files** > **Properties**. The URL should look like `https://onelake.dfs.fabric.microsoft.com`.
    - `target.fabricOneLake.names`: The names of the workspace and the lakehouse. Use either this field or `guids`. Don't use both.
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
        tag: 0.4.0-preview
        pullPolicy: IfNotPresent
      instances: 2
      logLevel: info
      databaseFormat: delta
      target:
        fabricOneLake:
          # Example: https://onelake.dfs.fabric.microsoft.com
          endpoint: <example-endpoint-url>
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
    - `table.tableName`: The name of the table that you want to append to in the lakehouse. The table is created automatically if doesn't exist.
    - `table.schema`: The schema of the Delta table that should match the format and fields of the JSON messages that you send to the MQTT topic.

1. Apply the DataLakeConnector and DataLakeConnectorTopicMap resources to your Kubernetes cluster using `kubectl apply -f datalake-connector.yaml`.

1. Start sending JSON messages to the MQTT topic using your MQTT publisher. The data lake connector instance subscribes to the topic and ingests the messages into the Delta table.

1. Using a browser, verify that the data is imported into the lakehouse. In the Microsoft Fabric workspace, select your lakehouse and then **Tables**. You should see the data in the table.

### Unidentified table

If your data shows in the *Unidentified* table:

The cause might be unsupported characters in the table name. The table name must be a valid Azure Storage container name that means it can contain any English letter, upper or lower case, and underbar `_`, with length up to 256 characters. No dashes `-` or space characters are allowed.

## Configure to send data to Azure Data Lake Storage Gen2 using SAS token

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
    --from-literal=accessToken='sv=2022-11-02&ss=b&srt=c&sp=rwdlax&se=2023-07-22T05:47:40Z&st=2023-07-21T21:47:40Z&spr=https&sig=xDkwJUO....' \
    -n azure-iot-operations
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
        tag: 0.4.0-preview
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

## Configure to send data to Azure Data Explorer using managed identity

Configure the data lake connector to send data to an Azure Data Explorer endpoint using managed identity.

1. Ensure that the steps in prerequisites are met, including a full Azure Data Explorer cluster. The "free cluster" option doesn't work.

1. After the cluster is created, create a database to store your data. 

1. You can create a table for given data via the Azure portal and create columns manually, or you can use [KQL](/azure/data-explorer/kusto/management/create-table-command) in the query tab. For example:

    ```kql
    .create table thermostat (
        externalAssetId: string,
        assetName: string,
        CurrentTemperature: real,
        Pressure: real,
        MqttTopic: string,
        Timestamp: datetime
    )
    ```
    
### Enable streaming ingestion

Enable streaming ingestion on your table and database. In the query tab, run the following command, substituting `<DATABASE_NAME>` with your database name:

```kql
.alter database <DATABASE_NAME> policy streamingingestion enable
```

### Add the managed identity to the Azure Data Explorer cluster

In order for the connector to authenticate to Azure Data Explorer, you must add the managed identity to the Azure Data Explorer cluster. 

1. In Azure portal, go to the Arc-connected Kubernetes cluster and select **Settings** > **Extensions**. In the extension list, look for the name of your IoT MQ extension. The name begins with `mq-` followed by five random characters. For example, *mq-4jgjs*. The IoT MQ extension name is the same as the MQ managed identity name.
1. In your Azure Data Explorer database, select **Permissions** > **Add** > **Ingestor**. Search for the MQ managed identity name and add it.

For more information on adding permissions, see [Manage Azure Data Explorer cluster permissions](/azure/data-explorer/manage-cluster-permissions).

Now, you're ready to deploy the connector and send data to Azure Data Explorer.

### Example deployment file

Example deployment file for the Azure Data Explorer connector. Comments that beginning with `TODO` require you to replace placeholder settings with your information.

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
  name: my-adx-connector
  namespace: azure-iot-operations
spec:
    repository: mcr.microsoft.com/azureiotoperations/datalake
    tag: 0.4.0-preview
    pullPolicy: Always
  databaseFormat: adx
  target:
      # TODO: insert the ADX cluster endpoint
      endpoint: https://<CLUSTER>.<REGION>.kusto.windows.net
      authentication:
        systemAssignedManagedIdentity:
          audience: https://api.kusto.windows.net
  localBrokerConnection:
    endpoint: aio-mq-dmqtt-frontend:8883
    tls:
      tlsEnabled: true
      trustedCaCertificateConfigMap: aio-ca-trust-bundle-test-only
    authentication:
      kubernetes: {}
---
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: DataLakeConnectorTopicMap
metadata:
  name: adx-topicmap
  namespace: azure-iot-operations
spec:
  mapping:
    allowedLatencySecs: 1
    messagePayloadType: json
    maxMessagesPerBatch: 10
    clientId: id
    mqttSourceTopic: azure-iot-operations/data/thermostat
    qos: 1
    table:
      # TODO: add DB and table name
      tablePath: <DATABASE_NAME>
      tableName: <TABLE_NAME>
      schema:
      - name: externalAssetId
        format: utf8
        optional: false
        mapping: $property.externalAssetId
      - name: assetName
        format: utf8
        optional: false
        mapping: DataSetWriterName
      - name: CurrentTemperature
        format: float32
        optional: false
        mapping: Payload.temperature.Value
      - name: Pressure
        format: float32
        optional: true
        mapping: "Payload.Tag 10.Value"
      - name: MqttTopic
        format: utf8
        optional: false
        mapping: $topic
      - name: Timestamp
        format: timestamp
        optional: false
        mapping: $received_time
```

This example accepts data from the `azure-iot-operations/data/thermostat` topic with messages in JSON format such as the following:

```json
{
  "SequenceNumber": 4697,
  "Timestamp": "2024-04-02T22:36:03.1827681Z",
  "DataSetWriterName": "thermostat",
  "MessageType": "ua-deltaframe",
  "Payload": {
    "temperature": {
      "SourceTimestamp": "2024-04-02T22:36:02.6949717Z",
      "Value": 5506
    },
    "Tag 10": {
      "SourceTimestamp": "2024-04-02T22:36:02.6949888Z",
      "Value": 5506
    }
  }
}
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
- `target`: The target field specifies the destination of the data ingestion. It can be `datalakeStorage`, `fabricOneLake`, `adx`, or `localStorage`.
    - `datalakeStorage`: Specifies the configuration and properties of the ADLSv2 account. It has the following subfields:
        - `endpoint`: The URL of the Data Lake Storage account endpoint. Don't include any trailing slash `/`.
        - `authentication`: The authentication field specifies the type and credentials for accessing the Data Lake Storage account. It can be one of the following.
          - `accessTokenSecretName`: The name of the Kubernetes secret for using shared access token authentication for the Data Lake Storage account. This field is required if the type is `accessToken`.
          - `systemAssignedManagedIdentity`: For using system managed identity for authentication. It has one subfield
              - `audience`: A string in the form of `https://<my-account-name>.blob.core.windows.net` for the managed identity token audience scoped to the account level or `https://storage.azure.com` for any storage account.
    - `fabricOneLake`: Specifies the configuration and properties of the Microsoft Fabric OneLake. It has the following subfields:
        - `endpoint`: The URL of the Microsoft Fabric OneLake endpoint. It's usually `https://onelake.dfs.fabric.microsoft.com` because that's the OneLake global endpoint. If you're using a regional endpoint, it's in the form of `https://<region>-onelake.dfs.fabric.microsoft.com`. Don't include any trailing slash `/`. To learn more, see [Connecting to Microsoft OneLake](/fabric/onelake/onelake-access-api).
        - `names`: Specifies the names of the workspace and the lakehouse. Use either this field or `guids`. Don't use both. It has the following subfields:
          - `workspaceName`: The name of the workspace.
          - `lakehouseName`: The name of the lakehouse.
        - `guids`: Specifies the GUIDs of the workspace and the lakehouse. Use either this field or `names`. Don't use both. It has the following subfields:
          - `workspaceGuid`: The GUID of the workspace.
          - `lakehouseGuid`: The GUID of the lakehouse.
        - `fabricPath`: The location of the data in the Fabric workspace. It can be either `tables` or `files`. If it's `tables`, the data is stored in the Fabric OneLake as tables. If it's `files`, the data is stored in the Fabric OneLake as files. If it's `files`, the `databaseFormat` must be `parquet`.
        - `authentication`: The authentication field specifies the type and credentials for accessing the Microsoft Fabric OneLake. It can only be `systemAssignedManagedIdentity` for now. It has one subfield:
        - `systemAssignedManagedIdentity`: For using system managed identity for authentication. It has one subfield
            - `audience`: A string for the managed identity token audience and it must be `https://storage.azure.com`.
    - `adx`: Specifies the configuration and properties of the Azure Data Explorer database. It has the following subfields:
        - `endpoint`: The URL of the Azure Data Explorer cluster endpoint like `https://<CLUSTER>.<REGION>.kusto.windows.net`. Don't include any trailing slash `/`.
        - `authentication`: The authentication field specifies the type and credentials for accessing the Azure Data Explorer cluster. It can only be `systemAssignedManagedIdentity` for now. It has one subfield:
          - `systemAssignedManagedIdentity`: For using system managed identity for authentication. It has one subfield
              - `audience`: A string for the managed identity token audience and it should be `https://api.kusto.windows.net`.        
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
    - `mqttSourceTopic`: The name of the MQTT topic(s) to subscribe to. Supports [MQTT topic wildcard notation](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html#_Toc3901241).
    - `qos`: The quality of service level for subscribing to the MQTT topic. It can be one of 0 or 1.
    - `table`: The table field specifies the configuration and properties of the Delta table in the Data Lake Storage account. It has the following subfields:
        - `tableName`: The name of the Delta table to create or append to in the Data Lake Storage account. This field is also known as the container name when used with Azure Data Lake Storage Gen2. It can contain any **lower case** English letter, and underbar `_`, with length up to 256 characters. No dashes `-` or space characters are allowed.
        - `tablePath`: The name of the Azure Data Explorer database when using `adx` type connector.
        - `schema`: The schema of the Delta table, which should match the format and fields of the message payload. It's an array of objects, each with the following subfields:
            - `name`: The name of the column in the Delta table.
            - `format`: The data type of the column in the Delta table. It can be one of `boolean`, `int8`, `int16`, `int32`, `int64`, `uInt8`, `uInt16`, `uInt32`, `uInt64`, `float16`, `float32`, `float64`, `date32`, `timestamp`, `binary`, or `utf8`. Unsigned types, like `uInt8`, aren't fully supported, and are treated as signed types if specified here.
            - `optional`: A boolean value that indicates whether the column is optional or required. This field is optional and defaults to false.
            - `mapping`: JSON path expression that defines how to extract the value of the column from the MQTT message payload. Built-in mappings `$client_id`, `$topic`, `$property`, and `$received_time` are available to use as columns to enrich the JSON in MQTT message body. This field is required.
                Use $property for MQTT user properties. For example, $property.assetId represents the value of the assetId property from the MQTT message.

Here's an example of a *DataLakeConnectorTopicMap* resource:

```yaml
apiVersion: mq.iotoperations.azure.com/v1beta1
kind: DataLakeConnectorTopicMap
metadata:
  name: datalake-topicmap
  namespace: azure-iot-operations
spec:
  dataLakeConnectorRef: my-datalake-connector
  mapping:
    allowedLatencySecs: 1
    messagePayloadType: json
    maxMessagesPerBatch: 10
    clientId: id
    mqttSourceTopic: azure-iot-operations/data/thermostat
    qos: 1
    table:
      tableName: thermostat
      schema:
      - name: externalAssetId
        format: utf8
        optional: false
        mapping: $property.externalAssetId
      - name: assetName
        format: utf8
        optional: false
        mapping: DataSetWriterName
      - name: CurrentTemperature
        format: float32
        optional: false
        mapping: Payload.temperature.Value
      - name: Pressure
        format: float32
        optional: true
        mapping: "Payload.Tag 10.Value"
      - name: Timestamp
        format: timestamp
        optional: false
        mapping: $received_time
```

Stringified JSON like `"{\"SequenceNumber\": 4697, \"Timestamp\": \"2024-04-02T22:36:03.1827681Z\", \"DataSetWriterName\": \"thermostat-de\", \"MessageType\": \"ua-deltaframe\", \"Payload\": {\"temperature\": {\"SourceTimestamp\": \"2024-04-02T22:36:02.6949717Z\", \"Value\": 5506}, \"Tag 10\": {\"SourceTimestamp\": \"2024-04-02T22:36:02.6949888Z\", \"Value\": 5506}}}"` isn't supported and causes the connector to throw a *convertor found a null value* error. 

An example message for the `azure-iot-operations/data/thermostat` topic that works with this schema:

```json
{
  "SequenceNumber": 4697,
  "Timestamp": "2024-04-02T22:36:03.1827681Z",
  "DataSetWriterName": "thermostat",
  "MessageType": "ua-deltaframe",
  "Payload": {
    "temperature": {
      "SourceTimestamp": "2024-04-02T22:36:02.6949717Z",
      "Value": 5506
    },
    "Tag 10": {
      "SourceTimestamp": "2024-04-02T22:36:02.6949888Z",
      "Value": 5506
    }
  }
}
```

Which maps to:

| externalAssetId                      | assetName       | CurrentTemperature | Pressure | mqttTopic                     | timestamp                      |
| ------------------------------------ | --------------- | ------------------ | -------- | ----------------------------- | ------------------------------ |
| xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx | thermostat-de   | 5506               | 5506     | dlc                           | 2024-04-02T22:36:03.1827681Z   |

> [!IMPORTANT]
> If the data schema is updated, for example a data type is changed or a name is changed, transformation of incoming data might stop working. You need to change the data table name if a schema change occurs.

## Delta or parquet

Both delta and parquet formats are supported.

## Manage local broker connection

Like MQTT bridge, the data lake connector acts as a client to the IoT MQ MQTT broker. If you've customized the listener port or authentication of your IoT MQ MQTT broker, override the local MQTT connection configuration for the data lake connector as well. To learn more, see [MQTT bridge local broker connection](./howto-configure-mqtt-bridge.md#local-broker-connection).

## Related content

[Publish and subscribe MQTT messages using Azure IoT MQ Preview](../manage-mqtt-connectivity/overview-iot-mq.md)
