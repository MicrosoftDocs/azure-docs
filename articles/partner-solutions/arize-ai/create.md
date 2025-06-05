---
title: "Quickstart: Create an Azure Native Arize AI Cloud Service resource"
description: Learn how to create a resource for Arize AI using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 04/21/2025
ms.custom:
  - build-2025
---
# Quickstart: Create an Azure Native Arize AI Cloud Service resource

This quickstart shows you how to create an Azure Native Arize AI Cloud Service resource using the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [subscribe to Arize AI](overview.md#subscribe).

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has three sections:

- Project details
- Azure Resource Details
- ArizeAI organization details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create Arize AI Resource in Azure options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project details*.

    | Setting           | Action                                     |
    |-------------------|--------------------------------------------|
    | Subscription      | Select your subscription.                  |
    | Resource group    | Specify a resource group.                  |

1. Enter the values for each required setting under *Azure Resource Details*.

    | Setting           | Action                                     |
    |-------------------|--------------------------------------------|
    | Resource name     | Specify a unique name for the resource.    |
    | Region            | Select the region.                         |

1. Enter the values for each required setting under *ArizeAI Organization Details*.

    | Setting           | Action                                        |
    |-------------------|-----------------------------------------------|
    |Description        | Provide a description for your organization.  |

1. Select the **Next** button at the bottom of the page.

### Single sign-on tab (optional)

[!INCLUDE [sso](../includes/sso.md)]

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage your resource](manage.md)