---
title: Common Issues - Software Configuration
description: Azure CycleCloud common issue - Software Configuration
author: adriankjohnson
ms.date: 06/30/2025
ms.author: adjohnso
---
# Common issues: Software configuration - unable to execute command

## Possible error messages

- `Unable to execute command`

## Resolution

During the node setup phase, CycleCloud uses Chef to configure services and applications on the nodes. Chef invokes native OS commands to do this configuration.

For example, Chef might try to create a mount point and mount a NAS to a cluster node:

``` CMD
mkdir -p /data
mount -t nfs 10.0.1.5:/exports/data /data
```

These commands can fail for many reasons, which triggers a Chef error. In version 7.9 and later, CycleCloud shows the command that failed, along with the STDOUT and STDERR that contain the error message.

- Review the command that Chef runs and check for syntax errors. If the command comes from a custom Chef recipe or cookbook, fix the error and re-upload the project.
- Sign in to the node that has the error and try running the command as the admin or `root` user.
- Using `mount` as an example, if the command is failing, troubleshoot the mounting error by running the command manually and diagnosing the root cause, such as an incorrect server host/IP or export path.

## More Information

Learn more about [CycleCloud Projects](~/articles/cyclecloud/how-to/projects.md).