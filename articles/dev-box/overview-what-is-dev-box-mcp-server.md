---
title: What is Microsoft Dev Box MCP Server?
titleSuffix: Microsoft Dev Box
description: Overview of the Microsoft Dev Box Model Context Protocol (MCP) Server that enables AI agents to interact with Dev Box resources through natural language commands.
services: dev-box
ms.service: dev-box
ms.custom: devx-track-javascript
ms.ai-usage: ai-generated
ms.update-cycle: 90-days
ms.topic: overview
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/05/2025

#Customer intent: As a developer, I want to understand what the Dev Box MCP Server is and how it can help me manage my dev boxes through AI agents.
---

# What is Microsoft Dev Box MCP Server?

The Microsoft Dev Box Model Context Protocol (MCP) Server is an open-source integration layer that connects AI agents with Microsoft Dev Box services. It enables natural language interactions for managing dev boxes, checking their status, running customization tasks, and performing other developer-focused operations—all without leaving your development environment.

Built on the [Model Context Protocol](https://modelcontextprotocol.io/), this server acts as a bridge between AI agents and the Microsoft Dev Box platform, allowing developers to use conversational commands instead of switching between multiple interfaces or remembering complex CLI syntax.

## Key scenarios

The Dev Box MCP Server excels in several common development scenarios:

- **Daily development workflow**: Quickly start, stop, or check the status of your dev boxes before beginning work, without opening the Azure portal or developer portal
- **Project switching**: Seamlessly switch between different dev boxes for different projects, create new dev boxes for feature branches, or clean up old environments
- **Team collaboration**: Share dev box pool information with team members, coordinate resource usage, and help onboard new developers with appropriate dev box configurations
- **Troubleshooting and maintenance**: Repair connectivity issues, check operation status, view logs, and manage schedules without context switching between tools
- **Customization management**: Install software packages, apply team customizations, run setup scripts, and configure development environments through conversational commands

## Supported tools

The Dev Box MCP Server provides comprehensive coverage of Dev Box operations through several tool categories:

- **Dev Box lifecycle management**: Create, delete, start, stop, restart, and repair dev boxes across all your projects
- **Project and pool discovery**: Browse available projects, view dev box pools, and understand pool configurations and capabilities
- **Power and schedule management**: Control dev box power states, manage shutdown schedules, delay, or skip scheduled actions
- **Customization and configuration**: Apply team customizations, run individual tasks, install packages, set themes, and view customization logs
- **Monitoring and diagnostics**: Check operation status, view task logs, monitor long-running operations, and troubleshoot connectivity issues
- **Resource exploration**: Use scope patterns to target specific resources and get contextual information about your Dev Box environment

For a complete list of supported operations and their scope patterns, see the [Dev Box MCP Server repository - Currently Supported Tools](https://github.com/microsoft/devbox-mcp-server?tab=readme-ov-file#%EF%B8%8F-currently-supported-tools).

## Authentication

The Dev Box MCP Server uses [DefaultAzureCredential](/javascript/api/@azure/identity/defaultazurecredential) and [Web Account Manager (WAM)](/entra/identity-platform/scenario-desktop-acquire-token-wam) based brokered authentication for seamless Azure integration.

## Next steps

Ready to enhance your development workflow with AI-powered Dev Box management? 

See the [Tutorial: Get started with the Dev Box MCP Server](tutorial-get-started-dev-box-mcp-server.md) for step-by-step setup and usage instructions.
