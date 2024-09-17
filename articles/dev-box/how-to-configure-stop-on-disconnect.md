---
title: Stop dev boxes automatically when a user disconnects.
titleSuffix: Microsoft Dev Box
description: Learn how to automatically stop a dev box when a user disconnects by configuring the auto stop setting on the Dev Box Pool.


services: dev-box
ms.service: dev-box
ms.custom: devx-track-azurecli
author: dhruvchand
ms.author: dhruvmu
ms.date: 01/10/2024
ms.topic: how-to

#Customer intent: As a Dev Box administrator, I want to configure dev boxes to stop when a user disconnects so that I can control costs.
---

# Auto-stop your Dev Boxes when users disconnect


To save on costs, you can configure your Dev Box pools to stop when a user disconnects from their RDP session, after a timeout period that you can configure. Microsoft Dev Box attempts to stop all dev boxes after a user disconnects, and they do not re-establish a new RDP session within the configured timeout period.


> [!NOTE]
> Stop on disconnect will only apply to Dev Boxes that are created with hibernation enabled Dev Box definitions. To learn more about enabling hibernation on your Dev Box definitions, see  [how to configure dev box hibernation](./how-to-configure-dev-box-hibernation.md).  

> [!IMPORTANT]
> Dev Box Hibernation is currently in PREVIEW.
> For more information about the preview status, see the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). The document defines legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Permissions

To manage stop on connect settings on a dev box pool, you need the following permissions:

| Action | Permission required |
|---|---|
| _Configure a pool_ | Owner, Contributor, or DevCenter Project Admin. |


## Manage stop on disconnect settings with the Azure CLI

You can manage stop on disconnect settings on dev box pools by using the Azure CLI.


### Update a pool with stop on disconnect

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
| `status` | Indicates whether stop on disconnect is in use. The options include `Enabled` or `Disabled`. |

### Disable stop on disconnect

The following Azure CLI command disables stop on disconnect on a dev box pool:

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
