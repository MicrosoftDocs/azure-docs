---
title: Customized controller access role - Avere vFXT for Azure
description: How to create a custom access role for the Avere vFXT cluster controller
author: ekpgh
ms.service: avere-vfxt
ms.topic: conceptual
ms.date: 01/29/2019
ms.author: v-erkell
---

# Customized controller access role

The Avere vFXT for Azure cluster controller uses a managed identity and role-based access control (RBAC) to allow it to create and manage the cluster. 

By default, the cluster controller is assigned the [built-in Owner role](../role-based-access-control/built-in-roles.md#owner). Also, the controller's access is scoped to its resource group - it can't modify elements outside the cluster's resource group.

This article explains how to create your own access role for the cluster controller instead of using the default setting. 

## Edit the role prototype

Start from the prototype role available at <https://github.com/Azure/Avere/blob/master/src/vfxt/src/roles/AvereContributor.txt>.

```json
{
  "AssignableScopes": [
    "/subscriptions/YOUR SUBSCRIPTION ID HERE"
  ],
  "Name": "Avere custom contributor",
  "IsCustom": true,
  "Description": "Can create and manage an Avere vFXT cluster.",
  "NotActions": [],
  "Actions": [
    "Microsoft.Authorization/*/read",
    "Microsoft.Compute/*/read",
    "Microsoft.Compute/availabilitySets/*",
    "Microsoft.Compute/virtualMachines/*",
    "Microsoft.Compute/disks/*",
    "Microsoft.Insights/alertRules/*",
    "Microsoft.Network/*/read",
    "Microsoft.Network/networkInterfaces/*",
    "Microsoft.Network/virtualNetworks/read",
    "Microsoft.Network/virtualNetworks/subnets/join/action",
    "Microsoft.Network/virtualNetworks/subnets/read",
    "Microsoft.Resources/deployments/*",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Resources/subscriptions/resourceGroups/resources/read",
    "Microsoft.Storage/*/read",
    "Microsoft.Storage/storageAccounts/listKeys/action",
    "Microsoft.Support/*"
  ],
  "DataActions": []
}
```

Add the subscription ID for the Avere vFXT for Azure deployment in the AssignableScopes statement. Customize the name and add or alter definitions as needed. 

Be careful if you restrict privileges. Cluster creation can fail if the controller does not have sufficient access. 

For help understanding what privileges the cluster controller needs to create a cluster, [open a support ticket](avere-vfxt-open-ticket.md#open-a-support-ticket-for-your-avere-vfxt). 

Save your custom role definition as a .json file. 

## Define the role 

Follow these steps to add the custom role definition to your subscription. 

1. Open the Azure Cloud Shell in the Azure portal or browse to [https://shell.azure.com](https://shell.azure.com).

1. Use the Azure CLI command to switch to your vFXT subscription:

   ```azurecli
   az account set --subscription YOUR_SUBSCRIPTION_ID
   ```

1. Create the role:

   ```azurecli
   az role definition create --role-definition /avere-contributor-custom.json
   ```

   Use your filename and path in place of ```/avere-contributor-custom.json``` in this example. 

Save the output of the role definition command - it contains the role identifier that you need to supply to the cluster creation template. 

## Find the role ID

The Avere vFXT deployment template needs the role's globally unique identifier (GUID) to assign the controller a custom role. 

The role GUID is a 32-character string in this form: 8e3af657-a8ff-443c-a75c-2fe8c4bcb635

To look up your role's GUID, use this command with your role name in the ```--name``` parameter.

```azurecli
az role definition list --query '[*].{roleName:roleName, name:name}' -o table --name 'YOUR ROLE NAME'
```
Enter this string in the **Avere cluster create role ID** field when deploying the Avere vFXT for Azure.

## Next steps

Read how to deploy the Avere vFXT for Azure in [Deploy the vFXT cluster](avere-vfxt-deploy.md)
