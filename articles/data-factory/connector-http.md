---
title: Copy data from an HTTP source by using Azure Data Factory | Microsoft Docs
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
# Copy data from an HTTP endpoint by using Azure Data Factory

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](v1/data-factory-http-connector.md)
> * [Current version](connector-http.md)

This article outlines how to use Copy Activity in Azure Data Factory to copy data from an HTTP endpoint. The article builds on [Copy Activity in Azure Data Factory](copy-activity-overview.md), which presents a general overview of Copy Activity.

## Supported capabilities

You can copy data from an HTTP source to any supported sink data store. For a list of data stores that Copy Activity supports as sources and sinks, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).

You can use this HTTP connector to:

- Retrieve data from an HTTP/S endpoint by using the HTTP **GET** or **POST** methods.
- Retrieve data by using one of the following authentications: **Anonymous**, **Basic**, **Digest**, **Windows**, or **ClientCertificate**.
- Copy the HTTP response as-is or parse it by using [supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md).

The difference between this connector and the [Web table connector](connector-web-table.md) is that the Web table connector extracts table content from an HTML webpage.

> [!TIP]
> To test an HTTP request for data retrieval before you configure the HTTP connector in Data Factory, learn about the API specification for header and body requirements. You can use tools like Postman or a web browser to validate.

## Get started

[!INCLUDE [data-factory-v2-connector-get-started](../../includes/data-factory-v2-connector-get-started.md)]

The following sections provide details about properties you can use to define Data Factory entities that are specific to the HTTP connector.

## Linked service properties

The following properties are supported for the HTTP linked service:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property must be set to **HttpServer**. | Yes |
| url | The base URL to the web server. | Yes |
| enableServerCertificateValidation | Specify whether to enable server SSL certificate validation when you connect to an HTTP endpoint. If your HTTPS server uses a self-signed certificate, set this property to **false**. | No<br /> (the default is **true**) |
| authenticationType | Specifies the authentication type. Allowed values are **Anonymous**, **Basic**, **Digest**, **Windows**, and **ClientCertificate**. <br><br> See the sections that follow this table for more properties and JSON samples for these authentication types. | Yes |
| connectVia | The [Integration Runtime](concepts-integration-runtime.md) to use to connect to the data store. You can use the Azure Integration Runtime or a self-hosted Integration Runtime (if your data store is located in a private network). If not specified, this property uses the default Azure Integration Runtime. |No |

### Using Basic, Digest, or Windows authentication

Set the **authenticationType** property to **Basic**, **Digest**, or **Windows**. In addition to the generic properties that are described in the preceding section, specify the following properties:

| Property | Description | Required |
|:--- |:--- |:--- |
| userName | The user name to use to access the HTTP endpoint. | Yes |
| password | The password for the user (the **userName** value). Mark this field as a **SecureString** type to store it securely in Data Factory. You can also [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | Yes |

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
| password | The password that's associated with the certificate. Mark this field as a **SecureString** type to store it securely in Data Factory. You can also [reference a secret stored in Azure Key Vault](store-credentials-in-key-vault.md). | No |

If you use **certThumbprint** for authentication and the certificate is installed in the personal store of the local computer, grant read permissions to the self-hosted Integration Runtime:

1. Open the Microsoft Management Console (MMC). Add the **Certificates** snap-in that targets **Local Computer**.
2. Expand **Certificates** > **Personal**, and then select **Certificates**.
3. Right-click the certificate from the personal store, and then select **All Tasks** > **Manage Private Keys**.
3. On the **Security** tab, add the user account under which the Integration Runtime Host Service (DIAHostService) is running, with read access to the certificate.

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

## Dataset properties

This section provides a list of properties that the HTTP dataset supports. 

For a full list of sections and properties that are available for defining datasets, see [Datasets and linked services](concepts-datasets-linked-services.md). 

To copy data from HTTP, set the **type** property of the dataset to **HttpFile**. The following properties are supported:

| Property | Description | Required |
|:--- |:--- |:--- |
| type | The **type** property of the dataset must be set to **HttpFile**. | Yes |
| relativeUrl | A relative URL to the resource that contains the data. When this property isn't specified, only the URL that's specified in the linked service definition is used. | No |
| requestMethod | The HTTP method. Allowed values are **Get** (default) and **Post**. | No |
| additionalHeaders | Additional HTTP request headers. | No |
| requestBody | The body for the HTTP request. | No |
| format | If you want to retrieve data from the HTTP endpoint as-is without parsing it, and then copy the data to a file-based store, skip the **format** section in both the input and output dataset definitions.<br/><br/>If you want to parse the HTTP response content during copy, the following file format types are supported: **TextFormat**, **JsonFormat**, **AvroFormat**, **OrcFormat**, and **ParquetFormat**. Under **format**, set the **type** property to one of these values. For more information, see [JSON format](supported-file-formats-and-compression-codecs.md#json-format), [Text format](supported-file-formats-and-compression-codecs.md#text-format), [Avro format](supported-file-formats-and-compression-codecs.md#avro-format), [Orc format](supported-file-formats-and-compression-codecs.md#orc-format), and [Parquet format](supported-file-formats-and-compression-codecs.md#parquet-format). |No |
| compression | Specify the type and level of compression for the data. For more information, see [Supported file formats and compression codecs](supported-file-formats-and-compression-codecs.md#compression-support).<br/><br/>Supported types: **GZip**, **Deflate**, **BZip2**, and **ZipDeflate**.<br/>Supported levels:  **Optimal** and **Fastest**. |No |

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

## Copy Activity properties

This section provides a list of properties that the HTTP source supports.

For a full list of sections and properties that are available for defining activities, see [Pipelines](concepts-pipelines-activities.md). 

### HTTP as source

To copy data from HTTP, set **source type** in the copy activity to **HttpSource**. The following properties are supported in the copy activity **source** section:

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

For a list of data stores that Copy Activity supports as sources and sinks in Azure Data Factory, see [Supported data stores and formats](copy-activity-overview.md#supported-data-stores-and-formats).
