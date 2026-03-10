---
title: "Tutorial: Set Up an Azure DevOps Connector in Azure SRE Agent"
description: Connect your agent to Azure DevOps for repository access, work item management, and wiki documentation.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: azure devops, connector, repositories, work items, setup, tutorial
#customer intent: As an SRE, I want to connect my agent to Azure DevOps so that it can access repositories, wikis, and documentation during investigations.
---

# Tutorial: Set up an Azure DevOps connector in Azure SRE Agent
In this tutorial, you connect your agent to Azure DevOps so it can access repositories, wikis, and documentation across your organization. When you finish this tutorial, your agent has authenticated access to an Azure DevOps organization and can read repositories, create work items, and correlate code changes with incidents.

**Estimated time**: 5 minutes

In this tutorial, you:

> [!div class="checklist"]
> - Add an Azure DevOps OAuth connector scoped to an organization
> - Choose between User account (OAuth), Managed identity, and PAT authentication
> - Verify that your agent can access your Azure DevOps repositories

> [!NOTE]
> Your agent references your Azure DevOps repositories and wikis during investigations to find relevant code, procedures, and documentation automatically. For more information, see [Azure DevOps wiki knowledge](azure-devops-wiki-knowledge.md).

## Prerequisites

- An agent created in the [Azure SRE Agent portal](https://sre.azure.com)
- A Microsoft Entra ID account with access to your Azure DevOps organization
- **SRE Agent Administrator** or **Standard User** role on the agent

## Navigate to connectors

Open the connectors page where you can add and manage your agent's external connections.

1. Open your agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left sidebar, expand **Builder**.
1. Select **Connectors**.

The connectors list shows any existing connectors for your agent.

:::image type="content" source="media/azure-devops-connector/oauth-connectors-list.png" alt-text="Screenshot of connectors list page showing existing connectors with status indicators." lightbox="media/azure-devops-connector/oauth-connectors-list.png":::

## Add an Azure DevOps OAuth connector

Select the Azure DevOps OAuth connector type from the wizard.

1. Select **Add connector** in the toolbar.
1. In the **Add a connector** wizard, select **Azure DevOps OAuth connector**.
1. Select **Next**.

:::image type="content" source="media/azure-devops-connector/oauth-connector-picker-all.png" alt-text="Screenshot of the connector picker showing Azure DevOps OAuth connector option." lightbox="media/azure-devops-connector/oauth-connector-picker-all.png":::

> [!NOTE]
> If you don't see the Azure DevOps OAuth connector in the picker, the OAuth feature might not be enabled for your agent. Contact your administrator.

## Configure the connector

The setup form has three fields: name, organization, and authentication method.

### Name

Enter a name for this connector. The name must:

- Start with a letter
- Contain only letters, numbers, and hyphens
- Be 4-64 characters long

Example: `ado-contoso` or `my-org-connector`

### Organization

Enter your Azure DevOps organization name, which is the part after `dev.azure.com/` in your URL.

For example, if your URL is `https://dev.azure.com/contoso`, enter `contoso`.

The organization name must:

- Start with a letter or digit
- Contain only letters, numbers, and hyphens
- Be up to 255 characters long
- Be unique among your existing Azure DevOps OAuth connectors

> [!WARNING]
> Each Azure DevOps OAuth connector maps to one organization. If you need access to multiple organizations, create a separate connector for each one.

### Authentication method

Choose how your agent authenticates to Azure DevOps:

| Method | When to use |
|--------|-------------|
| **User account** | Quick setup for individual users. Sign in with your Microsoft Entra ID account. |
| **Managed identity** | Production agents that need persistent, unattended access. |

> [!TIP]
> Use PAT authentication through the **Documentation connector** (Azure DevOps). For more information, see the [alternative PAT path](#alternative-set-up-with-pat-authentication) section later in this article, or [learn more about connectors](connectors.md).

## Sign in with user account (OAuth)

If you select **User account**, complete OAuth authentication by using your Microsoft Entra ID credentials.

1. Select **Sign in to Azure DevOps**.
1. Complete the Microsoft Entra ID authentication in the dialog.
1. On success, you see **Connected to Azure DevOps** with a green checkmark.

> [!WARNING]
> If the authentication dialog doesn't appear, check that your browser isn't blocking popups from `sre.azure.com`.

If authentication fails, a dialog shows **Authentication Failed** with details. Check that:

- Your Microsoft Entra ID account has access to the specified organization.
- Your account has the `vso.code` (Code.Read) scope.

> [!TIP]
> Select **Sign in with different account** to re-authenticate by using a different Microsoft Entra ID identity.

## Use Managed identity (alternative)

If you select **Managed identity**, configure the identity your agent uses for unattended authentication.

1. Select a managed identity from the dropdown (system-assigned or user-assigned).
1. If your Azure DevOps organization is in a different Microsoft Entra ID tenant, configure the **Federated Identity Credential (FIC)** fields for cross-tenant authentication.
1. Proceed to the review step.

Managed identity works well for production agents that need persistent, unattended access without user interaction. The agent authenticates by using the managed identity credential directly, with no user sign-in required.

> [!TIP]
> Choose managed identity when your agent runs unattended, such as in automated workflows or scheduled tasks that query Azure DevOps repositories.

## Review and add

Confirm the connector details and create the connector.

1. Select **Next** to proceed to the review step.
1. Verify the connector details:
   - **Name**: your chosen name
   - **Organization**: your Azure DevOps organization
   - **Type**: Azure DevOps OAuth
1. Select **Add** to create the connector.

Your connector now appears in the connectors list with a **Connected** status indicator.

## Verify access

Test that your agent can access your Azure DevOps repositories.

Ask your agent:

```text
What repositories are available in my Azure DevOps organization?
```

Or, for a specific check:

```text
Show me recent commits in the payment-service repository.
```

> [!NOTE]
> If your agent returns repository information, your connector is working. If you see a "Token lacks Code.Read permission" error, re-authenticate and ensure your account has the `vso.code` scope.

## Alternative: Set up with PAT authentication

If your team uses Personal Access Tokens (PATs) instead of OAuth, use the **Documentation connector** for Azure DevOps.

1. When adding a connector, select **Documentation connector** (Azure DevOps) instead of Azure DevOps OAuth connector.
1. Select **Next**.
1. Enter a **Name** and your **Azure DevOps URL** (repository or wiki URL).
1. Under **Authentication method**, select **Personal Access Token (PAT)**.
1. Enter your Azure DevOps PAT in the secure input field.
1. Select **Next** to review, then select **Add**.

Your PAT is stored securely and can't be retrieved after saving. The connector tests connectivity before saving. If the PAT lacks the required `vso.code` scope, the connector creation fails with a clear error message.

The following URL formats are accepted:

- `https://dev.azure.com/{org}/{project}/_git/{repo}`
- `https://{org}.visualstudio.com/{project}/_git/{repo}`
- Wiki URLs: `https://dev.azure.com/{org}/{project}/_wiki/wikis/{wiki}`

> [!TIP]
> Use PAT authentication when your organization already manages Azure DevOps PATs, when you need a service account connection without user-specific OAuth, or when integrating with CI/CD pipelines.

## Troubleshooting

Use the following information to resolve common errors when setting up an Azure DevOps connector.

### "Azure DevOps access token not configured. Please authenticate."

No OAuth token exists for this connector. Edit the connector and sign in again.

### "Token lacks Code.Read permission"

Your token doesn't have the `vso.code` scope required to access repositories. Sign in again by using an account that has Code.Read permissions in the organization.

### "Organization not configured for this connector"

The organization name is missing from the connector configuration. Delete and re-create the connector with the correct organization name.

### "A connector for this organization already exists"

You already have an Azure DevOps OAuth connector for this organization. Each organization can only have one connector. Edit the existing connector or delete it first.

### "A connector with this name already exists"

Another connector (of any type) already uses this name. Choose a different name for your Azure DevOps connector.

## Next step

> [!div class="nextstepaction"]
> [Learn about connectors](./connectors.md)

## Related content

- [Connect source code](connect-source-code.md)
- [Azure DevOps wiki knowledge](azure-devops-wiki-knowledge.md)
- [Connectors](connectors.md)
