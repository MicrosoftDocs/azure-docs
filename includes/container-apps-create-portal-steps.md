---
author: craigshoemaker
ms.service: container-apps
ms.topic: include
ms.date: 05/13/2022
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

#### Create an environment

Next, create an environment for your container app.

1. Select the appropriate region.

    | Setting | Value |
    |--|--|
    | Region | Select **Central US**. |

1. In the *Create Container Apps environment* field, select the **Create new** link.
1. In the *Create Container Apps Environment* page on the *Basics* tab, enter the following values:

    | Setting | Value |
    |--|--|
    | Environment name | Enter **my-environment**. |
    | Zone redundancy | Select **Disabled** |

1. Select the **Monitoring** tab to create a Log Analytics workspace.
1. Select the **Create new** link in the *Log Analytics workspace* field and enter the following values.

    | Setting | Value |
    |--|--|
    | Name | Enter **my-container-apps-logs**. |
  
    The *Location* field is pre-filled with *Central US* for you.

1. Select **OK**.
