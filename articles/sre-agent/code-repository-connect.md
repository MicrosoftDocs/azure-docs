---
title: Connect a code repository to resources in Azure SRE Agent Preview
description: Learn to connect resources managed by Azure SRE Agent Preview to a code repository for detailed root cause analysis and summary reports.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 09/04/2025
ms.service: azure-sre-agent
---

# Connect a code repository to resources in Azure SRE Agent Preview

The Azure SRE Agent root cause analysis can pinpoint down to individual lines of code as the source of issues in your environment. By connecting your monitored resources to a source code repository, you create the link between SRE Agent and your code base needed for detailed analysis, reporting, and mitigation.

The following source code hosting providers are supported with Azure SRE Agent.

* GitHub
* Azure DevOps
* Visual Studio Codespace

## Connect a repository

1. Open your instance of SRE Agent in the Azure portal.

1. Select the **Resource mapping** tab.

1. Select **Grid view** radio button.

1. Expand the section for the resource you in which want to connect a repository.

1. Select **Connect repository**

1. Enter the repository URL in the box.

    The required format for the repository URL differs depending on the repository hosting provider you use. The following table to find the URL format of the hosting service your code is in.

    | Provider | Example |
    |---|---|
    | GitHub | `https://github.com/<OWNER>/<REPO_NAME>` |
    | Azure DevOps | `https://dev.azure.com/organization/<PROJECT_NAME>/_git/<REPO_NAME>` |
    | Visual Studio | `https://organization.visualstudio.com/<PROJECT_NAME>/_git/<REPO_NAME>` |

    Enter the repository URL into the box.

1. Select **Connect repository**.

## Related content

* [Incident management](./incident-management.md)
