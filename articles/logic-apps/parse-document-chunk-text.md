---
title: Parse document or chunk text
description: Parse a document or chunk text to use with Azure AI operations for Standard workflows in Azure Logic Apps.
services: logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 07/26/2024
# Customer intent: As a developer using Azure Logic Apps, I want to parse a document or chunk text that I want to use with Azure AI operations for my Standard workflow in Azure Logic Apps.
---

# Parse or chunk content to use with Azure AI operations for Standard workflows in Azure Logic Apps (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!IMPORTANT]
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

To convert content, such as a PDF document, CSV file, or even an Excel file, into a format that you can more easily use with an Azure AI operation, such as **Azure AI Search** or **Azure OpenAI**, you can include the **Data Operations** actions named **Parse a document** and **Chunk text** in your Standard logic app workflow.

The following table describes these data operations:

| Data operation | Description |
|----------------|-------------|
| **Parse a document** | Convert the specified content into a string with tokens that represent outputs, which you can reference and use with subsequent actions in your workflow. |
| **Chunk text** | Split the specified content into pieces, based on the selected strategy: <br><br>- **FixedLength** - number of characters: Provide the maximum number of characters per chunk and the language to use. <br><br>- **TokenSize** - number of tokens: Provide the maximum number of tokens per chunk and the encoding model to use. |

> [!NOTE]
>
> Preceding actions that use chunking don't affect the **Chunk text** action, 
> nor does the **Chunk text** action affect subsequent actions that use chunking.

This how-to guide shows how to add and set up these operations in your workflow.

## Prerequisites

* An Azure account and subscription. If you don't have an Azure subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* A Standard logic app workflow with an existing trigger because the **Parse a document** and **Chunk text** operations are available only as actions. Make sure that the action that retrieves the content that you want to parse or chunk precedes these data operations.

## Parse a document

For this example, suppose your workflow starts with the **Request** trigger named **When a HTTP request is received**. This trigger waits to receive an HTTP request sent from another component, such as an Azure function or another logic app workflow. The HTTP request indicates that content is available for the workflow to retrieve and parse. An **HTTP** action immediately follows the trigger and gets the content from its storage location.

If you use other content sources, such as Azure Blob Storage, Office 365 Outlook, or other services, you can check whether they include appropriate triggers. You can also check for other actions that can retrieve content, such as Azure Blob Storage, File System, FTP, and so on.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. Under the existing trigger and actions, [follow these general steps to add the **Data Operations** action named **Parse a document**](create-workflow-with-trigger-or-action.md#add-action).

1. On the designer, select the **Parse a document** action. After the action information pane opens, on the **Parameters** tab, in the **Document Content** property, specify the content to parse by following these steps:

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

1. Under the **Parse a document** action, add the actions that you want to work with the tokenized output string, for example, **Chunk text**.

## Chunk text

This example builds on the preceding section by using the **Chunk text** operation to split the tokenized output string into pieces that subsequent actions in the workflow can more easily use.

1. In the [Azure portal](https://portal.azure.com), open your Standard logic app resource and workflow in the designer.

1. Under the **Parse a document** action, [follow these general steps to add the **Data Operations** action named **Chunk text**](create-workflow-with-trigger-or-action.md#add-action).

1. On the designer, select the **Chunk text** action. After the action information pane opens, on the **Parameters** tab, for the **Chunking Strategy** property, select the strategy to use for chunking and provide the corresponding property values:

   | Strategy | Description |
   |----------|-------------|
   | **FixedLength** | Split the specified content into pieces based on number of characters. <br><br>**Text**: The content to chunk. <br><br>**MaxPageLength**: The maximum number of characters per content chunk. <br><br>**PageOverlapLength** (optional): The number of characters to overlap in each chunk. The default value is **0**. <br><br>- **Language**: The language to use for the resulting chunks. |
   | **TokenSize** | Split the specified content into pieces based on number of tokens. <br><br>**Text**: The content to chunk. <br><br>- **TokenSize**: The maximum number of tokens per content chunk. <br><br>- **Encoding model**: The encoding model to use. |

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

1. Complete the setup for the **Chunk text** action, based on your selected strategy.

Now, when you add Azure AI operations, the content is formatted for easier consumption.

The following example includes other actions to create a complete workflow pattern to ingest data from any source:

:::image type="content" source="media/parse-document-chunk-text/complete-example.png" alt-text="Screenshot shows sample workflow with selected parsed result text output in the action named Chunk text." lightbox="media/parse-document-chunk-text/complete-example.png":::

| Step | Task | Underlying operation | Description |
|------|------|----------------------|-------------|
| 1 | Check for new data. | **When an HTTP request is received** | A trigger that either polls or waits for new data to arrive, either based on a scheduled recurrence or in response to specific events respectively. Such an event might be a new file that's uploaded to a specific storage system, such as SharePoint, OneDrive, or Azure Blob Storage. <br><br>In this example, the **Request** trigger operation waits for an HTTP or HTTPS request sent from another endpoint. The request includes the URL for a new uploaded document. |
| 2 | Get the data. | **HTTP** | An **HTTP** action that retrieves the uploaded document using the file URL from the trigger output. |
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
