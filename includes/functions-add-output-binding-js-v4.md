---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 09/23/2019
ms.author: glenga
---

Binding attributes are defined in the configuration object of the trigger for a given function. Depending on the binding type, additional properties may be required. Because the Storage queue binding is an extra binding for the HTTP trigger, you need to add the **extraOutputs** property to the configuration object.

```javascript
{
    methods: ['GET', 'POST'],
    extraOutputs: [sendToQueue],
    authLevel: 'anonymous',
    handler: () => {}
}
```

The **extraOutputs** property is an array of output function names that are called. 

```
const sendToQueue = output.storageQueue({ ... configuration object ... })
```

Each function has its own configuration object, based on the type of function. To send messages to a Storage queue, you need the following configuration object in the output function. The [queue output configuration](../articles/azure-functions/functions-bindings-storage-queue-output.md#configuration) properties include:


| Property | Value | Description |
| -------- | ----- | ----------- |
| **The queue to which the message will be sent** | `messages` | The name of the queue that the binding writes to. When the *queueName* doesn't exist, the binding creates it on first use. |
| **Select setting from "local.setting.json"** | `AzureWebJobsStorage` | The name of an application setting that contains the connection string for the Storage account. The `AzureWebJobsStorage` setting contains the connection string for the Storage account you created with the function app. |

A binding is added to the code file, which should look like the following:

:::code language="javascript" source="~/functions-docs-javascript/src/functions/httpSendToStorage.js" range="3-6":::
