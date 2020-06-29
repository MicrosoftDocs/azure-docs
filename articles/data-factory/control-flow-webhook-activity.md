---
title: Webhook activity in Azure Data Factory 
description: The webhook activity doesn't continue execution of the pipeline until it validates the attached dataset with certain criteria the user specifies.
services: data-factory
documentationcenter: ''
author: djpmsft
ms.author: daperlov
manager: jroth
ms.reviewer: maghan
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.date: 03/25/2019
---

# Webhook activity in Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

A webhook activity can control the execution of pipelines through your custom code. With the webhook activity, customers' code can call an endpoint and pass it a callback URL. The pipeline run waits for the callback invocation before it proceeds to the next activity.

## Syntax

```json

{
    "name": "MyWebHookActivity",
    "type": "WebHook",
    "typeProperties": {
        "method": "POST",
        "url": "<URLEndpoint>",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": {
            "key": "value"
        },
        "timeout": "00:03:00",
        "authentication": {
            "type": "ClientCertificate",
            "pfx": "****",
            "password": "****"
        }
    }
}

```

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
**name** | The name of the webhook activity. | String | Yes |
**type** | Must be set to "WebHook". | String | Yes |
**method** | The REST API method for the target endpoint. | String. The supported type is "POST". | Yes |
**url** | The target endpoint and path. | A string or an expression with the **resultType** value of a string. | Yes |
**headers** | Headers that are sent to the request. Here's an example that sets the language and type on a request: `"headers" : { "Accept-Language": "en-us", "Content-Type": "application/json" }`. | A string or an expression with the **resultType** value of a string. | Yes. A `Content-Type` header like `"headers":{ "Content-Type":"application/json"}` is required. |
**body** | Represents the payload that is sent to the endpoint. | Valid JSON or an expression with the **resultType** value of JSON. See [Request payload schema](https://docs.microsoft.com/azure/data-factory/control-flow-web-activity#request-payload-schema) for  the schema of the request payload. | Yes |
**authentication** | The authentication method used to call the endpoint. Supported types are "Basic" and "ClientCertificate". For more information, see [Authentication](https://docs.microsoft.com/azure/data-factory/control-flow-web-activity#authentication). If authentication isn't required, exclude this property. | A string or an expression with the **resultType** value of a string. | No |
**timeout** | How long the activity waits for the callback specified by **callBackUri** to be invoked. The default value is 10 minutes ("00:10:00"). Values have the TimeSpan format *d*.*hh*:*mm*:*ss*. | String | No |
**Report status on callback** | Lets a user report the failed status of a webhook activity. | Boolean | No |

## Authentication

A webhook activity supports the following authentication types.

### None

If authentication isn't required, don't include the **authentication** property.

### Basic

Specify the username and password to use with basic authentication.

```json
"authentication":{
   "type":"Basic",
   "username":"****",
   "password":"****"
}
```

### Client certificate

Specify the Base64-encoded contents of a PFX file and a password.

```json
"authentication":{
   "type":"ClientCertificate",
   "pfx":"****",
   "password":"****"
}
```

### Managed identity

Use the data factory's managed identity to specify the resource URI for which the access token is requested. To call the Azure Resource Management API, use `https://management.azure.com/`. For more information about how managed identities work, see the [managed identities for Azure resources overview](/azure/active-directory/managed-identities-azure-resources/overview).

```json
"authentication": {
    "type": "MSI",
    "resource": "https://management.azure.com/"
}
```

> [!NOTE]
> If your data factory is configured with a Git repository, you must store your credentials in Azure Key Vault to use basic or client-certificate authentication. Azure Data Factory doesn't store passwords in Git.

## Additional notes

Data Factory passes the additional property **callBackUri** in the body sent to the URL endpoint. Data Factory expects this URI to be invoked before the specified timeout value. If the URI isn't invoked, the activity fails with the status "TimedOut".

The webhook activity fails when the call to the custom endpoint fails. Any error message can be added to the callback body and used in a later activity.

For every REST API call, the client times out if the endpoint doesn't respond within one minute. This behavior is standard HTTP best practice. To fix this problem, implement a 202 pattern. In the current case, the endpoint returns 202 (Accepted) and the client polls.

The one-minute timeout on the request has nothing to do with the activity timeout. The latter is used to wait for the callback specified by **callbackUri**.

The body passed back to the callback URI must be valid JSON. Set the `Content-Type` header to `application/json`.

When you use the **Report status on callback** property, you must add the following code to the body when you make the callback:

```json
{
    "Output": {
        // output object is used in activity output
        "testProp": "testPropValue"
    },
    "Error": {
        // Optional, set it when you want to fail the activity
        "ErrorCode": "testErrorCode",
        "Message": "error message to show in activity error"
    },
    "StatusCode": "403" // when status code is >=400, activity is marked as failed
}
```

## Next steps

See the following control flow activities supported by Data Factory:

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)
