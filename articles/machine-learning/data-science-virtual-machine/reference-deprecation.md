---
title: 'Reference: Data Science Virtual Machine Image Deprecation'
titleSuffix: Azure Data Science Virtual Machine 
description: Details on deprecations affecting the Azure Data Science Virtual Machine
author: lobrien
ms.service: machine-learning
ms.subservice: data-science-vm

ms.author: laobri
ms.date: 04/03/2020
ms.topic: reference
---

# Reference: Deprecation of DSVM Images

Below we discuss suggestions for dealing with upcoming deprecations on the Azure Data Science Virtual Machine.

## Windows 2012: Migrating data disks

We will stop supporting the Windows 2012 DSVM image on December 31, 2019. In order to migrate a data disk from your existing Windows 2012 DSVM to a Windows 2016 DSVM, take the following steps:

1. Create a new Windows 2016 DSVM, following the instructions shown [here](./provision-vm.md#create-your-dsvm).
1. Detach existing data disks from your Windows 2012 image using [these instructions](../../virtual-machines/windows/detach-disk.md).
1. Attach the disk from the previous step to your Windows 2016 image using [these instructions](../../virtual-machines/windows/attach-disk-ps.md#attach-an-existing-data-disk-to-a-vm).

## CentOS

New users should use the most recent Ubuntu or Windows images. CentOS will remain available for use with existing solution templates.