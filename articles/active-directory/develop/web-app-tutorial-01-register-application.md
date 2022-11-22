---
title: "Tutorial: Register an application"
description: Register an application in an Azure Active Directory tenant.
author: davidmu1
ms.author: davidmu
manager: CelesteDG
ms.service: active-directory
ms.topic: tutorial
ms.date: 10/18/2022
---

# Tutorial: Register an application

To enable an application to use authentication with Azure Active Directory (Azure AD), it must be registered in a tenant. Registering an application establishes a trust relationship between the application and the Microsoft identity platform. The trust is unidirectional: the application trusts the Microsoft identity platform, and not the other way around. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Locate a tenant in Azure AD
> * Start registration and provide a name for the application that is seen by users
> * Specify the account types that can be used with the application
> * Register the application and record its identifiers

## Prerequisites

* An Azure account that has an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* The Azure account must have permission to manage applications in Azure AD. Use the least privileged of the following Azure AD role that you need to register the application:
  * Application administrator
  * Application developer
  * Cloud application administrator
* Completion of the [Set up a tenant quickstart](quickstart-create-new-tenant.md).

## Register the application

### Locate the tenant in Azure AD

Organizations may have more than one Azure AD tenant. Choose the tenant where the application should be registered.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Search for and select **Azure Active Directory**.
1. Use the **Directories + subscriptions** filter in the top menu to switch to the tenant where the application should be registered.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/select-tenant.png" alt-text="Screenshot of selecting a tenant in Azure Active Directory.":::

1. Once your tenant is selected, you can close the page by clicking the 'X' icon on the top right, which will bring you to your tenant's **Overview** page.

### Start registration and enter a name for the application

Provide a name for the application. The name is seen by users in the various portals.

1. Under **Manage**, select **App registrations > New registration**.
1. Enter a **Name** for the application, such as *NewWebApp1*.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/register-application.png" alt-text="Screenshot of process to enter a name and select the account type.":::

### Select the account type and register the application

Specify the type of accounts that the application supports and then register the application.

1. Accept the selection of **Accounts in this organizational directory only (Contoso only - Single tenant)** for the **Supported account type**.
1. Select **Register**.

### Record the identifiers for the application

In the following tutorials, the **Directory (tenant) ID** and the **Application (client) ID** are needed to complete the configuration of the application.

1. Locate the **Directory (tenant) ID** and the **Application (client) ID** on the **Overview** page of the application.
1. Record the values that you located to be used in later steps.

    :::image type="content" source="./media/web-app-tutorial-01-register-application/record-identifiers.png" alt-text="Screenshot of recording the identifier values on the overview page.":::

## See also

The following articles are related to the concepts presented in this tutorial:

* For more information about the kinds of applications that are supported by the Microsoft identity platform, see [Authentication flows and application scenarios](authentication-flows-app-scenarios.md)
* For more information about the application registration process, see [Application model](application-model.md)
* For more information about adding applications to Azure AD, see [How and why applications are added to Azure AD](active-directory-how-applications-are-added.md).

## Next steps

> [!div class="nextstepaction"]
> [Tutorial: Prepare the application for authentication](web-app-tutorial-02-prepare-application.md)