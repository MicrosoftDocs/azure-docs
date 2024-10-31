---
title: "Create and manage chambers: Azure Modeling and Simulation Workbench"
description: How to create and manage a chamber in the Azure Modeling and Simulation Workbench.
author: yousefi-msft
ms.author: yousefi
ms.service: azure-modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/16/2024

#CustomerIntent: As a Workbench Owner, I want to create and manage a chamber to isolate users, workloads and data.
---
# Create a chamber in the Azure Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench provides a secure, cloud-based environment to collaborate with other organizations. Chambers are isolated areas with no access to the internet or other chambers, making them ideal work environments for enterprises. In a complex project where isolation is needed, a chamber should be created for each independent work group, or enterprise that requires confidentiality and control of their data.

This article shows how to create, manage, and delete a chamber.

## Prerequisites

* A Modeling and Simulation Workbench top-level Workbench is created.
* A user account with Workbench Owner privileges (Subscription Owner or Subscription Contributor) role.

## Create a chamber

A Workbench Owner can create a chamber in an existing Workbench. Chambers can't be renamed or moved once created, nor can the location be specified. Chambers are deployed to the same location as the parent Workbench.

1. From the Workbench overview page, select **Chamber** from the **Settings** menu in the left pane.
1. In the chamber page, select **Create** from the action bar.

    :::image type="content" source="media/howtoguide-create-chamber/chamber-create-button.png" alt-text="Screenshot of chamber action bar with Create button annotated in red box.":::

1. In the next dialog, only the name of a chamber is required. Enter a name and select **Next**.

    :::image type="content" source="media/howtoguide-create-chamber/chamber-create-name.png" alt-text="Screenshot of chamber name dialog.":::

1. If prevalidation checks are successful, select **Create**. A chamber typically takes around 15 minutes to deploy.

## Manage a chamber

Once a chamber is created, a Workbench Owner or chamber Admin can administer it. A chamber can be stopped, started, or restarted. Chambers are the scope of user role assignments, and defining boundary for data.

* [Manage users](./how-to-guide-manage-users.md)
* [Manage license servers or upload licenses](./how-to-guide-licenses.md)
* [Start, stop, or restart a chamber](./how-to-guide-start-stop-restart.md)
* [Upload data](./how-to-guide-upload-data.md)
* [Download data](./how-to-guide-download-data.md)

## Delete a chamber

If a chamber is no longer needed, it can be deleted only if it's empty. All nested resources under the chamber must first be deleted before the chamber can be deleted. A chamber's nested resources include virtual machines (VM), connectors, and chamber storage. Once a chamber is deleted, it can't be recovered.

1. Navigate to chamber.
1. Ensure that all nested resources are deleted. From the **Settings** menu at the left, visit each of the nested resources and ensure that they're empty. Visit the [Deleting nested resources](#deleting-nested-resources) section to learn how to delete each of those resources.
1. Select **Delete** from the action bar. Deleting a chamber can take up to 10 minutes.

### Deleting nested resources

Nested resources of a chamber must first be deleted before the top-level chamber can be deleted. A chamber can't be deleted if it still has a connector, chamber storage, or VM deployed within it. License servers are chamber infrastructure, aren't user deployable, and don't apply to this requirement.

* [Manage connectors](./how-to-guide-set-up-networking.md)
* [Manage chamber storage](./how-to-guide-manage-chamber-storage.md)
* [Manage chamber VMs](./how-to-guide-chamber-vm.md)

## Related content

* [Manage license servers](./how-to-guide-licenses.md)
