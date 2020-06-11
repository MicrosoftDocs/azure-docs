---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/23/2019
ms.author: glenga
---

Binding attributes are defined directly in the function.json file. Depending on the binding type, additional properties may be required. The [queue output configuration](../articles/azure-functions/functions-bindings-storage-queue-output.md#configuration) describes the fields required for an Azure Storage queue binding. The extension makes it easy to add bindings to the function.json file. 

To create a binding, right-click (Ctrl+click on macOS) the `function.json` file in your HttpTrigger folder and choose **Add binding...**. Follow the prompts to define the following binding properties for the new binding:

| Prompt | Value | Description |
| -------- | ----- | ----------- |
| **Select binding direction** | `out` | The binding is an output binding. |
| **Select binding with direction...** | `Azure Queue Storage` | The binding is an Azure Storage queue binding. |
| **The name used to identify this binding in your code** | `msg` | Name that identifies the binding parameter referenced in your code. |
| **The queue to which the message will be sent** | `outqueue` | The name of the queue that the binding writes to. When the *queueName* doesn't exist, the binding creates it on first use. |
| **Select setting from "local.setting.json"** | `AzureWebJobsStorage` | The name of an application setting that contains the connection string for the Storage account. The `AzureWebJobsStorage` setting contains the connection string for the Storage account you created with the function app. |

A binding is added to the `bindings` array in your function.json, which should look like the following:

:::code language="son" source="~/functions-docs-javascript/functions-add-output-binding-storage-queue-cli/HttpExample/function.json" range="18-24":::