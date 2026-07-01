---
title: "Tutorial: Create a skill in Azure SRE Agent"
description: Build a custom skill with instructions, tools, and supporting files that your agent uses automatically when relevant.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to create a custom skill so that my agent can automatically follow team-specific procedures during investigations.
---

# Tutorial: Create a skill in Azure SRE Agent

In this tutorial, you create a custom skill that adds domain knowledge and task playbooks to your agent. Skills are modular capabilities your agent loads automatically when relevant, such as troubleshooting a specific service or running a diagnostic procedure.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a skill in the subagent builder
> - Write skill instructions in SKILL.md
> - Add supporting files and tools
> - Test the skill in a chat or the playground
> - Edit an existing skill

**Estimated time**: 10 minutes

> [!TIP]
> Skills and knowledge documents work together. A **skill** teaches your agent *how* to do something (procedures, playbooks, step-by-step instructions). A **knowledge document** teaches your agent *what* it needs to know (reference data, architecture docs, runbooks). You can also attach reference documents directly to a skill as supporting files. For the knowledge upload flow, see [Upload knowledge documents](tutorial-upload-knowledge-document.md).

## Prerequisites

Before you begin, make sure you have the following prerequisites:

- An agent created in the [Azure SRE Agent portal](https://sre.azure.com).
- A clear understanding of the procedure or domain knowledge you want to encode.

## Navigate to the subagent builder

Open the subagent builder where you create and manage skills.

1. Open the [SRE Agent portal](https://sre.azure.com).
1. Select your agent.
1. Select **Builder** in the left navigation.
1. Select **Subagent builder**.

## Start skill creation

Start the skill creation process from the toolbar.

1. Select the **Create** dropdown in the toolbar.
1. Select **Skill**.

The skill creation dialog opens with a two-column layout. Form fields on one side and a code editor on the other showing `SKILL.md`.

## Enter name and description

Provide a name and description that help the agent decide when to use this skill.

| Field | Example value |
|---|---|
| **Name** | `high-cpu-troubleshooting` |
| **Description** | "Troubleshooting procedure for high CPU alerts on container apps. Checks upstream dependencies, connection pool, and recent deployments." |

The name must be unique across your skills. The description appears in the skills list and helps the agent decide when to use this skill.

> [!TIP]
> Select **Edit** next to the description text to switch to edit mode. Select **Save** when done.

## Write skill instructions

The center editor shows `SKILL.md`, which contains the skill's instructions. The file starts with a default template.

```markdown
---
name:
description:
---

<!-- Add your skill instructions here -->
```

The YAML front matter (`name`, `description`, `tools`) stays in sync with the form fields on the left. Write your instructions in Markdown below the front matter:

```markdown
---
name: high-cpu-troubleshooting
description: Troubleshooting procedure for high CPU alerts on container apps
tools:
  - kusto_query
---

## When to use this skill
Use this skill when you receive a high CPU alert on any container app.

## Steps
1. Check upstream dependencies for cascading failures
2. Query connection pool metrics for the last hour
3. Review deployments in the last 24 hours
4. If a recent deployment correlates with CPU spike, identify the commit
5. Recommend rollback or fix based on findings

## Expected output
Structured report with: affected resource, root cause, recommended action, and evidence.
```

## Add supporting files

The **Files** section on one side shows a file browser. Beyond the default `SKILL.md`, you can add reference data, templates, and example queries.

- Select the **new file** icon to add files.
- Select the **new folder** icon to organize files into directories.
- Drag and drop a folder into the drop zone, or select the **Upload folder** link to upload an entire folder structure.

Select any file in the browser to edit it in the code editor. The editor supports syntax highlighting for Markdown, JSON, YAML, KQL, Python, and shell scripts.

## Select tools

Optionally, attach tools that the skill uses during execution.

1. Select **Choose tools** in the **Tools** section.
1. Browse or search for tools. Filter by type (Custom Tool, MCP Tool) or search by name.
1. Check the tools this skill needs (for example, `kusto_query` or `azure_resource_health`).
1. Close the panel.

Selected tools appear as removable pills. These tools are dynamically available when the skill is activated.

> [!NOTE]
> Tools added to a skill are dynamically available when the skill is activated. For more consistent behavior, configure tools directly on the subagent instead.

To create custom tools, see [Create a Kusto tool](create-kusto-tool.md) or [Create a Python tool](create-python-tool.md). For more information about tools, see [Tools](tools.md).

## Create the skill

Select **Create** to save your skill.

Your skill appears in the **Skills** tab on the subagent builder. The agent can now use the skill automatically when it encounters a relevant situation.

## Test the skill

The main agent can use skills by default, so you can test them directly in chat without creating a subagent first.

### Test in a new chat

Use a new chat thread to verify that the agent activates your skill.

1. Select **New chat thread** in the sidebar.
1. Type a prompt that should trigger your skill. For example: "We're seeing high CPU on our container app, can you investigate?"
1. Verify the agent activates the skill and follows the procedures you defined.

### Test in the playground

Use the playground to test the skill through a subagent.

1. [Create a subagent](sub-agents.md) and assign this skill to it.
1. On the subagent builder toolbar, select the **Test playground** view toggle.
1. Select the subagent, type a test prompt, and verify it uses the skill correctly.

For more information, see [Agent playground](agent-playground.md).

## Edit a skill

You can modify an existing skill to update its instructions, tools, or supporting files.

1. In the **Skills** tab, select the skill name or select it and choose **Edit**.

1. The edit dialog opens with all current values prepopulated. Change the fields you need:

    | What to change | Where to update |
    |---|---|
    | When the agent uses it | **Description** and SKILL.md instructions |
    | What procedures to follow | SKILL.md content in the editor |
    | Which tools are available | **Tools** > Choose tools |
    | Reference data | **Files** > add, edit, or remove files |

1. Select **Save**.

## Tips for writing effective skills

Use the following guidelines to create skills that your agent can use effectively.

- **Be specific about when to use it.** The agent reads the description and instructions to decide relevance.
- **Include step-by-step procedures.** Numbered steps give the agent a clear playbook.
- **Specify expected output.** Tell the agent what format the results should take.
- **Add reference data.** Upload query templates, configuration baselines, or known-good values as supporting files.
- **Assign relevant tools.** If the skill needs specific tools like Kusto queries or Azure actions, add them.

## Next step

> [!div class="nextstepaction"]
> [Learn about skills](./skills.md)

## Related content

- [Skills](skills.md)
- [Upload knowledge documents](tutorial-upload-knowledge-document.md)
- [Subagents](sub-agents.md)
- [Agent playground](agent-playground.md)
- [Tools](tools.md)
- [Create a Kusto tool](create-kusto-tool.md)
- [Create a Python tool](create-python-tool.md)
- [Create scheduled tasks](create-scheduled-task.md)
- [Test a tool in the playground](test-tool-playground.md)
