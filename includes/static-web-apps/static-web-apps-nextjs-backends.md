---
author: craigshoemaker
ms.service: azure-static-web-apps
ms.topic:  include
ms.date: 06/11/2024
ms.author: cshoe
---

The following steps show you how to associate a custom backend to your Standard plan and above static web apps.

> [!NOTE]
> Linked backends are only available for sites using the Standard plan or above.

1. Go to your static web app in the Azure portal.

1. Select **Settings** and then **APIs** from the side menu.

1. Select **Configure linked backend**.

1. Either create a new App Service Plan or select an existing App Service Plan.

    Your selected App Service Plan must use at least an **S1** SKU.

1. Click **Link**.
