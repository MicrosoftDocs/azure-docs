---
title: Release Notes - Azure CycleCloud Public Preview 8.0.x
description: Read the product release notes for the Azure CycleCloud public preview release. This article covers preview releases 8.0.x.
author: adriankjohnson
ms.date: 10/16/2020
ms.author: adjohnso
monikerRange: '>= cyclecloud-8'
---

# Azure CycleCloud Public Preview 8.0

The current release is 8.0.2.

## Azure CycleCloud Public Preview 8.0 Release Highlights

|  |  |
| --- | --- |
| [**Cloud-Init Support**](~/how-to/cloud-init.md)<br/>CycleCloud now supports cloud-init as a way of customizing virtual machines as they boot up. Users can now specify a cloud-init config that will be processed before the CycleCloud configuration occurs. This allows users to baseline a VM by configuring volumes, mounts, networking, or OS before the scheduler stack is set up.   | [ ![cloud-init example](./images/release-notes/cloud-init_small.png) ](./images/release-notes/cloud-init_large.png#lightbox)  |
| [**Improved Boot Time**](~/concepts/clusters.md)<br/>CycleCloud 8 also brings significant improvements to the node preparation stages that happen after a virtual machine is provisioned, decreasing the amount of time needed to fully configure a VM into a member of a HPC cluster.  |  |

## Release Notes

Comprehensive release notes for the individual 8.0.x releases are listed below

* [**8.0.2 Release Notes**](release-notes/8-0-2.md) - released on 10/16/20
* [**8.0.1 Release Notes**](release-notes/8-0-1.md) - released on 07/02/20
* [**8.0.0 Release Notes**](release-notes/8-0-0.md) - released on 05/29/20

Release notes from the [current major releases](release-notes.md), [previous major releases](release-notes-previous.md) and [older versions](release-notes-archive.md) are also available.
