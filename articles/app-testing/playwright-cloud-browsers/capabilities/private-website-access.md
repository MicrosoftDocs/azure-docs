---
title: Access privately hosted websites with Playwright Workspaces MCP
titleSuffix: Playwright Workspaces
description: Configure Playwright Workspaces MCP to run browser automation against applications hosted in a private network.
ms.topic: how-to
ms.date: 11/18/2026
ms.service: azure-app-testing
ms.subservice: playwright-workspaces
author: Abhinav-Premsekhar
ms.author: apremsekhar
---

# Access privately hosted websites with Playwright Workspaces MCP

> [!IMPORTANT]
> Private website access is in preview. Preview features don't have a service-level agreement and aren't recommended for production workloads. Features, limits, and availability can change.

Playwright Workspaces private website access lets you run browser automation against applications in a virtual network without exposing those applications to the public internet. Use it for development, staging, and preproduction sites, internal business applications, employee portals, or other web experiences that are available only inside your network.

This article explains how to configure a workspace for private access. You can use the workspace for browser automation with an AI agent.

## Before you begin

Make sure you have:

- An Azure subscription and permission to create a Playwright workspace. Your account needs the **Owner**, **Contributor**, or a classic administrator role.
- A virtual network and subnet in the same subscription and Azure region where you plan to create the workspace.
- The Microsoft.App resource provider registered in the subscription.
- A subnet delegated to `Microsoft.App/environments` with at least a `/27` address range.
- The Microsoft Entra application named `CloudNativeTesting` (client ID `847bd4c1-7486-4241-a783-f9bda69241c1`) granted `subnet/join` permission on the subscription that hosts the virtual network, or on the virtual network itself. A Network Contributor role includes this permission.

## Create a workspace with private access

1. In the [Azure portal](https://portal.azure.com/), open **Azure App Testing**.
1. Under **Playwright Workspaces**, select **Create**.
1. On the **Basics** tab, choose your subscription and resource group, enter a unique workspace name, and select a region. The workspace and virtual network must be in the same region.
1. On the **Networking** tab, set **Configure traffic mode** to **Private**.
1. Select the virtual network that hosts your application and its delegated subnet.
1. Complete the remaining settings, select **Review + Create**, and then select **Create**.
1. Wait for the portal to report that the deployment is complete.

## Choose what to do next

- To automate a browser with an AI agent, follow [Quickstart: Automate browser tasks with the Playwright Workspaces remote MCP server](../quickstart-automate-browser-tasks-remote-mcp.md).
- To automate browsers with a Microsoft Foundry agent, see [Use the browser automation tool](/azure/foundry/agents/how-to/tools/browser-automation?tabs=prompt-agents&pivots=python).
- To run Playwright tests in the workspace, see [Run Playwright tests at scale](../../playwright-workspaces/quickstart-run-end-to-end-tests.md).

## Understand the limitations

- The virtual network and workspace must be in the same subscription and Azure region.
- A workspace configured with private website access can't use regional affinity.
- After you configure the workspace with a subnet, you can't change the subnet.

## Troubleshoot private website access

If you encounter errors while creating a private workspace or connecting it to your virtual network, see [Troubleshoot private workspace creation for privately hosted websites](../../playwright-workspaces/troubleshoot-private-websites.md).

