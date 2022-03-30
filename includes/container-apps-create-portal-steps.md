---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 01/24/2022
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

#### Enter project details

| Setting | Action |
|---|---|
| Subscription | Select your Azure subscription. |
| Resource group | Select **Create new** and enter **my-container-apps**. |
| Container app name |  Enter **my-container-app**. |

#### Create an environment

1. In the *Create Container App environment* field, select **Create new**.
1. In the *Create Container App Environment* page on the *Basics* tab, enter the following values:

    | Setting | Value |
    |---|---|
    | Environment name | Enter **my-environment**. |
    | Region | Select **Canada Central**. |

1. Select the **Monitoring** tab to create a Log Analytics workspace.
1. Select **Create new** in the *Log Analytics workspace* field.
1. Enter **my-container-apps-logs** in the *Name* field of the *Create new Log Analytics Workspace* dialog.
  
    The *Location* field is pre-filled with *Canada Central* for you.

1. Select **OK**.
