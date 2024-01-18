---
title: Configure a pipeline SQL Server source stage
description: Configure a pipeline source stage to read data from Microsoft SQL Server for processing. The source stage is the first stage in a Data Processor pipeline.
author: dominicbetts
ms.author: dobett
ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/23/2023

#CustomerIntent: As an operator, I want to configure a SQL Server source stage so that I can read messages from an SQL Server database for processing.
---

# Configure a SQL Server source stage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The source stage is the first and required stage in an Azure IoT Data Processor (preview) pipeline. The source stage gets data into the data processing pipeline and prepares it for further processing. The SQL Server source stage lets you read data from a Microsoft SQL Server database at a user-defined interval.

In the source stage, you define:

- Connection details for SQL Server.
- The interval at which to query the SQL Server database. The stage waits for a result before it resets the interval timer.
- A partitioning configuration based on your specific data processing requirements.

## Prerequisites

- A functioning instance of Data Processor is deployed.
- A SQL Server database with all necessary raw data available is operational and reachable.

## Configure the SQL Server source

To configure the SQL Server source:

- Provide details of the SQL Server database. This configuration includes the server name and a query to retrieve the data.
- Specify the authentication method. Currently limited to username/password-based or service principal-based authentication.

The following table describes the SQL Server source configuration parameters:

| Field | Type | Description | Required | Default | Example |
|----|---|---|---|---|---|
| Name | String | A customer-visible name for the source stage. | Required | NA | `erp-database` |
| Description | String | A customer-visible description of the source stage. | Optional | NA | `Enterprise database` |
| Server host | String | The URL to use to connect to the server.  | Required | NA | `https://contoso.com/some/url/path` |
| Server port | Integer | The port number to connect to on the server.  | Required | `1433` | `1433` |
| Authentication | Authentication type | The authentication method for connecting to the server. One of: `None`, `Username/Password`, or `Service principal`. | Optional | `NA` | `Username/Password` |
| Username/Password > Username | String | The username for the username/password authentication | Yes | NA | `myuser` |
| Username/Password > Secret | Reference to the password stored in Azure Key Vault. | Yes | Yes | `AKV_USERNAME_PASSWORD` |
| Service principal > Tenant ID | String | The Tenant ID of the service principal. | Yes | NA | `<Tenant ID>` |
| Service principal > Client ID | String | The Client ID of the service principal. | Yes | NA | `<Client ID>` |
| Service principal > Secret | String | Reference to the service principal client secret stored in Azure Key Vault. | Yes | NA | `AKV_SERVICE_PRINCIPAL` |
| Database | String | The name of the SQL Server database to query.  | Required | NA | `erp_db` |
| Data query | String | The query to run against the database. | Required | NA | `SELECT * FROM your_table WHERE column_name = foo` |
| Query interval | [Duration](concept-configuration-patterns.md#duration) | String representation of the time to wait before the next API call. | Required | `10s`| `24h` |
| Data format | [Format](#select-data-format) | Data format of the incoming data | Required | NA | `{"type": "json"}` |
| Partitioning | [Partitioning](#configure-partitioning) | Partitioning configuration for the source stage. | Required | NA | See [partitioning](#configure-partitioning) |

To learn more about secrets, see [Manage secrets for your Azure IoT Operations deployment](../deploy-iot-ops/howto-manage-secrets.md).

> [!NOTE]
> Requests timeout in 30 seconds if there's no response from the SQL server.

## Select data format

[!INCLUDE [data-processor-data-format](../includes/data-processor-data-format.md)]

## Configure partitioning

[!INCLUDE [data-processor-configure-partition](../includes/data-processor-configure-partition.md)]

| Field | Description | Required | Default | Example |
| ----- | ----------- | -------- | ------- | ------- |
| Partition type | The type of partitioning to be used: Partition `ID` or Partition `Key` | Required | `ID` | `ID` |
| Partition expression | The [jq expression](../process-data/concept-jq-expression.md) to use on the incoming message to compute the partition `ID` or partition `Key` | Required | `0` | `.payload.header` |
| Number of partitions| The number of partitions in a Data Processor pipeline. | Required | `1` | `1` |

Data Processor adds additional metadata to the incoming message. See [Data Processor message structure overview](concept-message-structure.md) to understand how to correctly specify the partitioning expression that runs on the incoming message. By default, the partitioning expression is set to `0` with the **Partition type** as `ID` to send all the incoming data to a single partition.

For recommendations and to learn more, see [What is partitioning?](../process-data/concept-partitioning.md).

## Related content

- [Serialization and deserialization formats](concept-supported-formats.md)
- [What is partitioning?](concept-partitioning.md)
