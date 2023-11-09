---
title: Execute a Fail activity in Azure Data Factory and Synapse Analytics
titleSuffix: Azure Data Factory & Azure Synapse
description: This article discusses how a Fail activity in Azure Data Factory and Synapse Analytics intentionally throws an error in a pipeline.
author: chez-charlie
ms.author: chez
ms.service: data-factory
ms.subservice: orchestration
ms.custom: synapse
ms.topic: conceptual
ms.date: 10/20/2023
---

# Execute a Fail activity in Azure Data Factory and Synapse Analytics

You might occasionally want to throw an error in a pipeline intentionally. A [Lookup activity](control-flow-lookup-activity.md) might return no matching data, or a [Custom activity](transform-data-using-dotnet-custom-activity.md) might finish with an internal error. Whatever the reason might be, now you can use a Fail activity in a pipeline and customize both its error message and error code.

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

## Create a Fail activity with UI

To use a Fail activity in a pipeline, complete the following steps:

1. Search for _Fail_ in the pipeline Activities pane, and drag a Fail activity to the pipeline canvas.
1. Select the new Fail activity on the canvas if it is not already selected, and its  **Settings** tab, to edit its details.

   :::image type="content" source="media/control-flow-fail-activity/fail-activity.png" alt-text="Shows the UI for a Fail activity.":::

1. Enter a failure message and error code. These can be literal string expressions, or any combination of dynamic [expressions, functions](control-flow-expression-language-functions.md), [system variables](control-flow-system-variables.md), or [outputs from other activities](how-to-expression-language-functions.md#examples-of-using-parameters-in-expressions).

## Syntax

```json
{
    "name": "MyFailActivity",
    "type": "Fail",
    "typeProperties": {
        "errorCode": "500",
        "message": "My Custom Error Message"
    }
}

```

## Type properties

| Property | Description | Allowed values | Required |
| --- | --- | --- | --- |
| name | The name of the Fail activity. | String | Yes |
| type | Must be set to **Fail**. | String | Yes |
| message | The error message that surfaced in the Fail activity. It can be dynamic content that's evaluated at runtime. | String | Yes |
| errorCode | The error code that categorizes the error type of the Fail activity. It can be dynamic content that's evaluated at runtime. | String | Yes |
| | |

## Understand the Fail activity error code

The error message and error code of a Fail activity are ordinarily set by users. To understand the specific meanings of the error codes, contact the pipeline developer. However, in the following edge cases, Azure Data Factory sets the error message and/or error code.

| Situation description | Error message | Error code |
| --- | --- | --- |
The (dynamic) content in `message` and `errorCode` is interpreted correctly. | The error message that's set by the user | The error code that's set by the user |
The dynamic content in both `message` and `errorCode` can't be interpreted. | "Failed to interpret _<activity_name>_ fail message or error code" | `ErrorCodeNotString` |
| The dynamic content in `message` can't be interpreted as a string. | "_<activity_name>_ fail message parameter could not be interpreted as a string" | The error code that's set by the user |
| The dynamic content in `message` resolves to null, an empty string, or white spaces. | "Failed to interpret _<activity_name>_ fail message or error code" | The error code that's set by the user |
| The dynamic content in `errorCode` can't be interpreted as a string. | The error message that's set by the user | `ErrorCodeNotString` |
| The dynamic content in `errorCode` resolves to null, an empty string, or white spaces. | The error message that's set by the user | `ErrorCodeNotString` |
| The value for `message` or `errorCode` that's provided by the user isn't string-able.* | Pipeline _fails_ with: "Invalid value for property <`errorCode`/`message`>" | |
| The `message` field is missing.* | "Fail message was not provided" | The error code that's set by the user |
| The `errorCode` field is missing.* | The error message that's set by the user | `ErrorCodeNotString` |
| | |

\* This situation shouldn't occur if the pipeline is developed with the web user interface (UI) of Data Factory.

## Next steps

See other supported control flow activities, including:

- [If Condition activity](control-flow-if-condition-activity.md)
- [Execute Pipeline activity](control-flow-execute-pipeline-activity.md)
- [For Each activity](control-flow-for-each-activity.md)
- [Get Metadata activity](control-flow-get-metadata-activity.md)
- [Lookup activity](control-flow-lookup-activity.md)
- [Web activity](control-flow-web-activity.md)
- [Until activity](control-flow-until-activity.md)
- [Understand pipeline error](tutorial-pipeline-failure-error-handling.md)
