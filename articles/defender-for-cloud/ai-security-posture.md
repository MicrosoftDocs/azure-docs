---
title: AI security posture management
description: Learn about AI security posture management in Microsoft Defender for Cloud and how it protects resources from AI threats.
ms.date: 04/18/2024
ms.topic: concept-article
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my generative AI resources using Defender for Cloud's AI security posture management capabilities.
---

# AI security posture management

Microsoft Defender for Cloud provides AI security posture management capabilities for Azure and AWS that that enhances the security of AI pipelines and services. Defender for Cloud reduces risk to cross cloud AI workloads by:

- Discovering generative AI bill of materials (AI BOM), which includes application components, data, and AI artifacts from code to cloud.
- Strengthening generative AI application security posture with built-in recommendations and by exploring and remediating security risks.
- Using the attack path analysis to identify and remediate risks.

:::image type="content" source="media/ai-security-posture/ai-lifecycle.png" alt-text="An image of the development lifecycle that is covered by Defender for Cloud's AI security posture management.":::

## Discovering generative AI apps

Defender for Cloud discovers AI workloads to identify a detailed inventory of your organization's AIBOM. This visibility allows you to identify and address vulnerabilities and protect generative AI applications from potential threats.

Defenders for Cloud automatically and continuously discover deployed AI workloads across the following service: 

- Azure OpenAI Service
- Azure Machine Learning
- Amazon Bedrock.

In addition to discovering deployed AI workloads, Defender for Cloud can also discover vulnerabilities within generative AI library dependencies such as TensorFlow, PyTorch, and Langchain. By scanning source code for Infrastructure as Code (IaC) misconfigurations and container images for vulnerabilities.

Regularly updating or patching these can prevent exploits, protecting generative AI applications and maintaining their integrity.

Libraries such as TensorFlow, PyTorch, and Langchain. Regularly updating or patching these can prevent exploits, protecting generative AI applications and maintaining their integrity.

With these features, Defender for Cloud provides full visibility of AI workloads from code to cloud.

### How discovery works

When the Defender Cloud Security Posture Management (CSPM) plan is enabled, Defender for Cloud discovers generative AI components by scanning code repositories for IaC misconfigurations and container images for vulnerabilities. 

These vulnerabilities are presented as recommendations which you can use to analyze and remediate security issues.

## Reducing risks to generative AI apps

Defender CSPM provides contextual insights into an organization's AI security posture. You can reduce risks within your AI workloads using security recommendations and attack path analysis.

### Explore risks using recommendations

Defender for Cloud assesses AI workloads and issues recommendations around identity, data security, and internet exposure to identify and prioritize critical security issues in AI workloads.

### Analyzing attack paths

Attack paths analysis detects and mitigates risks to AI workloads, particularly during grounding (linking AI models to specific data) and fine-tuning (adjusting a pre-trained model on a specific dataset to improve its performance on a related task) stages, where data might be exposed. 

By continuously monitoring AI workloads, attack path analysis can identify weaknesses and potential vulnerabilities and follow up with recommendations. Additionally, it extends to cases where the data and compute resources are distributed across Azure, AWS and GCP.

### Detecting IaC misconfigurations

DevOps security detects IaC misconfigurations can expose generative AI applications to security vulnerabilities such as over-exposed access controls or inadvertent publicly exposed services. These misconfigurations could lead to data breaches or unauthorized access. Misconfigurations could lead to compliance issues, especially when handling strict data privacy regulations.

Defender for Cloud assesses your generative AI apps configuration and provides security recommendations to improve AI security posture. Remediate misconfigurations early in the development cycle allows organizations to prevent more complex problems later on. 

Current IaC AI security checks include:

- Use Azure AI Service Private Endpoints
- Restrict Azure AI Service Endpoints
- Use Managed Identity for Azure AI Service Accounts
- Use identity-based authentication for Azure AI Service Accounts

:::image type="content" source="media/ai-security-posture/misconfigurations.png" alt-text="Screenshot that shows where the security checks can be found in the portal." lightbox="media/ai-security-posture/misconfigurations.png":::

## Related content

- [Explore risks to generative AI applications](explore-ai-risk.md)
- [Review security recommendations](review-security-recommendations.md)
- [Identify and remediate attack paths](how-to-manage-attack-path.md)
- [Discover generative AI applications](identify-ai-workload-model.md)
