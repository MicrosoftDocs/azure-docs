---
title: Copy data from HTTP source using Azure Data Factory | Microsoft Docs
description: Learn how to copy data from a cloud or on-premises HTTP source to supported sink data stores by using a copy activity in an Azure Data Factory pipeline.
services: data-factory
documentationcenter: ''
author: linda33wj
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 08/24/2018
ms.author: jingwang

---
# Copy data from HTTP endpoint using Azure Data Factory
> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-http-connector.md)
> * [Current version](connector-http.md)

This article outlines how to use the Copy Activity in Azure Data Factory to copy data from an HTTP endpoint. It builds on the [copy activity overview](copy-activity-overview.md) article that presents a general overview of copy activity.

## Supported capabilities

You can copy data from HTTP source to any supported sink data store. For a list of data stores that are supported as sources/sinks by the copy activity, see the [Supported data stores](copy-activity-overview.md#supported-data-stores-and-formats) table.

Specifically, this HTTP connector supports:

- Retrieving data from HTTP/s endpoint by using HTTP **GET** or **POST** method.
- Retrieving data using the following authentications: **Anonymous**, **Basic**, **Digest**, **Windows**, and **ClientCertificate**.
- Copying the HTTP response as-is or parsing it with the [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

The difference between this connector and the [Web table connector](connector-web-table.md) is that the latter is used to extract table content from web HTML page.

>[!TIP]
>To test HTTP request for data retrieving before configuring HTTP connector in ADF, you can learn from the API spec on header and body requirements, and use tools like Postman or web browser to validate.

## Getting started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties that are used to define Data Factory entities specific to HTTP connector.

## Linked service properties

The following properties are supported for HTTP linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property must be set to: **HttpServer**. | Yes |
| url | Base URL to the Web Server | Yes |
| enableServerCertificateValidation | Specify whether to enable server SSL certificate validation when connecting to HTTP endpoint. When your HTTPS server is using self-signed certificate, set this to false. | No, default is true |
| authenticationType | Specifies the authentication type. Allowed values are: **Anonymous**, **Basic**, **Digest**, **Windows**, **ClientCertificate**. <br><br> Refer to sections below this table on more properties and JSON samples for those authentication types respectively. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to be used to connect to the data store. You can use Azure Integration Runtime or Self-hosted Integration Runtime (if your data store is located in private network). If not specified, it uses the default Azure Integration Runtime. |No |

### Using Basic, Digest, or Windows authentication

Set "authenticationType" property to **Basic**, **Digest**, or **Windows**, and specify the following properties along with generic properties described in the previous section:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | User name to access the HTTP endpoint. | Yes |
| password | Password for the user (userName). Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

**Example**

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "HttpServer",
        "typeProperties": {
            "authenticationType": "Basic",
            "url" : "<HTTP endpoint>",
            "userName": "<username>",
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

To use ClientCertificate authentication, set "authenticationType" property to **ClientCertificate**, and specify the following properties along with the generic properties described in the previous section:

| Property | Description | Required |
|:--- |:--- |:--- |
| embeddedCertData | Base64 encoded certificate data. | Specify either the `embeddedCertData` or `certThumbprint`. |
| certThumbprint | The thumbprint of the certificate that is installed on your Self-hosted Integration Runtime machine's cert store. Applies only when Self-hosted type of Integration Runtime is specified in connectVia. | Specify either the `embeddedCertData` or `certThumbprint`. |
| password | Password associated with the certificate. Mark this field as a SecureString to store it securely in Data Factory, or [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |

If you use "certThumbprint" for authentication and the certificate is installed in the personal store of the local computer, you need to grant the read permission to the Self-hosted Integration Runtime:

1. Launch Microsoft Management Console (MMC). Add the **Certificates** snap-in that targets the **Local Computer**.
2. Expand **Certificates**, **Personal**, and click **Certificates**.
3. Right-click the certificate from the personal store, and select **All Tasks** -> **Manage Private Keys...**
3. On the **Security** tab, add the user account under which Integration Runtime Host Service (DIAHostService) is running with the read access to the certificate.

**Example 1: using certThumbprint**

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

**Example 2: using embeddedCertData**

```json
{
    "name": "HttpLinkedService",
    "properties": {
        "type": "HttpServer",
        "typeProperties": {
            "authenticationType": "ClientCertificate",
            "url": "<HTTP endpoint>",
            "embeddedCertData": "<base64 encoded cert data>",
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

## Dataset properties

For a full list of sections and properties available for defining datasets, see the datasets article. This section provides a list of properties supported by HTTP dataset.

To copy data from HTTP, set the type property of the dataset to **HttpFile**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the dataset must be set to: **HttpFile** | Yes |
| relativeUrl | A relative URL to the resource that contains the data. When this property is not specified, only the URL specified in the linked service definition is used. | No |
| requestMethod | Http method.<br/>Allowed values are **Get** (default) or **Post**. | No |
| additionalHeaders | Additional HTTP request headers. | No |
| requestBody | Body for HTTP request. | No |
| format | If you want to **retrieve data from HTTP endpoint as-is** without parsing it and copy to a file-based store, skip the format section in both input and output dataset definitions.<br/><br/>If you want to parse the HTTP response content during copy, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, **ParquetFormat**. Set the **type** property under format to one of these values. For more information, see [Json Format](supported-file-formats-and-compression-codecs.md#json-format), [Text Format](supported-file-formats-and-compression-codecs.md#text-format), [Avro Format](supported-file-formats-and-compression-codecs.md#avro-format), [Orc Format](supported-file-formats-and-compression-codecs.md#orc-format), and [Parquet Format](supported-file-formats-and-compression-codecs.md#parquet-format) sections. |No |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md#compression-support).<br/>Supported types are: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels are: **Optimal** and **Fastest**. |No |

>[!NOTE]
>The supported HTTP request payload size is around 500KB. If the payload size you want to pass to your web endpoint is larger than this, consider to batch into smaller chunks.

**Example 1: using Get method (default)**

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

**Example 2: using Post method**

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

## Copy activity properties

For a full list of sections and properties available for defining activities, see the [Pipelines](concepts-pipelines-activities.md) article. This section provides a list of properties supported by HTTP source.

### HTTP as source

To copy data from HTTP, set the source type in the copy activity to **HttpSource**. The following properties are supported in the copy activity **source** section:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The type property of the copy activity source must be set to: **HttpSource** | Yes |
| httpRequestTimeout | The timeout (TimeSpan) for the HTTP request to get a response. It is the timeout to get a response, not the timeout to read response data.<br/> Default value is: 00:01:40  | No |

**Example:**

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
For a list of data stores supported as sources and sinks by the copy activity in Azure Data Factory, see [supported data stores](copy-activity-overview.md#supported-data-stores-and-formats).
