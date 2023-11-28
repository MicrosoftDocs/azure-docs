---
title: Build and deploy a question and answer copilot with prompt flow in Azure AI Studio
titleSuffix: Azure AI Studio
description: Use this article to build and deploy a question and answer copilot with prompt flow in Azure AI Studio
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: tutorial
ms.date: 11/15/2023
ms.author: eur
---

# Tutorial: Build and deploy a question and answer copilot with prompt flow in Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

In this [Azure AI Studio](https://ai.azure.com) tutorial, you use generative AI and prompt flow to build, configure, and deploy a copilot for your retail company called Contoso. Your retail company specializes in outdoor camping gear and clothing. 

The copilot should answer questions about your products and services. It should also answer questions about your customers. For example, the copilot can answer questions such as "How much do the TrailWalker hiking shoes cost?" and "How many TrailWalker hiking shoes did Daniel Wilson buy?".

The steps in this tutorial are:

1. Create an Azure AI Studio project.
1. Deploy an Azure OpenAI model and chat with your data.
1. Create a prompt flow from the playground.
1. Customize prompt flow with multiple data sources.
1. Evaluate the flow using a question and answer evaluation dataset.
1. Deploy the flow for consumption.

## Prerequisites

- An Azure subscription - <a href="https://azure.microsoft.com/free/cognitive-services" target="_blank">Create one for free</a>.
- Access granted to Azure OpenAI in the desired Azure subscription.

    Currently, access to this service is granted only by application. You can apply for access to Azure OpenAI by completing the form at <a href="https://aka.ms/oai/access" target="_blank">https://aka.ms/oai/access</a>. Open an issue on this repo to contact us if you have an issue.

- You need an Azure AI resource and your user role must be **Azure AI Developer**, **Contributor**, or **Owner** on the Azure AI resource. For more information, see [Azure AI resources](../concepts/ai-resources.md) and [Azure AI roles](../concepts/rbac-ai-studio.md).
    - If your role is **Contributor** or **Owner**, you can [create an Azure AI resource in this tutorial](#create-an-azure-ai-project-in-azure-ai-studio). 
    - If your role is **Azure AI Developer**, the Azure AI resource must already be created. 

- Your subscription needs to be below your [quota limit](../how-to/quota.md) to [deploy a new model in this tutorial](#deploy-a-chat-model). Otherwise you already need to have a [deployed chat model](../how-to/deploy-models.md). 

- You need a local copy of product and customer data. The [Azure/aistudio-copilot-sample repository on GitHub](https://github.com/Azure/aistudio-copilot-sample/tree/main/data) contains sample retail customer and product information that's relevant for this tutorial scenario. Clone the repository or copy the files from [1-customer-info](https://github.com/Azure/aistudio-copilot-sample/tree/main/data/1-customer-info) and [3-product-info](https://github.com/Azure/aistudio-copilot-sample/tree/main/data/3-product-info). 

## Create an Azure AI project in Azure AI Studio

Your Azure AI project is used to organize your work and save state while building your copilot. During this tutorial, your project contains your data, prompt flow runtime, evaluations, and other resources. For more information about the Azure AI projects and resources model, see [Azure AI resources](../concepts/ai-resources.md).

To create an Azure AI project in Azure AI Studio, follow these steps:

1. Sign in to [Azure AI Studio](https://ai.azure.com) and go to the **Build** page from the top menu. 
1. Select **+ New project**.
1. Enter a name for the project.
1. Select an Azure AI resource from the dropdown to host your project. If you don't have access to an Azure AI resource yet, select **Create a new resource**. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/create-project-details.png" alt-text="Screenshot of the project details page within the create project dialog." lightbox="../media/tutorials/copilot-deploy-flow/create-project-details.png":::

    > [!NOTE]
    > To create an Azure AI resource, you must have **Owner** or **Contributor** permissions on the selected resource group. It's recommended to share an Azure AI resource with your team. This lets you share configurations like data connections with all projects, and centrally manage security settings and spend.

1. If you're creating a new Azure AI resource, enter a name.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/create-project-resource.png" alt-text="Screenshot of the create resource page within the create project dialog." lightbox="../media/tutorials/copilot-deploy-flow/create-project-resource.png":::

1. Select your **Azure subscription** from the dropdown. Choose a specific Azure subscription for your project for billing, access, or administrative reasons. For example, this grants users and service principals with subscription-level access to your project.

1. Leave the **Resource group** as the default to create a new resource group. Alternatively, you can select an existing resource group from the dropdown.

    > [!TIP]
    > Especially for getting started it's recommended to create a new resource group for your project. This allows you to easily manage the project and all of its resources together. When you create a project, several resources are created in the resource group, including an Azure AI resource, a container registry, and a storage account.

1. Enter the **Location** for the Azure AI resource and then select **Next**. The location is the region where the Azure AI resource is hosted. The location of the Azure AI resource is also the location of the project. 

    > [!NOTE]
    > Azure AI resources and services availability differ per region. For example, certain models might not be available in certain regions. The resources in this tutorial are created in the **East US 2** region.

1. Review the project details and then select **Create a project**. 

Once a project is created, you can access the **Tools**, **Components**, and **Settings** assets in the left navigation panel. 

## Deploy a chat model

Follow these steps to deploy an Azure OpenAI chat model for your copilot. 

1. Sign in to [Azure AI Studio](https://ai.azure.com) with credentials that have access to your Azure OpenAI resource. During or after the sign-in workflow, select the appropriate directory, Azure subscription, and Azure OpenAI resource. You should be on the Azure AI Studio **Home** page.
1. Select **Build** from the top menu and then select **Deployments** > **Create**.
    
    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deploy-create.png" alt-text="Screenshot of the deployments page with a button to create a new project." lightbox="../media/tutorials/copilot-deploy-flow/deploy-create.png":::

1. On the **Select a model** page, select the model you want to deploy from the **Model** dropdown. For example, select **gpt-35-turbo-16k**. Then select **Confirm**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deploy-gpt-35-turbo-16k.png" alt-text="Screenshot of the model selection page." lightbox="../media/tutorials/copilot-deploy-flow/deploy-gpt-35-turbo-16k.png":::

1. On the **Deploy model** page, enter a name for your deployment, and then select **Deploy**. After the deployment is created, you see the deployment details page. Details include the date you created the deployment and the created date and version of the model you deployed.
1. On the deployment details page from the previous step, select **Open in playground**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deploy-gpt-35-turbo-16k-details.png" alt-text="Screenshot of the GPT chat deployment details." lightbox="../media/tutorials/copilot-deploy-flow/deploy-gpt-35-turbo-16k-details.png":::

For more information about deploying models, see [how to deploy models](../how-to/deploy-models.md).

## Chat in the playground without your data

In the [Azure AI Studio](https://ai.azure.com) playground you can observe how your model responds with and without your data. In this section, you test your model without your data. In the next section, you add your data to the model to help it better answer questions about your products.

1. In the playground, make sure that **Chat** is selected from the **Mode** dropdown. Select your deployed GPT chat model from the **Deployment** dropdown. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/playground-chat.png" alt-text="Screenshot of the chat playground with the chat mode and model selected." lightbox="../media/tutorials/copilot-deploy-flow/playground-chat.png":::

1. In the **System message** text box on the **Assistant setup** pane, provide this prompt to guide the assistant: "You're an AI assistant that helps people find information." You can tailor the prompt for your scenario. For more information, see [prompt samples](../how-to/models-foundation-azure-ai.md#prompt-samples). 
1. Select **Apply changes** to save your changes, and when prompted to see if you want to update the system message, select **Continue**. 
1. In the chat session pane, enter the following question: "How much do the TrailWalker hiking shoes cost", and then select the right arrow icon to send.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/chat-without-data.png" alt-text="Screenshot of the first chat question without grounding data." lightbox="../media/tutorials/copilot-deploy-flow/chat-without-data.png":::

1. The assistant replies that it doesn't know the answer. The model doesn't have access to product information about the TrailWalker hiking shoes. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/assistant-reply-not-grounded.png" alt-text="Screenshot of the assistant's reply without grounding data." lightbox="../media/tutorials/copilot-deploy-flow/assistant-reply-not-grounded.png":::

In the next section, you'll add your data to the model to help it answer questions about your products.

## Add your data and try the chat model again

You need a local copy of example product information. For more information and links to example data, see the [prerequisites](#prerequisites).

You upload your local data files to Azure Blob storage and create an Azure AI Search index. Your data source is used to help ground the model with specific data. Grounding means that the model uses your data to help it understand the context of your question. You're not changing the deployed model itself. Your data is stored separately and securely in your Azure subscription. For more information, see [Azure OpenAI on your data](/azure/ai-services/openai/concepts/use-your-data). 

Follow these steps to add your data to the playground to help the assistant answer questions about your products. 

1. If you aren't already in the [Azure AI Studio](https://ai.azure.com) playground, select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. On the **Assistant setup** pane, select **Add your data (preview)** > **+ Add a data source**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-your-data.png" alt-text="Screenshot of the chat playground with the option to add a data source visible." lightbox="../media/tutorials/copilot-deploy-flow/add-your-data.png":::

1. In the **Data source** page that appears, select **Upload files** from the **Select data source** dropdown. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-your-data-source.png" alt-text="Screenshot of the product data source selection options." lightbox="../media/tutorials/copilot-deploy-flow/add-your-data-source.png":::

    > [!TIP]
    > For data source options and supported file types and formats, see [Azure OpenAI on your data](/azure/ai-services/openai/concepts/use-your-data). 

1. Enter *product-info* as the name of your product information index. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-your-data-source-details.png" alt-text="Screenshot of the resources and information required to upload files." lightbox="../media/tutorials/copilot-deploy-flow/add-your-data-source-details.png":::

1. Select or create an Azure AI Search resource named *contoso-outdoor-search* and select the acknowledgment that connecting it incurs usage on your account. 

    > [!NOTE]
    > You use the *product-info* index and the *contoso-outdoor-search* Azure AI Search resource in prompt flow later in this tutorial. If the names you enter differ from what's specified here, make sure to use the names you entered in the rest of the tutorial.

1. Select the Azure subscription that contains the Azure OpenAI resource you want to use. Then select **Next**.

1. On the **Upload files** page, select **Browse for a file** and select the files you want to upload. Select the product info files that you downloaded or created earlier. See the [prerequisites](#prerequisites). If you want to upload more than one file, do so now. You can't add more files later in the same playground session.
1. Select **Upload** to upload the file to your Azure Blob storage account. Then select **Next** from the bottom of the page.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-your-data-uploaded-product-info.png" alt-text="Screenshot of the dialog to select and upload files." lightbox="../media/tutorials/copilot-deploy-flow/add-your-data-uploaded-product-info.png":::

1. On the **Data management** page under **Search type**, select **Keyword**. This setting helps determine how the model responds to requests. Then select **Next**.
    
    > [!NOTE]
    > If you had added vector search on the **Select or add data source** page, then more options would be available here for an additional cost. For more information, see [Azure OpenAI on your data](/azure/ai-services/openai/concepts/use-your-data).
    
1. Review the details you entered, and select **Save and close**. You can now chat with the model and it uses information from your data to construct the response.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-your-data-review-finish.png" alt-text="Screenshot of the review and finish page for adding data." lightbox="../media/tutorials/copilot-deploy-flow/add-your-data-review-finish.png":::

1. Now on the **Assistant setup** pane, you can see that your data ingestion is in progress. Before proceeding, wait until you see the data source and index name in place of the status.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-your-data-ingestion-in-progress.png" alt-text="Screenshot of the chat playground with the status of data ingestion in view." lightbox="../media/tutorials/copilot-deploy-flow/add-your-data-ingestion-in-progress.png":::

1. You can now chat with the model asking the same question as before ("How much do the TrailWalker hiking shoes cost"), and this time it uses information from your data to construct the response. You can expand the **references** button to see the data that was used.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/chat-with-data.png" alt-text="Screenshot of the assistant's reply with grounding data." lightbox="../media/tutorials/copilot-deploy-flow/chat-with-data.png":::


## Create compute and runtime that are needed for prompt flow

You use prompt flow to optimize the messages that are sent to the copilot's chat model. Prompt flow requires a compute instance and a runtime. If you already have a compute instance and a runtime, you can skip this section and remain in the playground.

To create a compute instance and a runtime, follow these steps:
1. If you don't have a compute instance, you can [create one in Azure AI Studio](../how-to/create-manage-compute.md). 
1. Then create a runtime by following the steps in [how to create a runtime](../how-to/create-manage-runtime.md).

To complete the rest of the tutorial, make sure that your runtime is in the **Running** status. You might need to select **Refresh** to see the updated status.

> [!IMPORTANT]
> You're charged for compute instances while they are running. To avoid incurring unnecessary Azure costs, pause the compute instance when you're not actively working in prompt flow. For more information, see [how to start and stop compute](../how-to/create-manage-compute.md#start-or-stop-a-compute-instance).


## Create a prompt flow from the playground

Now that your [deployed chat model](#deploy-a-chat-model) is working in the playground [with your data](#add-your-data-and-try-the-chat-model-again), you could [deploy your copilot as a web app](deploy-chat-web-app.md#deploy-your-web-app) from the playground. 

But you might ask "How can I further customize this copilot?" You might want to add multiple data sources, compare different prompts or the performance of multiple models. A [prompt flow](../how-to/prompt-flow.md) serves as an executable workflow that streamlines the development of your LLM-based AI application. It provides a comprehensive framework for managing data flow and processing within your application.

In this section, you learn how to transition to prompt flow from the playground. You export the playground chat environment including connections to the data that you added. Later in this tutorial, you [evaluate the flow](#evaluate-the-flow-using-a-question-and-answer-evaluation-dataset) and then [deploy the flow](#deploy-the-flow) for [consumption](#use-the-deployed-flow).

> [!NOTE]
> The changes made in prompt flow aren't applied backwards to update the playground environment. 

You can create a prompt flow from the playground by following these steps:
1. If you aren't already in the [Azure AI Studio](https://ai.azure.com) playground, select **Build** from the top menu and then select **Playground** from the collapsible left menu.
1. Select **Open in prompt flow** from the menu above the **Chat session** pane.
1. Enter a folder name for your prompt flow. Then select **Open**. Azure AI Studio exports the playground chat environment including connections to your data to prompt flow. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/prompt-flow-from-playground.png" alt-text="Screenshot of the open in prompt flow dialog." lightbox="../media/tutorials/copilot-deploy-flow/prompt-flow-from-playground.png":::

Within a flow, nodes take center stage, representing specific tools with unique capabilities. These nodes handle data processing, task execution, and algorithmic operations, with inputs and outputs. By connecting nodes, you establish a seamless chain of operations that guides the flow of data through your application. For more information, see [prompt flow tools](../how-to/prompt-flow.md#prompt-flow-tools).

To facilitate node configuration and fine-tuning, a visual representation of the workflow structure is provided through a DAG (Directed Acyclic Graph) graph. This graph showcases the connectivity and dependencies between nodes, providing a clear overview of the entire workflow. The nodes in the graph shown here are representative of the playground chat experience that you exported to prompt flow. 

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/prompt-flow-overview-graph.png" alt-text="Screenshot of the default graph exported from the playground to prompt flow." lightbox="../media/tutorials/copilot-deploy-flow/prompt-flow-overview-graph.png":::

Nodes can be added, updated, rearranged, or removed. The nodes in your flow at this point include:
- **DetermineIntent**: This node determines the intent of the user's query. It uses the system prompt to determine the intent. You can edit the system prompt to provide scenario-specific few-shot examples.
- **ExtractIntent**: This node formats the output of the **DetermineIntent** node and sends it to the **RetrieveDocuments** node.
- **RetrieveDocuments**: This node searches for top documents related to the query. This node uses the search type and any parameters you pre-configured in playground.
- **FormatRetrievedDocuments**: This node formats the output of the **RetrieveDocuments** node and sends it to the **DetermineReply** node.
- **DetermineReply**: This node contains an extensive system prompt, which asks the LLM to respond using the retrieved documents only. There are two inputs: 
    - The **RetrieveDocuments** node provides the top retrieved documents.
    - The **FormatConversation** node provides the formatted conversation history including the latest query. 

The **FormatReply** node formats the output of the **DetermineReply** node.

In prompt flow, you should also see:
- **Save**: You can save your prompt flow at any time by selecting **Save** from the top menu. Be sure to save your prompt flow periodically as you make changes in this tutorial. 
- **Runtime**: The runtime that you created [earlier in this tutorial](#create-compute-and-runtime-that-are-needed-for-prompt-flow). You can start and stop runtimes and compute instances via **Settings** in the left menu. To work in prompt flow, make sure that your runtime is in the **Running** status.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/prompt-flow-overview.png" alt-text="Screenshot of the prompt flow editor and surrounding menus." lightbox="../media/tutorials/copilot-deploy-flow/prompt-flow-overview.png":::

- **Tools**: You can return to the prompt flow anytime by selecting **Prompt flow** from **Tools** in the left menu. Then select the prompt flow folder that you created earlier (not the sample flow).

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/prompt-flow-return.png" alt-text="Screenshot of the list of your prompt flows." lightbox="../media/tutorials/copilot-deploy-flow/prompt-flow-return.png":::


## Customize prompt flow with multiple data sources

Earlier in the [Azure AI Studio](https://ai.azure.com) playground, you [added your data](#add-your-data-and-try-the-chat-model-again) to create one search index that contained product data for the Contoso copilot. So far, users can only inquire about products with questions such as "How much do the TrailWalker hiking shoes cost?". But they can't get answers to questions such as "How many TrailWalker hiking shoes did Daniel Wilson buy?" To enable this scenario, we add another index with customer information to the flow.

### Create the customer info index

You need a local copy of example customer information. For more information and links to example data, see the [prerequisites](#prerequisites).

Follow these instructions on how to create a new index:

1. Select **Index** from the left menu. Then select **+ New index**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-index-new.png" alt-text="Screenshot of the indexes page with the button to create a new index." lightbox="../media/tutorials/copilot-deploy-flow/add-index-new.png":::

    You're taken to the **Create an index** wizard. 

1. On the Source data page, select **Upload folder** from the **Upload** dropdown. Select the customer info files that you downloaded or created earlier. See the [prerequisites](#prerequisites). 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-index-dataset-upload-folder.png" alt-text="Screenshot of the customer data source selection options." lightbox="../media/tutorials/copilot-deploy-flow/add-index-dataset-upload-folder.png":::

1. Select **Next** at the bottom of the page.
1. Select the same Azure AI Search resource (*contoso-outdoor-search*) that you used for your product info index (*product-info*). Then select **Next**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-index-storage.png" alt-text="Screenshot of the selected Azure AI Search resource." lightbox="../media/tutorials/copilot-deploy-flow/add-index-storage.png":::

1. Select **Hybrid + Semantic (Recommended)** for the **Search type**. This type should be selected by default. 
1. Select *Default_AzureOpenAI* from the **Azure OpenAI resource** dropdown. Select the checkbox to acknowledge that an Azure OpenAI embedding model will be deployed if it's not already. Then select **Next**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-index-search-settings.png" alt-text="Screenshot of index search type options." lightbox="../media/tutorials/copilot-deploy-flow/add-index-search-settings.png":::

    > [!NOTE]
    > The embedding model is listed with other model deployments in the **Deployments** page. 

1. Enter **customer-info** for the index name. Then select **Next**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-index-settings.png" alt-text="Screenshot of the index name and virtual machine options." lightbox="../media/tutorials/copilot-deploy-flow/add-index-settings.png":::

1. Review the details you entered, and select **Create**. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-index-review.png" alt-text="Screenshot of the review and finish index creation page." lightbox="../media/tutorials/copilot-deploy-flow/add-index-review.png":::

    > [!NOTE]
    > You use the *customer-info* index and the *contoso-outdoor-search* Azure AI Search resource in prompt flow later in this tutorial. If the names you enter differ from what's specified here, make sure to use the names you entered in the rest of the tutorial.

1. You're taken to the index details page where you can see the status of your index creation

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/add-index-created-details.png" alt-text="Screenshot of the customer info index details." lightbox="../media/tutorials/copilot-deploy-flow/add-index-created-details.png":::

For more information on how to create an index, see [Create an index](../how-to/index-add.md).

### Add customer information to the flow

After you're done creating your index, return to your prompt flow and follow these steps to add the customer info to the flow:

1. Select the **RetrieveDocuments** node from the graph and rename it **RetrieveProductInfo**. Now the retrieve product info node can be distinguished from the retrieve customer info node that you add to the flow.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/node-rename-retrieve-product-info.png" alt-text="Screenshot of the prompt flow node for retrieving product info." lightbox="../media/tutorials/copilot-deploy-flow/node-rename-retrieve-product-info.png":::

1. Select **+ Python** from the top menu to create a new [Python node](../how-to/prompt-flow-tools/python-tool.md) that's used to retrieve customer information.  

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/node-new-retrieve-customer-info.png" alt-text="Screenshot of the prompt flow node for retrieving customer info." lightbox="../media/tutorials/copilot-deploy-flow/node-new-retrieve-customer-info.png":::

1. Name the node **RetrieveCustomerInfo** and select **Add**.
1. Copy and paste the Python code from the **RetrieveProductInfo** node into the **RetrieveCustomerInfo** node to replace all of the default code. 
1. Select the **Validate and parse input** button to validate the inputs for the **RetrieveCustomerInfo** node. If the inputs are valid, prompt flow parses the inputs and creates the necessary variables for you to use in your code.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/customer-info-validate-parse.png" alt-text="Screenshot of the validate and parse input button." lightbox="../media/tutorials/copilot-deploy-flow/customer-info-validate-parse.png":::

1. Edit the **RetrieveCustomerInfo** inputs that prompt flow parsed for you so that it can connect to your *customer-info* index.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/customer-info-edit-inputs.png" alt-text="Screenshot of inputs to edit in the retrieve customer info node." lightbox="../media/tutorials/copilot-deploy-flow/customer-info-edit-inputs.png":::

    > [!NOTE]
    > The graph is updated immediately after you set the **queries** input value to **ExtractIntent.output.search_intents**. In the graph you can see that **RetrieveCustomerInfo** gets inputs from **ExtractIntent**.

    The inputs are case sensitive, so be sure they match these values exactly:
    
    | Name | Type | Value |
    |----------|----------|-----------|
    | **embeddingModelConnection** | Azure OpenAI | *Default_AzureOpenAI* |
    | **embeddingModelName** | string | *None* |
    | **indexName** | string | *customer-info* |
    | **queries** | string | *${ExtractIntent.output.search_intents}* |
    | **queryType** | string | *simple* |
    | **searchConnection** | Cognitive search | *contoso-outdoor-search* |
    | **semanticConfiguration** | string | *None* |
    | **topK** | int | *5* |

1. Select **Save** from the top menu to save your changes.

### Format the retrieved documents to output

Now that you have both the product and customer info in your prompt flow, you format the retrieved documents so that the large language model can use them.

1. Select the **FormatRetrievedDocuments** node from the graph.
1. Copy and paste the following Python code to replace all contents in the **FormatRetrievedDocuments** code block. 

    ```python
    from promptflow import tool
     
    @tool
    def format_retrieved_documents(docs1: object, docs2: object, maxTokens: int) -> str:
      formattedDocs = []
      strResult = ""
      docs = [val for pair in zip(docs1, docs2) for val in pair]
      for index, doc in enumerate(docs):
        formattedDocs.append({
          f"[doc{index}]": {
            "title": doc['title'],
            "content": doc['content']
          }
        })
        formattedResult = { "retrieved_documents": formattedDocs }
        nextStrResult = str(formattedResult)
        if (estimate_tokens(nextStrResult) > maxTokens):
          break
        strResult = nextStrResult
      
      return {
              "combined_docs": docs,
              "strResult": strResult
          }
     
    def estimate_tokens(text: str) -> int:
      return (len(text) + 2) / 3
    ```

1. Select the **Validate and parse input** button to validate the inputs for the **FormatRetrievedDocuments** node. If the inputs are valid, prompt flow parses the inputs and creates the necessary variables for you to use in your code.

1. Edit the **FormatRetrievedDocuments** inputs that prompt flow parsed for you so that it can extract product and customer info from the **RetrieveProductInfo** and **RetrieveCustomerInfo** nodes.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/format-retrieved-documents-edit-inputs.png" alt-text="Screenshot of inputs to edit in the format retrieved documents node." lightbox="../media/tutorials/copilot-deploy-flow/format-retrieved-documents-edit-inputs.png":::

    The inputs are case sensitive, so be sure they match these values exactly:
    
    | Name | Type | Value |
    |----------|----------|-----------|
    | **docs1** | object | *${RetrieveProductInfo.output}* |
    | **docs2** | object | *${RetrieveCustomerInfo.output}* |
    | **maxTokens** | int | *5000* |

1. Select the **DetermineReply** node from the graph.
1. Set the **documentation** input to *${FormatRetrievedDocuments.output.strResult}*.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/determine-reply-edit-inputs.png" alt-text="Screenshot of editing the documentation input value in the determine reply node." lightbox="../media/tutorials/copilot-deploy-flow/determine-reply-edit-inputs.png":::

1. Select the **outputs** node from the graph.
1. Set the **fetched_docs** input to *${FormatRetrievedDocuments.output.combined_docs}*.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/outputs-edit.png" alt-text="Screenshot of editing the fetched_docs input value in the outputs node." lightbox="../media/tutorials/copilot-deploy-flow/outputs-edit.png":::

1. Select **Save** from the top menu to save your changes.

### Chat in prompt flow with product and customer info

By now you have both the product and customer info in prompt flow. You can chat with the model in prompt flow and get answers to questions such as "How many TrailWalker hiking shoes did Daniel Wilson buy?" Before proceeding to a more formal evaluation, you can optionally chat with the model to see how it responds to your questions.

1. Select **Chat** from the top menu in prompt flow to try chat.
1. Enter "How many TrailWalker hiking shoes did Daniel Wilson buy?" and then select the right arrow icon to send.
1. The response is what you expect. The model uses the customer info to answer the question.

   :::image type="content" source="../media/tutorials/copilot-deploy-flow/chat-with-data-customer.png" alt-text="Screenshot of the assistant's reply with product and customer grounding data." lightbox="../media/tutorials/copilot-deploy-flow/chat-with-data-customer.png":::

## Evaluate the flow using a question and answer evaluation dataset

In [Azure AI Studio](https://ai.azure.com), you want to evaluate the flow before you [deploy the flow](#deploy-the-flow) for [consumption](#use-the-deployed-flow).

In this section, you use the built-in evaluation to evaluate your flow with a question and answer evaluation dataset. The built-in evaluation uses AI-assisted metrics to evaluate your flow: groundedness, relevance, and retrieval score. For more information, see [built-in evaluation metrics](../concepts/evaluation-metrics-built-in.md).

### Create an evaluation

You need a question and answer evaluation dataset that contains questions and answers that are relevant to your scenario. Create a new file locally named **qa-evaluation.jsonl**. Copy and paste the following questions and answers (`"truth"`) into the file.

```json
{"question": "What color is the CozyNights Sleeping Bag?", "truth": "Red"}
{"question": "When did Daniel Wilson order the BaseCamp Folding Table?", "truth": "May 7th, 2023"}
{"question": "How much do TrailWalker Hiking Shoes cost? ", "truth": "$110"}
{"question": "What kind of tent did Sarah Lee buy?", "truth": "SkyView 2 person tent"}
{"question": "What is Melissa Davis's phone number?", "truth": "555-333-4444"}
{"question": "What is the proper care for trailwalker hiking shoes?", "truth": "After each use, remove any dirt or debris by brushing or wiping the shoes with a damp cloth."}
{"question": "Does TrailMaster Tent come with a warranty?", "truth": "2 years"}
{"question": "How much did David Kim spend on the TrailLite Daypack?", "truth": "$240"}
{"question": "What items did Amanda Perez purchase?", "truth": "TrailMaster X4 Tent, TrekReady Hiking Boots (quantity 3), CozyNights Sleeping Bag, TrailBlaze Hiking Pants, RainGuard Hiking Jacket, and CompactCook Camping Stove"}
{"question": "What is the Brand for TrekReady Hiking Boots", "truth": "TrekReady"}
{"question": "How many items did Karen Williams buy?", "truth": "three items of the Summit Breeze Jacket"}
{"question": "France is in Europe", "truth": "Sorry, I can only truth questions related to outdoor/camping gear and equipment"}
```

Now that you have your evaluation dataset, you can evaluate your flow by following these steps:

1. Select **Evaluate** > **Built-in evaluation** from the top menu in prompt flow.
   
    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-built-in-evaluation.png" alt-text="Screenshot of the option to create a built-in evaluation from prompt flow." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-built-in-evaluation.png":::

    You're taken to the **Create a new evaluation** wizard.

1. Enter a name for your evaluation and select a runtime.
1. Select **Question and answer pairs with retrieval-augmented generation** from the scenario options.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-basic-scenario.png" alt-text="Screenshot of selecting an evaluation scenario." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-basic-scenario.png":::

1. Select the flow to evaluate. In this example, select *Contoso outdoor flow* or whatever you named your flow. Then select **Next**.

1. Select the metrics you want to use to evaluate your flow. In this example, select **Groundedness**, **Relevance**, and **Retrieval score**. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-metrics.png" alt-text="Screenshot of selecting evaluation metrics." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-metrics.png":::

1. Select a model to use for evaluation. In this example, select **gpt-35-turbo-16k**. Then select **Next**.

    > [!NOTE]
    > Evaluation with AI-assisted metrics needs to call another GPT model to do the calculation. For best performance, use a GPT-4 or gpt-35-turbo-16k model. If you didn't previously deploy a GPT-4 or gpt-35-turbo-16k model, you can deploy another model by following the steps in [Deploy a chat model](#deploy-a-chat-model). Then return to this step and select the model you deployed.

1. Select **Add new dataset**. Then select **Next**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-add-dataset.png" alt-text="Screenshot of the option to use a new or existing dataset." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-add-dataset.png":::

1. Select **Upload files**, browse files, and select the **qa-evaluation.jsonl** file that you created earlier. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-upload-files.png" alt-text="Screenshot of the dataset upload files button." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-upload-files.png":::

1. After the file is uploaded, you need to map the properties from the file (data source) to the evaluation properties. Enter the following values for each data source property:

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-map-data-source.png" alt-text="Screenshot of the evaluation dataset mapping." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-map-data-source.png":::

    | Name | Description | Type | Data source |
    |----------|----------|-----------|-----------|
    | **chat_history** | The chat history | list | *${data.chat_history}* |
    | **query** | The query | string | *${data.question}* |
    | **question** | A query seeking specific information | string | *${data.question}* |
    | **answer** | The response to question generated by the model as answer | string | ${run.outputs.reply} |
    | **documents** | String with context from retrieved documents | string | ${run.outputs.fetched_docs} |

1. Select **Next**.
1. Review the evaluation details and then select **Submit**. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-review-finish.png" alt-text="Screenshot of the review and finish page within the create evaluation dialog." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-review-finish.png":::

    You're taken to the **Metric evaluations** page.

### View the evaluation status and results

Now you can view the evaluation status and results by following these steps:

1. After you [create an evaluation](#create-an-evaluation), if you aren't there already go to **Build** > **Evaluation**. On the **Metric evaluations** page, you can see the evaluation status and the metrics that you selected. You might need to select **Refresh** after a couple of minutes to see the **Completed** status.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-status-completed.png" alt-text="Screenshot of the metric evaluations page." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-status-completed.png":::

    > [!TIP]
    > Once the evaluation is in **Completed** status, you don't need runtime or compute to complete the rest of this tutorial. You can stop your compute instance to avoid incurring unnecessary Azure costs. For more information, see [how to start and stop compute](../how-to/create-manage-compute.md#start-or-stop-a-compute-instance).

1. Select the name of the evaluation that completed first (*contoso-evaluate-from-flow_variant_0*) to see the evaluation details with the columns that you mapped earlier.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-view-results-detailed.png" alt-text="Screenshot of the detailed metrics results page." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-view-results-detailed.png":::

1. Select the name of the evaluation that completed second (*evaluation_contoso-evaluate-from-flow_variant_0*) to see the evaluation metrics: **Groundedness**, **Relevance**, and **Retrieval score**.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/evaluate-view-results-metrics.png" alt-text="Screenshot of the average metrics scores." lightbox="../media/tutorials/copilot-deploy-flow/evaluate-view-results-metrics.png":::

For more information, see [view evaluation results](../how-to/evaluate-flow-results.md).

## Deploy the flow

Now that you [built a flow](#create-a-prompt-flow-from-the-playground) and completed a metrics-based [evaluation](#evaluate-the-flow-using-a-question-and-answer-evaluation-dataset), it's time to create your online endpoint for real-time inference. That means you can use the deployed flow to answer questions in real time.

Follow these steps to deploy a prompt flow as an online endpoint from [Azure AI Studio](https://ai.azure.com).

1. Have a prompt flow ready for deployment. If you don't have one, see [how to build a prompt flow](../how-to/flow-develop.md).
1. Optional: Select **Chat** to test if the flow is working correctly. Testing your flow before deployment is recommended best practice.

1. Select **Deploy** on the flow editor. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deploy-from-flow.png" alt-text="Screenshot of the deploy button from a prompt flow editor." lightbox = "../media/tutorials/copilot-deploy-flow/deploy-from-flow.png":::

1. Provide the requested information on the **Basic Settings** page in the deployment wizard. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deploy-basic-settings.png" alt-text="Screenshot of the basic settings page in the deployment wizard." lightbox = "../media/tutorials/copilot-deploy-flow/deploy-basic-settings.png":::

1. Select **Next** to proceed to the advanced settings pages. 
1. On the **Advanced settings - Endpoint** page, leave the default settings and select **Next**. 
1. On the **Advanced settings - Deployment** page, leave the default settings and select **Next**. 
1. On the **Advanced settings - Outputs & connections** page, make sure all outputs are selected under **Included in endpoint response**. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deploy-advanced-outputs-connections.png" alt-text="Screenshot of the advanced settings page in the deployment wizard." lightbox = "../media/tutorials/copilot-deploy-flow/deploy-advanced-outputs-connections.png":::

1. Select **Review + Create** to review the settings and create the deployment. 
1. Select **Create** to deploy the prompt flow.  

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deploy-review-create.png" alt-text="Screenshot of the review prompt flow deployment settings page." lightbox = "../media/tutorials/copilot-deploy-flow/deploy-review-create.png":::

For more information, see [how to deploy a flow](../how-to/flow-deploy.md).

## Use the deployed flow

Your copilot application can use the deployed prompt flow to answer questions in real time. You can use the REST endpoint or the SDK to use the deployed flow.

1. To view the status of your deployment in [Azure AI Studio](https://ai.azure.com), select **Deployments** from the left navigation. Once the deployment is created successfully, you can select the deployment to view the details.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deployments-state-updating.png" alt-text="Screenshot of the prompt flow deployment state in progress." lightbox = "../media/tutorials/copilot-deploy-flow/deployments-state-updating.png":::

    > [!NOTE]
    > If you see a message that says "Currently this endpoint has no deployments" or the **State** is still *Updating*, you might need to select **Refresh** after a couple of minutes to see the deployment.

1. Optionally, the details page is where you can change the authentication type or enable monitoring.

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deploy-authentication-monitoring.png" alt-text="Screenshot of the prompt flow deployment details page." lightbox = "../media/tutorials/copilot-deploy-flow/deploy-authentication-monitoring.png":::

1. Select the **Consume** tab. You can see code samples and the REST endpoint for your copilot application to use the deployed flow. 

    :::image type="content" source="../media/tutorials/copilot-deploy-flow/deployments-score-url-samples.png" alt-text="Screenshot of the prompt flow deployment endpoint and code samples." lightbox = "../media/tutorials/copilot-deploy-flow/deployments-score-url-samples.png":::


## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this quickstart if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true). 

You can also [stop or delete your compute instance](../how-to/create-manage-compute.md#start-or-stop-a-compute-instance) in [Azure AI Studio](https://ai.azure.com).

## Next steps

* Learn more about [prompt flow](../how-to/prompt-flow.md).
* [Deploy a web app for chat on your data](./deploy-chat-web-app.md).
* [Get started building a sample copilot application with the SDK](https://github.com/azure/aistudio-copilot-sample)
