---
title: "Quickstart: Get Started with MongoDB Atlas Preview"
description: Learn how to create a MongoDB Atlas resource in the Azure portal.
ms.topic: quickstart
ms.date: 04/28/2025
---

# Quickstart: Get started with MongoDB Atlas Preview

In this quickstart, you create a MongoDB Atlas resource in the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to MongoDB Atlas](overview.md#subscribe-to-mongodb-atlas-preview).

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The **Basics** tab has sections for details about the project, the Azure resource, and the MongoDB Atlas organization. Red asterisks identify required settings.

:::image type="content" source="media/create/basics-tab.png" alt-text="Screenshot of basic settings for creating a MongoDB Atlas organization in the Azure portal.":::

1. Under **Project details**, enter these values:

    | Setting               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | **Subscription**        | Select a subscription from your existing subscriptions.   |
    | **Resource group**      | Use an existing resource group or create a new one.       |

1. Under **Azure Resource Details**, enter these values:

    | Setting              | Action                                    |
    |--------------------|-------------------------------------------|
    | **Resource name**      | Specify a unique name for the resource.   |
    | **Region**             | Select a region to deploy your resource.  |

1. Under **MongoDB Atlas Organization details**, enter this value:

    | Setting                  | Action                                                                                           |
    |------------------------|--------------------------------------------------------------------------------------------------|
    | **Organization name**      | Specify the name of the MongoDB Atlas organization.                                               |

    The remaining settings update themselves to reflect the details of the plan that you selected for this new organization.

1. Select **Next**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage a resource](manage.md)
