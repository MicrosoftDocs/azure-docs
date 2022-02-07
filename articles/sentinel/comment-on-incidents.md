---
title: Comment on incidents in Microsoft Sentinel | Microsoft Docs
description: Use the comments functionality in Microsoft Sentinel incidents for collaboration and documentation.
author: yelevin
ms.topic: how-to
ms.date: 01/25/2022
ms.author: yelevin
---

# Comment on incidents in Microsoft Sentinel

[!INCLUDE [Banner for top of topics](./includes/banner.md)]

Microsoft Sentinel supports rich-text comments in incidents, enabling you to easily enrich incidents, collaborate with coworkers on investigations, and document your work.


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

- **Per incident:** A single incident can contain up to **100 comments**.  

    > [!NOTE]
    > The size limit of a single incident record in the *SecurityIncident* table in Log Analytics is 64 KB. If this limit is exceeded, comments (starting with the earliest) will be truncated, which may affect the comments that will appear in [advanced search](investigate-cases.md#search-for-incidents) results.
    >
    > The actual incident records in the incidents database will not be affected.

### Who can edit or delete comments?

- **Editing:** Only the author of a comment has permission to edit it.

- **Deleting:** Only users with the [Microsoft Sentinel Contributor](roles.md) role have permission to delete comments. Even the comment's author must have this role in order to delete it.

## Next steps

For more information, see:

- [Investigate incidents with Microsoft Sentinel](investigate-cases.md)
- [Collaborate in Microsoft Teams (Public preview)](collaborate-in-microsoft-teams.md)
