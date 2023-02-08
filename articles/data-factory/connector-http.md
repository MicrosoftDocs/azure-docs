---
title: Copy data from an HTTP source
titleSuffix: Azure Data Factory & Azure Synapse
description: Learn how to copy data from a cloud or on-premises HTTP source to supported sink data stores by using a copy activity in an Azure Data Factory or Azure Synapse Analytics pipeline.
author: jianleishen
ms.service: data-factory
ms.subservice: data-movement
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/26/2022
ms.author: jianleishen
---
# Copy data from an HTTP endpoint by using Azure Data Factory or Azure Synapse Analytics

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-http-connector.md)
> * [Current version](connector-http.md)

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article outlines how to use Copy Activity in Azure Data Factory and Azure Synapse to copy data from an HTTP endpoint. The article builds on [Copy Activity](copy-activity-overview.md), which presents a general overview of Copy Activity.

The difference among this HTTP connector, the [REST connector](connector-rest.md) and the [Web table connector](connector-web-table.md) are:

- **REST connector** specifically support copying data from RESTful APIs; 
- **HTTP connector** is generic to retrieve data from any HTTP endpoint, e.g. to download file. Before REST connector becomes available, you may happen to use the HTTP connector to copy data from RESTful APIs, which is supported but less functional comparing to REST connector.
- **Web table connector** extracts table content from an HTML webpage.

## Supported capabilities

This HTTP connector is supported for the following capabilities:

| Supported capabilities|IR |
|---------| --------|
|[Copy activity](copy-activity-overview.md) (source/-)|&#9312; &#9313;|
|[Lookup activity](control-flow-lookup-activity.md)|&#9312; &#9313;|

<small>*&#9312; Azure integration runtime &#9313; Self-hosted integration runtime*</small>

For a list of data stores that are supported as sources/sinks, see [Supported data stores](connector-overview.md#supported-data-stores).

You can use this HTTP connector to:

- Retrieve data from an HTTP/S endpoint by using the HTTP **GET** or **POST** methods.
- Retrieve data by using one of the following authentications: **Anonymous**, **Basic**, **Digest**, **Windows**, or **ClientCertificate**.
- Copy the HTTP response as-is or parse it by using [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

> [!TIP]
> To test an HTTP request for data retrieval before you configure the HTTP connector, learn about the API specification for header and body requirements. You can use tools like Postman or a web browser to validate.

## Prerequisites

[!INCLUDE [data-factory-v2-integration-runtime-requirements](includes/data-factory-v2-integration-runtime-requirements.md)]

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](includes/data-factory-v2-connector-get-started.md)]

## Create a linked service to an HTTP source using UI

Use the following steps to create a linked service to an HTTP source in the Azure portal UI.

1. Browse to the Manage tab in your Azure Data Factory or Synapse workspace and select Linked Services, then click New:

    # [Azure Data Factory](#tab/data-factory)

    :::image type="content" source="media/doc-common-process/new-linked-service.png" alt-text="Screenshot of creating a new linked service with Azure Data Factory UI.":::

    # [Azure Synapse](#tab/synapse-analytics)

    :::image type="content" source="media/doc-common-process/new-linked-service-synapse.png" alt-text="Screenshot of creating a new linked service with Azure Synapse UI.":::

2. Search for HTTP and select the HTTP connector.

    :::image type="content" source="media/connector-http/http-connector.png" alt-text="Screenshot of the HTTP connector.":::    

1. Configure the service details, test the connection, and create the new linked service.

    :::image type="content" source="media/connector-http/configure-http-linked-service.png" alt-text="Screenshot of configuration for an HTTP linked service.":::

## Connector configuration details

The following sections provide details about properties you can use to define entities that are specific to the HTTP connector.

## Linked service properties

The following properties are supported for the HTTP linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **HttpServer**. | Yes |
| url | The base URL to the web server. | Yes |
| enableServerCertificateValidation | Specify whether to enable server TLS/SSL certificate validation when you connect to an HTTP endpoint. If your HTTPS server uses a self-signed certificate, set this property to **false**. | No<br /> (the default is **true**) |
| authenticationType | Specifies the authentication type. Allowed values are **Anonymous**, **Basic**, **Digest**, **Windows**, and **ClientCertificate**. You can additionally configure authentication headers in `authHeader` property. See the sections that follow this table for more properties and JSON samples for these authentication types. | Yes |
| authHeaders | Additional HTTP request headers for authentication.<br/> For example, to use API key authentication, you can select authentication type as “Anonymous” and specify API key in the header. | No |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. Learn more from [Prerequisites](#prerequisites) section. If not specified, the default Azure Integration Runtime is used. |No |

### Using Basic, Digest, or Windows authentication

Set the **authenticationType** property to **Basic**, **Digest**, or **Windows**. In addition to the generic properties that are described in the preceding section, specify the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | The user name to use to access the HTTP endpoint. | Yes |
| password | The password for the user (the **userName** value). Mark this field as a **SecureString** type to store it securely. You can also [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

**Example**

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "HttpServer",
        "typeProperties": {
            "authenticationType": "Basic",
            "url" : "<HTTP endpoint>",
            "userName": "<user name>",
            "password": {
                "type": "SecureString",
                "value": "<password>"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Using ClientCertificate authentication

To use ClientCertificate authentication, set the **authenticationType** property to **ClientCertificate**. In addition to the generic properties that are described in the preceding section, specify the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| embeddedCertData | Base64-encoded certificate data. | Specify either **embeddedCertData** or **certThumbprint**. |
| certThumbprint | The thumbprint of the certificate that's installed on your self-hosted Integration Runtime machine's cert store. Applies only when the self-hosted type of Integration Runtime is specified in the **connectVia** property. | Specify either **embeddedCertData** or **certThumbprint**. |
| password | The password that's associated with the certificate. Mark this field as a **SecureString** type to store it securely. You can also [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |

If you use **certThumbprint** for authentication and the certificate is installed in the personal store of the local computer, grant read permissions to the self-hosted Integration Runtime:

1. Open the Microsoft Management Console (MMC). Add the **Certificates** snap-in that targets **Local Computer**.
2. Expand **Certificates** > **Personal**, and then select **Certificates**.
3. Right-click the certificate from the personal store, and then select **All Tasks** > **Manage Private Keys**.
4. On the **Security** tab, add the user account under which the Integration Runtime Host Service (DIAHostService) is running, with read access to the certificate.
5. The HTTP connector loads only trusted certificates. If you're using a self-signed or nonintegrated CA-issued certificate, to enable trust, the certificate must also be installed in one of the following stores:
   - Trusted People
   - Third-Party Root Certification Authorities
   - Trusted Root Certification Authorities

**Example 1: Using certThumbprint**

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "HttpServer",
        "typeProperties": {
            "authenticationType": "ClientCertificate",
            "url": "<HTTP endpoint>",
            "certThumbprint": "<thumbprint of certificate>"
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

**Example 2: Using embeddedCertData**

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "HttpServer",
        "typeProperties": {
            "authenticationType": "ClientCertificate",
            "url": "<HTTP endpoint>",
            "embeddedCertData": "<Base64-encoded cert data>",
            "password": {
                "type": "SecureString",
                "value": "password of cert"
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

### Using authentication headers

In addition, you can configure request headers for authentication along with the built-in authentication types.

**Example: Using API key authentication**

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "HttpServer",
        "typeProperties": {
            "url": "<HTTP endpoint>",
            "authenticationType": "Anonymous",
            "authHeader": {
                "x-api-key": {
                    "type": "SecureString",
                    "value": "<API key>"
                }
            }
        },
        "connectVia": {
            "referenceName": "<name of Integration Runtime>",
            "type": "IntegrationRuntimeReference"
        }
    }
}
```

## Dataset properties

For a full list of sections and properties available for defining datasets, see the [Datasets](concepts-datasets-linked-services.md) article. 

[!INCLUDE [data-factory-v2-file-formats](includes/data-factory-v2-file-formats.md)] 

The following properties are supported for HTTP under `location` settings in format-based dataset:

| Property    | Description                                                  | Required |
| ----------- | ------------------------------------------------------------ | -------- |
| type        | The type property under `location` in dataset must be set to **HttpServerLocation**. | Yes      |
| relativeUrl | A relative URL to the resource that contains the data. The HTTP connector copies data from the combined URL: `[URL specified in linked service][relative URL specified in dataset]`.   | No       |

> [!NOTE]
> The supported HTTP request payload size is around 500 KB. If the payload size you want to pass to your web endpoint is larger than 500 KB, consider batching the payload in smaller chunks.

**Example:**

```json
{
    "name": "DelimitedTextDataset",
    "properties": {
        "type": "DelimitedText",
        "linkedServiceName": {
            "referenceName": "<HTTP linked service name>",
            "type": "LinkedServiceReference"
        },
        "schema": [ < physical schema, optional, auto retrieved during authoring > ],
        "typeProperties": {
            "location": {
                "type": "HttpServerLocation",
                "relativeUrl": "<relative url>"
            },
            "columnDelimiter": ",",
            "quoteChar": "\"",
            "firstRowAsHeader": true,
            "compressionCodec": "gzip"
        }
    }
}
```

## Copy Activity properties

This section provides a list of properties that the HTTP source supports.

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md). 

### HTTP as source

[!INCLUDE [data-factory-v2-file-formats](includes/data-factory-v2-file-formats.md)] 

The following properties are supported for HTTP under `storeSettings` settings in format-based copy source:

| Property                 | Description                                                  | Required |
| ------------------------ | ------------------------------------------------------------ | -------- |
| type                     | The type property under `storeSettings` must be set to **HttpReadSettings**. | Yes      |
| requestMethod            | The HTTP method. <br>Allowed values are **Get** (default) and **Post**. | No       |
| additionalHeaders         | Additional HTTP request headers.                             | No       |
| requestBody              | The body for the HTTP request.                               | No       |
| httpRequestTimeout           | The timeout (the **TimeSpan** value) for the HTTP request to get a response. This value is the timeout to get a response, not the timeout to read response data. The default value is **00:01:40**. | No       |
| maxConcurrentConnections |The upper limit of concurrent connections established to the data store during the activity run. Specify a value only when you want to limit concurrent connections.| No       |

**Example:**

```json
"activities":[
    {
        "name": "CopyFromHTTP",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<Delimited text input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "DelimitedTextSource",
                "formatSettings":{
                    "type": "DelimitedTextReadSettings",
                    "skipLineCount": 10
                },
                "storeSettings":{
                    "type": "HttpReadSettings",
                    "requestMethod": "Post",
                    "additionalHeaders": "<header key: header value>\n<header key: header value>\n",
                    "requestBody": "<body for POST HTTP request>"
                }
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Lookup activity properties

To learn details about the properties, check [Lookup activity](control-flow-lookup-activity.md).

## Legacy models

>[!NOTE]
>The following models are still supported as-is for backward compatibility. You are suggested to use the new model mentioned in above sections going forward, and the authoring UI has switched to generating the new model.

### Legacy dataset model

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **HttpFile**. | Yes |
| relativeUrl | A relative URL to the resource that contains the data. When this property isn't specified, only the URL that's specified in the linked service definition is used. | No |
| requestMethod | The HTTP method. Allowed values are **Get** (default) and **Post**. | No |
| additionalHeaders | Additional HTTP request headers. | No |
| requestBody | The body for the HTTP request. | No |
| format | If you want to retrieve data from the HTTP endpoint as-is without parsing it, and then copy the data to a file-based store, skip the **format** section in both the input and output dataset definitions.<br/><br/>If you want to parse the HTTP response content during copy, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, and **ParquetFormat**. Under **format**, set the **type** property to one of these values. For more information, see [JSON format](supported-file-formats-and-compression-codecs-legacy.md#json-format), [Text format](supported-file-formats-and-compression-codecs-legacy.md#text-format), [Avro format](supported-file-formats-and-compression-codecs-legacy.md#avro-format), [Orc format](supported-file-formats-and-compression-codecs-legacy.md#orc-format), and [Parquet format](supported-file-formats-and-compression-codecs-legacy.md#parquet-format). |No |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs-legacy.md#compression-support).<br/><br/>Supported types: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels:  **Optimal** and **Fastest**. |No |

> [!NOTE]
> The supported HTTP request payload size is around 500 KB. If the payload size you want to pass to your web endpoint is larger than 500 KB, consider batching the payload in smaller chunks.

**Example 1: Using the Get method (default)**

```json
{
    "name": "HttpSourceDataInput",
    "properties": {
        "type": "HttpFile",
        "linkedServiceName": {
            "referenceName": "<HTTP linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "relativeUrl": "<relative url>",
            "additionalHeaders": "Connection: keep-alive\nUser-Agent: Mozilla/5.0\n"
        }
    }
}
```

**Example 2: Using the Post method**

```json
{
    "name": "HttpSourceDataInput",
    "properties": {
        "type": "HttpFile",
        "linkedServiceName": {
            "referenceName": "<HTTP linked service name>",
            "type": "LinkedServiceReference"
        },
        "typeProperties": {
            "relativeUrl": "<relative url>",
            "requestMethod": "Post",
            "requestBody": "<body for POST HTTP request>"
        }
    }
}
```

### Legacy copy activity source model

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the copy activity source must be set to **HttpSource**. | Yes |
| httpRequestTimeout | The timeout (the **TimeSpan** value) for the HTTP request to get a response. This value is the timeout to get a response, not the timeout to read response data. The default value is **00:01:40**.  | No |

**Example**

```json
"activities":[
    {
        "name": "CopyFromHTTP",
        "type": "Copy",
        "inputs": [
            {
                "referenceName": "<HTTP input dataset name>",
                "type": "DatasetReference"
            }
        ],
        "outputs": [
            {
                "referenceName": "<output dataset name>",
                "type": "DatasetReference"
            }
        ],
        "typeProperties": {
            "source": {
                "type": "HttpSource",
                "httpRequestTimeout": "00:01:00"
            },
            "sink": {
                "type": "<sink type>"
            }
        }
    }
]
```

## Next steps

For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
