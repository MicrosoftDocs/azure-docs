---
title: Common Issues - Unknown Config Status
description: Azure CycleCloud common issue - Unknown Config Status
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Unknown configuration status returned

## Possible Error Messages

- `Unknown configuration status returned`

## Resolution

This message indicates a jetpack failure that we're unable to characterize. Hopefully this category gets smaller and smaller over time.

By logging into the log there may be informative messages in `/opt/cycle/jetpack/logs/jetpack.log` to help troubleshoot this failure.

Verify that the jetpack version (`jetpack -v`) matches the CycleCloud version.