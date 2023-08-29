---
title: Python tool in Azure Machine Learning prompt flow (preview)
titleSuffix: Azure Machine Learning
description: The Python Tool empowers users to offer customized code snippets as self-contained executable nodes in Prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.custom: devx-track-python
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 06/30/2023
---

# Python tool (preview)

The Python Tool empowers users to offer customized code snippets as self-contained executable nodes in Prompt flow. Users can effortlessly create Python tools, edit code, and verify results with ease.

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


## How to consume custom connection in Python Tool?

If you are developing a python tool that requires calling external services with authentication, you can use the custom connection in prompt flow. It allows you to securely store the access key then retrieve it in your python code.

### Create a custom connection

Create a custom connection that stores all your LLM API KEY or other required credentials.

1. Go to Prompt flow in your workspace, then go to **connections** tab.
2. Select **Create** and select **Custom**.
    :::image type="content" source="../media/how-to-integrate-with-langchain/custom-connection-1.png" alt-text="Screenshot of flows on the connections tab highlighting the custom button in the drop-down menu. " lightbox = "../media/how-to-integrate-with-langchain/custom-connection-1.png":::
1. In the right panel, you can define your connection name, and you can add multiple *Key-value pairs* to store your credentials and keys by selecting **Add key-value pairs**.
    :::image type="content" source="../media/how-to-integrate-with-langchain/custom-connection-2.png" alt-text="Screenshot of add custom connection point to the add key-value pairs button. " lightbox = "../media/how-to-integrate-with-langchain/custom-connection-2.png":::

> [!NOTE]
> - You can set one Key-Value pair as secret by **is secret** checked, which will be encrypted and stored in your key value.
> - Make sure at least one key-value pair is set as secret, otherwise the connection will not be created successfully.


### Consume custom connection in Python

To consume a custom connection in your python code, follow these steps:

1. In the code section in your python node, import custom connection library `from promptflow.connections import CustomConnection`, and define an input parameter of type `CustomConnection` in the tool function.
    :::image type="content" source="../media/how-to-integrate-with-langchain/custom-connection-python-node-1.png" alt-text="Screenshot of doc search chain node highlighting the custom connection. " lightbox = "../media/how-to-integrate-with-langchain/custom-connection-python-node-1.png":::
1. Parse the input to the input section, then select your target custom connection in the value dropdown.
    :::image type="content" source="../media/how-to-integrate-with-langchain/custom-connection-python-node-2.png" alt-text="Screenshot of the chain node highlighting the connection. " lightbox = "../media/how-to-integrate-with-langchain/custom-connection-python-node-2.png":::

For example:

```python
from promptflow import tool
from promptflow.connections import CustomConnection

@tool
def my_python_tool(message:str, myconn:CustomConnection) -> str:
    # Get authentication key-values from the custom connection
    connection_key1_value = myconn.key1
    connection_key2_value = myconn.key2
```
