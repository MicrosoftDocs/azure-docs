---
title: "Quickstart: Get Started with MongoDB Atlas"
description: Learn how to create a MongoDB Atlas resource in the Azure portal.
ms.topic: quickstart
ms.date: 12/11/2025
---

# Quickstart: Get started with MongoDB Atlas

In this quickstart, you create a MongoDB Atlas resource in the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The **Basics** tab has sections for details about the project, the Azure resource, and the MongoDB Atlas organization.

:::image type="content" source="media/create/basics-tab.png" alt-text="Screenshot of basic settings for creating a MongoDB Atlas organization in the Azure portal.":::

Red asterisks identify required settings. Enter values for each required setting.

1. **Project details:**

    | Setting             | Value                                                     |
    |---------------------|-----------------------------------------------------------|
    | **Subscription**        | Select a subscription from your existing subscriptions.   |
    | **Resource group**      | Use an existing resource group or create a new one.       |

1. **Azure Resource Details:**

    | Setting            | Value                                     |
    |--------------------|-------------------------------------------|
    | **Resource name**      | Specify a unique name for the resource.   |
    | **Region**             | Select the Azure region where this resource will be deployed. This selection is separate from the Atlas cluster region, which you will choose later during cluster setup. |

1. **MongoDB Atlas Organization details:**

    | Setting                | Value                                 |
    |------------------------|---------------------------------------|
    | **Organization name**   | Specify the name of the MongoDB Atlas organization.  |

    The remaining settings update themselves to reflect the details of the plan that you selected for this new organization.

1. Select **Next** to add tags, or select **Review and create**.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage a resource](manage.md)
