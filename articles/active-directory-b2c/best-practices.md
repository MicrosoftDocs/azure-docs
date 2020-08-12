---
title: Best practices for Azure AD B2C
titleSuffix: Azure AD B2C
description: Recommendations and best practices to consider when working with Azure Active Directory B2C (Azure AD B2C).
services: active-directory-b2c
author: vigunase
manager: celestedg

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 06/06/2020
ms.author: vigunase
ms.subservice: B2C
---

# Recommendations and best practices for Azure Active Directory B2C

The following best practices and recommendations cover some of the primary aspects of integrating Azure Active Directory (Azure AD) B2C into existing or new application environments.

## Fundamentals

| Best practice | Description |
|--|--|
| Choose user flows for most scenarios | The Identity Experience Framework of Azure AD B2C is the core strength of the service. Policies fully describe identity experiences such as sign-up, sign-in, or profile editing. To help you set up the most common identity tasks, the Azure AD B2C portal includes predefined, configurable policies called user flows. With user flows, you can create great user experiences in minutes, with just a few clicks. [Learn when to use user flows vs. custom policies](custom-policy-overview.md#comparing-user-flows-and-custom-policies).|
| App registrations | Every application (web, native) and API that is being secured must be registered in Azure AD B2C. If an app has both a web and native version of iOS and Android, you can register them as one application in Azure AD B2C with the same client ID. Learn how to [register OIDC, SAML, web, and native apps](https://docs.microsoft.com/azure/active-directory-b2c/tutorial-register-applications?tabs=applications). Learn more about [application types that can be used in Azure AD B2C](https://docs.microsoft.com/azure/active-directory-b2c/application-types). |
| Move to monthly active users billing | Azure AD B2C has moved from monthly active authentications to monthly active users (MAU) billing. Most customers will find this model cost-effective. [Learn more about monthly active users billing](https://azure.microsoft.com/updates/mau-billing/). |

## Planning and design

Define your application and service architecture, inventory current systems, and plan your migration to Azure AD B2C.

| Best practice | Description |
|--|--|
| Architect an end-to-end solution | Include all of your applications' dependencies when planning an Azure AD B2C integration. Consider all services and products that are currently in your environment or that might need to be added to the solution, for example, Azure Functions, customer relationship management (CRM) systems, Azure API Management gateway, and storage services. Take into account the security and scalability for all services. |
| Document your users' experiences | Detail all the user journeys your customers can experience in your application. Include every screen and any branching flows they might encounter when interacting with the identity and profile aspects of your application. Include usability, accessibility, and localization in your planning. |
| Choose the right authentication protocol |  For a breakdown of the different application scenarios and their recommended authentication flows, see [Scenarios and supported authentication flows](../active-directory/develop/authentication-flows-app-scenarios.md#scenarios-and-supported-authentication-flows). |
| Pilot a proof-of-concept (POC) end-to-end user experience | Start with our [Microsoft code samples](code-samples.md) and [community samples](https://github.com/azure-ad-b2c/samples). |
| Create a migration plan |Planning ahead can make migration go more smoothly. Learn more about [user migration](user-migration.md).|
| Usability vs. security | Your solution must strike the right balance between application usability and your organization's acceptable level of risk. |
| Move on-premises dependencies to the cloud | To help ensure a resilient solution, consider moving existing application dependencies to the cloud. |
| Migrate existing apps to b2clogin.com | The deprecation of login.microsoftonline.com will go into effect for all Azure AD B2C tenants on 04 December 2020. [Learn more](b2clogin.md). |

## Implementation

During the implementation phase, consider the following recommendations.

| Best practice | Description |
|--|--|
| Edit custom policies with the Azure AD B2C extension for Visual Studio Code | Download Visual Studio Code and this community-built [extension from the Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AzureADB2CTools.aadb2c). While not an official Microsoft product, the Azure AD B2C extension for Visual Studio Code includes several features that help make working with custom policies easier. |
| Learn how to troubleshoot Azure AD B2C | Learn how to [troubleshoot custom policies](https://docs.microsoft.com/azure/active-directory-b2c/troubleshoot-custom-policies?tabs=applications) during development. Learn what a normal authentication flow looks like and use tools for discovering anomalies and errors. For example, use [Application Insights](troubleshoot-with-application-insights.md) to review output logs of user journeys. |
| Leverage our library of proven custom policy patterns | Find [samples](https://github.com/azure-ad-b2c/samples) for several enhanced Azure AD B2C customer identity and access management (CIAM) user journeys. |


## Testing

Test and automate your Azure AD B2C implementation.

| Best practice | Description |
|--|--|
| Account for global traffic | Use traffic sources from different global address to test the performance and localization requirements. Make sure all the HTMLs, CSS, and dependencies can meet your performance needs. |
| Functional and UI testing | Test the user flows end-to-end. Add synthetic tests every few minutes using Selenium, VS Web Test, etc. |
| Pen-testing | Before going live with your solution, perform penetration testing exercises to verify all components are secure, including any third-party dependencies. Verify you've secured your APIs with access tokens and used the right authentication protocol for your application scenario. Learn more about [Penetration testing](https://docs.microsoft.com/azure/security/fundamentals/pen-testing) and the [Microsoft Cloud Unified Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1). |
| A/B Testing | Flight your new features with a small, random set of users before rolling out to your entire population. With JavaScript enabled in Azure AD B2C, you can integrate with A/B testing tools like Optimizely, Clarity, and others. |
| Load testing | Azure AD B2C can scale, but your application can scale only if all of its dependencies can scale. Load-test your APIs and CDN. |
| Throttling |  Azure AD B2C throttles traffic if too many requests are sent from the same source in a short period of time. Use several traffic sources while load testing, and handle the `AADB2C90229` error code gracefully in your applications. |
| Automation | Use continuous integration and delivery (CI/CD) pipelines to automate testing and deployments, for example, [Azure DevOps](deploy-custom-policies-devops.md). |

## Operations

Manage your Azure AD B2C environment.

| Best practice | Description |
|--|--|
| Create multiple environments | For easier operations and deployment roll-out, create separate environments for development, testing, pre-production, and production. Create Azure AD B2C tenants for each. |
| Use version control for your custom policies | Consider using GitHub, Azure Repos, or another cloud-based version control system for your Azure AD B2C custom policies. |
| Use the Microsoft Graph API to automate the management of your B2C tenants | Microsoft Graph APIs:<br/>Manage [Identity Experience Framework](https://docs.microsoft.com/graph/api/resources/trustframeworkpolicy?view=graph-rest-beta) (custom policies)<br/>[Keys](https://docs.microsoft.com/graph/api/resources/trustframeworkkeyset?view=graph-rest-beta)<br/>[User Flows](https://docs.microsoft.com/graph/api/resources/identityuserflow?view=graph-rest-beta) |
| Integrate with Azure DevOps | A [CI/CD pipeline](deploy-custom-policies-devops.md) makes moving code between different environments easy and ensures production readiness at all times.   |
| Integrate with Azure Monitor | [Audit log events](view-audit-logs.md) are only retained for seven days. [Integrate with Azure Monitor](azure-monitor.md) to retain the logs for long-term use, or integrate with third-party security information and event management (SIEM) tools to gain insights into your environment. |
| Setup active alerting and monitoring | [Track user behavior](active-directory-b2c-custom-guide-eventlogger-appins.md) in Azure AD B2C using Application Insights. |


## Support and Status Updates

Stay up to date with the state of the service and find support options.

| Best practice | Description |
|--|--|
| [Service updates](https://azure.microsoft.com/updates/?product=active-directory-b2c) |  Stay up to date with Azure AD B2C product updates and announcements. |
| [Microsoft Support](support-options.md) | File a support request for Azure AD B2C technical issues. Billing and subscription management support is provided at no cost. |
| [Azure status](https://status.azure.com/status) | View the current health status of all Azure services. |
