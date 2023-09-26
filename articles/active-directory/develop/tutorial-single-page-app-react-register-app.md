---
title: "Tutorial: Register a Single-page application with the Microsoft identity platform"
description: Register an application in a Microsoft Entra tenant.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.author: owenrichards
ms.topic: tutorial
ms.date: 02/27/2023
#Customer intent: As a React developer, I want to know how to register my application with the Microsoft identity platform so that the security token service can issue access tokens to client applications that request them.
---

# Tutorial: Register a Single-page application with the Microsoft identity platform

To interact with the Microsoft identity platform, Microsoft Entra ID must be made aware of the application you create. This tutorial shows you how to register a single-page application (SPA) in a tenant on the Microsoft Entra admin center.

In this tutorial:

> [!div class="checklist"]
> * Register the application in a tenant
> * Add a Redirect URI to the application
> * Record the application's unique identifiers

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* This Azure account must have permissions to manage applications. Any of the following Microsoft Entra roles include the required permissions:
  * Application administrator
  * Application developer
  * Cloud application administrator

## Register the application and record identifiers

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To complete registration, provide the application a name, specify the supported account types, and add a redirect URI. Once registered, the application **Overview** pane displays the identifiers needed in the application source code.

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
1. If access to multiple tenants is available, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which to register the application.
1. Browse to **Identity** > **Applications** > **App registrations**, select **New registration**.
1. Enter a **Name** for the application, such as *NewSPA1*.
1. For **Supported account types**, select **Accounts in this organizational directory only**. For information on different account types, select the **Help me choose** option.
1. Under **Redirect URI (optional)**, use the drop-down menu to select **Single-page-application (SPA)** and enter `http://localhost:3000` into the text box.
1. Select **Register**.

    :::image type="content" source="./media/single-page-app-tutorial-01-register-app/register-application.png" alt-text="Screenshot that shows how to enter a name and select the account type in the Azure portal.":::

1. The application's **Overview** pane is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.

    :::image type="content" source="./media/single-page-app-tutorial-01-register-app/record-identifiers.png" alt-text="Screenshot that shows the identifier values on the overview page on the Azure portal.":::

    >[!NOTE]
    > The **Supported account types** can be changed by referring to [Modify the accounts supported by an application](howto-modify-supported-accounts.md).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Prepare an application for authentication](tutorial-single-page-app-react-prepare-spa.md)
