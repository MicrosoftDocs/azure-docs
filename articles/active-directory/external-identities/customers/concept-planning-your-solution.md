---
title: Plan CIAM deployment
description: Learn how to plan your CIAM deployment.
services: active-directory
author: csmulligan
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 05/03/2023
ms.author: cmulligan
ms.custom: it-pro

---

# Planning for customer identity and access management

Azure AD for customers offers a customizable and extensible solution for integrating your customer-facing applications with Azure AD. Because Azure AD for customers is built on the Microsoft Entra platform, you benefit from consistency in app integration, tenant management, and operations across your workforce and customer scenarios. When designing your configuration, it's important to understand the components of a customer tenant and the Azure AD features that are available for your customer scenarios.

This article provides a general framework for integrating your app and configuring Azure AD for customers. It describes the capabilities available in a customer tenant and outlines the important planning considerations.

## Integrating your app with Azure AD for customers

Adding secure sign-in to your app and setting up a customer identity and access management involves four general steps.

:::image type="content" source="media/concept-planning-your-solution/overview-setup-steps-inline.png" alt-text="Diagram showing an overview of setup steps." lightbox="media/concept-planning-your-solution/overview-setup-steps-expanded.png" border="false":::

| Step | Action | Description |
|---------|---------|---------|
|**1**     |      **Create a customer tenant**   | [Create a customer tenant](https://aka.ms/ciam-free-trial) in the Microsoft Entra admin center. You can set your correct geographic location and your domain name at this step. |
|**2**     |      **Register your application**   | In the Microsoft Entra admin center, [register your application](how-to-register-ciam-app.md) with Azure Active Directory.    |
|**3**     |    **Integrate a sign-in flow with your app**     | - [Create a user flow](how-to-user-flow-sign-up-sign-in-customers.md) </br>- Associate the app with the user flow </br>- Update the app code with your customer tenant info </br>See [Samples and guidance by app type and language](samples-ciam-all.md)   |
|**4**     |    **Customize and secure your sign-in**     |  - [Customize branding](concept-branding-customers.md) </br>- [Add identity providers](concept-authentication-methods-customers.md)  </br>- [Add attributes to collect](how-to-define-custom-attributes.md) </br>- Map claims to your token </br>- [Add multifactor authentication](concept-security-customers.md) </br>- Use [custom authentication extensions](concept-custom-extensions.md) if you want to extend the authentication flow   |

The rest of this article explains each of these steps in more detail and outlines important planning considerations.

## Step 1: Create a customer tenant

:::image type="content" source="media/concept-planning-your-solution/overview-setup-step-1.png" alt-text="Diagram showing step 1 in the setup flow." border="false":::

A customer tenant is the first resource you need to create to get started with Azure AD for customers. A customer tenant, separate from your workforce tenant, represents your customer-facing app, resources, and directory of customer accounts. You create a tenant specifically for your customer-facing apps and services, and you manage accounts and resources in the dedicated customer tenant. Register your customer-facing apps in this tenant, and manage customer identities and access in the dedicated directory, separate from your workforce tenant.

> [!NOTE]
> If you don't have an Azure AD account and want to try out Azure AD for customers, you can [start a free trial](https://aka.ms/ciam-free-trial).

Following are some planning considerations for your new customer tenant:

- When you create a customer tenant, you can set your correct geographic location and your domain name.
- This new workforce and customer tenant model won't affect your already existing B2C tenants.
- There are two types of users in a customer tenant: admin and customer. You can [create and manage admin accounts](how-to-manage-admin-accounts.md) for your customer tenant. Customer accounts are generally created through self-service sign-up, but you can [create and manage customer local accounts](how-to-manage-customer-accounts.md).
- Customer accounts have a [default set of permissions](reference-user-permissions.md). Customers are restricted from accessing information about other users in the customer tenant. By default, customers can’t access information about other users, groups, or devices.

**To create a customer tenant**:

- If you don't already have an Azure AD tenant, we recommend using the [get started experience](https://aka.ms/ciam-free-trial). 
- Otherwise, you can [create a customer tenant](https://aka.ms/ciam-free-trial) in the Microsoft Entra admin center. You can set your correct geographic location and your domain name at this step.

## Step 2: Register your application

:::image type="content" source="media/concept-planning-your-solution/overview-setup-step-2.png" alt-text="Diagram showing step 2 in the setup flow." border="false":::

Before your applications can interact with Azure AD for customers, you need to register them in your customer tenant. Microsoft Entra performs identity and access management only for registered applications. [Registering your app](how-to-register-ciam-app.md) establishes a trust relationship and allows you to integrate your app with Azure Active Directory for customers.

Following are some planning considerations for app registration:

- Azure AD for customers supports authentication for various modern application architectures, including web apps, single-page apps (SPAs), web APIs, and more. The interaction of each application type with the customer tenant is different, therefore, you must specify the type of application you want to register.

- We provide code sample guides and in-depth integration guides for several app types and languages. Depending on the type of app you want to register, you can find guidance on our [Samples by app type and language page](samples-ciam-all.md).

**To register your application**:

- Find guidance specific to the application you want to register on our [Samples by app type and language page](samples-ciam-all.md).
- Or, refer to the general instructions for [registering an application](how-to-register-ciam-app.md) in a customer tenant.

## Step 3: Integrate a sign-in flow with your app

:::image type="content" source="media/concept-planning-your-solution/overview-setup-step-3.png" alt-text="Diagram showing step 3 in the setup flow." border="false":::

Next, create a sign-up and sign-in user flow and associate it with your application. When a user attempts to sign in, the application sends an authorization request to the endpoint you provided when you associated the app with the user flow. The user flow defines and controls the customer's experience. When the customer completes the sign-up user flow, Azure AD generates a token and redirects the customer back to your application. Upon completion of sign-up, a customer account is created for the customer in the directory.

Following are some planning considerations for integrating a user flow:

- Each application can have just one sign-up and sign-in user flow.
- If you have several applications, you can use a single user flow for all of them. Or, if you want a different experience for each application, you can create multiple user flows.
- If you set company branding before you create the user flow, the sign in pages will reflect that branding. Otherwise, the sign in pages will reflect the neutral branding.
- In the user flow settings, you can select from a set of built-in attributes you want to collect from customers on the sign-up page, for example, display name, given name, and surname. These attributes are stored with the customer's profile in your directory. If you need to collect more information, you can create custom attributes to add to your user flow.
- You can set up social identity providers [Google](how-to-google-federation-customers.md) and [Facebook](how-to-facebook-federation-customers.md) and use them in your self-service sign-up user flows.
- In this setup flow, we describe integrating the user flow with your app in Step 3, and then updating the company branding and language customizations in step 4. But you can customize your user flow and company branding anytime, either before or after you integrate an app with a user flow.
- You can enrich the token with claims from external systems using a custom extension, as described in the Extensibility options section in Step 4.

**To integrate a sign-in flow with your app**:

- [Create a sign-up and sign-in user flow for customers](how-to-user-flow-sign-up-sign-in-customers.md).

- [Create custom attributes](how-to-define-custom-attributes.md) if you want to collect information from customer beyond the built-in attributes, and select them in your user flow.

## Step 4: Customize and secure your sign-in

:::image type="content" source="media/concept-planning-your-solution/overview-setup-step-4.png" alt-text="Diagram showing step 4 in the setup flow." border="false":::

Following are planning considerations for configuring company branding, language customizations, and custom extensions:

- **Company branding**. After creating a new customer tenant, you can customize the appearance of your web-based applications for customers who sign in or sign up, to personalize their end-user experience. In Azure AD, the default Microsoft branding will appear in your sign-in pages before you customize any settings. This branding represents the global look and feel that applies across all sign-ins to your tenant. Learn more about [customizing the sign-in look and feel](concept-branding-customers.md).

- **Extending the authentication token claims**. Azure AD for customers is designed for flexibility. You can use a custom authentication extension to add claims from external systems to the application token just before the token is issued to the application. Learn more about [custom authentication extensions](concept-custom-extensions.md).

- **Multifactor authentication (MFA)**. You can also enable application access security by enforcing MFA, which adds a critical second layer of security to user sign-ins by requiring verification via email one-time passcode. Learn more about [MFA for customers](concept-security-customers.md#multifactor-authentication).

- **Security and governance**. Learn about [security and governance](concept-security-customers.md) features available in your customer tenant, such as Identity Protection and Identity Governance.

## Next steps
- [Start a free trial](https://aka.ms/ciam-free-trial) or [create your customer tenant](how-to-create-customer-tenant-portal.md).
- [Find samples and guidance for integrating your app](samples-ciam-all.md).
- See also the [Azure AD for customers Developer Center](https://aka.ms/ciam/dev) for the latest developer content and resources.
