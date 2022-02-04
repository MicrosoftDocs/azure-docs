---
title: 'Connect to a VM using the native client and Azure Bastion'
titleSuffix: Azure Bastion
description: Learn how to connect to a VM from a Windows computer by using Bastion and the native client.
services: bastion
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 01/31/2022
ms.author: cherylmc
ms.custom: ignite-fall-2021
---

# Connect to a VM using Bastion and the native client on your workstation (Preview)

Azure Bastion offers support for connecting to target VMs in Azure using a native RDP or SSH client on your local workstation. This feature lets you connect to your target VMs via Bastion using Azure CLI and expands your sign-in options to include local SSH key pair, and Azure Active Directory (Azure AD). This article helps you configure Bastion with the required settings, and then connect to a VM in the VNet. For more information, see the [What is Azure Bastion?](bastion-overview.md).

> [!NOTE]
> This configuration requires the Standard SKU for Azure Bastion.
>

Currently, this feature has the following limitations:

* Signing in using an SSH private key stored in Azure Key Vault isn’t supported with this feature. Download your private key to a file on your local machine before signing in to your Linux VM using an SSH key pair.

## <a name="prereq"></a>Prerequisites

Before you begin, verify that you’ve met the following criteria:

* The latest version of the CLI commands (version 2.32 or later) is installed. For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).
* An Azure virtual network.
* A virtual machine in the virtual network.
* If you plan to sign in to your virtual machine using your Azure AD credentials, make sure your virtual machine is set up using one of the following methods:
  * Enable Azure AD sign-in for a [Windows VM](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md) or [Linux VM](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).
  * [Configure your Windows VM to be Azure AD-joined](../active-directory/devices/concept-azure-ad-join.md).
  * [Configure your Windows VM to be hybrid Azure AD-joined](../active-directory/devices/concept-azure-ad-join-hybrid.md).

## <a name="configure"></a>Configure Bastion

Follow the instructions that pertain to your environment.

### <a name="modify-host"></a>To modify an existing bastion host

If you have already configured Bastion for your VNet, modify the following settings:

1. Navigate to the **Configuration** page for your Bastion resource. Verify that the SKU is **Standard**. If it isn't, change it to **Standard** from the dropdown.
1. Check the box for **Native Client Support** and apply your changes.

    :::image type="content" source="./media/connect-native-client-windows/update-host.png" alt-text="Settings for updating an existing host with Native Client Support box selected." lightbox="./media/connect-native-client-windows/update-host-expand.png":::

### <a name="configure-new"></a>To configure a new bastion host

If you don't already have a bastion host configured, see [Create a bastion host](tutorial-create-host-portal.md#createhost). When configuring the bastion host, specify the following settings:

1. On the **Basics** tab, for **Instance Details -> Tier** select **Standard** to create a bastion host using the Standard SKU.

   :::image type="content" source="./media/connect-native-client-windows/standard.png" alt-text="Settings for a new bastion host with Standard SKU selected." lightbox="./media/connect-native-client-windows/standard.png":::
1. On the **Advanced** tab, check the box for **Native Client Support**.

   :::image type="content" source="./media/connect-native-client-windows/new-host.png" alt-text="Settings for a new bastion host with Native Client Support box selected." lightbox="./media/connect-native-client-windows/new-host-expand.png":::

## <a name="verify"></a>Verify roles and ports

Verify that the following roles and ports are configured in order to connect.

### <a name="roles"></a>Required roles

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Virtual Machine Administrator Login or Virtual Machine User Login role, if you’re using the Azure AD sign-in method. You only need to do this if you're enabling Azure AD login using the process described in this article: [Azure Windows VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md) or [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

### Ports

To connect to a Linux VM using native client support, you must have the following ports open on your Linux VM:

* Inbound port: SSH (22) *or*
* Inbound port: Custom value (you’ll then need to specify this custom port when you connect to the VM via Azure Bastion)

To connect to a Windows VM using native client support, you must have the following ports open on your Windows VM:

* Inbound port: RDP (3389) *or*
* Inbound port: Custom value (you’ll then need to specify this custom port when you connect to the VM via Azure Bastion)

## <a name="connect"></a>Connect to a VM from a Windows local workstation

This section helps you connect to your virtual machine from a Windows local workstation. Use the steps that correspond to the type of VM you want to connect to.

1. Sign in to your Azure account and select your subscription containing your Bastion resource.

   ```azurecli-interactive
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

### <a name="connect-linux"></a>Connect to a Linux VM

1. Sign in to your target Linux VM using one of the following options.

   > [!NOTE]
   > If you want to specify a custom port value, you should also include the field **--resource-port** in the sign-in command.
   >

   * If you’re signing in to an Azure AD login-enabled VM, use the following command. For more information, see [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

     ```azurecli-interactive
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type  "AAD"
     ```

   * If you’re signing in using an SSH key pair, use the following command.

     ```azurecli-interactive
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
     ```

   * If you’re signing in using a local username and password, use the following command. You’ll then be prompted for the password for the target VM.

      ```azurecli-interactive
      az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "password" --username "<Username>"
      ```
   
   > [!NOTE]
   > VM sessions using the **az network bastion ssh** command do not support file transfer. To use file transfer with SSH over Bastion, see the [az network bastion tunnel](#connect-tunnel) section.
   >

### <a name="connect-windows"></a>Connect to a Windows VM

1. Sign in to your target Windows VM using one of the following options.

   > [!NOTE]
   > If you want to specify a custom port value, you should also include the field **--resource-port** in the sign-in command.
   >

   * To connect via RDP, use the following command. You’ll then be prompted to input your credentials. You can use either a local username and password or your Azure AD credentials. For more information, see [Azure Windows VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

      ```azurecli-interactive
      az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>"
      ```

   * To sign in using an SSH key pair, use the following command. The SSH CLI extension is currently in Preview. The extension can be installed by running, "az extension add --name ssh".

      ```azurecli-interactive
      az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
      ```

1. Once you sign in to your target VM, the native client on your workstation will open up with your VM session; **MSTSC** for RDP sessions, and **SSH CLI extension (az ssh)** for SSH sessions.

## <a name="connect-tunnel"></a>Connect to a VM using the *az network bastion tunnel* command

This section helps you connect to your virtual machine using the *az network bastion tunnel* command, which allows you to:
* Use native clients on *non*-Windows local workstations (ex: a Linux PC).
* Use a native client of your choice.
* Set up concurrent VM sessions with Bastion.
* Access file transfer for SSH sessions.

1. Sign in to your Azure account and select your subscription containing your Bastion resource.

   ```azurecli-interactive
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

2. Open the tunnel to your target VM using the following command:

   ```azurecli-interactive
   az network bastion tunnel --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --resource-port "<TargetVMPort>" --port "<LocalMachinePort>"
   ```
3. Connect and sign in to your target VM using SSH or RDP, the native client of your choice, and the local machine port you specified in Step 2.

## Next steps

Read the [Bastion FAQ](bastion-faq.md).
