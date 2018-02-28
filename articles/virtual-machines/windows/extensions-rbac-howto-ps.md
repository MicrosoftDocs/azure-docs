---
title: Use RBAC to Restrict Installation | Microsoft Docs
description: Example to show using Azure RBAC to restrict installing extensions on Azure.
services: virtual-machines-linux 
documentationcenter: ''
author: danielsollondon 
manager: timlt 
editor: ''

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 02/05/2018
ms.author: danis

---

# How to use Azure RBAC to Restrict Extension Installation
In the scenario where you wish to have an Azure user with a VM monitoring role and restrict extension installation you can use a custom RBAC role.

## Create a Custom RBAC Role

This example allows a set of **Actions** (allow) and **NotActions** (not allow) that restrict extensions.

In a [bash Cloud Shell](https://shell.azure.com/bash), type:

```bash 
vim ~/clouddrive/role.json
```

Copy and paste the following JSON into the file.

```json
{
    "Name": "Virtual Machine Maintainer",
    "IsCustom":true,
    "Description": "Can monitor, restart virtual machines, but not install extensions",
    "Actions":[
        "Microsoft.Storage/*/read",
        "Microsoft.Network/*/read",
        "Microsoft.Compute/*/read",
        "Microsoft.Compute/virtualMachines/start/action",
        "Microsoft.Compute/virtualMachines/restart/action",
        "Microsoft.Authorization/*/read",
        "Microsoft.Resources/subscriptions/resourceGroups/read",
        "Microsoft.Insights/alertRules/*",
        "Microsoft.Support/*"
    ],
    "NotActions":[
        "Microsoft.Compute/virtualMachines/extensions/write"
    ],
    "AssignableScopes":[
        "/subscriptions/e049fcf1-c84b-4de4-ba9a-a168a4cbab7a"
    ]

}
```

When you are done, hit the **Esc** key and then type **:wq** to save and close the file.

## Create The Role

Use [az role definition create](/cli/azure/role/definition#az_role_definition_create) to create the role using the role.json definition.

```azurecli-interactive
az role definition create --role-definition ~/clouddrive/role.json
```

Make sure that it was created.

```azurecli-interactive
az role definition list --output table | grep Maintainer
```

## Assign the Role

Use [az role assignment create](/cli/azure/role/assignment#az_role_definition_create) to assign the role. You can assign the role to a user, group or service principal. In this example, we assign the role to the user **azureuser**. 

```bash
az role assignment create --assignee azureuser --role "Virtual Machine Maintainer"
```


## Test the role

Try to install an extension. If using the portal, the extension 'Add' button is grayed out.

Using CLI:
```bash
az vm extension set \
  --resource-group operational \
  --vm-name pythonbottle \
  --name customScript \
  --publisher Microsoft.Azure.Extensions \
  --settings '{"commandToExecute": "echo hello "}'
```

Example of the error, after the RBAC assignment:
```text
The client 'xxxxxxx' with object id 'b000000-000c-000c-0000-d00000000a' does not have authorization to perform action 'Microsoft.Compute/virtualMachines/extensions/write' over scope '/subscriptions/oooooo-xxxxx-xxxx-xxxx-xxxxxxxxx/resourceGroups/operational/providers/Microsoft.Compute/virtualMachines/pythonbottle/extensions/customScript'.

```
## Next steps
This is just a small example on how to restrict extension provisioning, but you can define the scope and a whole host of more options, please refer to:

[Azure Policy Introduction](/azure/azure-policy/azure-policy-introduction)

[Role Assignment](/cli/azure/role/assignment?view=azure-cli-latest#az_role_assignment_create)
