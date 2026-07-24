---
title: Artificial intelligence shared responsibility model
description: "Understand the AI shared responsibility model and which tasks the AI platform or application provider handles and which tasks you handle."
services: security
author: richarddiver-ms
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 07/21/2026
ms.author: mbaldwin
ai-usage: ai-assisted

---
# Artificial intelligence (AI) shared responsibility model

As you consider and evaluate AI-enabled integration, it's critical to understand the shared responsibility model and which tasks the AI platform or application provider handles and which tasks you handle. The workload responsibilities vary depending on whether the AI integration is based on software as a service (SaaS), platform as a service (PaaS), or infrastructure as a service (IaaS).

## Division of responsibility

As with cloud services, multiple options exist when you implement AI capabilities for your organization. Depending on which option you choose, you take responsibility for different parts of the necessary operations and policies needed to use AI safely.

The following diagram illustrates the areas of responsibility between you and Microsoft according to the type of deployment.

:::image type="content" source="media/shared-responsibility-ai/ai-shared-responsibility.svg" alt-text="Diagram of the shared responsibility matrix for AI deployments showing user and Microsoft responsibilities across AI platform, application, and usage layers." border="false":::

## AI layer overview

An AI-enabled application consists of three layers of functionality that group together tasks that you or an AI provider perform. The security responsibilities generally reside with the party that performs the tasks, but an AI provider might choose to expose security or other controls as a configuration option to you as appropriate. These three layers include:

### AI platform
The AI platform layer provides the AI capabilities to the applications. At the platform layer, you need to build and safeguard the infrastructure that runs the AI model, training data, and specific configurations that change the behavior of the model, such as weights and biases. This platform layer provides access to functionality through APIs. The APIs pass text known as a *metaprompt* to the AI model for processing, then return the generated outcome, known as a *prompt-response*.

**AI platform security considerations** - To protect the AI platform from malicious inputs, a safety system must filter out the potentially harmful instructions sent to the AI model (inputs). Because AI models are generative, they might also generate and return some harmful content to the user (outputs). Any safety system must first protect against potentially harmful inputs and outputs of many classifications including hate, jailbreaks, and other harms. These harm classifications are likely to evolve over time based on model knowledge, locale, and industry.

Microsoft has built-in safety systems for both PaaS and SaaS offerings:

- PaaS - [Azure OpenAI Service](/azure/ai-services/openai/overview)
- SaaS - [Microsoft Security Copilot](https://www.microsoft.com/security/business/ai-machine-learning/microsoft-security-copilot)

### AI application
The AI application accesses the AI capabilities and provides the service or interface that the user consumes. The components in this layer can vary from relatively simple to highly complex, depending on the application. The simplest standalone AI applications act as an interface to a set of APIs that take a text-based user prompt and pass that data to the model for a response. More complex AI applications include the ability to ground the user prompt with extra context, including a persistence layer, semantic index, or plugins that allow access to more data sources. Advanced AI applications might also interface with existing applications and systems. Existing applications and systems might process text, audio, and images to generate various types of content.

**AI application security considerations** - Build an application safety system to protect the AI application from malicious activities. The safety system provides deep inspection of the content used in the metaprompt sent to the AI model. The safety system also inspects the interactions with any plugins, data connectors, and other AI applications (known as AI orchestration). One way you can incorporate this in your own IaaS/PaaS-based AI application is to use the [Azure AI Content Safety](/azure/ai-services/content-safety/overview) service. Other capabilities are available depending on your needs.

### AI usage
The AI usage layer describes how the AI capabilities are ultimately used and consumed. Generative AI offers a new type of user/computer interface, which is fundamentally different from other computer interfaces, such as APIs, command prompts, and graphical user interfaces (GUIs). The generative AI interface is both interactive and dynamic, allowing the computer capabilities to adjust to the user and their intent. The generative AI interface contrasts with previous interfaces that primarily force users to learn the system design and functionality and adjust to it. This interactivity allows user input, rather than application designers, to have a high level of influence on the output of the system, making safety guardrails critical to protecting people, data, and business assets.

**AI usage security considerations** - Protecting AI usage is similar to protecting any computer system because it relies on security assurances for identity and access controls, device protections and monitoring, data protection and governance, administrative controls, and other controls.

User behavior and accountability require more emphasis because users exert more influence on the output of the systems. It's critical to update acceptable use policies and educate users on the differences between standard IT applications and AI-enabled applications. Acceptable use policies should include AI-specific considerations related to security, privacy, and ethics. Additionally, educate users on AI-based attacks that attackers can use to trick them with convincing fake text, voices, videos, and more.

The following resources define AI-specific attack types:

- [Microsoft Security Response Center's (MSRC) vulnerability severity classification for AI systems](https://www.microsoft.com/msrc/aibugbar)
- [MITRE Adversarial Threat Landscape for Artificial-Intelligence Systems (ATLAS)](https://atlas.mitre.org/)
- [OWASP top 10 for Large Language Model (LLM) applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [OWASP Machine Learning (ML) security top 10](https://owasp.org/www-project-machine-learning-security-top-10/)
- [NIST AI risk management framework](https://www.nist.gov/itl/ai-risk-management-framework)

## Security lifecycle
As with security for other types of capability, it's critical to plan for a complete approach. A complete approach includes people, process, and technology across the full security lifecycle: identify, protect, detect, respond, recover, and govern. Any gap or weakness in this lifecycle could cause you to:

- Fail to secure important assets
- Experience preventable attacks
- Be unable to handle attacks
- Be unable to quickly restore business-critical services
- Apply controls inconsistently

For more information about the unique nature of AI threat testing, see [Microsoft AI Red Team is building the future of safer AI](https://www.microsoft.com/security/blog/2023/08/07/microsoft-ai-red-team-building-future-of-safer-ai/).

## Configure before customize
Microsoft recommends that organizations start with SaaS-based approaches like the Copilot model for their initial adoption of AI and for all subsequent AI workloads. This approach minimizes the level of responsibility and expertise your organization must provide to design, operate, and secure these highly complex capabilities.

If the current off-the-shelf capabilities don't meet the specific needs for a workload, you can adopt a PaaS model by using AI services, such as [Azure OpenAI Service](/azure/ai-services/openai/overview), to meet those specific requirements.

Only organizations with deep expertise in data science and the security, privacy, and ethical considerations of AI should adopt custom model building.

To help bring AI to the world, Microsoft is developing Copilot solutions for each of the main productivity solutions: from Bing and Windows to GitHub and Microsoft 365. Microsoft is developing full-stack solutions for all types of productivity scenarios. Microsoft offers these capabilities as SaaS solutions. Microsoft builds these capabilities into the product user interface, where they're tuned to assist the user with specific tasks to increase productivity.

Microsoft engineers every Copilot solution according to Microsoft's strong principles for [AI governance](https://blogs.microsoft.com/on-the-issues/2023/05/25/how-do-we-best-govern-ai/).

## Next steps

Learn more about [Azure AI security best practices](ai-security-best-practices.md).

Learn more about Microsoft's product development requirements for responsible AI in the [Microsoft Responsible AI Standard](https://www.microsoft.com/ai/principles-and-approach/).

Learn about [shared responsibilities for cloud computing](shared-responsibility.md).
