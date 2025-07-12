---
title: How to use Cloud-Init with CycleCloud
description: How to customize a cluster using cloud-init
author: staer
ms.date: 06/30/2025
ms.author: danharri
monikerRange: '>= cyclecloud-8'
---

# Cloud-Init

CycleCloud supports [cloud-init](/azure/virtual-machines/linux/using-cloud-init) as a way of configuring a virtual machine (VM) on first boot **before** any other CycleCloud specific configuration occurs on the VM. Using cloud-init is an effective way to configure aspects of a VM (such as networking, yum/apt mirrors, and more) prior to installing any software managed by CycleCloud (HPC schedulers).

The following example shows how to specify a bash script to run on boot by using the `CloudInit` attribute in a cluster template:

```ini
[node scheduler]
CloudInit = '''#!/bin/bash
echo "cloud-init works" > /tmp/cloud-init.txt
'''
```

> [!NOTE]
> Use triple quoted strings in a cluster template to specify a multiline string, such as a bash or YAML script.

> [!WARNING]
> Not all OS images in Azure support cloud-init. For more information about which images support cloud-init and the timeline for broader support, see [cloud-init support for virtual machines in Azure](/azure/virtual-machines/linux/using-cloud-init).

## Set cloud-init using the UI

The CycleCloud UI supports cloud-init editing. When you create or edit any cluster, you can use the **Cloud-Init** tab to edit the cloud-init script for each node in your cluster. The editor in the CycleCloud UI accepts any text input. It provides syntax highlighting for Python, shell scripts, or YAML.

![Editing cloud-init in the CycleCloud UI](../images/cloud-init.png)

## Cloud-init ordering and error handling

For CycleCloud nodes with `CloudInit` specified, CycleCloud provisions the VM and waits until cloud-init runs to completion **before** it starts any other configuration. If you specify `CloudInit` on the node but CycleCloud doesn't detect cloud-init support for the OS, the node goes into an error state and relays the reason to CycleCloud. If the `CloudInit` script fails to execute (for example, due to a scripting error or syntax error), the node goes into an error state and relays the error reported by cloud-init to CycleCloud.

Once cloud-init runs to completion with no errors, CycleCloud continues to configure the VM as usual.

> [!IMPORTANT]
> CycleCloud doesn't automatically merge cloud-init scripts. If you specify a cloud-init script in `[node defaults]` and have a node that inherits from those defaults, the cloud-init script in `[node defaults]` gets overwritten. To share code, we suggest merging scripts manually. Alternatively, you can use an [include file user-data format](https://cloudinit.readthedocs.io/en/latest/topics/format.html#include-file) to include a list of URLs for cloud-init to process.
