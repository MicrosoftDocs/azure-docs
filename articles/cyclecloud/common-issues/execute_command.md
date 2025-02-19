---
title: Common Issues - Software Configuration
description: Azure CycleCloud common issue - Software Configuration
author: adriankjohnson
ms.date: 11/15/2019
ms.author: adjohnso
---
# Common Issues: Software Configuration -- unable to execute command

## Possible Error Messages

- `Unable to execute command`

## Resolution

As part of the node setup phase, CycleCloud uses Chef to configure services and applications on the nodes, and Chef does this by invoking native OS commands.

An example of this may be an attempt to create a mount point and mount a NAS to a cluster node:

``` CMD
mkdir -p /data
mount -t nfs 10.0.1.5:/exports/data /data
```

These commands may fail for a variety of reasons which triggers a Chef error. In version 7.9 and later, CycleCloud displays the command that failed, as well as the STDOUT and STDERR that contains the error message.

- Review the command that is being invoked and check for syntax errors. If this is coming from a custom Chef recipe or cookbook, fix the error and re-upload the project.
- Log into the node that has the error and attempt to run the command as the admin or `root` user.
- Using `mount` as an example, if the command is failing, troubleshoot the mounting error by running the command manually and diagnosing the root cause, such as an incorrect server host/IP or export path.

## More Information

Lean more about [CycleCloud Projects](~/articles/cyclecloud/how-to/projects.md)