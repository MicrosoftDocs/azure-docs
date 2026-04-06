---
title: "Tutorial: Add a Web Page Knowledge Source in Azure SRE Agent"
description: Add a web page URL as a knowledge source so your agent can reference external documentation.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/03/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: knowledge, web-page, URL, tutorial
---

# Tutorial: Add a web page knowledge source in Azure SRE Agent

Add a public URL as a knowledge source that your agent references during investigations. You add the URL, verify it appears in the knowledge base, and confirm your agent can use the content.

**Time**: ~5 minutes

## Prerequisites

- An Azure SRE Agent in **Running** state
- **Write** permissions on the agent (AgentMemoryWrite)
- A publicly accessible web page URL (any page that loads in a browser without authentication)

## Step 1: Open Knowledge Sources

1. Go to [sre.azure.com](https://sre.azure.com) and select your agent.
1. In the left sidebar, select **Builder**.
1. Select **Knowledge Sources**.

You see the Knowledge Sources page with three action cards: **Add file**, **Add web page**, and **Add repository**.

## Step 2: Open the Add Web Page dialog

Select the **Add web page** card (the one with the globe icon).

A dialog opens with three fields:

- **Web page URL** (required): the URL to fetch
- **Name** (required): a display name for this knowledge source
- **Description** (optional): a brief description of what the page contains

## Step 3: Enter the web page details

1. **Web page URL**: Enter the full URL of the page you want to add. For example: `https://learn.microsoft.com/en-us/azure/azure-monitor/overview`
1. **Name**: Enter a descriptive name, such as `Azure Monitor Overview`.
1. **Description**: Optionally describe the content.

> [!NOTE]
> The URL must be an absolute URL (starting with `http://` or `https://`), publicly accessible, and reachable within 30 seconds.

## Step 4: Add the web page

Select **Add web page**.

The agent fetches the page content. If successful, a notification confirms the web page was added and the dialog closes automatically.

Common errors:

| Error | Cause | Fix |
|-------|-------|-----|
| Invalid URL format | URL isn't absolute or not HTTP/HTTPS | Use a full URL starting with `https://` |
| HTTP 403 | Page blocks automated requests | Try a different page, or upload the content as a file instead |
| HTTP 404 | Page not found | Check the URL for typos |
| Request timed out | Page took longer than 30 seconds | Try again, or upload the content as a file |
| Empty content | Page requires JavaScript to render | Upload the content as a file instead |

## Step 5: Verify the knowledge source

After adding the web page, it appears in the Knowledge Sources list. Verify the following values:

- **Name**: the display name you provided
- **Type**: shows as **Web page**
- **Status**: indicates whether the content was indexed

## Step 6: Test with your agent

1. Go to **Chats** in the left sidebar.
1. Start a new conversation.
1. Ask a question related to the web page content.

Your agent should reference information from the web page in its response.

## Updating web page content

Web page knowledge sources are point-in-time snapshots. To refresh the content:

1. Go to **Builder > Knowledge Sources**.
1. Select the web page entry.
1. Delete it.
1. Re-add the URL by using the same steps.

## Related content

- [Upload knowledge documents](tutorial-upload-knowledge-document.md)
- [Connect source code](connect-source-code.md)
- [Connect knowledge](connect-knowledge.md)
