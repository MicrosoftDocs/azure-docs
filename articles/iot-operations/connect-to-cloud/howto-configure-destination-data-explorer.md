---
title: Send data to Azure Data Explorer from a pipeline
description: Configure a pipeline destination stage to send the pipeline output to Azure Data Explorer for storage and analysis.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/09/2023

#CustomerIntent: As an operator, I want to send data from a pipeline to Azure Data Explorer so that I can store and analyze my data in the cloud.
---

# Send data to Azure Data Explorer from a Data Processor pipeline

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use the _Azure Data Explorer_ destination to write data to a table in Azure Data Explorer from an [Azure IoT Data Processor (preview) pipeline](../process-data/overview-data-processor.md). The destination stage batches messages before it sends them to Azure Data Explorer.

## Prerequisites

To configure and use an Azure Data Explorer destination pipeline stage, you need:

- A deployed instance of Data Processor.
- An [Azure Data Explorer cluster](/azure/data-explorer/create-cluster-and-database?tabs=free#create-a-cluster).
- A [database](/azure/data-explorer/create-cluster-and-database?tabs=free#create-a-database) in your Azure Data Explorer cluster.

## Set up Azure Data Explorer

Before you can write to Azure Data Explorer from a data pipeline, enable [service principal authentication](/azure/data-explorer/provision-azure-ad-app) in your database. To create a service principal with a client secret:

[!INCLUDE [data-processor-create-service-principal](../includes/data-processor-create-service-principal.md)]

To grant admin access to your Azure Data Explorer database, run the following command in your database query tab:

```kusto
.add database <DatabaseName> admins (<ApplicationId>) <Notes>
```

Data Processor writes to Azure Data Explorer in batches. While you batch data in data processor before sending it, Azure Data Explorer has its own default [ingestion batching policy](/azure/data-explorer/kusto/management/batchingpolicy). Therefore, you might not see your data in Azure Data Explorer immediately after Data Processor writes it to the Azure Data Explorer destination.

To view data in Azure Data Explorer as soon as the pipeline sends it, you can set the ingestion batching policy `Count` to 1. To edit the ingestion batching policy, run the following command in your database query tab:

```kusto
.alter table <DatabaseName>.<TableName> policy ingestionbatching
{
    "MaximumBatchingTimeSpan" : "00:00:30",
    "MaximumNumberOfItems" : 1,
    "MaximumRawDataSizeMB": 1024
}
```

## Configure your secret

For the destination stage to connect to Azure Data Explorer, it needs access to a secret that contains the authentication details. To create a secret:

1. Use the following command to add a secret to your Azure Key Vault that contains the client secret you made a note of when you created the service principal:

    ```azurecli
    az keyvault secret set --vault-name <your-key-vault-name> --name AccessADXSecret --value <client-secret>
    ```

1. Add the secret reference to your Kubernetes cluster by following the steps in [Manage secrets for your Azure IoT Operations deployment](../deploy-iot-ops/howto-manage-secrets.md).

## Configure the destination stage

The Azure Data Explorer destination stage JSON configuration defines the details of the stage. To author the stage, you can either interact with the form-based UI, or provide the JSON configuration on the **Advanced** tab:

| Field | Type | Description | Required | Default | Example |
| --- | --- | --- | --- | --- | --- |
| Display name  | String | A name to show in the Data Processor UI.  | Yes | -  | `Azure IoT MQ output` |
| Description | String |  A user-friendly description of what the stage does.  | No |  | `Write to topic default/topic1` |
| Cluster URL | String | The URI (This value isn't the data ingestion URI). | Yes | - | |
| Database | String | The database name.  | Yes | - | |
| Table | String |  The name of the table to write to.  | Yes | - |  |
| Batch | [Batch](../process-data/concept-configuration-patterns.md#batch) | How to [batch](../process-data/concept-configuration-patterns.md#batch) data.  | No | `60s` | `10s`  |
| Authentication<sup>1</sup> | The authentication details to connect to Azure Data Explorer.  | Service principal | Yes | - |
| Columns&nbsp;>&nbsp;Name | string | The name of the column. | Yes | | `temperature` |
| Columns&nbsp;>&nbsp;Path | [Path](../process-data/concept-configuration-patterns.md#path) | The location within each record of the data where the value of the column should be read from. | No | `.{{name}}` | `.temperature` |

Authentication<sup>1</sup>: Currently, the destination stage supports service principal based authentication when it connects to Azure Data Explorer. In your Azure Data Explorer destination, provide the following values to authenticate. You made a note of these values when you created the service principal and added the secret reference to your cluster.

| Field | Description | Required |
| --- | --- | --- |
| TenantId  | The tenant ID.  | Yes |
| ClientId | The app ID you made a note of when you created the service principal that has access to the database.  | Yes |
| Secret | The secret reference you created in your cluster.   | Yes |

## Sample configuration

The following JSON example shows a complete Azure Data Explorer destination stage configuration that writes the entire message to the `quickstart` table in the database`:

```json
{
    "displayName": "Azure data explorer - 71c308",
    "type": "output/dataexplorer@v1",
    "viewOptions": {
        "position": {
            "x": 0,
            "y": 784
        }
    },
    "clusterUrl": "https://clusterurl.region.kusto.windows.net",
    "database": "databaseName",
    "table": "quickstart",
    "authentication": {
        "type": "servicePrincipal",
        "tenantId": "tenantId",
        "clientId": "clientId",
        "clientSecret": "secretReference"
    },
    "batch": {
        "time": "5s",
        "path": ".payload"
    },
    "columns": [
        {
            "name": "Timestamp",
            "path": ".Timestamp"
        },
        {
            "name": "AssetName",
            "path": ".assetName"
        },
        {
            "name": "Customer",
            "path": ".Customer"
        },
        {
            "name": "Batch",
            "path": ".Batch"
        },
        {
            "name": "CurrentTemperature",
            "path": ".CurrentTemperature"
        },
        {
            "name": "LastKnownTemperature",
            "path": ".LastKnownTemperature"
        },
        {
            "name": "Pressure",
            "path": ".Pressure"
        },
        {
            "name": "IsSpare",
            "path": ".IsSpare"
        }
    ]
}
```

The configuration defines that:

- Messages are batched for 5 seconds.
- Uses the batch path `.payload` to locate the data for the columns.

### Example

The following example shows a sample input message to the Azure Data Explorer destination stage:

```json
{
  "payload": {
    "Batch": 102,
    "CurrentTemperature": 7109,
    "Customer": "Contoso",
    "Equipment": "Boiler",
    "IsSpare": true,
    "LastKnownTemperature": 7109,
    "Location": "Seattle",
    "Pressure": 7109,
    "Timestamp": "2023-08-10T00:54:58.6572007Z",
    "assetName": "oven"
  },
  "qos": 0,
  "systemProperties": {
    "partitionId": 0,
    "partitionKey": "quickstart",
    "timestamp": "2023-11-06T23:42:51.004Z"
  },
  "topic": "quickstart"
}
```

## Related content

- [Send data to Microsoft Fabric](howto-configure-destination-fabric.md)
- [Send data to a gRPC endpoint](../process-data/howto-configure-destination-grpc.md)
- [Publish data to an MQTT broker](../process-data/howto-configure-destination-mq-broker.md)
- [Send data to the reference data store](../process-data/howto-configure-destination-reference-store.md)
