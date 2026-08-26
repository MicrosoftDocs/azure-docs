---
title: Get started with Azure Container Apps Sandboxes (preview)
description: Choose a setup path for Azure Container Apps Sandboxes (preview), including portal, Azure Container Apps CLI, Python SDK, Bicep, and agent skills options.
#customer intent: As a developer building AI agents, I want to choose the right setup path for Azure Container Apps Sandboxes so that I can start with the tools that match my workflow.
author: craigshoemaker
ms.author: cshoe
ms.reviewer: cshoe
ms.date: 08/20/2026
ms.service: azure-container-apps
ms.topic: overview
---

# Get started with Azure Container Apps Sandboxes (preview)

Azure Container Apps Sandboxes let you run untrusted or AI-generated code in isolated environments with explicit lifecycle control. Use this article to choose the setup path that best fits how you want to create and manage sandboxes.

> [!IMPORTANT]
> To manage and create sandboxes, you need the Azure role *Container Apps SandboxGroup Data Owner*. Assign this role to all users who create and manage sandboxes.
>
> Sandboxes created during preview might not be compatible with future releases and might need to be recreated.
>
> The API surface for Python SDK and Azure Container Apps CLI commands might change during preview.

## Choose your path

| Path | Best for | Prerequisites |
|---|---|---|
| **Azure portal** | First-time setup, visual exploration, and portal-based resource creation. | An Azure subscription, Azure portal access, and the required sandbox role assignment. |
| **CLI** | Terminal-based setup, repeatable commands, and scripting basic sandbox workflows. | The Azure Container Apps CLI, an active Azure sign-in, an Azure subscription, and the required sandbox role assignment. |
| **Python SDK** | Applications, automation, and agent workflows that need to create or manage sandboxes programmatically from Python. | Python, the `azure-containerapps-sandbox` package, an Azure sign-in, an Azure subscription, and the required sandbox role assignment. |
| **Bicep** | Infrastructure-as-code workflows that define sandbox groups alongside other Azure resources. | Bicep tooling, deployment access to the target subscription or resource group, and the required sandbox role assignment. |
| **Agent skills** | Coding-agent workflows where an agent operates Sandboxes through supported commands. | A coding-agent environment that supports agent skills for Sandboxes, an Azure subscription, and the required sandbox role assignment. |

## Before you start

You need the following items for any setup path:

- An Azure subscription.
- The **Container Apps SandboxGroup Data Owner** role assigned at the subscription or resource group scope.
- A target resource group and Azure region for the sandbox group.

Install only the tools required for the path you choose:

- For the Azure portal path, open the Azure portal. You can go directly to Sandboxes at [https://sandboxes.azure.com](https://sandboxes.azure.com).
- For the CLI path, install the Azure Container Apps CLI and sign in to Azure.
- For the Python SDK path, install Python and the `azure-containerapps-sandbox` package.
- For the Bicep path, install Bicep tooling and use an account that can deploy resources to the target scope.
- For the agent skills path, use a coding-agent environment that supports agent skills for Sandboxes.

> [!NOTE]
> Sandboxes reduce the risk of running untrusted code, but they don't make that code inherently safe. Assign the **Container Apps SandboxGroup Data Owner** role only to identities that need it, and prefer resource group scope over subscription scope. Review the [networking](sandboxes-egress-policies.md) and [lifecycle](sandboxes-snapshots-state-management.md) controls before you run untrusted code.

## What you create

Each setup path helps you create the same core resources:

- A **sandbox group**, which is an Azure Resource Manager resource in a resource group and region.
- One or more **sandboxes** scoped to that sandbox group.

When you no longer need these resources, delete the sandbox group to remove the sandboxes and related resources created within that group.

## Related content

- [Azure Container Apps Sandboxes overview](sandboxes-overview.md)
- [Networking in Azure Container Apps Sandboxes](sandboxes-egress-policies.md)
- [Snapshots and state management for Azure Container Apps Sandboxes](sandboxes-snapshots-state-management.md)
- [Dynamic sessions in Azure Container Apps](sessions.md)
