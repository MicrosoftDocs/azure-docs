---
title: AI security posture management
description: Learn about AI security posture management in Microsoft Defender for Cloud and how it protects your resources from AI threats.
ms.date: 04/15/2024
ms.topic: overview
ms.author: elkrieger
author: Elazark
#customer intent: As a cloud security professional, I want to understand how to secure my Gen-AI resources using Defender for Cloud's AI security posture management capabilities.
---

# AI security posture management

Microsoft Defender for Cloud provides multicloud Artificial Intelligence (AI) security posture management capabilities that that enhances the security of your artificial intelligence (AI) pipelines and services. As more organizations implement generative AI (Gen-AI) applications using Azure based AIs and non-microsoft AI services, its important to ensure that these Gen-AI resources are secure.

Gen-AI based applications are at risk to a variety of threats that are exclusive to AI models. These threats include jailbreaks, prompt and plugin injections, disclosure of sensitive data, evasion, and data poisoning.

Defender for Cloud's Cloud Native Application Protection Platform (CNAPP) provides security alerts and recommendations designed to provide your organization with AI security posture management capabilities that secure your Gen-AI resources.

## AI security posture management in Defender for Cloud

Defender for Cloud's AI security posture management capabilities provide security throughout the development lifecycle, starting with Defender for DevOps, and continuing through Defender for Cloud's runtime protection.

:::image type="content" source="media/ai-security-posture/ai-lifecycle.png" alt-text="An image of the development lifecycle that is covered by Defender for Cloud's AI security posture management.":::

AI security posture management in Defender for Cloud is made up of the following components:

### Full-Stack Visibility for AI Pipelines

It is important to identify vulnerable Gen-AI library dependencies in source code and container images to maintain the security and integrity of AI applications. Libraries such as TensorFlow, PyTorch, and Langchain are utilized in GenAI projects for  machine learning, data processing, and neural network implementation. These libraries, which can be part of the codebase or embedded in container images, can contain vulnerabilities that may be exploited by malicious actors. 

As a result, threat actors can breach data, compromise system integrity, or cause other security incidents. Developers must keep track of these vulnerabilities and update or patch their dependencies accordingly to ensure the trustworthiness and reliability of the systems they are developing.

Defender for Cloud's AI security posture management provides comprehensive visibility into your AI pipelines, allowing you to understand the entire stack. It covers everything from data preparation and model training to deployment and inference. Defender for Cloud identifies AI services, technologies, and software development kits (SDKs) without any agents including managed services such as AWS SageMaker and well-known AI technologies such as TensorFlow Hub.

Learn how to [detect and remediate vulnerabilities in your AI pipelines with Defender for Cloud's cloud security explorer](identify-ai-vulnerable-code.md).

### AI data security with attack path analysis

Protect your sensitive data with Defender for Cloud's Data Security Posture Management (DSPM) for AI capabilities. DSPM automatically detects sensitive data and brings visibility to the attack paths to it, ensuring the security and integrity of your AI systems. By analyzing potential vulnerabilities, AI-SPM helps you identify risks of data leakage and provides guidance for quick remediation.

Safeguarding your sensitive training data is crucial to prevent compromise and maintain the trustworthiness of your AI models. With DSPM AI controls, you can proactively remove attack paths to your AI models, minimizing the risk of unauthorized access or data leakage. By continuously monitoring and analyzing your AI pipelines, Defender for Cloud helps you identify potential vulnerabilities and provides recommendations to strengthen your data security posture.

Defender for Cloud's DSPM for AI capabilities go beyond traditional security measures by providing comprehensive visibility into your AI pipelines. It automatically detects sensitive data and analyzes potential vulnerabilities, allowing you to take proactive measures to protect your AI systems. With the guidance and recommendations provided by Defender for Cloud, you can quickly remediate any identified risks and ensure the security and integrity of your AI resources.

### Detecting Misconfigurations

AI-SPM scans your AI pipelines to detect misconfigurations. It enforces secure configuration baselines for your AI services.
For example, it can identify misconfigured OpenAI services or Amazon Bedrock instances. By adhering to best practices, you can minimize security risks.

### Secure AI pipelines

Defender for Cloud empowers AI developers and data scientists to proactively address security issues through recommendations and alerts. Defender for Cloud enhances your AI security posture, by highlighting a prioritized queue of risks through the use of the recommendations and security alerts. With this information, teams can quickly focus on the most critical vulnerabilities and take necessary actions to mitigate them. Additionally, project-based workflows and role-based access control (RBAC) ensure that alerts are directed to the appropriate teams, enabling efficient collaboration and response.

Defender for Cloud's comprehensive view of the security status of AI pipelines which allow organizations to identify and address misconfigurations and eliminate potential attack paths. By providing full-stack visibility, Defender for Cloud ensures that AI resources are protected throughout the development lifecycle. With this level of security, organizations can embrace AI innovation while maintaining robust security practices.

Defender for Cloud facilitates collaboration between AI developers, data scientists, and security teams by allowing them to work together in a project-based environment, leveraging RBAC to segment the security graph. This ensures that alerts and recommendations are directed to the right team, streamlining the response process and maximizing efficiency in addressing AI-related security risks.


## Summary

In summary, AI-SPM ensures that your AI pipelines are secure, misconfigurations are addressed, and attack paths are eliminated. It’s a valuable tool for organizations embracing AI innovation while maintaining robust security practices.
Empower AI developers and data scientists to proactively fix issues with the new AI Security Dashboard that provides an AI security posture overview with a prioritized queue of risks so they can quickly focus on the most critical ones. Project-based workflows and role-based access control (RBAC) allow you to segment the Defender for Cloud Security Graph and ensure alerts go to the right team.


