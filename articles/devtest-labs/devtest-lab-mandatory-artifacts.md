---
title: Specify mandatory artifacts for lab virtual machines
titleSuffix: Azure DevTest Labs
description: Learn how to specify mandatory artifacts to install at creation of every lab virtual machine (VM) in Azure DevTest Labs.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 06/10/2024
ms.custom: UpdateFrequency2

#customer intent: As a developer, I want to specify mandatory artifacts in Azure DevTest Labs so that I can create new virtual machines that automatically have the mandatory artifacts installed.
---

# Specify mandatory artifacts for Azure DevTest Labs virtual machines

This article describes how to specify _mandatory artifacts_ in Azure DevTest Labs to install on every lab virtual machine (VM). Artifacts are tools and applications that you can add to your VMs. Mandatory artifacts can include any software that every VM in your lab must have. By defining mandatory artifacts, you can ensure all your lab VMs are installed with standardized, up-to-date artifacts. Lab users don't have to spend time and effort to add needed artifacts individually.

## Explore mandatory artifacts

Mandatory artifacts can't have any configurable parameters. This restriction makes it easier for lab users to create VMs. Mandatory artifacts always install first on a VM before any extra or custom artifacts selected by the user.

You can create a custom image from a VM that has mandatory artifacts applied to it. When you create new VMs from the custom image, the new VMs also have the mandatory artifacts. DevTest Labs always installs the most recent versions of the mandatory artifacts on a VM, even when the base is an "older" custom image.

When you create a VM, you can't rearrange, change, or delete the mandatory artifacts. However, you can add extra artifacts or define custom artifacts. For more information, see [Add artifacts to DevTest Labs VMs](add-artifact-vm.md).

## Define mandatory artifacts

You can select mandatory artifacts for Windows and Linux lab machines separately by following these steps:

1. In the [Azure portal](https://portal.azure.com), go to your DevTest Labs lab resource where you want to define the mandatory artifacts.

1. On your lab **Overview** page, expand the **Settings** section in the left menu, and select **Configuration and policies**.

1. On the **Configuration and policies** screen, expand the **External resources** section in the left menu, and select **Mandatory artifacts**.

1. Select the VM configuration:

   - **Windows**: Select the **Windows** tab, and then select **Edit Windows artifacts**.
   - **Linux**: Select the **Linux** tab, and then select **Edit Linux artifacts**.

   :::image type="content" source="./media/devtest-lab-mandatory-artifacts/mandatory-artifacts-edit-button.png" border="false" alt-text="Screenshot that shows how to Edit Windows artifacts for lab virtual machines in the Azure portal." lightbox="./media/devtest-lab-mandatory-artifacts/mandatory-artifacts-edit-button-large.png":::

1. On the **Mandatory artifacts** page, select the arrow next to each artifact you want to add to the VM.

1. On each **Add artifact** pane, select **OK**. The artifact appears under **Selected artifacts**, and the number of configured artifacts updates to show the current list:

   :::image type="content" source="./media/devtest-lab-mandatory-artifacts/save-artifacts.png" alt-text="Screenshot that shows how to add mandatory artifacts on the Mandatory artifacts screen." lightbox="./media/devtest-lab-mandatory-artifacts/save-artifacts-large.png":::

1. Select **Save**.

## Change installation order

After you add mandatory artifacts, DevTest Labs updates the **Mandatory artifacts** lists for your lab in the Azure portal. From these lists, you can access the artifacts to change the installation order. When you create a new VM, DevTest Labs installs the **top** artifact in the list first and the **bottom** artifact last.

To change the order of installation for the mandatory artifacts:

1. On the **External resources** > **Mandatory artifacts** screen for your lab, select the **Windows** or **Linux** tab.

1. Select **Edit Windows artifacts** or **Edit Linux artifacts** to open the **Mandatory artifacts** page.

1. In the **Selected artifacts** list, select **More options** (...) for the artifact that you want to change.

1. On the artifact menu, select **Move up**, **Move down**, **Move to top**, or **Move to bottom**.

1. Select **Save**.

## View mandatory artifacts

After you specify mandatory artifacts for a lab, DevTest Labs shows the mandatory artifacts for all lab VMs based on the operating system (Windows or Linux). When a lab user creates a new VM, they can see the mandatory artifacts that DevTest Labs plans to install.

To view the mandatory artifacts for a VM:

1. On the **Overview** page for your lab, select **Add**.

1. On the **Choose a base** page, select a Marketplace image, such as **Windows 11 Pro**.

1. On the **Create lab resource** page, under **Artifacts**, notice the number of mandatory artifacts for the VM:

   :::image type="content" source="./media/devtest-lab-mandatory-artifacts/select-message-artifacts.png" alt-text="Screenshot that shows the Create lab resource screen with the number of mandatory artifacts and the Add or Remove Artifacts option.":::

1. To see details about the mandatory artifacts, select **Add or Remove Artifacts**.

1. On the **Add artifacts** screen, the mandatory artifacts are displayed above the **Available artifacts** list. The mandatory artifacts are listed in order of installation from top to bottom:

   :::image type="content" source="./media/devtest-lab-mandatory-artifacts/save-to-lab.png" alt-text="Screenshot that shows the Add artifacts screen with the list of mandatory artifacts that DevTest Labs plans to install." lightbox="./media/devtest-lab-mandatory-artifacts/save-to-lab-large.png":::

## Delete mandatory artifacts

You can also delete artifacts in the **Mandatory artifacts** lists:

1. On the **External resources** > **Mandatory artifacts** screen for your lab, select the **Windows** or **Linux** tab.

1. Select the checkbox next to the artifact in the list, and then select **Delete**:

   :::image type="content" source="./media/devtest-lab-mandatory-artifacts/remove-artifact.png" alt-text="Screenshot that shows how to select the Delete option to remove a mandatory artifact." lightbox="./media/devtest-lab-mandatory-artifacts/remove-artifact-large.png":::

1. At the confirmation prompt, select **Yes**.

## Related content

- [Add a Git artifact repository to a lab](add-artifact-repository.md)
