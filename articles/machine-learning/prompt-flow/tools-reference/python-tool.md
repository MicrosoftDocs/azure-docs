---
title: Python tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The Python Tool empowers users to offer customized code snippets as self-contained executable nodes in prompt flow.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.custom:
  - devx-track-python
  - ignite-2023
ms.topic: reference
author: likebupt
ms.author: keli19
ms.reviewer: lagayhar
ms.date: 11/02/2023
---

# Python tool

The Python Tool empowers users to offer customized code snippets as self-contained executable nodes in prompt flow. Users can effortlessly create Python tools, edit code, and verify results with ease.

## Inputs

| Name   | Type   | Description                                          | Required |
|--------|--------|------------------------------------------------------|---------|
| Code   | string | Python code snippet                                  | Yes     |
| Inputs | -      | List of tool function parameters and its assignments | -       |

### Types

| Type                                                | Python example                  | Description                                |
|-----------------------------------------------------|---------------------------------|--------------------------------------------|
| int                                                 | param: int                      | Integer type                               |
| bool                                                | param: bool                     | Boolean type                               |
| string                                              | param: str                      | String type                                |
| double                                              | param: float                    | Double type                                |
| list                                                | param: list or param: List[T]   | List type                                  |
| object                                              | param: dict or param: Dict[K, V] | Object type                                |
| [Connection](../concept-connections.md) | param: CustomConnection         | Connection type will be handled specially |


Parameters with `Connection` type annotation will be treated as connection inputs, which means:
- Prompt flow extension will show a selector to select the connection.
- During execution time, prompt flow will try to find the connection with the name same from parameter value passed in.

> [!Note]
> `Union[...]` type annotation is supported **ONLY** for connection type, for example, `param: Union[CustomConnection, OpenAIConnection]`.

## Outputs

The return of the python tool function.

## How to write Python Tool?

### Guidelines

1. Python Tool Code should consist of a complete Python code, including any necessary module imports.

2. Python Tool Code must contain a function decorated with @tool (tool function), serving as the entry point for execution. The @tool decorator should be applied only once within the snippet.

   *The sample in the next section defines python tool "my_python_tool" which decorated with @tool*

3. Python tool function parameters must be assigned in 'Inputs' section

    *The sample in the next section defines inputs "message" and assign with "world"*

4. Python tool function shall have return

    *The sample in the next section returns a concatenated string*

### Code

This snippet shows the basic structure of a tool function. Prompt flow will read the function and extract inputs from function parameters and type annotations. 

```python
from promptflow import tool
from promptflow.connections import CustomConnection

# The inputs section will change based on the arguments of the tool function, after you save the code
# Adding type to arguments and return value will help the system show the types properly
# Please update the function name/signature per need
@tool
def my_python_tool(message: str, my_conn: CustomConnection) -> str:
    my_conn_dict = dict(my_conn)
    # Do some function call with my_conn_dict...
    return 'hello ' + message

```

Inputs:

| Name    | Type   | Sample Value in Flow Yaml | Value passed to function|
|---------|--------|-------------------------| ------------------------|
| message | string | "world"                 | "world"                 |
| my_conn | CustomConnection | "my_conn"               | CustomConnection object |

Prompt flow will try to find the connection named 'my_conn' during execution time.

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
