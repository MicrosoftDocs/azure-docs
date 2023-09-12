---
title: "Train your custom template model with the sample-labeling tool and table tags"
titleSuffix: Azure AI services
description: Learn how to effectively use supervised table tag labeling.
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
#Customer intent: As a user of the Document Intelligence custom model service, I want to ensure I'm training my model in the best way.
monikerRange: 'doc-intel-2.1.0'
---


# Train models with the sample-labeling tool

**This article applies to:** ![Document Intelligence v2.1 checkmark](media/yes-icon.png) **Document Intelligence v2.1**.

>[!TIP]
>
> * For an enhanced experience and advanced model quality, try the [Document Intelligence v3.0 Studio](https://formrecognizer.appliedai.azure.com/studio).
> * The v3.0 Studio supports any model trained with v2.1 labeled data.
> * You can refer to the [API migration guide](v3-1-migration-guide.md) for detailed information about migrating from v2.1 to v3.0.
> * *See* our [**REST API**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) or [**C#**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**Java**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), [**JavaScript**](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true), or [Python](quickstarts/get-started-sdks-rest-api.md?view=doc-intel-3.0.0&preserve-view=true) SDK quickstarts to get started with version v3.0.

In this article, you'll learn how to train your custom template model with table tags (labels). Some scenarios require more complex labeling than simply aligning key-value pairs. Such scenarios include extracting information from forms with complex hierarchical structures or encountering items that not automatically detected and extracted by the service. In these cases, you can use table tags to train your custom template model.

## When should I use table tags?

Here are some examples of when using table tags would be appropriate:

- There's data that you wish to extract presented as tables in your forms, and the structure of the tables are meaningful. For instance, each row of the table represents one item and each column of the row represents a specific feature of that item. In this case, you could use a table tag where a column represents features and a row represents information about each feature.
- There's data you wish to extract that isn't presented in specific form fields but semantically, the data could fit in a two-dimensional grid. For instance, your form has a list of people, and includes, a first name, a last name, and an email address. You would like to extract this information. In this case, you could use a table tag with first name, last name, and email address as columns and each row is populated with information about a person from your list.

> [!NOTE]
> Document Intelligence automatically finds and extracts all tables in your documents whether the tables are tagged or not. Therefore, you don't have to label every table from your form with a table tag and your table tags don't have to replicate the structure of very table found in your form. Tables extracted automatically by Document Intelligence will be included in the pageResults section of the JSON output.

## Create a table tag with the Document Intelligence Sample Labeling tool
<!-- markdownlint-disable MD004 -->
* Determine whether you want a **dynamic** or **fixed-size** table tag. If the number of rows vary from document to document use a dynamic table tag. If the number of rows is consistent across your documents, use a fixed-size table tag.
* If your table tag is dynamic, define the column names and the data type and format for each column.
* If your table is fixed-size, define the column name, row name, data type, and format for each tag.
:::image type="content" source="./media/table-tag-configure.png" alt-text="Configure a table tag":::

## Label your table tag data

* If your project has a table tag, you can open the labeling panel, and populate the tag as you would label key-value fields.
:::image type="content" source="media/table-labeling.png" alt-text="Label with table tags":::

## Next steps

Follow our quickstart to train and use your  custom Document Intelligence model:

> [!div class="nextstepaction"]
> [Train with labels using the Sample Labeling tool](label-tool.md)

## See also

* [Train a custom model with the Sample Labeling tool](label-tool.md)
>
