---
title: Webhook activity in Azure Data Factory | Microsoft Docs
description: The Webhook activity does not continue execution of the pipeline until it validates the attached dataset with certain criteria the user specifies.
services: data-factory
documentationcenter: ''
author: sharonlo101
manager: craigg
ms.reviewer: douglasl

ms.service: data-factory
ms.workload: data-services
ms.tgt_pltfrm: na

ms.topic: conceptual
ms.date: 03/25/2019
ms.author: shlo

---
# Webhook activity in Azure Data Factory
You can use a web hook activity to control the execution of pipelines through your custom code. Using the webhook activity, customers can call an endpoint and pass a callback URL. The pipeline run waits for the callback to be invoked before proceeding to the next activity.

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
body | Represents the payload that is sent to the endpoint. | The body passed back to the call back URI should be a valid JSON. See the schema of the request payload in [Request payload schema](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fdata-factory%2Fcontrol-flow-web-activity%23request-payload-schema&amp;data=02%7C01%7Cshlo%40microsoft.com%7Cde517eae4e7f4f2c408d08d6b167f6b1%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636891457414397501&amp;sdata=ljUZv5csQQux2TT3JtTU9ZU8e1uViRzuX5DSNYkL0uE%3D&amp;reserved=0) section. | Yes |
authentication | Authentication method used for calling the endpoint. Supported Types are "Basic" or "ClientCertificate." For more information, see [Authentication](https://nam06.safelinks.protection.outlook.com/?url=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fdata-factory%2Fcontrol-flow-web-activity%23authentication&amp;data=02%7C01%7Cshlo%40microsoft.com%7Cde517eae4e7f4f2c408d08d6b167f6b1%7C72f988bf86f141af91ab2d7cd011db47%7C1%7C0%7C636891457414397501&amp;sdata=GdA1%2Fh2pAD%2BSyWJHSW%2BSKucqoAXux%2F4L5Jgndd3YziM%3D&amp;reserved=0) section. If authentication is not required, exclude this property. | String (or expression with resultType of string) | No |
timeout | How long the activity will wait for the &#39;callBackUri&#39; to be invoked. How long the activity will wait for the ‘callBackUri’ to be invoked. Default value is 10mins (“00:10:00”). Format is Timespan i.e. d.hh:mm:ss | String | No |

## Additional notes

Azure Data Factory will pass an additional property “callBackUri” in the body to the url endpoint, and will expect this uri to be invoked before the timeout value specified. If the uri is not invoked, the activity will fail with status ‘TimedOut’.

The web hook activity itself fails only when the call to the custom endpoint fails. Any error message can be added into the body of the callback and used in a subsequent activity.

## Next steps
See other control flow activities supported by Data Factory:

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)
