---
title: 'Reference: Known issues & troubleshooting'
titleSuffix: Azure Data Science Virtual  Machine
description: Get a list of the known issues, workarounds, and troubleshooting for Azure Data Science Virtual Machine
services: machine-learning

ms.service: machine-learning
ms.subservice: data-science-vm

author: gvashishtha
ms.author: gopalv
ms.topic: reference
ms.date: 10/10/2019


---

# Known issues and troubleshooting the Azure Data Science Virtual Machine

This article helps you find and correct errors or failures you might come across when using the Azure Data Science Virtual Machine.

## Python package installation issues

### Installing packages with pip breaks dependencies on Linux

Use `sudo pip install` instead of `pip install` when installing packages.

## Disk encryption issues

### Disk encryption fails on the Ubuntu DSVM

Azure Disk Encryption (ADE) isn't currently supported on the Ubuntu DSVM. As a workaround, consider configuring [Server Side Encryption of Azure managed disks](../../virtual-machines/windows/disk-encryption.md).

## Tool appears disabled

### Hyper-V does not work on the Windows DSVM

That Hyper-V initially doesn't work on Windows is expected behavior. For boot performance, we've disabled some services. To enable Hyper-V:

1. Open the search bar on your Windows DSVM
1. Type in "Services,"
1. Set all Hyper-V services to "Manual"
1. Set "Hyper-V Virtual Machine Management" to "Automatic"

Your final screen should look like this:

   ![Enable Hyper-V](./media/workaround/hyperv-enable-dsvm.png)

