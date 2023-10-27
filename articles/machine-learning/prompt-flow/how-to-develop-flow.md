---
title: Develop a flow in Prompt flow
titleSuffix: Azure Machine Learning
description: Learn how to develop a prompt flow with Azure Machine Learning studio.
services: machine-learning
ms.service: machine-learning
ms.subservice: prompt-flow
ms.topic: how-to
author: jinzhong
ms.author: jinzhong
ms.reviewer: lagayhar
ms.date: 10/23/2023
---
# Develop a flow

Prompt flow is a development tool designed to streamline the entire development cycle of AI applications powered by Large Language Models (LLMs). As the momentum for LLM-based AI applications continues to grow across the globe, prompt flow provides a comprehensive solution that simplifies the process of prototyping, experimenting, iterating, and deploying your AI applications.

With prompt flow, you'll be able to:

- Orchestrate executable flows with LLMs, prompts, and Python tools through a visualized graph.
- Test, debug, and iterate your flows with ease.
- Create prompt variants and compare their performance.

In this article, you'll learn how to create and develop your first prompt flow in your Azure Machine Learning studio.

## Create and develop your Prompt flow

In studio, select **Prompt flow** tab in the left navigation bar. Select **Create** to create your first Prompt flow. You can create a flow by either cloning the samples available in the gallery or creating a flow from scratch. If you already have flow files in local or file share, you can also import the files to create a flow.

:::image type="content" source="./media/how-to-develop-flow/gallery.png" alt-text="Screenshot of prompt flow creation from scratch or gallery." lightbox ="./media/how-to-develop-flow/gallery.png":::

### Authoring the flow

At the left, it's the flatten view, the main working area where you can author the flow, for example add tools in your flow, edit the prompt, set the flow input data, run your flow, view the output, etc.

:::image type="content" source="./media/how-to-develop-flow/flow-authoring-layout.png" alt-text="Screenshot of the prompt flow main working area." lightbox ="./media/how-to-develop-flow/flow-authoring-layout.png":::

On the top right, it's the flow files view. Each flow can be represented by a folder that contains a `flow.dag.yaml`` file, source code files, and system folders. You can add new files, edit existing files, and delete files. You can also export the files to local, or import files from local.

In addition to inline editing the node in flatten view, you can also turn on the **Raw file mode** toggle and select the file name to edit the file in the opening file tab.

On the bottom right, it's the graph view for visualization only. It shows the flow structure you're developing. You can zoom in, zoom out, auto layout, etc.

> [!NOTE]
> You cannot edit the graph view directly, but you can select the node to locate to the corresponding node card in the flatten view, then do the inline editing.

### Runtime: Select existing runtime or create a new one

Before you start authoring, you should first select a runtime. Runtime serves as the compute resource required to run the prompt flow, which includes a Docker image that contains all necessary dependency packages. It's a must-have for flow execution.

You can select an existing runtime from the dropdown or select the **Add runtime** button. This will open up a Runtime creation wizard. Select an existing compute instance from the dropdown or create a new one. After this, you will have to select an environment to create the runtime. We recommend using default environment to get started quickly.

:::image type="content" source="./media/how-to-develop-flow/runtime-creation.png" alt-text="Screenshot of runtime creation in studio." lightbox ="./media/how-to-develop-flow/runtime-creation.png":::

### Flow input and output

Flow input is the data passed into the flow as a whole. Define the input schema by specifying the name and type. Set the input value of each input to test the flow. You can reference the flow input later in the flow nodes using `${input.[input name]}` syntax.

Flow output is the data produced by the flow as a whole, which summarizes the results of the flow execution. You can view and export the output table after the flow run or batch run is completed.  Define flow output value by referencing the flow single node output using syntax `${[node name].output}` or `${[node name].output.[field name]}`.

:::image type="content" source="./media/how-to-develop-flow/flow-input-output.png" alt-text=" Screenshot of flow input and output." lightbox ="./media/how-to-develop-flow/flow-input-output.png":::

### Develop the flow using different tools

In a flow, you can consume different kinds of tools, for example, LLM, Python, Serp API, Content Safety, etc.

By selecting a tool, you'll add a new node to flow. You should specify the node name, and set necessary configurations for the node.

For example, for LLM node, you need to select a connection, a deployment, set the prompt, etc. Connection helps securely store and manage secret keys or other sensitive credentials required for interacting with Azure OpenAI. If you don't already have a connection, you should create it first, and make sure your Azure OpenAI resource has the chat or completion deployments. LLM and Prompt tool supports you to use **Jinja** as templating language to dynamically generate the prompt. For example, you can use `{{}}` to enclose your input name, instead of fixed text, so it can be replaced on the fly.

To use Python tool, you need to set the Python script, set the input value, etc. You should define a Python function with inputs and outputs as follows.

:::image type="content" source="./media/how-to-develop-flow/python-tool.png" alt-text=" Screenshot of writing a Python script for Python node." lightbox ="./media/how-to-develop-flow/python-tool.png":::

After you finish composing the prompt or Python script, you can select **Validate and parse input** so the system will automatically parse the node input based on the prompt template and python function input. The node input value can be set in following ways:

- Set the value directly in the input box
- Reference the flow input using `${input.[input name]}` syntax
- Reference the node output using `${[node name].output}` or `${[node name].output.[field name]}` syntax

### Link nodes together

By referencing the node output, you can link nodes together. For example, you can reference the LLM node output in the Python node input, so the Python node can consume the LLM node output, and in the graph view you can see the two nodes are linked together.

### Enable conditional control to the flow

Prompt Flow offers not just a streamlined way to execute the flow, but it also brings in a powerful feature for developers - conditional control, which allows users to set conditions for the execution of any node in a flow.

At its core, conditional control provides the capability to associate each node in a flow with an **activate config**. This configuration is essentially a "when" statement that determines when a node should be executed. The power of this feature is realized when you have complex flows where the execution of certain tasks depends on the outcome of previous tasks. By leveraging the conditional control, you can configure your specific nodes to execute only when the specified conditions are met.

Specifically, you can set the activate config for a node by selecting the **Activate config** button in the node card. You can add "when" statement and set the condition.
You can set the conditions by referencing the flow input, or node output. For example, you can set the condition `${input.[input name]}` as specific value or `${[node name].output}` as specific value.

If the condition isn't met, the node will be skipped. The node status is shown as "Bypassed".

:::image type="content" source="./media/how-to-develop-flow/conditional-flow.png" alt-text="Screenshot of setting activate config to enable conditional control." lightbox ="./media/how-to-develop-flow/conditional-flow.png":::

### Test the flow

You can test the flow in two ways: run single node or run the whole flow.

To run a single node, select the **Run** icon on node in flatten view. Once running is completed, check output in node output section.

To run the whole flow, select the **Run** button at the right top. Then you can check the run status and output of each node, as well as the results of flow outputs defined in the flow. You can always change the flow input value and run the flow again.

:::image type="content" source="./media/how-to-develop-flow/view-flow-output.png" alt-text=" Screenshot of view output button in two locations." lightbox ="./media/how-to-develop-flow/view-flow-output.png":::

:::image type="content" source="./media/how-to-develop-flow/flow-output.png" alt-text="Screenshot of outputs on the output tab." lightbox ="./media/how-to-develop-flow/flow-output.png":::

## Develop a chat flow

Chat flow is designed for conversational application development, building upon the capabilities of standard flow and providing enhanced support for chat inputs/outputs and chat history management. With chat flow, you can easily create a chatbot that handles chat input and output.

In chat flow authoring page, the chat flow is tagged with a "chat" label to distinguish it from standard flow and evaluation flow. To test the chat flow, select "Chat" button to trigger a chat box for conversation.

:::image type="content" source="./media/how-to-develop-flow/chat-authoring-layout.png" alt-text="Screenshot of chat flow authoring page." lightbox ="./media/how-to-develop-flow/chat-authoring-layout.png":::

### Chat input/output and chat history

The most important elements that differentiate a chat flow from a standard flow are **Chat input**, **Chat history**, and **Chat output**.  

- **Chat input**: Chat input refers to the messages or queries submitted by users to the chatbot. Effectively handling chat input is crucial for a successful conversation, as it involves understanding user intentions, extracting relevant information, and triggering appropriate responses.
- **Chat history**: Chat history is the record of all interactions between the user and the chatbot, including both user inputs and AI-generated outputs. Maintaining chat history is essential for keeping track of the conversation context and ensuring the AI can generate contextually relevant responses.
- **Chat output**: Chat output refers to the AI-generated messages that are sent to the user in response to their inputs. Generating contextually appropriate and engaging chat output is vital for a positive user experience.

A chat flow can have multiple inputs, chat history and chat input are **required** in chat flow.

- In the chat flow inputs section, a flow input can be marked as chat input. Then you can fill the chat input value by typing in the chat box.
- Prompt flow can help user to manage chat history. The `chat_history` in the Inputs section is reserved for representing Chat history. All interactions in the chat box, including user chat inputs, generated chat outputs, and other flow inputs and outputs, are automatically stored in chat history. User can't manually set the value of `chat_history` in the Inputs section. It's structured as a list of inputs and outputs:

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
> [!NOTE]
> The capability to automatically save or manage chat history is an feature on the authoring page when conducting tests in the chat box. For batch runs, it's necessary for users to include the chat history within the batch run dataset. If there's no chat history available for testing, simply set the chat_history to an empty list `[]` within the batch run dataset.

### Author prompt with chat history

Incorporating Chat history into your prompts is essential for creating context-aware and engaging chatbot responses. In your prompts, you can reference `chat_history`  to retrieve past interactions. This allows you to reference previous inputs and outputs to create contextually relevant responses.

Use [for-loop grammar of Jinja language](https://jinja.palletsprojects.com/en/3.1.x/templates/#for) to display a list of inputs and outputs from `chat_history`.  

```jinja
{% for item in chat_history %}
user:
{{item.inputs.question}}
assistant:
{{item.outputs.answer}}
{% endfor %}
```

### Test with the chat box

The chat box provides an interactive way to test your chat flow by simulating a conversation with your chatbot. To test your chat flow using the chat box, follow these steps:

1. Select the "Chat" button to open the chat box.
2. Type your test inputs into the chat box and select **Enter** to send them to the chatbot.
3. Review the chatbot's responses to ensure they're contextually appropriate and accurate.

:::image type="content" source="./media/how-to-develop-flow/chat-box.png" alt-text=" Screenshot of Chat flow chat box experience." lightbox ="./media/how-to-develop-flow/chat-box.png":::

## Next steps

- [Batch run  using more data and evaluate the flow performance](how-to-bulk-test-evaluate-flow.md)
- [Tune prompts using variants](how-to-tune-prompts-using-variants.md)
- [Deploy a flow](how-to-deploy-for-real-time-inference.md)
