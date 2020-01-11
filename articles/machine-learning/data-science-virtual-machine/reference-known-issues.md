---
title: Known issues & troubleshooting
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

This article helps you find and correct errors or failures encountered when using the Azure Data Science Virtual Machine.

## Python package installation issues

### Installing packages with pip breaks dependencies on Linux

Use `sudo pip install` instead of `pip install` when installing packages.

## Disk encryption issues

### Disk encryption fails on the Ubuntu DSVM

Azure Disk Encryption (ADE) is not currently supported on the Ubuntu DSVM. As a workaround, consider configuring [Azure Storage encryption with customer-managed keys](../../storage/common/storage-encryption-keys-portal.md).

## Tool appears disabled

### Hyper-V does not work on the Windows DSVM

This is expected behavior, as for boot performance we have disabled some services. To re-enable, open the search bar on your Windows DSVM, type in "Services," then set all Hyper-V services to "Manual" and set "Hyper-V Virtual Machine Management" to "Automatic."

Your final screen should look like this:

   ![Enable Hyper-V](./media/workaround/hyperv-enable-dsvm.png)

