---
title: Create Avere role with no controller - Avere vFXT for Azure
description: Method to create the required RBAC role without a cluster controller VM
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 10/31/2018
ms.author: v-erkell
---


# Create the Avere vFXT cluster runtime access role without a controller

This document shows a method to create the cluster node access role from the command line before you create the cluster controller VM. 

To create it from the cluster controller, read [Create the cluster node access role](avere-vfxt-deploy.md#create-the-cluster-node-access-role). The controller image includes a role prototype file. You can update the file with your subscription ID and use it to define the role locally on the controller VM.

## Create an Azure RBAC role

The Avere vFXT system uses [role-based access control](https://docs.microsoft.com/azure/role-based-access-control/) (RBAC) to authorize the vFXT cluster nodes to perform necessary tasks.  

As part of normal vFXT cluster operation, individual vFXT nodes need to do things like read Azure resource properties, manage storage, and control other nodes' network interface settings. 

This role is used for the vFXT nodes only, not for the cluster controller VM.  

If you want to create the role before the controller, follow these steps: 

1. Open the Azure Cloud Shell in the Azure portal or browse to [https://shell.azure.com](https://shell.azure.com).

1. Use the Azure CLI command to switch to your vFXT subscription:

   ```az account set --subscription YOUR_SUBSCRIPTION_ID```

1. Use these commands to download the role definition from the marketplace image and edit it. 

   ```bash
   wget -O- https://averedistribution.blob.core.windows.net/public/vfxtdistdoc.tgz | tar zxf - avere-cluster.json
   vi avere-cluster.json
   ``` 

4. Edit the file to include your subscription ID and delete the line above it. Save the file as ``avere-cluster.json``.

   ![Console text editor showing the subscription ID and the "remove this line" selected for deletion](media/avere-vfxt-edit-role.png)

5. Create the role:  

   ```bash
   az role definition create --role-definition /avere-cluster.json
   ```

When you create the cluster, supply the name of the role (in this case, `avere-cluster`). The cluster creation script assigns the role to the newly created cluster nodes. 

## Sample cluster node runtime role definition

> [!IMPORTANT] 
> This sample definition was taken from a pre-GA version of the product. If the version you get with the current product distribution is different, use that version instead.

```json

{
    "AssignableScopes": [
        "/subscriptions/YOUR_SUBSCRIPTION_ID_GOES_HERE"
    ],
    "Name": "avere-cluster",
    "IsCustom": "true",
    "Description": "Avere cluster runtime role",
    "NotActions": [],
    "Actions": [
        "Microsoft.Compute/virtualMachines/read",
        "Microsoft.Network/networkInterfaces/read",
        "Microsoft.Network/networkInterfaces/write",
        "Microsoft.Network/virtualNetworks/subnets/read",
        "Microsoft.Network/virtualNetworks/subnets/join/action",
        "Microsoft.Network/networkSecurityGroups/join/action",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/write"
    ],
    "DataActions": [
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/delete",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/read",
        "Microsoft.Storage/storageAccounts/blobServices/containers/blobs/write"
    ]
}

```