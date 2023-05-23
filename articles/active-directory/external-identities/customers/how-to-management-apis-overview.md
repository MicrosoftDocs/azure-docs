---
title: Management APIs for Azure Active Directory for customers 
description: Learn how to manage resources in an Azure AD for customers tenant programmatically by using APIs.
services: active-directory
author: garrodonnell
manager: celested
ms.author: godonnell
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
ms.custom: developer

#Customer intent: As a dev, devops, I want to learn how to programmatically manage my Azure Active Directory for customers tenant using APIs.
---
# Management APIs for Azure Active Directory for customers 

Using APIs allows you to programmatically manage resources in your Azure Active Directory (AD) for customers directory. Depending on the resource you want to manage, you can use the Microsoft Graph API or the Azure REST API. Both APIs are supported for the management of resources related to Azure AD for customers. Each link in the following sections targets the corresponding page within the relevant reference for that operation. You can use this article to determine which API to use for the resource you want to manage.

## Azure REST API
Using the Azure REST API, you can manage your Azure AD for customers tenant. The following Azure REST API operations are supported for the management of resources related to Azure AD for customers.

* [Tenant Management operations](azure-rest-api-operations-tenant-management.md)

## Microsoft Graph API

Querying and managing resources in your Azure AD for customers directory is done through the Microsoft Graph API. The following Microsoft Graph API operations are supported for the management of resources related to Azure AD for customers. 

* [User flows operations](microsoft-graph-operations-user-flow.md)

* [Company branding operations](microsoft-graph-operations-branding.md)

* [Custom extensions](microsoft-graph-operations-custom-extensions.md)

### Register a Microsoft Graph API application

In order to use the Microsoft Graph API, you need to register an application in your Azure AD for customers tenant. This application will be used to authenticate and authorize your application to call the Microsoft Graph API.

During registration, you'll specify a **Redirect URI** which redirects the user after authentication with Azure Active Directory. The app registration process also generates a unique identifier known as an **Application (client) ID**. 

The following steps show you how to register your app in the Microsoft Entra admin center:

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com/).

1. If you have access to multiple tenants, make sure you use the directory that contains your Azure AD for customers tenant:

    1. Select the **Directories + subscriptions** icon in the portal toolbar. 

    1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD for customers directory in the **Directory name** list, and then select **Switch**.

1. On the sidebar menu, select **Azure Active Directory**.

1. Select **Applications**, then select **App Registrations**.

1. Select **+ New registration**.

1. In the **Register an application page** that appears, enter your application's registration information:

    1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example *ciam-client-app*.

    1. Under **Supported account types**, select **Accounts in this organizational directory only**.

1. Select **Register**.

1. The application's **Overview pane** is displayed when registration is complete. Record the **Directory (tenant) ID** and the **Application (client) ID** to be used in your application source code.

### Grant API Access to your application

For your application to access data in Microsoft Graph API, grant the registered application the relevant application permissions. The effective permissions of your application are the full level of privileges implied by the permission. For example, to create, read, update, and delete every user in your Azure AD for customers tenant, add the User.ReadWrite.All permission.

1. Under **Manage**, select **API permissions**.

1. Under **Configured permissions**, select **Add a permission**.

1. Select the **Microsoft APIs** tab, then select **Microsoft Graph**.

1. Select **Application permissions**.

1. Expand the appropriate permission group and select the check box of the permission to grant to your management application. For example:

    * **User** > **User.ReadWrite.All**: For user migration or user management scenarios.

    * **Group** > **Group.ReadWrite.All**: For creating groups, read and update group memberships, and delete groups.

    * **AuditLog** > **AuditLog.Read.All**: For reading the directory's audit logs.

    * **Policy** > **Policy.ReadWrite.TrustFramework**: For continuous integration/continuous delivery (CI/CD) scenarios. For example, custom policy deployment with Azure Pipelines.

1. Select **Add permissions**. As directed, wait a few minutes before proceeding to the next step.

1. Select **Grant admin consent for (your tenant name)**.

1. If you are not currently signed-in with Global Administrator account, sign in with an account in your Azure AD for customers tenant that's been assigned at least the *Cloud application administrator* role and then select **Grant admin consent for (your tenant name)**.

1. Select **Refresh**, and then verify that "Granted for ..." appears under **Status**. It might take a few minutes for the permissions to propagate.

After you have registered your application, you need to add a client secret to your application. This client secret will be used to authenticate your application to call the Microsoft Graph API.

The application uses the client secret to prove its identity when it requests for tokens.

1. From the **App registrations** page, select the application that you created (such as *ciam-client-app*) to open its **Overview** page.

1. Under **Manage**, select **Certificates & secrets**.

1. Select **New client secret**.

1. In the **Description** box, enter a description for the client secret (for example, `ciam app client secret`).

1. Under **Expires**, select a duration for which the secret is valid (per your organizations security rules), and then select **Add**.

1. Record the secret's **Value**. You'll use this value for configuration in a later step.

> [!NOTE] 
> The secret value won't be displayed again, and is not retrievable by any means, after you navigate away from the certificates and secrets page, so make sure you record it. <br> For enhanced security, consider using **certificates** instead of client secrets.
## Next steps

- To learn more about the Microsoft Graph API, see [Microsoft Graph overview](/graph/overview). 
  