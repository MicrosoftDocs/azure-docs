---
title: Manage credentials with secret stores
titleSuffix: Playwright Workspaces
description: Learn about managing credentials with secret stores.
ms.topic: how-to
ms.date: 11/18/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
---

# Manage credentials with secret stores (preview)

> [!IMPORTANT]
> The secret store in Playwright Workspaces is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

AI agents that automate browsers often need to sign in to websites. Passing usernames and passwords to an agent in a prompt, in agent instructions, or in code is risky: the values can end up in the model context, in conversation history, in logs, or in the agent's responses, and a malicious page can try to trick the agent into revealing them.

A secret store in Playwright Workspaces solves this problem. A secret store references credentials that you keep in your own Azure Key Vault. The agent refers to a credential only by its secret name. When the agent needs to fill in a credential, Playwright Workspaces reads the secret on the server, just in time, by using the workspace's managed identity, and enters the value directly into the page. The secret value never appears in your agent's code, its responses, or the model context.

## Scenarios

Use a secret store when your agent needs to:

- Sign in to internal business applications, admin portals, or line-of-business tools to automate repetitive tasks.
- Run end-to-end workflows behind a sign-in page, such as checking an order status, downloading a report, or updating a record.
- Validate sign-in and post-sign-in user journeys in development, staging, or preproduction environments.
- Share access to a website across multiple agents or team members without sharing the underlying credentials.
- Rotate credentials centrally in Key Vault without updating agent configurations.

## How secret stores protect your credentials

Secret stores apply several layers of protection:

- **Your secrets stay in your key vault.** Playwright Workspaces stores only a reference to each secret, not its value. You keep control of the secrets, their access policies, rotation, and auditing in Azure Key Vault.
- **Least-privilege access through managed identity.** Playwright Workspaces reads secrets by using a managed identity that you grant the **Key Vault Secrets User** role. You can scope the role to individual secrets.
- **Secret values stay out of the model.** The agent sees and uses only secret names. Values are resolved on the server and entered into the page, so they never reach the model context, the agent's responses, or the conversation history.
- **Domain allow listing.** Each secret in a store is bound to the domain of the website it belongs to. Playwright Workspaces enters a secret only into pages on its allowed domain. If an agent is redirected to, or tricked into navigating to, a different site, such as a phishing page or a page that contains prompt-injection instructions, the secret isn't entered. Domain allow listing limits the impact of a compromised or misdirected agent and ensures that credentials are used only where you intend.

In this article, you create a secret store with credentials for one website, and connect an agent in GitHub Copilot app or GitHub Copilot CLI that can use it to sign in.

## Prerequisites

Before you begin, ensure you have the following items:

- An Azure account with an active subscription. If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/).
- A Playwright workspace. To create one, see [Quickstart: Automate browser tasks with the remote MCP server](../quickstart-automate-browser-tasks-remote-mcp.md).
- The **Contributor** or **Owner** role on the Playwright workspace.
- An Azure key vault that uses the Azure role-based access control (Azure RBAC) permission model.
- Permission to assign roles on the key vault, such as the **Owner**, **User Access Administrator**, or **Role Based Access Control Administrator** role.
- A website that signs in with a username and password.
- An agent client:
  - **GitHub Copilot app**: GitHub Copilot app connected to the Playwright Workspaces remote MCP server.
  - **GitHub Copilot CLI**: GitHub Copilot CLI installed and connected to the Playwright Workspaces remote MCP server.

## Store the credentials in Azure Key Vault

Playwright Workspaces doesn't store secret values. You keep them in your key vault, and the secret store holds only a reference to each secret.

1. Sign in to the [Azure portal](https://portal.azure.com) and go to your key vault.
1. Select **Objects** > **Secrets**, and then select **Generate/Import**.
1. Create a secret for the username. For example, enter `contoso-username` for **Name** and the username for **Secret value**. Select **Create**.
1. Repeat the previous step to create a secret for the password, such as `contoso-password`.
1. For each secret, copy the versionless secret URI. A versionless URI has this format:

   ```text
   https://<key-vault-name>.vault.azure.net/secrets/<secret-name>
   ```

> [!TIP]
> Use versionless secret URIs. Playwright Workspaces always reads the latest version of the secret, so when you rotate a secret in Key Vault, your agents use the new value automatically.

## Set up a managed identity for the workspace

Playwright Workspaces uses a managed identity to read secrets from your key vault. You can use the workspace's system-assigned identity or a user-assigned identity.

1. In the Azure portal, go to your Playwright workspace.
1. Select **Settings** > **Identity**.
1. Do one of the following:
   - **System-assigned**: Set **Status** to **On**, and then select **Save**.
   - **User-assigned**: Select **Add**, select a user-assigned managed identity, and then select **Add**.

## Grant the managed identity access to Key Vault

Assign the **Key Vault Secrets User** role to the managed identity so that it can read the secrets.

1. In the Azure portal, go to your key vault.
1. Select **Access control (IAM)** > **Add** > **Add role assignment**.
1. On the **Role** tab, select **Key Vault Secrets User**, and then select **Next**.
1. On the **Members** tab, for **Assign access to**, select **Managed identity**.
1. Select **Select members**, choose the managed identity of your Playwright workspace, and then select **Select**.
1. Select **Review + assign**.

> [!NOTE]
> To limit access, assign the role on individual secrets instead of the whole key vault.

## Create a secret store

A secret store groups the secrets that an agent can use. Within a store, you organize secrets by the domain of the website that they sign in to.

The domain that you enter for each secret acts as an allow list. Playwright Workspaces enters the secret only into pages on that domain, so add only the domains where the credentials are meant to be used.
1. In the Azure portal, go to your Playwright workspace.
1. Select **Settings** > **Secret stores**, and then select **Create**.
1. On the **Create secret store** pane, enter the following values:

   | Field | Description |
   |---|---|
   | **Secret store name** | A name for the store, such as `contoso-portal`. The name must be unique in the workspace. |
   | **Description** | Optional. A description that helps other workspace members understand what the store is for. |
   | **Managed Identity type** | Select **System assigned identity** or **User assigned identity**. This identity must have the **Key Vault Secrets User** role on the key vault. If you select **User assigned identity**, choose the identity. |

   :::image type="content" source="./media/create-secret-store.png" alt-text="Screenshot that shows the Create secret store pane in the Azure portal, with fields for the secret store name, description, managed identity type, and domain list." lightbox="./media/create-secret-store.png":::

1. Under **Domain list**, select **Add domain**, and then enter the values for the website:

   | Field | Description |
   |---|---|
   | **Domain** | The domain of the website, such as `portal.contoso.com`. Playwright Workspaces enters the secret only into pages on this domain. Each domain must be unique in the store. |
   | **Secret name** | The name that the agent uses to refer to the secret, such as `contoso-username`. Each secret name must be unique within its domain. |
   | **Secret URI** | The versionless Key Vault secret URI that you copied earlier. |

1. Add a second row for the password secret, such as `contoso-password`, with its secret URI.
1. Select **Review + create**. Playwright Workspaces validates that the managed identity can read each secret.
1. When you see **Secret store created successfully**, select **Copy Secret store ID**. You use this ID to connect your agent to the store.

> [!NOTE]
> A workspace can have up to 100 secret stores, and each secret store can have up to 50 secrets.

## Connect your agent to the secret store

1. On the **Secret store** page, select the name of the secret store that you created.

1. In the **View secret store** pane, expand **Tool usage**. It shows the **Header name** and **Header value** to add to your MCP client.

1. Use the copy buttons to copy both values. You use them in the next section.

The header value is the configuration's ID. It's also shown in the **Secret store-ID** column on the **Secret stores** page.

Pass the secret store ID to your agent client by adding the `x-ms-secret-store-id` HTTP header to the Playwright Workspaces remote MCP server configuration. Keep your existing URL and authentication settings when you add the header.

| Header | Value |
|---|---|
| `x-ms-secret-store-id` | The secret store ID that you copied. |

# [VS Code](#tab/vscode)

Add the secret store header to the remote MCP server entry in Visual Studio Code. The portal's **Install in GitHub Copilot** button doesn't add this header, so you add it yourself.

1. In Visual Studio Code, open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) and select **MCP: Open User Configuration**. If you added the server to a workspace, open `.vscode/mcp.json` instead.

1. Find the entry for your Playwright Workspaces remote MCP server. Add a `headers` property, or add to the existing one, with the header name and value that you copied. Keep the existing settings in the entry.

    ```json
    {
      "servers": {
        "playwright-workspaces": {
          "type": "http",
          "url": "https://<region>.mcp.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/mcp",
          "headers": {
            "x-ms-secret-store-id": "<secret-store-id>"
          }
        }
      }
    }
    ```

    Replace:

    - `<region>` with the Azure region of the workspace.
    - `<workspace-id>` with the workspace ID shown in the Azure portal.
    - `<secret-store-id>` with the header value that you copied.

1. Save the file. If Visual Studio Code doesn't restart the server, select **Restart** above the server entry.

# [GitHub Copilot app](#tab/github-copilot-app)

1. In GitHub Copilot app, select **Customize** in the sidebar, and then select the **Installed** tab.
1. Under **MCP Servers**, find the Playwright Workspaces server, for example `playwright-cloud-browsers-<workspace-name>`, open its **More options** menu, and select **Edit configuration**.
1. Under **Headers**, select **Add header**, and then enter the following values:

   - **Name**: `x-ms-secret-store-id`
   - **Value**: The secret store ID that you copied.

1. Select **Save**.

# [GitHub Copilot CLI](#tab/copilot-cli)

1. Open the MCP configuration file `~/.copilot/mcp-config.json`.
1. In the entry for the Playwright Workspaces remote MCP server, add the `x-ms-secret-store-id` header with your secret store ID. Keep your existing authentication settings.

   ```json
   {
     "mcpServers": {
       "playwright-workspaces": {
         "type": "http",
         "url": "<your-mcp-endpoint>",
         "headers": {
           "x-ms-secret-store-id": "<secret-store-id>"
         },
         "tools": ["*"]
       }
     }
   }
   ```

1. Save the file and restart GitHub Copilot CLI.

---
> [!NOTE]
> The secrets from the secret store are applied when a browser session is created and can't be changed while the session runs. If you change the header or edit the configuration, start a new browser session to use the change.

## Sign in to the website

Ask the agent to sign in. Refer to the credentials by their secret names, not by their values.

1. Enter a prompt like the following example:

   ```text
   Go to https://portal.contoso.com/login and sign in. Use the secret contoso-username for the username field and contoso-password for the password field. After you sign in, tell me the title of the page.
   ```

1. Check the result. The agent signs in and reports the page title. The agent's response and the conversation show only the secret names, never the secret values.

If the agent tries to use a secret on a page whose domain isn't allowed for that secret, Playwright Workspaces doesn't enter the value. If sign-in fails, check that the domain in the secret store matches the domain of the sign-in page.
> [!CAUTION]
> The secret store keeps secret values out of your code, the agent's responses, and the model context. After a value is entered into a page, scripts on that page and the browser's developer tools can read it. Only use secret stores with websites that you trust.

## Clean up resources

If you don't need the resources that you created in this article, delete them.

1. In your Playwright workspace, select **Settings** > **Secret stores**, select the secret store, and then select **Delete**.
1. If you no longer need the role assignment, remove the **Key Vault Secrets User** role assignment from the key vault.
1. If you no longer need the secrets, delete them from the key vault. Deleting a secret store doesn't delete the secrets in Key Vault.
