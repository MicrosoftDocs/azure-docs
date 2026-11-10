---
title: Chats in Azure SRE Agent
description: Learn how chats organize conversations with your agent, including chat sources, filtering, search, chat commands, and keyboard shortcuts.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 10/28/2026
author: craigshoemaker
ms.author: cshoe
ms.ai-usage: ai-assisted
ms.custom: chats, conversations, chat, history, slash commands, compaction, chat search
#customer intent: As an SRE, I want to understand chats so that I can organize and navigate my agent conversations efficiently.
---

# Chats in Azure SRE Agent
A chat is a conversation with your agent. Each time you start a new investigation or ask a question, you create a chat that maintains context throughout the conversation.

## Chat sources

Your agent creates chats from several different sources.

| Source | Description |
|---|---|
| **Conversation** | You start a chat in the portal. |
| **Incident** | An incident from **PagerDuty**, **ServiceNow**, or **Azure Monitor** triggers an investigation. |
| **Scheduled task** | A [scheduled task](scheduled-tasks.md) runs and creates a chat for its output. |
| **Teams** | You tag your agent in a Teams channel or direct message. |
| **Alert** | A webhook or alert triggers your agent. |
| **Daily report** | Automated daily summary of your agent's activity. |
| **Best practices** | Security and operational recommendations from your agent. |
| **Playground** | Test chats created in the [test playground](agent-playground.md). |
| **Welcome message** | Initial welcome chat when you first access an agent. |
| **Agent** | The agent proactively creates a chat (for example, for monitoring alerts). |

## Chat organization

The sidebar shows chats organized into two categories.

| Section | Purpose |
|---|---|
| **Favorites** | Chats you pinned for quick access. |
| **Other chats** | All other conversations. |

Each chat in the sidebar displays its title. You can easily spot unread chats because they appear in **bold** text.

### Filter chats

Select the filter icon next to **Chats** to open the **Filters** menu and find relevant conversations.

| Filter | What it shows |
|---|---|
| **Unread only** | Only chats you didn't read yet. |
| **Type** | Conversations from selected sources, such as incidents or scheduled tasks. |
| **Created by** | Conversations from **Me**, other authors, or all authors. |
| **Sort by** | The order in which conversations appear. |

**Created by** defaults to **Me**. To include teammates' conversations, select more authors or all authors in that submenu.

Combine the controls to narrow the list. Select **Reset** to restore **Me**, all types, recently active sorting, and no unread-only restriction.

### Chat status

Each chat has a status that indicates its current state.

| Status | Meaning |
|---|---|
| **In Progress** | The agent is actively working. |
| **Pending User Input** | The agent is waiting for your response or approval. |
| **Complete** | The investigation finished. |

### Manage chats

Right-click any chat in the sidebar, or select the **...** (More options) menu, to access chat actions.

:::image type="content" source="media/threads/thread-context-menu.png" alt-text="Screenshot of chat context menu showing Add to favorites, Info, Copy link to chat, Rename, and Delete options.":::

| Action | Description |
|---|---|
| **Add to favorites** | Pin the chat to the **Favorites** section for quick access. |
| **Info** | View chat details including chat ID, creation date, and source. |
| **Copy link to chat** | Copy a deep link to share with teammates. |
| **Rename** | Change the chat title. |
| **Delete** | Permanently remove the chat. |

:::image type="content" source="media/threads/thread-favorites-populated.png" alt-text="Screenshot of chat sidebar showing a chat pinned in the Favorites section above the Chats section.":::

### View chat details

Select a chat to open it. The title bar shows the chat name, a **...** (More options) menu, and a **View trace** button when you configure Application Insights.

### Search chats

Select **Search chats and pages** in the sidebar to open search. Type any part of a chat title, or paste a full or partial chat ID, to find a conversation. Search also finds portal pages, including pages under **Build + setup**.

:::image type="content" source="media/threads/thread-search-dialog.png" alt-text="Screenshot of search dialog showing chat results with title, chat ID, and last message preview.":::

Search results display each chat's title, unique ID, and a preview of the last message. The search text is highlighted wherever it matches, in the title, the ID, or both.

The following table describes scenarios where searching by chat ID is helpful.

| Scenario | How it helps |
|---|---|
| **Debugging** | Paste a chat ID from logs or monitoring tools to jump directly to the conversation. |
| **Collaboration** | A teammate shares a chat ID for you to review. |
| **Cross-referencing** | Navigate to a chat linked from an incident report or support ticket. |

> [!TIP]
> To find a chat's ID, right-click any chat in the sidebar and select **Info**. The dialog displays the chat ID with a **Copy** button, making it easy to share with teammates or reference in documentation.

## Image zoom

When your agent generates or displays images in the chat (charts, diagrams, screenshots), select any image to open it in a **fullscreen overlay**.

| Interaction | How |
|---|---|
| **Zoom in/out** | Scroll the mouse wheel, press **+**/**-** keys, or use the toolbar buttons. |
| **Pan** | Select and drag when zoomed in. |
| **Reset view** | Press **0** or select the reset button in the toolbar. |
| **Close** | Press **Escape**, select the **x** button, or select outside the image. |

A scale indicator in the toolbar shows the current zoom percentage (zoom range: 25% to 500%).

## Keyboard shortcuts

The following keyboard shortcuts help you navigate chats quickly.

| Shortcut | Action |
|---|---|
| **Alt+N** | Start a new chat. |
| **Alt+S** | Open the chat search dialog. |

Shortcut hints appear next to the corresponding buttons in the sidebar. The app ignores shortcuts when focus is inside a text input field or when modifier keys (Ctrl, Shift) are held.

## Chat commands

Type `/` or `#` in the chat input to access quick commands.

:::image type="content" source="media/threads/portal-slash-commands.png" alt-text="Screenshot of slash commands menu showing available commands.":::

| Command | Description | Learn more |
|---|---|---|
| `/agent` | Switch to a specific custom agent. | [Custom Agents](sub-agents.md#how-custom-agents-work) |
| `/clear` | Start a fresh chat. | |
| `/compact` | Summarize and compress conversation history. | |
| `/incident` | List all incidents. | [Incident response](incident-response.md) |
| `/resource` | List agent-managed resources. | |
| `#remember` | Save information to agent memory. | [Memory](memory.md#user-memories) |
| `#retrieve` | Recall saved information from memory. | [Memory](memory.md#user-memories) |
| `#forget` | Remove information from agent memory. | [Memory](memory.md#user-memories) |

## Conversation compaction

Long conversations automatically compact to stay within token limits. When this process happens, you see a "Compacting conversation..." message in the chat, similar to tool execution feedback.

Compaction preserves key context while reducing token usage. Your agent continues to remember important facts and decisions from earlier in the conversation.

You can also manually trigger compaction by using the `/compact` command to summarize the current conversation.

> [!TIP]
> Markdown tables with numeric columns sort numerically (1, 2, 12) rather than lexicographically (1, 12, 2).

## Test chats

When you test your agent configuration in the [test playground](agent-playground.md), you create **test chats** that run in read-only mode. Test chats:

- Are separate from production chats in the sidebar.
- Don't execute real actions against your Azure resources.
- Let you validate prompt changes, tool configurations, and agent behavior safely.

Test chats appear with a distinct label so you can tell them apart from real conversations.

## Related content

| Resource | Why it matters |
|----------|----------------|
| [Memory and knowledge](memory.md) | How your agent remembers information |
| [Incident response](incident-response.md) | Chats created from incidents |
