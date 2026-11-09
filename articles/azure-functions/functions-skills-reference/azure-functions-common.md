---
title: Azure Functions common reference skill
description: Learn how the suite-internal azure-functions-common skill supplies shared runtime, language, trigger, and binding references to other Azure Functions skills.
ms.topic: reference
ms.date: 09/23/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions common reference skill

The `azure-functions-common` skill is a suite-internal reference pack that other Azure Functions skills load when they need reusable runtime, language, trigger, or binding context. It isn't a standalone customer workflow.

**Skill:** `azure-functions-common` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-common/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

The skill provides shared references for:

- Language runtimes and programming models.
- Trigger and binding extensions.
- Local emulators and development services.
- Routing to the minimum reference material needed for a task.
- Official documentation, repositories, samples, and package sources.

Task-specific skills continue to own their workflows, scripts, evidence rules, and output formats. The common skill supplies supporting context and then returns control to the calling skill.

## How other skills use it

An Azure Functions skill loads the common references only when the task requires them. For example:

- `azure-functions-create` can load language and binding references when it adds a trigger to a project.
- `azure-functions-diagnostics` can load a runtime or extension reference after evidence identifies the affected component.
- `azure-functions-best-practices` can load language-specific guidance while reviewing an app.
- A skill can load local-emulator guidance when verification involves a non-HTTP trigger or service-backed binding.

The calling skill loads one language reference when the runtime is known and only the extension references that match the app's triggers, bindings, or symptoms. It doesn't load the entire reference pack.

## Related content

- [Azure Functions skills reference](index.md)
- [Azure Functions triggers and bindings concepts](../functions-triggers-bindings.md)
- [Supported languages in Azure Functions](../supported-languages.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-common/SKILL.md)