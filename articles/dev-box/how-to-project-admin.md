---
title: Provide access to Project Admins
titleSuffix: Microsoft Dev Box
description: 'Learn how to provide access to Project Admins.'
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/15/2022
ms.topic: how-to
---

# Provide access to Project Admins

As a DevCenter Owner, you can create Projects under the DevCenter. Each Project will be set up for a specific team. But you may not want to manage all the Projects for each of the teams. You may want to delegate Project administration to a person on that specific team. They will be able to create and manage Dev Box Pools using the Network Connections and Dev Box Definitions you have configured at the DevCenter level. For this purpose, we have created a new built-in role called the **DevCenter Project Admin**. This role can manage a Project by:

- Reading the Network Connections attached to the DevCenter
- Reading the Dev Box Definitions attached to the DevCenter
- Creating, reading, updating, deleting Dev Box Pools in the Project
- Granting permissions to members to create and manage dev boxes within the Project.

Follow the instructions below to add role assignments for this role.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/projects).

1. Select the Project you want to provide your team members access to.
![Project grid](/Documentation/media/Projects_Grid.png)

1. Select the **Access Control (IAM)** tab from the left menu.
![Access control tab](/Documentation/media/Access_Control_Tab.png)

1. Select the **Add role assignment** button from the top menu bar.
![Add role assignment](/Documentation/media/Add_Role_Assignment.png)

1. In the Role tab, search for **DevCenter Project Admin** and select the built-in role.
![Role](/Documentation/media/Project_Admin_Role.png)

1. In the Members tab, select **+ Select Members**, and from the context pane, select the AD Users or Groups you want to add.
![Select members](/Documentation/media/Project_Admin_Select_Members.png)

1. Review + assign.

The user will now be able to manage the Project and create Dev Box Pools within it.

## Next Steps

- [Quickstart: Create a Dev Box Pool](/Documentation/quickstart-create-dev-box-pool.md)