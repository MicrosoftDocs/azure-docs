---
title: 'Connect to a Windows VM using RDP'
titleSuffix: Azure Bastion
description: Learn how to use Azure Bastion to connect to Windows VM using RDP.
author: abell
ms.service: azure-bastion
ms.topic: how-to
ms.date: 03/31/2025
ms.author: abell

# Customer intent: "As a cloud administrator, I want to establish a secure RDP connection to a Windows VM using a Bastion host, so that I can access my virtual machines without exposing them to the public internet."
---

# Create an RDP connection to a Windows VM using Azure Bastion

This article shows you how to securely and seamlessly create an RDP connection to your Windows VMs located in an Azure virtual network directly through the Azure portal. When you use Azure Bastion, your VMs don't require a client, agent, or additional software. You can also connect to a Windows VM using SSH. For information, see [Create an SSH connection to a Windows VM](bastion-connect-vm-ssh-windows.md).

Azure Bastion provides secure connectivity to all of the VMs in the virtual network in which it's provisioned. Using Azure Bastion protects your virtual machines from exposing RDP/SSH ports to the outside world, while still providing secure access using RDP/SSH. For more information, see [What is Azure Bastion?](bastion-overview.md)

> [!NOTE]
> Entra ID authentication for RDP connections is now available in public preview! See [Microsoft Entra ID](#microsoft-entra-id-authentication-preview) for details.

## Prerequisites

Before you begin, verify that you've met the following criteria:

* A VNet with the Bastion host already installed.

  * Make sure that you have set up an Azure Bastion host for the virtual network in which the VM is located. Once the Bastion service is provisioned and deployed in your virtual network, you can use it to connect to any VM in the virtual network.
  * To set up an Azure Bastion host, see [Create a bastion host](tutorial-create-host-portal.md#createhost). If you plan to configure custom port values, be sure to select the Standard SKU or higher when configuring Bastion.

* A Windows virtual machine in the virtual network.

### Required roles

* Reader role on the virtual machine.
* Reader role on the NIC with private IP of the virtual machine.
* Reader role on the Azure Bastion resource.
* Reader role on the virtual network of the target virtual machine (if the Bastion deployment is in a peered virtual network).

## Microsoft Entra ID authentication (Preview)

> [!NOTE]
> Microsoft Entra ID Authentication support for RDP connections within the portal is only supported for Windows VMs. For SSH connections to Linux VMs, see [Connect to a Linux VM using SSH](bastion-connect-vm-ssh-linux.md#microsoft-entra-id-authentication).

If the following prerequisites are met, Microsoft Entra ID becomes the default option to connect to your VM. If any prerequisite is not met, Microsoft Entra ID will not be presented as a Connection Method. To learn more about Entra ID authentication for Azure machines, see [Enable Microsoft Entra sign in for a Windows virtual machine in Azure or Arc-enabled Windows Server](/entra/identity/devices/howto-vm-sign-in-azure-ad-windows#enable-microsoft-entra-sign-in-for-a-windows-virtual-machine-in-azure-or-arc-enabled-windows-server)

Prerequisites:

* **AADLoginForWindows** extension should be enabled on the VM. Microsoft Entra ID Login can be enabled during VM creation by checking the box for **Login with Microsoft Entra ID** or by adding the **AADLogin** extension to a pre-existing VM.

* One of the following required roles should be configured on the VM for the user:

  * **Virtual Machine Administrator Login**: This role is necessary if you want to sign in with administrator privileges.
  * **Virtual Machine User Login**: This role is necessary if you want to sign in with regular user privileges.

Use the following steps to authenticate using Microsoft Entra ID.

1. To authenticate using Microsoft Entra ID, configure the following settings.

    | Setting                | Description                                                                 |
    |------------------------|-----------------------------------------------------------------------------|
    | **Connection Settings**| Only available for SKUs higher than the Basic SKU.                          |
    | **Protocol**           | Select RDP.                                                                 |
    | **Port**               | Specify the port number.                                                    |
    | **Authentication type**| Select **Microsoft Entra ID (Preview)** from the dropdown.                            |
    
1. To work with the VM in a new browser tab, select **Open in new browser tab**.

1. Click **Connect** to connect to the VM.

Limitations
* RDP + Entra ID authentication support in the portal cannot be used concurrently with graphical session recording.

### Ports

To connect to the Windows VM, you must have the following ports open on your Windows VM:

* Inbound port: RDP (3389) ***or***
* Inbound port: Custom value (you'll then need to specify this custom port when you connect to the VM via Azure Bastion)

> [!NOTE]
> If you want to specify a custom port value, Azure Bastion must be configured using the Standard SKU or higher. The Basic SKU does not allow you to specify custom ports.

### Rights on target VM

[!INCLUDE [Remote Desktop Users](../../includes/bastion-remote-desktop-users.md)]

See the [Azure Bastion FAQ](bastion-faq.md) for additional requirements.

## <a name="rdp"></a>Connect

[!INCLUDE [Connect to a Windows VM](../../includes/bastion-vm-rdp.md)]
 
## Next steps

Read the [Bastion FAQ](bastion-faq.md) for more connection information.
