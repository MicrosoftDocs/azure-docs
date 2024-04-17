---
title: AI security posture management
description: Learn about AI security posture management in Microsoft Defender for Cloud and how it protects your resources from AI threats.
ms.date: 04/17/2024
ms.topic: concept-article
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my generative AI resources using Defender for Cloud's AI security posture management capabilities.
---

# AI security posture management

Microsoft Defender for Cloud provides multicloud Artificial Intelligence (AI) security posture management capabilities that that enhances the security of your artificial intelligence (AI) pipelines and services. Defender for Cloud reduces risk to your cloud AI workloads by:

- Discover generative AI application components, data, and AI artifacts from code to cloud.
- Strengthen generative AI application security posture by utilizing built-in recommendations and actively exploring and remediating risks.
- Use the attack path analysis to identify attack path risks.

:::image type="content" source="media/ai-security-posture/ai-lifecycle.png" alt-text="An image of the development lifecycle that is covered by Defender for Cloud's AI security posture management.":::

## Discover generative AI apps

Defender for Cloud’s AI bill of material provides visibility of AI workloads that includes the models, SDKs, and datasets allowing organizations to identify and address vulnerabilities ensuring that generative AI applications are protected from potential threats.

Defenders for Cloud’s capabilities are designed to automatically and continuously discover deployed AI workloads and configurations of AI models, SDKs, plugins, and technologies across services such as Azure OpenAI Service, Azure Machine Learning, and Amazon Bedrock. Defender for Cloud can also detect vulnerabilities within generative AI library dependencies, whether in source code or container images. 

Through the Defender Cloud Security Posture Management (CSPM) plan, Defender for Cloud discovers generative AI artifacts by scanning code repositories for Infrastructure-as-Code (IaC) misconfigurations and container images for vulnerabilities. These vulnerabilities are presented as recommendations which security teams can use to analyze and remediate the issues to maintain the security and integrity of their AI applications. 

Learn how to [discover generative AI applications](identify-ai-workload-model.md) in Defender for Cloud.

## AI data security with attack path analysis

Organizations can use Defender for Cloud's attack paths analysis to detect risks to sensitive data. By using the attack path analysis, security teams can ensure the security and integrity of their AI applications. 

Attack path analysis allows you to proactively remove attack paths to your AI models, minimizing the risk of unauthorized access or data leakage. By monitoring and analyzing your AI pipelines, Defender for Cloud helps identify potential vulnerabilities and provides recommendations to strengthen your data security posture.

## Detecting misconfigurations

Identifying misconfigurations in Infrastructure as Code (IaC) is crucial for services such as AWS SageMaker and Azure AI Services. Misconfigurations can expose your generative AI applications to security vulnerabilities and weaknesses such as over-exposed access controls or inadvertent publicly exposed services. These misconfigurations could lead to data breaches or unauthorized access to sensitive data, including proprietary models and datasets. Misconfigurations can also result in compliance issues, especially when handling strict data privacy regulations.

To address these issues effectively, it's important to shift left and fix IaC problems at the source. Defender for Cloud can detect and remediate misconfigurations early in the development cycle allowing organizations to prevent them from becoming more complex problems later on. 

Early detection allows for tighter security measures and better compliance with regulatory standards. Defender for Cloud provides visibility into misconfigurations in IaC templates, but also identifies the source code responsible for provisioning the runtime resources, enabling quick and simple remediation process.

## Related content

- [Explore risks to generative AI applications](explore-ai-risk.md)
- [Review security recommendations](review-security-recommendations.md)
- [Identify and remediate attack paths](how-to-manage-attack-path.md)
