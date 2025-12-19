---
title: Documentation Connector in Azure SRE Agent Preview
description: Discover how the Azure SRE Agent documentation connector enables automated crawling, semantic search, and wide file format support for Azure DevOps repositories.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 12/18/2025
ms.topic: article
ms.service: azure-sre-agent
---

# Documentation connector in Azure SRE Agent preview

The Azure SRE Agent documentation connector automatically crawls Azure DevOps repositories to index troubleshooting guides, runbooks, and documentation for agent retrieval.

### Key features

- **Automated crawling**: Runs every 24 hours without manual intervention

- **Wide file format support**: Indexes `.md`, `.txt`, `.rst`, `.adoc`, `.html`, `.json`, `.yaml`, `.yml`, `.xml`, `.csv`, and more

- **Azure DevOps integration**: Connects to Git repositories using managed identity

- **Semantic search**: Documents are chunked, embedded, and indexed for AI-powered retrieval

### Prerequisites

Before setting up a documentation connector:

- Azure DevOps repository containing documentation
- Managed identity configured for the agent (User-Assigned or System-Assigned)
- Repository read access granted to the managed identity

### Setup

1. In the portal, go to **Settings** > **Basics** and note the managed identity name.
1. In Azure DevOps, add the managed identity as a user with **Basic** access level.
1. Grant **Read** permission on the target repository.
1. Go to **Settings** > **Connectors** and select **Add connector**.
1. Select **Documentation connector**, enter the repository URL, and select the managed identity.
1. The connector starts indexing right away.

## Related content

- [Memory system](./memory-system.md)
