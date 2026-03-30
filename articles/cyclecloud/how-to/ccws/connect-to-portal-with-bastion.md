---
title: How to connect to the CycleCloud Portal through Bastion
description: How to securely connect to the CycleCloud Portal using Bastion
author: xpillons
ms.date: 07/01/2025
ms.author: padmalathas
---

# How to connect to the CycleCloud Portal through Bastion
You can deploy an Azure Bastion to establish an SSH tunnel to your Azure CycleCloud virtual machine when the HTTPS route is unavailable in your local environment. For detailed instructions, see [Connect to a VM - tunnel command](/azure/bastion/connect-vm-native-client-linux#tunnel).

## Step 1 – Retrieve the resource ID of the CycleCloud VM
To retrieve the resource ID of the `ccw-cyclecloud-vm` virtual machine, go to the Azure portal. From the virtual machine view, select **Settings**, then **Properties**, and you find the **ResourceID**.

## Step 2 – Create a connect script
Create a bash script using the following template. Paste the CycleCloud `resourceID` that you got earlier.

```bash
#!/bin/bash

resourceId=<vm_resource_id>
resourceGroup=$(echo $resourceId | cut -d'/' -f5)

az network bastion tunnel --name bastion --resource-group $resourceGroup --target-resource-id $resourceId --resource-port 443 --port 8443
```

> [!NOTE]
> The GitHub repository https://github.com/Azure/cyclecloud-slurm-workspace.git contains the utility script _./util/tunnel_thru_bastion.sh_ to help connecting.


## Step 3 - Create the tunnel
Run the script you created or updated to start the SSH tunnel.

## Step 4 - Connect to CycleCloud

Go to `https://localhost:8443` and connect to CycleCloud.
