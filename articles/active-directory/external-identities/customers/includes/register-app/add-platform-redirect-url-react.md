---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 06/09/2023
ms.author: kengaderdus
---
To specify your app type to your app registration, follow these steps: 

1. Under **Manage**, select **Authentication**.
1. On the **Platform configurations** page, select **Add a platform**, and then select the **SPA** option.
1. For the **Redirect URIs** enter `http://localhost:3000/auth/redirect`
1. Select **Configure** to save your changes.
1. On the **Platform configurations** page, in the new **Single-page application** that has appeared, select **Add URI**, then enter `http://localhost:3000/`
1. Select **Save** to save your changes, and ensure that both URIs are listed.