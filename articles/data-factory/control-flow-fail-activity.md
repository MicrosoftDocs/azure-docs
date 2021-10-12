---
title: Fail activity
titleSuffix: Azure Data Factory & Azure Synapse
description: The Fail activity in Azure Data Factory and Synapse Analytics intentionally throws an error in a pipeline
author: chez-charlie
ms.author: chez
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 09/22/2021
---

# Execute fail activity in Azure Data Factory and Synapse Analytics (Preview)

Sometimes, you may want to intentionally throw an error in a pipeline: maybe [lookup activity](control-flow-lookup-activity.md) returns no matching data, or [custom activity](transform-data-using-dotnet-custom-activity.md) albeit returned 200, threw an internal error. Whatever the reason may be, now you can use a Fail activity in a pipeline, and customize both error code and error message.

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]


## Syntax

```json
{
    "name": "MyFailActivity",
    "type": "Fail",
    "typeProperties": {
        "message": "500",
        "errorCode": "My Custom Error Message"
    }
}

```

## Type properties

Property | Description | Allowed values | Required
-------- | ----------- | -------------- | --------
name | Name of the `Fail` activity. | String | Yes
type | Must be set to **Fail**. | String | Yes
message | Error message surfaced in the fail activity. Can be dynamic content evaluated at runtime. | String | Yes
errorCode | Error code categorizing the error type of the fail activity. Can be dynamic content evaluated at runtime. | String | yes

## Understand Fail Activity Error Code

Typically, error code and error message of a fail activity are set by customers. Contact pipeline developer to understand the specific meanings of the error codes. However, in following edge cases, ADF will set the error code and/or error messages.

Situation Description | Error Message | Error Code
-------- | ----------- | --------------
(Dynamic) content in `message` and `errorCode` interpreted correctly | Error message set by the user | Error code set by the user
Dynamic content in both `message` and `errorCode` cannot be interpreted | 'Failed to interpret _<activity_name>_ fail message or error code | `ErrorCodeNotString`
Dynamic content in `message` cannot be interpreted as a string | '_<activity_name>_ fail message parameter could not be interpreted as a string' | Error code set by the user
Dynamic content in `message` resolves to null, empty string or white spaces | 'Failed to interpret _<activity_name>_ fail message or error code' | Error code set by the user
Dynamic content in `errorCode` cannot be interpreted as a string | Error message set by the user | `ErrorCodeNotString`
Dynamic content in `errorCode` resolves to null, empty string or white spaces | Error message set by the user | `ErrorCodeNotString`
Value for `message` or `errorCode` provided by user isn't string-able * | Pipeline __fails__ with: 'Invalid value for property <`errorCode`/`message`>'
Missing `message` field * | 'Fail message was not provided' | Error code set by the user
Missing `errorCode` field * | Error message set by the user | `ErrorCodeNotString`

Situations marked with * shouldn't occur if the pipeline is developed with web user interface (UI) of Data Factory.

## Next steps

See other supported control flow activities, including:

- [If Condition Activity](control-flow-if-condition-activity.md)
- [Execute Pipeline Activity](control-flow-execute-pipeline-activity.md)
- [For Each Activity](control-flow-for-each-activity.md)
- [Get Metadata Activity](control-flow-get-metadata-activity.md)
- [Lookup Activity](control-flow-lookup-activity.md)
- [Web Activity](control-flow-web-activity.md)
- [Until Activity](control-flow-until-activity.md)
