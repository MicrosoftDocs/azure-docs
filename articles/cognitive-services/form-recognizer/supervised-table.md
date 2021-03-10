---
title: "How to label and train Custom Form models using table tags - Form Recognizer"
titleSuffix: Azure Cognitive Services
description: Learn how to used supervised table labeling effectively.
author: PatrickFarley
manager: nitinme

ms.service: cognitive-services
ms.subservice: forms-recognizer
ms.topic: conceptual
ms.date: 03/15/2021
ms.author: pafarley
#Customer intent: As a user of the Form Recognizer custom model service, I want to ensure I'm training my model in the best way.
---

# How to label and train Custom Form models using table tags

In training a Custom Form model, some scenarios require more complex labeling than simple key-value pairs, such as when trying to extract information with hierarchical structure, line items or table that were not detected and extracted automatically by the service. In such cases, you can use table tags to train your Custom Form model.

## When should I use table tags?

Here are some examples of when using table tags would be appropriate.

- There is data you wish to extract that are presented as tables in your forms, and the structure of the table is meaningful. For instance, each row of the table represents one item and each column of the row represents a specific feature of that item, and you wish to extract certain features of each item. In this case, you could use a table tag where columns represent the features you want to extract, and each row of the table is populated with information about an item.
- There is data you wish to extract that is not necessarily presented in your forms, but semantically the data could fit in a 2-D grid. For instance, your form has a list of people, and for each person, a first name, a last name, and an email address are listed; you would like to extract this information. In this case, you could use a table tag with first name, last name, and email address as columns, and each row is populated with information about a person from your list

Note that, tagged or not, Form Recognizer automatically extracts tables in your docuements and every table found in your document will be extracted. Therefore, not every table from your form has to be labeled with a table tag, and your table tag does not have to replicate the structure of a table found in your form. Tables extracted automatically by Form Recognizer will be outputed in the pageResults section of the JSON output.

## Create a table tag in FOTT
<!-- markdownlint-disable MD004 -->
* First, determine whether you want a dynamic table tag or a fixed-size table tag. Will the number of rows vary from document to document? If so, use a dynamic table. If not, use a fixed size table.
* If your table tag is dynamic, define the column names and the data type and format for each column.
* If your table is fixed size, define column/row names and the data type and format for each.
:::image type="content" source="./media/table-tag-configure.png" alt-text="Configure a table tag":::

## Label your data into a table tag

* If your project has a table tag, you can click on the table tag to open the labeling panel and populate the tag just like you would label key-value fields.
:::image type="content" source="media/table-labeling.png" alt-text="Label with table tags":::

## Next steps

Now that you've learned how to label and train using table tags, follow a quickstart to train a custom Form Recognizer model and start using it on your forms.

* [Train with labels using the sample labeling tool](./quickstarts/label-tool.md)

## See also

* [What is Form Recognizer?](./overview.md)
