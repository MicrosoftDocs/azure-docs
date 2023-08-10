---
title: "Tutorial: Register an application with the Microsoft identity platform"
description: In this tutorial, you learn how to register a web application with the Microsoft identity platform.
author: cilwerner
ms.author: cwerner
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 02/09/2023
#Customer intent: As an application developer, I want to know how to register my application with the Microsoft identity platform so that the security token service can issue access tokens to client applications that request them.
---

# Tutorial: Register an application with the Microsoft identity platform

To interact with the Microsoft identity platform, Azure Active Directory (Azure AD) must be made aware of the application you create. This tutorial shows you how to register an application in a tenant on the Azure portal.

In this tutorial:

> [!div class="checklist"]
> * Register a web application in a tenant
> * Record the web application's unique identifiers

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* This Azure account must have permissions to manage applications. Use any of the following roles needed to register the application:
  * Application administrator
  * Application developer
  * Cloud application administrator

## Register the application and record identifiers

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To complete registration, provide the application a name and specify the supported account types. Once registered, the application **Overview** page will display the identifiers needed in the application source code.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If access to multiple tenants is available, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations > New registration**.
1. Enter a **Name** for the application, such as *NewWebApp1*.
1. For Supported account types, select **Accounts in this organizational directory only**. For information on different account types, select the **Help me choose** option.
    - The **Redirect URI (optional)** will be configured at a later stage.
1. Select **Register**.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/register-application.png" alt-text="Screenshot of process to enter a name and select the account type.":::

1. The application's **Overview** pane is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/record-identifiers.png" alt-text="Screenshot of recording the identifier values on the overview page.":::

>[!NOTE]
> The **Supported account types** can be changed by referring to [Modify the accounts supported by an application](howto-modify-supported-accounts.md).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Prepare a web application for authentication](web-app-tutorial-02-prepare-application.md)
