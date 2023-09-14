---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 05/05/2023
ms.author: kengaderdus
---
To specify your app type to your app registration, follow these steps: 

1. Under **Manage**, select **Authentication**.

1. On the **Platform configurations** page, select **Add a platform**, and then select **Mobile and desktop applications** option.

1. For the **Custom redirect URIs** enter a URI with a unique scheme, then select **Configure**. For example, Electron desktop app's redirect URI looks something similar to `http://localhost` while that of a .NET Multi-platform App UI (MAUI) looks similar to `msal{ClientId}://auth`.  