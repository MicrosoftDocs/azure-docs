---
title: 'Connect to a VM using a native client and Azure Bastion'
titleSuffix: Azure Bastion
description: Learn how to connect to a VM from a Windows computer by using Bastion and a native client.
services: bastion
author: cherylmc
ms.service: bastion
ms.topic: how-to
ms.date: 09/09/2022
ms.author: cherylmc
---

# Connect to a VM using a native client

This article helps you configure your Bastion deployment, and then connect to a VM in the VNet using the native client (SSH or RDP) on your local computer. The native client feature lets you connect to your target VMs via Bastion using Azure CLI, and expands your sign-in options to include local SSH key pair and Azure Active Directory (Azure AD). Additionally with this feature, you can now also upload or download files, depending on the connection type and client.

Your capabilities on the VM when connecting via native client are dependent on what is enabled on the native client. Controlling access to features such as file transfer via Bastion isn't supported.

> [!NOTE]
> This configuration requires the Standard SKU tier for Azure Bastion.

After you deploy this feature, there are two different sets of connection instructions.

* [Connect to a VM from the native client on a Windows local computer](#connect). This lets you do the following:

  * Connect using SSH or RDP.
  * [Upload and download files](vm-upload-download-native.md#rdp) over RDP.
  * If you want to connect using SSH and need to upload files to your target VM, use the **az network bastion tunnel** command instead.

* [Connect to a VM using the **az network bastion tunnel** command](#connect-tunnel). This lets you do the following:

  * Use native clients on *non*-Windows local computers (example: a Linux PC).
  * Use the native client of your choice. (This includes the Windows native client.)
  * Connect using SSH or RDP.
  * Set up concurrent VM sessions with Bastion.
  * [Upload files](vm-upload-download-native.md#tunnel-command) to your target VM from your local computer. File download from the target VM to the local client is currently not supported for this command.

Currently, this feature has the following limitation:

* Signing in using an SSH private key stored in Azure Key Vault isn’t supported with this feature. Before signing in to your Linux VM using an SSH key pair, download your private key to a file on your local machine.

## <a name="prereq"></a>Prerequisites

Before you begin, verify that you have the following prerequisites:

* The latest version of the CLI commands (version 2.32 or later) is installed. For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).
* An Azure virtual network.
* A virtual machine in the virtual network.
* The VM's Resource ID. The Resource ID can be easily located in the Azure portal. Go to the Overview page for your VM and select the *JSON View* link to open the Resource JSON. Copy the Resource ID at the top of the page to your clipboard to use later when connecting to your VM.
* If you plan to sign in to your virtual machine using your Azure AD credentials, make sure your virtual machine is set up using one of the following methods:
  * [Enable Azure AD sign-in for a Windows VM](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md) or [Linux VM](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).
  * [Configure your Windows VM to be Azure AD-joined](../active-directory/devices/concept-azure-ad-join.md).
  * [Configure your Windows VM to be hybrid Azure AD-joined](../active-directory/devices/concept-azure-ad-join-hybrid.md).

## <a name="configure"></a>Configure the native client support feature

You can configure this feature by either modifying an existing Bastion deployment, or you can deploy Bastion with the feature configuration already specified.

### To modify an existing Bastion deployment

If you've already deployed Bastion to your VNet, modify the following configuration settings:

1. Navigate to the **Configuration** page for your Bastion resource. Verify that the SKU Tier is **Standard**. If it isn't, select **Standard**.
1. Select the box for **Native Client Support**, then apply your changes.

    :::image type="content" source="./media/connect-native-client-windows/update-host.png" alt-text="Screenshot that shows settings for updating an existing host with Native Client Support box selected." lightbox="./media/connect-native-client-windows/update-host.png":::

### To deploy Bastion with the native client feature

If you haven't already deployed Bastion to your VNet, you can deploy with the native client feature specified by deploying Bastion using manual settings. For steps, see [Tutorial - Deploy Bastion with manual settings](tutorial-create-host-portal.md#createhost). When you deploy Bastion, specify the following settings:

1. On the **Basics** tab, for **Instance Details -> Tier** select **Standard**. Native client support requires the Standard SKU.

   :::image type="content" source="./media/connect-native-client-windows/standard.png" alt-text="Settings for a new bastion host with Standard SKU selected." lightbox="./media/connect-native-client-windows/standard.png":::
1. Before you create the bastion host, go to the **Advanced** tab and check the box for **Native Client Support**, along with the checkboxes for any other additional features that you want to deploy.

   :::image type="content" source="./media/connect-native-client-windows/new-host.png" alt-text="Screenshot that shows settings for a new bastion host with Native Client Support box selected." lightbox="./media/connect-native-client-windows/new-host.png":::

1. Click **Review + create** to validate, then click **Create** to deploy your Bastion host.

## <a name="verify"></a>Verify roles and ports

Verify that the following roles and ports are configured in order to connect to the VM.

### Required roles

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Virtual Machine Administrator Login or Virtual Machine User Login role, if you’re using the Azure AD sign-in method. You only need to do this if you're enabling Azure AD login using the processes outlined in one of these articles:

  * [Azure Windows VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md)
  * [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md)

### Ports

To connect to a Linux VM using native client support, you must have the following ports open on your Linux VM:

* Inbound port: SSH (22) *or*
* Inbound port: Custom value (you’ll then need to specify this custom port when you connect to the VM via Azure Bastion)

To connect to a Windows VM using native client support, you must have the following ports open on your Windows VM:

* Inbound port: RDP (3389) *or*
* Inbound port: Custom value (you’ll then need to specify this custom port when you connect to the VM via Azure Bastion)

To learn about how to best configure NSGs with Azure Bastion, see [Working with NSG access and Azure Bastion](bastion-nsg.md).

## <a name="connect"></a>Connect to VM - Windows native client

This section helps you connect to your virtual machine from the native client on a local Windows computer. If you want to upload and download files after connecting, you must use an RDP connection. For more information about file transfers, see  [Upload or download files](vm-upload-download-native.md).

Use the example that corresponds to the type of target VM to which you want to connect.

* [Windows VM](#connect-windows)
* [Linux VM](#connect-linux)

### <a name="connect-windows"></a>Connect to a Windows VM

1. Sign in to your Azure account. If you have more than one subscription, select the subscription containing your Bastion resource.

   ```azurecli
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

1. Sign in to your target Windows VM using one of the following example options. If you want to specify a custom port value, you should also include the field **--resource-port** in the sign-in command.

   **RDP:**

   To connect via RDP, use the following command. You’ll then be prompted to input your credentials. You can use either a local username and password, or your Azure AD credentials. For more information, see [Azure Windows VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-windows.md).

   ```azurecli
   az network bastion rdp --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>"
   ```

   **SSH:**

   The extension can be installed by running, ```az extension add --name ssh```. To sign in using an SSH key pair, use the following example.

   ```azurecli
   az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
   ```

1. Once you sign in to your target VM, the native client on your computer will open up with your VM session; **MSTSC** for RDP sessions, and **SSH CLI extension (az ssh)** for SSH sessions.

### <a name="connect-linux"></a>Connect to a Linux VM

1. Sign in to your Azure account. If you have more than one subscription, select the subscription containing your Bastion resource.

   ```azurecli
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

1. Sign in to your target Linux VM using one of the following example options. If you want to specify a custom port value, you should also include the field **--resource-port** in the sign-in command.

   **Azure AD:**

   If you’re signing in to an Azure AD login-enabled VM, use the following command. For more information, see [Azure Linux VMs and Azure AD](../active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).

     ```azurecli
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type  "AAD"
     ```

   **SSH:**

   The extension can be installed by running, ```az extension add --name ssh```. To sign in using an SSH key pair, use the following example.

     ```azurecli
     az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "ssh-key" --username "<Username>" --ssh-key "<Filepath>"
     ```

   **Username/password:**

   If you’re signing in using a local username and password, use the following command. You’ll then be prompted for the password for the target VM.

      ```azurecli
      az network bastion ssh --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --auth-type "password" --username "<Username>"
      ```

1. Once you sign in to your target VM, the native client on your computer will open up with your VM session; **MSTSC** for RDP sessions, and **SSH CLI extension (az ssh)** for SSH sessions.

## <a name="connect-tunnel"></a>Connect to VM - other native clients

This section helps you connect to your virtual machine from native clients on *non*-Windows local computers (example: a Linux PC) using the **az network bastion tunnel** command. You can also connect using this method from a Windows computer. This is helpful when you require an SSH connection and want to upload files to your VM.

This connection supports file upload from the local computer to the target VM. For more information, see [Upload files](vm-upload-download-native.md).

1. Sign in to your Azure account. If you have more than one subscription, select the subscription containing your Bastion resource.

   ```azurecli
   az login
   az account list
   az account set --subscription "<subscription ID>"
   ```

1. Open the tunnel to your target VM using the following command.

   ```azurecli
   az network bastion tunnel --name "<BastionName>" --resource-group "<ResourceGroupName>" --target-resource-id "<VMResourceId or VMSSInstanceResourceId>" --resource-port "<TargetVMPort>" --port "<LocalMachinePort>"
   ```

1. Connect to your target VM using SSH or RDP, the native client of your choice, and the local machine port you specified in Step 2.

   For example, you can use the following command if you have the OpenSSH client installed on your local computer:

   ```azurecli
   ssh <username>@127.0.0.1 -p <LocalMachinePort>
   ```

## Next steps

[Upload or download files](vm-upload-download-native.md)
