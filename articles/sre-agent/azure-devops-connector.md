---
title: "Tutorial: Set Up an Azure DevOps Connector in Azure SRE Agent"
description: Connect your agent to Azure DevOps for repository access, work item management, and wiki documentation using OAuth or PAT authentication.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/18/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: azure devops, connector, repositories, work items, setup, tutorial, oauth, pat
#customer intent: As an SRE, I want to connect my agent to Azure DevOps so that it can access repositories, wikis, and documentation during investigations.
---

# Tutorial: Set up an Azure DevOps connector in Azure SRE Agent
In this tutorial, you connect your agent to Azure DevOps so it can access repositories, wikis, and documentation during investigations. Choose OAuth for automatic token management or PAT for service account scenarios. When you finish this tutorial, your agent has authenticated access to an Azure DevOps organization and can read repositories, create work items, and correlate code changes with incidents.

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
1. In **Add a connector**, select **Azure DevOps OAuth connector**.
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

| Method | Best for | Token lifecycle |
|--------|----------|----------------|
| **User account** | Quick setup with your Microsoft Entra ID identity | Auto refreshes with no manual renewal |
| **Managed identity** | Unattended production agents | Managed by Azure. There is no expiration. |

> [!TIP]
> OAuth uses your Microsoft Entra ID session so you never manage tokens manually. Tokens refresh automatically in the background. Choose PAT only when you need a service account connection or CI/CD pipeline integration. See the [alternative PAT path](#alternative-set-up-with-pat-authentication) section later in this article.

## Sign in with user account (OAuth)

If you select **User account**, complete OAuth authentication by using your Microsoft Entra ID credentials.

1. Select **Sign in to Azure DevOps**.
1. An **Authorize Azure DevOps** consent dialog appears, listing the permissions your agent needs:
   - Read and write access to repositories and projects
   - Act on behalf of the signed-in user
1. Select **Authorize** to grant access.
1. On success, you see **Connected to Azure DevOps** with a green checkmark.

**Checkpoint:** The **Connected to Azure DevOps** card appears with a green checkmark. If you see an error instead, check that your Microsoft Entra ID account has access to the specified organization.

> [!TIP]
> Select **Sign in with different account** to reauthenticate by using a different Microsoft Entra ID identity.

## Use managed identity (alternative)

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
1. Select **Add connector** to create the connector.

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
> If your agent returns repository information, your connector is working. If you see a "Token lacks `Code.Read` permission" error, reauthenticate and ensure your account has the `vso.code` scope.

## Alternative: Set up with PAT authentication

If your team uses Personal Access Tokens (PATs) instead of OAuth, use the **Documentation connector** for Azure DevOps.

1. When adding a connector, select **Documentation connector** (Azure DevOps) instead of Azure DevOps OAuth connector.
1. Select **Next**.
1. Enter a **Name** and your **Azure DevOps URL** (repository or wiki URL).
1. Under **Authentication method**, select **Personal Access Token (PAT)**.
1. Enter your Azure DevOps PAT in the secure input field.
1. Select **Next** to review, and then select **Add**.

Your PAT is stored securely and you can't retrieve it after saving. The connector tests connectivity before saving. If the PAT lacks the required `vso.code` scope, the connector creation fails with a clear error message.

The following URL formats are accepted:

- `https://dev.azure.com/{org}/{project}/_git/{repo}`
- `https://{org}.visualstudio.com/{project}/_git/{repo}`
- Wiki URLs: `https://dev.azure.com/{org}/{project}/_wiki/wikis/{wiki}`

> [!TIP]
> Use PAT authentication when your organization already manages Azure DevOps PATs, when you need a service account connection without user-specific OAuth, or when you're integrating with CI/CD pipelines.

## Edit or remove a connector

You can modify or delete existing connectors from the connectors list.

### Edit

1. In the connectors list, select the **⋮** (more actions) menu on the connector row.
1. Select **Edit connector**.
1. The edit dialog opens with your current settings. Modify the organization, reauthenticate, or change the managed identity.
1. Select **Save**.

### Delete

To remove a single connector:

1. Select **⋮** on the connector row, and then select **Delete connector**.
1. Confirm the deletion.

To remove multiple connectors at once:

1. Select connectors by using the checkboxes in the grid.
1. Select **Remove** in the toolbar.
1. Confirm in the deletion dialog.

## Troubleshooting

Use the following information to resolve common errors when setting up an Azure DevOps connector.

| Issue | Solution |
|-------|----------|
| "Authorize Azure DevOps" dialog doesn't appear | Refresh the page and try again. If your Microsoft Entra ID session expired, sign in again at the portal. |
| "Invalid or expired token" | Your Microsoft Entra ID session expired. Refresh the portal page to get a new session, then try signing in again. |
| "Azure DevOps access token not configured. Please authenticate." | No OAuth token exists for this connector. Edit the connector and sign in again. |
| "Token lacks `Code.Read` permission" | Re-authenticate with an account that has `Code.Read` permissions in the organization. |
| "Organization not configured for this connector" | Organization name is missing. Delete and re-create the connector with the correct organization name. |
| "A connector for this organization already exists" | Each organization can only have one connector. Edit the existing one or delete it first. |
| "A connector with this name already exists" | Another connector already uses this name. Choose a different name. |
| Sign-in button is disabled | Enter your organization name first. The button enables once the **Organization** field is filled. |

## Summary

In this tutorial, you learned how to:

- Add an Azure DevOps connector by using OAuth or managed identity authentication
- Understand the difference between OAuth (autorefreshing) and PAT (manually managed) authentication
- Verify that your agent can access your Azure DevOps repositories
- Set up PAT authentication through the documentation connector
- Set up multiple connectors for different organizations

## Next step

> [!div class="nextstepaction"]
> [Learn about connectors](./connectors.md)

## Related content

- [Connect source code](connect-source-code.md)
- [Azure DevOps wiki knowledge](azure-devops-wiki-knowledge.md)
- [Connectors](connectors.md)
