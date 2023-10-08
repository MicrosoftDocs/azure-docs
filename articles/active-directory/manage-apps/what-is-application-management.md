---
title: What is application management?
description: An overview of managing the lifecycle of an application in Microsoft Entra ID.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: overview
ms.workload: identity
ms.date: 12/07/2022
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: enterprise-apps
---

# What is application management in Microsoft Entra ID?

Application management in Microsoft Entra ID is the process of creating, configuring, managing, and monitoring applications in the cloud. When an [application](../develop/app-objects-and-service-principals.md) is registered in a Microsoft Entra tenant, users who have been assigned to it can securely access it. Many types of applications can be registered in Microsoft Entra ID. For more information, see [Application types for the Microsoft identity platform](../develop/v2-app-types.md).

In this article, you learn these important aspects of managing the lifecycle of an application:

- **Develop, add, or connect** – You take different paths depending on whether you're developing your own application, using a pre-integrated application, or connecting to an on-premises application.
- **Manage access** – Access can be managed by using single sign-on (SSO), assigning resources, defining the way access is granted and consented to, and using automated provisioning.
- **Configure properties** – Configure the requirements for signing into the application and how the application is represented in user portals.
- **Secure the application** – Manage configuration of permissions, multifactor authentication, Conditional Access, tokens, and certificates.
- **Govern and monitor** – Manage interaction and review activity using entitlement management and reporting and monitoring resources.
- **Clean up** – When your application is no longer needed, clean up your tenant by removing access to it and deleting it.

## Develop, add, or connect

There are several ways that you might manage applications in Microsoft Entra ID. The easiest way to start managing an application is to use a pre-integrated application from the Microsoft Entra gallery. Developing your own application and registering it in Microsoft Entra ID is an option, or you can continue to use an on-premises application.

The following image shows how these applications interact with Microsoft Entra ID.

:::image type="content" source="media/what-is-application-management/app-management-overview.png" alt-text="Diagram showing how your own developed apps, pre-integrated apps, and on-premises apps can be used as enterprise apps.":::

### Pre-integrated applications

Many applications are already pre-integrated (shown as “Cloud applications” in the image above) and can be set up with minimal effort. Each application in the Microsoft Entra gallery has an article available that shows you the steps required to [configure the application](../saas-apps/tutorial-list.md). For a simple example of how an application can be added to your Microsoft Entra tenant from the gallery, see [Quickstart: Add an enterprise application](add-application-portal.md).

### Your own applications

If you develop your own business application, you can register it with Microsoft Entra ID to take advantage of the security features that the tenant provides. You can register your application in **App Registrations**, or you can register it using the **Create your own application** link when adding a new application in **Enterprise applications**. Consider how [authentication](../develop/authentication-flows-app-scenarios.md) is implemented in your application for integration with Microsoft Entra ID. 

If you want to make your application available through the gallery, you can [submit a request to have it added](../manage-apps/v2-howto-app-gallery-listing.md).

### On-premises applications

If you want to continue using an on-premises application, but take advantage of what Microsoft Entra ID offers, connect it with Microsoft Entra ID using [Microsoft Entra application proxy](../app-proxy/application-proxy.md). Application Proxy can be implemented when you want to publish on-premises applications externally. Remote users who need access to internal applications can then access them in a secure manner.

## Manage access

To [manage access](what-is-access-management.md) for an application, you want to answer the following questions:

- How is access granted and consented for the application?
- Does the application support SSO?
- Which users, groups, and owners should be assigned to the application? 
- Are there other identity providers that support the application?
- Will it be helpful to automate the provisioning of user identities and roles?

### Access and consent

You can [manage user consent settings](configure-user-consent.md) to choose whether users can allow an application or service to access user profiles and organizational data. When applications are granted access, users can sign in to applications integrated with Microsoft Entra ID, and the application can access your organization's data to deliver rich data-driven experiences.

In situations where users are unable to consent to the permissions an application is requesting, consider configuring the admin consent workflow. The workflow allows users to provide a justification and request an administrator's review and approval of an application. To learn how to configure admin consent workflow in your Microsoft Entra tenant, see [Configure admin consent workflow](configure-admin-consent-workflow.md).

As an administrator, you can [grant tenant-wide admin consent](grant-admin-consent.md) to an application. Tenant-wide admin consent is necessary when an application requires permissions that regular users aren't allowed to grant. Granting tenant-wide admin consent also allows organizations to implement their own review processes. Always carefully review the permissions the application is requesting before granting consent. When an application has been granted tenant-wide admin consent, all users are able to sign into the application unless it has been configured to require user assignment.

### Single sign-on

Consider implementing SSO in your application. You can manually configure most applications for SSO. The most popular options in Microsoft Entra ID are [SAML-based SSO and OpenID Connect-based SSO](../develop/v2-protocols.md). Before you start, make sure that you understand the requirements for SSO and how to [plan for deployment](plan-sso-deployment.md). For more information on how to configure SAML-based SSO for an enterprise application in your Microsoft Entra tenant, see [Enable single sign-on for an application by using Microsoft Entra ID](add-application-portal-setup-sso.md).

### User, group, and owner assignment

By default, all users can access your enterprise applications without being assigned to them. However, if you want to assign the application to a set of users, configure the application to require user assignment and assign the select users to the application. For a simple example of how to create and assign a user account to an application, see [Quickstart: Create and assign a user account](add-application-portal-assign-users.md). 

If included in your subscription, [assign groups to an application](assign-user-or-group-access-portal.md) so that you can delegate ongoing access management to the group owner.

[Assigning owners](assign-app-owners.md) is a simple way to grant the ability to manage all aspects of Microsoft Entra configuration for an application. As an owner, a user can manage the organization-specific configuration of the application. As a best practice, you should proactively monitor applications in your tenant to ensure they have at least two owners, to avoid the situation of ownerless applications. 

### Automate provisioning

[Application provisioning](../app-provisioning/user-provisioning.md) refers to automatically creating user identities and roles in the applications that users need to access. In addition to creating user identities, automatic provisioning includes the maintenance and removal of user identities as status or roles change.

### Identity providers

Do you have an identity provider that you want Microsoft Entra ID to interact with? [Home Realm Discovery](home-realm-discovery-policy.md) provides a configuration that allows Microsoft Entra ID to determine which identity provider a user needs to authenticate with when they sign in.

### User portals

Microsoft Entra ID provides customizable ways to deploy applications to users in your organization. For example, the [My Apps portal or the Microsoft 365 application launcher](end-user-experiences.md). My Apps gives users a single place to start their work and find all the applications to which they have access. As an administrator of an application, you should [plan how the users in your organization will use My Apps](./myapps-overview.md).

## Configure properties

When you add an application to your Microsoft Entra tenant, you have the opportunity to configure properties that affect the way users can interact with the application. You can enable or disable the ability to sign in and set the application to require user assignment. You can also determine the visibility of the application, what logo represents the application, and any notes about the application. For more information about the properties that can be configured, see [Properties of an enterprise application](application-properties.md).

## Secure the application

There are several methods available to help you keep your enterprise applications secure. For example, you can [restrict tenant access](tenant-restrictions.md), [manage visibility, data, and analytics](cloud-app-security.md), and possibly provide [hybrid access](secure-hybrid-access.md). Keeping your enterprise applications secure also involves managing configuration of permissions, MFA, Conditional Access, tokens, and certificates.

### Permissions

It's important to periodically review and, if necessary, [manage the permissions granted to an application or service](manage-application-permissions.md). Make sure that you only allow the appropriate access to your applications by regularly evaluating whether suspicious activity exists.

[Permission classifications](configure-permission-classifications.md) allow you to identify the effect of different permissions according to your organization's policies and risk evaluations. For example, you can use permission classifications in consent policies to identify the set of permissions that users are allowed to consent to.

### Multifactor authentication and Conditional Access

Microsoft Entra multifactor authentication helps safeguard access to data and applications, providing another layer of security by using a second form of authentication. There are many methods that can be used for a second-factor authentication. Before you start, [plan the deployment of MFA for your application](../authentication/howto-mfa-getstarted.md) in your organization.

Organizations can enable MFA with [Conditional Access](../conditional-access/overview.md) to make the solution fit their specific needs. Conditional Access policies allow administrators to assign controls to specific [applications, actions, or authentication context](../conditional-access/concept-conditional-access-cloud-apps.md).

### Tokens and certificates

Different types of security tokens are used in an authentication flow in Microsoft Entra ID depending on the protocol used. For example, [SAML tokens](../develop/reference-saml-tokens.md) are used for the SAML protocol, and [ID tokens](../develop/id-tokens.md) and [access tokens](../develop/access-tokens.md) are used for the OpenID Connect protocol. Tokens are signed with the unique certificate that's generated in Microsoft Entra ID and by specific standard algorithms. 

You can provide more security by [encrypting the token](howto-saml-token-encryption.md). You can also manage the information in a token including the [roles that are allowed](../develop/howto-add-app-roles-in-apps.md) for the application.

Microsoft Entra ID uses the [SHA-256 algorithm](certificate-signing-options.md) by default to sign the SAML response. Use SHA-256 unless the application requires SHA-1. Establish a process for [managing the lifetime of the certificate](./tutorial-manage-certificates-for-federated-single-sign-on.md). The maximum lifetime of a signing certificate is three years. To prevent or minimize outage due to a certificate expiring, use roles and email distribution lists to ensure that certificate-related change notifications are closely monitored. 

## Govern and monitor

[Entitlement management](../governance/entitlement-management-scenarios.md) in Microsoft Entra ID enables you to manage interaction between applications and administrators, catalog owners, access package managers, approvers, and requestors.

Your Microsoft Entra reporting and monitoring solution depends on your legal, security, and operational requirements and your existing environment and processes. There are several logs that are maintained in Microsoft Entra ID and you should [plan for reporting and monitoring deployment](../reports-monitoring/plan-monitoring-and-reporting.md) to maintain the best experience as possible for your application.

## Clean up

You can clean up access to applications. For example, [removing a user’s access](methods-for-removing-user-access.md). You can also [disable how a user signs in](disable-user-sign-in-portal.md). And finally, you can delete the application if it's no longer needed for the organization. For more information on how to delete an enterprise application from your Microsoft Entra tenant, see [Quickstart: Delete an enterprise application](delete-application-portal.md).

## Guided walkthrough

For a guided walkthrough of many of the recommendations in this article, see the [Microsoft 365 Secure your cloud apps with Single Sign On (SSO) guided walkthrough](https://go.microsoft.com/fwlink/?linkid=2221502).

## Next steps

- Get started by adding your first enterprise application with the [Quickstart: Add an enterprise application](add-application-portal.md).
