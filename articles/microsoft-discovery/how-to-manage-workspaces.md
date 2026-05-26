---
title: Manage workspaces in Microsoft Discovery
description: Learn how to create, update, browse, and delete Microsoft Discovery workspaces in the Azure portal, including networking configuration and supercomputer management.
author: leijgao
ms.author: leijiagao
ms.service: azure
ms.topic: how-to
ms.date: 04/02/2026
---

# Manage workspaces in Microsoft Discovery

> **Applies to:** Microsoft Discovery (Public Preview)

This article describes how to create, update, browse, and delete a **Microsoft Discovery workspace** using the Azure portal.

## Overview

A **workspace** is a collaborative environment in Microsoft Discovery where teams manage large-scale scientific initiatives. Workspaces bring together infrastructure resources such as supercomputers, agents, tools, and knowledge bases (Bookshelves) into a single secure boundary. You can create projects under workspaces, allowing researchers to organize experiments, analyze data, and use AI agents within a shared space.

After you create a workspace, you can:

- Update the supercomputers attached to the workspace
- Enable or disable public network access
- Browse attached supercomputers, chat model deployments, and project resources

## Prerequisites

Before you begin, make sure the following requirements are met:

- An active [Azure subscription](https://aka.ms/discovery/publicpreviewportal) that is enabled for Microsoft Discovery **Public Preview** support.
- **Microsoft Discovery Platform Administrator (Preview)** role or **Owner** role on the resource group.
- A virtual network with the required subnets (`workspaceSubnet`, `privateEndpointSubnet`, `agentSubnet`). For more information, see [Quickstart: Get started with Microsoft Discovery Infrastructure](quickstart-infrastructure-portal.md#c-create-a-virtual-network-and-subnets).
- A **user-assigned managed identity (UAMI)** with the required role assignments. For more information, see [Create a User Assigned Managed Identity (UAMI)](quickstart-infrastructure-portal.md#d-create-a-user-assigned-managed-identity-uami).
- At least one **supercomputer** created and available for attachment. For more information, see [Manage Supercomputer and Nodepools](how-to-manage-supercomputers.md).

## Create a workspace

For a complete step-by-step guide to creating a workspace along with all prerequisite resources, see [Quickstart: Get started with Microsoft Discovery Infrastructure](quickstart-infrastructure-portal.md#4-create-a-workspace).

The following steps summarize the workspace creation process:

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Workspaces**.
1. Select **+ Create**.
1. On the **Basics** tab, specify:
   - **Subscription**
   - **Resource group**
   - **Name** — must be globally unique and use only lowercase letters
   - **Region**
1. Select **Next**.
1. On the **Networking** tab, configure:
   - **Public network access** — select **Enable** or **Disable** based on your requirements.
   - **Private Endpoint subnet**
   - **Agent subnet**
   - **Workspace subnet**
1. Select **Next**.
1. On the **Encryption** tab, choose whether to enable customer-managed keys (CMK) or use Microsoft-managed keys (MMK). Select **Next**.
1. On the **Supercomputer** tab, select **Add Supercomputer** and choose your subscription, resource group, and supercomputer. Select **Next**.
1. On the **Workspace Identity** tab, select **Add** under **User Assigned Managed Identity (UAMI)** and select the identity to provide access to the workspace. Select **Next**.
1. Add tags as needed, then select **Next**.
1. Review the Terms and Conditions, then select **Review + Create**.
1. Once validation is successful, select **Create**.

> [!IMPORTANT]
> Make sure your workspace name is globally unique and uses only lowercase letters. Workspace creation typically takes several minutes. Wait until the provisioning state shows **Succeeded** before proceeding.

## Update a workspace

After a workspace is created, you can update the following properties:

- **Supercomputers** — attach or detach supercomputers from the workspace
- **Networking** — enable or disable public network access

### Update supercomputers

You can attach additional supercomputers to a workspace or detach existing ones.

#### Attach a supercomputer

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Workspaces** and select your workspace.
1. In the left navigation pane, under **Settings**, select **Supercomputers**.
1. Select **Add Supercomputer**.
1. Choose the subscription, resource group, and supercomputer to attach.
1. Select **Save**.

#### Detach a supercomputer

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Workspaces** and select your workspace.
1. In the left navigation pane, under **Settings**, select **Supercomputers**.
1. Select the supercomputer you want to detach.
1. Select **Delete**.
1. Confirm the removal and select **Save Changes**.

> [!IMPORTANT]
> Detaching a supercomputer doesn't delete the supercomputer resource. It only removes the association between the workspace and the supercomputer. Ensure that no active workloads depend on the supercomputer before detaching it.

### Update networking

You can enable or disable public network access for a workspace after creation.

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Workspaces** and select your workspace.
1. In the left navigation pane, under **Settings**, select **Networking**.
1. Select **Enable from all networks** or **Disabled** based on your requirements.
1. Select **Apply** to save the changes.

> [!NOTE]
> Disabled meaning restricts the workspace to private network connectivity only. Ensure that users and services can reach the workspace through private endpoints, VPN, or ExpressRoute before disabling public access.

## Browse workspace resources

The workspace overview in the Azure portal provides access to the key resources associated with your workspace. You can browse the following resources:

### Supercomputers

To view the supercomputers attached to your workspace:

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Workspaces** and select your workspace.
1. In the left navigation pane, under **Settings**, select **Supercomputers**.

This page lists all supercomputers currently attached to the workspace, along with their provisioning state, region, and resource group.

### Chat model deployments

To view the chat model deployments configured for your workspace:

- In the workspace resource, in the left navigation pane, under **Settings**, select **Chat Model Deployments**.

This page lists all model deployments associated with the workspace, including the model name, format, and deployment status. You can also create new chat model deployments from this page. For more information, see [Create Chat Model Deployment](quickstart-infrastructure-portal.md#6-create-chat-model-deployment).

### Projects

To view the projects created under your workspace:

- In the workspace resource, in the left navigation pane, under **Settings**, select **Projects**.

This page lists all projects associated with the workspace, including the project name, location, and creation date.

## Delete a workspace

Before you delete a workspace, ensure the following:

- All **projects** under the workspace are deleted.
- No active workloads are running on supercomputers attached to the workspace.

> [!WARNING]
> Deleting a workspace is a permanent action and can't be undone. All configuration, chat model deployments, and project associations are removed.

To delete a workspace:

1. Sign in to the [Azure portal](https://aka.ms/discovery/publicpreviewportal).
1. In the search bar, enter **Microsoft Discovery Workspaces** and select your workspace.
1. On the **Overview** page, select **Delete**.
1. Confirm the deletion by typing the workspace name.
1. Select **Delete**.

> [!NOTE]
> Deleting a workspace doesn't delete the supercomputer resources or the storage accounts associated with it. Those resources must be deleted separately if no longer needed.

## Troubleshooting common issues

### Workspace creation failures

- **Name conflict**: Workspace names must be globally unique and lowercase. Choose a different name if creation fails with a naming conflict.
- **Insufficient permissions**: Ensure you have the **Microsoft Discovery Platform Administrator (Preview)** role or **Owner** role on the resource group.
- **Subnet delegation**: Verify that `workspaceSubnet` and `agentSubnet` have the `Microsoft.App/environments` subnet delegation configured.
- **Quota limitations**: Check that sufficient quotas are available in the target region. For more information, see [Quota reservations](concept-quota-reservation.md).

### Networking issues

- **Public access disabled but can't connect**: Ensure private endpoints, VPN, or ExpressRoute is configured for the workspace virtual network.
- **Studio access errors**: If you disabled public network access, users must access [Microsoft Discovery Studio](https://studio.discovery.microsoft.com) through a private network path.

## Related content

- [Quickstart: Get started with Microsoft Discovery Infrastructure](quickstart-infrastructure-portal.md)
- [Manage Supercomputer and Nodepools](how-to-manage-supercomputers.md)
- [Quota reservations for Microsoft Discovery](concept-quota-reservation.md)
- [Get started with agents and investigations in Microsoft Discovery Studio](quickstart-agents-studio.md)
