---
title: Common Issues - Unknown Config Status
description: Azure CycleCloud common issue - Unknown Config Status
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
---
# Common issues: Unknown configuration status returned

## Possible error messages

- `Unknown configuration status returned`

## Resolution

This message indicates a jetpack failure that the system can't characterize.

To troubleshoot this failure, check the log at `/opt/cycle/jetpack/logs/jetpack.log` for informative messages.

Make sure the jetpack version (`jetpack -v`) matches the CycleCloud version.