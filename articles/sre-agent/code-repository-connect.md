---
title: Connect a code repository to resources in Azure SRE Agent Preview
description: Learn to connect resources managed by Azure SRE Agent to a code repository for detailed root cause analysis and summary reports.
author: craigshoemaker
ms.author: cshoe
ms.topic: concept-article
ms.date: 09/24/2025
ms.service: azure-sre-agent
zone_pivot_groups: sre-agent-code-repo
---

# Connect a code repository to resources in Azure SRE Agent Preview

By connecting your monitored resources to a source code repository through Azure SRE Agent, you create a direct link between the agent and your code base for detailed analysis, reporting, and issue management and mitigation.

When you create a link between SRE Agent and your code, you get:

- **Detailed root cause analysis reporting**: SRE Agent root cause analysis uses source code references pinpoint down to individual lines of code as the source of issues in your environment.

- **Automated work ticket generation**: When an issue is found, the agent can create work items for you in either Azure DevOps or GitHub.

The following source code hosting providers are supported with Azure SRE Agent.

- GitHub
- Azure DevOps

## Connect a repository

::: zone pivot="azure-devops"

> [!NOTE]
> The [Code Search extension](https://marketplace.visualstudio.com/items?itemName=ms.vss-code-search) must be installed on your Azure DevOps organization for repository files to be searchable. It can take an hour for your repository files to be searchable after you install this extension.

Before you can connect an Azure DevOps Repo to a resource, you first need to associate the agent managed identity with the repository.

1. Open your instance of SRE Agent in the Azure portal.

1. Select **Settings** and copy the name of the managed identity listed in the settings window.

1. Open your Azure DevOps repository.

1. Select the **Invite** button in the upper left so you can add the agent's managed identity to the repo.

1. In the *Users* box, enter and select the name of your SRE Agent.

1. Select **Add**.

1. Copy the URL of the repository to the clipboard.

1. Return to the SRE Agent in the portal, and in the chat window ask the agent to connect to the repository.

    Format you request to resemble the following format:

    ```text
    connect <RESOURCE_NAME> to this Azure DevOps repo: <REPO_URL>
    ```

    Before you submit the prompt, update the example to replace `<RESOURCE_NAME>` with the name of the app or resource where the code is deployed, and replace `<REPO_URL>` with the URL of the Azure DevOps repository using the following format:

    `https://dev.azure.com/organization/<PROJECT_NAME>/_git/<REPO_NAME>`

::: zone-end

::: zone pivot="github"

> [!NOTE]
> You must have a [GitHub Copilot plan](https://docs.github.com/en/copilot/get-started/plans) other than the Free plan. A GitHub Pro free trial plan will work for testing purposes, but the plan converts to a paid plan after the free trial ends. Additionally, you must enable the Copilot Coding Agent for the repository, in the [GitHub organization settings](https://github.com/settings/copilot/coding_agent).

1. Open your instance of SRE Agent in the Azure portal.

1. Select the **Resource mapping** tab.

1. Select **Grid view** radio button.

1. Expand the section for the resource you in which want to connect a repository.

1. Select **Connect repository**

1. Enter the repository URL in the box.

    The URL needs to match the following format:

    `https://github.com/<OWNER>/<REPO_NAME>`

1. Select **Connect repository**.

    A new panel now appears on the right with profile details for the resource.

1. Scroll down the panel and select **Authorize repository access** and follow the authorization flow to connect your repository.

::: zone-end

Your source code repository is now connected to the Azure resource and available to SRE Agent for root cause analysis reporting.

## Related content

- [Incident management](./incident-management.md)
