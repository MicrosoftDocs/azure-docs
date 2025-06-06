---
title: How to connect to a Login Node through Bastion
description: How to securily connect using SSH to a Login Node through Bastion
author: xpillons
ms.date: 05/27/2025
ms.author: padmalathas
---

# How to connect to a Login Node through Bastion
There's no SSH route open from your local environment to Virtual Machines running in an Azure CycleCloud Workspace for Slurm by default for security reasons. However, an Azure Bastion can be deployed and used to SSH through to your Virtual Machines. Below are the instructions on how to do based on this documentation: [Connect to a VM using Bastion](/azure/bastion/connect-vm-native-client-linux).

## Step 1 – Identify the SSH private key locally
Locate the private SSH key file associated with the public key provided during the deployment. If it isn't accessible locally, then download it.

## Step 2 – Retrieve the Resource ID of the Login Node
From the CycleCloud UI, select the Login node to which you want to connect and double click on that line to open the detail view of the node. Select the VM tab to display the resource details below and copy the `ResourceId`.

:::image type="content" source="../../images/ccws/login-node-resource-id.png" alt-text="Login Node properties":::

## Step 3 – Create a connect script
Create a login script using the template below. Paste the login node `resourceID` retrieved above and specify the resource group and the private SSH key file to use.

```bash
#!/bin/bash
resourceId=<paste_your_loginnode_id>
resourceGroup=$(echo $resourceId | cut -d'/' -f5)

az network bastion ssh --name bastion --resource-group $resourceGroup --target-resource-id $resourceId --auth-type ssh-key --username hpcadmin --ssh-key hpcadmin_id_rsa
```

> Note: The github repository https://github.com/Azure/cyclecloud-slurm-workspace.git contains the utility script `./util/ssh_thru_bastion.sh` to help connecting.

## Step 4 - Connect
Run the script created/updated above to SSH on the login node.
