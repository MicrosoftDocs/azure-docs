---
title: "Create and Manage Chamber VMs: Azure Modeling and Simulation Workbench"
description: How to create and manage a Chamber VM in the Azure Modeling and Simulation Workbench
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/16/2024
#CustomerIntent: As a Workbench Owner, I want to create and manage a chamber to isolate users, workloads and data.
---
# Chamber VMs

Chamber Workload Virtual Machines (VM) are Azure VMs that are managed by the Workbench. Chamber VMs don't require expert users to select, deploy, configure, or manage. VMs are deployed quickly, preconfigured with drivers for the most common EDA (Electronic Design Automation) workloads, and with access to thousands of managed applications.

Chamber VMs deploy quickly and with little configuration in as little as 10 minutes.  Chamber VMs are automatically:

* Deployed directly into the chamber with no more configuration
* Networked to the chamber's private virtual network
* Mounted to any existing chamber Storage, user home directories, and the [Data Pipeline](./concept-data-pipeline.md) mount points
* Preconfigured with drivers to work with major semiconductor design tools

User administration is managed from the parent chamber and all users of a chamber have access into all VMs in the chamber.

This article shows how to create, manage, and delete a chamber VM.

## Prerequisites

* A Modeling and Simulation Workbench with at least one chamber.
* A user account with Workbench Owner privileges (Subscription Owner or Subscription Contributor) role.

## Create a chamber VM

A chamber VM can only be deployed into an existing chamber. Once deployed, the chamber VM can't be moved to other chambers or renamed. The location of a chamber VM can't be specified as VMs are deployed to the same location as the parent Workbench.

The Azure Modeling and Simulation Workbench offers a select set of high-performance VMs. To see the VM offerings and features, refer to [Modeling and Simulation Workbench VM Offerings](./concept-vm-offerings.md).

All VMs are created with Red Hat Enterprise Linux version 8.8.

1. From the chamber overview page, select **Chamber VM** from the **Settings** menu in the left pane. :::image type="content" source="media/howtoguide-create-chamber-vm/chamber-vm-menu.png" alt-text="Detail of Chamber Settings menu with Chamber VM in red box.":::
1. On the Chamber VM page, select **Create** from the action bar. :::image type="content" source="media/howtoguide-create-chamber-vm/chamber-vm-create.png" alt-text="Detail of Chamber VM action bar with 'Create' button annotated in red box.":::
1. In the Create Chamber VM dialog, enter the name of the Chamber VM, the VM type, and the number of VMs to be created (default is 1). The VM image type will be expanded in the future to support software for other scientific and engineering applications. :::image type="content" source="media/howtoguide-create-chamber-vm/chamber-vm-create-dialog.png" alt-text="Create Chamber VM dialog with textboxes and ReviewCreate button marked in red.":::. Read about the [Chamber VM offerings] (./concept-vm-offerings.md) to help you select the correct VM for your workload.
1. Select **Review + create**.
1. If prevalidation checks are successful, the **Create** button will be enabled. Selecte **Create**. A Chamber VM typically can take up to 10 minutes to deploy. Once deployed, the **Power state** status shows as "Running".

## Manage a Chamber VM

Once a chamber VM is created, a Workbench Owner or Chamber Admin can administer it. Chamber VMs can only be stopped, started, or restarted. Chamber VMs can't be migrated or resized. Chamber VMs don't accept user role assignments. User administration happens at the Chamber level. Chambers have access to Shared Storage (shared between Chambers) and Chamber Storage, which is accessible only within the Chamber by the members. IP addresses are managed by the deployment engine. Data and OS disks aren't configurable in Chamber VMs. Microsoft recommends installing all your applications and data on the Chamber Storage volumes to allow you to create and destroy VMs that are instantly ready for use. All VMs have access to the Chamber License servers.

* [Manage users](./how-to-guide-manage-users.md)
* [How to start, stop, or restart a Chamber](./how-to-guide-start-stop-restart.md)
* [Manage Storage](./how-to-guide-manage-chamber-storage.md)
* [About license servers](./concept-license-service.md)

## Delete a Chamber VM

If a Chamber VM is no longer needed, it can be deleted. VMs don't need to be stopped before being deleted. Once a Chamber is deleted, it can't be recovered.

1. Navigate to the Chamber VM.
1. Select **Delete** from the action bar. Deleting a Chamber can take up to 10 minutes.

## Related content

* [Manage users](./how-to-guide-manage-users.md)
* [Start, stop, or restart a Chamber](./how-to-guide-start-stop-restart.md)
* [Manage Chamber Storage](./how-to-guide-manage-chamber-storage.md)
* [License servers](./concept-license-service.md)
