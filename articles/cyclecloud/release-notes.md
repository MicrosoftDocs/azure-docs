---
title: Current Release Notes - Azure CycleCloud 8.1.x
description: Read the product release notes for the current Azure CycleCloud release. This article covers releases 8.1.x.
author: adriankjohnson
ms.date: 11/16/2020
ms.author: adjohnso
---

# Azure CycleCloud Public Preview 8.1

The current release is 8.1.0.

## Azure CycleCloud 8.1 Release Highlights

|  |  |
| --- | --- |
| [**Cloud-Init Support**](~/how-to/cloud-init.md)<br/>CycleCloud now supports cloud-init as a way of customizing virtual machines as they boot up. Users can now specify a cloud-init config that will be processed before the CycleCloud configuration occurs. This allows users to baseline a VM by configuring volumes, mounts, networking, or OS before the scheduler stack is set up.   | [ ![cloud-init example](./images/release-notes/cloud-init_small.png) ](./images/release-notes/cloud-init_large.png#lightbox)  |
| [**Improved Boot Time**](~/concepts/clusters.md)<br/>CycleCloud 8 also brings significant improvements to the node preparation stages that happen after a virtual machine is provisioned, decreasing the amount of time needed to fully configure a VM into a member of a HPC cluster.  |  |

## Release Notes

Comprehensive release notes for the individual 8.0.x releases are listed below

* [**8.1.0 Release Notes**](release-notes/8-1-0.md) - released on 11/16/20
* [**8.0.2 Release Notes**](release-notes/8-0-2.md) - released on 10/16/20
* [**8.0.1 Release Notes**](release-notes/8-0-1.md) - released on 07/02/20
* [**8.0.0 Release Notes**](release-notes/8-0-0.md) - released on 05/29/20

Release notes from the [previous major releases](release-notes-previous.md) and [older versions](release-notes-archive.md) are also available.
