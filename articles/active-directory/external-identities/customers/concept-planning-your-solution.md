---
title: Plan CIAM deployment
description: Learn how to plan your CIAM deployment.
services: active-directory
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.subservice: ciam
ms.topic: conceptual
ms.date: 05/31/2023
ms.author: mimart
ms.custom: it-pro

---

# Planning for customer identity and access management (preview)

Microsoft Entra ID for customers is a customizable, extensible solution for adding customer identity and access management (CIAM) to your app. Because it's built on the Microsoft Entra platform, you benefit from consistency in app integration, tenant management, and operations across your workforce and customer scenarios. When designing your configuration, it's important to understand the components of a customer tenant and the Microsoft Entra features that are available for your customer scenarios.

[!INCLUDE [preview-alert](../customers/includes/preview-alert/preview-alert-ciam.md)]

This article provides a general framework for integrating your app and configuring Microsoft Entra ID for customers. It describes the capabilities available in a customer tenant and outlines the important planning considerations for each step in your integration.

Adding secure sign-in to your app and setting up a customer identity and access management involves four main steps:

:::image type="content" source="media/concept-planning-your-solution/overview-setup-steps-inline.png" alt-text="Diagram showing an overview of setup steps." border="false":::

This article describes each of these steps and outlines important planning considerations. In the following table, select a **Step** for details and planning considerations, or go directly to the **How-to guides**.


| Step  |  How-to guides |
|---------|---------|
|**[Step 1: Create a customer tenant](#step-1-create-a-customer-tenant)**   | &#8226; [Create a customer tenant](how-to-create-customer-tenant-portal.md)</br>&#8226; <a href="https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl" target="_blank">Or start a free trial</a>  |
|**[Step 2: Register your application](#step-2-register-your-application)**   | &#8226; [Register your application](how-to-register-ciam-app.md)  |
|**[Step 3: Integrate a sign-in flow with your app](#step-3-integrate-a-sign-in-flow-with-your-app)**     | &#8226; [Create a user flow](how-to-user-flow-sign-up-sign-in-customers.md) </br>&#8226; [Add your app to the user flow](how-to-user-flow-add-application.md)   |
|**[Step 4: Customize and secure your sign-in](#step-4-customize-and-secure-your-sign-in)**     |  &#8226; [Customize branding](concept-branding-customers.md) </br>&#8226; [Add identity providers](concept-authentication-methods-customers.md)  </br>&#8226; [Collect attributes during sign-up](how-to-define-custom-attributes.md)</br>&#8226; [Add attributes to the token](how-to-add-attributes-to-token.md) </br>&#8226; [Add multifactor authentication (MFA)](concept-security-customers.md)    |



## Step 1: Create a customer tenant

:::image type="content" source="media/concept-planning-your-solution/overview-setup-step-1.png" alt-text="Diagram showing step 1 in the setup flow." border="false":::

A customer tenant is the first resource you need to create to get started with Microsoft Entra ID for customers. Your customer tenant is where you register your customer-facing application. It also contains a directory where you manage customer identities and access, separate from your workforce tenant.

When you create a customer tenant, you can set your correct geographic location and your domain name. If you currently use Azure AD B2C, the new workforce and customer tenant model doesn't affect your existing Azure AD B2C tenants.

### User accounts in a customer tenant

The directory in a customer tenant contains admin and customer user accounts. You can [create and manage admin accounts](how-to-manage-admin-accounts.md) for your customer tenant. Customer accounts are typically created through self-service sign-up, but you can [create and manage customer local accounts](how-to-manage-customer-accounts.md).

Customer accounts have a [default set of permissions](reference-user-permissions.md). Customers are restricted from accessing information about other users in the customer tenant. By default, customers can’t access information about other users, groups, or devices.

### How to create a customer tenant

- [Create a customer tenant](how-to-create-customer-tenant-portal.md) in the Microsoft Entra admin center.

- If you don't already have a Microsoft Entra tenant and want to try Microsoft Entra ID for customers, we recommend using the [get started experience](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl) to start a free trial.

## Step 2: Register your application

:::image type="content" source="media/concept-planning-your-solution/overview-setup-step-2.png" alt-text="Diagram showing step 2 in the setup flow." border="false":::

Before your applications can interact with Microsoft Entra ID for customers, you need to register them in your customer tenant. Microsoft Entra ID performs identity and access management only for registered applications. [Registering your app](how-to-register-ciam-app.md) establishes a trust relationship and allows you to integrate your app with Microsoft Entra ID for customers.

Then, to complete the trust relationship between Microsoft Entra ID and your app, you update your application source code with the values assigned during app registration, such as the application (client) ID, directory (tenant) subdomain, and client secret.

We provide code sample guides and in-depth integration guides for several app types and languages. Depending on the type of app you want to register, you can find guidance on our [Samples by app type and language page](samples-ciam-all.md).

### How to register your application

- Find guidance specific to the application you want to register on our [Samples by app type and language page](samples-ciam-all.md).

- If we don't have a guide specific to your platform or language, refer to the general instructions for [registering an application](how-to-register-ciam-app.md) in a customer tenant.

## Step 3: Integrate a sign-in flow with your app

:::image type="content" source="media/concept-planning-your-solution/overview-setup-step-3.png" alt-text="Diagram showing step 3 in the setup flow." border="false":::

Once you've set up your customer tenant and registered your application, create a sign-up and sign-in user flow. Then integrate your application with the user flow so that anyone who accesses it goes through the sign-up and sign-in experience you've designed.

To integrate your application with a user flow, you add your application to the user flow properties and update your application code with your tenant information and authorization endpoint. 

### Authentication flow

When a customer attempts to sign in to your application, the application sends an authorization request to the endpoint you provided when you associated the app with the user flow. The user flow defines and controls the customer's sign-in experience. 

If the user is signing in for the first time, they're presented with the sign-up experience. They enter information based on the built-in or custom user attributes you've chosen to collect. 

When sign-up is complete, Microsoft Entra ID generates a token and redirects the customer to your application. A customer account is created for the customer in the directory.

### Sign-up and sign-in user flow

When planning your sign-up and sign-in experience, determine your requirements:

- **Number of user flows**. Each application can have just one sign-up and sign-in user flow. If you have several applications, you can use a single user flow for all of them. Or, if you want a different experience for each application, you can create multiple user flows. The maximum is 10 user flows per customer tenant.

- **Company branding and language customizations**. Although we describe configuring company branding and language customizations later in Step 4, you can configure them anytime, either before or after you integrate an app with a user flow. If you configure company branding before you create the user flow, the sign-in pages reflect that branding. Otherwise, the sign-in pages reflect the default, neutral branding.

- **Attributes to collect**. In the user flow settings, you can select from a set of built-in user attributes you want to collect from customers. The customer enters the information on the sign-up page, and it's stored with their profile in your directory. If you want to collect more information, you can [define custom attributes](how-to-define-custom-attributes.md) and add them to your user flow.

- **Requirements for token claims**. If your application requires specific user attributes, you can include them in the token sent to your application.

- **Social identity providers**. You can set up social identity providers [Google](how-to-google-federation-customers.md) and [Facebook](how-to-facebook-federation-customers.md) and then add them to your user flow as sign-in options.

### How to integrate a user flow with your app

- If you want to collect information from customers beyond the built-in user attributes, [define custom attributes](how-to-define-custom-attributes.md) so they're available as you configure to your user flow.

- [Create a sign-up and sign-in user flow for customers](how-to-user-flow-sign-up-sign-in-customers.md).

- [Add your application](how-to-user-flow-add-application.md) to the user flow.

## Step 4: Customize and secure your sign-in

:::image type="content" source="media/concept-planning-your-solution/overview-setup-step-4.png" alt-text="Diagram showing step 4 in the setup flow." border="false":::

When planning for configuring company branding, language customizations, and custom extensions, consider the following points:

- **Company branding**. After creating a new customer tenant, you can customize the appearance of your web-based applications for customers who sign in or sign up, to personalize their end-user experience. In Microsoft Entra ID, the default Microsoft branding appear in your sign-in pages before you customize any settings. This branding represents the global look and feel that applies across all sign-ins to your tenant. Learn more about [customizing the sign-in look and feel](concept-branding-customers.md).

- **Extending the authentication token claims**. Microsoft Entra ID for customers is designed for flexibility. You can use a custom authentication extension to add claims from external systems to the application token just before the token is issued to the application. Learn more about [adding your own business logic](concept-custom-extensions.md) with custom authentication extensions.

- **Multifactor authentication (MFA)**. You can also enable application access security by enforcing MFA, which adds a critical second layer of security to user sign-ins by requiring verification via email one-time passcode. Learn more about [MFA for customers](concept-security-customers.md#multifactor-authentication).

- **Security and governance**. Learn about [security and governance](concept-security-customers.md) features available in your customer tenant, such as Identity Protection.

### How to customize and secure your sign-in

- [Customize branding](concept-branding-customers.md) 
- [Add identity providers](concept-authentication-methods-customers.md)
- [Collect attributes during sign-up](how-to-define-custom-attributes.md)
- [Add attributes to the token](how-to-add-attributes-to-token.md) 
- [Add multifactor authentication](concept-security-customers.md)

## Next steps
- [Start a free trial](https://aka.ms/ciam-free-trial?wt.mc_id=ciamcustomertenantfreetrial_linkclick_content_cnl) or [create your customer tenant](how-to-create-customer-tenant-portal.md).
- [Find samples and guidance for integrating your app](samples-ciam-all.md).
- See also the [Microsoft Entra ID for customers Developer Center](https://aka.ms/ciam/dev) for the latest developer content and resources.
