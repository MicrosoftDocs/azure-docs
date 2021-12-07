---
author: kengaderdus
ms.service: active-directory-b2c
ms.subservice: B2C
ms.topic: include
ms.date: 06/11/2021
ms.author: kengaderdus
# Used by Azure AD B2C app integration articles under "App integration".
---
Create a client secret for the registered web application. The web application uses the client secret to prove its identity when it requests tokens.

1. Under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. In the **Description** box, enter a description for the client secret (for example, *clientsecret1*).
1. Under **Expires**, select a duration for which the secret is valid, and then select **Add**.
1. Record the secret's **Value**. You'll use this value for configuration in a later step.