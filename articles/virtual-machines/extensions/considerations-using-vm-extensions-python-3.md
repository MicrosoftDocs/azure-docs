---
title: Considerations for using VM extensions in Python 3-enabled Linux systems 
description: Learn about using VM extensions in Python 3-enabled Linux systems
services: virtual-machines-windows
documentationcenter: ''
author: v-miegge
ms.author: jparrel
manager: dcscontentpm
editor: ''
tags: top-support-issue,azure-resource-manager

ms.service: virtual-machines-windows
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 04/22/2020
ms.assetid: 3cd520fd-eaf7-4ef9-b4d3-4827057e5028
---

# Considerations for using VM extensions in Python 3-enabled Linux systems

## Summary

Some Linux distributions have transitioned to Python 3.x and removed the legacy `/usr/bin/python` entry point for Python. The Python 3.x transition impacts the out-of-the-box, automated deployment of certain virtual machine (VM) extensions that exhibit the following conditions:

- Working on Python 3.x support in their road map
- Using the legacy /usr/bin/python entry point

Customer action might be required before those extensions are deployed to their VMs.

- Endorsed Linux distributions that are known to be affected include: Ubuntu Server 20.04 LTS and Ubuntu Pro 20.04 LTS
- VM Extensions that are known to be affected include: Azure Disk Encryption, Azure Monitor, VM Access, Boot Diagnostics

## Cause

Azure Virtual Machines customers running the Linux operating system can deploy extensions that enable additional functionality such as gathering log entries and performance counters, or running commands across their fleet, without accessing each VM individually.

Each extension has their own road map and release cadence, and can be offered by Microsoft or certain third-party partners.

Customers can deploy an extension via the REST API, with the `azure-cli` or through the Azure portal, which extends the VM model to reference the extension.

Extensions are packaged for deployment through the Azure Linux Agent. Upon extending the VM model with the extension, the Azure Linux Agent fetches the extension package. In this package, extensions ship a JSON manifest with specific commands for lifecycle operations, and the Azure Linux Agent executes those commands for each operation.

However, extensions might be written in any language that can execute in Linux, such as Python or shell scripts, and contain arbitrary logic. Some extensions, therefore, use a legacy /usr/bin/python entry point. Since the extensions are packaged, and the Azure Linux Agent doesn't handle each extension’s specific logic, certain extensions might fail to deploy when those pre-requisites aren’t met. This failure is described previously in the Summary.

Failed deployments might take several minutes to time out and send both error messages and failure conditions in the Azure portal, automated scripts, and other interfaces.

## Resolution

Customers might want to consider the following general recommendations before deploying extensions in the known-affected scenarios, as described previously in the Summary:

1. Before deploying the extension, customers might reinstate the `/usr/bin/python` symlink by installing vendor-provided packages:

   - Python 3.8: `sudo apt update && sudo apt install python-is-python3`
   - Python 2.7*: `sudo apt update && sudo apt install python-is-python2`

1. Monitor the Azure Roadmap for extension updates to adopt Python 3.x and the /usr/bin/python3 entry point

1. Engage Azure Support in case additional troubleshooting or debugging support is needed when deploying extensions in the known-affected scenarios described in the Summary

> [!Note]
> For Python 2.7, above, Microsoft encourages customers to adopt Python 3.x in their systems unless their workload requires Python 2.x support. Examples could include legacy administration scripts, or extensions such as Azure Disk Encryption and Azure Monitor.

Before installing Python 2.x in production, customers should consider the question of long-term support of Python 2.x, particularly their ability to receive security updates.

## More Information

[[[LINK TO THE CANONICAL (UBUNTU) KB PENDING]]]