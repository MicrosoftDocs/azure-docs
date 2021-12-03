---
title: 'Connect to a VM using the native Windows client and Azure Bastion'
titleSuffix: Azure Bastion
description: Learn how to connect to a VM from a Windows computer by using Bastion and the native Windows client.
services: bastion
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 12/01/2021
ms.author: cherylmc
ms.custom: ignite-fall-2021
---

# Connect to a VM using Bastion and the native client on your Windows computer (Preview)

Azure Bastion now offers support for connecting to target VMs in Azure using a native RDP or SSH client on your Windows workstation. This feature lets you connect to your target VMs via Bastion using Azure CLI and expands your sign-in options to include local SSH key pair and Azure Active Directory (Azure AD). This article helps you configure Bastion with the required settings, and then connect to a VM in the VNet. For more information, see the [What is Azure Bastion?](bastion-overview.md).

> [!NOTE]
> This configuration requires the Standard SKU for Azure Bastion.
>

Currently, this feature has the following limitations:

* Native client support is not yet available for use from your local Linux workstation. If you are connecting to your target VM from a Linux workstation, use the Azure portal experience.

* Signing in using an SSH private key stored in Azure Key Vault is not supported with this feature. Download your private key to a file on your local machine before signing in to your Linux VM using an SSH key pair.

## <a name="prereq"></a>Prerequisites

Before you begin, verify that you have met the following criteria:

* The latest version of the CLI commands (version 2.30 or later) is installed. For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).
* An Azure virtual network.
* A virtual machine in the virtual network.
* If you plan to sign in to your virtual machine using your Azure AD credentials, make sure your virtual machine is set up using one of the following methods:
  * Enable Azure AD login for a [Windows VM](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md) or [Linux VM](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).
  * [Configure your Windows VM to be Azure AD-joined](../active-directory/devices/concept-azure-ad-join.md).
  * [Configure your Windows VM to be hybrid Azure AD-joined](../active-directory/devices/concept-azure-ad-join-hybrid.md).

## Configure Bastion

Follow the instructions that pertain to your environment.

### To modify an existing bastion host

If you have already configured Bastion for your VNet, modify the following settings:

1. Navigate to the **Configuration** page for your Bastion resource. Verify that the SKU is **Standard**. If it isn't, change it to **Standard** from the dropdown.
1. Check the box for **Native Client Support** and apply your changes.

    :::image type="content" source="./media/connect-native-client-windows/update-host.png" alt-text="Settings for updating an existing host with Native Client Support box selected." lightbox="./media/connect-native-client-windows/update-host-expand.png":::

### To configure a new bastion host

If you don't already have a bastion host configured, see [Create a bastion host](tutorial-create-host-portal.md#createhost). When configuring the bastion host, specify the following settings:

1. On the **Basics** tab, for **Instance Details -> Tier** select **Standard** to create a bastion host using the Standard SKU.

   :::image type="content" source="./media/connect-native-client-windows/standard.png" alt-text="Settings for a new bastion host with Standard SKU selected." lightbox="./media/connect-native-client-windows/standard.png":::
1. On the **Advanced** tab, check the box for **Native Client Support**.

   :::image type="content" source="./media/connect-native-client-windows/new-host.png" alt-text="Settings for a new bastion host with Native Client Support box selected." lightbox="./media/connect-native-client-windows/new-host-expand.png":::

## Verify roles and ports

Verify that the following roles and ports are configured in order to connect.

### Required roles

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Virtual Machine Administrator Login or Virtual Machine User Login role, if you are using the Azure AD sign-in method. You only need to do this if you're enabling Azure AD login using the process described in this article: [Azure Windows VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md) or [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

### Ports

To connect to a Linux VM using native client support, you must have the following ports open on your Linux VM:

* Inbound port: SSH (22) *or*
* Inbound port: Custom value (you will then need to specify this custom port when you connect to the VM via Azure Bastion)

To connect to a Windows VM using native client support, you must have the following ports open on your Windows VM:

* Inbound port: RDP (3389) *or*
* Inbound port: Custom value (you will then need to specify this custom port when you connect to the VM via Azure Bastion)

## <a name="connect"></a>Connect to a VM

This section helps you connect to your virtual machine. Use the steps that correspond to the type of VM you want to connect to.

1. Sign in to your Azure account and select your subscription containing your Bastion resource.

   ```azurecli-interactive
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

### Connect to a Linux VM

1. Sign in to your target Linux VM using one of the following options.

   > [!NOTE]
   > If you want to specify a custom port value, you should also include the field **--resource-port** in the sign-in command.
   >

   * If you signing in to an Azure AD login-enabled VM, use the following command. To learn more about how to use Azure AD to sign in to your Azure Linux VMs, see [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

     ```azurecli-interactive
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type  "AAD"
     ```

   * If you are signing in using an SSH key pair, use the following command.

     ```azurecli-interactive
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
     ```

   * If you are signing in using a local username and password, use the following command. You will then be prompted for the password for the target VM.

      ```azurecli-interactive
      az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "password" --username "<Username>"
      ```

### Connect to a Windows VM

1. Sign in to your target Windows VM using one of the following options.

   > [!NOTE]
   > If you want to specify a custom port value, you should also include the field **--resource-port** in the sign-in command.
   >

   * To connect via RDP, use the following command. You will then be prompted to input your credentials. You can use either a local username and password or your Azure AD credentials. To learn more about how to use Azure AD to sign in to your Azure Windows VMs, see [Azure Windows VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

      ```azurecli-interactive
      az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>"
      ```

   * To sign in using an SSH key pair, use the following command. The SSH CLI extension is currently in Preview. The extension can be installed by running, "az extension add --name ssh".

      ```azurecli-interactive
      az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
      ```

1. Once you sign in to your target VM, the native client on your workstation will open up with your VM session; MSTSC for RDP sessions, and SSH CLI extension for SSH sessions.

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
