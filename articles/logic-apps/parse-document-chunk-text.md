---
title: Parse document or chunk text
description: Parse a document or chunk text for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.collection: ce-skilling-ai-copilot
ms.topic: how-to
ms.date: 07/26/2024
# Customer intent: As a developer using Azure Logic Apps, I want to parse a document or chunk text that I want to use with Azure AI operations for my Standard workflow in Azure Logic Apps.
---

# Parse or chunk content for Standard workflows in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Sometimes you have to convert content into token form or break down a large document into smaller pieces before you can use this content with some actions. For example, actions such as **Azure AI Search** or **Azure OpenAI** expect tokenized input and can handle only a limited number of tokens, which are words or chunks of characters.

For these scenarios, use the **Data Operations** actions named **Parse a document** and **Chunk text** in your Standard logic app workflow. These actions respectively convert content, such as a PDF document, CSV file, Excel file, and so on, into a tokenized string and then split the string into pieces, based on the number of tokens or characters. You can then reference and use these outputs with subsequent actions in your workflow.

> [!TIP]
>
> To learn more, you can ask Azure Copilot these questions:
>
> - *What is a token in AI?*
> - *What is tokenized input?*
> - *What is parsing in AI?*
> - *What is a tokenized string?*
> - *What is chunking in AI?*
>
> To find Azure Copilot, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

This how-to guide shows how to add and set up these operations in your workflow.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Standard logic app workflow with an existing trigger because the **Parse a document** and **Chunk text** operations are available only as actions. Make sure that the action that retrieves the content that you want to parse or chunk precedes these data operations.

## Parse a document

The **Parse a document** action converts content, such as a PDF document, CSV file, Excel file, and so on, into a tokenized string. For this example, suppose your workflow starts with the **Request** trigger named **When a HTTP request is received**. This trigger waits to receive an HTTP request sent from another component, such as an Azure function, another logic app workflow, and so on. The HTTP request includes the URL for a new uploaded document that is available for the workflow to retrieve and parse. An **HTTP** action immediately follows the trigger, and sends an HTTP reqeust to the document's URL, and returns with the document content from its storage location.

If you use other content sources, such as Azure Blob Storage, SharePoint, OneDrive, File System, FTP, and so on, you can check whether triggers are available for these sources. You can also check whether actions are available to retrieve the content for these sources. For more information, see [Built-in operations](/azure/logic-apps/connectors/built-in/reference/) and [Managed connectors](/connectors/connector-reference/connector-reference-logicapps-connectors).

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. Under the existing trigger and actions, [follow these general steps to add the **Data Operations** action named **Parse a document**](create-workflow-with-trigger-or-action.md#add-action) to your workflow.

1. On the designer, select the **Parse a document** action.

1. After the action information pane opens, on the **Parameters** tab, in the **Document Content** property, specify the content to parse by following these steps:

   1. Select inside the **Document Content** box.

      The options for the dynamic content list (lightning icon) and the expression editor (function icon) appear.

      - To choose the output from a preceding action, select the dynamic content list.

      - To create an expression that manipulates output from a preceding action, select the expression editor.

      This example continues by selecting the lightning icon for the dynamic content list.

   1. After the dynamic content list opens, select the output that you want from a preceding operation.

      In this example, the **Parse a document** action references the **Body** output from the **HTTP** action.

      :::image type="content" source="media/parse-document-chunk-text/select-http-body.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, Request trigger, HTTP action, and action named Parse a document with opened dynamic content list and selected Body output from HTTP action." lightbox="media/parse-document-chunk-text/select-http-body.png":::

      The **Body** output now appears in the **Document Content** box:

      :::image type="content" source="media/parse-document-chunk-text/parse-document.png" alt-text="Screenshot shows sample workflow with Body output in the action named Parse a document." lightbox="media/parse-document-chunk-text/parse-document.png":::

1. Under the **Parse a document** action, add the actions that you want to work with the tokenized output string, for example, **Chunk text**, which this guide describes later.

## Parse a document - Reference

#### Parameters

| Name | Value | Data type | Description | Limit |
|------|-------|-----------|-------------|-------|
| **Document Content** | <*content-to-parse*> | Any | The content to parse. || 

#### Outputs

| Name | Data type | Description |
|------|-----------|-------------|
| **Parsed result text** | String ||

## Chunk text

The **Chunk text** action splits content into smaller pieces for subsequent actions to more easily use in the current workflow. The following steps build on the example from the **Parse a document** section and splits token string output for use with Azure AI operations that expect tokenized, small content chunks.

> [!NOTE]
>
> Preceding actions that use chunking don't affect the **Chunk text** action, 
> nor does the **Chunk text** action affect subsequent actions that use chunking.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. Under the **Parse a document** action, [follow these general steps to add the **Data Operations** action named **Chunk text**](create-workflow-with-trigger-or-action.md#add-action).

1. On the designer, select the **Chunk text** action.

1. After the action information pane opens, on the **Parameters** tab, for the **Chunking Strategy** property, select either **FixedLength** or **TokenSize** as the chunking method.

   | Strategy | Description |
   |----------|-------------|
   | **FixedLength** | Split the specified content, based on the number of characters. |
   | **TokenSize** | Split the specified content, based on the number of tokens. |

1. After you select the strategy, select inside the **Text** box to specify the content for chunking.

   The options for the dynamic content list (lightning icon) and the expression editor (function icon) appear.

   - To choose the output from a preceding action, select the dynamic content list.

   - To create an expression that manipulates output from a preceding action, select the expression editor.

   This example continues by selecting the lightning icon for the dynamic content list.

   1. After the dynamic content list opens, select the output that you want from a preceding operation.

      In this example, the **Chunk text** action references the **Parsed result text** output from the **Parse a document** action.

      :::image type="content" source="media/parse-document-chunk-text/select-parsed-result-text.png" alt-text="Screenshot shows Azure portal, Standard workflow designer, Request trigger, HTTP action, action named Parse a document, and action named Chunk text with opened dynamic content list and selected output from Parse a document action." lightbox="media/parse-document-chunk-text/select-parsed-result-text.png":::

      The **Parsed result action** output now appears in the **Text** box:

      :::image type="content" source="media/parse-document-chunk-text/chunk-text.png" alt-text="Screenshot shows sample workflow with selected parsed result text output in the action named Chunk text." lightbox="media/parse-document-chunk-text/chunk-text.png":::

1. Complete the setup for the **Chunk text** action, based on your selected strategy and scenario. For more information, see [Chunk text - Reference](#chunk-text---reference).

Now, when you add other actions that expect and use tokenized input, such as the Azure AI actions, the input content is formatted for easier consumption.

## Chunk text - Reference

#### Parameters

| Name | Value | Data type | Description | Limit |
|------|-------|-----------|-------------|-------|
| **Chunking Strategy** | **FixedLength** or **TokenSize** | String | **FixedLength**: Split the content, based on the number of characters <br><br>**TokenSize**: Split the content, based on the number of tokens. <br><br>Default: **FixedLength** ||
| **Text** | <*content-to-chunk*> | Any | The content to chunk. ||

For **Chunking Strategy** set to **FixedLength**:

| Name | Value | Data type | Description | Limit |
|------|-------|-----------|-------------|-------|
| **MaxPageLength** | <*max-char-per-chunk*> | Integer | The maximum number of characters per content chunk. <br><br>Default: **5000** ||
| **PageOverlapLength** | <*number-of-overlapping-characters*> | Integer | The number of characters from the end of the previous chunk to include in the next chunk. This setting helps you avoid losing important information when splitting content into chunks and preserves continuity and context across chunks. <br><br>Default: **0** - No overlapping characters exist. ||
| **Language** | <*language*> | String | The [language](/azure/ai-services/language-service/language-detection/language-support) to use for the resulting chunks. <br><br>Default: **en-us**. | Not applicable |

For **Chunking Strategy** set to **TokenSize**:

| Name | Value | Data type | Description | Limit |
|------|-------|-----------|-------------|-------|
| **TokenSize** | <*max-tokens-per-chunk*> | Integer | The maximum number of tokens per content chunk. <br><br>Default: None | |
| **Encoding model** | <*encoding-method*> | String | The encoding method to use. <br><br>Default: None | Not applicable |

> [!TIP]
>
> To learn more, you can ask Azure Copilot these questions:
>
> - *What is PageOverlapLength in chunking?*
> - *What is encoding in Azure AI?*
>
> To find Azure Copilot, on the [Azure portal](https://portal.azure.com) toolbar, select **Copilot**.

#### Outputs



## Example workflow 

The following example includes other actions that create a complete workflow pattern to ingest data from any source:

:::image type="content" source="media/parse-document-chunk-text/complete-example.png" alt-text="Screenshot shows complete sample workflow." lightbox="media/parse-document-chunk-text/complete-example.png":::

| Step | Task | Underlying operation | Description |
|------|------|----------------------|-------------|
| 1 | Wait or check for new content. | **When an HTTP request is received** | A trigger that either polls or waits for new data to arrive, either based on a scheduled recurrence or in response to specific events respectively. Such an event might be a new file that's uploaded to a specific storage system, such as Azure Blob Storage, SharePoint, OneDrive, File System, FTP, and so on. <br><br>In this example, the **Request** trigger operation waits for an HTTP or HTTPS request sent from another endpoint. The request includes the URL for a new uploaded document. |
| 2 | Get the content. | **HTTP** | An **HTTP** action that retrieves the uploaded document using the file URL from the trigger output. |
| 3 | Compose document details. | **Compose** | A **Data Operations** action that concatenates various items. <br><br>This example concatenates key-value information about the document. |
| 4 | Create token string. | **Parse a document** | A **Data Operations** action that produces a tokenized string using the output from the **Compose** action. |
| 5 | Create content chunks. | **Chunk text** | A **Data Operations** action that splits the token string into pieces, based on either the number of characters or tokens per content chunk. | 
| 6 | Convert tokenized and chunked text to JSON. | **Parse JSON** | A **Data Operations** action that converts the chunked output into a JSON array. |
| 7 | Select JSON array items. | **Select** | A **Data Operations** action that selects multiple items from the JSON array. |
| 8 | Generate the embeddings. | **Get multiple embeddings** | An **Azure OpenAI** action that creates embeddings for each JSON array item. |
| 9 | Select embeddings and other information. | **Select** | A **Data Operations** action that selects embeddings and other document information. | 
| 10 | Index the data. | **Index documents** | An **Azure AI Search** action that indexes the data based on each selected embedding. |

## Related content

[Integrate Azure AI services with Standard workflows in Azure Logic Apps](connectors/azure-ai.md)
[Chunking large documents for vector search](/azure/search/vector-search-how-to-chunk-documents)
