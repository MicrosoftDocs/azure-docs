---
title: Avere vFXT non-owner workaround - Azure
description: Workaround to allow users without subscription owner permission to deploy Avere vFXT for Azure
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 10/31/2018
ms.author: v-erkell
---

# Authorize non-owners to deploy Avere vFXT

These instructions are a workaround that allows a user without subscription owner privileges to create an Avere vFXT for Azure system.

(The recommended way to deploy the Avere vFXT system is to have a user with owner privileges do the creation steps, as explained in [Prepare to create the Avere vFXT](avere-vfxt-prereqs.md).)  

The workaround involves creating an additional access role that gives its users sufficient permissions to install the cluster. The role must be created by a subscription owner, and an owner must assign it to appropriate users. 

A subscription owner also must [accept the terms of use](avere-vfxt-prereqs.md) for the Avere vFXT marketplace image. 

> [!IMPORTANT] 
> All of these steps must be taken by a user with owner privileges on the subscription that will be used for the cluster.

1. Copy these lines and save them in a file (for example, `averecreatecluster.json`). Use your subscription ID in the `AssignableScopes` statement.

   ```json
   {
       "AssignableScopes": ["/subscriptions/<SUBSCRIPTION_ID>"],
       "Name": "avere-create-cluster",
       "IsCustom": "true"
       "Description": "Can create Avere vFXT clusters",
       "NotActions": [],
       "Actions": [
           "Microsoft.Authorization/*/read",
           "Microsoft.Authorization/roleAssignments/*",
           "Microsoft.Authorization/roleDefinitions/*",
           "Microsoft.Compute/*/read",
           "Microsoft.Compute/availabilitySets/*",
           "Microsoft.Compute/virtualMachines/*",
           "Microsoft.Network/*/read",
           "Microsoft.Network/networkInterfaces/*",
           "Microsoft.Network/routeTables/write",
           "Microsoft.Network/routeTables/delete",
           "Microsoft.Network/routeTables/routes/delete",
           "Microsoft.Network/virtualNetworks/subnets/join/action",
           "Microsoft.Network/virtualNetworks/subnets/read",
   
           "Microsoft.Resources/subscriptions/resourceGroups/read",
           "Microsoft.Resources/subscriptions/resourceGroups/resources/read",
           "Microsoft.Storage/*/read",
           "Microsoft.Storage/storageAccounts/listKeys/action"
       ],
   }
   ```

1. Run this command to create the role:

   `az role definition create --role-definition <PATH_TO_FILE>`

    Example:
    ```azurecli
    az role definition create --role-definition ./averecreatecluster.json
    ```

1. Assign this role to the user that will create the cluster:

   `az role assignment create --assignee <USERNAME> --scope /subscriptions/<SUBSCRIPTION_ID> --role 'avere-create-cluster'`

After this procedure, any user assigned this role has the following permissions for the subscription: 

* Create and configure the network infrastructure
* Create the cluster controller
* Run cluster creation scripts from the cluster controller to create the cluster
