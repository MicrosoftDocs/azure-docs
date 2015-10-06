<properties
	pageTitle="Azure Active Directory B2C preview: FAQs | Microsoft Azure"
	description="Frequently asked questions about Azure Active Directory B2C"
	services="active-directory-b2c"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory-b2c"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/22/2015"
	ms.author="swkrish"/>

# Azure Active Directory B2C preview: FAQs

This page answers frequently asked questions about the Azure Active Directory (AD) B2C preview. Keep checking back for updates.

[AZURE.INCLUDE [active-directory-b2c-preview-note](../../includes/active-directory-b2c-preview-note.md)]

### Can I use Azure AD B2C in my existing, Employee-based Azure AD Directory?

Currently Azure AD B2C features can't be turned on in your existing Azure AD directory. It is recommended that you create a separate directory to use Azure AD B2C features, i.e., to manage your consumers.

### Can I use Azure AD B2C to provide Social Login (Facebook & Google+) into Office 365?

Azure AD B2C can't be used with Office 365. In general, it can't be used to provide authentication to SaaS apps (Salesforce, Workday, etc.). It provides identity and access management for consumer-facing web & mobile applications, and is not meant for employee or partner scenarios.

### What are "Local Accounts" in Azure AD B2C? How are they different from "Work or School Accounts" in Azure AD?

In an Azure AD directory, every user in the directory (except users with existing Microsoft Accounts) signs in with an email address of the form `<xyz>@<directory domain>` where `<directory domain>` is one of the verified domains in the directory or the initial `<...>.onmicrosoft.com` domain. This type of account is a "work or school account", also referred to as an "organizational account".

In an Azure AD B2C directory, most apps want the user to sign in with any arbitrary email address (example, joe@comcast.net, bob@gmail.com, sarah@contoso.com or jim@live.com). This type of account is a "local account". Today, we also support arbitrary usernames (just plain strings) as local accounts (example, joe, bob, sarah or jim). You can choose one of these two local account "types" in the Azure AD B2C service.

### Which Social Identity Providers do you support now? Which ones do you plan to support in the future?

We currently support Facebook, Google+, LinkedIn and Amazon. We will add support for Microsoft Account and other popular social identity providers based on customer demand.

### Can I configure 'Scopes' to gather more Information about Consumers from various Social Identity Providers?

No, but this feature is on our roadmap. The default scopes used for our supported set of social identity providers are:

- Facebook: email
- Google+: email
- Amazon: profile
- LinkedIn: r_emailaddress r_basicprofile

### Does my Application have to be run on Azure for it work with Azure AD B2C?

No, you can host your application anywhere (in the cloud or on-premises). All it needs in order to interact with Azure AD B2C is the ability to send and recieve HTTP requests on publicly-accessible endpoints.

### I have multiple Azure AD B2C Directories. How can I manage them on the Azure Preview Portal?

Each Azure AD B2C directory has its own B2C features blade on the Azure preview portal. Read [here](active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade) on how you can navigate to a specific directory's B2C features blade on the Azure preview portal. Switching between Azure AD B2C directories on the Azure preview portal will not keep your B2C features blade open on most browsers.

### How do I customize Verification Emails (the content and the sender field, i.e., the "From:" field) sent by Azure AD B2C?

Read [this article on UI customization](active-directory-b2c-reference-ui-customization.md) for more details.

### How can I Migrate my existing Usernames, Passwords & Profiles from my Database to Azure AD B2C?

You can use Azure AD Graph API (see our sample [here](active-directory-b2c-devquickstarts-graph-dotnet.md)) to write your migration tool. We will provide various migration options and tools out-of-the-box in the future.

### Can I use Azure AD Connect to Migrate Consumer Identities stored on my On-premises Active Directory to Azure AD B2C?

No, Azure AD Connect is not designed to work with Azure AD B2C. We will provide various migration options and tools out-of-the-box in the future.

### Does Azure AD B2C work with CRM systems such as Microsoft Dynamics?

Not currently. Integrating these systems is on our roadmap.

### Does Azure AD B2C work with SharePoint On-Premises 2016 or older?

Not currently. Azure AD B2C doesn't have support for SAML 1.1 tokens that portals / e-commerce applications built on SP on-premises needs. Note that Azure AD B2C is not meant for the Sharepoint external partner sharing scenario; see [Azure AD B2B](http://blogs.technet.com/b/ad/archive/2015/09/15/learn-all-about-the-azure-ad-b2b-collaboration-preview.aspx) instead.

### What Reporting and Auditing features does Azure AD B2C provide? Is it the same as Azure AD Premium's?

No, Azure AD B2C does not support the same set of reports as Azure AD Premium. Azure AD B2C will be releasing basic reporting and auditing APIs soon.

### Can I localize the UI of pages served by Azure AD B2C? What Languages are supported?

Currently, Azure AD B2C is optimized for English only. We plan to roll out localization features as soon as possible.

### Can I use my own URLs on my Sign-up & Sign-in pages served by Azure AD B2C? For instance, change the URLs from login.microsoftonline.com to login.contoso.com?

Not currently. But this feature is on our roadmap.

### Can I get Azure AD B2C as part of Enterprise Mobility Suite (EMS)?

No, Azure AD B2C is a pay-as-you-go Azure service and is not part of EMS.

### How do I report issues with Azure AD B2C?

Check out [this support topic](active-directory-b2c-support.md) on Azure AD B2C.

### When will Azure AD B2C be Generally Available?

We can't provide any information on the generally available date at this time.

## More Information

You also might want to review current [preview limitations, restrictions and constraints](active-directory-b2c-limitations.md).
