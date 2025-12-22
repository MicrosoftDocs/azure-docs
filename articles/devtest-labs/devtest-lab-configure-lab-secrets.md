---
title: Configure Lab Secrets in Azure DevTest Labs
ms.service: azure-devtest-labs
ms.reviewer: rosemalcolm
description: Learn how to configure lab secrets in Azure DevTest Labs to centralize sensitive values, improve security, and streamline automation workflows.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/26/2025
ms.custom:

#customer intent: As a platform engineer, I want to configure lab secrets in Azure DevTest Labs so that I can securely store and manage sensitive values for automation and virtual machines.
---


# Configure lab secrets in Azure DevTest Labs

Lab secrets let platform engineers keep passwords, keys, and tokens in a single, secure location so automation and virtual machines can retrieve values without embedding them in scripts. By using Lab Secrets, you can store and use sensitive values centrally at the lab level in Azure DevTest Labs.

## Prerequisites

- An existing lab. For information about creating labs, see [Create a lab in the Azure portal](devtest-lab-create-lab.md).
- At least [Contributor](devtest-lab-add-devtest-user.md) access to the lab.
 
## Why use lab secrets

Using labs secrets provides several benefits:
- Better security: Store credentials, keys, and tokens securely.
- Centralized management: Define secrets once at the lab level and reuse them.
- Easier automation: Use secrets in artifacts and virtual machine (VM) setup without hardcoding values.

## Example scenarios

You can use lab secrets in various scenarios, including:
- Provision multiple Windows and Linux VMs without sharing passwords over chat or email.
- Deploy artifacts from private repositories using a personal access token stored as a secret.
- Run automation scripts that retrieve API keys or SSH credentials at runtime.

## Configure lab secrets

To create and manage lab secrets, follow these steps:
1. Go to the Azure portal and open the **Overview** page for your lab.
1. Select **Configuration and Policies** > **Settings** > **Lab Secrets**, and then select **Add**.

   :::image type="content" source="media/devtest-lab-configure-lab-secrets/devtest-labs-lab-secrets.png" alt-text="Screenshot of Lab Secrets in Azure DevTest Labs.":::

1. In the **Create a lab secret** pane, enter a name and value, and choose a scope: **Formulas and Virtual Machines** or **Artifacts**.
1. Select **Create**.

After creation, the secret is available in the selected scope and stored in an Azure Key Vault in the lab's resource group.

> [!NOTE]
> DevTest Labs automatically creates an Azure Key Vault in the lab's resource group to store secrets.

## Related content

- [Create a VM using the secret](devtest-lab-add-vm.md) 
- [Store secrets in a key vault in Azure DevTest Labs](devtest-lab-store-secrets-in-key-vault.md)
