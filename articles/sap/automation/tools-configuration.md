---
title: Configure external tools for SAP Deployment Automation Framework
description: Learn how to configure Visual Studio Code to connect to the deployer virtual machine for SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.date: 04/16/2026
ms.topic: how-to
ms.service: sap-on-azure
ms.subservice: sap-automation
ms.custom: sfi-image-nochange
# Customer intent: As a developer configuring deployment tools for SAP, I want to set up Visual Studio Code with the necessary SSH credentials, so that I can efficiently connect to the deployer virtual machine and automate deployment tasks.
---

# Configure external tools for SAP Deployment Automation Framework

This article describes how to configure Visual Studio Code to connect to the deployer virtual machine (VM) for SAP Deployment Automation Framework.

## Prerequisites

- A deployed SAP Deployment Automation Framework control plane, including a deployer VM. For more information, see [Deploy the control plane](deploy-control-plane.md).
- [Visual Studio Code](https://code.visualstudio.com/) installed on your local machine.
- Access to the deployer key vault in the Azure portal.

## Configure Visual Studio Code

Follow these steps to configure Visual Studio Code.

### Copy the SSH key from the key vault

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Key vaults**.

1. On the **Key vault** page, find the deployer key vault. The name starts with `MGMT[REGION]DEP00user`. Filter by **Resource group** or **Location**, if necessary.

1. On the **Settings** section in the left pane, select **Secrets**.

1. Find and select the secret that contains **sshkey**. It might look like `MGMT-[REGION]-DEP00-sshkey`.

1. On the secret's page, select the current version. Copy the **Secret value**.

1. Create a new file in Visual Studio Code and copy in the secret value.

1. Save the file where you keep SSH keys. For example, use `C:\Users\<your-username>\.ssh\weeu_deployer.ssh`. When you save the file, make sure the file type is set to **All Files** so the `.ssh` extension is preserved and no other extension like `.txt` is appended.

After you download the SSH key for the deployer, you can use it to connect to the deployer VM.

### Get the public IP of the deployer

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Find the resource group for the deployer. The name starts with `MGMT-[REGION_CODE]-DEP00` unless you deployed the control plane by using a custom naming convention. The contents of the deployer resource group should look like the following image.

   :::image type="content" source="media/tutorial/deployer-resource-group.png" alt-text="Screenshot that shows deployer resources in the Azure portal.":::

1. Find the public IP for the deployer. The name should end with `-pip`. Filter by **type**, if necessary.

1. Copy the IP address.

### Install the Remote Development extension

1. Open the **Extensions** window by selecting **View** > **Extensions** or by pressing **Ctrl + Shift + X**.

1. Ensure that the **Remote Development** extension is installed.

### Connect to the deployer

1. Open the command palette by selecting **View** > **Command Palette** or by pressing **Ctrl + Shift + P**. Enter **Connect to host**. You can also select the icon in the lower-left corner of Visual Studio Code and select **Connect to host**.

1. Select **Add New SSH Host**.

   ```bash
   ssh -i "C:\Users\<your-username>\.ssh\weeu_deployer.ssh" azureadm@<IP_Address>
   ```

   > [!NOTE]
   > Replace `<IP_Address>` with the deployer IP address.

1. Select **Connect**. Select **Linux** when you're prompted for the target operating system, and accept the remaining dialogs (such as key and trust).

1. When connected, select **Open Folder** and open the `/Azure_SAP_Automated_Deployment` folder.

## Related content

- [Configure the SAP workload zone](deploy-workload-zone.md)
- [Deploy the control plane](deploy-control-plane.md)
