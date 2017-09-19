---
title: Web Activity in Azure Data Factory | Microsoft Docs
description: Learn how you can use Web Activity, one of the control flow activities supported by Data Factory, to invoke a REST endpoint from a pipeline. 
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: jhubbard
editor: 

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 09/05/2017
ms.author: shlo

---
# Web activity in Azure Data Factory
Web Activity can be used to call a custom REST endpoint from a Data Factory pipeline. You can pass datasets and linked services to be consumed and accessed by the activity. 

## Syntax

```json
{  
   "name":"MyWebActivity",
   "type":"WebActivity",
   "typeProperties":{  
      "method":"Post",
      "url":"<URLEndpoint>",
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
url | Target endpoint and path | String (or expression with resultType of string) | Yes
headers | Headers that are sent to the request. For example, to set the language and type on a request: `"headers" : { "Accept-Language": "en-us", "Content-Type": "application/json" }`. | String (or expression with resultType of string) | Yes, Content-type header is required. `"headers":{ "Content-Type":"application/json"}`
body | Represents the payload that is sent to the endpoint. Required for POST/PUT methods.  | String (or expression with resultType of string). <br/><br/>See the schema of the request payload in [Request payload schema](#request-payload-schema) section. | No
authentication | Authentication method used for calling the endpoint. Supported Types are "Basic, or ClientCertificate." For more information, see [Authentication](#authentication) section. If authentication is not required, exclude this property. | String (or expression with resultType of string) | No
datasets | List of datasets passed to the endpoint. | Array of dataset references. Can be an empty array. | Yes
linkedServices | List of linked services passed to endpoint. | Array of linked service references. Can be an empty array. | Yes

> [!NOTE]
> REST endpoints that the web activity invokes must return a response of type JSON.

## Authentication

### None
If authentication is not required, do not include the "authentication" property.

### Basic
Specify user name and password to use with the basic authentication. 

```json
"authentication":{  
   "type":"Basic,
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
## Request payload schema
When you use the POST/PUT method, the body property represents the payload that is sent to the endpoint. You can pass linked services and datasets as part of the payload. Here is the schema for the payload: 

```json
{  
   "body":{  
      "message":"Sample"
   },
   "datasets":[  
      {  
         "name":"MyDataset1",
         "properties":{  
            ...
         }
      }
   ],
   "linkedServices":[  
      {  
         "name":"MyStorageLinkedService1",
         "properties":{  
            ...
         }
      }
   ]
}

```

## Example
In this example, the web activity in the pipeline calls a REST end point. It passes an Azure SQL linked service and an Azure SQL dataset to the endpoint. The REST end point uses the Azure SQL connection string to connect to the Azure SQL server and returns the name of the instance of SQL server. 

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

- [Do Until Activity](control-flow-do-until-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [If Condition](control-flow-if-condition.md)
