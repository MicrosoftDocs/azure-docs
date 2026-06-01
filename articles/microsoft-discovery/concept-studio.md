---
title: What is Microsoft Discovery Studio?
description: Learn about Microsoft Discovery Studio, a web-based research environment built on Visual Studio Code for the web that enables scientists and engineers to work with AI agents, investigations, and scientific tools in a customizable interface.
author: surajmb
ms.author: surmb
ms.service: azure
ms.topic: concept-article
ms.date: 04/10/2026

#CustomerIntent: As a researcher or scientist, I want to understand Microsoft Discovery Studio and its interface so that I can navigate the platform and customize it to fit my research workflow.
---

# What is Microsoft Discovery Studio?

Microsoft Discovery Studio is the web-based, unified research environment for [Microsoft Discovery](overview-what-is-microsoft-discovery.md). You use Discovery Studio to create and manage workspaces, projects, agents, investigations, knowledge bases, tools, and data—all from a single browser-based interface.

You can customize the layout and tailor the environment to match your specific research workflows—all without leaving the browser.

You can access Microsoft Discovery Studio at [studio.discovery.microsoft.com](https://studio.discovery.microsoft.com) using any supported modern browser. It requires no local installation or client software.

> [!TIP]
> If you're new to Microsoft Discovery, start with the [Quickstart: Deploy infrastructure using Azure portal](quickstart-infrastructure-portal.md) to set up your workspace and project before exploring Studio.

In this article, you learn about the different parts of Microsoft Discovery Studio and how to navigate the interface.

## Home

By default, the first thing you see after you sign in to [Microsoft Discovery Studio](https://studio.discovery.microsoft.com) is the **Home** page. This page provides quick access to your most common tasks and recent activity.

The Home page includes:

- **Getting started**: Launch the project creation flow to begin a new research effort.
- **Learn more**: Access documentation and introductory guides to help you navigate the platform.
- **What's new**: Stay up to date with the latest Microsoft Discovery platform announcements and features.
- **Recent Activity**: View a list of your most recently accessed projects and workspaces for quick navigation.

:::image type="content" source="media/concept-studio/studio-home.jpg" alt-text="Screenshot of the Microsoft Discovery Studio Home page showing getting started cards and recent activity." lightbox="media/concept-studio/studio-home.jpg":::

## Studio elements and controls

The Discovery Studio interface consists of a persistent navigation sidebar and a main working area. The sidebar provides access to global resources and navigation, while the working area changes based on the context of your current task.

The following sections describe the key elements of the Studio interface.

| Element | Description |
| --- | --- |
| **Navigation sidebar** | The left-side menu that provides access to all major sections: Home, Workspaces, Projects, and Resources. |
| **Resources section** | A group within the sidebar for managing shared platform resources: Tools, Knowledge, and Data. |
| **Main working area** | The central pane that displays content based on your current selection—workspace and project lists and details. |
| **Breadcrumb bar** | Appears at the top of the working area to show your current location and allow quick navigation back to previous levels. |
| **Profile menu** | Located in the top-right corner. View your account information, switch Microsoft Entra ID tenants, or sign out. |

## Navigation sidebar

The navigation sidebar is always visible on the left side of Microsoft Discovery Studio. It provides quick access to the platform's core areas and stays consistent regardless of what you're working on.

The sidebar is organized into two groups:

**Top-level navigation:**

- **Home**: Return to the Home page with getting started cards and recent activity.
- **Workspaces**: View and manage all workspaces you have access to.
- **Projects**: Browse, manage, and open your projects across all workspaces.

**Resources:**

- **Tools**: Browse the computational tools available to agents.
- **Knowledge**: Manage Bookshelves and Knowledge Bases that provide agents with domain-specific context through GraphRAG-indexed documents.
- **Data**: Access and manage storage containers linked to your projects for input and output data.

## Workspaces view

When you select **Workspaces** from the sidebar, you see a table listing all workspaces you have access to. Each row displays key information about the workspace:

| Column | Description |
| --- | --- |
| **Name** | The workspace name, displayed as a link to open the workspace. |
| **Region** | The Azure region where the workspace is deployed. |
| **Resource Group** | The Azure resource group that contains the workspace resources. |
| **Provisioning State** | The current deployment state (for example, Succeeded, Failed, Deleting). |
| **Created By** | The identity that created the workspace. |
| **Created At** | The timestamp when the workspace was created. |

Use the **Refresh** and **Filter** controls above the table to update the list or narrow results.

:::image type="content" source="media/concept-studio/studio-workspaces.jpg" alt-text="Screenshot of the Workspaces view in Microsoft Discovery Studio showing a table of workspaces with name, region, and provisioning state columns." lightbox="media/concept-studio/studio-workspaces.jpg":::

:::image type="content" source="media/concept-studio/studio-projects.jpg" alt-text="Screenshot showing the list of projects within a workspace in Microsoft Discover Studio." lightbox="media/concept-studio/studio-projects.jpg":::

## Projects view

When you open a project, Microsoft Discovery Studio transitions into a full **Visual Studio Code for the Web** environment. This portal is where you conduct your research—running investigations, interacting with agents, and managing project resources.

The project includes:

- **Investigations panel**: A sidebar that lists all investigations in the current project. Select an investigation to open it and begin chatting with agents.
- **Chat interface**: Open an investigation to view the chat interface where you interact with agents through natural language conversations. Use the agent selector dropdown or type `@` to route messages to specific agents.
- **Welcome tab**: Welcome tab appears when you open a project. It provides an overview of the project with quick actions for creating agents and investigations.
- **Data**: Browse storage containers and storage assets that are available in the project. You can open storage assets to view the files contained within them and also visualize supported file types.
- **Agent logs**: Use agent logs to view a detailed view of your agent interaction including prompts, responses, and tool call logs including raw log output.
- **Tasks**: Manage Discovery Engine tasks created within investigations in the tasks sidebar.
- **Preferences**: Manage user and project preferences, which help you customize agentic behavior to your style.
- **Resources**: A sidebar that lists all project related resources that you can use such as agents, tools, storage containers, and knowledge bases.

:::image type="content" source="media/concept-studio/studio-project-vscode.jpg" alt-text="Screenshot of the project view in Microsoft Discovery Studio showing the Investigation panel and chat." lightbox="media/concept-studio/studio-project-vscode.jpg":::

### Customizing your research environment

Because Microsoft Discovery Studio is built on Visual Studio Code for the Web, you get the full flexibility and customization features adapted for scientific research:

- **Themes and appearance**: Change the color theme, font size, and UI layout to suit your preferences. Go to **File > Preferences > Color Theme** or press `Ctrl+K Ctrl+T` to browse themes.
- **Layout customization**: Drag and drop panels, resize the sidebar and editor panes, and arrange your workspace to match your preferred workflow. Split the editor to view multiple investigations or files side by side.

### Working with investigations

Investigations are the primary research sessions in Microsoft Discovery Studio. The Investigations panel in the activity bar lists all investigations in the current project, organized in a tree view. Each investigation contains:

- A conversational thread with one or more agents
- Agent-generated outputs such as HTML reports, calculations, and data analyses
- A summary section that updates as the investigation progresses

You can have multiple investigations open simultaneously in separate editor tabs, making it easy to compare results or work on parallel research tracks.

## Get started

If you're new to Microsoft Discovery Studio, follow these steps:

1. **Set up infrastructure**: Deploy a workspace and supporting resources using the [Azure portal quickstart](quickstart-infrastructure-portal.md) or [Bicep quickstart](quickstart-infrastructure-bicep.md).
1. **Create a project**: To organize your agents, investigations, and data, set up a project within your workspace 
1. **Create agents**: Add prompt agents or workflow agents to your project. You can create them from scratch or use [agent bundles](quickstart-agents-bundles.md).
1. **Start an investigation**: To conduct AI-powered research, open an investigation and begin chatting with your agents.

For a guided walkthrough, see [Quickstart: Get started with agents and investigations in Microsoft Discovery Studio](quickstart-agents-studio.md).

## Related content

- [What is Microsoft Discovery?](overview-what-is-microsoft-discovery.md)
- [Projects and investigations](concept-projects-investigations.md)
- [Discovery Agent concepts](concept-discovery-agent.md)
- [Quickstart: Get started with agents and investigations](quickstart-agents-studio.md)
