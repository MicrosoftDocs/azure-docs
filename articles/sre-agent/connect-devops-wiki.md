---
title: "Tutorial: Connect an Azure DevOps Wiki to Azure SRE Agent"
description: Connect an Azure DevOps wiki to your Azure SRE Agent so the agent can reference team runbooks and procedures during investigations.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 03/09/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: azure-devops, wiki, knowledge-base, connector, setup, documentation
#customer intent: As an SRE, I want to connect my Azure DevOps wiki to my agent so that it can reference runbooks during investigations.
---

# Tutorial: Connect an Azure DevOps wiki to Azure SRE Agent
In this tutorial, you connect an Azure DevOps wiki as a knowledge source for your Azure SRE Agent. After you complete these steps, your agent can search your team's wiki for runbooks and procedures when it answers questions during investigations.

In this tutorial, you learn how to:

> [!div class="checklist"]
> - Connect an Azure DevOps wiki by using the documentation connector
> - Choose between managed identity and personal access token (PAT) authentication
> - Verify the connection by asking your agent a question that uses wiki content

**Estimated time**: 10 minutes

## Prerequisites

Before you begin, make sure you have the following resources and access:

- An Azure SRE Agent (already created).
- An Azure DevOps project with a wiki that contains content.
- One of these authentication options:
  - **Managed identity**: Add your agent's managed identity as a user in your Azure DevOps organization (**Organization Settings** > **Users** > **Add users** > enter the identity's client ID).
  - **Personal access token (PAT)**: Generate in Azure DevOps with **Code (Read)** scope.

## Get your wiki URL

To connect your wiki, you first need the URL from Azure DevOps.

1. Go to your Azure DevOps project.
1. Select **Wiki** in the left sidebar.
1. Copy the URL from your browser's address bar.

Your URL looks like this example:

```text
https://dev.azure.com/{your-org}/{your-project}/_wiki/wikis/{wiki-name}
```

Legacy URLs are also supported:

```text
https://{your-org}.visualstudio.com/{your-project}/_wiki/wikis/{wiki-name}
```

> [!TIP]
> To index only a specific section of your wiki, navigate to that section in Azure DevOps first, then copy the URL. The page ID in the URL tells your agent to crawl only that page and its subpages. This approach is useful for large wikis where only a section like `/Operations` or `/Runbooks` is relevant.

## Open the Connectors page

Go to the connectors configuration in the Azure SRE Agent portal.

1. Go to [sre.azure.com](https://sre.azure.com).
1. Select your agent.
1. In the left sidebar, expand **Builder**.
1. Select **Connectors**.

A list of your existing connectors appears, showing their names, service types, and connection status.

## Start the Add connector wizard

Select **Add connector** in the toolbar to open a three-step wizard:

1. **Choose a connector**: Select the connector type.
1. **Set up connector**: Configure name, URL, and authentication.
1. **Review + add**: Confirm and create.

## Select the documentation connector

In the connector picker, find and select **Documentation connector** with the subtitle **Azure DevOps**. The connector description reads: "The agent references documentation and files to understand your projects and processes."

Select **Next** to proceed to the setup form.

## Configure the connector

The form title shows **Set up Azure DevOps connector**. Fill in the following fields:

| Field | What to enter |
|---|---|
| **Name** | A descriptive name (for example, `ops-wiki` or `team-runbooks`) |
| **Azure DevOps URL** | Your wiki URL from the previous step |

### Choose your authentication method

Select one of the following authentication options.

#### Option A: Managed identity (recommended)

1. Select **Managed Identity** (selected by default).
1. Choose your managed identity from the **Managed identity** dropdown list (defaults to **System assigned**).
1. Optionally, select **Use managed identity as federated identity credential**.

#### Option B: Personal access token (PAT)

1. Select **Personal Access Token (PAT)**.
1. Paste your Azure DevOps PAT in the **Personal Access Token** field.

Select **Next** to proceed to the review step.

## Review and create the connector

Review your connector details on the summary screen, and then select the submit button to create the connector.

Your new connector appears in the connectors list with status **Connected** (green checkmark).

> [!NOTE]
> Initial indexing might take a few minutes depending on the size of your wiki. Your agent can use the wiki content after indexing completes.

## Verify the connection

Test the new wiki connection by asking the agent a question that your wiki content can answer.

1. Select **New chat thread** in the sidebar.
1. Ask a question that your wiki content can answer.

For example:

```text
What are our standard procedures for handling a database failover?
```

Your agent searches your wiki alongside other knowledge sources and includes citations linking to the original wiki page in its response. The response includes a citation link back to the source wiki page in Azure DevOps.

## Troubleshooting

Use the following table to resolve common issues with the Azure DevOps wiki connector.

| Issue | Solution |
|---|---|
| Connector shows **Disconnected** | Verify your wiki URL format and authentication credentials. |
| Wiki content doesn't appear in responses | Wait a few minutes for initial indexing to complete, then try again. |
| URL validation error | Ensure the URL matches `https://dev.azure.com/{org}/{project}/_wiki/wikis/{wiki-name}` or `https://dev.azure.com/{org}/{project}/_git/{repo}`. Legacy `visualstudio.com` URLs are also accepted. |
| PAT authentication fails | Check that your PAT has **Code (Read)** scope and isn't expired. |
| Managed identity fails | Verify the agent's managed identity is added as a user in your Azure DevOps organization (**Organization Settings** > **Users**). |

## Next step

> [!div class="nextstepaction"]
> [Learn about ADO Wiki knowledge](./azure-devops-wiki-knowledge.md)

## Related content

- [Azure DevOps wiki knowledge](azure-devops-wiki-knowledge.md)
- [Upload knowledge documents](upload-knowledge-document.md)
- [Connectors](connectors.md)
- [Memory and knowledge](memory.md)
