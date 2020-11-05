---
title: How to manage term templates for business glossary
titleSuffix: Azure Purview
description: Learn how to manage term templates for business glossary in an Azure Purview data catalog.
author: nayenama
ms.author: nayenama
ms.service: data-catalog
ms.subservice: data-catalog-gen2
ms.topic: conceptual
ms.date: 11/04/2020
---

# How to manage term templates for business glossary

This article describes how to create a term template and custom attributes that can be associated to glossary terms.

## Manage term templates and custom attributes

Using term templates, you can create custom attributes, group them together and apply a template while creating terms. Once a term is created, the template associated with the term cannot be changed.

1. On the Terms List page, select **Manage term templates**.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/manage-term-templates.png" alt-text="Screenshot of Glossary terms > Manage term templates button.":::

2. The page shows both system as well as custom attributes. Select the **custom** tab to create or edit term templates.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/manage-term-custom.png" alt-text="Screenshot of Glossary terms > Manage term templates page.":::

3. Select **New Term Template** and enter a template name and description.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/new-term-template.png" alt-text="Screenshot of Glossary terms > Manage term templates > New term templates":::

4. Select **New Attribute** to create a new custom attribute for the term template. Enter an attribute name, description. The custom attribute name must be unique within a term template but can be same name can be reused across templates.

   Choose the field type from the list of options **Text**, **Single choice**, **Multi choice**, or  **Date**. You can also provide a default value string for Text field types.  The attribute can also be marked as **required**.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/new-attribute.png" alt-text="Screenshot of Glossary terms > New attribute page.":::

5. Once all the custom attributes are created, select **Preview** to arrange the sequence of custom attributes. You can drag and drop custom attributes in the desired sequence.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/preview-term-template.png" alt-text="Screenshot of Glossary terms > Preview term template.":::

6. Once all the custom attributes are defined, select **Create** to create a term template with custom attributes.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/create-term-template.png" alt-text="Screenshot of Glossary terms > New term template - Create button.":::

7. Existing custom attributes can be marked as expired by checking **Mark as Expired**. Once expired, the attribute cannot be reactivated. The expired attribute will be greyed out for existing terms. Future new terms created with this term template will no longer show the attribute that has been marked expired.

   :::image type="content" source="./media/how-to-manage-glossary-term-templates/expired-attribute.png" alt-text="Screenshot of Glossary terms > Edit attribute to mark it as expired.":::

## Next steps

Follow the [Tutorial: Create and import glossary terms](starter-kit-tutorial-5.md) to learn more.
