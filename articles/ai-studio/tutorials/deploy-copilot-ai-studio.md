---
title: Build and deploy a question and answer copilot with prompt flow in Azure AI Studio
titleSuffix: Azure AI Studio
description: Use this article to build and deploy a question and answer copilot with prompt flow in Azure AI Studio
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - build-2024
ms.topic: tutorial
ms.date: 5/21/2024
ms.reviewer: eur
ms.author: eur
author: eric-urban
---

# Tutorial: Build and deploy a question and answer copilot with prompt flow in Azure AI Studio

[!INCLUDE [Feature preview](../includes/feature-preview.md)]

In this [Azure AI Studio](https://ai.azure.com) tutorial, you use generative AI and prompt flow to build, configure, and deploy a copilot for your retail company called Contoso. Your retail company specializes in outdoor camping gear and clothing. 

The copilot should answer questions about your products and services. It should also answer questions about your customers. For example, the copilot can answer questions such as "How much do the TrailWalker hiking shoes cost?" and "How many TrailWalker hiking shoes did Daniel Wilson buy?".

The steps in this tutorial are:

1. Add your data to the chat playground.
1. Create a prompt flow from the playground.
1. Customize prompt flow with multiple data sources.
1. Evaluate the flow using a question and answer evaluation dataset.
1. Deploy the flow for consumption.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- An [AI Studio hub](../how-to/create-azure-ai-resource.md), [project](../how-to/create-projects.md), and [deployed Azure OpenAI](../how-to/deploy-models-openai.md) chat model. Complete the [AI Studio playground quickstart](../quickstarts/get-started-playground.md) to create these resources if you haven't already.

- An [Azure AI Search service connection](../how-to/connections-add.md#create-a-new-connection) to index the sample product and customer data. 

- You need a local copy of product and customer data. The [Azure-Samples/aistudio-python-quickstart-sample repository on GitHub](https://github.com/Azure-Samples/aistudio-python-quickstart-sample/tree/main/data) contains sample retail customer and product information that's relevant for this tutorial scenario. Clone the repository or copy the files from [1-customer-info](https://github.com/Azure-Samples/aistudio-python-quickstart-sample/tree/main/data/1-customer-info) and [3-product-info](https://github.com/Azure-Samples/aistudio-python-quickstart-sample/tree/main/data/3-product-info). 

## Add your data and try the chat model again

In the [AI Studio playground quickstart](../quickstarts/get-started-playground.md) (that's a prerequisite for this tutorial), you can observe how your model responds without your data. Now you add your data to the model to help it answer questions about your products.

[!INCLUDE [Chat with your data](../includes/chat-with-data.md)]

## Create a prompt flow from the playground

Now you might ask "How can I further customize this copilot?" You might want to add multiple data sources, compare different prompts or the performance of multiple models. A [prompt flow](../how-to/prompt-flow.md) serves as an executable workflow that streamlines the development of your LLM-based AI application. It provides a comprehensive framework for managing data flow and processing within your application. You use prompt flow to optimize the messages that are sent to the copilot's chat model.

In this section, you learn how to transition to prompt flow from the playground. You export the playground chat environment including connections to the data that you added. Later in this tutorial, you [evaluate the flow](#evaluate-the-flow-using-a-question-and-answer-evaluation-dataset) and then [deploy the flow](#deploy-the-flow) for [consumption](#use-the-deployed-flow).

> [!NOTE]
> The changes made in prompt flow aren't applied backwards to update the playground environment. 

You can create a prompt flow from the playground by following these steps:
1. Go to your project in [AI Studio](https://ai.azure.com). 
1. Select **Playgrounds** > **Chat** from the left pane.
1. Since we're using our own data, you need to select **Add your data**. You should already have an index named *product-info* that you created previously in the chat playground. Select it from the **Select available project index** dropdown. Otherwise, [first create an index with your product data](#add-your-data-and-try-the-chat-model-again) and then return to this step. 
1. Select **Prompt flow** from the menu above the chat session pane.
1. Enter a folder name for your prompt flow. Then select **Open**. AI Studio exports the playground chat environment to prompt flow. The export includes the connections to the data that you added.

    :::image type="content" source="../media/tutorials/chat/prompt-flow-from-playground.png" alt-text="Screenshot of the open in prompt flow dialog." lightbox="../media/tutorials/chat/prompt-flow-from-playground.png":::

Within a flow, nodes take center stage, representing specific tools with unique capabilities. These nodes handle data processing, task execution, and algorithmic operations, with inputs and outputs. By connecting nodes, you establish a seamless chain of operations that guides the flow of data through your application. For more information, see [prompt flow tools](../how-to/prompt-flow.md#prompt-flow-tools).

To facilitate node configuration and fine-tuning, a visual representation of the workflow structure is provided through a DAG (Directed Acyclic Graph) graph. This graph showcases the connectivity and dependencies between nodes, providing a clear overview of the entire workflow. The nodes in the graph shown here are representative of the playground chat experience that you exported to prompt flow. 

   :::image type="content" source="../media/tutorials/chat/prompt-flow-overview-graph.png" alt-text="Screenshot of the default graph exported from the playground to prompt flow." lightbox="../media/tutorials/chat/prompt-flow-overview-graph.png":::

In prompt flow, you should also see:
- **Save** button: You can save your prompt flow at any time by selecting **Save** from the top menu. Be sure to save your prompt flow periodically as you make changes in this tutorial. 
- **Start compute session** button: You need to start a compute session to run your prompt flow. You can start the session later in the tutorial. You incur costs for compute instances while they are running. For more information, see [how to create a compute session](../how-to/create-manage-compute-session.md).

:::image type="content" source="../media/tutorials/chat/prompt-flow-save-session.png" alt-text="Screenshot of the save and start session buttons in your flow." lightbox="../media/tutorials/chat/prompt-flow-save-session.png":::

You can return to the prompt flow anytime by selecting **Prompt flow** from **Tools** in the left menu. Then select the prompt flow folder that you created previously.

:::image type="content" source="../media/tutorials/chat/prompt-flow-return.png" alt-text="Screenshot of the list of your prompt flows." lightbox="../media/tutorials/chat/prompt-flow-return.png":::

## Customize prompt flow with multiple data sources

previously in the [AI Studio](https://ai.azure.com) chat playground, you [added your data](#add-your-data-and-try-the-chat-model-again) to create one search index that contained product data for the Contoso copilot. So far, users can only inquire about products with questions such as "How much do the TrailWalker hiking shoes cost?". But they can't get answers to questions such as "How many TrailWalker hiking shoes did Daniel Wilson buy?" To enable this scenario, we add another index with customer information to the flow.

### Create the customer info index

To proceed, you need a local copy of example customer information. For more information and links to example data, see the [prerequisites](#prerequisites).

Follow these instructions on how to create a new index. You'll return to your prompt flow later in this tutorial to add the customer info to the flow. You can open a new tab in your browser to follow these instructions and then return to your prompt flow.

1. Go to your project in [AI Studio](https://ai.azure.com). 
1. Select **Index** from the left menu. Notice that you already have an index named *product-info* that you created previously in the chat playground.

    :::image type="content" source="../media/tutorials/chat/add-index-new.png" alt-text="Screenshot of the indexes page with the button to create a new index." lightbox="../media/tutorials/chat/add-index-new.png":::

1. Select **+ New index**. You're taken to the **Create an index** wizard. 

1. On the **Source data** page, select **Upload files** from the **Data source** dropdown. Then select **Upload** > **Upload files** to browse your local files. 
1. Select the customer info files that you downloaded or created previously. See the [prerequisites](#prerequisites). Then select **Next**.

    :::image type="content" source="../media/tutorials/chat/add-index-dataset-upload-folder.png" alt-text="Screenshot of the customer data source selection options." lightbox="../media/tutorials/chat/add-index-dataset-upload-folder.png":::

1. Select the same [Azure AI Search service connection](../how-to/connections-add.md#create-a-new-connection) (*contosooutdooraisearch*) that you used for your product info index. Then select **Next**.
1. Enter **customer-info** for the index name. 

    :::image type="content" source="../media/tutorials/chat/add-index-settings.png" alt-text="Screenshot of the Azure AI Search service and index name." lightbox="../media/tutorials/chat/add-index-settings.png":::

1. Select a virtual machine to run indexing jobs. The default option is **Auto select**. Then select **Next**.
1. On the **Search settings** page under **Vector settings**, deselect the **Add vector search to this search resource** checkbox. This setting helps determine how the model responds to requests. Then select **Next**.
    
    > [!NOTE]
    > If you add vector search, more options would be available here for an additional cost. 


1. Review the details you entered, and select **Create**. 

    :::image type="content" source="../media/tutorials/chat/add-index-review.png" alt-text="Screenshot of the review and finish index creation page." lightbox="../media/tutorials/chat/add-index-review.png":::

    > [!NOTE]
    > You use the *customer-info* index and the *contosooutdooraisearch* connection to your Azure AI Search service in prompt flow later in this tutorial. If the names you enter differ from what's specified here, make sure to use the names you entered in the rest of the tutorial.

1. You're taken to the index details page where you can see the status of your index creation.

    :::image type="content" source="../media/tutorials/chat/add-index-created-details.png" alt-text="Screenshot of the customer info index details." lightbox="../media/tutorials/chat/add-index-created-details.png":::

For more information on how to create an index, see [Create an index](../how-to/index-add.md).

### Create a compute session that's needed for prompt flow

After you're done creating your index, return to your prompt flow and start the compute session. Prompt flow requires a compute session to run. 
1. Go to your project.
1. Select **Prompt flow** from **Tools** in the left menu. Then select the prompt flow folder that you created previously.
1. Select **Start compute session** from the top menu. 

To create a compute instance and a compute session, you can also follow the steps in [how to create a compute session](../how-to/create-manage-compute-session.md).

To complete the rest of the tutorial, make sure that your compute session is running. 

> [!IMPORTANT]
> You're charged for compute instances while they are running. To avoid incurring unnecessary Azure costs, pause the compute instance when you're not actively working in prompt flow. For more information, see [how to start and stop compute](../how-to/create-manage-compute.md#start-or-stop-a-compute-instance).

### Add customer information to the flow

After you're done creating your index, return to your prompt flow and follow these steps to add the customer info to the flow:

1. Make sure you have a compute session running. If you don't have one, see [create a compute session](#create-a-compute-session-thats-needed-for-prompt-flow) in the previous section.
1. Select **+ More tools** from the top menu and then select **Index Lookup** from the list of tools. 

    :::image type="content" source="../media/tutorials/chat/add-tool-index-lookup.png" alt-text="Screenshot of selecting the index lookup tool in prompt flow." lightbox="../media/tutorials/chat/add-tool-index-lookup.png":::

1. Name the new node **queryCustomerIndex** and select **Add**.
1. Select the **mlindex_content** textbox in the **queryCustomerIndex** node. 

    :::image type="content" source="../media/tutorials/chat/index-lookup-mlindex-content.png" alt-text="Screenshot of the mlindex_content textbox in the index lookup node." lightbox="../media/tutorials/chat/index-lookup-mlindex-content.png":::

    The **Generate** dialog opens. You use this dialog to configure the **queryCustomerIndex** node to connect to your *customer-info* index.

1. For the **index_type** value, select **Azure AI Search**.
1. Select or enter the following values:

    | Name | Value |
    |----------|-----------|
    | **acs_index_connection** | The name of your Azure AI Search service connection (such as *contosooutdooraisearch*) |
    | **acs_index_name** | *customer-info* |
    | **acs_content_field** | *content* |
    | **acs_metadata_field** | *meta_json_string* |
    | **semantic_configuration** | *azuremldefault* |
    | **embedding_type** | *None* |

1. Select **Save** to save your settings.
1. Select or enter the following values for the **queryCustomerIndex** node:

    | Name | Value |
    |----------|-----------|
    | **queries** | *${extractSearchIntent.output}* |
    | **query_type** | *Keyword* |
    | **topK** | *5* |

    You can see the **queryCustomerIndex** node is connected to the **extractSearchIntent** node in the graph.

    :::image type="content" source="../media/tutorials/chat/connect-to-search-intent.png" alt-text="Screenshot of the prompt flow node for retrieving product info." lightbox="../media/tutorials/chat/connect-to-search-intent.png":::

1. Select **Save** from the top menu to save your changes. Remember to save your prompt flow periodically as you make changes.

### Connect the customer info to the flow

In the next section, you aggregate the product and customer info to output it in a format that the large language model can use. But first, you need to connect the customer info to the flow.

1. Select the ellipses icon next to **+ More tools** and then select **Raw file mode** to switch to raw file mode. This mode allows you to copy and paste nodes in the graph.

    :::image type="content" source="../media/tutorials/chat/raw-file-mode-select.png" alt-text="Screenshot of the raw file mode option in prompt flow." lightbox="../media/tutorials/chat/raw-file-mode-select.png":::

1. Replace all instances of **querySearchResource** with **queryProductIndex** in the graph. We're renaming the node to better reflect that it retrieves product info and contrasts with the **queryCustomerIndex** node that you added to the flow.
1. Rename and replace all instances of **chunkDocuments** with **chunkProductDocuments** in the graph.
1. Rename and replace all instances of **selectChunks** with **selectProductChunks** in the graph.
1. Copy and paste the **chunkProductDocuments** and **selectProductChunks** nodes to create similar nodes for the customer info. Rename the new nodes **chunkCustomerDocuments** and **selectCustomerChunks** respectively.
1. Within the **chunkCustomerDocuments** node, replace the `${queryProductIndex.output}` input with `${queryCustomerIndex.output}`.
1. Within the **selectCustomerChunks** node, replace the `${chunkProductDocuments.output}` input with `${chunkCustomerDocuments.output}`.
1. Select **Save** from the top menu to save your changes.

    :::image type="content" source="../media/tutorials/chat/raw-file-mode-save.png" alt-text="Screenshot of the option to save the yaml file in raw file mode." lightbox="../media/tutorials/chat/raw-file-mode-select.png":::

    By now, the `flow.dag.yaml` file should include nodes (among others) that look similar to the following example:
    
    ```yaml
    - name: chunkProductDocuments
      type: python
      source:
        type: code
        path: chunkProductDocuments.py
      inputs:
        data_source: Azure AI Search
        max_tokens: 1050
        queries: ${extractSearchIntent.output}
        query_type: Keyword
        results: ${queryProductIndex.output}
        top_k: 5
      use_variants: false
    - name: selectProductChunks
      type: python
      source:
        type: code
        path: filterChunks.py
      inputs:
        min_score: 0.3
        results: ${chunkProductDocuments.output}
        top_k: 5
      use_variants: false
    - name: chunkCustomerDocuments
      type: python
      source:
        type: code
        path: chunkCustomerDocuments.py
      inputs:
        data_source: Azure AI Search
        max_tokens: 1050
        queries: ${extractSearchIntent.output}
        query_type: Keyword
        results: ${queryCustomerIndex.output}
        top_k: 5
      use_variants: false
    - name: selectCustomerChunks
      type: python
      source:
        type: code
        path: filterChunks.py
      inputs:
        min_score: 0.3
        results: ${chunkCustomerDocuments.output}
        top_k: 5
      use_variants: false
    ```

### Aggregate product and customer info

At this point, the prompt flow only uses the product information.
- **extractSearchIntent** extracts the search intent from the user's question.
- **queryProductIndex** retrieves the product info from the *product-info* index.
- The **LLM** tool (for large language models) receives a formatted reply via the **chunkProductDocuments** > **selectProductChunks** > **formatGeneratedReplyInputs** nodes.

You need to connect and aggregate the product and customer info to output it in a format that the **LLM** tool can use. Follow these steps to aggregate the product and customer info:

1. Select **Python** from the list of tools.
1. Name the tool **aggregateChunks** and select **Add**.
1. Copy and paste the following Python code to replace all contents in the **aggregateChunks** code block. 

    ```python
    from promptflow import tool
    from typing import List
    
    @tool
    def aggregate_chunks(input1: List, input2: List) -> str:
        interleaved_list = []
        for i in range(max(len(input1), len(input2))):
            if i < len(input1):
                interleaved_list.append(input1[i])
            if i < len(input2):
                interleaved_list.append(input2[i])
        return interleaved_list
    ```

1. Select the **Validate and parse input** button to validate the inputs for the **aggregateChunks** node. If the inputs are valid, prompt flow parses the inputs and creates the necessary variables for you to use in your code.

    :::image type="content" source="../media/tutorials/chat/aggregate-chunks-validate.png" alt-text="Screenshot of the prompt flow node for aggregating product and customer information." lightbox="../media/tutorials/chat/aggregate-chunks-validate.png":::

1. Edit the **aggregateChunks** node to connect the product and customer info. Set the **inputs** to the following values:

    | Name | Type | Value |
    |----------|----------|-----------|
    | **input1** | list | *${selectProductChunks.output}* |
    | **input2** | list | *${selectCustomerChunks.output}* |

    :::image type="content" source="../media/tutorials/chat/aggregate-chunks-inputs.png" alt-text="Screenshot of the inputs to edit in the aggregate chunks node." lightbox="../media/tutorials/chat/aggregate-chunks-inputs.png":::

1. Select the **shouldGenerateReply** node from the graph. Select or enter `${aggregateChunks.output}` for the **chunks** input.
1. Select the **formatGenerateReplyInputs** node from the graph. Select or enter `${aggregateChunks.output}` for the **chunks** input.
1. Select the **outputs** node from the graph. Select or enter `${aggregateChunks.output}` for the **chunks** input.
1. Select **Save** from the top menu to save your changes. Remember to save your prompt flow periodically as you make changes.

Now you can see the **aggregateChunks** node in the graph. The node connects the product and customer info to output it in a format that the **LLM** tool can use.

:::image type="content" source="../media/tutorials/chat/aggregate-chunks-connected.png" alt-text="Screenshot of the inputs and outputs of the aggregate chunks node in the graph." lightbox="../media/tutorials/chat/aggregate-chunks-connected.png":::

### Chat in prompt flow with product and customer info

By now you have both the product and customer info in prompt flow. You can chat with the model in prompt flow and get answers to questions such as "How many TrailWalker hiking shoes did Daniel Wilson buy?" Before proceeding to a more formal evaluation, you can optionally chat with the model to see how it responds to your questions.

1. Continue from the previous section with the **outputs** node selected. Make sure that the **reply** output has the **Chat output** radio button selected. Otherwise, the full set of documents are returned in response to the question in chat.
1. Select **Chat** from the top menu in prompt flow to try chat.
1. Enter "How many TrailWalker hiking shoes did Daniel Wilson buy?" and then select the right arrow icon to send.
    
    > [!NOTE]
    > It might take a few seconds for the model to respond. You can expect the response time to be faster when you use a deployed flow.

1. The response is what you expect. The model uses the customer info to answer the question.

   :::image type="content" source="../media/tutorials/chat/chat-with-data-customer.png" alt-text="Screenshot of the assistant's reply with product and customer grounding data." lightbox="../media/tutorials/chat/chat-with-data-customer.png":::

## Evaluate the flow using a question and answer evaluation dataset

In [AI Studio](https://ai.azure.com), you want to evaluate the flow before you [deploy the flow](#deploy-the-flow) for [consumption](#use-the-deployed-flow).

In this section, you use the built-in evaluation to evaluate your flow with a question and answer evaluation dataset. The built-in evaluation uses AI-assisted metrics to evaluate your flow: groundedness, relevance, and retrieval score. For more information, see [built-in evaluation metrics](../concepts/evaluation-metrics-built-in.md).

### Create an evaluation

You need a question and answer evaluation dataset that contains questions and answers that are relevant to your scenario. Create a new file locally named **qa-evaluation.jsonl**. Copy and paste the following questions and answers (`"truth"`) into the file.

```json
{"question": "What color is the CozyNights Sleeping Bag?", "truth": "Red", "chat_history": [], }
{"question": "When did Daniel Wilson order the BaseCamp Folding Table?", "truth": "May 7th, 2023", "chat_history": [] }
{"question": "How much does TrailWalker Hiking Shoes cost? ", "truth": "$110", "chat_history": [] }
{"question": "What kind of tent did Sarah Lee buy?", "truth": "SkyView 2 person tent", "chat_history": [] }
{"question": "What is Melissa Davis's phone number?", "truth": "555-333-4444", "chat_history": [] }
{"question": "What is the proper care for trailwalker hiking shoes?", "truth": "After each use, remove any dirt or debris by brushing or wiping the shoes with a damp cloth.", "chat_history": [] }
{"question": "Does TrailMaster Tent come with a warranty?", "truth": "2 years", "chat_history": [] }
{"question": "How much did David Kim spend on the TrailLite Daypack?", "truth": "$240", "chat_history": [] }
{"question": "What items did Amanda Perez purchase?", "truth": "TrailMaster X4 Tent, TrekReady Hiking Boots (quantity 3), CozyNights Sleeping Bag, TrailBlaze Hiking Pants, RainGuard Hiking Jacket, and CompactCook Camping Stove", "chat_history": [] }
{"question": "What is the Brand for TrekReady Hiking Boots", "truth": "TrekReady", "chat_history": [] }
{"question": "How many items did Karen Williams buy?", "truth": "three items of the Summit Breeze Jacket", "chat_history": [] }
{"question": "France is in Europe", "truth": "Sorry, I can only truth questions related to outdoor/camping gear and equipment", "chat_history": [] }
```

Now that you have your evaluation dataset, you can evaluate your flow by following these steps:

1. Select **Evaluate** > **Built-in evaluation** from the top menu in prompt flow.
   
    :::image type="content" source="../media/tutorials/chat/evaluate-built-in-evaluation.png" alt-text="Screenshot of the option to create a built-in evaluation from prompt flow." lightbox="../media/tutorials/chat/evaluate-built-in-evaluation.png":::

    You're taken to the **Create a new evaluation** wizard.

1. Enter a name for your evaluation and select a compute session.
1. Select **Question and answer without context** from the scenario options.
1. Select the flow to evaluate. In this example, select *Contoso outdoor flow* or whatever you named your flow. Then select **Next**.

    :::image type="content" source="../media/tutorials/chat/evaluate-basic-scenario.png" alt-text="Screenshot of selecting an evaluation scenario." lightbox="../media/tutorials/chat/evaluate-basic-scenario.png":::

1. Select **Add your dataset** on the **Configure test data** page. 

    :::image type="content" source="../media/tutorials/chat/evaluate-add-dataset.png" alt-text="Screenshot of the option to use a new or existing dataset." lightbox="../media/tutorials/chat/evaluate-add-dataset.png":::

1. Select **Upload file**, browse files, and select the **qa-evaluation.jsonl** file that you created previously. 

1. After the file is uploaded, you need to configure your data columns to match the required inputs for prompt flow to execute a batch run that generate output for evaluation. Enter or select the following values for each data set mapping for prompt flow. 

    :::image type="content" source="../media/tutorials/chat/evaluate-map-data-source.png" alt-text="Screenshot of the prompt flow evaluation dataset mapping." lightbox="../media/tutorials/chat/evaluate-map-data-source.png":::

    | Name | Description | Type | Data source |
    |----------|----------|-----------|-----------|
    | **chat_history** | The chat history | list | *${data.chat_history}* |
    | **query** | The query | string | *${data.question}* |

1. Select **Next**.

1. Select the metrics you want to use to evaluate your flow. In this example, select Coherence, Fluency, GPT similarity, and F1 score. 

1. Select a connection and model to use for evaluation. In this example, select **gpt-35-turbo-16k**. Then select **Next**.

    :::image type="content" source="../media/tutorials/chat/evaluate-metrics.png" alt-text="Screenshot of selecting evaluation metrics." lightbox="../media/tutorials/chat/evaluate-metrics.png":::

    > [!NOTE]
    > Evaluation with AI-assisted metrics needs to call another GPT model to do the calculation. For best performance, use a model that supports at least 16k tokens such as gpt-4-32k or gpt-35-turbo-16k model. If you didn't previously deploy such a model, you can deploy another model by following the steps in [the AI Studio chat playground quickstart](../quickstarts/get-started-playground.md#deploy-a-chat-model). Then return to this step and select the model you deployed.

1. You need to configure your data columns to match the required inputs to generate evaluation metrics. Enter the following values to map the dataset to the evaluation properties:

    | Name | Description | Type | Data source |
    |----------|----------|-----------|-----------|
    | **question** | A query seeking specific information. | string | *${data.question}* |
    | **answer** | The response to question generated by the model as answer. | string | ${run.outputs.reply} |
    | **documents** | String with context from retrieved documents. | string | ${run.outputs.documents} |

1. Select **Next**.

1. Review the evaluation details and then select **Submit**. You're taken to the **Metric evaluations** page.

### View the evaluation status and results

Now you can view the evaluation status and results by following these steps:

1. After you [create an evaluation](#create-an-evaluation), if you aren't there already go to the **Evaluation**. On the **Metric evaluations** page, you can see the evaluation status and the metrics that you selected. You might need to select **Refresh** after a couple of minutes to see the **Completed** status.

    :::image type="content" source="../media/tutorials/chat/evaluate-status-completed.png" alt-text="Screenshot of the metric evaluations page." lightbox="../media/tutorials/chat/evaluate-status-completed.png":::

1. Stop your compute session in prompt flow. Go to your prompt flow and select **Compute session running** > **Stop compute session** from the top menu. 

    :::image type="content" source="../media/tutorials/chat/compute-session-stop.png" alt-text="Screenshot of the button to stop a compute session in prompt flow." lightbox="../media/tutorials/chat/compute-session-stop.png":::

    > [!TIP]
    > Once the evaluation is in **Completed** status, you don't need a compute session to complete the rest of this tutorial. You can stop your compute instance to avoid incurring unnecessary Azure costs. For more information, see [how to start and stop compute](../how-to/create-manage-compute.md#start-or-stop-a-compute-instance).

1. Select the name of the evaluation (such as *evaluation_evaluate_from_flow_variant_0*) to see the evaluation metrics.

    :::image type="content" source="../media/tutorials/chat/evaluate-view-results-detailed.png" alt-text="Screenshot of the detailed metrics results page." lightbox="../media/tutorials/chat/evaluate-view-results-detailed.png":::

For more information, see [view evaluation results](../how-to/evaluate-flow-results.md).

## Deploy the flow

Now that you [built a flow](#create-a-prompt-flow-from-the-playground) and completed a metrics-based [evaluation](#evaluate-the-flow-using-a-question-and-answer-evaluation-dataset), it's time to create your online endpoint for real-time inference. That means you can use the deployed flow to answer questions in real time.

Follow these steps to deploy a prompt flow as an online endpoint from [AI Studio](https://ai.azure.com).

1. Have a prompt flow ready for deployment. If you don't have one, see the previous sections or [how to build a prompt flow](../how-to/flow-develop.md).
1. Optional: Select **Chat** to test if the flow is working correctly. Testing your flow before deployment is recommended best practice.

1. Select **Deploy** on the flow editor. 

    :::image type="content" source="../media/tutorials/chat/deploy-from-flow.png" alt-text="Screenshot of the deploy button from a prompt flow editor." lightbox = "../media/tutorials/chat/deploy-from-flow.png":::

1. Provide the requested information on the **Basic Settings** page in the deployment wizard. Select **Next** to proceed to the advanced settings pages. 

    :::image type="content" source="../media/tutorials/chat/deploy-basic-settings.png" alt-text="Screenshot of the basic settings page in the deployment wizard." lightbox = "../media/tutorials/chat/deploy-basic-settings.png":::

1. On the **Advanced settings - Endpoint** page, leave the default settings and select **Next**. 
1. On the **Advanced settings - Deployment** page, leave the default settings and select **Next**. 
1. On the **Advanced settings - Outputs & connections** page, make sure all outputs are selected under **Included in endpoint response**. 

    :::image type="content" source="../media/tutorials/chat/deploy-advanced-outputs-connections.png" alt-text="Screenshot of the advanced settings page in the deployment wizard." lightbox = "../media/tutorials/chat/deploy-advanced-outputs-connections.png":::

1. Select **Review + Create** to review the settings and create the deployment. 
1. Select **Create** to deploy the prompt flow.  

    :::image type="content" source="../media/tutorials/chat/deploy-review-create.png" alt-text="Screenshot of the review prompt flow deployment settings page." lightbox = "../media/tutorials/chat/deploy-review-create.png":::

For more information, see [how to deploy a flow](../how-to/flow-deploy.md).

## Use the deployed flow

Your copilot application can use the deployed prompt flow to answer questions in real time. You can use the REST endpoint or the SDK to use the deployed flow.

1. To view the status of your deployment in [AI Studio](https://ai.azure.com), select **Deployments** from the left navigation.

    :::image type="content" source="../media/tutorials/chat/deployments-state-updating.png" alt-text="Screenshot of the prompt flow deployment state in progress." lightbox = "../media/tutorials/chat/deployments-state-updating.png":::

    Once the deployment is created successfully, you can select the deployment to view the details. 

    > [!NOTE]
    > If you see a message that says "Currently this endpoint has no deployments" or the **State** is still *Updating*, you might need to select **Refresh** after a couple of minutes to see the deployment.

1.  Optionally, the details page is where you can change the authentication type or enable monitoring.

    :::image type="content" source="../media/tutorials/chat/deploy-authentication-monitoring.png" alt-text="Screenshot of the prompt flow deployment details page." lightbox = "../media/tutorials/chat/deploy-authentication-monitoring.png":::

1. Select the **Consume** tab. You can see code samples and the REST endpoint for your copilot application to use the deployed flow. 

    :::image type="content" source="../media/tutorials/chat/deployments-score-url-samples.png" alt-text="Screenshot of the prompt flow deployment endpoint and code samples." lightbox = "../media/tutorials/chat/deployments-score-url-samples.png":::

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this tutorial if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true). 

You can also [stop or delete your compute instance](../how-to/create-manage-compute.md#start-or-stop-a-compute-instance) in [AI Studio](https://ai.azure.com) as needed.


## Next steps

* Learn more about [prompt flow](../how-to/prompt-flow.md).
* [Deploy an enterprise chat web app](./deploy-chat-web-app.md).
