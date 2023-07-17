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
ms.date: 05/07/2023
ms.author: mimart
ms.custom: it-pro

#Customer intent: As a dev, devops, or it admin, I want to learn about identity solutions for customer-facing apps
---

# What is Microsoft Entra External ID for customers?

Microsoft Entra External ID for customers, also known as Azure Active Directory (Azure AD) for customers, is Microsoft’s new customer identity and access management (CIAM) solution. For organizations and businesses that want to make their public-facing applications available to consumers, Azure AD makes it easy to add CIAM features like self-service registration, personalized sign-in experiences, and customer account management. Because these CIAM capabilities are built into Azure AD, you also benefit from platform features like enhanced security, compliance, and scalability.

:::image type="content" source="media/overview-customers-ciam/overview-ciam.png" alt-text="Diagram showing an overview customer identity and access management." border="false":::

[!INCLUDE [preview-alert](../customers/includes/preview-alert/preview-alert-ciam.md)] 

## Add customized sign-in to your customer-facing apps

Azure AD for customers is intended for businesses that want to make applications available to their customers using the Microsoft Entra platform for identity and access.

- **Add sign-up and sign-in pages to your apps.** Quickly add intuitive, user-friendly sign-up and sign-up experiences for your customer apps. With a single identity, a customer can securely access all the applications you want them to use.

- **Add single sign-on (SSO) with social and enterprise identities.** Customers can choose a social, enterprise, or managed identity to sign in with a username and password, email, or one-time passcode.

- **Add your company branding to the sign-up page.** Customize the look and feel of your sign-up and sign-in experiences, including both the default experience and the experience for specific browser languages.

- **Easily customize and extend your sign-up flows.** Tailor your identity user flows to your needs. Choose the attributes you want to collect from a customer during sign-up, or add your own custom attributes. If the information your app needs is contained in an external system, create custom authentication extensions to collect and add data to authentication tokens.

- **Integrate multiple app languages and platforms.** With Microsoft Entra, you can quickly set up and deliver secure, branded authentication flows for multiple app types, platforms, and languages.

- **Provide self-service account management.** Customers can register for your online services by themselves, manage their profile, delete their account, enroll in a multifactor authentication (MFA) method, or reset their password with no admin or help desk assistance.

Learn more about [adding sign-in and sign-up to your app](concept-planning-your-solution.md) and [customizing the sign-in look and feel](concept-branding-customers.md).

## Manage apps and users in a dedicated customer tenant

Azure AD for customers uses the standard tenant model and overlays it with customized onboarding journeys for workforce or customer scenarios. B2B collaboration is part of workforce configurations. With the introduction of Azure AD for customers, Microsoft Entra now offers two different types of tenants that you can create and manage: *workforce tenants* and *customer tenants*.

A **workforce tenant** contains your employees and the apps and resources that are internal to your organization. If you've worked with Azure Active Directory, a workforce tenant is the type of tenant you're already familiar with. You might already have an existing workforce tenant for your organization.

In contrast, a **customer tenant** represents your customer-facing app, resources, and directory of customer accounts. A customer tenant is distinct and separate from your workforce tenant. A customer tenant is the first resource you need to create to get started with Azure AD for customers. To establish a CIAM solution for a customer-facing app or service, you create a new customer tenant. A customer tenant contains:

- **A directory**: The directory stores your customers' credentials and profile data. When a customer signs up for your app, a local account is created for them in your customer tenant.

- **Application registrations**: Microsoft Entra performs identity and access management only for registered applications. Registering your app establishes a trust relationship and allows you to integrate your app with Microsoft Entra

- **User flows**: The customer tenant contains the self-service sign-up, sign-in, and password reset experiences that you enable for your customers.

- **Extensions**: If you need to add user attributes and data from external systems, you can create custom authentication extensions for your user flows.

- **Sign-in methods**: You can enable various options for signing in to your app, including username and password, one-time passcode, and Google or Facebook identities. Learn more

- **Encryption keys**: Add and manage encryption keys for signing and validating tokens, client secrets, certificates, and passwords.


There are two types of user accounts you can manage in a customer tenant:

- **Customer account**: Accounts that represent the customers who access your applications.

- **Admin account**: Users with work accounts can manage resources in a tenant, and with an administrator role, can also manage tenants. Users with work accounts can create new consumer accounts, reset passwords, block/unblock accounts, and set permissions or assign an account to a security group.

Learn more about managing [customer accounts](how-to-manage-customer-accounts.md) and [admin accounts](how-to-manage-admin-accounts.md) in your customer tenant.

## Design user flows for self-service sign-up

You can create a simple sign-up and sign-in experience for your customers by adding a user flow to your application. The user flow defines the series of sign-up steps customers follow and the sign-in methods they can use (such as email and password, one-time passcodes, or social accounts from [Google](how-to-google-federation-customers.md) or [Facebook](how-to-facebook-federation-customers.md)). You can also collect information from customers during sign-up by selecting from a series of user built-in attributes or adding your own custom attributes.

Several user flow settings let you control how the customer signs up for the application, including:

- Sign-in methods and social identity providers (Google or Facebook)
- Attributes to be collected from the customer signing up, such as first name, postal code, or country/region of residency
- Company branding and language customization

For details about configuring a user flow, see [Create a sign-up and sign-in user flow for customers](how-to-user-flow-sign-up-sign-in-customers.md).

## Add your own business logic

Azure AD for customers is designed for flexibility by allowing you to define additional actions at certain points within the authentication flow. Using a custom authentication extension, you can add claims from external systems to the token just before it's issued to your application.

Learn more about [adding your own business logic](concept-custom-extensions.md)  with custom authentication extensions.


## Microsoft Entra security and reliability

Azure AD for customers represents the convergence of business-to-consumer (B2C) features into the Azure AD platform. You benefit from platform features like enhanced security, compliance with regulations, and the ability to scale your identity and access management processes.

- **Microsoft Entra security.** Get all the security and data privacy benefits of Microsoft Entra, including Conditional Access, multifactor authentication, and governance. Protect access to your apps using strong authentication and risk-based adaptive access policies. Because customers are managed in a separate tenant, you can tailor your access policies to users who typically use personal and shared devices instead of managed ones.

- **Microsoft Entra reliability and scalability**. Create highly customized sign-in experiences and manage customer accounts at a large scale. Ensure a good customer experience by taking advantage of Microsoft Entra performance, resiliency, business continuity, low-latency, and high throughput.

Learn more about the [security and governance](concept-security-customers.md) features that are available in a customer tenant.

## Next steps

- Learn more about [planning for Azure AD for customers](concept-planning-your-solution.md).
- See also the [Azure AD for customers Developer Center](https://aka.ms/ciam/dev) for the latest developer content and resources.
