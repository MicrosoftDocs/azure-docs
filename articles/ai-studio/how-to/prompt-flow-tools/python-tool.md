---
title: Python tool for flows in Azure AI Studio
titleSuffix: Azure AI Studio
description: This article introduces you to the Python tool for flows in Azure AI Studio.
manager: scottpolly
ms.service: azure-ai-studio
ms.custom: ignite-2023, devx-track-python, build-2024
ms.topic: how-to
ms.date: 5/21/2024
ms.reviewer: keli19
ms.author: lagayhar
author: lgayhardt
---

# Python tool for flows in Azure AI Studio

[!INCLUDE [Feature preview](../../includes/feature-preview.md)]

The prompt flow Python tool offers customized code snippets as self-contained executable nodes. You can quickly create Python tools, edit code, and verify results.

## Build with the Python tool

1. Create or open a flow in [Azure AI Studio](https://ai.azure.com). For more information, see [Create a flow](../flow-develop.md).
1. Select **+ Python** to add the Python tool to your flow.

    :::image type="content" source="../../media/prompt-flow/python-tool.png" alt-text="Screenshot that shows the Python tool added to a flow in Azure AI Studio." lightbox="../../media/prompt-flow/python-tool.png":::

1. Enter values for the Python tool input parameters that are described in the [Inputs table](#inputs). For example, in the **Code** input text box, you can enter the following Python code:

    ```python
    from promptflow import tool

    @tool
    def my_python_tool(message: str) -> str:
        return 'hello ' + message
    ```

    For more information, see [Python code input requirements](#python-code-input-requirements).

1. Add more tools to your flow, as needed. Or select **Run** to run the flow.
1. The outputs are described in the [Outputs table](#outputs). Based on the previous example Python code input, if the input message is "world," the output is `hello world`.

## Inputs

The list of inputs change based on the arguments of the tool function, after you save the code. Adding type to arguments and `return` values helps the tool show the types properly.

| Name   | Type   | Description                                          | Required |
|--------|--------|------------------------------------------------------|---------|
| Code   | string | The Python code snippet.                                  | Yes     |
| Inputs | -      | The list of the tool function parameters and its assignments. | -       |

## Outputs

The output is the `return` value of the Python tool function. For example, consider the following Python tool function:

```python
from promptflow import tool

@tool
def my_python_tool(message: str) -> str:
    return 'hello ' + message
```

If the input message is "world," the output is `hello world`.

### Types

| Type                                                | Python example                  | Description                                |
|-----------------------------------------------------|---------------------------------|--------------------------------------------|
| int                                                 | param: int                      | Integer type                               |
| bool                                                | param: bool                     | Boolean type                               |
| string                                              | param: str                      | String type                                |
| double                                              | param: float                    | Double type                                |
| list                                                | param: list or param: List[T]   | List type                                  |
| object                                              | param: dict or param: Dict[K, V] | Object type                                |
| Connection                                          | param: CustomConnection         | Connection type is handled specially. |

Parameters with `Connection` type annotation are treated as connection inputs, which means:

- The prompt flow extension shows a selector to select the connection.
- During execution time, the prompt flow tries to find the connection with the same name from the parameter value that was passed in.

> [!NOTE]
> The `Union[...]` type annotation is only supported for connection type. An example is `param: Union[CustomConnection, OpenAIConnection]`.

## Python code input requirements

This section describes requirements of the Python code input for the Python tool.

- Python tool code should consist of a complete Python code, including any necessary module imports.
- Python tool code must contain a function decorated with `@tool` (tool function), serving as the entry point for execution. The `@tool` decorator should be applied only once within the snippet.
- Python tool function parameters must be assigned in the `Inputs` section.
- Python tool function shall have a return statement and value, which is the output of the tool.

The following Python code is an example of best practices:

```python
from promptflow import tool

@tool
def my_python_tool(message: str) -> str:
    return 'hello ' + message
```

## Consume a custom connection in the Python tool

If you're developing a Python tool that requires calling external services with authentication, you can use the custom connection in a prompt flow. It allows you to securely store the access key and then retrieve it in your Python code.

### Create a custom connection

Create a custom connection that stores all your large language model API key or other required credentials.

1. Go to the **Settings** page for your project. Then select **+ New Connection**.
1. Select **Custom** service. You can define your connection name. You can add multiple key-value pairs to store your credentials and keys by selecting **Add key-value pairs**.

    > [!NOTE]
    > Make sure at least one key-value pair is set as secret. Otherwise, the connection won't be created successfully. To set one key-value pair as secret, select **is secret** to encrypt and store your key value.

### Consume a custom connection in Python

To consume a custom connection in your Python code:

1. In the code section in your Python node, import the custom connection library `from promptflow.connections import CustomConnection`. Define an input parameter of the type `CustomConnection` in the tool function.
1. Parse the input to the input section. Then select your target custom connection in the value dropdown list.

For example:

```python
from promptflow import tool
from promptflow.connections import CustomConnection

@tool
def my_python_tool(message: str, myconn: CustomConnection) -> str:
    # Get authentication key-values from the custom connection
    connection_key1_value = myconn.key1
    connection_key2_value = myconn.key2
```

## Next steps

- [Learn more about how to create a flow](../flow-develop.md)
