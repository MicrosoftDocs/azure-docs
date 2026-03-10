---
title: "Tutorial: Connect to PagerDuty in Azure SRE Agent"
description: Integrate your agent with PagerDuty to diagnose and respond to incidents automatically.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: pagerduty, incidents, integration, alerting
#customer intent: As an SRE, I want to connect my agent to PagerDuty so that I can automate incident diagnosis and response.
---

# Tutorial: Connect to PagerDuty in Azure SRE Agent
In this tutorial, you connect your PagerDuty account to Azure SRE Agent so the agent can receive, investigate, and respond to incidents automatically.

## Prerequisites

Before you begin, make sure you have the following resources and access:

- An Azure SRE Agent [created and running](create-agent.md)
- A PagerDuty account with admin access
- A PagerDuty **User API key** (not a General API key)

### PagerDuty API key types

PagerDuty provides two types of API keys:

| Key type | Description | Works with SRE Agent? |
|---|---|---|
| **General API key** | Used for development work and general API access | No — can't acknowledge incidents on behalf of the agent |
| **User API key** | Associated with a specific user account and email address | Yes — required for SRE Agent integration |

> [!IMPORTANT]
> You must use a **User API key** for the SRE Agent integration. General API keys don't allow the agent to acknowledge incidents properly because they lack the user context (email address) required for incident acknowledgment.

### Create a User API key in PagerDuty

1. Sign in to your PagerDuty account.
1. Go to **User Settings** > **API Access**.
1. Select **Create API User Token**.
1. Provide a description for the key (for example, "SRE Agent Integration").
1. Copy the generated User API key.

## Configure PagerDuty in SRE Agent

1. Go to your SRE Agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left navigation, go to **Settings** > **Incident platform**.
1. Select **PagerDuty** from the **Incident platform** dropdown.
1. Enter the following settings:

   | Setting | Value |
   |---|---|
   | **Incident platform** | Select **PagerDuty**. |
   | **REST API access key** | Enter your PagerDuty **User API key**. |
   | **Quickstart handler** | Keep the checkbox selected to create a default incident response plan. |

1. Select **Save**. PagerDuty is now the active incident management platform for your agent.

## Verify the connection

After saving, the settings page shows a green status indicator confirming PagerDuty is connected. Your agent now receives and processes PagerDuty incidents automatically.

## Next step

> [!div class="nextstepaction"]
> [Set up an incident trigger](./response-plan.md)

## Related content

- [Incident platforms](incident-platforms.md)
- [Incident response](incident-response.md)
