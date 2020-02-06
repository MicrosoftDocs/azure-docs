---
title: Webhook activity in Azure Data Factory 
description: The Webhook activity does not continue execution of the pipeline until it validates the attached dataset with certain criteria the user specifies.
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
You can use a webhook activity to control the execution of pipelines through your custom code. Using the webhook activity, customers can call an endpoint and pass a callback URL. The pipeline run waits for the callback to be invoked before proceeding to the next activity.

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
name | Name of the web hook activity | String | Yes |
type | Must be set to  **WebHook**. | String | Yes |
method | Rest API method for the target endpoint. | String. Supported Types: 'POST' | Yes |
url | Target endpoint and path | String (or expression with resultType of string). | Yes |
headers | Headers that are sent to the request. For example, to set the language and type on a request: "headers" : { "Accept-Language": "en-us", "Content-Type": "application/json" }. | String (or expression with resultType of string) | Yes, Content-type header is required. "headers":{ "Content-Type":"application/json"} |
body | Represents the payload that is sent to the endpoint. | Valid JSON (or expression with resultType of JSON). See the schema of the request payload in [Request payload schema](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fdata-factory%2Fcontrol-flow-web-activity%23request-payload-schema&amp;data=02%7C01%7Cshlo%40microsoft.com%7Cde517eae4e7f4f2c408d08d6b167f6b1%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636891457414397501&amp;sdata=ljUZv5csQQux2TT3JtTU9ZU8e1uViRzuX5DSNYkL0uE%3D&amp;reserved=0) section. | Yes |
authentication | Authentication method used for calling the endpoint. Supported Types are "Basic" or "ClientCertificate." For more information, see [Authentication](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fdata-factory%2Fcontrol-flow-web-activity%23authentication&amp;data=02%7C01%7Cshlo%40microsoft.com%7Cde517eae4e7f4f2c408d08d6b167f6b1%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636891457414397501&amp;sdata=GdA1%2Fh2pAD%2BSyWJHSW%2BSKucqoAXux%2F4L5Jgndd3YziM%3D&amp;reserved=0) section. If authentication is not required, exclude this property. | String (or expression with resultType of string) | No |
timeout | How long the activity will wait for the &#39;callBackUri&#39; to be invoked. How long the activity will wait for the ‘callBackUri’ to be invoked. Default value is 10mins (“00:10:00”). Format is Timespan i.e. d.hh:mm:ss | String | No |
Report status on callback | Allows the user the report the failed status of the webhook activity which will mark the activity as failed | Boolean | No |

## Authentication

Below are the supported authentication types in the Web Activity.

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

Specify the resource uri for which the access token will be requested using the managed identity for the data factory. To call the Azure Resource Management API, use `https://management.azure.com/`. For more information about how managed identities works see the [managed identities for Azure resources overview page](/azure/active-directory/managed-identities-azure-resources/overview).

```json
"authentication": {
	"type": "MSI",
	"resource": "https://management.azure.com/"
}
```

> [!NOTE]
> If your data factory is configured with a git repository, you must store your credentials in Azure Key Vault to use basic or client certificate authentication. Azure Data Factory doesn't store passwords in git.

## Additional notes

Azure Data Factory will pass an additional property “callBackUri” in the body to the url endpoint, and will expect this uri to be invoked before the timeout value specified. If the uri is not invoked, the activity will fail with status ‘TimedOut’.

The webhook activity itself fails when the call to the custom endpoint fails. Any error message can be added into the body of the callback and used in a subsequent activity.

The body passed back to the callback URI should be valid JSON. You must set the Content-Type header to `application/json`.

When you use the "Report status on callback" option, you must add the following snippet to the body when making the callback:

```
{
    "Output": {
        // output object will be used in activity output
        "testProp": "testPropValue"
    },
    "Error": {
        // Optional, set it when you want to fail the activity
        "ErrorCode": "testErrorCode",
        "Message": "error message to show in activity error"
    },
    "StatusCode": "403" // when status code is >=400, activity will be marked as failed
}
```



## Next steps

See other control flow activities supported by Data Factory:

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)
