---
author: craigshoemaker
ms.service: static-web-apps
ms.topic:  include
ms.date: 06/11/2024
ms.author: cshoe
---

A managed backed is automatically available for every hybrid Next.js deployment. However, you can fine tune performance and take more control of the backend by assigning a custom backend to your site. The following steps show you how to associate a custom backend to your site.

1. Go to your static web app in the Azure portal.

1. Select **Settings** and then **APIs** from the side menu.

1. Under the *Backend Resource Name*, select the link labeled **(managed)**.

1. Select **Configure linked backend**.

1. Either create a new App Service Plan or select an existing App Service Plan.

    Your selected App Service Plan must use at least an **S1** SKU.