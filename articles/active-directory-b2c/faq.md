---
title: Frequently asked questions (FAQ) for Azure Active Directory B2C
description: Answers to frequently asked questions about Azure Active Directory B2C.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 10/14/2019
ms.author: mimart
ms.subservice: B2C
---

# Azure AD B2C: Frequently asked questions (FAQ)

This page answers frequently asked questions about the Azure Active Directory B2C (Azure AD B2C). Keep checking back for updates.

### Why can't I access the Azure AD B2C extension in the Azure portal?

There are two common reasons for why the Azure AD extension is not working for you. Azure AD B2C requires your user role in the directory to be global administrator. Please contact your administrator if you think you should have access. If you have global administrator privileges, make sure that you are in an Azure AD B2C directory and not an Azure Active Directory directory. You can see instructions for [creating an Azure AD B2C tenant](tutorial-create-tenant.md).

### Can I use Azure AD B2C features in my existing, employee-based Azure AD tenant?

Azure AD and Azure AD B2C are separate product offerings and cannot coexist in the same tenant. An Azure AD tenant represents an organization. An Azure AD B2C tenant represents a collection of identities to be used with relying party applications. By adding **New OpenID Connect provider** under **Azure AD B2C > Identity providers** or with custom policies, Azure AD B2C can federate to Azure AD allowing authentication of employees in an organization.

### Can I use Azure AD B2C to provide social login (Facebook and Google+) into Office 365?

Azure AD B2C can't be used to authenticate users for Microsoft Office 365. Azure AD is Microsoft's solution for managing employee access to SaaS apps and it has features designed for this purpose such as licensing and Conditional Access. Azure AD B2C provides an identity and access management platform for building web and mobile applications. When Azure AD B2C is configured to federate to an Azure AD tenant, the Azure AD tenant manages employee access to applications that rely on Azure AD B2C.

### What are local accounts in Azure AD B2C? How are they different from work or school accounts in Azure AD?

In an Azure AD tenant, users that belong to the tenant sign-in with an email address of the form `<xyz>@<tenant domain>`. The `<tenant domain>` is one of the verified domains in the tenant or the initial `<...>.onmicrosoft.com` domain. This type of account is a work or school account.

In an Azure AD B2C tenant, most apps want the user to sign-in with any arbitrary email address (for example, joe@comcast.net, bob@gmail.com, sarah@contoso.com, or jim@live.com). This type of account is a local account. We also support arbitrary user names as local accounts (for example, joe, bob, sarah, or jim). You can choose one of these two local account types when configuring identity providers for Azure AD B2C in the Azure portal. In your Azure AD B2C tenant, select **Identity providers**, select **Local account**, and then select **Username**.

User accounts for applications can be created through a sign-up user flow, sign-up or sign-in user flow, the Microsoft Graph API, or in the Azure portal.

### Which social identity providers do you support now? Which ones do you plan to support in the future?

We currently support several social identity providers including Amazon, Facebook, GitHub (preview), Google, LinkedIn, Microsoft Account (MSA), QQ (preview), Twitter, WeChat (preview), and Weibo (preview). We evaluate adding support for other popular social identity providers based on customer demand.

Azure AD B2C also supports [custom policies](custom-policy-overview.md). Custom policies allow you to create your own policy for any identity provider that supports [OpenID Connect](https://openid.net/specs/openid-connect-core-1_0.html) or SAML. Get started with custom policies by checking out our [custom policy starter pack](https://github.com/Azure-Samples/active-directory-b2c-custom-policy-starterpack).

### Can I configure scopes to gather more information about consumers from various social identity providers?

No. The default scopes used for our supported set of social identity providers are:

* Facebook: email
* Google+: email
* Microsoft account: openid email profile
* Amazon: profile
* LinkedIn: r_emailaddress, r_basicprofile

### Does my application have to be run on Azure for it work with Azure AD B2C?

No, you can host your application anywhere (in the cloud or on-premises). All it needs to interact with Azure AD B2C is the ability to send and receive HTTP requests on publicly accessible endpoints.

### I have multiple Azure AD B2C tenants. How can I manage them on the Azure portal?

Before opening 'Azure AD B2C' in the left side menu of the Azure portal, you must switch into the directory you want to manage. Switch directories by clicking your identity in the upper right of the Azure portal, then choose a directory in the drop down that appears.

### How do I customize verification emails (the content and the "From:" field) sent by Azure AD B2C?

You can use the [company branding feature](../active-directory/fundamentals/customize-branding.md) to customize the content of verification emails. Specifically, these two elements of the email can be customized:

* **Banner logo**: Shown at the bottom-right.
* **Background color**: Shown at the top.

    ![Screenshot of a customized verification email](./media/faq/company-branded-verification-email.png)

The email signature contains the Azure AD B2C tenant's name that you provided when you first created the Azure AD B2C tenant. You can change the name using these instructions:

1. Sign in to the [Azure portal](https://portal.azure.com/) as the Global Administrator.
1. Open the **Azure Active Directory** blade.
1. Click the **Properties** tab.
1. Change the **Name** field.
1. Click **Save** at the top of the page.

Currently there is no way to change the "From:" field on the email.

### How can I migrate my existing user names, passwords, and profiles from my database to Azure AD B2C?

You can use the Microsoft Graph API to write your migration tool. See the [User migration guide](user-migration.md) for details.

### What password user flow is used for local accounts in Azure AD B2C?

The Azure AD B2C password user flow for local accounts is based on the policy for Azure AD. Azure AD B2C's sign-up, sign-up or sign-in and password reset user flows use the "strong" password strength and don't expire any passwords. For more details, see [Password policies and restrictions in Azure Active Directory](https://docs.microsoft.com/azure/active-directory/authentication/concept-sspr-policy).

For information about account lockouts and passwords, see [Manages threats to resources and data in Azure Active Directory B2C](threat-management.md).

### Can I use Azure AD Connect to migrate consumer identities that are stored on my on-premises Active Directory to Azure AD B2C?

No, Azure AD Connect is not designed to work with Azure AD B2C. Consider using the [Microsoft Graph API](manage-user-accounts-graph-api.md) for user migration. See the [User migration guide](user-migration.md) for details.

### Can my app open up Azure AD B2C pages within an iFrame?

No, for security reasons, Azure AD B2C pages cannot be opened within an iFrame. Our service communicates with the browser to prohibit iFrames. The security community in general and the OAUTH2 specification, recommend against using iFrames for identity experiences due to the risk of click-jacking.

### Does Azure AD B2C work with CRM systems such as Microsoft Dynamics?

Integration with Microsoft Dynamics 365 Portal is available. See [Configuring Dynamics 365 Portal to use Azure AD B2C for authentication](https://docs.microsoft.com/dynamics365/customer-engagement/portals/azure-ad-b2c).

### Does Azure AD B2C work with SharePoint on-premises 2016 or earlier?

Azure AD B2C is not meant for the SharePoint external partner-sharing scenario; see [Azure AD B2B](https://cloudblogs.microsoft.com/enterprisemobility/2015/09/15/learn-all-about-the-azure-ad-b2b-collaboration-preview/) instead.

### Should I use Azure AD B2C or B2B to manage external identities?

Read [Compare B2B collaboration and B2C in Azure AD](../active-directory/b2b/compare-with-b2c.md) to learn more about applying the appropriate features to your external identity scenarios.

### What reporting and auditing features does Azure AD B2C provide? Are they the same as in Azure AD Premium?

No, Azure AD B2C does not support the same set of reports as Azure AD Premium. However there are many commonalities:

* **Sign-in reports** provide a record of each sign-in with reduced details.
* **Audit reports** include both admin activity as well as application activity.
* **Usage reports** include the number of users, number of logins, and volume of MFA.

### Can I localize the UI of pages served by Azure AD B2C? What languages are supported?

Yes, see [language customization](user-flow-language-customization.md). We provide translations for 36 languages, and you can override any string to suit your needs.

### Can I use my own URLs on my sign-up and sign-in pages that are served by Azure AD B2C? For instance, can I change the URL from contoso.b2clogin.com to login.contoso.com?

Not currently. This feature is on our roadmap. Verifying your domain in the **Domains** tab in the Azure portal does not accomplish this goal. However, with b2clogin.com, we offer a [neutral top level domain](b2clogin.md), and thus the external appearance can be implemented without the mention of Microsoft.

### How do I delete my Azure AD B2C tenant?

Follow these steps to delete your Azure AD B2C tenant.

You can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](https://aka.ms/b2cappregtraining).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com/) as the *Subscription Administrator*. Use the same work or school account or the same Microsoft account that you used to sign up for Azure.
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Delete all **User flows (policies)** in your Azure AD B2C tenant.
1. Select **App registrations**, then select the **All applications** tab.
1. Delete all applications that you registered.
1. Delete the **b2c-extensions-app**.
1. Under **Manage**, select **Users**.
1. Select each user in turn (exclude the *Subscription Administrator* user you are currently signed in as). Select **Delete** at the bottom of the page and select **Yes** when prompted.
1. Select **Azure Active Directory** on the left-hand menu.
1. Under **Manage**, select **User settings**.
1. If present, under **LinkedIn account connections**, select **No**, then select **Save**.
1. Under **Manage**, select **Properties**
1. Under **Access management for Azure resources**, select **Yes**, and then select **Save**.
1. Sign out of the Azure portal and then sign back in to refresh your access.
1. Select **Azure Active Directory** on the left-hand menu.
1. On the **Overview** page, select **Delete directory**. Follow the on-screen instructions to complete the process.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com/) as the *Subscription Administrator*. Use the same work or school account or the same Microsoft account that you used to sign up for Azure.
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Delete all the **User flows (policies)** in your Azure AD B2C tenant.
1. Delete all the **Applications (Legacy)** you registered in your Azure AD B2C tenant.
1. Select **Azure Active Directory** on the left-hand menu.
1. Under **Manage**, select **Users**.
1. Select each user in turn (exclude the *Subscription Administrator* user you are currently signed in as). Select **Delete** at the bottom of the page and select **YES** when prompted.
1. Under **Manage**, select **App registrations**.
1. Select **View all applications**
1. Select the application named **b2c-extensions-app**, select **Delete**, and then select **Yes** when prompted.
1. Under **Manage**, select **User settings**.
1. If present, under **LinkedIn account connections**, select **No**, then select **Save**.
1. Under **Manage**, select **Properties**
1. Under **Access management for Azure resources**, select **Yes**, and then select **Save**.
1. Sign out of the Azure portal and then sign back in to refresh your access.
1. Select **Azure Active Directory** on the left-hand menu.
1. On the **Overview** page, select **Delete directory**. Follow the on-screen instructions to complete the process.

* * *

### Can I get Azure AD B2C as part of Enterprise Mobility Suite?

No, Azure AD B2C is a pay-as-you-go Azure service and is not part of Enterprise Mobility Suite.

### How do I report issues with Azure AD B2C?

See [File support requests for Azure Active Directory B2C](support-options.md).
