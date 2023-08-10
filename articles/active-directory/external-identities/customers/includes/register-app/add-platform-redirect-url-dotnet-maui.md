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

1. On the **Platform configurations** page, select **Add a platform**, and then select **Public client (mobile & desktop)** option.
    
1. For the **Redirect URIs** enter `msal{ClientId}://auth`, replace `ClientId` with the Application (client) ID then that you copied earlier, then select **Configure**.

1. Select **Save** to save the changes.