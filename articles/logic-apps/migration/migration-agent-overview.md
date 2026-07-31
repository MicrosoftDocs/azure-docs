---
title: Migration Automation from Integration Platforms
titleSuffix: Azure Logic Apps
description: "Learn about automated migration from BizTalk Server, MuleSoft, and other integration platforms to Azure Logic Apps (Standard) with the Migration Agent in Visual Studio Code."
services: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: overview
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 04/27/2026
# Customer intent: As a developer who works with enterprise integration platforms, such as BizTalk Server, MuleSoft, and others, I want to learn about automating the migration process for my integration projects to Azure Logic Apps (Standard) by using the Migration Agent extension in Visual Studio Code.
---

# Migration automation from integration platforms to Azure Logic Apps (preview)

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If your organization uses integration platforms like BizTalk Server, MuleSoft Anypoint, or other middleware, migrating these workloads to Azure Logic Apps can feel complex and challenging. A typical migration involves the following tasks:

- Discover and catalog integration artifacts in the source platform.
- Analyze complexity and plan a migration roadmap.
- Convert source artifacts into Standard workflows for Azure Logic Apps.
- Validate generated workflows against source specifications.
- Deploy the migrated solution to Azure.

To guide you through the migration process, use Visual Studio Code and the Azure Logic Apps Migration Agent extension. This AI-powered extension automates migrating enterprise integrations to Standard workflows in Azure Logic Apps.

The migration agent walks you through a structured 5-stage migration workflow. Built on GitHub Copilot and the Visual Studio Code Language Model API, the extension works with specialized GitHub Copilot agents and built-in parsers, while you stay in control at every step.

This article provides an overview about the migration agent, the extension's key capabilities, supported source platforms, and the guided 5-stage migration workflow.

## Supported source platforms and deployment environments

The migration agent currently supports the following source integration platforms:

| Source platform | Versions | Status | Parser |
|-----------------|----------|--------|--------|
| BizTalk Server | 2016, 2020 | Fully completed | Built-in |
| MuleSoft Anypoint | Mule 3, Mule 4 | In progress, not yet available | Built-in (stub) |

The Azure Logic Apps Migration Agent extension for Visual Studio Code is an open-source, extensible project. To add support for a new platform, contribute a built-in parser or create an external parser extension. For more information, see [Extend the migration agent by creating and adding custom parsers for new platforms](migration-agent-extend.md).

<a id="biztalk-support"></a>

### Supported BizTalk Server artifact types

The migration agent currently supports the following BizTalk Server artifact types:

| Artifact type | File name extension | Description |
|---------------|---------------------|-------------|
| Project | `.btproj` | BizTalk project file |
| Orchestration | `.odx` | BizTalk orchestration definition |
| Schema | `.xsd` | XML schema definition |
| Map | `.btm` | BizTalk map (XSLT transformation) |
| Pipeline | `.btp` | BizTalk pipeline definition |
| Bindings | `.xml` | Port bindings and endpoint configuration |

<a id="mulesoft-support"></a>

### Supported MuleSoft Anypoint artifact types

The migration agent currently supports the following MuleSoft Anypoint artifact types:

| Artifact type | File pattern | Description |
|---------------|---------------------|-------------|
| Flow | `mule-*.xml` | Mule flow definitions |
| Configuration | `pom.xml` | Project dependencies and configuration |

### Supported target deployment environments

The migration agent currently generates Standard workflows for the following target deployment environments and hosting options:

| Target environment | Hosting option |
|--------------------|----------------|
| Single-tenant Azure Logic Apps (Standard) | Workflow Service Plan |
| Your own partially connected, on-premises infrastructure | Hybrid |

For more information, see [Differences between Standard and Consumption logic apps](../single-tenant-overview-compare.md).

## Key capabilities in Azure Logic Apps Migration Agent

The migration agent includes the following core capabilities:

| Capability | Features |
|------------|----------|
| Multi-platform support | Built-in parsers plus an extensible parser plug-in system for partner platforms. |
| 5-stage guided workflow | Follows a structured migration process from discovery to deployment with progress tracking and visualization at each stage. |
| AI-powered analysis and conversion | Specialized GitHub Copilot agents that analyze, plan, and convert your integration artifacts: <br><br>- `@migration-analyser` <br>- `@migration-planner` <br>- `@migration-converter` |
| Built-in parsers | TypeScript-based parsers for BizTalk orchestrations, maps, schemas, pipelines, and bindings. |
| Flow visualization | Interactive architecture diagrams, message flows, gap analysis, and dependency tracking. |
| Azure deployment | Direct deployment configuration from Visual Studio Code. |

## Migration stages for integration projects

The migration agent guides you through the following 5-stage migration workflow:

:::image type="content" source="media/migration-agent-overview/migration-stages.png" alt-text="Diagram that shows the five migration stages: Discovery, Planning, Conversion, Validation, and Deployment." lightbox="media/migration-agent-overview/migration-stages.png":::

| Order | Stage | Purpose |
|-------|-------|---------|
| 1 | **Discovery** | Scan, detect, and catalog integration artifacts on the source platform. <br><br>The agent automatically detects the platform, scans files, and builds a dependency graph and artifact inventory. |
| 2 | **Planning** | Analyze complexity, plan the migration roadmap, and map source patterns to Logic Apps patterns. <br><br>The agent generates migration plans for each flow with action mappings, gap analysis, and effort estimates. |
| 3 | **Conversion** | Transform source artifacts into Standard workflows, connections, and supporting files for Azure Logic Apps. <br><br>The agent creates conversion tasks and executes the task plans generated during the planning stage. |
| 4 | **Validation** | Test generated workflows and validate behavior against source specifications. |
| 5 | **Deployment** | Deploy generated artifacts for Azure Logic Apps to Azure. |

## GitHub Copilot agents used in migration

In your Visual Studio Code project workspace, the migration agent sets up and works with the following GitHub Copilot agents to help you through the migration automation process:

| GitHub Copilot agent | Task |
|----------------------|------|
| `@migration-analyser` | Analyze discovered artifacts, detect flow groups, and generate architecture visualizations. |
| `@migration-planner` | Create migration plans for each flow with action mappings and gap analysis. |
| `@migration-converter` | Run conversion tasks that generate Standard workflows and connections for Azure Logic Apps. |

These agents work with 25 language model tools registered in Visual Studio Code to read artifacts, store results, and manage the migration workflow.

## Related content

- [Migration agent stage 1 - Discovery](migration-agent-discovery-stage.md)
- [Migration agent stage 2 - Planning](migration-agent-planning-stage.md)
- [Migration agent stage 3 - Conversion](migration-agent-conversion-stage.md)
- [Migration agent stage 4 - Validation](migration-agent-validation-stage.md)
- [Migration agent stage 5 - Deployment](migration-agent-deployment-stage.md)
- [Extend the migration agent by creating custom  for unsupported integration platforms](migration-agent-extend.md)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Migrate an integration project using the Azure Logic Apps Migration Agent](migration-agent-quickstart.md)
