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
ms.date: 05/02/2023
ms.author: cmulligan
ms.custom: it-pro

---

# Planning for customer identity and access management

Azure AD for customers offers a customizable and extensible solution for integrating your customer-facing applications with Azure AD. Because Azure AD for customers is built on the Microsoft Entra platform, you benefit from consistency in app integration, tenant management, and operations across your workforce and customer scenarios. When designing your configuration, it's important to understand how Azure AD for customers works, how it differs from an Azure AD workforce scenario, and which underlying Azure AD features benefit your scenario.

This article describes the general steps for getting started with Azure AD for customers. It outlines the important considerations as you design and configure your solution.

## Integrating your app with Azure AD for customers

Adding secure sign-in to your app and setting up a customer identity and access management involves four general steps, as illustrated in the following diagram.

:::image type="content" source="media/concept-planning-your-solution/overview-setup-steps-inline.png" alt-text="Diagram showing an overview of setup steps." lightbox="media/concept-planning-your-solution/overview-setup-steps-expanded.png" border="false":::

| Step | Action | Description |
|---------|---------|---------|
|1     |      Create a customer tenant   | If you don't already have an Azure AD tenant, we recommend using the [get started experience](https://aka.ms/ciam-hub-free-trial). Otherwise, you can [create a customer tenant](https://aka.ms/ciam-hub-free-trial) in the Microsoft Entra admin center. You can set your correct geographic location and your domain name at this step. |
|2     |      Register your application   | In the Microsoft Entra admin center, [register your application](how-to-register-ciam-app.md) with Azure Active Directory.    |
|3     |    Integrate your app with a sign-in flow     | - Create a user flow </br>- Associate the app with the user flow </br>- Update the app code with your customer tenant info </br>See [Samples and guidance by app type and language](samples-ciam-all.md)   |
|4     |    Customize and secure your sign-in     |  - [Customize branding](concept-branding-customers.md) </br>- [Add identity providers](concept-authentication-methods-customers.md) </br>- [Add multifactor authentication](concept-security-customers.md) </br>- Use [custom authentication extensions](concept-custom-extensions.md) if you want to extend the authentication flow   |

## Customer tenant and user model

Azure AD for customers uses the standard tenant model and overlays it with customized onboarding journeys for workforce or customer scenarios. B2B collaboration is part of workforce configurations. With the introduction of Azure AD for customers, Microsoft Entra now offers two different types of tenants that you can create and manage:

- A **workforce tenant** contains your employees and the apps and resources that are internal to your organization. If you've worked with Azure Active Directory, a workforce tenant is the type of tenant you're already familiar with. You might already have an existing workforce tenant for your organization.

- A **customer tenant** represents your customer-facing app, resources, and directory of customer accounts. A customer tenant is distinct and separate from your workforce tenant.

This new model won't affect your already existing B2C tenants.  

### Components of a customer tenant

A customer tenant is the first resource you need to create to get started with Azure AD for customers. To establish a CIAM solution for a customer-facing app or service, you create a new customer tenant. A customer tenant contains:

- **A directory**: The directory stores your users' credentials and profile data. When a user signs up for your app, a local account is created for the user in your customer tenant.

- **Application registrations**: Microsoft Entra performs identity and access management only for registered applications. [Registering your app](how-to-register-ciam-app.md) establishes a trust relationship and allows you to integrate your app with Microsoft Entra

- **User flows**: The customer tenant contains the self-service sign-up, sign-in, and password reset experiences that you enable for your customers.

- **Extensions**: If you need to add user attributes and data from external systems, you can create [custom authentication extensions](concept-custom-extensions.md) for your user flows.

- **Sign-in methods**: You can enable various options for signing in to your app, including username and password, one-time passcode, and Google or Facebook identities. [Learn more](concept-authentication-methods-customers.md)

- **Encryption keys** Add and manage encryption keys for signing and validating tokens, client secrets, certificates, and passwords.

### Customer and admin accounts

A customer tenant contains two types of user accounts:

- **Customer account**: Accounts that represent the customers who access your applications.

- **Admin account**: Users with work accounts can manage resources in a tenant, and with an administrator role, can also manage tenants. Users with work accounts can create new consumer accounts, reset passwords, block/unblock accounts, and set permissions or assign an account to a security group.

## User flows for self-service sign-up

A self-service sign-up user flow creates a sign-up experience for your customers through the application you want to share. The user flow can be associated with one or more of your applications. First you enable self-service sign-up for your tenant and federate with the identity providers you want to allow external users to use for sign-in. Then you create and customize the sign-up user flow and assign your applications to it.
You can configure user flow settings to control how the customer signs up for the application:

- Account types used for sign-in, such as social accounts like Facebook, or email address
- Attributes to be collected from the user signing up, such as first name, postal code, or country/region of residency

The customer can sign in to your application, via the web, mobile, desktop, or single-page application (SPA). The application initiates an authorization request to the user flow provided endpoint. The user flow defines and controls the customer's experience. When the customer completes the sign-up user flow, Azure AD generates a token and redirects the customer back to your application. Upon completion of sign-up, a guest account is provisioned for the customer in the directory. Multiple applications can use the same user flow.

Learn how to [create a sign-up and sign-in user flow for customers](how-to-user-flow-sign-up-sign-in-customers.md).

## Extensibility

Azure AD for customers is designed for flexibility. In addition to the built-in authentication events within a sign-up and sign-in user flow, you can define additional actions for events at various points within the authentication flow.

:::image type="content" source="media/concept-planning-your-solution/authentication-flow-events-inline.png" alt-text="Diagram showing extensibility points in the authentication flow." lightbox="media/concept-planning-your-solution/authentication-flow-events-expanded.png" border="false":::

- **Use custom authentication extensions to enrich tokens**.  Add claims from external systems to the application token just before the token is issued to the application.

- **Add logic to attribute collection**. Define validation actions at the start of attribute collection or just before attribute submission.

## Collecting attributes from users during sign-up

For each application, you might have different requirements for the information you want to collect during sign-up from your customers.

Learn more about [custom authentication extensions](concept-custom-extensions.md).
### Built-in attributes

Azure AD comes with a built-in set of information stored in attributes, such as Given Name, Surname, City, and Postal Code. With Azure AD for customers, you can select the built-in attributes you want to collect from customers when they sign up for your app. These attributes are stored with the customer's profile in your directory.

### Custom attributes

You can [create custom attributes](how-to-define-custom-attributes.md) in the Azure portal and use them in your self-service sign-up user flows. You can also read and write these attributes by using the Microsoft Graph API. Microsoft Graph API supports creating and updating a user with extension attributes. Extension attributes in the Graph API are named by using the convention `extension_<extensions-app-id>_attributename`. For example:

```JSON
"extension_831374b3bd5041bfaa54263ec9e050fc_loyaltyNumber": "212342"
```

The `<extensions-app-id>` is specific to your tenant. To find this identifier, navigate to **Azure Active Directory** > **App registrations** > **All applications**. Search for the app that starts with "aad-extensions-app" and select it. On the app's Overview page, note the Application (client) ID.

## Microsoft Entra security features

The Microsoft Entra platform helps IT protect access to applications and resources. By taking advantage of the security benefits of Microsoft Entra, you can provide SSO access to your applications. If you want to make multiple apps available, SSO allows a customer to sign in once with a single account and get access to all apps, whether they're web, mobile, or single page applications.

You can also enable application access security by enforcing multifactor authentication, which adds a critical second layer of security to user sign-ins by requiring verification via email one-time passcode.

Learn more about [security and governance](concept-security-customers.md) features available in your customer tenant.

## Next steps
- [Start a free trial](https://aka.ms/ciam-free-trial) or [create your customer tenant](how-to-create-customer-tenant-portal.md).
- [Find samples and guidance for integrating your app](samples-ciam-all.md).
- See also the [Azure AD for customers Developer Center](https://aka.ms/ciam/dev) for the latest developer content and resources.
