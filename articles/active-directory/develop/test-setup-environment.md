---
title: Set up a test environment for your app
description: Learn how to set up an Azure Active Directory test environment so you can test your application integrated with Microsoft identity platform. Evaluate whether you need a separate tenant for testing or if you can use your production tenant.
services: active-directory
author: cilwerner
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.date: 05/11/2022
ms.author: cwerner
ms.reviewer: ryanwi, arcrowe
# Customer intent: As a developer, I want to set up a test environment so that I can test my app integrated with Microsoft identity platform.
---

# Set up your application's Azure AD test environment

To help move your app through the development, test, and production lifecycle, set up an Azure Active Directory (Azure AD) test environment. You can use your Azure AD test environment during the early stages of app development and long-term as a permanent test environment.

## Dedicated test tenant or production Azure AD tenant?

Your first task is to decide between using an Azure AD tenant dedicated to testing or your production tenant as your test environment.

Using a production tenant can make some aspects of application testing easier, but it requires the right level of isolation between test and production resources. Isolation is especially important for high-privilege scenarios.

Don't use your production Azure AD tenant if:

- Your application uses settings that require tenant-wide uniqueness. For example, your app might need to access tenant resources as itself, not on behalf of a user, by using app-only permissions. App-only access requires admin consent which applies to the entire tenant. Such permissions are hard to scope down safely within a tenant boundary.
- You have low tolerance of risk for potential unauthorized access of test resources by tenant members.
- Configuration changes could negatively impact the critical operation of your production environment.
- You're unable to create users or other test data in your production tenant.
- Policies are enabled in your production tenant that require user interaction during authentication. For example, if multi-factor authentication is required for all users, you can't use automated sign-ins for integration testing.
- Adding non-production resources and/or workload to your production tenant would [exceed service or throttling limits](test-throttle-service-limits.md) for the tenant.

If any of these restrictions apply, set up a [test environment in a separate tenant](#set-up-a-test-environment-in-a-separate-tenant).

If none of these restrictions apply, you can set up a [test environment in your production tenant](#set-up-a-test-environment-in-your-production-tenant). Be aware that global administrators in your production tenant can access its resources and change its configuration at any time. To prevent access to any test resources or configuration, put that data in a separate tenant.

## Set up a test environment in a separate tenant

If you can't safely constrain your test app in your production tenant, create a separate tenant for development and testing purposes.

### Get a test tenant

If you don't already have a dedicated test tenant, you can create one for free using the Microsoft 365 Developer Program or manually create one yourself.

#### Join the Microsoft 365 Developer Program (recommended)

The [Microsoft 365 Developer Program](/office/developer-program/microsoft-365-developer-program) is free and can have test user accounts and sample data packs automatically added to the tenant.

1. Click on the **Join now** button on the screen.
2. Sign in with a new Microsoft Account or use an existing (work) account you already have.
3. On the sign-up page select your region, enter a company name and accept the terms and conditions of the program before you click **Next**.
4. Click on **Set Up Subscription**. Specify the region where you want to create your new tenant, create a username, domain, and enter a password. This will create a new tenant and the first administrator of the tenant.
5. Enter the security information, which is needed to protect the administrator account of your new tenant. This will set up multi-factor authentication for the account.

#### Manually create a tenant

You can [manually create a tenant](quickstart-create-new-tenant.md), which will be empty upon creation and will have to be configured with test data.

### Populate your tenant with users

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

For convenience, you may want to invite yourself and other members of your development team to be guest users in the tenant. This will create separate guest objects in the test tenant, but means you only have to manage one set of credentials for your corporate account and your test account.

1. Sign in to the [Azure portal](https://portal.azure.com), then select **Azure Active Directory**.
2. Go to **Users**.
3. Click on **New guest user** and invite your work account email address.
4. Repeat for other members of the development and/or testing team for your application.

You can also create test users in your test tenant. If you used one of the Microsoft 365 sample packs, you may already have some test users in your tenant. If not, you should be able to create some yourself as the tenant administrator.

1. Sign in to the [Azure portal](https://portal.azure.com), then select on **Azure Active Directory**.
2. Go to **Users**.
3. Click **New user** and create some new test users in your directory.

### Get an Azure AD subscription (optional)

If you want to fully test Azure AD premium features on your application, you'll need to sign up your tenant for a [Premium P1 or Premium P2 license](https://azure.microsoft.com/pricing/details/active-directory/).

If you signed up using the Microsoft 365 Developer program, your test tenant will come with Azure AD P2 licenses. If not, you can still enable a one month [free trial of Azure AD premium](https://azure.microsoft.com/trial/get-started-active-directory/).

### Create and configure an app registration

You'll need to create an app registration to use in your test environment. This should be a separate registration from your eventual production app registration, to maintain security isolation between your test environment and your production environment. How you configure your application depends on the type of app you are building. For more information, check out the app registration steps for your app scenario in the left navigation pane, like this article for [web application registration](scenario-web-app-sign-user-app-registration.md).

### Populate your tenant with policies

If your app will primarily be used by a single organization (commonly referred to as single tenant), and you have access to that production tenant, then you should try to replicate the settings of your production tenant that can affect your app's behavior. That will lower the chances of unexpected errors when operating in production.

#### Conditional Access policies

Replicating Conditional Access policies ensures you don't encounter unexpected blocked access when moving to production and your application can appropriately handle the errors it's likely to receive.

Viewing your production tenant Conditional Access policies may need to be performed by a company administrator.

1. Sign in to the [Azure portal](https://portal.azure.com) using your production tenant account.
1. Go to **Azure Active Directory** > **Enterprise applications** > **Conditional Access**.
1. View the list of policies in your tenant. Click the first one.
1. Navigate to **Cloud apps or actions**.
1. If the policy only applies to a select group of apps, then move on to the next policy. If not, then it will likely apply to your app as well when you move to production. You should copy the policy over to your test tenant.

In a new tab or browser session, sign in to the [Azure portal](https://portal.azure.com) to access your test tenant.

1. Go to **Azure Active Directory** > **Enterprise applications** > **Conditional Access**.
1. Click on **New policy**
1. Copy the settings from the production tenant policy, identified through the previous steps.

#### Permission grant policies

Replicating permission grant policies ensures you don't encounter unexpected prompts for admin consent when moving to production.

1. Sign in to the [Azure portal](https://portal.azure.com) using your production tenant account.
1. Click on **Azure Active Directory**.
1. Go to **Enterprise applications**.
1. From your production tenant, go to **Azure Active Directory** > **Enterprise applications** > **Consent and permissions** > **User consent** settings. Copy the settings there to your test tenant.

#### Token lifetime policies

Replicating token lifetime policies ensures tokens issued to your application don't expire unexpectedly in production.

Token lifetime policies can currently only be managed through PowerShell. Read about [configurable token lifetimes](configurable-token-lifetimes.md) to learn about identifying any token lifetime policies that apply to your whole production organization. Copy those policies to your test tenant.

## Set up a test environment in your production tenant
If you can safely constrain your test app in your production tenant, go ahead and set up your tenant for testing purposes.

### Create and configure an app registration

You'll need to create an app registration to use in your test environment. This should be a separate registration from your eventual production app registration, to maintain security isolation between your test environment and your production environment. How you configure your application depends on the type of app you are building. For more information, check out the [app registration steps for your app scenario](scenario-web-app-sign-user-app-registration.md) in the left navigation pane.

### Create some test users

You'll need to create some test users with associated test data to use while testing your scenarios. This step might need to be performed by an admin.

1. Sign in to the [Azure portal](https://portal.azure.com), then select **Azure Active Directory**.
2. Go to **Users**.
3. Select **New user** and create some new test users in your directory.

### Add the test users to a group (optional)

For convenience, you can assign all these users to a group, which makes other assignment operations easier.

1. Sign in to the [Azure portal](https://portal.azure.com), then select **Azure Active Directory**.
2. Go to **Groups**.
3. Click **New group**.
4. Select either **Security** or **Microsoft 365** for group type.
5. Name your group.
6. Add the test users created in the previous step.

### Restrict your test application to specific users

You can restrict the users in your tenant that are allowed to use your test application to specific users or groups, through user assignment. When you [created an app through App registrations](#create-and-configure-an-app-registration), a representation of your app was created in **Enterprise applications** as well. Use the **Enterprise applications** settings to restrict who can use the application in your tenant.

> [!IMPORTANT]
> If your app is a [multi-tenant app](v2-supported-account-types.md), this operation won't restrict users in other tenants from signing into and using your app. It will only restrict users in the tenant that user assignment is configured in.

For detailed instructions on restricting an app to specific users in a tenant, go to [restricting your app to a set of users](howto-restrict-your-app-to-a-set-of-users.md).

## Next steps

Learn about [throttling and service limits](test-throttle-service-limits.md) you might hit while setting up a test environment.

For more detailed information about test environments, read [Securing Azure environments with Azure Active Directory](https://azure.microsoft.com/resources/securing-azure-environments-with-azure-active-directory/).
