---
title: Common Issues - Cluster Init
description: Azure CycleCloud common issue - Cluster Init
author: adriankjohnson
ms.date: 06/20/2023
ms.author: adjohnso
ms.topic: conceptual
ms.service: azure-cyclecloud
ms.custom: compute-evergreen
---


# Common issues: Cluster init

## Possible error messages

- `{ERROR} while executing {SCRIPT} in project`
- `Failed to execute cluster-init script {SCRIPT} in project`

## Resolution

Azure CycleCloud lets you configure VMs that become nodes of the cluster by running custom scripts during the VM preparation phase. You get this functionality through the [CycleCloud Projects](~/articles/cyclecloud/how-to/projects.md) system. It's also known as Cluster-Init.

If these scripts fail or return errors, CycleCloud versions 7.9 and later show these errors in the node details page. The error messages include the STDERR and STDOUT output of the scripts.

- If you can identify the problem from the STDERR or STDOUT output of the scripts, fix the error in the scripts and re-upload the project using the CycleCloud CLI.
- Otherwise, SSH into the VM as either the `cyclecloud` user or your own user account. Try running the commands in the script manually to troubleshoot. Once you identify the problem, edit the cluster-init script and re-upload the project.
