---
title: How to clean up roles using the CLI
description: How to clean up roles built in a Azure CycleCloud Workspace for Slurm environment using the Azure CLI
author: xpillons
ms.date: 08/29/2024
ms.author: xpillons
---

# Cleaning up roles

Deleting a deployment's resource group will delete all of the resources created by Azure Azure CycleCloud Workspace for Slurm but fail to remove its role assignments. To fix this, we provide `util/delete_roles.sh` to delete these role assignments for all resource groups, including those that were deleted or had their resources manually deleted.

```bash
./util/delete_roles.sh --location my-location --resource-group my-ccws-rg [--delete-resource-group]
```

> [!NOTE]
> It is required to temporarily recreate a deleted resource group in a simple deployment that outputs the GUIDs produced for the given resource group name and location. Passing in `--delete-resource-group` will clean up this resource group irrespective of whether it is a byproduct of this utility or created by the user.
