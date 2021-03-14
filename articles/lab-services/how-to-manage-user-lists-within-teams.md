---
title: Manage Azure Lab Services user lists from Teams
description: Learn how to manage Azure Lab Services user lists from Teams. 
ms.topic: article
ms.date: 10/07/2020
---

# Manage Lab Services user lists from Teams

When a lab is created within Teams (see [Get started and create a Lab Services lab from Teams](how-to-get-started-create-lab-within-teams.md)), the lab user list is automatically populated and synced with the team membership. Everyone on the team, including Owners, Members, and Guests will be automatically added to the lab user list. Azure lab Services maintains a sync with the team membership and an automatic sync is triggered every 24 hours. 

## Sync users

Educators can use the **Sync** button to trigger a manual sync once the team membership is updated. 

> [!div class="mx-imgBorder"]
> :::image type="content" source="./media/how-to-manage-users-with-teams/sync-users.png" alt-text="Sync users":::

Once the automatic or manual sync is complete the following is true depending on whether the lab has been published.

* If the lab has not been published at least once:
    * Users will be added or deleted from the lab user list as per changes to the team membership. 
* If the lab has been published at least once, in addition to adding or deleting users, the lab capacity will be automatically updated.
    * If there are any new additions to the team, new VMs will be created.
    * If any user has been deleted from the team, the associated VM will be deleted as well.

## Next steps

Once the template VM is configured and when the educator selects to publish the template, number of VMs equivalent to the number of users in the lab’s user list will be created. Once the lab is published and VMs are created, Users will be automatically registered to the lab and VMs will be assigned to them on their first login to Azure Lab Services that is, when they first access the tab having **Azure Lab Services** App. 

To publish the template VM, go to the Teams Lab Services window, select **Template** tab -> **...** -> **Publish**.

To manage VM pools, see [Manage a VM pool in Lab Services from Teams](how-to-manage-vm-pool-within-teams.md).

### Also review

See the following articles:

- [Use Azure Lab Services within Teams overview](lab-services-within-teams-overview.md)
- [Get started and create a Lab Services lab from Teams](how-to-get-started-create-lab-within-teams.md)
- [Create Lab Services schedules from Teams](how-to-create-schedules-within-teams.md)
- [Access a VM (student view) in Lab Services from Teams](how-to-access-vm-for-students-within-teams.md)

