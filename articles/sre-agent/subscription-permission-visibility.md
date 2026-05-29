---
title: Subscription Permission Visibility in Azure SRE Agent
description: Learn how Azure SRE Agent shows all your Azure subscriptions in the assignment picker including those requiring elevated access.
ms.topic: concept-article
ms.service: azure-sre-agent
ms.date: 04/24/2026
author: dm-chelupati
ms.author: dchelupati
ms.ai-usage: ai-assisted
ms.custom: subscriptions, permissions, assignment picker, user roles, RBAC
---

# Subscription permission visibility in Azure SRE Agent

When you set up your agent's monitoring scope, select which Azure subscriptions the agent can access. The subscription picker previously showed only subscriptions where you had Owner or User Access Administrator permissions - the roles needed to grant the agent its required Reader access.

If you didn't have these roles on a subscription, it simply didn't appear. This limitation created three problems:

- **Missing subscriptions** - you expected to see 20 subscriptions but the picker showed only 5, with no explanation of why.
- **Unclear next steps** - without knowing which subscriptions were hidden or why, you couldn't tell whether the issue was a permissions problem, a bug, or a filtering error.
- **Context switching** - to figure out what was going on, you had to leave the SRE Agent portal, open Azure portal, navigate to each subscription's access control page, and check your role assignments individually.

> [!TIP]
> - The assignment picker shows all subscriptions, including those you can't currently assign.
> - Subscriptions that require elevated permissions appear in a labeled "Requires Owner or User Access Administrator role" section.
> - The "User role" column shows your current role on each subscription.
> - No configuration needed - permission visibility is always active.

## How it works

The subscription picker organizes your subscriptions into two clearly labeled sections.

**Subscriptions you can assign**: Subscriptions where you have Owner or User Access Administrator permissions. Select these subscriptions to add them to your agent's monitoring scope.

**Requires Owner or User Access Administrator role**: Subscriptions where you lack the permissions needed to grant the agent Reader access. These subscriptions appear with disabled checkboxes and reduced opacity, showing they exist but can't be selected.

Both sections display a **User role** column that shows your highest-privilege role on each subscription: Owner, Contributor, Reader, User Access Administrator, or custom roles. If you have no role, the column shows a blank value.

The picker also includes:

- A description explaining which role the agent needs and who can grant it
- A **Learn more about user roles** link to Azure RBAC documentation
- Search that filters both sections simultaneously by subscription name or ID
- Role inheritance detection - roles assigned at management group or tenant level correctly appear for child subscriptions

## What makes this different
The change is about information, not restriction. The picker's selection behavior didn't change - you can still only assign subscriptions where you have the right permissions. The change is that you now see everything.

**Role inheritance detection** - your roles are detected across management groups, subscription-level assignments, and resource group scopes. A role assigned at a management group level correctly appears for all child subscriptions.

**Actionable context** - the "User role" column tells you exactly what role you have, and the accordion header tells you exactly what role you need. No guessing, no detective work.

**Search across all subscriptions** - the search box filters both selectable and disabled sections simultaneously, including by subscription ID.

## Before and after

| Aspect | Before | After |
|--------|--------|-------|
| **Subscriptions without permissions** | Hidden and not visible in picker | Visible in "Requires Owner or User Access Administrator role" section |
| **Your current role** | Only shown for selectable subscriptions | Shown for all subscriptions in "User role" column |
| **Why a subscription can't be assigned** | No explanation; check Azure portal IAM | Clear label and accordion header explain required role |
| **Finding a specific subscription** | Search by name in selectable list only | Search by name or ID across both sections |
| **RBAC requirements** | Brief message: "Only Owner or UAA resources shown" | Detailed description with link to Azure RBAC documentation |
| **Role inheritance** | Only direct subscription-level roles detected | Roles from management groups, tenant root, and child scopes detected |

## Resolving permission issues

If you see subscriptions in the "Requires Owner or User Access Administrator role" section:

1. Note the subscription name and your current role from the **User role** column
1. Contact your Azure administrator or the subscription owner
1. Request the **Owner** or **User Access Administrator** role on the subscription
1. Return to the subscription picker. The subscription now appears in the "Subscriptions you can assign" section

You can also select the external link icon next to any subscription name to open that subscription in Azure portal, where you can view its access control settings directly.

## Where it appears

The updated subscription picker appears when you add subscriptions in two places:

- **During onboarding**: Step 2 "Agent Scope," Infrastructure tab, "Add subscriptions"
- **After setup**: Settings → Managed resources → "Add subscription"

## Related capabilities

| Capability | What it adds |
|-----------|-------------|
| [Agent setup](overview.md) | The subscription picker is part of the agent setup flow. |
| [Managed resources](complete-setup.md) | Configure which subscriptions and resource groups the agent monitors. |
