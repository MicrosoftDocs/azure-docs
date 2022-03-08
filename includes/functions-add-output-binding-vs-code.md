---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 01/30/2020
ms.author: glenga
---

Visual Studio Code lets you add bindings to your function.json file by following a convenient set of prompts. 

To add a binding, open the command pallet (F1) and type **Azure Functions: add binding...**, choose the function for the new binding, and then follow the prompts, which vary depending on the type of binding being added to the function. 

The following are example prompts to define a new storage output binding:

| Prompt | Value | Description |
| -------- | ----- | ----------- |
| **Select binding direction** | `out` | The binding is an output binding. |
| **Select binding with direction** | `Azure Queue Storage` | The binding is an Azure Storage queue binding. |
| **The name used to identify this binding in your code** | `msg` | Name that identifies the binding parameter referenced in your code. |
| **The queue to which the message will be sent** | `outqueue` | The name of the queue that the binding writes to. When the *queueName* doesn't exist, the binding creates it on first use. |
| **Select setting from "local.settings.json"** | `MyStorageConnection` | The name of an application setting that contains the connection string for the storage account. The `AzureWebJobsStorage` setting contains the connection string for the storage account you created with the function app. |

You can also right-click (Ctrl+click on macOS) directly on the **function.json** file in your function folder, select **Add binding**, and follow the same prompts.

In this example, the following binding is added to the `bindings` array in your function.json file:

```json
{
    "type": "queue",
    "direction": "out",
    "name": "msg",
    "queueName": "outqueue",
    "connection": "MyStorageConnection"
}
```