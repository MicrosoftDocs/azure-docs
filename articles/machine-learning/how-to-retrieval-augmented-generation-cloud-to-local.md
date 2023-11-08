---
title: Retrieval Augmented Generation (RAG) cloud to local (preview)
titleSuffix: Azure Machine Learning
description: Learning how to transition your RAG created flows from cloud to local using the prompt flow VS Code extension.
services: machine-learning
ms.service: machine-learning
ms.subservice: core
ms.topic: conceptual
author: jiaochenlu
ms.author: chenlujiao
ms.reviewer: lagayhar
ms.date: 09/12/2023
ms.custom: prompt-flow

---

# RAG from cloud to local - bring your own data QnA (preview)

In this article, you'll learn how to transition your RAG created flows from cloud in your Azure Machine Learning workspace to local using the Prompt flow VS Code extension.

> [!IMPORTANT]
> Prompt flow and Retrieval Augmented Generation (RAG) is currently in public preview. This preview is provided without a service-level agreement, and are not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

1. Install prompt flow SDK:

   ``` bash
      pip install promptflow promptflow-tool
   ```

   To learn more, see [prompt flow local quick start](https://microsoft.github.io/promptflow/how-to-guides/quick-start.html#quick-start)

2. Install promptflow-vectordb SDK:

   ``` bash
      pip install promptflow-vectordb
   ```

3. Install the prompt flow extension in VS Code

    :::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/vs-code-extension.png" alt-text="Screenshot of the prompt flow VS Code extension in the marketplace." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/vs-code-extension.png":::

## Download your flow files to local

For example, there's already a flow "Bring Your Own Data QnA" in the workspace, which uses the **Vector index lookup** tool to search question from the indexed docs.

The index docs are stored in the workspace binding storage blog.

:::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/my-flow.png" alt-text="Screenshot of bring your own data QnA in the Azure Machine Learning studio." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/my-flow.png":::

Go to the flow authoring, select the **Download** icon in the file explorer. It downloads the flow zip package to local, such as "Bring Your Own Data Qna.zip" file, which contains the flow files.

:::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/flow-download.png" alt-text="Screenshot of the download icon and files to be downloaded in the Azure Machine Learning studio." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/flow-download.png":::

## Open the flow folder in VS Code

Unzip the "Bring Your Own Data Qna.zip" locally, and open the "Bring Your Own Data QnA" folder in VS Code desktop.

> [!TIP]
> If you don't depend on the prompt flow extension in VS Code, you can open the folder in any IDE you like.

## Create a local connection

To use the vector index lookup tool locally, you need to create the same connection to the vector index service as you did in the cloud.

:::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/my-cloud-connection.png" alt-text="Screenshot of embed the question in studio showing inputs." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/my-cloud-connection.png":::

Open the "flow.dag.yaml" file, search the "connections" section, you can find the connection configuration you used in your Azure Machine Learning workspace.
  
Create a local connection same as the cloud one.


If you have the **prompt flow extension** installed in VS Code desktop, you can create the connection in the extension UI.

Select the prompt flow extension icon to go to the prompt flow management central place. Select the **+** icon in the connection explorer, and select the connection type "AzureOpenAI".

:::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/vs-code-connection-create.png" alt-text="Screenshot of creating the connections in VS Code." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/vs-code-connection-create.png":::

### Create a connection with Azure CLI

If you prefer to use Azure CLI instead of the VS Code extension you can create a connection yaml file "AzureOpenAIConnection.yaml", then run the connection create CLI command in the terminal:

``` yaml
   $schema: https://azuremlschemas.azureedge.net/promptflow/latest/AzureOpenAIConnection.schema.json
   name: azure_open_ai_connection
   type: azure_open_ai  
   api_key: "<aoai-api-key>" #your key
   api_base: "aoai-api-endpoint"
   api_type: "azure"
   api_version: "2023-03-15-preview"
```

``` bash
   pf connection create -f AzureOpenAIConnection.yaml
```

> [!NOTE]
> The rest of this article details how to use the VS code extension to edit the files, you can follow this [quick start on how to edit your files with CLI instructions](https://microsoft.github.io/promptflow/how-to-guides/quick-start.html#quick-start).

## Check and modify the flow files

1. Open "flow.dag.yaml" and select "Visual editor"

   :::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/visual-editor.png" alt-text="Screenshot of the flow dag yaml file with the visual editor highlighted in VS Code." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/visual-editor.png":::

   > [!NOTE]
   > When legacy tools switching to code first mode, "not found" error may occur, refer to [Vector DB/Faiss Index/Vector Index Lookup tool](./prompt-flow/tools-reference/troubleshoot-guidance.md) rename reminder

2. Jump to the "embed_the_question" node, make sure the connection is the local connection you have created, and double check the deployment_name, which is the model you use here for the embedding.

   :::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/embed-question.png" alt-text="Screenshot of embed the question node in VS Code." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/embed-question.png":::

3. Jump to the "search_question_from_indexed_docs" node, which consumes the Vector Index Lookup Tool in this flow. Check the path of your indexed docs you specify. All public accessible path is supported, such as: `https://github.com/Azure/azureml-assets/tree/main/assets/promptflow/data/faiss-index-lookup/faiss_index_sample`.

   > [!NOTE]
   > If your indexed docs is the data asset in your workspace, the local consume of it need Azure authentication.
   >
   > Before run the flow, make sure you have `az login` and connect to the Azure Machine Learning workspace.
   >
   > To learn more, see [Connect to Azure Machine Learning workspace](./prompt-flow/how-to-integrate-with-llm-app-devops.md#connect-to-azure-machine-learning-workspace)

   :::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/search-blob.png" alt-text="Screenshot of search question from indexed docs node in VS Code showing the inputs." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/search-blob.png":::

   Then select on the **Edit** button located within the "query" input box. This will take you to the raw flow.dag.yaml file and locate to the definition of this node.

   Check the "tool" section within this node. Ensure that the value of the "tool" section is set to `promptflow_vectordb.tool.vector_index_lookup.VectorIndexLookup.search`. This tool package name of the VectorIndexLookup local version.

   :::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/search-tool.png" alt-text="Screenshot of the tool section of the node showing the value mentioned previously." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/search-tool.png":::

4. Jump to the "generate_prompt_context" node, check the package name of the vector tool in this python node is `promptflow_vectordb`.

    :::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/generate-node.png" alt-text="Screenshot of the generate prompt content node in VS Code highlighting the package name." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/generate-node.png":::

5. Jump to the "answer_the_question_with_context" node, check the connection and deployment_name as well.

   :::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/answer-connection.png" alt-text="Screenshot of answer the question with context node with the connection highlighted." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/answer-connection.png":::

## Test and run the flow

Scroll up to the top of the flow, fill in the "Inputs" value of this single run for testing, for example "How to use SDK V2?", then run the flows. Then select the **Run** button in the top right corner. This will trigger a single run of the flow.

:::image type="content" source="./media/how-to-retrieval-augmented-generation-cloud-to-local/flow-run.png" alt-text="Screenshot of the flow dag YAML file showing inputs and highlighting value of the question input and run button." lightbox = "./media/how-to-retrieval-augmented-generation-cloud-to-local/flow-run.png":::

For batch run and evaluation, you can refer to [Submit flow run to Azure Machine Learning workspace](./prompt-flow/how-to-integrate-with-llm-app-devops.md)

## Next steps

- [Submit runs to cloud for large scale testing and ops integration](./prompt-flow/how-to-integrate-with-llm-app-devops.md#submitting-runs-to-the-cloud-from-local-repository)
