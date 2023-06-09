---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---
To specify your app type to your app registration, follow these steps: 

1. Under **Manage**, select **Authentication** 
1. On the **Platform configurations** page, select **Add a platform**, and then select **Single-page application** option.
1. For the **Redirect URIs** enter `http://localhost:4200/`.
1. Under **Front-channel logout URL**, enter `http://localhost:4200/auth`.
1. Select **Save** to save your changes.