---
title: 'Phase 3: Plan migration and testing'
description: This article describes phase 3 of planning migration of applications from AD FS to Microsoft Entra ID
services: active-directory
author: omondiatieno
manager: CelesteDG
ms.service: active-directory
ms.subservice: app-mgmt
ms.topic: conceptual
ms.workload: identity
ms.date: 05/30/2023
ms.author: jomondi
ms.reviewer: gasinh
ms.collection: M365-identity-device-management
---
# Phase 3: Plan migration and testing

Once you've gained business buy-in, the next step is to start migrating these apps to Microsoft Entra authentication.

## Migration tools and guidance

Use the tools and guidance provided to follow the precise steps needed to migrate your applications to Microsoft Entra ID:

- **General migration guidance** – Use the whitepaper, tools, email templates, and applications questionnaire in the [Microsoft Entra apps migration toolkit](./migration-resources.md) to discover, classify, and migrate your apps.
- **SaaS applications** – See our list of [SaaS app tutorials](../saas-apps/tutorial-list.md) and the [Microsoft Entra SSO deployment plan](plan-sso-deployment.md) to walk through the end-to-end process.
- **Applications running on-premises** – Learn all [about the Microsoft Entra application proxy](../app-proxy/application-proxy.md) and use the complete [Microsoft Entra application proxy deployment plan](https://aka.ms/AppProxyDPDownload) to get going quickly or consider our [Secure Hybrid Access partners](secure-hybrid-access.md), which you may already own.
- **Apps you’re developing** – Read our step-by-step [integration](../develop/quickstart-register-app.md) and [registration](../develop/quickstart-register-app.md) guidance.

> [!VIDEO https://www.youtube.com/embed/PvI4Q4P_HfU]

## Plan testing

During the process of the migration, your app may already have a test environment used during regular deployments. You can continue to use this environment for migration testing. If a test environment isn't currently available, you may be able to set one up using Azure App Service or Azure Virtual Machines, depending on the architecture of the application.

You may choose to set up a separate test Microsoft Entra tenant to use as you develop your app configurations. This tenant starts in a clean state and won't be configured to sync with any system.

Depending on how you configure your app, verify that SSO works properly.

| Authentication type      | Testing                                             |
| ------------------------ | --------------------------------------------------- |
| **OAuth / OpenID Connect** | Select **Enterprise applications &gt; Permissions** and ensure you've consented to the application to be used in your organization in the user settings for your app. |
| **SAML-based SSO** | Use the [Test SAML Settings](./debug-saml-sso-issues.md) button found under **Single Sign-On.** |
| **Password-Based SSO** | Download and install the [MyApps Secure Sign-in Extension](https://support.microsoft.com/account-billing/sign-in-and-start-apps-from-the-my-apps-portal-2f3b1bae-0e5a-4a86-a33e-876fbd2a4510#download-and-install-the-my-apps-secure-sign-in-extension). This extension helps you start any of your organization's cloud apps that require you to use an SSO process. |
| **[Application Proxy](../app-proxy/application-proxy.md)** | Ensure your connector is running and assigned to your application. Visit the [Application Proxy troubleshooting guide](../app-proxy/application-proxy-troubleshoot.md) for further assistance. |

You can test each app by logging in with a test user and make sure all functionality is the same as prior to the migration. If you determine during testing that users need to update their [MFA](../authentication/howto-mfa-userstates.md) or [SSPR](../authentication/tutorial-enable-sspr.md)settings, or you're adding this functionality during the migration, be sure to add that to your end-user communication plan. See [MFA](https://aka.ms/mfatemplates) and [SSPR](https://aka.ms/ssprtemplates) end-user communication templates.

## Troubleshoot

If you run into problems, check out our [apps troubleshooting guide](../app-provisioning/isv-automatic-provisioning-multi-tenant-apps.md) and [Secure Hybrid Access partner integration article](secure-hybrid-access-integrations.md) to get help. You can also check out our troubleshooting articles, see [Problems signing in to SAML-based single sign-on configured apps](/troubleshoot/azure/active-directory/troubleshoot-sign-in-saml-based-apps).

## Plan rollback

If the migration fails, we recommend that you leave the existing Relying Parties on the AD FS servers and remove access to the Relying Parties. This allows for a quick fallback if needed during the deployment.

Consider the following suggestions for actions you can take to mitigate migration issues:

- **Take screenshots** of the existing configuration of your app. You can look back if you must reconfigure the app once again.
- You might also consider **providing links for the application to use alternative authentication options (legacy or local authentication)**, in case there are issues with cloud authentication.
- Before you complete your migration, **do not change your existing configuration** with the existing identity provider.
- Be aware of the **apps that support multiple IdPs** since they provide an easier rollback plan.
- Ensure that your app experience has a **Feedback button** or pointers to your **helpdesk** issues.

### Employee communication

While the planned outage window itself can be minimal, you should still plan on communicating these timeframes proactively to employees while switching from AD FS to Microsoft Entra ID. Ensure that your app experience has a feedback button, or pointers to your helpdesk for issues.

Once deployment is complete, you can inform users of the successful deployment and remind them of any steps that they need to take.

- Instruct users to use [My Apps](https://myapps.microsoft.com) to access all the migrated applications.
- Remind users they might need to update their MFA settings.
- If Self-Service Password Reset is deployed, users might need to update or verify their authentication methods. See [MFA](https://aka.ms/mfatemplates) and [SSPR](https://aka.ms/ssprtemplates) end-user communication templates.

### External user communication

This group of users is usually the most critically impacted in case of any issues. This is especially true if your security posture dictates a different set of Conditional Access rules or risk profiles for external partners. Ensure that external partners are aware of the cloud migration schedule and have a timeframe during which they're encouraged to participate in a pilot deployment that tests out all flows unique to external collaboration. Finally, ensure they have a way to access your helpdesk in case there are problems.

## Exit criteria

You're successful in this phase when you have:

- Reviewed the migration tools
- Planned your testing including test environments and groups
- Planned rollback

## Next steps

- [Phase 4 - Manage and gain insights](migrate-adfs-plan-management-insights.md)
