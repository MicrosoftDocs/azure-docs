---
title: Register Azure Migrate appliance by onboarding it to Azure Arc
description: Learn how to register an Azure Migrate appliance by onboarding it to Azure Arc, without requiring tenant-level permissions.
author: molishv
ms.author: molir
ms.manager: ronai
ms.topic: how-to
ms.service: azure-migrate
ms.date: 07/27/2026
ms.update-cycle: 365-days
# Customer intent: As an IT administrator, I want to register the Azure Migrate appliance by onboarding it to Azure Arc so that I can register the appliance without tenant-level Microsoft Entra ID permissions.
---

# Register Azure Migrate appliance by onboarding it to Azure Arc

This article describes how to register an Azure Migrate appliance by onboarding it to Azure Arc. In this approach, you register the Azure Migrate appliance to an Azure Migrate project by installing the Azure Connected Machine agent (Arc agent) on the Azure Migrate appliance VM. You don't need tenant-level permissions to register the Azure Migrate appliance. This method is an alternative to [registering an Azure Migrate appliance using a pre-created Microsoft Entra ID application](how-to-register-appliance-using-entra-app.md).

## Overview

In this authentication model, onboard the Azure Migrate appliance to Azure Arc-enabled servers during registration. When you enable Azure Arc, the Azure Migrate appliance and other Azure Migrate agents use the machine's system-assigned managed identity instead of Microsoft Entra ID application based authentication. The Azure Migrate appliance requests a bearer token from the Azure Arc local metadata service (localhost endpoint) and uses that token to authenticate to Azure.

This approach avoids high-privilege steps to create and manage Microsoft Entra ID applications, and removes the operational overhead of certificate lifecycle management and credential rotation. By using this approach, you don't need tenant-level permissions to register the Azure Migrate appliance.

## Supported scenarios

Registering an Azure Migrate appliance by onboarding it to Azure Arc is supported in the following scenarios:

- The VMware and Physical stacks of the Azure Migrate appliance are supported.
- You have internet access either directly or through a proxy without authentication.

## Limitations

- The Hyper-V stack of the Azure Migrate appliance and Azure Local migrations aren't supported.
- Private link configuration isn't supported.
- Proxy servers that require credentials aren't supported.

## URL access requirements

In addition to the [standard Azure Migrate appliance URL requirements](migrate-appliance.md), you must allow the following Azure Arc-enabled servers endpoints for managed identity-based registration.

### Azure Arc-enabled servers URLs

To onboard the Azure Migrate appliance to Azure Arc-enabled servers, you need the following endpoints:

- `*.his.arc.azure.com`
- `*.guestconfiguration.azure.com`
- `guestnotificationservice.azure.com`

These URLs are required for Azure Arc onboarding and managed identity token acquisition. Ensure that firewalls or proxy devices don't block outbound HTTPS traffic to these endpoints.

## Register an Azure Migrate appliance by onboarding it to Azure Arc

> [!NOTE]
> Ensure you create an Azure Migrate project and generate a project key. For more information, see [Create and manage Azure Migrate projects](create-manage-projects.md).

Registration involves four major steps:

1. Install the Arc agent on the Azure Migrate appliance VM.
1. Assign a role to the Azure Arc-enabled machine.
1. Set the registry key on the Azure Migrate appliance.
1. Set up the Azure Migrate appliance.

### Step 1: Install the Arc agent on the Azure Migrate appliance VM

Install the Arc agent on the Azure Migrate appliance VM using either of the following methods:

- **Interactively**, by using the Azure Arc Setup wizard. See [Connect Windows Server machines to Azure through Azure Arc Setup](/azure/azure-arc/servers/onboard-windows-server#launch-azure-arc-setup-and-connect-to-azure-arc).
- **Non-interactively**, by using a Microsoft Entra service principal that has the **Azure Connected Machine Onboarding** role. See [Connect hybrid machines to Azure at scale](/azure/azure-arc/servers/onboard-service-principal).

To choose the best approach for Arc agent deployment, see [Azure Connected Machine agent deployment options](/azure/azure-arc/servers/deployment-options#onboarding-methods).

When asked for the resource group, it's recommended to choose the same resource group as the Azure Migrate project.

> [!TIP]
> Use the service principal method when Device Code Flow (DCF)-based authentication is disabled in your tenant. Because the service principal connects the machine to Azure Arc without an interactive sign-in, you can onboard the Azure Migrate appliance even when DCF is disabled. 

### Step 2: Assign a role to the Azure Arc-enabled machine

Assign the **Azure Migrate Owner** role to the Azure Arc-enabled machine on the resource group where you set up the Azure Migrate project. Optionally, assign a least-privileged [Azure Migrate built-in role](prepare-azure-accounts.md) instead, such as **Azure Migrate Decide and Plan Expert** or **Azure Migrate Execute Expert**.


If the Azure Arc-enabled machine is in a different resource group than the Azure Migrate project, ensure that you perform the role assignment on both resource groups.

To assign a role to the Azure Arc-enabled machine, follow these steps:

1. Go to the resource group where you created the Azure Migrate project, and select **Access control (IAM)**.

1. Select **Add role assignment**.

1. In the search box, type **Azure Migrate Owner** or the appropriate Azure Migrate role and make the selection.

1. Select **+ Select members**.

1. On the **Members** tab, keep the default **User, group, or service principal** for **Assign access to**, search for the name of the Azure Arc-enabled machine, select the entry, and select **Select**.

1. Select **Review + assign**.

### Step 3: Set the registry key on the Azure Migrate appliance

Add a new registry key `HKLM\SOFTWARE\Microsoft\AzureAppliance\UseManagedIdentityAuth` set to `true` on the Azure Migrate appliance machine.

### Step 4: Set up the Azure Migrate appliance

Set up the Azure Migrate appliance by using any supported method:

- [Set up an appliance for VMware](how-to-set-up-appliance-vmware.md)
- [Set up an appliance for physical servers](how-to-set-up-appliance-physical.md)

During Azure Migrate appliance configuration, enter the Azure Migrate project key and select **Register** to register the Azure Migrate appliance by onboarding it to Azure Arc. After successful registration, the Arc agent appears in the Azure sign-in step in the appliance configuration manager.

## Optional: Onboard a scale-out appliance to Azure Arc

If you set up a scale-out appliance to execute migrations, you can also Arc-enable that appliance by following these steps:

1. Follow the steps for the primary appliance to install the Arc agent on the scale-out appliance VM.

1. Assign the **Azure Migrate Owner** role to the Azure Arc-enabled machine on the resource group where the Azure Migrate project is set up (same as step 2 for the primary appliance).

1. Give certificate read and secret read permissions to the Azure Arc-enabled machine on the key vault created by Azure Migrate.

1. Create a scale-out appliance key.

1. Add a new registry key `HKLM\SOFTWARE\Microsoft\AzureAppliance\UseManagedIdentityAuth` set to `true`.

1. Go to the primary appliance machine and run the `ExportConfigFiles.ps1` script. The script is usually present at `C:\Program Files\Microsoft Azure Appliance Configuration Manager\Scripts\PowerShell`. Enter the user details, and it generates an `.AzM` file on the desktop.

1. Copy this `.AzM` file to the scale-out appliance machine.

1. Select **Register** on the Azure Migrate appliance to register the scale-out appliance by onboarding it to Azure Arc.

## Next steps

- [Discover VMware estate](tutorial-discover-vmware.md)
- [Discover physical servers, AWS and GCP estate](tutorial-discover-physical.md)


