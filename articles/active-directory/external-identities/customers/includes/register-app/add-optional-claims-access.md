---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 07/26/2023
ms.author: kengaderdus
---

Tokens returned by Microsoft identity are kept smaller to ensure optimal performance by clients that request them. As a result, several claims are no longer present in the token by default and must be asked for specifically on a per-application basis. For this app, you include  **idtyp** optional claim to help the web API to determine if a token is an app token or an app+user token. Although a combination of **scp** and **roles** claims can used for the same purpose, the use of the **idtyp** claim is the easiest way to tell an app token and an app+user token apart. For example, the value of this claim is *app* when the token is an app-only token. 

Use the following steps to configure **idtyp** optional claim: 

1. Under **Manage**, select **Token configuration**.

1. Select **Add optional claim**.

1. Under **Token type**, choose **Access**.

1. Select the optional claim **idtyp**.

1. Select **Add** to save your changes.