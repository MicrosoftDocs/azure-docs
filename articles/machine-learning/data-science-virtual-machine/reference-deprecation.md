---
title: 'Reference: Data Science Virtual Machine Image Retirements'
titleSuffix: Azure Data Science Virtual Machine 
description: Details on retirements affecting the Azure Data Science Virtual Machine
author: lobrien
ms.service: machine-learning
ms.subservice: data-science-vm

ms.author: laobri
ms.date: 07/17/2020
ms.topic: reference
---

# Reference: Retirements of DSVM Images

Below we discuss retirement (deprecation) of images, and suggestions for dealing with upcoming retirements on the Azure Data Science Virtual Machine.

## Why we retire DSVM images

The Data Science Virtual Machine currently has two editions:

* Ubuntu
* Windows Server

The DSVM image for these editions is built on a specific operating system version, for example Ubuntu 18.04 LTS. Over time, the maintenance window for the operating system _version_ will end and/or the data science tools will no longer support older operating system versions. To keep the DSVM image up-to-date with the latest operating systems and data science tooling, we release a new DSVM image based on newer operating system versions.

## How we retire DSVM images

We issue a _retirement announcement_ where existing DSVM users are notified (via email) of an upcoming DSVM image retirement. The retirement announcement will detail the _retirement date_ (after this date the image is not available), and mitigation recommendations (for example, upgrading to a newer DSVM image).

On the _announcement_ date we will hide the image in the marketplace so that:

1. new users are prevented from inadvertently provisioning a retired DSVM image.
2. existing users can use ARM deployments until the retirement date.

The hidden image will receive operating system patches until the _retirement date_ but will __not__ receive updates to the data science tools and frameworks. On the _retirement date_, the image will be not be available for ARM deployments.

Any provisioned DSVM image in your subscription will continue to operate after the retirement date. However, we recommend upgrading to the latest DSVM image so that you have the latest operating systems and data science tooling.

## Impact

Existing DSVM provisioned images in your subscription will continue to operate after the retirement date. However, we recommend users upgrade their DSVM image to the newer version using either the Azure Portal or ARM template.

> [!WARNING]
> Retired DSVM images provisioned using Virtual Machine Scale Sets will fail to scale up after the retirement date.
>
> ARM templates that have not been updated with the new DSVM image details will fail to to deploy after the retirement date.

## Mitigating upcoming retirements

In this section, we discuss mitigation to upcoming retirements.

### Upgrade Windows 2016 DSVM

In order to migrate a data disk from your existing Windows 2016 DSVM to a Windows 2019 DSVM, take the following steps:

1. Create a new Windows 2019 DSVM, following the instructions shown [here](./provision-vm.md#create-your-dsvm).
1. Detach existing data disks from your Windows 2016 image using [these instructions](../../virtual-machines/windows/detach-disk.md).
1. Attach the disk from the previous step to your Windows 2019 image using [these instructions](../../virtual-machines/windows/attach-disk-ps.md#attach-an-existing-data-disk-to-a-vm).

### Upgrade Ubuntu 16.04 DSVM

We recommend upgrading existing Ubuntu 16.04 DSVMs to the [Ubuntu 18.04 DSVM edition](./dsvm-ubuntu-intro.md).
