---
title: Viewing apps using your tenant for identity management
description: Understand how to view all applications using your Microsoft Entra tenant for identity management.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.workload: identity
ms.topic: reference
ms.date: 07/14/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: enterprise-apps
---

# Applications listed in Enterprise applications

The [Quickstart Series on Application Management](view-applications-portal.md) walks you the basics. In it, you learn how to view all of the apps using your Microsoft Entra tenant for identity management. This article dives a bit deeper into the types of apps you'll find.

## Why does a specific application appear in my all applications list?

When filtered to **All Applications**, the **All Applications** **List** shows every Service Principal object in your tenant. Service Principal objects can appear in this list in a various ways:

- When you add any application from the application gallery, including:

  - **Microsoft Entra ID - Enterprise applications** – Apps added to your tenant using the **Enterprise applications** option on the Microsoft Entra admin center. Usually apps integrated using the SAML standard.
  - **Microsoft Entra ID - App registrations** – Apps added to your tenant using the **App registrations** option on the Microsoft Entra admin center. Usually custom developed apps using the OpenID Connect and OAuth standards.
  - **Application Proxy Applications** – An application running in your on-premises environment that you want to provide secure single-sign on to externally
- When signing up for, or signing in to, a third-party application integrated with Microsoft Entra ID. One example is [Smartsheet](https://app.smartsheet.com/b/home) or [DocuSign](https://www.docusign.net/member/MemberLogin.aspx).
- Microsoft apps such as Microsoft 365.
- When you use managed identities for Azure resources. For more information, see [Managed identity types](../managed-identities-azure-resources/overview.md#managed-identity-types).
- When you add a new application registration by creating a custom-developed application using the [Application Registry](../develop/quickstart-register-app.md)
- When you add a new application registration by creating a custom-developed application using the [V2.0 Application Registration portal](../develop/quickstart-register-app.md)
- When you add an application, you’re developing using Visual Studio’s [ASP.NET Authentication Methods](https://www.asp.net/visual-studio/overview/2013/creating-web-projects-in-visual-studio#orgauthoptions) or [Connected Services](https://devblogs.microsoft.com/visualstudio/connecting-to-cloud-services/)
- When you create a service principal object using the [Microsoft Graph PowerShell](/powershell/microsoftgraph/installation) module.
- When you [consent to an application](../develop/howto-convert-app-to-be-multi-tenant.md) as an administrator to use data in your tenant
- When a [user consents to an application](../develop/howto-convert-app-to-be-multi-tenant.md) to use data in your tenant
- When you enable certain services that store data in your tenant. One example is Password Reset, which is modeled as a service principal to store your password reset policy securely.

Learn more about how, and why, apps are added to your directory, see [How applications are added to Microsoft Entra ID](../develop/how-applications-are-added.md).

## Next steps

[Managing Applications with Microsoft Entra ID](what-is-application-management.md)
