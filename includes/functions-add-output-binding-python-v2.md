---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/06/2023
ms.author: glenga
---

Binding attributes are defined by decorating specific function code in the *function_app.py* file. You use the `queue_output` decorator to add an [Azure Queue storage output binding](/azure/azure-functions/functions-bindings-triggers-python#azure-queue-storage-output-binding).

By using the `queue_output` decorator, the binding direction is implicitly 'out' and type is Azure Storage Queue. Add the following decorator to your function code in *function_app.py*:

:::code language="python" source="~/functions-docs-python-v2/function_app.py" range="7":::

In this code, `arg_name` identifies the binding parameter referenced in your code, `queue_name` is name of the queue that the binding writes to, and `connection` is the name of an application setting that contains the connection string for the Storage account. In quickstarts you use the same storage account as the function app, which is in the `AzureWebJobsStorage` setting. When the `queue_name` doesn't exist, the binding creates it on first use. 
