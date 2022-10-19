---
title: Get started and create an Azure Lab Services lab within Teams
description: Learn how to get started and create an Azure Lab Services lab within Teams. 
ms.topic: how-to
ms.date: 02/05/2022
---

# Get started and create a Lab Services lab within Teams

This article shows how to add the **Azure Lab Services** app to a Team and then how to create a lab within MS Teams environment.

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

## Prerequisites

In this tutorial, you set up a lab with virtual machines for your team. To set up a lab, you must be an Owner, Lab Creator, or Contributor on the lab plan. The user account that you used to create a lab plan can create a lab.

Here's the typical workflow when using Azure Lab Services within Teams

1. Create a lab plan in the Azure portal.  For information, see [Tutorial: Set up a lab plan with Azure Lab Services](tutorial-setup-lab-plan.md).
1. The lab plan owner [adds educators to the Lab Creator role](tutorial-setup-lab-plan.md#add-a-user-to-the-lab-creator-role) so they can create labs for their classes.
1. Then, the educators create labs, pre-configures the template VM and publishes the lab to create VMs to everyone on the team.
1. Once the lab is published, a VM is assigned to everyone on the team membership list on their first sign into Azure Lab Services. Team members select on the tab containing **Azure Lab Services** App within Teams or by accessing the Lab Services web portal: [https://labs.azure.com](https://labs.azure.com). Team members can then use the VM to do the class work and homework.

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
