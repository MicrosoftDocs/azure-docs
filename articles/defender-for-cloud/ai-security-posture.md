---
title: AI security posture management
description: Learn about AI security posture management in Microsoft Defender for Cloud and how it protects resources from AI threats.
ms.date: 04/17/2024
ms.topic: concept-article
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my generative AI resources using Defender for Cloud's AI security posture management capabilities.
---

# AI security posture management

Microsoft Defender for Cloud provides multicloud AI security posture management capabilities that that enhances the security of AI pipelines and services. Defender for Cloud reduces risk to cloud AI workloads by:

- Discovering generative AI application components, data, and AI artifacts from code to cloud.
- Strengthening generative AI application security posture with built-in recommendations and by exploring and remediating security risks.
- Using the attack path analysis to identify potential attack paths.

:::image type="content" source="media/ai-security-posture/ai-lifecycle.png" alt-text="An image of the development lifecycle that is covered by Defender for Cloud's AI security posture management.":::

## Discovering generative AI apps

Defender for Cloud provides visibility into AI workloads that includes the models, SDKs, and datasets. This visibility allows you to identify and address vulnerabilities and protect generative AI applications from potential threats.

Defenders for Cloud continuously discover deployed AI workloads. Currently supported AI workloads include: 

- Azure OpenAI Service
- Azure Machine Learning
- Amazon Bedrock.

Defender for Cloud can also detect vulnerabilities within generative AI library dependencies, whether in source code or container images. 

### How discovery works

When the Defender Cloud Security Posture Management (CSPM) plan is enabled, Defender for Cloud discovers generative AI components by scanning code repositories for Infrastructure-as-Code (IaC) misconfigurations and container images for vulnerabilities. 

These vulnerabilities are presented as recommendations which you can use to analyze and remediate security issues.

## Reducing risk to generative AI apps

Defender CSPM provides contextual insights into an orginazational's AI security posture. You can reduce risk using security recommendations and attack path analysis.

### Analyzing attack paths

Attack paths analysis detects risks to sensitive AI data.

Attack path analysis allows you to proactively remove potential attack paths to AI models, minimizing the risk of unauthorized access or data leakage. 

By monitoring and analyzing AI pipelines, you can identify potential vulnerabilities and follow recommendations.

### Detecting misconfigurations

Misconfigurations can expose generative AI applications to security vulnerabilities such as over-exposed access controls or inadvertent publicly exposed services. These misconfigurations could lead to data breaches or unauthorized access. Misconfigurations could lead to compliance issues, especially when handling strict data privacy regulations.

Defender for Cloud assess your configuration and provides security recommendations to improve AI security posture. Remediate misconfigurations early in the development cycle allowing organizations to prevent more complex problems later on. 

Current recommendations include:

- Use Azure AI Service Private Endpoints
- Restrict Azure AI Service Endpoints
- Use Managed Identity for Azure AI Service Accounts
- Use identity-based authentication for Azure AI Service Accounts

## Related content

- [Explore risks to generative AI applications](explore-ai-risk.md)
- [Review security recommendations](review-security-recommendations.md)
- [Identify and remediate attack paths](how-to-manage-attack-path.md)
- [Discover generative AI applications](identify-ai-workload-model.md)
