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

The server uses [Model Context Protocol](https://modelcontextprotocol.io/) over Streamable HTTP. It supports Microsoft Entra ID authentication and workspace access tokens. It works with remote MCP clients including Microsoft Foundry Agent Service and Visual Studio Code.

In this article, you learn how to:
- Build the MCP endpoint for a Playwright workspace.
- Authenticate by using Microsoft Entra ID or a workspace access token.
- Connect the server to Microsoft Foundry Agent Service or Visual Studio Code.
- Run complete agentic browser automation flows.
- Select and safely use the available browser tools.
- Handle session expiration, timeouts, and other common errors.

## Prerequisites

Before you begin, make sure you have:
- An Azure account with an active subscription.
- A Playwright workspace that has access to the remote MCP preview.
- The workspace ID and Azure region of the workspace.
- An identity with permission to create and use browser sessions in the workspace.
- For Microsoft Foundry, a Foundry project and permission to create project connections and configure agents.
- For Visual Studio Code, a current version of Visual Studio Code with GitHub Copilot access and MCP support enabled.

## Choose an authentication method

Use Microsoft Entra ID when your MCP client supports OAuth or managed identity. The remote MCP server uses this resource identifier and delegated scope:

```text
Resource: https://mcp.playwright.microsoft.com
Scope: https://mcp.playwright.microsoft.com/Playwright.Mcp.Tools
```

The server publishes OAuth protected-resource metadata. Clients that support OAuth discovery, including Visual Studio Code, can discover the authorization server and required scope from the workspace-scoped MCP endpoint. The signed-in identity must have access to the Playwright workspace through Azure role-based access control (RBAC).

> [!WARNING]
> Use a workspace access token only when the MCP client can't authenticate with Microsoft Entra ID. Access tokens are less secure and are disabled by default.


## Create a workspace access token for compatibility

Skip this section when you use Microsoft Entra ID. If access-token authentication isn't already enabled for the workspace:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Open your Playwright workspace.
1. Under **Settings**, select **Access Management**.
1. Enable **Playwright Service Access Token**.
1. Select **Generate token**.
1. Enter a name and expiration date, and then generate the token.
1. Copy the token immediately. You can't retrieve its value later.

Store the token in a managed secret store or in the secure credential facility provided by your MCP client. Revoke and replace it if it might have been exposed. To create a workspace access token see [Manage workspace access tokens](./../playwright-workspaces/how-to-manage-access-tokens.md).

> [!CAUTION]
> Treat a workspace access token like a password. Never commit it to source control, include it in a prompt, or write it to logs.

## Build the remote MCP endpoint

The endpoint is scoped to one workspace and region:

```
https://<region>.mcp.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/mcp
```

Replace:
- `<region>` with the Azure region of the workspace.
- `<workspace-id>` with the workspace ID shown in the Azure portal.

For example:

```
https://eastus.mcp.playwright.microsoft.com/playwrightworkspaces/00000000-0000-0000-0000-000000000000/mcp
```

The value in the `x-api-key` request header must be an access token created for the same workspace as `<workspace-id>`. Use the endpoint for the workspace's region, not the region nearest to the MCP client.

## Understand the browser session lifecycle

A browser automation flow has three stages:
1. Call `create_browser_session`. The result contains an opaque `browserSessionId` and might contain a live-view URL.
2. Pass that `browserSessionId` to every browser tool used in the flow.
3. Call `close_browser_session` in a cleanup step, even when the flow fails.

The MCP HTTP transport doesn't preserve browser state. The `browserSessionId` identifies the remote browser across separate tool calls. Keep it private and use it only with the workspace and identity that created it.

Current preview behavior includes these constraints:
- A session belongs to its creator and can't be shared with another principal.
- Calls for one session are processed in order. Don't issue concurrent actions against the same session.
- An inactive session is cleaned up after 15 minutes. Explicit cleanup is required.
- A closed or expired session can't be reopened.
- Connection loss is terminal for the session. Create a new session to continue.
- A result might contain a `liveViewUrl`. Availability of live view depends on the session.

## Connect from Microsoft Foundry Agent Service

Use Microsoft Entra Agent Identity to authenticate the agent with the Foundry project's managed identity. Grant that identity access to the Playwright workspace before connecting the MCP tool.

### Create the project connection

1.	Open your project in the [Microsoft Foundry portal](https://ai.azure.com/).
2.	Open the project's management experience, and then select **Connected resources**.
3.  Create a connection for a remote MCP server.
4.  Enter a descriptive connection name, such as `playwright-mcp-connection`.
5.  Select **Microsoft Entra Agent Identity** as the authentication method.
6.  Enter `https://mcp.playwright.microsoft.com` as the audience.
7.  Save the connection.

The project's managed identity must have a role that permits browser-session operations on the target Playwright workspace. Don't use an identity token from one project as a shared secret in another project.

If Microsoft Entra Agent Identity isn't available for the client or environment, create a **Custom keys** connection with a key named `x-api-key` and a workspace access token as its value.

### Add the remote MCP tool

1. Create or open an agent in the Foundry portal.
1. Add a remote MCP server or MCP tool.
1. Use the following settings:

   | Setting | Value |
   |---|---|
   | Server label | A unique label, such as `playwrightWorkspace` |
   | Server URL | The workspace-scoped remote MCP endpoint |
  | Project connection | The Microsoft Entra Agent Identity connection created previously |
   | Approval | Require approval for every call while evaluating the integration |
   | Allowed tools | Start with only the tools needed for the flow |

4. Save the agent configuration.
5. In the agent instructions, require the agent to create one session, reuse its `browserSessionId`, and close the session when the task finishes.

A minimal tool allow list for a read-oriented navigation flow is:

```
create_browser_session
browser_navigate
browser_snapshot
browser_find
browser_take_screenshot
close_browser_session
```

Add interaction tools such as `browser_click` or `browser_type` only when the scenario requires them. Don't enable `browser_evaluate` or `browser_run_code` by default.

### Test the Foundry flow

Use a prompt that states the goal and the cleanup requirement. For example:

```text
Create a browser session, open https://example.com, inspect the page snapshot,
report the main heading and destination URL, and close the browser session.
Always close the session, including when a browser step fails.
```

When the agent requests approval:

1. Verify that the server label is the configured Playwright server.
1. Review the tool name and all arguments, especially URLs, selectors, text, uploaded data, and code.
1. Approve only the expected operation.
1. Verify that the final response is based on the page result.
1. Confirm that the flow called `close_browser_session`.

For current Foundry connection fields, approval handling, SDK examples, and client limits, see [Connect agents to MCP server endpoints](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/model-context-protocol).

> [!NOTE] 
> Foundry nonstreaming MCP tool calls currently have a 100-second client timeout. Some Playwright operations have a longer service-side timeout. Keep Foundry operations focused and split long workflows into multiple tool calls.

## Connect from Visual Studio Code

Visual Studio Code can discover the remote server's OAuth configuration and sign you in with Microsoft Entra ID. The configuration needs only the workspace-scoped endpoint.

1. In Visual Studio Code, run **MCP: Open User Configuration** from the Command Palette.
2. Add the following configuration, and replace the endpoint placeholders.

```json
{
  "servers": {
    "playwrightWorkspace": {
      "type": "http",
      "url": "https://<region>.mcp.playwright.microsoft.com/playwrightworkspaces/<workspace-id>/mcp"
    }
  }
}
```

3. Start the server from the configuration editor or run **MCP: List Servers**.
4. When prompted, sign in with the Microsoft Entra account that has access to the Playwright workspace.
5. Approve the requested `Playwright.Mcp.Tools` permission if consent is required for your tenant.
6. Review the server URL and configuration, and then confirm that you trust the server.
7. Open Chat and select **Configure Tools**. Enable only the Playwright tools needed for the task.
8. Run the example prompt from the preceding Foundry section.
9. Review tool confirmations and verify that the session is closed at the end.

Use a user configuration when the connection is personal. A workspace configuration containing only the endpoint can be shared. Visual Studio Code caches the OAuth credentials securely and can reuse them when reconnecting.

If Microsoft Entra authentication isn't available in the client environment, configure an `x-api-key` header with a protected input as described in [MCP configuration inputs](https://code.visualstudio.com/docs/agents/reference/mcp-configuration#_input-variables). Never put the workspace access-token value directly in `mcp.json`.

For configuration locations, secret inputs, server trust, and diagnostics, see [Add and manage MCP servers in Visual Studio Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers) and the [MCP configuration reference](https://code.visualstudio.com/docs/agents/reference/mcp-configuration).

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

### Choose stable action targets

Prefer references returned by `browser_snapshot` or `browser_find`. They describe accessible page elements and reduce dependence on implementation-specific markup. Use a unique selector when a stable snapshot reference isn't available.

Refresh the snapshot after navigation or after a page-changing action. A previously returned target can become stale when the page rerenders.

### Handle dialogs safely

An action can return a `dialog-opened` outcome after it already changed page state. This outcome isn't a normal action failure.
1. Don't repeat the original action.
2. Call `browser_handle_dialog` with `accept` set to `true` or `false`.
3. For a prompt dialog, include `promptText` only when accepting it.
4. Observe the page again before continuing.

### Handle ambiguous failures
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
| `browser_snapshot` | `browserSessionId`; optional `target`, `depth`, `boxes` | Returns an accessibility snapshot. The `target` accepts a snapshot reference or unique selector. `Depth` is 1-100. `Boxes` includes bounding-box data when supported. Snapshot text is truncated at 64 KiB and marked as truncated. |
| `browser_find` | `browserSessionId`, `text` | Performs a case-insensitive substring search of the accessibility snapshot and returns matching snippets. `Text` can contain up to 4,096 characters. |
| `browser_wait_for` | `browserSessionId`; exactly one of `text`, `textGone`, or `time` | Waits for text, waits for text to disappear, or waits for 0-180 seconds. |
| `browser_take_screenshot` | `browserSessionId`; optional `target`, `type`, `fullPage`, `scale` | Returns an inline PNG or JPEG. `Type` is `png` or `jpeg`. `FullPage` captures the full page instead of the default viewport. `Scale` is `css` or `device`. Use a snapshot, not the image, to choose targets. |
| `browser_console_messages` | `browserSessionId` | Returns bounded console messages captured for the active page. |
| `browser_network_requests` | `browserSessionId` | Returns bounded network-request information captured for the active page. |

### Interaction tools

| Tool | Parameters | Use and important behavior |
|---|---|---|
| `browser_click` | `browserSessionId`, `target`; optional `button`, `doubleClick`, `modifiers` | Clicks a target. `Button` is `left`, `right`, or `middle`. Accepts up to five modifiers from `Alt`, `Control`, `ControlOrMeta`, `Meta`, and `Shift`. Don't blindly retry a timed-out click. |
| `browser_type` | `browserSessionId`, `target`, `text`; optional `submit`, `slowly` | Enters text in an editable element. `Submit` presses Enter afterward. `Slowly` types sequentially. |
| `browser_fill_form` | `browserSessionId`, `fields` | Fills 1-50 fields. Each field contains `target`, a string or Boolean `value`, and optional `name` and `type`. A failure can leave earlier fields updated. |
| `browser_press_key` | `browserSessionId`, `key` | Presses a Playwright key descriptor such as `Enter`, `ArrowLeft`, or `Control+C`. |
| `browser_select_option` | `browserSessionId`, `target`, `values` | Selects 1-100 option values. Each value can contain up to 4,096 characters. |
| `browser_hover` | `browserSessionId`, `target` | Hovers over a target, which can reveal menus or tooltips. |
| `browser_handle_dialog` | `browserSessionId`, `accept`; optional `promptText` | Accepts or dismisses the currently blocking browser dialog. |
| `browser_drag` | `browserSessionId`, `startTarget`, `endTarget` | Drags from one target to another. Both targets must resolve on the active page. |

### Tabs, files, and code tools

| Tool | Parameters | Use and important behavior |
|---|---|---|
| `browser_tabs` | `browserSessionId`, `action`; optional `index`, `url` | Lists, creates, selects, or closes tabs. `action` is `list`, `new`, `select`, or `close`. `index` is required for `select`; for `close`, omission means the active tab. Indices are zero-based. |
| `browser_file_upload` | `browserSessionId`, `files`; optional `target` | Uploads 1-20 base64-encoded files through a target file input or pending file chooser. See [File upload limits](#file-upload-limits). |
| `browser_evaluate` | `browserSessionId`, `function`; optional `target` | Evaluates a JavaScript function in the page or against a target. It can read or change page state. |
| `browser_run_code` | `browserSessionId`, `code` | Runs a Playwright JavaScript function body with access to the page. This tool has the highest privilege and can produce arbitrary side effects. |

After every automation workflow, call the `close_browser_session` with the active `browserSessionId`.

### Form field shape

Each `browser_fill_form` field has this shape:

```json
{
  "target": "<snapshot-reference-or-selector>",
  "value": "<string-or-boolean>",
  "name": "<optional-display-name>",
  "type": "<optional-field-type>"
}
```

The string value for a field can contain at most 100 KiB of characters. `name` can contain at most 1,024 characters, and `type` can contain at most 128 characters.

### File upload shape

Each `browser_file_upload` file uses this shape:

```json
{
  "name": "example.txt",
  "data": "SGVsbG8sIHdvcmxkIQ==",
  "mimeType": "text/plain"
}
```

`mimeType` is optional and defaults to `application/octet-stream`.

#### File upload limits

- 1 to 20 files per tool call.
- 10 MiB maximum decoded size for each file.
- 50 MiB maximum combined decoded size.
- 4,096-character maximum file name.
- 1,024-character maximum MIME type.
- Valid base64 data is required.

### JavaScript tool shapes

For `browser_evaluate`, pass a function expression:

```javascript
() => document.title
```

When you provide `target`, the function receives the matching element:

```javascript
element => element.textContent
```

For `browser_run_code`, pass statements that form the body of an asynchronous function whose `page` parameter is a Playwright page. Return only JSON-serializable data and keep it within the inline response limit.

> [!WARNING]
> `browser_evaluate` and `browser_run_code` can expose page data, change application state, and make network requests. `browser_run_code` is equivalent to arbitrary code execution within the isolated browser environment. Disable these tools unless a reviewed scenario requires them. Never pass secrets through code or return sensitive page data to an untrusted model.

## Limits and current behavior

| Limit | Current value | Recommended action |
|---|---:|---|
| Inactive browser session | 15 minutes | Close sessions explicitly and create a new session after expiration. |
| Requested wait | 180 seconds | Prefer state-based waits over fixed delays. |
| Service command timeout | 3 minutes 30 seconds | Observe page state before retrying an action. Client timeouts can be shorter. |
| Inline response | 1 MiB | Return or request only the data needed for the next step. |
| Accessibility snapshot text | 64 KiB | Use `browser_find`, a target subtree, or a smaller depth when output is truncated. |
| Inline screenshot base64 data | 768 KiB | Use JPEG, viewport capture, or an element target if a screenshot is too large. |
| URL parameter | 16 KiB characters | Use a valid absolute destination URL. |
| Target or selector | 4,096 characters | Prefer concise snapshot references or unique selectors. |
| JavaScript function or code | 1 MiB characters | Keep code small, reviewed, and narrowly scoped. |
| Browser session ID | 256 characters | Pass the value returned by `create_browser_session` unchanged. |

Responses are returned inline. This preview doesn't expose MCP resources or persistent artifact storage for large snapshots, screenshots, or downloads. Browser, operating-system, viewport, locale, and user-agent overrides aren't exposed as session-creation parameters.

## Error handling

A tool error includes a stable error code, a customer-safe message, a `retryable` value, and correlation information. Use the returned `retryable` value as the primary signal, together with the operation's side effects.

| Error code | Meaning | Action |
|---|---|---|
| `Unauthorized` | The access token is missing, invalid, expired, disabled, or for another workspace. | Verify `x-api-key`, workspace access-token enablement, token expiration, and endpoint workspace ID. Don't retry with the same invalid credential. |
| `Forbidden` | The token owner lacks permission, or the caller doesn't own the session. | Verify workspace access and use the same credential throughout the session. |
| `SessionNotFound` | The session doesn't exist. | Create a new session. |
| `SessionClosed` | The session was closed. | Create a new session if more work is required. |
| `SessionExpired` | The session or its browser connection is no longer available. | Create a new session and restart from a known state. |
| `BrowserUnavailable` | Browser capacity or the remote browser is temporarily unavailable. | Retry session creation after a delay if `retryable` is true. |
| `DependencyUnavailable` | A required service is temporarily unavailable. | Retry with exponential backoff if `retryable` is true. |
| `InvalidArgument` | A parameter is missing, malformed, mutually incompatible, or outside its bounds. | Correct the arguments. Don't retry unchanged. |
| `UnsupportedOperation` | The requested operation isn't supported. | Use a supported tool or argument value. |
| `OutputTooLarge` | The result exceeds the inline response limit. | Request a smaller snapshot or result. For screenshots, use JPEG or a smaller target. |
| `ToolTimeout` | The operation exceeded its service deadline. | If the session remains available, observe the page before deciding whether to retry. |
| `NavigationFailed` | Navigation couldn't complete. | Verify the URL, network accessibility, and page behavior. Observe the current page before retrying. |
| `ElementNotFound` | The target didn't match an element. | Refresh the snapshot and use a current reference or unique selector. |
| `ActionFailed` | The page rejected or couldn't complete an action. | Inspect page state. The element might be hidden, disabled, detached, or blocked by a dialog. |
| `Busy` | The browser is completing another operation or draining a prior response. | Wait briefly and retry only when repeating the operation is safe. |
| `QuotaExceeded` | The workspace or account reached a browser-session quota. | Close unused sessions and review the workspace quota. |
| `RateLimited` | Requests are arriving too quickly. | Use exponential backoff and reduce concurrency. |
| `InternalError` | The service encountered an unexpected error. | Retry only when indicated. Include the correlation ID when contacting support. |

## Troubleshoot common problems

### The MCP client reports Unauthorized

- Confirm that access-token authentication is enabled for the workspace.
- Confirm that the token isn't expired or revoked.
- Use the raw token value as the `x-api-key` value. Don't add a `Bearer` prefix.
- Confirm that the token and endpoint belong to the same workspace.
- If you copied a secret incorrectly, create a new token because you can't retrieve existing values from the portal.

### The MCP client reports Forbidden

- Confirm that the user associated with the token still has permission to create browser sessions.
- Use the same project connection or token for all calls in one browser session.
- Don't pass a `browserSessionId` between users, agents that use different credentials, or workspaces.

### Tools aren't discovered

- Verify the full endpoint, including `/playwrightworkspaces/<workspace-id>/mcp`.
- Verify that the endpoint region matches the workspace region.
- Confirm that the client uses an HTTP MCP transport and sends `x-api-key` during discovery and tool calls.
- In Visual Studio Code, run **MCP: List Servers**, select the server, and then select **Show Output**.
- Restart the MCP connection or reset cached tools after changing the endpoint.

### The agent doesn't call a browser tool

- Tell the agent explicitly to use the configured Playwright MCP server.
- Verify that the required tool appears in the client's enabled or allowed tool list.
- Include the create-use-close lifecycle in the agent instructions.
- Use a focused first task with one navigation target and one expected result.

### A target no longer works

The page might have navigated or rerendered. Call `browser_snapshot` or `browser_find` again and use a current reference. Avoid selectors tied to generated classes or changing document structure.

### A tool timed out

Don't assume that the action failed without changing state. If the session is active, inspect the current page before retrying. If the session expired, create a new session and return the application to a known state.

### A screenshot is too large

Use `type: "jpeg"`, capture only the viewport, or provide a target for an element-level screenshot. Use `browser_snapshot` when the goal is to identify an element rather than preserve visual evidence.

### The session expired during a flow

Create a new browser session. Sessions don't reconnect after browser connection loss, service-owner loss, explicit close, or idle cleanup. Design the flow so it can restart from a known URL and application state.

## Security recommendations

- Allow only the tools required by the agent's task.
- Require human approval for state-changing, file, and code tools.
- Treat page content, accessibility snapshots, console output, and network output as untrusted. A page can contain prompt-injection instructions.
- Keep system instructions separate from page-derived text. Don't let page content change security policy or approval rules.
- Validate destination URLs against an allow list when automating sensitive applications.
- Review text, selectors, file contents, and code before approving a tool call.
- Don't use access tokens in prompts, source files, screenshots, uploaded files, or JavaScript snippets.
- Use short-lived tokens, rotate them regularly, and revoke unused connections.
- Use a dedicated workspace and least-privilege identity for each trust boundary.
- Log approvals and tool names for auditing, but don't log credentials, uploaded contents, or sensitive page data.

## Regional availability

Playwright Workspaces is available across the following Azure regions:

| Region | Available |
|---|---|
| Australia East | ✅ Yes |
| East Asia | ✅ Yes |
| East US | ✅ Yes |
| Japan East | ✅ Yes |
| Switzerland North | ✅ Yes |
| West Europe | ✅ Yes |
| West US 3 | ✅ Yes |

## Related content

- [Manage workspace access tokens](./../playwright-workspaces/how-to-manage-access-tokens.md)
- [Manage access to a Playwright workspace](./../playwright-workspaces/how-to-manage-workspace-access.md)
- [Connect Microsoft Foundry agents to MCP server endpoints](https://learn.microsoft.com/azure/foundry/agents/how-to/tools/model-context-protocol)
- [Add and manage MCP servers in Visual Studio Code](https://code.visualstudio.com/docs/agent-customization/mcp-servers)
- [Model Context Protocol documentation](https://modelcontextprotocol.io/)
