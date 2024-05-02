---
title: Partner applications in Microsoft Defender for Cloud for API security testing (preview)
description: Learn about security testing scan results from partner applications within Microsoft Defender for Cloud.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 11/15/2023
---

# Partner applications in Microsoft Defender for Cloud for API security testing (preview)

Microsoft Defender for Cloud supports third-party tools to help enhance the existing runtime security capabilities that are provided by Defender for APIs. Defender for Cloud supports proactive API security testing capabilities in early stages of the development lifecycle (including source code repositories & CI/CD pipelines).

## Overview

The support for third-party solutions helps to further streamline, integrate, and orchestrate security findings from partner solutions with Microsoft Defender for Cloud. This support enables full lifecycle API security, and the ability for security teams to effectively discover and remediate API security vulnerabilities before they are deployed in production.

The security scan results from partner applications are now available within Defender for Cloud, ensuring that central security teams have visibility into the health of APIs within the Defender for Cloud recommendation experience. These security teams can now take governance steps that are natively available through Defender for Cloud recommendations, and extensibility to export scan results from the Azure Resource Graph into management tools of their choice.

:::image type="content" source="media/defender-partner-applications/api-security.png" alt-text="Screenshot of security analysis." lightbox="media/defender-partner-applications/api-security.png":::

## Prerequisites

This feature requires a GitHub connector in Defender for Cloud. See [how to onboard your GitHub organizations](quickstart-onboard-github.md).

| Aspect                                          | Details                                                                                                                                               |
|-------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Release state | Preview <br> The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include other legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.|
| Required/preferred environmental requirements | APIs within source code repository, including API specification files such as OpenAPI, Swagger.                                                      |
| Clouds                                          |  Available in commercial clouds. Not available in national/sovereign clouds (Azure Government, Microsoft Azure operated by 21Vianet).                                                 |
| Source code management systems                  |   [GitHub Enterprise Cloud](https://docs.github.com/enterprise-cloud@latest/admin/overview/about-github-enterprise-cloud). This also requires a license for GitHub Advanced Security (GHAS). <br> <br > [Azure DevOps Services](https://azure.microsoft.com/products/devops/)  |

## Supported applications

| Partner name | Description                                                                                                                                                                                    | Enablement Guide |
|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| [42Crunch](https://aka.ms/APISecurityTestingPartnershipIgnite2023)         | Developers can proactively test and harden APIs within their CI/CD pipelines through static and dynamic testing of APIs against the top OWASP API risks and OpenAPI specification best practices. | [42Crunch onboarding guide](onboarding-guide-42crunch.md)                 |
| [StackHawk](https://aka.ms/APISecurityTestingPRStackHawk) | StackHawk is the only modern DAST and API security testing tool that runs in CI/CD, enabling developers to quickly find and fix security issues before they hit production. | [StackHawk onboarding guide](https://aka.ms/APISecurityTestingOnboardingGuideStackHawk) |
| [Bright Security](https://aka.ms/APISecurityTestingPRBrightSecurity) | Bright Security’s dev-centric DAST platform empowers both developers and AppSec professionals with enterprise grade security testing capabilities for web applications, APIs, and GenAI and LLM applications. Bright knows how to deliver the right tests, at the right time in the SDLC, in developers and AppSec tools and stacks of choice with minimal false positives and alert fatigue. | [Bright Security onboarding guide](https://aka.ms/APISecurityTestingOnboardingGuideBrightSecurity) |

## Next steps

[Learn about Defender for APIs](defender-for-apis-introduction.md)
