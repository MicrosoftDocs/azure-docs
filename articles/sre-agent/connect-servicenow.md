---
title: "Tutorial: Connect to ServiceNow in Azure SRE Agent"
description: Configure ServiceNow as your incident platform using basic authentication or OAuth 2.0 for automated incident management.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/03/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: servicenow, itsm, incidents, integration, oauth, oauth2, connector, incident platform
#customer intent: As an SRE or IT operations engineer, I want to connect my ServiceNow instance to Azure SRE Agent so that I can automate incident response and management.
---

# Tutorial: Connect to ServiceNow in Azure SRE Agent

Connect your ServiceNow instance to receive and manage incidents automatically. Choose between **Basic Authentication** (username/password) or **OAuth 2.0** (token-based, recommended for production).

**Time**: 15 minutes

## Prerequisites

- An Azure SRE Agent [created and running](create-and-set-up.md)
- A ServiceNow instance with admin access
- For **OAuth 2.0**: An OAuth application registered in ServiceNow (see [Prepare ServiceNow for OAuth](#prepare-servicenow-for-oauth))
- For **Basic Authentication**: A ServiceNow user with incident management permissions

## Choose your authentication method

| Method | Security | Best for | Setup time |
|--------|----------|----------|------------|
| **OAuth 2.0** | Token-based, automatic refresh, no stored passwords | Production environments, security-conscious teams | ~10 min |
| **Basic Authentication** | Username and password stored | Quick setup, dev/test environments | ~5 min |

> [!NOTE]
> Use OAuth 2.0 for production. Tokens refresh automatically and the agent configuration doesn't store any passwords.

## Option A: Connect with OAuth 2.0

### Prepare ServiceNow for OAuth

Before connecting from the portal, register an OAuth application in your ServiceNow instance:

1. In your ServiceNow instance, go to **System OAuth** > **Application Registry**.
1. Select **New** > **Create an OAuth API endpoint for external clients**.
1. Fill in the fields:
   - **Name**: A descriptive name, such as `Azure SRE Agent`.
   - **Redirect URL**: `https://logic-apis-{region}.consent.azure-apim.net/redirect` (where `{region}` is your agent's Azure region, such as `eastus2`).
   - **Active**: Checked.
1. Select **Submit** and note the **Client ID** and **Client Secret**.

> [!WARNING]
> Some ServiceNow versions show the Client Secret only once. Copy it before you go to another page.

### Configure in the portal

1. Go to your agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left navigation, go to **Settings** > **Incident platform**.
1. Select **ServiceNow** from the **Incident platform** dropdown.
1. Set **Authentication Type** to **OAuth 2.0**.
1. A yellow info box appears with a redirect URL. Copy this URL and add it to your ServiceNow OAuth application.
1. Enter your ServiceNow details:
   - **ServiceNow endpoint**: Your instance URL, such as `https://your-instance.service-now.com`.
   - **OAuth Client ID**: From your ServiceNow OAuth application.
   - **OAuth Client Secret**: From your ServiceNow OAuth application.
1. Select **Authorize**.

### Authorize the connection

1. The portal creates an Azure API Connection and opens a ServiceNow sign-in popup.
1. Sign in to ServiceNow to authorize the connection.
1. Wait for authorization to complete.
1. When authorization succeeds, the **Authorize** button changes to **Save**.
1. Select **Save** to save the configuration.

### Verify your connection

After authorization, the settings page shows a green status indicator with **"ServiceNow is connected."**

## Option B: Connect with basic authentication

### Create a ServiceNow integration user

1. In ServiceNow, go to **User Administration** > **Users**.
1. Create a new user with:
   - A recognizable username, such as `sre-agent-integration`
   - A strong password
   - Roles: `itil` and incident management permissions

### Configure in the portal

1. Go to your agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left navigation, go to **Settings** > **Incident platform**.
1. Select **ServiceNow** from the dropdown.
1. Keep **Authentication Type** as **Basic Authentication** (default).
1. Enter your ServiceNow details:
   - **ServiceNow endpoint**: Your instance URL
   - **Username**: The integration user's username
   - **Password**: The integration user's password
1. Select **Save**.

### Verify your connection

The portal validates connectivity automatically. You see a green status indicator with **"ServiceNow is connected."**

## Set up response plans

After connecting ServiceNow, [create response plans](incident-response-plans.md) to define how your agent handles incidents.

When you enable **Quickstart response plan**, your agent creates a default plan:

| Platform | Default plan handles | Autonomy level |
|----------|---------------------|----------------|
| **ServiceNow** | High (Priority 2) incidents | Autonomous |

ServiceNow priority values:

| Priority | Value | Label |
|----------|-------|-------|
| Critical | 1 | Critical |
| High | 2 | High |
| Moderate | 3 | Moderate |
| Low | 4 | Low |
| Planning | 5 | Planning |

## What your agent can do with ServiceNow

| Capability | Description |
|-----------|-------------|
| **Read incidents** | Fetch incident details, related records, and discussion history |
| **Post discussion entries** | Add investigation findings and updates to incident work notes |
| **Acknowledge incidents** | Mark incidents as acknowledged when investigation begins |
| **Change priority** | Adjust incident priority based on investigation findings |
| **Resolve incidents** | Close incidents with resolution notes after successful mitigation |

## Troubleshooting

| Issue | Resolution |
|-------|------------|
| OAuth authorization fails | Verify the redirect URL matches exactly and the OAuth application is active |
| Connection shows "Not Connected" | Re-authorize OAuth or verify basic auth credentials are correct |
| "Unable to connect to ServiceNow endpoint" | Verify the URL format (`https://your-instance.service-now.com`, no trailing slash) |
| "Invalid OAuth credentials" | Regenerate the Client Secret in ServiceNow and try again |

## Related content

- [Incident platforms](incident-platforms.md)
- [Incident response](incident-response.md)
- [Incident response plans](incident-response-plans.md)
