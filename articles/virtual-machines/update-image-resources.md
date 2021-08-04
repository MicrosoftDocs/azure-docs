---
title: List, update, and delete image resources 
description: List, update, and delete image resources in your shared image gallery.
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 08/03/2021
ms.author: cynthn
ms.reviewer: akjosh 
ms.custom: devx-track-azurecli
---

# List, update, and delete image resources 

You can manage your shared image gallery resources using the Azure CLI or Azure PowerShell.

### [CLI](#tab/cli)
[!INCLUDE [virtual-machines-common-gallery-list-cli.md](../../includes/virtual-machines-common-gallery-list-cli.md)]

[!INCLUDE [virtual-machines-common-shared-images-update-delete-cli](../../includes/virtual-machines-common-shared-images-update-delete-cli.md)]

### [PowerShell]](#tab/powershell)

[!INCLUDE [virtual-machines-common-gallery-list-ps.md](../../includes/virtual-machines-common-gallery-list-ps.md)]

[!INCLUDE [virtual-machines-common-shared-images-update-delete-ps](../../includes/virtual-machines-common-shared-images-update-delete-ps.md)]
---

## Next steps

[Azure Image Builder (preview)](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./linux/image-builder-gallery-update-image-version.md).