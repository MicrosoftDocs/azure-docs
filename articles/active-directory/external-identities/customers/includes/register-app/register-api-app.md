---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least an [Application Developer](../../../../roles/permissions-reference.md#application-developer).

1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to your customer tenant. 

1. Browse to **Identity** > **Applications** > **App registrations**.

1. Select **+ New registration**.

1. In the **Register an application** page that appears, enter your application's registration information:

    1. In the Name section, enter a meaningful application name that will be displayed to users of the app, for example *ciam-ToDoList-api*.

    1. Under **Supported account types**, select **Accounts in this organizational directory only**.

1. Select **Register** to create the application.

1. The application's **Overview pane** is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.
