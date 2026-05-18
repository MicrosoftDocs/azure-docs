---
title: "Tutorial: Set Up Cross-Account Azure DevOps Access in Azure SRE Agent"
description: Connect your agent to Azure DevOps repositories in a different tenant using cross-account OAuth.
ms.topic: tutorial
ms.service: azure-sre-agent
ms.date: 04/03/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: azure devops, cross-account, multi-tenant, oauth, tutorial
---

# Tutorial: Set up cross-account Azure DevOps access in Azure SRE Agent

Connect your agent to an Azure DevOps organization in a different Microsoft Entra ID tenant. Your agent gains access to repositories, wikis, and code in the cross-tenant organization by using your Microsoft identity through a browser sign-in popup.

**Time**: ~5 minutes

## Prerequisites

- An Azure SRE Agent created in the [Azure SRE Agent portal](https://sre.azure.com)
- A Microsoft account with access to the target Azure DevOps organization (in the other tenant)
- **SRE Agent Administrator** or **Standard User** role on the agent
- A browser that allows popups from `sre.azure.com`

## Step 1: Open Knowledge Base settings

1. Open your agent in the [Azure SRE Agent portal](https://sre.azure.com).
1. In the left sidebar, expand **Builder**.
1. Select **Knowledge sources**.

**Checkpoint:** The page displays an **Add repository** button.

## Step 2: Open the Add Repository dialog

Select **Add repository**.

**Checkpoint:** You see platform cards for **GitHub** and **Azure DevOps**.

## Step 3: Select Azure DevOps and choose Auth

1. Select the **Azure DevOps** platform card.
1. Three authentication options appear: **Auth**, **Managed Identity**, and **PAT**.
1. Select **Auth**.

| Authentication method | When to use |
|----------------------|-------------|
| **Auth** (OAuth) | Sign in with your Microsoft account. Best for cross-tenant access |
| **Managed Identity** | Use the agent's managed identity. Best for same-tenant, service-level access |
| **PAT** | Provide a Personal Access Token. Use as a fallback for restricted environments |

**Checkpoint:** The **Auth** radio button is selected and an **Organization** text field appears.

## Step 4: Enter the organization name

1. In the **Organization** field, type the name of the Azure DevOps organization in the other tenant. For example, if the ADO URL is `https://dev.azure.com/contoso-platform`, enter `contoso-platform`.
1. The **Sign in to Azure DevOps** button becomes enabled.

**Checkpoint:** The **Sign in to Azure DevOps** button is active.

## Step 5: Authorize access

1. Select **Sign in to Azure DevOps**. The **Authorize Azure DevOps** dialog appears listing the permissions being requested.
1. Select **Authorize**. A sign-in popup window opens.
1. **Select or sign in with the account** that has access to the target ADO organization.
1. After authenticating, the popup closes automatically.

> [!NOTE]
> If the sign-in popup doesn't appear, check that your browser isn't blocking popups from `sre.azure.com`.

**Checkpoint:** The dialog shows **Connected to Azure DevOps**.

## Step 6: Select repositories

1. Select **Next** to advance to Step 2 of the wizard.
1. Select the **Azure DevOps Project** from the dropdown.
1. Choose the repositories you want to connect.
1. Select **Save**.

**Checkpoint:** The Knowledge Base settings page lists the newly connected repositories.

## Step 7: Verify the connection

1. Return to the **Knowledge sources** settings page.
1. Verify that the connected repositories appear in the list.
1. Open your agent's chat and ask a question referencing content from the cross-tenant repositories.

**Checkpoint:** The agent references content from the cross-tenant ADO repositories in its response.

## Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Sign-in popup doesn't appear | Browser popup blocker is active | Allow popups from `sre.azure.com` |
| Popup opens but sign-in fails | The selected account doesn't have access | Verify your account has at least Reader access in the target ADO org |
| "Connected" shows but no repos appear | Account has org-level but not project-level access | Verify your account has access to at least one project |
| Token expired error after some time | The stored authorization has expired | Repeat the sign-in flow |

## Related content

- [Cross-account Azure DevOps access](cross-account-ado-oauth.md)
- [Connect source code repositories](connect-source-code.md)
- [Set up Azure DevOps connector](azure-devops-connector.md)
