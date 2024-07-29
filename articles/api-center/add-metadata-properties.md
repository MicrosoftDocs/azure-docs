---
title: Tutorial - Define custom metadata for API governance
description: In this tutorial, define custom metadata in your API center. Use custom and built-in metadata to organize and govern your APIs.
author: dlepow
ms.service: api-center
ms.topic: tutorial
ms.date: 04/19/2024
ms.author: danlep 
#customer intent: As the owner of an Azure API center, I want a step by step introduction to configure custom metadata properties to govern my APIs.
---

# Tutorial: Define custom metadata

In this tutorial, define custom metadata to help you organize your APIs and other information in your API center. Use custom and built-in metadata for search and filtering and to enforce governance standards in your organization. 

For background information about metadata in Azure API Center, see:

* [Key concepts](key-concepts.md#metadata)
* [Metadata for API governance](metadata.md)

In this tutorial, you learn how to use the portal to:
> [!div class="checklist"]
> * Define custom metadata in your API center
> * View the metadata schema

## Prerequisites

* An API center in your Azure subscription. If you haven't created one already, see [Quickstart: Create your API center](set-up-api-center.md).

## Define metadata

Here you define two custom metadata examples: *Line of business* and *Public-facing*; if you prefer, define other metadata of your own. When you add or update APIs and other information in your inventory, you'll set values for custom and any common built-in metadata.

[!INCLUDE [metadata-sensitive-data](includes/metadata-sensitive-data.md)]

1. In the [Azure portal](https://portal.azure.com), navigate to your API center.

1. In the left menu, under **Assets**, select **Metadata > + New metadata**. 

1. On the **Details** tab, enter information about the metadata. 

    1. In **Title**, enter *Line of business*. 
    
    1. Optionally, enter a **Description**.

    1. Select type **Predefined choices** and enter choices such as *Marketing, Finance, IT, Sales*, and so on. Optionally enable **Allow selection of multiple values**. Select **Next**.

    :::image type="content" source="media/add-metadata-properties/metadata-property-details.png" alt-text="Screenshot of adding custom metadata in the portal.":::

1. On the **Assignments** tab, select **Required** for APIs. Select **Optional** for Deployments and Environments. (You'll add these entities in later tutorials.) Select **Next**.

    :::image type="content" source="media/add-metadata-properties/metadata-property-assignments.png" alt-text="Screenshot of metadata assignments in the portal." :::

1. On the **Review + create** tab, review the settings and select **Create**. 
 
    The metadata is added to the list on the **Metadata** page. 

1. Select **+ New metadata** to add another example.

1. On the **Details** tab, enter information about the metadata. 

    1. In **Title**, enter *Public-facing*. 
    
    1. Select type **Boolean**. 

1. On the **Assignments** tab, select **Required** for APIs. Select **Not applicable** for Deployments and Environments. 

1. On the **Review + create** tab, review the settings and select **Create**. 

    The metadata is added to the list.

## View metadata schema

You can view and download the JSON schema for the metadata defined in your API center. The schema includes built-in and custom metadata.

1. In the left menu, under **Assets**, select **Metadata > View metadata schema**. 

1. Select **View metadata schema > APIs** to see the metadata schema for APIs, which includes built-in and custom metadata. You can also view the metadata schema defined for deployments and environments in your API center.

    :::image type="content" source="media/add-metadata-properties/metadata-schema.png" alt-text="Screenshot of metadata schema in the portal." lightbox="media/add-metadata-properties/metadata-schema.png":::

## Next steps

In this tutorial, you learned how to use the portal to:
> [!div class="checklist"]    
> * Define custom metadata in your API center
> * View the metadata schema

Now that you've prepared your metadata schema, add APIs to the inventory in your API center. 

> [!div class="nextstepaction"]
> [Register APIs in your API inventory](register-apis.md)

