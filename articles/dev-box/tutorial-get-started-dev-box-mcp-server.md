---
title: "Tutorial: Get started with the Microsoft Dev Box MCP Server"
titleSuffix: Microsoft Dev Box
description: Learn how to use the Microsoft Dev Box MCP Server to manage your dev boxes through AI agents with step-by-step guidance and practical examples.
services: dev-box
ms.service: dev-box
ms.custom: devx-track-javascript
ms.ai-usage: ai-generated
ms.update-cycle: 90-days
ms.topic: tutorial
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/05/2025

#Customer intent: As a developer, I want to learn how to use the Dev Box MCP Server through a hands-on tutorial so that I can efficiently manage my dev boxes using natural language commands.
---

# Tutorial: Get started with the Microsoft Dev Box MCP Server

This tutorial shows you how to use the Microsoft Dev Box Model Context Protocol (MCP) Server to manage your dev boxes through AI agents. You learn to perform common dev box operations using natural language commands instead of navigating through multiple interfaces.

In this tutorial, you'll:
- Connect to your Dev Box resources through an AI agent
- List and explore your available projects and dev boxes
- Perform basic dev box operations using conversational commands
- Verify your operations completed successfully

## Prerequisites

Before you begin this tutorial, ensure you have:

| Requirement | Details |
|-------------|---------|
| **Dev Box MCP Server installed** | Follow the installation steps in the [Dev Box MCP Server repository](https://github.com/microsoft/devbox-mcp-server#-getting-started) |
| **Dev Box resources** | - At least one Dev Box project with a configured pool<br>- Existing dev boxes to manage (optional but recommended) |
| **Authentication** | Signed in through Azure CLI, Visual Studio Code, or Windows SSO |
| **Required permissions** | **Dev Box User** role or higher on your Dev Box resources |

## Step 1: Open your AI agent and test connectivity

Start by opening your AI agent and testing the connection to your Dev Box resources.

1. **Open GitHub Copilot Chat** in your IDE (VS Code or Visual Studio)
2. **Test the MCP Server connection** by entering this prompt:

   ```
   List my Dev Box projects
   ```

3. **Verify the response**: You should see a list of projects you have access to. If you get an error, check that you're authenticated via Azure CLI (`az login`) or Windows SSO.

**Expected output**: A list showing your project names, descriptions, and resource groups.

## Step 2: Explore your Dev Box environment

Now that you confirmed connectivity, explore your Dev Box resources to understand your environment.

**View your dev boxes** across all projects:

   ```
   Show me all my dev boxes
   ```

**Get details about a specific project** (replace "YourProjectName" with an actual project name):

   ```
   Show me details about the YourProjectName project
   ```

**List available dev box pools** in a project:

   ```
   What dev box pools are available in the YourProjectName project?
   ```

**Expected output**: Information about your dev boxes including their names, status (Running, Stopped, etc.), projects, and pool configurations.

## Step 3: Perform basic dev box operations

Practice common dev box management tasks using natural language commands.

### Check dev box status

**Check the status of a specific dev box**:

   ```
   What's the status of my DevBoxName dev box?
   ```

**Get detailed information** about a dev box:

   ```
   Show me detailed information about DevBoxName including its configuration and current state
   ```

### Start or stop a dev box

**Start a stopped dev box**:

   ```
   Start my DevBoxName dev box
   ```

**Stop a running dev box**:

   ```
   Stop my DevBoxName dev box
   ```

> [!NOTE]
> Starting and stopping dev boxes are long-running operations that might take several minutes to complete.

### Work with schedules

**Check shutdown schedules**:

   ```
   When is my DevBoxName dev box scheduled to shut down?
   ```

**Delay a scheduled shutdown**:

   ```
   Delay the shutdown of my DevBoxName dev box until 6 PM today
   ```

## Step 4: Verify your work

Confirm that your operations completed successfully by checking the results.

**Check operation status** for long-running tasks:

   ```
   What's the status of the operation I just started?
   ```

**Verify dev box state changes**:

   ```
   Show me the current status of DevBoxName
   ```

**Confirm schedule changes**:

   ```
   Show me the updated schedule for DevBoxName
   ```

**What to look for**:
- Operations should show "Succeeded" status when completed
- Dev box power states should reflect your start/stop commands
- Schedule modifications should be visible in the schedule information

## Step 5: Try advanced scenarios (optional)

Once you're comfortable with basic operations, try these more advanced scenarios:

### Create a new dev box

```
Create a new dev box called "FeatureWork" in the DevelopmentProject using the StandardPool
```

### Apply customizations

```
What customization tasks are available for my project?
```

```
Install the development tools customization on my FeatureWork dev box
```

### Monitor customization progress

```
What's the status of the customization running on my FeatureWork dev box?
```

## Troubleshooting

If you encounter issues during this tutorial:

### Authentication problems
- Verify you're signed in: `az account show`
- Check your permissions in the Azure portal
- Try signing out and back in: `az logout` then `az login`

### Tool registration errors
1. Press `Ctrl+Shift+P` (VS Code) or `Ctrl+Shift+P` (Visual Studio)
2. Run **MCP: Reset cached tools**
3. Restart your IDE

### Operation failures
- Check that dev box names and project names are correct
- Verify you have appropriate permissions for the operation
- Some operations might take time - check operation status periodically

## Clean up resources (optional)

If you created test resources during this tutorial:

**Delete test dev boxes** you no longer need:

   ```
   Delete the FeatureWork dev box from DevelopmentProject
   ```

**Stop running dev boxes** to save costs:

   ```
   Stop all my running dev boxes
   ```

## Next steps

Now that you completed the tutorial, you can:

- Explore the full range of [supported operations](https://github.com/microsoft/devbox-mcp-server#-currently-supported-tools)
- Integrate Dev Box MCP Server commands into your daily development workflow
- Share natural language commands with your team for common operations

## Related content

- [What is Microsoft Dev Box MCP Server?](overview-what-is-dev-box-mcp-server.md)
- [Dev Box MCP Server installation guide](https://github.com/microsoft/devbox-mcp-server#-getting-started)