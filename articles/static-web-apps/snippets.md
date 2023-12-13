---
title: Snippets in Azure Static Web Apps (preview)
description: Inject custom code in the HEAD or BODY elements at runtime in Azure Static Web Apps 
services: static-web-apps
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  overview
ms.date: 06/22/2023
ms.author: cshoe
---

# Snippets in Azure Static Web Apps (preview)

Azure Static Web Apps allows you to inject custom code into the `head` or `body` elements at runtime. These pieces of code are known as *snippets*.

Snippets give you the flexibility to add code to every page in your site in a single place, all without modifying the core codebase.

Common use cases of snippets include:

- Analytics scripts
- Common scripts
- Global UI elements

> [!NOTE]
> Some front-end frameworks may overwrite your snippet code. Test your snippets before applying them to a production environment.

## Add a snippet

1. Go to your static web app in the Azure portal.

1. From the *Settings* menu, select **Configuration**.

1. Select the **Snippets** tab.

1. Select the **Add** button.

1. Enter the following settings in the Snippets window:

    | Setting | Value | Comments |
    |---|---|---|
    | Location | Select which HTML page element you want your code injected into. | |
    | Name | Enter a snippet name. | |
    | Insertion location | Select whether you want to **Prepend** or **Append** your code to the selected element. | *Prepend* means your code appears directly after the open tag of the element. *Append* means your code appears directly before the close tag of the element. |
    | Environment | Select the environment(s) you want to target. | If you pick **Select environment**, then you can choose from different environments to target. |

1. Enter your code in the text box.

1. Select **OK** to close the window.

1. Select **Save** to commit your changes.

## Next steps

> [!div class="nextstepaction"]
> [Split traffic](./traffic-splitting.md)
