---
title: Create Azure support requests in Azure SRE Agent
description: Your agent files Azure support requests with structured diagnostic evidence, validated routing, and a PDF report attached directly from chat after any troubleshooting session.
ms.topic: how-to
ms.service: azure-sre-agent
ms.date: 06/01/2026
author: dchelupati
ms.author: dchelupati
ms.reviewer: cshoe
ms.ai-usage: ai-assisted
ms.custom: support-request, support-ticket, azure-support, escalation, pdf-report, support-area-path, severity, microsoft-support, troubleshooting
#customer intent: As an SRE, I want my agent to file support requests with diagnostic evidence so that I don't have to manually recreate context for the support engineer.
---

# Create Azure support requests in Azure SRE Agent

> [!TIP]
> Key points:
>
> - Your agent files Azure support requests with full diagnostic evidence attached as a PDF.
> - Support Area Path is validated before submission so tickets route to the correct engineering team.
> - Offered automatically at the end of any troubleshooting session.
> - You can also ask directly: *"Create a support request for this issue"*.

## Why filing Azure support requests is hard

Creating Azure support requests in Azure SRE Agent eliminates the manual work of filing effective tickets. Normally you select the right service category, describe the environment and symptoms, and attach evidence like logs and metrics. Your agent handles all of this automatically.

Most tickets arrive under-documented. The support engineer asks for information you already collected during troubleshooting, adding hours to resolution. Worse, a misrouted ticket (wrong service or problem classification) can delay triage by days.

## How your agent creates Azure support requests

Your agent builds the support request from diagnostic evidence it already collected. No copy-pasting, no going through the Azure portal support wizard, no guessing which service category to pick.

### Step 1: The agent offers to create a ticket

At the end of any troubleshooting session, your agent presents a summary and asks what you'd like to do:

```text
DIAGNOSTIC SESSION COMPLETE

Summary of what I found:
- Symptom:           VPN tunnel drops every ~50 minutes
- Suspected cause:   PFS missing on IPsec rekey
- Confidence:        High
- Boundary:          Inside Azure

Is the information I provided sufficient, or would you like me to
create an Azure Support Request with the full analysis attached?

  1. Sufficient - just save the report
  2. Yes, create a Support Request
  3. Just give me the PDF report
  4. I'd like to ask follow-up questions first
```

You can also trigger this step at any time by asking in chat:

```text
Create a support request for this VPN issue
```

```text
File an Azure support ticket - the ExpressRoute circuit isn't learning routes
```

### Step 2: The agent collects your contact details

If you choose to create a ticket, the agent asks for your information in a single block:

| Field | What to provide | Example |
|-------|----------------|---------|
| **First name** | Your first name | Jane |
| **Last name** | Your last name | Chen |
| **Email** | Contact email | jane.chen@contoso.com |
| **Phone** | With country code | +1-555-0100 |
| **Country** | ISO country code | US |
| **Timezone** | Your timezone | PST |
| **Severity** | A (critical), B (moderate), C (minimal) | B |
| **Attach PDF?** | Include the diagnostic report | Yes |
| **Advanced diagnostics consent** | Allow Microsoft to access additional telemetry | No (default) |

### Step 3: The agent resolves the correct routing

The agent maps the root cause to the correct Azure service and problem classification. For example, a VPN rekey failure routes to **VPN Gateway > Connectivity and Performance > Site-to-Site**, not to a generic networking category.

The agent validates that the service and problem classification IDs match before submitting, catching the common "product and area path do not match" error before it happens.

### Step 4: The agent builds the ticket

The support request description is structured, not free-form:

1. **Symptom** as you reported
1. **Environment**: subscription, resource group, source and destination resources
1. **Diagnostic mode**: Active or Passive, which tools were used
1. **Hop-by-hop findings**: every network hop checked with pass/fail status
1. **Key evidence**: effective routes, BGP status, circuit metrics, log excerpts
1. **What was ruled out**: confirmed-healthy components
1. **What remains unknown**: gaps for the support team to investigate
1. **Suspected root cause**: clearly labeled hypothesis
1. **Steps already tried**: what you did before escalating
1. **PDF attachment reference**: full diagnostic report attached

The agent generates a PDF from the complete diagnostic analysis (including the Mermaid network path diagram) and attaches it to the ticket.

### Step 5: Confirmation

After creating the ticket, the agent confirms with the ticket ID and a direct link to manage it in the Azure portal.

## Requirements

| Requirement | Details |
|------------|---------|
| **RBAC role** | Support Request Contributor on the subscription |
| **Support plan** | Sev C: any paid plan (Developer minimum). Sev B: Developer or above. Sev A: Standard, Professional Direct, or Premier/Unified. |
| **Resource access** | Reader on the resource cited in the ticket |

> [!NOTE]
> Billing and quota support requests don't require a paid plan, only the RBAC role. For technical issues, a paid support plan is required. The agent tells you which plan level is needed based on your chosen severity.

## Before and after using Azure SRE Agent for support requests

| Before | After |
|--------|-------|
| Use Azure portal support wizard, guess service category | Agent validates routing to the correct engineering team automatically |
| Write free-form description from memory | Structured 10-section description built from diagnostic evidence |
| Attach logs manually or forget to | PDF report generated and attached automatically |
| Wrong problem classification delays triage by days | Agent validates service/classification pair before submitting |
| Support engineer asks for info you already collected | Full hop-by-hop analysis included in the ticket from the start |

## Related content

- [Diagnose with Azure observability](diagnose-azure-observability.md)
- [Track incident value](track-incident-value.md)
