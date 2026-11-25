---
title: Route outbound traffic using browser proxies
titleSuffix: Playwright Workspaces
description: Learn about routing outbound traffic using browser proxies.
ms.topic: how-to
ms.date: 11/18/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
---

# Route browser traffic through your proxy with the remote MCP server

> [!IMPORTANT]
> Browser proxy in Playwright Workspaces is currently in preview. Preview features are provided without a service-level agreement and aren't recommended for production workloads. Features, limits, and availability can change. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

A browser proxy routes traffic from the cloud browser through a proxy server that you choose and operate. The path looks like this: **cloud browser → your proxy server → website**. The website sees the IP address of your proxy, not the address of the Playwright Workspaces browser. You decide which sites go through which proxy server by using proxy rules, and you keep proxy credentials in your own Azure Key Vault.

After you complete this quickstart, you have:

- Browser proxy turned on for your workspace.
- A proxy configuration with a rule for a specific site and a default rule for everything else.
- A GitHub Copilot agent in Visual Studio Code whose browser sessions use your proxy configuration.

## When to use a browser proxy

Use a browser proxy when the sites that your tests or agents visit expect traffic from a known network location. Common scenarios include:

| Scenario | How a browser proxy helps |
|---|---|
| **Sites protected by IP allow lists** | Staging, preprod, and partner environments often accept traffic only from approved IP addresses. Route traffic through a proxy with a static egress IP address, and give that one address to the site owner to allow. |
| **Corporate egress policy** | Your organization might require all browser traffic to leave through a corporate proxy for inspection, filtering, and auditing. Send cloud browser traffic through the same proxy that your employees use. |
| **AI agents that work with business apps** | An agent that processes invoices in an ERP system, updates records in a CRM, or reads an internal portal needs the same network access as a person doing the job. A proxy configuration gives the agent that access without changes to the agent or its prompts. |
| **Separate routes for each customer or app** | If you test or automate on behalf of several customers, each one might need traffic from its own approved proxy. Create one proxy configuration per customer, or use rules to send each app's traffic to its own proxy server. |
| **Location-specific content** | Use a proxy endpoint in a specific country or region to check content, pricing, or compliance banners that a site shows only to visitors from that location. |
| **Traffic logging and monitoring** | Your proxy can log the requests that the browser makes, so you can review what an agent or test accessed. |

> [!CAUTION]
> A browser proxy applies to traffic that the browser sends. It isn't a network security boundary by itself. If you need guaranteed control over egress traffic, combine browser proxy with private networking, firewall rules, or other network isolation controls for your workspace. For more information, see [Access privately hosted websites](./private-website-access.md).

You're responsible for the proxy server: choosing a provider, keeping it available, providing stable egress IP addresses, and maintaining allow lists with site owners. Playwright Workspaces applies your proxy configuration to the browser, evaluates your routing rules, and reads proxy credentials from Key Vault when a session starts.

## Prerequisites

Before you begin, ensure you have the following items:

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/).
- A Playwright workspace. 
- The **Contributor** role on the Playwright workspace.
- A proxy server that you run or buy from a provider. The server URL must use HTTP, HTTPS, SOCKS4, or SOCKS5.
- A current version of [Visual Studio Code](https://code.visualstudio.com/) with GitHub Copilot access and MCP support turned on.
- The Playwright Workspaces remote MCP server added to Visual Studio Code. To add it, see [Quickstart: Automate browser tasks with the remote MCP server](../quickstart-automate-browser-tasks-remote-mcp.md).
- If your proxy server requires a username and password:
  - An Azure Key Vault that stores the proxy username and the proxy password as two secrets.
  - A managed identity (system-assigned or user-assigned) on the workspace with the **Key Vault Secrets User** role on the key vault.

## Turn on browser proxy for your workspace

You can turn on the browser proxy on the **Capabilities** tab when you create a workspace. For an existing workspace, turn it on from the workspace settings:

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to your Playwright workspace.

1. In the left menu, select **Settings** > **Capabilities**.

1. Under **Workspace capabilities**, turn on **Browser proxy**.

1. Select **Apply**.

:::image type="content" source="./media/enable-browser-proxy-capability.png" alt-text="Screenshot that shows the Capabilities page of a Playwright workspace in the Azure portal with the Browser proxy toggle turned on." lightbox="./media/enable-browser-proxy-capability.png":::

> [!NOTE]
> Turning on browser proxy doesn't send any traffic through a proxy by itself. It allows browser sessions in the workspace to use proxy configurations. A browser session uses a proxy only when the client passes a proxy configuration ID. Sessions without one use the workspace's normal network path.

## Understand how proxy rules route traffic

A proxy configuration contains a **Proxy bypass** list and one or more proxy rules. Each rule has a **Priority**, a proxy **Server**, and one or more URL **Patterns**. Every configuration also has a **Default - proxy** rule that has the lowest priority and no pattern.

For each request that the browser makes, Playwright Workspaces checks the configuration in this order:

1. **Proxy bypass.** If the URL matches an entry in the bypass list, the request goes directly to the site without a proxy.
1. **Proxy rules, by priority.** Rules are checked from the lowest **Priority** number (highest priority) to the highest:
    1. If the URL matches a pattern of the rule with priority 1, the request uses that rule's proxy server.
    1. If not, the URL is checked against the rule with the next priority, and so on.
    1. The first rule that matches wins. Later rules aren't checked.
1. **Default proxy.** If no rule matches, the request uses the server of the **Default - proxy** rule.

The following example shows how a configuration routes requests:

| Configuration | Value |
|---|---|
| Proxy bypass | `*.contoso.net` |
| Rule 1: `InternalApp` | Server `https://proxyserver.contoso.com`, pattern `*.internal.contoso.com` |
| Rule 2: `Default - proxy` | Server `https://proxyserver2.contoso.com` |

| Request URL | Result |
|---|---|
| `https://docs.contoso.net/help` | Matches the bypass list. Goes directly to the site. |
| `https://erp.internal.contoso.com/invoices` | Matches rule 1. Goes through `proxyserver.contoso.com`. |
| `https://www.fabrikam.com` | Matches no rule. Goes through the default proxy, `proxyserver2.contoso.com`. |

> [!TIP]
> Put specific patterns at a lower priority number than broad ones. For example, if one rule matches `*.internal.contoso.com` and another matches `*.contoso.com`, give the `*.internal.contoso.com` rule priority 1. Otherwise, the broader rule matches first. Also make sure that your bypass list doesn't include hosts that you want to proxy, because bypass is checked before any rule.

## Create a proxy configuration

1. In your Playwright workspace, select **Settings** > **Proxy configurations**.

1. Select **Create proxy config**.

    :::image type="content" source="./media/proxy-configurations-list.png" alt-text="Screenshot that shows the Proxy configurations page in the Azure portal with the Create proxy config button and a list of configurations with their proxy IDs." lightbox="./media/proxy-configurations-list.png":::

1. Enter the following values:

    | Field | Description |
    |---|---|
    | **Name** | A unique name for the configuration, such as *SampleCorpProxy*. |
    | **Description** | Optional. Describe what the configuration is for, such as *Proxy for internal apps*. |
    | **Proxy Bypass** | Optional. Hosts that always skip the proxy, such as `*.contoso.net`. Separate entries with a comma, or press <kbd>Enter</kbd> after each one. |
    | **Authentication** | Turn on if your proxy server requires a username and password. Leave it off if the proxy doesn't require sign-in. |
    | **Identity type** | Appears when **Authentication** is on. Select **System assigned identity** or **User assigned identity**. This managed identity reads the proxy credentials from Key Vault. |

1. Under **Proxy rule**, enter the server for the **Default - proxy** rule. This rule handles every request that doesn't match the bypass list or another rule.

1. Select **Add proxy rule** to add a rule for a specific site, and enter the following values:

    | Field | Description | Example |
    |---|---|---|
    | **Priority** | The order in which rules are checked. A lower number means a higher priority. You can also drag rules to reorder them. | `1` |
    | **Proxy rule name** | A name for the rule. | `InternalApp` |
    | **Server** | The proxy server URL, including the scheme. Use `http://`, `https://`, `socks4://`, or `socks5://`. | `https://proxyserver.contoso.com` |
    | **Username secret URI** | When **Authentication** is on, the Key Vault secret URI that holds the proxy username. | `https://proxyakv.vault.azure.net/secrets/proxy-username` |
    | **Password secret URI** | When **Authentication** is on, the Key Vault secret URI that holds the proxy password. | `https://proxyakv.vault.azure.net/secrets/proxy-password` |
    | **Pattern** | The URLs that use this rule. Use a host wildcard, such as `*.internal.contoso.com`, or a full URL with a path. Separate multiple patterns with a comma, or press <kbd>Enter</kbd> after each one. | `*.internal.contoso.com` |

    :::image type="content" source="./media/create-proxy-config.png" alt-text="Screenshot that shows the Create proxy config pane with a name, description, proxy bypass entries, authentication turned on with a system-assigned identity, and two proxy rules: InternalApp at priority 1 and the default proxy at priority 2." lightbox="./media/create-proxy-config.png":::

1. Select **Review + Create**. Playwright Workspaces checks that the configuration is valid. If **Authentication** is on, it also checks that the managed identity has permission to read each Key Vault secret URI. Fix any errors, and then create the configuration. 

> [!CAUTION]
> Store proxy credentials only in Azure Key Vault. Playwright Workspaces saves the secret URIs, not the username or password, and reads the values when a browser session starts. Proxy credentials don't appear in logs, errors, or API responses.

## Copy the proxy configuration header

1. On **Proxy configurations**, select the name of the configuration that you created.

1. In **View Proxy configuration**, expand **Tool usage**. It shows the **Header name** and **Header value** to add to your MCP client.

1. Use the copy buttons to copy both values. You use them in the next section.

:::image type="content" source="./media/view-proxy-configuration-tool-usage.png" alt-text="Screenshot that shows the View Proxy configuration pane with the Tool usage section expanded, showing the header name and header value with copy buttons." lightbox="./media/view-proxy-configuration-tool-usage.png":::

The header value is the configuration's ID. It's also shown in the **Proxy-ID** column on **Proxy configurations**.

Pass the proxy configuration ID to your agent client by adding the `x-ms-proxy-config-id` HTTP header to the Playwright Workspaces remote MCP server configuration. Keep your existing URL and authentication settings when you add the header.

| Header | Value |
|---|---|
| `x-ms-proxy-config-id` | The proxy configuration ID that you copied. |

## Connect GitHub Copilot to the proxy configuration

Add the proxy header to the remote MCP server entry in Visual Studio Code. The portal's **Install in GitHub Copilot** button doesn't add this header, so you need to add it yourself.

1. In Visual Studio Code, open the Command Palette (<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>P</kbd>) and select **MCP: Open User Configuration**. If you added the server to a workspace, open `.vscode/mcp.json` instead.

1. Find the entry for your Playwright Workspaces remote MCP server. Add a `headers` property, or add to the existing one, with the header name and value that you copied. Keep the existing settings in the entry.

    ```json
    {
      "servers": {
        "playwright-workspaces": {
          "type": "http",
          "url": "https://<region>.mcp.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/mcp",
          "headers": {
            "x-ms-proxy-config-id": "<proxy-configuration-id>"
          }
        }
      }
    }
    ```

    Replace:

    - `<region>` with the Azure region of the workspace.
    - `<workspace-id>` with the workspace ID shown in the Azure portal.
    - `<proxy-configuration-id>` with the header value that you copied.

1. Save the file. If Visual Studio Code doesn't restart the server, select **Restart** above the server entry.

# [GitHub Copilot app](#tab/github-copilot-app)

1. In GitHub Copilot app, select **Customize** in the sidebar, and then select the **Installed** tab.
1. Under **MCP Servers**, find the Playwright Workspaces server, for example `playwright-cloud-browsers-<workspace-name>`, open its **More options** menu, and select **Edit configuration**.
1. Under **Headers**, select **Add header**, and then enter the following values:

   - **Name**: `x-ms-proxy-config-id`
   - **Value**: The proxy configuration ID that you copied.

1. Select **Save**.

# [GitHub Copilot CLI](#tab/copilot-cli)

1. Open the MCP configuration file `~/.copilot/mcp-config.json`.
1. In the entry for the Playwright Workspaces remote MCP server, add the `x-ms-proxy-config-id` header with your proxy configuration ID. Keep your existing authentication settings.

   ```json
   {
     "mcpServers": {
       "playwright-workspaces": {
         "type": "http",
         "url": "<your-mcp-endpoint>",
         "headers": {
           "x-ms-proxy-config-id": "<proxy-config-id>"
         },
         "tools": ["*"]
       }
     }
   }
   ```

1. Save the file and restart GitHub Copilot CLI.

---

> [!NOTE]
> The proxy configuration is applied when a browser session is created and can't be changed while the session runs. If you change the header or edit the configuration, start a new browser session to use the change.

## Run a browser task through the proxy

1. In Visual Studio Code, open the GitHub Copilot Chat view and select **Agent** mode.

1. Make sure the Playwright Workspaces tools are selected in the tools list.

1. Enter a prompt for a site that matches one of your proxy rules. For example:

    ```text
    Open https://erp.internal.contoso.com, take a screenshot of the home page, and then close the browser session.
    ```

1. Approve the tool calls when GitHub Copilot asks.

The agent calls `create_browser_session`, `browser_navigate`, `browser_take_screenshot`, and `close_browser_session`. Because `erp.internal.contoso.com` matches the `*.internal.contoso.com` pattern, the browser loads the page through the `InternalApp` proxy server, and the agent returns the screenshot.

## Edit, duplicate, or delete a proxy configuration

On the **Proxy configurations** page, select the **More actions** (**...**) menu at the end of a configuration's row, and then select one of these actions:

| Action | What it does |
|---|---|
| **Edit** | Change the description, bypass list, authentication settings, or proxy rules. Changes apply to browser sessions that start after you save. Sessions that are already running keep the earlier settings. You can also select **Edit** in the **View Proxy configuration** pane. |
| **Duplicate** | Create a copy of the configuration with `-copy` added to its name and a new proxy ID. Use it to start a new configuration from an existing one, for example a separate configuration for another customer. |
| **Delete** | Remove the configuration. Before you delete it, remove its header from every MCP client that uses it. If a client still sends the ID of a deleted configuration, new browser sessions from that client fail. |

:::image type="content" source="./media/proxy-configuration-actions.png" alt-text="Screenshot that shows the More actions menu for a proxy configuration with the Edit, Duplicate, and Delete options." lightbox="./media/proxy-configuration-actions.png":::

## Clean up resources

If you don't need the proxy configuration anymore:

1. Remove the proxy header from the MCP server entry in Visual Studio Code.

1. In the Azure portal, go to **Settings** > **Proxy configurations**, select the **More actions** (**...**) menu for the configuration, and then select **Delete**.

1. If you created Key Vault secrets only for this quickstart, delete them from the key vault.

To stop all use of browser proxies in the workspace, go to **Settings** > **Capabilities**, turn off **Browser proxy**, and then select **Apply**. Your proxy configurations are kept, so you can turn the capability back on later.

