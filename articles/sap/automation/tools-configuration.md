---
title: Configuring external tools for the SAP on Azure Deployment Automation Framework
description: Describes how to configure external tools for using SAP on Azure Deployment Automation Framework.
author: kimforss
ms.author: kimforss
ms.reviewer: kimforss
ms.date: 10/19/2022
ms.topic: conceptual
ms.service: sap-on-azure
ms.subservice: sap-automation
---

# Configuring external tools to use with the SAP on Azure Deployment Automation Framework

This document describes how to configure external tools to use the SAP on Azure Deployment Automation Framework.

## Configuring Visual Studio Code

### Copy the ssh key from the key vault

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Select or search for **Key vaults**.

1. On the **Key vault** page, find the deployer key vault. The name starts with `MGMT[REGION]DEP00user`. Filter by the **Resource group** or **Location** if necessary.

1. Select **Secrets** from the **Settings** section in the left pane.

1. Find and select the secret containing **sshkey**. It might look like this: `MGMT-[REGION]-DEP00-sshkey`

1. On the secret's page, select the current version. Then, copy the **Secret value**.

1. Create a new file in VS Code and copy in the secret value. 
 
1. Save the file where you keep SSH keys. For example, `C:\\Users\\<your-username>\\.ssh\weeu_deployer.ssh`. Make sure that you save the file without an extension.

Once you have downloaded the ssh key for the deployer, you can use it to connect to the Deployer virtual machine.

### Get the public IP of the deployer

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Find the resource group for the Deployer. The name starts with `MGMT-[REGION_CODE]-DEP00` unless you have deployed the control plane using a custom naming convention. The contents of the Deployer resource group should look like the image shown below.

    :::image type="content" source="media/tutorial/deployer-resource-group.png" alt-text="Screenshot of Deployer resources":::

1. Find the public IP for the deployer. The name should end with `-pip`. Filter by the **type** if necessary. 

1. Copy the IP Address.


### Install the Remote Development extension

1. Open the Extensions window by selecting View - Extensions or by using the `Ctrl-Shift-X` keyboard shortcut.
 
1. Ensure that the *Remote Development* extension is installed

### Connect to the Deployer

1. Open the Command Palette by selecting View - Command Palette or by using the `Ctrl-Shift-P` keyboard shortcut and type "Connect to host". You can also click on the icon in the lower left corner of VS Code and choose "Connect to host"

1. Choose "Add New SSH Host"

    ```bash
    ssh -i `C:\\Users\\<your-username>\\weeu_deployer.ssh` azureadm@<IP_Address>
    ```
    > [!NOTE] 
    >Change the <IP_Address> to reflect the Deployer IP.

1. Click Connect, choose Linux when prompted for the target operating system, accept the remaining dialogues (key, trust etc.)

1. When connected choose Open Folder and open the "/Azure_SAP_Automated_Deployment" folder.

## Next step

> [!div class="nextstepaction"]
> [Configure SAP Workload Zone](deploy-workload-zone.md)


