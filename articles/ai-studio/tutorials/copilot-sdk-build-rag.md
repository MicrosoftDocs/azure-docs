---
title: "Part 1: Build a RAG-based copilot with the prompt flow SDK"
titleSuffix: Azure AI Studio
description:  Learn how to build a RAG-based copilot using the prompt flow SDK. This tutorial is part 1 of a 2-part tutorial.
manager: scottpolly
ms.service: azure-ai-studio
ms.topic: tutorial
ms.date: 8/6/2024
ms.reviewer: lebaro
ms.author: sgilley
author: sdgilley
#customer intent: As a developer, I want to learn how to use the prompt flow SDK so that I can build a RAG-based copilot.
---

# Tutorial:  Part 1 - Build a RAG-based copilot with the prompt flow SDK

In this [Azure AI Studio](https://ai.azure.com) tutorial, you use the prompt flow SDK (and other libraries) to build, configure, evaluate, and deploy a copilot for your retail company called Contoso Trek. Your retail company specializes in outdoor camping gear and clothing. The copilot should answer questions about your products and services. For example, the copilot can answer questions such as "which tent is the most waterproof?" or "what is the best sleeping bag for cold weather?".

This tutorial is part one of a two-part tutorial.

> [!TIP]
> Be sure to set aside enough time to complete the prerequisites before starting this tutorial. If you're new to Azure AI Studio, you might need to spend additional time to get familiar with the platform. 

This part one shows you how to enhance a basic chat application by adding [retrieval augmented generation (RAG)](../concepts/retrieval-augmented-generation.md) to ground the responses in your custom data.

In this part one, you learn how to:

> [!div class="checklist"]
> - [Deploy an embedding model](#deploy-an-embedding-model)
> - [Create an Azure AI Search index](#create-an-azure-ai-search-index)
> - [Develop custom RAG code](#develop-custom-rag-code)
> - [Use prompt flow to test your copilot](#use-prompt-flow-to-test-your-copilot)


## Prerequisites

> [!IMPORTANT]
> You must have the necessary permissions to add role assignments in your Azure subscription. Granting permissions by role assignment is only allowed by the **Owner** of the specific Azure resources. You might need to ask your IT admin for help with completing the [assign access](#configure-access-for-the-azure-ai-search-service) section.

- You need to complete the [Build a custom chat app in Python using the prompt flow SDK quickstart](../quickstarts/get-started-code.md) to set up your environment. 

    > [!IMPORTANT]
    > This tutorial builds on the code and environment you set up in the quickstart.

- You need a local copy of product data. The [Azure-Samples/rag-data-openai-python-promptflow repository on GitHub](https://github.com/Azure-Samples/rag-data-openai-python-promptflow/) contains sample retail product information that's relevant for this tutorial scenario. [Download the example Contoso Trek retail product data in a ZIP file](https://github.com/Azure-Samples/rag-data-openai-python-promptflow/raw/main/tutorial/data.zip) to your local machine.

## Application code structure

Create a folder called **rag-tutorial** on your local machine. This tutorial series walks through creation of the contents of each file. If you complete the tutorial series, your folder structure looks like this:

```text
rag-tutorial/
│   .env
│   build_index.py
│   deploy.py
│   evaluate.py
│   eval_dataset.jsonl
|   invoke-local.py
│
├───copilot_flow
│   └─── chat.prompty
|   └─── copilot.py
|   └─── Dockerfile
│   └─── flow.flex.yaml
│   └─── input_with_chat_history.json
│   └─── queryIntent.prompty
│   └─── requirements.txt
│
├───data
|   └─── product-info/
|   └─── [Your own data or sample data as described in the prerequisites.]
```

The implementation in this tutorial uses prompt flow's flex flow, which is the code-first approach to implementing flows. You specify an entry function (which will be defined in **copilot.py**), and then use prompt flow's testing, evaluation, and tracing capabilities for your flow. This flow is in code and doesn't have a DAG (Directed Acyclic Graph) or other visual component. Learn more about how to develop a flex flow in the [prompt flow documentation on GitHub](https://microsoft.github.io/promptflow/how-to-guides/develop-a-flex-flow/index.html).

## Set initial environment variables

There's a collection of environment variables used across the different code snippets. Let's set them now.

1. You created an **.env** file with the following environment variables via the [Build a custom chat app in Python using the prompt flow SDK quickstart](../quickstarts/get-started-code.md). If you haven't already, create an **.env** file in your **rag-tutorial** folder with the following environment variables:

    ```
    AZURE_OPENAI_ENDPOINT=endpoint_value
    AZURE_OPENAI_DEPLOYMENT_NAME=chat_model_deployment_name
    AZURE_OPENAI_API_VERSION=api_version
    ```

1. Copy the **.env** file into your **rag-tutorial** folder. 
1. In the **.env** file enter more environment variables for the copilot application:
    - **AZURE_SUBSCRIPTION_ID**: Your Azure subscription ID
    - **AZURE_RESOURCE_GROUP**: Your Azure resource group
    - **AZUREAI_PROJECT_NAME**: Your Azure AI Studio project name
    - **AZURE_OPENAI_CONNECTION_NAME**: Use the same **AIServices** or **Azure OpenAI** connection that you used [to deploy the chat model](../quickstarts/get-started-playground.md#deploy-a-chat-model). 

You can find the subscription ID, resource group name, and project name from your project view in AI Studio.
1. In [AI Studio](https://ai.azure.com), go to your project and select **Settings** from the left pane.
1. In the **Project details** section, you can find the **Subscription ID** and **Resource group**.
1. In the **Project settings** section, you can find the **Project name**.

By now, you should have the following environment variables in your *.env* file:

```env
AZURE_OPENAI_ENDPOINT=endpoint_value
AZURE_OPENAI_DEPLOYMENT_NAME=chat_model_deployment_name
AZURE_OPENAI_API_VERSION=api_version
AZURE_SUBSCRIPTION_ID=<your subscription id>
AZURE_RESOURCE_GROUP=<your resource group>
AZUREAI_PROJECT_NAME=<your project name>
AZURE_OPENAI_CONNECTION_NAME=<your AIServices or Azure OpenAI connection name>
```

## Deploy an embedding model

For the [retrieval augmented generation (RAG)](../concepts/retrieval-augmented-generation.md) capability, we need to be able to embed the search query to search the Azure AI Search index we create. 

1. Deploy an Azure OpenAI embedding model. Follow the [deploy Azure OpenAI models guide](../how-to/deploy-models-openai.md) and deploy the **text-embedding-ada-002** model. Use the same **AIServices** or **Azure OpenAI** connection that you used [to deploy the chat model](../quickstarts/get-started-playground.md#deploy-a-chat-model). 
2. Add embedding model environment variables in your *.env* file. For the *AZURE_OPENAI_EMBEDDING_DEPLOYMENT* value, enter the name of the embedding model that you deployed. 

    ```env
    AZURE_OPENAI_EMBEDDING_DEPLOYMENT=embedding_model_deployment_name
    ```

For more information about the embedding model, see the [Azure OpenAI Service embeddings documentation](../../ai-services/openai/how-to/embeddings.md).

## Create an Azure AI Search index

The goal with this RAG-based application is to ground the model responses in your custom data. You use an Azure AI Search index that stores vectorized data from the embeddings model. The search index is used to retrieve relevant documents based on the user's question.

You need an Azure AI Search service and connection in order to create a search index.

> [!NOTE]
> Creating an [Azure AI Search service](../../search/index.yml) and subsequent search indexes has associated costs. You can see details about pricing and pricing tiers for the Azure AI Search service on the creation page, to confirm cost before creating the resource.

### Create an Azure AI Search service

If you already have an Azure AI Search service in the same location as your project, you can skip to the [next section](#create-an-azure-ai-search-connection).

Otherwise, you can create an Azure AI Search service using the [Azure portal](https://portal.azure.com) or the Azure CLI (which you installed previously for the [quickstart](../quickstarts/get-started-code.md)).

> [!IMPORTANT]
> Use the same location as your project for the Azure AI Search service. Find your project's location in the top-right project picker of the Azure AI Studio in the project view.

## [Portal](#tab/azure-portal)

1. Go to the [Azure portal](https://portal.azure.com).
1. [Create an Azure AI Search service](https://portal.azure.com/#create/Microsoft.Search) in the Azure portal.
1. Select your resource group and instance details. You can see details about pricing and pricing tiers on this page.
1. Continue through the wizard and select **Review + assign** to create the resource.
1. Confirm the details of your Azure AI Search service, including estimated cost.

## [Azure CLI](#tab/cli)

1. Open a terminal on your local machine.
1. Type `az` and then enter to verify that the Azure CLI tool is installed. If it's installed, a help menu with `az` commands appears. If you get an error, make sure you followed the [steps for installing the Azure CLI in the quickstart](../quickstarts/get-started-code.md#install-the-azure-cli-and-sign-in).
1. Follow the steps to create an Azure AI Search service using the [`az search service create`](../../search/search-manage-azure-cli.md#create-or-delete-a-service) command.

---

### Create an Azure AI Search connection

If you already have an Azure AI Search connection in your project, you can skip to [configure access for the Azure AI Search service](#configure-access-for-the-azure-ai-search-service). Only use an existing connection if it's in the same location as your project.

In the Azure AI Studio, check for an Azure AI Search connected resource.

1. In [AI Studio](https://ai.azure.com), go to your project and select **Settings** from the left pane.
1. In the **Connected resources** section, look to see if you have a connection of type Azure AI Search.
1. If you have an Azure AI Search connection, verify that it is in the same location as your project. If so, you can skip ahead to [configure access for the Azure AI Search service](#configure-access-for-the-azure-ai-search-service).
1. Otherwise, select **New connection** and then **Azure AI Search**.
1. Find your Azure AI Search service in the options and select **Add connection**.
1. Continue through the wizard to create the connection. For more information about adding connections, see [this how-to guide](../how-to/connections-add.md#create-a-new-connection).

### Configure access for the Azure AI Search service

We recommend using [Microsoft Entra ID](/entra/fundamentals/whatis) instead of using API keys. In order to use this authentication, you need to set the right access controls and assign the right roles for your Azure AI Search service. 

> [!WARNING]
> You can use role-based access control locally because you run `az login` later in this tutorial. But when you deploy your app in [part 2 of the tutorial](./copilot-sdk-evaluate-deploy.md), the deployment is authenticated using API keys from your Azure AI Search service. Support for Microsoft Entra ID authentication of the deployment is coming soon.

To enable role-based access control for your Azure AI Search service, follow these steps:

1. On your Azure AI Search service in the [Azure portal](https://portal.azure.com), select **Settings > Keys** from the left pane.
1. Select **Both** to ensure that API keys and role-based access control are both enabled for your Azure AI Search service. 

    :::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/search-access-control.png" alt-text="Screenshot shows API Access control setting.":::

You or your administrator needs to grant your user identity the **Search Index Data Contributor** and **Search Service Contributor** roles on your Azure AI Search service. These roles enable you to call the Azure AI Search service using your user identity.

> [!NOTE]
> These steps are similar to how you assigned a role for your user identity to use the Azure OpenAI Service in the [quickstart](../quickstarts/get-started-code.md).

In the Azure portal, follow these steps to assign the **Search Index Data Contributor** role to your Azure AI Search service:

1. Select your Azure AI Search service in the [Azure portal](https://portal.azure.com).
1. From the left page in the Azure portal, select **Access control (IAM)** > **+ Add** > **Add role assignment**.
1. Search for the **Search Index Data Contributor** role and then select it. Then select **Next**.
1. Select **User, group, or service principal**. Then select **Select members**.
1. In the **Select members** pane that opens, search for the name of the user that you want to add the role assignment for. Select the user and then select **Select**.
1. Continue through the wizard and select **Review + assign** to add the role assignment. 

Repeat the previous steps to add the **Search Service Contributor** role.

> [!IMPORTANT]
> After you assign these roles, run `az login` in your console to ensure the changes propagate in your development environment. This also ensures that you can use your user identity locally to authenticate with the Azure AI Search service.

### Set search environment variables

You need to set environment variables for the Azure AI Search service and connection in your **.env** file.

1. In [AI Studio](https://ai.azure.com), go to your project and select **Settings** from the left pane.
1. In the **Connected resources** section, select the link for the Azure AI Search service that you created previously.
1. Copy the **Target** URL for `<your Azure Search endpoint>`.
1. Copy the name at the top for `<your Azure Search connection name>`. 

    :::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/search-settings.png" alt-text="Screenshot shows endpoint and connection names.":::

1. Add these environment variables to your **.env** file:

    ```env
    AZURE_SEARCH_ENDPOINT=<your Azure Search endpoint>
    AZURE_SEARCH_CONNECTION_NAME=<your Azure Search connection name>
    ```

### Create the search index

If you don't have an Azure AI Search index already created, we walk through how to create one. If you already have an index to use, you can skip to the [set the search environment variables](#set-search-environment-variables) section. The search index is created on the Azure AI Search service that was either created or referenced in the previous step.

1. Use your own data or [download the example Contoso Trek retail product data in a ZIP file](https://github.com/Azure-Samples/rag-data-openai-python-promptflow/raw/main/tutorial/data.zip) to your local machine. Unzip the file into your **rag-tutorial** folder. This data is a collection of markdown files that represent product information. The data is structured in a way that is easy to ingest into a search index. You build a search index from this data.

1. The prompt flow RAG package allows you to ingest the markdown files, locally create a search index, and register it in the cloud project. Install the prompt flow RAG package:

    ```bash
    pip install promptflow-rag
    ```

1. Upgrade the *azure-ai-ml* package to the latest version. Run the following command in your terminal:

    ```bash
    pip install azure-ai-ml -U
    ```

1. Create the **build_index.py** file in your **rag-tutorial** folder. 
1. Copy and paste the following code into your **build_index.py** file.

    :::code language="python" source="~/rag-data-openai-python-promptflow-main/tutorial/build_index.py":::

    - Set the `index_name` variable to the name of the index you want. 
    - As needed, you can update the `path_to_data` variable to the path where your data files are stored.

    > [!IMPORTANT]
    > By default the code sample expects the application code structure as described [previously in this tutorial](#application-code-structure). The `data` folder should be at the same level as your **build_index.py** and the downloaded `product-info` folder with md files within it.

1. From your console, run the code to build your index locally and register it to the cloud project:

    ```bash
    python build_index.py
    ```

1. Once the script is run, you can view your newly created index in the **Indexes** page of your Azure AI Studio project. For more information, see [How to build and consume vector indexes in Azure AI Studio](../how-to/index-add.md).

1. If you run the script again with the same index name, it creates a new version of the same index.

### Set the search index environment variable

Once you have the index name you want to use (either by creating a new one, or referencing an existing one), add it to your **.env** file, like this:

```env
AZUREAI_SEARCH_INDEX_NAME=<index-name>
```

## Develop custom RAG code

Next you create custom code to add retrieval augmented generation (RAG) capabilities to a basic chat application. In the quickstart, you created **chat.py** and **chat.prompty** files. Here you expand on that code to include RAG capabilities.

The copilot with RAG implements the following general logic:

1. Generate a search query based on user query intent and any chat history
1. Use an embedding model to embed the query
1. Retrieve relevant documents from the search index, given the query
1. Pass the relevant context to the Azure OpenAI chat completion model
1. Return the response from the Azure OpenAI model

### The copilot implementation logic

The copilot implementation logic is in the **copilot.py** file. This file contains the core logic for the RAG-based copilot.

1. Create a folder named **copilot_flow** in the **rag-tutorial** folder. 
1. Then create a file called **copilot.py** in the **copilot_flow** folder.
1. Add the following code to the **copilot.py** file:

    :::code language="python" source="~/rag-data-openai-python-promptflow-main/tutorial/copilot_flow/copilot.py":::

The **copilot.py** file contains two key functions: `get_documents()` and `get_chat_response()`.

Notice these two functions have the `@trace` decorator, which allows you to see the prompt flow tracing logs of each function call inputs and outputs. `@trace` is an alternative and extended approach to the way the [quickstart](../quickstarts/get-started-code.md) showed tracing capabilities.

The `get_documents()` function is the core of the RAG logic.
1. Takes in the search query and number of documents to retrieve.
1. Embeds the search query using an embedding model.
1. Queries the Azure Search index to retrieve the documents relevant to the query.
1. Returns the context of the documents.
    
The `get_chat_response()` function builds from the previous logic in your **chat.py** file:
1. Takes in the `chat_input` and any `chat_history`.
1. Constructs the search query based on `chat_input` intent and `chat_history`.
1. Calls `get_documents()` to retrieve the relevant docs.
1. Calls the chat completion model with context to get a grounded response to the query.
1. Returns the reply and context. We set a typed dictionary as the return object for our `get_chat_response()` function. You can choose how your code returns the response to best fit your use case.

The `get_chat_response()` function uses two `Prompty` files to make the necessary Large Language Model (LLM) calls, which we cover next.

### Prompt template for chat

The **chat.prompty** file is simple, and similar to the **chat.prompty** in the [quickstart](../quickstarts/get-started-code.md). The system prompt is updated to reflect our product and the prompt templates includes document context.

1. Add the file **chat.prompty** in the **copilot_flow** directory. The file represents the call to the chat completion model, with the system prompt, chat history, and document context provided.
1. Add this code to the **chat.prompty** file:

    :::code language="yaml" source="~/rag-data-openai-python-promptflow-main/tutorial/copilot_flow/chat.prompty":::

### Prompt template for chat history

Because we're implementing a RAG-based application, there's some extra logic required for retrieving relevant documents not only for the current user query, but also taking into account chat history. Without this extra logic, your LLM call would account for chat history. But you wouldn't retrieve the right documents for that context, so you wouldn't get the expected response.

For instance, if the user asks the question "is it waterproof?", we need the system to look at the chat history to determine what the word "it" refers to, and include that context into the search query to embed. This way, we retrieve the right documents for "it" (perhaps the Alpine Explorer Tent) and its "cost."

Instead of passing only the user's query to be embedded, we need to generate a new search query that takes into account any chat history. We use another `Prompty` (which is another LLM call) with specific prompting to interpret the user query **intent** given chat history, and construct a search query that has the necessary context.

1. Create the file **queryIntent.prompty** in the **copilot_flow** folder. 
1. Enter this code for specific details about the prompt format and few-shot examples.

    :::code language="yaml" source="~/rag-data-openai-python-promptflow-main/tutorial/copilot_flow/queryIntent.prompty":::

The simple system message in our **queryIntent.prompty** file achieves the minimum required for the RAG solution to work with chat history.

### Configure required packages

Create the file **requirements.txt** in the **copilot_flow** folder. Add this content:

:::code language="txt" source="~/rag-data-openai-python-promptflow-main/tutorial/copilot_flow/requirements.txt":::

These are the packages required for the flow to run locally and in a deployed environment.

### Use flex flow

As previously mentioned, this implementation uses prompt flow's flex flow, which is the code-first approach to implementing flows. You specify an entry function (which is defined in **copilot.py**). Learn more at [Develop a flex flow](https://microsoft.github.io/promptflow/how-to-guides/develop-a-flex-flow/index.html).

This yaml specifies the entry function, which is the `get_chat_response` function defined in `copilot.py`. It also specifies the requirements the flow needs to run.

Create the file **flow.flex.yaml** in the **copilot_flow** folder. Add this content:

:::code language="yaml" source="~/rag-data-openai-python-promptflow-main/tutorial/copilot_flow/flow.flex.yaml":::

## Use prompt flow to test your copilot

Use prompt flow's testing capability to see how your copilot performs as expected on sample inputs. By using your **flow.flex.yaml** file, you can use prompt flow to test with your specified inputs.

Run the flow using this prompt flow command:

```bash
pf flow test --flow ./copilot_flow --inputs chat_input="how much do the Trailwalker shoes cost?"
```

Alternatively, you can run the flow interactively with the `--ui` flag. 

```bash
pf flow test --flow ./copilot_flow --ui
```

When you use `--ui`, the interactive sample chat experience opens a window in your local browser. 
- The first time you run with the `--ui` flag, you need to manually select your chat inputs and outputs from the options. The first time you create this session, select the **Chat input/output field config** settings, then start chatting. 
- The next time you run with the `--ui` flag, the session will remember your settings.

:::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/flow-test-ui.png" alt-text="Screenshot that shows the sample chat experience." lightbox="../media/tutorials/develop-rag-copilot-sdk/flow-test-ui.png":::

When you're finished with your interactive session, enter **Ctrl + C** in the terminal window to stop the server.

### Test with chat history

In general, prompt flow and `Prompty` support chat history. If you test with the `--ui` flag in the locally served front end, prompt flow manages your chat history. If you test without the `--ui`, you can specify an inputs file that includes chat history.

Because our application implements RAG, we had to add [extra logic to handle chat history](#prompt-template-for-chat-history) in the **queryIntent.prompty** file.

To test with chat history, create a file called **input_with_chat_history.json** in the **copilot_flow** folder, and paste in this content:

:::code language="json" source="~/rag-data-openai-python-promptflow-main/tutorial/copilot_flow/input_with_chat_history.json":::

To test with this file, run:

```bash
pf flow test --flow ./copilot_flow --inputs ./copilot_flow/input_with_chat_history.json
```

The expected output is something like: "The Alpine Explorer Tent is priced at $350."

This system is able to interpret the intent of the query "how much does it cost?" to know that "it" refers to the Alpine Explorer Tent, which was the latest context in the chat history. Then the system constructs a search query for the price of the Alpine Explorer Tent to retrieve the relevant documents for the Alpine Explorer Tent's cost, and we get the response.

If you navigate to the trace from this flow run, you see this in action. The local traces link shows in the console output before the result of the flow test run.

:::image type="content" source="../media/tutorials/develop-rag-copilot-sdk/trace-for-chat-history.png" alt-text="Screenshot shows the console output for the pf flow." lightbox="../media/tutorials/develop-rag-copilot-sdk/trace-for-chat-history.png" :::

## Clean up resources

To avoid incurring unnecessary Azure costs, you should delete the resources you created in this tutorial if they're no longer needed. To manage resources, you can use the [Azure portal](https://portal.azure.com?azure-portal=true).

But don't delete them yet, if you want to deploy your copilot to Azure in [the next part of this tutorial series](copilot-sdk-evaluate-deploy.md).

## Next step

> [!div class="nextstepaction"]
> [Evaluate and deploy your copilot to Azure](copilot-sdk-evaluate-deploy.md)
