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

:::image type="content" source="media/overview-customers-ciam/overview-diagram.png" alt-text="Diagram showing an overview customer identity and access management." border="false":::

## Customer identity and access management features

- **Add sign-up and sign-in pages to your apps.** Quickly add intuitive, user-friendly sign-up and sign-up experiences for your customer apps. With a single identity, a customer can securely access all the applications you permit them to use.

- **Add single sign-on (SSO) with social and enterprise identities.** Customers can choose a social, enterprise, or managed identity to sign in with a username and password, email, or one-time passcode.

- **Add your company branding to the sign-up page.** Customize the look and feel of your sign-up and sign-in experiences, including both the default experience and the experience for specific browser languages.

- **Easily customize and extend your sign-up flows.** Tailor your identity user flows to your needs. Choose the attributes you want to collect from a customer during sign-up, or add your own custom attributes. If the information your app needs is contained in an external system, create custom authentication extensions to collect and add data to authentication tokens.

- **Integrate multiple app languages and platforms** With Microsoft Entra, you can quickly set up and deliver secure, branded authentication flows for multiple app types, platforms, and languages.

- **Provide self-service account management.** Customers can register for your online services by themselves, manage their profile, delete their account, enroll in a multifactor authentication (MFA) method, or reset their password with no admin or help desk assistance.

- **Manage accounts and resources in a dedicated customer tenant.** Create a tenant specifically for your customer-facing apps and services. Register your customer-facing apps in this tenant, and manage customer identities and access in the dedicated directory, separate from your workforce tenant.

- **Microsoft Entra security.** Get all the security and data privacy benefits of Microsoft Entra, including Conditional Access, multifactor authentication, and governance. Protect access to your apps using strong authentication and risk-based adaptive access policies. Because customers are managed in a separate tenant, you can tailor your access policies to users who typically use personal and shared devices instead of managed ones.

- **Microsoft Entra reliability and scalability**. Create highly customized sign-in experiences and manage customer accounts at a large scale. Ensure a good customer experience by taking advantage of Microsoft Entra performance, resiliency, business continuity, low-latency, and high throughput.


> [!IMPORTANT]
> Customer identity and access management (CIAM) is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Technical overview of Azure AD for customers

Azure AD for customers represents the convergence of business-to-consumer (B2B) features into the Microsoft Entra platform. This solution is specifically intended for businesses that want to make applications available to their customers, while using the Microsoft Entra platform for identity and access.

### Microsoft Entra workforce and customer tenants

With the introduction of Azure AD for customers, Microsoft Entra now offers two different types of tenants that you can create and manage:

- A **workforce tenant** contains your employees and the apps and resources that are internal to your organization. If you've worked with Azure Active Directory, this is the type of tenant you're already familiar with. You might already have an existing workforce tenant for your organization. 

- A **customer tenant** represents your customer-facing app, resources, and directory of customer accounts. A customer tenant is distinct and separate from your workforce tenant.

### Components of a customer tenant

A customer tenant is the first resource you need to create to get started with Azure AD for customers. To establish a CIAM solution for a customer-facing app or service, you create a new customer tenant. A customer tenant contains:

- **A directory**: The directory stores your users' credentials and profile data. When a user signs up for your app, a local account is created for the user in your customer tenant.

- **Application registrations**: Microsoft Entra performs identity and access management only for registered applications. Registering your app establishes a trust relationship and allows you to integrate your app with Microsoft Entra

- **User flows**: The customer tenant contains the self-service sign-up, sign-in, and password reset experiences that you enable for your customers.

- **Extensions**: If you need to add user attributes and data from external systems, you can create custom authentication extensions for your user flows.

- **Sign-in methods**: You can enable various options for signing in to your app, including username and password, one-time passcode, and Google or Facebook identities.

- **Encryption keys** Add and manage encryption keys for signing and validating tokens, client secrets, certificates, and passwords.

### Customer and admin accounts

A customer tenant contains two types of user accounts:

- **Customer account**: Accounts that are managed by Azure AD B2C user flows and custom policies.

- **Admin account**: Users with work accounts can manage resources in a tenant, and with an administrator role, can also manage tenants. Users with work accounts can create new consumer accounts, reset passwords, block/unblock accounts, and set permissions or assign an account to a security group.

## Microsoft Entra security features

The Microsoft Entra platform helps IT protect access to applications and resources. By taking advantage of the security benefits of Microsoft Entra, you can provide SSO access to your applications. If you want to make multiple apps available, SSO allows a customer to sign in once with a single account and get access to all apps, whether they're web, mobile, or single page applications.

You can also enable application access security by enforcing multifactor authentication, which adds a critical second layer of security to user sign-ins by requiring verification via email one-time passcode.