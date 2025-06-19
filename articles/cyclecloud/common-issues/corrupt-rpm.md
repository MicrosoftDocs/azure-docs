---
title: Common Issues - Corrupt RPM database
description: Azure CycleCloud common issue - Corrupt RPM database
author: andyhoward
ms.date: 06/20/2023
ms.author: anhoward
ms.topic: conceptual
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---


# Common Issues: Corrupt RPM database

## Possible Error Messages

- `Detected corrupt RPM database, rebuilding`

## Resolution

This error message can occur when using a custom image that was captured after doing a `yum update` or other yum command that leaves a stale yum lock file. The easiest way to mitigate this issue is to reboot the VM before deprovisioning and capturing the image.
