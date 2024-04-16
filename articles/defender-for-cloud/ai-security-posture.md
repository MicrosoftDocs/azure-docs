---
title: Protect your AI security posture management
description: Learn about AI security posture management in Microsoft Defender for Cloud and how it protects your resources from AI threats.
ms.date: 04/15/2024
ms.topic: overview
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my generative AI resources using Defender for Cloud's AI security posture management capabilities.
---

# Protect your AI security posture management

Microsoft Defender for Cloud provides multicloud Artificial Intelligence (AI) security posture management capabilities that that enhances the security of your artificial intelligence (AI) pipelines and services. As more organizations implement generative AI applications using Azure based AIs and non-microsoft AI services, its important to ensure that these generative AI resources are secure.

Generative AI based applications are at risk to a variety of threats that are exclusive to AI models. These threats include jailbreaks, prompt and plugin injections, disclosure of sensitive data, evasion, and data poisoning. Defender for Cloud's Cloud Native Application Protection Platform (CNAPP) provides security alerts and recommendations designed to provide your organization with AI-SPM capabilities that secure your generative AI resources.

Defender for Cloud's AI-SPM capabilities provide security throughout the development lifecycle, starting with Defender for DevOps, and continuing through Defender for Cloud's runtime protection.

:::image type="content" source="media/ai-security-posture/ai-lifecycle.png" alt-text="An image of the development lifecycle that is covered by Defender for Cloud's AI security posture management.":::

## Full-stack visibility for AI pipelines

It is important to identify vulnerable generative AI library dependencies in source code and container images to maintain the security and integrity of AI applications. Libraries such as TensorFlow, PyTorch, and Langchain are utilized in generative AI projects for  machine learning, data processing, and neural network implementation. These libraries, which can be part of the codebase or embedded in container images, can contain vulnerabilities that may be exploited by malicious actors. 

As a result, threat actors can breach data, compromise system integrity, or cause other security incidents. Developers must keep track of these vulnerabilities and update or patch their dependencies accordingly to ensure the trustworthiness and reliability of the systems they are developing.

Defender for Cloud's AI-SPM provides comprehensive visibility into your AI pipelines, allowing you to understand the entire stack. It covers everything from data preparation and model training to deployment and inference. Defender for Cloud identifies AI services, technologies, and software development kits (SDKs) without any agents including managed services such as AWS SageMaker and well-known AI technologies such as TensorFlow Hub.

## AI data security with attack path analysis

Protect your sensitive data with Defender for Cloud's data security posture management for AI capabilities. data security posture management automatically detects sensitive data and brings visibility to the attack paths to it, ensuring the security and integrity of your AI systems. By analyzing potential vulnerabilities, AI-SPM helps you identify risks of data leakage and provides guidance for quick remediation.

Safeguarding your sensitive training data is crucial to prevent compromise and maintain the trustworthiness of your AI models. With data security posture management AI controls, you can proactively remove attack paths to your AI models, minimizing the risk of unauthorized access or data leakage. By continuously monitoring and analyzing your AI pipelines, Defender for Cloud helps you identify potential vulnerabilities and provides recommendations to strengthen your data security posture.

Defender for Cloud's data security posture management for AI capabilities go beyond traditional security measures by providing comprehensive visibility into your AI pipelines. It automatically detects sensitive data and analyzes potential vulnerabilities, allowing you to take proactive measures to protect your AI systems. With the guidance and recommendations provided by Defender for Cloud, you can quickly remediate any identified risks and ensure the security and integrity of your AI resources.

## Detecting misconfigurations

Identifying misconfigurations in Infrastructure as Code (IaC) is crucial for services such as AWS SageMaker and Azure AI Services. Misconfigurations can expose your generative AI applications to security vulnerabilities and weaknesses such as over-exposed access controls or inadvertently publicly exposed services. These misconfigurations could lead to data breaches or unauthorized access to sensitive data, including proprietary models and datasets. Misconfigurations can also result in compliance issues, especially when handling strict data privacy regulations.

To address these issues effectively, it is important to shift left and fix IaC problems at the source. Defender for Cloud can detect and remediate misconfigurations early in the development cycle allowing organizations to prevent them from becoming more complex problems later on. 

Early detection allows for tighter security measures and better compliance with regulatory standards. Defender for Cloud provides visibility into misconfigurations in IaC templates, but also identifies the source code responsible for provisioning the runtime resources, enabling quick and simple remediation process.

## Secure AI pipelines

Defender for Cloud empowers AI developers and data scientists to proactively address security issues through recommendations and alerts. Defender for Cloud enhances your AI security posture, by highlighting a prioritized queue of risks through the use of the recommendations and security alerts. With this information, teams can quickly focus on the most critical vulnerabilities and take necessary actions to mitigate them. Additionally, project-based workflows and role-based access control (RBAC) ensure that alerts are directed to the appropriate teams, enabling efficient collaboration and response.

Defender for Cloud's comprehensive view of the security status of AI pipelines which allow organizations to identify and address misconfigurations and eliminate potential attack paths. By providing full-stack visibility, Defender for Cloud ensures that AI resources are protected throughout the development lifecycle. With this level of security, organizations can embrace AI innovation while maintaining robust security practices.

Defender for Cloud facilitates collaboration between AI developers, data scientists, and security teams by allowing them to work together in a project-based environment, leveraging RBAC to segment the security graph. This ensures that alerts and recommendations are directed to the right team, streamlining the response process and maximizing efficiency in addressing AI-related security risks.

## Related content

AI-SPM ensures the security of AI pipelines, addresses misconfigurations, and eliminates attack paths. It empowers AI developers and data scientists to proactively fix issues with the AI Security Dashboard, providing an overview of AI security posture and a prioritized queue of risks. Project-based workflows and role-based access control (RBAC) enable efficient collaboration and response. With Defender for Cloud, organizations can embrace AI innovation while maintaining robust security practices.

- [Identify generative AI attack paths](Identify-ai-attack-paths.md)
- [Identify vulnerabilities on AI container images](identify-ai-container-image.md)
- [Identify vulnerabilities in AI code repositories](identify-ai-vulnerable-code.md)
- [Identify AI workloads and models in use](identify-ai-workload-model.md)
- [Review recommendations for AI applications](review-recommendations-for-ai.md)
