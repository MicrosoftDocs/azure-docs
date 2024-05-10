---
title: AI security posture management
description: Learn about AI security posture management in Microsoft Defender for Cloud and how it protects resources from AI threats.
ms.date: 05/05/2024
ms.topic: concept-article
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my generative AI resources using Defender for Cloud's AI security posture management capabilities.
---

# AI security posture management

The Defender Cloud Security Posture Management (CSPM) plan in Microsoft Defender for Cloud provides AI security posture management capabilities that secure enterprise-built, multi, or hybrid cloud (currently Azure and AWS) generative AI applications, throughout the entire application lifecycle. Defender for Cloud reduces risk to cross cloud AI workloads by:

- Discovering generative AI Bill of Materials (AI BOM), which includes application components, data, and AI artifacts from code to cloud.
- Strengthening generative AI application security posture with built-in recommendations and by exploring and remediating security risks.
- Using the attack path analysis to identify and remediate risks.

:::image type="content" source="media/ai-security-posture/ai-lifecycle.png" alt-text="Diagram of the development lifecycle that is covered by Defender for Cloud's AI security posture management.":::

## Discovering generative AI apps

Defender for Cloud discovers AI workloads and identifies details of your organization's AI BOM. This visibility allows you to identify and address vulnerabilities and protect generative AI applications from potential threats.

Defenders for Cloud automatically and continuously discover deployed AI workloads across the following services: 

- Azure OpenAI Service
- Azure Machine Learning
- Amazon Bedrock

Defender for Cloud can also discover vulnerabilities within generative AI library dependencies such as TensorFlow, PyTorch, and Langchain, by scanning source code for Infrastructure as Code (IaC) misconfigurations and container images for vulnerabilities. Regularly updating or patching the libraries can prevent exploits, protecting generative AI applications and maintaining their integrity.

With these features, Defender for Cloud provides full visibility of AI workloads from code to cloud.

## Reducing risks to generative AI apps

Defender CSPM provides contextual insights into an organization's AI security posture. You can reduce risks within your AI workloads using security recommendations and attack path analysis.

### Exploring risks using recommendations

Defender for Cloud assesses AI workloads and issues recommendations around identity, data security, and internet exposure to identify and prioritize critical security issues in AI workloads.

#### Detecting IaC misconfigurations

DevOps security detects IaC misconfigurations, which can expose generative AI applications to security vulnerabilities, such as over-exposed access controls or inadvertent publicly exposed services. These misconfigurations could lead to data breaches, unauthorized access, and compliance issues, especially when handling strict data privacy regulations.

Defender for Cloud assesses your generative AI apps configuration and provides security recommendations to improve AI security posture. 

Detected misconfigurations should be remediated early in the development cycle to prevent more complex problems later on. 

Current IaC AI security checks include:

- Use Azure AI Service Private Endpoints
- Restrict Azure AI Service Endpoints
- Use Managed Identity for Azure AI Service Accounts
- Use identity-based authentication for Azure AI Service Accounts

### Exploring risks with attack path analysis

Attack paths analysis detects and mitigates risks to AI workloads, particularly during grounding (linking AI models to specific data) and fine-tuning (adjusting a pretrained model on a specific dataset to improve its performance on a related task) stages, where data might be exposed. 

By monitoring AI workloads continuously, attack path analysis can identify weaknesses and potential vulnerabilities and follow up with recommendations. Additionally, it extends to cases where the data and compute resources are distributed across Azure, AWS, and GCP.

## Related content

- [Explore risks to predeployed generative AI artifacts](explore-ai-risk.md)
- [Review security recommendations](review-security-recommendations.md)
- [Identify and remediate attack paths](how-to-manage-attack-path.md)
- [Discover generative AI workloads](identify-ai-workload-model.md)
