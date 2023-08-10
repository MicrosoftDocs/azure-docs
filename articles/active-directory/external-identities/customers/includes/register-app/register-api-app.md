---
author: kengaderdus
ms.service: active-directory
ms.subservice: ciam
ms.topic: include
ms.date: 03/30/2023
ms.author: kengaderdus
---
1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).

1. If you've access to multiple tenants, make sure you use the directory that contains your Azure AD for customers tenant:
    
    1. Select the **Directories + subscriptions** icon :::image type="icon" source="../../media/common/portal-directory-subscription-filter.png" border="false"::: in the toolbar.
    
    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch**. 

1. On the sidebar menu, select **Azure Active Directory**.

1. Select **Applications**, then select **App Registrations**.

1. Select **+ New registration**.

1. In the **Register an application** page that appears, enter your application's registration information:

    1. In the Name section, enter a meaningful application name that will be displayed to users of the app, for example *ciam-ToDoList-api*.

    1. Under **Supported account types**, select **Accounts in this organizational directory only**.

1. Select **Register** to create the application.

1. The application's **Overview pane** is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.
