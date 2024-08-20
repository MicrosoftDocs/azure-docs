---
title: Create a Chamber in the Azure Modeling and Simulation Workbench
description: How to create and manage a Chamber in the Azure Modeling and Simulation Workbench
author: yousefi-msft
ms.author: yousefi
ms.service: modeling-simulation-workbench
ms.topic: how-to
ms.date: 08/16/2024

#CustomerIntent: As a Workbench Owner, I want to create and manage a Chamber to isolate users, workloads and data.
---
# Create a Chamber in the Azure Modeling and Simulation Workbench

The Azure Modeling and Simulation Workbench provides a secure, cloud-based environment to collaborate with other organizations.  Chambers are isolated areas with no access to the internet or other Chambers, making them ideal work environments for enterprises.  In a complex project where isolation is needed, a Chamber should be created for each independent work group or enterprise that requires confidentiality and control of their data.

This article shows how to create, manage, and delete a Chamber.

<!-- 3. Prerequisites --------------------------------------------------------------------

Required: Make Prerequisites the first H2 after the H1. 

* Provide a bulleted list of items that the user needs.
* Omit any preliminary text to the list.
* If there aren't any prerequisites, list "None" in plain text, not as a bulleted item.

-->

## Prerequisites

* A Modeling and Simulation Workbench top-level Workbench has been created.
* A user account with Workbench Owner privileges (Subscription Owner or Subscription Contributor) role.

## Create a Chamber

A Workbench Owner can create a Chamber in an existing Workbench. Chambers can't be renamed or moved once created, nor can the location be specified. Chambers are deployed to the same location as the parent Workbench.

1. From the Workbench overview page, select **Chamber** from the **Settings** menu in the left pane.
1. In the Chamber page, select **Create** from the action bar. :::image type="content" source="media/howtoguide-create-chamber/chamber-create-button.png" alt-text="Detail of Chamber action bar with Create button annotated in red box.":::
1. In the next dialog, only the name of a Chamber is required. Enter a name and select **Next**. :::image type="content" source="media/howtoguide-create-chamber/chamber-create-name.png" alt-text="A detail of Chamber name dialog.":::
1. If pre-validation checks are successful, select **Create**.  A Chamber typically takes around 15 minutes to deploy.

## Manage a Chamber

Once a Chamber is created, a Workbench Owner or Chamber Admin can administer it. A Chamber can be stopped, started, or restarted. Chambers are the scope of user role assignments, as well as definining boundary for data.

* [Manage users](./how-to-guide-manage-users.md)
* [Manage license servers or upload licenses](./how-to-guide-licenses.md)
* [Start, stop, or restart a Chamber](./howtoTODO)
* [Upload data](./how-to-guide-upload-data.md)
* [Download data](./how-to-guide-download-data.md)

## Delete a Chamber

If a Chamber is no longer needed, it can be deleted only if it is empty.  All nested resources under the Chamber must first be deleted before the Chamber can be deleted.  A Chamber's nested resources include VMs, Connectors, and Chamber Storage. Once a Chamber is deleted, it cannot be recovered.

1. Navigate to Chamber.
1. Ensure that all nested resources are deleted.  From the **Settings** menu at the left, visit each of the nested resources and ensure that they are empty. Visit the [Deleting nested resources](#deleting-nested-resources) section below to learn how to delete each of those resources.
1. Select **Delete** from the action bar. Deleting a Chamber can take up to 10 minutes.

### Deleting nested resources

Nested resources of a Chamber must first be deleted before the top-level Chamber can be deleted. A Chamber can't be deleted if it still has a Connector, Chamber Storage, or VM deployed within it. License servers are Chamber infrastructure, are not user deployable, and do not apply to this requirement.

* [Manage Connectors](./how-to-guide-connector.md)
* [Manage Chamber Storage](./how-to-guide-manage-storage.md)
* [Manage Chamber VMs](./how-to-guide-chamber-vm.md)

## Related content

* [Manage license servers](./how-to-guide-licenses.md)
