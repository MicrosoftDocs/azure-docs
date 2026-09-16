---
title: 'Quickstart: Automate browser tasks with the Playwright Workspaces remote MCP server'
titleSuffix: Playwright Workspaces
description: Connect an AI agent to the Playwright Workspaces remote MCP server and run an agent-driven browser automation task.
ms.topic: quickstart
ms.date: 09/11/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
---

# Quickstart: Automate browser tasks with the Playwright Workspaces remote MCP server

> [!IMPORTANT]
> The Playwright Workspaces remote Model Context Protocol (MCP) server is in preview. Preview features don't have a service-level agreement and aren't recommended for production workloads. Features, limits, and availability can change.

In this quickstart, you connect an AI agent to the Playwright Workspaces remote MCP server. The agent uses a managed cloud browser to open a webpage, inspect its accessibility snapshot, report page content, and close the browser session.

The remote MCP server provides browser automation tools over streamable HTTP. You don't need to install Playwright, browser binaries, or a local MCP server in the agent environment.

After you complete this quickstart, you have an MCP client connected to a Playwright workspace and can run an agent-driven browser task from GitHub Copilot CLI or Microsoft Foundry.

## Prerequisites

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.
- A [Playwright workspace](./quickstart-run-end-to-end-tests.md#create-a-workspace) that is enabled for the remote MCP preview.
- The **Contributor** or **Owner** Azure role at the workspace scope. This role is required to create a workspace access token. For more information, see [Manage access to a Playwright workspace](./how-to-manage-workspace-access.md).
- One of the following MCP clients:
  - GitHub Copilot CLI with MCP support.
  - A Microsoft Foundry project with permission to create project connections and configure agents.

## Build the remote MCP endpoint

In the [Azure portal](https://portal.azure.com/), open the **Overview** page of your Playwright workspace. Use the workspace region and workspace ID to build the remote MCP endpoint.

:::image type="content" source="./media/quickstart-automate-browser-tasks-remote-mcp/copy-workspace-endpoint.png" alt-text="Screenshot of a Playwright workspace Overview page showing the workspace location and API base endpoint." lightbox="./media/quickstart-automate-browser-tasks-remote-mcp/copy-workspace-endpoint.png":::

The endpoint uses the following format:

```text
https://<region>.mcp.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/mcp
```

For example:

```text
https://eastus.mcp.playwright.microsoft.com/playwrightworkspaces/00000000-0000-0000-0000-000000000000/mcp
```

Use the endpoint for the region where the workspace is deployed.

## Create a workspace access token

This quickstart uses key-based authentication. The MCP client sends a workspace access token in the `x-api-key` request header.

> [!CAUTION]
> Microsoft Entra ID is the recommended authentication method for Playwright Workspaces. Access tokens are less secure and are disabled by default. Treat an access token like a password. Never commit it to source control or include it in agent instructions, prompts, or logs.

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Open your Playwright workspace.
1. Under **Settings**, select **Access Management**.
1. Select the **Playwright Service Access Token** checkbox if it isn't already selected.
1. Select **Generate token**.
1. Enter a name and expiration date, and then generate the token.
1. Copy the token immediately. You can't retrieve its value later.

The token is associated with the user who creates it. The service evaluates that user's current Azure role-based access control (RBAC) permissions when the token is used. Use a short expiration period for this quickstart.

For more information, see [Manage workspace access tokens](./how-to-manage-access-tokens.md).

## Connect an MCP client

Choose the MCP client that you want to use.

### GitHub Copilot CLI

To add the Playwright Workspaces remote MCP server to GitHub Copilot CLI:

1. Open GitHub Copilot CLI.
1. Enter `/mcp add`.
1. Enter a unique server name, such as `playwrightWorkspace`.
1. Select **HTTP** as the server type.
1. Enter the remote MCP endpoint.
1. Add an HTTP header named `x-api-key` and use the workspace access token as its value.
1. Select **Auto** for deferred tools.
1. Press <kbd>Esc</kbd> to finish adding the server.

:::image type="content" source="./media/quickstart-automate-browser-tasks-remote-mcp/add-remote-mcp-server-copilot-cli.png" alt-text="Screenshot of GitHub Copilot CLI prompts for adding an HTTP remote MCP server." lightbox="./media/quickstart-automate-browser-tasks-remote-mcp/add-remote-mcp-server-copilot-cli.png":::

### Microsoft Foundry

Connect the remote server as a custom MCP tool. Foundry stores the workspace access token in a project connection.

> [!NOTE]
> A key stored in a Foundry project connection is a shared project secret. Project members who use the connection use the identity and permissions associated with the token. Use a dedicated, least-privilege token and restrict access to the project.

To connect the remote MCP server:

1. Open your project in the [Microsoft Foundry portal](https://ai.azure.com/).
1. Select **Build** > **Tools**, and then select **Add tool** > **Custom** > **Model Context Protocol**.
1. Enter `playwrightWorkspace` as the unique name.
1. Enter the remote MCP server endpoint.
1. Select key-based authentication.
1. Enter `x-api-key` as the credential name and the workspace access token as the credential value.
1. Select **Connect**. Foundry creates the project connection.

:::image type="content" source="./media/quickstart-automate-browser-tasks-remote-mcp/add-mcp-tool-foundry.png" alt-text="Screenshot of Microsoft Foundry settings for adding a remote Model Context Protocol tool with key-based authentication." lightbox="./media/quickstart-automate-browser-tasks-remote-mcp/add-mcp-tool-foundry.png":::

Create or open an agent, add the remote MCP tool, and select the project connection. Require approval for every tool call while you evaluate the integration. Requiring approval lets you inspect the tool name and arguments before each browser operation.

For current connection fields and approval behavior, see [Connect Microsoft Foundry agents to MCP server endpoints](/azure/foundry/agents/how-to/tools/model-context-protocol).

## Run your first browser task

Submit the following prompt to the agent:

```text
Use the Playwright workspace tools to create a browser session, open
https://example.com, inspect the page snapshot, and report the main heading
and page URL. Close the browser session when the task finishes. Always close
the session if a browser step fails.
```

Verify that the agent follows this sequence:

1. Calls `create_browser_session` and retains the returned `browserSessionId`.
1. Calls `browser_navigate` with the session ID and `https://example.com`.
1. Calls `browser_snapshot` or `browser_find` with the same session ID.
1. Reports the **Example Domain** heading and the page URL.
1. Calls `close_browser_session` with the session ID.

A successful result resembles the following output:

```output
Heading: Example Domain
URL: https://example.com/
Browser session closed.
```

The exact response varies by agent and model. The session creation result might also contain a live-view URL. The final response alone doesn't confirm cleanup. Inspect the tool-call history and verify that `close_browser_session` succeeded.

> [!CAUTION]
> Remote browser sessions consume workspace capacity and might incur charges. Close each session as soon as the task finishes.

## Clean up resources

When you finish the quickstart:

1. Confirm that the agent called `close_browser_session`.
1. Remove the test agent or project connection if you no longer need it.
1. Revoke temporary workspace access tokens.
1. In GitHub Copilot CLI, remove the MCP server if you no longer need the connection.
1. If you created a Playwright workspace only for this quickstart, delete its resource group. Don't delete a resource group that contains resources you want to keep.

## Next step

> [!div class="nextstepaction"]
> [Automate browsers with the Playwright Workspaces remote MCP server](./how-to-playwright-workspaces-remote-mcp.md)
