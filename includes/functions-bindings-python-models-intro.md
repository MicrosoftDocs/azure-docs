---
author: ggailey777
ms.service: azure-functions
ms.topic: include
ms.date: 05/01/2024
ms.author: glenga
---
Azure Functions supports two programming models for Python. The way that you define your bindings depends on your chosen programming model.

# [v2](#tab/python-v2)
The Python v2 programming model lets you define bindings using decorators directly in your Python function code. For more information, see the [Python developer guide](../articles/azure-functions/functions-reference-python.md?pivots=python-mode-decorators#programming-model).

# [v1](#tab/python-v1)
The Python v1 programming model requires you to define bindings in a separate *function.json* file in the function folder. For more information, see the [Python developer guide](../articles/azure-functions/functions-reference-python.md?pivots=python-mode-configuration#programming-model).

---

This article supports both programming models.