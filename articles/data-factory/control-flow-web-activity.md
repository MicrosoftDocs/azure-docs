---
title: Web Activity in Azure Data Factory 
description: Learn how you can use Web Activity, one of the control flow activities supported by Data Factory, to invoke a REST endpoint from a pipeline.
author: nabhishek
ms.author: abnarain
ms.service: data-factory
ms.topic: conceptual
ms.date: 12/19/2018
---

# Web activity in Azure Data Factory
[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]


Web Activity can be used to call a custom REST endpoint from a Data Factory pipeline. You can pass datasets and linked services to be consumed and accessed by the activity.

> [!NOTE]
> Web Activity is supported for invoking URLs that are hosted in a private virtual network as well by leveraging self-hosted integration runtime. The integration runtime should have a line of sight to the URL endpoint. 

> [!NOTE]
> The maximum supported output response payload size is 4 MB.  

## Syntax

```json
{
   "name":"MyWebActivity",
   "type":"WebActivity",
   "typeProperties":{
      "method":"Post",
      "url":"<URLEndpoint>",
      "connectVia": {
          "referenceName": "<integrationRuntimeName>",
          "type": "IntegrationRuntimeReference"
      }
      "headers":{
         "Content-Type":"application/json"
      },
      "authentication":{
         "type":"ClientCertificate",
         "pfx":"****",
         "password":"****"
      },
      "datasets":[
         {
            "referenceName":"<ConsumedDatasetName>",
            "type":"DatasetReference",
            "parameters":{
               ...
            }
         }
      ],
      "linkedServices":[
         {
            "referenceName":"<ConsumedLinkedServiceName>",
            "type":"LinkedServiceReference"
         }
      ]
   }
}

```

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the web activity | String | Yes
type | Must be set to **WebActivity**. | String | Yes
method | Rest API method for the target endpoint. | String. <br/><br/>Supported Types: "GET", "POST", "PUT" | Yes
url | Target endpoint and path | String (or expression with resultType of string). The activity will timeout at 1 minute with an error if it does not receive a response from the endpoint. | Yes
headers | Headers that are sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us", "Content-Type": "application/json" }`. | String (or expression with resultType of string) | Yes, Content-type header is required. `"headers":{ "Content-Type":"application/json"}`
body | Represents the payload that is sent to the endpoint.  | String (or expression with resultType of string). <br/><br/>See the schema of the request payload in [Request payload schema](#request-payload-schema) section. | Required for POST/PUT methods.
authentication | Authentication method used for calling the endpoint. Supported Types are "Basic, or ClientCertificate." For more information, see [Authentication](#authentication) section. If authentication is not required, exclude this property. | String (or expression with resultType of string) | No
datasets | List of datasets passed to the endpoint. | Array of dataset references. Can be an empty array. | Yes
linkedServices | List of linked services passed to endpoint. | Array of linked service references. Can be an empty array. | Yes
connectVia | The [integration runtime](./concepts-integration-runtime.md) to be used to connect to the data store. You can use the Azure integration runtime or the self-hosted integration runtime (if your data store is in a private network). If this property isn't specified, the service uses the default Azure integration runtime. | The integration runtime reference. | No 

> [!NOTE]
> REST endpoints that the web activity invokes must return a response of type JSON. The activity will timeout at 1 minute with an error if it does not receive a response from the endpoint.

The following table shows the requirements for JSON content:

| Value type | Request body | Response body |
|---|---|---|
|JSON object | Supported | Supported |
|JSON array | Supported <br/>(At present, JSON arrays don't work as a result of a bug. A fix is in progress.) | Unsupported |
| JSON value | Supported | Unsupported |
| Non-JSON type | Unsupported | Unsupported |
||||

## Authentication

Below are the supported authentication types in the web activity.

### None

If authentication is not required, do not include the "authentication" property.

### Basic

Specify user name and password to use with the basic authentication.

```json
"authentication":{
   "type":"Basic",
   "username":"****",
   "password":"****"
}
```

### Client certificate

Specify base64-encoded contents of a PFX file and the password.

```json
"authentication":{
   "type":"ClientCertificate",
   "pfx":"****",
   "password":"****"
}
```

### Managed Identity

Specify the resource uri for which the access token will be requested using the managed identity for the data factory. To call the Azure Resource Management API, use `https://management.azure.com/`. For more information about how managed identities works see the [managed identities for Azure resources overview page](../active-directory/managed-identities-azure-resources/overview.md).

```json
"authentication": {
	"type": "MSI",
	"resource": "https://management.azure.com/"
}
```

> [!NOTE]
> If your data factory is configured with a git repository, you must store your credentials in Azure Key Vault to use basic or client certificate authentication. Azure Data Factory doesn't store passwords in git.

## Request payload schema
When you use the POST/PUT method, the body property represents the payload that is sent to the endpoint. You can pass linked services and datasets as part of the payload. Here is the schema for the payload:

```json
{
    "body": {
        "myMessage": "Sample",
        "datasets": [{
            "name": "MyDataset1",
            "properties": {
                ...
            }
        }],
        "linkedServices": [{
            "name": "MyStorageLinkedService1",
            "properties": {
                ...
            }
        }]
    }
}
```

## Example
In this example, the web activity in the pipeline calls a REST end point. It passes an Azure SQL linked service and an Azure SQL dataset to the endpoint. The REST end point uses the Azure SQL connection string to connect to the logical SQL server and returns the name of the instance of SQL server.

### Pipeline definition

```json
{
    "name": "<MyWebActivityPipeline>",
    "properties": {
        "activities": [
            {
                "name": "<MyWebActivity>",
                "type": "WebActivity",
                "typeProperties": {
                    "method": "Post",
                    "url": "@pipeline().parameters.url",
                    "headers": {
                        "Content-Type": "application/json"
                    },
                    "authentication": {
                        "type": "ClientCertificate",
                        "pfx": "*****",
                        "password": "*****"
                    },
                    "datasets": [
                        {
                            "referenceName": "MySQLDataset",
                            "type": "DatasetReference",
                            "parameters": {
                                "SqlTableName": "@pipeline().parameters.sqlTableName"
                            }
                        }
                    ],
                    "linkedServices": [
                        {
                            "referenceName": "SqlLinkedService",
                            "type": "LinkedServiceReference"
                        }
                    ]
                }
            }
        ],
        "parameters": {
            "sqlTableName": {
                "type": "String"
            },
            "url": {
                "type": "String"
            }
        }
    }
}

```

### Pipeline parameter values

```json
{
    "sqlTableName": "department",
    "url": "https://adftes.azurewebsites.net/api/execute/running"
}

```

### Web service endpoint code

```csharp

[HttpPost]
public HttpResponseMessage Execute(JObject payload)
{
    Trace.TraceInformation("Start Execute");

    JObject result = new JObject();
    result.Add("status", "complete");

    JArray datasets = payload.GetValue("datasets") as JArray;
    result.Add("sinktable", datasets[0]["properties"]["typeProperties"]["tableName"].ToString());

    JArray linkedServices = payload.GetValue("linkedServices") as JArray;
    string connString = linkedServices[0]["properties"]["typeProperties"]["connectionString"].ToString();

    System.Data.SqlClient.SqlConnection sqlConn = new System.Data.SqlClient.SqlConnection(connString);

    result.Add("sinkServer", sqlConn.DataSource);

    Trace.TraceInformation("Stop Execute");

    return this.Request.CreateResponse(HttpStatusCode.OK, result);
}

```

## Next steps
See other control flow activities supported by Data Factory:

- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
