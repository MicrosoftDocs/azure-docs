---
title: Tutorial - Customize metadata properties in Azure API Center (preview) | Microsoft Docs
description: In this tutorial, define custom metadata properties in your API center. Use custom and built-in properties to organize your APIs.
author: dlepow
ms.service: api-center
ms.topic: tutorial
ms.date: 11/07/2023
ms.author: danlep 
ms.custom: 
---

# Tutorial: Customize metadata properties

In this tutorial, define custom properties to help you organize your APIs and other information in your API center. Use custom metadata properties and several built-in properties for search and filtering and to enforce governance standards in your organization. 

For background information about the metadata schema in API Center, see [Key concepts](key-concepts.md).

In this tutorial, you learn how to use the portal to:
> [!div class="checklist"]
> * Define custom metadata properties in your API center
> * View the metadata schema

[!INCLUDE [api-center-preview-feedback](includes/api-center-preview-feedback.md)]

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

## Define properties in the metadata schema

You organize your API inventory by setting values of metadata properties. While several common properties such as "API type" and "Version lifecycle" are available out of the box, each API center provides a configurable metadata schema so you can add properties that are specific to your organization. 

Here you define two example properties: *Line of business* and *Public-facing*; if you prefer, define other properties of your own. When you add or update APIs and other information in your inventory, you'll set values for these properties and any common built-in properties.

> [!IMPORTANT]
> Take care not to include any sensitive, confidential, or personal information in the titles (names) of metadata properties you define. These titles are visible in monitoring logs that are used by Microsoft to improve the functionality of the service. However, other metadata details and values are your protected customer data. 

1. In the left menu, select **Metadata schema > + Add property**. 

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Line of business*. 
    
    1. Select type **Predefined choices** and enter choices such as *Marketing, Finance, IT, Sales*, and so on. Optionally enable **Allow selection of multiple values**. 

    :::image type="content" source="media/add-metadata-properties/metadata-property-details.png" alt-text="Screenshot of metadata schema property in the portal.":::

1. On the **Assignments** tab, select **Required** for APIs. Select **Optional** for Deployments and Environments. (You'll add these entities in later tutorials.)

    :::image type="content" source="media/add-metadata-properties/metadata-property-assignments.png" alt-text="Screenshot of metadata property assignments in the portal.":::

1. On the **Review + Create** tab, review the settings and select **Create**. 
 
    The property is added to the list. 

1. Select **+ Add property** to add another property.

1. On the **Details** tab, enter information about the property. 

    1. In **Title**, enter *Public-facing*. 
    
    1. Select type **Boolean**. 

1. On the **Assignments** tab, select **Required** for APIs. Select **Not applicable** for Deployments and Environments. 

1. On the **Review + Create** tab, review the settings and select **Create**. 

    The property is added to the list.

## View metadata schema

You can view and download the JSON schema for the metadata properties in your API center. The schema includes built-in and custom properties.

1. In the left menu, select **Metadata schema > View schema**. 

1. Select **View schema > API** to see the metadata schema for APIs, which includes built-in properties and the properties that you added. You can also view the metadata schema defined for deployments and environments in your API center.

    :::image type="content" source="media/add-metadata-properties/metadata-schema.png" alt-text="Screenshot of metadata schema in the portal." lightbox="media/add-metadata-properties/metadata-schema.png":::

> [!NOTE]
> * Add properties in the schema at any time and apply them to APIs and other entities in your API center. 
> * After adding a property, you can change its assignment to an entity, for example from required to optional for APIs.
> * You can't delete, unassign, or change the type of properties that are currently set in entities. Remove them from the entities first, and then you can delete or change them.

## Next steps

In this tutorial, you learned how to use the portal to:
> [!div class="checklist"]    
> * Define custom metadata properties in your API center
> * View the metadata schema

Now that you've prepared your metadata schema, add APIs to the inventory in your API center. 

> [!div class="nextstepaction"]
> [Register APIs in your API inventory](register-apis.md)

