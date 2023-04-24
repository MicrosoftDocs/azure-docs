---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 04/30/2023
ms.author: kengaderdus
---
To specify your app type to your app registration, follow these steps: 

1. Under **Manage**, select **Authentication**.

1. On the **Platform configurations** page, select **Add a platform**, and then select **Mobile and desktop applications** option.

1. For the **Custom redirect URIs** enter `http://localhost`, then select **Configure**.

During development use, and **desktop apps**, you can set the redirect URI to `http://localhost` and Azure AD accepts any port in the request. If the registered URI contains a port, Azure AD uses that port only. For example, if you register a redirect URI like `http://localhost`, the redirect URI in the request can be `http://localhost:{randomport}`. However, if the registered redirect URI is `http://localhost:8080`, the redirect URI in the request must be `http://localhost:8080`.