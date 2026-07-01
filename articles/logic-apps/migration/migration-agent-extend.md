---
title: Extend Migration Agent to Other Platforms
description: "Learn how to extend the Azure Logic Apps (Standard) Migration Agent by creating and adding custom parsers that support integration platforms like TIBCO, IBM IIB, Dell Boomi, or Workato."
titleSuffix: Azure Logic Apps
services: azure-logic-apps
ms.suite: integration
author: haroldcampos
ms.author: hcampos
ms.reviewers: estfan, azla
ms.topic: how-to
ai-usage: ai-assisted
ms.update-cycle: 365-days
ms.date: 05/06/2026
# Customer intent: As a developer who works with enterprise integration platforms, I want to extend Azure Logic Apps (Standard) Migration Agent support to other integration platforms so I can migrate my integration solutions to Azure Logic Apps (Standard).
---

# Extend Azure Logic Apps Migration Agent to other platforms by creating custom parsers (preview)

[!INCLUDE [logic-apps-sku-standard](../includes/logic-apps-sku-standard.md)]

> [!NOTE]
>
> This preview feature is subject to the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

If your organization uses an integration platform that the Azure Logic Apps Migration Agent extension in Visual Studio Code doesn't currently support, such as TIBCO BusinessWorks, IBM IIB/ACE, Dell Boomi, or Workato, you can extend the agent by creating and adding a custom parser for that platform. The extension uses a registry-based parser architecture that supports both built-in and external parsers, so you can add platform support without modifying the core migration pipeline.

This article shows how to create and add a custom parser that transforms your source integration platform's artifacts into the migration agent's common Intermediate Representation (IR) format. This JSON document describes artifacts in a platform-neutral way and lets the agent process your artifacts through all 5 migration stages.

## Prerequisites

Before you start, make sure you have the following resources:

| Requirement | Description |
|-------------|-------------|
| [Node.js](https://nodejs.org/) 18 or later | Free, open-source, cross-platform JavaScript runtime environment |
| [Visual Studio Code 1.85.0 or later](https://code.visualstudio.com/download) | Local development experience |
| [Visual Studio Code Extension API](https://code.visualstudio.com/api) | API that lets you build extensions for Visual Studio Code |
| [Azure Logic Apps Migration Agent extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.logicapps-migration-agent) | Required extension with migration agent for Visual Studio Code |
| [Azure Logic Apps (Standard) extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurelogicapps) | Required dependency for the Azure Logic Apps Migration Agent extension |
| Familiarity with [TypeScript](https://www.typescriptlang.org/) | A strongly typed programming language that builds on JavaScript |
| Source integration project | The source integration project and artifact files for the platform where you want support |

## Parser architecture

To add platform support to the migration agent, use the following approaches:

| Approach | Recommended | Description |
|----------|-------------|-------------|
| **Built-in parser**: Contribute to the [extension's GitHub repository](https://go.microsoft.com/fwlink/?linkid=2363903) | Yes | Add a parser and skills directly to the project. Full integration with all five migration stages. This approach is recommended because built-in parsers ship with the extension, use the same CI/CD pipeline, and can access all internal APIs. |
| **External parser extension** | No | Create a separate Visual Studio Code extension that registers parsers through the plugin API. Covers only the Discovery stage. |

All parsers transform source platform artifacts into a common IR format as a JSON document. The migration agent uses the IR format in the planning, conversion, and validation stages. The parser registry supports both built-in and external parser plugins:

| Built-in parsers | External parser plugins |
|------------------|-------------------------|
| BizTalk (`.btproj`, `.odx`) <br>BizTalk (`.btm`, `.xsd`) <br>BizTalk (`.btp`) <br>MuleSoft (stub) | Partner platform parsers <br>Community parsers |

:::image type="content" source="media/migration-agent-extend/parser-architecture.png" alt-text="Diagram that shows how built-in and external parser plugins feed into the common IR document format used by migration stages." lightbox="media/migration-agent-extend/parser-architecture.png":::

## Step 1: Add a built-in parser

1. Under `src/parsers/<your-platform>/`, create a new parser module.

   ```
   src/parsers/
   ├── biztalk/              # Reference implementation
   │   ├── index.ts
   │   ├── types.ts
   │   ├── BizTalkProjectParser.ts
   │   ├── BizTalkOrchestrationParser.ts
   │   └── ...
   ├── <your-platform>/      # Your new parser
   │   ├── index.ts
   │   ├── types.ts
   │   └── <your-platform-parser-name>.ts
   ```

1. Make sure each parser implements the `IParser` interface.

   ```typescript
   import { IParser, ParserCapabilities, ParseResult, ParseOptions } from '../types';
   import { IRDocument, createEmptyIRDocument } from '../../ir/types';

   export class YourPlatformParser implements IParser {
       get capabilities(): ParserCapabilities {
           return {
               platform: '<your-platform>',
               fileExtensions: ['.<your-extension>'],
               fileTypes: ['flow'],
               supportsFolder: false,
               description: 'Parses <your-platform> integration flows.',
           };
       }

       canParse(filePath: string): boolean {
           return filePath.endsWith('.<your-extension>');
       }

       async parse(
           filePath: string,
           options?: ParseOptions
       ): Promise<ParseResult> {
           const ir = createEmptyIRDocument();
           // Parse the source file and populate the IR document.
           // For the complete schema, see docs/IRSchema.md.
           return { ir, stats: { /* parsing statistics */ } };
       }
   }
   ```

1. Register your parser in `src/parsers/index.ts`.

   ```typescript
   import { <your-platform-parser-name> } from './<your-platform>';

   export function initializeParsers(): void {
       // ... existing parsers ...
       defaultParserRegistry.register(new <your-platform-parser-name>());
   }
   ```

   > [!TIP]
   >
   > As a fully working reference, use the BizTalk parser implementation in `src/parsers/biztalk/`.

## Step 2: Add platform-specific skills

As Markdown files, skills provide AI instructions for each migration stage. They tell the GitHub Copilot agents how to analyze, plan, and convert artifacts for your specific platform.

To find these skills, look under `resources/skills/` with platform-specific variants.

```
resources/skills/
├── detect-logical-groups/
│   ├── biztalk/SKILL.md
│   ├── mulesoft/SKILL.md
│   └── <your-platform>/SKILL.md
├── source-to-logic-apps-mapping/
│   ├── biztalk/SKILL.md
│   ├── mulesoft/SKILL.md
│   └── <your-platform>/SKILL.md
└── ... (13 skills total)
```

Each `SKILL.md` file uses YAML frontmatter followed by Markdown content, for example:

```markdown
---
name: source-to-logic-apps-mapping
description: >-
   Component mapping for \<*your-platform*\> components to their equivalents in Azure Logic Apps (Standard).
---
```

## Step 3: Map your platform to Azure Logic Apps (Standard) components

1. Review the following table to create the adapter mappings:

   | \<*your-platform*\> component | Azure Logic Apps equivalent | Native? | Notes |
   |-------------------------------|-----------------------------|---------|-------|
   | HTTP listener | HTTP trigger | Yes | Built-in |
   | Database connector | SQL Server connector | Yes | Built-in |

1. For each skill in the following table, create the required `<your-platform>/SKILL.md` skill variant:

   > [!TIP]
   >
   > Copy the skills for a supported platform, such as `biztalk/SKILL.md`, as a starting point and adapt the content for your platform.

   | GitHub Copilot agent | Skill | Purpose |
   |----------------------|-------|---------|
   | `@migration-analyser` | `detect-logical-groups` | Rules for grouping artifacts into logical flow groups |
   | `@migration-analyser` | `analyse-source-design` | Rules for analyzing source architecture and generating visualizations |
   | `@migration-analyser` | `dependency-and-decompilation-analysis` | Rules for identifying missing dependencies |
   | All agents | `source-to-logic-apps-mapping` | Component-by-component mapping from source to Azure Logic Apps |
   | `@migration-planner` | `logic-apps-planning-rules` | Rules for generating migration plans |
   | `@migration-converter` | `conversion-task-plan-rules` | Rules for creating conversion tasks |
   | `@migration-converter` | `scaffold-logic-apps-project` | Rules for scaffolding the Standard logic app project structure |
   | `@migration-converter` | `workflow-json-generation-rules` | Rules for generating `workflow.json` files |
   | `@migration-converter` | `connections-json-generation-rules` | Rules for generating the `connections.json` file |
   | `@migration-converter` | `dotnet-local-functions-logic-apps` | Rules for generating .NET local functions |
   | `@migration-converter` | `no-stubs-code-generation` | Rules for ensuring that generated code is complete |
   | `@migration-converter` | `runtime-validation-and-testing` | Rules for runtime validation and testing |
   | `@migration-converter` | `cloud-deployment-and-testing` | Rules for cloud deployment and testing |

## Step 4: Register your platform

1. In the `src/types/platforms.ts` file, add your platform to the supported platforms list.

   ```typescript
   export type SourcePlatform = 'biztalk' | 'mulesoft' | '<your-platform>';

   export const SUPPORTED_PLATFORMS: PlatformInfo[] = [
       // ... existing platforms ...
       {
           id: '<your-platform>',
           label: '<your-platform-name>',
           description: '<your-platform> version <version-number>',
           icon: '$(server)',
           filePatterns: ['.<your-extension>', '.<your-config>'],
       },
   ];
   ```

1. In the `src/stages/discovery/PlatformDetector.ts` file, add the detection logic.

1. In the `src/stages/discovery/SourceFolderService.ts` file, add the file patterns.

## Step 5 (optional): Add IR examples

To document how your platform's artifacts map to the IR schema, add a `docs/IRExamples_YourPlatform.md` file. The following examples exist and serve as templates:

| Example | Description |
|---------|-------------|
| `docs/IRExamples_BizTalk.md` | BizTalk reference |
| `docs/IRExamples_MuleSoft.md` | MuleSoft reference |
| `docs/IRExamples_Boomi.md` | Dell Boomi example |
| `docs/IRExamples_IBMIIB.md` | IBM IIB/ACE example |
| `docs/IRExamples_TIBCO.md` | TIBCO BusinessWorks example |
| `docs/IRExamples_Workato.md` | Workato example |

## Alternative: External parser extension

External parser extensions cover only the migration agent's Discovery stage where the agent parses your source files. Skills, platform detection, and AI-powered planning and conversion require that you directly contribute to the [extension's GitHub repository](https://go.microsoft.com/fwlink/?linkid=2363903).

However, if you prefer to not directly contribute to the repository, create a separate Visual Studio Code extension that registers parsers by using the [parse plugin API](#parser-plugin-api):

```typescript
import * as vscode from 'vscode';

export async function activate(context: vscode.ExtensionContext) {
    const assistant = vscode.extensions.getExtension('microsoft.logicapps-migration-assistant');

    if (assistant) {
        const api = await assistant.activate();
        api.registerParser(new MyPlatformParser(), {
            priority: 10,
        });
    }
}
```

### Parser plugin API

| Method or property | Description |
|--------------------|-------------|
| `version` | Extension version (read-only) |
| `registerParser(parser, options?)` | Register a parser with the registry. |
| `unregisterParser(id)` | Remove a registered parser. |
| `getParserRegistry()` | Directly access the parser registry. |
| `hasParser(id)` | Check whether a parser is registered. |
| `getExternalParsers()` | Get information about registered external parsers. |

## Related content

- [Migration automation from integration platforms to Azure Logic Apps](migration-agent-overview.md)

## Next steps

> [!div class="nextstepaction"]
> [Quickstart: Migrate an integration project using the Azure Logic Apps Migration Agent](migration-agent-quickstart.md)
