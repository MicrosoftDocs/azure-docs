---
title: Permissions and prerequisites
titleSuffix: Azure Workload Center for Oracle
description: Learn the permissions and prerequisites to enroll an Oracle workload in Azure Workload Center for Oracle.
author: teja-san
ms.author: tsankranthi
ms.service: oracle-on-azure
ms.collection: linux
ms.topic: get-started
ms.date: 11/06/2026
ai-usage: ai-assisted
---
# Permissions and prerequisites

Before you enroll an Oracle system in Azure Workload Center for Oracle, review the required preview access, resource provider registrations, and permissions for users and managed identities.

## Prerequisites for enrollment

Complete these prerequisites before you enroll an Oracle system. When they're in place, configuration validation and workload health observability start automatically after enrollment.

### Get access to the preview

Azure Workload Center for Oracle is in limited preview. Before you start, [register your interest in the Azure Workload Center for Oracle preview](https://aka.ms/workloadcenter/Oracle-signup). After Microsoft enables the subscription, you can enroll Oracle systems in the Azure portal.

### Register the resource providers

Register these resource providers in the subscription where you create the *Workload Virtual Instance (WVI)*.

1.  Sign in to the Azure portal and open your subscription.

2.  Select **Settings** > **Resource providers**.

3.  Search for **Microsoft.Workloads**, select it, and then select **Register**. Wait until the status is **Registered**.

:::image type="content" source="media/get-started-prerequisites-permissions/register-provider-not-registered.png" alt-text="Screenshot that shows the Resource providers page of a subscription with Microsoft.Workloads in the NotRegistered state and the Register button." lightbox="media/get-started-prerequisites-permissions/register-provider-not-registered.png":::

:::image type="content" source="media/get-started-prerequisites-permissions/register-provider-registered.png" alt-text="Screenshot that shows the Microsoft.Workloads resource provider in the Registered state." lightbox="media/get-started-prerequisites-permissions/register-provider-registered.png":::

4.  Search for **Microsoft.CloudHealth**, select it, and then select **Register**.

### Identify the scope

- Identify the subscription and resource group where you want to create the WVI.

- Identify the subscriptions and resource groups that contain the resources of the Oracle system. A WVI can contain resources from more than one subscription.

### User permissions

The user who enrolls the system needs these permissions. You don't need permissions on the whole subscription.

- You need the **Contributor** role on the resource group where you create the WVI. Instead of Contributor, you can use a custom role with these permissions:

  - Microsoft.Workloads/virtualInstances/write

  - Microsoft.Workloads/virtualInstances/read

  - Microsoft.Workloads/virtualInstances/instanceMonitors/read

  - Microsoft.Workloads/virtualInstances/instanceMonitors/write

  - Microsoft.CloudHealth/healthmodels/read

  - Microsoft.CloudHealth/healthmodels/write

- You need the **Reader** role on the Azure resources that are part of the Oracle system.

- To view workload health, you need the **Monitoring Reader** role on the WVI resource group or on the health model resource.

- If you use an existing managed identity, you need the **Managed Identity Operator** role on that identity. At minimum, you need the `Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action` permission on it, so that you can attach the identity to the WVI.

- If you let the portal create the managed identity, you need three more permissions:

  - You need the **Role Based Access Control Administrator** role on each mapped resource.

  - You also need the **Managed Identity Operator** role on the WVI resource group.

  - **Microsoft.Resources/deployments/write** permission on the resource group of each mapped resource.

### User-assigned managed identity

Azure Workload Center for Oracle uses a user-assigned managed identity to access the resources of the Oracle system. Resource discovery, configuration validation, and workload health use this identity. A managed identity is an identity in Microsoft Entra ID that an Azure service uses to access other resources without passwords

You can choose one of two options on the **Settings** tab during enrollment:

- **Create new user assigned managed identity**: The portal creates the identity and assigns the roles that it needs. You can't use this option if any component uses Azure Resource Graph query-based discovery

- **Use existing user assigned managed identity**: Create the identity and assign its roles before you enroll. Use this option if you use Azure Resource Graph query-based discovery, or if you don't want to give the identity the Virtual Machine Contributor role

The identity needs these roles:

| **Role**                                        | **Scope**                                                  | **What it allows**                                                          |
|-------------------------------------------------|------------------------------------------------------------|-----------------------------------------------------------------------------|
| **Contributor**                                 | The resource group where you create the WVI                | Create and update the WVI and its health model                              |
| **Reader**                                      | The resources of the Oracle system                         | Read resource properties for discovery and checks                           |
| **Monitoring Reader**                           | The resources of the Oracle system                         | Read metrics for health signals                                             |
| **Virtual Machine Contributor** (optional)      | The VMs of the Oracle system                               | Run operating system checks on the VMs                                      |
| **Reader** (only for ARG query-based discovery) | Each subscription or resource group in the discovery rules | Run the discovery rules every hour to find resources that you add or remove |

Instead of Contributor on the WVI resource group, you can use a custom role. The custom role needs all permissions of the **Monitoring Contributor** role and of the **Microsoft.CloudHealth** resource provider

Instead of Virtual Machine Contributor, you can give the identity only these Run Command permissions:

- Microsoft.Compute/virtualMachines/runCommand/write

- Microsoft.Compute/virtualMachines/runCommand/read

> [!NOTE]  
> If the identity has neither Virtual Machine Contributor nor the Run Command permissions, operating system checks don't run. Azure infrastructure checks and workload health still work

## Prerequisites for using Azure Copilot Run Oracle Agent

- You need access to Azure Copilot, the AI assistant in the Azure portal. By default, Azure Copilot is available to all users in a tenant unless a tenant administrator restricts it. For more information, see [Manage access to Azure Copilot](/azure/copilot/manage-access).

- Enroll your Oracle system as a WVI, so that the agent has workload context.

- When you start a conversation, select **Run Oracle** under **Agents** in Copilot.
