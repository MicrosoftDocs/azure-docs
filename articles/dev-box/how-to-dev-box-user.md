---
title: Provide access to Dev Box users
titleSuffix: Microsoft Dev Box
description: 'Learn how to provide access to Dev Box users.'
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 04/15/2022
ms.topic: how-to
---

# Provide access to Dev Box users

After creating a Dev Box Pool, Project Owners or Project Admins can create their own dev box using the Pool by default. You are an owner of the Pool as its creator. But you will want your team members to access the Pool to create dev boxes from it. The Pool is a sub-resource of the Project. So you will need to provide permissions to Users or AD Groups at the Project level. However, you may not want them to be able to modify or delete the Pool, or create other Pools in the Project. For that purpose, we have created a new built-in role called the **DevCenter Dev Box User**. Follow the instructions below to add role assignments for this role.

1. Use the following link to sign in to the [Azure portal](https://portal.azure.com/#blade/Microsoft_Azure_Fidalgo/FidalgoMenuBlade/projects).

1. Select the Project you want to provide your team members access to.
![Project grid](/Documentation/media/Projects_Grid.png)

1. Select the **Access Control (IAM)** tab from the left menu.
![Access control tab](/Documentation/media/Access_Control_Tab.png)

1. Select the **Add role assignment** button from the top menu bar.
![Add role assignment](/Documentation/media/Add_Role_Assignment.png)

1. In the Role tab, search for **DevCenter Dev Box User** and select the built-in role.
![Role](/Documentation/media/Dev_Box_User_Role.png)

1. In the Members tab, select **+ Select Members**, and from the context pane, select the AD Users or Groups you want to add.
![Select members](/Documentation/media/Dev_Box_User_Select_Members.png)

1. Review + assign.

The user will now be able to view the Project and all the Pools within it. They can create dev boxes from any of the Pools and manage those dev boxes from the [Developer Portal](https://portal.fidalgo.azure.com).

## Next Steps

- [Create and connect to dev boxes](/Documentation/quickstart-create-dev-box.md)