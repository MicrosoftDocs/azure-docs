---
title: Configure a pipeline InfluxDB source stage
description: Configure a pipeline source stage to read data from InfluxDB for processing. The source stage is the first stage in a Data Processor pipeline.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.date: 05/22/2024

#CustomerIntent: As an operator, I want to configure an InfluxDB source stage so that I can read messages from an InfluxDB database for processing.
---

# Configure an InfluxDB v2 source stage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The source stage is the first and required stage in an Azure IoT Data Processor (preview) pipeline. The source stage gets data into the data processing pipeline and prepares it for further processing. The InfluxDB source stage lets you read data from an [InfluxDB v2](https://docs.influxdata.com/influxdb/v2/) database at a user-defined interval.

In the source stage, you define:

- Connection details for InfluxDB v2.
- The interval at which to query the InfluxDB database. The stage waits for a result before it resets the interval timer.
- A partitioning configuration based on your specific data processing requirements.

## Prerequisites

- A functioning instance of Data Processor is deployed.
- An InfluxDB database with all necessary raw data is operational and reachable.

## Prepare the Influx database

To connect to the InfluxDB database, you need to:

- Create an access token that grants the pipeline read access to the InfluxDB database. To learn more, see [Manage API tokens](https://docs.influxdata.com/influxdb/v2/admin/tokens/).
- Create a secret in Azure Key Vault that contains the access token. To learn more, see [Manage secrets for your Azure IoT Operations deployment](../deploy-iot-ops/howto-manage-secrets.md).

## Configure the InfluxDB source

To configure the InfluxDB source:

- Provide details of the InfluxDB database. This configuration includes the server name and a query to retrieve the data.
- Specify the authentication method. Currently, you can only use access token authentication.

The following table describes the InfluxDB source configuration parameters:

The base schema of the input configuration is made up of:

| Field | Type | Description | Required? | Default | Example |
|--|--|--|--|--|--|
| Name | String | A customer-visible name for the source stage. | Required | NA | `erp-database` |
| Description | String | A customer-visible description of the source stage. | Optional | NA | `Enterprise database` |
| Database URL | String | URL of the InfluxDB database | Yes |  | `https://contoso.com/some/url/path` |
| Database port | Integer | The InfluxDB database port | No | 443 | 443 |
| Organization | String | The organization that holds the bucket to query from | Yes | `test-org` | `test-org` |
| Authentication | Authentication type | The authentication method for connecting to the server. Supports `accessToken` type only. | Yes | `{"type": "accessToken"}` | `{"type": "accessToken"}` |
| Secret | String | Reference to the token stored in Azure Key Vault. | Yes | Yes | `AKV_ACCESS_TOKEN` |
| Flux query | String | The InfluxDB query | Yes |  | `{"expression": 'from(bucket:"test-bucket")\|> range(start: -1h) \|> filter(fn: (r) => r._measurement == "stat")'}` |
| Query interval | [Duration](concept-configuration-patterns.md#duration) | String representation of the time to wait before the next API call. | Yes |  | `24h` |
| Data format | [Format](concept-supported-formats.md) | The stage applies the format to individual rows retrieved by the query. Only the `json` format is supported. The top-level `path` isn't supported. | Yes |  | `{"type": "json"}` |
| Partitioning | [Partitioning](#configure-partitioning) | Partitioning configuration for the source stage. | Required | NA | See [partitioning](#configure-partitioning) |

## Configure partitioning

[!INCLUDE [data-processor-configure-partition](../includes/data-processor-configure-partition.md)]

| Field | Description | Required | Default | Example |
| ----- | ----------- | -------- | ------- | ------- |
| Partition type | The type of partitioning to be used: Partition `ID` or Partition `Key` | Required | `ID` | `ID` |
| Partition expression | The [jq expression](../process-data/concept-jq-expression.md) to use on the incoming message to compute the partition `ID` or partition `Key` | Required | `0` | `.payload.header` |
| Number of partitions| The number of partitions in a Data Processor pipeline. | Required | `1` | `1` |

Data Processor adds metadata to the incoming message. See [Data Processor message structure overview](concept-message-structure.md) to understand how to correctly specify the partitioning expression that runs on the incoming message. By default, the partitioning expression is set to `0` with the **Partition type** as `ID` to send all the incoming data to a single partition.

For recommendations and to learn more, see [What is partitioning?](../process-data/concept-partitioning.md).

## Sample configuration

The following JSON example shows a complete InfluxDB source stage configuration:

```json
{
  "displayName": "InfluxDB v2 - ec8750",
  "type": "input/influxdbv2@v1",
  "query": {
    "expression": "from(bucket:\\\"test-bucket\\\") |> range(start: -1h) |> filter(fn: (r) => r._measurement == \\\"stat\\\")"
  },
  "url": "https://contoso.com/some/url/path",
  "interval": "5s",
  "port": 443,
  "organization": "test-org",
  "format": {
    "type": "json"
  },
  "partitionCount": 1,
  "partitionStrategy": {
    "type": "id",
    "expression": "0"
  },
  "authentication": {
    "type": "accessToken",
    "accessToken": "AKV_ACCESS_TOKEN"
  },
  "description": "Example InfluxDB source stage"
}
```

## Related content

- [Serialization and deserialization formats](concept-supported-formats.md)
- [What is partitioning?](concept-partitioning.md)
