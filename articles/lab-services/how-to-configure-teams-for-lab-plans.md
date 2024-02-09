---
title: Configure Teams to use Azure Lab Services
description: Learn how to configure Microsoft Teams to use Azure Lab Services.
ms.topic: how-to
ms.date: 11/15/2022
author: ntrogh
ms.author: nicktrog
ms.custom: engagement-fy23
---

# Configure Microsoft Teams to use Azure Lab Services

In this article, you learn how to configure Microsoft Teams to use Azure Lab Services. Add the Azure Lab Services Teams app to a team channel to let educators and students access to their labs directly without navigating to the Azure Lab Services portal. Learn more about the [benefits of using Azure Lab Services within Teams](./lab-services-within-teams-overview.md).

For information about creating and managing labs in Microsoft Teams, see [Create and manage labs in Microsoft Teams](./how-to-manage-labs-within-teams.md).

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

[!INCLUDE [Existing lab plan](./includes/lab-services-prerequisite-lab-plan.md)]

- The lab plan is created in the same tenant as Microsoft Teams.
- To add the Azure Lab Services Teams app to a channel, your account needs to be an owner of the team in Microsoft Teams.
- To add a lab plan to Teams, your account should have the [Owner](./concept-lab-services-role-based-access-control.md#owner-role), [Lab Creator](./concept-lab-services-role-based-access-control.md#lab-creator-role), or [Contributor](./concept-lab-services-role-based-access-control.md#contributor-role) role on the lab plan. Learn more about [Azure Lab Services built-in roles](./concept-lab-services-role-based-access-control.md).

## User workflow 

The typical workflow when using Azure Lab Services within Teams is:

1. The admin [creates a lab plan in the Azure portal](./quick-create-resources.md).
1. The admin [adds educators to the Lab Creator role in the Azure portal](quick-create-resources.md#add-a-user-to-the-lab-creator-role), so they can create labs for their classes.
1. Educators create labs in Teams, pre-configure the template VM, and publish the lab to create VMs for everyone on the team.
1. Azure Lab Services automatically assigns a VM to each person on the team membership list upon their first sign into Azure Lab Services.
1. Team members access the lab by using the Azure Lab Services Teams app, or by accessing the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com). Team members can then use the VM to do the class work and homework.

> [!IMPORTANT]
> Azure Lab Services can be used within Teams only if the lab plans are created in the same tenant as Teams.

## Add the Azure Lab Services Teams app to a channel

You can add the Azure Lab Services Teams app in your Teams channels. The app is then available as a tab for everyone that has access to the channel. To add the Azure Lab Services Teams app, your account needs to be an owner of the team in Microsoft Teams.

To add the Azure Lab Services Teams app to a channel:

1. Navigate to the Teams channel where you want to add Azure Lab Services. 

1. In the list of tabs at the top, select **+** to add a new tab.

1. Enter *Azure Lab Services* in the search box, and then select the **Azure Lab Services** icon to add the app.

    :::image type="content" source="./media/integrate-with-teams/add.png" alt-text="Screenshot that shows the dialog for adding apps in Teams, highlighting the Azure Lab Services app.":::

    > [!NOTE]
    > Only team owners can add the Azure Lab Services app to the channel.

1. Select the resource group, which contains the lab plan that you want manage from within this team.

    Azure Lab Services uses single sign-on into the Azure Lab Services web portal (https://labs.azure.com) and lists all the lab plans that you have access to and which are in the same tenant as Teams.

    The dropdown lists all the resource groups that contain lab plans and for which you have the Owner, Contributor, or Lab Creator role.

    :::image type="content" source="./media/integrate-with-teams/welcome.png" alt-text="Screenshot that shows the Azure Lab Services dialog for selecting the resource group for your lab plan.":::

1. Select **Save** to add the Azure Lab Services tab to the channel. You can now select the **Azure Lab Services** tab from your channel.

    :::image type="content" source="./media/integrate-with-teams/created.png" alt-text="Screenshot that shows the Azure Lab Service home screen in Microsoft Teams, highlighting the Azure Lab Services tab.":::

When you create a lab within Teams, Azure Lab Services automatically adds everyone on the team, including owners, members, and guests, to the lab user list. Learn more about [managing user lists within Teams](./how-to-manage-labs-within-teams.md#manage-lab-user-lists-in-teams).

Educators can now [create and manage labs from within the team channel](./how-to-manage-labs-within-teams.md). The team owner, with appropriate access at the lab plan level, will see only the labs that are associated with the team.

> [!IMPORTANT]
> Labs must be created using the Azure Lab Services app in Teams.  Labs created from the Azure Lab Services portal aren't visible from Teams.

## Next steps

- As an admin, [add educators as lab creators to the lab plan](./add-lab-creator.md) in the Azure portal.
- As an educator, [create and manage labs in Microsoft Teams](./how-to-manage-labs-within-teams.md).
- As an eductor, [manage user lists in Microsoft Teams](./how-to-manage-labs-within-teams.md#manage-lab-user-lists-in-teams).
- As a student, [access a lab VM within Teams](./how-to-access-vm-for-students-within-teams.md).
