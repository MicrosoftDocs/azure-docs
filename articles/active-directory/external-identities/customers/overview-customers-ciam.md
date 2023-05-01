---
title: Overview - Customer identity access management (CIAM)
description: Learn about customer identity access management (CIAM), a solution that lets you create secure, customized sign-in experiences for your customer-facing apps and services.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: overview
ms.date: 04/17/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about identity solutions for customer-facing apps
---

# What is Azure Active Directory for customers?

Azure Active Directory (Azure AD) for customers is a seamless way to add secure, customized sign-in to your customer-facing apps. For businesses that want to provide their customers with apps for buying products, subscribing to services, or accessing their account data, Microsoft Entra offers robust customer identity and access management (CIAM). This built-in solution lets you easily integrate your apps and get all the security, reliability, and scalability benefits of Microsoft Entra.

:::image type="content" source="media/overview-customers-ciam/overview-ciam.png" alt-text="Diagram showing an overview customer identity and access management." border="false":::

> [!IMPORTANT]
> Azure AD for customers is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Add customized sign-in to your customer-facing apps

Azure AD for customers is intended for businesses that want to make applications available to their customers using the Microsoft Entra platform for identity and access.

- **Add sign-up and sign-in pages to your apps.** Quickly add intuitive, user-friendly sign-up and sign-up experiences for your customer apps. With a single identity, a customer can securely access all the applications you want them to use.

- **Add single sign-on (SSO) with social and enterprise identities.** Customers can choose a social, enterprise, or managed identity to sign in with a username and password, email, or one-time passcode.

- **Add your company branding to the sign-up page.** Customize the look and feel of your sign-up and sign-in experiences, including both the default experience and the experience for specific browser languages.

- **Easily customize and extend your sign-up flows.** Tailor your identity user flows to your needs. Choose the attributes you want to collect from a customer during sign-up, or add your own custom attributes. If the information your app needs is contained in an external system, create custom authentication extensions to collect and add data to authentication tokens.

- **Integrate multiple app languages and platforms.** With Microsoft Entra, you can quickly set up and deliver secure, branded authentication flows for multiple app types, platforms, and languages.

- **Provide self-service account management.** Customers can register for your online services by themselves, manage their profile, delete their account, enroll in a multifactor authentication (MFA) method, or reset their password with no admin or help desk assistance.

Learn more about [adding sign-in and sign-up to your app](concept-planning-your-solution.md) and [customizing the sign-in look and feel](concept-branding-customers.md). 

## Create custom extensions to the authentication flow

Azure AD for customers is designed for flexibility. In addition to the built-in authentication events within a sign-up and sign-in user flow, you can define additional actions for events at various points within the authentication flow.

- **Use custom authentication extensions to enrich tokens**.  Add claims from external systems to the application token just before the token is issued to the application.

- **Add logic to attribute collection**. Define validation actions at the start of attribute collection or just before attribute submission.

Learn more about [custom authentication extensions](concept-custom-extensions.md).

## Manage customer accounts throughout the lifecycle

A customer tenant, separate from your workforce tenant, represents your customer-facing app, resources, and directory of customer accounts.

- **Manage accounts and resources in a dedicated customer tenant.** Create a tenant specifically for your customer-facing apps and services. Register your customer-facing apps in this tenant, and manage customer identities and access in the dedicated directory, separate from your workforce tenant.

Learn more about managing [customer accounts](how-to-manage-customer-accounts.md) and [admin accounts](how-to-manage-admin-accounts.md) in your customer tenant.

## Get the benefits of Microsoft Entra and Azure Active Directory

Azure AD for customers represents the convergence of business-to-consumer (B2C) features into the Microsoft Entra platform. Because it's built on Microsoft Entra and Azure Active Directory, so you benefit from the advantages offered by these platforms.

- **Microsoft Entra security.** Get all the security and data privacy benefits of Microsoft Entra, including Conditional Access, multifactor authentication, and governance. Protect access to your apps using strong authentication and risk-based adaptive access policies. Because customers are managed in a separate tenant, you can tailor your access policies to users who typically use personal and shared devices instead of managed ones.

- **Microsoft Entra reliability and scalability**. Create highly customized sign-in experiences and manage customer accounts at a large scale. Ensure a good customer experience by taking advantage of Microsoft Entra performance, resiliency, business continuity, low-latency, and high throughput.

Learn more about [security and governance](concept-security-customers.md) features available in your customer tenant.
## Next steps

Learn more about [planning for Azure AD for customers](concept-planning-your-solution.md). 

