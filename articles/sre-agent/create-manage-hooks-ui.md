---
title: "Tutorial: Create and manage hooks in Azure SRE Agent"
description: Create governance hooks in the Azure SRE Agent portal to validate agent responses and audit tool usage with Stop and PostToolUse hooks.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: hooks, governance, stop-hook, post-tool-use, portal, tutorial
#customer intent: As an SRE, I want to create and manage hooks in the portal so that I can validate agent responses and enforce policies without using the REST API.
---

# Tutorial: Create and manage hooks in the portal

In this tutorial, you create two governance hooks by using the portal: a **Stop hook** that enforces data formatting (markdown tables with bold headers) and a **PostToolUse hook** that blocks dangerous shell commands. You configure hooks at both the **agent level** (applies to all threads and subagents) and the **subagent level** (applies to one specific subagent).

**Estimated time**: 10 minutes

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a Stop hook that validates response formatting
> - Create a PostToolUse hook that blocks dangerous shell commands
> - Add hooks to a specific subagent
> - Manage hook activation in individual threads

## Prerequisites

- An Azure SRE Agent in **Running** state
- **Contributor** role or higher on the SRE Agent resource

> [!TIP]
> Hooks you previously created via the [REST API tutorial](tutorial-agent-hooks.md) appear automatically in the portal UI. You can manage them visually without reconfiguring anything.

## Understand where hooks live in the portal

Hooks operate at two levels. Understanding this distinction is a key architectural concept.

| Level | Location in portal | Scope | Use when |
|---|---|---|---|
| **Agent level** | **Builder** > **Hooks** | Applies to the entire agent, all threads, and all subagents | You want agent-wide policies like "audit every tool call" or "block dangerous commands everywhere" |
| **Subagent level** | **Subagent builder** > select subagent > **Manage Hooks** | Applies only when that specific subagent runs | You want hooks tailored to one subagent, like "validate this subagent's output format" |

> [!TIP]
> Both levels can coexist. If an agent-level hook and a subagent-level hook both match the same event, **both run**. Agent-level hooks run first, then subagent-level hooks.

## Create agent-level hooks

Agent-level hooks apply to the entire agent, including every thread and every subagent. They have activation modes that control when they're active.

### Open the Hooks page

Follow these steps to navigate to the Hooks page.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. In the sidebar, expand **Builder**.
1. Select **Hooks**.

You see the **Hooks** heading with a description, a **Create hook** button, and an empty data grid (or a list of existing hooks).

### Create a Stop hook

A Stop hook fires when the agent is about to return a final response. Use it to validate response quality and enforce formatting rules.

1. Select **Create hook**.
1. Fill in the form fields:

    | Field | Value |
    |---|---|
    | **Name** | `require-table-format` |
    | **Event type** | Stop |
    | **Activation mode** | Always |
    | **Description** | Ensures responses present structured data as markdown tables with bold headers |

1. Under **Hook Definition**, keep **Hook type** set to **Prompt**.
1. Keep **Model** set to **Reasoning Fast** (default).
1. In the **Prompt** editor, enter the following text:

    ```text
    Check the agent response below.

    $ARGUMENTS

    Does the response present any structured data (lists of items, comparisons, metrics) as a markdown table with **bold** column headers?
    If no structured data is present, approve.
    If structured data IS present as a table with bold headers: {"ok": true}
    If structured data is present but NOT formatted as a table: {"ok": false, "reason": "Reformat the structured data as a markdown table with **bold** column headers."}
    ```

1. Leave **Timeout (sec)** at `30`, **Fail mode** at `Allow`, and **Max rejections** at `3`.
1. Select **Save**.

The dialog closes with a success notification. The hook appears in the data grid with Event type **Stop** and Activation **Always**.

> [!TIP]
> The `$ARGUMENTS` placeholder injects the hook context (including the agent's final response) into the prompt. The LLM evaluates whether the response meets your criteria and returns `{"ok": true}` to approve or `{"ok": false, "reason": "..."}` to reject. After three rejections (the default), the agent stops.

### Test the Stop hook

Follow these steps to verify the Stop hook works correctly.

1. In the sidebar, select **Chat**.
1. Type **Compare the pros and cons of Python vs Go for building microservices** and select **Send**.
1. Watch the agent's response:
    - The agent initially responds with a plain text comparison.
    - The Stop hook evaluates and rejects the response because the data isn't in a table.
    - The agent reformats its response as a markdown table with **bold** headers.

The final response presents the comparison as a formatted table similar to the following example:

| **Language** | **Pros** | **Cons** |
|---|---|---|
| Python | Rapid development, rich ecosystem | Slower execution, GIL limitations |
| Go | Fast compilation, built-in concurrency | Smaller ecosystem, verbose error handling |

### Create a PostToolUse hook

A PostToolUse hook fires after a tool finishes execution. Use it to audit tool usage, block dangerous commands, or add extra context.

1. Go back to **Builder** > **Hooks**.
1. Select **Create hook**.
1. Fill in the form:

    | Field | Value |
    |---|---|
    | **Name** | `block-dangerous-commands` |
    | **Event type** | Post Tool Use |
    | **Activation mode** | Always |
    | **Description** | Blocks rm -rf, sudo, and chmod 777 in shell commands |
    | **Hook type** | Command |
    | **Tool matcher** | `Bash\|ExecuteShellCommand` |

1. Select **Python** as the script language.
1. In the **Script** editor, enter the following script:

    ```python
    #!/usr/bin/env python3
    import sys, json, re

    context = json.load(sys.stdin)
    command = context.get('tool_input', {}).get('command', '')

    dangerous = [r'\brm\s+-rf\b', r'\bsudo\b', r'\bchmod\s+777\b']
    for pattern in dangerous:
        if re.search(pattern, command):
            print(json.dumps({"decision": "block", "reason": f"Blocked: {pattern}"}))
            sys.exit(0)

    print(json.dumps({"decision": "allow"}))
    ```

1. Set **Fail mode** to **Block** (if the script crashes, the tool result is blocked).
1. Select **Save**.

Both hooks now appear in the **Hooks** data grid.

> [!NOTE]
> The **Tool matcher** field uses regex. `Bash|ExecuteShellCommand` matches tools named exactly "Bash" or "ExecuteShellCommand" (the pattern is anchored as `^(Bash|ExecuteShellCommand)$`). Use `*` to match all tools.

### Test the PostToolUse hook

Follow these steps to verify the PostToolUse hook works correctly.

1. In the sidebar, select **Chat**.
1. Ask the agent to run a safe command: **"Run echo hello"**. The hook allows this command.
1. Ask the agent to run a dangerous command: **"Run rm -rf /tmp/test"**. The hook blocks this command.

The safe command runs normally. The dangerous command is blocked, and the agent gets a message explaining why.

### Edit and delete agent-level hooks

You can modify or remove existing hooks from the Hooks data grid.

- **Edit**: Select the edit icon on any hook row in the data grid, modify the fields, and select **Save**.
- **Delete**: Select the check box next to the hooks you want to remove, select **Delete** in the toolbar, and confirm.

The data grid immediately reflects your changes.

## Create subagent-level hooks

You configure subagent-level hooks directly in a subagent's definition. They apply only when that specific subagent runs, not to the main agent, or other subagents.

### Open the subagent hooks panel

Follow these steps to access hook configuration for a specific subagent.

1. In the sidebar, expand **Builder** and select **Subagent builder**.
1. Select an existing subagent to edit it, or select **Create** to start a new one.
1. In the subagent form, scroll down to the **Hooks** section.
1. Select **Manage Hooks**.

A side panel opens with **Stop** and **Post Tool Use** sections. If no hooks are configured, you see empty states with guidance text.

### Add a hook to a subagent

The following steps add a Stop hook that ensures this subagent always responds with a summary section.

1. In the **Manage Hooks** panel, select **Add hook** at the bottom of the panel.
1. In the dialog, fill in the hook form:

    | Field | Value |
    |---|---|
    | **Event type** | Stop |
    | **Hook type** | Prompt |
    | **Prompt** | `Check the response below. $ARGUMENTS Does it include a clear summary section at the end? If yes: {"ok": true} If no: {"ok": false, "reason": "Add a Summary section at the end of your response."}` |
    | **Timeout (sec)** | 30 |
    | **Fail mode** | Allow |
    | **Max rejections** | 3 |

1. Select **Save** on the hook.
1. Select **Create** (or **Save**) on the subagent to save the full configuration.

The hook appears in the **Manage Hooks** panel under the **Stop** section. The subagent form shows **Manage Hooks (1)** on the button.

> [!TIP]
> To test a subagent-level hook, go to **Subagent builder**, select the **Test playground** view, choose your subagent from the dropdown, and type a question. The hook only runs when this specific subagent is invoked.

## Manage hooks per thread

Agent-level hooks with **Always** activation are active in every conversation by default. You must manually activate hooks with **On Demand** activation per thread.

### Toggle hooks in a conversation

Follow these steps to activate or deactivate hooks in a specific thread.

1. Open a **Chat** thread.
1. Select the **+** button in the chat footer.
1. Select **Manage Hooks**.
1. Toggle hooks on or off for the current thread.

You can temporarily deactivate **Always** hooks. You can activate **On Demand** hooks when needed. You can't toggle required system hooks.

Hook changes take effect immediately in the current thread.

## Troubleshooting

The following table lists common problems and solutions when you create and manage hooks in the portal.

| Problem | Solution |
|---|---|
| Hooks page not visible in sidebar | The Hooks page appears under **Builder**. Verify your agent is in **Running** state. If the option still doesn't appear, contact support. |
| "Hook name is required" | Enter a name using only letters, numbers, hyphens, and underscores. |
| "Name must contain only letters, numbers, hyphens, and underscores" | Remove special characters from the hook name. |
| "Hook name can't start with system__" | The `system__` prefix is reserved for system hooks. Choose a different name. |
| "Tool matcher is required for PostToolUse hooks" | PostToolUse hooks need a regex matcher. Use `*` to match all tools. |
| Hook doesn't fire | For agent-level hooks, check the activation mode. **On Demand** hooks must be activated per thread. For subagent-level hooks, verify the subagent is being invoked. |
| Stop hook approves everything | Ensure the prompt returns `{"ok": false, "reason": "..."}` when rejecting. A rejection without a `reason` is treated as approval. |
| Script errors blocking actions | Set **Fail mode** to **Allow** for graceful degradation during development. Switch to **Block** in production. |

## Next step

> [!div class="nextstepaction"]
> [Learn about agent hooks](agent-hooks.md)

## Related content

- [Agent hooks capability overview](agent-hooks.md)
- [Tutorial: Configure agent hooks via REST API](tutorial-agent-hooks.md)
- [Run modes](run-modes.md)
