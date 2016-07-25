<properties
	pageTitle="Azure Active Directory B2C: FAQs | Microsoft Azure"
	description="Frequently asked questions about Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="bryanla"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/24/2016"
	ms.author="swkrish"/>

# Azure Active Directory B2C: FAQs

This page answers frequently asked questions about the Azure Active Directory (Azure AD) B2C. Keep checking back for updates.

### Can I use Azure AD B2C features in my existing, employee-based Azure AD tenant?

Currently Azure AD B2C features can't be turned on in your existing Azure AD tenant. We recommend that you create a separate tenant to use Azure AD B2C features to manage your consumers.

### Can I use Azure AD B2C to provide social login (Facebook and Google+) into Office 365?

Azure AD B2C can't be used with Microsoft Office 365. In general, it can't be used to provide authentication to any SaaS apps (Office 365, Salesforce, Workday, etc.). It provides identity and access management only for consumer-facing web and mobile applications, and is not applicable to employee or partner scenarios.

### What are local accounts in Azure AD B2C? How are they different from work or school accounts in Azure AD?

In an Azure AD tenant, every user in the tenant (except users with existing Microsoft accounts) signs in with an email address of the form `<xyz>@<tenant domain>`, where `<tenant domain>` is one of the verified domains in the tenant or the initial `<...>.onmicrosoft.com` domain. This type of account is a work or school account.

In an Azure AD B2C tenant, most apps want the user to sign in with any arbitrary email address (for example, joe@comcast.net, bob@gmail.com, sarah@contoso.com, or jim@live.com). This type of account is a local account. Today, we also support arbitrary user names (just plain strings) as local accounts (for example, joe, bob, sarah, or jim). You can choose one of these two local account types in the Azure AD B2C service.

### Which social identity providers do you support now? Which ones do you plan to support in the future?

We currently support Facebook, Google+, LinkedIn, and Amazon. We will add support for other popular social identity providers based on customer demand.

### Can I configure scopes to gather more information about consumers from various social identity providers?

No, but this feature is on our roadmap. The default scopes used for our supported set of social identity providers are:

- Facebook: email
- Google+: email
- Microsoft account: openid email profile
- Amazon: profile
- LinkedIn: r_emailaddress, r_basicprofile

### Does my application have to be run on Azure for it work with Azure AD B2C?

No, you can host your application anywhere (in the cloud or on-premises). All it needs to interact with Azure AD B2C is the ability to send and receive HTTP requests on publicly-accessible endpoints.

### I have multiple Azure AD B2C Tenants. How can I manage them on the Azure Portal?

Each Azure AD B2C tenant has its own B2C features blade on the Azure portal. See [Azure AD B2C: Register your application](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade) to learn how you can navigate to a specific tenant's B2C features blade on the Azure portal. Switching between Azure AD B2C directories on the Azure portal will not keep your B2C features blade open on most browsers.

### How do I customize verification emails (the content and the "From:" field) sent by Azure AD B2C?

Use the [company branding feature](../active-directory/active-directory-add-company-branding.md) to customize the content of verification emails. The "From:" field can be changed via Support.

### How can I migrate my existing user names, passwords, and profiles from my database to Azure AD B2C?

You can use the Azure AD Graph API to write your migration tool. See the [Graph API sample](active-directory-b2c-devquickstarts-graph-dotnet.md) for details. We will provide various migration options and tools out-of-the-box in the future.

### What password policy is used for local accounts in Azure AD B2C?

The Azure AD B2C password policy for local accounts is based on the policy for Azure AD. Azure AD B2C's sign-up, sign-up or sign-in and password reset policies uses the "strong" password strength and doesn't expire any passwords. Read the [Azure AD password policy](https://msdn.microsoft.com/library/azure/jj943764.aspx) for more details.

### Can I use Azure AD Connect to migrate consumer identities that are stored on my on-premises Active Directory to Azure AD B2C?

No, Azure AD Connect is not designed to work with Azure AD B2C. We will provide various migration options and tools out-of-the-box in the future.

### Does Azure AD B2C work with CRM systems such as Microsoft Dynamics?

Not currently. Integrating these systems is on our roadmap.

### Does Azure AD B2C work with SharePoint on-premises 2016 or earlier?

Not currently. Azure AD B2C doesn't have support for SAML 1.1 tokens that portals and e-commerce applications built on SharePoint on-premises need. Note that Azure AD B2C is not meant for the SharePoint external partner-sharing scenario; see [Azure AD B2B](http://blogs.technet.com/b/ad/archive/2015/09/15/learn-all-about-the-azure-ad-b2b-collaboration-preview.aspx) instead.

### Should I use Azure AD B2C or B2B to manage external identities?

Read this article about [external identities](../active-directory/active-directory-b2b-compare-external-identities.md) to learn more about applying the appropriate features to your external identity scenarios.

### What reporting and auditing features does Azure AD B2C provide? Are they the same as in Azure AD Premium?

No, Azure AD B2C does not support the same set of reports as Azure AD Premium. Azure AD B2C will be releasing basic reporting and auditing APIs soon.

### Can I localize the UI of pages served by Azure AD B2C? What languages are supported?

Currently, Azure AD B2C is optimized for English only. We plan to roll out localization features as soon as possible.

### Can I use my own URLs on my sign-up and sign-in pages that are served by Azure AD B2C? For instance, can I change the URL from login.microsoftonline.com to login.contoso.com?

Not currently. This feature is on our roadmap. Also note that verifying your domain in the **Domains** tab of your tenant on the Azure classic portal will not do this.

### How do I delete my Azure AD B2C tenant?

Follow these steps to delete your Azure AD B2C tenant:

- Follow these steps to [navigate to the B2C features blade](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade) on the Azure portal.
- Navigate to the **Applications**, **Identity providers** and **All policies** blades and delete all the entries in each of them.
- Now sign in to the [Azure classic portal](https://manage.windowsazure.com/) as the Subscription Administrator. (This is the same work or school account or the same Microsoft account that you used to sign up for Azure.)
- Navigate to the Active Directory extension on the left and click your B2C tenant.
- Click the **Users** tab.
- Select each user in turn (exclude the user you are currently signed in as, i.e., the Subscription Administrator). Click **Delete** at the bottom of the page and click **YES** when prompted.
- Click the **Applications** tab.
- Select **Applications my company owns** in the **Show** drop-down field and click on the check mark.
- You'll see an application called **b2c-extensions-app** listed below. Click **Delete** at the bottom of the page and click **YES** when prompted.
- Navigate to the Active Directory extension again and select your B2C tenant.
- Click **Delete** at the bottom of the page. Follow the instructions on the screen to complete the process.

### Can I get Azure AD B2C as part of Enterprise Mobility Suite?

No, Azure AD B2C is a pay-as-you-go Azure service and is not part of Enterprise Mobility Suite.

### How do I report issues with Azure AD B2C?

See [File support requests for Azure Active Directory B2C](active-directory-b2c-support.md).

### When will Azure AD B2C be generally available?

We can't provide any information on the generally available date at this time.

## More information

You also might want to review current [service limitations, restrictions, and constraints](active-directory-b2c-limitations.md).
