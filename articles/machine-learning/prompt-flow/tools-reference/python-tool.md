---
title: Python tool in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Users are empowered by the Python Tool to offer customized code snippets as self-contained executable nodes in Prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Python tool (preview)

Users are empowered by the Python Tool to offer customized code snippets as self-contained executable nodes in Prompt flow. Users can effortlessly create Python tools, edit code, and verify results with ease.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Inputs

| Name   | Type   | Description                                          | Required |
|--------|--------|------------------------------------------------------|---------|
| Code   | string | Python code snippet                                  | Yes     |
| Inputs | -      | List of tool function parameters and its assignments | -       |

## Outputs

The return of the python tool function.

## How to write Python Tool?

### Guidelines

1. Python Tool Code should consist of a complete Python code, including any necessary module imports.

2. Python Tool Code must contain a function decorated with @tool (tool function), serving as the entry point for execution. The @tool decorator should be applied only once within the snippet.

   *The sample in the next section defines python tool "my_python_tool", decorated with @tool*

3. Python tool function parameters must be assigned in 'Inputs' section

    *The sample in the next section defines inputs "message" and assign with "world"*

4. Python tool function shall have return

    *The sample in the next section returns a concatenated string*

### Code

```python
from promptflow import tool

# The inputs section will change based on the arguments of the tool function, after you save the code
# Adding type to arguments and return value will help the system show the types properly
@tool
def my_python_tool(message: str) -> str:
    return 'hello ' + message

```

Inputs:

| Name    | Type   | Sample Value |
|---------|--------|--------------|
| message | string | "world"      |

Outputs:

```python
"hello world"
```