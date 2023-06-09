---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 05/05/2023
ms.author: kengaderdus
---

Create a client secret for the registered application. The application uses the client secret to prove its identity when it requests for tokens.

1. From the **App registrations** page, select the application that you created (such as *ciam-client-app*) to open its **Overview** page.
1. Under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. In the **Description** box, enter a description for the client secret (for example, *ciam app client secret*).
1. Under **Expires**, select a duration for which the secret is valid (per your organizations security rules), and then select **Add**.
1. Record the secret's **Value**. You'll use this value for configuration in a later step.

> [!NOTE] 
> The secret value won't be displayed again, and is not retrievable by any means, after you navigate away from the **Certificates and secrets** page, so make sure you record it. <br> For enhanced security, consider using certificates instead of client secrets.