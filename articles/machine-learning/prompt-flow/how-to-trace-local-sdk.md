---
title: How to trace your application with prompt flow SDK
titleSuffix: Azure Machine Learning
description: This article provides instructions on how to trace your application with prompt flow SDK.
services: machine-learning
ms.topic: how-to
ms.custom:
  - build-2024
ms.date: 5/21/2024
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: lagayhar
---

# How to trace your application with prompt flow SDK | Azure Machine Learning

[!INCLUDE [machine-learning-preview-generic-disclaimer](../includes/machine-learning-preview-generic-disclaimer.md)]

Tracing is a powerful tool that offers developers an in-depth understanding of the execution process of their generative AI applications such as agents, [AutoGen](https://microsoft.github.io/autogen/docs/Use-Cases/agent_chat), and retrieval augmented generation (RAG) use cases. It provides a detailed view of the execution flow, including the inputs and outputs of each node within the application. This essential information proves critical while debugging complex applications or optimizing performance.

While more developers are using various frameworks such as Langchain, Semantic Kernel, OpenAI, and various types of agents to create LLM-based applications. Tracing with the prompt flow SDK offers enhanced visibility and simplified troubleshooting for LLM-based applications, effectively supporting development, iteration, and production monitoring. Tracing in Azure Machine Learning follows the [OpenTelemetry specification](https://opentelemetry.io/docs/specs/otel/), capturing and visualizing the internal execution details of any AI application, enhancing the overall development experience.

## Benefits of Azure Machine Learning tracing on the enterprise-grade cloud platform

Moreover, we now offer persistent local testing on Azure Machine Learning, which is the enterprise-grade cloud platform, significantly enhancing collaboration, persistence, and test history management.

With tracing, you can:
- Have a cloud-based location to persist and track your historical tests.
- Easily extract and visualize the test results, comparing the outputs of different test cases.
- Reuse your previous test assets for later usage, for example, human feedback, data curation, etc.
- Facilitate better resource utilization in the future.
- Debug and optimize your application with ease. To get started with debugging LLM application scenarios, refer to [Tracing with LLM application](https://microsoft.github.io/promptflow/tutorials/trace-llm.html)
- Analyze retrieval and generation processes in RAG applications.
- Observe the multi-agents interactions in the multi-agent scenarios. To get started with tracing in multi-agent scenarios, refer to [Tracing with AutoGen](https://microsoft.github.io/promptflow/tutorials/trace-autogen-groupchat.html).

## Log and view traces of your applications

Azure Machine Learning provides the tracing capability for logging and managing your LLM applications tests and evaluations, while debugging and observing by drilling down the trace view.

The tracing any application feature today is implemented in the [prompt flow open-source package](https://microsoft.github.io/promptflow/), to enable user to trace LLM call or function, and LLM frameworks like LangChain and AutoGen, regardless of which framework you use, following [OpenTelemetry specification](https://opentelemetry.io/docs/specs/otel/). 

## Enable trace in your application

Code first - Make sure you have annotated your code for tracing in prompt flow!

- [Installing prompt flow](https://microsoft.github.io/promptflow/how-to-guides/quick-start.html#set-up-your-dev-environment) : require promptflow-tracing
- [Instrumenting your application code](https://microsoft.github.io/promptflow/how-to-guides/tracing/index.html#instrumenting-user-s-code) : using `@trace` and `start_trace()`.
- [Test and view trace in local](https://microsoft.github.io/promptflow/how-to-guides/tracing/trace-ui.html)

More details about tracing in prompt flow, refer to [this prompt flow documentation](https://microsoft.github.io/promptflow/how-to-guides/tracing/index.html#tracing).

## Log the trace to Azure Machine Learning

### Set the trace destination

By default, the trace is logged and viewed in your local environment. To log it in the Azure Machine Learning in the cloud, you need to set the `trace destination` to a specified Azure Machine Learning workspace.

You can refer to the following steps to set the trace destination to Azure Machine Learning workspace. 

First, ensure that Azure CLI is installed and logged in: 

```azurecli
az login
```

Next, execute the following command to set the trace destination. Replace `<your_subscription_id>`, `<your_resourcegroup_name>`, and `<your_studio_project_name>` with your specific subscription ID, resource group name, and Azure Machine Learning workspace name:

```azurecli
pf config set trace.destination=azureml://subscriptions/<your_subscription_id>/resourcegroups/<your_resourcegroup_name>/providers/Microsoft.MachineLearningServices/workspaces//<your_azureml_workspace_name>
```

### Collections

A **collection** is a group of associated traces. These collections along with their internal traces are managed and stored in the **Tracing** module under the **Collections** tab.

1. Go to your workspace in [Azure Machine Learning studio](https://ml.azure.com/).
1. From the left pane, select **Tracing**. You can see the **Collections** tab. You can only see your own collections in the list of collections. In this example, there aren't any collections yet.

    :::image type="content" source="./media/how-to-trace-local-sdk/collection.png" alt-text="Screenshot of the button to add a new connection." lightbox="./media/how-to-trace-local-sdk/collection.png":::

The collection tab displays a comprehensive list of all the collections you've created. It shows essential metadata for each collection, including its name, run location, last updated time, and created time.

- **Run location**: Indicates whether the application runs locally or in the cloud. The cloud collection is associated with specific prompt flow cloud authoring test history and generated traces. In this case, the collection name is the same as the prompt flow display name.
- **Updated on**: Shows the most recent time a new trace was logged to a collection. By default, collections are sorted in descending order based on their updated times.
- **Created on**: The time when the collection was initially created.

By selecting a collection's name, you can access a list of all the traces within that collection. Only a subset of traces can be shared with others. Refer to [share trace](#share-trace) for more information.

When logging a trace, you have the option to [specify a collection name](#customize-the-collections) to group it with other related traces. You can create multiple collections for better organization of your traces. If a collection name isn't specified when logging a trace, it defaults to the **project folder name** or to the **default collection**.

#### Customize the collections

For better organization of your traces, you can specify a custom collection name when logging a trace.

# [Python SDK](#tab/python)

If you're tracing your own application, you can set the collection name in the `start_trace()` function in your code:

```python
from promptflow.tracing import start_trace, trace

@trace
def my_function(input: str) -> str:
    output = input + "Hello World!"
    return output

my_function("This is my function")
start_trace(collection="my_custom_collection")
```

# [Azure CLI](#tab/cli)
```azurecli
# Test flow
pf flow test --flow <flow-name> --collection my_custom_collection
```

---

More details about customizing collections, refer to [tracing tutorial](https://microsoft.github.io/promptflow/reference/python-library-reference/promptflow-tracing/promptflow.tracing.html) and [prompt flow command](https://microsoft.github.io/promptflow/reference/pf-command-reference.html#pf).

### View the traces

First, you must complete the previous steps to view the traces in the cloud:
- [Enable trace in your application](#enable-trace-in-your-application).
- [Set cloud trace destination](#set-the-trace-destination).

Now, run your python script directly. Upon successful execution, a cloud trace link appears in the output. It might look something like this:

```bash
Starting prompt flow service...
...
You can view the traces in cloud from Azure portal: https://ml.azure.com/projecttrace/detail/....
```

Selecting the URL to navigate to a trace detail page on the cloud portal. This page is similar to the local trace view.

The **trace detail view** provides a comprehensive and structured overview of the operations within your application.

**Understand the trace detail view**

In the top right corner of the trace view, you find:

- Trace name: This is same as the root span name, representing the entry function name of your application.
- Status: This could either be "completed" or "failed".
- Total duration: This is total duration time of the test execution. Hover over to view the start and end times.
- Total tokens: This is the total token cost of the test. Hover over to view the prompt tokens and completed tokens.
- Created time: The time at which the trace was created.

On the left side, you can see a **hierarchical tree structure**. This structure shows the sequence of function calls. Each function call's metadata is organized into [spans](https://opentelemetry.io/docs/concepts/signals/traces/#spans). These spans are linked together in a tree-like structure, illustrating the sequence of execution.

In prompt flow SDK, we defined several span types, including LLM, Function, Embedding, Retrieval, and Flow. And the system automatically creates spans with execution information in designated attributes and events.

Each span allows you to view:

- Function name: By default, this is the name of the function as defined in your code. However, it can also be a customized span name defined via [Open Telemetry](https://opentelemetry.io/docs/what-is-opentelemetry/).
- Duration: This represents the duration for which the function ran. Hover over to view the start and end times.
- Tokens for LLM calls: This is the token cost of the LLM call. Hover over to view the prompt tokens and completed tokens.

By selecting a specific span, you can shift to viewing its associated detailed information on the right side. This information includes *input*, *output*, *raw JSON*, *logs*, and *exceptions*, which are essential for observing and debugging your application.

For the **LLM** span, a clear conversation view is provided. This includes the *system prompt*, *user prompt*, and *assistant response*. This information is especially crucial in multi-agent cases, as it allows you to understand the flow of the conversation and the interaction within the LLM intermediate auto-calling.

You can select the **raw JSON** tab to view the json data of the span. This format might be more suitable for developers when it comes to debugging and troubleshooting.

### Share trace

If you want to share the trace with others who has the project permission, you can select the **Share** button on the right corner of the trace detail page, then you have the page link copied to share with others.

> [!NOTE]
> The shared trace is read-only, and only the people who has the project permission can view it via the link.

## Next steps

- [Deploy for real time inference](how-to-deploy-for-real-time-inference.md)
