---
title: "Tutorial: Connect an ADO Repository with Managed Identity in Azure SRE Agent"
description: Connect an Azure DevOps repository to your agent using managed identity authentication.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/03/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: managed identity, azure devops, ado, repository, tutorial
---

# Tutorial: Connect an ADO repository with managed identity in Azure SRE Agent

Connect an Azure DevOps repository to your agent using managed identity so you don't need to create or rotate PATs. Your agent uses its own Azure identity to access ADO repos for code-aware investigations.

**Time**: ~10 minutes (including ADO admin setup)

## Prerequisites

- An Azure SRE Agent in **Running** state
- A managed identity enabled on your agent (system-assigned or user-assigned)
- An Azure DevOps organization with at least one repository
- **SRE Agent Administrator** or **Standard User** role on the agent

## Step 1: Grant the managed identity access to your ADO organization

Before connecting from the agent portal, your managed identity must have access to the Azure DevOps organization.

1. Go to your [Azure DevOps organization settings](https://dev.azure.com/) and select your organization.
1. Go to **Organization settings** > **Users**.
1. Select **Add users**.
1. Search for your agent's managed identity by its service principal name or object ID.
1. Set the access level to **Basic** (or higher).
1. Add the identity to projects with **Code (Read)** permissions on the target repositories.

**Checkpoint:** The managed identity appears in the ADO Users list with a Basic access level.

## Step 2: Go to Knowledge sources

1. Open your agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left sidebar, expand **Builder**.
1. Select **Knowledge sources**.

**Checkpoint:** The Knowledge Sources page loads and shows any existing repository connections.

## Step 3: Open the Add Repository dialog

Select **Add repository**.

**Checkpoint:** The Add repositories dialog opens and shows platform selection cards, such as GitHub and Azure DevOps.

## Step 4: Select Azure DevOps with Managed Identity

1. Select the **Azure DevOps** platform card.
1. Under **Sign In Methods**, select **Managed Identity**.

**Checkpoint:** The managed identity configuration form appears with an organization field and identity dropdown.

## Step 5: Configure the managed identity connection

1. Enter your Azure DevOps **Organization** name, which is the part after `dev.azure.com/` in your ADO URL.
1. From the managed identity dropdown, select your identity:
   - **System assigned**: uses the agent's built-in identity
   - **User assigned**: select a specific identity attached to the agent
1. Select **Connect**.

**Checkpoint:** The button changes to **Connected** with a checkmark.

> [!NOTE]
> If the dropdown is empty, your agent might not have a managed identity enabled. Select the **Add identity** link below the dropdown to open the Azure portal Identity blade for your agent resource.

## Step 6: Advance to repository selection

Select **Next** to proceed to the repository selection step.

**Checkpoint:** The dialog advances to show a project picker and repository grid.

## Step 7: Select a project and add repositories

1. From the **Azure DevOps Project** dropdown, select the project containing your repositories.
1. Select **Add** to add a repository row.
1. From the **Repository** dropdown, select a repository from the project.
1. Enter a **Display name** for the repository.
1. Optionally, enter a **Description**.
1. Repeat for more repositories.
1. Select **Save**.

**Checkpoint:** Selected repositories appear in the Knowledge Sources page.

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Identity dropdown is empty | Agent has no managed identity enabled | Enable a system-assigned identity or attach a user-assigned identity in the Azure portal |
| **Connect** button fails | Organization name is missing | Enter the ADO organization name before connecting |
| Repos don't load after connecting | MI doesn't have access to the ADO organization | Add the MI service principal as a user in ADO Organization Settings > Users |
| FIC connection fails | FederatedClientId and FederatedTenantId not both provided | Both fields are required when using FIC. Provide both or neither |

## Related content

- [Azure DevOps connector](ado-connector.md): All ADO authentication options including managed identity, OAuth, and PAT
- [Connect knowledge sources](connect-knowledge.md)
- [Set up Azure DevOps connector](azure-devops-connector.md)
