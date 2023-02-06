---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 02/06/2023
ms.author: glenga
ms.custom: devdivchpfy22
---
::: zone pivot="programming-language-python"

# [v1](#tab/v1)

Your project has been configured to use [extension bundles](functions-bindings-register.md#extension-bundles), which automatically installs a predefined set of extension packages.

Extension bundles usage is enabled in the *host.json* file at the root of the project, which appears as follows:

:::code language="json" source="~/functions-quickstart-java/functions-add-output-binding-storage-queue/host.json":::

Now, you can add the storage output binding to your project.

# [v2](#tab/v2)

In v2 bindings are made directly in the *function_app.py* file.

```python
@app.queue_output(arg_name="msg", queue_name="outqueue", connection="AzureWebJobsStorage")
```

---

:: zone-end
