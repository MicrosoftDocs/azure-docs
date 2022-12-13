---
title: "Tutorial: Register a web application with the Microsoft identity platform"
description: In this tutorial, you learn how to register a web application with the Microsoft identity platform.
author: davidmu1
ms.author: davidmu
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 10/18/2022
#Customer intent: As an application developer, I want to know how to register my application with the Microsoft identity platform so that the security token service can issue access tokens to client applications that request them.
---

# Tutorial: Register an application with the Microsoft identity platform

This tutorial shows how to register a web app using the Azure portal so that it can be configured with the Microsoft identity platform.

In this tutorial:

> [!div class="checklist"]
> * Register a web application in an Azure AD tenant
> * Record the web application's unique identifiers

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The Azure account must have permission to manage applications in Azure AD. Use the least privileged of the following Azure AD role that you need to register the application:
  * Application administrator
  * Application developer
  * Cloud application administrator
* Completion of the [Set up a tenant quickstart](quickstart-create-new-tenant.md).

## Register the application

### Enter a registration name and select the account type

Provide a name for the application, specify the type of supported accounts and register the application.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Azure Active Directory**.
1. If access to multiple tenants is available, use the **Directories + subscriptions** filter :::image type="icon" source="media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which to register the application.
1. Under **Manage**, select **App registrations > New registration**.
1. Enter a **Name** for the application, such as *NewWebApp1*.
1. Accept the selection of **Accounts in this organizational directory only (Contoso only - Single tenant)** for the **Supported account type**.
1. Select **Register**.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/register-application.png" alt-text="Screenshot of process to enter a name and select the account type.":::

### Record the identifiers for the application

For this tutorial series, the **Directory (tenant) ID** and the **Application (client) ID** are needed to complete the configuration of the application.

1. Locate the **Directory (tenant) ID** and the **Application (client) ID** on the **Overview** page of the application.
1. Record these values to be used in later steps.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/record-identifiers.png" alt-text="Screenshot of recording the identifier values on the overview page.":::

## See also

The following articles are related to the concepts presented in this tutorial:

* For more information about the kinds of applications that are supported by the Microsoft identity platform, see [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
* For more information about the application registration process, see [Application model](application-model.md)
* For more information about adding applications to Azure AD, see [How and why applications are added to Azure AD](active-directory-how-applications-are-added.md).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Prepare the application for authentication](web-app-tutorial-02-prepare-application.md)