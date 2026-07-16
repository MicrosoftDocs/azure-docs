---
title: "Tutorial: Create a subagent in Azure SRE Agent"
description: "Learn how to create a specialized subagent with custom instructions, tools, skills, and hooks in the Azure SRE Agent subagent builder."
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to create a subagent so that I can delegate focused tasks like health reporting, alert triage, or notification delivery.
---

# Tutorial: Create a subagent in Azure SRE Agent

In this tutorial, you create a specialized subagent in the subagent builder with its own instructions, tools, and skills. Subagents handle focused tasks like health reporting, alert triage, or notification delivery. For more information about how subagents work, see [Subagents](sub-agents.md).

**Estimated time**: 5 minutes

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Create a subagent with custom instructions in the subagent builder
> - Assign skills, tools, and hooks to the subagent
> - Test the subagent in the dialog and the playground
> - Edit and manage the subagent configuration by using the form or YAML

## Prerequisites

- An agent created in the [Azure SRE Agent portal](https://sre.azure.com).
- At least one connector configured, if you want the subagent to use external tools.

## Create a subagent

Follow these steps to create a new subagent from the portal.

1. Open the [SRE Agent portal](https://sre.azure.com) and select your agent.

1. Select **Builder** > **Subagent builder**.

1. Select the **Create** dropdown in the toolbar, and then select **Custom Agent**.

    The creation dialog opens with two tabs: **Form** and **YAML**.

1. Fill in the required fields:

    | Field | Example value |
    |---|---|
    | **Custom agent name** (required) | `health-check-reporter` |
    | **Instructions** (required) | "You're a health check reporter. Check Azure resource health for container apps in the production resource group. Summarize healthy, warning, and critical counts. Send the summary via email." |

    > [!TIP]
    > Select **Refine with AI** above the instructions field to let the agent improve your instructions automatically. Select **View AI suggestions** to see recommendations for improving instructions, tools, and skills.

1. (Optional) Configure the remaining sections in the dialog. If you skip these sections, the subagent inherits all global skills and tools by default.

    - **Skills**: Select **Choose skills** to assign specific skills to the subagent. Selecting specific skills overrides the global defaults. Leave the selection empty to allow all global skills. For more information, see [Skills](skills.md).

    - **Tools**: Select **Choose tools** to open the tools picker panel. Browse or search for tools organized by category (for example, Kusto tools or notification tools). Select the tools you want the subagent to use. To create custom tools first, see [Create a Kusto tool](create-kusto-tool.md) or [Create a Python tool](create-python-tool.md). For more information, see [Tools](tools.md).

    - **Hooks**: Select **Manage Hooks** to add safety and governance controls. Hooks run before actions (prompt hooks) or after tool use (command hooks). For setup steps, see [Create and manage hooks in the portal](create-manage-hooks-ui.md). For more information, see [Agent hooks](agent-hooks.md).

1. Select **Create**.

Your subagent appears as a node on the subagent builder canvas with any connected tools displayed.

> [!TIP]
> Before assigning tools, test them individually in the [test playground](test-tool-playground.md) to make sure they return the data you expect.

## Test the subagent

After you create your subagent, test it to verify it behaves as expected.

### Test from the dialog

In the create or edit dialog, select the test icon in the upper-right corner to open the **Test live agent** panel. Type a prompt and see how the subagent responds with its current instructions and tools.

### Test in the playground

Use the playground for an interactive testing experience with a split-screen layout.

1. On the subagent builder toolbar, select the **Test playground** view toggle.
1. The split-screen layout shows your subagent's configuration on one side and a live chat on the other.
1. Select your subagent, type a test prompt, and verify it behaves as expected.
1. Iterate by editing instructions or swapping tools, then test again until the output matches your expectations.

For more information, see [Agent playground](agent-playground.md) or [Test a tool in the playground](test-tool-playground.md).

## Edit a subagent

To modify an existing subagent, open its configuration on the subagent builder canvas.

Select the subagent node, and then select **Edit** (or double-click the node). The edit dialog opens with all current values prepopulated.

| What to change | Field to update |
|---|---|
| What it does | **Instructions** |
| Which skills it uses | **Skills** > Choose skills |
| Which tools it uses | **Tools** > Choose tools |
| Safety controls | **Hooks** > Manage Hooks |

Select **Save** when done.

## Edit with YAML

You can view or edit your subagent's configuration as YAML for copying configurations or managing config as code.

Select the **YAML** tab at the top of the create or edit dialog to switch to YAML mode. Changes in YAML mode sync back to the form view.

## Next step

> [!div class="nextstepaction"]
> [Learn about subagents](sub-agents.md)

## Related content

- [Subagents](sub-agents.md)
- [Agent playground](agent-playground.md)
- [Skills](skills.md)
- [Tools](tools.md)
- [Agent hooks](agent-hooks.md)
- [Create a Kusto tool](create-kusto-tool.md)
- [Create a Python tool](create-python-tool.md)
- [Create scheduled tasks](create-scheduled-task.md)
- [Test a tool in the playground](test-tool-playground.md)
