---
title: How to manage term templates for business glossary
description: Learn how to manage term templates for business glossary in a Microsoft Purview Data Catalog.
author: nayenama
ms.author: nayenama
ms.service: purview
ms.subservice: purview-data-catalog
ms.topic: conceptual
ms.date: 2/27/2023
---
# How to manage term templates for business glossary

Microsoft Purview allows you to create a glossary of terms that are important for enriching your data. Each new term added to your Microsoft Purview Data Catalog Glossary is based on a term template that determines the fields for the term. This article describes how to create a term template and custom attributes that can be associated to glossary terms.

## Manage term templates and custom attributes

Using term templates, you can create custom attributes, group them together and apply a template while creating terms. Once a term is created, the template associated with the term can't be changed.

1. On the **Glossary terms** page, select **Manage term templates**.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/manage-term-templates.png" alt-text="Screenshot of Glossary terms > Manage term templates button.":::

1. The page shows both system and custom attributes. Select the **Custom** tab to create or edit term templates.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/manage-term-custom.png" alt-text="Screenshot of Glossary terms > Manage term templates page.":::

1. Select **+ New term template** and enter a template name and description.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/new-term-template.png" alt-text="Screenshot of Glossary terms > Manage term templates > New term templates":::

1. Select **+ New attribute** to create a new custom attribute for the term template. Enter an attribute name, description. The custom attribute name must be unique within a term template but can be same name can be reused across templates.

   Choose the field type from the list of options **Text**, **Single choice**, **Multi choice**, or  **Date**. You can also provide a default value string for Text field types.  The attribute can also be marked as **required**.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/new-attribute.png" alt-text="Screenshot of Glossary terms > New attribute page.":::

1. Once all the custom attributes are created, select **Preview** to arrange the sequence of custom attributes. You can drag and drop custom attributes in the desired sequence.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/preview-term-template.png" alt-text="Screenshot of Glossary terms > Preview term template.":::

1. Once all the custom attributes are defined, select **Create** to create a term template with custom attributes.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/create-term-template.png" alt-text="Screenshot of Glossary terms > New term template - Create button.":::

1. Existing custom attributes can be marked as expired by checking **Mark as Expired**. Once expired, the attribute can't be reactivated. The expired attribute is greyed out for existing terms. Future new terms created with this term template will no longer show the attribute that has been marked expired.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/expired-attribute.png" alt-text="Screenshot of Glossary terms > Edit attribute to mark it as expired.":::

1. To delete a term template, open the template and select **Delete**. Note, if the term template is in use, you can't  delete it until you remove the glossary terms to which it's assigned.

## Next steps

Follow the [Tutorial: Create and import glossary terms](tutorial-import-create-glossary-terms.md) to learn more.
