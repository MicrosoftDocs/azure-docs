---
title: Comment on incidents in Microsoft Sentinel | Microsoft Docs
description: Use the comments functionality in Microsoft Sentinel incidents for collaboration and documentation.
author: yelevin
ms.topic: how-to
ms.date: 01/25/2022
ms.author: yelevin
---

# Comment on incidents in Microsoft Sentinel (Public preview)

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Sentinel supports rich-text comments in incidents, enabling you to easily enrich incidents, collaborate with coworkers on investigations, and document your work.


> [!IMPORTANT]
> The incident comments feature is currently in **PREVIEW**. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Overview

As a security operations analyst, when investigating an incident you will want to thoroughly document the steps you take, both to ensure accurate reporting to management and to enable seamless cooperation and collaboration amongst coworkers. Microsoft Sentinel gives you a rich commenting environment to help you accomplish this.

Another important thing that you can do with comments is enrich your incidents automatically. When you run a playbook on an incident that fetches relevant information from external sources (say, checking a file for malware at VirusTotal), you can have the playbook place the external source's response - along with any other information you define - in the incident's comments.

Comments are simple to use. You access them through the **Comments** tab on the incident details page.

:::image type="content" source="media/comment-on-incidents/comments-screen.png" alt-text="Screenshot of viewing and entering comments.":::

## Frequently asked questions

There are several considerations to take into account when using incident comments. The following list of questions points to these considerations.

### What kinds of input are supported?

- **Text:** Comments in Microsoft Sentinel support text inputs in plain text, basic HTML, and Markdown. You can also paste copied text, HTML, and Markdown into the comment window.

- **Images:** You can insert links to images in comments and the images will be displayed inline, but the images must already be hosted in a publicly accessible location such as Dropbox, OneDrive, Google Drive and the like. Images can't be uploaded directly to comments.

### Is there a size limit on comments?

- **Per comment:** A single comment can contain up to **30,000 characters**. 

- **Per incident:** A single incident can contain up to **100 comments**. But the size limit of an entire incident with all its contents is 64,000 characters. So there is a theoretical limit on the number of large comments an incident can support, even though in practice this limit is not expected to ever be reached.

### Who can edit or delete comments?

- **Editing:** Only the author of a comment has permission to edit it.

- **Deleting:** A comment can be deleted by its author and by anyone else with the [Microsoft Sentinel Contributor](roles.md) role.

### Can I search through comments?



## Next steps

For more information, see:

- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [Collaborate in Microsoft Teams (Public preview)](collaborate-in-microsoft-teams.md)
