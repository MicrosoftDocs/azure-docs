---
title: Partner applications in Microsoft Defender for Cloud for API security testing (preview)
description: Learn about security testing scan results from partner applications within Microsoft Defender for Cloud.
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: conceptual
ms.date: 10/30/2023
---

# Partner applications in Microsoft Defender for Cloud for API security testing (preview)

Microsoft Defender for Cloud supports third-party tools to help enhance the existing runtime security capabilities that are provided by Defender for APIs. Defender for Cloud supports proactive API security testing capabilities in early stages of the development lifecycle (including source code repositories and CI/CD pipelines).

## Overview

The support for third-party solutions helps to further streamline, integrate, and orchestrate defenses from other vendors with Microsoft Defender for APIs. This support enables full lifecycle API security, and the ability for security teams to effectively discover and remediate API security vulnerabilities before they are deployed in production.

With this preview, the security scan results from partner applications are now available within Defender for Cloud, ensuring that central security teams have visibility into the health of APIs within the Defender for Cloud recommendation experience. These security teams can now take governance steps that are natively available through Defender for Cloud recommendations, including assigning owners, setting due dates for remediation, and extensibility to export scan results from the Azure Resource Graph into management tools of their choice.

:::image type="content" source="media/defender-partner-applications/api-security.png" alt-text="Screenshot of security analysis." lightbox="media/defender-partner-applications/api-security.png":::

## Preview prerequisites

This preview requires connecting your source code repositories to Defender for Cloud. To complete this step, see [Quickstart: Connect your GitHub repositories to Microsoft Defender for Cloud](quickstart-onboard-github.md).

| Aspect                                          | Details                                                                                                                                               |
|-------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------|
| Required/preferred environmental requirements | APIs within source code repository, including API specification files such as OpenAPI, Swagger.                                                      |
| Clouds                                          |  Available in commercial clouds. Not available in national/sovereign clouds (US Government, China government, other government).                                                 |
| Source code management systems                  |  GitHub-supported versions: GitHub Free, Pro, Team, and GitHub Enterprise Cloud. This also requires a license for GitHub Advanced Security (GHAS). |

## Supported applications

| Logo | Partner name | Description                                                                                                                                                                                    | Enablement Guide |
|----------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| :::image type="content" source="media/defender-partner-applications/42crunch-logo.png" alt-text="42Crunch logo.":::         | 42Crunch         | Developers can proactively test and harden APIs within their CI/CD pipelines through static and dynamic testing of APIs against the top OWASP API risks and OpenAPI specification best practices. | [42Crunch onboarding guide](onboarding-guide-42crunch.md)                 |

## Next steps

[Learn about Defender for APIs](defender-for-apis-introduction.md)
