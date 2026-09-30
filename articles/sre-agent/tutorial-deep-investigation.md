---
title: "Tutorial: Run a Deep Investigation in Azure SRE Agent"
description: Learn how to use deep investigation for structured, hypothesis-driven analysis from chat and from incident response plans.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.custom: deep-investigation, hypothesis, root-cause, investigation, incident-response-plan
ms.ai-usage: ai-assisted
#customer intent: As an SRE, I want to run a deep investigation so that I can identify root causes for complex incidents using structured, hypothesis-driven analysis.
---

# Tutorial: Run a deep investigation in Azure SRE Agent
Deep investigation gives your agent a structured methodology for complex problems. The agent forms multiple hypotheses and validates each one with evidence. In this tutorial, you trigger a deep investigation from chat and explore the results.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Trigger a deep investigation from the chat interface
> - Approve the authorization prompt
> - Read the interactive hypothesis tree
> - Configure automatic deep investigation in response plans

## Prerequisites

- An Azure SRE Agent in **Running** state
- At least one connected data source (Azure Monitor, Application Insights, or a custom connector)
- Permissions to chat with your agent

## Start a deep investigation from chat

Use this mode when you want to investigate a specific question by using structured reasoning. This mode works for live problems, performance concerns, or complex questions about your environment.

### Enable deep investigation

In your agent's chat, select the **+** button in the lower-left corner of the chat input area. This action opens the configuration menu.

:::image type="content" source="media/common/plus-menu-deep-investigation.png" alt-text="The plus menu dropdown showing Deep investigation as the first menu item." lightbox="media/common/plus-menu-deep-investigation.png":::

Select **Deep investigation** from the menu.

If you're enabling deep investigation for the first time, a confirmation dialog appears that explains deep investigations query multiple data sources and take several minutes. Select **Yes** to continue.

:::image type="content" source="media/tutorial-deep-investigation/deep-investigation-confirmation-dialog.png" alt-text="Confirmation dialog asking if you want to proceed with deep investigation, with a checkbox to dismiss future warnings." lightbox="media/tutorial-deep-investigation/deep-investigation-confirmation-dialog.png":::

> [!TIP]
> Check **Don't show this message again** if you plan to use deep investigation regularly. You can toggle it off by selecting the **X** on the deep investigation badge.

### Confirm deep investigation is active

After you confirm, two indicators appear:

- A **status message** at the top of the chat: "Deep investigation is turned on" with a sparkle icon.
- A **sparkle badge** next to the **+** button in the chat footer, with an **X** to dismiss.

:::image type="content" source="media/tutorial-deep-investigation/deep-investigation-enabled-badge.png" alt-text="Chat showing Deep investigation is turned on status message and the sparkle badge in the footer." lightbox="media/tutorial-deep-investigation/deep-investigation-enabled-badge.png":::

### Ask your question

Type a question that benefits from structured investigation. Good candidates include:

```plaintext
Investigate why the java-app container app has high memory usage.
Check logs, metrics, and recent deployments to identify the root cause.
```

```plaintext
Why are API response times for the payment service degraded since yesterday?

Our AKS cluster nodes keep scaling up. Investigate what's driving the resource pressure.

Correlate the recent deployment with the spike in 500 errors on the orders endpoint.
```

Select **Send** (or press Enter).

### Approve the authorization

For chat-triggered investigations, your agent requests authorization before it proceeds. An **authorization card** appears in the chat with two options:

:::image type="content" source="media/common/deep-investigation-working.png" alt-text="Authorization prompt showing the investigation card, approval message, and Continue and Cancel buttons." lightbox="media/common/deep-investigation-working.png":::

- **Continue**: Approve the investigation and grant your agent elevated permissions to query your Azure resources.
- **Cancel**: Decline the investigation. Your agent falls back to a standard response.

> [!NOTE]
> If you don't respond within 10 minutes, the investigation cancels automatically and your agent proceeds with a standard investigation.

Select **Continue** to approve. The card updates to show a green **Approved** checkmark.

### Watch the investigation progress

The **investigation detail panel** opens on the right side of the chat, showing a live visualization of your agent's work.

:::image type="content" source="media/tutorial-deep-investigation/deep-investigation-approved-in-progress.png" alt-text="Investigation in progress showing Approved status, incident research phase, and investigation steps." lightbox="media/tutorial-deep-investigation/deep-investigation-approved-in-progress.png":::

The investigation follows four phases:

**Phase 1, Incident research:** Your agent selects investigation tools and gathers context. The summary card shows what data was collected and the investigation steps completed.

:::image type="content" source="media/tutorial-deep-investigation/deep-investigation-initial-research.png" alt-text="Incident research phase showing summary of findings and four completed investigation steps." lightbox="media/tutorial-deep-investigation/deep-investigation-initial-research.png":::

**Phase 2, Forming hypotheses:** Based on the gathered context, your agent generates two to four hypotheses about potential root causes. Each hypothesis card shows a title and brief description.

:::image type="content" source="media/common/deep-investigation-hypotheses-forming.png" alt-text="Three hypotheses appearing in the tree, each with a blue Validating status pill." lightbox="media/common/deep-investigation-hypotheses-forming.png":::

**Phase 3, Validating hypotheses:** Your agent tests each hypothesis in parallel (up to three at once). Status pills update as validation completes:

| Status | Color | Meaning |
|---|---|---|
| Validating | Blue | Currently being tested |
| Validated | Green | Evidence supports this hypothesis |
| Invalidated | Red | Evidence rules this out |
| Inconclusive | Yellow | Not enough evidence to confirm or rule out |

Validated hypotheses at shallow levels can generate **sub-hypotheses** (up to three levels deep), creating a branching tree of investigation paths.

**Phase 4, Conclusion:** Your agent synthesizes findings into a structured conclusion. The conclusion node at the bottom of the tree summarizes the root cause with supporting evidence and recommended actions.

> [!TIP]
> Select any node in the hypothesis tree to open the **details panel**. This panel shows the full investigation summary, validation steps, evidence collected, and reasoning for that phase.

### Turn off deep investigation

Deep investigation mode stays active for subsequent messages. To turn it off:

- Select the **X** on the sparkle badge next to the **+** button.
- Or, select **+** and deselect **Deep investigation**.

A status message confirms: "Deep investigation is turned off."

## Configure deep investigation in incident response plans

For incidents that warrant thorough analysis automatically (such as production outages or critical severity alerts), configure deep investigation in your response plans.

### Navigate to response plans

Go to **Builder** > **Incident response plans** in the portal sidebar.

### Create or edit a response plan

Create a new response plan or edit an existing one. In the handler configuration:

1. Set the **Priority** to the severity levels you want (for example, P1, P2).
1. Enable the **Deep investigation** toggle in the investigation settings.

### Save the response plan

Save the plan. When an incident matches the response plan criteria, your agent automatically starts a deep investigation with no approval required.

> [!NOTE]
> Incident-triggered deep investigations use the agent's **managed identity** permissions, not your personal identity. Make sure your agent's managed identity has the necessary roles (Reader or Monitoring Reader) on the resources you want investigated. For more information, see [Permissions](permissions.md).

### Alternative: Define as code

For teams that manage multiple agents, define response plans as YAML:

```yaml
api_version: azuresre.ai/v2
kind: IncidentFilter
metadata:
  name: production-critical-handler
spec:
  incidentPlatform: PagerDuty
  isEnabled: true
  handlingAgent: production-agent
  priorities:
    - P1
    - P2
  agentMode: Autonomous
  maxAutomatedInvestigationAttempts: 5
  deepInvestigationEnabled: true
```

## Cancel a deep investigation

If the investigation is no longer needed, you can cancel it at any point.

| Method | When to use | How |
|---|---|---|
| **Stop button** | The investigation is running | Select the blue **Stop** button in the chat footer. |
| **Cancel authorization** | The agent is waiting for approval | Select **Cancel** on the authorization card. |
| **Let it time out** | You forgot to respond | After 10 minutes, the authorization expires automatically. |

Partial results are always preserved. Select the investigation card in your chat to view whatever was completed before cancellation.

## Verify

After your deep investigation finishes, confirm the following conditions:

- The investigation card in chat shows a green checkmark with the status **Complete**.
- The hypothesis tree shows at least one **Validated** or **Inconclusive** hypothesis.
- A **Conclusion** node appears at the bottom of the tree with recommended actions.
- Selecting any hypothesis node opens a detail panel with evidence and validation steps.

## Next step

> [!div class="nextstepaction"]
> [Learn about deep investigation](./deep-investigation.md)

## Related content

- [Deep investigation capabilities](deep-investigation.md)
- [Incident response plans](incident-response-plans.md)
- [Connectors](connectors.md)
- [Agent reasoning](agent-reasoning.md)
