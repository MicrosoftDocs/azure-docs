---
title: Manage and access labs in Microsoft Teams
titleSuffix: Azure Lab Services
description: Learn how to access and manage Azure Lab Services labs within Microsoft Teams.
ms.topic: how-to
ms.date: 11/15/2022
author: ntrogh
ms.author: nicktrog
ms.custom: engagement-fy23
---

# Manage Azure Lab Services labs within Teams

Learn how to access and manage Azure Lab Services labs within Microsoft Teams. Add the Azure Lab Services Teams app to a team and let educators create and manage labs from within Teams. Students can connect to their lab without navigating to the Azure Lab Services portal. Learn more about the [benefits of using Azure Lab Services within Teams](./lab-services-within-teams-overview.md).

This article describes how to:

- Add a lab plan to a Teams channel.
- Manage lab user lists.
- Manage a lab virtual machine (VM) pool.
- Delete labs.
- Configure lab schedules and settings.
- Access a lab VM as a student.

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

- An Azure Lab Services lab plan. If you don't have a lab plan yet, see For information, see [Tutorial: Set up a lab plan with Azure Lab Services](tutorial-setup-lab-plan.md).
- The lab plan is created in the same tenant as Microsoft Teams.
- To add the Azure Lab Services Teams app to a channel, your account needs to be an owner of the team in Microsoft Teams.
- To add a lab plan to Teams, your account should have the Owner, Lab Creator, or Contributor role on the lab plan.

## User workflow 

The typical workflow when using Azure Lab Services within Teams, is the following:

1. The lab plan owner [creates a lab plan in the Azure portal](./tutorial-setup-lab-plan.md).
1. The lab plan owner [adds educators to the Lab Creator role in the Azure portal](tutorial-setup-lab-plan.md#add-a-user-to-the-lab-creator-role) so they can create labs for their classes.
1. Educators create labs in Teams, pre-configure the template VM, and publishes the lab to create VMs for everyone on the team.
1. Once the lab is published, Azure Lab Services automatically assigns a VM to each person on the team membership list upon their first sign into Azure Lab Services.
1. Team members access the lab by using the **Azure Lab Services** Teams app, or by accessing the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com). Team members can then use the VM to do the class work and homework.

> [!IMPORTANT]
> Azure Lab Services can be used within Teams only if the lab plans are created in the same tenant as Teams.

## Add Azure Lab Services app as a tab to a Team

You, as a Team owner, can add **Azure Lab Services** app directly in your Teams channels, and then the app is available for everyone in the team to use. Follow the below three steps:

1. Navigate to the Teams channel where you want to add the app and select **+** to add a tab.
1. Search for **Azure Lab Services** from the tab options and add this app.

    > [!NOTE]
    > Only Team **Owners** will be able to create labs for the team.

    :::image type="content" source="./media/integrate-with-teams/add.png" alt-text="Screenshot of Add a tab in teams.":::
1. Select a resource group, containing one or more lab plans, that you would like to use for creating labs in this team.

    Azure Lab Services uses single sign-on into the Lab Services web portal ([https://labs.azure.com](https://labs.azure.com)) and pulls all the lab plans that you have access to.  The resource groups with lab plans that are in the same tenant as Teams and for which you have **Owner**, **Contributor**, or **Creator** access are displayed.

    :::image type="content" source="./media/integrate-with-teams/welcome.png" alt-text="Screenshot of Welcome to Azure Lab Services dialog.":::
1. Press **Save**. The Azure Lab Services tab is added to the channel.

    :::image type="content" source="./media/integrate-with-teams/created.png" alt-text="Screenshot of Azure Lab Service home screen.  The Azure Lab Services tab is highlighted.":::

    Now you can select the **Azure Lab Services** tab from your channel and start managing labs as described in the following articles.

After the lab plan is selected, Team owners can create labs for the team. The entire lab creation process and all the tasks at the lab level can be performed within Teams. Educators can [create multiple labs](tutorial-setup-lab.md) within Teams at the same team.  The Team owner, with appropriate access at the lab plan level, will see only the labs associated with the specific team.

## Next steps

When a lab is created within Teams, the lab user list is automatically synced with the team membership. Everyone on the team, including owners, members, and guests will be automatically added to the lab user list. Azure lab Services will maintain a sync with the team membership.  An automatic sync is triggered every 24 hours. For more information, see [Manage Lab Services user lists within Teams](how-to-manage-user-lists-within-teams.md)

### See also

Also see the following articles:

- As an educator, [manage the VM pool within Teams](how-to-manage-vm-pool-within-teams.md).
- As an educator, [create and manage schedules within Teams](how-to-create-schedules-within-teams.md).
- As an educator, [manage lab user lists from Teams](how-to-manage-user-lists-within-teams.md).
- As an admin or educator, [delete labs within Teams](how-to-delete-lab-within-teams.md)
- As student, [access a VM within Teams](how-to-access-vm-for-students-within-teams.md)
