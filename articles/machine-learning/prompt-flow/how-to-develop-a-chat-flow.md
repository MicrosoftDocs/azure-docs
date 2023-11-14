---
title: Develop a chat flow in Prompt flow (preview)
titleSuffix: Azure Machine Learning
description: Learn how to develop a chat flow in Prompt flow that can easily create a chatbot that handles chat input and output with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
author: Zhong-J
ms.author: jinzhong
ms.reviewer: lagayhar
ms.date: 09/12/2023
---

# Develop a chat flow

Chat flow is designed for conversational application development, building upon the capabilities of standard flow and providing enhanced support for chat inputs/outputs and chat history management. With chat flow, you can easily create a chatbot that handles chat input and output.

> [!IMPORTANT]
> Prompt flow is currently in public preview. This preview is provided without a service-level agreement, and is not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Before reading this article, it's recommended that you first learn [Develop a standard flow](how-to-develop-a-standard-flow.md).

## Create a chat flow

To create a chat flow, you can **either** clone an existing chat flow sample from the Prompt Flow Gallery **or** create a new chat flow from scratch. For a quick start, you can clone a chat flow sample and learn how it works.

:::image type="content" source="./media/how-to-develop-a-chat-flow/create-chat-flow.png" alt-text="Screenshot of the Prompt flow gallery highlighting chat flow and Chat with Wikipedia. " lightbox = "./media/how-to-develop-a-chat-flow/create-chat-flow.png":::

After selecting  **Clone**, as shown in the right panel, the new flow will be saved in a specific folder within your workspace file share storage. You can customize the folder name according to your preferences.

:::image type="content" source="./media/how-to-develop-a-chat-flow/specify-flow-folder-name.png" alt-text="Screenshot of specify the flow folder name when creating a flow. " lightbox = "./media/how-to-develop-a-chat-flow/specify-flow-folder-name.png":::

## Develop a chat flow

### Authoring page
In chat flow authoring page, the chat flow is tagged with a "chat" label to distinguish it from standard flow and evaluation flow. To test the chat flow, select "Chat" button to trigger a chat box for conversation.

:::image type="content" source="./media/how-to-develop-a-chat-flow/chat-input-output.png" alt-text="Screenshot of Chat with Wikipedia with the chat button highlighted. " lightbox = "./media/how-to-develop-a-chat-flow/chat-input-output.png":::

At the left, it's the flatten view, the main working area where you can author the flow, for example add a new node, edit the prompt, select the flow input data, etc.

:::image type="content" source="./media/how-to-develop-a-chat-flow/flatten-view.png" alt-text="Screenshot of web classification highlighting the main working area." lightbox = "./media/how-to-develop-a-chat-flow/flatten-view.png":::

The top right corner shows the folder structure of the flow. Each flow has a folder that contains a flow.dag.yaml file, source code files, and system folders. You can export or import a flow easily for testing, deployment, or collaborative purposes.

:::image type="content" source="./media/how-to-develop-a-chat-flow/folder-structure-view.png" alt-text="Screenshot of web classification highlighting the folder structure area." lightbox = "./media/how-to-develop-a-chat-flow/folder-structure-view.png":::

In addition to inline editing the node in flatten view, you can also turn on the **Raw file mode** toggle and select the file name to edit the file in the opening file tab.

:::image type="content" source="./media/how-to-develop-a-chat-flow/file-edit-tab.png" alt-text="Screenshot of the file edit tab under raw file mode." lightbox = "./media/how-to-develop-a-chat-flow/file-edit-tab.png":::

In the bottom right corner, it's the graph view for visualization only. You can zoom in, zoom out, auto layout, etc.

:::image type="content" source="./media/how-to-develop-a-chat-flow/graph-view.png" alt-text="Screenshot of web classification highlighting graph view area." lightbox = "./media/how-to-develop-a-chat-flow/graph-view.png":::

### Develop flow inputs and outputs

The most important elements that differentiate a chat flow from a standard flow are **Chat Input**, **Chat History**, and **Chat Output**.  

- **Chat Input**: Chat input refers to the messages or queries submitted by users to the chatbot. Effectively handling chat input is crucial for a successful conversation, as it involves understanding user intentions, extracting relevant information, and triggering appropriate responses.
- **Chat History**: Chat history is the record of all interactions between the user and the chatbot, including both user inputs and AI-generated outputs. Maintaining chat history is essential for keeping track of the conversation context and ensuring the AI can generate contextually relevant responses. Chat History is a special type of chat flow input that stores chat messages in a structured format.
- **Chat Output**: Chat output refers to the AI-generated messages that are sent to the user in response to their inputs. Generating contextually appropriate and engaging chat outputs is vital for a positive user experience.

A chat flow can have multiple inputs, but Chat History and Chat Input are **required** inputs in chat flow.

- In the chat flow Inputs section, the selected flow input serves as the Chat Input. The most recent chat input message in the chat box is backfilled to the Chat Input value.

    :::image type="content" source="./media/how-to-develop-a-chat-flow/chat-input.png" alt-text="Screenshot of Chat with Wikipedia with the chat input highlighted. " lightbox = "./media/how-to-develop-a-chat-flow/chat-input.png":::

- The `chat_history` input field in the Inputs section is reserved for representing Chat History. All interactions in the chat box, including user chat inputs, generated chat outputs, and other flow inputs and outputs, are stored in  `chat_history`. It's structured as a list of inputs and outputs:

    ```json
    [
    {
        "inputs": {
        "<flow input 1>": "xxxxxxxxxxxxxxx",
        "<flow input 2>": "xxxxxxxxxxxxxxx",
        "<flow input N>""xxxxxxxxxxxxxxx"
        },
        "outputs": {
        "<flow output 1>": "xxxxxxxxxxxx",
        "<flow output 2>": "xxxxxxxxxxxxx",
        "<flow output M>": "xxxxxxxxxxxxx"
        }
    },
    {
        "inputs": {
        "<flow input 1>": "xxxxxxxxxxxxxxx",
        "<flow input 2>": "xxxxxxxxxxxxxxx",
        "<flow input N>""xxxxxxxxxxxxxxx"
        },
        "outputs": {
        "<flow output 1>": "xxxxxxxxxxxx",
        "<flow output 2>": "xxxxxxxxxxxxx",
        "<flow output M>": "xxxxxxxxxxxxx"
        }
    }
    ]
    ```

    In this chat flow example, the Chat History is generated as shown:

    :::image type="content" source="./media/how-to-develop-a-chat-flow/chat-history.png" alt-text="Screenshot of chat history from the chat flow example. " lightbox = "./media/how-to-develop-a-chat-flow/chat-history.png":::


A chat flow can have multiple flow outputs, but Chat Output is a **required** output for a chat flow. In the chat flow Outputs section, the selected output is used as the Chat Output.

### Author prompt with Chat History

Incorporating Chat History into your prompts is essential for creating context-aware and engaging chatbot responses. In your prompts, you can reference the `chat_history` input to retrieve past interactions. This allows you to reference previous inputs and outputs to create contextually relevant responses.

Use [for-loop grammar of Jinja language](https://jinja.palletsprojects.com/en/3.1.x/templates/#for) to display a list of inputs and outputs from `chat_history`.  

```jinja
{% for item in chat_history %}
user:
{{item.inputs.question}}
assistant:
{{item.outputs.answer}}
{% endfor %}
```

## Test a chat flow

Testing your chat flow is a crucial step in ensuring that your chatbot responds accurately and effectively to user inputs. There are two primary methods for testing your chat flow: using the chat box for individual testing or creating a bulk test for larger datasets.

### Test with the chat box

The chat box provides an interactive way to test your chat flow by simulating a conversation with your chatbot. To test your chat flow using the chat box, follow these steps:

1. Select the "Chat" button to open the chat box.
2. Type your test inputs into the chat box and press Enter to send them to the chatbot.
3. Review the chatbot's responses to ensure they're contextually appropriate and accurate.

### Create a bulk test

Bulk test enables you to test your chat flow using a larger dataset, ensuring your chatbot's performance is consistent and reliable across a wide range of inputs. Thus, bulk test is ideal for thoroughly evaluating your chat flow's performance, identifying potential issues, and ensuring the chatbot can handle a diverse range of user inputs.

To create a bulk test for your chat flow, you should prepare a dataset containing multiple data samples. Ensure that each data sample includes all the fields defined in the flow input, such as chat_input, chat_history, etc.   This dataset should be in a structured format, such as a CSV, TSV or JSON file. JSONL format is recommended for test data with chat_history. For more information about how to create bulk test, see [Submit Bulk Test and Evaluate a Flow](./how-to-bulk-test-evaluate-flow.md).

## Next steps

- [Develop a customized evaluation flow](how-to-develop-an-evaluation-flow.md)
- [Tune prompts using variants](how-to-tune-prompts-using-variants.md)
- [Deploy a flow](how-to-deploy-for-real-time-inference.md)