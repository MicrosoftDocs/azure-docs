---
title: Common Issues - Creating Network Resources
description: Azure CycleCloud common issue - Creating Network Resources
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Creating Network Resources

## Possible Error Messages

- `Creating network interface (Failure creating network interface for node)`
- `Failed to create load balancer for cell`
- `Failed to create Public IP for node`
- `Failed to create Public IP for cell`
- `Failed to create network interface for node`
- `Failed to create Network Security Group for node`

## Resolution

In most cases, these errors are due to insufficient privileges for the service principal. Add the "contributor" role to the service principal or assign specific permissions to the service principal.

To add "contributor" to your service principal:
```azurecli-interactive
az role assignment create --assignee APP_ID --role Contributor
```

## More Info

For more information about specific permissions required for CycleCloud, see [Create a custom role and managed identity for CycleCloud](/azure/cyclecloud/managed-identities#create-a-custom-role-and-managed-identity-for-cyclecloud)