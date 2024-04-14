---
title: AI security posture management
description: Learn about AI security posture management in Microsoft Defender for Cloud and how it protects your resources from AI threats.
ms.date: 04/14/2024
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

Defender for Cloud's AI security posture management provides comprehensive visibility into your AI pipelines, allowing you to understand the entire stack. It covers everything from data preparation and model training to deployment and inference.
With this visibility, you can identify AI services, technologies, and software development kits (SDKs) without any agents. This includes managed services like AWS SageMaker and well-known AI technologies such as TensorFlow Hub.

Enforce AI security best practices with AI-SPM capabilities. Detect any misconfigurations in your AI services such as OpenAI and Amazon Bedrock with built-in configuration rules and extend to your development pipeline with IaC scanning.

### AI data security

Protect your sensitive training data with Defender for Cloud's DSPM for AI capabilities to automatically detect sensitive training data and proactively remove attack paths to it. Identify risks of data leakage with out-of-the-box DSPM AI controls and quickly remediate with guidance.

### Detecting Misconfigurations

AI-SPM scans your AI pipelines to detect misconfigurations. It enforces secure configuration baselines for your AI services.
For example, it can identify misconfigured OpenAI services or Amazon Bedrock instances. By adhering to best practices, you can minimize security risks.

### AI attack paths analysis

Proactively removing attack paths to your AI models is crucial. AI-SPM helps you achieve this by analyzing potential vulnerabilities.
By safeguarding your sensitive training data, you prevent compromise and maintain the integrity of your AI systems.


### Secure AI pipelines

Defender for Cloud empowers AI developers and data scientists to proactively address security issues through recommendations and alerts. Defender for Cloud enhances your AI security posture, by highlighting a prioritized queue of risks through the use of the recommendations and security alerts. With this information, teams can quickly focus on the most critical vulnerabilities and take necessary actions to mitigate them. Additionally, project-based workflows and role-based access control (RBAC) ensure that alerts are directed to the appropriate teams, enabling efficient collaboration and response.

Defender for Cloud's comprehensive view of the security status of AI pipelines which allow organizations to identify and address misconfigurations and eliminate potential attack paths. By providing full-stack visibility, Defender for Cloud ensures that AI resources are protected throughout the development lifecycle. With this level of security, organizations can embrace AI innovation while maintaining robust security practices.

Defender for Cloud facilitates collaboration between AI developers, data scientists, and security teams by allowing them to work together in a project-based environment, leveraging RBAC to segment the security graph. This ensures that alerts and recommendations are directed to the right team, streamlining the response process and maximizing efficiency in addressing AI-related security risks.


## Summary

In summary, AI-SPM ensures that your AI pipelines are secure, misconfigurations are addressed, and attack paths are eliminated. It’s a valuable tool for organizations embracing AI innovation while maintaining robust security practices.
Empower AI developers and data scientists to proactively fix issues with the new AI Security Dashboard that provides an AI security posture overview with a prioritized queue of risks so they can quickly focus on the most critical ones. Project-based workflows and role-based access control (RBAC) allow you to segment the Defender for Cloud Security Graph and ensure alerts go to the right team.


