---
title: Azure Functions skill for connector validation
description: Use the azure-functions-connector-validate skill to check connector identity, MCP contracts, and external results for hosted skills.
ms.topic: reference
ms.date: 11/03/2026
ms.update-cycle: 180-days
ai-usage: ai-assisted
ms.custom:
  - build-2026
ms.collection:
  - ce-skilling-ai-copilot
---

# Azure Functions skill for connector validation

The `azure-functions-connector-validate` skill checks a deployed connector integration before an Azure Functions hosted skill uses it automatically.

**Skill:** `azure-functions-connector-validate` | [Source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-connector-validate/SKILL.md)

[!INCLUDE [Azure Functions skills preview](../../../includes/functions-skills-preview.md)]

## What it provides

This skill checks the connected account, managed-identity access, MCP configuration, runtime settings, and protocol initialization. It compares the deployed tool names and schemas with the approved contract. It then tests connector operations and the hosted skill's use of those tools.

The skill verifies the result in the downstream service, not just an HTTP success code or successful function execution. Write tests require your approval, a controlled target, and a cleanup plan. Missing proof is reported as not verified.

The skill stops dependent tests after a failure. It does not expand permissions or silently change infrastructure to make a test pass.

## Prerequisites

- [Azure Functions skills installed](../functions-skills.md#install-azure-functions-skills) in a supported coding agent.
- A connection prepared with [`azure-functions-connector-create`](azure-functions-connector-create.md).
- An MCP configuration and expected contract from [`azure-functions-connector-mcp`](azure-functions-connector-mcp.md).
- A deployed hosted skill, the intended identity, and safe read-only test inputs.
- Your approval of any write test, its target, verification method, and cleanup.

## When to use this skill

Use this skill when you need to:

- Confirm that the intended account and managed identity can use a connection.
- Check MCP initialization, tool discovery, and input schemas.
- Verify that no unintended operation is exposed.
- Confirm an email, Teams post, or other approved external result.
- Test the hosted skill before enabling a schedule or event trigger.

For connection or identity failures, use [`azure-functions-connector-create`](azure-functions-connector-create.md). For tool or schema failures, use [`azure-functions-connector-mcp`](azure-functions-connector-mcp.md).

## Example prompts

Try these prompts to activate this skill:

- "Validate this connector integration before I enable the timer."
- "Check that the deployed tools match the approved MCP contract."
- "Verify access for this function app's managed identity."
- "Confirm that this approved Teams test produced the expected post."
- "Report which connector validation checks passed or remain unverified."

## Related content

- [Azure Functions skill for hosted-skills authoring](azure-functions-hosted-skills.md)
- [Azure Functions skill for connector creation](azure-functions-connector-create.md)
- [Azure Functions skill for connector MCP tools](azure-functions-connector-mcp.md)
- [Skill source code](https://github.com/Azure/azure-functions-skills/blob/main/templates/skills/azure-functions-connector-validate/SKILL.md)
