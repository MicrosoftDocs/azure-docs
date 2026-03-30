---
title: Set up PagerDuty incident indexing in Azure SRE Agent
description: Connect PagerDuty to Azure SRE Agent so your agent automatically picks up, investigates, and resolves PagerDuty incidents.
ms.topic: tutorial
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
ms.custom: pagerduty, incident-indexing, setup, tutorial
#customer intent: As an SRE, I want to set up PagerDuty incident indexing so that my agent automatically picks up and investigates PagerDuty incidents.
---

# Set up PagerDuty incident indexing in Azure SRE Agent

In this tutorial, you connect your PagerDuty account to Azure SRE Agent so the agent automatically picks up PagerDuty incidents and investigates them. This setup takes about five minutes.

> [!TIP]
> To learn how PagerDuty incident indexing works, see [PagerDuty incident indexing](pagerduty-incidents.md).

## Prerequisites

Before you begin, make sure you have the following resources and access:

- An Azure SRE Agent in **Running** state
- A PagerDuty account with at least one service configured
- A PagerDuty REST API v2 access key ([PagerDuty API Access Keys](https://support.pagerduty.com/docs/api-access-keys))
- **Contributor** role or higher on the Azure SRE Agent resource

## Open the incident platform settings

Navigate to the incident platform configuration page where you select and connect PagerDuty.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. In the sidebar, expand **Builder**.
1. Select **Incident platform**.

:::image type="content" source="media/setup-pagerduty-indexing/pagerduty-incident-platform-settings.png" alt-text="Screenshot of the Builder sidebar expanded showing the Incident platform option selected." lightbox="media/setup-pagerduty-indexing/pagerduty-incident-platform-settings.png":::

The **Incident platform** heading appears with a platform dropdown showing **Choose a platform**.

## Select PagerDuty

Choose PagerDuty as the incident platform for your agent.

1. Select the **Incident platform** dropdown.
1. Select **PagerDuty**.

If you already connected another platform, disconnect it first. Your agent connects to one incident platform at a time.

:::image type="content" source="media/setup-pagerduty-indexing/pagerduty-platform-dropdown.png" alt-text="Screenshot of the incident platform dropdown showing PagerDuty, Azure Monitor, and ServiceNow options." lightbox="media/setup-pagerduty-indexing/pagerduty-platform-dropdown.png":::

The PagerDuty configuration form appears with the platform name, a description, and an API key field.

## Enter your PagerDuty API key

Provide your REST API access key so the agent can connect to PagerDuty.

- Enter your **REST API access key** in the API key field.

The agent validates your key by calling the PagerDuty API. A validation spinner appears briefly, then either succeeds silently or shows an error.

> [!TIP]
> To find your API key in PagerDuty, go to **Integrations** > **API Access Keys** > **Create New API Key**. The key needs incident read access at minimum. For full functionality (acknowledge, resolve, add notes), use a key with write access.

:::image type="content" source="media/setup-pagerduty-indexing/pagerduty-form-with-key.png" alt-text="Screenshot of the PagerDuty form showing REST API access key field and quickstart response plan checkbox." lightbox="media/setup-pagerduty-indexing/pagerduty-form-with-key.png":::

When validation succeeds, no error appears below the key field, and the **Save** button becomes active.

> [!WARNING]
> If you see the message "The access key isn't valid. Try again," verify your key in PagerDuty under **Integrations** > **API Access Keys**. Regenerate the key if it expired.

## Enable the quickstart response plan

The **Quickstart response plan** checkbox is selected by default. This option adds a default incident response plan for the agent to use for P1 incidents.

The quickstart response plan:

- Matches P1 priority PagerDuty incidents
- Runs in fully autonomous mode
- Covers all impacted services

Keep this checkbox selected to start with automated P1 incident handling. If you clear it, no incidents appear until you create a response plan manually. The scanner runs every minute but skips incidents when no response plans are configured. You can customize or add more response plans later from **Activities** > **Incidents**.

## Save and connect

Save your configuration to establish the connection between your agent and PagerDuty.

1. Select **Save**.
1. Wait for the connectivity indicator to show **PagerDuty is connected**, which can take 30 seconds to 2 minutes.

> [!WARNING]
> If you see the message "Connection to PagerDuty failed. Check your access key and try again":
>
> - Verify your API key is correct and hasn't expired.
> - Confirm the key has incident read permissions.
> - Check that your PagerDuty account is active.

When the connection succeeds, the connectivity indicator shows a green **PagerDuty is connected** status.

## Verify incidents appear

After connecting, confirm that your agent receives PagerDuty incidents.

1. In the sidebar, select **Activities**.
1. Select **Incidents**.
1. Wait 1-2 minutes for the scanner to complete its first cycle.

PagerDuty incidents that match your response plan filters appear in the incident overview grid with columns for ID, Title, Priority, Status, Agent Status, Created, Impacted Service, and Handler.

## Edit or disconnect PagerDuty

You can update your connection settings or disconnect PagerDuty at any time.

### Edit connection settings

To modify your PagerDuty configuration:

1. Go to **Builder** > **Incident platform**.
1. Select **Edit** at the bottom of the page.
1. Modify the API key or other settings.
1. Select **Save**.

### Disconnect PagerDuty

To stop receiving PagerDuty incidents:

1. Go to **Builder** > **Incident platform**.
1. Select **Disconnect** at the bottom of the page.
1. In the confirmation dialog, select **Yes**.

After you disconnect, the agent stops scanning for PagerDuty incidents. Your response plans are preserved and reactivate when you reconnect.

> [!WARNING]
> To switch from PagerDuty to another platform, disconnect PagerDuty first. Selecting a different platform from the dropdown triggers a disconnect confirmation automatically.

## Troubleshooting

Use the following table to resolve common issues during PagerDuty setup.

| Issue | Solution |
|---|---|
| "The access key isn't valid" | Verify the key in PagerDuty under **Integrations** > **API Access Keys**. Regenerate the key if it expired. |
| "Connection to PagerDuty failed" | Check key permissions. The key needs incident read access at minimum. |
| No incidents appear after setup | Wait 1-2 minutes for the first scan cycle. Verify that incidents exist in PagerDuty that match your response plan filters. |
| Need to switch from another platform | Disconnect the current platform first. Your agent connects to one platform at a time. |
| Connectivity indicator stays on "Connecting" | Allow up to 2 minutes. If the indicator times out, reenter the API key and save again. |

## Next step

> [!div class="nextstepaction"]
> [Set up an incident trigger](response-plan.md)

## Related content

- [PagerDuty incident indexing](pagerduty-incidents.md)
- [Incident response plans](incident-response-plans.md)
- [Incident response](incident-response.md)
- [Connectors](connectors.md)
