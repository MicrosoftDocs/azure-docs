---
title: Common Issues - Corrupt RPM database
description: Azure CycleCloud common issue - Corrupt RPM database
author: andyhoward
ms.date: 06/30/2025
ms.author: anhoward
ms.topic: conceptual
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---


# Common issues: Corrupt RPM database

## Possible error messages

- `Detected corrupt RPM database, rebuilding`

## Resolution

This error message can occur when you use a custom image that you captured after running `yum update` or another yum command that leaves a stale yum lock file. To fix this issue, reboot the VM before deprovisioning and capturing the image.
