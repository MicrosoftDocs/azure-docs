---
title: Common Issues - Creating Network Resources
description: Azure CycleCloud common issue - Creating Network Resources
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
---
# Common issues: Creating network resources

## Possible error messages

- `Creating network interface (Failure creating network interface for node)`
- `Failed to create load balancer for cell`
- `Failed to create Public IP for node`
- `Failed to create Public IP for cell`
- `Failed to create network interface for node`
- `Failed to create Network Security Group for node`

## Resolution

In most cases, these errors occur because the service principal doesn't have enough privileges. Add the **contributor** role to the service principal or assign specific permissions to the service principal.

To add **contributor** to your service principal:
```azurecli-interactive
az role assignment create --assignee APP_ID --role Contributor
```

## More info

For more information about specific permissions required for CycleCloud, see [Create a custom role and managed identity for CycleCloud](/azure/cyclecloud/managed-identities#create-a-custom-role-and-managed-identity-for-cyclecloud).