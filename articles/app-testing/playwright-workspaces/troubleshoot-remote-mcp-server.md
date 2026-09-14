---
title: Troubleshoot the Playwright Workspaces remote MCP server
titleSuffix: Playwright Workspaces
description: Troubleshoot errors and common issues when you automate browsers with the Playwright Workspaces remote MCP server.
ms.topic: troubleshooting-general
ms.date: 09/11/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
---

# Troubleshoot the Playwright Workspaces remote MCP server

> [!IMPORTANT]
> The Playwright Workspaces remote Model Context Protocol (MCP) server is in preview. Preview features don't have a service-level agreement and aren't recommended for production workloads. Features, limits, and availability can change.

This article provides guidance for designing reliable browser automation flows and resolving errors that might occur when you use the Playwright Workspaces remote MCP server.

## Design a reliable browser automation flow

Use an observe-act-verify loop instead of asking the agent to perform a long sequence without checking page state:

1. **Create:** Call `create_browser_session` and retain its `browserSessionId`.
1. **Navigate:** Call `browser_navigate` with an explicit, approved URL.
1. **Observe:** Call `browser_find` for a focused search or `browser_snapshot` for a broader accessibility view.
1. **Act:** Use a snapshot reference or unique selector with an interaction tool.
1. **Wait:** Call `browser_wait_for` for expected text, disappearing text, or a bounded delay.
1. **Verify:** Capture another snapshot or inspect console and network activity.
1. **Handle branches:** Handle a dialog, switch tabs, or upload files only when page state requires it.
1. **Capture evidence:** Call `browser_take_screenshot` if a visual result is useful. Don't use screenshots to select action targets.
1. **Clean up:** Call `close_browser_session` in a finally-style cleanup path.

### Choose stable action targets

Prefer references returned by `browser_snapshot` or `browser_find`. They describe accessible page elements and reduce dependence on implementation-specific markup. Use a unique selector when a stable snapshot reference isn't available.

Refresh the snapshot after navigation or a page-changing action. A previously returned target can become stale when the page rerenders.

### Handle dialogs safely

An action can return a dialog-opened outcome after it already changes the page state. This outcome isn't a normal action failure.

1. Don't repeat the original action.
1. Call `browser_handle_dialog` with `accept` set to `true` or `false`.
1. For a prompt dialog, include `promptText` only when accepting it.
1. Observe the page again before continuing.

### Handle ambiguous failures

A timeout or disconnected caller doesn't prove that an action had no effect. Before you retry a non-idempotent operation, such as a click, form submission, upload, or code execution:

1. Call `browser_snapshot`, `browser_find`, or another observation tool if the session is still available.
1. Determine whether the expected state change occurred.
1. Retry only if repeating the action is safe.
1. If the session expired, create a new session and restart from a known application state.

## Review tool input shapes and limits

All browser-scoped tools require a `browserSessionId`. The string and collection bounds in this section are current preview limits.

### Form field shape

Each `browser_fill_form` field has the following shape:

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

Each `browser_file_upload` file has the following shape:

```json
{
  "name": "example.txt",
  "data": "SGVsbG8sIHdvcmxkIQ==",
  "mimeType": "text/plain"
}
```

`mimeType` is optional and defaults to `application/octet-stream`.

File uploads have the following limits:

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

### Limits and current behavior

| Limit | Current value | Recommended action |
|---|---|---|
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

## Resolve remote MCP server errors

A tool error includes a stable error code, a customer-safe message, a `retryable` value, and correlation information. Use the returned `retryable` value as the primary retry signal, together with the operation's possible side effects.

| Error code | Meaning | Action |
|---|---|---|
| `Unauthorized` | The access token is missing, invalid, expired, disabled, or for another workspace. | Verify the `x-api-key` header, workspace access-token enablement, token expiration, and endpoint workspace ID. Don't retry with the same invalid credential. |
| `Forbidden` | The token owner lacks permission, or the caller doesn't own the session. | Verify workspace access and use the same credential throughout the session. |
| `SessionNotFound` | The session doesn't exist. | Create a new session. |
| `SessionClosed` | The session was closed. | Create a new session if more work is required. |
| `SessionExpired` | The session or its browser connection is no longer available. | Create a new session and restart from a known state. |
| `BrowserUnavailable` | Browser capacity or the remote browser is temporarily unavailable. | Retry session creation after a delay if `retryable` is `true`. |
| `DependencyUnavailable` | A required service is temporarily unavailable. | Retry with exponential backoff if `retryable` is `true`. |
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

## Related content

- [Automate browsers with the Playwright Workspaces remote MCP server](./how-to-playwright-workspaces-remote-mcp.md)
- [Manage workspace access tokens](./how-to-manage-access-tokens.md)
- [Playwright Workspaces limits and quotas](./resource-limits-quotas-capacity.md)
