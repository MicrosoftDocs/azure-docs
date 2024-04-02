---
title: Create an Azure confidential VM in the Azure portal
description: Learn how to quickly create a confidential virtual machine (confidential VM) in the Azure portal using Azure Marketplace images.
author: RunCai
ms.service: virtual-machines
ms.subservice: confidential-computing
ms.topic: quickstart
ms.date: 12/01/2023
ms.author: RunCai
ms.custom: mode-ui, has-azure-ad-ps-ref, ignite-2023
---

# Quickstart: Create confidential VM on in the Azure portal

You can use the Azure portal to create a [confidential VM](confidential-vm-overview.md) based on an Azure Marketplace image quickly. There are multiple [confidential VM options on AMD and Intel](virtual-machine-solutions-amd.md) with AMD SEV-SNP and Intel TDX technology.


## Prerequisites

- An Azure subscription. Free trial accounts don't have access to the VMs used in this tutorial. One option is to use a [pay as you go subscription](https://azure.microsoft.com/pricing/purchase-options/pay-as-you-go/).
- If you're using a Linux-based confidential VM, use a BASH shell for SSH or install an SSH client, such as [PuTTY](https://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).
- If Confidential disk encryption with a customer-managed key is required, please run below command to opt in service principal `Confidential VM Orchestrator` to your tenant. [Install Microsoft Graph SDK](/powershell/microsoftgraph/installation) to execute the commands below.

    ```Powershell
    Connect-Graph -Tenant "your tenant ID" Application.ReadWrite.All
    New-MgServicePrincipal -AppId bf7b6499-ff71-4aa2-97a4-f372087be7f0 -DisplayName "Confidential VM Orchestrator"
    ```

## Create confidential VM

To create a confidential VM in the Azure portal using an Azure Marketplace image:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select or search for **Virtual machines**.

1. On the **Virtual machines** page menu, select **Create** &gt; **Virtual machine**.

1. On the tab **Basics**, configure the following settings:

    a. Under **Project details**, for **Subscription**, select an Azure subscription that meets the [prerequisites](#prerequisites).

    b. For **Resource Group**, select **Create new** to create a new resource group. Enter a name, and select **OK**.

    c. Under **Instance details**, for **Virtual machine name**, enter a name for your new VM.

    d. For **Region**, select the Azure region in which to deploy your VM.

    > [!NOTE]
    > Confidential VMs are not available in all locations. For currently supported locations, see which [VM products are available by Azure region](https://azure.microsoft.com/global-infrastructure/services/?products=virtual-machines).

    e. For **Availability options**, select **No infrastructure redundancy required** for singular VMs or [**Virtual machine scale set**](/azure/virtual-machine-scale-sets/overview) for multiple VMs.

    f. For **Security Type**, select **Confidential virtual machines**.

    g. For **Image**, select the OS image to use for your VM. Select **See all images** to open Azure Marketplace. Select the filter **Security Type** &gt; **Confidential** to show all available confidential VM images.

    h. Toggle [Generation 2](../virtual-machines/generation-2.md) images. Confidential VMs only run on Generation 2 images. To ensure, under **Image**, select **Configure VM generation**. In the pane **Configure VM generation**, for **VM generation**, select **Generation 2**. Then, select **Apply**.

    i. For **Size**, select a VM size. For more information, see [supported confidential VM families](virtual-machine-options.md).


    j. For **Authentication type**, if you're creating a Linux VM, select **SSH public key** . If you don't already have SSH keys, [create SSH keys for your Linux VMs](../virtual-machines/linux/mac-create-ssh-keys.md).

    k. Under **Administrator account**, for **Username**, enter an administrator name for your VM.

    l. For **SSH public key**, if applicable, enter your RSA public key.

    m. For **Password** and **Confirm password**, if applicable, enter an administrator password.

    n. Under **Inbound port rules**, for **Public inbound ports**, select **Allow selected ports**.

    o. For **Select inbound ports**, select your inbound ports from the drop-down menu. For Windows VMs, select **HTTP (80)** and **RDP (3389)**. For Linux VMs, select **SSH (22)** and **HTTP (80)**.

    > [!NOTE]
    > It's not recommended to allow RDP/SSH ports for production deployments.

1. On the tab **Disks**, configure the following settings:

    1. Under **Disk options**, enable **Confidential OS disk encryption** if you want to encrypt your VM's OS disk during creation.

    1. For **Key Management**, select the type of key to use.

    1. If **Confidential disk encryption with a customer-managed key** is selected, create a **Confidential disk encryption set** before creating your confidential VM.
    1. If you want to encrypt your VM's temp disk, please refer to the [following documentation](https://aka.ms/CVM-tdisk-encrypt).

1. (Optional) If necessary, you need to create a **Confidential disk encryption set** as follows.

    1. [Create an Azure Key Vault](../key-vault/general/quick-create-portal.md) selecting the **Premium** pricing tier that includes support for HSM-backed keys and enable purge protection. Alternatively, you can create an [Azure Key Vault managed Hardware Security Module (HSM)](../key-vault/managed-hsm/quick-create-cli.md).

    1. In the Azure portal, search for and select **Disk Encryption Sets**.

    1. Select **Create**.

    1. For **Subscription**, select which Azure subscription to use.

    1. For **Resource group**, select or create a new resource group to use.

    1. For **Disk encryption set name**, enter a name for the set.

    1. For **Region**, select an available Azure region.

    1. For **Encryption type**, select **Confidential disk encryption with a customer-managed key**.

    1. For **Key Vault**, select the key vault you already created.

    1. Under **Key Vault**, select **Create new** to create a new key.

        > [!NOTE]
        > If you selected an Azure managed HSM previously, [use PowerShell or the Azure CLI to create the new key](../confidential-computing/quick-create-confidential-vm-arm.md) instead.

    1. For **Name**, enter a name for the key.

    1. For the key type, select **RSA-HSM**

    1. Select your key size

    n. Under Confidential Key Options select **Exportable** and set the Confidential operation policy as **CVM confidential operation policy**.

    o. Select **Create** to finish creating the key.

    p. Select **Review + create** to create new disk encryption set. Wait for the resource creation to complete successfully.

    q. Go to the disk encryption set resource in the Azure portal.

    r. Select the pink banner to grant permissions to Azure Key Vault.

   > [!IMPORTANT]
   > You must perform this step to successfully create the confidential VM.

1. As needed, make changes to settings under the tabs **Networking**, **Management**, **Guest Config**, and **Tags**.

1. Select **Review + create** to validate your configuration.

1.  Wait for validation to complete. If necessary, fix any validation issues, then select **Review + create** again.

1. In the **Review + create** pane, select **Create**.

## Connect to confidential VM

There are different methods to connect to [Windows confidential VMs](#connect-to-windows-vms) and [Linux confidential VMs](#connect-to-linux-vms).

### Connect to Windows VMs

To connect to a confidential VM with a Windows OS, see [How to connect and sign on to an Azure virtual machine running Windows](../virtual-machines/windows/connect-logon.md).

### Connect to Linux VMs

To connect to a confidential VM with a Linux OS, see the instructions for your computer's OS.

Before you begin, make sure you have your VM's public IP address. To find the IP address:

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select or search for **Virtual machines**.

1. On the **Virtual machines** page, select your confidential VM.

1. On your confidential VM's overview page, copy the **Public IP address**.

    For more information about connecting to Linux VMs, see [Quickstart: Create a Linux virtual machine in the Azure portal](../virtual-machines/linux/quick-create-portal.md).

1. Open your SSH client, such as PuTTY.

1. Enter your confidential VM's public IP address.

1. Connect to the VM. In PuTTY, select **Open**.

1. Enter your VM administrator username and password.

    > [!NOTE]
    > If you're using PuTTY, you might receive a security alert that the server's host key isn't cached in the registry. If you trust the host, select **Yes** to add the key to PuTTY's cache and continue connecting. To connect just once, without adding the key, select **No**. If you don't trust the host, select **Cancel** to abandon your connection.

## Clean up resources

After you're done with the quickstart, you can clean up the confidential VM, the resource group, and other related resources.

1. Sign in to the [Azure portal](https://portal.azure.com/).

1. Select or search for **Resource groups**.

1. On the **Resource groups** page, select the resource group you created for this quickstart.

1. On the resource group's menu, select **Delete resource group**.

1. In the warning pane, enter the resource group's name to confirm the deletion.

1. Select **Delete**.

## Next steps

> [!div class="nextstepaction"]
> [Create a confidential VM with an ARM template](quick-create-confidential-vm-arm.md)
