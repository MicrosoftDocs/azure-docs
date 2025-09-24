---
title: 
description: 
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/24/2025
ms.custom:

#customer intent: 
---

# Enhancing security and streamlining configuration with Lab Secrets in Azure DevTest Labs

# Manage lab secrets in Azure DevTest Labs

Store and use sensitive values centrally at the lab level in Azure DevTest Labs.

Lab secrets let platform engineers keep passwords, keys, and tokens in a single, secure location so automation and virtual machines can retrieve values without embedding them in scripts.

Why use lab secrets

- Better security: Store credentials, keys, and tokens securely.
- Centralized management: Define secrets once at the lab level and reuse them.
- Easier automation: Use secrets in artifacts and VM setup without hardcoding values.

Example scenarios

- Provision multiple Windows and Linux VMs without sharing passwords over chat or email.
- Deploy artifacts from private repositories using a personal access token stored as a secret.
- Run automation scripts that retrieve API keys or SSH credentials at runtime.

## Prerequisite

- At least [user](devtest-lab-add-devtest-user.md#devtest-labs-user) access to the lab.

## Configure lab secrets

1. Go to the Azure portal and open the **Overview** page for your lab.
1. Select **Configuration and Policies**, select **Settings**, and then select **Lab Secrets**.
1. Select **+ Add**.
1. Enter a name and value, and choose a scope: **Formulas and Virtual Machines** or **Artifacts**.
1. Select **Create**.
1. After creation, the secret is available in the selected scope and stored in an Azure Key Vault in the lab's resource group.

> [!NOTE]
> DevTest Labs automatically creates an Azure Key Vault in the lab's resource group to store secrets.

Try Lab Secrets in Azure DevTest Labs today to simplify management of sensitive information.

## Related content

- For information about creating labs, see [Create a lab in the Azure portal](devtest-lab-create-lab.md).
