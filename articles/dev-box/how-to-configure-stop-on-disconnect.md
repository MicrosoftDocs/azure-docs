---
title: Set a dev box auto-stop schedule
titleSuffix: Microsoft Dev Box
description: Learn how to configure stop on disconnect to automatically stop  dev boxes in a pool when a user .
services: dev-box
ms.service: dev-box
ms.custom: devx-track-azurecli
author: dhruvmu
ms.author: rosemalcolm
ms.date: 01/10/2024
ms.topic: how-to
---

# Auto-stop your Dev Boxes on schedule

To save on costs, you can configure your Dev Box pools to stop when a user disconnects from their RDP session

> [!NOTE]
> Stop on disconnect will only apply to Dev Boxes that are created with hibernation enabled Dev Box definitions. To learn more about enabling hibernation on your Dev Box definitions, see  [how to configure dev box hibernation](./how-to-configure-dev-box-hibernation.md)

## Permissions

To manage a dev box schedule, you need the following permissions:

| Action | Permission required |
|---|---|
| _Configure a schedule_ | Owner, Contributor, or DevCenter Project Admin. |


## Manage an auto-stop schedule with the Azure CLI

You can manage stop on disconnect settings on dev box pools by using the Azure CLI.


### Update a pool wiith stop on disconnect

The following Azure CLI command enables stop on disconnect on a dev box pool:

```azurecli
az devcenter admin pool update --pool-name {poolName} --project {projectName} --resource-group {resourceGroupName} --stop-on-disconnect status="Enabled" grace-period-minutes="180"
```

| Parameter | Value |
|---|---|
| `pool-name` | Name of your dev box pool. |
| `project` | Name of your dev box project. |
| `resource-group` | Name of the resource group for your dev box pool. |
| `grace-period-minutes` | Duration to wait after the user disconnects from an RDP session before stopping the dev box, in minutes|
| `status` | Indicates whether the schedule is in use. The options include `Enabled` or `Disabled`. |

### Disable stop on disconnect

The following Azure CLI command enabdisablesles stop on disconnect on a dev box pool:

```azurecli
az devcenter admin pool update --pool-name {poolName} --project {projectName} --resource-group {resourceGroupName} --stop-on-disconnect status="Disabled" 
```

| Parameter | Value |
|---|---|
| `pool-name` | Name of your dev box pool. |
| `project-name` | Name of your dev box project. |

## Related content
- [How to configure dev box hibernation](./how-to-configure-dev-box-hibernation.md)
- [Manage a dev box definition](./how-to-manage-dev-box-definitions.md)
- [Manage a dev box by using the developer portal](./how-to-create-dev-boxes-developer-portal.md)
