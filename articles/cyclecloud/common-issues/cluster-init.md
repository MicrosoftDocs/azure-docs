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


# Common Issues: Cluster Init

## Possible Error Messages

- `{ERROR} while executing {SCRIPT} in project`
- `Failed to execute cluster-init script {SCRIPT} in project`

## Resolution

Azure CycleCloud provides users the ability to configure VMs that become nodes of the cluster by running custom scripts during the VM preparation phase. This functionality is provided through the [CycleCloud Projects](~/articles/cyclecloud/how-to/projects.md) system, and is also known as Cluster-Init.

If there are failures or errors when these scripts are executed, Cyclecloud versions 7.9 and later surface these errors in the node details page. The STDERR and STDOUT output of the scripts are included in these error messages. 

- If you are able to identify the problem from the STDERR or STDOUT output of the scripts, fix the error in the scripts and re-upload the project using the CycleCloud CLI.
- Otherwise, SSH into the VM either as the `cyclecloud` user or your own user account and attempt to run the commands in the script manually to troubleshoot. Once you have identified the problem, edit the cluster-init script and re-upload the project.
