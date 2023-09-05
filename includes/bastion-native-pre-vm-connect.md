---
author: cherylmc
ms.service: bastion
ms.topic: include
ms.date: 07/19/2023
ms.author: cherylmc
---
Before you begin, verify that you have the following prerequisites:

* The latest version of the CLI commands (version 2.32 or later) is installed. You can update your CLI for Bastion using `az extension update --name bastion`. For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli) and [Get Started with Azure CLI](/cli/azure/get-started-with-azure-cli).
* Azure Bastion is already deployed and configured for your virtual network. For steps, see [Configure Bastion for native client connections](../articles/bastion/native-client.md).
* A virtual machine in the virtual network.
* The VM's Resource ID. The Resource ID can be easily located in the Azure portal. Go to the Overview page for your VM and select the *JSON View* link to open the Resource JSON. Copy the Resource ID at the top of the page to your clipboard to use later when connecting to your VM.
* If you plan to sign in to your virtual machine using your Azure AD credentials, make sure your virtual machine is set up using one of the following methods:
  * Enable Azure AD sign-in for a [Windows VM](../articles/active-directory/devices/howto-vm-sign-in-azure-ad-windows.md) or [Linux VM](../articles/active-directory/devices/howto-vm-sign-in-azure-ad-linux.md).
  * [Configure your Windows VM to be Azure AD-joined](../articles/active-directory/devices/concept-directory-join.md).
  * [Configure your Windows VM to be hybrid Azure AD-joined](../articles/active-directory/devices/concept-hybrid-join.md).
