---
title: Configure a pipeline HTTP endpoint source stage
description: Configure a pipeline source stage to read data from an HTTP endpoint for processing. The source stage is the first stage in a Data Processor pipeline.
author: dominicbetts
ms.author: dobett
# ms.subservice: data-processor
ms.topic: how-to
ms.custom:
  - ignite-2023
ms.date: 10/23/2023

#CustomerIntent: As an operator, I want to configure an HTTP endpoint source stage so that I can read messages from an HTTP endpoint for processing.
---

# Configure a pipeline HTTP endpoint source stage

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

The source stage is the first and required stage in an Azure IoT Data Processor (preview) pipeline. The source stage gets data into the data processing pipeline and prepares it for further processing. The HTTP endpoint source stage lets you read data from an HTTP endpoint at a user-defined interval. The stage has an optional request body and receives a response from the endpoint.

In the source stage, you define:

- Connection details to the HTTP endpoint.
- The interval at which to call the HTTP endpoint. The stage waits for a response before it resets the interval timer.
- A partitioning configuration based on your specific data processing requirements.

## Prerequisites

- A functioning instance of Data Processor is deployed.
- An HTTP endpoint with all necessary raw data available is operational and reachable.

## Configure the HTTP endpoint source

To configure the HTTP endpoint source:

- Provide details of the HTTP endpoint. This configuration includes the method, URL and request payload to use.
- Specify the authentication method. Currently limited to username/password-based or header-based authentication.

The following table describes the HTTP endpoint source configuration parameters:

| Field | Type | Description | Required | Default | Example |
|----|---|---|---|---|---|
| Name | String | A customer-visible name for the source stage. | Required | NA | `erp-endpoint` |
| Description | String | A customer-visible description of the source stage. | Optional | NA | `Enterprise application data`|
| Method | Enum | The HTTP method to use for the requests. One of `GET` or `POST` | Optional | `GET` | `GET` |
| URL | String | The URL to use for the requests. Both `http` and `https` are supported. | Required | NA | `https://contoso.com/some/url/path` |
| Authentication | Authentication type | The authentication method for the HTTP request. One of: `None`, `Username/Password`, or `Header`. | Optional | `NA` | `Username/Password` |
| Username/Password > Username | String | The username for the username/password authentication | Yes | NA | `myuser` |
| Username/Password > Secret | Reference to the password stored in Azure Key Vault. | Yes | Yes | `AKV_USERNAME_PASSWORD` |
| Header > Key | String | The name of the key for header-based authentication. | Yes | NA | `Authorization` |
| Header > Value | String | The credential name in Azure Key Vault for header-based authentication. | Yes | NA | `AKV_PASSWORD` |
| Data format | [Format](#select-data-format) | Data format of the incoming data | Required | NA | `{"type": "json"}` |
| API request > Request Body | String | The static request body to send with the HTTP request. | Optional | NA | `{"foo": "bar"}` |
| API request > Headers | Key/Value pairs | The static request headers to send with the HTTP request. | Optional | NA | `[{"key": {"type":"static", "value": "asset"}, "value": {"type": "static", "value": "asset-id-0"}} ]` |
| Request interval | [Duration](concept-configuration-patterns.md#duration) | String representation of the time to wait before the next API call. | Required | `10s`| `24h` |
| Partitioning | [Partitioning](#configure-partitioning) | Partitioning configuration for the source stage. | Required | NA | See [partitioning](#configure-partitioning) |

To learn more about secrets, see [Manage secrets for your Azure IoT Operations deployment](../deploy-iot-ops/howto-manage-secrets.md).

## Select data format

[!INCLUDE [data-processor-data-format](../includes/data-processor-data-format.md)]

## Configure partitioning

[!INCLUDE [data-processor-configure-partition](../includes/data-processor-configure-partition.md)]

| Field | Description | Required | Default | Example |
| ----- | ----------- | -------- | ------- | ------- |
| Partition type | The type of partitioning to be used: Partition `ID` or Partition `Key` | Required | `ID` | `ID` |
| Partition expression | The [jq expression](../process-data/concept-jq-expression.md) to use on the incoming message to compute the partition `ID` or partition `Key` | Required | `0` | `.payload.header` |
| Number of partitions| The number of partitions in a Data Processor pipeline. | Required | `1` | `1` |

The source stage applies the partitioning expression to the incoming message to compute the partition `ID` or `Key`.

Data Processor adds additional metadata to the incoming message. See [Data Processor message structure overview](concept-message-structure.md) to understand how to correctly specify the partitioning expression that runs on the incoming message. By default, the partitioning expression is set to `0` with the **Partition type** as `ID` to send all the incoming data to a single partition.

For recommendations and to learn more, see [What is partitioning?](../process-data/concept-partitioning.md).

## Related content

- [Serialization and deserialization formats](concept-supported-formats.md)
- [What is partitioning?](concept-partitioning.md)
