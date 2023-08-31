---
title: Configure external tools for SAP Deployment Automation Framework
description: Learn how to configure external tools for using SAP Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/19/2022
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Configure external tools to use with SAP Deployment Automation Framework

This article describes how to configure external tools to use SAP Deployment Automation Framework.

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

1. Save the file where you keep SSH keys. For example, use `C:\\Users\\<your-username>\\.ssh\weeu_deployer.ssh`. Make sure that you save the file without an extension.

After you've downloaded the SSH key for the deployer, you can use it to connect to the deployer virtual machine.

### Get the public IP of the deployer

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Find the resource group for the deployer. The name starts with `MGMT-[REGION_CODE]-DEP00` unless you've deployed the control plane by using a custom naming convention. The contents of the deployer resource group should look like the following image.

    :::image type="content" source="media/tutorial/deployer-resource-group.png" alt-text="Screenshot that shows deployer resources":::

1. Find the public IP for the deployer. The name should end with `-pip`. Filter by **type**, if necessary.

1. Copy the IP address.

### Install the Remote Development extension

1. Open the **Extensions** window by selecting **View** > **Extensions** or by selecting Ctrl+Shift+X.

1. Ensure that the **Remote Development** extension is installed.

### Connect to the deployer

1. Open the command palette by selecting **View** > **Command Palette** or by selecting Ctrl+Shift+P. Enter **Connect to host**. You can also select the icon in the lower-left corner of Visual Studio Code and select **Connect to host**.

1. Select **Add New SSH Host**.

    ```bash
    ssh -i `C:\\Users\\<your-username>\\weeu_deployer.ssh` azureadm@<IP_Address>
    ```

    > [!NOTE]
    > Change <IP_Address> to reflect the deployer IP.

1. Select **Connect**. Select **Linux** when you're prompted for the target operating system, and accept the remaining dialogs (such as key and trust).

1. When connected, select **Open Folder** and open the `/Azure_SAP_Automated_Deployment` folder.

## Next step

> [!div class="nextstepaction"]
> [Configure the SAP workload zone](deploy-workload-zone.md)
