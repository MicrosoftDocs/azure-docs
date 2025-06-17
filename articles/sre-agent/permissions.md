---
title: Configure permissions in Azure SRE Agent (preview)
description: Learn how to configure and manage permissions for Azure SRE Agent to operate in review or autonomous modes when managing your resources.
author: craigshoemaker
ms.author: cshoe
ms.topic: tutorial
ms.date: 06/17/2025
ms.service: azure
---

# Configure permissions modes in Azure SRE Agent (preview)

Azure SRE Agent allows you to decide if you want the agent to act on its own (*autonomous mode*), or with your input (*review mode*).

As the agent works in review mode, it requires your approval for every action or write operation it performs. In autonomous mode, the agent performs these actions on your behalf, without stopping for explicit approval.

## Permission requirements

When working with Azure SRE Agent permissions, consider the following key points:

### Prerequisites for provisioning

When provisioning the SRE Agent, you must have either the **Owner** or **User Access Administrator** built-in role, or a custom role with equivalent permissions. This requirement allows you to assign resource groups to the agent, even if you don't have permissions to perform all operations on the resources being managed.

### Managing resource groups

You can add or remove resource groups from the agent to control its scope of operation:

- **Adding resource groups** grants the agent permissions to the resources within those groups

- **Removing resource groups** revokes the agent's access to those resources

## Agent behavior based on permission mode

The following table summarizes how the agent behaves based on its operational mode and available permissions:

| Mode | Identity has permissions | Behavior |
|---|---|---|
| Review | Yes  | ▪ Prompt user for approval<br>▪ If the user approves, perform action using the agent identity<br>▪ If the user declines, doesn't take any action and finishes the thread. |
| Review | No  | ▪ Prompt user for approval<br>▪ If user approves, provide 3 options (give agent permissions, use user permissions, give instructions for user to execute)<br>▪ If the user declines, doesn't take any action and finishes the thread |
| Autonomous | Yes | ▪ Perform action using the agent identity  |
| Autonomous | No | ▪ Provides 3 options (give agent permissions, use user permissions, give instructions for user to execute)  |

> [!NOTE]
> You can't directly remove specific permissions from the agent. To restrict the agent's access, you must remove the entire resource group from the agent's scope.

## Related content

- [Azure SRE Agent overview](overview.md)
