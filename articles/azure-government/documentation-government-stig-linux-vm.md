---
title: Deploy STIG-compliant Linux Virtual Machines (Preview)
description: This quickstart shows you how to deploy a STIG-compliant Linux VM (Preview) from Azure Marketplace
author: stevevi
ms.author: stevevi
ms.service: azure-government
ms.topic: quickstart
ms.date: 03/16/2021
---

# Deploy STIG-compliant Linux Virtual Machines (Preview)

Microsoft Azure Security Technical Implementation Guides (STIGs) solution templates help you accelerate your [DoD STIG compliance](https://public.cyber.mil/stigs/) by delivering an automated solution to deploy virtual machines and apply STIGs through the Azure portal.

This quickstart shows how to deploy a STIG-compliant Linux virtual machine (Preview) on Azure or Azure Government using the corresponding portal.

## Prerequisites

- Azure or Azure Government subscription
- Storage account
  - If desired, must be in the same resource group/region as the VM
  - Required if you plan to store Log Analytics diagnostics
- Log Analytics workspace (required if you plan to store diagnostic logs)

## Sign in to Azure

Sign in at the [Azure portal](https://ms.portal.azure.com/) or [Azure Government portal](https://portal.azure.us/) depending on your subscription.

## Create a STIG-compliant virtual machine

1. Select *Create a resource*.
1. Type **Azure STIG Templates for Linux** in the search bar and press enter.
1. Select **Azure STIG Templates for Linux** from the search results and then **Create**.
1. In the **Basics** tab, under **Project details**:

    a. Select an existing *Subscription*.

    b. Create a new *Resource group* or enter an existing resource group.

    c. Select your *Region*.

    > [!IMPORTANT]
    > Make sure to choose an empty resource group or create a new one.

    :::image type="content" source="./media/stig-project-details.png" alt-text="Project details section showing where you select the Azure subscription and the resource group for the virtual machine" border="false":::

1. Under **Instance details**, enter all required information:

    a. Enter the *VM name*.

    b. Select the *Linux OS version*.

    c. Select the instance *Size*.

    d. Enter the administrator account *Username*.

    e. Select the Authentication type by choosing either *Password* or *Public key*.

    f. Enter a *Password* or *Public key*.

    g. Confirm *Password* (*Public key* only needs to be input once).

    > [!NOTE]
    > For instructions on creating an SSH RSA public-private key pair for SSH client connections, see **[Create and manage SSH keys for authentication to a Linux VM in Azure](../virtual-machines/linux/create-ssh-keys-detailed.md).**

    :::image type="content" source="./media/stig-linux-instance-details.png" alt-text="Instance details section where you provide a name for the virtual machine and select its region, image, and size" border="false":::

1. Under **Disk**:

    a. Select the *OS disk type*.

    b. Select the *Encryption type*.

    :::image type="content" source="./media/stig-disk-options.png" alt-text="Disk options section showing where you select the disk and encryption type for the virtual machine" border="false":::

1. Under **Networking**:

    a. Select the *Virtual Network*. Either use existing virtual network or select *Create new* (note RDP inbound is disallowed).

    b. Select *Subnet*.

    c. Application security group (optional).

    :::image type="content" source="./media/stig-network-interface.png" alt-text="Network interface section showing where you select the network and subnet for the virtual machine" border="false":::

1. Under **Management**:

    a. For Diagnostic settings select *Storage account* (optional, required to store diagnostic logs).

    b. Enter Log Analytics workspace (optional, required to store log analytics).

    c. Enter Custom data (optional, only applicable for RHEL 7.7/7.8, CentOS 7.7/7.8/7.9 and Ubuntu 18.04).

    :::image type="content" source="./media/stig-linux-diagnostic-settings.png" alt-text="Management section showing where you select the diagnostic settings for the virtual machine" border="false":::

1. Select **Review + create** to review summary of all selections.

1. Once the validation check is successful Select ***Create***.

1. Once the creation process is started, the ***Deployment*** process page will be displayed:

    a.  **Deployment** ***Overview*** tab displays the deployment process including any errors that may occur. Once deployment is
        complete, this tab provides information on the deployment and provides the opportunity to download the deployment details.

    b.  ***Inputs*** tab provides a list of the inputs to the deployment.

    c.  ***Outputs*** tab provides information on any deployment outputs.

    d.  ***Template*** tab provides downloadable access to the JSON scripts used in the template.

1. The deployed virtual machine can be found in the resource group used for the deployment. Since inbound RDP is disallowed, Azure Bastion must be used to connect to the VM.

## Clean up resources

When no longer needed, you can delete the resource group, virtual machine, and all related resources.

Select the resource group for the virtual machine, then select **Delete**. Confirm the name of the resource group to finish deleting the resources.

## Next steps

This quickstart showed you how to deploy a STIG-compliant Linux virtual machine (Preview) on Azure or Azure Government. For more information about creating virtual machines in:

- Azure, see [Quickstart: Create a Linux virtual machine in the Azure portal](../virtual-machines/linux/quick-create-portal.md).
- Azure Government, see [Tutorial: Create virtual machines](./documentation-government-quickstarts-vm.md).

To learn more about Azure services, continue to the Azure documentation.

> [!div class="nextstepaction"]
> [Azure documentation](../index.yml)
