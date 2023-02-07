---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/06/2023
ms.author: glenga
---

Binding attributes are defined directly in the *function_app.json* file. You use the `queue_output` decorator to add an [Azure Queue storage output binding](/azure/azure-functions/functions-bindings-triggers-python#azure-queue-storage-output-binding).

By using the `queue_output` decorator, the binding direction is implicitly 'out' and type is Azure Storage Queue. You can further customize the binding with the following properties:

| Parameter | Value | Description |
| --------- | ----- | ----------- |
| `arg_name` | "msg" | Name that identifies the binding parameter referenced in your code. |
| `queue_name` | "outqueue" | The name of the queue that the binding writes to. When the *queueName* doesn't exist, the binding creates it on first use. |
| `connection` | "AzureWebJobsStorage" | The name of an application setting that contains the connection string for the Storage account. The `AzureWebJobsStorage` setting contains the connection string for the Storage account you created with the function app. |

The binding in your *function_app.json*, which should look like the following code:

```python
@app.queue_output(arg_name="msg", queue_name="outqueue", connection="AzureWebJobsStorage")
```
