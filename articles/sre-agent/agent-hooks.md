---
title: Agent Hooks in Azure SRE Agent
description: Intercept and control agent behavior with custom scripts or LLM-based validation that runs before or after specific agent actions.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: hooks, agent hooks, stop hook, post tool use, validation, audit, policy enforcement, scripts
#customer intent: As an SRE, I want to add custom hooks to my agent so that I can enforce quality gates, audit tool usage, and block dangerous operations automatically.
---

# Agent hooks in Azure SRE Agent

Hooks are custom checkpoints that intercept and control agent behavior at key moments. Use hooks to enforce quality gates on agent responses, audit and control tool usage, block dangerous operations with policy enforcement, and prevent early task completion by validating agent output.

<!-- > [!VIDEO https://www.youtube.com/embed/VIDEO_ID]
>
> Replace `https://www.youtube.com/embed/VIDEO_ID` with the hosted URL for the Agent Hooks and Guardrails video. -->

## The problem

Your agent executes tasks autonomously - investigating incidents, running tools, and generating responses. But autonomy without oversight creates risk:

- **Incomplete responses**: The agent says "done" before addressing everything you asked for.
- **Unaudited tool usage**: You have no visibility into which tools the agent calls or what results it gets.
- **No policy enforcement**: Dangerous operations (destructive commands, unauthorized changes) proceed unchecked.
- **Quality gaps**: Responses miss critical information because there's no validation step.

You need a way to intercept agent behavior at key moments without slowing it down or removing its autonomy entirely.

## How agent hooks work

Hooks are custom checkpoints you attach to specific agent events. When an event fires, your hook evaluates the situation and decides whether to allow or block the action.

```console
Agent about to stop → Stop hook evaluates response → Allow or reject
Agent uses a tool   → PostToolUse hook checks result → Allow, block, or inject context
```

Two hook events are currently supported:

| Event | Triggers when | What you can do |
|---|---|---|
| **Stop** | Agent is about to return a final response | Validate completeness, reject and force the agent to continue |
| **PostToolUse** | A tool finishes executing successfully | Audit usage, block results, inject additional context |

### Execution types

You can implement hooks by using either an LLM or a shell script:

| Type | How it works | Best for |
|---|---|---|
| **Prompt** | An LLM evaluates your prompt and returns a JSON decision | Nuanced validation ("Is this response complete?") |
| **Command** | A bash or Python script runs in a sandboxed environment | Deterministic checks, policy enforcement, auditing |

**Prompt hooks** are powerful for subjective evaluation, such as checking if a response addresses all user concerns or verifying that an investigation was thorough enough. They use the `$ARGUMENTS` placeholder to receive the full hook context. If `$ARGUMENTS` isn't present in the prompt, the context is appended automatically. Prompt hooks also receive `ReadFile` and `GrepSearch` tools when a conversation transcript is available, which lets the LLM reason about the full conversation history.

**Command hooks** are better for deterministic checks, such as validating that a response contains required markers, blocking dangerous commands, or logging tool usage to an external system.

## What makes this different

The following table compares agent behavior with and without hooks.

| Without hooks | With hooks |
|---|---|
| Agent decides when it's "done" | You define what "done" means |
| Tool usage is invisible | Every tool call can be audited |
| Dangerous commands proceed silently | Policy enforcement blocks them automatically |
| Quality depends on prompt engineering alone | Automated quality gates catch gaps |

Hooks don't replace run mode safety controls - they complement them. Run modes control *what* the agent can do. Hooks control *how well* it does and *what happens* with the results.

## Before and after

| Scenario | Before | After |
|---|---|---|
| **Response quality** | Agent stops when it thinks it's done | Your Stop hook validates completeness before the response reaches users |
| **Tool visibility** | No audit trail of tool execution | PostToolUse hooks log and verify every tool call |
| **Policy enforcement** | Dangerous commands execute unchecked | Scripts block `rm -rf`, `sudo`, and other risky patterns automatically |
| **Quality assurance** | Prompt engineering is your only lever | LLM-based hooks evaluate nuance; scripts enforce deterministic rules |

## Configure hooks

Hooks require the **v2 YAML format** (`api_version: azuresre.ai/v2`, `kind: ExtendedAgent`). Define hooks under `spec.hooks` in the agent configuration.

> [!WARNING]
> The portal's Subagent builder YAML tab displays agent configuration in **v1 format only**. It doesn't show or support editing hooks. To configure hooks, use the **REST API v2** endpoint:
>
> ```
> PUT /api/v2/extendedAgent/agents/{agentName}
> Content-Type: application/json
> ```
>
> Hooks configured through the API are active even though they don't appear in the portal YAML view. You can verify hooks are working by testing the agent in the portal's **Test playground**.
>
> :::image type="content" source="media/agent-hooks/hooks-portal-v1-limitation.png" alt-text="Screenshot of the portal YAML tab showing v1 format without hooks." lightbox="media/agent-hooks/hooks-portal-v1-limitation.png":::
>
> The portal YAML tab displays v1 format. Hooks aren't visible here but are active on the server.

The following example shows a complete hook configuration:

```yaml
api_version: azuresre.ai/v2
kind: ExtendedAgent
metadata:
  name: my_hooked_agent
spec:
  instructions: |
    You are a helpful assistant.
  handoffDescription: ""
  enableVanillaMode: true
  hooks:
    Stop:
      - type: prompt
        prompt: |
          Check if the response ends with "Task complete."
          $ARGUMENTS
          Respond with:
          - {"ok": true} if it does
          - {"ok": false, "reason": "End your response with 'Task complete.'"} if not
        timeout: 30

    PostToolUse:
      - type: command
        matcher: "Bash|ExecuteShellCommand"
        timeout: 30
        failMode: block
        script: |
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

## Hook response format

Hooks must output JSON. Two formats are supported.

**Simple format** (recommended for prompt hooks):

```json
{"ok": true}
{"ok": false, "reason": "Please include more details."}
```

**Expanded format** (recommended for command hooks):

```json
{"decision": "allow"}
{"decision": "block", "reason": "Dangerous command detected."}
{"decision": "allow", "hookSpecificOutput": {"additionalContext": "Tool audit logged."}}
```

Command hooks can also use exit codes instead of JSON output:

| Exit code | Behavior |
|---|---|
| `0` with no output | Allow (no objection) |
| `0` with JSON | Parse JSON for decision |
| `2` | Always block — stderr becomes the reason |
| Other | Uses `failMode` setting (`allow` or `block`) |

> [!CAUTION]
> For Stop hooks, a rejection **without a reason** is treated as approval, and the agent stops normally. Always provide a `reason` field when rejecting.

> [!NOTE]
> You can define multiple hooks for the same event. For PostToolUse, each hook with a matching `matcher` pattern runs independently. If multiple hooks provide `additionalContext`, the last hook's context is injected into the conversation.

## Configuration reference

The following table describes all available hook configuration options.

| Option | Type | Default | Description |
|---|---|---|---|
| `type` | string | `prompt` | `prompt` or `command` |
| `prompt` | string | — | LLM prompt text (required for prompt hooks). Use `$ARGUMENTS` for context injection. |
| `command` | string | — | Inline shell command (for command hooks, mutually exclusive with `script`). |
| `script` | string | — | Multi-line script (for command hooks, mutually exclusive with `command`). |
| `matcher` | string | — | Regex pattern for tool names (required for PostToolUse hooks). `*` matches all tools. Patterns are anchored as `^(pattern)$` and matched case-sensitively. Empty or null matches nothing. |
| `timeout` | int | `30` | Execution timeout in seconds (must be positive; values above 300 are flagged during CLI validation). |
| `failMode` | string | `allow` | How to handle hook errors: `allow` or `block`. |
| `model` | string | `ReasoningFast` | Model for prompt hooks (scenario name or deployment name). |
| `maxRejections` | int | `3` (agent default) | Maximum rejections before forcing stop. Range: 1–25. Applies to prompt-type Stop hooks only. Command-type Stop hooks have no implicit limit. When multiple prompt hooks specify different values, the maximum is used. |

## Hook context schema

Hooks receive structured JSON context about the current event. **Prompt hooks** receive context via the `$ARGUMENTS` placeholder in the prompt text. **Command hooks** receive context as JSON on `stdin`.

For both hook types, the `execution_summary` field contains a **file path** to the conversation transcript (not inline content). For prompt hooks, the LLM receives `ReadFile` and `GrepSearch` tools to access this file. For command hooks, the file is available at the specified path in the sandbox.

### Common fields

All hooks receive the following fields:

```json
{
  "hook_event_name": "Stop",
  "agent_name": "my_agent",
  "current_turn": 5,
  "max_turns": 50,
  "execution_summary": "/path/to/transcript.txt"
}
```

### Stop hook fields

Stop hooks receive extra fields about the agent's final output.

```json
{
  "final_output": "Here is my response...",
  "stop_hook_active": false,
  "stop_rejection_count": 0
}
```

### PostToolUse hook fields

PostToolUse hooks receive extra fields about the tool execution.

```json
{
  "tool_name": "ExecutePythonCode",
  "tool_input": { "code": "print(2+2)" },
  "tool_result": "4",
  "tool_succeeded": true
}
```

## Limits

The following limits apply to agent hooks.

| Limit | Value |
|---|---|
| Script size | 64 KB maximum |
| Timeout | 1–300 seconds |
| Max rejections (prompt Stop hooks) | 1–25 (default: 3) |
| Supported script shebangs | `#!/bin/bash`, `#!/usr/bin/env python3` |
| Script execution environment | Sandboxed code interpreter |

## Example: Audit all tool usage

The following PostToolUse hook logs every tool call and injects an audit context message:

```yaml
hooks:
  PostToolUse:
    - type: command
      matcher: "*"
      timeout: 30
      failMode: allow
      script: |
        #!/usr/bin/env python3
        import sys, json

        context = json.load(sys.stdin)
        tool_name = context.get('tool_name', 'unknown')

        print(f"Tool used: {tool_name}", file=sys.stderr)

        output = {
            "decision": "allow",
            "hookSpecificOutput": {
                "additionalContext": f"[AUDIT] Tool '{tool_name}' was executed."
            }
        }
        print(json.dumps(output))
```

The `additionalContext` field is injected as a user message into the conversation, giving the agent visibility into the audit trail.

## Example: Require a completion marker

The following Stop hook rejects responses that don't end with "Task complete.":

```bash
hooks:
  Stop:
    - type: command
      timeout: 30
      failMode: allow
      script: |
        #!/bin/bash
        CONTEXT=$(cat)
        FINAL_OUTPUT=$(echo "$CONTEXT" | jq -r '.final_output // empty')

        if [[ "$FINAL_OUTPUT" == *"Task complete."* ]]; then
          exit 0
        else
          echo "Please end your response with 'Task complete.'" >&2
          exit 2
        fi
```

## Best practices

Follow these guidelines when you configure agent hooks:

1. **Always provide a reason when rejecting** — Rejections without reasons are treated as approvals.
1. **Use appropriate timeouts** — Long-running hooks slow down agent execution.
1. **Handle errors gracefully** — Use `failMode: allow` unless strict enforcement is required.
1. **Be specific with matchers** — Overly broad PostToolUse matchers can cause performance problems.
1. **Test hooks thoroughly** — Hooks that always reject can cause loops (mitigated by `maxRejections`).
1. **Log to stderr** — Use stderr for debugging output. Stdout is parsed as the hook result.

## Try it yourself

The following screenshot shows a Stop hook in action. The agent initially responds with just "4", but the hook rejects the response because the completion marker is missing. The agent then continues and adds the marker.

:::image type="content" source="media/agent-hooks/hooks-stop-hook-working.png" alt-text="Screenshot showing a Stop hook in action where the agent response is decorated with a completion marker after hook rejection." lightbox="media/agent-hooks/hooks-stop-hook-working.png":::

## Next step

> [!div class="nextstepaction"]
> [Tutorial: Configure agent hooks](./tutorial-agent-hooks.md)

## Related content

- [Run modes](./run-modes.md)
- [Python code execution](python-code-execution.md)
