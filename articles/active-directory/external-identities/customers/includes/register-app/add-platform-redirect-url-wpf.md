---
author: SHERMANOUKO
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 07/26/2023
ms.author: shermanouko
---
To specify your app type to your app registration, follow these steps: 

1. Under **Manage**, select **Authentication**.

1. On the **Platform configurations** page, select **Add a platform**, and then select **Mobile and desktop applications** option.
    
1. In the input field under **Custom redirect URI**, manually enter `https://login.microsoftonline.com/common/oauth2/nativeclient`, then select **Configure**. If you select this URI on the select box, you may get a redirect URI error.
