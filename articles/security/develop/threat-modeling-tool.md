---
title: Microsoft threat modeling tools - SecureDesignStudio and Threat Modeling Tool
description: Compare SecureDesignStudio and Microsoft Threat Modeling Tool, and find getting-started guidance for each to model your design and review security and privacy risks.
author: simorjay
ms.author: frasim
ms.service: security
ms.subservice: security-develop
ms.topic: overview
ms.date: 11/13/2026
#customer intent: As a software architect or developer, I want to choose a threat modeling tool so that I can review security and privacy risks early in the design process.
---

# Microsoft threat modeling tools

Threat modeling helps your team understand how a system works, identify what could go wrong, and address risks before they become costly to fix. The Microsoft Security Development Lifecycle (SDL) approach has four steps: diagram the design, identify threats, plan mitigations, and validate them. You don't need to be a security expert to begin.

Microsoft provides two tools for this work:

- **SecureDesignStudio (SDS)**: An open-source, browser-based workspace for Windows, macOS, and Linux that combines data-flow diagrams, scenarios, and security and privacy review.
- **Microsoft Threat Modeling Tool (TMT)**: A Windows desktop app with templates, STRIDE-based threat generation, and reports.

SDS extends the design-review workflow with scenario-based modeling and combined security and privacy review. Choose the tool that fits your team's workflow.

## Use SecureDesignStudio

SDS brings security and privacy into the same design review:

- **Make the design clear.** Map components, data flows, and security and privacy boundaries.
- **Focus the conversation.** Organize the system into scenarios and walk through calls in sequence.
- **Connect data to decisions.** Capture authentication, data classifications, retention, findings, and follow-up work.
- **Keep the review useful.** Save an editable model and share diagrams or review reports.

Core modeling and analysis run locally and don't require an Azure account or AI service.

SDS isn't limited to Azure or Microsoft systems. Its built-in catalog covers Microsoft services, and generic components support on-premises, non-Microsoft, and mixed-cloud designs. For more information, see [SecureDesignStudio feature overview](secure-design-studio-feature-overview.md).

For the public project, source code, and documentation, see [aka.ms/securedesignstudio](https://aka.ms/securedesignstudio). Optional AI-assisted design and review require separate configuration. You can use an authorized deployment of Azure OpenAI in Microsoft Foundry Models, or the Claude Code or Codex CLI with an eligible subscription. AI requests send model context to the selected provider. Use only an organization-approved provider and information you're authorized to share. For more information, see [AI data handling](secure-design-studio-feature-overview.md#optional-ai-and-collaboration).

### Open-source support

SDS is an MIT-licensed open-source project. Its maintainers welcome community contributions. Use [GitHub issues](https://github.com/microsoft/SecureDesignStudio/issues) for bugs and questions. The project maintainers provide maintenance, not a Microsoft product-support contract or service-level agreement. Learn documentation doesn't add a support or stability guarantee.

The [quickstart](secure-design-studio-getting-started.md#start-sds) pins an identified source commit because the project doesn't currently publish tagged releases. A pinned commit makes the instructions reproducible; it isn't a supported release designation.

**[Get started with SecureDesignStudio](secure-design-studio-getting-started.md).**

## Use Microsoft Threat Modeling Tool

**Microsoft Threat Modeling Tool (TMT)** offers a Windows desktop workflow with templates, STRIDE-based threat analysis, and reports. If it fits your team's process, you can continue working with your existing models and templates. To get started, use the TMT column in the following table.

To evaluate SDS with an existing model, import your TMT `.tm7` diagram. Keep the original file, and review the conversion summary, because SDS doesn't transfer all TMT content, such as template properties and native threat records.

## Next steps

Use the following guidance to evaluate SDS or start TMT's desktop workflow.

| Step | SecureDesignStudio | Microsoft Threat Modeling Tool |
| --- | --- | --- |
| **1** | [Set up and start SDS](secure-design-studio-getting-started.md#start-sds) | [Download TMT](https://aka.ms/threatmodelingtool) |
| **2** | [Create your first model](secure-design-studio-getting-started.md#create-a-scenario) | [Read the getting-started guide](threat-modeling-tool-getting-started.md) |
| **3** | [Explore SDS features](secure-design-studio-feature-overview.md) | [Explore TMT features](threat-modeling-tool-feature-overview.md) |
| **4** | [Analyze the model and review findings](secure-design-studio-getting-started.md#analyze-and-review) | [Learn about generated threat categories](threat-modeling-tool-threats.md) |
| **5** | [Save and share your review](secure-design-studio-getting-started.md#save-and-share) | [Find mitigations for generated threats](threat-modeling-tool-mitigations.md) |

Whichever tool you choose, review the design with your team and validate mitigations against the implementation.

## Resources

### Product guidance

- [SecureDesignStudio project and documentation](https://aka.ms/securedesignstudio)
- [Ready-to-open SDS sample models](https://github.com/microsoft/SecureDesignStudio/blob/main/samples/README.md)
- [TMT system requirements and releases](threat-modeling-tool-releases.md)

### Threat modeling background

These earlier resources explain the principles behind threat modeling. Their tool instructions might reflect older versions.

- [Getting started with the SDL Threat Modeling Tool](/archive/msdn-magazine/2009/january/security-briefs-getting-started-with-the-sdl-threat-modeling-tool) (archived article)
- [Threat modeling training from Trustworthy Computing](https://www.microsoft.com/download/details.aspx?id=16420)

### Community resources

- [Threats Manager](https://simoneonsecurity.com/threatsmanagersetup-v1-5-10/)
- [Simone Curzi's security blog](https://simoneonsecurity.com/)
