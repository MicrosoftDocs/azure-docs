---
title: "Quickstart: Create a LambdaTest-HyperExecute resource"
description: Learn how to create a resource for LambdaTest using the Azure portal.
author: ProfessorKendrick
ms.author: kkendrick
ms.topic: quickstart
ms.date: 10/29/2024
ms.custom:
  - build-2025
---
# Quickstart: Create a LambdaTest-HyperExecute resource 

This quickstart shows you how to create a LambdaTest - HyperExecute resource using the Azure portal.

## Prerequisites

[!INCLUDE [create-prerequisites](../includes/create-prerequisites.md)]
- You must [Subscribe to LambdaTest - HyperExecute](overview.md#subscribe-to-lambdatest---hyperexecute)

## Create a resource

[!INCLUDE [create-resource](../includes/create-resource.md)]

### Basics tab

The *Basics* tab has three sections:

- Project Details
- Azure Resource Details
- LambdaTest organization Details

:::image type="content" source="media/create/basics-tab.png" alt-text="A screenshot of the Create LambdaTest - HyperExecute Resource in Azure options inside of the Azure portal's working pane with the Basics tab displayed.":::

There are required fields (identified with a red asterisk) in each section that you need to fill out.

1. Enter the values for each required setting under *Project Details*.

    | Setting           | Action                                     |
    |-------------------|--------------------------------------------|
    | Subscription      | Select your subscription.                  |
    | Resource group    | Specify a resource group.                  |

1. Enter the values for each required setting under *Azure Resource Details*.

    | Setting           | Action                                     |
    |-------------------|--------------------------------------------|
    | Resource name     | Specify a unique name for the resource.    |
    | Region            | Select the region.                         |

1. Enter the values for each required setting under *LambdaTest Organization Details*.

    | Setting           | Action                                     |
    |-------------------|--------------------------------------------|
    |Licenses subscribed|The number of licenses subscribed.          |

1. Select the **Next** button at the bottom of the page.

### Single sign-on tab (optional)

[!INCLUDE [sso](../includes/sso.md)]

### Tags tab (optional)

[!INCLUDE [tags](../includes/tags.md)]

### Review + create tab

[!INCLUDE [review-create](../includes/review-create.md)]

## Next step

> [!div class="nextstepaction"]
> [Manage a LambdaTest - HyperExecute resource](manage.md)