---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 01/10/2024
ms.author: cshoe
---

Begin by signing in to the [Azure portal](https://portal.azure.com).

## Create a container app

To create your container app, start at the Azure portal home page.

1. Search for **Container Apps** in the top search bar.
1. Select **Container Apps** in the search results.
1. Select the **Create** button.

### Basics tab

In the *Basics* tab, do the following actions.

1. Enter the following values in the *Project details* section.

    | Setting | Action |
    |---|---|
    | Subscription | Select your Azure subscription. |
    | Resource group | Select **Create new** and enter **my-container-apps**. |
    | Container app name |  Enter **my-container-app**. |
    | Deployment source | Select **Container image**. |

1. Enter the following values in the "Container Apps Environment" section.

    | Setting | Action |
    |---|---|
    | Region | Select a region near you. |
    | Container Apps Environment | Use the default value. |
