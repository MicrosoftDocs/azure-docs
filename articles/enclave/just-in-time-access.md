---
title: Configure just-in-time access in Azure Enclave
description: Learn how to configure just-in-time (JIT) access for Azure Enclave resources by using Microsoft Entra Privileged Identity Management (PIM).
author: jadean-msft
ms.author: jadean
ms.service: azure-enclave
ai-usage: ai-assisted
ms.topic: how-to
ms.date: 08/18/2026
---

# Configure just-in-time access in Azure Enclave with Privileged Identity Management

Azure Enclave resources are secured with Azure role-based access control (RBAC), and you can use Microsoft Entra Privileged Identity Management (PIM) to provide just-in-time (JIT) access to the roles that grant that access. PIM lets users request temporary, time-bound role assignments to perform specific tasks, which reduces the risk of overprovisioning and unauthorized actions. This article explains how to configure JIT access to Azure Enclave resource scopes by using PIM.

[Microsoft Entra Privileged Identity Management (PIM)](/entra/id-governance/privileged-identity-management/pim-configure) is a service that helps you manage, control, and monitor access within your Azure environment. When you use PIM to govern the Azure roles assigned on your Azure Enclave subscription or resource groups, you can enforce a controlled and secure activation workflow for role-based access. Azure Enclave also has a separate, built-in [Approvals feature](./what-approvals.md) that governs specific resource actions, such as enclave creation, maintenance mode changes, and connection or endpoint updates. PIM and the Approvals feature are independent controls and don't gate each other.

## Overview

Combining PIM with Azure Enclave roles gives you the following capabilities:

- **Eligible role assignments**: Instead of granting standing access, you make users eligible for roles such as Community Owner or Enclave Owner. Users then activate the role only when they need it.
- **Approval-gated activation**: You can require an approver to review and approve a role activation request before the requesting user gains access.
- **Time-bound access**: Activated roles are automatically revoked after a configured maximum duration, reducing the window of privileged access.
- **Auditing**: PIM logs activation requests, approvals, denials, and expirations, so you can track who accessed sensitive resources and when.

This approach aligns with the principle of least privilege and helps your organization maintain a strong security posture in Azure Enclave.

## Prerequisites

Before you configure JIT access with PIM, make sure you have:

- An active Azure subscription.
- A Microsoft Entra ID license that [supports PIM](/entra/id-governance/privileged-identity-management/pim-getting-started#prerequisites).
- Permissions to manage PIM, such as the `Privileged Role Administrator` role in Microsoft Entra ID, or `Owner` or `User Access Administrator` on the target subscription or resource group.
- One or more [built-in Azure Enclave roles](./built-in-rbac-roles.md) that you want to manage through PIM, such as Community Owner, Enclave Owner, or Enclave Approver Role.

> [!NOTE]
> Confirm the current licensing and permission requirements for your tenant before you roll out PIM broadly.

## Configure JIT access with PIM

### Step 1: Enable Privileged Identity Management

1. In the Azure portal, go to `Microsoft Entra ID`.
1. Select `Privileged Identity Management` from the menu.
1. Follow the on-screen instructions to enable PIM for your directory.

### Step 2: Assign roles for enclave resources

1. In the PIM dashboard, select **Azure resources**.
1. Choose the subscription or resource group that contains your Azure Enclave resources.
1. Assign the [built-in Azure Enclave roles](./built-in-rbac-roles.md) to users or groups as eligible assignments. Common roles include:
   - `Community Owner`: Full access to manage community, enclave, community endpoint, and transit hub resources.
   - `Enclave Owner`: Full access to manage workloads, endpoints, and connections for one or more enclaves.
   - `Enclave Reader` or `Community Reader`: Read-only access for monitoring and compliance.
   - `Enclave Approver Role`: Read-only access plus permission to approve or deny pending [approval requests](./what-approvals.md).
1. For each role, configure the following settings:
   - `Assignment type`: Set to `Eligible` so the role requires activation for JIT access.
   - `Assignment scope`: Limit the role to specific resources, such as the enclave-managed resource group or workload resource groups.

### Step 3: Define approval settings

1. Go to the role's settings in PIM.
1. Enable **Require approval to activate**.
1. Specify approvers, such as administrators or project managers, who validate access requests.
1. Configure **Notification settings** to alert approvers and users when requests are made or approved.

### Step 4: Configure activation policies

In the role's settings, define activation conditions:
   - **Maximum activation duration**: Set the duration, such as 1 hour or 8 hours, for which the role is active after approval.
   - **Require multifactor authentication**: Require MFA for all activations.
   - **Justification**: Require users to provide a reason for requesting access.

### Step 5: Test the configuration

1. Assign the configured role to a test user.
1. Have the user request activation for the role:
   1. The user goes to the `PIM dashboard` and selects `My roles`.
   1. The user chooses the role and submits an activation request with a justification.
1. Approve the request to validate the workflow.
1. Verify that permissions are granted and automatically revoked after the specified duration.

## Benefits of JIT access in Azure Enclave

- **Enhanced security**:
  - Time-bound access minimizes exposure to sensitive resources.
  - Conditional Access enforces strong identity and device verification.

- **Operational flexibility**:
  - Users can quickly request and receive the permissions they need for specific tasks.
  - Approvers retain control over who accesses enclave resources and when.

- **Compliance and auditability**:
  - Logs of all access requests, approvals, and actions provide traceability for audits.
  - Integration with tools like Azure Monitor and Microsoft Sentinel enhances visibility.

## Related content

- [Understand built-in RBAC roles in Azure Enclave](./built-in-rbac-roles.md)
- [Configure Approvals in Azure Enclave](./configure-approvals.md)
- [Understand Approvals in Azure Enclave](./understand-approvals.md)
- [Microsoft Entra Conditional Access policies](/entra/identity/conditional-access/overview)
- [Azure Monitor overview](/azure/azure-monitor/fundamentals/overview)
- [Microsoft Sentinel overview](/azure/sentinel/overview)
