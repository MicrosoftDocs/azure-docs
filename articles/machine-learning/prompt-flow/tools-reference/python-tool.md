---
title: Python tool in Azure Machine Learning prompt flow
titleSuffix: Azure Machine Learning
description: The Python tool empowers you to offer customized code snippets as self-contained executable nodes in prompt flow.
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

The Python tool empowers you to offer customized code snippets as self-contained executable nodes in prompt flow. You can easily create Python tools, edit code, and verify results.

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
| [Connection](../concept-connections.md) | param: CustomConnection         | Connection type is handled specially |

Parameters with the `Connection` type annotation are treated as connection inputs, which means:

- Prompt flow extension shows a selector to select the connection.
- During execution time, prompt flow tries to find the connection with the same name from the parameter value passed in.

> [!NOTE]
> The `Union[...]` type annotation is supported *only* for the connection type, for example, `param: Union[CustomConnection, OpenAIConnection]`.

## Outputs

Outputs are the return of the Python tool function.

## Write with the Python tool

Use the following guidelines to write with the Python tool.

### Guidelines

- Python tool code should consist of complete Python code, including any necessary module imports.

- Python tool code must contain a function decorated with `@tool` (tool function), which serves as the entry point for execution. Apply the `@tool` decorator only once within the snippet.

   The sample in the next section defines the Python tool `my_python_tool`, which is decorated with `@tool`.

- Python tool function parameters must be assigned in the `Inputs` section.

    The sample in the next section defines the input `message` and assigns it `world`.

- A Python tool function has a return.

    The sample in the next section returns a concatenated string.

### Code

The following snippet shows the basic structure of a tool function. Prompt flow reads the function and extracts inputs from function parameters and type annotations.

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

#### Inputs

| Name    | Type   | Sample value in flow YAML | Value passed to function|
|---------|--------|-------------------------| ------------------------|
| message | string | `world`                 | `world`                 |
| my_conn | `CustomConnection` | `my_conn`               | `CustomConnection` object |

Prompt flow tries to find the connection named `my_conn` during execution time.

#### Outputs

```python
"hello world"
```

## Custom connection in the Python tool

If you're developing a Python tool that requires calling external services with authentication, use the custom connection in prompt flow. You can use it to securely store the access key and then retrieve it in your Python code.

### Create a custom connection

Create a custom connection that stores all your large language model API key or other required credentials.

1. Go to prompt flow in your workspace, and then go to the **Connections** tab.
1. Select **Create** > **Custom**.

    :::image type="content" source="../media/how-to-integrate-with-langchain/custom-connection-1.png" alt-text="Screenshot that shows flows on the Connections tab highlighting the Custom button in the drop-down menu. " lightbox = "../media/how-to-integrate-with-langchain/custom-connection-1.png":::
1. In the right pane, you can define your connection name. You can add multiple key-value pairs to store your credentials and keys by selecting **Add key-value pairs**.

    :::image type="content" source="../media/how-to-integrate-with-langchain/custom-connection-2.png" alt-text="Screenshot that shows adding a custom connection point and the Add key-value pairs button." lightbox = "../media/how-to-integrate-with-langchain/custom-connection-2.png":::

> [!NOTE]
> To set one key-value pair as secret, select the **is secret** checkbox. This option encrypts and stores your key value. Make sure at least one key-value pair is set as secret. Otherwise, the connection isn't created successfully.

### Use a custom connection in Python

To use a custom connection in your Python code:

1. In the code section in your Python node, import the custom connection library `from promptflow.connections import CustomConnection`. Define an input parameter of the type `CustomConnection` in the tool function.

    :::image type="content" source="../media/how-to-integrate-with-langchain/custom-connection-python-node-1.png" alt-text="Screenshot that shows the doc search chain node highlighting the custom connection." lightbox = "../media/how-to-integrate-with-langchain/custom-connection-python-node-1.png":::
1. Parse the input to the input section, and then select your target custom connection in the **Value** dropdown.

    :::image type="content" source="../media/how-to-integrate-with-langchain/custom-connection-python-node-2.png" alt-text="Screenshot that shows the chain node highlighting the connection." lightbox = "../media/how-to-integrate-with-langchain/custom-connection-python-node-2.png":::

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
