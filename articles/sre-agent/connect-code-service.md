---
title: Connect a Source Code Service in Azure SRE Agent
description: Learn how to connect GitHub, Azure DevOps, and GitLab to Azure SRE Agent so your agent can use repository, issue, and pull request context during investigations.
author: craigshoemaker
ms.author: cshoe
ms.date: 10/28/2026
ms.topic: tutorial
ms.service: azure-sre-agent
ai-usage: ai-assisted
ms.custom: connectors, managed-connectors, github, azure-devops, gitlab
#customer intent: As an SRE, I want to connect a source code service so that my agent can read repository, issue, and pull request context during an investigation.
---

# Connect a source code service

Give your agent access to repository, issue, and pull request context for investigations. It can read recent changes, find related issues, and open an issue or pull request in the right repository or project when the credential you provide allows it.

This tutorial covers GitHub, Azure DevOps, and GitLab. Source code connections use the **Code Access** page (Build + setup > Context > Code access), not the managed connector wizard. This article focuses on source code details: how each service authenticates and how to validate the connection.

## Prerequisites

- A running SRE Agent and access to [sre.azure.com](https://sre.azure.com).
- Permission to configure the agent.
- An account on the service with access to the repositories or projects the agent should read.

For notification services, see [Connect a notification service](connect-notification-service.md).

## Source code connectors

| Connector | Service | Authentication | Typical use |
|-----------|---------|----------------|-------------|
| GitHub | GitHub and GitHub Enterprise Cloud | Bring-your-own GitHub App (OAuth and PAT also supported for github.com) | Read repositories, issues, and pull requests across projects and organizations; create issues or pull requests with approval |
| Azure DevOps | Azure DevOps | Managed identity (OAuth and PAT also supported) | Read repositories and pull requests across projects; create pull requests or work items with approval |
| GitLab | GitLab | Personal access token (PAT) | Read repositories, issues, and merge requests; create issues and comments with approval |

GitHub and Azure DevOps present authentication choices as radio buttons. GitLab uses a personal access token.

## Step 1: Open Code Access

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. In the left sidebar, select **Build + setup** > **Context** > **Code access**.
1. Select the tab for your service (**GitHub**, **Azure DevOps**, or **GitLab**).
1. Select **Add repository**.

## Step 2: Authenticate

The **Add repositories** dialog has two steps: **Connection** and **Add repositories**. On **Connection**, choose the platform and enter its repository URL or organization before configuring authentication. Select **Next** after connecting, then **Save** on the final step.

# [GitHub](#tab/github)

Select **Use your GitHub App** for GitHub Enterprise Cloud or to scope access by organization or installation.

1. Enter a full **Repository URL**, such as `https://github.com/owner/repo`.
1. If a matching credential exists, select **Existing connection** to reuse it or **New connection** to configure another one.
1. Under **Connection method**, choose **Use your GitHub App**.
1. Complete the app setup fields shown by the wizard.
1. Select **Connect** and confirm the connection succeeds.
1. Select **Next**.

GitHub Enterprise Cloud (`.ghe.com`) requires a GitHub App connection. For github.com, **OAuth** and **Personal access token (PAT)** are also supported. GitHub App authentication requires an RSA Key Vault **key** URI (`/keys/`), not a secret URI. See [Set up GitHub BYO App](setup-github-byo-app.md).

After connecting, the agent can search repositories, issues, and pull requests across projects and organizations your app or account has access to.

# [Azure DevOps](#tab/azure-devops)

Use **Managed Identity** for production use, which avoids long-lived credentials.

1. Enter the Azure DevOps **Organization** name.
1. Under **Sign In Methods**, choose **Managed Identity**.
1. Complete the fields shown by the wizard, and ensure the agent's managed identity has access to the Azure DevOps projects and repositories the agent needs.
1. Select **Connect** and confirm the connection succeeds.
1. Select **Next**.

**Your account** (OAuth) and **PAT** authentication are also supported, but they're best suited for development, testing, or scenarios where managed identity can't be used. Use the narrowest identity or token that can read the projects and repositories the agent needs.

After connecting, the agent can search repositories, read pull requests, and inspect work items across your projects.

# [GitLab](#tab/gitlab)

1. Enter a GitLab personal access token (PAT).
1. Select **Next**.

Grant the PAT only the scopes the agent needs for repository, issue, and merge request access.

After connecting, the agent can read repositories, issues, and merge requests within projects the token has access to.

---

The service sees the identity that authorized the connection. Issues, comments, and pull request activity the agent creates appear under that account.

## Step 3: Add repositories

Review the repositories to add. For GitHub, expand each repository to edit its display name and description. For Azure DevOps and GitLab, edit these fields directly in the table.

1. If your service is **Azure DevOps**, first select a project from the **Azure DevOps Project** dropdown. The **Repository URL** column populates with repositories in that project.

1. Review the initial **Repository URL**. For more entries, select a repository from the dropdown or type a URL directly. For Azure DevOps, select the project first.

1. Enter a short **Display name** the agent uses to refer to the repository. For GitHub, expand the entry to find this field.

1. Optionally enter a **Description** to give the agent more context about the repository. For GitHub, first select **Add description**.

1. If your Azure DevOps environment offers a **Remote** option, you can use it for AI-powered search without cloning the full repository. This option isn't available in every environment.

1. To add another repository, select **Add repository** for GitHub or **Add** in the Azure DevOps or GitLab grid. Additional GitHub repositories in this connection use the same host and credential.

1. When the table is complete, select **Save**.

## Step 4: Validate with a scenario

1. Open a chat with your agent.
1. Ask a read question, such as:

   ```text
   List the open issues in the payments repository from the last week.
   ```

1. Check the tool card to see the agent search the service and return results grounded in your data.

When results appear that reference your repository, the connection works end to end.

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Search returns no results | The account lacks access to the project or repository | Confirm the connection account can see the project or repository, then retry. |
| Create fails with a permission error | The token or account lacks write scope | Grant the required scope to the token or account, or use credentials that have write access. |
| GitHub Enterprise Cloud rejects the connection | GitHub Enterprise Cloud requires a GitHub App connection | On the Code Access page, disconnect the GitHub connection, select **Add repository**, choose GitHub, enter your `.ghe.com` host, and select **Bring your own GitHub App** as the authentication method. |

## Related content

- [Connect a notification service](connect-notification-service.md)
- [Connect a telemetry source](connect-telemetry-source.md)
- [Set up a managed connector](setup-managed-connector.md)
