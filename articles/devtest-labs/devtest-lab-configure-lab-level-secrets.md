---
title: Configure Lab Level Secrets in Azure DevTest Labs
description: Learn how to configure lab level secrets in Azure DevTest Labs.
ms.topic: how-to
ms.author: anishtrakru
author: RoseHJM
ms.date: 02/06/2025
ms.custom: UpdateFrequency2
---

# Configure Lab Level Secrets in Azure DevTest Labs

The lab level secrets in Azure DevTest Labs help streamline the creation and management of virtual machines (VMs). They are effective at reducing overhead on the lab users and can be leveraged while creating VMs,  creating formulas, and for use by certain artifacts.

> [!IMPORTANT]
> **Lab Level Secrets** is currently in preview in Azure DevTest Labs. For more information about the preview status, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The document defines legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability.

Security and simplicity remain a top priority for platform engineers and lab users in the ever-evolving landscape of cloud computing. Azure DevTest Labs has traditionally provided capabilities for lab users such as using their own secrets or passwords to access the VMs. This approach burdens the lab user with the responsibility to create and manage their own secrets and passwords. In scenarios in which all lab users use the same secret or password to access the VMs within a lab, the process of creating and managing the same secret or password by each user becomes redundant. That’s where lab level secrets fill the gap - it allows the lab users to use centralized lab secrets to access the VMs within the lab. If the common secret or password used across the lab needs to be updated at a later point in time, then that can be achieved seamlessly. Additionally, lab level secrets can also be used while creating formulas and by certain artifacts that require use of secrets, passwords or PATs for their execution.

This article explains how to configure Lab Level Secrets in Azure DevTest Labs.

## Configure a lab level secret

### Prerequisite

You need at least [owner](devtest-lab-add-devtest-user.md#owner) or [contributor](devtest-lab-add-devtest-user.md#contributor) access to a lab in DevTest Labs to configure a lab level secret.

### Configure a lab level secret within a lab

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for **DevTest Labs**.
1. From the list of labs, select the lab you want.
1. Select **Configuration and policies** -> **Lab secrets**. 
1. On the **Lab secrets** page, select **Add**.

   :::image type="content" source="./media/devtest-lab-add-vm/portal-lab-add-vm.png" alt-text="Screenshot of lab overview page showing add button." lightbox="./media/devtest-lab-add-vm/portal-lab-add-vm.png":::

1. On the **Create a lab secret** pane, provide the following information:
    - **Name**: Enter a name for the secret.
    - **Value**: Enter the value of the secret. You see this name in the drop-down list when creating a VM, formula, or while adding certain artifacts that require a token or password.
    - **Scope**:
        - **Formulas & virtual machines**: Select this option if you want to use the secret to access VMs.
        If you select this option, another option to use this secret as default password will become visible. Select **Use this secret as default password** to use this secret as the default password
        - **Artifacts**: Select this option if you want the secret to be used by certain artifacts.

    :::image type="content" source="./media/devtest-lab-gen2-vm/dev-test-lab-gen-2-images.png" alt-text="Screenshot of list of available base images."  lightbox="./media/devtest-lab-gen2-vm/dev-test-lab-gen-2-images.png":::
    
    - Select **Create** to create the secret.