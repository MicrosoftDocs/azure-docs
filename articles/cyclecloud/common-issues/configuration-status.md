---
title: Common Issues - Unknown Config Status
description: Troubleshoot the 'Unknown configuration status returned' error in Azure CycleCloud and how to resolve it.
author: adriankjohnson
ms.date: 06/19/2026
ms.topic: troubleshooting-problem-resolution
ms.author: adjohnso
---
# Common issues: Unknown configuration status returned

## Possible error messages

- `Unknown configuration status returned`

## Resolution

This message indicates a jetpack failure that the system can't characterize.

To troubleshoot this failure, check the log at `/opt/cycle/jetpack/logs/jetpack.log` for informative messages.

Make sure the jetpack version (`jetpack -v`) matches the CycleCloud version.