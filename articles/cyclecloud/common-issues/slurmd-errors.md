---
title: Common Issues - Slurm Configuration| Microsoft Docs
description: Azure CycleCloud common issue - Slurm Configuration
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
---
# Common issues: Slurm configuration errors

## Possible error messages

- `Unable to execute command /usr/bin/systemctl --system start slurmd`

## Resolution

Because Slurm requires all of the nodes of a cluster to be defined in `slurm.conf`, CycleCloud pre-creates all of the VMs inside of CycleCloud when you first start the scheduler node. These VMs remain unallocated in Azure until a job requests them, but sometimes insufficient quota or incorrect autoscale limits cause installation issues. 

- Make sure your subscription has enough quota for the selected VM type and that the autoscale limits are below the quota amount. You might have to select a different VM type or adjust your autoscale limits.
- Check `/var/log/slurmctld/slurm.log` for any errors related to starting the scheduler.

