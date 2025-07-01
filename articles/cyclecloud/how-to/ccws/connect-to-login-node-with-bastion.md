---
title: How to connect to a Sign-In Node through Bastion
description: How to securely connect using SSH to a Sign-In Node through Bastion
author: xpillons
ms.date: 07/01/2025
ms.author: padmalathas
---

# How to connect to an authentication node through Bastion

For security reasons, there's no SSH route open from your local environment to virtual machines running in an Azure CycleCloud Workspace for Slurm. However, you can deploy an Azure Bastion and use it to SSH to your virtual machines. The following instructions explain how to set up the connection. For more information, see [Connect to a VM using Bastion](/azure/bastion/connect-vm-native-client-linux).

## Step 1 – Find the SSH private key on your computer
Find the private SSH key file that matches the public key you provide during deployment. If you can't find the key on your computer, download it.

## Step 2 – Get the resource ID of the authentication node
In the CycleCloud UI, select the authentication node you want to connect to and double-click that line to open the detail view for the node. Select the **VM** tab to display the resource details, and copy the `ResourceId`.

:::image type="content" source="../../images/ccws/login-node-resource-id.png" alt-text="Authentication node properties":::

## Step 3 – Create a connect script
Create an authentication script using the following template. Paste the authentication node `resourceID` from the previous step, and specify the resource group and the private SSH key file to use.

```bash
#!/bin/bash
resourceId=<paste_your_loginnode_id>
resourceGroup=$(echo $resourceId | cut -d'/' -f5)

az network bastion ssh --name bastion --resource-group $resourceGroup --target-resource-id $resourceId --auth-type ssh-key --username hpcadmin --ssh-key hpcadmin_id_rsa
```

> [!NOTE]
> The GitHub repository https://github.com/Azure/cyclecloud-slurm-workspace.git contains the utility script `./util/ssh_thru_bastion.sh` to help with connecting.

## Step 4 - Connect
Run the preceding script to SSH to the authentication node.
