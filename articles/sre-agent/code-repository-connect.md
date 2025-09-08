---
title: Connect a code repository to resources in Azure SRE Agent Preview
description: Learn to connect resources managed by Azure SRE Agent Preview to a code repository for detailed root cause analysis and summary reports.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 09/08/2025
ms.service: azure-sre-agent
zone_pivot_groups: sre-agent-code-repo
---

# Connect a code repository to resources in Azure SRE Agent Preview

By connecting your monitored resources to a source code repository through Azure SRE Agent, you create a direct link between the agent and your code base for detailed analysis, reporting, and issue mitigation.

When you create a link between SRE Agent and your code, you get:

- **Detailed root cause analysis reporting**: SRE Agent root cause analysis uses source code references pinpoint down to individual lines of code as the source of issues in your environment.

- **Automated work ticket generation**: When an issue is found, the agent can create work items for you in either Azure DevOps or GitHub.

The following source code hosting providers are supported with Azure SRE Agent.

- GitHub
- Azure DevOps
- Visual Studio Codespace

## Connect a repository

in the instructions on how to connect, you are missing authorization piece which is different based on type of source code repo, for Azure DevOPs, you need to configure DevOPs to allow Agent's Managed Identity access to devops and for GitHub, there is an authorize button that shows up after connecting to URL. its easy to miss that step sometimes, so we need to document it.

::: zone pivot="azure-devops"

### Prerequisites

- **Managed Identity access**: Before you can connect your DevOps repository to resources in SRE Agent, you need to configure DevOps to allow the agent's Managed Identity access to your repo.

### Connect to Azure DevOps

::: zone-end

1. Open your instance of SRE Agent in the Azure portal.

2. Select the **Resource mapping** tab.

3. Select **Grid view** radio button.

4. Expand the section for the resource you in which want to connect a repository.

5. Select **Connect repository**

::: zone pivot="azure-devops"

6. Enter the repository URL in the box.

    The URL needs to match the following format:

    `https://dev.azure.com/organization/<PROJECT_NAME>/_git/<REPO_NAME>`

7. Select **Connect repository**.

::: zone-end

::: zone pivot="github"

6. Enter the repository URL in the box.

    The URL needs to match the following format:

    `https://github.com/<OWNER>/<REPO_NAME>`

7. Select **Connect repository**.

    A new panel now appears on the right with profile details for the resource.

8. Scroll down the panel and select **Authorize repository access** and follow the authorization flow to connect your repository.

::: zone-end

## Related content

- [Incident management](./incident-management.md)
