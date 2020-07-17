---
title: 'Reference: Data Science Virtual Machine Image Deprecation'
titleSuffix: Azure Data Science Virtual Machine 
description: Details on deprecations affecting the Azure Data Science Virtual Machine
author: lobrien
ms.service: machine-learning
ms.subservice: data-science-vm

ms.author: laobri
ms.date: 07/17/2020
ms.topic: reference
---

# Reference: Deprecation of DSVM Images

Below we discuss deprecation of images, and suggestions for dealing with upcoming deprecations on the Azure Data Science Virtual Machine.

## Why we deprecate DSVM images

The Data Science Virtual Machine currently has 2 editions:

* Ubuntu
* Windows Server

Periodically, the maintenance window for the operating system on which the Data Science VM is based will end. Therefore, to keep the DSVM image secure we need to upgrade the operating system to its next release (for Ubuntu this will be the next LTS release).

## How we deprecate DSVM images

We will issue a _retirement announcement_ where existing DSVM customers are notified via email that a particular DSVM image will soon be retired. The retirement annoucement will detail:

1. the _retirement date_ i.e. the date the image will be fully removed from the marketplace (up to 12 months after the _announcement_ date).
2. mitigations e.g. upgrading to a new image.

Any provisioned DSVM image in your subscription will continue to operate after the retirement date. However, we strongly recommend upgrading to the latest DSVM image so that it continue to be secure.

On the _announcement date_ we will hide the image in the marketplace so that:

1. new customers do not inadvertently provision a deprecated image.
2. existing customers using ARM deployments can continue to deploy the deprecated image until the retirement date.

The hidden image will continue to receive operating system security patches until the _retirement date_ but will __not__ receive updates to the data science tools and frameworks. On the _retirement date_ the image will be fully removed from the marketplace and ARM deployments using the image will fail to provision.

## Deprecation Impact

Once a DSVM image has been fully removed from the marketplace, existing DSVM provisioned images in your subscription will continue to operate after the retirement date. However, we strongly recommend upgrading your DSVM to the latest image so that it continues to be secure.

> [!WARNING]
> - Deprecated DSVM images provisioned using Virtual Machine Scale Sets will fail to scale up after the retirement date.
>
> - ARM templates that have not been updated with the new DSVM image details will fail to to deploy after the retirement date.

## Mitigating upcoming deprecations

In this section we discuss mitigation to upcoming deprecations.

### Upgrade Windows 2016 DSVM

In order to migrate a data disk from your existing Windows 2016 DSVM to a Windows 2019 DSVM, take the following steps:

1. Create a new Windows 2019 DSVM, following the instructions shown [here](./provision-vm.md#create-your-dsvm).
1. Detach existing data disks from your Windows 2016 image using [these instructions](../../virtual-machines/windows/detach-disk.md).
1. Attach the disk from the previous step to your Windows 2019 image using [these instructions](../../virtual-machines/windows/attach-disk-ps.md#attach-an-existing-data-disk-to-a-vm).

### Upgrade Ubuntu 16.04 DSVM 
We recommend upgrading existing Ubuntu 16.04 DSVMs to the [Ubuntu 18.04 DSVM edition](./dsvm-ubuntu-intro.md).

>[!WARNING]
Maintenance updates for Ubuntu 16.04 LTS will end in April 2021. See the [Ubuntu lifecycle and release cadence](https://ubuntu.com/about/release-cycle) for more details.