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

The Data Science Virtual Machine currently has 2 editions:

* Ubuntu
* Windows Server

The DSVM image for these editions is built on a particular operating system version e.g. 18.04 LTS for Ubuntu. Over time, the maintenance window for the operating system _version_ will end and/or the data science tools will no longer support older operating system versions. To keep the DSVM image up-to-date with the latest operating systems and data science tooling we release a new DSVM image based on newer operating system versions. In addition, we retire DSVM images based on older operation system versions.

## How we retire DSVM images

We will issue a _retirement announcement_ where existing DSVM users (subscription administrators) are notified via email that a particular DSVM image will soon be retired. The retirement announcement will detail:

1. the _retirement date_ i.e. the date the image will be fully removed from the marketplace.
2. mitigation e.g. upgrading to a new image.

Any provisioned DSVM image in your subscription will continue to operate after the retirement date. However, we strongly recommend upgrading to the latest DSVM image so that you have the latest operating systems and data science tooling.

On the _announcement date_ we will hide the image in the marketplace so that:

1. new users do not inadvertently provision a retired DSVM image.
2. existing users using ARM deployments can continue to deploy the retired image until the retirement date.

The hidden image will continue to receive operating system security patches until the _retirement date_ but will __not__ receive updates to the data science tools and frameworks. On the _retirement date_ the image will be fully removed from the marketplace and will not be accessible via ARM deployment.

## Impact

Once a DSVM image has been fully removed from the marketplace, existing DSVM provisioned images in your subscription will continue to operate after the retirement date. 

We recommend users upgrade their DSVM image to the newer version via either the Azure Portal or ARM template.

> [!WARNING]
> - Retired DSVM images provisioned using Virtual Machine Scale Sets will fail to scale up after the retirement date.
>
> - ARM templates that have not been updated with the new DSVM image details will fail to to deploy after the retirement date.

## Mitigating upcoming retirements

In this section we discuss mitigation to upcoming retirements.

### Upgrade Windows 2016 DSVM

In order to migrate a data disk from your existing Windows 2016 DSVM to a Windows 2019 DSVM, take the following steps:

1. Create a new Windows 2019 DSVM, following the instructions shown [here](./provision-vm.md#create-your-dsvm).
1. Detach existing data disks from your Windows 2016 image using [these instructions](../../virtual-machines/windows/detach-disk.md).
1. Attach the disk from the previous step to your Windows 2019 image using [these instructions](../../virtual-machines/windows/attach-disk-ps.md#attach-an-existing-data-disk-to-a-vm).

### Upgrade Ubuntu 16.04 DSVM 
We recommend upgrading existing Ubuntu 16.04 DSVMs to the [Ubuntu 18.04 DSVM edition](./dsvm-ubuntu-intro.md).
