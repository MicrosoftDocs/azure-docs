---
title: Azure Lab Services within Microsoft Teams
description: Learn about the benefits of using Azure Lab Services in Microsoft Teams.
services: lab-services
ms.service: lab-services
ms.author: nicktrog
author: ntrogh
ms.topic: conceptual
ms.date: 06/02/2023
---

# Use Azure Lab Services within Microsoft Teams

You can access and manage your labs from within Microsoft Teams by using the Azure Lab Services Teams app. Take advantage of team membership and permissions in Microsoft Teams to grant access to labs and provision lab virtual machines.

This article outlines the benefits of using Azure Lab Services within Teams and provides links to other articles for instructions on how to create and manage labs within Teams.

> [!NOTE]
> The Azure Lab Services Teams App can be added only to a team, it cannot be added to individual chats or group chats.

## Benefits

Azure Lab Services integration with Microsoft Teams provides the following benefits for setting up a virtual lab environment within the team:

* Lab users can access their lab virtual machines from within Teams, without leaving Teams and having to navigate to the [Azure Lab Services website](https://labs.azure.com).
* Use Single Sign-on (SSO) from Teams to access Azure Lab Services.
* Team and lab owners don't need to maintain lab participants in two different systems. The list of lab users is autopopulated from the team membership. Azure Lab Services automatically performs a synchronization every 24 hours.
* After the initial publish of the template virtual machine, the lab capacity (the number of virtual machines in the lab) is automatically adjusted based on the addition/deletion of users from the team membership.
* Team and lab owners see only the labs that are related to the team. Lab users only see the virtual machines that are provisioned for the specific team.
* Lab creators don't need to send invitations and lab users don't need to register for the lab separately. Lab users are autoregistered for the lab and virtual machines are automatically assigned upon the first sign-in after the lab is published. 

## Next steps

* [Configure Microsoft Teams to access lab plans](how-to-configure-teams-for-lab-plans.md)
* [Create and manage labs within Teams](./how-to-manage-labs-within-teams.md)
* [Access a lab virtual machine within Teams](how-to-access-vm-for-students-within-teams.md)
