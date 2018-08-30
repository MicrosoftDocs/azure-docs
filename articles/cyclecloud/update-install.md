---
title: Update your Azure CycleCloud Installation | Microsoft Docs
description: Follow these instructions to keep your Azure CycleCloud installation up to date with the latest release.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: resource
ms.date: 08/01/2018
ms.author: a-kiwels
---

# Update Azure CycleCloud

It is recommended that you keep your Azure CycleCloud installation up to date with the latest version of the software. Please see the [Azure CycleCloud Service Policy](service-policy.md) for the full details on supported versions of the software. Download the latest version of the [Azure CycleCloud install file](https://www.microsoft.com/en-us/download/details.aspx?id=57182) from the Microsoft Download Center and update using the package manager.

> [!NOTE]
> Azure CycleCloud must be updated as `root` user.

For CentOS, use:

```CMD
yum upgrade <filename.rpm>
```

For Debian and Ubuntu, use:

```CMD
dpkg -i <filename.deb>
```

The update will take several minutes. When the update has completed, the server will come back up automatically.
