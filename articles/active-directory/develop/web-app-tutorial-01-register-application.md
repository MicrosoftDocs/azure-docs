---
title: "Tutorial: Register a web application with the Microsoft identity platform"
description: In this tutorial, you learn how to register a web application with the Microsoft identity platform.
author: cilwerner
ms.author: cwerner
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 10/18/2022
#Customer intent: As an application developer, I want to know how to register my application with the Microsoft identity platform so that the security token service can issue access tokens to client applications that request them.
#TBD
---

# Tutorial: Register an application with the Microsoft identity platform

Before an application can be authenticated with the Microsoft identity platform, it must be registered in a tenant on the Azure portal. This establishes the unidirectional trust relationship, where the application trusts the Microsoft identity platform but not the other way around. This tutorial shows you how to register a web application on the Azure portal.

In this tutorial:

> [!div class="checklist"]
> * Register a web application in a tenant
> * Record the web application's unique identifiers

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/).
* This Azure account must have permissions to manage applications. Use the least privileged of the following roles needed to register the application:
  * Application administrator
  * Application developer
  * Cloud application administrator
* Completion of the [Set up a tenant](quickstart-create-new-tenant.md) quickstart.

## Register the application abd record identifiers

To complete registration, provide the application a name and specify the supported account types. Once registered, the application **Overview** page will display the identifiers needed in the source code.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. If access to multiple tenants is available, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations > New registration**.
1. Enter a **Name** for the application, such as *NewWebApp1*.
1. For **Supported account types**, select **Accounts in this organizational directory only (Contoso only - Single tenant)**.
1. Select **Register**.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/register-application.png" alt-text="Screenshot of process to enter a name and select the account type.":::

1. On the **Overview** page, locate the **Directory (tenant) ID** and the **Application (client) ID** to be used in later steps.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/record-identifiers.png" alt-text="Screenshot of recording the identifier values on the overview page.":::

## See also

The following articles are related to the concepts presented in this tutorial:

* For more information about the kinds of applications that are supported by the Microsoft identity platform, see [Authentication flows and application scenarios](authentication-flows-app-scenarios.md).
* For more information about the application registration process, see [Application model](application-model.md).
* For more information about adding applications to Azure AD, see [How and why applications are added to Azure AD](active-directory-how-applications-are-added.md).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Prepare the application for authentication](web-app-tutorial-02-prepare-application.md)