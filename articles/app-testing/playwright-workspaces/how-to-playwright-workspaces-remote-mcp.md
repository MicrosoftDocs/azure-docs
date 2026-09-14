---
title: Automate browsers with the Playwright Workspaces remote MCP server
titleSuffix: Playwright Workspaces
description: Learn to automate browsers with the Playwright Workspaces remote MCP server to manage, secure, and build reliable browser automation workflows.
ms.topic: how-to
ms.date: 09/11/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
---

# Automate browsers with the Playwright Workspaces remote MCP server

> [!IMPORTANT]
> The Playwright Workspaces remote Model Context Protocol (MCP) server is in preview. Preview features don't have a service-level agreement and aren't recommended for production workloads. Features, limits, and availability can change.

The Playwright Workspaces remote MCP server gives AI agents a managed remote browser and a set of browser automation tools. An agent can open a browser session, navigate pages, find and interact with elements, inspect browser activity, take screenshots, and close the session. You don't need to install Playwright or a browser in the agent environment.

The server uses [Model Context Protocol](https://modelcontextprotocol.io/) over Streamable HTTP. It works with MCP clients that support remote HTTP servers and custom authentication headers, including Microsoft Foundry Agent Service and Visual Studio Code.

In this article, you learn how to:
- Build the MCP endpoint for a Playwright workspace.
- Connect the server to Microsoft Foundry Agent Service or Visual Studio Code.
- Run complete agentic browser automation flows.
- Select and safely use the available browser tools.

## Prerequisites

Before you begin, make sure you have:
- An Azure account with an active subscription.
- The workspace ID and Azure region of the workspace.
- A workspace access token whose owner has permission to create and use browser sessions.
- For Microsoft Foundry, a Foundry project and permission to create project connections and configure agents.
- For Visual Studio Code, a current version of Visual Studio Code with GitHub Copilot access and MCP support enabled.

> [!CAUTION] 
> Microsoft Entra ID is the recommended authentication method for Playwright Workspaces. This preview article uses workspace access-token authentication for clients that need a custom header. Access tokens are less secure and are disabled by default. Treat an access token like a password. Never commit it to source control, include it in a prompt, or write it to logs.

To create a workspace access token see [Manage workspace access tokens](./how-to-manage-access-tokens.md).

## Build the remote MCP endpoint

The endpoint is scoped to one workspace and region:

```
https://<region>.mcp.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/mcp
```

Replace:
- "region" with the Azure region of the workspace.
- "workspace-id" with the workspace ID shown in the Azure portal.

For example:

```
https://eastus.mcp.playwright.microsoft.com/playwrightworkspaces/00000000-0000-0000-0000-000000000000/mcp
```

The value in the x-api-key request header must be an access token created for the same workspace as "workspace-id". Use the endpoint for the workspace's region, not the region nearest to the MCP client.

## Understand the browser session lifecycle

A browser automation flow has three stages:
1. Call `create_browser_session`. The result contains an opaque `browserSessionId` and might contain a live-view URL.
2. Pass that `browserSessionId` to every browser tool used in the flow.
3. Call `close_browser_session` in a cleanup step, even when the flow fails.

The MCP HTTP transport doesn't preserve browser state. The `browserSessionId` identifies the remote browser across separate tool calls. Keep it private and use it only with the workspace and identity that created it.

Current preview behavior includes these constraints:
- A session belongs to its creator and can't be shared with another principal.
- Calls for one session are processed in order. Don't issue concurrent actions against the same session.
- An inactive session is cleaned up after 15 minutes if explicitly not closed. 
- A closed or expired session can't be reopened.
- Connection loss is terminal for the session. Create a new session to continue.
- A result might contain a `liveViewUrl`. Availability of live view depends on the session.

## Connect from Microsoft Foundry Agent Service

Use a Foundry project connection to store the access token. Don't place the token in agent instructions or application code.

### Create the project connection

1.	Open your project in the [Microsoft Foundry portal](https://ai.azure.com/).
2.	Open the project's management experience, and then select **Connected resources**.
3.	Create a connection of type **Custom keys**.
4.	Enter a descriptive connection name, such as `playwright-mcp-connection`.
5.	Add a key named `x-api-key` and set its value to the Playwright workspace access token.
6.	Save the connection.

### Add the remote MCP tool

1. Create or open an agent in the Foundry portal.
2. Add a remote MCP server or MCP tool.
3. Use the following settings:

    | Setting   | Value |
    |---|---|
    | Server label  | A unique label, such as playwrightWorkspace   |
    | Server URL    | The workspace-scoped remote MCP endpoint  |
    | Project connection    | The custom-keys connection created previously |
    | Approval  | Require approval for every call while evaluating the integration |
    | Allowed tools | Start with only the tools needed for the flow |

4. Save the agent configuration.
5. In the agent instructions, require the agent to create one session, reuse its browserSessionId, and close the session when the task finishes.

A minimal tool allow list for a read-oriented navigation flow is:
- create_browser_session
- browser_navigate
- browser_snapshot
- browser_find
- browser_take_screenshot
- close_browser_session

Add interaction tools such as browser_click or browser_type only when the scenario requires them. Don't enable browser_evaluate or browser_run_code by default.

For current Foundry connection fields, approval handling, SDK examples, and client limits, see [Connect agents to MCP server endpoints](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/model-context-protocol).

> [!NOTE] 
> Foundry nonstreaming MCP tool calls currently have a 100-second client timeout. Some Playwright operations have a longer service-side timeout. Keep Foundry operations focused and split long workflows into multiple tool calls.

## Design an agentic automation flow

Use an observe-act-verify loop instead of asking the agent to perform a long sequence without checking page state.
1. **Create:** Call `create_browser_session` and retain its `browserSessionId`.
2. **Navigate:** Call `browser_navigate` with an explicit, approved URL.
3. **Observe:** Call `browser_find` for a focused search or `browser_snapshot` for a broader accessibility view.
4. **Act:** Use a snapshot reference or unique selector with an interaction tool.
5. **Wait:** Call `browser_wait_for` for expected text, disappearing text, or a bounded delay.
6. **Verify:** Capture another snapshot or inspect console and network activity.
7. **Handle branches:** Handle a dialog, switch tabs, or upload files only when page state requires it.
8. **Capture evidence:** Call `browser_take_screenshot` if a visual result is useful. Don't use screenshots to select action targets.
9. **Clean up:** Call `close_browser_session` in a finally-style cleanup path.

## Choose stable action targets

Prefer references returned by `browser_snapshot` or `browser_find`. They describe accessible page elements and reduce dependence on implementation-specific markup. Use a unique selector when a stable snapshot reference isn't available.

Refresh the snapshot after navigation or after a page-changing action. A previously returned target can become stale when the page re-renders.

## Handle dialogs safely

An action can return a `dialog-opened` outcome after it already changed page state. This outcome isn't a normal action failure.
1. Don't repeat the original action.
2. Call `browser_handle_dialog` with `accept` set to `true` or `false`.
3. For a prompt dialog, include `promptText` only when accepting it.
4. Observe the page again before continuing.

## Handle ambiguous failures
A timeout or disconnected caller doesn't prove that an action had no effect. Before retrying a non-idempotent operation such as a click, form submission, upload, or code execution:
1. Call `browser_snapshot`, `browser_find`, or another observation tool if the session is still available.
2. Determine whether the expected state change occurred.
3. Retry only if repeating the action is safe.
4. If the session expired, create a new session and restart from a known application state.

## Tool reference

All browser-scoped tools require `browserSessionId`. String and collection bounds shown here are current preview limits.

### Session tools

| Tool | Parameters | Use |
|---|---|---|
| `create_browser_session` | None| Creates a remote browser and returns `browserSessionId` and an optional `liveViewUrl`. |
| `close_browser_session` | `browserSessionId` | Closes the remote browser session. Call it during cleanup. |

### Navigation and observation tools

| Tool | Parameters | Use and important behavior |
|---|---|---|
| `browser_navigate` | `browserSessionId`, `url` | Navigates to a URL. The URL can contain up to 16 KiB of characters. |
| `browser_navigate_back` | `browserSessionId` | Navigates to the previous entry in page history. |
| `browser_snapshot` | `browserSessionId`; optional `target`, `depth`, `boxes` | Returns an accessibility snapshot. The target accepts a snapshot reference or unique selector. Depth is 1-100. Boxes includes bounding-box data when supported. Snapshot text is truncated at 64 KiB and marked as truncated. |
| `browser_find` | `browserSessionId`, `text` | Performs a case-insensitive substring search of the accessibility snapshot and returns matching snippets. Text can contain up to 4,096 characters. |
| `browser_wait_for` | `browserSessionId`; exactly one of `text`, `textGone`, or `time` | Waits for text, waits for text to disappear, or waits for 0-180 seconds. |
| `browser_take_screenshot` | `browserSessionId`; optional `target`, `type`, `fullPage`, `scale` | Returns an inline PNG or JPEG. Type is png or jpeg. FullPage captures the full page instead of the default viewport. Scale is css or device. Use a snapshot, not the image, to choose targets. |
| `browser_console_messages` | `browserSessionId` | Returns bounded console messages captured for the active page. |
| `browser_network_requests` | `browserSessionId` | Returns bounded network-request information captured for the active page. |

### Interaction tools

| Tool | Parameters | Use and important behavior |
|---|---|---|
| `browser_click` | `browserSessionId`, `target`; optional `button`, `doubleClick`, `modifiers` | Clicks a target. Button is left, right, or middle. Accepts up to five modifiers from Alt, Control, ControlOrMeta, Meta, and Shift. Don't blindly retry a timed-out click. |
| `browser_type` | `browserSessionId`, `target`, `text`; optional `submit`, `slowly` | Enters text in an editable element. Submit presses Enter afterward. Slowly types sequentially. |
| `browser_fill_form` | `browserSessionId`, `fields` | Fills 1-50 fields. Each field contains target, a string or Boolean value, and optional name and type. A failure can leave earlier fields updated. |
| `browser_press_key` | `browserSessionId`, `key` | Presses a Playwright key descriptor such as Enter, ArrowLeft, or Control+C. |
| `browser_select_option` | `browserSessionId`, `target`, `values` | Selects 1-100 option values. Each value can contain up to 4,096 characters. |
| `browser_hover` | `browserSessionId`, `target` | Hovers over a target, which can reveal menus or tooltips. |
| `browser_handle_dialog` | `browserSessionId`, `accept`; optional `promptText` | Accepts or dismisses the currently blocking browser dialog. |
| `browser_drag` | `browserSessionId`, `startTarget`, `endTarget` | Drags from one target to another. Both targets must resolve on the active page. |

### Tabs, files, and code tools

| Tool | Parameters | Use and important behavior |
|---|---|---|
| `browser_tabs` | `browserSessionId`, `action`; optional `index`, `url` | Lists, creates, selects, or closes tabs. `action` is `list`, `new`, `select`, or `close`. `index` is required for `select`; for `close`, omission means the active tab. Indices are zero-based. |
| `browser_file_upload` | `browserSessionId`, `files`; optional `target` | Uploads 1-20 base64-encoded files through a target file input or pending file chooser. See File upload limits. |
| `browser_evaluate` | `browserSessionId`, `function`; optional `target` | Evaluates a JavaScript function in the page or against a target. It can read or change page state. |
| `browser_run_code` | `browserSessionId`, `code` | Runs a Playwright JavaScript function body with access to the page. This tool has the highest privilege and can produce arbitrary side effects. |

## Clean up

After every automation flow:

1. Call `close_browser_session` with the active `browserSessionId`.
2. Remove test agents or project connections that you don't need.
3. Revoke temporary workspace access tokens.
4. In Visual Studio Code, stop or remove the MCP server if you no longer require the connection.

Closing sessions promptly releases browser capacity and reduces the chance of unexpected activity or quota use.

## Related content

- [Manage workspace access tokens](./how-to-manage-access-tokens.md)
- [Manage access to a Playwright workspace](./how-to-manage-workspace-access.md)
- [Connect Microsoft Foundry agents to MCP server endpoints](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/model-context-protocol)
- [Add and manage MCP servers in Visual Studio Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [Model Context Protocol documentation](https://modelcontextprotocol.io/)
