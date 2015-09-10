<properties
	pageTitle="Azure AD B2C preview | Microsoft Azure"
	description="Frequently asked questions on Azure AD B2C"
	services="active-directory"
	documentationCenter=""
	authors="swkrish"
	manager="msmbaldwin"
	editor="curtand"/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="09/08/2015"
	ms.author="swkrish"/>

# Azure AD B2C preview: FAQs

This page answers frequently asked questions about the Azure AD B2C preview. Keep checking back for updates.

### Can I use Azure AD B2C features in my existing, employee-based Azure AD directory?

Currently Azure AD B2C features can't be turned on in your existing Azure AD directory. It is recommended that you create a separate directory to use Azure AD B2C features, i.e., to manage your consumers.

### Can I use Azure AD B2C to provide social login (Facebook & Google+) into Office 365?

Azure AD B2C can't be used with Office 365. In general, it can't be used to provide authentication to SaaS apps (Salesforce, Workday, etc.). It provides identity and access management for consumer-facing web & mobile applications, and is not meant for employee or partner scenarios.

### What are "local accounts" in Azure AD B2C? How are they different from "work or school accounts" in Azure AD?

In an Azure AD directory, every user in the directory signs in with an email address of the form `<xyz>@<directory domain>` where `<directory domain>` is one of the verified domains in the directory or the initial `<...>.onmicrosoft.com` domain. This type of account is a "work or school account", also referred to as an "organizational account".

In an Azure AD B2C directory, most apps want the user to sign in with any arbitrary email address (e.g., joe@comcast.net, bob@gmail.com, sarah@contoso.com or jim@live.com). This type of account is a "local account". Today, we also support arbitrary usernames (just plain strings) as local accounts (e.g., joe, bob, sarah or jim). You can choose one of these two local account "types" in the Azure AD B2C service.

### What social identity providers do you support now? Which ones do you plan to support in the future?

We currently support Facebook, Google+, LinkedIn and Amazon. We will continue to add support for Microsoft Account and other popular social identity providers based on customer demand.

### Can I configure 'scopes' to gather more information about users from various social identity providers?

No, but this feature is on our roadmap. The default set of scopes for our supported social identity providers are as follows:

- Facebook:
- Google+:
- Amazon:
- LinkedIn: 

### Does my application have to be hosted on Azure for it work with Azure AD B2C?

No, you can host your application anywhere (in the cloud or on-premises). All it needs to interact with Azure AD B2C is the ability to send and recieve HTTP requests on publicly-accessible endpoints.

### I have multiple Azure AD B2C directories. How can I manage them on the Azure Portal?

Each Azure AD B2C directory has its own B2C features blade on the Azure Portal. Read [here]((active-directory-b2c-app-registration.md#navigate-to-the-b2c-features-blade-on-the-azure-portal)) on how you can navigate to a specific directory's B2C features blade on the Azure Portal. Switching between Azure AD B2C directories on the Azure Portal will not keep your B2C features blade open on most browsers.

### How do I customize verification emails (content and the sender, i.e., <From:>, field) sent by Azure AD B2C?

Read [this article on UI customization](active-directory-b2c-reference-ui-customization.md) for more details.

### How can I migrate my existing usernames, passwords & profiles from my database to Azure AD B2C?

You can use Azure AD Graph API (see our sample [here](active-directory-b2c-devquickstarts-graph-dotnet.md)) to write your migration tool. We will provide various migration options and tools out-of-the-box in the future.

### Can I use Azure AD Connect to migrate consumer identities stored on my on-premises Active Directory to Azure AD B2C?

No, Azure AD Connect is not designed to work with Azure AD B2C. We will provide various migration options and tools out-of-the-box in the future.

### Does Azure AD B2C work with CRM systems such as Microsoft Dynamics?

Not currently. Integrating these systems is on our roadmap.

### Does Azure AD B2C work with SharePoint On-Prem 2016 or older?

Not currently. Azure AD B2C doesn't have support for SAML 1.1 tokens.

### What reporting and auditing features does Azure AD B2C provide? Is it the same as Azure AD Premium's?

No, Azure AD B2C does not support the same set of reports as Azure AD Premium. Azure AD B2C will be releasing basic reporting and auditing APIs soon.

### Can I localize the UI of pages served by Azure AD B2C? What languages are supported?

Currently, Azure AD B2C is optimized for English only. We plan to roll out localization features as soon as possible.

### Can I use my own URLs on my sign-up & sign-in pages served by Azure AD B2C? For e.g., change the URLs from login.microsoftonline.com to login.contoso.com?

Not currently. But this feature is on our roadmap.

### Can I get Azure AD B2C as part of Enterprise Mobility Suite (EMS)?

No, Azure AD B2C is a pay-as-you-go Azure service and is not part of EMS.

### How do I report issues with Azure AD B2C?

Check out [this support topic](active-directory-b2c-support.md) on Azure AD B2C.

### When will Azure AD B2C be generally available?

We can't provide any information on the generally available date at this time.
