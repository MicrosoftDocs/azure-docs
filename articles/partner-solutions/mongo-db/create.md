---
title: "Quickstart: Get started with MongoDB Atlas (preview)"
description: Learn how to create a MongoDB Atlas resource in the Azure portal.
ms.topic: quickstart
ms.date: 04/28/2025
---

# Quickstart: Get started with MongoDB Atlas (preview)

In this quickstart, you create a MongoDB Atlas resource in the Azure portal. 

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to MongoDB Atlas](overview.md#subscribe-to-mongodb-atlas-preview).

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure resource details
- MongoDB Atlas organization details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create MongoDB Atlas Organization options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Field               | Action                                                    |
    |---------------------|-----------------------------------------------------------|
    | Subscription        | Select a subscription from your existing subscriptions.   |
    | Resource group      | Use an existing resource group or create a new one.       |

1. Enter the values for each required setting under *Azure Resource details*.

    | Field              | Action                                    |
    |--------------------|-------------------------------------------|
    | Resource name      | Specify a unique name for the resource.   |
    | Region             | Select a region to deploy your resource.  |

1. Enter the values for each required setting under *MongoDB Atlas Organization details*.

    | Field                  | Action                                                                                           |
    |------------------------|--------------------------------------------------------------------------------------------------|
    | Organization Name      | Specify the name of the MongoDB Atlas organization                                               |

    The remaining fields update to reflect the details of the plan you selected for this new organization.

1. Select the **Next** button at the bottom of the page.

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class"nextstepaction"]
> [Manage a resource](manage.md)


