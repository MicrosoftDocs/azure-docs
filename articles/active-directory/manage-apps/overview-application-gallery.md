---
title: Overview of the Microsoft Entra application gallery
description: An overview of using the Microsoft Entra application gallery.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: overview
ms.workload: identity
ms.date: 01/22/2022
ms.author: jomondi
ms.reviewer: ergreenl
ms.custom: enterprise-apps
---

# Overview of the Microsoft Entra application gallery

The Microsoft Entra application gallery is a collection of software as a service (SaaS) [applications](../develop/app-objects-and-service-principals.md) that have been pre-integrated with Microsoft Entra ID. The collection contains thousands of applications that make it easy to deploy and configure [single sign-on (SSO)](../develop/single-sign-on-saml-protocol.md) and [automated user provisioning](../app-provisioning/user-provisioning.md).

To find the gallery when signed into your tenant, select **Enterprise applications**, select **All applications**, and then select **New application**.

:::image type="content" source="media/overview-application-gallery/enterprise-applications.png" alt-text="Screenshot showing the Microsoft Entra application gallery blade in the [Microsoft Entra admin center](https://entra.microsoft.com).":::

The applications available from the gallery follow the SaaS model that allows users to connect to and use cloud-based applications over the Internet. Common examples are email, calendaring, and office tools (such as Microsoft Office 365). 

The following are benefits of using applications available in the gallery:

- Users find the best possible SSO experience for the application.
- Configuration of the application is simple and minimal.
- A quick search finds the needed application.
- Free, Basic, and Premium Microsoft Entra users can all use the application.
- Users can easily find [step-by-step configuration tutorials](../saas-apps/tutorial-list.md) that are available for onboarding gallery applications.

## Applications in the gallery

The gallery contains thousands of applications that have been pre-integrated into Microsoft Entra ID. When using the gallery, you choose from using applications from specific cloud platforms, featured applications, or you search for the application that you want to use.

### Search for applications

If you don’t find the application that you are looking for in the featured applications, you can search for a specific application by name. 

:::image type="content" source="media/overview-application-gallery/search-applications.png" alt-text="Screenshot showing the search options on the Microsoft Entra application gallery blade in the Microsoft Entra admin center.":::

When searching for an application, you can also specify specific filters, such as single sign-on options, automated provisioning, and categories. 

- **Single sign-on options** – You can search for applications that support these SSO options: SAML, OpenID Connect (OIDC), Password, or Linked. For more information about these options, see [Plan a single sign-on deployment in Microsoft Entra ID](plan-sso-deployment.md).
- **User account management** – The only option available is [automated provisioning](../app-provisioning/user-provisioning.md).
- **Categories** – When an application is added to the gallery it can be classified in a specific category. Many categories are available such as **Business management**, **Collaboration**, or **Education**.

### Cloud platforms

Applications that are specific to major cloud platforms, such as AWS, Google, or Oracle can be found by selecting the appropriate platform.

:::image type="content" source="media/overview-application-gallery/cloud-applications.png" alt-text="Screenshot showing the cloud application options on the Microsoft Entra application gallery blade in the Microsoft Entra admin center.":::

### On-premises applications

On-premises applications are connected to Microsoft Entra ID using Microsoft Entra application proxy. From the on-premises section of the Microsoft Entra gallery, you can do the following:

- Configure Application Proxy to enable remote access to an on-premises application.
- Use the documentation to learn more about how to use Application Proxy to secure remote access to on-premises applications.
- Manage any Application Proxy connectors that you've already created.

:::image type="content" source="media/overview-application-gallery/on-premises-applications.png" alt-text="Screenshot showing the on-premises application options on the Microsoft Entra application gallery blade in the Microsoft Entra admin center.":::

### Featured applications

A collection of featured applications is listed by default when you open the Microsoft Entra gallery. Each application is marked with a symbol to enable you to identify whether it supports federated SSO or automated provisioning.

:::image type="content" source="media/overview-application-gallery/featured-applications.png" alt-text="Screenshot showing the featured applications on the Microsoft Entra application gallery blade in the Microsoft Entra admin center.":::

- **Federated SSO** - When you set up [SSO](what-is-single-sign-on.md) to work between multiple identity providers, it's called federation. An SSO implementation based on federation protocols improves security, reliability, user experiences, and implementation. Some applications implement federated SSO as SAML-based or as OIDC-based. For SAML applications, when you select create, the application is added to your tenant. For OIDC applications, the administrator must first sign up or sign-in on the application's website to add the application to Microsoft Entra ID.
- **Provisioning** - Microsoft Entra ID to SaaS [application provisioning](../app-provisioning/user-provisioning.md) refers to automatically creating user identities and roles in the SaaS applications that users need access to.

## Create your own application

When you select the **Create your own application** link near the top of the blade, you see a new blade that lists the following choices:

- **Register an application to integrate with Microsoft Entra ID (App you’re developing)** – This choice is meant for developers who want to work on the integration of their application that uses OpenID Connect with Microsoft Entra ID. This choice doesn’t provide an opportunity to publish your application to the gallery, it’s only meant for development purposes to work on integration.
- **Integrate any other application you don’t find in the gallery (Non-gallery)** – This choice is meant for an administrator to make a SAML-based application that isn't in the gallery available to users in their organization. By integrating the application, the administrator can configure, secure, and monitor its use. This choice doesn’t provide a way to publish the application to the gallery. It does provide secure access to the application for users in your tenant.
- **Configure Application Proxy for secure remote access to an on-premises application** – This choice is meant for an administrator to enable SSO and secure remote access for web applications hosted on-premises by connecting with Application Proxy.

## Request new gallery application

After you successfully integrate an application with Microsoft Entra ID and thoroughly tested it, you can request to have it added to the gallery. Publishing an application to the gallery from the portal isn't supported but there is a process that you can follow to have it done for you. For more information about publishing to the gallery, select [Request new gallery application](../manage-apps/v2-howto-app-gallery-listing.md).

## Next steps

- Get started by adding your first enterprise application with the [Quickstart: Add an enterprise application](add-application-portal.md).
