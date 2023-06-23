---
title: 'Understand the stages of migrating application authentication from AD FS to Azure AD'
description: This article provides the stages of the migration process and what types of applications to migrate.
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/31/2023
ms.author: jomondi
ms.reviewer: alamaral
ms.custom: not-enterprise-apps
---

# Understand the stages of migrating application authentication from AD FS to Azure AD

Azure Active Directory (Azure AD) offers a universal identity platform that provides your people, partners, and customers a single identity to access applications and collaborate from any platform and device. Azure AD has a full suite of identity management capabilities. Standardizing your application authentication and authorization to Azure AD provides these benefits.

## Types of apps to migrate

Your applications may use modern or legacy protocols for authentication. When you plan your migration to Azure AD, consider migrating the apps that use modern authentication protocols (such as SAML and Open ID Connect) first.

These apps can be reconfigured to authenticate with Azure AD either via a built-in connector from the Azure App Gallery, or by registering the custom application in Azure AD.

Apps that use older protocols can be integrated using [Application Proxy](../app-proxy/what-is-application-proxy.md) or any of our [Secure Hybrid Access (SHA) partners](secure-hybrid-access-integrations.md).

For more information, see:

* [Using Azure AD Application Proxy to publish on-premises apps for remote users](../app-proxy/what-is-application-proxy.md).
* [What is application management?](what-is-application-management.md)
* [AD FS application activity report to migrate applications to Azure AD](migrate-adfs-application-activity.md).
* [Monitor AD FS using Azure AD Connect Health](../hybrid/how-to-connect-health-adfs.md).

## The migration process

During the process of moving your app authentication to Azure AD, test your apps and configuration. We recommend that you continue to use existing test environments for migration testing before you move to the production environment. If a test environment isn't currently available, you can set one up using [Azure App Service](https://azure.microsoft.com/services/app-service/) or [Azure Virtual Machines](https://azure.microsoft.com/free/virtual-machines/search/?OCID=AID2000128_SEM_lHAVAxZC&MarinID=lHAVAxZC_79233574796345_azure%20virtual%20machines_be_c__1267736956991399_kwd-79233582895903%3Aloc-190&lnkd=Bing_Azure_Brand&msclkid=df6ac75ba7b612854c4299397f6ab5b0&ef_id=XmAptQAAAJXRb3S4%3A20200306231230%3As&dclid=CjkKEQiAhojzBRDg5ZfomsvdiaABEiQABCU7XjfdCUtsl-Abe1RAtAT35kOyI5YKzpxRD6eJS2NM97zw_wcB), depending on the architecture of the application.

You may choose to set up a separate test Azure AD tenant on which to develop your app configurations.

Your migration process may look like this:

### Stage 1 – Current state: The production app authenticates with AD FS

:::image type="content" source="media/migrate-adfs-apps-stages/stage1.jpg" alt-text="Diagram showing migration stage 1.":::

### Stage 2 – (Optional) Point a test instance of the app to the test Azure AD tenant

Update the configuration to point your test instance of the app to a test Azure AD tenant, and make any required changes. The app can be tested with users in the test Azure AD tenant. During the development process, you can use tools such as [Fiddler](https://www.telerik.com/fiddler) to compare and verify requests and responses.

If it isn't feasible to set up a separate test tenant, skip this stage and point a test instance of the app to your production Azure AD tenant as described in Stage 3 below.

:::image type="content" source="media/migrate-adfs-apps-stages/stage2.jpg" alt-text="Diagram showing migration stage 2.":::

### Stage 3 – Point a test instance of the app to the production Azure AD tenant

Update the configuration to point your test instance of the app to your production Azure AD tenant. You can now test with users in your production tenant. If necessary, review the section of this article on transitioning users.

:::image type="content" source="media/migrate-adfs-apps-stages/stage3.jpg" alt-text="Diagram showing migration stage 3.":::

### Stage 4 – Point the production app to the production Azure AD tenant

Update the configuration of your production app to point to your production Azure AD tenant.

:::image type="content" source="media/migrate-adfs-apps-stages/stage4.jpg" alt-text="Diagram showing migration stage 4.":::

 Apps that authenticate with AD FS can use Active Directory groups for permissions. Use [Azure AD Connect sync](../hybrid/how-to-connect-sync-whatis.md) to sync identity data between your on-premises environment and Azure AD before you begin migration. Verify those groups and membership before migration so that you can grant access to the same users when the application is migrated.

## Line of business apps

Your line-of-business apps are those that your organization developed or those that are a standard packaged product.

Line-of-business apps that use OAuth 2.0, OpenID Connect, or WS-Federation can be integrated with Azure AD as [app registrations](../develop/quickstart-register-app.md). Integrate custom apps that use SAML 2.0 or WS-Federation as [non-gallery applications](add-application-portal.md) on the enterprise applications page in the [Entra portal](https://entra.microsoft.com/#home).

## Next steps

- [Configure SAML-based single sign-on](migrate-adfs-saml-based-sso.md).
