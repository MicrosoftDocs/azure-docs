---
title: Best practices for Azure AD B2C
titleSuffix: Azure AD B2C
description: Recommendations and best practices to consider when working with Azure Active Directory B2C (Azure AD B2C).

author: kengaderdus
ms.author: kengaderdus
manager: CelesteDG
ms.service: active-directory

ms.topic: conceptual
ms.date: 07/13/2023
ms.subservice: B2C
---

# Recommendations and best practices for Azure Active Directory B2C

The following best practices and recommendations cover some of the primary aspects of integrating Azure Active Directory (Azure AD) B2C into existing or new application environments.

## Fundamentals

| Best practice | Description |
|--|--|
| Choose user flows for most scenarios | The Identity Experience Framework of Azure AD B2C is the core strength of the service. Policies fully describe identity experiences such as sign-up, sign-in, or profile editing. To help you set up the most common identity tasks, the Azure AD B2C portal includes predefined, configurable policies called user flows. With user flows, you can create great user experiences in minutes, with just a few clicks. [Learn when to use user flows vs. custom policies](user-flow-overview.md#comparing-user-flows-and-custom-policies).|
| App registrations | Every application (web, native) and API that is being secured must be registered in Azure AD B2C. If an app has both a web and native version of iOS and Android, you can register them as one application in Azure AD B2C with the same client ID. Learn how to [register OIDC, SAML, web, and native apps](./tutorial-register-applications.md?tabs=applications). Learn more about [application types that can be used in Azure AD B2C](./application-types.md). |
| Move to monthly active users billing | Azure AD B2C has moved from monthly active authentications to monthly active users (MAU) billing. Most customers will find this model cost-effective. [Learn more about monthly active users billing](https://azure.microsoft.com/updates/mau-billing/). |

## Planning and design

Define your application and service architecture, inventory current systems, and plan your migration to Azure AD B2C.

| Best practice | Description |
|--|--|
| Architect an end-to-end solution | Include all of your applications' dependencies when planning an Azure AD B2C integration. Consider all services and products that are currently in your environment or that might need to be added to the solution (for example, Azure Functions, customer relationship management (CRM) systems, Azure API Management gateway, and storage services). Take into account the security and scalability for all services. |
| Document your users' experiences | Detail all the user journeys your customers can experience in your application. Include every screen and any branching flows they might encounter when interacting with the identity and profile aspects of your application. Include usability, accessibility, and localization in your planning. |
| Choose the right authentication protocol |  For a breakdown of the different application scenarios and their recommended authentication flows, see [Scenarios and supported authentication flows](../active-directory/develop/authentication-flows-app-scenarios.md#scenarios-and-supported-authentication-flows). |
| Pilot a proof-of-concept (POC) end-to-end user experience | Start with our [Microsoft code samples](integrate-with-app-code-samples.md) and [community samples](https://github.com/azure-ad-b2c/samples). |
| Create a migration plan |Planning ahead can make migration go more smoothly. Learn more about [user migration](user-migration.md).|
| Usability vs. security | Your solution must strike the right balance between application usability and your organization's acceptable level of risk. |
| Move on-premises dependencies to the cloud | To help ensure a resilient solution, consider moving existing application dependencies to the cloud. |
| Migrate existing apps to b2clogin.com | The deprecation of login.microsoftonline.com will go into effect for all Azure AD B2C tenants on 04 December 2020. [Learn more](b2clogin.md). |
| Use Identity Protection and Conditional Access | Use these capabilities for significantly greater control over risky authentications and access policies. Azure AD B2C Premium P2 is required. [Learn more](conditional-access-identity-protection-overview.md). |
|Tenant size | You need to plan with Azure AD B2C tenant size in mind. By default, Azure AD B2C tenant can accommodate 1.25 million objects (user accounts and applications). You can increase this limit to 5.25 million objects by adding a custom domain to your tenant, and verifying it. If you need a bigger tenant size, you need to contact [Support](find-help-open-support-ticket.md).|
| Use Identity Protection and Conditional Access | Use these capabilities for greater control over risky authentications and access policies. Azure AD B2C Premium P2 is required. [Learn more](conditional-access-identity-protection-overview.md). |

## Implementation

During the implementation phase, consider the following recommendations.

| Best practice | Description |
|--|--|
| Edit custom policies with the Azure AD B2C extension for Visual Studio Code | Download Visual Studio Code and this community-built [extension from the Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AzureADB2CTools.aadb2c). While not an official Microsoft product, the Azure AD B2C extension for Visual Studio Code includes several features that help make working with custom policies easier. |
| Learn how to troubleshoot Azure AD B2C | Learn how to [troubleshoot custom policies](./troubleshoot.md?tabs=applications) during development. Learn what a normal authentication flow looks like and use tools for discovering anomalies and errors. For example, use [Application Insights](troubleshoot-with-application-insights.md) to review output logs of user journeys. |
| Leverage our library of proven custom policy patterns | Find [samples](https://github.com/azure-ad-b2c/samples) for enhanced Azure AD B2C customer identity and access management (CIAM) user journeys. |

## Testing

Test and automate your Azure AD B2C implementation.

| Best practice | Description |
|--|--|
| Account for global traffic | Use traffic sources from different global address to test the performance and localization requirements. Make sure all the HTMLs, CSS, and dependencies can meet your performance needs. |
| Functional and UI testing | Test the user flows end-to-end. Add synthetic tests every few minutes using Selenium, VS Web Test, etc. |
| Pen-testing | Before going live with your solution, perform penetration testing exercises to verify all components are secure, including any third-party dependencies. Verify you've secured your APIs with access tokens and used the right authentication protocol for your application scenario. Learn more about [Penetration testing](../security/fundamentals/pen-testing.md) and the [Microsoft Cloud Unified Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1). |
| A/B Testing | Flight your new features with a small, random set of users before rolling out to your entire population. With JavaScript enabled in Azure AD B2C, you can integrate with A/B testing tools like Optimizely, Clarity, and others. |
| Load testing | Azure AD B2C can scale, but your application can scale only if all of its dependencies can scale. Load-test your APIs and CDN. Learn more about [Resilience through developer best practices](../active-directory/architecture/resilience-b2c-developer-best-practices.md).|
| Throttling |  Azure AD B2C throttles traffic if too many requests are sent from the same source in a short period of time. Use several traffic sources while load testing, and handle the `AADB2C90229` error code gracefully in your applications. |
| Automation | Use continuous integration and delivery (CI/CD) pipelines to automate testing and deployments, for example, [Azure DevOps](deploy-custom-policies-devops.md). |

## Operations

Manage your Azure AD B2C environment.

| Best practice | Description |
|--|--|
| Create multiple environments | For easier operations and deployment roll-out, create separate environments for development, testing, pre-production, and production. Create Azure AD B2C tenants for each. |
| Use version control for your custom policies | Consider using GitHub, Azure Repos, or another cloud-based version control system for your Azure AD B2C custom policies. |
| Use the Microsoft Graph API to automate the management of your B2C tenants | Microsoft Graph APIs:<br/>Manage [Identity Experience Framework](/graph/api/resources/trustframeworkpolicy?preserve-view=true&view=graph-rest-beta) (custom policies)<br/>[Keys](/graph/api/resources/trustframeworkkeyset?preserve-view=true&view=graph-rest-beta)<br/>[User Flows](/graph/api/resources/identityuserflow?preserve-view=true&view=graph-rest-beta) |
| Integrate with Azure DevOps | A [CI/CD pipeline](deploy-custom-policies-devops.md) makes moving code between different environments easy and ensures production readiness always.   |
| Deploy custom policy | Azure AD B2C relies on caching to deliver performance to your end users. When you deploy a custom policy using whatever method, expect a delay of up to **30 minutes** for your users to see the changes. As a result of this behavior, consider the following practices when you deploy your custom policies: <br> - If you're deploying to a development environment, set the `DeploymentMode` attribute to `Development` in your custom policy file's `<TrustFrameworkPolicy>` element. <br> - Deploy your updated policy files to a production environment when traffic in your app is low. <br> - When you deploy to a production environment to update existing policy files, upload the updated files with new name(s), and then update your app reference to the new name(s). You can then remove the old policy files afterwards.<br> - You can set the `DeploymentMode` to `Development` in a production environment to bypass the caching behavior. However, we don't recommend this practice. If you [Collect Azure AD B2C logs with Application Insights](troubleshoot-with-application-insights.md), all claims sent to and from identity providers are collected, which is a security and performance risk. |
| Deploy app registration updates | When you modify your application registration in your Azure AD B2C tenant, such as updating the application's redirect URI, expect a delay of up to **2 hours (3600s)** for the changes to take effect in the production environment. We recommend that you modify your application registration in your production environment when traffic in your app is low.|
| Integrate with Azure Monitor | [Audit log events](view-audit-logs.md) are only retained for seven days. [Integrate with Azure Monitor](azure-monitor.md) to retain the logs for long-term use, or integrate with third-party security information and event management (SIEM) tools to gain insights into your environment. |
| Setup active alerting and monitoring | [Track user behavior](./analytics-with-application-insights.md) in Azure AD B2C using Application Insights. |

## Support and Status Updates

Stay up to date with the state of the service and find support options.

| Best practice | Description |
|--|--|
| [Service updates](https://azure.microsoft.com/updates/?product=active-directory-b2c) |  Stay up to date with Azure AD B2C product updates and announcements. |
| [Microsoft Support](find-help-open-support-ticket.md) | File a support request for Azure AD B2C technical issues. Billing and subscription management support is provided at no cost. |
| [Azure status](https://azure.status.microsoft/status) | View the current health status of all Azure services. |
