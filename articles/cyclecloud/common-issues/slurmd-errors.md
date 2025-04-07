---
title: Common Issues - Slurm Configuration| Microsoft Docs
description: Azure CycleCloud common issue - Slurm Configuration
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Slurm configuration errors

## Possible Error Messages

- `Unable to execute command /usr/bin/systemctl --system start slurmd`

## Resolution

Because Slurm requires all of the nodes of a cluster to be defined in slurm.conf, CycleCloud pre-creates all of the VMs inside of CycleCloud when the scheduler node is first started. These VMs remain unallocated in Azure until a job requests them, but sometimes insufficient quota or incorrect autoscale limits can cause installation issues. 

- Make sure your subscription has enough quota for the selected VM type and that the autoscale limits are below the quota amount. You may have to select a different VM type or adjust your autoscale limits accordingly.
- Check in `/var/log/slurmctld/slurm.log` for any errors related to starting the scheduler.

