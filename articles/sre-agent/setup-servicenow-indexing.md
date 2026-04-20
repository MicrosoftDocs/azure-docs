---
title: Set up ServiceNow incident indexing in Azure SRE Agent
description: Connect ServiceNow to Azure SRE Agent so your agent automatically indexes, investigates, and responds to ServiceNow incidents.
ms.topic: tutorial
ms.date: 03/16/2026
author: craigshoemaker
ms.author: cshoe
ms.service: azure-sre-agent
ms.ai-usage: ai-assisted
ms.custom: servicenow, incident-indexing, setup, tutorial
#customer intent: As an SRE, I want to set up ServiceNow incident indexing so that my agent automatically picks up and investigates ServiceNow incidents.
---

# Set up ServiceNow incident indexing in Azure SRE Agent

In this tutorial, you connect your ServiceNow instance to Azure SRE Agent so the agent automatically indexes and investigates ServiceNow incidents. You can use basic authentication or OAuth 2.0. This setup takes about 10 minutes.

> [!TIP]
> To learn how ServiceNow incident indexing works, see [ServiceNow incident indexing](servicenow-incidents.md).

## Prerequisites

Before you begin, make sure you have the following resources and access:

- An Azure SRE Agent in **Running** state
- A ServiceNow instance with the Incident table (standard ITSM)
- A ServiceNow user account with the **itil** or **admin** role (for basic authentication), or a registered OAuth application (for OAuth 2.0)
- **Contributor** role or higher on the Azure SRE Agent resource

## Open the incident platform settings

Go to the incident platform configuration page where you select and connect ServiceNow.

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. In the sidebar, expand **Builder**.
1. Select **Incident platform**.

:::image type="content" source="media/setup-servicenow-indexing/servicenow-incident-platform-settings.png" alt-text="Screenshot of the Builder sidebar expanded showing the Incident platform option selected." lightbox="media/setup-servicenow-indexing/servicenow-incident-platform-settings.png":::

The **Incident platform** heading appears with a platform dropdown.

## Select ServiceNow

Choose ServiceNow as the incident platform for your agent.

1. Select the **Incident platform** dropdown.
1. Select **ServiceNow**.

If another platform is already connected, you're prompted to disconnect it first. Your agent connects to one incident platform at a time.

:::image type="content" source="media/setup-servicenow-indexing/servicenow-platform-dropdown.png" alt-text="Screenshot of the incident platform dropdown showing available platform options including ServiceNow." lightbox="media/setup-servicenow-indexing/servicenow-platform-dropdown.png":::

The ServiceNow configuration form appears with authentication fields.

## Choose authentication and enter credentials

Select your authentication type from the **Authentication Type** dropdown.

### Option A: Basic authentication

Use basic authentication for quick setup in development or test environments.

1. Leave **Authentication Type** set to **Basic Authentication**.
1. Enter your **ServiceNow endpoint** (for example, `https://your-instance.service-now.com`).
1. Enter your **Username**.
1. Enter your **Password**.

:::image type="content" source="media/setup-servicenow-indexing/servicenow-form-basic-authentication.png" alt-text="Screenshot of the ServiceNow form with Basic Authentication selected, showing endpoint, username, and password fields." lightbox="media/setup-servicenow-indexing/servicenow-form-basic-authentication.png":::

After you fill in all required fields, the **Save** button becomes active.

### Option B: OAuth 2.0

Use OAuth 2.0 for production environments where token-based authentication is preferred.

1. Select **OAuth 2.0** from the **Authentication Type** dropdown.
1. Note the **Redirect URL** shown in the info box. You need to register this URL in ServiceNow before you authorize.
1. Enter your **ServiceNow endpoint**.
1. Enter your **OAuth Client ID**.
1. Enter your **OAuth Client Secret**.

> [!NOTE]
> Before you authorize, add the redirect URL to your ServiceNow OAuth application:
>
> 1. In ServiceNow, go to **System OAuth** > **Application Registry**.
> 1. Open or create your OAuth application.
> 1. Add the redirect URL: `https://logic-apis-<REGION>.consent.azure-apim.net/redirect`. The exact URL with your agent's region appears in the portal.

:::image type="content" source="media/setup-servicenow-indexing/servicenow-oauth-form.png" alt-text="Screenshot of the ServiceNow OAuth 2.0 form showing redirect URL info box, endpoint, client ID, and client secret fields." lightbox="media/setup-servicenow-indexing/servicenow-oauth-form.png":::

When you fill in all required fields, the **Authorize** button becomes active.

## Connect and validate

Complete the connection and verify that the agent can reach your ServiceNow instance.

**For basic authentication:**

- Select **Save**.

The app saves the connection settings, and the agent starts checking connectivity to ServiceNow in the background.

**For OAuth 2.0:**

- Select **Authorize**.

A popup window opens for you to complete the OAuth flow in ServiceNow. After authorization, the connection is established.

The connectivity indicator polls every few seconds and typically confirms the connection within 30 seconds to 2 minutes. The check works by fetching a real incident from your ServiceNow instance to verify the credentials are valid.

> [!WARNING]
> If you see "Unable to connect to ServiceNow":
>
> - Verify your endpoint URL is correct (include `https://`).
> - Confirm the username and password are valid.
> - Check that the account has the `itil` role.
> - Ensure your ServiceNow instance allows REST API access.

When the connection succeeds, the connectivity indicator shows a green **Connected** status.

## Enable the quickstart response plan

Select the **Quickstart response plan** checkbox. This option creates a default response plan that handles high priority incidents automatically.

The agent needs at least one response plan before it starts scanning for incidents. If you clear this checkbox, the agent doesn't index any incidents until you create a response plan manually. The scanner runs every minute but skips incidents when no response plans are configured.

To customize incident handling later, go to **Activities** > **Incidents** to create more response plans with specific priority routing and run modes.

## Verify incidents appear

After connecting, confirm that your agent receives ServiceNow incidents.

1. In the sidebar, expand **Activities**.
1. Select **Incidents**.
1. Wait 1-2 minutes for the scanner to complete its first cycle.

ServiceNow incidents that match your response plan filters appear in the incident overview grid with columns for ID, Title, Priority, Status, Agent Status, Created, Impacted Service, and Handler.

## Edit or disconnect ServiceNow

You can update your connection settings or disconnect ServiceNow at any time.

### Edit connection settings

To modify your ServiceNow configuration:

1. Go to **Builder** > **Incident platform**.
1. Select **Edit** at the bottom of the page.
1. Modify the instance URL, credentials, or other settings.
1. Select **Save**.

### Disconnect ServiceNow

To stop receiving ServiceNow incidents:

1. Go to **Builder** > **Incident platform**.
1. Select **Disconnect** at the bottom of the page.
1. In the confirmation dialog, select **Yes**.

After you disconnect, the agent stops scanning for ServiceNow incidents. Your response plans are preserved and reactivate when you reconnect.

## Troubleshooting

Use the following table to resolve common issues during ServiceNow setup.

| Issue | Solution |
|---|---|
| Unable to connect to ServiceNow | Verify the endpoint URL, username, and password. Also, check that the account has the `itil` role. |
| No incidents appear after connecting | Ensure you selected the **Quickstart response plan** checkbox during setup. The agent needs at least one response plan to start scanning. |
| OAuth authorization popup fails | Ensure the redirect URL is registered in ServiceNow under **System OAuth** > **Application Registry**. |
| Connectivity indicator stays on "Connecting" | Wait up to 2 minutes. If the indicator times out, recheck your credentials. |
| Need to switch from another platform | Disconnect the current platform first. Your agent connects to one platform at a time. |

## Next step

> [!div class="nextstepaction"]
> [Set up an incident trigger](response-plan.md)

## Related content

- [ServiceNow incident indexing](servicenow-incidents.md)
- [Incident response plans](incident-response-plans.md)
- [Incident response](incident-response.md)
- [Connectors](connectors.md)
